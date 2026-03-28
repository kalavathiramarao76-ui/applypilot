"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Trash2,
  Sparkles,
  Save,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  X,
  Loader2,
} from "lucide-react";

interface ExperienceEntry {
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
  keywords: string[];
}

interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa: string;
}

interface ProjectEntry {
  name: string;
  description: string;
  url: string;
}

interface ResumeForm {
  name: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experiences: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
  projects: ProjectEntry[];
  isBase: boolean;
  tags: string[];
}

const emptyExperience: ExperienceEntry = {
  company: "",
  title: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: [""],
  keywords: [],
};

const emptyEducation: EducationEntry = {
  institution: "",
  degree: "",
  field: "",
  graduationDate: "",
  gpa: "",
};

const emptyProject: ProjectEntry = {
  name: "",
  description: "",
  url: "",
};

export default function NewResumePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [enhancingBullet, setEnhancingBullet] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [certInput, setCertInput] = useState("");

  const [form, setForm] = useState<ResumeForm>({
    name: "",
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experiences: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
    skills: [],
    certifications: [],
    projects: [],
    isBase: true,
    tags: [],
  });

  const updatePersonalInfo = useCallback(
    (field: keyof ResumeForm["personalInfo"], value: string) => {
      setForm((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
    },
    []
  );

  const updateExperience = useCallback(
    (index: number, field: keyof ExperienceEntry, value: unknown) => {
      setForm((prev) => {
        const exps = [...prev.experiences];
        exps[index] = { ...exps[index], [field]: value };
        if (field === "current" && value === true) {
          exps[index].endDate = "";
        }
        return { ...prev, experiences: exps };
      });
    },
    []
  );

  const addExperience = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { ...emptyExperience }],
    }));
  }, []);

  const removeExperience = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  }, []);

  const addBullet = useCallback((expIndex: number) => {
    setForm((prev) => {
      const exps = [...prev.experiences];
      exps[expIndex] = {
        ...exps[expIndex],
        bullets: [...exps[expIndex].bullets, ""],
      };
      return { ...prev, experiences: exps };
    });
  }, []);

  const updateBullet = useCallback(
    (expIndex: number, bulletIndex: number, value: string) => {
      setForm((prev) => {
        const exps = [...prev.experiences];
        const bullets = [...exps[expIndex].bullets];
        bullets[bulletIndex] = value;
        exps[expIndex] = { ...exps[expIndex], bullets };
        return { ...prev, experiences: exps };
      });
    },
    []
  );

  const removeBullet = useCallback((expIndex: number, bulletIndex: number) => {
    setForm((prev) => {
      const exps = [...prev.experiences];
      exps[expIndex] = {
        ...exps[expIndex],
        bullets: exps[expIndex].bullets.filter((_, i) => i !== bulletIndex),
      };
      return { ...prev, experiences: exps };
    });
  }, []);

  const moveBullet = useCallback(
    (expIndex: number, bulletIndex: number, direction: "up" | "down") => {
      setForm((prev) => {
        const exps = [...prev.experiences];
        const bullets = [...exps[expIndex].bullets];
        const target = direction === "up" ? bulletIndex - 1 : bulletIndex + 1;
        if (target < 0 || target >= bullets.length) return prev;
        [bullets[bulletIndex], bullets[target]] = [
          bullets[target],
          bullets[bulletIndex],
        ];
        exps[expIndex] = { ...exps[expIndex], bullets };
        return { ...prev, experiences: exps };
      });
    },
    []
  );

  const enhanceBullet = useCallback(
    async (expIndex: number, bulletIndex: number) => {
      const exp = form.experiences[expIndex];
      const bullet = exp.bullets[bulletIndex];
      if (!bullet.trim()) return;

      const key = `${expIndex}-${bulletIndex}`;
      setEnhancingBullet(key);

      try {
        const res = await fetch("/api/ai/enhance-bullet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bullet,
            context: { title: exp.title, company: exp.company },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.enhanced) {
            updateBullet(expIndex, bulletIndex, data.enhanced);
          }
        }
      } catch (err) {
        console.error("Failed to enhance bullet:", err);
      } finally {
        setEnhancingBullet(null);
      }
    },
    [form.experiences, updateBullet]
  );

  const generateSummary = useCallback(async () => {
    setGeneratingSummary(true);
    try {
      const res = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experiences: form.experiences.filter((e) => e.title || e.company),
          targetRole: form.personalInfo.name
            ? `${form.experiences[0]?.title || "Professional"}`
            : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          setForm((prev) => ({ ...prev, summary: data.summary }));
        }
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
    } finally {
      setGeneratingSummary(false);
    }
  }, [form.experiences, form.personalInfo.name]);

  const updateEducation = useCallback(
    (index: number, field: keyof EducationEntry, value: string) => {
      setForm((prev) => {
        const edus = [...prev.education];
        edus[index] = { ...edus[index], [field]: value };
        return { ...prev, education: edus };
      });
    },
    []
  );

  const addEducation = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { ...emptyEducation }],
    }));
  }, []);

  const removeEducation = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  const updateProject = useCallback(
    (index: number, field: keyof ProjectEntry, value: string) => {
      setForm((prev) => {
        const projs = [...prev.projects];
        projs[index] = { ...projs[index], [field]: value };
        return { ...prev, projects: projs };
      });
    },
    []
  );

  const addProject = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...emptyProject }],
    }));
  }, []);

  const removeProject = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }, []);

  const addSkill = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && skillInput.trim()) {
        e.preventDefault();
        if (!form.skills.includes(skillInput.trim())) {
          setForm((prev) => ({
            ...prev,
            skills: [...prev.skills, skillInput.trim()],
          }));
        }
        setSkillInput("");
      }
    },
    [skillInput, form.skills]
  );

  const removeSkill = useCallback((skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }, []);

  const addTag = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && tagInput.trim()) {
        e.preventDefault();
        if (!form.tags.includes(tagInput.trim())) {
          setForm((prev) => ({
            ...prev,
            tags: [...prev.tags, tagInput.trim()],
          }));
        }
        setTagInput("");
      }
    },
    [tagInput, form.tags]
  );

  const removeTag = useCallback((tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  const addCertification = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && certInput.trim()) {
        e.preventDefault();
        setForm((prev) => ({
          ...prev,
          certifications: [...prev.certifications, certInput.trim()],
        }));
        setCertInput("");
      }
    },
    [certInput]
  );

  const removeCertification = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Please enter a resume name");
      return;
    }
    if (!form.personalInfo.name.trim() || !form.personalInfo.email.trim()) {
      alert("Please fill in your name and email");
      return;
    }

    setSaving(true);
    try {
      const content = {
        personalInfo: form.personalInfo,
        summary: form.summary || undefined,
        experiences: form.experiences
          .filter((e) => e.title || e.company)
          .map((e) => ({
            ...e,
            bullets: e.bullets.filter((b) => b.trim()),
          })),
        education: form.education.filter((e) => e.institution || e.degree),
        skills: form.skills,
        certifications:
          form.certifications.length > 0 ? form.certifications : undefined,
        projects:
          form.projects.filter((p) => p.name).length > 0
            ? form.projects.filter((p) => p.name)
            : undefined,
      };

      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          content,
          isBase: form.isBase,
          tags: form.tags,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/resumes/${data.resume.id}`);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save resume");
      }
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/resumes")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Resume</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Build your resume with AI-powered enhancements
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Resume Name & Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resume-name">Resume Name</Label>
                <Input
                  id="resume-name"
                  placeholder="e.g., Software Engineer - Google"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is-base"
                  checked={form.isBase}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isBase: e.target.checked }))
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is-base">Set as base resume</Label>
              </div>
              <div>
                <Label>Tags (press Enter to add)</Label>
                <Input
                  placeholder="e.g., frontend, react"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                />
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {form.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    placeholder="John Doe"
                    value={form.personalInfo.name}
                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={form.personalInfo.email}
                    onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input
                    placeholder="+1 (555) 000-0000"
                    value={form.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="San Francisco, CA"
                    value={form.personalInfo.location}
                    onChange={(e) =>
                      updatePersonalInfo("location", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input
                    placeholder="linkedin.com/in/johndoe"
                    value={form.personalInfo.linkedin}
                    onChange={(e) =>
                      updatePersonalInfo("linkedin", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Website</Label>
                  <Input
                    placeholder="johndoe.com"
                    value={form.personalInfo.website}
                    onChange={(e) =>
                      updatePersonalInfo("website", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Professional Summary</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateSummary}
                  disabled={generatingSummary}
                >
                  {generatingSummary ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  Generate Summary
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="A brief professional summary..."
                rows={4}
                value={form.summary}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, summary: e.target.value }))
                }
              />
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {form.experiences.map((exp, expIdx) => (
                <div
                  key={expIdx}
                  className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Experience {expIdx + 1}
                    </span>
                    {form.experiences.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(expIdx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Job Title</Label>
                      <Input
                        placeholder="Software Engineer"
                        value={exp.title}
                        onChange={(e) =>
                          updateExperience(expIdx, "title", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Company</Label>
                      <Input
                        placeholder="Google"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(expIdx, "company", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        placeholder="Jan 2022"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(expIdx, "startDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        placeholder="Dec 2023"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) =>
                          updateExperience(expIdx, "endDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) =>
                            updateExperience(
                              expIdx,
                              "current",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300"
                        />
                        Current Role
                      </label>
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Bullet Points</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addBullet(expIdx)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Bullet
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <div className="flex flex-col gap-0.5 mt-2">
                            <button
                              onClick={() => moveBullet(expIdx, bIdx, "up")}
                              disabled={bIdx === 0}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronUp className="h-3 w-3" />
                            </button>
                            <button
                              onClick={() => moveBullet(expIdx, bIdx, "down")}
                              disabled={bIdx === exp.bullets.length - 1}
                              className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronDown className="h-3 w-3" />
                            </button>
                          </div>
                          <Input
                            className="flex-1"
                            placeholder="Describe your achievement..."
                            value={bullet}
                            onChange={(e) =>
                              updateBullet(expIdx, bIdx, e.target.value)
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0"
                            title="AI Enhance"
                            disabled={
                              enhancingBullet === `${expIdx}-${bIdx}` ||
                              !bullet.trim()
                            }
                            onClick={() => enhanceBullet(expIdx, bIdx)}
                          >
                            {enhancingBullet === `${expIdx}-${bIdx}` ? (
                              <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                            ) : (
                              <Sparkles className="h-4 w-4 text-purple-500" />
                            )}
                          </Button>
                          {exp.bullets.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-red-400 hover:text-red-600"
                              onClick={() => removeBullet(expIdx, bIdx)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.education.map((edu, eduIdx) => (
                <div
                  key={eduIdx}
                  className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Education {eduIdx + 1}
                    </span>
                    {form.education.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(eduIdx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Institution</Label>
                      <Input
                        placeholder="MIT"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(eduIdx, "institution", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Degree</Label>
                      <Input
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(eduIdx, "degree", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        placeholder="Computer Science"
                        value={edu.field}
                        onChange={(e) =>
                          updateEducation(eduIdx, "field", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Graduation Date</Label>
                      <Input
                        placeholder="May 2020"
                        value={edu.graduationDate}
                        onChange={(e) =>
                          updateEducation(
                            eduIdx,
                            "graduationDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>GPA (optional)</Label>
                      <Input
                        placeholder="3.8"
                        value={edu.gpa}
                        onChange={(e) =>
                          updateEducation(eduIdx, "gpa", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Type a skill and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
              />
              {form.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="gap-1 py-1">
                      {skill}
                      <button onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button variant="outline" size="sm" onClick={addProject}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.projects.length === 0 ? (
                <p className="text-sm text-gray-400">
                  No projects added yet. Click &quot;Add&quot; to add a project.
                </p>
              ) : (
                form.projects.map((proj, projIdx) => (
                  <div
                    key={projIdx}
                    className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">
                        Project {projIdx + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(projIdx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Project Name</Label>
                        <Input
                          placeholder="My Project"
                          value={proj.name}
                          onChange={(e) =>
                            updateProject(projIdx, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>URL (optional)</Label>
                        <Input
                          placeholder="https://github.com/..."
                          value={proj.url}
                          onChange={(e) =>
                            updateProject(projIdx, "url", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe the project..."
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(projIdx, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Type certification name and press Enter..."
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={addCertification}
              />
              {form.certifications.length > 0 && (
                <div className="space-y-2 mt-3">
                  {form.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <span className="text-sm">{cert}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(idx)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Preview Panel */}
        <div className="hidden xl:block">
          <div className="sticky top-8">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50 dark:bg-gray-900/50 border-b">
                <CardTitle className="text-sm">Live Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {/* Header */}
                  <div className="text-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                    <h2 className="text-xl font-bold mb-1">
                      {form.personalInfo.name || "Your Name"}
                    </h2>
                    <div className="text-xs text-gray-500 flex flex-wrap items-center justify-center gap-1">
                      {form.personalInfo.email && (
                        <span>{form.personalInfo.email}</span>
                      )}
                      {form.personalInfo.phone && (
                        <>
                          <span className="mx-1">|</span>
                          <span>{form.personalInfo.phone}</span>
                        </>
                      )}
                      {form.personalInfo.location && (
                        <>
                          <span className="mx-1">|</span>
                          <span>{form.personalInfo.location}</span>
                        </>
                      )}
                      {form.personalInfo.linkedin && (
                        <>
                          <span className="mx-1">|</span>
                          <span>{form.personalInfo.linkedin}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {form.summary && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                        Summary
                      </h3>
                      <p className="text-xs italic text-gray-600 dark:text-gray-400">
                        {form.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {form.experiences.some((e) => e.title || e.company) && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                        Experience
                      </h3>
                      {form.experiences
                        .filter((e) => e.title || e.company)
                        .map((exp, i) => (
                          <div key={i} className="mb-3">
                            <div className="flex justify-between items-baseline">
                              <div>
                                <span className="text-xs font-bold">
                                  {exp.title}
                                </span>
                                {exp.company && (
                                  <span className="text-xs text-gray-500">
                                    {" "}
                                    | {exp.company}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {exp.startDate}
                                {exp.current
                                  ? " - Present"
                                  : exp.endDate
                                    ? ` - ${exp.endDate}`
                                    : ""}
                              </span>
                            </div>
                            {exp.bullets.filter((b) => b.trim()).length > 0 && (
                              <ul className="list-disc list-inside mt-1 space-y-0.5">
                                {exp.bullets
                                  .filter((b) => b.trim())
                                  .map((b, j) => (
                                    <li
                                      key={j}
                                      className="text-xs text-gray-600 dark:text-gray-400"
                                    >
                                      {b}
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Education */}
                  {form.education.some(
                    (e) => e.institution || e.degree
                  ) && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                        Education
                      </h3>
                      {form.education
                        .filter((e) => e.institution || e.degree)
                        .map((edu, i) => (
                          <div key={i} className="mb-2">
                            <div className="flex justify-between items-baseline">
                              <span className="text-xs font-bold">
                                {edu.degree}
                                {edu.field ? ` in ${edu.field}` : ""}
                              </span>
                              <span className="text-xs text-gray-400">
                                {edu.graduationDate}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {edu.institution}
                              {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Skills */}
                  {form.skills.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                        Skills
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {form.skills.join(" \u2022 ")}
                      </p>
                    </div>
                  )}

                  {/* Projects */}
                  {form.projects.filter((p) => p.name).length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                        Projects
                      </h3>
                      {form.projects
                        .filter((p) => p.name)
                        .map((proj, i) => (
                          <div key={i} className="mb-2">
                            <span className="text-xs font-bold">
                              {proj.name}
                            </span>
                            {proj.url && (
                              <span className="text-xs text-blue-500 ml-2">
                                {proj.url}
                              </span>
                            )}
                            <p className="text-xs text-gray-500">
                              {proj.description}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Certifications */}
                  {form.certifications.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
                        Certifications
                      </h3>
                      <ul className="list-disc list-inside">
                        {form.certifications.map((cert, i) => (
                          <li
                            key={i}
                            className="text-xs text-gray-600 dark:text-gray-400"
                          >
                            {cert}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!form.personalInfo.name &&
                    !form.summary &&
                    form.skills.length === 0 && (
                      <p className="text-center text-xs text-gray-400 py-8">
                        Start filling in the form to see a live preview
                      </p>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
