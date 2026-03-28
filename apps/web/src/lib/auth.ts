import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "zypply_jwt_secret_fallback"
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(JWT_SECRET);
}

export async function verifyToken(
  token: string
): Promise<{ userId: string }> {
  const { payload } = await jwtVerify(token, JWT_SECRET);
  return { userId: payload.userId as string };
}

export async function getSession(
  request: Request
): Promise<{ userId: string } | null> {
  try {
    // Try cookie first
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").filter(Boolean).map((c) => {
        const [key, ...rest] = c.split("=");
        return [key, rest.join("=")];
      })
    );
    const token = cookies["token"];

    if (token) {
      return await verifyToken(token);
    }

    // Try Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      return await verifyToken(authHeader.slice(7));
    }

    return null;
  } catch {
    return null;
  }
}
