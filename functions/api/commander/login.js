/**
 * EdgeOne / Cloudflare Pages Edge Function
 * POST /api/commander/login
 *
 * Two modes:
 *   API_BASE_URL set   → proxy to the Express API server (full commander works)
 *   API_BASE_URL unset → stateless HMAC-SHA256 auth (auth-only, no DB)
 */

const JSON_HEADERS = { "Content-Type": "application/json" };
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 h

function b64Encode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

async function hmacSign(payload, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  let bin = "";
  for (const b of new Uint8Array(sig)) bin += String.fromCharCode(b);
  return btoa(bin);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  // When a real API server is configured, proxy the login there so that
  // the returned token is stored in the Express in-memory store and is
  // accepted by all other requireAuth-protected routes.
  if (env.API_BASE_URL) {
    const base = env.API_BASE_URL.replace(/\/$/, "");
    return fetch(new Request(`${base}/api/commander/login`, request));
  }

  // Fallback: HMAC-signed stateless token (works without an API server;
  // only auth routes will function — data routes need API_BASE_URL).
  let body = {};
  try {
    body = await request.json();
  } catch { /* malformed body */ }

  const adminUsername = env.ADMIN_USERNAME ?? "rsr-admin";
  const adminPassword = env.ADMIN_PASSWORD ?? "4451";
  const secret = env.SESSION_SECRET ?? adminPassword;

  if (body.username !== adminUsername || body.password !== adminPassword) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const now = Date.now();
  const payload = JSON.stringify({ u: adminUsername, iat: now, exp: now + TOKEN_TTL_MS });
  const payloadB64 = b64Encode(payload);
  const sigB64 = await hmacSign(payload, secret);
  const token = `${payloadB64}.${sigB64}`;

  return new Response(JSON.stringify({ token, authenticated: true }), {
    status: 200,
    headers: JSON_HEADERS,
  });
}
