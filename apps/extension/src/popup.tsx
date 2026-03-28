import React, { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import {
  ExternalLink,
  LogIn,
  Search,
  BarChart3,
  Target,
  Sparkles,
  Settings,
  Zap,
  Calendar,
  Crown,
  Briefcase,
  ChevronRight,
  Clock
} from "lucide-react";

import "~style.css";

const API_BASE = "http://localhost:3000";
const storage = new Storage();

interface UserProfile {
  name: string;
  email: string;
  subscriptionTier: string;
  avatarUrl?: string;
}

interface Stats {
  applicationsThisMonth: number;
  avgAtsScore: number;
  interviewsThisMonth: number;
}

interface RecentJob {
  id: string;
  title: string;
  company: string;
  savedAt: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function tierColor(tier: string): string {
  switch (tier?.toLowerCase()) {
    case "pro":
      return "plasmo-bg-gradient-to-r plasmo-from-amber-400 plasmo-to-orange-500 plasmo-text-white";
    case "premium":
      return "plasmo-bg-gradient-to-r plasmo-from-purple-500 plasmo-to-pink-500 plasmo-text-white";
    default:
      return "plasmo-bg-gray-100 plasmo-text-gray-600";
  }
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function Popup() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const token = await storage.get("token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setStats(
          data.stats || {
            applicationsThisMonth: 0,
            avgAtsScore: 0,
            interviewsThisMonth: 0
          }
        );
        setRecentJobs(data.recentJobs || []);
      } else {
        await storage.remove("token");
      }
    } catch {
      // API unavailable
    } finally {
      setLoading(false);
    }
  }

  function handleSignIn() {
    chrome.tabs.create({ url: `${API_BASE}/auth/login?ext=1` });
  }

  function openDashboard() {
    chrome.tabs.create({ url: `${API_BASE}/dashboard` });
  }

  function openQuickApply() {
    chrome.tabs.create({ url: `${API_BASE}/quick-apply` });
  }

  function openSettings() {
    chrome.tabs.create({ url: `${API_BASE}/settings` });
  }

  function openUpgrade() {
    chrome.tabs.create({ url: `${API_BASE}/pricing` });
  }

  async function analyzePage() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { type: "ANALYZE_PAGE" });
      window.close();
    }
  }

  if (loading) {
    return (
      <div className="plasmo-w-[380px] plasmo-flex plasmo-items-center plasmo-justify-center plasmo-py-20 plasmo-bg-white">
        <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-gap-3">
          <div className="plasmo-animate-spin plasmo-rounded-full plasmo-h-8 plasmo-w-8 plasmo-border-2 plasmo-border-indigo-600 plasmo-border-t-transparent" />
          <p className="plasmo-text-xs plasmo-text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plasmo-w-[380px] plasmo-font-sans plasmo-bg-gray-50">
      {/* Gradient Header */}
      <div className="plasmo-bg-gradient-to-br plasmo-from-indigo-600 plasmo-via-indigo-700 plasmo-to-purple-700 plasmo-px-5 plasmo-py-4">
        <div className="plasmo-flex plasmo-items-center plasmo-justify-between">
          <div className="plasmo-flex plasmo-items-center plasmo-gap-2.5">
            <div className="plasmo-bg-white/20 plasmo-rounded-xl plasmo-p-1.5">
              <Sparkles size={20} className="plasmo-text-white" />
            </div>
            <div>
              <h1 className="plasmo-text-base plasmo-font-bold plasmo-text-white plasmo-tracking-tight">
                ApplyPilot
              </h1>
              <p className="plasmo-text-indigo-200 plasmo-text-[10px] plasmo-leading-tight">
                AI Job Application Copilot
              </p>
            </div>
          </div>
          {user && (
            <button
              onClick={openSettings}
              className="plasmo-text-white/60 hover:plasmo-text-white plasmo-transition-colors plasmo-bg-transparent plasmo-border-0 plasmo-cursor-pointer plasmo-p-1.5 plasmo-rounded-lg hover:plasmo-bg-white/10">
              <Settings size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="plasmo-p-4 plasmo-space-y-3">
        {!user ? (
          /* Logged out state */
          <div className="plasmo-text-center plasmo-py-6">
            <div className="plasmo-rounded-2xl plasmo-bg-gradient-to-br plasmo-from-indigo-50 plasmo-to-purple-50 plasmo-w-20 plasmo-h-20 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mx-auto plasmo-mb-4 plasmo-shadow-sm">
              <LogIn size={32} className="plasmo-text-indigo-600" />
            </div>
            <h2 className="plasmo-text-sm plasmo-font-bold plasmo-text-gray-900">
              Welcome to ApplyPilot
            </h2>
            <p className="plasmo-text-xs plasmo-text-gray-500 plasmo-mt-1.5 plasmo-mb-5 plasmo-px-4 plasmo-leading-relaxed">
              Sign in to analyze job postings, get ATS scores, and tailor your
              resume with AI
            </p>
            <button
              onClick={handleSignIn}
              className="plasmo-w-full plasmo-bg-gradient-to-r plasmo-from-indigo-600 plasmo-to-purple-600 plasmo-text-white plasmo-rounded-xl plasmo-py-3 plasmo-px-4 plasmo-text-sm plasmo-font-semibold hover:plasmo-from-indigo-700 hover:plasmo-to-purple-700 plasmo-transition-all plasmo-shadow-md plasmo-shadow-indigo-200 plasmo-border-0 plasmo-cursor-pointer">
              Sign in to Get Started
            </button>
            <p className="plasmo-text-[10px] plasmo-text-gray-400 plasmo-mt-3">
              Free plan includes 5 analyses per month
            </p>
          </div>
        ) : (
          <>
            {/* User Profile Card */}
            <div className="plasmo-flex plasmo-items-center plasmo-gap-3 plasmo-bg-white plasmo-rounded-xl plasmo-p-3 plasmo-shadow-sm plasmo-border plasmo-border-gray-100">
              <div className="plasmo-w-10 plasmo-h-10 plasmo-rounded-xl plasmo-bg-gradient-to-br plasmo-from-indigo-500 plasmo-to-purple-600 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-flex-shrink-0">
                <span className="plasmo-text-white plasmo-font-bold plasmo-text-sm">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="plasmo-flex-1 plasmo-min-w-0">
                <p className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-900 plasmo-truncate">
                  {user.name}
                </p>
                <p className="plasmo-text-[11px] plasmo-text-gray-500 plasmo-truncate">
                  {user.email}
                </p>
              </div>
              <span
                className={`plasmo-inline-flex plasmo-items-center plasmo-gap-1 plasmo-px-2.5 plasmo-py-1 plasmo-rounded-lg plasmo-text-[10px] plasmo-font-bold plasmo-uppercase plasmo-tracking-wider ${tierColor(user.subscriptionTier)}`}>
                {user.subscriptionTier === "pro" && <Crown size={10} />}
                {user.subscriptionTier}
              </span>
            </div>

            {/* Quick Stats Grid */}
            {stats && (
              <div className="plasmo-grid plasmo-grid-cols-3 plasmo-gap-2">
                <div className="plasmo-bg-white plasmo-rounded-xl plasmo-p-3 plasmo-text-center plasmo-shadow-sm plasmo-border plasmo-border-gray-100">
                  <BarChart3
                    size={16}
                    className="plasmo-text-blue-500 plasmo-mx-auto plasmo-mb-1.5"
                  />
                  <p className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-900">
                    {stats.applicationsThisMonth}
                  </p>
                  <p className="plasmo-text-[9px] plasmo-text-gray-500 plasmo-font-medium plasmo-uppercase plasmo-tracking-wide">
                    Applications
                  </p>
                </div>
                <div className="plasmo-bg-white plasmo-rounded-xl plasmo-p-3 plasmo-text-center plasmo-shadow-sm plasmo-border plasmo-border-gray-100">
                  <Target
                    size={16}
                    className="plasmo-text-emerald-500 plasmo-mx-auto plasmo-mb-1.5"
                  />
                  <p className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-900">
                    {stats.avgAtsScore || "--"}
                  </p>
                  <p className="plasmo-text-[9px] plasmo-text-gray-500 plasmo-font-medium plasmo-uppercase plasmo-tracking-wide">
                    Avg Score
                  </p>
                </div>
                <div className="plasmo-bg-white plasmo-rounded-xl plasmo-p-3 plasmo-text-center plasmo-shadow-sm plasmo-border plasmo-border-gray-100">
                  <Calendar
                    size={16}
                    className="plasmo-text-purple-500 plasmo-mx-auto plasmo-mb-1.5"
                  />
                  <p className="plasmo-text-lg plasmo-font-bold plasmo-text-gray-900">
                    {stats.interviewsThisMonth || 0}
                  </p>
                  <p className="plasmo-text-[9px] plasmo-text-gray-500 plasmo-font-medium plasmo-uppercase plasmo-tracking-wide">
                    Interviews
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="plasmo-space-y-2">
              <button
                onClick={analyzePage}
                className="plasmo-w-full plasmo-bg-gradient-to-r plasmo-from-indigo-600 plasmo-to-purple-600 plasmo-text-white plasmo-rounded-xl plasmo-py-3 plasmo-px-4 plasmo-text-sm plasmo-font-semibold hover:plasmo-from-indigo-700 hover:plasmo-to-purple-700 plasmo-transition-all plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-shadow-md plasmo-shadow-indigo-200/50 plasmo-border-0 plasmo-cursor-pointer">
                <Search size={16} />
                Analyze This Page
              </button>
              <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-2">
                <button
                  onClick={openQuickApply}
                  className="plasmo-bg-white plasmo-text-gray-700 plasmo-border plasmo-border-gray-200 plasmo-rounded-xl plasmo-py-2.5 plasmo-px-3 plasmo-text-xs plasmo-font-semibold hover:plasmo-bg-gray-50 hover:plasmo-border-gray-300 plasmo-transition-all plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-1.5 plasmo-cursor-pointer plasmo-shadow-sm">
                  <Zap size={14} className="plasmo-text-amber-500" />
                  Quick Apply
                </button>
                <button
                  onClick={openDashboard}
                  className="plasmo-bg-white plasmo-text-gray-700 plasmo-border plasmo-border-gray-200 plasmo-rounded-xl plasmo-py-2.5 plasmo-px-3 plasmo-text-xs plasmo-font-semibold hover:plasmo-bg-gray-50 hover:plasmo-border-gray-300 plasmo-transition-all plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-1.5 plasmo-cursor-pointer plasmo-shadow-sm">
                  <ExternalLink size={14} className="plasmo-text-indigo-500" />
                  Dashboard
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            {recentJobs.length > 0 && (
              <div className="plasmo-bg-white plasmo-rounded-xl plasmo-shadow-sm plasmo-border plasmo-border-gray-100 plasmo-overflow-hidden">
                <div className="plasmo-px-3 plasmo-py-2.5 plasmo-border-b plasmo-border-gray-100 plasmo-flex plasmo-items-center plasmo-justify-between">
                  <h3 className="plasmo-text-xs plasmo-font-bold plasmo-text-gray-700 plasmo-uppercase plasmo-tracking-wide">
                    Recent Activity
                  </h3>
                  <Clock size={12} className="plasmo-text-gray-400" />
                </div>
                <div className="plasmo-divide-y plasmo-divide-gray-50">
                  {recentJobs.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="plasmo-px-3 plasmo-py-2.5 plasmo-flex plasmo-items-center plasmo-gap-2.5 hover:plasmo-bg-gray-50 plasmo-transition-colors plasmo-cursor-pointer"
                      onClick={openDashboard}>
                      <div className="plasmo-w-7 plasmo-h-7 plasmo-rounded-lg plasmo-bg-indigo-50 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-flex-shrink-0">
                        <Briefcase
                          size={12}
                          className="plasmo-text-indigo-500"
                        />
                      </div>
                      <div className="plasmo-flex-1 plasmo-min-w-0">
                        <p className="plasmo-text-xs plasmo-font-medium plasmo-text-gray-800 plasmo-truncate">
                          {job.title}
                        </p>
                        <p className="plasmo-text-[10px] plasmo-text-gray-400 plasmo-truncate">
                          {job.company}
                        </p>
                      </div>
                      <div className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-flex-shrink-0">
                        <span className="plasmo-text-[10px] plasmo-text-gray-400">
                          {timeAgo(job.savedAt)}
                        </span>
                        <ChevronRight
                          size={12}
                          className="plasmo-text-gray-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="plasmo-border-t plasmo-border-gray-200 plasmo-px-4 plasmo-py-2.5 plasmo-flex plasmo-items-center plasmo-justify-between plasmo-bg-white">
        <p className="plasmo-text-[10px] plasmo-text-gray-400">
          ApplyPilot v1.0.0
        </p>
        {user && user.subscriptionTier?.toLowerCase() === "free" && (
          <button
            onClick={openUpgrade}
            className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-text-[10px] plasmo-font-semibold plasmo-text-indigo-600 hover:plasmo-text-indigo-800 plasmo-transition-colors plasmo-bg-transparent plasmo-border-0 plasmo-cursor-pointer">
            <Crown size={10} />
            Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  );
}

export default Popup;
