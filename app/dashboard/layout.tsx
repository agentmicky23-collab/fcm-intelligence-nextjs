import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";

const ADMIN_EMAIL = "mikeshparekh@gmail.com";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const session = await getServerSession();

    // Not authenticated — redirect to sign in
    if (!session || !session.user) {
      redirect("/auth/signin?callbackUrl=/dashboard");
    }

    // Not admin — redirect to home
    if (session.user.email !== ADMIN_EMAIL) {
      redirect("/");
    }
  } catch {
    // If auth is not configured (no env vars), redirect to sign in
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  return <>{children}</>;
}
