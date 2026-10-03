import type { Metadata } from "next";
import Link from "next/link";
import { LegalCompany, LegalHeader, LegalPart as Part } from "@/components/Legal";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/privacy", "Privacy policy", "How FCM Intelligence collects, uses and protects your personal information, and your rights.");

const link = "text-red-dark underline";

export default function Page() {
  return (
    <section>
      <Container className="max-w-3xl py-20">
        <LegalHeader
          title="Privacy policy"
          intro="This explains what personal information I collect, why, who I share it with, how long I keep it, and the rights you have over it."
        />

        <Part title="1. Who is responsible for your information">
          <LegalCompany />
          <p>
            {site.company} is the controller of your personal information, which means it decides how it&apos;s used and is
            responsible for looking after it. Questions about this policy go to {site.contactEmail}.
          </p>
        </Part>

        <Part title="2. What I collect, why, and the lawful basis">
          <ul>
            <li>
              <strong>Enquiries.</strong> Your name, email, phone number if you give it, your message and anything else you
              add, such as branch details or a Health Check estimate. I use it to reply and, if you go ahead, to provide the
              service. Lawful basis: taking steps at your request before a contract, then performing the contract.
            </li>
            <li>
              <strong>Report orders.</strong> Your name, email, phone number if you give it, billing address, VAT number if you
              give one, the branch details you enter, and any documents you send me, such as accounts or a lease. I use them to
              research and deliver your report, to contact you about it, and to keep accounting records. Lawful basis:
              performing our contract, and the legal duty to keep tax records.
            </li>
            <li>
              <strong>Interim management applications.</strong> Your details and your branch&apos;s, so I can assess the
              application and, if we go ahead, so Post Office can be told and complete its compliance checks. Lawful basis:
              taking steps at your request before a contract.
            </li>
            <li>
              <strong>Free membership.</strong> Your name, email and where you are in your Post Office journey, so I can give
              you access to the members&apos; library and email you resources and insights. Lawful basis: your consent, which
              you give by ticking the box and confirming your email. You can withdraw it at any time with the unsubscribe link
              in every email.
            </li>
            <li>
              <strong>Insurance review.</strong> Your answers stay in your own browser. They only reach me if you choose to send
              them with an enquiry at the end.
            </li>
            <li>
              <strong>Security.</strong> To stop spam and abuse of the forms, the site keeps a scrambled version of your IP
              address for the day it was used; it can&apos;t be turned back into the address. The hosting provider also keeps
              short-term technical logs. Lawful basis: my legitimate interest in keeping the site secure.
            </li>
          </ul>
          <p>
            Please don&apos;t send me more than I need. In particular, if you send documents with information about staff or
            other people, only send what&apos;s relevant to your report.
          </p>
        </Part>

        <Part title="3. Information in reports about other people">
          <p>
            A report is about a business for sale, so it can include information about the people who own or run it, taken
            from public sources such as the sale listing, public company records and published reviews. I use this for my
            legitimate interest, and my customer&apos;s, in assessing a business before it&apos;s bought, and only include what
            matters to that. If that&apos;s you, you have the rights set out below.
          </p>
        </Part>

        <Part title="4. What I don't do">
          <ul>
            <li>I don&apos;t sell your information or share it for anyone else&apos;s marketing.</li>
            <li>I don&apos;t use advertising or tracking cookies, or build profiles of you.</li>
            <li>I don&apos;t make decisions about you by automated means alone.</li>
            <li>I only send marketing emails if you&apos;ve joined as a member.</li>
          </ul>
        </Part>

        <Part title="5. Who I share it with">
          <p>These companies process information on my behalf, under contracts that require them to protect it:</p>
          <ul>
            <li><strong>Vercel</strong> hosts the website.</li>
            <li><strong>Supabase</strong> stores enquiries, orders and membership details, on servers in Ireland.</li>
            <li><strong>Resend</strong> sends the site&apos;s emails.</li>
            <li>
              <strong>Stripe</strong> takes payments for reports and issues receipts and VAT invoices. Stripe also uses some
              payment information for its own purposes, such as preventing fraud and meeting legal duties, under{" "}
              <a className={link} href="https://stripe.com/gb/privacy" target="_blank" rel="noopener noreferrer">its own privacy policy</a>.
            </li>
          </ul>
          <p>I may also share information:</p>
          <ul>
            <li>with Post Office, if you apply for interim management and we go ahead;</li>
            <li>with my accountant and professional advisers, who keep it confidential;</li>
            <li>with HMRC, the police or a regulator, where the law requires it;</li>
            <li>with a buyer of my business, if it&apos;s ever sold, who would have to follow this policy.</li>
          </ul>
        </Part>

        <Part title="6. Information sent outside the UK">
          <p>
            Some of these providers, or their support teams, are based in the United States or elsewhere. Where your
            information leaves the UK, it&apos;s protected by safeguards recognised under UK data protection law: either UK
            adequacy regulations, including the UK–US data bridge, or the contract clauses approved by the Information
            Commissioner. You can ask me for details.
          </p>
        </Part>

        <Part title="7. How long I keep it">
          <ul>
            <li>Enquiries: up to two years after we last spoke, unless we go on to work together.</li>
            <li>Orders and invoices: six years from the end of the financial year of the order, as UK tax law requires.</li>
            <li>Your delivered report: twelve months, in case you need it sent again.</li>
            <li>Your fact find and the documents you send for a report, such as accounts, Post Office statements or a lease: deleted automatically 90 days after the report is delivered, so I can answer any follow-up questions. They&apos;re kept in private, encrypted storage until then and used only for your report.</li>
            <li>Membership: until you unsubscribe. After that I keep only your email address, so you&apos;re not emailed again by mistake.</li>
            <li>Security records: the scrambled IP address for the day it was used.</li>
          </ul>
        </Part>

        <Part title="8. How I keep it safe">
          <p>
            The site only works over an encrypted connection, access to customer information is limited to me and the people
            who help me deliver the work, and card details never reach me. If something goes wrong that puts your information
            at risk, I&apos;ll tell you and the Information Commissioner where the law requires.
          </p>
        </Part>

        <Part title="9. Your rights">
          <p>You have the right to:</p>
          <ul>
            <li>get a copy of the personal information I hold about you;</li>
            <li>have it corrected if it&apos;s wrong, or completed if it&apos;s incomplete;</li>
            <li>have it deleted, unless I have to keep it, for example for tax records;</li>
            <li>restrict how I use it, or object to my using it on the basis of legitimate interests;</li>
            <li>receive information you gave me in a format you can pass on to someone else;</li>
            <li>withdraw your consent at any time, where I rely on it. This doesn&apos;t affect what I did before.</li>
          </ul>
          <p>
            Email {site.contactEmail}. There&apos;s normally no charge. I may ask you to confirm who you are, and I&apos;ll reply
            within one month, or tell you within that month if I need longer for a complicated request. I&apos;ll make
            reasonable and proportionate searches for your information.
          </p>
        </Part>

        <Part title="10. Complaints" id="complaints">
          <p>
            If you&apos;re unhappy with how I&apos;ve handled your information, please tell me first, at {site.contactEmail}. I&apos;ll
            acknowledge your complaint within 30 days, look into it properly, keep you updated and tell you the outcome.
          </p>
          <p>
            You can also complain to the Information Commissioner&apos;s Office, the UK&apos;s data protection regulator, at{" "}
            <a className={link} href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a>{" "}
            or on 0303 123 1113.
          </p>
        </Part>

        <Part title="11. Cookies">
          <p>
            The site uses very few cookies, and none for advertising or tracking. The{" "}
            <Link href="/cookies" className={link}>cookies policy</Link> lists everything the site stores in your browser.
          </p>
        </Part>

        <Part title="12. Age">
          <p>My services are for adults buying or running a business. I don&apos;t knowingly collect information from anyone under 18.</p>
        </Part>

        <Part title="13. Changes">
          <p>
            I&apos;ll update this policy when anything changes, and the date at the top will show when. If a change affects you
            significantly, I&apos;ll tell you by email.
          </p>
        </Part>
      </Container>
    </section>
  );
}
