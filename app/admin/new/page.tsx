import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/server/admin";

export const dynamic = "force-dynamic";

const field = "mt-1.5 w-full rounded-md border border-white/15 bg-[#06173a]/60 px-3 py-2.5 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-white/40";

function F({ name, label, hint, required, type = "text", placeholder }: { name: string; label: string; hint?: string; required?: boolean; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/80">{label}{required && <span className="text-red-light"> *</span>}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className={field} />
      {hint && <span className="mt-1 block text-xs text-white/45">{hint}</span>}
    </label>
  );
}

export default async function NewReport({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await isAdmin())) redirect("/admin");
  const q = await searchParams;
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 sm:px-8">
      <header className="flex items-center gap-4 border-b border-white/10 py-5">
        <Link href="/admin" className="text-sm text-white/60 hover:text-white">← Control room</Link>
      </header>
      <h1 className="mt-8 font-display text-3xl font-bold">New report</h1>
      <p className="mt-2 text-white/60">Start with the client and the address. Next you&apos;ll fill in the fact find with them on the phone, or email it for them to complete.</p>
      {q.missing && <p className="mt-4 rounded-md border border-red/40 bg-red/10 p-3 text-sm text-red-light">The business name and postcode are needed.</p>}
      {q.failed && <p className="mt-4 rounded-md border border-red/40 bg-red/10 p-3 text-sm text-red-light">That didn&apos;t save. Please try again.</p>}
      <form action="/api/admin/orders" method="post" className="mt-8 space-y-8">
        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <p className="font-display text-lg font-bold">The business</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <F name="business_name" label="Business name" required placeholder="Failsworth Post Office" />
            <F name="business_postcode" label="Postcode" required placeholder="M35 0FF" />
            <div className="sm:col-span-2"><F name="business_address" label="Address" placeholder="Unit 3, Failsworth Shopping Precinct, Sisson Street" /></div>
            <F name="business_town" label="Town" />
            <F name="business_url" label="Listing link (if any)" type="url" />
          </div>
        </section>
        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <p className="font-display text-lg font-bold">The client</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <F name="customer_name" label="Name" />
            <F name="customer_email" label="Email" type="email" hint="Needed to email them the fact find and the finished report." />
            <F name="customer_phone" label="Phone" type="tel" />
            <label className="block">
              <span className="text-sm font-medium text-white/80">How they found the business</span>
              <select name="business_source" className={field}>
                <option value="">Choose…</option>
                <option>A broker or agent</option><option>A listing website</option><option>Word of mouth</option><option>They know the seller</option><option>Other</option>
              </select>
            </label>
          </div>
        </section>
        <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <p className="font-display text-lg font-bold">The report</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-white/80">Report</span>
              <select name="report_tier" className={field} defaultValue="intelligence">
                <option value="insight">Insight (10 sections)</option>
                <option value="intelligence">Intelligence (all 15)</option>
              </select>
            </label>
            <F name="report_price" label="Price charged (£, optional)" hint="For your records. Leave blank if none." />
          </div>
        </section>
        <button className="bg-red px-6 py-3 font-semibold hover:bg-red-dark">Create and open the fact find</button>
      </form>
    </div>
  );
}
