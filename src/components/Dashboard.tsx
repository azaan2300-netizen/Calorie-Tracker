import { lazy, Suspense, useMemo, useState } from 'react';
import type { FoodEntry, MealType, Profile } from '../types';
import { calculateMacroTargets } from '../lib/nutrition';
import MacroProgress from './MacroProgress';
import MealLog from './MealLog';
import AddFoodForm from './AddFoodForm';
import { todayISO } from '../lib/storage';

// html5-qrcode pulls in a sizeable barcode-decoding library; only load it once the
// user actually opens the scan-barcode tab.
const BarcodeFoodPanel = lazy(() => import('./BarcodeFoodPanel'));

interface Props {
  profile: Profile;
  entries: FoodEntry[];
  onAddEntry: (entry: FoodEntry) => void;
  onDeleteEntry: (id: string) => void;
}

function shiftDateISO(dateISO: string, days: number): string {
  const date = new Date(`${dateISO}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function currentMealSuggestion(): MealType {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 16) return 'lunch';
  if (hour < 21) return 'dinner';
  return 'snack';
}

export default function Dashboard({ profile, entries, onAddEntry, onDeleteEntry }: Props) {
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [loggerTab, setLoggerTab] = useState<'manual' | 'barcode'>('manual');

  const targets = useMemo(() => calculateMacroTargets(profile), [profile]);
  const dayEntries = useMemo(
    () => entries.filter((e) => e.dateISO === selectedDate),
    [entries, selectedDate],
  );

  const consumed = useMemo(
    () =>
      dayEntries.reduce(
        (acc, e) => ({
          calories: acc.calories + e.calories,
          proteinG: acc.proteinG + e.proteinG,
          carbsG: acc.carbsG + e.carbsG,
          fatG: acc.fatG + e.fatG,
        }),
        { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
      ),
    [dayEntries],
  );

  const mealSuggestion = currentMealSuggestion();

  return (
    <div className="dashboard">
      <div className="card date-nav">
        <button type="button" className="secondary" onClick={() => setSelectedDate((d) => shiftDateISO(d, -1))}>
          ← Prev
        </button>
        <div className="date-nav-current">
          <strong>{selectedDate === todayISO() ? 'Today' : selectedDate}</strong>
          <span className="muted">{selectedDate}</span>
        </div>
        <button
          type="button"
          className="secondary"
          disabled={selectedDate === todayISO()}
          onClick={() => setSelectedDate((d) => shiftDateISO(d, 1))}
        >
          Next →
        </button>
      </div>

      <div className="card">
        <h2>Daily targets</h2>
        <MacroProgress consumed={consumed} target={targets} />
      </div>

      <div className="card">
        <h2>Log food</h2>
        <div className="tabs">
          <button
            type="button"
            className={loggerTab === 'manual' ? 'tab active' : 'tab'}
            onClick={() => setLoggerTab('manual')}
          >
            Manual entry
          </button>
          <button
            type="button"
            className={loggerTab === 'barcode' ? 'tab active' : 'tab'}
            onClick={() => setLoggerTab('barcode')}
          >
            Scan barcode
          </button>
        </div>

        {loggerTab === 'manual' ? (
          <AddFoodForm dateISO={selectedDate} defaultMealType={mealSuggestion} onAdd={onAddEntry} />
        ) : (
          <Suspense fallback={<p className="muted">Loading scanner…</p>}>
            <BarcodeFoodPanel dateISO={selectedDate} defaultMealType={mealSuggestion} onAdd={onAddEntry} />
          </Suspense>
        )}
      </div>

      <div className="card">
        <h2>Today's log</h2>
        <MealLog entries={dayEntries} onDelete={onDeleteEntry} />
      </div>
    </div>
  );
}
