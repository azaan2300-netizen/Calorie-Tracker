import type { WhoopDailyMetrics, WhoopTokens } from '../types';

// https://developer.whoop.com/api/ -- v2 developer API. Data endpoints only need the Bearer
// access token (no secret); the token exchange/refresh below goes through our own Cloudflare
// Worker instead, since that step requires the client_secret (see whoopAuth.ts for why).
const WHOOP_API_BASE = 'https://api.prod.whoop.com/developer/v2';
const KJ_PER_KCAL = 4.184; // 1 kcal = 4.184 kJ; WHOOP reports energy burned in kilojoules.
const MAX_PAGES = 20; // defends against a runaway pagination loop on a malformed response

export class WhoopAuthExpiredError extends Error {}

interface TokenProxyResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
}

async function callTokenProxy(path: string, body: Record<string, string>): Promise<WhoopTokens> {
  const proxyUrl = import.meta.env.VITE_WHOOP_TOKEN_PROXY_URL;
  if (!proxyUrl) throw new Error('WHOOP integration is not configured.');

  const response = await fetch(`${proxyUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`WHOOP authorization failed (${response.status})`);
  }
  const data = (await response.json()) as TokenProxyResponse;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

export function exchangeCodeForTokens(code: string, redirectUri: string): Promise<WhoopTokens> {
  return callTokenProxy('/token', { code, redirectUri });
}

export function refreshWhoopTokens(refreshToken: string): Promise<WhoopTokens> {
  return callTokenProxy('/refresh', { refreshToken });
}

interface RawCycleScore {
  strain?: unknown;
  kilojoule?: unknown;
  average_heart_rate?: unknown;
  max_heart_rate?: unknown;
}

interface RawCycle {
  id?: unknown;
  start?: unknown;
  score_state?: unknown;
  score?: RawCycleScore;
}

interface RawRecoveryScore {
  recovery_score?: unknown;
}

interface RawRecovery {
  cycle_id?: unknown;
  score_state?: unknown;
  score?: RawRecoveryScore;
}

interface PaginatedResponse<T> {
  records?: T[];
  next_token?: string;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function dateFromISO(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

/**
 * Pure parse of one cycle + its matched recovery (if any) into our display shape.
 * Never throws, even on malformed input -- see whoopApi.test.ts.
 */
export function parseCycleWithRecovery(
  cycle: RawCycle | null | undefined,
  recovery: RawRecovery | null | undefined,
): WhoopDailyMetrics | null {
  if (!cycle || typeof cycle !== 'object') return null;
  if (cycle.score_state !== 'SCORED' || !cycle.score || typeof cycle.score !== 'object') return null;

  const dateISO = dateFromISO(cycle.start);
  if (!dateISO) return null;

  const kilojoule = toFiniteNumber(cycle.score.kilojoule);
  const strain = toFiniteNumber(cycle.score.strain);
  if (kilojoule === null || strain === null || kilojoule < 0 || strain < 0) return null;

  const recoveryScore =
    recovery && recovery.score_state === 'SCORED' && recovery.score && typeof recovery.score === 'object'
      ? toFiniteNumber(recovery.score.recovery_score)
      : null;

  return {
    dateISO,
    caloriesBurned: Math.round(kilojoule / KJ_PER_KCAL),
    strain: Math.round(strain * 10) / 10,
    avgHeartRate: toFiniteNumber(cycle.score.average_heart_rate),
    maxHeartRate: toFiniteNumber(cycle.score.max_heart_rate),
    recoveryScore: recoveryScore !== null ? Math.round(recoveryScore) : null,
  };
}

async function fetchAllPages<T>(accessToken: string, path: string, params: Record<string, string>): Promise<T[]> {
  const records: T[] = [];
  let nextToken: string | undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const search = new URLSearchParams({
      ...params,
      limit: '25',
      ...(nextToken ? { next_token: nextToken } : {}),
    });
    const response = await fetch(`${WHOOP_API_BASE}${path}?${search.toString()}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 401) throw new WhoopAuthExpiredError('WHOOP access token expired');
    if (!response.ok) throw new Error(`WHOOP request failed (${response.status})`);

    const data = (await response.json()) as PaginatedResponse<T>;
    records.push(...(data.records ?? []));
    nextToken = data.next_token;
    if (!nextToken) break;
  }
  return records;
}

/** Fetches and joins cycles + recovery for the given date range, returning per-day metrics. */
export async function fetchWhoopMetrics(
  accessToken: string,
  startISO: string,
  endISO: string,
): Promise<WhoopDailyMetrics[]> {
  const params = { start: `${startISO}T00:00:00.000Z`, end: `${endISO}T23:59:59.999Z` };
  const [cycles, recoveries] = await Promise.all([
    fetchAllPages<RawCycle>(accessToken, '/cycle', params),
    fetchAllPages<RawRecovery>(accessToken, '/recovery', params),
  ]);

  const recoveryByCycleId = new Map<string, RawRecovery>();
  for (const recovery of recoveries) {
    if (recovery?.cycle_id !== undefined && recovery.cycle_id !== null) {
      recoveryByCycleId.set(String(recovery.cycle_id), recovery);
    }
  }

  const results: WhoopDailyMetrics[] = [];
  for (const cycle of cycles) {
    const recovery = cycle?.id !== undefined && cycle.id !== null ? recoveryByCycleId.get(String(cycle.id)) : undefined;
    const parsed = parseCycleWithRecovery(cycle, recovery);
    if (parsed) results.push(parsed);
  }
  return results;
}
