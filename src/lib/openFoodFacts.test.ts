import { describe, expect, it } from 'vitest';
import {
  parseProductJson,
  isSingleServingContainer,
  scaleProductToGrams,
  scaleProductByServings,
  hasUsableNutrition,
} from './openFoodFacts';
import { mulberry32, pick } from './testRandom';

describe('hasUsableNutrition', () => {
  it('is false for a product with no calorie or per-serving data (incomplete crowd-sourced entry)', () => {
    const incomplete = parseProductJson('123', { product_name: 'Some Niche Snack', nutriments: {} });
    expect(incomplete).not.toBeNull();
    expect(hasUsableNutrition(incomplete!)).toBe(false);
  });

  it('is true when per-100g calories are present', () => {
    const complete = parseProductJson('123', {
      product_name: 'Some Snack',
      nutriments: { 'energy-kcal_100g': 200 },
    });
    expect(hasUsableNutrition(complete!)).toBe(true);
  });

  it('is true when only per-serving calories are present (no per-100g)', () => {
    const servingOnly = parseProductJson('123', {
      product_name: 'Some Snack',
      nutriments: { 'energy-kcal_serving': 150 },
    });
    expect(hasUsableNutrition(servingOnly!)).toBe(true);
  });
});

/** Mirrors the candidate-selection loop inside searchFoodByName, without the network call,
 * so the "skip incomplete entries" behavior is directly testable. */
function selectBestCandidate(query: string, candidates: Parameters<typeof parseProductJson>[1][]) {
  for (const candidate of candidates) {
    const parsed = parseProductJson(query, candidate);
    if (parsed && hasUsableNutrition(parsed)) return parsed;
  }
  return null;
}

describe('search candidate selection (skips incomplete crowd-sourced entries)', () => {
  it('skips a popular-but-incomplete match in favor of a later complete one', () => {
    const candidates = [
      { product_name: 'Popular But Incomplete', nutriments: {} },
      { product_name: 'Less Popular But Complete', nutriments: { 'energy-kcal_100g': 250 } },
    ];
    const result = selectBestCandidate('some query', candidates);
    expect(result?.name).toBe('Less Popular But Complete');
  });

  it('returns null when every candidate is incomplete, rather than a misleading 0-kcal match', () => {
    const candidates = [
      { product_name: 'Incomplete One', nutriments: {} },
      { product_name: 'Incomplete Two', nutriments: {} },
    ];
    expect(selectBestCandidate('some query', candidates)).toBeNull();
  });

  it('returns null for an empty candidate list', () => {
    expect(selectBestCandidate('some query', [])).toBeNull();
  });
});

// A grab-bag of "weird" values fuzzed into product fields: missing, wrong type, negative,
// huge, NaN-producing strings, empty, etc. The parser must never throw on any combination.
const WEIRD_VALUES: unknown[] = [
  undefined,
  null,
  '',
  'not a number',
  '  42  ',
  '-15',
  '1e300',
  'NaN',
  'Infinity',
  0,
  -50,
  1e12,
  NaN,
  Infinity,
  -Infinity,
  {},
  [],
  true,
  false,
  '355 ml',
  '6 x 355 ml',
];

function randomOf(rand: () => number): unknown {
  return pick(rand, WEIRD_VALUES);
}

function randomProductJson(rand: () => number): Record<string, unknown> {
  const nutrimentKeys = [
    'energy-kcal_100g',
    'proteins_100g',
    'carbohydrates_100g',
    'fat_100g',
    'energy-kcal_serving',
    'proteins_serving',
    'carbohydrates_serving',
    'fat_serving',
  ];
  const nutriments: Record<string, unknown> = {};
  for (const key of nutrimentKeys) {
    if (rand() < 0.7) nutriments[key] = randomOf(rand);
  }

  const product: Record<string, unknown> = {};
  if (rand() < 0.8) product.product_name = pick(rand, [undefined, null, '', 'Miller Lite', 123, {}]);
  if (rand() < 0.3) product.product_name_en = randomOf(rand);
  if (rand() < 0.3) product.generic_name = randomOf(rand);
  if (rand() < 0.5) product.brands = randomOf(rand);
  if (rand() < 0.5) product.quantity = randomOf(rand);
  if (rand() < 0.5) product.product_quantity = randomOf(rand);
  if (rand() < 0.5) product.serving_size = randomOf(rand);
  if (rand() < 0.5) product.serving_quantity = randomOf(rand);
  if (rand() < 0.3) product.categories = randomOf(rand);
  if (rand() < 0.9) product.nutriments = nutriments;
  return product;
}

describe('parseProductJson fuzz test (1000 malformed/edge-case payloads)', () => {
  const rand = mulberry32(7);

  it('never throws, and any parsed result has finite non-negative numeric fields', () => {
    for (let i = 0; i < 1000; i++) {
      const payload = randomProductJson(rand);
      let result: ReturnType<typeof parseProductJson> = null;
      let threw = false;
      try {
        result = parseProductJson('000000000000', payload);
      } catch {
        threw = true;
      }
      expect(threw, `payload #${i} threw: ${JSON.stringify(payload)}`).toBe(false);

      if (result === null) continue;

      for (const field of ['caloriesPer100g', 'proteinPer100g', 'carbsPer100g', 'fatPer100g'] as const) {
        expect(Number.isFinite(result[field]), `${field} not finite, payload #${i}`).toBe(true);
        expect(result[field], `${field} negative, payload #${i}`).toBeGreaterThanOrEqual(0);
      }
      expect(typeof result.name).toBe('string');
      expect(result.name.length).toBeGreaterThan(0);

      if (result.servingGrams !== null) {
        expect(Number.isFinite(result.servingGrams)).toBe(true);
        expect(result.servingGrams).toBeGreaterThan(0);
      }
      if (result.packGrams !== null) {
        expect(Number.isFinite(result.packGrams)).toBe(true);
        expect(result.packGrams).toBeGreaterThan(0);
      }
      if (result.perServing) {
        for (const value of Object.values(result.perServing)) {
          expect(Number.isFinite(value)).toBe(true);
        }
      }

      // Derived helpers must also never throw and must stay finite/non-negative.
      expect(() => isSingleServingContainer(result!)).not.toThrow();
      for (const grams of [0, 1, 100, 5000, -5]) {
        const scaled = scaleProductToGrams(result, grams);
        for (const value of Object.values(scaled)) {
          expect(Number.isFinite(value), `scaleProductToGrams payload #${i} grams=${grams}`).toBe(true);
        }
      }
      for (const servings of [0, 0.5, 1, 3, -1]) {
        const scaled = scaleProductByServings(result, servings);
        for (const value of Object.values(scaled)) {
          expect(Number.isFinite(value), `scaleProductByServings payload #${i} servings=${servings}`).toBe(true);
        }
      }
    }
  });

  it('handles totally arbitrary top-level payload shapes without throwing', () => {
    const arbitraryPayloads: unknown[] = [
      undefined,
      null,
      42,
      'a string',
      [],
      { random: 'shape' },
    ];
    let seed = 99;
    for (let i = 0; i < 50; i++) {
      seed += 1;
      const r = mulberry32(seed);
      const shape = pick(r, arbitraryPayloads);
      expect(() => parseProductJson('123', shape as never)).not.toThrow();
    }
  });
});
