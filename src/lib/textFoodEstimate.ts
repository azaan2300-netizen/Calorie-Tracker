import { parseFoodDescription } from './textParser';
import { scaleProductToGrams, searchFoodByName } from './openFoodFacts';

export interface FoodDraft {
  id: string;
  rawText: string;
  name: string;
  servingDesc: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  /** False when no Open Food Facts match was found; the draft still needs manual macros. */
  matched: boolean;
}

async function resolveClauseToDraft(clause: ReturnType<typeof parseFoodDescription>[number]): Promise<FoodDraft> {
  const base = {
    id: crypto.randomUUID(),
    rawText: clause.rawText,
  };

  let product = null;
  try {
    product = await searchFoodByName(clause.foodQuery);
  } catch {
    product = null;
  }

  const gramsLabel = `${clause.assumed ? '~' : ''}${Math.round(clause.grams)}g`;

  if (product) {
    const scaled = scaleProductToGrams(product, clause.grams);
    return {
      ...base,
      name: product.brand ? `${product.name} (${product.brand})` : product.name,
      servingDesc: `${clause.quantityLabel} (${gramsLabel})`,
      calories: scaled.calories,
      proteinG: scaled.proteinG,
      carbsG: scaled.carbsG,
      fatG: scaled.fatG,
      matched: true,
    };
  }

  return {
    ...base,
    name: clause.foodQuery,
    servingDesc: `${clause.quantityLabel} (${gramsLabel}) · no match found, enter macros manually`,
    calories: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    matched: false,
  };
}

/** Parses a free-text meal description and looks each item up against Open Food Facts. */
export async function estimateFoodDrafts(text: string): Promise<FoodDraft[]> {
  const clauses = parseFoodDescription(text);
  return Promise.all(clauses.map(resolveClauseToDraft));
}
