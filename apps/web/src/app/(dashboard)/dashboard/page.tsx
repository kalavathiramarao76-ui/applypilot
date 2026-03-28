import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { db } from "@/lib/db";
import { applications, jobs } from "@applypilot/shared";
import { eq, desc, inArray } from "@applypilot/shared";
import { StatsCard } from "@/components/stats-card";
import { ApplicationCard } from "@/components/application-card";
import { Briefcase, TrendingUp, Target, BarChart3 } from "lucide-react";

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

  return (
    <div className="space-y-8">
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
        />
        <StatsCard
          title="Applied This Week"
          value={weekApps}
          icon={TrendingUp}
        />
        <StatsCard
          title="Interview Rate"
          value={`${interviewRate}%`}
          icon={BarChart3}
        />
        <StatsCard
          title="Avg ATS Score"
          value={avgAtsScore > 0 ? `${avgAtsScore}%` : "N/A"}
          icon={Target}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Applications</h2>
        {recentWithJobs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800">
            <Briefcase className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No applications yet. Start by adding a job and tailoring your
              resume!
            </p>
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
