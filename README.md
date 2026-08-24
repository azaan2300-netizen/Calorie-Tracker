# Calorie & Macro Tracker

A calorie and macro tracker built around a profile-driven baseline: you enter your
body stats and fitness goal, the app calculates evidence-based calorie and macro
targets, and you log food against them either by hand or by scanning a barcode.

Everything runs client-side (Vite + React + TypeScript) and persists to the
browser's `localStorage` — no backend or account required.

## Features

**1. Research-backed macro baseline** (`src/lib/nutrition.ts`)
Calculates BMR with the Mifflin-St Jeor equation, scales it to TDEE with a
standard activity multiplier, then sets calorie/protein/carb/fat targets from
your goal (lose / maintain / gain) and body type, grounded in the ISSN position
stands on protein intake and diets/body composition. Sources and reasoning are
documented inline in that file.

**2. Manual meal logging** (`src/components/AddFoodForm.tsx`, `MealLog.tsx`)
Log any food with a name, serving size, and calories/protein/carbs/fat, grouped
into breakfast/lunch/dinner/snack, with per-meal and daily totals.

**3. Barcode scanning** (`src/components/BarcodeScanner.tsx`, `BarcodeFoodPanel.tsx`)
Scans a product barcode with the device camera (`html5-qrcode`) and looks up
real nutrition facts from the free, keyless [Open Food Facts](https://world.openfoodfacts.org/)
database (3M+ products). You pick a serving size in grams and it logs the
scaled macros automatically.

The dashboard ties it together: daily progress bars for calories/protein/carbs/fat
against your targets, with day-by-day navigation.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
```

Barcode scanning requires camera access, so open the app over `https://` or
`localhost` (camera APIs are blocked on plain `http://`) and grant the camera
permission prompt.

## Project structure

```
src/
  lib/nutrition.ts        # BMR/TDEE/macro calculation engine
  lib/openFoodFacts.ts    # Open Food Facts barcode lookup client
  lib/storage.ts           # localStorage persistence
  components/
    ProfileForm.tsx        # body stats + goal input
    Dashboard.tsx           # daily summary + logging tabs
    AddFoodForm.tsx         # manual macro entry
    BarcodeScanner.tsx      # camera barcode scanning
    BarcodeFoodPanel.tsx    # barcode lookup -> serving size -> log
    MealLog.tsx              # grouped daily food log
    MacroProgress.tsx        # progress bars vs targets
```
