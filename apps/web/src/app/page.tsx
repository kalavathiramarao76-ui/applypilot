import Link from "next/link";
import { SmartNavbar } from "@/components/motion/smart-navbar";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";
import { TextReveal } from "@/components/motion/text-reveal";
import { ScaleIn } from "@/components/motion/scale-in";
import { Float } from "@/components/motion/float";
import { MotionDiv, MotionLi } from "@/components/motion/motion-div";
import { Button } from "@/components/ui/button";
import {
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
  Brain,
  DollarSign,
  Users,
  ChevronDown,
  Play,
  Shield,
  TrendingUp,
} from "lucide-react";
import { SUBSCRIPTION_TIERS } from "@zypply/shared";

/* ===== DATA ===== */

const steps = [
  { icon: Upload, step: "01", title: "Upload Your Resume", description: "Add your base resume once. Our AI learns your experience, skills, and writing style." },
  { icon: Search, step: "02", title: "Paste Any Job", description: "Paste a job URL or description. We extract requirements, keywords, and what the company really wants." },
  { icon: Sparkles, step: "03", title: "Apply with Confidence", description: "Get a perfectly tailored resume, cover letter, and ATS score in seconds — not hours." },
];

const logoCompanies = ["Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Stripe", "Airbnb"];

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
  { quote: "I went from mass-applying to 50 jobs with zero callbacks, to landing 4 interviews in my first week with Zypply.", name: "Sarah Chen", title: "Software Engineer", company: "Now at Google", initials: "SC" },
  { quote: "The cover letter generator actually sounds like me, not a robot. My response rate went from 3% to 22% in one month.", name: "Marcus Johnson", title: "Product Manager", company: "Now at Stripe", initials: "MJ" },
  { quote: "As a career changer, I was struggling to position my experience. Zypply helped me reframe everything. Dream job in 6 weeks.", name: "Priya Patel", title: "Data Analyst", company: "Now at Netflix", initials: "PP" },
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
  { q: "What is ATS and why does it matter?", a: "ATS (Applicant Tracking System) is software that companies use to filter resumes before a human ever sees them. Over 75% of resumes are rejected by ATS. Zypply optimizes your resume to pass these systems and reach real recruiters." },
  { q: "How does AI tailoring work?", a: "Our AI analyzes the job description to identify key requirements, skills, and keywords. It then restructures your resume to highlight relevant experience and match the language the company uses, while keeping your authentic voice." },
  { q: "Is my data safe?", a: "Absolutely. We use bank-level encryption (AES-256) for all data at rest and in transit. We never share your data with third parties. You can delete all your data at any time from your account settings." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no questions asked. You will keep access to your plan features until the end of your billing period." },
  { q: "Do you support non-English resumes?", a: "Currently we support English, Spanish, French, German, and Portuguese. We are actively adding more languages. Our AI understands cultural nuances in different job markets." },
  { q: "How is this different from ChatGPT?", a: "ChatGPT is a general-purpose AI. Zypply is purpose-built for job applications with specialized models trained on millions of successful resumes, ATS systems, and hiring patterns. We also provide tracking, analytics, and a complete workflow -- not just text generation." },
];

/* ===== PAGE ===== */

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white dark:bg-zinc-950 grain">
      <div className="scroll-progress" />
      <SmartNavbar />

      {/* ========== HERO ========== */}
      <section className="relative pt-36 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="morph-blob bg-indigo-500" style={{ width: 500, height: 500, top: "-10%", left: "5%" }} />
          <div className="morph-blob bg-violet-500" style={{ width: 400, height: 400, top: "20%", right: "5%", animationDelay: "-8s" }} />
          <div className="morph-blob bg-pink-400" style={{ width: 350, height: 350, bottom: "-5%", left: "40%", animationDelay: "-16s" }} />
        </div>
        <div className="particles -z-10">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="particle" />)}
        </div>
        <div className="absolute inset-0 -z-10 dot-grid" />

        <div className="max-w-3xl mx-auto text-center">
          <FadeIn delay={0.1} direction="down" distance={16}>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Now in public beta
            </span>
          </FadeIn>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-zinc-900 dark:text-zinc-50">
            <TextReveal text="Stop getting" delay={0.2} />
            <br className="hidden sm:block" />
            <TextReveal text="rejected by robots." delay={0.4} />
          </h1>

          <FadeIn delay={0.6} duration={0.6}>
            <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-10 leading-relaxed">
              75% of resumes never reach human eyes. Zypply tailors your resume,
              writes cover letters, and beats ATS systems — in seconds.
            </p>
          </FadeIn>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button size="lg" asChild className="btn-shine text-base px-8 h-13 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm">
                <Link href="/signup">Start free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </MotionDiv>
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 300, damping: 20 }}
            >
              <Button size="lg" variant="outline" asChild className="text-base px-8 h-13 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                <Link href="#how-it-works"><Play className="mr-2 h-4 w-4" /> See how it works</Link>
              </Button>
            </MotionDiv>
          </div>

          <FadeIn delay={0.9} distance={16}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-400">
              <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> No credit card</span>
              <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> 5 free applications</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Cancel anytime</span>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={1.0} distance={40} duration={0.8} className="mt-20 max-w-4xl mx-auto">
          <Float amplitude={6} duration={4}>
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/5 dark:shadow-black/20 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 max-w-sm mx-auto flex items-center px-3">
                    <span className="text-[11px] text-zinc-400">app.zypply.com</span>
                  </div>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs text-zinc-400 font-medium mb-1">ATS Score</div>
                    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">94<span className="text-lg text-zinc-400">%</span></div>
                    <div className="flex items-center gap-1 mt-1"><TrendingUp className="h-3 w-3 text-emerald-500" /><span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">+32 from original</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs text-zinc-400 font-medium mb-1">Keywords</div>
                    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">18<span className="text-lg text-zinc-400">/21</span></div>
                    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full mt-2"><div className="w-[86%] h-full bg-zinc-900 dark:bg-zinc-100 rounded-full" /></div>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                    <div className="text-xs text-zinc-400 font-medium mb-1">Cover Letter</div>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Ready</div>
                    <div className="flex items-center gap-1 mt-1"><Check className="h-3 w-3 text-emerald-500" /><span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Personalized</span></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-2.5 w-[90%] bg-zinc-50 dark:bg-zinc-800/60 rounded" />
                  <div className="h-2.5 w-[75%] bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-2.5 w-[82%] bg-zinc-50 dark:bg-zinc-800/60 rounded" />
                </div>
              </div>
            </div>
          </Float>
        </FadeIn>
      </section>

      {/* ========== LOGO BAR ========== */}
      <FadeIn once>
        <section className="py-12 px-4 border-y border-zinc-100 dark:border-zinc-800/50">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-xs text-zinc-400 mb-6 font-medium uppercase tracking-widest">Trusted by job seekers hired at</p>
            <div className="marquee-container">
              <div className="flex animate-marquee whitespace-nowrap">
                {[...logoCompanies, ...logoCompanies].map((company, i) => (
                  <span key={`${company}-${i}`} className="mx-4 inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:scale-105 transition-all duration-200">{company}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ========== PROBLEM STATS ========== */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn><p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-4">The problem</p></FadeIn>
          <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50">The job market is broken.</h2></FadeIn>
          <FadeIn delay={0.2}><p className="text-base text-zinc-500 max-w-lg mx-auto mb-16">You spend hours on applications that never get seen.</p></FadeIn>

          <StaggerChildren staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "75%", label: "Rejected by ATS", sub: "before a human ever sees them" },
              { num: "250+", label: "Applications per offer", sub: "the average to land one job" },
              { num: "3hrs", label: "Per application", sub: "average time tailoring one app" },
            ].map((stat) => (
              <StaggerItem key={stat.num}>
                <div className="card-hover p-10 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="text-6xl font-black text-zinc-900 dark:text-zinc-50 mb-2">{stat.num}</div>
                  <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">{stat.label}</div>
                  <p className="text-xs text-zinc-400">{stat.sub}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ========== BEFORE vs AFTER ========== */}
      <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <FadeIn><p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">The transformation</p></FadeIn>
            <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Before vs. after Zypply</h2></FadeIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn direction="left" distance={40}>
              <div className="comparison-red rounded-2xl border-2 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center"><X className="h-4 w-4 text-red-500" /></div>
                  <h3 className="text-lg font-bold text-red-600 dark:text-red-400">Without Zypply</h3>
                </div>
                <ul className="space-y-3.5">
                  {painPoints.map((point, i) => (
                    <MotionLi key={point} className="flex items-start gap-3 text-sm" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}>
                      <X className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-600 dark:text-zinc-400">{point}</span>
                    </MotionLi>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn direction="right" distance={40}>
              <div className="comparison-green rounded-2xl border-2 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center"><Check className="h-4 w-4 text-emerald-500" /></div>
                  <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">With Zypply</h3>
                </div>
                <ul className="space-y-3.5">
                  {benefits.map((benefit, i) => (
                    <MotionLi key={benefit} className="flex items-start gap-3 text-sm" initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06, duration: 0.4 }}>
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-zinc-600 dark:text-zinc-400">{benefit}</span>
                    </MotionLi>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <FadeIn><p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">How it works</p></FadeIn>
            <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50">Three steps. Sixty seconds.</h2></FadeIn>
            <FadeIn delay={0.2}><p className="text-base text-zinc-500 max-w-md mx-auto">From upload to offer-ready, faster than making coffee.</p></FadeIn>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-[4.5rem] left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-zinc-200 dark:bg-zinc-800" />
            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.2} distance={30}>
                <div className="card-hover relative p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <ScaleIn delay={0.1 + i * 0.2}>
                    <div className="text-[11px] font-semibold text-zinc-400 mb-5 uppercase tracking-widest">Step {step.step}</div>
                  </ScaleIn>
                  <MotionDiv className="h-12 w-12 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-5" initial={{ rotate: -5, scale: 0.8, opacity: 0 }} whileInView={{ rotate: 0, scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.2, type: "spring", stiffness: 200, damping: 15 }}>
                    <step.icon className="h-5 w-5 text-white dark:text-zinc-900" />
                  </MotionDiv>
                  <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-50">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENTO FEATURES ========== */}
      <section id="features" className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <FadeIn><p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Features</p></FadeIn>
            <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50">Everything you need to land the job.</h2></FadeIn>
            <FadeIn delay={0.2}><p className="text-base text-zinc-500 max-w-md mx-auto">A complete toolkit for the modern job seeker.</p></FadeIn>
          </div>

          <StaggerChildren staggerDelay={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <StaggerItem className="lg:col-span-2">
              <div className="card-hover p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 min-h-[280px] relative overflow-hidden">
                <div className="relative z-10">
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-4"><FileText className="h-5 w-5 text-white dark:text-zinc-900" /></div>
                  <h3 className="text-lg font-bold mb-1 text-zinc-900 dark:text-zinc-50">AI Resume Tailoring</h3>
                  <p className="text-sm text-zinc-500 mb-6">One click. Perfectly matched to the job.</p>
                </div>
                <div className="absolute bottom-4 right-4 w-[55%] bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 p-4 rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-3"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Optimizing...</span></div>
                  <div className="space-y-1.5"><div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-700 rounded" /><div className="h-1.5 w-4/5 bg-zinc-150 dark:bg-zinc-600 rounded" /><div className="h-1.5 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" /><div className="h-1.5 w-full bg-zinc-150 dark:bg-zinc-600 rounded" /></div>
                  <div className="mt-3 flex items-center gap-2"><span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">ATS: 94%</span><span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-700 px-2 py-0.5 rounded">Match: High</span></div>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card-hover p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 min-h-[280px] flex flex-col items-center justify-center text-center">
                <svg className="w-24 h-24 mb-4" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" className="text-zinc-100 dark:text-zinc-800" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="283" className="animate-score-fill text-zinc-900 dark:text-zinc-100" transform="rotate(-90 50 50)" />
                  <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="fill-current text-zinc-900 dark:text-zinc-50" fontSize="24" fontWeight="800">92</text>
                </svg>
                <h3 className="text-base font-bold mb-1 text-zinc-900 dark:text-zinc-50">ATS Scoring</h3>
                <p className="text-xs text-zinc-400">Know your score before you apply</p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="card-hover p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 min-h-[280px]">
                <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-4"><FileText className="h-5 w-5 text-white dark:text-zinc-900" /></div>
                <h3 className="text-base font-bold mb-1 text-zinc-900 dark:text-zinc-50">Cover Letters</h3>
                <p className="text-xs text-zinc-400 mb-4">Sound like you, but better</p>
                <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 text-[11px] text-zinc-500 leading-relaxed italic border border-zinc-100 dark:border-zinc-700">&ldquo;Dear Hiring Manager, I was thrilled to see the Senior Product role at Stripe. Having led cross-functional teams that shipped...&rdquo;</div>
              </div>
            </StaggerItem>

            {[{ icon: Chrome, title: "Chrome Extension", desc: "Apply from any job board" }, { icon: BarChart3, title: "Application Tracker", desc: "Kanban board for your job search" }].map((f) => (
              <StaggerItem key={f.title}>
                <div className="card-hover p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-3"><f.icon className="h-5 w-5 text-white dark:text-zinc-900" /></div>
                  <h3 className="text-sm font-bold mb-0.5 text-zinc-900 dark:text-zinc-50">{f.title}</h3>
                  <p className="text-xs text-zinc-400">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}

            <StaggerItem className="lg:col-span-2">
              <div className="card-hover p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 min-h-[200px]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-4"><Mic className="h-5 w-5 text-white dark:text-zinc-900" /></div>
                    <h3 className="text-lg font-bold mb-1 text-zinc-900 dark:text-zinc-50">Interview Prep</h3>
                    <p className="text-sm text-zinc-500 max-w-sm">AI mock interviews with STAR method scoring. Personalized questions from the actual job description.</p>
                  </div>
                  <div className="hidden sm:flex flex-col gap-1.5 ml-6">
                    {["Situation", "Task", "Action", "Result"].map((s) => (<div key={s} className="px-3 py-1 rounded text-[11px] font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">{s} ✓</div>))}
                  </div>
                </div>
              </div>
            </StaggerItem>

            {[{ icon: Brain, title: "Company Intel", desc: "Know everything before you apply", tags: ["Culture", "Values", "Tech Stack", "Reviews"] }, { icon: DollarSign, title: "Salary Intelligence", desc: "Never undershoot again", tags: null }].map((f) => (
              <StaggerItem key={f.title}>
                <div className="card-hover p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 min-h-[200px]">
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-4"><f.icon className="h-5 w-5 text-white dark:text-zinc-900" /></div>
                  <h3 className="text-base font-bold mb-1 text-zinc-900 dark:text-zinc-50">{f.title}</h3>
                  <p className="text-xs text-zinc-400 mb-3">{f.desc}</p>
                  {f.tags ? (<div className="flex flex-wrap gap-1.5">{f.tags.map((t) => (<span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{t}</span>))}</div>) : (<div className="flex items-end gap-1 h-10">{[3, 5, 8, 10, 7, 4].map((h, i) => (<div key={i} className="w-4 bg-zinc-200 dark:bg-zinc-700 rounded-t" style={{ height: `${h * 4}px` }} />))}</div>)}
                </div>
              </StaggerItem>
            ))}

            {[{ icon: Mail, title: "Email Templates", desc: "Follow-up, negotiate, accept" }, { icon: Users, title: "Networking", desc: "The right message, every time" }].map((f) => (
              <StaggerItem key={f.title}>
                <div className="card-hover p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-3"><f.icon className="h-5 w-5 text-white dark:text-zinc-900" /></div>
                  <h3 className="text-sm font-bold mb-0.5 text-zinc-900 dark:text-zinc-50">{f.title}</h3>
                  <p className="text-xs text-zinc-400">{f.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <FadeIn><p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-4">Real results</p></FadeIn>
            <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50">Loved by job seekers.</h2></FadeIn>
          </div>
          <StaggerChildren staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <div className="testimonial-card p-7 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="flex gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />))}</div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 text-xs font-bold">{t.initials}</div>
                    <div>
                      <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">{t.name}</div>
                      <div className="text-[11px] text-zinc-400">{t.title} &middot; {t.company}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ========== COMPARISON ========== */}
      <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <FadeIn><p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Why Zypply</p></FadeIn>
            <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50">Zypply vs. the rest.</h2></FadeIn>
            <FadeIn delay={0.2}><p className="text-base text-zinc-500">More features. Lower price.</p></FadeIn>
          </div>
          <FadeIn distance={30}>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <table className="w-full text-sm">
                <thead><tr className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800"><th className="text-left p-4 font-medium text-zinc-500">Feature</th><th className="p-4 text-center font-bold text-zinc-900 dark:text-zinc-50">Zypply</th><th className="p-4 text-center font-medium text-zinc-400">Teal<div className="text-[10px] font-normal">$29/mo</div></th><th className="p-4 text-center font-medium text-zinc-400">Jobscan<div className="text-[10px] font-normal">$50/mo</div></th><th className="p-4 text-center font-medium text-zinc-400">Huntr<div className="text-[10px] font-normal">$40/mo</div></th></tr></thead>
                <tbody>
                  {competitorFeatures.map((f, i) => (<tr key={f.name} className={i % 2 === 0 ? "" : "bg-zinc-50/50 dark:bg-zinc-800/20"}><td className="p-4 font-medium text-zinc-700 dark:text-zinc-300">{f.name}</td><td className="p-4 text-center"><Check className="h-4 w-4 text-zinc-900 dark:text-zinc-100 mx-auto" /></td><td className="p-4 text-center">{f.teal ? <Check className="h-4 w-4 text-zinc-300 dark:text-zinc-600 mx-auto" /> : <X className="h-4 w-4 text-zinc-200 dark:text-zinc-700 mx-auto" />}</td><td className="p-4 text-center">{f.jobscan ? <Check className="h-4 w-4 text-zinc-300 dark:text-zinc-600 mx-auto" /> : <X className="h-4 w-4 text-zinc-200 dark:text-zinc-700 mx-auto" />}</td><td className="p-4 text-center">{f.huntr ? <Check className="h-4 w-4 text-zinc-300 dark:text-zinc-600 mx-auto" /> : <X className="h-4 w-4 text-zinc-200 dark:text-zinc-700 mx-auto" />}</td></tr>))}
                  <tr className="border-t-2 border-zinc-200 dark:border-zinc-700"><td className="p-4 font-bold text-zinc-900 dark:text-zinc-50">Price</td><td className="p-4 text-center font-extrabold text-lg text-zinc-900 dark:text-zinc-50">$12/mo</td><td className="p-4 text-center text-zinc-400">$29/mo</td><td className="p-4 text-center text-zinc-400">$50/mo</td><td className="p-4 text-center text-zinc-400">$40/mo</td></tr>
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ========== PRICING ========== */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <FadeIn><p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">Pricing</p></FadeIn>
            <FadeIn delay={0.1}><h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-zinc-900 dark:text-zinc-50">Simple pricing. No surprises.</h2></FadeIn>
            <FadeIn delay={0.2}><p className="text-base text-zinc-500 max-w-md mx-auto mb-8">Start free. Upgrade when you need more.</p></FadeIn>
            <FadeIn delay={0.3}>
              <div className="inline-flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full p-0.5">
                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900">Monthly</span>
                <span className="px-4 py-2 text-sm font-medium text-zinc-500">Annual <span className="ml-1 text-[10px] text-emerald-600 font-bold">-20%</span></span>
              </div>
            </FadeIn>
          </div>

          <StaggerChildren staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => {
              const isPopular = key === "pro";
              return (
                <StaggerItem key={key}>
                  <div className={`card-hover relative p-8 rounded-2xl bg-white dark:bg-zinc-950 ${isPopular ? "border-2 animated-border shadow-lg" : "border-2 border-zinc-100 dark:border-zinc-800"}`}>
                    {isPopular && (<div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><span className="badge-glint inline-flex items-center gap-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold px-3.5 py-1 rounded-full">MOST POPULAR</span></div>)}
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-50">{tier.name}</h3>
                      <div className="flex items-baseline gap-0.5"><span className="text-5xl font-black text-zinc-900 dark:text-zinc-50">${tier.price / 100}</span>{tier.price > 0 && <span className="text-zinc-400 text-base">/mo</span>}</div>
                    </div>
                    <ul className="space-y-2.5 mb-8">{tier.features.map((feature) => (<li key={feature} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-zinc-400 mt-0.5 shrink-0" /><span className="text-zinc-500">{feature}</span></li>))}</ul>
                    <Button className={`btn-shine w-full h-11 font-semibold ${isPopular ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" : ""}`} variant={isPopular ? "default" : "outline"} asChild>
                      <Link href="/signup">{tier.price === 0 ? "Get started free" : "Start free trial"}</Link>
                    </Button>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerChildren>

          <div className="mt-24 max-w-3xl mx-auto">
            <FadeIn><h3 className="text-xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-50">Frequently asked questions</h3></FadeIn>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className="rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                    <input type="checkbox" id={`faq-${i}`} className="faq-toggle hidden" />
                    <label htmlFor={`faq-${i}`} className="faq-label flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <span className="font-medium text-sm text-zinc-700 dark:text-zinc-300 pr-4">{faq.q}</span>
                      <ChevronDown className="faq-chevron h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-300" />
                    </label>
                    <div className="faq-content px-4 text-sm text-zinc-500 leading-relaxed">{faq.a}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="particles -z-10">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="particle" />)}</div>
        <ScaleIn className="max-w-4xl mx-auto">
          <div className="p-12 sm:p-16 rounded-[2rem] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 relative overflow-hidden">
            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                <TextReveal text="Ready to land your dream job?" />
              </h2>
              <FadeIn delay={0.3}><p className="text-lg text-zinc-400 dark:text-zinc-500 mb-10 max-w-lg mx-auto">Join 12,000+ job seekers who stopped getting ghosted and started getting offers.</p></FadeIn>
              <FadeIn delay={0.5}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-6">
                  <input type="email" placeholder="Enter your email" className="w-full sm:flex-1 h-12 px-4 rounded-lg bg-white/10 dark:bg-zinc-900/10 border border-white/15 dark:border-zinc-900/15 text-white dark:text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-zinc-900/30 text-sm" />
                  <Button size="lg" className="cta-pulse btn-shine w-full sm:w-auto bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 hover:from-indigo-600 hover:via-violet-600 hover:to-pink-600 text-white shadow-lg h-12 px-7 text-sm font-semibold whitespace-nowrap border-0 rounded-lg" asChild>
                    <Link href="/signup">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </FadeIn>
              <FadeIn delay={0.6}><p className="text-xs text-zinc-500">No credit card required &middot; Free forever plan</p></FadeIn>
            </div>
          </div>
        </ScaleIn>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-14 px-4 border-t border-zinc-100 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <StaggerChildren staggerDelay={0.08} className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            <StaggerItem className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo-icon.svg" alt="Zypply" width={28} height={28} />
                <span className="font-bold text-base brand-gradient-text">Zypply</span>
              </div>
              <p className="text-xs text-zinc-400 mb-4">Your AI Career Copilot</p>
              <div className="flex items-center gap-2">
                {[
                  { label: "Twitter", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                  { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                ].map((s) => (
                  <Link key={s.label} href="#" className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:scale-110 transition-all" aria-label={s.label}>
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.path} /></svg>
                  </Link>
                ))}
              </div>
            </StaggerItem>
            {[
              { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Chrome Extension", href: "#" }, { label: "API", href: "#" }] },
              { title: "Resources", links: [{ label: "Blog", href: "#" }, { label: "Resume Guide", href: "#" }, { label: "ATS Guide", href: "#" }, { label: "Help Center", href: "#" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Contact", href: "#" }] },
              { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Cookies", href: "#" }] },
            ].map((col) => (
              <StaggerItem key={col.title}>
                <h4 className="font-semibold mb-3 text-xs text-zinc-900 dark:text-zinc-50">{col.title}</h4>
                <ul className="space-y-2 text-xs text-zinc-400">
                  {col.links.map((link) => (<li key={link.label}><Link href={link.href} className="group relative hover:text-zinc-600 dark:hover:text-zinc-300 transition">{link.label}<span className="absolute bottom-0 left-0 h-[0.5px] w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" /></Link></li>))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerChildren>
          <FadeIn>
            <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-400">
              <span>&copy; {new Date().getFullYear()} Zypply. All rights reserved.</span>
              <span>Made with care for job seekers everywhere.</span>
            </div>
          </FadeIn>
        </div>
      </footer>
    </div>
  );
}
