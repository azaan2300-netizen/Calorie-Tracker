import { describe, expect, it } from 'vitest';
import { FOOD_DATABASE, findBestFoodDatabaseMatch, scaleFoodEntry } from './foodDatabase';
import { parseFoodDescription } from './textParser';
import { mulberry32, pick, randomInt } from './testRandom';

/**
 * The comprehensive "user testing" round requested directly: 10 independently-seeded rounds
 * of 500 randomized food/drink/alcohol/cocktail entries each (5,000 total), covering the full
 * breadth of the now 380+-entry database (proteins, grains, produce, dairy, desserts, Asian /
 * Indian / Middle Eastern / Latin cuisine, alcohol & cocktails, seasonings, exotic fruit,
 * coffee/tea) plus deliberately adversarial input (emoji, script tags, extreme lengths, mixed
 * scripts, accented characters). Each round is its own `it` so a failure names which round and
 * which of the 500 inputs broke it, not just "the fuzz test failed."
 */

function toCasualQuery(name: string): string {
  return name
    .split(',')[0]
    .replace(/\([^)]*\)/g, '')
    .trim()
    .toLowerCase();
}

const QUANTITY_PREFIXES = [
  '',
  '100g ',
  '200g ',
  '1.5 oz ',
  '2 ',
  'a ',
  'some ',
  '1/2 cup ',
  '350ml ',
  'a shot of ',
  'a glass of ',
  'a pint of ',
  'a can of ',
  'a bottle of ',
  'a slice of ',
  '3 ',
  '0.5 ',
  '10000000g ',
  '-5g ',
  '0g ',
  'NaN ',
];

const SEPARATORS = [', ', '\n', ', and ', '; ', ', plus ', ', & ', ', as well as ', ', along with '];

// Deliberately adversarial / edge-case standalone inputs, unrelated to real database entries.
const ADVERSARIAL_POOL = [
  '',
  ' ',
  '   ',
  '???',
  '🍹🍕🌮🍺🥂',
  'a'.repeat(500),
  ',,,,,,,,,,',
  '<script>alert(1)</script>',
  'NaN cups of nothing',
  '\t\t\t\n\n',
  '汉堡包和米饭',
  'crème brûlée',
  'jalapeño popper',
  'piña colada',
  '00000000000000000000g rice',
  'undefined',
  'null',
  '한국 음식 그리고 김치',
  'a, , , b, , c',
  '-Infinity servings of soup',
  'a'.repeat(50) + ', ' + 'b'.repeat(50) + ', ' + 'c'.repeat(50),
  '🍺'.repeat(20),
  '999999999999999999999999999999g beer',
];

function randomDescription(rand: () => number): { description: string; isAdversarial: boolean } {
  if (rand() < 0.15) {
    return { description: pick(rand, ADVERSARIAL_POOL), isAdversarial: true };
  }
  const itemCount = randomInt(rand, 1, 6);
  const chosen = Array.from({ length: itemCount }, () => pick(rand, FOOD_DATABASE));
  const parts = chosen.map((food) => `${pick(rand, QUANTITY_PREFIXES)}${toCasualQuery(food.name)}`);
  return { description: parts.join(pick(rand, SEPARATORS)), isAdversarial: false };
}

describe('comprehensive 10x500 fuzz round (foods, drinks, alcohol, cocktails)', () => {
  const rounds = Array.from({ length: 10 }, (_, i) => i);

  it.each(rounds)('round %i of 10: 500 entries never crash and produce sane, bounded output', (roundIndex) => {
    const rand = mulberry32(500000 + roundIndex * 104729);
    let matchedCount = 0;
    let unmatchedCount = 0;

    for (let i = 0; i < 500; i++) {
      const { description, isAdversarial } = randomDescription(rand);
      const label = `round ${roundIndex} entry #${i}: ${JSON.stringify(description).slice(0, 120)}`;

      let clauses: ReturnType<typeof parseFoodDescription> = [];
      let parseThrew = false;
      try {
        clauses = parseFoodDescription(description);
      } catch {
        parseThrew = true;
      }
      expect(parseThrew, `parseFoodDescription threw -- ${label}`).toBe(false);
      expect(clauses.length, `too many clauses -- ${label}`).toBeLessThanOrEqual(50);

      for (const clause of clauses) {
        expect(Number.isFinite(clause.grams), `grams not finite -- ${label}`).toBe(true);
        expect(clause.grams, `grams out of bounds -- ${label}`).toBeGreaterThanOrEqual(1);
        expect(clause.grams, `grams out of bounds -- ${label}`).toBeLessThanOrEqual(5000);
        expect(typeof clause.foodQuery, `foodQuery not a string -- ${label}`).toBe('string');
        expect(clause.foodQuery.length, `empty foodQuery -- ${label}`).toBeGreaterThan(0);

        let match;
        let matchThrew = false;
        try {
          match = findBestFoodDatabaseMatch(clause.foodQuery);
        } catch {
          matchThrew = true;
        }
        expect(matchThrew, `findBestFoodDatabaseMatch threw -- ${label}`).toBe(false);

        if (match) {
          matchedCount++;
          expect(FOOD_DATABASE.includes(match), `match not a real entry -- ${label}`).toBe(true);

          let scaled;
          expect(() => {
            scaled = scaleFoodEntry(match!, clause.grams);
          }, `scaleFoodEntry threw -- ${label}`).not.toThrow();

          for (const [key, value] of Object.entries(scaled!)) {
            expect(Number.isFinite(value), `${key} not finite -- ${label}`).toBe(true);
            expect(value, `${key} negative -- ${label}`).toBeGreaterThanOrEqual(0);
            // A single food item should never price out at more calories than a whole day's
            // worth of eating -- catches any latent overflow/scaling bug immediately.
            if (key === 'calories') {
              expect(value, `implausible calorie value -- ${label}`).toBeLessThan(50000);
            }
          }
        } else if (!isAdversarial) {
          unmatchedCount++;
        }
      }
    }

    // Non-adversarial inputs are built directly from real database entries, so the match rate
    // should be high; a low rate here would mean the matcher regressed for a large swath of the
    // database (e.g. a bad normalizeWords change), not just an expected ambiguous edge case.
    const totalRealAttempts = matchedCount + unmatchedCount;
    if (totalRealAttempts > 0) {
      const matchRate = matchedCount / totalRealAttempts;
      expect(matchRate, `round ${roundIndex}: match rate too low (${matchedCount}/${totalRealAttempts})`).toBeGreaterThan(
        0.85,
      );
    }
  });
});
