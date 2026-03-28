"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Save,
  User,
  CreditCard,
  Bell,
  Database,
  Cpu,
  Link2,
  Shield,
  Download,
  Trash2,
  Check,
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  headline?: string;
  subscriptionTier?: string;
  aiCreditsUsed?: number;
  location?: string;
  remotePreference?: string;
  preferredJobTitles?: string[];
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoSaveApps, setAutoSaveApps] = useState(true);
  const [aiQuality, setAiQuality] = useState("balanced");
  const [tonePref, setTonePref] = useState("balanced");

  // Export/Delete
  const [exporting, setExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          const u = data.user;
          setProfile(u);
          setFullName(u.fullName || "");
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaved(false);
    setPasswordError("");

    if (newPassword && newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setSaving(false);
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setSaving(false);
      return;
    }

    try {
      const body: Record<string, unknown> = {};
      if (fullName !== profile?.fullName) body.fullName = fullName;
      if (newPassword) body.newPassword = newPassword;

      if (Object.keys(body).length > 0) {
        const res = await fetch("/api/auth/me", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setSaved(true);
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => setSaved(false), 3000);
        }
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "applypilot-data-export.json";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const tierCredits: Record<string, number> = {
    free: 50,
    pro: 500,
    premium: 9999,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const tier = profile?.subscriptionTier || "free";
  const creditsUsed = profile?.aiCreditsUsed || 0;
  const creditsTotal = tierCredits[tier] || 50;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your account and preferences
          </p>
        </div>
        <Button onClick={handleSaveProfile} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email || ""} disabled />
              <p className="text-xs text-gray-400">
                Email cannot be changed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          <p className="text-xs text-gray-400">
            Leave blank to keep current password
          </p>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Subscription & Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <Badge
                className={
                  tier === "premium"
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                    : tier === "pro"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : ""
                }
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </Badge>
            </div>
            {tier !== "premium" && (
              <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                Upgrade Plan
              </Button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">AI Credits Used</p>
              <p className="text-sm font-medium">
                {creditsUsed} / {creditsTotal === 9999 ? "Unlimited" : creditsTotal}
              </p>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                style={{
                  width: `${Math.min(100, (creditsUsed / creditsTotal) * 100)}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-yellow-600" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Email Notifications</p>
              <p className="text-xs text-gray-500">
                Receive reminders for follow-ups and interview prep
              </p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                emailNotifications
                  ? "bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Auto-save Applications</p>
              <p className="text-xs text-gray-500">
                Automatically save jobs you analyze
              </p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSaveApps
                  ? "bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
              onClick={() => setAutoSaveApps(!autoSaveApps)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoSaveApps ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-indigo-600" />
            AI Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>AI Quality</Label>
              <Select value={aiQuality} onValueChange={setAiQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast (uses fewer credits)</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="best">Best Quality (uses more credits)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tone Preference</Label>
              <Select value={tonePref} onValueChange={setTonePref}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-cyan-600" />
            Connected Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">in</span>
              </div>
              <div>
                <p className="text-sm font-medium">LinkedIn</p>
                <p className="text-xs text-gray-500">Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-600">GH</span>
              </div>
              <div>
                <p className="text-sm font-medium">GitHub</p>
                <p className="text-xs text-gray-500">Not connected</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-red-600" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Export All Data</p>
              <p className="text-xs text-gray-500">
                Download your profile and data as JSON
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export
            </Button>
          </div>
          <div className="border-t dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-red-600">
                  Delete Account
                </p>
                <p className="text-xs text-gray-500">
                  Permanently delete your account and all data
                </p>
              </div>
              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirm Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
