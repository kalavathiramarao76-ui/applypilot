"use client";

import { Sidebar } from "@/components/sidebar";

interface DashboardShellProps {
  user: { fullName: string; email: string } | null;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900/30">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
