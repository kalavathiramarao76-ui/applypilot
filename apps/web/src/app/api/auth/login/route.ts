import { db } from "@/lib/db";
import { verifyPassword, createToken } from "@/lib/auth";
import { profiles, signInSchema } from "@applypilot/shared";
import { eq } from "@applypilot/shared";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const [user] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    if (!user || !user.passwordHash) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return Response.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await createToken(user.id);

    const response = Response.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
    );

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
