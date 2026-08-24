// Open Food Facts: free, open, no-API-key product database (3M+ products) covering
// barcode -> nutrition-facts lookups. https://openfoodfacts.github.io/openfoodfacts-server/api/
const PRODUCT_ENDPOINT = 'https://world.openfoodfacts.org/api/v2/product';

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand: string;
  servingSize: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

interface OFFResponse {
  status: number;
  product?: {
    product_name?: string;
    generic_name?: string;
    brands?: string;
    serving_size?: string;
    nutriments?: Record<string, number>;
  };
}

export async function lookupBarcode(barcode: string): Promise<BarcodeProduct | null> {
  const fields = [
    'product_name',
    'generic_name',
    'brands',
    'serving_size',
    'nutriments',
  ].join(',');
  const response = await fetch(`${PRODUCT_ENDPOINT}/${encodeURIComponent(barcode)}.json?fields=${fields}`);
  if (!response.ok) {
    throw new Error(`Open Food Facts lookup failed (${response.status})`);
  }
  const data = (await response.json()) as OFFResponse;
  if (data.status !== 1 || !data.product) return null;

  const p = data.product;
  const n = p.nutriments ?? {};
  const name = p.product_name || p.generic_name;
  if (!name) return null;

  return {
    barcode,
    name,
    brand: p.brands ?? '',
    servingSize: p.serving_size ?? '100 g',
    caloriesPer100g: n['energy-kcal_100g'] ?? 0,
    proteinPer100g: n['proteins_100g'] ?? 0,
    carbsPer100g: n['carbohydrates_100g'] ?? 0,
    fatPer100g: n['fat_100g'] ?? 0,
  };
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
