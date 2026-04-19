/**
 * EdgeOne / Cloudflare Pages Edge Function
 * GET /api/commander/session
 *
 * Verifies the HMAC-signed token issued by the login function.
 * Returns { authenticated: true } when the token is valid and unexpired.
 */

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: JSON_HEADERS });
}

function b64Decode(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function hmacVerify(payload, sigB64, secret) {
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const bin = atob(sigB64);
    const sigBytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) sigBytes[i] = bin.charCodeAt(i);
    return await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
  } catch {
    return false;
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  const auth = request.headers.get("Authorization") ?? "";

  if (!auth.startsWith("Bearer ")) return json({ authenticated: false });

  const token = auth.slice(7);
  const secret = env.SESSION_SECRET ?? env.ADMIN_PASSWORD ?? "4451";

  const dot = token.indexOf(".");
  if (dot === -1) return json({ authenticated: false });

  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);

  let payload, data;
  try {
    payload = b64Decode(payloadB64);
    data = JSON.parse(payload);
  } catch {
    return json({ authenticated: false });
  }

  if (!data.exp || data.exp < Date.now()) return json({ authenticated: false });

  const valid = await hmacVerify(payload, sigB64, secret);
  return json({ authenticated: valid });
}
