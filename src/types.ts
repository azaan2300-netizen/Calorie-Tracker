export type Sex = 'male' | 'female';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active';

export type Goal = 'lose' | 'maintain' | 'gain';

export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph';

export interface Profile {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  bodyType: BodyType;
  /** Downscaled JPEG data URL, kept small enough to live comfortably in localStorage. */
  photoDataUrl?: string;
}

export interface MacroTargets {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodSource = 'manual' | 'barcode' | 'text';

export interface FoodEntry {
  id: string;
  dateISO: string;
  mealType: MealType;
  name: string;
  servingDesc: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  source: FoodSource;
  barcode?: string;
}

/** One day's WHOOP metrics, synced from a physiological cycle (+ its recovery, if scored). */
export interface WhoopDailyMetrics {
  dateISO: string;
  caloriesBurned: number;
  strain: number;
  avgHeartRate: number | null;
  maxHeartRate: number | null;
  /** 0-100, null when the cycle hasn't been scored yet (e.g. still in progress). */
  recoveryScore: number | null;
}

export interface WhoopTokens {
  accessToken: string;
  refreshToken: string;
  /** Epoch ms when the access token expires. */
  expiresAt: number;
}
