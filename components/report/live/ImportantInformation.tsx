import Link from "next/link";

// Shown at the start of every report. Wording kept accurate to what the report actually is and does,
// and consistent with the terms (section 8: liability for a report is limited to its price).
export function ImportantInformation({ reportDate }: { reportDate: string | null }) {
  const when = reportDate ? `on ${reportDate}` : "on the date of this report";
  return (
    <section aria-labelledby="important-info" className="mb-10 border border-line bg-light p-6 text-[13px] leading-relaxed text-muted sm:p-7">
      <h2 id="important-info" className="font-display text-base font-bold text-navy">Important information</h2>
      <ul className="mt-3 space-y-2.5">
        <li>
          <b className="text-navy">Information and education, not advice.</b> This report gives you information and FCM&apos;s opinion to help you
          understand this business and ask the right questions. It isn&apos;t financial, investment, legal, tax or property advice, and it isn&apos;t a
          recommendation to buy or not to buy. FCM Intelligence isn&apos;t regulated by the Financial Conduct Authority.
        </li>
        <li>
          <b className="text-navy">Where the figures come from.</b> Public sources (named in each section), the sale listing, and information from the
          seller or broker, which is labelled as theirs. We haven&apos;t audited anyone&apos;s figures. Where something wasn&apos;t available, the report says
          so rather than guessing. Rates, wages and allowances are those in force {when}.
        </li>
        <li>
          <b className="text-navy">The verdict is an opinion, not a valuation.</b> The score, grades and verdict are FCM&apos;s view of the evidence
          available {when}, worked out the same way for every report. They aren&apos;t a valuation, a survey or a forecast of future profit, and
          things can change after this date.
        </li>
        <li>
          <b className="text-navy">Check before you commit.</b> Visit the branch, see the full accounts, and have a solicitor review the lease and
          the Post Office contract, an accountant review the figures, and a surveyor look at any property you&apos;re buying. Post Office must
          approve any new postmaster; this report can&apos;t tell you whether it will.
        </li>
        <li>
          <b className="text-navy">Independent.</b> FCM Intelligence is independent and isn&apos;t part of, or endorsed by, Post Office Limited.
        </li>
        <li>
          <b className="text-navy">Your decision.</b> Every report is prepared with care, but the decision to buy is yours. Our responsibility for a
          report is set out in our <Link href="/terms#reports" className="underline">terms</Link>; nothing here affects your rights as a consumer.
        </li>
      </ul>
    </section>
  );
}
