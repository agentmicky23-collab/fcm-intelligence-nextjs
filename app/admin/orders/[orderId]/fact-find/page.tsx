import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FactFindForm } from "@/components/FactFindForm";
import { isAdmin } from "@/lib/server/admin";
import { factFindLink, getFactFind, publishableKey, storageBase } from "@/lib/server/fact-find";

export const dynamic = "force-dynamic";

export default async function AdminFactFind({ params, searchParams }: { params: Promise<{ orderId: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await isAdmin())) redirect("/admin");
  const { orderId } = await params;
  const q = await searchParams;
  const ff = await getFactFind(orderId);
  if (!ff) notFound();
  const email = ff.data.client?.email || ff.order.customer_email;
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 sm:px-8">
      <header className="flex flex-wrap items-center gap-4 border-b border-white/10 py-5">
        <Link href={`/admin/orders/${orderId}`} className="text-sm text-white/60 hover:text-white">← {ff.order.business_name ?? orderId}</Link>
      </header>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-white/45">{orderId} · fact find</p>
          <h1 className="mt-1 font-display text-3xl font-bold">{ff.order.business_name}</h1>
          <p className="mt-1 text-sm text-white/60">
            {ff.status === "submitted" ? `Submitted by ${ff.submitted_by === "mik" ? "you" : "the client"}` : ff.status === "sent" ? "Emailed to the client, not submitted yet" : "Not sent yet"}
          </p>
        </div>
        <div className="max-w-sm rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <p className="font-semibold">Fill it in on the call, or send it</p>
          <form action={`/api/admin/fact-find/${orderId}/send`} method="post" className="mt-3">
            <button disabled={!email} className="w-full bg-red px-4 py-2.5 text-sm font-semibold hover:bg-red-dark disabled:opacity-40">
              {ff.sent_at ? "Email it to the client again" : "Email it to the client"}
            </button>
          </form>
          <p className="mt-2 text-xs text-white/50">{email ? `Goes to ${email}.` : "Add the client's email in the form first."}</p>
          {q.sent && <p className="mt-2 text-xs text-emerald-300">Sent.</p>}
          {q.failed && <p className="mt-2 text-xs text-red-light">The email didn&apos;t send. Try again.</p>}
          {q.noemail && <p className="mt-2 text-xs text-red-light">No email address for the client yet.</p>}
          <details className="mt-3 text-xs text-white/50">
            <summary className="cursor-pointer">Or copy their private link</summary>
            <p className="mt-2 break-all select-all rounded bg-black/30 p-2 font-mono text-[11px] text-white/80">{factFindLink(orderId)}</p>
          </details>
        </div>
      </div>
      <div className="mt-8">
        <FactFindForm orderId={orderId} token={null} mode="mik" dark initial={{ data: ff.data, files: ff.files, status: ff.status }} requested={['needs_info'].includes(ff.order.status) ? ff.requested ?? [] : []} upload={{ base: storageBase(), key: ff.upload_key, apikey: publishableKey() }} />
      </div>
    </div>
  );
}
