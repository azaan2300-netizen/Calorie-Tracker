import { useState } from 'react';
import type { FoodEntry, MealType } from '../types';
import { estimateFoodDrafts, type FoodDraft } from '../lib/textFoodEstimate';

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

export default function TextFoodPanel({ dateISO, defaultMealType, onAdd }: Props) {
  const [text, setText] = useState('');
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [drafts, setDrafts] = useState<FoodDraft[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleEstimate(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await estimateFoodDrafts(text);
      if (result.length === 0) {
        setError("Couldn't find any food items in that description. Try separating items with commas.");
        setDrafts(null);
      } else {
        setDrafts(result);
      }
    } catch {
      setError('Something went wrong estimating that meal. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  function updateDraft(id: string, patch: Partial<FoodDraft>) {
    setDrafts((prev) => prev?.map((d) => (d.id === id ? { ...d, ...patch } : d)) ?? null);
  }

  function removeDraft(id: string) {
    setDrafts((prev) => prev?.filter((d) => d.id !== id) ?? null);
  }

  function handleAddAll() {
    if (!drafts) return;
    for (const draft of drafts) {
      onAdd({
        id: crypto.randomUUID(),
        dateISO,
        mealType,
        name: draft.name,
        servingDesc: draft.servingDesc,
        calories: draft.calories,
        proteinG: draft.proteinG,
        carbsG: draft.carbsG,
        fatG: draft.fatG,
        source: 'text',
      });
    }
    setDrafts(null);
    setText('');
  }

  return (
    <div className="card text-food-panel">
      <h3>Describe what you ate</h3>
      <p className="muted">
        Separate items with commas, e.g. "200g rice, 150g grilled chicken, 1 can of Coke". This
        estimates macros by matching each item against Open Food Facts — review and adjust before
        adding, since it's a best guess, not an exact measurement.
      </p>

      <form onSubmit={handleEstimate} className="text-food-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="I had two eggs, a slice of toast, and a cup of orange juice"
          rows={3}
        />
        <div className="row-buttons">
          <button type="submit" className="primary" disabled={loading || !text.trim()}>
            {loading ? 'Estimating…' : 'Estimate meal'}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}

      {drafts && drafts.length > 0 && (
        <div className="text-food-drafts">
          {drafts.map((draft) => (
            <div key={draft.id} className="draft-row">
              <div className="grid-2">
                <label>
                  Name
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => updateDraft(draft.id, { name: e.target.value })}
                  />
                </label>
                <label>
                  Serving
                  <input
                    type="text"
                    value={draft.servingDesc}
                    onChange={(e) => updateDraft(draft.id, { servingDesc: e.target.value })}
                  />
                </label>
                <label>
                  Calories
                  <input
                    type="number"
                    min={0}
                    value={draft.calories}
                    onChange={(e) => updateDraft(draft.id, { calories: Number(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  Protein (g)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={draft.proteinG}
                    onChange={(e) => updateDraft(draft.id, { proteinG: Number(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  Carbs (g)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={draft.carbsG}
                    onChange={(e) => updateDraft(draft.id, { carbsG: Number(e.target.value) || 0 })}
                  />
                </label>
                <label>
                  Fat (g)
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={draft.fatG}
                    onChange={(e) => updateDraft(draft.id, { fatG: Number(e.target.value) || 0 })}
                  />
                </label>
              </div>
              {!draft.matched && <p className="error">No database match — macros need manual entry.</p>}
              <button type="button" className="secondary link-button" onClick={() => removeDraft(draft.id)}>
                Remove this item
              </button>
            </div>
          ))}

          <div className="grid-2">
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

          <button type="button" className="primary" onClick={handleAddAll}>
            Add {drafts.length} {drafts.length === 1 ? 'item' : 'items'} to log
          </button>
        </div>
      )}
    </div>
  );
}
