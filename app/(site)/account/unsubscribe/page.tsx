import type { Metadata } from "next";
import { Unsubscribe } from "@/components/Unsubscribe";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false, follow: false } };

export default async function UnsubscribePage(props: PageProps<"/account/unsubscribe">) {
  const { token } = await props.searchParams;
  return (
    <section>
      <Container className="max-w-2xl py-24 md:py-32">
        <span aria-hidden className="mb-8 block h-6 w-3.5 -skew-x-[18deg] bg-red" />
        <Unsubscribe token={typeof token === "string" ? token.slice(0, 64) : ""} />
      </Container>
    </section>
  );
}
