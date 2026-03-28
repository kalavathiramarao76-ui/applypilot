"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Calendar, Target, Plus } from "lucide-react";
import { APPLICATION_STATUSES } from "@applypilot/shared";
import type { Application, Job } from "@applypilot/shared";

const statusVariantMap: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "purple"> = {
  saved: "secondary",
  applied: "default",
  screening: "purple",
  interview: "warning",
  offer: "success",
  rejected: "destructive",
  withdrawn: "outline",
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<(Application & { job?: Job | null })[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
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
    }
    load();
  }, []);

  const filtered =
    filter === "all"
      ? applications
      : applications.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track and manage all your job applications
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filtered.length} application{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {filter === "all"
                ? "No applications yet. Add a job to get started!"
                : `No applications with status "${filter}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <Card
              key={app.id}
              className="hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-800"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">
                        {app.job?.jobTitle || "Untitled Position"}
                      </h3>
                      <Badge
                        variant={statusVariantMap[app.status || "saved"] || "secondary"}
                        className="capitalize shrink-0"
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {app.job?.companyName || "Unknown"}
                      </span>
                      {app.atsScore && (
                        <span className="flex items-center gap-1">
                          <Target className="h-3.5 w-3.5" />
                          ATS: {app.atsScore}%
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="text-sm text-gray-500 truncate">{app.notes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
