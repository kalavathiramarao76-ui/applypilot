import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, jobs } from "@zypply/shared";
import { eq, desc, inArray } from "@zypply/shared";
import { StatsCard } from "@/components/stats-card";
import { ApplicationCard } from "@/components/application-card";
import { Recommendations } from "@/components/recommendations";
import {
  Briefcase,
  TrendingUp,
  Target,
  BarChart3,
  ArrowRight,
  FileText,
  Rocket,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let userId: string;
  try {
    const session = await verifyToken(token);
    userId = session.userId;
  } catch {
    redirect("/login");
  }

  // Fetch all user applications for stats
  const allApps = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.createdAt));

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const totalApps = allApps.length;
  const weekApps = allApps.filter(
    (a) => a.createdAt && new Date(a.createdAt) >= oneWeekAgo
  ).length;
  const interviewCount = allApps.filter((a) => a.status === "interview").length;
  const interviewRate =
    totalApps > 0 ? Math.round((interviewCount / totalApps) * 100) : 0;

  const scoredApps = allApps.filter((a) => a.atsScore != null);
  const avgAtsScore =
    scoredApps.length > 0
      ? Math.round(
          scoredApps.reduce((sum, a) => sum + (a.atsScore || 0), 0) /
            scoredApps.length
        )
      : 0;

  // Recent 5 applications
  const recentApps = allApps.slice(0, 5);

  // Get job details for recent apps
  const jobIds = recentApps
    .map((a) => a.jobId)
    .filter((id): id is string => id != null);
  const jobsData =
    jobIds.length > 0
      ? await db.select().from(jobs).where(inArray(jobs.id, jobIds))
      : [];

  const jobMap = new Map(jobsData.map((j) => [j.id, j]));

  const recentWithJobs = recentApps.map((app) => ({
    ...app,
    job: app.jobId ? jobMap.get(app.jobId) || null : null,
  }));

  const isFirstTime = totalApps === 0;

  return (
    <div className="space-y-8">
      {/* Welcome Banner for first-time users */}
      {isFirstTime && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Rocket className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to Zypply!</h2>
            </div>
            <p className="text-blue-100 max-w-lg mb-5">
              Your AI-powered job application copilot. Start by creating your
              profile, then let us help you tailor resumes, ace interviews, and
              land your dream job.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              Create your profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track your job search progress
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Applications"
          value={totalApps}
          icon={Briefcase}
          gradient="from-blue-500/15 to-cyan-500/15"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <StatsCard
          title="Applied This Week"
          value={weekApps}
          icon={TrendingUp}
          gradient="from-green-500/15 to-emerald-500/15"
          iconColor="text-green-600 dark:text-green-400"
        />
        <StatsCard
          title="Interview Rate"
          value={`${interviewRate}%`}
          icon={BarChart3}
          gradient="from-purple-500/15 to-pink-500/15"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <StatsCard
          title="Avg ATS Score"
          value={avgAtsScore > 0 ? `${avgAtsScore}%` : "N/A"}
          icon={Target}
          gradient="from-orange-500/15 to-amber-500/15"
          iconColor="text-orange-600 dark:text-orange-400"
        />
      </div>

      <Recommendations />

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        {recentWithJobs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-950 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
              <FileText className="h-8 w-8 text-blue-500 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              No applications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-5 max-w-sm mx-auto">
              Start by adding a job and tailoring your resume with AI to land
              more interviews.
            </p>
            <Link
              href="/quick-apply"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
            >
              <Rocket className="h-4 w-4" />
              Quick Apply
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentWithJobs.map((app) => (
              <ApplicationCard key={app.id} application={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
