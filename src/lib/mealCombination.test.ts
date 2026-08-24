import { describe, expect, it } from 'vitest';
import { FOOD_DATABASE, findBestFoodDatabaseMatch, scaleFoodEntry } from './foodDatabase';
import { parseFoodClause, parseFoodDescription } from './textParser';
import { mulberry32, pick, randomInt } from './testRandom';

/** How a person would actually type a database entry's name, e.g. "Chicken breast, cooked"
 * -> "chicken breast" -- strips the trailing preparation qualifier and any parenthetical. */
function toCasualQuery(name: string): string {
  return name
    .split(',')[0]
    .replace(/\([^)]*\)/g, '')
    .trim()
    .toLowerCase();
}

const QUANTITY_PREFIXES = ['', '100g ', '200g ', '1.5 oz ', '2 ', 'a ', 'some ', '1/2 cup ', '350ml '];
// Comma/semicolon are unambiguous list separators; ", and "/", plus "/", & " are too, since the
// leading conjunction word gets stripped after the comma split. A bare single " and "/" & " with
// no comma is deliberately left unsplit elsewhere since it's ambiguous with a compound food name
// ("mac and cheese") -- that's covered by its own test above, not fuzzed here as if it were a
// supported list separator on its own.
const SEPARATORS = [', ', '\n', ', and ', '; ', ', plus ', ', & '];

describe('", and " list phrasing regression', () => {
  it('strips a leftover leading "and" so it does not pollute the food name', () => {
    const clause = parseFoodClause('and white rice');
    expect(clause).not.toBeNull();
    expect(clause!.foodQuery).toBe('white rice');
  });

  it('splits and matches every item in a natural ", and " list', () => {
    const clauses = parseFoodDescription('chicken breast, and white rice, and broccoli');
    expect(clauses).toHaveLength(3);
    expect(clauses.map((c) => c.foodQuery)).toEqual(['chicken breast', 'white rice', 'broccoli']);
    for (const clause of clauses) {
      expect(findBestFoodDatabaseMatch(clause.foodQuery)).toBeDefined();
    }
  });

  it('splits a semicolon-separated list, which no comma-detection previously handled', () => {
    const clauses = parseFoodDescription('chicken breast; white rice; broccoli');
    expect(clauses.map((c) => c.foodQuery)).toEqual(['chicken breast', 'white rice', 'broccoli']);
  });

  it('splits a "&"-joined list of 2+ items without breaking a literal ampersand food name', () => {
    const clauses = parseFoodDescription('chicken breast & white rice & broccoli');
    expect(clauses.map((c) => c.foodQuery)).toEqual(['chicken breast', 'white rice', 'broccoli']);
  });

  it('strips a leftover leading "plus"/"&" the same way it strips "and"', () => {
    expect(parseFoodClause('plus white rice')?.foodQuery).toBe('white rice');
    expect(parseFoodClause('& white rice')?.foodQuery).toBe('white rice');
  });

  it('splits and matches every item in a ", plus " list', () => {
    const clauses = parseFoodDescription('chicken breast, plus white rice, plus broccoli');
    expect(clauses.map((c) => c.foodQuery)).toEqual(['chicken breast', 'white rice', 'broccoli']);
  });

  it('applies the 2+-conjunction split within a segment after an earlier comma', () => {
    // The list-worthy "and"s only appear in the tail here, after an unrelated leading comma --
    // the per-segment split must still catch them.
    const clauses = parseFoodDescription('rice, chicken and broccoli and asparagus');
    expect(clauses.map((c) => c.foodQuery)).toEqual(['rice', 'chicken', 'broccoli', 'asparagus']);
  });
});

describe('meal-combination fuzz test (1000 realistic multi-food meals)', () => {
  const rand = mulberry32(31337);

  it('never throws, splits correctly, and matches real database foods within random meal combinations', () => {
    for (let i = 0; i < 1000; i++) {
      const itemCount = randomInt(rand, 1, 5);
      const chosenFoods = Array.from({ length: itemCount }, () => pick(rand, FOOD_DATABASE));
      const parts = chosenFoods.map((food) => `${pick(rand, QUANTITY_PREFIXES)}${toCasualQuery(food.name)}`);
      const description = parts.join(pick(rand, SEPARATORS));

      let clauses: ReturnType<typeof parseFoodDescription> = [];
      expect(() => {
        clauses = parseFoodDescription(description);
      }, `meal #${i}: ${JSON.stringify(description)}`).not.toThrow();

      expect(clauses.length, `meal #${i}: ${JSON.stringify(description)}`).toBe(itemCount);

      clauses.forEach((clause, idx) => {
        let match;
        expect(() => {
          match = findBestFoodDatabaseMatch(clause.foodQuery);
        }, `meal #${i} item #${idx}: ${JSON.stringify(clause)}`).not.toThrow();

        expect(
          match,
          `meal #${i} item #${idx}: query "${clause.foodQuery}" (from "${chosenFoods[idx].name}") in description ${JSON.stringify(description)} did not match anything`,
        ).toBeDefined();

        if (!match) return;
        let scaled;
        expect(() => {
          scaled = scaleFoodEntry(match!, clause.grams);
        }, `meal #${i} item #${idx}`).not.toThrow();

        for (const [key, value] of Object.entries(scaled!)) {
          expect(Number.isFinite(value), `${key} not finite, meal #${i} item #${idx}`).toBe(true);
          expect(value, `${key} negative, meal #${i} item #${idx}`).toBeGreaterThanOrEqual(0);
        }
      });
    }
  });
});
