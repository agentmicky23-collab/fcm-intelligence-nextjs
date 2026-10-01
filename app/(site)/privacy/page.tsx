import type { Metadata } from "next";
import Link from "next/link";
import { LegalPart as Part } from "@/components/Legal";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/privacy", "Privacy policy", "How FCM Intelligence collects, uses and protects your information.");


export default function Page() {
  return (
    <section>
      <Container className="max-w-3xl py-20">
        <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-navy">Privacy policy</h1>
        <p className="mt-6 bg-red/15 px-4 py-3 text-sm text-red-dark">
          Draft for review: this policy is still being checked and may change before the site launches.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          This explains what personal information {site.name} collects, why, and what you can ask me to do with it.
        </p>

        <Part title="Who I am">
          <p>
            {site.name} is run by {site.owner} through {site.company}, which is responsible for your information. You can
            contact me about anything in this policy at <a className="text-red-dark underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        </Part>

        <Part title="What I collect and why">
          <ul>
            <li>
              <strong>Enquiries.</strong> When you send an enquiry, I keep your name, email, phone number if you give it,
              your message and anything else you add, such as branch details or a Health Check estimate. I use it to reply
              and, if you go ahead, to provide the service. The lawful basis is taking steps at your request before a contract.
            </li>
            <li>
              <strong>Report orders.</strong> When you order a report, I keep your name, email, phone number if you give
              it, your billing address and the branch details you enter, and use them to research and deliver the report
              and to keep tax records. Card details go straight to the payment provider; I never see or store them. The
              lawful basis is performing our contract, and the legal duty to keep accounting records.
            </li>
            <li>
              <strong>Insurance review.</strong> Your answers stay in your browser unless you send an enquiry at the end. If
              you do, your answers and the gaps they show are sent with it, so I can review your cover.
            </li>
            <li>
              <strong>Free membership.</strong> I keep your name, email and where you are in your Post Office journey, and
              email you resources and insights. The lawful basis is your consent, which you give by ticking the box and
              confirming your email. You can withdraw it any time with the unsubscribe link in every email.
            </li>
            <li>
              <strong>Security.</strong> To stop spam and abuse, the site keeps a scrambled version of your IP address for
              the day it was used. It can&apos;t be turned back into the address. The lawful basis is my legitimate interest in
              keeping the site secure.
            </li>
          </ul>
          <p>I don&apos;t sell your information or share it for anyone else&apos;s marketing.</p>
        </Part>

        <Part title="Who helps me run the site">
          <p>These companies process information on my behalf, under contracts that protect it:</p>
          <ul>
            <li><strong>Vercel</strong> hosts the website.</li>
            <li><strong>Supabase</strong> stores enquiries and membership details, on servers in Ireland.</li>
            <li><strong>Resend</strong> sends the site&apos;s emails.</li>
            <li><strong>Stripe</strong> takes payments for reports and issues receipts and VAT invoices.</li>
          </ul>
          <p>
            Some of these providers may process information outside the UK. Where they do, it is protected by safeguards
            recognised under UK data protection law, such as standard contractual clauses.
          </p>
        </Part>

        <Part title="How long I keep it">
          <ul>
            <li>Enquiries: for up to two years after we last spoke, or longer if we work together and the law requires it.</li>
            <li>Report orders: six years from the end of the financial year of the order, as UK tax law requires.</li>
            <li>Membership: until you unsubscribe. After that I keep only your email address, so you&apos;re not emailed again by mistake.</li>
          </ul>
        </Part>

        <Part title="Your rights">
          <p>
            You can ask for a copy of your information, ask me to correct or delete it, object to how I use it, or withdraw
            consent. Email {site.contactEmail} and I&apos;ll respond within a month. If you&apos;re unhappy with how I&apos;ve handled
            your information, you can complain to the Information Commissioner&apos;s Office at ico.org.uk.
          </p>
        </Part>

        <Part title="Cookies">
          <p>
            The site doesn&apos;t use advertising or tracking cookies. The insurance review saves your answers in your own
            browser so you can come back and finish later; they stay on your device unless you send an enquiry. The{" "}
            <Link href="/cookies" className="text-red-dark underline">cookies policy</Link> lists everything the site sets.
          </p>
        </Part>
      </Container>
    </section>
  );
}
