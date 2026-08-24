import { useEffect, useState } from 'react';
import { loadWhoopTokens, saveWhoopTokens } from '../lib/storage';
import { buildAuthorizeUrl, consumeOAuthCallback, getRedirectUri, isWhoopConfigured } from '../lib/whoopAuth';
import { exchangeCodeForTokens } from '../lib/whoopApi';
import { disconnectWhoop, syncWhoop } from '../lib/whoopSync';

type Status = 'not-configured' | 'idle' | 'connecting' | 'connected' | 'syncing' | 'error';

interface Props {
  onSynced: () => void;
}

export default function WhoopConnect({ onSynced }: Props) {
  const [status, setStatus] = useState<Status>(() => (isWhoopConfigured() ? 'idle' : 'not-configured'));
  const [error, setError] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!isWhoopConfigured()) return;

    const { code, error: callbackError } = consumeOAuthCallback();
    if (callbackError) {
      setError(callbackError);
      setStatus('error');
      return;
    }
    if (code) {
      setStatus('connecting');
      exchangeCodeForTokens(code, getRedirectUri())
        .then((tokens) => {
          saveWhoopTokens(tokens);
          return runSync();
        })
        .catch(() => {
          setError('Could not connect to WHOOP. Please try again.');
          setStatus('error');
        });
      return;
    }

    setStatus(loadWhoopTokens() ? 'connected' : 'idle');
    // Intentionally runs once on mount only, to detect an OAuth redirect landing and restore
    // any previously connected session -- not tied to any prop/state that should re-trigger it.
  }, []);

  async function runSync() {
    setStatus('syncing');
    setError('');
    try {
      await syncWhoop();
      setLastSyncedAt(new Date());
      setStatus('connected');
      onSynced();
    } catch {
      setError('Sync failed. Check your connection and try again.');
      setStatus('error');
    }
  }

  function handleConnect() {
    try {
      window.location.href = buildAuthorizeUrl();
    } catch {
      setError('WHOOP integration is not configured.');
      setStatus('error');
    }
  }

  function handleDisconnect() {
    disconnectWhoop();
    setLastSyncedAt(null);
    setStatus('idle');
  }

  if (status === 'not-configured') {
    return (
      <div className="whoop-setup-steps">
        <p className="muted">WHOOP sync needs a one-time setup before you can connect:</p>
        <ol className="muted">
          <li>
            Register an app at{' '}
            <a href="https://developer.whoop.com" target="_blank" rel="noopener noreferrer">
              developer.whoop.com
            </a>{' '}
            with redirect URL <code>{getRedirectUri()}</code> — this gives you a Client ID and Client
            Secret.
          </li>
          <li>
            Deploy the small Cloudflare Worker in <code>cloudflare-worker/</code> (it holds your Client
            Secret, which can't safely live in this site's public code) — full steps in{' '}
            <code>cloudflare-worker/README.md</code>.
          </li>
          <li>
            Set <code>VITE_WHOOP_CLIENT_ID</code> and <code>VITE_WHOOP_TOKEN_PROXY_URL</code> as GitHub
            repo variables (Settings → Secrets and variables → Actions → Variables), then trigger a
            rebuild.
          </li>
        </ol>
      </div>
    );
  }

  if (status === 'connecting') {
    return <p className="muted">Connecting to WHOOP…</p>;
  }

  if (status === 'idle' || status === 'error') {
    return (
      <div>
        <p className="muted">
          You'll log in on WHOOP's own page with your own WHOOP account — this app never sees your
          password, and only your data (synced to your browser) is stored.
        </p>
        {error && <p className="error">{error}</p>}
        <button type="button" className="secondary" onClick={handleConnect}>
          Connect WHOOP
        </button>
      </div>
    );
  }

  return (
    <div className="row-buttons">
      <button type="button" className="secondary" onClick={runSync} disabled={status === 'syncing'}>
        {status === 'syncing' ? 'Syncing…' : 'Sync WHOOP'}
      </button>
      <button type="button" className="secondary link-button" onClick={handleDisconnect}>
        Disconnect
      </button>
      {lastSyncedAt && <span className="muted">Last synced {lastSyncedAt.toLocaleTimeString()}</span>}
    </div>
  );
}
