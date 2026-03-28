"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  Rocket,
  Briefcase,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { APPLICATION_STATUSES } from "@zypply/shared";
import type { Application, Job } from "@zypply/shared";

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
  const [searchQuery, setSearchQuery] = useState("");
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

  const filtered = applications
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (a.job?.jobTitle || "").toLowerCase().includes(q) ||
        (a.job?.companyName || "").toLowerCase().includes(q) ||
        (a.notes || "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Applications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track and manage all your job applications
          </p>
        </div>
        <Button asChild>
          <Link href="/quick-apply">
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Link>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by job title, company, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
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
        <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {filtered.length} application{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-3" />
          <p className="text-sm">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-950 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
            <Briefcase className="h-8 w-8 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {filter === "all" && !searchQuery
              ? "No applications yet"
              : "No matching applications"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-sm mx-auto">
            {filter === "all" && !searchQuery
              ? "Paste a job description and let AI tailor your resume in seconds."
              : "Try adjusting your search or filter criteria."}
          </p>
          {filter === "all" && !searchQuery && (
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg">
              <Link href="/quick-apply">
                <Rocket className="h-4 w-4 mr-2" />
                Quick Apply
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const companyInitial = (app.job?.companyName || "?")[0].toUpperCase();
            return (
              <Card
                key={app.id}
                className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 dark:hover:border-blue-800"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* Company Initial Avatar */}
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                          {companyInitial}
                        </span>
                      </div>
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
