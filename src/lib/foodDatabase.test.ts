import { describe, expect, it } from 'vitest';
import { FOOD_DATABASE, findBestFoodDatabaseMatch } from './foodDatabase';
import { mulberry32, pick, randomInt } from './testRandom';

describe('findBestFoodDatabaseMatch', () => {
  it('matches casual plural phrasing to a singular database entry', () => {
    expect(findBestFoodDatabaseMatch('chicken thighs')?.name).toBe('Chicken thigh, cooked');
    // "eggs" alone is genuinely ambiguous between whole egg and egg white entries -- either
    // is a reasonable match, unlike an unrelated food.
    expect(findBestFoodDatabaseMatch('eggs')?.name).toMatch(/egg/i);
  });

  it('matches a bare food name without preparation qualifiers', () => {
    expect(findBestFoodDatabaseMatch('rice')?.name).toMatch(/rice/i);
    expect(findBestFoodDatabaseMatch('banana')?.name).toBe('Banana');
  });

  it('matches accented input to its ASCII database entry (Unicode diacritic folding)', () => {
    expect(findBestFoodDatabaseMatch('piña colada')?.name).toBe('Pina colada');
    expect(findBestFoodDatabaseMatch('jalapeño')).toBeUndefined(); // not in the database, but must not throw/garble
    expect(findBestFoodDatabaseMatch('crème brûlée')?.name).toBe('Creme brulee');
  });

  it('still matches a branded product when its generic food category is covered', () => {
    // "trader joes ramen noodles" now reasonably matches the generic ramen entry, since half
    // the words describe an actual food we have -- the database can't know every brand, but
    // it shouldn't give up when the underlying food is a known category.
    expect(findBestFoodDatabaseMatch('trader joes ramen noodles')?.name).toBe('Ramen noodles, cooked');
  });

  it('returns undefined for a branded product with no matching food category at all', () => {
    expect(findBestFoodDatabaseMatch('trader joes cauliflower gnocchi')).toBeUndefined();
  });

  it('returns undefined for empty/whitespace input', () => {
    expect(findBestFoodDatabaseMatch('')).toBeUndefined();
    expect(findBestFoodDatabaseMatch('   ')).toBeUndefined();
  });
});

describe('findBestFoodDatabaseMatch fuzz test (1000 random queries)', () => {
  const rand = mulberry32(555);
  const words = FOOD_DATABASE.flatMap((f) => f.name.toLowerCase().split(/[^a-z]+/)).filter(Boolean);
  const junk = ['', ' ', '???', '🍔', 'a'.repeat(300), '123456', 'xyzzy qwerty'];

  function randomQuery(): string {
    if (rand() < 0.2) return pick(rand, junk);
    const n = randomInt(rand, 1, 4);
    return Array.from({ length: n }, () => pick(rand, words)).join(' ');
  }

  it('never throws and only returns entries that actually exist in the database', () => {
    for (let i = 0; i < 1000; i++) {
      const query = randomQuery();
      let result;
      expect(() => {
        result = findBestFoodDatabaseMatch(query);
      }, `query #${i}: ${JSON.stringify(query)}`).not.toThrow();
      if (result) {
        expect(FOOD_DATABASE.includes(result), `query #${i}: ${JSON.stringify(query)}`).toBe(true);
      }
    }
  });
});
