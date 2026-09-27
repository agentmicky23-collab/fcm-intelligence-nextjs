import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section>
      <Container className="max-w-xl py-32 text-center">
        <p className="font-display font-bold tracking-[-0.02em] text-6xl text-red">404</p>
        <h1 className="mt-4 font-display font-bold tracking-[-0.02em] text-3xl text-navy">That page isn&apos;t here.</h1>
        <p className="mt-4 text-muted">It may have moved while we rebuilt the site.</p>
        <div className="mt-8">
          <ButtonLink href="/" variant="navy">Back to the homepage</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
