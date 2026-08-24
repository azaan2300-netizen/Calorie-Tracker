/**
 * WHOOP OAuth 2.0 (Authorization Code flow). https://developer.whoop.com/docs/developing/oauth/
 *
 * WHOOP's token endpoint requires a client_secret for both the initial code exchange and every
 * refresh -- that can never live safely in this app's public client-side bundle. This module
 * only builds the authorize URL and manages the resulting tokens; the actual code<->secret
 * exchange happens server-side in a small Cloudflare Worker (see whoopApi.ts + cloudflare-worker/).
 */

const AUTHORIZE_ENDPOINT = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const SCOPES = ['offline', 'read:cycles', 'read:recovery'].join(' ');
const STATE_STORAGE_KEY = 'calorie-tracker:whoop-oauth-state';

export function isWhoopConfigured(): boolean {
  return Boolean(import.meta.env.VITE_WHOOP_CLIENT_ID && import.meta.env.VITE_WHOOP_TOKEN_PROXY_URL);
}

export function getRedirectUri(): string {
  // Must exactly match a redirect URI registered in the WHOOP Developer Dashboard.
  return `${window.location.origin}${window.location.pathname}`;
}

function generateState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Builds the URL to send the user to WHOOP's consent screen, storing a CSRF state to verify later. */
export function buildAuthorizeUrl(): string {
  const clientId = import.meta.env.VITE_WHOOP_CLIENT_ID;
  if (!clientId) throw new Error('WHOOP integration is not configured.');
  const state = generateState();
  sessionStorage.setItem(STATE_STORAGE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    scope: SCOPES,
    state,
  });
  return `${AUTHORIZE_ENDPOINT}?${params.toString()}`;
}

export interface OAuthCallbackResult {
  code: string | null;
  error: string | null;
}

/**
 * Reads the `code`/`state`/`error` query params left by WHOOP's redirect, validates the CSRF
 * state, and strips them from the URL so a page refresh doesn't try to reuse a spent code.
 */
export function consumeOAuthCallback(): OAuthCallbackResult {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const state = params.get('state');
  const error = params.get('error');

  if (!code && !error) return { code: null, error: null };

  const expectedState = sessionStorage.getItem(STATE_STORAGE_KEY);
  sessionStorage.removeItem(STATE_STORAGE_KEY);

  // Clean the query string so refreshing the page doesn't resubmit a used/expired code.
  const cleanUrl = `${window.location.origin}${window.location.pathname}`;
  window.history.replaceState({}, '', cleanUrl);

  if (error) return { code: null, error };
  if (!expectedState || state !== expectedState) {
    return { code: null, error: 'Login could not be verified (state mismatch). Please try connecting again.' };
  }
  return { code, error: null };
}
