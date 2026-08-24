import { useRef, useState } from 'react';
import type { ActivityLevel, BodyType, Goal, Profile, Sex } from '../types';
import { ACTIVITY_LABELS, BODY_TYPE_LABELS, GOAL_LABELS } from '../lib/nutrition';
import { downscaleImageToDataUrl } from '../lib/image';

const DEFAULT_PROFILE: Profile = {
  name: '',
  sex: 'male',
  age: 30,
  heightCm: 175,
  weightKg: 75,
  activityLevel: 'moderate',
  goal: 'maintain',
  bodyType: 'mesomorph',
};

interface Props {
  profile: Profile | null;
  onSave: (profile: Profile) => void;
}

export default function ProfileForm({ profile, onSave }: Props) {
  const [form, setForm] = useState<Profile>(profile ?? DEFAULT_PROFILE);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePhotoChange(file: File | undefined) {
    if (!file) return;
    setPhotoError('');
    try {
      const dataUrl = await downscaleImageToDataUrl(file);
      update('photoDataUrl', dataUrl);
    } catch {
      setPhotoError('Could not load that photo. Try a different image.');
    }
  }

  function removePhoto() {
    update('photoDataUrl', undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form className="card profile-form" onSubmit={handleSubmit}>
      <h2>Your profile</h2>
      <p className="muted">
        We use this to calculate a calorie and macro baseline with the Mifflin-St Jeor equation
        and ISSN sports-nutrition protein guidelines.
      </p>

      <div className="photo-picker">
        <div className="avatar avatar-lg">
          {form.photoDataUrl ? (
            <img src={form.photoDataUrl} alt="Profile" />
          ) : (
            <span>{form.name.trim().charAt(0).toUpperCase() || '?'}</span>
          )}
        </div>
        <div className="photo-picker-actions">
          <label className="secondary file-button">
            {form.photoDataUrl ? 'Change photo' : 'Add photo'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoChange(e.target.files?.[0])}
            />
          </label>
          {form.photoDataUrl && (
            <button type="button" className="secondary" onClick={removePhoto}>
              Remove
            </button>
          )}
        </div>
        {photoError && <p className="error">{photoError}</p>}
      </div>

      <label>
        Name
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Optional"
        />
      </label>

      <div className="grid-2">
        <label>
          Sex
          <select value={form.sex} onChange={(e) => update('sex', e.target.value as Sex)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>

        <label>
          Age
          <input
            type="number"
            min={13}
            max={100}
            value={form.age}
            onChange={(e) => update('age', Number(e.target.value))}
            required
          />
        </label>

        <label>
          Height (cm)
          <input
            type="number"
            min={100}
            max={250}
            value={form.heightCm}
            onChange={(e) => update('heightCm', Number(e.target.value))}
            required
          />
        </label>

        <label>
          Weight (kg)
          <input
            type="number"
            min={30}
            max={300}
            step={0.1}
            value={form.weightKg}
            onChange={(e) => update('weightKg', Number(e.target.value))}
            required
          />
        </label>
      </div>

      <label>
        Activity level
        <select
          value={form.activityLevel}
          onChange={(e) => update('activityLevel', e.target.value as ActivityLevel)}
        >
          {Object.entries(ACTIVITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Goal
        <select value={form.goal} onChange={(e) => update('goal', e.target.value as Goal)}>
          {Object.entries(GOAL_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Body type
        <select value={form.bodyType} onChange={(e) => update('bodyType', e.target.value as BodyType)}>
          {Object.entries(BODY_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="primary">
        Save profile & calculate targets
      </button>
    </form>
  );
}
