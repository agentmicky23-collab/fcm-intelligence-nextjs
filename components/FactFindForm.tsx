"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { completeness, documentKinds, factFindSections, sources, type FactFindData, type FactFindFile } from "@/lib/fact-find";

type Props = {
  orderId: string;
  token: string | null; // the client's link token; null when Mik is signed in
  mode: "mik" | "client";
  initial: { data: FactFindData; files: FactFindFile[]; status: string };
  requested?: { label: string; why?: string }[];
  upload: { base: string; key: string; apikey: string };
  dark?: boolean;
};

const slug = (s: string) => s.normalize("NFKD").replace(/[^\w.-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(-80) || "file";
const size = (n: number) => (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`);

export function FactFindForm({ orderId, token, mode, initial, upload, dark = false, requested: asked = [] }: Props) {
  const router = useRouter();
  const [data, setData] = useState<FactFindData>(initial.data ?? {});
  const [files, setFiles] = useState<FactFindFile[]>(initial.files ?? []);
  const [status, setStatus] = useState(initial.status);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [kind, setKind] = useState("");
  const [uploading, setUploading] = useState<string[]>([]);
  const [problem, setProblem] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [sent, setSent] = useState(false);
  const [editing, setEditing] = useState(false);
  // Once sent, the list of what was asked for has been answered.
  const requested = sent ? [] : asked;
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const done = completeness(data, files);
  const locked = mode === "client" && status === "submitted" && !requested.length;
  // Mik sees a submitted fact find read-only, with an Edit button, so it can't be changed by accident.
  const readOnly = mode === "mik" && status === "submitted" && !requested.length && !editing;

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch(`/api/fact-find/${encodeURIComponent(orderId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, t: token ?? undefined }),
    });
    return res.json().catch(() => ({ ok: false }));
  };

  // Save a moment after typing stops.
  useEffect(() => {
    if (!dirty.current || locked) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaved("saving");
      const r = await post({ action: "save", data });
      setSaved(r.ok ? "saved" : "error");
      dirty.current = false;
    }, 1200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const set = (section: string, key: string, value: string) => {
    dirty.current = true;
    setData((d) => ({ ...d, [section]: { ...(d[section] ?? {}), [key]: value } }));
  };

  async function addFiles(list: FileList | null) {
    if (!list?.length) return;
    setProblem("");
    for (const file of Array.from(list)) {
      if (file.size > 50 * 1024 * 1024) {
        setProblem(`${file.name} is over 50 MB. Please send a smaller copy.`);
        continue;
      }
      const name = `${Date.now()}-${slug(file.name)}`;
      setUploading((u) => [...u, file.name]);
      try {
        const res = await fetch(`${upload.base}/fact-finds/${encodeURIComponent(orderId)}/${upload.key}/${encodeURIComponent(name)}`, {
          method: "POST",
          headers: { apikey: upload.apikey, "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
          body: file,
        });
        if (!res.ok) throw new Error(String(res.status));
        const r = await post({ action: "add-file", file: { name, size: file.size, type: file.type, kind } });
        if (r.ok) setFiles(r.files);
        else throw new Error("record");
      } catch {
        setProblem(`${file.name} didn't upload. Please try again.`);
      } finally {
        setUploading((u) => u.filter((x) => x !== file.name));
      }
    }
  }

  async function removeFile(name: string) {
    const r = await post({ action: "remove-file", name });
    if (r.ok) setFiles(r.files);
  }

  async function submit() {
    setSaved("saving");
    const r = await post({ action: "submit", data });
    if (r.ok) {
      setStatus("submitted");
      setSent(true);
      setEditing(false);
      setSaved("saved");
      setConfirming(false);
      if (mode === "mik") {
        router.push("/admin");
        router.refresh();
      } else window.scrollTo({ top: 0, behavior: "smooth" });
    } else setSaved("error");
  }

  const t = useMemo(
    () =>
      dark
        ? {
            card: "border-white/10 bg-white/[0.03]",
            input: "border-white/15 bg-[#06173a]/60 text-white placeholder:text-white/30 focus:border-white/40",
            label: "text-white/80",
            muted: "text-white/50",
            heading: "text-white",
          }
        : {
            card: "border-line bg-white",
            input: "border-line bg-white text-ink placeholder:text-muted/60 focus:border-navy",
            label: "text-navy",
            muted: "text-muted",
            heading: "text-navy",
          },
    [dark],
  );

  if (locked)
    return (
      <div className={`rounded-xl border p-8 text-center ${t.card}`}>
        <p className={`font-display text-2xl font-bold ${t.heading}`}>Thank you. That&apos;s with us.</p>
        <p className={`mx-auto mt-3 max-w-lg ${t.muted}`}>
          Your report is now in the queue. If you get more information from the seller or broker, just reply to the email we sent you and we&apos;ll add it.
        </p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className={`sticky top-0 z-20 -mx-1 flex flex-wrap items-center gap-4 rounded-xl border px-4 py-3 backdrop-blur ${dark ? "border-white/10 bg-[#020816]/90" : "border-line bg-white/95"}`}>
        <div className="min-w-[160px] flex-1">
          <div className={`flex justify-between text-xs ${t.muted}`}>
            <span>{done.answered} of {done.total} answered{files.length ? ` · ${files.length} document${files.length === 1 ? "" : "s"}` : ""}</span>
            <span>{saved === "saving" ? "Saving…" : saved === "saved" ? "Saved" : saved === "error" ? "Not saved, check your connection" : ""}</span>
          </div>
          <div className={`mt-1.5 h-1.5 overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-light"}`}>
            <div className="h-full rounded-full bg-red transition-all" style={{ width: `${Math.round((done.answered / done.total) * 100)}%` }} />
          </div>
        </div>
        {readOnly ? (
          <span className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-500">Submitted: report queued</span>
            <button type="button" onClick={() => setEditing(true)} className={`border px-4 py-2 text-xs ${dark ? "border-white/20 text-white hover:bg-white/10" : "border-line text-navy"}`}>Edit</button>
            <Link href={`/admin/orders/${encodeURIComponent(orderId)}`} className="bg-red px-4 py-2 text-xs font-semibold text-white hover:bg-red-dark">Back to the order</Link>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="bg-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark">
            {mode === "mik" ? "Done: start the report" : "Send it to us"}
          </button>
        )}
      </div>

      {requested.length > 0 && (
        <div className={`rounded-xl border-2 border-red/50 p-5 ${dark ? "bg-red/10" : "bg-red/5"}`}>
          <p className={`font-display text-lg font-bold ${t.heading}`}>Still needed to finish the report</p>
          <ul className={`mt-2 list-disc space-y-1 pl-5 text-sm ${t.label}`}>
            {requested.map((r, i) => <li key={i}>{r.label}{r.why ? <span className={t.muted}> ({r.why})</span> : null}</li>)}
          </ul>
          <p className={`mt-2 text-xs ${t.muted}`}>Add them below (or upload the documents), then press {mode === "mik" ? "Done" : "Send it to us"}.</p>
        </div>
      )}

      {confirming && (
        <div className={`rounded-xl border-2 border-red/50 p-5 ${dark ? "bg-red/10" : "bg-red/5"}`}>
          {done.missing.length ? (
            <>
              <p className={`font-semibold ${t.heading}`}>Still missing: {done.missing.join(", ")}.</p>
              <p className={`mt-1 text-sm ${t.muted}`}>That&apos;s fine if you don&apos;t have them. The report won&apos;t guess: it will say what&apos;s still needed.</p>
            </>
          ) : (
            <p className={`font-semibold ${t.heading}`}>Everything we need is here.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={submit} disabled={saved === "saving"} className="bg-red disabled:opacity-60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-dark">
              {saved === "saving" ? "Sending…" : mode === "mik" ? (status === "submitted" ? "Save and requeue" : "Start the report") : "Send it"}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={`border px-5 py-2.5 text-sm ${dark ? "border-white/20 text-white" : "border-line text-navy"}`}>
              Keep editing
            </button>
          </div>
        </div>
      )}

      {factFindSections.map((s) => (
        <fieldset key={s.key} disabled={readOnly} className={`rounded-xl border p-5 sm:p-6 ${t.card} ${readOnly ? "opacity-80" : ""}`}>
          <legend className="sr-only">{s.title}</legend>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className={`font-display text-lg font-bold ${t.heading}`}>{s.title}</p>
              <p className={`text-sm ${t.muted}`}>{s.intro}</p>
            </div>
            {s.source && (
              <label className={`text-xs ${t.muted}`}>
                Where did these come from?{" "}
                <select value={data[s.key]?.source ?? ""} onChange={(e) => set(s.key, "source", e.target.value)} className={`ml-1 rounded-md border px-2 py-1 text-xs ${t.input}`}>
                  <option value="">Choose…</option>
                  {sources.map((o) => <option key={o}>{o}</option>)}
                </select>
              </label>
            )}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {s.fields.map((f) => {
              const value = data[s.key]?.[f.key] ?? "";
              const id = `${s.key}-${f.key}`;
              const base = `w-full rounded-md border px-3 py-2.5 text-[15px] outline-none ${t.input}`;
              return (
                <div key={f.key} className={f.half ? "" : "sm:col-span-2"}>
                  <label htmlFor={id} className={`block text-sm font-medium ${t.label}`}>{f.label}</label>
                  <div className="relative mt-1.5">
                    {f.type === "textarea" ? (
                      <textarea id={id} rows={3} value={value} onChange={(e) => set(s.key, f.key, e.target.value)} className={base} />
                    ) : f.type === "select" ? (
                      <select id={id} value={value} onChange={(e) => set(s.key, f.key, e.target.value)} className={base}>
                        <option value="">Choose…</option>
                        {f.options?.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <>
                        {f.type === "money" && <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${t.muted}`}>£</span>}
                        <input
                          id={id}
                          value={value}
                          onChange={(e) => set(s.key, f.key, e.target.value)}
                          inputMode={f.type === "money" || f.type === "number" || f.type === "percent" ? "decimal" : undefined}
                          type={f.type === "email" ? "email" : f.type === "tel" ? "tel" : f.type === "url" ? "url" : "text"}
                          className={`${base} ${f.type === "money" ? "pl-7" : ""}`}
                        />
                        {f.type === "percent" && <span className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${t.muted}`}>%</span>}
                      </>
                    )}
                  </div>
                  {f.hint && <p className={`mt-1 text-xs ${t.muted}`}>{f.hint}</p>}
                </div>
              );
            })}
          </div>
        </fieldset>
      ))}

      <fieldset disabled={readOnly} className={`rounded-xl border p-5 sm:p-6 ${t.card}`}>
        <p className={`font-display text-lg font-bold ${t.heading}`}>Documents</p>
        <p className={`text-sm ${t.muted}`}>Anything the seller or broker gave you: accounts, Post Office statements, the lease, the sales pack, photos. PDFs, photos and spreadsheets are all fine (up to 50 MB each).</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select value={kind} onChange={(e) => setKind(e.target.value)} className={`rounded-md border px-3 py-2.5 text-sm ${t.input}`}>
            <option value="">What is it? Choose first</option>
            {documentKinds.map((k) => <option key={k}>{k}</option>)}
          </select>
          <label title={kind ? undefined : "Choose what the document is first"} className={`bg-navy ${readOnly || !kind ? "pointer-events-none opacity-50" : "cursor-pointer"} px-5 py-2.5 text-sm font-semibold text-white hover:bg-red`}>
            Choose files
            <input type="file" multiple disabled={!kind} className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
          </label>
        </div>
        {problem && <p className="mt-3 text-sm text-red">{problem}</p>}
        {(files.length > 0 || uploading.length > 0) && (
          <ul className={`mt-4 divide-y rounded-lg border text-sm ${dark ? "divide-white/10 border-white/10" : "divide-line border-line"}`}>
            {uploading.map((n) => (
              <li key={`u-${n}`} className={`px-4 py-3 ${t.muted}`}>Uploading {n}…</li>
            ))}
            {files.map((f) => (
              <li key={f.name} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <span>
                  <a href={`/api/fact-find/${encodeURIComponent(orderId)}/file?name=${encodeURIComponent(f.name)}${token ? `&t=${token}` : ""}`} target="_blank" rel="noopener noreferrer" className={`font-medium underline-offset-2 hover:underline ${t.heading}`}>
                    {f.name.replace(/^\d+-/, "")}
                  </a>
                  <span className={`ml-2 text-xs ${t.muted}`}>{f.kind} · {size(f.size)}{mode === "mik" ? ` · from ${f.by === "mik" ? "you" : "the client"}` : ""}</span>
                </span>
                <button type="button" onClick={() => removeFile(f.name)} className={`text-xs ${t.muted} hover:text-red`}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
    </div>
  );
}
