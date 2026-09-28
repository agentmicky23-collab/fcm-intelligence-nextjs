import type { Metadata } from "next";
import Link from "next/link";
import { LegalPart as Part } from "@/components/Legal";
import { Container } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of use" };

export default function Page() {
  return (
    <section>
      <Container className="max-w-3xl py-20">
        <h1 className="font-display text-4xl font-bold tracking-[-0.02em] text-navy">Terms of use</h1>
        <p className="mt-6 bg-red/15 px-4 py-3 text-sm text-red-dark">
          Draft for review: these terms are still being checked and may change before the site launches.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          These terms cover using this website. Paid work is also covered by the written agreement we make before it starts.
        </p>

        <Part title="Who I am">
          <p>
            {site.name} is run by {site.owner} through {site.company}. Contact:{" "}
            <a className="text-red-dark underline" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
          <p>{site.name} is independent. It isn&apos;t part of, or endorsed by, Post Office Limited.</p>
        </Part>

        <Part title="Information, not advice">
          <p>
            The insights, resources, tools and example report on this site are general information from my own experience.
            They aren&apos;t financial, legal, tax or insurance advice, and they can&apos;t account for your circumstances. Before
            you buy a business, sign a lease or change your insurance, take advice from a qualified professional.
          </p>
          <p>
            The insurance review and the Branch Health Check estimate give a guide based on what you enter. Estimates are
            confirmed, or corrected, in a written quote.
          </p>
        </Part>

        <Part title="Reports">
          <ul>
            <li>Reports are researched from public sources and the information you give me. I check them before they reach you, but I can&apos;t guarantee that third-party information is complete or current.</li>
            <li>Figures in a report are estimates unless they come from the business&apos;s own accounts.</li>
            <li>A report is for your own use. Please don&apos;t resell or republish it.</li>
            <li>The example report is for a fictional branch, and its figures are illustrative.</li>
          </ul>
        </Part>

        <Part title="Prices and services">
          <ul>
            <li>All prices on the site are in pounds and exclude VAT, which is added at the current rate.</li>
            <li>Sending an enquiry doesn&apos;t commit you to anything. We only have an agreement once we&apos;ve both confirmed the work, price and timing in writing.</li>
            <li>The monthly Branch Health Check subscription has a three-month minimum term, and can be cancelled any time after that.</li>
          </ul>
        </Part>

        <Part title="Using the site">
          <ul>
            <li>The content, design and logo belong to {site.company}. You&apos;re welcome to share links, but please don&apos;t copy the content without permission.</li>
            <li>Please don&apos;t misuse the site, for example by sending spam through the forms or trying to disrupt it.</li>
            <li>Links to other websites are for convenience. I&apos;m not responsible for their content.</li>
          </ul>
        </Part>

        <Part title="Liability">
          <p>
            I work hard to keep the site accurate, but it&apos;s provided as it is, and I can&apos;t promise it will always be
            available or error-free. As far as the law allows, I&apos;m not liable for losses from relying on general
            information on this site. Nothing in these terms limits liability that can&apos;t legally be limited, such as for
            fraud, or for death or personal injury caused by negligence.
          </p>
        </Part>

        <Part title="Your information">
          <p>
            How I handle personal information is explained in the{" "}
            <Link href="/privacy" className="text-red-dark underline">privacy policy</Link>.
          </p>
        </Part>

        <Part title="Changes and law">
          <p>
            I may update these terms. The version on this page applies when you use the site. These terms are governed by
            the law of England and Wales.
          </p>
        </Part>
      </Container>
    </section>
  );
}
