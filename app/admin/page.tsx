import Link from "next/link";
import { adminEnabled, adminEvents, adminOrders, isAdmin, requestTime } from "@/lib/server/admin";
import { reportPath } from "@/lib/server/reports";
import { isActive, minutesSince, since, STALL_MINUTES } from "@/lib/pipeline-view";
import { AutoRefresh } from "./_ui/AutoRefresh";
import { Floor } from "./_ui/Floor";
import { Feed, OrderRow } from "./_ui/Parts";

export const dynamic = "force-dynamic";

function Shell({ children, signedIn }: { children: React.ReactNode; signedIn?: boolean }) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-8">
      <header className="flex flex-wrap items-center gap-4 border-b border-white/10 py-5">
        <span className="flex h-10 w-10 items-center justify-center bg-red font-display text-lg font-extrabold">F</span>
        <div className="flex-1">
          <p className="font-display text-xl font-bold leading-tight">Control room</p>
          <p className="text-xs text-white/50">FCM Intelligence report pipeline</p>
        </div>
        {signedIn && (
          <>
            <AutoRefresh />
            <form action="/api/admin/signout" method="post">
              <button className="rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10">Sign out</button>
            </form>
          </>
        )}
      </header>
      {children}
    </div>
  );
}

function SignIn({ sent, expired }: { sent: boolean; expired: boolean }) {
  return (
    <Shell>
      <div className="mx-auto mt-24 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="font-display text-2xl font-bold">Sign in</p>
        {sent ? (
          <p className="mt-4 text-sm text-white/70">Check your email. The sign-in link works for 20 minutes.</p>
        ) : (
          <>
            <p className="mt-3 text-sm text-white/60">
              {expired ? "That link has expired. Ask for a new one." : "We'll email a sign-in link to your FCM address."}
            </p>
            <form action="/api/admin/link" method="post" className="mt-6">
              <button className="w-full bg-red px-5 py-3 text-sm font-semibold hover:bg-red-dark">Email me a sign-in link</button>
            </form>
          </>
        )}
      </div>
    </Shell>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  if (!adminEnabled()) return <Shell><p className="mt-20 text-center text-white/60">The control room isn&apos;t set up on this server.</p></Shell>;
  if (!(await isAdmin())) return <SignIn sent={q.sent === "1"} expired={q.expired === "1"} />;

  const [orders, events] = await Promise.all([adminOrders(), adminEvents(undefined, 300)]);
  const now = await requestTime();
  const active = orders.filter((o) => isActive(o.status));
  const waiting = orders.filter((o) => o.status === "awaiting_approval");
  const stopped = orders.filter((o) => o.status === "error");
  const stalled = active.filter((o) => minutesSince(o.updated_at, now) > STALL_MINUTES);
  const month = new Date().toISOString().slice(0, 7);
  const sentThisMonth = orders.filter((o) => o.status === "delivered" && (o.delivered_at ?? o.updated_at).startsWith(month)).length;
  const queued = orders.filter((o) => o.status === "received");
  const identityQuestions = events.filter((e) => e.kind === "waiting" && e.item === "identity" && orders.some((o) => o.id === e.order_id && o.status !== "delivered"));

  const stats = [
    { label: "In progress", value: active.length, note: stalled.length ? `${stalled.length} may have stalled` : "All moving", warn: stalled.length > 0 },
    { label: "Waiting for you", value: waiting.length, note: waiting.length ? "Read and approve" : "Nothing to approve", warn: waiting.length > 0 },
    { label: "Stopped", value: stopped.length, note: stopped.length ? "Need a look" : "No errors", warn: stopped.length > 0 },
    { label: "Queued", value: queued.length, note: "Next run 07:00", warn: false },
    { label: "Sent this month", value: sentThisMonth, note: "Delivered to customers", warn: false },
  ];

  return (
    <Shell signedIn>
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.warn ? "border-red/40 bg-red/10" : "border-white/10 bg-white/[0.03]"}`}>
            <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">{s.label}</p>
            <p className="mt-1 font-display text-3xl font-bold">{s.value}</p>
            <p className={`text-xs ${s.warn ? "text-red-light" : "text-white/45"}`}>{s.note}</p>
          </div>
        ))}
      </section>

      {(waiting.length > 0 || stopped.length > 0 || identityQuestions.length > 0) && (
        <section className="glow mt-6 rounded-2xl border border-red/40 bg-red/[0.07] p-5">
          <p className="font-display text-lg font-bold">Needs you</p>
          <ul className="mt-3 space-y-3 text-sm">
            {identityQuestions.map((e) => (
              <li key={`id-${e.order_id}`} className="flex flex-wrap items-center justify-between gap-3">
                <span><b>{e.order_id}</b>: which premises is it? {e.message}</span>
                <Link href={`/admin/orders/${e.order_id}`} className="text-red-light underline">Details</Link>
              </li>
            ))}
            {waiting.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3">
                <span>
                  <b>{o.business_name}</b> is ready for you{o.overall_grade ? ` (${o.overall_grade}, ${o.overall_verdict})` : ""}, waiting {since(o.updated_at, now)}
                </span>
                <span className="flex gap-2">
                  <a href={reportPath(o.id, "review")} className="bg-red px-4 py-2 text-xs font-semibold hover:bg-red-dark">Read and approve</a>
                  <Link href={`/admin/orders/${o.id}`} className="border border-white/20 px-4 py-2 text-xs hover:bg-white/10">How it was made</Link>
                </span>
              </li>
            ))}
            {stopped.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3">
                <span><b>{o.business_name || o.id}</b> stopped: <span className="text-white/70">{o.error_message ?? "no reason recorded"}</span></span>
                <Link href={`/admin/orders/${o.id}`} className="text-red-light underline">Details</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-bold">The agent floor</h2>
          <p className="text-xs text-white/45">Spinning ring = working · red = stopped or waiting for you</p>
        </div>
        <Floor orders={orders} events={events} now={now} />
      </section>

      <section className="mt-10 grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="mb-4 font-display text-lg font-bold">Orders</h2>
          {orders.length ? (
            <div className="space-y-3">{orders.map((o) => <OrderRow key={o.id} o={o} now={now} />)}</div>
          ) : (
            <p className="text-sm text-white/50">No orders from the website yet.</p>
          )}
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-bold">Live feed</h2>
          <Feed events={events} />
        </div>
      </section>
    </Shell>
  );
}
