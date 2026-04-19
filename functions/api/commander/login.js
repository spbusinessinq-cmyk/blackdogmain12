/**
 * EdgeOne / Cloudflare Pages Edge Function
 * POST /api/commander/login
 *
 * Validates ADMIN_USERNAME / ADMIN_PASSWORD env vars and returns a
 * stateless HMAC-SHA256-signed token.  No database or in-memory store
 * required — the signature is verified on every subsequent request.
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

  let body = {};
  try {
    body = await request.json();
  } catch {
    /* malformed body — treat as empty */
  }

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
