# Calorie & Macro Tracker

A calorie and macro tracker built around a profile-driven baseline: you enter your
body stats and fitness goal, the app calculates evidence-based calorie and macro
targets, and you log food against them by hand, by scanning a barcode, or by
describing a meal in plain text.

Everything runs client-side (Vite + React + TypeScript) and persists to the
browser's `localStorage` — no backend or account required.

## Features

**1. Research-backed macro baseline** (`src/lib/nutrition.ts`)
Calculates BMR with the Mifflin-St Jeor equation, scales it to TDEE with a
standard activity multiplier, then sets calorie/protein/carb/fat targets from
your goal (lose / maintain / gain) and body type, grounded in the ISSN position
stands on protein intake and diets/body composition. Sources and reasoning are
documented inline in that file. Profile also supports an optional photo.

**2. Manual meal logging** (`src/components/AddFoodForm.tsx`, `src/lib/foodDatabase.ts`)
Log a food by weight; picking a name from the built-in common-foods database
(curated, USDA-derived per-100g reference values) auto-calculates
calories/protein/carbs/fat, which stay editable. Unlisted foods can still be
entered fully manually.

**3. Barcode scanning** (`src/components/BarcodeScanner.tsx`, `BarcodeFoodPanel.tsx`)
Scans a product barcode with the device camera (`html5-qrcode`) and looks up
nutrition facts from the free, keyless [Open Food Facts](https://world.openfoodfacts.org/)
database (3M+ products) — name, brand, pack size, and per-serving data when
published. Detects single-serving containers (e.g. one can) and lets you log
by servings/units instead of only by weight; specificity of the name/brand
depends on how complete that barcode's entry is in OFF's crowd-sourced data.

**4. Free-text meal logging** (`src/lib/textParser.ts`, `src/lib/textFoodEstimate.ts`,
`src/components/TextFoodPanel.tsx`)
Describe a meal ("200g rice, 1 can of Coke") and it's split into food +
quantity clauses, matched against Open Food Facts by name, and shown as an
editable draft list before logging. This is a heuristic parser plus a lookup,
not an AI model reading the sentence — a static client-side app has nowhere
safe to hold an LLM API key, so results are meant to be reviewed/corrected,
not taken as exact.

The dashboard ties it together: daily progress bars for calories/protein/carbs/fat
against your targets, with day-by-day navigation.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
npm run test      # vitest — includes 1,000-iteration fuzz suites
```

Barcode scanning requires camera access, so open the app over `https://` or
`localhost` (camera APIs are blocked on plain `http://`) and grant the camera
permission prompt.

## Testing

`npm run test` runs fuzz suites (1,000 randomized inputs each, seeded for
reproducibility) against the three data-parsing surfaces most exposed to bad
input:

- `src/lib/nutrition.test.ts` — every profile field combination never throws
  and always yields finite, non-negative, internally consistent macros.
- `src/lib/openFoodFacts.test.ts` — malformed/extreme Open Food Facts payloads
  (missing fields, wrong types, huge numbers) never throw and never produce
  non-finite output.
- `src/lib/textParser.test.ts` — arbitrary free-text input (including empty,
  huge, non-string, and pathological strings) never throws and always yields
  bounded, sane quantities.

These caught two real bugs during development: a case where extreme
(but individually finite) Open Food Facts values could multiply into
`Infinity`, and a case where a glued quantity+unit like `"200g"` (no space)
wasn't recognized as a quantity at all. Both are fixed and covered by
regression tests.

## Project structure

```
src/
  lib/nutrition.ts          # BMR/TDEE/macro calculation engine
  lib/foodDatabase.ts       # curated common-foods per-100g reference table
  lib/openFoodFacts.ts      # Open Food Facts barcode/search client
  lib/textParser.ts         # free-text quantity/food extraction (pure, fuzz-tested)
  lib/textFoodEstimate.ts   # wires the text parser to Open Food Facts search
  lib/image.ts               # client-side photo downscaling for the profile
  lib/storage.ts             # localStorage persistence
  components/
    ProfileForm.tsx          # body stats + goal + photo input
    Dashboard.tsx             # daily summary + logging tabs
    AddFoodForm.tsx           # manual entry with database auto-calculation
    BarcodeScanner.tsx        # camera barcode scanning
    BarcodeFoodPanel.tsx      # barcode lookup -> servings/weight -> log
    TextFoodPanel.tsx         # free-text meal description -> editable drafts -> log
    MealLog.tsx                # grouped daily food log
    MacroProgress.tsx          # progress bars vs targets
```
