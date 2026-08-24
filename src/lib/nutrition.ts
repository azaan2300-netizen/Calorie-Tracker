import type { ActivityLevel, BodyType, Goal, MacroTargets, Profile } from '../types';

/**
 * Research baseline for calorie & macro targets.
 *
 * Sources:
 * - BMR: Mifflin-St Jeor equation (Mifflin et al. 1990). Reviews consistently find it the
 *   most accurate simple weight-based BMR predictor for the general population (within ~10%
 *   of measured RMR for most healthy adults), which is why it's used as the default here
 *   instead of Harris-Benedict (older, less accurate) or Katch-McArdle (needs a body-fat
 *   reading we don't collect).
 * - Activity multipliers: standard TDEE multiplier scale used across mainstream calculators
 *   (sedentary 1.2 -> very active 1.9).
 * - Protein: International Society of Sports Nutrition position stands (Jager et al. 2017,
 *   "protein and exercise"; Aragon et al. 2017, "diets and body composition"). General
 *   maintenance/building range is 1.4-2.0 g/kg/day; during a caloric deficit, higher intakes
 *   (up to ~2.2-2.4 g/kg/day of total bodyweight, with literature ranges as high as 2.3-3.1
 *   g/kg/day of lean mass in trained individuals) help preserve lean mass.
 * - Fat: general sports-nutrition guidance keeps fat between 20-35% of total calories for
 *   hormonal/vitamin-absorption health, with a floor around 0.5-0.6 g/kg bodyweight.
 * - Carbohydrates: the remainder of the calorie budget after protein and fat are set, which
 *   is standard practice once protein and fat needs are fixed.
 * - Body type (ecto/meso/endomorph) is a popular, not strictly scientific, heuristic. It's
 *   applied here only as a mild carb/fat ratio tilt on top of the evidence-based protein and
 *   calorie targets above, never in place of them.
 */

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2, // little or no exercise, desk job
  light: 1.375, // light exercise/sports 1-3 days/week
  moderate: 1.55, // moderate exercise/sports 3-5 days/week
  active: 1.725, // hard exercise/sports 6-7 days/week
  very_active: 1.9, // very hard training, physical job, or 2x/day training
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Lightly active (1-3 days/week)',
  moderate: 'Moderately active (3-5 days/week)',
  active: 'Very active (6-7 days/week)',
  very_active: 'Extremely active (2x/day or physical job)',
};

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose fat',
  maintain: 'Maintain weight',
  gain: 'Build muscle / gain weight',
};

const BODY_TYPE_LABELS: Record<BodyType, string> = {
  ectomorph: 'Ectomorph (lean, fast metabolism)',
  mesomorph: 'Mesomorph (athletic build)',
  endomorph: 'Endomorph (gains fat/muscle easily)',
};

// Grams of protein per kg of total bodyweight, by goal (ISSN position-stand ranges).
const PROTEIN_G_PER_KG: Record<Goal, number> = {
  lose: 2.2, // upper-general range, protects lean mass in a deficit
  maintain: 1.6, // low end of the general building/maintenance range
  gain: 1.8, // mid-range, supports muscle protein synthesis in a surplus
};

// Fat as a share of total calories, tilted slightly by body type within the 20-35% band.
const FAT_PERCENT_BY_BODY_TYPE: Record<BodyType, number> = {
  ectomorph: 0.2,
  mesomorph: 0.27,
  endomorph: 0.33,
};

const CALORIES_PER_G_PROTEIN = 4;
const CALORIES_PER_G_CARB = 4;
const CALORIES_PER_G_FAT = 9;

export function calculateBMR(profile: Pick<Profile, 'sex' | 'weightKg' | 'heightCm' | 'age'>): number {
  const { sex, weightKg, heightCm, age } = profile;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(profile: Pick<Profile, 'sex' | 'weightKg' | 'heightCm' | 'age' | 'activityLevel'>): number {
  return calculateBMR(profile) * ACTIVITY_MULTIPLIERS[profile.activityLevel];
}

// Moderate, sustainable pace: ~20% deficit for fat loss, ~12% surplus for a lean gain.
function applyGoalAdjustment(tdee: number, goal: Goal): number {
  if (goal === 'lose') return tdee * 0.8;
  if (goal === 'gain') return tdee * 1.12;
  return tdee;
}

export function calculateMacroTargets(profile: Profile): MacroTargets {
  const tdee = calculateTDEE(profile);
  let calories = applyGoalAdjustment(tdee, profile.goal);

  // Safety floor so the deficit never gets extreme for very light/small users.
  const minCalories = profile.sex === 'male' ? 1500 : 1200;
  calories = Math.max(calories, minCalories);

  const proteinG = PROTEIN_G_PER_KG[profile.goal] * profile.weightKg;
  const proteinCalories = proteinG * CALORIES_PER_G_PROTEIN;

  const fatPercent = FAT_PERCENT_BY_BODY_TYPE[profile.bodyType];
  let fatCalories = calories * fatPercent;
  const minFatCalories = 0.5 * profile.weightKg * CALORIES_PER_G_FAT; // hormonal-health floor
  fatCalories = Math.max(fatCalories, minFatCalories);
  const fatG = fatCalories / CALORIES_PER_G_FAT;

  const remainingCalories = Math.max(calories - proteinCalories - fatCalories, 0);
  const carbsG = remainingCalories / CALORIES_PER_G_CARB;

  return {
    calories: Math.round(calories),
    proteinG: Math.round(proteinG),
    carbsG: Math.round(carbsG),
    fatG: Math.round(fatG),
  };
}

export { ACTIVITY_MULTIPLIERS, ACTIVITY_LABELS, GOAL_LABELS, BODY_TYPE_LABELS };
