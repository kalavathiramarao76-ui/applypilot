import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Target,
  FileText,
  Mic,
  Chrome,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Check,
  Rocket,
  Upload,
  Search,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { SUBSCRIPTION_TIERS } from "@applypilot/shared";

const features = [
  {
    icon: Target,
    title: "ATS Optimization",
    description:
      "Our AI analyzes job descriptions and restructures your resume to pass Applicant Tracking Systems with a high match score.",
  },
  {
    icon: Mic,
    title: "Voice Matching",
    description:
      "Maintains your authentic writing voice while optimizing content. Your resume still sounds like you, just better.",
  },
  {
    icon: FileText,
    title: "Cover Letters",
    description:
      "Generate personalized, compelling cover letters for each job application in seconds. No more staring at a blank page.",
  },
  {
    icon: BarChart3,
    title: "Application Tracker",
    description:
      "Track every application in one place. See status updates, interview dates, and analytics at a glance.",
  },
  {
    icon: Chrome,
    title: "Chrome Extension",
    description:
      "Apply directly from LinkedIn, Indeed, or any job board. One click to tailor and track your application.",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description:
      "AI-powered mock interviews based on the actual job description. Get ready with personalized questions and feedback.",
  },
];

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    description:
      "Add your base resume once. Our AI learns your experience, skills, and writing style.",
  },
  {
    icon: Search,
    step: "02",
    title: "Find a Job",
    description:
      "Paste a job URL or description. We extract requirements, keywords, and what the company is really looking for.",
  },
  {
    icon: Sparkles,
    step: "03",
    title: "AI Tailors Your Application",
    description:
      "Get a perfectly tailored resume, cover letter, and ATS score in seconds. Apply with confidence.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 dark:bg-blue-900/20" />
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40 dark:bg-purple-900/20" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 dark:bg-blue-950/50 dark:text-blue-300">
              <Zap className="h-4 w-4" />
              AI-Powered Job Applications
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-delay-1">
            Stop Getting Rejected{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              by Robots.
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-delay-2">
            Land more interviews with AI that tailors your resume, writes cover
            letters, and beats ATS systems. In seconds, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-delay-3">
            <Button size="lg" asChild className="text-base px-8 h-14 shadow-xl shadow-blue-500/25">
              <Link href="/signup">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 h-14">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              5 free applications
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            The Job Application System is{" "}
            <span className="text-red-500">Broken</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            You spend hours crafting applications that never get seen. Here is why:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-3">
                75%
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                of resumes are rejected by ATS before a human ever sees them
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-3">
                250+
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                average applications needed to land one job offer today
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-yellow-500 to-green-500 bg-clip-text text-transparent mb-3">
                3hrs
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                average time spent tailoring a single application manually
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Three simple steps to transform your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative p-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 group hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-4">
                  STEP {step.step}
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Land the Job
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              A complete toolkit for modern job seekers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => {
              const isPopular = key === "pro";
              return (
                <div
                  key={key}
                  className={`relative p-8 rounded-2xl border ${
                    isPopular
                      ? "border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500"
                      : "border-gray-200 dark:border-gray-800"
                  } bg-white dark:bg-gray-950`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        <Star className="h-3 w-3" /> MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold">
                        ${tier.price / 100}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/signup">
                      {tier.price === 0 ? "Get Started Free" : "Start Free Trial"}
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <Rocket className="h-12 w-12 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
                Join thousands of job seekers who use ApplyPilot to get more
                interviews and better offers.
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg h-14 px-8 text-base font-semibold"
                asChild
              >
                <Link href="/signup">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Rocket className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ApplyPilot
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI-Powered Job Application Copilot
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="#features" className="hover:text-gray-900 dark:hover:text-gray-100">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900 dark:hover:text-gray-100">Pricing</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Chrome Extension</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-gray-100">About</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Blog</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Privacy</Link></li>
                <li><Link href="#" className="hover:text-gray-900 dark:hover:text-gray-100">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} ApplyPilot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
