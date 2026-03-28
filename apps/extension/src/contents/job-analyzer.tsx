import type { PlasmoCSConfig } from "plasmo";
import React, { useCallback, useEffect, useState } from "react";
import {
  X,
  FileText,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen
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
    "https://www.indeed.com/*"
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

interface Resume {
  id: string;
  name: string;
}

interface AnalysisResult {
  atsScore?: {
    overall: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    suggestions: string[];
  };
  analysis?: {
    title: string;
    company: string;
    requirements: { skill: string; required: boolean }[];
    keywords: string[];
    experienceLevel?: string;
    remoteType?: string;
  };
}

function JobAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
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
  const [showTailored, setShowTailored] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAnalyzeEvent = useCallback((e: Event) => {
    const customEvent = e as CustomEvent<JobData>;
    setJobData(customEvent.detail);
    setIsOpen(true);
    setAnalysis(null);
    setTailoredResume(null);
    setCoverLetter(null);
    setError(null);
    setSaved(false);
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
    } catch (err) {
      setError("Failed to analyze job. Please check your connection and try again.");
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
      setTailoredResume(result.tailoredResume || result.content || "Resume tailored successfully.");
      setShowTailored(true);
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
      setCoverLetter(result.coverLetter || result.content || "Cover letter generated.");
      setShowCoverLetter(true);
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

  if (!isOpen || !jobData) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "400px",
        zIndex: 2147483647,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
      <div className="plasmo-h-full plasmo-bg-white plasmo-shadow-2xl plasmo-flex plasmo-flex-col plasmo-border-l plasmo-border-gray-200 plasmo-overflow-hidden">
        {/* Header */}
        <div className="plasmo-bg-gradient-to-r plasmo-from-indigo-600 plasmo-to-purple-600 plasmo-px-4 plasmo-py-3 plasmo-flex plasmo-items-center plasmo-justify-between plasmo-flex-shrink-0">
          <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
            <Sparkles size={18} className="plasmo-text-white" />
            <h2 className="plasmo-text-white plasmo-font-semibold plasmo-text-sm">
              ApplyPilot Analysis
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="plasmo-text-white/80 hover:plasmo-text-white plasmo-transition-colors plasmo-bg-transparent plasmo-border-0 plasmo-cursor-pointer plasmo-p-1 plasmo-rounded">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="plasmo-flex-1 plasmo-overflow-y-auto plasmo-p-4 plasmo-space-y-4">
          {/* Job Card */}
          <JobCard job={jobData} />

          {/* Save Job Button */}
          <button
            onClick={handleSaveJob}
            disabled={saving || saved}
            className={`plasmo-w-full plasmo-text-xs plasmo-py-2 plasmo-rounded-lg plasmo-border plasmo-transition-colors plasmo-cursor-pointer ${
              saved
                ? "plasmo-bg-green-50 plasmo-text-green-700 plasmo-border-green-200"
                : "plasmo-bg-gray-50 plasmo-text-gray-700 plasmo-border-gray-200 hover:plasmo-bg-gray-100"
            }`}>
            {saving ? "Saving..." : saved ? "Saved to Dashboard" : "Save Job to Dashboard"}
          </button>

          {/* Error */}
          {error && (
            <div className="plasmo-bg-red-50 plasmo-border plasmo-border-red-200 plasmo-rounded-lg plasmo-p-3 plasmo-text-xs plasmo-text-red-700">
              {error}
            </div>
          )}

          {/* Loading Analysis */}
          {loadingAnalysis && (
            <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-py-8 plasmo-gap-3">
              <Loader2
                size={32}
                className="plasmo-text-indigo-600 plasmo-animate-spin"
              />
              <p className="plasmo-text-sm plasmo-text-gray-500">
                Analyzing job posting...
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && !loadingAnalysis && (
            <>
              {/* ATS Score */}
              {analysis.atsScore && (
                <div className="plasmo-bg-gray-50 plasmo-rounded-lg plasmo-p-4">
                  <div className="plasmo-flex plasmo-justify-center plasmo-relative">
                    <AtsScoreCircle score={analysis.atsScore.overall} size={100} />
                  </div>
                </div>
              )}

              {/* Keywords */}
              {analysis.atsScore && (
                <div className="plasmo-bg-white plasmo-rounded-lg plasmo-border plasmo-border-gray-200 plasmo-p-3">
                  <KeywordList
                    matched={analysis.atsScore.matchedKeywords || []}
                    missing={analysis.atsScore.missingKeywords || []}
                  />
                </div>
              )}

              {/* Requirements */}
              {analysis.analysis?.requirements &&
                analysis.analysis.requirements.length > 0 && (
                  <div className="plasmo-bg-white plasmo-rounded-lg plasmo-border plasmo-border-gray-200 plasmo-p-3">
                    <h4 className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-700 plasmo-mb-2">
                      Requirements
                    </h4>
                    <ul className="plasmo-space-y-1">
                      {analysis.analysis.requirements
                        .slice(0, 8)
                        .map((req, i) => (
                          <li
                            key={i}
                            className="plasmo-text-xs plasmo-text-gray-600 plasmo-flex plasmo-items-start plasmo-gap-1.5">
                            <span
                              className={`plasmo-mt-0.5 plasmo-w-1.5 plasmo-h-1.5 plasmo-rounded-full plasmo-flex-shrink-0 ${
                                req.required
                                  ? "plasmo-bg-red-400"
                                  : "plasmo-bg-gray-300"
                              }`}
                            />
                            <span>
                              {req.skill}
                              {req.required && (
                                <span className="plasmo-text-red-500 plasmo-ml-1">
                                  *
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

              {/* Suggestions */}
              {analysis.atsScore?.suggestions &&
                analysis.atsScore.suggestions.length > 0 && (
                  <div className="plasmo-bg-amber-50 plasmo-rounded-lg plasmo-border plasmo-border-amber-200 plasmo-p-3">
                    <h4 className="plasmo-text-sm plasmo-font-semibold plasmo-text-amber-800 plasmo-mb-2">
                      Suggestions
                    </h4>
                    <ul className="plasmo-space-y-1">
                      {analysis.atsScore.suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="plasmo-text-xs plasmo-text-amber-700">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </>
          )}

          {/* Resume Selector and Actions */}
          {!loadingAnalysis && analysis && (
            <div className="plasmo-space-y-3">
              <div>
                <label className="plasmo-text-xs plasmo-font-medium plasmo-text-gray-700 plasmo-mb-1 plasmo-block">
                  Select Resume
                </label>
                {loadingResumes ? (
                  <div className="plasmo-text-xs plasmo-text-gray-400 plasmo-py-2">
                    Loading resumes...
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="plasmo-text-xs plasmo-text-gray-400 plasmo-py-2">
                    No resumes found. Upload one in the dashboard.
                  </div>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="plasmo-w-full plasmo-border plasmo-border-gray-300 plasmo-rounded-lg plasmo-px-3 plasmo-py-2 plasmo-text-xs plasmo-bg-white plasmo-text-gray-700">
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="plasmo-grid plasmo-grid-cols-2 plasmo-gap-2">
                <button
                  onClick={handleTailor}
                  disabled={loadingTailor || !selectedResumeId}
                  className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-1.5 plasmo-bg-indigo-600 plasmo-text-white plasmo-rounded-lg plasmo-py-2.5 plasmo-px-3 plasmo-text-xs plasmo-font-medium hover:plasmo-bg-indigo-700 plasmo-transition-colors plasmo-border-0 plasmo-cursor-pointer disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed">
                  {loadingTailor ? (
                    <Loader2 size={14} className="plasmo-animate-spin" />
                  ) : (
                    <FileText size={14} />
                  )}
                  Tailor Resume
                </button>
                <button
                  onClick={handleCoverLetter}
                  disabled={loadingCover || !selectedResumeId}
                  className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-1.5 plasmo-bg-purple-600 plasmo-text-white plasmo-rounded-lg plasmo-py-2.5 plasmo-px-3 plasmo-text-xs plasmo-font-medium hover:plasmo-bg-purple-700 plasmo-transition-colors plasmo-border-0 plasmo-cursor-pointer disabled:plasmo-opacity-50 disabled:plasmo-cursor-not-allowed">
                  {loadingCover ? (
                    <Loader2 size={14} className="plasmo-animate-spin" />
                  ) : (
                    <BookOpen size={14} />
                  )}
                  Cover Letter
                </button>
              </div>
            </div>
          )}

          {/* Tailored Resume Preview */}
          {tailoredResume && (
            <div className="plasmo-bg-white plasmo-rounded-lg plasmo-border plasmo-border-gray-200">
              <button
                onClick={() => setShowTailored(!showTailored)}
                className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-3 plasmo-bg-transparent plasmo-border-0 plasmo-cursor-pointer plasmo-text-left">
                <span className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-700">
                  Tailored Resume
                </span>
                {showTailored ? (
                  <ChevronUp size={16} className="plasmo-text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="plasmo-text-gray-400" />
                )}
              </button>
              {showTailored && (
                <div className="plasmo-px-3 plasmo-pb-3 plasmo-border-t plasmo-border-gray-100">
                  <pre className="plasmo-text-xs plasmo-text-gray-600 plasmo-whitespace-pre-wrap plasmo-mt-2 plasmo-max-h-60 plasmo-overflow-y-auto">
                    {typeof tailoredResume === "string"
                      ? tailoredResume
                      : JSON.stringify(tailoredResume, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Cover Letter Preview */}
          {coverLetter && (
            <div className="plasmo-bg-white plasmo-rounded-lg plasmo-border plasmo-border-gray-200">
              <button
                onClick={() => setShowCoverLetter(!showCoverLetter)}
                className="plasmo-w-full plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-3 plasmo-bg-transparent plasmo-border-0 plasmo-cursor-pointer plasmo-text-left">
                <span className="plasmo-text-sm plasmo-font-semibold plasmo-text-gray-700">
                  Cover Letter
                </span>
                {showCoverLetter ? (
                  <ChevronUp size={16} className="plasmo-text-gray-400" />
                ) : (
                  <ChevronDown size={16} className="plasmo-text-gray-400" />
                )}
              </button>
              {showCoverLetter && (
                <div className="plasmo-px-3 plasmo-pb-3 plasmo-border-t plasmo-border-gray-100">
                  <pre className="plasmo-text-xs plasmo-text-gray-600 plasmo-whitespace-pre-wrap plasmo-mt-2 plasmo-max-h-60 plasmo-overflow-y-auto">
                    {coverLetter}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="plasmo-border-t plasmo-border-gray-200 plasmo-px-4 plasmo-py-2 plasmo-text-center plasmo-flex-shrink-0">
          <p className="plasmo-text-[10px] plasmo-text-gray-400">
            Powered by ApplyPilot AI
          </p>
        </div>
      </div>
    </div>
  );
}

export default JobAnalyzer;
