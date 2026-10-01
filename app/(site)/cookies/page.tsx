import type { Metadata } from "next";
import Link from "next/link";
import { LegalCompany, LegalHeader, LegalPart as Part } from "@/components/Legal";
import { MapsChoice } from "@/components/MapsChoice";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta("/cookies", "Cookies policy", "The small number of cookies FCM Intelligence uses, and how to control them.");

const used = [
  {
    name: "fcm_member",
    kind: "Cookie",
    purpose: "Keeps you signed in to the members' library after you confirm your email or open a link I've sent you.",
    type: "Strictly necessary",
    lasts: "1 year",
  },
  {
    name: "fcm-insurance-review",
    kind: "Browser storage",
    purpose: "Saves your answers to the insurance review so you can come back and finish it later.",
    type: "Strictly necessary",
    lasts: "Until you clear it",
  },
  {
    name: "fcm-maps-consent",
    kind: "Browser storage",
    purpose: "Remembers that you chose to show Google Maps, so I don't ask again.",
    type: "Strictly necessary",
    lasts: "Until you clear it",
  },
];

export default function Page() {
  return (
    <section>
      <Container className="max-w-3xl py-20">
        <LegalHeader
          title="Cookies policy"
          intro="Cookies are small files a website saves in your browser. This site uses very few, and none for advertising or tracking. This page lists every one and tells you how to control them."
        />

        <Part title="The short version">
          <ul>
            <li>No advertising cookies, no tracking pixels and no analytics cookies.</li>
            <li>The cookies and storage this site sets are only there to make features you ask for work.</li>
            <li>Google Maps is only loaded if you choose to show it.</li>
          </ul>
        </Part>

        <Part title="What this site sets">
          <p>
            These are strictly necessary for something you&apos;ve asked to do, so the law doesn&apos;t require your consent for
            them. They&apos;re never used to track you or shared with anyone.
          </p>
          <div className="divide-y divide-line border-y border-line">
            {used.map((c) => (
              <div key={c.name} className="grid gap-x-6 gap-y-2 py-4 sm:grid-cols-[200px_1fr]">
                <div>
                  <code className="text-[14px] font-semibold text-navy">{c.name}</code>
                  <span className="block text-xs text-muted">{c.kind}</span>
                </div>
                <div className="text-[15px]">
                  <p>{c.purpose}</p>
                  <p className="mt-1 text-sm text-muted">{c.type} · Lasts: {c.lasts.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </Part>

        <Part title="Google Maps">
          <p>
            The <Link href="/reports/example" className="text-red-dark underline">example report</Link> can show a street map
            from Google. Google sets its own cookies when the map loads, so it stays switched off until you click
            &ldquo;Show the map&rdquo;. Google&apos;s use of that information is covered by{" "}
            <a className="text-red-dark underline" href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">
              Google&apos;s cookies policy
            </a>
            .
          </p>
          <MapsChoice />
        </Part>

        <Part title="Paying for a report">
          <p>
            When you pay for a report you&apos;re taken to a secure payment page run by Stripe, our payment provider. That page
            is on Stripe&apos;s own website and Stripe sets the cookies it needs there to take payment safely and prevent fraud.
            They&apos;re covered by{" "}
            <a className="text-red-dark underline" href="https://stripe.com/cookies-policy/legal" target="_blank" rel="noopener noreferrer">
              Stripe&apos;s cookies policy
            </a>
            . No Stripe cookies are set on this site.
          </p>
        </Part>

        <Part title="How to control cookies">
          <p>
            You can see and delete cookies and stored data in your browser&apos;s settings, usually under Privacy or Site data.
            You can also block them altogether. If you block or delete them, the site still works, but you&apos;ll need to sign
            in to the members&apos; library again and any unfinished insurance review will be lost.
          </p>
        </Part>

        <Part title="Who I am">
          <LegalCompany />
        </Part>

        <Part title="Changes and questions">
          <p>
            If I add a cookie, I&apos;ll update this page first, and I&apos;ll ask for your consent before setting anything that
            isn&apos;t strictly necessary. Questions to{" "}
            <a className="text-red-dark underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. How I handle
            personal information generally is in the <Link href="/privacy" className="text-red-dark underline">privacy policy</Link>.
          </p>
        </Part>
      </Container>
    </section>
  );
}
