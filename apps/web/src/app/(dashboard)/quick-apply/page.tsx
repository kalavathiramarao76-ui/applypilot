"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ClipboardPaste,
  Search,
  FileText,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  Save,
  ArrowRight,
  ArrowLeft,
  Target,
  Check,
  AlertCircle,
} from "lucide-react";

interface Resume {
  id: string;
  name: string;
  isBase: boolean;
  content: unknown;
}

interface JobAnalysis {
  title: string;
  company: string;
  requirements: { skill: string; required: boolean }[];
  keywords: string[];
  salaryRange?: string;
  remoteType?: string;
  experienceLevel?: string;
}

interface TailorResult {
  tailoredResume: Record<string, unknown>;
  coverLetter: string;
  atsScore: {
    overall: number;
    keywordMatch: number;
    formatScore: number;
    missingKeywords: string[];
    matchedKeywords: string[];
    suggestions: string[];
  };
  changes: string[];
}

const steps = [
  { id: 1, label: "Paste Job", icon: ClipboardPaste },
  { id: 2, label: "Analyze", icon: Search },
  { id: 3, label: "Select Resume", icon: FileText },
  { id: 4, label: "AI Tailor", icon: Sparkles },
  { id: 5, label: "Results", icon: CheckCircle2 },
];

export default function QuickApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [tailoring, setTailoring] = useState(false);
  const [result, setResult] = useState<TailorResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  // Load resumes
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          setResumes(data.resumes || []);
        }
      } catch (err) {
        console.error("Failed to load resumes:", err);
      }
    }
    load();
  }, []);

  const analyzeJob = useCallback(async () => {
    if (!jobDescription.trim()) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: jobDescription }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysis(data);

        // Save job to DB (only fields accepted by jobSchema)
        const jobRes = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: data.title || "Untitled",
            companyName: data.company || "Unknown",
            description: jobDescription,
            source: "manual",
          }),
        });
        if (jobRes.ok) {
          const jobData = await jobRes.json();
          setJobId(jobData.job?.id || null);
        }

        setStep(2);
      }
    } catch (err) {
      console.error("Failed to analyze job:", err);
    } finally {
      setAnalyzing(false);
    }
  }, [jobDescription]);

  const tailorResume = useCallback(async () => {
    if (!jobId || !selectedResumeId) return;
    setTailoring(true);
    try {
      const res = await fetch("/api/ai/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, resumeId: selectedResumeId }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setStep(5);
      }
    } catch (err) {
      console.error("Failed to tailor resume:", err);
    } finally {
      setTailoring(false);
    }
  }, [jobId, selectedResumeId]);

  const saveApplication = useCallback(async () => {
    if (!jobId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          resumeId: selectedResumeId || undefined,
          status: "saved",
        }),
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch (err) {
      console.error("Failed to save application:", err);
    } finally {
      setSaving(false);
    }
  }, [jobId, selectedResumeId]);

  const copyToClipboard = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    []
  );

  const renderAtsScoreRing = (score: number) => {
    const color =
      score >= 80
        ? "text-green-500"
        : score >= 60
          ? "text-yellow-500"
          : "text-red-500";
    return (
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-800"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${score * 2.64} ${264 - score * 2.64}`}
              strokeLinecap="round"
              className={color}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${color}`}>{score}</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-lg">ATS Score</p>
          <p className="text-sm text-gray-500">
            {score >= 80
              ? "Excellent match"
              : score >= 60
                ? "Good match"
                : "Needs improvement"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Quick Apply</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          AI-powered resume tailoring in seconds
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between px-4">
        {steps.map((s, i) => {
          const isActive = s.id === step;
          const isCompleted = s.id < step;
          return (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1 relative">
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ${
                    isCompleted
                      ? "bg-green-500 text-white ring-green-100 dark:ring-green-900/30 shadow-md"
                      : isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white ring-blue-100 dark:ring-blue-900/30 shadow-lg scale-110"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 ring-transparent"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 transition-colors ${
                    isActive
                      ? "font-semibold text-blue-600 dark:text-blue-400"
                      : isCompleted
                        ? "font-medium text-green-600 dark:text-green-400"
                        : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-1 -mt-5">
                  <div
                    className={`h-0.5 rounded-full transition-all duration-500 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-500 to-green-400"
                        : "bg-gray-200 dark:bg-gray-800"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Paste Job Description */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardPaste className="h-5 w-5" />
              Paste Job Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={12}
              placeholder="Paste the full job description here, or a URL to the job posting..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="text-sm"
            />
            <div className="flex justify-end">
              <Button
                onClick={analyzeJob}
                disabled={!jobDescription.trim() || analyzing}
              >
                {analyzing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Analyze Job
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Job Analysis Results */}
      {step === 2 && analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Job Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-500 text-xs">Title</Label>
                <p className="font-semibold">{analysis.title}</p>
              </div>
              <div>
                <Label className="text-gray-500 text-xs">Company</Label>
                <p className="font-semibold">{analysis.company}</p>
              </div>
              {analysis.salaryRange && (
                <div>
                  <Label className="text-gray-500 text-xs">Salary</Label>
                  <p className="font-semibold">{analysis.salaryRange}</p>
                </div>
              )}
              {analysis.remoteType && (
                <div>
                  <Label className="text-gray-500 text-xs">Work Type</Label>
                  <Badge variant="secondary" className="capitalize">
                    {analysis.remoteType}
                  </Badge>
                </div>
              )}
              {analysis.experienceLevel && (
                <div>
                  <Label className="text-gray-500 text-xs">Level</Label>
                  <Badge variant="purple" className="capitalize">
                    {analysis.experienceLevel}
                  </Badge>
                </div>
              )}
            </div>

            {/* Requirements */}
            {analysis.requirements.length > 0 && (
              <div>
                <Label className="text-gray-500 text-xs">Requirements</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {analysis.requirements.map((req, i) => (
                    <Badge
                      key={i}
                      variant={req.required ? "default" : "outline"}
                    >
                      {req.skill}
                      {req.required && " *"}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {analysis.keywords.length > 0 && (
              <div>
                <Label className="text-gray-500 text-xs">
                  ATS Keywords
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysis.keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep(3)}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Resume */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Select Base Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-gray-500 mb-4">
                  No resumes found. Create one first.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/resumes/new")}
                >
                  Create Resume
                </Button>
              </div>
            ) : (
              <>
                <Select
                  value={selectedResumeId}
                  onValueChange={setSelectedResumeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a resume..." />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} {r.isBase ? "(Base)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      setStep(4);
                      tailorResume();
                    }}
                    disabled={!selectedResumeId}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Tailor Resume
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Processing */}
      {step === 4 && tailoring && (
        <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-lg">
          <CardContent className="py-20 text-center space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-spin opacity-20 blur-sm" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
              <div className="absolute inset-3 rounded-full bg-white dark:bg-gray-950 flex items-center justify-center shadow-inner">
                <Sparkles className="h-7 w-7 text-purple-500 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI is working its magic
              </h3>
              <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                Tailoring your resume, generating a cover letter, and scoring ATS
                compatibility...
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              This usually takes 15-30 seconds
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Results */}
      {step === 5 && result && (
        <div className="space-y-6">
          {/* ATS Score */}
          <Card className="shadow-lg border-2 border-blue-100 dark:border-blue-900/30 overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" />
              <div className="relative flex items-start justify-between">
                {renderAtsScoreRing(result.atsScore.overall)}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-900/60 shadow-sm">
                    <p className="text-2xl font-bold text-blue-600">
                      {result.atsScore.keywordMatch}%
                    </p>
                    <p className="text-xs text-gray-500">Keyword Match</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white/60 dark:bg-gray-900/60 shadow-sm">
                    <p className="text-2xl font-bold text-purple-600">
                      {result.atsScore.formatScore}%
                    </p>
                    <p className="text-xs text-gray-500">Format Score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-5 w-5" />
                Keyword Match Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-green-600 text-xs flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    Matched Keywords
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.atsScore.matchedKeywords.map((kw, i) => (
                      <Badge key={i} variant="success" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                    {result.atsScore.matchedKeywords.length === 0 && (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-red-600 text-xs flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Missing Keywords
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {result.atsScore.missingKeywords.map((kw, i) => (
                      <Badge
                        key={i}
                        variant="destructive"
                        className="text-xs"
                      >
                        {kw}
                      </Badge>
                    ))}
                    {result.atsScore.missingKeywords.length === 0 && (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {result.atsScore.suggestions.length > 0 && (
                <div className="mt-4">
                  <Label className="text-xs">Suggestions</Label>
                  <ul className="mt-1 space-y-1">
                    {result.atsScore.suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                      >
                        <span className="text-blue-500 mt-1">&#8226;</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Changes Made */}
          {result.changes && result.changes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Changes Made</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {result.changes.map((c, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                    >
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Cover Letter */}
          {result.coverLetter && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Cover Letter</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.coverLetter)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {result.coverLetter}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tailored Resume Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Tailored Resume</CardTitle>
                <Button variant="outline" size="sm" onClick={() => {
                  const blob = new Blob([JSON.stringify(result.tailoredResume, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "tailored-resume.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg text-sm max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words">
                  {JSON.stringify(result.tailoredResume, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Try Different Resume
            </Button>
            <div className="flex gap-2">
              {saved ? (
                <Button variant="outline" disabled>
                  <Check className="h-4 w-4 mr-2" />
                  Saved to Tracker
                </Button>
              ) : (
                <Button onClick={saveApplication} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Application
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/board")}
              >
                View Board
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
