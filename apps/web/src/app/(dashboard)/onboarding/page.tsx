"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Rocket,
  ArrowRight,
  ArrowLeft,
  User,
  FileText,
  Sparkles,
  Target,
  CheckCircle2,
  SkipForward,
  MapPin,
} from "lucide-react";

const POPULAR_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Python",
  "Java",
  "SQL",
  "Node.js",
  "AWS",
  "Docker",
  "Git",
  "CSS",
  "HTML",
  "GraphQL",
  "REST APIs",
  "PostgreSQL",
  "MongoDB",
  "Kubernetes",
  "CI/CD",
  "Agile",
  "Product Management",
  "Data Analysis",
  "Machine Learning",
  "Figma",
];

const POPULAR_ROLES = [
  "Software Engineer",
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Product Manager",
  "Data Scientist",
  "Data Engineer",
  "DevOps Engineer",
  "UX Designer",
  "Engineering Manager",
  "Solutions Architect",
  "QA Engineer",
  "Mobile Developer",
  "ML Engineer",
  "Technical Writer",
  "Security Engineer",
];

const REMOTE_OPTIONS = [
  { value: "remote", label: "Remote Only" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
  { value: "flexible", label: "Flexible" },
];

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [remotePreference, setRemotePreference] = useState("remote");
  const [resumeText, setResumeText] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const toggleRole = (role: string) => {
    setTargetRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const saveStep = async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Allow continue even if save fails
    } finally {
      setSaving(false);
    }
  };

  const next = async () => {
    if (step === 2) {
      await saveStep({ headline, location, remotePreference });
    } else if (step === 3 && resumeText.trim()) {
      // Save resume text via resumes API
      try {
        await fetch("/api/resumes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "My Resume",
            rawText: resumeText,
            content: {
              personalInfo: { name: "", email: "" },
              experiences: [],
              education: [],
              skills: [],
            },
            isBase: true,
          }),
        });
      } catch {
        // Allow continue
      }
    } else if (step === 4) {
      await saveStep({ skills });
    } else if (step === 5) {
      await saveStep({ preferredJobTitles: targetRoles });
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const skip = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1: Welcome */}
      {step === 1 && (
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto">
              <Rocket className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to ApplyPilot!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
              Let&apos;s set up your profile in about 2 minutes so we can help
              you land your dream job.
            </p>
            <Button
              size="lg"
              onClick={next}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Basic Info */}
      {step === 2 && (
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Basic Information</h2>
                <p className="text-sm text-gray-500">
                  Tell us a bit about yourself
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Professional Headline
                </label>
                <Input
                  placeholder="e.g. Senior Software Engineer at Google"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location
                </label>
                <Input
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Work Preference
                </label>
                <div className="flex flex-wrap gap-2">
                  {REMOTE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRemotePreference(opt.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        remotePreference === opt.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Resume */}
      {step === 3 && (
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Resume</h2>
                <p className="text-sm text-gray-500">
                  Paste your resume text so we can analyze it
                </p>
              </div>
            </div>

            <Textarea
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[250px] font-mono text-sm"
            />
            <p className="text-xs text-gray-400">
              We&apos;ll use this to auto-fill your profile, match you with
              jobs, and score your resume against postings.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Skills */}
      {step === 4 && (
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Your Skills</h2>
                <p className="text-sm text-gray-500">
                  Select your key skills or add your own
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    skills.includes(skill)
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {skills.includes(skill) && (
                    <CheckCircle2 className="h-3 w-3 inline mr-1" />
                  )}
                  {skill}
                </button>
              ))}
            </div>

            {skills.length > 0 && (
              <p className="text-sm text-gray-500">
                {skills.length} skill{skills.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Target Roles */}
      {step === 5 && (
        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Target Roles</h2>
                <p className="text-sm text-gray-500">
                  What positions are you looking for?
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {POPULAR_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    targetRoles.includes(role)
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {targetRoles.includes(role) && (
                    <CheckCircle2 className="h-3 w-3 inline mr-1" />
                  )}
                  {role}
                </button>
              ))}
            </div>

            {targetRoles.length > 0 && (
              <p className="text-sm text-gray-500">
                {targetRoles.length} role{targetRoles.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 6: Done */}
      {step === 6 && (
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">You&apos;re All Set!</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
              Your profile is ready. Start exploring jobs and let ApplyPilot
              help you stand out.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/quick-apply")}
              >
                Quick Apply to Your First Job
                <Sparkles className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {step > 1 && step < 6 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="ghost" onClick={prev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={skip} className="text-gray-400">
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
            <Button
              onClick={next}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? "Saving..." : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
