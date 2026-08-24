import { describe, expect, it } from 'vitest';
import { parseFoodClause, parseFoodDescription, splitFoodClauses } from './textParser';
import { mulberry32, pick, randomInt } from './testRandom';

const FOOD_WORDS = [
  'rice',
  'chicken',
  'mac and cheese',
  'peanut butter and jelly sandwich',
  'beer',
  'Miller Lite',
  '牛肉面',
  'café au lait',
  "shepherd's pie",
  '🍕',
  '',
  'a'.repeat(500),
];

const QUANTITY_PREFIXES = [
  '',
  '200g ',
  '2 cups ',
  '1 can of ',
  '3.5 oz ',
  '1/2 cup ',
  '2 ',
  'a ',
  'some ',
  'I ate ',
  'I had two ',
  '-5g ',
  '99999999999999999999g ',
  'NaN cups ',
  '  ',
];

const SEPARATORS = [', ', ' and ', '\n', ' with ', ', and '];

function randomDescription(rand: () => number): string {
  const itemCount = randomInt(rand, 1, 5);
  const parts: string[] = [];
  for (let i = 0; i < itemCount; i++) {
    const prefix = pick(rand, QUANTITY_PREFIXES);
    const food = pick(rand, FOOD_WORDS);
    parts.push(`${prefix}${food}`);
  }
  const sep = pick(rand, SEPARATORS);
  return parts.join(sep);
}

describe('parseFoodClause quantity extraction', () => {
  it('strips a glued quantity+unit (no space) from the food name', () => {
    const clause = parseFoodClause('200g rice');
    expect(clause).not.toBeNull();
    expect(clause!.foodQuery).toBe('rice');
    expect(clause!.grams).toBe(200);
    expect(clause!.assumed).toBe(false);
  });

  it('strips a spaced quantity+unit from the food name', () => {
    const clause = parseFoodClause('1.5 oz almonds');
    expect(clause).not.toBeNull();
    expect(clause!.foodQuery).toBe('almonds');
    expect(clause!.assumed).toBe(false);
  });

  it('handles a bare count with no unit', () => {
    const clause = parseFoodClause('2 eggs');
    expect(clause).not.toBeNull();
    expect(clause!.foodQuery).toBe('eggs');
    expect(clause!.assumed).toBe(true);
  });

  it('assumes a default serving when no quantity is given at all', () => {
    const clause = parseFoodClause('grilled chicken');
    expect(clause).not.toBeNull();
    expect(clause!.foodQuery).toBe('grilled chicken');
    expect(clause!.assumed).toBe(true);
  });
});

describe('text parser fuzz test (1000 random free-text descriptions)', () => {
  const rand = mulberry32(4242);

  it('never throws and always returns finite, bounded, non-empty clauses', () => {
    for (let i = 0; i < 1000; i++) {
      const text = randomDescription(rand);
      let clauses;
      expect(() => {
        clauses = parseFoodDescription(text);
      }, `input #${i}: ${JSON.stringify(text)}`).not.toThrow();

      for (const clause of clauses!) {
        expect(Number.isFinite(clause.grams), `grams not finite for input #${i}`).toBe(true);
        expect(clause.grams, `grams out of bounds for input #${i}`).toBeGreaterThanOrEqual(1);
        expect(clause.grams, `grams out of bounds for input #${i}`).toBeLessThanOrEqual(5000);
        expect(typeof clause.foodQuery).toBe('string');
        expect(clause.foodQuery.length, `empty foodQuery for input #${i}: ${JSON.stringify(text)}`).toBeGreaterThan(0);
        expect(typeof clause.quantityLabel).toBe('string');
        expect(typeof clause.assumed).toBe('boolean');
      }
    }
  });

  it('handles pathological inputs (non-string, huge, empty, whitespace-only) without throwing', () => {
    const pathological: unknown[] = [
      '',
      '   ',
      '\n\n\n',
      ',,,,,,',
      'and and and',
      'a'.repeat(10000),
      ',,'.repeat(200),
      null,
      undefined,
      42,
      {},
      [],
    ];
    for (const input of pathological) {
      expect(() => splitFoodClauses(input as never)).not.toThrow();
      expect(() => parseFoodClause(input as never)).not.toThrow();
      expect(() => parseFoodDescription(input as never)).not.toThrow();
    }
  });

  it('caps the number of clauses even for a huge number of separators', () => {
    const text = Array.from({ length: 500 }, (_, i) => `${i}g item${i}`).join(', ');
    const clauses = parseFoodDescription(text);
    expect(clauses.length).toBeLessThanOrEqual(50);
  });
});
