"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Target,
  TrendingUp,
  BookOpen,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface SkillLevel {
  skill: string;
  level: string;
  evidence: string;
}

interface RequiredSkill {
  skill: string;
  importance: string;
  gap: string;
}

interface Resource {
  name: string;
  url: string;
  type: string;
  duration: string;
}

interface Recommendation {
  skill: string;
  priority: string;
  resources: Resource[];
}

interface SkillAnalysis {
  currentSkills: SkillLevel[];
  requiredSkills: RequiredSkill[];
  recommendations: Recommendation[];
  readiness: number;
  insights: string[];
}

const levelToPercent: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 95,
};

const importanceColor: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const gapColor: Record<string, string> = {
  none: "bg-green-500",
  small: "bg-yellow-500",
  medium: "bg-orange-500",
  large: "bg-red-500",
};

const priorityColor: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function SkillsPage() {
  const [targetTitles, setTargetTitles] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [analysis, setAnalysis] = useState<SkillAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTitle = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !targetTitles.includes(trimmed)) {
      setTargetTitles([...targetTitles, trimmed]);
      setInputValue("");
    }
  };

  const removeTitle = (title: string) => {
    setTargetTitles(targetTitles.filter((t) => t !== title));
  };

  const analyze = async () => {
    if (targetTitles.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetJobTitles: targetTitles }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to analyze");
      }
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const addSkillToProfile = async (skill: string) => {
    try {
      const profileRes = await fetch("/api/profile");
      if (!profileRes.ok) return;
      const { profile } = await profileRes.json();
      const currentSkills: string[] = profile.skills || [];
      if (currentSkills.includes(skill)) return;
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills: [...currentSkills, skill] }),
      });
    } catch {
      // silent fail
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Skill Gap Analyzer</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Discover what skills you need for your target roles
        </p>
      </div>

      {/* Input section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Target Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. Senior Frontend Engineer"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTitle()}
            />
            <Button onClick={addTitle} variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {targetTitles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {targetTitles.map((title) => (
                <Badge
                  key={title}
                  variant="secondary"
                  className="px-3 py-1 text-sm flex items-center gap-1"
                >
                  {title}
                  <button onClick={() => removeTitle(title)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <Button
            onClick={analyze}
            disabled={loading || targetTitles.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Skills Gap
              </>
            )}
          </Button>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Readiness Score */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Overall Readiness</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    How prepared you are for your target roles
                  </p>
                </div>
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#readinessGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${analysis.readiness * 3.14} 314`}
                    />
                    <defs>
                      <linearGradient
                        id="readinessGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {analysis.readiness}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analysis.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 shrink-0" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Your Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.currentSkills.map((s, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{s.skill}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {s.level}
                      </Badge>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-700"
                        style={{
                          width: `${levelToPercent[s.level] || 50}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{s.evidence}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Required Skills / Gaps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  Required Skills &amp; Gaps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.requiredSkills.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${gapColor[s.gap] || "bg-gray-400"}`}
                      />
                      <span className="text-sm font-medium">{s.skill}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs capitalize ${importanceColor[s.importance] || ""}`}
                      >
                        {s.importance}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs capitalize"
                      >
                        {s.gap === "none" ? "Covered" : `${s.gap} gap`}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Learning Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Learning Path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysis.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{rec.skill}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs capitalize ${priorityColor[rec.priority] || ""}`}
                      >
                        {rec.priority} priority
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSkillToProfile(rec.skill)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to Profile
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {rec.resources.map((r, j) => (
                      <a
                        key={j}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <ArrowRight className="h-3 w-3 text-blue-600 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {r.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {r.type} &middot; {r.duration}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
