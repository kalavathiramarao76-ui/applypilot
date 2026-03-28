"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ZypplyLogo,
  IconDashboard,
  IconApplications,
  IconBoard,
  IconResumes,
  IconInterview,
  IconEmails,
  IconScore,
  IconAnalytics,
  IconSkills,
  IconReports,
  IconTimeline,
  IconQuickApply,
  IconCompany,
  IconSalary,
  IconNetworking,
  IconProfile,
  IconSettings,
  IconLogout,
} from "@/components/icons";

const navItems = [
  { href: "/dashboard", label: "Dashboard", Icon: IconDashboard },
  { href: "/applications", label: "Applications", Icon: IconApplications },
  { href: "/board", label: "Board View", Icon: IconBoard },
  { href: "/resumes", label: "Resumes", Icon: IconResumes },
  { href: "/quick-apply", label: "Quick Apply", Icon: IconQuickApply },
  { divider: true, label: "AI Tools" },
  { href: "/interview", label: "Interview Prep", Icon: IconInterview },
  { href: "/emails", label: "Email Templates", Icon: IconEmails },
  { href: "/score", label: "Resume Score", Icon: IconScore },
  { href: "/company", label: "Company Intel", Icon: IconCompany },
  { href: "/salary", label: "Salary Intel", Icon: IconSalary },
  { href: "/networking", label: "Networking", Icon: IconNetworking },
  { divider: true, label: "Insights" },
  { href: "/analytics", label: "Analytics", Icon: IconAnalytics },
  { href: "/skills", label: "Skill Gap", Icon: IconSkills },
  { href: "/reports", label: "Reports", Icon: IconReports },
  { href: "/timeline", label: "Timeline", Icon: IconTimeline },
  { divider: true, label: "Account" },
  { href: "/profile", label: "Profile", Icon: IconProfile },
  { href: "/settings", label: "Settings", Icon: IconSettings },
] as const;

interface SidebarProps {
  user?: { fullName: string; email: string } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="p-5 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <ZypplyLogo size={30} />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Zypply
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item, i) => {
          if ("divider" in item && item.divider) {
            return (
              <div key={i} className="pt-4 pb-1 px-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  {item.label}
                </span>
              </div>
            );
          }
          if (!("href" in item)) return null;
          const isActive = pathname === item.href;
          const Icon = item.Icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 shadow-sm dark:from-indigo-950/50 dark:to-violet-950/50 dark:text-indigo-300"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
              )}
            >
              {Icon && <Icon className={cn("shrink-0", isActive ? "text-indigo-600 dark:text-indigo-400" : "")} size={18} />}
              {item.label}
              {item.href === "/quick-apply" && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {user && (
          <div className="mb-3 px-2 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user.fullName?.charAt(0)?.toUpperCase() || "Z"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.fullName}</p>
              <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-xl"
          onClick={handleLogout}
        >
          <IconLogout size={18} />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
