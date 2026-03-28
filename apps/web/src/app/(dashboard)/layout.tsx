import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { profiles } from "@zypply/shared";
import { eq } from "@zypply/shared";
import { DashboardShell } from "./dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user: { fullName: string; email: string } | null = null;
  try {
    const session = await verifyToken(token);
    const [profile] = await db
      .select({ fullName: profiles.fullName, email: profiles.email })
      .from(profiles)
      .where(eq(profiles.id, session.userId))
      .limit(1);
    user = profile || null;
  } catch {
    redirect("/login");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
