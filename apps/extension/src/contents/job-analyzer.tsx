import type { PlasmoCSConfig } from "plasmo";
import React, { useCallback, useEffect, useState } from "react";
import {
  X,
  FileText,
  Sparkles,
  Loader2,
  Download,
  BookOpen,
  Copy,
  Check,
  RefreshCw,
  Minus,
  ChevronRight,
  BarChart3
} from "lucide-react";

import { api } from "~lib/api";
import type { JobData } from "~lib/extractors";
import { AtsScoreCircle } from "~components/AtsScoreCircle";
import { KeywordList } from "~components/KeywordList";
import { JobCard } from "~components/JobCard";

import cssText from "data-text:~style.css";

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.linkedin.com/jobs/*",
    "https://www.indeed.com/*",
    "https://www.glassdoor.com/*",
    "https://www.glassdoor.co.uk/*"
  ]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const getRootContainer = () => {
  const container = document.createElement("div");
  container.id = "applypilot-analyzer-root";
  document.body.appendChild(container);
  return container;
};

type TabId = "analysis" | "tailor" | "cover";

interface Resume {
  id: string;
  name: string;
}

interface Requirement {
  skill: string;
  required: boolean;
  match?: "matched" | "missing" | "partial";
}

interface AnalysisResult {
  atsScore?: {
    overall: number;
    breakdown?: {
      format: number;
      keywords: number;
      experience: number;
      skills: number;
    };
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  };
  analysis?: {
    title: string;
    company: string;
    requirements: Requirement[];
    keywords: string[];
    experienceLevel?: string;
    remoteType?: string;
  };
}

const TAB_CONFIG = [
  { id: "analysis" as TabId, label: "Analysis", icon: BarChart3 },
  { id: "tailor" as TabId, label: "Tailor", icon: FileText },
  { id: "cover" as TabId, label: "Cover Letter", icon: BookOpen }
];

function BreakdownBar({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="plasmo-space-y-1">
      <div className="plasmo-flex plasmo-justify-between plasmo-items-center">
        <span className="plasmo-text-[11px] plasmo-text-gray-600 plasmo-font-medium">
          {label}
        </span>
        <span className="plasmo-text-[11px] plasmo-font-bold plasmo-text-gray-700">
          {value}%
        </span>
      </div>
      <div className="plasmo-w-full plasmo-h-1.5 plasmo-bg-gray-100 plasmo-rounded-full plasmo-overflow-hidden">
        <div
          className="plasmo-h-full plasmo-rounded-full plasmo-transition-all plasmo-duration-700 plasmo-ease-out"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function RequirementItem({ req }: { req: Requirement }) {
  const matchStatus = req.match || (req.required ? "missing" : "partial");
  const icon =
    matchStatus === "matched" ? (
      <span className="plasmo-text-emerald-500 plasmo-text-xs plasmo-font-bold">
        &#10003;
      </span>
    ) : matchStatus === "missing" ? (
      <span className="plasmo-text-red-500 plasmo-text-xs plasmo-font-bold">
        &#10007;
      </span>
    ) : (
      <span className="plasmo-text-amber-500 plasmo-text-xs plasmo-font-bold">
        ~
      </span>
    );
  const bg =
    matchStatus === "matched"
      ? "plasmo-bg-emerald-50"
      : matchStatus === "missing"
        ? "plasmo-bg-red-50"
        : "plasmo-bg-amber-50";

  return (
    <li
      className={`plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-xs plasmo-text-gray-700 plasmo-py-1.5 plasmo-px-2 plasmo-rounded-lg ${bg}`}>
      <span className="plasmo-flex-shrink-0 plasmo-w-4 plasmo-text-center">
        {icon}
      </span>
      <span className="plasmo-flex-1">{req.skill}</span>
      {req.required && (
        <span className="plasmo-text-[9px] plasmo-text-red-400 plasmo-font-semibold plasmo-uppercase">
          Required
        </span>
      )}
    </li>
  );
}

function JobAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("analysis");
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [tailoredResume, setTailoredResume] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [loadingCover, setLoadingCover] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAnalyzeEvent = useCallback((e: Event) => {
    const customEvent = e as CustomEvent<JobData>;
    setJobData(customEvent.detail);
    setIsOpen(true);
    setIsMinimized(false);
    setActiveTab("analysis");
    setAnalysis(null);
    setTailoredResume(null);
    setCoverLetter(null);
    setError(null);
    setSaved(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    window.addEventListener("applypilot:analyze", handleAnalyzeEvent);
    return () => {
      window.removeEventListener("applypilot:analyze", handleAnalyzeEvent);
    };
  }, [handleAnalyzeEvent]);

  useEffect(() => {
    if (isOpen) {
      loadResumes();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && jobData) {
      runAnalysis();
    }
  }, [isOpen, jobData]);

  async function loadResumes() {
    setLoadingResumes(true);
    try {
      const data = await api.getResumes();
      if (Array.isArray(data)) {
        setResumes(data);
        if (data.length > 0 && !selectedResumeId) {
          setSelectedResumeId(data[0].id);
        }
      }
    } catch {
      // User might not be logged in
    } finally {
      setLoadingResumes(false);
    }
  }

  async function runAnalysis() {
    if (!jobData) return;
    setLoadingAnalysis(true);
    setError(null);
    try {
      const result = await api.analyzeJob({
        description: jobData.description,
        title: jobData.title,
        company: jobData.company
      });
      setAnalysis(result);
    } catch {
      setError(
        "Failed to analyze job. Please check your connection and try again."
      );
    } finally {
      setLoadingAnalysis(false);
    }
  }

  async function handleTailor() {
    if (!jobData || !selectedResumeId) return;
    setLoadingTailor(true);
    setError(null);
    try {
      const result = await api.tailorResume({
        resumeId: selectedResumeId,
        jobDescription: jobData.description,
        jobTitle: jobData.title,
        company: jobData.company
      });
      setTailoredResume(
        result.tailoredResume ||
          result.content ||
          "Resume tailored successfully."
      );
    } catch {
      setError("Failed to tailor resume. Please try again.");
    } finally {
      setLoadingTailor(false);
    }
  }

  async function handleCoverLetter() {
    if (!jobData || !selectedResumeId) return;
    setLoadingCover(true);
    setError(null);
    try {
      const result = await api.generateCoverLetter({
        resumeId: selectedResumeId,
        jobDescription: jobData.description,
        jobTitle: jobData.title,
        company: jobData.company
      });
      setCoverLetter(
        result.coverLetter || result.content || "Cover letter generated."
      );
    } catch {
      setError("Failed to generate cover letter. Please try again.");
    } finally {
      setLoadingCover(false);
    }
  }

  async function handleSaveJob() {
    if (!jobData) return;
    setSaving(true);
    try {
      await api.saveJob({
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        url: jobData.url,
        source: jobData.source
      });
      setSaved(true);
    } catch {
      setError("Failed to save job.");
    } finally {
      setSaving(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload(text: string, filename: string) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!isOpen || !jobData) return null;

  const breakdownData = analysis?.atsScore?.breakdown;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: isMinimized ? "48px" : "420px",
        zIndex: 2147483647,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}>
      <div className="plasmo-h-full plasmo-bg-white plasmo-shadow-2xl plasmo-flex plasmo-flex-col plasmo-border-l plasmo-border-gray-200 plasmo-overflow-hidden">
        {/* Header */}
        <div className="plasmo-bg-gradient-to-r plasmo-from-indigo-600 plasmo-via-indigo-700 plasmo-to-purple-700 plasmo-px-4 plasmo-py-3 plasmo-flex plasmo-items-center plasmo-justify-between plasmo-flex-shrink-0">
          {!isMinimized && (
            <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
              <div className="plasmo-bg-white/20 plasmo-rounded-lg plasmo-p-1">
                <Sparkles size={16} className="plasmo-text-white" />
              </div>
              <h2 className="plasmo-text-white plasmo-font-semibold plasmo-text-sm">
                ApplyPilot
              </h2>
            </div>
          )}
          <div className="plasmo-flex plasmo-items-center plasmo-gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="plasmo-text-white/70 hover:plasmo-text-white plasmo-transition-colors plasmo-bg-white/10 hover:plasmo-bg-white/20 plasmo-border-0 plasmo-cursor-pointer plasmo-p-1.5 plasmo-rounded-lg"
              title={isMinimized ? "Expand" : "Minimize"}>
              {isMinimized ? <ChevronRight size={14} /> : <Minus size={14} />}
            </button>
            {!isMinimized && (
              <button
                onClick={() => setIsOpen(false)}
                className="plasmo-text-white/70 hover:plasmo-text-white plasmo-transition-colors plasmo-bg-white/10 hover:plasmo-bg-white/20 plasmo-border-0 plasmo-cursor-pointer plasmo-p-1.5 plasmo-rounded-lg">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {isMinimized ? null : (
          <>
            {/* Tabs */}
            <div className="plasmo-flex plasmo-border-b plasmo-border-gray-200 plasmo-bg-gray-50 plasmo-flex-shrink-0">
              {TAB_CONFIG.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`plasmo-flex-1 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-1.5 plasmo-py-2.5 plasmo-text-xs plasmo-font-semibold plasmo-border-b-2 plasmo-transition-all plasmo-bg-transparent plasmo-cursor-pointer plasmo-border-x-0 plasmo-border-t-0 ${
                      isActive
                        ? "plasmo-border-indigo-600 plasmo-text-indigo-600 plasmo-bg-white"
                        : "plasmo-border-transparent plasmo-text-gray-500 hover:plasmo-text-gray-700"
                    }`}>
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="plasmo-flex-1 plasmo-overflow-y-auto plasmo-p-4 plasmo-space-y-4">
              {/* Error */}
              {error && (
                <div className="plasmo-bg-red-50 plasmo-border plasmo-border-red-200 plasmo-rounded-xl plasmo-p-3 plasmo-text-xs plasmo-text-red-700">
                  {error}
                </div>
              )}

              {/* ---- ANALYSIS TAB ---- */}
              {activeTab === "analysis" && (
                <>
                  {/* Job Card */}
                  <JobCard job={jobData} />

                  {/* Save Job Button */}
                  <button
                    onClick={handleSaveJob}
                    disabled={saving || saved}
                    className={`plasmo-w-full plasmo-text-xs plasmo-py-2.5 plasmo-rounded-xl plasmo-border plasmo-transition-all plasmo-cursor-pointer plasmo-font-medium ${
                      saved
                        ? "plasmo-bg-emerald-50 plasmo-text-emerald-700 plasmo-border-emerald-200"
                        : "plasmo-bg-gray-50 plasmo-text-gray-700 plasmo-border-gray-200 hover:plasmo-bg-gray-100 hover:plasmo-border-gray-300"
                    }`}>
                    {saving
                      ? "Saving..."
                      : saved
                        ? "Saved to Dashboard"
                        : "Save Job to Dashboard"}
                  </button>

                  {/* Loading Analysis */}
                  {loadingAnalysis && (
                    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-py-10 plasmo-gap-3">
                      <Loader2
                        size={32}
                        className="plasmo-text-indigo-600 plasmo-animate-spin"
                      />
                      <p className="plasmo-text-sm plasmo-text-gray-500">
                        Analyzing job posting...
                      </p>
                      <p className="plasmo-text-[10px] plasmo-text-gray-400">
                        This may take a few seconds
                      </p>
                    </div>
                  )}

                  {/* Analysis Results */}
                  {analysis && !loadingAnalysis && (
                    <>
                      {/* ATS Score */}
                      {analysis.atsScore && (
                        <div className="plasmo-bg-gradient-to-br plasmo-from-gray-50 plasmo-to-indigo-50/30 plasmo-rounded-xl plasmo-p-5 plasmo-border plasmo-border-gray-100">
                          <div className="plasmo-flex plasmo-justify-center plasmo-relative">
                            <AtsScoreCircle
                              score={analysis.atsScore.overall}
                              size={120}
                            />
                          </div>
                        </div>
                      )}

                      {/* Compatibility Breakdown */}
                      {breakdownData && (
                        <div className="plasmo-bg-white plasmo-rounded-xl plasmo-border plasmo-border-gray-200 plasmo-p-4 plasmo-space-y-3">
                          <h4 className="plasmo-text-xs plasmo-font-bold plasmo-text-gray-700 plasmo-uppercase plasmo-tracking-wide">
                            Compatibility Breakdown
                          </h4>
                          <BreakdownBar
                            label="Format"
                            value={breakdownData.format}
                            color="#6366F1"
                          />
                          <BreakdownBar
                            label="Keywords"
                            value={breakdownData.keywords}
                            color="#8B5CF6"
                          />
                          <BreakdownBar
                            label="Experience"
                            value={breakdownData.experience}
                            color="#A855F7"
                          />
                          <BreakdownBar
                            label="Skills"
                            value={breakdownData.skills}
                            color="#10B981"
                          />
                        </div>
                      )}

                      {/* Keywords */}
                      {analysis.atsScore && (
                        <div className="plasmo-bg-white plasmo-rounded-xl plasmo-border plasmo-border-gray-200 plasmo-p-4">
                          <KeywordList
                            matched={
                              analysis.atsScore.matchedKeywords || []
                            }
                            missing={
                              analysis.atsScore.missingKeywords || []
                            }
                          />
                        </div>
                      )}

                      {/* Requirements */}
                      {analysis.analysis?.requirements &&
                        analysis.analysis.requirements.length > 0 && (
                          <div className="plasmo-bg-white plasmo-rounded-xl plasmo-border plasmo-border-gray-200 plasmo-p-4">
                            <h4 className="plasmo-text-xs plasmo-font-bold plasmo-text-gray-700 plasmo-uppercase plasmo-tracking-wide plasmo-mb-2">
                              Requirements
                            </h4>
                            <ul className="plasmo-space-y-1">
                              {analysis.analysis.requirements
                                .slice(0, 10)
                                .map((req, i) => (
                                  <RequirementItem key={i} req={req} />
                                ))}
                            </ul>
                          </div>
                        )}

                      {/* Suggestions */}
                      {analysis.atsScore?.suggestions &&
                        analysis.atsScore.suggestions.length > 0 && (
                          <div className="plasmo-bg-amber-50 plasmo-rounded-xl plasmo-border plasmo-border-amber-200 plasmo-p-4">
                            <h4 className="plasmo-text-xs plasmo-font-bold plasmo-text-amber-800 plasmo-uppercase plasmo-tracking-wide plasmo-mb-2">
                              Suggestions to Improve
                            </h4>
                            <ul className="plasmo-space-y-1.5">
                              {analysis.atsScore.suggestions.map((s, i) => (
                                <li
                                  key={i}
                                  className="plasmo-text-xs plasmo-text-amber-700 plasmo-flex plasmo-gap-2">
                                  <span className="plasmo-text-amber-500 plasmo-flex-shrink-0">
                                    &#8226;
                                  </span>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </>
                  )}
                </>
              )}

              {/* ---- TAILOR TAB ---- */}
              {activeTab === "tailor" && (
                <>
                  <div className="plasmo-bg-white plasmo-rounded-xl plasmo-border plasmo-border-gray-200 plasmo-p-4 plasmo-space-y-3">
                    <h4 className="plasmo-text-sm plasmo-font-bold plasmo-text-gray-800">
                      Tailor Your Resume
                    </h4>
                    <p className="plasmo-text-xs plasmo-text-gray-500 plasmo-leading-relaxed">
                      Select a resume and we will optimize it for this specific
                      job posting using AI.
                    </p>

                    <div>
                      <label className="plasmo-text-[11px] plasmo-font-semibold plasmo-text-gray-600 plasmo-mb-1.5 plasmo-block plasmo-uppercase plasmo-tracking-wide">
                        Select Resume
                      </label>
                      {loadingResumes ? (
                        <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-xs plasmo-text-gray-400 plasmo-py-3">
                          <Loader2
                            size={14}
                            className="plasmo-animate-spin"
                          />
                          Loading resumes...
                        </div>
                      ) : resumes.length === 0 ? (
                        <div className="plasmo-text-xs plasmo-text-gray-400 plasmo-py-3 plasmo-bg-gray-50 plasmo-rounded-lg plasmo-text-center">
                          No resumes found. Upload one in the dashboard.
                        </div>
                      ) : (
                        <select
                          value={selectedResumeId}
                          onChange={(e) =>
                            setSelectedResumeId(e.target.value)
                          }
                          className="plasmo-w-full plasmo-border plasmo-border-gray-200 plasmo-rounded-xl plasmo-px-3 plasmo-py-2.5 plasmo-text-xs plasmo-bg-gray-50 plasmo-text-gray-700 plasmo-font-medium focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-indigo-500 focus:plasmo-border-indigo-500">
                          {resumes.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <button
                      onClick={handleTailor}
                      disabled={loadingTailor || !selectedResumeId}
                      className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-bg-gradient-to-r plasmo-from-indigo-600 plasmo-to-purple-600 plasmo-text-white plasmo-rounded-xl plasmo-py-3 plasmo-px-4 plasmo-text-sm plasmo-font-semibold hover:plasmo-from-indigo-700 hover:plasmo-to-purple-700 plasmo-transition-all plasmo-border-0 plasmo-cursor-pointer disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed plasmo-shadow-md plasmo-shadow-indigo-200/50">
                      {loadingTailor ? (
                        <Loader2 size={16} className="plasmo-animate-spin" />
                      ) : (
                        <FileText size={16} />
                      )}
                      {loadingTailor
                        ? "Tailoring..."
                        : "Tailor My Resume"}
                    </button>
                  </div>

                  {/* Tailored Resume Preview */}
                  {tailoredResume && (
                    <div className="plasmo-bg-white plasmo-rounded-xl plasmo-border plasmo-border-gray-200 plasmo-overflow-hidden">
                      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-px-4 plasmo-py-3 plasmo-bg-gray-50 plasmo-border-b plasmo-border-gray-100">
                        <h4 className="plasmo-text-xs plasmo-font-bold plasmo-text-gray-700 plasmo-uppercase plasmo-tracking-wide">
                          Tailored Resume
                        </h4>
                        <button
                          onClick={() =>
                            handleDownload(
                              typeof tailoredResume === "string"
                                ? tailoredResume
                                : JSON.stringify(tailoredResume, null, 2),
                              `tailored-resume-${jobData?.company || "job"}.txt`
                            )
                          }
                          className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-text-[10px] plasmo-font-semibold plasmo-text-indigo-600 hover:plasmo-text-indigo-800 plasmo-transition-colors plasmo-bg-transparent plasmo-border-0 plasmo-cursor-pointer">
                          <Download size={12} />
                          Download
                        </button>
                      </div>
                      <div className="plasmo-p-4">
                        <pre className="plasmo-text-xs plasmo-text-gray-600 plasmo-whitespace-pre-wrap plasmo-leading-relaxed plasmo-max-h-72 plasmo-overflow-y-auto plasmo-font-sans">
                          {typeof tailoredResume === "string"
                            ? tailoredResume
                            : JSON.stringify(tailoredResume, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ---- COVER LETTER TAB ---- */}
              {activeTab === "cover" && (
                <>
                  <div className="plasmo-bg-white plasmo-rounded-xl plasmo-border plasmo-border-gray-200 plasmo-p-4 plasmo-space-y-3">
                    <h4 className="plasmo-text-sm plasmo-font-bold plasmo-text-gray-800">
                      Generate Cover Letter
                    </h4>
                    <p className="plasmo-text-xs plasmo-text-gray-500 plasmo-leading-relaxed">
                      Create a personalized cover letter tailored to this job
                      and your resume.
                    </p>

                    {!coverLetter && (
                      <>
                        <div>
                          <label className="plasmo-text-[11px] plasmo-font-semibold plasmo-text-gray-600 plasmo-mb-1.5 plasmo-block plasmo-uppercase plasmo-tracking-wide">
                            Based on Resume
                          </label>
                          {loadingResumes ? (
                            <div className="plasmo-flex plasmo-items-center plasmo-gap-2 plasmo-text-xs plasmo-text-gray-400 plasmo-py-3">
                              <Loader2
                                size={14}
                                className="plasmo-animate-spin"
                              />
                              Loading resumes...
                            </div>
                          ) : resumes.length === 0 ? (
                            <div className="plasmo-text-xs plasmo-text-gray-400 plasmo-py-3 plasmo-bg-gray-50 plasmo-rounded-lg plasmo-text-center">
                              No resumes found. Upload one in the dashboard.
                            </div>
                          ) : (
                            <select
                              value={selectedResumeId}
                              onChange={(e) =>
                                setSelectedResumeId(e.target.value)
                              }
                              className="plasmo-w-full plasmo-border plasmo-border-gray-200 plasmo-rounded-xl plasmo-px-3 plasmo-py-2.5 plasmo-text-xs plasmo-bg-gray-50 plasmo-text-gray-700 plasmo-font-medium focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-indigo-500 focus:plasmo-border-indigo-500">
                              {resumes.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>

                        <button
                          onClick={handleCoverLetter}
                          disabled={loadingCover || !selectedResumeId}
                          className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-bg-gradient-to-r plasmo-from-purple-600 plasmo-to-pink-600 plasmo-text-white plasmo-rounded-xl plasmo-py-3 plasmo-px-4 plasmo-text-sm plasmo-font-semibold hover:plasmo-from-purple-700 hover:plasmo-to-pink-700 plasmo-transition-all plasmo-border-0 plasmo-cursor-pointer disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed plasmo-shadow-md plasmo-shadow-purple-200/50">
                          {loadingCover ? (
                            <Loader2
                              size={16}
                              className="plasmo-animate-spin"
                            />
                          ) : (
                            <BookOpen size={16} />
                          )}
                          {loadingCover
                            ? "Generating..."
                            : "Generate Cover Letter"}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Cover Letter Preview */}
                  {coverLetter && (
                    <div className="plasmo-bg-white plasmo-rounded-xl plasmo-border plasmo-border-gray-200 plasmo-overflow-hidden">
                      <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-px-4 plasmo-py-3 plasmo-bg-gray-50 plasmo-border-b plasmo-border-gray-100">
                        <h4 className="plasmo-text-xs plasmo-font-bold plasmo-text-gray-700 plasmo-uppercase plasmo-tracking-wide">
                          Your Cover Letter
                        </h4>
                        <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                          <button
                            onClick={() => handleCopy(coverLetter)}
                            className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-text-[10px] plasmo-font-semibold plasmo-text-indigo-600 hover:plasmo-text-indigo-800 plasmo-transition-colors plasmo-bg-transparent plasmo-border-0 plasmo-cursor-pointer">
                            {copied ? (
                              <Check size={12} />
                            ) : (
                              <Copy size={12} />
                            )}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                      <div className="plasmo-p-4">
                        <div className="plasmo-text-xs plasmo-text-gray-700 plasmo-whitespace-pre-wrap plasmo-leading-relaxed plasmo-max-h-80 plasmo-overflow-y-auto">
                          {coverLetter}
                        </div>
                      </div>
                      <div className="plasmo-px-4 plasmo-pb-4">
                        <button
                          onClick={() => {
                            setCoverLetter(null);
                            handleCoverLetter();
                          }}
                          disabled={loadingCover}
                          className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-2 plasmo-bg-gray-100 plasmo-text-gray-700 plasmo-rounded-xl plasmo-py-2.5 plasmo-px-4 plasmo-text-xs plasmo-font-semibold hover:plasmo-bg-gray-200 plasmo-transition-all plasmo-border-0 plasmo-cursor-pointer">
                          <RefreshCw size={14} />
                          Regenerate
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="plasmo-border-t plasmo-border-gray-100 plasmo-px-4 plasmo-py-2 plasmo-text-center plasmo-flex-shrink-0 plasmo-bg-gray-50">
              <p className="plasmo-text-[10px] plasmo-text-gray-400">
                Powered by ApplyPilot AI
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JobAnalyzer;
