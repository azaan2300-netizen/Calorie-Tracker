import { useState } from 'react';
import type { FoodEntry, MealType } from '../types';

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

const EMPTY = { name: '', servingDesc: '', calories: '', proteinG: '', carbsG: '', fatG: '' };

export default function AddFoodForm({ dateISO, defaultMealType, onAdd }: Props) {
  const [mealType, setMealType] = useState<MealType>(defaultMealType);
  const [fields, setFields] = useState(EMPTY);

  function update(key: keyof typeof EMPTY, value: string) {
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
      servingDesc: fields.servingDesc.trim() || '1 serving',
      calories: Number(fields.calories) || 0,
      proteinG: Number(fields.proteinG) || 0,
      carbsG: Number(fields.carbsG) || 0,
      fatG: Number(fields.fatG) || 0,
      source: 'manual',
    });
    setFields(EMPTY);
  }

  return (
    <form className="card add-food-form" onSubmit={handleSubmit}>
      <h3>Log a food manually</h3>
      <div className="grid-2">
        <label>
          Food name
          <input
            type="text"
            value={fields.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Grilled chicken breast"
            required
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
        <label>
          Serving
          <input
            type="text"
            value={fields.servingDesc}
            onChange={(e) => update('servingDesc', e.target.value)}
            placeholder="150 g"
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
      <button type="submit" className="primary">
        Add food
      </button>
    </form>
  );
}
