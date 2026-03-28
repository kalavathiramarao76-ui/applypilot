"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  Target,
  Building2,
  Clock,
  Loader2,
} from "lucide-react";
import type { Application, Job } from "@applypilot/shared";

interface AppWithJob extends Application {
  job?: Job | null;
}

function FunnelBar({
  label,
  count,
  total,
  color,
  prevCount,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  prevCount?: number;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const conversionRate =
    prevCount && prevCount > 0 ? Math.round((count / prevCount) * 100) : null;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-bold">{count}</span>
          {conversionRate !== null && (
            <span className="text-xs text-gray-500">({conversionRate}% conv.)</span>
          )}
        </div>
      </div>
      <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        <div
          className={`h-full ${color} rounded-lg transition-all duration-700 flex items-center justify-end pr-2`}
          style={{ width: `${Math.max(pct, 4)}%` }}
        >
          {pct > 15 && <span className="text-xs font-medium text-white">{Math.round(pct)}%</span>}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<AppWithJob[]>([]);
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
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const total = applications.length;

  // Status counts
  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    const s = a.status || "saved";
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  const saved = statusCounts["saved"] || 0;
  const applied = (statusCounts["applied"] || 0) + (statusCounts["screening"] || 0) + (statusCounts["interview"] || 0) + (statusCounts["offer"] || 0);
  const screening = (statusCounts["screening"] || 0) + (statusCounts["interview"] || 0) + (statusCounts["offer"] || 0);
  const interview = (statusCounts["interview"] || 0) + (statusCounts["offer"] || 0);
  const offer = statusCounts["offer"] || 0;

  // Applications over time (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const dailyCounts: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dailyCounts[key] = 0;
  }
  applications.forEach((a) => {
    if (a.createdAt) {
      const key = new Date(a.createdAt).toISOString().split("T")[0];
      if (dailyCounts[key] !== undefined) {
        dailyCounts[key]++;
      }
    }
  });
  const dailyData = Object.entries(dailyCounts);
  const maxDaily = Math.max(...dailyData.map(([, v]) => v), 1);

  // ATS score distribution
  const atsScores = applications.filter((a) => a.atsScore != null).map((a) => a.atsScore!);
  const atsBuckets = [0, 0, 0, 0, 0]; // 0-20, 21-40, 41-60, 61-80, 81-100
  atsScores.forEach((s) => {
    const idx = Math.min(Math.floor(s / 20), 4);
    atsBuckets[idx]++;
  });
  const maxBucket = Math.max(...atsBuckets, 1);
  const atsLabels = ["0-20", "21-40", "41-60", "61-80", "81-100"];

  // Top companies
  const companyCounts: Record<string, number> = {};
  applications.forEach((a) => {
    const name = a.job?.companyName || "Unknown";
    companyCounts[name] = (companyCounts[name] || 0) + 1;
  });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Source breakdown
  const sourceCounts: Record<string, { total: number; responded: number }> = {};
  applications.forEach((a) => {
    const source = a.job?.source || "manual";
    if (!sourceCounts[source]) sourceCounts[source] = { total: 0, responded: 0 };
    sourceCounts[source].total++;
    if (a.status && !["saved", "applied"].includes(a.status)) {
      sourceCounts[source].responded++;
    }
  });

  // Average ATS
  const avgAts =
    atsScores.length > 0
      ? Math.round(atsScores.reduce((a, b) => a + b, 0) / atsScores.length)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Insights into your job search performance
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{total}</p>
            <p className="text-xs text-gray-500 mt-1">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {total > 0 ? Math.round((interview / total) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Interview Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{offer}</p>
            <p className="text-xs text-gray-500 mt-1">Offers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600">
              {avgAts > 0 ? `${avgAts}%` : "N/A"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Avg ATS Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Application Funnel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <FunnelBar label="Saved" count={total} total={total} color="bg-gray-400" />
          <FunnelBar label="Applied" count={applied} total={total} color="bg-blue-500" prevCount={total} />
          <FunnelBar label="Screening" count={screening} total={total} color="bg-purple-500" prevCount={applied} />
          <FunnelBar label="Interview" count={interview} total={total} color="bg-amber-500" prevCount={screening} />
          <FunnelBar label="Offer" count={offer} total={total} color="bg-green-500" prevCount={interview} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications over time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Applications (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-0.5 h-40">
              {dailyData.map(([date, count]) => (
                <div
                  key={date}
                  className="flex-1 group relative"
                  title={`${date}: ${count}`}
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm transition-all hover:from-blue-400 hover:to-purple-400 min-h-[2px]"
                    style={{
                      height: `${count > 0 ? Math.max((count / maxDaily) * 100, 8) : 2}%`,
                    }}
                  />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {date}: {count}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>30 days ago</span>
              <span>Today</span>
            </div>
          </CardContent>
        </Card>

        {/* ATS Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              ATS Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {atsScores.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-400">
                No scored applications yet
              </div>
            ) : (
              <>
                <div className="flex items-end gap-3 h-40">
                  {atsBuckets.map((count, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-medium">{count}</span>
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className={`w-full rounded-t-md transition-all ${
                            i < 2
                              ? "bg-red-400"
                              : i === 2
                              ? "bg-amber-400"
                              : "bg-green-400"
                          }`}
                          style={{
                            height: `${count > 0 ? Math.max((count / maxBucket) * 100, 8) : 2}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  {atsLabels.map((label) => (
                    <div key={label} className="flex-1 text-center text-xs text-gray-400">
                      {label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Top companies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              Top Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topCompanies.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topCompanies.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate flex-1">{name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{
                            width: `${(count / (topCompanies[0]?.[1] || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Source response rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              Response Rate by Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(sourceCounts).length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(sourceCounts).map(([source, { total: t, responded }]) => {
                  const rate = t > 0 ? Math.round((responded / t) * 100) : 0;
                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium capitalize">{source}</span>
                        <span className="text-gray-500">
                          {responded}/{t} ({rate}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
