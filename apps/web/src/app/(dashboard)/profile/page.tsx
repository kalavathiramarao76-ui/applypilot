"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus, Save } from "lucide-react";
import type { Profile } from "@applypilot/shared";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [jobTitleInput, setJobTitleInput] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user || {});
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !(profile.skills as string[] || []).includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills as string[] || []), skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile({
      ...profile,
      skills: (profile.skills as string[] || []).filter((s) => s !== skill),
    });
  };

  const addJobTitle = () => {
    if (jobTitleInput.trim() && !(profile.preferredJobTitles as string[] || []).includes(jobTitleInput.trim())) {
      setProfile({
        ...profile,
        preferredJobTitles: [
          ...(profile.preferredJobTitles as string[] || []),
          jobTitleInput.trim(),
        ],
      });
      setJobTitleInput("");
    }
  };

  const removeJobTitle = (title: string) => {
    setProfile({
      ...profile,
      preferredJobTitles: (profile.preferredJobTitles as string[] || []).filter(
        (t) => t !== title
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your professional profile
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={profile.fullName || ""}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email || ""} disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Headline</Label>
            <Input
              placeholder="e.g., Senior Full-Stack Developer"
              value={profile.headline || ""}
              onChange={(e) =>
                setProfile({ ...profile, headline: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea
              placeholder="A brief professional summary..."
              rows={4}
              value={profile.summary || ""}
              onChange={(e) =>
                setProfile({ ...profile, summary: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            />
            <Button variant="outline" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(profile.skills as string[] || []).map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => removeSkill(skill)}
              >
                {skill}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Job Titles</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a job title..."
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addJobTitle())
                }
              />
              <Button variant="outline" onClick={addJobTitle}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(profile.preferredJobTitles as string[] || []).map((title) => (
                <Badge
                  key={title}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeJobTitle(title)}
                >
                  {title}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g., San Francisco, CA"
                value={profile.location || ""}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Remote Preference</Label>
              <Select
                value={profile.remotePreference || "remote"}
                onValueChange={(v) =>
                  setProfile({ ...profile, remotePreference: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Min Salary</Label>
              <Input
                type="number"
                placeholder="80000"
                value={
                  (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.min || ""
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    targetSalaryRange: {
                      min: Number(e.target.value),
                      max:
                        (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.max || 0,
                      currency:
                        (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.currency || "USD",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Max Salary</Label>
              <Input
                type="number"
                placeholder="150000"
                value={
                  (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.max || ""
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    targetSalaryRange: {
                      min:
                        (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.min || 0,
                      max: Number(e.target.value),
                      currency:
                        (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.currency || "USD",
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={
                  (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.currency || "USD"
                }
                onValueChange={(v) =>
                  setProfile({
                    ...profile,
                    targetSalaryRange: {
                      min:
                        (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.min || 0,
                      max:
                        (profile.targetSalaryRange as { min: number; max: number; currency: string } | null)?.max || 0,
                      currency: v,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
