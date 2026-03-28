import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { applications, jobs, eq } from "@applypilot/shared";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [app] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!app || app.userId !== session.userId) {
      return Response.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    let job = null;
    if (app.jobId) {
      const [jobData] = await db
        .select()
        .from(jobs)
        .where(eq(jobs.id, app.jobId))
        .limit(1);
      job = jobData || null;
    }

    return Response.json({ application: { ...app, job } });
  } catch (error) {
    console.error("GET application error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [existing] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!existing || existing.userId !== session.userId) {
      return Response.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const allowedFields: Record<string, unknown> = {};

    if (body.status !== undefined) allowedFields.status = body.status;
    if (body.notes !== undefined) allowedFields.notes = body.notes;
    if (body.interviewDates !== undefined)
      allowedFields.interviewDates = body.interviewDates;
    if (body.followUpDates !== undefined)
      allowedFields.followUpDates = body.followUpDates;
    if (body.appliedAt !== undefined)
      allowedFields.appliedAt = body.appliedAt ? new Date(body.appliedAt) : null;

    if (body.status === "applied" && !existing.appliedAt) {
      allowedFields.appliedAt = new Date();
    }

    const [updated] = await db
      .update(applications)
      .set({ ...allowedFields, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();

    return Response.json({ application: updated });
  } catch (error) {
    console.error("PATCH application error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [existing] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1);

    if (!existing || existing.userId !== session.userId) {
      return Response.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await db.delete(applications).where(eq(applications.id, id));

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE application error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
