"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { calculateGaps, policyStart, questions, renewalOptions, sections, type Answers, type Gap } from "@/lib/insurance-review";
import { site } from "@/lib/site";

type Stage = "intro" | "survey" | "policy-check" | "results";
const STORE = "fcm-insurance-review";
const ease = [0.22, 1, 0.36, 1] as const;

const levels = [
  { key: "critical", label: "Critical", tone: "bg-red", text: "text-red-dark" },
  { key: "important", label: "Important", tone: "bg-navy", text: "text-navy" },
  { key: "worthReviewing", label: "Worth reviewing", tone: "bg-navy/40", text: "text-navy" },
  { key: "ok", label: "Looks right", tone: "bg-navy/15", text: "text-muted" },
] as const;

/** The 17-question policy review, its results, and the enquiry that follows. */
export function InsuranceReview() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  // Keep progress on this device, so someone can fetch their schedule and come back.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring saved progress once on mount
      if (saved?.answers) { setAnswers(saved.answers); setIndex(saved.index ?? 0); }
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ answers, index })); } catch {}
  }, [answers, index]);

  const q = questions[index];
  const answered = Object.keys(answers).length;

  function choose(value: string) {
    setAnswers((a) => ({ ...a, [q.storageKey]: value }));
    if (index === policyStart - 1) setStage("policy-check");
    else if (index < questions.length - 1) setIndex(index + 1);
    else setStage("results");
  }

  function back() {
    if (stage === "policy-check") { setStage("survey"); setIndex(policyStart - 1); }
    else if (stage === "results") { setStage("survey"); setIndex(questions.length - 1); }
    else if (index > 0) setIndex(index - 1);
  }

  function restart() {
    setAnswers({}); setIndex(0); setStage("survey");
  }

  return (
    <div className="border border-line bg-white">
      {stage !== "intro" && stage !== "results" && <Progress index={stage === "policy-check" ? policyStart - 0.5 : index} />}
      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div key={`${stage}-${index}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3, ease }}>
            {stage === "intro" && (
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-muted">17 questions · about 7 minutes</p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-navy sm:text-3xl">Check your policy against what a Post Office actually carries.</h2>
                <p className="mt-4 leading-relaxed text-muted">
                  These are the questions I put to my own policy. Have your policy schedule in front of you. At the end you&apos;ll
                  see where your cover holds up and where it doesn&apos;t, and you can ask me to review it properly.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <button type="button" onClick={() => setStage("survey")} className="bg-red px-7 py-4 text-[15px] font-semibold text-white hover:bg-red-dark">
                    {answered > 0 ? "Carry on where you left off →" : "Start the review →"}
                  </button>
                  {answered > 0 && <button type="button" onClick={restart} className="text-sm font-medium text-muted hover:text-navy">Start again</button>}
                </div>
              </div>
            )}

            {stage === "survey" && (
              <fieldset>
                <legend className="w-full">
                  <span className="text-sm text-muted">Question {index + 1} of {questions.length} · {q.sectionLabel}</span>
                  <span className="mt-3 block font-display text-2xl font-bold leading-snug tracking-[-0.02em] text-navy sm:text-[28px]">{q.question}</span>
                </legend>
                {q.subtext && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{q.subtext}</p>}
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {q.options.map((o) => {
                    const on = answers[q.storageKey] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => choose(o.value)}
                        className={`group flex items-center gap-4 border p-4 text-left text-[15px] transition-colors ${on ? "border-navy bg-navy text-white" : "border-line hover:border-navy"}`}
                      >
                        <span className={`h-4 w-2.5 shrink-0 -skew-x-[18deg] ${on ? "bg-red" : "bg-navy/15 group-hover:bg-red"}`} aria-hidden />
                        {o.label}
                      </button>
                    );
                  })}
                </div>
                {index > 0 && <button type="button" onClick={back} className="mt-8 text-sm font-medium text-muted hover:text-navy">← Back</button>}
              </fieldset>
            )}

            {stage === "policy-check" && (
              <div className="max-w-2xl">
                <p className="text-sm text-muted">Before we continue</p>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-navy sm:text-[28px]">Do you have your policy schedule to hand?</h2>
                <p className="mt-4 leading-relaxed text-muted">
                  The next nine questions ask for figures from your actual policy. Answers based on guesses won&apos;t give you a useful review.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={() => { setStage("survey"); setIndex(policyStart); }} className="bg-red px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-red-dark">Yes, let&apos;s continue</button>
                  <button type="button" onClick={() => setStage("intro")} className="border border-navy/25 px-6 py-3.5 text-[15px] font-semibold text-navy hover:border-navy">I&apos;ll come back with it</button>
                </div>
                <p className="mt-4 text-sm text-muted">Your answers so far are saved on this device.</p>
                <button type="button" onClick={back} className="mt-8 text-sm font-medium text-muted hover:text-navy">← Back</button>
              </div>
            )}

            {stage === "results" && <Results answers={answers} onBack={back} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Progress({ index }: { index: number }) {
  const current = questions[Math.min(Math.floor(index), questions.length - 1)].section;
  return (
    <div className="grid grid-cols-4 gap-px border-b border-line bg-line">
      {sections.map((label, i) => {
        const inSection = questions.filter((x) => x.section === i + 1);
        const first = questions.indexOf(inSection[0]);
        const done = Math.min(1, Math.max(0, (index + 1 - first) / inSection.length));
        return (
          <div key={label} className="bg-white px-3 pb-3 pt-3 sm:px-5">
            <p className={`truncate text-xs font-medium ${current === i + 1 ? "text-navy" : "text-muted"}`}>{label}</p>
            <div className="mt-2 h-1 bg-navy/10">
              <motion.div className="h-full origin-left bg-red" animate={{ scaleX: done }} transition={{ duration: 0.4, ease }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Results({ answers, onBack }: { answers: Answers; onBack: () => void }) {
  const gaps = calculateGaps(answers);
  const issues = gaps.critical.length + gaps.important.length + gaps.worthReviewing.length;
  const total = issues + gaps.ok.length || 1;

  return (
    <div>
      <p className="text-sm text-muted">Your results</p>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-navy sm:text-[32px]">
        {issues === 0 ? "No gaps found in your answers." : `${issues} ${issues === 1 ? "area needs" : "areas need"} a closer look.`}
      </h2>

      <div className="mt-8 flex h-4 w-full" role="img" aria-label={levels.map((l) => `${gaps[l.key].length} ${l.label}`).join(", ")}>
        {levels.map((l, i) => gaps[l.key].length > 0 && (
          <motion.div key={l.key} className={`h-full origin-left ${l.tone}`} style={{ width: `${(gaps[l.key].length / total) * 100}%` }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, ease, delay: 0.2 + i * 0.2 }} />
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {levels.map((l) => (
          <li key={l.key} className="flex items-center gap-2"><span className={`h-2.5 w-2.5 ${l.tone}`} /><span className="font-semibold text-navy">{gaps[l.key].length}</span> {l.label}</li>
        ))}
      </ul>

      <div className="mt-10 space-y-8">
        {levels.map((l) => gaps[l.key].length > 0 && (
          <div key={l.key}>
            <h3 className={`font-display text-lg font-semibold ${l.text}`}>{l.label}</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {gaps[l.key].map((g: Gap) => (
                <div key={g.title} className="relative border border-line bg-light/50 p-5 pl-6">
                  <span className={`absolute inset-y-0 left-0 w-1 ${l.tone}`} aria-hidden />
                  <p className="font-semibold text-navy">{g.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{g.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted">This is a guide based on your answers, not insurance advice. Check any gap with your insurer or broker.</p>
      <button type="button" onClick={onBack} className="mt-4 text-sm font-medium text-muted hover:text-navy">← Change my answers</button>

      <Enquiry answers={answers} gaps={gaps} />
    </div>
  );
}

function Enquiry({ answers, gaps }: { answers: Answers; gaps: ReturnType<typeof calculateGaps> }) {
  const field = "mt-2 block w-full border border-line bg-white px-4 py-3 text-ink focus:border-red focus:outline-none focus:ring-2 focus:ring-red/30";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const renewal = renewalOptions.find((r) => r.value === d.get("renewal"))?.label ?? "-";
    const lines = [
      `Name: ${d.get("name")}`,
      `Email: ${d.get("email")}`,
      `Phone: ${d.get("phone") || "-"}`,
      `Branch: ${d.get("branch") || "-"}`,
      `FAD code: ${d.get("fad") || "-"}`,
      `Policy renewal: ${renewal}`,
      "",
      String(d.get("message") || ""),
      "",
      "GAPS FOUND",
      ...levels.flatMap((l) => gaps[l.key].map((g) => `[${l.label}] ${g.title}`)),
      "",
      "ANSWERS",
      ...questions.map((q) => `${q.id}. ${q.question}\n   ${q.options.find((o) => o.value === answers[q.storageKey])?.label ?? "-"}`),
    ];
    window.location.assign(`mailto:${site.contactEmail}?subject=${encodeURIComponent("Insurance Review enquiry")}&body=${encodeURIComponent(lines.join("\n"))}`);
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 bg-night p-6 text-white sm:p-10">
      <h3 className="font-display text-2xl font-bold tracking-[-0.02em]">Want me to review your policy properly?</h3>
      <p className="mt-3 max-w-2xl leading-relaxed text-white/70">
        Send your details and I&apos;ll look at your cover with these answers in front of me. Your answers and the gaps above are included automatically.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 [&_label]:text-sm [&_label]:font-medium">
        <label>Name<input name="name" required autoComplete="name" className={field} /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" className={field} /></label>
        <label>Phone <span className="font-normal text-white/50">(optional)</span><input name="phone" type="tel" autoComplete="tel" className={field} /></label>
        <label>Branch name <span className="font-normal text-white/50">(optional)</span><input name="branch" className={field} /></label>
        <label>FAD code <span className="font-normal text-white/50">(optional)</span><input name="fad" className={field} /></label>
        <label>When does your policy renew?
          <select name="renewal" required defaultValue="" className={field}>
            <option value="" disabled>Select…</option>
            {renewalOptions.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </label>
        <label className="sm:col-span-2">Anything else I should know? <span className="font-normal text-white/50">(optional)</span><textarea name="message" rows={3} className={field} /></label>
      </div>
      <button type="submit" className="mt-8 bg-red px-7 py-4 text-[15px] font-semibold text-white hover:bg-red-dark">Send my enquiry</button>
      <p className="mt-3 text-xs text-white/50">This opens your email app with everything filled in, ready to send.</p>
    </form>
  );
}
