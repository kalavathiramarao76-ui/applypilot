"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Target,
} from "lucide-react";
import type { Resume, Job } from "@applypilot/shared";

interface CategoryScore {
  score: number;
  feedback: string;
}

interface ExperienceScore {
  company: string;
  score: number;
  feedback: string;
}

interface RedFlag {
  type: string;
  title: string;
  description: string;
}

interface Suggestion {
  section: string;
  before: string;
  after: string;
  reason: string;
}

interface ScoreResult {
  overallScore: number;
  categories: Record<string, CategoryScore>;
  sections: {
    summary: CategoryScore;
    experience: ExperienceScore[];
    education: CategoryScore;
    skills: CategoryScore;
  };
  redFlags: RedFlag[];
  suggestions: Suggestion[];
}

function ScoreCircle({ score, size = 160 }: { score: number; size?: number }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "#10B981"
      : score >= 60
      ? "#F59E0B"
      : "#EF4444";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-500">out of 100</span>
      </div>
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 80
      ? "bg-green-500"
      : score >= 60
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-gray-500">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

const categoryLabels: Record<string, string> = {
  impact: "Impact & Results",
  brevity: "Brevity",
  atsCompatibility: "ATS Compatibility",
  keywords: "Keywords",
  formatting: "Formatting",
  actionVerbs: "Action Verbs",
  quantification: "Quantification",
};

export default function ScorePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const [resumeRes, jobRes] = await Promise.all([
          fetch("/api/resumes"),
          fetch("/api/jobs"),
        ]);
        if (resumeRes.ok) {
          const data = await resumeRes.json();
          setResumes(data.resumes || []);
        }
        if (jobRes.ok) {
          const data = await jobRes.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }
    load();
  }, []);

  async function scoreResume() {
    if (!selectedResume) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResume,
          jobId: selectedJob || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("Failed to score:", err);
    } finally {
      setLoading(false);
    }
  }

  function toggleSection(key: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resume Score</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Get a detailed AI-powered analysis of your resume
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Resume</label>
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target Job (optional)</label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Score against a specific job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.jobTitle} - {j.companyName || "Unknown"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={scoreResume} disabled={!selectedResume || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Score Resume
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Overall score */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <ScoreCircle score={result.overallScore} />
                <p className="text-sm font-medium mt-4 text-gray-500">Overall Score</p>
                <Badge
                  variant={
                    result.overallScore >= 80
                      ? "success"
                      : result.overallScore >= 60
                      ? "warning"
                      : "destructive"
                  }
                  className="mt-2"
                >
                  {result.overallScore >= 80
                    ? "Excellent"
                    : result.overallScore >= 60
                    ? "Good - Needs Work"
                    : "Needs Improvement"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(result.categories).map(([key, cat]) => (
                  <ScoreBar
                    key={key}
                    label={categoryLabels[key] || key}
                    score={cat.score}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Section-by-section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Section Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Summary */}
              {result.sections.summary && (
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("summary")}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      {expandedSections.has("summary") ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium text-sm">Summary</span>
                    </div>
                    <Badge variant={result.sections.summary.score >= 70 ? "success" : "warning"}>
                      {result.sections.summary.score}/100
                    </Badge>
                  </button>
                  {expandedSections.has("summary") && (
                    <div className="px-4 pb-3 pt-1 text-sm text-gray-600 dark:text-gray-400 border-t">
                      {result.sections.summary.feedback}
                    </div>
                  )}
                </div>
              )}

              {/* Experience */}
              {result.sections.experience?.map((exp, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection(`exp-${i}`)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      {expandedSections.has(`exp-${i}`) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium text-sm">{exp.company}</span>
                    </div>
                    <Badge variant={exp.score >= 70 ? "success" : "warning"}>
                      {exp.score}/100
                    </Badge>
                  </button>
                  {expandedSections.has(`exp-${i}`) && (
                    <div className="px-4 pb-3 pt-1 text-sm text-gray-600 dark:text-gray-400 border-t">
                      {exp.feedback}
                    </div>
                  )}
                </div>
              ))}

              {/* Education */}
              {result.sections.education && (
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("education")}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      {expandedSections.has("education") ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium text-sm">Education</span>
                    </div>
                    <Badge variant={result.sections.education.score >= 70 ? "success" : "warning"}>
                      {result.sections.education.score}/100
                    </Badge>
                  </button>
                  {expandedSections.has("education") && (
                    <div className="px-4 pb-3 pt-1 text-sm text-gray-600 dark:text-gray-400 border-t">
                      {result.sections.education.feedback}
                    </div>
                  )}
                </div>
              )}

              {/* Skills */}
              {result.sections.skills && (
                <div className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("skills")}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      {expandedSections.has("skills") ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium text-sm">Skills</span>
                    </div>
                    <Badge variant={result.sections.skills.score >= 70 ? "success" : "warning"}>
                      {result.sections.skills.score}/100
                    </Badge>
                  </button>
                  {expandedSections.has("skills") && (
                    <div className="px-4 pb-3 pt-1 text-sm text-gray-600 dark:text-gray-400 border-t">
                      {result.sections.skills.feedback}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Red flags */}
          {result.redFlags && result.redFlags.length > 0 && (
            <Card className="border-red-200 dark:border-red-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                  Red Flags ({result.redFlags.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.redFlags.map((flag, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg flex items-start gap-3 ${
                      flag.type === "error"
                        ? "bg-red-50 dark:bg-red-950/20"
                        : "bg-amber-50 dark:bg-amber-950/20"
                    }`}
                  >
                    {flag.type === "error" ? (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{flag.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                        {flag.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Fix suggestions */}
          {result.suggestions && result.suggestions.length > 0 && (
            <Card className="border-blue-200 dark:border-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Suggested Fixes ({result.suggestions.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.suggestions.map((sug, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="purple">{sug.section}</Badge>
                      <span className="text-xs text-gray-500">{sug.reason}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3">
                        <p className="text-xs font-medium text-red-600 mb-1">Before</p>
                        <p className="text-sm text-red-700 dark:text-red-300">{sug.before}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 relative">
                        <ArrowRight className="absolute -left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hidden md:block" />
                        <p className="text-xs font-medium text-green-600 mb-1">After</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{sug.after}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
