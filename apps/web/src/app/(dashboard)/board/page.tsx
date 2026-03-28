"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Calendar,
  Target,
  X,
  ChevronRight,
  Loader2,
  Mail,
  FileText,
  StickyNote,
  Trash2,
} from "lucide-react";

interface Job {
  id: string;
  jobTitle: string;
  companyName?: string;
  location?: string;
  description?: string;
  requirements?: { skill: string; required: boolean }[];
  keywords?: string[];
}

interface ApplicationData {
  id: string;
  jobId?: string;
  resumeId?: string;
  status: string;
  tailoredResume?: unknown;
  coverLetter?: string;
  atsScore?: number;
  notes?: string;
  interviewDates?: string[];
  followUpDates?: string[];
  createdAt: string;
  updatedAt?: string;
  job?: Job | null;
}

const COLUMNS = [
  { key: "saved", label: "Saved", color: "bg-gray-100 dark:bg-gray-800", border: "border-gray-300 dark:border-gray-700", headerBg: "bg-gray-50 dark:bg-gray-900" },
  { key: "applied", label: "Applied", color: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800", headerBg: "bg-blue-50 dark:bg-blue-950/50" },
  { key: "screening", label: "Screening", color: "bg-purple-50 dark:bg-purple-950/30", border: "border-purple-200 dark:border-purple-800", headerBg: "bg-purple-50 dark:bg-purple-950/50" },
  { key: "interview", label: "Interview", color: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800", headerBg: "bg-yellow-50 dark:bg-yellow-950/50" },
  { key: "offer", label: "Offer", color: "bg-green-50 dark:bg-green-950/30", border: "border-green-200 dark:border-green-800", headerBg: "bg-green-50 dark:bg-green-950/50" },
  { key: "rejected", label: "Rejected", color: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800", headerBg: "bg-red-50 dark:bg-red-950/50" },
];

const statusVariantMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "purple"
> = {
  saved: "secondary",
  applied: "default",
  screening: "purple",
  interview: "warning",
  offer: "success",
  rejected: "destructive",
};

export default function BoardPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationData | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [followUpEmail, setFollowUpEmail] = useState("");
  const [newInterviewDate, setNewInterviewDate] = useState("");

  const loadApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const updateStatus = useCallback(
    async (appId: string, newStatus: string) => {
      setUpdatingStatus(true);
      try {
        const res = await fetch(`/api/applications/${appId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          const data = await res.json();
          setApplications((prev) =>
            prev.map((a) =>
              a.id === appId
                ? { ...a, status: data.application.status, updatedAt: data.application.updatedAt }
                : a
            )
          );
          if (selectedApp?.id === appId) {
            setSelectedApp((prev) =>
              prev ? { ...prev, status: newStatus } : prev
            );
          }
        }
      } catch (err) {
        console.error("Failed to update status:", err);
      } finally {
        setUpdatingStatus(false);
      }
    },
    [selectedApp]
  );

  const saveNotes = useCallback(async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedApp.id ? { ...a, notes } : a))
        );
        setSelectedApp((prev) => (prev ? { ...prev, notes } : prev));
      }
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingNotes(false);
    }
  }, [selectedApp, notes]);

  const addInterviewDate = useCallback(async () => {
    if (!selectedApp || !newInterviewDate) return;
    const dates = [...(selectedApp.interviewDates || []), newInterviewDate];
    try {
      const res = await fetch(`/api/applications/${selectedApp.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewDates: dates }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) =>
            a.id === selectedApp.id ? { ...a, interviewDates: dates } : a
          )
        );
        setSelectedApp((prev) =>
          prev ? { ...prev, interviewDates: dates } : prev
        );
        setNewInterviewDate("");
      }
    } catch (err) {
      console.error("Failed to add interview date:", err);
    }
  }, [selectedApp, newInterviewDate]);

  const generateFollowUp = useCallback(async () => {
    if (!selectedApp?.job) return;
    setGeneratingEmail(true);
    try {
      const res = await fetch("/api/ai/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "follow_up",
          jobTitle: selectedApp.job.jobTitle,
          companyName: selectedApp.job.companyName,
          context: `Application status: ${selectedApp.status}`,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setFollowUpEmail(data.email || data.text || "");
      }
    } catch (err) {
      console.error("Failed to generate follow-up:", err);
    } finally {
      setGeneratingEmail(false);
    }
  }, [selectedApp]);

  const deleteApplication = useCallback(
    async (appId: string) => {
      if (!confirm("Are you sure you want to delete this application?")) return;
      try {
        const res = await fetch(`/api/applications/${appId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setApplications((prev) => prev.filter((a) => a.id !== appId));
          if (selectedApp?.id === appId) {
            setSelectedApp(null);
          }
        }
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    },
    [selectedApp]
  );

  const openDetail = (app: ApplicationData) => {
    setSelectedApp(app);
    setNotes(app.notes || "");
    setFollowUpEmail("");
  };

  const columnApps = (status: string) =>
    applications.filter((a) => a.status === status);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Application Board</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your applications across stages
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const apps = columnApps(col.key);
          return (
            <div
              key={col.key}
              className={`flex-shrink-0 w-72 rounded-xl border ${col.border} ${col.color} flex flex-col max-h-[calc(100vh-220px)]`}
            >
              {/* Column Header */}
              <div
                className={`px-4 py-3 rounded-t-xl ${col.headerBg} border-b ${col.border}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{col.label}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {apps.length}
                  </Badge>
                </div>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {apps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2">
                      <Building2 className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-400">
                      No applications
                    </p>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
                      Drag cards here or add new
                    </p>
                  </div>
                ) : (
                  apps.map((app) => (
                    <Card
                      key={app.id}
                      className="cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800"
                      onClick={() => openDetail(app)}
                    >
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shrink-0 text-sm font-bold text-blue-700 dark:text-blue-300">
                            {(
                              app.job?.companyName || "?"
                            )[0].toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate">
                              {app.job?.jobTitle || "Untitled"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {app.job?.companyName || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          {app.atsScore ? (
                            <Badge
                              variant={
                                app.atsScore >= 80
                                  ? "success"
                                  : app.atsScore >= 60
                                    ? "warning"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              ATS: {app.atsScore}%
                            </Badge>
                          ) : (
                            <span />
                          )}
                          <span className="text-xs text-gray-400">
                            {app.createdAt
                              ? new Date(app.createdAt).toLocaleDateString(
                                  undefined,
                                  { month: "short", day: "numeric" }
                                )
                              : ""}
                          </span>
                        </div>
                        {/* Quick Status Change */}
                        <Select
                          value={app.status}
                          onValueChange={(val) => updateStatus(app.id, val)}
                        >
                          <SelectTrigger
                            className="h-7 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COLUMNS.map((c) => (
                              <SelectItem key={c.key} value={c.key}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Slide-over */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedApp(null)}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-xl overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedApp.job?.jobTitle || "Untitled Position"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-gray-500">
                    <Building2 className="h-4 w-4" />
                    <span>
                      {selectedApp.job?.companyName || "Unknown Company"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedApp(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <Select
                  value={selectedApp.status}
                  onValueChange={(val) => updateStatus(selectedApp.id, val)}
                  disabled={updatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLUMNS.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* ATS Score */}
              {selectedApp.atsScore && (
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      ATS Score: {selectedApp.atsScore}%
                    </p>
                    <div className="w-40 h-2 bg-gray-200 dark:bg-gray-800 rounded-full mt-1">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                        style={{ width: `${selectedApp.atsScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Job Description */}
              {selectedApp.job?.description && (
                <div>
                  <Label className="flex items-center gap-1 mb-2">
                    <FileText className="h-4 w-4" />
                    Job Description
                  </Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {selectedApp.job.description}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {selectedApp.coverLetter && (
                <div>
                  <Label className="flex items-center gap-1 mb-2">
                    <Mail className="h-4 w-4" />
                    Cover Letter
                  </Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg max-h-40 overflow-y-auto whitespace-pre-wrap">
                    {selectedApp.coverLetter}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <Label className="flex items-center gap-1 mb-2">
                  <StickyNote className="h-4 w-4" />
                  Notes
                </Label>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your notes here..."
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={saveNotes}
                  disabled={savingNotes}
                >
                  {savingNotes ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : null}
                  Save Notes
                </Button>
              </div>

              {/* Interview Dates */}
              <div>
                <Label className="flex items-center gap-1 mb-2">
                  <Calendar className="h-4 w-4" />
                  Interview Dates
                </Label>
                {selectedApp.interviewDates &&
                  selectedApp.interviewDates.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {selectedApp.interviewDates.map((d, i) => (
                        <div
                          key={i}
                          className="text-sm bg-yellow-50 dark:bg-yellow-950/30 px-3 py-1.5 rounded-lg flex items-center gap-2"
                        >
                          <Calendar className="h-3.5 w-3.5 text-yellow-600" />
                          {d}
                        </div>
                      ))}
                    </div>
                  )}
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    value={newInterviewDate}
                    onChange={(e) => setNewInterviewDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addInterviewDate}
                    disabled={!newInterviewDate}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Generate Follow-up Email */}
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={generateFollowUp}
                  disabled={generatingEmail}
                >
                  {generatingEmail ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4 mr-2" />
                  )}
                  Generate Follow-up Email
                </Button>
                {followUpEmail && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Follow-up Email
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(followUpEmail)
                        }
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {followUpEmail}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Change Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {COLUMNS.filter((c) => c.key !== selectedApp.status).map(
                  (col) => (
                    <Button
                      key={col.key}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => updateStatus(selectedApp.id, col.key)}
                      disabled={updatingStatus}
                    >
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {col.label}
                    </Button>
                  )
                )}
              </div>

              {/* Delete */}
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => deleteApplication(selectedApp.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Application
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
