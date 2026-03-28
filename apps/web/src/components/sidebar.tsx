"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  User,
  LogOut,
  Rocket,
  Building2,
  DollarSign,
  Users,
  Settings,
  Columns3,
  Zap,
  MessageSquare,
  Mail,
  Target,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/board", label: "Board View", icon: Columns3 },
  { href: "/resumes", label: "Resumes", icon: FileText },
  { href: "/interview", label: "Interview Prep", icon: MessageSquare },
  { href: "/emails", label: "Email Templates", icon: Mail },
  { href: "/score", label: "Resume Score", icon: Target },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/quick-apply", label: "Quick Apply", icon: Zap },
  { href: "/company", label: "Company Intel", icon: Building2 },
  { href: "/salary", label: "Salary", icon: DollarSign },
  { href: "/networking", label: "Networking", icon: Users },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

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
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ApplyPilot
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 dark:from-blue-950/50 dark:to-purple-950/50 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-100"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-blue-600 dark:text-blue-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        {user && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium truncate">{user.fullName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
