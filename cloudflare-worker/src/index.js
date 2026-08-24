/**
 * Minimal Cloudflare Worker that holds the WHOOP client_secret and performs the OAuth2
 * code<->token exchange and refresh on behalf of the (static, secret-less) frontend.
 *
 * Routes:
 *   POST /token    { code, redirectUri }   -> WHOOP token response
 *   POST /refresh  { refreshToken }        -> WHOOP token response
 *
 * Required Worker environment:
 *   WHOOP_CLIENT_ID      (plain var -- not secret, matches VITE_WHOOP_CLIENT_ID in the frontend)
 *   WHOOP_CLIENT_SECRET  (secret -- set with `wrangler secret put WHOOP_CLIENT_SECRET`, never committed)
 *   ALLOWED_ORIGIN        (plain var -- the frontend's origin, for CORS)
 */

const WHOOP_TOKEN_ENDPOINT = 'https://api.prod.whoop.com/oauth/oauth2/token';

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(body, status, env) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  });
}

async function exchangeWithWhoop(env, params) {
  const response = await fetch(WHOOP_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.WHOOP_CLIENT_ID,
      client_secret: env.WHOOP_CLIENT_SECRET,
      ...params,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // Forward WHOOP's status without echoing any secret; WHOOP's own error body is safe (no
    // secret in it) and useful for debugging a misconfigured client_id/redirect_uri.
    throw new WhoopExchangeError(response.status, data);
  }
  return data;
}

class WhoopExchangeError extends Error {
  constructor(status, body) {
    super(`WHOOP token exchange failed (${status})`);
    this.status = status;
    this.body = body;
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (!env.WHOOP_CLIENT_ID || !env.WHOOP_CLIENT_SECRET || !env.ALLOWED_ORIGIN) {
      return jsonResponse({ error: 'Worker is missing required environment configuration.' }, 500, env);
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/token') {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON body.' }, 400, env);
      }
      if (typeof body.code !== 'string' || typeof body.redirectUri !== 'string') {
        return jsonResponse({ error: 'Missing code or redirectUri.' }, 400, env);
      }
      try {
        const tokens = await exchangeWithWhoop(env, {
          grant_type: 'authorization_code',
          code: body.code,
          redirect_uri: body.redirectUri,
        });
        return jsonResponse(tokens, 200, env);
      } catch (err) {
        if (err instanceof WhoopExchangeError) return jsonResponse(err.body, err.status, env);
        return jsonResponse({ error: 'Unexpected error during token exchange.' }, 502, env);
      }
    }

    if (request.method === 'POST' && url.pathname === '/refresh') {
      let body;
      try {
        body = await request.json();
      } catch {
        return jsonResponse({ error: 'Invalid JSON body.' }, 400, env);
      }
      if (typeof body.refreshToken !== 'string') {
        return jsonResponse({ error: 'Missing refreshToken.' }, 400, env);
      }
      try {
        const tokens = await exchangeWithWhoop(env, {
          grant_type: 'refresh_token',
          refresh_token: body.refreshToken,
          scope: 'offline',
        });
        return jsonResponse(tokens, 200, env);
      } catch (err) {
        if (err instanceof WhoopExchangeError) return jsonResponse(err.body, err.status, env);
        return jsonResponse({ error: 'Unexpected error during token refresh.' }, 502, env);
      }
    }

    return jsonResponse({ error: 'Not found.' }, 404, env);
  },
};
