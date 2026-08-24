import { useState } from 'react';
import type { FoodEntry, MealType } from '../types';
import { findFoodByName, scaleFoodEntry, searchFoodDatabase, type FoodDatabaseEntry } from '../lib/foodDatabase';

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

const EMPTY = { name: '', weightGrams: '100', calories: '', proteinG: '', carbsG: '', fatG: '' };

export default function AddFoodForm({ dateISO, defaultMealType, onAdd }: Props) {
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [fields, setFields] = useState(EMPTY);
  const [matchedFood, setMatchedFood] = useState<FoodDatabaseEntry | null>(null);

  function applyMatch(food: FoodDatabaseEntry, weightGrams: string) {
    const scaled = scaleFoodEntry(food, Number(weightGrams) || 0);
    setFields((prev) => ({
      ...prev,
      calories: String(scaled.calories),
      proteinG: String(scaled.proteinG),
      carbsG: String(scaled.carbsG),
      fatG: String(scaled.fatG),
    }));
  }

  function handleNameChange(name: string) {
    setFields((prev) => ({ ...prev, name }));
    const match = findFoodByName(name);
    setMatchedFood(match ?? null);
    if (match) applyMatch(match, fields.weightGrams);
  }

  function handleWeightChange(weightGrams: string) {
    setFields((prev) => ({ ...prev, weightGrams }));
    if (matchedFood) applyMatch(matchedFood, weightGrams);
  }

  function update(key: 'calories' | 'proteinG' | 'carbsG' | 'fatG', value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.name.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      dateISO,
      mealType,
      name: fields.name.trim(),
      servingDesc: `${fields.weightGrams || 0} g`,
      calories: Number(fields.calories) || 0,
      proteinG: Number(fields.proteinG) || 0,
      carbsG: Number(fields.carbsG) || 0,
      fatG: Number(fields.fatG) || 0,
      source: 'manual',
    });
    setFields(EMPTY);
    setMatchedFood(null);
  }

  const suggestions = searchFoodDatabase(fields.name);

  return (
    <form className="card add-food-form" onSubmit={handleSubmit}>
      <h3>Log a food manually</h3>
      <p className="muted">
        Pick a food from the list to auto-calculate macros by weight, or type your own and enter
        macros directly.
      </p>
      <div className="grid-2">
        <label>
          Food name
          <input
            type="text"
            list="food-database-options"
            value={fields.name}
            onChange={(e) => handleNameChange(e.target.value)}
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
            value={fields.weightGrams}
            onChange={(e) => handleWeightChange(e.target.value)}
          />
        </label>
        <label>
          Calories (kcal)
          <input
            type="number"
            min={0}
            value={fields.calories}
            onChange={(e) => update('calories', e.target.value)}
            required
          />
        </label>
        <label>
          Protein (g)
          <input
            type="number"
            min={0}
            step={0.1}
            value={fields.proteinG}
            onChange={(e) => update('proteinG', e.target.value)}
          />
        </label>
        <label>
          Carbs (g)
          <input
            type="number"
            min={0}
            step={0.1}
            value={fields.carbsG}
            onChange={(e) => update('carbsG', e.target.value)}
          />
        </label>
        <label>
          Fat (g)
          <input
            type="number"
            min={0}
            step={0.1}
            value={fields.fatG}
            onChange={(e) => update('fatG', e.target.value)}
          />
        </label>
      </div>
      {matchedFood && <p className="muted">Auto-calculated from our food database — adjust if needed.</p>}
      <button type="submit" className="primary">
        Add food
      </button>
    </form>
  );
}
