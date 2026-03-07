import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-financial text-6xl mb-4">404</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Page not found. The resource you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary" data-testid="link-home">
          Return Home
        </Link>
      </div>
    </div>
  );
}
