"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Pencil,
  Target,
  Loader2,
} from "lucide-react";

interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experiences: {
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    bullets: string[];
    keywords: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
    gpa?: string;
  }[];
  skills: string[];
  certifications?: string[];
  projects?: { name: string; description: string; url?: string }[];
}

interface ResumeData {
  id: string;
  name: string;
  content: ResumeContent;
  isBase: boolean;
  tags: string[];
  atsScore?: number;
  createdAt: string;
}

export default function ResumeViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/resumes");
        if (res.ok) {
          const data = await res.json();
          const found = (data.resumes || []).find(
            (r: ResumeData) => r.id === id
          );
          setResume(found || null);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleDownload = () => {
    window.open(`/api/resumes/${id}/pdf`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Resume not found</p>
        <Button variant="outline" onClick={() => router.push("/resumes")}>
          Back to Resumes
        </Button>
      </div>
    );
  }

  const content = resume.content;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/resumes")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{resume.name}</h1>
              {resume.isBase && <Badge variant="purple">Base</Badge>}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Created{" "}
              {resume.createdAt
                ? new Date(resume.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/quick-apply")}
          >
            <Target className="h-4 w-4 mr-2" />
            Tailor for Job
          </Button>
          <Button onClick={() => router.push("/resumes/new")}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {resume.atsScore && (
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-xl font-bold text-green-700 dark:text-green-400">
                {resume.atsScore}
              </span>
            </div>
            <div>
              <p className="font-semibold">ATS Score</p>
              <p className="text-sm text-gray-500">
                This resume has been scored for ATS compatibility
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {resume.tags && resume.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {resume.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Resume Content */}
      <Card>
        <CardContent className="p-8 max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-900 dark:border-gray-100 pb-4 mb-6">
            <h2 className="text-2xl font-bold tracking-wide">
              {content.personalInfo.name}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap items-center justify-center gap-x-2">
              {content.personalInfo.email && (
                <span>{content.personalInfo.email}</span>
              )}
              {content.personalInfo.phone && (
                <>
                  <span>|</span>
                  <span>{content.personalInfo.phone}</span>
                </>
              )}
              {content.personalInfo.location && (
                <>
                  <span>|</span>
                  <span>{content.personalInfo.location}</span>
                </>
              )}
              {content.personalInfo.linkedin && (
                <>
                  <span>|</span>
                  <span>{content.personalInfo.linkedin}</span>
                </>
              )}
              {content.personalInfo.website && (
                <>
                  <span>|</span>
                  <span>{content.personalInfo.website}</span>
                </>
              )}
            </div>
          </div>

          {/* Summary */}
          {content.summary && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
                Summary
              </h3>
              <p className="text-sm italic text-gray-600 dark:text-gray-400">
                {content.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {content.experiences && content.experiences.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
                Experience
              </h3>
              <div className="space-y-4">
                {content.experiences.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-semibold">{exp.title}</span>
                        <span className="text-gray-500"> | {exp.company}</span>
                      </div>
                      <span className="text-sm text-gray-400 whitespace-nowrap">
                        {exp.startDate}
                        {exp.current
                          ? " - Present"
                          : exp.endDate
                            ? ` - ${exp.endDate}`
                            : ""}
                      </span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-5 mt-1 space-y-1">
                        {exp.bullets.map((b, j) => (
                          <li
                            key={j}
                            className="text-sm text-gray-600 dark:text-gray-400"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {content.education && content.education.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
                Education
              </h3>
              <div className="space-y-3">
                {content.education.map((edu, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold">
                        {edu.degree}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </span>
                      <span className="text-sm text-gray-400">
                        {edu.graduationDate}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {edu.institution}
                      {edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {content.skills && content.skills.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
                Skills
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {content.skills.join(" \u2022 ")}
              </p>
            </section>
          )}

          {/* Projects */}
          {content.projects && content.projects.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
                Projects
              </h3>
              <div className="space-y-2">
                {content.projects.map((proj, i) => (
                  <div key={i}>
                    <span className="font-semibold text-sm">{proj.name}</span>
                    {proj.url && (
                      <span className="text-sm text-blue-500 ml-2">
                        {proj.url}
                      </span>
                    )}
                    <p className="text-sm text-gray-500">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {content.certifications && content.certifications.length > 0 && (
            <section className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 dark:border-gray-700 pb-1 mb-3">
                Certifications
              </h3>
              <ul className="list-disc list-outside ml-5">
                {content.certifications.map((cert, i) => (
                  <li
                    key={i}
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    {cert}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
