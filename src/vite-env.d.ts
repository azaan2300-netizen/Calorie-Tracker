/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** WHOOP Developer Dashboard client ID (public, safe to embed -- the client_secret is not). */
  readonly VITE_WHOOP_CLIENT_ID?: string;
  /** Base URL of the deployed Cloudflare Worker that proxies the WHOOP token exchange. */
  readonly VITE_WHOOP_TOKEN_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
