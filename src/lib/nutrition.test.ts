import { describe, expect, it } from 'vitest';
import { calculateMacroTargets } from './nutrition';
import type { ActivityLevel, BodyType, Goal, Profile, Sex } from '../types';
import { mulberry32, pick, randomFloat, randomInt } from './testRandom';

const SEXES: Sex[] = ['male', 'female'];
const ACTIVITY_LEVELS: ActivityLevel[] = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const GOALS: Goal[] = ['lose', 'maintain', 'gain'];
const BODY_TYPES: BodyType[] = ['ectomorph', 'mesomorph', 'endomorph'];

function randomProfile(rand: () => number): Profile {
  return {
    name: '',
    sex: pick(rand, SEXES),
    age: randomInt(rand, 13, 100),
    heightCm: randomInt(rand, 120, 230),
    weightKg: randomFloat(rand, 35, 250),
    activityLevel: pick(rand, ACTIVITY_LEVELS),
    goal: pick(rand, GOALS),
    bodyType: pick(rand, BODY_TYPES),
  };
}

describe('calculateMacroTargets fuzz test (1000 random profiles)', () => {
  const rand = mulberry32(20260824);

  it('never throws and always returns finite, sane, non-negative macros', () => {
    for (let i = 0; i < 1000; i++) {
      const profile = randomProfile(rand);
      let result;
      expect(() => {
        result = calculateMacroTargets(profile);
      }, `profile #${i}: ${JSON.stringify(profile)}`).not.toThrow();

      const targets = result!;
      for (const [key, value] of Object.entries(targets)) {
        expect(Number.isFinite(value), `${key} not finite for profile #${i}: ${JSON.stringify(profile)}`).toBe(true);
        expect(value, `${key} negative for profile #${i}: ${JSON.stringify(profile)}`).toBeGreaterThanOrEqual(0);
      }

      // Sane bounds: nobody's target should be a fraction of a calorie or absurdly high.
      expect(targets.calories, `profile #${i}`).toBeGreaterThanOrEqual(1000);
      expect(targets.calories, `profile #${i}`).toBeLessThan(10000);

      // Reconstructing calories from macros should roughly match the calorie target
      // (protein/carbs = 4 kcal/g, fat = 9 kcal/g), within rounding tolerance.
      const reconstructed = targets.proteinG * 4 + targets.carbsG * 4 + targets.fatG * 9;
      expect(
        Math.abs(reconstructed - targets.calories),
        `macro/calorie mismatch for profile #${i}: ${JSON.stringify(profile)} -> ${JSON.stringify(targets)}`,
      ).toBeLessThan(targets.calories * 0.05 + 10);
    }
  });
});
