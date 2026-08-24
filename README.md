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
Type a food name and a weight; calories/protein/carbs/fat are calculated
automatically from a curated database of 380+ foods and drinks (USDA-derived
per-100g reference values) — those fields are computed output, not something
you type. Matching is fuzzy (handles plurals/casual phrasing, e.g. "chicken
thighs", and accented input, e.g. "piña colada"). Coverage spans proteins,
grains, produce, dairy, desserts, seasonings, Asian/Indian/Middle
Eastern/Latin cuisine, and alcohol/cocktails. Only when nothing matches does
a manual macro-entry fallback appear, clearly separated from the normal flow.

**3. Barcode scanning** (`src/components/BarcodeScanner.tsx`, `BarcodeFoodPanel.tsx`)
Scans a product barcode with the device camera (`html5-qrcode`) and looks up
nutrition facts from the free, keyless [Open Food Facts](https://world.openfoodfacts.org/)
database (3M+ products, including most US retailers' store-brand items —
Trader Joe's, Whole Foods 365, Kroger, Costco/Kirkland, etc.) — name, brand,
pack size, and per-serving data when published. Detects single-serving
containers (e.g. one can) and lets you log by servings/units instead of only
by weight. Specificity depends on how complete that barcode's crowd-sourced
entry is; if a match exists but has no nutrition facts filled in yet (common
for niche items), the app says so rather than showing a misleading "0 kcal."
Free-text search applies the same rule: it skips an incomplete top match in
favor of a usable one, or reports no match rather than a false zero.

**4. Free-text meal logging** (`src/lib/textParser.ts`, `src/lib/textFoodEstimate.ts`,
`src/components/TextFoodPanel.tsx`)
Describe a meal ("200g rice, 1 can of Coke") and it's split into food +
quantity clauses, matched against the local food database first and then
Open Food Facts for branded items, and shown as a draft list before logging.
Matched items show computed macros (not editable fields); only unmatched
items get manual macro-entry inputs. This is a heuristic parser plus a
lookup, not an AI model reading the sentence — a static client-side app has
nowhere safe to hold an LLM API key.

**5. WHOOP sync** (`src/lib/whoopAuth.ts`, `whoopApi.ts`, `whoopSync.ts`, `WhoopConnect.tsx`)
Connects to WHOOP via OAuth2 and syncs calories burned and strain (converted
from WHOOP's kilojoule energy figure) plus recovery score, shown on the
Dashboard next to that day's food log with a computed net-calories line
(consumed − burned). WHOOP doesn't track step count at all — it's a
strain/recovery/heart-rate wearable, not a pedometer — so steps aren't part
of this integration. The OAuth `client_secret` can't live in this static
site's public code, so the token exchange runs through a small Cloudflare
Worker (`cloudflare-worker/`) that only you can deploy, since it needs your
own WHOOP developer account and secret — see `cloudflare-worker/README.md`
for the one-time setup. Until it's configured, the app shows a "not set up"
message instead of a broken connect button.

**6. Report view** (`src/components/ReportView.tsx`)
A 14-day table cross-referencing food logged (calories/protein/carbs/fat) with
WHOOP calories burned, strain, and recovery — plus a computed net-calories
column and running averages — so you can see how intake and activity relate
day to day, not just calories in isolation.

The dashboard ties it together: daily progress bars for calories/protein/carbs/fat
against your targets, with day-by-day navigation.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
npm run test      # vitest — includes 1,000- and 5,000-iteration fuzz suites
```

Barcode scanning requires camera access, so open the app over `https://` or
`localhost` (camera APIs are blocked on plain `http://`) and grant the camera
permission prompt.

WHOOP sync requires a one-time setup only you can do (your own WHOOP
developer account + a small Cloudflare Worker deploy) — see
`cloudflare-worker/README.md`. Without it, the rest of the app works
normally; the WHOOP section just shows a "not configured" message.

## Testing

`npm run test` runs fuzz suites (1,000 randomized inputs each, seeded for
reproducibility) against the data-parsing surfaces most exposed to bad input:

- `src/lib/nutrition.test.ts` — every profile field combination never throws
  and always yields finite, non-negative, internally consistent macros.
- `src/lib/openFoodFacts.test.ts` — malformed/extreme Open Food Facts payloads
  (missing fields, wrong types, huge numbers) never throw and never produce
  non-finite output.
- `src/lib/textParser.test.ts` — arbitrary free-text input (including empty,
  huge, non-string, and pathological strings) never throws and always yields
  bounded, sane quantities.
- `src/lib/foodDatabase.test.ts` — fuzzed queries against the fuzzy matcher
  never throw and only ever return a real database entry.
- `src/lib/mealCombination.test.ts` — 1,000 randomly generated multi-food meal
  descriptions (1-5 real database foods each, random quantities/separators)
  never throw, split into the right number of items, and every item matches
  back to a real database entry with finite, non-negative computed macros.
- `src/lib/whoopApi.test.ts` — 1,000 malformed/edge-case WHOOP API payloads
  (missing fields, wrong types, unscored cycles, huge numbers) never throw
  and never produce non-finite or negative output.
- `src/lib/comprehensiveFuzz.test.ts` — 10 independently-seeded rounds of 500
  entries each (5,000 total), covering food, drinks, soda, alcohol, and
  cocktails drawn from the full 380+-entry database plus adversarial input
  (emoji, script tags, extreme lengths, mixed scripts, accented characters).
  Each round also asserts a >85% real-match rate as a regression guard, not
  just "didn't crash."

This process caught several real bugs, all fixed and covered by regression
tests: extreme (but individually finite) Open Food Facts values multiplying
into `Infinity`; a glued quantity+unit like `"200g"` (no space) not being
recognized as a quantity; a leftover "and"/"plus"/"&" polluting the food name
after a list gets comma-split; a single un-commaed " and "/" & " incorrectly
splitting a compound food name like "mac and cheese" in half (now only
auto-split when 2+ occurrences signal a real list, applied per comma-segment
so a tail like "rice, chicken and broccoli and asparagus" still splits
correctly); semicolon- and "&"-separated lists not being recognized as lists
at all; accented input ("piña colada", "jalapeño") shattering into
meaningless single-letter fragments instead of matching, from an accent-fold
missing in the fuzzy matcher; and natural quantity phrases without a leading
number ("a bottle of beer", "a glass of wine", "a shot of tequila") leaving
the container word stuck in the food query and dragging real matches below
the fuzzy matcher's threshold.

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
    WhoopConnect.tsx           # WHOOP connect/sync/disconnect controls
    ReportView.tsx              # 14-day food + WHOOP cross-reference table
    MealLog.tsx                  # grouped daily food log
    MacroProgress.tsx            # progress bars vs targets

cloudflare-worker/            # separate small Worker; see its own README for setup
  src/index.js                 # holds the WHOOP client_secret, proxies token exchange/refresh
  wrangler.toml
```
