import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { jobs, jobSchema } from "@zypply/shared";
import { eq, desc } from "@zypply/shared";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userJobs = await db
      .select()
      .from(jobs)
      .where(eq(jobs.userId, session.userId))
      .orderBy(desc(jobs.createdAt));

    return Response.json({ jobs: userJobs });
  } catch (error) {
    console.error("GET jobs error:", error);
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
    const parsed = jobSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const [job] = await db
      .insert(jobs)
      .values({
        userId: session.userId,
        ...parsed.data,
      })
      .returning();

    return Response.json({ job }, { status: 201 });
  } catch (error) {
    console.error("POST jobs error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
