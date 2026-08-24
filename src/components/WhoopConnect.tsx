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
      <p className="muted">
        WHOOP sync isn't set up yet for this deployment — see <code>cloudflare-worker/README.md</code>{' '}
        for the one-time setup.
      </p>
    );
  }

  if (status === 'connecting') {
    return <p className="muted">Connecting to WHOOP…</p>;
  }

  if (status === 'idle' || status === 'error') {
    return (
      <div>
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
