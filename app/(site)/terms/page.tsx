import type { Metadata } from "next";
import Link from "next/link";
import { LegalCompany, LegalHeader, LegalPart as Part } from "@/components/Legal";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/terms", "Terms and conditions", "The terms for using the FCM Intelligence website and buying reports and services.");

const link = "text-red-dark underline";

export default function Page() {
  return (
    <section>
      <Container className="max-w-3xl py-20">
        <LegalHeader
          title="Terms and conditions"
          intro="These terms cover using this website and buying a report from it. Please read them before you order, especially section 5: report sales are final and there are no refunds. If anything isn't clear, email me before you order and I'll explain."
        />

        <Part title="1. Who I am">
          <LegalCompany />
          <p>
            {site.name} is independent. It isn&apos;t part of Post Office Limited, and Post Office doesn&apos;t endorse or check
            anything on this site or in my reports.
          </p>
        </Part>

        <Part title="2. Information, not advice">
          <p>
            Everything on this site, and everything in a report, is information and opinion from my experience of running
            Post Office branches. It isn&apos;t financial, investment, legal, tax, HR, employment or insurance advice, and it
            can&apos;t take account of your personal circumstances. {site.company} isn&apos;t authorised or regulated by the
            Financial Conduct Authority.
          </p>
          <p>
            Before you buy a business, sign a lease, take on staff or change your insurance, get advice from a qualified
            solicitor, accountant or other professional. The decision to buy, and what you pay, is always yours.
          </p>
          <p>
            The free tools on the site, such as the insurance review and the Branch Health Check estimate, give a guide based
            on what you enter. They&apos;re not a quote or a recommendation.
          </p>
        </Part>

        <Part title="3. Reports" id="reports">
          <p>
            I offer two reports on a Post Office you&apos;re thinking of buying: the Insight Report and the Intelligence Report.
            What each one covers is set out on the <Link href="/reports" className={link}>reports page</Link>.
          </p>
          <ul>
            <li>
              <strong>Sources.</strong> Reports are researched from public sources, such as official statistics, public
              registers, maps and published reviews, together with the sale listing and anything you send me. I take
              reasonable care to check them, but I can&apos;t guarantee that information from other people is complete,
              accurate or up to date, and it can change after I&apos;ve looked at it.
            </li>
            <li>
              <strong>Estimates.</strong> Figures that don&apos;t come from the business&apos;s own accounts are estimates, and are
              labelled as such. Treat them as a guide, not a forecast.
            </li>
            <li>
              <strong>Your information.</strong> Please give me the correct branch name, postcode and listing. If the details
              are wrong, the report may be about the wrong business. If you send me documents, such as accounts or a lease,
              you confirm you&apos;re allowed to share them with me for your report.
            </li>
            <li>
              <strong>Delivery.</strong> I send your report by email to the address you give at checkout. I&apos;ll let you know
              when to expect it when I confirm your order, and tell you straight away if it&apos;s going to take longer. If
              it hasn&apos;t arrived when expected, check your junk folder, then email me.
            </li>
            <li>
              <strong>Errors.</strong> If you find a factual mistake that materially affects a report&apos;s conclusions, tell me
              within 14 days of delivery and I&apos;ll correct it free of charge.
            </li>
            <li>
              <strong>Using your report.</strong> Your report is for you, to help you decide whether to buy the business it
              covers. You can share it with your own solicitor, accountant, lender or business partner for that purpose.
              Please don&apos;t resell it, publish it, post it online or pass it to anyone else.
            </li>
            <li>
              <strong>The example report</strong> is for a fictional branch. Its figures are for illustration only.
            </li>
          </ul>
        </Part>

        <Part title="4. Prices and payment">
          <ul>
            <li>Prices are in pounds sterling and are shown before VAT. VAT is added at the current rate and shown on its own line before you pay.</li>
            <li>Payment is taken by Stripe, our payment provider. I never see or store your card details.</li>
            <li>Our contract starts when your payment goes through. You&apos;ll get an order confirmation from me, and a receipt and VAT invoice from Stripe.</li>
          </ul>
        </Part>

        <Part title="5. No refunds" id="refunds">
          <p>
            Reports are sold to business customers only: people buying, or thinking of buying, a Post Office or other
            business. When you order, you confirm you&apos;re buying the report for that business purpose and not as a private
            consumer.
          </p>
          <p>
            Each report is researched and written for the branch you choose, and work starts as soon as you pay.{" "}
            <strong>All report sales are final. Once you&apos;ve paid, an order can&apos;t be cancelled and there are no refunds.</strong>
          </p>
          <ul>
            <li>If you&apos;ve made a mistake in the branch details, tell me straight away and I&apos;ll correct them if I can.</li>
            <li>
              If I can&apos;t produce your report, for example because the listing has been withdrawn or there isn&apos;t enough
              information, I&apos;ll produce a report on a different branch of your choice instead.
            </li>
            <li>If you find a factual mistake that materially affects the conclusions, I&apos;ll correct it free of charge, as set out above.</li>
          </ul>
          <p>Nothing in these terms takes away any right you have by law that can&apos;t be excluded.</p>
        </Part>

        <Part title="6. Consultancy and other services">
          <p>
            Sending an enquiry doesn&apos;t commit you to anything. For consultancy, training, health checks, retainers and
            interim management, we have an agreement once we&apos;ve both confirmed the work, price and timing in writing.
            Those written terms apply alongside these.
          </p>
          <ul>
            <li>The monthly Branch Health Check has a three-month minimum term, and can be cancelled at any time after that.</li>
            <li>
              Interim management has a six-month minimum term. It can only start once Post Office has been told and has
              completed its compliance checks.
            </li>
          </ul>
        </Part>

        <Part title="7. Using the site">
          <ul>
            <li>The content, reports, design and logo belong to {site.company}. You&apos;re welcome to share links, but please don&apos;t copy the content without permission.</li>
            <li>Please don&apos;t misuse the site, for example by sending spam through the forms, trying to get into parts of it you shouldn&apos;t, or trying to disrupt it.</li>
            <li>Links to other websites are there for convenience. I&apos;m not responsible for their content.</li>
            <li>I try to keep the site accurate and available, but I can&apos;t promise it will always be either.</li>
          </ul>
        </Part>

        <Part title="8. Liability">
          <p>
            Nothing in these terms limits or excludes liability that can&apos;t legally be limited, such as for death or personal
            injury caused by negligence, or for fraud.
          </p>
          <p>
            <strong>Reports, and business customers:</strong> I&apos;m not liable for loss of profit, loss of business or
            opportunity, or any indirect or consequential loss, or for decisions you make based on a report or anything on
            this site. My total liability to you for a report is limited to the price you paid for it.
          </p>
          <p>
            <strong>If you use the site as a consumer:</strong> I&apos;m responsible for loss you suffer that was a foreseeable
            result of me breaking these terms or failing to use reasonable care and skill. I&apos;m not responsible for loss that
            wasn&apos;t foreseeable, or for business losses.
          </p>
        </Part>

        <Part title="9. Your information">
          <p>
            How I handle personal information is explained in the <Link href="/privacy" className={link}>privacy policy</Link>, and
            the site&apos;s cookies in the <Link href="/cookies" className={link}>cookies policy</Link>.
          </p>
        </Part>

        <Part title="10. Complaints">
          <p>
            If you&apos;re unhappy with anything, email {site.contactEmail}. I&apos;ll reply within five working days and try to put
            it right.
          </p>
        </Part>

        <Part title="11. Changes and the law">
          <p>
            I may update these terms. The version that applies to a report is the one in force when you ordered it, and the
            date at the top shows when they last changed.
          </p>
          <p>
            These terms are governed by the law of England and Wales, and the courts of England and Wales can deal with any
            dispute. If you&apos;re a consumer living in Scotland or Northern Ireland, you can also bring proceedings in your
            local courts.
          </p>
        </Part>
      </Container>
    </section>
  );
}
