import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { applications, jobs, applicationSchema } from "@applypilot/shared";
import { eq, desc, inArray } from "@applypilot/shared";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userApps = await db
      .select()
      .from(applications)
      .where(eq(applications.userId, session.userId))
      .orderBy(desc(applications.createdAt));

    // Get job details
    const jobIds = userApps.map((a) => a.jobId).filter(Boolean) as string[];
    const jobsData =
      jobIds.length > 0
        ? await db.select().from(jobs).where(inArray(jobs.id, jobIds))
        : [];

    const jobMap = new Map(jobsData.map((j) => [j.id, j]));

    const appsWithJobs = userApps.map((app) => ({
      ...app,
      job: app.jobId ? jobMap.get(app.jobId) || null : null,
    }));

    return Response.json({ applications: appsWithJobs });
  } catch (error) {
    console.error("GET applications error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const [app] = await db
      .insert(applications)
      .values({
        userId: session.userId,
        ...parsed.data,
      })
      .returning();

    return Response.json({ application: app }, { status: 201 });
  } catch (error) {
    console.error("POST applications error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
