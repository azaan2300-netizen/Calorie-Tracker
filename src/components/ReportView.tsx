import { useMemo } from 'react';
import type { FoodEntry, WhoopDailyMetrics } from '../types';
import { loadWhoopMetrics, todayISO } from '../lib/storage';

const REPORT_DAYS = 14;

interface Props {
  entries: FoodEntry[];
}

interface DayRow {
  dateISO: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesBurned: number | null;
  strain: number | null;
  recoveryScore: number | null;
}

function lastNDates(n: number): string[] {
  const dates: string[] = [];
  const cursor = new Date(`${todayISO()}T00:00:00`);
  for (let i = 0; i < n; i++) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() - 1);
  }
  return dates;
}

function buildDayRows(entries: FoodEntry[], whoopMetrics: WhoopDailyMetrics[], days: number): DayRow[] {
  const dates = lastNDates(days);
  const whoopByDate = new Map(whoopMetrics.map((m) => [m.dateISO, m]));

  return dates.map((dateISO) => {
    const dayEntries = entries.filter((e) => e.dateISO === dateISO);
    const totals = dayEntries.reduce(
      (acc, e) => ({
        calories: acc.calories + e.calories,
        proteinG: acc.proteinG + e.proteinG,
        carbsG: acc.carbsG + e.carbsG,
        fatG: acc.fatG + e.fatG,
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
    );
    const whoop = whoopByDate.get(dateISO);
    return {
      dateISO,
      ...totals,
      caloriesBurned: whoop?.caloriesBurned ?? null,
      strain: whoop?.strain ?? null,
      recoveryScore: whoop?.recoveryScore ?? null,
    };
  });
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
}

export default function ReportView({ entries }: Props) {
  const whoopMetrics = useMemo(() => loadWhoopMetrics(), []);
  const rows = useMemo(() => buildDayRows(entries, whoopMetrics, REPORT_DAYS), [entries, whoopMetrics]);

  const activeRows = rows.filter((r) => r.calories > 0 || r.caloriesBurned !== null);
  const avgConsumed = average(activeRows.map((r) => r.calories));
  const avgBurned = average(activeRows.filter((r) => r.caloriesBurned !== null).map((r) => r.caloriesBurned!));
  const avgNet =
    avgConsumed !== null && avgBurned !== null ? avgConsumed - avgBurned : null;
  const avgProtein = average(activeRows.map((r) => r.proteinG));

  return (
    <div className="dashboard">
      <div className="card">
        <h2>{REPORT_DAYS}-day report</h2>
        <p className="muted">
          Food logged cross-referenced with WHOOP calories burned and strain, so you can see net
          calories and how activity relates to what you ate — not just calories in isolation.
        </p>

        {activeRows.length === 0 ? (
          <p className="muted">Nothing logged yet — log some food and sync WHOOP to see your report.</p>
        ) : (
          <>
            <div className="whoop-stat-row report-summary">
              <div className="whoop-stat">
                <span className="whoop-stat-value">{avgConsumed ?? '—'}</span>
                <span className="muted">avg kcal consumed</span>
              </div>
              <div className="whoop-stat">
                <span className="whoop-stat-value">{avgBurned ?? '—'}</span>
                <span className="muted">avg kcal burned</span>
              </div>
              <div className="whoop-stat">
                <span className="whoop-stat-value">{avgNet ?? '—'}</span>
                <span className="muted">avg net</span>
              </div>
              <div className="whoop-stat">
                <span className="whoop-stat-value">{avgProtein ?? '—'}g</span>
                <span className="muted">avg protein</span>
              </div>
            </div>

            <div className="report-table-scroll">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Consumed</th>
                    <th>Burned</th>
                    <th>Net</th>
                    <th>Protein</th>
                    <th>Carbs</th>
                    <th>Fat</th>
                    <th>Strain</th>
                    <th>Recovery</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.dateISO}>
                      <td>{row.dateISO === todayISO() ? 'Today' : row.dateISO}</td>
                      <td>{row.calories || '—'}</td>
                      <td>{row.caloriesBurned ?? '—'}</td>
                      <td>{row.caloriesBurned !== null ? row.calories - row.caloriesBurned : '—'}</td>
                      <td>{row.proteinG || '—'}</td>
                      <td>{row.carbsG || '—'}</td>
                      <td>{row.fatG || '—'}</td>
                      <td>{row.strain ?? '—'}</td>
                      <td>{row.recoveryScore !== null ? `${row.recoveryScore}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
