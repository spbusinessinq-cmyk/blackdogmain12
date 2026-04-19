/**
 * EdgeOne / Cloudflare Pages Edge Function
 * POST /api/commander/logout
 *
 * Stateless logout — the client discards the token.
 * No server-side revocation is needed because the token is HMAC-signed
 * and expires after 24 h.
 */

export async function onRequestPost() {
  return new Response(JSON.stringify({ message: "Logged out" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
