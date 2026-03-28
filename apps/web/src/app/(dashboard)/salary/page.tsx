"use client";

import { useState } from "react";
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
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Copy,
  Check,
  MapPin,
  Lightbulb,
  BarChart3,
} from "lucide-react";

interface SalaryData {
  jobTitle: string;
  location: string;
  experienceLevel: string;
  salaryRange: {
    low: number;
    median: number;
    high: number;
    currency: string;
  };
  totalCompBreakdown: {
    baseSalary: string;
    annualBonus: string;
    equity: string;
    signingBonus: string;
    benefits: string;
  };
  factorsAffectingPay: {
    increase: string[];
    decrease: string[];
  };
  cityComparison: {
    city: string;
    adjustedMedian: number;
    costIndex: number;
  }[];
  negotiationTips: string[];
  marketTrend: string;
  counterOfferTemplate: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SalaryPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("mid");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SalaryData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!jobTitle.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch("/api/ai/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          location: location || undefined,
          experienceLevel,
          skills: skills
            ? skills.split(",").map((s) => s.trim())
            : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to get salary data");
      }

      const result = await res.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyTemplate = () => {
    if (data?.counterOfferTemplate) {
      navigator.clipboard.writeText(data.counterOfferTemplate);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPercentPosition = (
    value: number,
    low: number,
    high: number
  ): number => {
    if (high === low) return 50;
    return Math.min(100, Math.max(0, ((value - low) / (high - low)) * 100));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Salary Intelligence</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          AI-powered compensation analysis and negotiation toolkit
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compensation Lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input
                placeholder="e.g., Senior Software Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="e.g., San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (6-10 years)</SelectItem>
                  <SelectItem value="staff">Staff/Principal (10+ years)</SelectItem>
                  <SelectItem value="executive">Executive/Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Key Skills (comma-separated)</Label>
              <Input
                placeholder="e.g., React, TypeScript, AWS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={loading || !jobTitle.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4 mr-2" />
            )}
            Analyze Compensation
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20">
          <CardContent className="p-4 text-red-700 dark:text-red-400">
            {error}
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500">Analyzing compensation data...</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-6">
          {/* Salary Range Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Salary Range for {data.jobTitle}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                  <p className="text-sm text-gray-500">Low</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(data.salaryRange.low)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/10 ring-2 ring-green-200 dark:ring-green-800">
                  <p className="text-sm text-gray-500">Median</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(data.salaryRange.median)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
                  <p className="text-sm text-gray-500">High</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatCurrency(data.salaryRange.high)}
                  </p>
                </div>
              </div>

              {/* Visual range bar */}
              <div className="px-4">
                <div className="relative h-4 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 dark:from-blue-900 dark:via-green-900 dark:to-purple-900 rounded-full">
                  <div
                    className="absolute top-[-4px] h-6 w-1 bg-green-600 rounded-full"
                    style={{
                      left: `${getPercentPosition(data.salaryRange.median, data.salaryRange.low, data.salaryRange.high)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {formatCurrency(data.salaryRange.low)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatCurrency(data.salaryRange.high)}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  Market Trend: {data.marketTrend}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Comp Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Total Compensation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(data.totalCompBreakdown).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    baseSalary: "Base Salary",
                    annualBonus: "Annual Bonus",
                    equity: "Equity / RSU",
                    signingBonus: "Signing Bonus",
                    benefits: "Benefits Value",
                  };
                  return (
                    <div
                      key={key}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {labels[key] || key}
                      </p>
                      <p className="text-sm font-medium mt-1">{value}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400 text-base">
                  <TrendingUp className="h-5 w-5" />
                  Factors That Increase Pay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.factorsAffectingPay.increase.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowUpRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400 text-base">
                  <TrendingDown className="h-5 w-5" />
                  Factors That Decrease Pay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {data.factorsAffectingPay.decrease.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <TrendingDown className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* City Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Salary by City
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        City
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">
                        Adjusted Median
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-500">
                        Cost Index
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500 w-40">
                        Relative
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.cityComparison.map((city) => {
                      const maxMedian = Math.max(
                        ...data.cityComparison.map((c) => c.adjustedMedian)
                      );
                      const pct = (city.adjustedMedian / maxMedian) * 100;
                      return (
                        <tr
                          key={city.city}
                          className="border-b dark:border-gray-800"
                        >
                          <td className="py-3 px-4 font-medium">
                            {city.city}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            {formatCurrency(city.adjustedMedian)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Badge
                              variant="secondary"
                              className={
                                city.costIndex > 1.1
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  : city.costIndex < 0.95
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                    : ""
                              }
                            >
                              {city.costIndex.toFixed(2)}x
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <div
                                className="h-2 bg-blue-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Negotiation Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Negotiation Strategies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.negotiationTips.map((tip, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10"
                  >
                    <div className="h-6 w-6 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Counter Offer Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Counter-Offer Email Template</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyTemplate}
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 font-mono text-sm whitespace-pre-wrap">
                {data.counterOfferTemplate}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
