import { useState } from 'react';
import type { FoodEntry, MealType } from '../types';
import { findBestFoodDatabaseMatch, scaleFoodEntry, searchFoodDatabase } from '../lib/foodDatabase';

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

const EMPTY_MANUAL = { calories: '', proteinG: '', carbsG: '', fatG: '' };

export default function AddFoodForm({ dateISO, defaultMealType, onAdd }: Props) {
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [name, setName] = useState('');
  const [weightGrams, setWeightGrams] = useState('100');
  const [manualOverride, setManualOverride] = useState(false);
  const [manualFields, setManualFields] = useState(EMPTY_MANUAL);

  // Live fuzzy match against the food database as the user types -- no need to pick an exact
  // datalist entry. Macros are always a computed result of (matched food x weight), never a
  // field the user has to type themselves, unless nothing in the database matches at all.
  const matchedFood = findBestFoodDatabaseMatch(name);
  const computed = matchedFood ? scaleFoodEntry(matchedFood, Number(weightGrams) || 0) : null;
  const suggestions = searchFoodDatabase(name);

  function updateManual(key: keyof typeof EMPTY_MANUAL, value: string) {
    setManualFields((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    setName('');
    setWeightGrams('100');
    setManualOverride(false);
    setManualFields(EMPTY_MANUAL);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const macros = computed ?? {
      calories: Number(manualFields.calories) || 0,
      proteinG: Number(manualFields.proteinG) || 0,
      carbsG: Number(manualFields.carbsG) || 0,
      fatG: Number(manualFields.fatG) || 0,
    };
    if (!computed && !manualOverride) return; // nothing to log yet

    onAdd({
      id: crypto.randomUUID(),
      dateISO,
      mealType,
      name: matchedFood ? matchedFood.name : name.trim(),
      servingDesc: `${weightGrams || 0} g`,
      calories: macros.calories,
      proteinG: macros.proteinG,
      carbsG: macros.carbsG,
      fatG: macros.fatG,
      source: 'manual',
    });
    reset();
  }

  const canSubmit = Boolean(computed) || manualOverride;

  return (
    <form className="card add-food-form" onSubmit={handleSubmit}>
      <h3>Log a food</h3>
      <p className="muted">
        Type a food name and weight — macros are calculated automatically from our database of
        380+ foods and drinks.
      </p>
      <div className="grid-2">
        <label>
          Food name
          <input
            type="text"
            list="food-database-options"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chicken breast, cooked"
            required
          />
          <datalist id="food-database-options">
            {suggestions.map((food) => (
              <option key={food.name} value={food.name} />
            ))}
          </datalist>
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
        <label>
          Weight (g)
          <input
            type="number"
            min={0}
            value={weightGrams}
            onChange={(e) => setWeightGrams(e.target.value)}
          />
        </label>
      </div>

      {computed && matchedFood && (
        <div className="computed-macros-box">
          <p>Matched: {matchedFood.name}</p>
          <p className="muted">
            {computed.calories} kcal · {computed.proteinG}g protein · {computed.carbsG}g carbs ·{' '}
            {computed.fatG}g fat
          </p>
        </div>
      )}

      {!computed && name.trim() && (
        <div className="no-match-box">
          <p className="error">No database match for "{name.trim()}" yet.</p>
          {!manualOverride ? (
            <button type="button" className="secondary link-button" onClick={() => setManualOverride(true)}>
              Enter nutrition manually instead
            </button>
          ) : (
            <div className="grid-2">
              <label>
                Calories (kcal)
                <input
                  type="number"
                  min={0}
                  value={manualFields.calories}
                  onChange={(e) => updateManual('calories', e.target.value)}
                  required
                />
              </label>
              <label>
                Protein (g)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={manualFields.proteinG}
                  onChange={(e) => updateManual('proteinG', e.target.value)}
                />
              </label>
              <label>
                Carbs (g)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={manualFields.carbsG}
                  onChange={(e) => updateManual('carbsG', e.target.value)}
                />
              </label>
              <label>
                Fat (g)
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  value={manualFields.fatG}
                  onChange={(e) => updateManual('fatG', e.target.value)}
                />
              </label>
            </div>
          )}
        </div>
      )}

      <button type="submit" className="primary" disabled={!canSubmit}>
        Add food
      </button>
    </form>
  );
}
