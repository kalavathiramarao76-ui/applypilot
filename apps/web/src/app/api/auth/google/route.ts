import { db } from "@/lib/db";
import { createToken } from "@/lib/auth";
import { profiles } from "@zypply/shared";
import { eq } from "@zypply/shared";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return Response.json({ error: "idToken is required" }, { status: 400 });
    }

    // Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

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

    if (existing.length > 0) {
      // Existing user - log them in
      userId = existing[0].id;
    } else {
      // New user - create account
      const [newUser] = await db
        .insert(profiles)
        .values({
          email,
          fullName: name || email.split("@")[0],
          passwordHash: `google:${uid}`, // Mark as Google auth user
        })
        .returning({ id: profiles.id });
      userId = newUser.id;
    }

    // Create JWT
    const token = await createToken(userId);

    const response = Response.json(
      { user: { id: userId, email, fullName: name } },
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
