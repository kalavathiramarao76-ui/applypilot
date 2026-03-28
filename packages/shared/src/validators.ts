import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const profileSchema = z.object({
  fullName: z.string().min(2),
  headline: z.string().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).default([]),
  location: z.string().optional(),
  remotePreference: z.enum(["remote", "hybrid", "onsite"]).default("remote"),
  preferredJobTitles: z.array(z.string()).default([]),
  targetSalaryRange: z.object({
    min: z.number(),
    max: z.number(),
    currency: z.string().default("USD"),
  }).optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().default(false),
  bullets: z.array(z.string()),
  keywords: z.array(z.string()).default([]),
});

export const jobSchema = z.object({
  url: z.string().url().optional(),
  source: z.enum(["linkedin", "indeed", "glassdoor", "manual", "other"]).default("manual"),
  companyName: z.string().optional(),
  jobTitle: z.string().min(1),
  location: z.string().optional(),
  salaryRange: z.string().optional(),
  description: z.string().optional(),
});

export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  resumeId: z.string().uuid().optional(),
  status: z.enum(["saved", "applied", "screening", "interview", "offer", "rejected", "withdrawn"]).default("saved"),
  notes: z.string().optional(),
});

export const resumeContentSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
  }),
  summary: z.string().optional(),
  experiences: z.array(experienceSchema),
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    field: z.string(),
    graduationDate: z.string(),
    gpa: z.string().optional(),
  })),
  skills: z.array(z.string()),
  certifications: z.array(z.string()).optional(),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().optional(),
  })).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type JobInput = z.infer<typeof jobSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ResumeContentInput = z.infer<typeof resumeContentSchema>;
