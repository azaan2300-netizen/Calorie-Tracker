import type { FoodEntry, Profile, WhoopDailyMetrics, WhoopTokens } from '../types';

const PROFILE_KEY = 'calorie-tracker:profile';
const ENTRIES_KEY = 'calorie-tracker:entries';
const WHOOP_TOKENS_KEY = 'calorie-tracker:whoop-tokens';
const WHOOP_METRICS_KEY = 'calorie-tracker:whoop-metrics';

export function loadProfile(): Profile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadEntries(): FoodEntry[] {
  const raw = localStorage.getItem(ENTRIES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as FoodEntry[];
  } catch {
    return [];
  }
}

export function saveEntries(entries: FoodEntry[]): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function loadWhoopTokens(): WhoopTokens | null {
  const raw = localStorage.getItem(WHOOP_TOKENS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WhoopTokens;
  } catch {
    return null;
  }
}

export function saveWhoopTokens(tokens: WhoopTokens): void {
  localStorage.setItem(WHOOP_TOKENS_KEY, JSON.stringify(tokens));
}

export function clearWhoopTokens(): void {
  localStorage.removeItem(WHOOP_TOKENS_KEY);
}

export function loadWhoopMetrics(): WhoopDailyMetrics[] {
  const raw = localStorage.getItem(WHOOP_METRICS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as WhoopDailyMetrics[];
  } catch {
    return [];
  }
}

/** Merges freshly synced days into the stored history, replacing any same-date entries. */
export function mergeWhoopMetrics(freshDays: WhoopDailyMetrics[]): WhoopDailyMetrics[] {
  const existing = loadWhoopMetrics();
  const freshDates = new Set(freshDays.map((d) => d.dateISO));
  const merged = [...existing.filter((d) => !freshDates.has(d.dateISO)), ...freshDays];
  merged.sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  localStorage.setItem(WHOOP_METRICS_KEY, JSON.stringify(merged));
  return merged;
}

export function todayISO(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}
