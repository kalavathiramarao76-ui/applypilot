import { db } from "@/lib/db";
import { hashPassword, createToken } from "@/lib/auth";
import { profiles, signUpSchema } from "@zypply/shared";
import { eq } from "@zypply/shared";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, fullName } = parsed.data;

    // Check if user exists
    const existing = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    if (existing.length > 0) {
      return Response.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const [user] = await db
      .insert(profiles)
      .values({
        email,
        fullName,
        passwordHash,
      })
      .returning({
        id: profiles.id,
        email: profiles.email,
        fullName: profiles.fullName,
      });

    const token = await createToken(user.id);

    const response = Response.json({ user }, { status: 201 });
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
    );

    return new Response(response.body, {
      status: 201,
      headers,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
