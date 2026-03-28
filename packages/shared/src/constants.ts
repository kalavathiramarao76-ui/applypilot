export const APP_NAME = "Zypply";
export const APP_DESCRIPTION = "Your AI Career Copilot";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    price: 0,
    aiCredits: 5,
    features: [
      "5 AI-tailored applications/month",
      "Basic ATS scoring",
      "Application tracker",
      "1 base resume",
    ],
  },
  pro: {
    name: "Pro",
    price: 1200, // cents
    priceId: process.env.STRIPE_PRO_PRICE_ID || "",
    aiCredits: 50,
    features: [
      "50 AI-tailored applications/month",
      "Advanced ATS scoring",
      "Cover letter generation",
      "Unlimited resumes",
      "Application analytics",
      "Chrome extension",
    ],
  },
  premium: {
    name: "Premium",
    price: 1900, // cents
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || "",
    aiCredits: -1, // unlimited
    features: [
      "Unlimited AI-tailored applications",
      "Priority AI (faster, better models)",
      "Interview prep AI",
      "Voice learning (adapts to your style)",
      "Company intelligence",
      "Priority support",
      "Everything in Pro",
    ],
  },
} as const;

export const APPLICATION_STATUSES = [
  { value: "saved", label: "Saved", color: "#6B7280" },
  { value: "applied", label: "Applied", color: "#3B82F6" },
  { value: "screening", label: "Screening", color: "#8B5CF6" },
  { value: "interview", label: "Interview", color: "#F59E0B" },
  { value: "offer", label: "Offer", color: "#10B981" },
  { value: "rejected", label: "Rejected", color: "#EF4444" },
  { value: "withdrawn", label: "Withdrawn", color: "#9CA3AF" },
] as const;
