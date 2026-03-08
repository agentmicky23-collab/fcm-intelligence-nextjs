import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

const ADMIN_EMAIL = "mikeshparekh@gmail.com";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // Not authenticated — redirect to sign in
  if (!session || !session.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  // Not admin — redirect to home
  if (session.user.email !== ADMIN_EMAIL) {
    redirect("/");
  }

  return <>{children}</>;
}
