import type { FoodEntry, MealType } from '../types';

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const SOURCE_LABELS: Record<FoodEntry['source'], string> = {
  manual: 'manual',
  barcode: 'barcode',
  text: 'text',
};

interface Props {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

export default function MealLog({ entries, onDelete }: Props) {
  if (entries.length === 0) {
    return <p className="muted">Nothing logged yet — add a food above to get started.</p>;
  }

  return (
    <div className="meal-log">
      {MEAL_ORDER.map((mealType) => {
        const mealEntries = entries.filter((e) => e.mealType === mealType);
        if (mealEntries.length === 0) return null;
        const mealCalories = mealEntries.reduce((sum, e) => sum + e.calories, 0);

        return (
          <div key={mealType} className="meal-group">
            <div className="meal-group-header">
              <h4>{MEAL_LABELS[mealType]}</h4>
              <span className="muted">{Math.round(mealCalories)} kcal</span>
            </div>
            <ul>
              {mealEntries.map((entry) => (
                <li key={entry.id} className="food-entry">
                  <div>
                    <span className="food-name">{entry.name}</span>
                    <span className="muted"> · {entry.servingDesc}</span>
                    <span className={`source-tag source-${entry.source}`}>
                      {SOURCE_LABELS[entry.source]}
                    </span>
                  </div>
                  <div className="food-entry-macros">
                    <span>{Math.round(entry.calories)} kcal</span>
                    <span>{entry.proteinG}g P</span>
                    <span>{entry.carbsG}g C</span>
                    <span>{entry.fatG}g F</span>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Remove ${entry.name}`}
                      onClick={() => onDelete(entry.id)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
