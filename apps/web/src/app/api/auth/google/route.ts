import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { profiles } from "@zypply/shared";
import { eq } from "@zypply/shared";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return Response.json({ error: "idToken is required" }, { status: 400 });
    }

    // Verify the Firebase ID token via Google's public token info endpoint
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
    );

    if (!verifyRes.ok) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const tokenData = await verifyRes.json();
    const { email, name, sub: uid, picture } = tokenData;

    if (!email) {
      return Response.json({ error: "Email not found in Google account" }, { status: 400 });
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(profiles)
      .where(eq(profiles.email, email))
      .limit(1);

    let userId: string;
    let fullName = name || email.split("@")[0];

    if (existing.length > 0) {
      userId = existing[0].id;
      fullName = existing[0].fullName;
    } else {
      const [newUser] = await db
        .insert(profiles)
        .values({
          email,
          fullName,
          passwordHash: `google:${uid}`,
        })
        .returning({ id: profiles.id });
      userId = newUser.id;
    }

    const token = await createToken(userId);

    const response = Response.json(
      { user: { id: userId, email, fullName } },
      { status: 200 }
    );
    const headers = new Headers(response.headers);
    headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${30 * 24 * 60 * 60}`
    );

    return new Response(response.body, { status: 200, headers });
  } catch (error: any) {
    console.error("Google auth error:", error);
    return Response.json(
      { error: error.message || "Authentication failed" },
      { status: 401 }
    );
  }
}
