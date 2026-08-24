import { useState } from 'react';
import type { FoodEntry, MealType } from '../types';
import {
  isSingleServingContainer,
  lookupBarcode,
  scaleProductByServings,
  scaleProductToGrams,
  type BarcodeProduct,
} from '../lib/openFoodFacts';
import BarcodeScanner from './BarcodeScanner';

type Status = 'idle' | 'scanning' | 'loading' | 'found' | 'not-found' | 'error';
type LogMode = 'servings' | 'weight';

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

interface Props {
  dateISO: string;
  defaultMealType: MealType;
  onAdd: (entry: FoodEntry) => void;
}

function servingUnitLabel(product: BarcodeProduct): string {
  if (isSingleServingContainer(product)) return 'can/bottle';
  return product.servingSizeText || 'serving';
}

export default function BarcodeFoodPanel({ dateISO, defaultMealType, onAdd }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [product, setProduct] = useState<BarcodeProduct | null>(null);
  const [logMode, setLogMode] = useState<LogMode>('servings');
  const [servings, setServings] = useState(1);
  const [grams, setGrams] = useState(100);
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [errorMessage, setErrorMessage] = useState('');
  const [scanAttempt, setScanAttempt] = useState(0);

  async function handleDetected(barcode: string) {
    setStatus('loading');
    try {
      const result = await lookupBarcode(barcode);
      if (!result) {
        setStatus('not-found');
        return;
      }
      setProduct(result);
      setServings(1);
      setGrams(result.servingGrams ?? 100);
      setLogMode(result.servingGrams ? 'servings' : 'weight');
      setStatus('found');
    } catch {
      setErrorMessage('Lookup failed. Check your connection and try again.');
      setStatus('error');
    }
  }

  function reset() {
    setProduct(null);
    setStatus('idle');
  }

  function handleAdd() {
    if (!product) return;
    const scaled = logMode === 'servings' ? scaleProductByServings(product, servings) : scaleProductToGrams(product, grams);
    const servingDesc =
      logMode === 'servings'
        ? `${servings} × ${servingUnitLabel(product)}`
        : `${grams} g`;

    onAdd({
      id: crypto.randomUUID(),
      dateISO,
      mealType,
      name: product.brand ? `${product.name} (${product.brand})` : product.name,
      servingDesc,
      calories: scaled.calories,
      proteinG: scaled.proteinG,
      carbsG: scaled.carbsG,
      fatG: scaled.fatG,
      source: 'barcode',
      barcode: product.barcode,
    });
    reset();
  }

  const canLogByServings = Boolean(product?.servingGrams || product?.perServing);
  const preview = product
    ? logMode === 'servings'
      ? scaleProductByServings(product, servings)
      : scaleProductToGrams(product, grams)
    : null;

  return (
    <div className="card barcode-food-panel">
      <h3>Scan a barcode</h3>
      <p className="muted">
        Looks up nutrition facts from the Open Food Facts database (3M+ products) by barcode. How
        specific the name/brand is depends on how complete that product's entry is in their
        crowd-sourced data — some barcodes are only logged generically.
      </p>

      {status === 'idle' && (
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setScanAttempt((n) => n + 1);
            setStatus('scanning');
          }}
        >
          Scan a barcode
        </button>
      )}

      <BarcodeScanner
        key={scanAttempt}
        active={status === 'scanning'}
        onDetected={handleDetected}
        onCancel={() => setStatus('idle')}
      />

      {status === 'loading' && <p className="muted">Looking up product…</p>}

      {status === 'not-found' && (
        <div>
          <p className="error">No product found for that barcode in Open Food Facts.</p>
          <button type="button" className="secondary" onClick={reset}>
            Try again
          </button>
        </div>
      )}

      {status === 'error' && (
        <div>
          <p className="error">{errorMessage}</p>
          <button type="button" className="secondary" onClick={reset}>
            Try again
          </button>
        </div>
      )}

      {status === 'found' && product && preview && (
        <div className="scanned-product">
          <h4>{product.name}</h4>
          {product.brand && <p className="muted">{product.brand}</p>}
          {product.quantityText && <p className="muted">Package: {product.quantityText}</p>}
          {isSingleServingContainer(product) && (
            <p className="muted">Looks like a single-serving container (one can/bottle).</p>
          )}

          <div className="grid-2">
            {canLogByServings ? (
              <label>
                {logMode === 'servings' ? `Servings (${servingUnitLabel(product)})` : 'Amount (g)'}
                <input
                  type="number"
                  min={logMode === 'servings' ? 0.25 : 1}
                  step={logMode === 'servings' ? 0.25 : 1}
                  value={logMode === 'servings' ? servings : grams}
                  onChange={(e) =>
                    logMode === 'servings'
                      ? setServings(Number(e.target.value) || 0)
                      : setGrams(Number(e.target.value) || 0)
                  }
                />
              </label>
            ) : (
              <label>
                Amount (g)
                <input type="number" min={1} value={grams} onChange={(e) => setGrams(Number(e.target.value) || 0)} />
              </label>
            )}
            <label>
              Meal
              <select value={mealType} onChange={(e) => setMealType(e.target.value as MealType)}>
                {Object.entries(MEAL_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {canLogByServings && (
            <button
              type="button"
              className="secondary link-button"
              onClick={() => setLogMode((m) => (m === 'servings' ? 'weight' : 'servings'))}
            >
              {logMode === 'servings' ? 'Log by weight (g) instead' : 'Log by servings instead'}
            </button>
          )}

          <p className="muted">
            {preview.calories} kcal · {preview.proteinG}g protein · {preview.carbsG}g carbs · {preview.fatG}g fat
          </p>

          <div className="row-buttons">
            <button type="button" className="primary" onClick={handleAdd}>
              Add to log
            </button>
            <button type="button" className="secondary" onClick={reset}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
