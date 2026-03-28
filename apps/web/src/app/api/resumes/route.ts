import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { resumes } from "@zypply/shared";
import { eq, desc } from "@zypply/shared";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userResumes = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, session.userId))
      .orderBy(desc(resumes.createdAt));

    return Response.json({ resumes: userResumes });
  } catch (error) {
    console.error("GET resumes error:", error);
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
    const { name, content, isBase, tags } = body;

    if (!name || !content) {
      return Response.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const [resume] = await db
      .insert(resumes)
      .values({
        userId: session.userId,
        name,
        content,
        isBase: isBase || false,
        tags: tags || [],
      })
      .returning();

    return Response.json({ resume }, { status: 201 });
  } catch (error) {
    console.error("POST resumes error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
