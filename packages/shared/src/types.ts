import type { InferSelectModel } from "drizzle-orm";
import type { profiles, resumes, jobs, applications, aiGenerations } from "./db/schema";

export type Profile = InferSelectModel<typeof profiles>;
export type Resume = InferSelectModel<typeof resumes>;
export type Job = InferSelectModel<typeof jobs>;
export type Application = InferSelectModel<typeof applications>;
export type AiGeneration = InferSelectModel<typeof aiGenerations>;

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatScore: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: string[];
}

export interface TailoringResult {
  tailoredResume: import("./db/schema").ResumeContent;
  coverLetter: string;
  atsScore: ATSScore;
  changes: string[];
}

export interface JobAnalysis {
  title: string;
  company: string;
  requirements: { skill: string; required: boolean }[];
  keywords: string[];
  salaryRange?: string;
  remoteType?: string;
  experienceLevel?: string;
}

export interface DashboardStats {
  totalApplications: number;
  appliedThisWeek: number;
  interviewRate: number;
  avgAtsScore: number;
  statusBreakdown: Record<string, number>;
}
