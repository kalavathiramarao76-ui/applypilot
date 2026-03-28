"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Code,
  Users,
  ChevronRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import type { Job } from "@applypilot/shared";

interface Question {
  id: number;
  question: string;
  difficulty: string;
  lookingFor: string;
  keyPoints: string[];
}

interface Evaluation {
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

interface AnswerRecord {
  answer: string;
  evaluation?: Evaluation;
}

const interviewTypes = [
  { value: "behavioral", label: "Behavioral", icon: Users, description: "STAR method questions about past experiences" },
  { value: "technical", label: "Technical", icon: Code, description: "Skills and knowledge-based questions" },
  { value: "situational", label: "Situational", icon: MessageSquare, description: "Hypothetical scenario questions" },
];

function getDifficultyColor(d: string) {
  if (d === "easy") return "success";
  if (d === "medium") return "warning";
  return "destructive";
}

function getScoreColor(s: number) {
  if (s >= 80) return "text-green-600";
  if (s >= 60) return "text-yellow-600";
  return "text-red-600";
}

export default function InterviewPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerRecord>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [expandedEval, setExpandedEval] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }
    }
    loadJobs();
  }, []);

  async function generateQuestions() {
    if (!selectedJob || !selectedType) return;
    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setCurrentQ(0);
    setShowSummary(false);
    try {
      const res = await fetch("/api/ai/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: selectedJob, type: selectedType }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error("Failed to generate questions:", err);
    } finally {
      setLoading(false);
    }
  }

  async function evaluateAnswer() {
    if (!currentAnswer.trim() || !questions[currentQ]) return;
    setEvaluating(true);
    try {
      const res = await fetch("/api/ai/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQ].question,
          answer: currentAnswer,
          jobId: selectedJob,
        }),
      });
      if (res.ok) {
        const evaluation = await res.json();
        setAnswers((prev) => ({
          ...prev,
          [currentQ]: { answer: currentAnswer, evaluation },
        }));
        setExpandedEval(currentQ);
      }
    } catch (err) {
      console.error("Failed to evaluate:", err);
    } finally {
      setEvaluating(false);
    }
  }

  function goToNext() {
    if (currentQ < questions.length - 1) {
      const next = currentQ + 1;
      setCurrentQ(next);
      setCurrentAnswer(answers[next]?.answer || "");
      setExpandedEval(null);
    } else {
      setShowSummary(true);
    }
  }

  function goToPrev() {
    if (currentQ > 0) {
      const prev = currentQ - 1;
      setCurrentQ(prev);
      setCurrentAnswer(answers[prev]?.answer || "");
      setExpandedEval(null);
    }
  }

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[Number(k)]?.evaluation
  ).length;
  const avgScore =
    answeredCount > 0
      ? Math.round(
          Object.values(answers).reduce(
            (sum, a) => sum + (a.evaluation?.score || 0),
            0
          ) / answeredCount
        )
      : 0;

  // Summary view
  if (showSummary && questions.length > 0) {
    const allStrengths: string[] = [];
    const allImprovements: string[] = [];
    Object.values(answers).forEach((a) => {
      if (a.evaluation) {
        allStrengths.push(...a.evaluation.strengths);
        allImprovements.push(...a.evaluation.improvements);
      }
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Interview Summary</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Your mock interview performance review
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className={`text-5xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</div>
              <p className="text-sm text-gray-500 mt-2">Overall Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold text-blue-600">{answeredCount}</div>
              <p className="text-sm text-gray-500 mt-2">Questions Answered</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold text-purple-600">{questions.length}</div>
              <p className="text-sm text-gray-500 mt-2">Total Questions</p>
            </CardContent>
          </Card>
        </div>

        {allStrengths.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" /> Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[...new Set(allStrengths)].slice(0, 8).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {allImprovements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="h-5 w-5" /> Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[...new Set(allImprovements)].slice(0, 8).map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Question-by-Question Breakdown</h3>
          {questions.map((q, i) => {
            const rec = answers[i];
            return (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Q{i + 1}: {q.question}</p>
                      {rec?.evaluation && (
                        <p className="text-xs text-gray-500 mt-1">
                          Score: <span className={`font-bold ${getScoreColor(rec.evaluation.score)}`}>{rec.evaluation.score}/100</span>
                        </p>
                      )}
                    </div>
                    {rec?.evaluation ? (
                      <div className={`text-2xl font-bold ${getScoreColor(rec.evaluation.score)}`}>
                        {rec.evaluation.score}
                      </div>
                    ) : (
                      <Badge variant="secondary">Skipped</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button onClick={() => { setShowSummary(false); setCurrentQ(0); setCurrentAnswer(answers[0]?.answer || ""); }}>
          Review Questions Again
        </Button>
      </div>
    );
  }

  // Setup view
  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Interview Prep</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Practice with AI-generated interview questions tailored to your target job
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Select a Job</label>
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a job from your applications" />
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

            <div>
              <label className="text-sm font-medium mb-3 block">Interview Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {interviewTypes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setSelectedType(t.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedType === t.value
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    <t.icon className={`h-6 w-6 mb-2 ${selectedType === t.value ? "text-blue-600" : "text-gray-400"}`} />
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={generateQuestions}
              disabled={!selectedJob || !selectedType || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Interview Questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Question view
  const q = questions[currentQ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Interview Prep</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Question {currentQ + 1} of {questions.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-purple-600" />
          <span className="text-sm font-medium">{answeredCount}/{questions.length} evaluated</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question dots */}
      <div className="flex gap-1.5 flex-wrap">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentQ(i);
              setCurrentAnswer(answers[i]?.answer || "");
              setExpandedEval(null);
            }}
            className={`h-3 w-3 rounded-full transition-all ${
              i === currentQ
                ? "bg-blue-600 scale-125"
                : answers[i]?.evaluation
                ? "bg-green-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Question card */}
      <Card className="border-2 border-blue-100 dark:border-blue-900/30">
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <Badge variant={getDifficultyColor(q.difficulty) as "success" | "warning" | "destructive"} className="capitalize">
              {q.difficulty}
            </Badge>
            <span className="text-xs text-gray-400">Q{q.id}</span>
          </div>
          <h2 className="text-xl font-semibold mb-4">{q.question}</h2>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
              <Target className="h-3 w-3 inline mr-1" />
              What the interviewer is looking for:
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">{q.lookingFor}</p>
          </div>
        </CardContent>
      </Card>

      {/* Answer area */}
      <div>
        <label className="text-sm font-medium mb-2 block">Your Answer</label>
        <Textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here. Use the STAR method: Situation, Task, Action, Result..."
          className="min-h-[160px]"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-400">{currentAnswer.length} characters</p>
          <Button onClick={evaluateAnswer} disabled={!currentAnswer.trim() || evaluating}>
            {evaluating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Evaluating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Evaluate My Answer
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Evaluation result */}
      {answers[currentQ]?.evaluation && (
        <Card className="border-2 border-green-100 dark:border-green-900/30">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Evaluation</h3>
              <div className={`text-3xl font-bold ${getScoreColor(answers[currentQ].evaluation!.score)}`}>
                {answers[currentQ].evaluation!.score}/100
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {answers[currentQ].evaluation!.feedback}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Strengths</p>
                <ul className="space-y-1">
                  {answers[currentQ].evaluation!.strengths.map((s, i) => (
                    <li key={i} className="text-xs flex items-start gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">Improvements</p>
                <ul className="space-y-1">
                  {answers[currentQ].evaluation!.improvements.map((s, i) => (
                    <li key={i} className="text-xs flex items-start gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setExpandedEval(expandedEval === currentQ ? null : currentQ)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {expandedEval === currentQ ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              {expandedEval === currentQ ? "Hide" : "Show"} Suggested Answer
            </button>

            {expandedEval === currentQ && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border">
                <p className="text-sm font-medium mb-2">Model Answer</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {answers[currentQ].evaluation!.suggestedAnswer}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goToPrev} disabled={currentQ === 0}>
          Previous
        </Button>
        <Button onClick={goToNext}>
          {currentQ === questions.length - 1 ? "View Summary" : "Next Question"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
