export async function POST() {
  const response = Response.json({ success: true });
  const headers = new Headers(response.headers);
  headers.append(
    "Set-Cookie",
    "token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
  );

  return new Response(response.body, {
    status: 200,
    headers,
  });
}
