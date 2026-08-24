import type { WhoopDailyMetrics } from '../types';
import { clearWhoopTokens, loadWhoopTokens, mergeWhoopMetrics, saveWhoopTokens } from './storage';
import { fetchWhoopMetrics, refreshWhoopTokens, WhoopAuthExpiredError } from './whoopApi';

const SYNC_WINDOW_DAYS = 14;

export class WhoopNotConnectedError extends Error {}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Syncs the last two weeks of WHOOP data, refreshing the access token first if it's expired. */
export async function syncWhoop(): Promise<WhoopDailyMetrics[]> {
  let tokens = loadWhoopTokens();
  if (!tokens) throw new WhoopNotConnectedError('WHOOP is not connected.');

  if (Date.now() >= tokens.expiresAt) {
    tokens = await refreshWhoopTokens(tokens.refreshToken);
    saveWhoopTokens(tokens);
  }

  const startISO = isoDaysAgo(SYNC_WINDOW_DAYS);
  const endISO = isoDaysAgo(0);

  try {
    const metrics = await fetchWhoopMetrics(tokens.accessToken, startISO, endISO);
    return mergeWhoopMetrics(metrics);
  } catch (err) {
    if (!(err instanceof WhoopAuthExpiredError)) throw err;
    // Token expired mid-request (e.g. clock skew) -- refresh once and retry before giving up.
    tokens = await refreshWhoopTokens(tokens.refreshToken);
    saveWhoopTokens(tokens);
    const metrics = await fetchWhoopMetrics(tokens.accessToken, startISO, endISO);
    return mergeWhoopMetrics(metrics);
  }
}

export function disconnectWhoop(): void {
  clearWhoopTokens();
}
