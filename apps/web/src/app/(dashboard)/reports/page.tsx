"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Flame,
  BarChart3,
  Activity,
  CheckCircle2,
  Lightbulb,
  Target,
} from "lucide-react";

interface WeeklyReport {
  period: { start: string; end: string };
  stats: {
    applicationsSent: { thisWeek: number; lastWeek: number };
    responsesReceived: { thisWeek: number; lastWeek: number };
    interviewsScheduled: { thisWeek: number; lastWeek: number };
    atsScoreTrend: { thisWeek: number | null; lastWeek: number | null };
  };
  weeklyTrend: { week: string; count: number }[];
  pipelineHealth: { growing: boolean; totalActive: number };
  streak: number;
  insights: string[];
  actionItems: string[];
}

function StatCard({
  label,
  thisWeek,
  lastWeek,
  icon: Icon,
  suffix,
}: {
  label: string;
  thisWeek: number | null;
  lastWeek: number | null;
  icon: React.ComponentType<{ className?: string }>;
  suffix?: string;
}) {
  const tw = thisWeek ?? 0;
  const lw = lastWeek ?? 0;
  const diff = tw - lw;
  const up = diff > 0;
  const same = diff === 0;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="h-5 w-5 text-gray-400" />
          {!same && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                up ? "text-green-600" : "text-red-500"
              }`}
            >
              {up ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {up ? "+" : ""}
              {diff}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold">
          {thisWeek !== null ? thisWeek : "N/A"}
          {suffix && thisWeek !== null ? suffix : ""}
        </p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reports/weekly");
        if (!res.ok) throw new Error("Failed to load report");
        const data = await res.json();
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
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

  if (error || !report) {
    return (
      <div className="text-center py-24 text-gray-500">
        <p>{error || "No report data available"}</p>
      </div>
    );
  }

  const maxTrend = Math.max(...report.weeklyTrend.map((w) => w.count), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Weekly Report</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your job search progress this week
          </p>
        </div>
        {report.streak > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-950/30 dark:to-red-950/30">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-semibold text-orange-700 dark:text-orange-400">
              {report.streak} week streak!
            </span>
          </div>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Applications Sent"
          thisWeek={report.stats.applicationsSent.thisWeek}
          lastWeek={report.stats.applicationsSent.lastWeek}
          icon={BarChart3}
        />
        <StatCard
          label="Responses"
          thisWeek={report.stats.responsesReceived.thisWeek}
          lastWeek={report.stats.responsesReceived.lastWeek}
          icon={Activity}
        />
        <StatCard
          label="Interviews"
          thisWeek={report.stats.interviewsScheduled.thisWeek}
          lastWeek={report.stats.interviewsScheduled.lastWeek}
          icon={Target}
        />
        <StatCard
          label="Avg ATS Score"
          thisWeek={report.stats.atsScoreTrend.thisWeek}
          lastWeek={report.stats.atsScoreTrend.lastWeek}
          icon={TrendingUp}
          suffix="%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Applications (Last 4 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.weeklyTrend.map((w, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {w.week}
                    </span>
                    <span className="font-semibold">{w.count}</span>
                  </div>
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                    <div
                      className={`h-full rounded-md transition-all duration-700 ${
                        i === report.weeklyTrend.length - 1
                          ? "bg-gradient-to-r from-blue-500 to-purple-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                      style={{
                        width: `${w.count > 0 ? Math.max((w.count / maxTrend) * 100, 8) : 4}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Pipeline Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div
                className={`w-4 h-4 rounded-full ${
                  report.pipelineHealth.growing
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              />
              <div>
                <p className="font-semibold">
                  {report.pipelineHealth.growing
                    ? "Pipeline Growing"
                    : "Pipeline Needs Attention"}
                </p>
                <p className="text-sm text-gray-500">
                  {report.pipelineHealth.totalActive} active applications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-2xl font-bold text-blue-600">
                  {report.stats.applicationsSent.thisWeek}
                </p>
                <p className="text-xs text-gray-500">Sent This Week</p>
              </div>
              <div className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-2xl font-bold text-green-600">
                  {report.stats.responsesReceived.thisWeek > 0 &&
                  report.stats.applicationsSent.thisWeek > 0
                    ? Math.round(
                        (report.stats.responsesReceived.thisWeek /
                          report.stats.applicationsSent.thisWeek) *
                          100
                      )
                    : 0}
                  %
                </p>
                <p className="text-xs text-gray-500">Response Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {report.insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20"
            >
              <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Action Items for Next Week
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {report.actionItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <ArrowRight className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-sm">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
