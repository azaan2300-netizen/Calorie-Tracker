/**
 * Free-text meal parsing. Pure and network-free by design so it can be fuzz-tested against
 * arbitrary strings (see textParser.test.ts) without hitting Open Food Facts.
 *
 * This is a heuristic quantity/unit extractor, not an AI model: it splits a description into
 * food clauses, pulls a leading quantity+unit off each one, and converts to a gram estimate.
 * When no quantity is given it assumes a typical single serving. Callers should treat the
 * result as a draft to review/edit, not a final answer.
 */

export interface ParsedFoodClause {
  rawText: string;
  foodQuery: string;
  grams: number;
  quantityLabel: string;
  /** True when we guessed the amount rather than parsing an explicit quantity. */
  assumed: boolean;
}

const FILLER_PREFIXES = [
  /^i\s+(ate|had|just ate|just had)\s+/i,
  /^i'm\s+eating\s+/i,
  /^eating\s+/i,
  /^also\s+/i,
  /^then\s+/i,
  // Left over when a list joined with a conjunction ("rice, and chicken", "rice, plus chicken",
  // "rice, & chicken", "rice, as well as chicken") gets comma-split.
  /^and\s+/i,
  /^plus\s+/i,
  /^&\s+/i,
  /^as well as\s+/i,
  /^along with\s+/i,
];

const LEADING_ARTICLE_WORDS = new Set(['a', 'an', 'the', 'some']);

const UNIT_TO_GRAMS: Record<string, number> = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  oz: 28.35,
  ounce: 28.35,
  ounces: 28.35,
  lb: 453.6,
  lbs: 453.6,
  pound: 453.6,
  pounds: 453.6,
  ml: 1,
  milliliter: 1,
  milliliters: 1,
  millilitre: 1,
  millilitres: 1,
  l: 1000,
  liter: 1000,
  liters: 1000,
  litre: 1000,
  litres: 1000,
  cup: 240,
  cups: 240,
  tbsp: 15,
  tablespoon: 15,
  tablespoons: 15,
  tsp: 5,
  teaspoon: 5,
  teaspoons: 5,
  slice: 30,
  slices: 30,
  piece: 100,
  pieces: 100,
  can: 355,
  cans: 355,
  bottle: 500,
  bottles: 500,
  serving: 100,
  servings: 100,
  shot: 44, // standard 1.5 fl oz pour
  shots: 44,
  glass: 240,
  glasses: 240,
  pint: 568,
  pints: 568,
  scoop: 30,
  scoops: 30,
  handful: 30,
  handfuls: 30,
};

const DEFAULT_SERVING_GRAMS = 150; // used when no quantity at all is given
const DEFAULT_ITEM_GRAMS = 80; // used for a bare count with no recognized unit, e.g. "2 eggs"
const MAX_CLAUSES = 50;
const MAX_CLAUSE_LENGTH = 200;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function stripFillers(text: string): string {
  let result = text.trim();
  // Re-pass so a combo like "and then rice" fully strips regardless of pattern order,
  // capped so pathological input can't loop indefinitely.
  for (let pass = 0; pass < 4; pass++) {
    const before = result;
    for (const re of FILLER_PREFIXES) {
      result = result.replace(re, '').trim();
    }
    if (result === before) break;
  }
  return result;
}

function parseAmountToken(token: string): number | null {
  const fraction = token.match(/^(\d+)\/(\d+)$/);
  if (fraction) {
    const den = Number(fraction[2]);
    return den ? Number(fraction[1]) / den : null;
  }
  if (/^\d+(\.\d+)?$/.test(token)) {
    const n = Number(token);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** Splits a leading "200g"/"1.5oz"/"1/2cup" token into its amount and (optional) glued unit. */
function parseLeadingQuantityToken(token: string): { amount: number; unit: string | null } | null {
  const match = token.match(/^(\d+\/\d+|\d+(?:\.\d+)?)([a-zA-Z]+)?$/);
  if (!match) return null;
  const amount = parseAmountToken(match[1]);
  if (amount === null || amount <= 0) return null;
  return { amount, unit: match[2] ? match[2].toLowerCase() : null };
}

export function splitFoodClauses(text: string): string[] {
  if (typeof text !== 'string') return [];
  const cleaned = text.replace(/[\r\n]+/g, ',').trim();
  if (!cleaned) return [];

  // Commas and semicolons are unambiguous list separators -- always split on them first.
  const primaryParts = /[,;]/.test(cleaned) ? cleaned.split(/[,;]/) : [cleaned];

  // Within each resulting segment, a single " and "/" & " is still genuinely ambiguous -- it
  // could be a two-item list ("chicken and rice") or a compound food name ("mac and cheese",
  // "peanut butter and jelly", "M&M's" -- note that one has no surrounding spaces around "&",
  // so it never matches here anyway). Only split when there are 2+ occurrences within that
  // segment, which reliably signals a real list; for exactly one, leave it as one query. Worst
  // case it fails to match and the user corrects it, which beats confidently splitting a real
  // food name in half. Applying this per-segment (not just to the whole string) catches a tail
  // like "rice, chicken and broccoli and asparagus" where the list-worthy "and"s only show up
  // after an earlier comma.
  const parts = primaryParts.flatMap((part) => {
    const trimmedPart = part.trim();
    if (!trimmedPart) return [];
    const conjunctionCount = (trimmedPart.match(/\s+(?:and|&)\s+/gi) ?? []).length;
    return conjunctionCount >= 2 ? trimmedPart.split(/\s+(?:and|&)\s+/i) : [trimmedPart];
  });

  return parts
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, MAX_CLAUSES);
}

export function parseFoodClause(rawText: string): ParsedFoodClause | null {
  if (typeof rawText !== 'string') return null;

  let cleaned = stripFillers(rawText.slice(0, MAX_CLAUSE_LENGTH));
  cleaned = cleaned.replace(/^of\s+/i, '').trim();
  if (!cleaned) return null;

  const tokens = cleaned.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return null;

  let grams: number | null = null;
  let assumed = true;
  let quantityLabel = '~1 serving (assumed)';
  let idx = 0;

  const leading = parseLeadingQuantityToken(tokens[0]);
  if (leading) {
    idx = 1;
    // Unit may be glued to the number ("200g") or given as the next token ("200 g").
    let unitToken = leading.unit;
    let labelTokens = [tokens[0]];
    if (!unitToken) {
      const next = tokens[1]?.toLowerCase().replace(/[.,]$/, '');
      if (next && UNIT_TO_GRAMS[next] !== undefined) {
        unitToken = next;
        idx = 2;
        labelTokens = [tokens[0], tokens[1]];
      }
    }

    const perUnitGrams = unitToken ? UNIT_TO_GRAMS[unitToken] : undefined;
    if (perUnitGrams) {
      grams = leading.amount * perUnitGrams;
      assumed = false;
      quantityLabel = labelTokens.join(' ');
    } else {
      grams = leading.amount * DEFAULT_ITEM_GRAMS;
      assumed = true;
      quantityLabel = `${tokens[0]} (assumed ${DEFAULT_ITEM_GRAMS}g each)`;
    }
    if (tokens[idx]?.toLowerCase() === 'of') idx += 1;
  } else if (LEADING_ARTICLE_WORDS.has(tokens[0]?.toLowerCase())) {
    // "a can of beer" / "a slice of pizza" / "a glass of wine" -- an article followed by a
    // known unit word implies a quantity of 1, the same as if the user had typed "1 can of
    // beer". Without this, the leftover unit word ("can"/"slice"/"glass"/...) stays stuck in
    // the food query and can drag a real match below the fuzzy matcher's coverage threshold.
    const possibleUnit = tokens[1]?.toLowerCase().replace(/[.,]$/, '');
    const perUnitGrams = possibleUnit ? UNIT_TO_GRAMS[possibleUnit] : undefined;
    if (perUnitGrams) {
      grams = perUnitGrams;
      assumed = false;
      quantityLabel = `${tokens[0]} ${possibleUnit}`;
      idx = 2;
      if (tokens[idx]?.toLowerCase() === 'of') idx += 1;
    }
  }

  if (grams === null) grams = DEFAULT_SERVING_GRAMS;

  let remainderTokens = tokens.slice(idx);
  if (remainderTokens[0] && LEADING_ARTICLE_WORDS.has(remainderTokens[0].toLowerCase())) {
    remainderTokens = remainderTokens.slice(1);
  }
  const foodQuery = (remainderTokens.join(' ') || cleaned).trim();
  if (!foodQuery) return null;

  return {
    rawText,
    foodQuery,
    grams: Math.round(clamp(grams, 1, 5000) * 10) / 10,
    quantityLabel,
    assumed,
  };
}

export function parseFoodDescription(text: string): ParsedFoodClause[] {
  return splitFoodClauses(text)
    .map(parseFoodClause)
    .filter((c): c is ParsedFoodClause => c !== null);
}
