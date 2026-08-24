// Open Food Facts: free, open, no-API-key product database (3M+ products) covering
// barcode -> nutrition-facts lookups, and a text search endpoint for the free-text logger.
// https://openfoodfacts.github.io/openfoodfacts-server/api/
const PRODUCT_ENDPOINT = 'https://world.openfoodfacts.org/api/v2/product';
const SEARCH_ENDPOINT = 'https://world.openfoodfacts.org/cgi/search.pl';

const PRODUCT_FIELDS = [
  'product_name',
  'product_name_en',
  'generic_name',
  'brands',
  'quantity',
  'product_quantity',
  'serving_size',
  'serving_quantity',
  'categories',
  'nutriments',
].join(',');

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  /** Free-text pack size as OFF has it, e.g. "355 ml", "6 x 355 ml". */
  quantityText: string;
  /** Free-text serving size as OFF has it, e.g. "355 ml (1 can)". */
  servingSizeText: string;
  /** Grams (or mL, treated 1:1) per serving, when OFF provides a parseable serving_quantity. */
  servingGrams: number | null;
  /** Grams (or mL) in the whole package, when OFF provides a parseable product_quantity. */
  packGrams: number | null;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  /** Per-serving macros, when OFF publishes `_serving` nutriment fields directly. */
  perServing: { calories: number; proteinG: number; carbsG: number; fatG: number } | null;
}

interface OFFProductJson {
  product_name?: string;
  product_name_en?: string;
  generic_name?: string;
  brands?: string;
  quantity?: string;
  product_quantity?: string | number;
  serving_size?: string;
  serving_quantity?: string | number;
  categories?: string;
  nutriments?: Record<string, unknown>;
}

interface OFFProductResponse {
  status: number;
  product?: OFFProductJson;
}

interface OFFSearchResponse {
  products?: OFFProductJson[];
}

function toFiniteNumber(value: unknown): number | null {
  const num = typeof value === 'string' ? Number(value) : value;
  return typeof num === 'number' && Number.isFinite(num) ? num : null;
}

// Bounds used to clamp untrusted API data to physically sane values. Without this, a
// malformed/extreme field (e.g. a corrupted "1e300") can still be a finite JS number on its
// own, but multiplying two such values together in the scaling helpers below overflows to
// Infinity — clamping at the parsing boundary keeps every downstream calculation finite.
const MAX_KCAL_PER_100G = 900; // pure fat is ~900 kcal/100g, the physical ceiling for food
const MAX_GRAMS_PER_100G = 100; // can't have more than 100g of a macro in 100g of food
const MAX_PACK_GRAMS = 20000; // generous ceiling for even a large multipack
const MAX_SERVING_KCAL = 20000; // generous ceiling for a single serving/package
const MAX_SERVING_GRAMS = 5000;

function boundedNonNegative(value: unknown, max: number): number {
  const num = toFiniteNumber(value);
  if (num === null || num <= 0) return 0;
  return Math.min(num, max);
}

function boundedPositive(value: unknown, max: number): number | null {
  const num = toFiniteNumber(value);
  if (num === null || num <= 0) return null;
  return Math.min(num, max);
}

/**
 * Pure parsing of an Open Food Facts product payload into our BarcodeProduct shape.
 * Kept separate from the network call so it can be fuzz-tested against arbitrary/malformed
 * JSON without hitting the network (see openFoodFacts.test.ts).
 */
export function parseProductJson(barcode: string, product: OFFProductJson | undefined | null): BarcodeProduct | null {
  if (!product || typeof product !== 'object') return null;

  const name = product.product_name || product.product_name_en || product.generic_name;
  if (!name || typeof name !== 'string') return null;

  const n = product.nutriments && typeof product.nutriments === 'object' ? product.nutriments : {};

  const servingGrams = boundedPositive(product.serving_quantity, MAX_SERVING_GRAMS);
  const packGrams = boundedPositive(product.product_quantity, MAX_PACK_GRAMS);

  const perServingCaloriesRaw = toFiniteNumber(n['energy-kcal_serving']);
  const perServing =
    perServingCaloriesRaw !== null
      ? {
          calories: Math.round(boundedNonNegative(perServingCaloriesRaw, MAX_SERVING_KCAL)),
          proteinG: boundedNonNegative(n['proteins_serving'], MAX_SERVING_GRAMS),
          carbsG: boundedNonNegative(n['carbohydrates_serving'], MAX_SERVING_GRAMS),
          fatG: boundedNonNegative(n['fat_serving'], MAX_SERVING_GRAMS),
        }
      : null;

  return {
    barcode,
    name,
    brand: typeof product.brands === 'string' ? product.brands : '',
    category: typeof product.categories === 'string' ? product.categories.split(',')[0]?.trim() ?? '' : '',
    quantityText: typeof product.quantity === 'string' ? product.quantity : '',
    servingSizeText: typeof product.serving_size === 'string' ? product.serving_size : '',
    servingGrams,
    packGrams,
    caloriesPer100g: boundedNonNegative(n['energy-kcal_100g'], MAX_KCAL_PER_100G),
    proteinPer100g: boundedNonNegative(n['proteins_100g'], MAX_GRAMS_PER_100G),
    carbsPer100g: boundedNonNegative(n['carbohydrates_100g'], MAX_GRAMS_PER_100G),
    fatPer100g: boundedNonNegative(n['fat_100g'], MAX_GRAMS_PER_100G),
    perServing,
  };
}

export async function lookupBarcode(barcode: string): Promise<BarcodeProduct | null> {
  const response = await fetch(`${PRODUCT_ENDPOINT}/${encodeURIComponent(barcode)}.json?fields=${PRODUCT_FIELDS}`);
  if (!response.ok) {
    throw new Error(`Open Food Facts lookup failed (${response.status})`);
  }
  const data = (await response.json()) as OFFProductResponse;
  if (data.status !== 1) return null;
  return parseProductJson(barcode, data.product);
}

/** True when a product actually has usable nutrition data, vs. an incomplete crowd-sourced entry. */
export function hasUsableNutrition(product: BarcodeProduct): boolean {
  return product.caloriesPer100g > 0 || product.perServing !== null;
}

/** Best-effort text search, used by the free-text meal logger. Returns the top usable match. */
export async function searchFoodByName(query: string): Promise<BarcodeProduct | null> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: '1',
    action: 'process',
    json: '1',
    page_size: '5',
    sort_by: 'unique_scans_n',
    fields: PRODUCT_FIELDS,
  });
  const response = await fetch(`${SEARCH_ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Open Food Facts search failed (${response.status})`);
  }
  const data = (await response.json()) as OFFSearchResponse;
  const candidates = data.products ?? [];

  // Open Food Facts is crowd-sourced, so the most-scanned match for a niche/store-brand item
  // sometimes has an incomplete entry (no nutrition facts filled in yet). Prefer the first
  // candidate that actually has usable data over blindly taking the very first result -- a
  // "match" reporting 0 calories would silently mislead more than an honest no-match would.
  for (const candidate of candidates) {
    const parsed = parseProductJson(query, candidate);
    if (parsed && hasUsableNutrition(parsed)) return parsed;
  }
  return null;
}

/** True when the whole package is essentially one serving (e.g. a single can or bottle). */
export function isSingleServingContainer(product: BarcodeProduct): boolean {
  if (!product.servingGrams || !product.packGrams) return false;
  return Math.abs(product.packGrams - product.servingGrams) / product.packGrams < 0.15;
}

export function scaleProductToGrams(product: BarcodeProduct, grams: number) {
  const factor = grams / 100;
  return {
    calories: Math.round(product.caloriesPer100g * factor),
    proteinG: Math.round(product.proteinPer100g * factor * 10) / 10,
    carbsG: Math.round(product.carbsPer100g * factor * 10) / 10,
    fatG: Math.round(product.fatPer100g * factor * 10) / 10,
  };
}

/** Scales macros by a number of servings, preferring OFF's own per-serving figures when present. */
export function scaleProductByServings(product: BarcodeProduct, servings: number) {
  if (product.perServing) {
    return {
      calories: Math.round(product.perServing.calories * servings),
      proteinG: Math.round(product.perServing.proteinG * servings * 10) / 10,
      carbsG: Math.round(product.perServing.carbsG * servings * 10) / 10,
      fatG: Math.round(product.perServing.fatG * servings * 10) / 10,
    };
  }
  const gramsPerServing = product.servingGrams ?? 100;
  return scaleProductToGrams(product, gramsPerServing * servings);
}
