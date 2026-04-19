/**
 * EdgeOne / Cloudflare Pages Edge Function
 * POST /api/commander/logout
 *
 * Two modes:
 *   API_BASE_URL set   → proxy to the Express API server
 *   API_BASE_URL unset → stateless (client discards the HMAC token)
 */

export async function onRequestPost(context) {
  const { env, request } = context;

  if (env.API_BASE_URL) {
    const base = env.API_BASE_URL.replace(/\/$/, "");
    return fetch(new Request(`${base}/api/commander/logout`, request));
  }

  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
