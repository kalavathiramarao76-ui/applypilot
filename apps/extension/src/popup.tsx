import React, { useEffect, useState } from "react";
import { Storage } from "@plasmohq/storage";
import {
  ExternalLink,
  LogIn,
  Search,
  BarChart3,
  Target,
  Sparkles
} from "lucide-react";

import "~style.css";

const API_BASE = "http://localhost:3000";
const storage = new Storage();

interface UserProfile {
  name: string;
  email: string;
  subscriptionTier: string;
}

interface Stats {
  applicationsThisMonth: number;
  avgAtsScore: number;
}

function Popup() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
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
        setStats(data.stats || { applicationsThisMonth: 0, avgAtsScore: 0 });
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
      <div className="plasmo-w-[360px] plasmo-flex plasmo-items-center plasmo-justify-center plasmo-py-16">
        <div className="plasmo-animate-spin plasmo-rounded-full plasmo-h-8 plasmo-w-8 plasmo-border-2 plasmo-border-indigo-600 plasmo-border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="plasmo-w-[360px] plasmo-font-sans">
      {/* Header */}
      <div className="plasmo-bg-gradient-to-r plasmo-from-indigo-600 plasmo-to-purple-600 plasmo-px-5 plasmo-py-4">
        <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
          <Sparkles size={22} className="plasmo-text-white" />
          <h1 className="plasmo-text-lg plasmo-font-bold plasmo-text-white">
            ApplyPilot
          </h1>
        </div>
        <p className="plasmo-text-indigo-100 plasmo-text-xs plasmo-mt-1">
          AI-Powered Job Application Copilot
        </p>
      </div>

      <div className="plasmo-p-4 plasmo-space-y-3">
        {!user ? (
          /* Logged out state */
          <div className="plasmo-text-center plasmo-py-4">
            <div className="plasmo-rounded-full plasmo-bg-indigo-50 plasmo-w-16 plasmo-h-16 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-mx-auto plasmo-mb-3">
              <LogIn size={28} className="plasmo-text-indigo-600" />
            </div>
            <h2 className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-900">
              Sign in to get started
            </h2>
            <p className="plasmo-text-xs plasmo-text-gray-500 plasmo-mt-1 plasmo-mb-4">
              Connect your account to analyze jobs and tailor your resume
            </p>
            <button
              onClick={handleSignIn}
              className="plasmo-w-full plasmo-bg-indigo-600 plasmo-text-white plasmo-rounded-lg plasmo-py-2.5 plasmo-px-4 plasmo-text-sm plasmo-font-medium hover:plasmo-bg-indigo-700 plasmo-transition-colors">
              Sign in to ApplyPilot
            </button>
          </div>
        ) : (
          <>
            {/* User info */}
            <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-bg-gray-50 plasmo-rounded-lg plasmo-p-3">
              <div>
                <p className="plasmo-text-sm plasmo-font-medium plasmo-text-gray-900">
                  {user.name}
                </p>
                <p className="plasmo-text-xs plasmo-text-gray-500">
                  {user.email}
                </p>
              </div>
              <span className="plasmo-inline-flex plasmo-items-center plasmo-px-2 plasmo-py-0.5 plasmo-rounded-full plasmo-text-[10px] plasmo-font-semibold plasmo-bg-indigo-100 plasmo-text-indigo-700 plasmo-capitalize">
                {user.subscriptionTier}
              </span>
            </div>

            {/* Quick stats */}
            {stats && (
              <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-2">
                <div className="plasmo-bg-blue-50 plasmo-rounded-lg plasmo-p-3 plasmo-text-center">
                  <BarChart3
                    size={18}
                    className="plasmo-text-blue-600 plasmo-mx-auto plasmo-mb-1"
                  />
                  <p className="plasmo-text-lg plasmo-font-bold plasmo-text-blue-700">
                    {stats.applicationsThisMonth}
                  </p>
                  <p className="plasmo-text-[10px] plasmo-text-blue-600">
                    Apps this month
                  </p>
                </div>
                <div className="plasmo-bg-green-50 plasmo-rounded-lg plasmo-p-3 plasmo-text-center">
                  <Target
                    size={18}
                    className="plasmo-text-green-600 plasmo-mx-auto plasmo-mb-1"
                  />
                  <p className="plasmo-text-lg plasmo-font-bold plasmo-text-green-700">
                    {stats.avgAtsScore || "--"}
                  </p>
                  <p className="plasmo-text-[10px] plasmo-text-green-600">
                    Avg ATS score
                  </p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="plasmo-space-y-2">
              <button
                onClick={analyzePage}
                className="plasmo-w-full plasmo-bg-indigo-600 plasmo-text-white plasmo-rounded-lg plasmo-py-2.5 plasmo-px-4 plasmo-text-sm plasmo-font-medium hover:plasmo-bg-indigo-700 plasmo-transition-colors plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2">
                <Search size={16} />
                Analyze This Page
              </button>
              <button
                onClick={openDashboard}
                className="plasmo-w-full plasmo-bg-white plasmo-text-gray-700 plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-py-2.5 plasmo-px-4 plasmo-text-sm plasmo-font-medium hover:plasmo-bg-gray-50 plasmo-transition-colors plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2">
                <ExternalLink size={16} />
                Open Dashboard
              </button>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="plasmo-border-t plasmo-border-gray-100 plasmo-px-4 plasmo-py-2 plasmo-text-center">
        <p className="plasmo-text-[10px] plasmo-text-gray-400">
          ApplyPilot v1.0.0
        </p>
      </div>
    </div>
  );
}

export default Popup;
