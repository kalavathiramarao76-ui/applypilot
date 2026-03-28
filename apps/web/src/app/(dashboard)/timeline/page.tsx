"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Send,
  ArrowUpCircle,
  Calendar,
  Mail,
  Clock,
  Filter,
  Building2,
  Briefcase,
} from "lucide-react";
import type { Application, Job } from "@zypply/shared";

interface AppWithJob extends Application {
  job?: Job | null;
}

interface TimelineEvent {
  id: string;
  date: Date;
  action: string;
  jobTitle: string;
  company: string;
  details?: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ACTION_COLORS: Record<string, string> = {
  applied:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-700",
  "status-change":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-300 dark:border-purple-700",
  interview:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-700",
  "follow-up":
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700",
  saved:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-700",
};

const DOT_COLORS: Record<string, string> = {
  applied: "bg-blue-500",
  "status-change": "bg-purple-500",
  interview: "bg-green-500",
  "follow-up": "bg-amber-500",
  saved: "bg-gray-400",
};

const ACTION_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  applied: Send,
  "status-change": ArrowUpCircle,
  interview: Calendar,
  "follow-up": Mail,
  saved: Briefcase,
};

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "status-change", label: "Status Changes" },
  { value: "interview", label: "Interviews" },
  { value: "follow-up", label: "Follow-ups" },
];

export default function TimelinePage() {
  const [applications, setApplications] = useState<AppWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState<"all" | "week" | "month" | "3months">("all");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data.applications || []);
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const events = useMemo(() => {
    const evts: TimelineEvent[] = [];

    applications.forEach((app) => {
      const jobTitle = app.job?.jobTitle || "Unknown Role";
      const company = app.job?.companyName || "Unknown Company";

      // Created/saved event
      if (app.createdAt) {
        evts.push({
          id: `${app.id}-created`,
          date: new Date(app.createdAt),
          action: "saved",
          jobTitle,
          company,
          details: "Application saved",
          color: "saved",
          icon: Briefcase,
        });
      }

      // Applied event
      if (app.appliedAt) {
        evts.push({
          id: `${app.id}-applied`,
          date: new Date(app.appliedAt),
          action: "applied",
          jobTitle,
          company,
          details: `Applied${app.atsScore ? ` (ATS: ${app.atsScore}%)` : ""}`,
          color: "applied",
          icon: Send,
        });
      }

      // Status change (if not saved/applied)
      if (
        app.status &&
        !["saved", "applied"].includes(app.status) &&
        app.updatedAt
      ) {
        evts.push({
          id: `${app.id}-status`,
          date: new Date(app.updatedAt),
          action: "status-change",
          jobTitle,
          company,
          details: `Status changed to ${app.status}`,
          color: "status-change",
          icon: ArrowUpCircle,
        });
      }

      // Interview dates
      const interviews = (app.interviewDates || []) as string[];
      interviews.forEach((d, i) => {
        evts.push({
          id: `${app.id}-interview-${i}`,
          date: new Date(d),
          action: "interview",
          jobTitle,
          company,
          details: "Interview scheduled",
          color: "interview",
          icon: Calendar,
        });
      });

      // Follow-up dates
      const followUps = (app.followUpDates || []) as string[];
      followUps.forEach((d, i) => {
        evts.push({
          id: `${app.id}-followup-${i}`,
          date: new Date(d),
          action: "follow-up",
          jobTitle,
          company,
          details: "Follow-up sent",
          color: "follow-up",
          icon: Mail,
        });
      });
    });

    // Sort by date descending
    evts.sort((a, b) => b.date.getTime() - a.date.getTime());

    return evts;
  }, [applications]);

  const filteredEvents = useMemo(() => {
    let evts = events;

    // Filter by action type
    if (filter !== "all") {
      evts = evts.filter((e) => e.action === filter);
    }

    // Filter by date range
    if (dateRange !== "all") {
      const now = new Date();
      const ranges: Record<string, number> = {
        week: 7,
        month: 30,
        "3months": 90,
      };
      const days = ranges[dateRange] || 0;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      evts = evts.filter((e) => e.date >= cutoff);
    }

    return evts;
  }, [events, filter, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Application Timeline</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Your complete job search journey
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Action:</span>
              <div className="flex flex-wrap gap-1">
                {FILTER_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={filter === opt.value ? "default" : "outline"}
                    onClick={() => setFilter(opt.value)}
                    className="text-xs h-7"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Period:</span>
              <div className="flex gap-1">
                {(
                  [
                    { value: "all", label: "All Time" },
                    { value: "week", label: "Week" },
                    { value: "month", label: "Month" },
                    { value: "3months", label: "3 Months" },
                  ] as const
                ).map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={dateRange === opt.value ? "default" : "outline"}
                    onClick={() => setDateRange(opt.value)}
                    className="text-xs h-7"
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {FILTER_OPTIONS.filter((o) => o.value !== "all").map((opt) => {
          const count = events.filter((e) => e.action === opt.value).length;
          return (
            <Card key={opt.value}>
              <CardContent className="p-3 text-center">
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs text-gray-500">{opt.label}</p>
              </CardContent>
            </Card>
          );
        })}
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl font-bold">{events.length}</p>
            <p className="text-xs text-gray-500">Total Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-500">
              No events yet
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Start applying to jobs to see your timeline
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-4">
            {filteredEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="relative flex items-start gap-4 pl-2">
                  {/* Dot */}
                  <div
                    className={`relative z-10 w-9 h-9 rounded-full ${DOT_COLORS[event.color]} flex items-center justify-center shrink-0 ring-4 ring-white dark:ring-gray-900`}
                  >
                    <Icon className="h-4 w-4 text-white" />
                  </div>

                  {/* Card */}
                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-sm">
                              {event.jobTitle}
                            </h3>
                            <Badge
                              className={`text-xs capitalize ${ACTION_COLORS[event.color]}`}
                            >
                              {event.action === "status-change"
                                ? "Status Change"
                                : event.action === "follow-up"
                                ? "Follow-up"
                                : event.action}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <Building2 className="h-3 w-3" />
                            {event.company}
                          </div>
                          {event.details && (
                            <p className="text-xs text-gray-400 mt-1">
                              {event.details}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {event.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year:
                              event.date.getFullYear() !== new Date().getFullYear()
                                ? "numeric"
                                : undefined,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
