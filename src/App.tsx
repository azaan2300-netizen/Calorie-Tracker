import { useEffect, useState } from 'react';
import type { FoodEntry, Profile } from './types';
import { loadProfile, saveProfile, loadEntries, saveEntries } from './lib/storage';
import { calculateBMR, calculateMacroTargets, calculateTDEE } from './lib/nutrition';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';
import './App.css';

type View = 'dashboard' | 'report' | 'profile';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [entries, setEntries] = useState<FoodEntry[]>(() => loadEntries());
  const [view, setView] = useState<View>(() => (loadProfile() ? 'dashboard' : 'profile'));

  useEffect(() => {
    if (profile) saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  function handleSaveProfile(next: Profile) {
    setProfile(next);
    setView('dashboard');
  }

  function handleAddEntry(entry: FoodEntry) {
    setEntries((prev) => [...prev, entry]);
  }

  function handleDeleteEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title-row">
          <h1>Calorie &amp; Macro Tracker</h1>
          {profile && (
            <button
              type="button"
              className="header-avatar-button"
              onClick={() => setView('profile')}
              aria-label="Edit profile"
            >
              <div className="avatar avatar-sm">
                {profile.photoDataUrl ? (
                  <img src={profile.photoDataUrl} alt="" />
                ) : (
                  <span>{profile.name.trim().charAt(0).toUpperCase() || '?'}</span>
                )}
              </div>
            </button>
          )}
        </div>

        {profile && (
          <>
            <p className="greeting">
              {greeting()}
              {profile.name ? `, ${profile.name}` : ''}
            </p>
            <nav className="app-nav">
              <button
                type="button"
                className={view === 'dashboard' ? 'tab active' : 'tab'}
                onClick={() => setView('dashboard')}
              >
                Dashboard
              </button>
              <button
                type="button"
                className={view === 'report' ? 'tab active' : 'tab'}
                onClick={() => setView('report')}
              >
                Report
              </button>
              <button
                type="button"
                className={view === 'profile' ? 'tab active' : 'tab'}
                onClick={() => setView('profile')}
              >
                Profile
              </button>
            </nav>
          </>
        )}
      </header>

      <main>
        {view === 'profile' || !profile ? (
          <>
            <ProfileForm profile={profile} onSave={handleSaveProfile} />
            {profile && <TargetsSummary profile={profile} />}
          </>
        ) : view === 'report' ? (
          <ReportView entries={entries} />
        ) : (
          <Dashboard
            profile={profile}
            entries={entries}
            onAddEntry={handleAddEntry}
            onDeleteEntry={handleDeleteEntry}
          />
        )}
      </main>
    </div>
  );
}

function TargetsSummary({ profile }: { profile: Profile }) {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(profile);
  const targets = calculateMacroTargets(profile);

  return (
    <div className="card targets-summary">
      <h2>Your calculated baseline</h2>
      <p className="muted">
        BMR {Math.round(bmr)} kcal · TDEE {Math.round(tdee)} kcal at your activity level
      </p>
      <ul className="targets-list">
        <li>{targets.calories} kcal / day</li>
        <li>{targets.proteinG} g protein</li>
        <li>{targets.carbsG} g carbs</li>
        <li>{targets.fatG} g fat</li>
      </ul>
    </div>
  );
}

export default App;
