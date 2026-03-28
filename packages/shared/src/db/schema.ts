import {
  pgTable,
  uuid,
  text,
  jsonb,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const applicationStatusEnum = pgEnum("application_status", [
  "saved",
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "pro",
  "premium",
]);

export const jobSourceEnum = pgEnum("job_source", [
  "linkedin",
  "indeed",
  "glassdoor",
  "manual",
  "other",
]);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  fullName: text("full_name").notNull(),
  headline: text("headline"),
  summary: text("summary"),
  skills: jsonb("skills").$type<string[]>().default([]),
  experiences: jsonb("experiences").$type<Experience[]>().default([]),
  education: jsonb("education").$type<Education[]>().default([]),
  voiceSamples: jsonb("voice_samples").$type<string[]>().default([]),
  preferredJobTitles: jsonb("preferred_job_titles").$type<string[]>().default([]),
  targetSalaryRange: jsonb("target_salary_range").$type<{ min: number; max: number; currency: string }>(),
  location: text("location"),
  remotePreference: text("remote_preference").default("remote"),
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  aiCreditsUsed: integer("ai_credits_used").default(0),
  aiCreditsResetAt: timestamp("ai_credits_reset_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const resumes = pgTable("resumes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  content: jsonb("content").$type<ResumeContent>().notNull(),
  rawText: text("raw_text"),
  isBase: boolean("is_base").default(false),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  url: text("url"),
  source: jobSourceEnum("source").default("manual"),
  companyName: text("company_name"),
  jobTitle: text("job_title").notNull(),
  location: text("location"),
  salaryRange: text("salary_range"),
  description: text("description"),
  requirements: jsonb("requirements").$type<Requirement[]>().default([]),
  keywords: jsonb("keywords").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  jobId: uuid("job_id").references(() => jobs.id),
  resumeId: uuid("resume_id").references(() => resumes.id),
  status: applicationStatusEnum("status").default("saved"),
  tailoredResume: jsonb("tailored_resume").$type<ResumeContent>(),
  coverLetter: text("cover_letter"),
  applicationAnswers: jsonb("application_answers").$type<Record<string, string>>(),
  atsScore: integer("ats_score"),
  matchScore: integer("match_score"),
  notes: text("notes"),
  appliedAt: timestamp("applied_at", { withTimezone: true }),
  interviewDates: jsonb("interview_dates").$type<string[]>().default([]),
  followUpDates: jsonb("follow_up_dates").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const aiGenerations = pgTable("ai_generations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  applicationId: uuid("application_id").references(() => applications.id),
  type: text("type").notNull(),
  input: jsonb("input"),
  output: text("output"),
  userEditedOutput: text("user_edited_output"),
  accepted: boolean("accepted"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Types
export interface Experience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  bullets: string[];
  keywords: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

export interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  certifications?: string[];
  projects?: { name: string; description: string; url?: string }[];
}

export interface Requirement {
  skill: string;
  required: boolean;
  matched: boolean;
}
