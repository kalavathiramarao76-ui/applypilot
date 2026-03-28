import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  FileText,
  Mic,
  Chrome,
  BarChart3,
  ArrowRight,
  Check,
  Upload,
  Search,
  Sparkles,
  Star,
  Zap,
  X,
  Mail,
  Globe,
  Brain,
  DollarSign,
  Users,
  ChevronDown,
  Play,
  Shield,
  Clock,
  TrendingUp,
  Rocket,
  MousePointerClick,
  Bot,
  Eye,
  Award,
  Layers,
  MessageSquare,
} from "lucide-react";
import { SUBSCRIPTION_TIERS } from "@zypply/shared";

/* ===== DATA ===== */

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    description:
      "Add your base resume once. Our AI learns your experience, skills, and writing style.",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    icon: Search,
    step: "02",
    title: "Paste Any Job",
    description:
      "Paste a job URL or description. We extract requirements, keywords, and what the company really wants.",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "Apply with Confidence",
    description:
      "Get a perfectly tailored resume, cover letter, and ATS score in seconds — not hours.",
    gradient: "from-purple-500 to-pink-500",
  },
];

const logoCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Stripe",
  "Airbnb",
];

const painPoints = [
  "Hours spent tailoring each application",
  "Generic cover letters that sound robotic",
  "No idea why you keep getting rejected",
  "Scattered tracking across spreadsheets",
  "Blind to what companies really want",
];

const benefits = [
  "AI-tailored resume in 30 seconds",
  "Personalized cover letters that convert",
  "ATS scores showing exactly what to fix",
  "One dashboard for every application",
  "Company intel + interview prep built in",
];

const testimonials = [
  {
    quote:
      "I went from mass-applying to 50 jobs a week with zero callbacks, to landing 4 interviews in my first week with Zypply. The ATS scoring alone is worth 10x the price.",
    name: "Sarah Chen",
    title: "Software Engineer",
    company: "Now at Google",
    initials: "SC",
    gradient: "from-indigo-500 to-violet-500",
  },
  {
    quote:
      "The cover letter generator is insane. It actually sounds like me, not a robot. My response rate went from 3% to 22% in one month.",
    name: "Marcus Johnson",
    title: "Product Manager",
    company: "Now at Stripe",
    initials: "MJ",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    quote:
      "As a career changer, I was struggling to position my experience. Zypply helped me reframe everything perfectly for tech roles. Landed my dream job in 6 weeks.",
    name: "Priya Patel",
    title: "Data Analyst",
    company: "Now at Netflix",
    initials: "PP",
    gradient: "from-purple-500 to-pink-500",
  },
];

const competitorFeatures = [
  { name: "ATS Scoring", ap: true, teal: true, jobscan: true, huntr: false },
  { name: "Resume Tailoring", ap: true, teal: true, jobscan: false, huntr: false },
  { name: "Cover Letters", ap: true, teal: false, jobscan: false, huntr: false },
  { name: "Interview Prep", ap: true, teal: false, jobscan: false, huntr: false },
  { name: "Company Intel", ap: true, teal: false, jobscan: false, huntr: false },
  { name: "Salary Data", ap: true, teal: false, jobscan: false, huntr: false },
  { name: "Chrome Extension", ap: true, teal: true, jobscan: true, huntr: true },
  { name: "Kanban Board", ap: true, teal: true, jobscan: false, huntr: true },
  { name: "Email Templates", ap: true, teal: false, jobscan: false, huntr: false },
  { name: "Networking Tools", ap: true, teal: false, jobscan: false, huntr: false },
];

const faqs = [
  {
    q: "What is ATS and why does it matter?",
    a: "ATS (Applicant Tracking System) is software that companies use to filter resumes before a human ever sees them. Over 75% of resumes are rejected by ATS. Zypply optimizes your resume to pass these systems and reach real recruiters.",
  },
  {
    q: "How does AI tailoring work?",
    a: "Our AI analyzes the job description to identify key requirements, skills, and keywords. It then restructures your resume to highlight relevant experience and match the language the company uses, while keeping your authentic voice.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. We use bank-level encryption (AES-256) for all data at rest and in transit. We never share your data with third parties. You can delete all your data at any time from your account settings.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time with no questions asked. You will keep access to your plan features until the end of your billing period.",
  },
  {
    q: "Do you support non-English resumes?",
    a: "Currently we support English, Spanish, French, German, and Portuguese. We are actively adding more languages. Our AI understands cultural nuances in different job markets.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT is a general-purpose AI. Zypply is purpose-built for job applications with specialized models trained on millions of successful resumes, ATS systems, and hiring patterns. We also provide tracking, analytics, and a complete workflow -- not just text generation.",
  },
];

/* ===== PAGE ===== */

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        {/* Animated background glows */}
        <div className="absolute inset-0 -z-10">
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
          <div className="hero-glow hero-glow-3" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 -z-10 grid-pattern" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Floating badge */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-10 border border-indigo-100/80 shadow-sm dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              Your AI Career Copilot is Here
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.1] mb-7 animate-fade-in-delay-1">
            Stop Getting Rejected{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text">by Robots.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-delay-2 font-light">
            75% of resumes never reach human eyes. Zypply uses AI to tailor
            your resume, write cover letters, and beat ATS systems{" "}
            <span className="font-medium text-gray-900 dark:text-white">in seconds, not hours.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <Button
              size="lg"
              asChild
              className="text-base px-8 h-14 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:from-indigo-600 hover:via-violet-600 hover:to-pink-600 shadow-xl shadow-indigo-500/25 animate-pulse-glow border-0"
            >
              <Link href="/signup">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base px-8 h-14 border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700"
            >
              <Link href="#how-it-works">
                <Play className="mr-2 h-4 w-4" />
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-delay-4">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-indigo-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-violet-500" />
              5 free applications
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-pink-500" />
              Cancel anytime
            </div>
          </div>

          {/* Social proof counter */}
          <div className="mt-14 animate-fade-in-delay-5">
            <div className="inline-flex items-center gap-4 px-7 py-4 rounded-2xl glass-card shadow-xl">
              <div className="flex -space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  S
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  M
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold gradient-text-static">
                  12,847+
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  applications optimized this month
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual: App mockup */}
          <div className="mt-20 animate-fade-in-delay-6 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#030014] z-10 pointer-events-none h-full" />
            <div className="relative mx-auto max-w-4xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center px-3 max-w-md mx-auto">
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">app.zypply.com/dashboard</span>
                  </div>
                </div>
              </div>
              {/* App preview content */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-100/50 dark:border-indigo-800/30">
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">ATS Score</div>
                    <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">94%</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] text-emerald-600 font-medium">+32 from original</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-100/50 dark:border-violet-800/30">
                    <div className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">Keywords Matched</div>
                    <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400">18/21</div>
                    <div className="w-full h-1.5 bg-violet-100 dark:bg-violet-900 rounded-full mt-2">
                      <div className="w-[86%] h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100/50 dark:border-purple-800/30">
                    <div className="text-xs text-pink-600 dark:text-pink-400 font-medium mb-1">Cover Letter</div>
                    <div className="text-3xl font-extrabold text-pink-600 dark:text-pink-400">Ready</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Check className="h-3 w-3 text-emerald-500" />
                      <span className="text-[10px] text-emerald-600 font-medium">Personalized</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <div className="h-3 w-[92%] bg-indigo-50 dark:bg-indigo-900/20 rounded-full" />
                  <div className="h-3 w-[78%] bg-gray-100 dark:bg-gray-800 rounded-full" />
                  <div className="h-3 w-[85%] bg-violet-50 dark:bg-violet-900/20 rounded-full" />
                  <div className="h-3 w-[65%] bg-gray-100 dark:bg-gray-800 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== LOGO BAR ========== */}
      <section className="py-14 px-4 border-y border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500 mb-8 font-medium uppercase tracking-widest">
            Trusted by job seekers hired at
          </p>
          <div className="marquee-container">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...logoCompanies, ...logoCompanies].map((company, i) => (
                <span
                  key={`${company}-${i}`}
                  className="mx-5 inline-flex items-center px-6 py-2.5 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 text-sm font-semibold text-gray-600 dark:text-gray-400 shadow-sm"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== PROBLEM STATS ========== */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 mesh-gradient" />
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="destructive" className="mb-5 animate-fade-in text-xs tracking-wide">
            The Problem
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
            The Job Market is{" "}
            <span className="text-red-500">Brutal</span>
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-16">
            You spend hours crafting applications that never get seen. Here is why:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group p-10 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-500 animate-count-up">
              <div className="text-7xl font-black bg-gradient-to-b from-red-500 to-orange-500 bg-clip-text text-transparent mb-3">
                75%
              </div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Resumes Rejected by ATS
              </div>
              <p className="text-sm text-gray-400">
                before a human ever sees them
              </p>
            </div>
            <div className="group p-10 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500 animate-count-up-delay-1">
              <div className="text-7xl font-black bg-gradient-to-b from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
                250+
              </div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Applications Per Offer
              </div>
              <p className="text-sm text-gray-400">
                the average needed to land one job
              </p>
            </div>
            <div className="group p-10 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-yellow-500/5 transition-all duration-500 animate-count-up-delay-2">
              <div className="text-7xl font-black bg-gradient-to-b from-yellow-500 to-emerald-500 bg-clip-text text-transparent mb-3">
                3hrs
              </div>
              <div className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Per Manual Application
              </div>
              <p className="text-sm text-gray-400">
                average time spent tailoring one app
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== BEFORE vs AFTER ========== */}
      <section className="py-28 px-4 bg-gray-50/80 dark:bg-gray-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5">
              The Transformation
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Before vs. After{" "}
              <span className="gradient-text-static">Zypply</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Without */}
            <div className="comparison-red rounded-3xl border-2 p-8 animate-slide-in-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <X className="h-5 w-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                  Without Zypply
                </h3>
              </div>
              <ul className="space-y-4">
                {painPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With */}
            <div className="comparison-green rounded-3xl border-2 p-8 animate-slide-in-right">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Check className="h-5 w-5 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  With Zypply
                </h3>
              </div>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 grid-pattern" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5">
              Simple Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
              Three Steps to Your{" "}
              <span className="gradient-text">Dream Job</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              From upload to offer-ready in under 60 seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting gradient line */}
            <div className="hidden md:block absolute top-[5rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-[2px] bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 dark:from-indigo-700 dark:via-violet-700 dark:to-pink-700 opacity-60" />

            {steps.map((step, i) => (
              <div
                key={step.step}
                className={`relative p-8 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 group hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 ${
                  i === 0
                    ? "animate-fade-in-delay-1"
                    : i === 1
                      ? "animate-fade-in-delay-3"
                      : "animate-fade-in-delay-5"
                }`}
              >
                <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mb-5 uppercase tracking-widest">
                  Step {step.step}
                </div>
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENTO FEATURE GRID ========== */}
      <section id="features" className="py-28 px-4 bg-gray-50/80 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-5">
              Full Toolkit
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
              Everything You Need to{" "}
              <span className="gradient-text">Land the Job</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              A complete, AI-powered toolkit for the modern job seeker
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* LARGE: AI Resume Tailoring (spans 2 cols) */}
            <div className="bento-card lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-violet-50/50 to-purple-50 dark:from-indigo-950/30 dark:via-violet-950/20 dark:to-purple-950/30 border border-indigo-100/50 dark:border-indigo-900/30 min-h-[280px] relative overflow-hidden">
              <div className="relative z-10">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Resume Tailoring</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  One click. Perfectly matched to the job.
                </p>
              </div>
              {/* Mock UI */}
              <div className="absolute bottom-4 right-4 w-[55%] bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Optimizing...
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded" />
                  <div className="h-2 w-4/5 bg-indigo-100 dark:bg-indigo-900/50 rounded" />
                  <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-700 rounded" />
                  <div className="h-2 w-full bg-violet-100 dark:bg-violet-900/50 rounded" />
                  <div className="h-2 w-2/3 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 px-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      ATS: 94%
                    </span>
                  </div>
                  <div className="h-6 px-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center">
                    <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
                      Match: High
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* MEDIUM: ATS Scoring */}
            <div className="bento-card p-8 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 min-h-[280px] flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                <svg className="w-28 h-28" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-100 dark:text-gray-800" />
                  <circle
                    cx="50" cy="50" r="45" fill="none"
                    stroke="url(#score-gradient)" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="283"
                    strokeDashoffset="283" className="animate-score-fill"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="50%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                  <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="fill-current text-gray-900 dark:text-white" fontSize="24" fontWeight="800">
                    92
                  </text>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-1">ATS Scoring</h3>
              <p className="text-sm text-gray-400">
                Know your score before you apply
              </p>
            </div>

            {/* MEDIUM: Cover Letters */}
            <div className="bento-card p-8 rounded-3xl bg-gradient-to-br from-violet-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30 border border-violet-100/50 dark:border-violet-900/30 min-h-[280px]">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mb-5 shadow-lg shadow-violet-500/20">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Cover Letters</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Sound like you, but better
              </p>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic border border-gray-100 dark:border-gray-700/50">
                &ldquo;Dear Hiring Manager, I was thrilled to see the Senior
                Product role at Stripe. Having led cross-functional teams
                that...&rdquo;
              </div>
            </div>

            {/* SMALL: Chrome Extension */}
            <div className="bento-card p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
                <Chrome className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1">Chrome Extension</h3>
              <p className="text-sm text-gray-400">
                Apply from any job board
              </p>
            </div>

            {/* SMALL: Application Tracker */}
            <div className="bento-card p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1">Application Tracker</h3>
              <p className="text-sm text-gray-400">
                Kanban board for your job search
              </p>
            </div>

            {/* LARGE: Interview Prep (spans 2 cols) */}
            <div className="bento-card lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30 border border-emerald-100/50 dark:border-emerald-900/30 min-h-[200px]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
                    <Mic className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Interview Prep</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    AI mock interviews with STAR method scoring. Personalized questions from the actual job description.
                  </p>
                </div>
                <div className="hidden sm:flex flex-col gap-2 ml-6">
                  {["Situation", "Task", "Action", "Result"].map((s) => (
                    <div key={s} className="px-3.5 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 text-xs font-medium border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300">
                      {s} ✓
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MEDIUM: Company Intel */}
            <div className="bento-card p-8 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 min-h-[200px]">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Company Intel</h3>
              <p className="text-sm text-gray-400 mb-3">
                Know everything before you apply
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Culture", color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" },
                  { label: "Values", color: "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-300" },
                  { label: "Tech Stack", color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300" },
                  { label: "Reviews", color: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300" },
                ].map((tag) => (
                  <span key={tag.label} className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold ${tag.color}`}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            {/* MEDIUM: Salary Intelligence */}
            <div className="bento-card p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-100/50 dark:border-amber-900/30 min-h-[200px]">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-amber-500/20">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Salary Intelligence</h3>
              <p className="text-sm text-gray-400 mb-3">
                Never undershoot again
              </p>
              <div className="flex items-end gap-1.5 h-12">
                {[4, 6, 10, 12, 8, 5].map((h, i) => (
                  <div
                    key={i}
                    className={`w-5 rounded-t transition-all duration-300`}
                    style={{
                      height: `${h * 4}px`,
                      background: `linear-gradient(to top, #f59e0b, #f97316)`,
                      opacity: 0.4 + i * 0.12,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* SMALL: Email Templates */}
            <div className="bento-card p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-3 shadow-lg shadow-pink-500/20">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1">Email Templates</h3>
              <p className="text-sm text-gray-400">
                Follow-up, negotiate, accept
              </p>
            </div>

            {/* SMALL: Networking */}
            <div className="bento-card p-6 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-bold mb-1">Networking</h3>
              <p className="text-sm text-gray-400">
                The right message, every time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 mesh-gradient" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-5">
              Real Results
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
              Loved by{" "}
              <span className="gradient-text-static">Job Seekers</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Hear from people who landed their dream jobs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-8 rounded-3xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-gray-600 dark:text-gray-300 mb-7 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">
                      {t.title} &middot; {t.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPARISON TABLE ========== */}
      <section className="py-28 px-4 bg-gray-50/80 dark:bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5">
              Why Zypply
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
              Zypply vs. The Rest
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              More features, lower price. It is not even close.
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900/80">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="p-4 text-center">
                    <span className="font-bold gradient-text-static">Zypply</span>
                  </th>
                  <th className="p-4 text-center font-medium text-gray-400">
                    Teal
                    <div className="text-xs font-normal">$29/mo</div>
                  </th>
                  <th className="p-4 text-center font-medium text-gray-400">
                    Jobscan
                    <div className="text-xs font-normal">$50/mo</div>
                  </th>
                  <th className="p-4 text-center font-medium text-gray-400">
                    Huntr
                    <div className="text-xs font-normal">$40/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitorFeatures.map((f, i) => (
                  <tr
                    key={f.name}
                    className={
                      i % 2 === 0
                        ? "bg-white dark:bg-gray-950"
                        : "bg-gray-50/50 dark:bg-gray-900/50"
                    }
                  >
                    <td className="p-4 font-medium">{f.name}</td>
                    <td className="p-4 text-center">
                      <Check className="h-5 w-5 text-indigo-500 mx-auto" />
                    </td>
                    <td className="p-4 text-center">
                      {f.teal ? (
                        <Check className="h-5 w-5 text-gray-300 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-200 dark:text-gray-700 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {f.jobscan ? (
                        <Check className="h-5 w-5 text-gray-300 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-200 dark:text-gray-700 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {f.huntr ? (
                        <Check className="h-5 w-5 text-gray-300 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-200 dark:text-gray-700 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
                {/* Pricing row */}
                <tr className="bg-indigo-50/50 dark:bg-indigo-950/20 border-t-2 border-gray-200 dark:border-gray-700">
                  <td className="p-4 font-bold">Price</td>
                  <td className="p-4 text-center">
                    <span className="font-extrabold text-lg gradient-text-static">
                      $12/mo
                    </span>
                  </td>
                  <td className="p-4 text-center text-gray-400">$29/mo</td>
                  <td className="p-4 text-center text-gray-400">$50/mo</td>
                  <td className="p-4 text-center text-gray-400">$40/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 grid-pattern" />
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-5">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
              Simple,{" "}
              <span className="gradient-text-static">Transparent</span>{" "}
              Pricing
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
              Start free. Upgrade when you need more power.
            </p>

            {/* Monthly/Annual Toggle */}
            <div className="inline-flex items-center gap-1 bg-white dark:bg-gray-900 rounded-full p-1 border border-gray-200 dark:border-gray-800 shadow-sm">
              <span className="px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white">
                Monthly
              </span>
              <span className="px-5 py-2.5 text-sm font-medium text-gray-400">
                Annual
                <span className="ml-1.5 text-xs text-emerald-500 font-bold">
                  -20%
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => {
              const isPopular = key === "pro";
              return (
                <div
                  key={key}
                  className={`relative p-8 rounded-3xl border-2 ${
                    isPopular
                      ? "border-indigo-500/50 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/30 scale-[1.02]"
                      : "border-gray-100 dark:border-gray-800 shadow-sm"
                  } bg-white dark:bg-gray-950 hover:shadow-xl transition-all duration-500`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg shadow-indigo-500/25">
                        <Star className="h-3 w-3 fill-white" /> MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black">
                        ${tier.price / 100}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-gray-400 text-lg">
                          /month
                        </span>
                      )}
                    </div>
                    {tier.price > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        billed monthly
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                        <span className="text-gray-500 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full h-12 font-semibold ${isPopular ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:from-indigo-600 hover:via-violet-600 hover:to-pink-600 shadow-lg shadow-indigo-500/20 border-0 text-white" : ""}`}
                    variant={isPopular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/signup">
                      {tier.price === 0
                        ? "Get Started Free"
                        : "Start Free Trial"}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mt-28 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-10">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/80 overflow-hidden"
                >
                  <input
                    type="checkbox"
                    id={`faq-${i}`}
                    className="faq-toggle hidden"
                  />
                  <label
                    htmlFor={`faq-${i}`}
                    className="faq-label flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <ChevronDown className="faq-chevron h-4 w-4 text-gray-400 shrink-0 transition-transform duration-300" />
                  </label>
                  <div className="faq-content px-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {faq.a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 sm:p-16 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-white relative overflow-hidden animate-gradient-shift">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.12),transparent)]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
                Join 12,000+ job seekers who stopped getting ghosted and started
                getting offers.
              </p>

              {/* Email capture */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-6">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full sm:flex-1 h-14 px-5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
                />
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl h-14 px-8 text-base font-semibold whitespace-nowrap"
                  asChild
                >
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-indigo-200">
                <Shield className="h-4 w-4" />
                No credit card required &middot; Free forever plan available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-16 px-4 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-icon.svg" alt="Zypply" width={32} height={32} />
                <span className="font-bold text-lg gradient-text-static">
                  Zypply
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Your AI Career Copilot
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3">
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition"
                  aria-label="Twitter"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition"
                  aria-label="LinkedIn"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-indigo-500 transition"
                  aria-label="GitHub"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link href="#features" className="hover:text-indigo-500 transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-indigo-500 transition">Pricing</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">Chrome Extension</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">API</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-indigo-500 transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">Resume Guide</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">ATS Guide</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">Help Center</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Company</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-indigo-500 transition">About</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">Careers</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">Contact</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-indigo-500 transition">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-indigo-500 transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <span>
              &copy; {new Date().getFullYear()} Zypply. All rights reserved.
            </span>
            <span>Made with care for job seekers everywhere.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
