/**
 * EdgeOne / Cloudflare Pages Edge Function — catch-all proxy
 * Handles all /api/* routes not covered by a more-specific function file:
 *
 *   GET  /api/healthz
 *   POST /api/requests                         (public intake form)
 *   GET  /api/commander/requests
 *   GET  /api/commander/requests/:id
 *   PATCH /api/commander/requests/:id/status
 *   PATCH /api/commander/requests/:id/notes
 *   POST /api/commander/requests/:id/dispatch
 *   GET  /api/commander/logs
 *
 * Requires:
 *   API_BASE_URL env var — URL of the Express API server, e.g.
 *   https://api.blackdogsecurity.com  (no trailing slash)
 *
 * Without API_BASE_URL these routes return 503.
 * The three auth-specific functions (login / session / logout) take
 * precedence over this catch-all and handle their own proxy logic.
 */

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.API_BASE_URL) {
    return new Response(
      JSON.stringify({ error: "API server not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const base = env.API_BASE_URL.replace(/\/$/, "");
  const url = new URL(request.url);
  const target = `${base}${url.pathname}${url.search}`;

  // Clone the request to the target URL, forwarding all headers and body.
  return fetch(new Request(target, request));
}
