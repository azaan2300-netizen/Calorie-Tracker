/**
 * Curated common-foods reference table so manual logging can auto-calculate macros from just
 * a food name and a weight, instead of requiring calories/protein/carbs/fat every time.
 *
 * Values are per 100g and approximate standard USDA FoodData Central reference figures for
 * each food's typical preparation (noted in the name, e.g. "cooked" vs "raw") — they're a
 * reasonable estimate for that food in general, not a measurement of any specific product.
 * For a packaged product's actual label values, use barcode scanning instead.
 */

export interface FoodDatabaseEntry {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

export const FOOD_DATABASE: FoodDatabaseEntry[] = [
  { name: 'Chicken breast, cooked', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { name: 'Chicken thigh, cooked', caloriesPer100g: 209, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 10.9 },
  { name: 'Turkey breast, cooked', caloriesPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatPer100g: 1 },
  { name: 'Ground beef (85% lean), cooked', caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 17 },
  { name: 'Steak (sirloin), cooked', caloriesPer100g: 201, proteinPer100g: 27, carbsPer100g: 0, fatPer100g: 9.6 },
  { name: 'Pork chop, cooked', caloriesPer100g: 231, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 14 },
  { name: 'Bacon, cooked', caloriesPer100g: 541, proteinPer100g: 37, carbsPer100g: 1.4, fatPer100g: 42 },
  { name: 'Salmon, cooked', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
  { name: 'Tuna, canned in water', caloriesPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 0.8 },
  { name: 'Shrimp, cooked', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatPer100g: 0.3 },
  { name: 'Egg, whole, cooked', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
  { name: 'Egg white', caloriesPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatPer100g: 0.2 },
  { name: 'Tofu, firm', caloriesPer100g: 144, proteinPer100g: 15, carbsPer100g: 3, fatPer100g: 8.7 },
  { name: 'White rice, cooked', caloriesPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
  { name: 'Brown rice, cooked', caloriesPer100g: 123, proteinPer100g: 2.6, carbsPer100g: 26, fatPer100g: 1 },
  { name: 'Quinoa, cooked', caloriesPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9 },
  { name: 'Oats, dry', caloriesPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7 },
  { name: 'Oatmeal, cooked', caloriesPer100g: 71, proteinPer100g: 2.5, carbsPer100g: 12, fatPer100g: 1.5 },
  { name: 'Pasta, cooked', caloriesPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1.1 },
  { name: 'Whole wheat bread', caloriesPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatPer100g: 3.4 },
  { name: 'White bread', caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatPer100g: 3.2 },
  { name: 'Potato, baked', caloriesPer100g: 93, proteinPer100g: 2.5, carbsPer100g: 21, fatPer100g: 0.1 },
  { name: 'Sweet potato, baked', caloriesPer100g: 90, proteinPer100g: 2, carbsPer100g: 21, fatPer100g: 0.2 },
  { name: 'Corn, cooked', caloriesPer100g: 96, proteinPer100g: 3.4, carbsPer100g: 21, fatPer100g: 1.5 },
  { name: 'Black beans, cooked', caloriesPer100g: 132, proteinPer100g: 8.9, carbsPer100g: 24, fatPer100g: 0.5 },
  { name: 'Chickpeas, cooked', caloriesPer100g: 164, proteinPer100g: 8.9, carbsPer100g: 27, fatPer100g: 2.6 },
  { name: 'Lentils, cooked', caloriesPer100g: 116, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 0.4 },
  { name: 'Broccoli, cooked', caloriesPer100g: 35, proteinPer100g: 2.4, carbsPer100g: 7.2, fatPer100g: 0.4 },
  { name: 'Spinach, raw', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { name: 'Carrots, raw', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatPer100g: 0.2 },
  { name: 'Tomato', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatPer100g: 0.2 },
  { name: 'Cucumber', caloriesPer100g: 16, proteinPer100g: 0.7, carbsPer100g: 3.6, fatPer100g: 0.1 },
  { name: 'Avocado', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15 },
  { name: 'Banana', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { name: 'Apple', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2 },
  { name: 'Orange', caloriesPer100g: 47, proteinPer100g: 0.9, carbsPer100g: 12, fatPer100g: 0.1 },
  { name: 'Strawberries', caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatPer100g: 0.3 },
  { name: 'Blueberries', caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatPer100g: 0.3 },
  { name: 'Almonds', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50 },
  { name: 'Walnuts', caloriesPer100g: 654, proteinPer100g: 15, carbsPer100g: 14, fatPer100g: 65 },
  { name: 'Peanut butter', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50 },
  { name: 'Milk, whole', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatPer100g: 3.3 },
  { name: 'Milk, skim', caloriesPer100g: 34, proteinPer100g: 3.4, carbsPer100g: 5, fatPer100g: 0.1 },
  { name: 'Greek yogurt, plain nonfat', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { name: 'Yogurt, plain whole milk', caloriesPer100g: 61, proteinPer100g: 3.5, carbsPer100g: 4.7, fatPer100g: 3.3 },
  { name: 'Cottage cheese', caloriesPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3 },
  { name: 'Cheddar cheese', caloriesPer100g: 403, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33 },
  { name: 'Mozzarella cheese', caloriesPer100g: 280, proteinPer100g: 28, carbsPer100g: 3.1, fatPer100g: 17 },
  { name: 'Butter', caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatPer100g: 81 },
  { name: 'Olive oil', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { name: 'Popcorn, air-popped', caloriesPer100g: 387, proteinPer100g: 13, carbsPer100g: 78, fatPer100g: 4.5 },
  { name: 'French fries', caloriesPer100g: 312, proteinPer100g: 3.4, carbsPer100g: 41, fatPer100g: 15 },
  { name: 'Pizza, cheese', caloriesPer100g: 266, proteinPer100g: 11, carbsPer100g: 33, fatPer100g: 10 },
  { name: 'Dark chocolate', caloriesPer100g: 546, proteinPer100g: 4.9, carbsPer100g: 61, fatPer100g: 31 },
  { name: 'Ice cream, vanilla', caloriesPer100g: 207, proteinPer100g: 3.5, carbsPer100g: 24, fatPer100g: 11 },
  { name: 'Orange juice', caloriesPer100g: 45, proteinPer100g: 0.7, carbsPer100g: 10.4, fatPer100g: 0.2 },
  { name: 'Cola', caloriesPer100g: 42, proteinPer100g: 0, carbsPer100g: 10.6, fatPer100g: 0 },
  { name: 'Beer, light lager', caloriesPer100g: 43, proteinPer100g: 0.5, carbsPer100g: 3.6, fatPer100g: 0 },
  { name: 'Coffee, black', caloriesPer100g: 1, proteinPer100g: 0.1, carbsPer100g: 0, fatPer100g: 0 },
];

export function findFoodByName(name: string): FoodDatabaseEntry | undefined {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return undefined;
  return FOOD_DATABASE.find((f) => f.name.toLowerCase() === normalized);
}

export function searchFoodDatabase(query: string, limit = 8): FoodDatabaseEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(q)).slice(0, limit);
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    // crude singularization so "thighs"/"eggs" match "thigh"/"egg" in the database
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w));
}

/**
 * Fuzzy word-overlap match used by the free-text meal parser, so casual phrasing like
 * "chicken thighs" or "eggs" still finds "Chicken thigh, cooked" / "Egg, whole, cooked"
 * without requiring an exact name match. Ranks candidates by how much of the *query* they
 * account for first (so a short query like "rice" isn't penalized against a longer, more
 * descriptive database name), then prefers the entry with the fewest unrelated extra words.
 */
export function findBestFoodDatabaseMatch(query: string): FoodDatabaseEntry | undefined {
  const queryWords = [...new Set(normalizeWords(query))];
  if (queryWords.length === 0) return undefined;

  let best: FoodDatabaseEntry | undefined;
  let bestCoverage = 0;
  let bestExtraWords = Infinity;

  for (const food of FOOD_DATABASE) {
    const nameWords = normalizeWords(food.name);
    const nameWordSet = new Set(nameWords);
    const overlap = queryWords.filter((w) => nameWordSet.has(w)).length;
    if (overlap === 0) continue;

    const coverage = overlap / queryWords.length;
    const extraWords = nameWords.length - overlap;
    const better = coverage > bestCoverage || (coverage === bestCoverage && extraWords < bestExtraWords);
    if (better) {
      best = food;
      bestCoverage = coverage;
      bestExtraWords = extraWords;
    }
  }

  return bestCoverage >= 0.5 ? best : undefined;
}

export function scaleFoodEntry(entry: FoodDatabaseEntry, grams: number) {
  const factor = grams / 100;
  return {
    calories: Math.round(entry.caloriesPer100g * factor),
    proteinG: Math.round(entry.proteinPer100g * factor * 10) / 10,
    carbsG: Math.round(entry.carbsPer100g * factor * 10) / 10,
    fatG: Math.round(entry.fatPer100g * factor * 10) / 10,
  };
}
