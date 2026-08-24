import { useState } from 'react';
import type { FoodEntry, MealType } from '../types';
import { lookupBarcode, scaleProductToGrams, type BarcodeProduct } from '../lib/openFoodFacts';
import BarcodeScanner from './BarcodeScanner';

type Status = 'idle' | 'scanning' | 'loading' | 'found' | 'not-found' | 'error';

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

export default function BarcodeFoodPanel({ dateISO, defaultMealType, onAdd }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [product, setProduct] = useState<BarcodeProduct | null>(null);
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
      setGrams(100);
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
    const scaled = scaleProductToGrams(product, grams);
    onAdd({
      id: crypto.randomUUID(),
      dateISO,
      mealType,
      name: product.brand ? `${product.name} (${product.brand})` : product.name,
      servingDesc: `${grams} g`,
      calories: scaled.calories,
      proteinG: scaled.proteinG,
      carbsG: scaled.carbsG,
      fatG: scaled.fatG,
      source: 'barcode',
      barcode: product.barcode,
    });
    reset();
  }

  return (
    <div className="card barcode-food-panel">
      <h3>Scan a barcode</h3>
      <p className="muted">
        Looks up nutrition facts from the Open Food Facts database (3M+ products) by barcode.
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

      {status === 'found' && product && (
        <div className="scanned-product">
          <h4>{product.name}</h4>
          {product.brand && <p className="muted">{product.brand}</p>}
          <p className="muted">Per 100g: {Math.round(product.caloriesPer100g)} kcal</p>

          <div className="grid-2">
            <label>
              Amount (g)
              <input
                type="number"
                min={1}
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value) || 0)}
              />
            </label>
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

          <p className="muted">
            {scaleProductToGrams(product, grams).calories} kcal ·{' '}
            {scaleProductToGrams(product, grams).proteinG}g protein ·{' '}
            {scaleProductToGrams(product, grams).carbsG}g carbs ·{' '}
            {scaleProductToGrams(product, grams).fatG}g fat
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
