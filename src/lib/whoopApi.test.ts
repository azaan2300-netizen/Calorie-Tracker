import { describe, expect, it } from 'vitest';
import { parseCycleWithRecovery } from './whoopApi';
import { mulberry32, pick } from './testRandom';

describe('parseCycleWithRecovery', () => {
  it('parses a well-formed scored cycle with matching recovery', () => {
    const result = parseCycleWithRecovery(
      {
        id: 93845,
        start: '2026-08-24T02:25:44.774Z',
        score_state: 'SCORED',
        score: { strain: 12.4, kilojoule: 8288.297, average_heart_rate: 68, max_heart_rate: 141 },
      },
      { cycle_id: 93845, score_state: 'SCORED', score: { recovery_score: 44 } },
    );
    expect(result).toEqual({
      dateISO: '2026-08-24',
      caloriesBurned: Math.round(8288.297 / 4.184),
      strain: 12.4,
      avgHeartRate: 68,
      maxHeartRate: 141,
      recoveryScore: 44,
    });
  });

  it('returns null for an unscored cycle (still in progress)', () => {
    expect(parseCycleWithRecovery({ start: '2026-08-24T02:00:00Z', score_state: 'PENDING_SCORE' }, null)).toBeNull();
  });

  it('returns recoveryScore null when the cycle is scored but recovery is not', () => {
    const result = parseCycleWithRecovery(
      { start: '2026-08-24T02:00:00Z', score_state: 'SCORED', score: { strain: 5, kilojoule: 4000 } },
      { cycle_id: 1, score_state: 'PENDING_SCORE' },
    );
    expect(result?.recoveryScore).toBeNull();
  });

  it('returns recoveryScore null when there is no matching recovery at all', () => {
    const result = parseCycleWithRecovery(
      { start: '2026-08-24T02:00:00Z', score_state: 'SCORED', score: { strain: 5, kilojoule: 4000 } },
      undefined,
    );
    expect(result?.recoveryScore).toBeNull();
  });
});

const WEIRD_VALUES: unknown[] = [
  undefined,
  null,
  '',
  'not a number',
  '1e300',
  'NaN',
  Infinity,
  -Infinity,
  NaN,
  -50,
  0,
  1e12,
  {},
  [],
  true,
  'SCORED',
  'PENDING_SCORE',
  '2026-08-24T02:25:44.774Z',
  'not a date',
];

function randomOf(rand: () => number): unknown {
  return pick(rand, WEIRD_VALUES);
}

function randomCycle(rand: () => number): Record<string, unknown> {
  const cycle: Record<string, unknown> = {};
  if (rand() < 0.8) cycle.id = randomOf(rand);
  if (rand() < 0.8) cycle.start = randomOf(rand);
  if (rand() < 0.8) cycle.score_state = pick(rand, ['SCORED', 'PENDING_SCORE', ...WEIRD_VALUES]);
  if (rand() < 0.8) {
    cycle.score =
      rand() < 0.9
        ? {
            strain: rand() < 0.85 ? randomOf(rand) : undefined,
            kilojoule: rand() < 0.85 ? randomOf(rand) : undefined,
            average_heart_rate: randomOf(rand),
            max_heart_rate: randomOf(rand),
          }
        : randomOf(rand);
  }
  return cycle;
}

function randomRecovery(rand: () => number): Record<string, unknown> | null | undefined {
  if (rand() < 0.2) return pick(rand, [null, undefined]);
  const recovery: Record<string, unknown> = {};
  if (rand() < 0.8) recovery.cycle_id = randomOf(rand);
  if (rand() < 0.8) recovery.score_state = pick(rand, ['SCORED', 'PENDING_SCORE', ...WEIRD_VALUES]);
  if (rand() < 0.8) {
    recovery.score = rand() < 0.9 ? { recovery_score: randomOf(rand) } : randomOf(rand);
  }
  return recovery;
}

describe('parseCycleWithRecovery fuzz test (1000 malformed/edge-case payloads)', () => {
  const rand = mulberry32(2026);

  it('never throws, and any parsed result has finite non-negative fields', () => {
    for (let i = 0; i < 1000; i++) {
      const cycle = randomCycle(rand);
      const recovery = randomRecovery(rand);

      let result;
      let threw = false;
      try {
        result = parseCycleWithRecovery(cycle as never, recovery as never);
      } catch {
        threw = true;
      }
      expect(threw, `cycle #${i}: ${JSON.stringify({ cycle, recovery })}`).toBe(false);

      if (!result) continue;

      expect(Number.isFinite(result.caloriesBurned), `caloriesBurned, cycle #${i}`).toBe(true);
      expect(result.caloriesBurned, `caloriesBurned, cycle #${i}`).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(result.strain), `strain, cycle #${i}`).toBe(true);
      expect(result.strain, `strain, cycle #${i}`).toBeGreaterThanOrEqual(0);
      expect(typeof result.dateISO).toBe('string');
      expect(result.dateISO).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      if (result.avgHeartRate !== null) expect(Number.isFinite(result.avgHeartRate)).toBe(true);
      if (result.maxHeartRate !== null) expect(Number.isFinite(result.maxHeartRate)).toBe(true);
      if (result.recoveryScore !== null) expect(Number.isFinite(result.recoveryScore)).toBe(true);
    }
  });

  it('handles totally arbitrary top-level payload shapes without throwing', () => {
    const arbitraryPayloads: unknown[] = [undefined, null, 42, 'a string', [], { random: 'shape' }];
    for (const cyclePayload of arbitraryPayloads) {
      for (const recoveryPayload of arbitraryPayloads) {
        expect(() => parseCycleWithRecovery(cyclePayload as never, recoveryPayload as never)).not.toThrow();
      }
    }
  });
});
