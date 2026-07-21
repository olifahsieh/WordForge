# STORAGE INVENTORY

## Objective

Catalog all usages of `localStorage` to prepare for a Storage module.

## Method

Searched the repository for `localStorage.getItem`, `setItem`, `removeItem`, and `clear`.
All matches are in the legacy UI: [legacy/vocab_app.html](legacy/vocab_app.html).

## Summary - keys found

- `wf_mastery`
- `wf_srs`
- `wf_history`
- `wf_datasets`
- `wf_active_dataset`
- `wf_streak`
- `wf_group_order`
- `wf_active_group`

## Detailed inventory

**`wf_mastery`**
- **Read:** Initialization in [legacy/vocab_app.html](legacy/vocab_app.html#L782).
- **Written:** `saveAll()` writes it in [legacy/vocab_app.html](legacy/vocab_app.html#L791).
- **Data:** JSON object mapping word -> mastery level (integer). Example access via `masteryMap[w]`.
- **Depends/Used by:** `getMastery()`, `setMastery()`, flashcard (`markCard()`), quiz/group progress, `updateHeader()`.

**`wf_srs`**
- **Read:** Initialization in [legacy/vocab_app.html](legacy/vocab_app.html#L783).
- **Written:** `saveAll()` writes it in [legacy/vocab_app.html](legacy/vocab_app.html#L792). `setMastery()` updates `srsMap` in memory then calls `saveAll()` ([legacy/vocab_app.html](legacy/vocab_app.html#L790-L793)).
- **Data:** JSON object mapping word -> ISO date string for next scheduled review.
- **Depends/Used by:** SRS scheduling logic; used when computing next-review dates (see `SRS_DAYS` and `setMastery()`).

**`wf_history`**
- **Read:** Initialization in [legacy/vocab_app.html](legacy/vocab_app.html#L784).
- **Written:** `saveAll()` writes it in [legacy/vocab_app.html](legacy/vocab_app.html#L793). `setMastery()` increments today's count and triggers `saveAll()` ([legacy/vocab_app.html](legacy/vocab_app.html#L790-L794)).
- **Data:** JSON object mapping date-string -> number of reviews done that date.
- **Depends/Used by:** Review history / statistics shown in UI and `updateHeader()`.

**`wf_datasets`**
- **Read:** Initialization in [legacy/vocab_app.html](legacy/vocab_app.html#L785).
- **Written:** `saveAll()` writes it in [legacy/vocab_app.html](legacy/vocab_app.html#L794). New datasets are inserted in code paths like `confirmImport()` which `unshift` a new dataset object into `datasets` ([legacy/vocab_app.html](legacy/vocab_app.html#L1509-L1516)).
- **Data:** Array of dataset metadata objects: `{ id, name, date, time, count, words }`.
- **Depends/Used by:** Import/export, dataset selection (`loadDataset()`), rendering dataset list (`renderDatasetsList()`), and switching between builtin/imported sets.

**`wf_active_dataset`**
- **Read:** Initialization in [legacy/vocab_app.html](legacy/vocab_app.html#L786).
- **Written:** `saveAll()` writes it in [legacy/vocab_app.html](legacy/vocab_app.html#L795). Also set when importing or loading datasets (`activeDatasetId = id` in `confirmImport()`/`loadDataset()` [legacy/vocab_app.html](legacy/vocab_app.html#L1509-L1516, L1529-L1536)).
- **Data:** String id pointing at the active dataset (e.g. `builtin` or `ds_...`).
- **Depends/Used by:** Dataset management and `loadDataset()` / `loadBuiltin()` flows.

**`wf_streak`**
- **Read:** Initialization in [legacy/vocab_app.html](legacy/vocab_app.html#L787).
- **Written:** `saveAll()` writes it in [legacy/vocab_app.html](legacy/vocab_app.html#L796). Updated in `markCard()` where streak increments/decrements and `saveAll()` is called ([legacy/vocab_app.html](legacy/vocab_app.html#L942-L948)).
- **Data:** Integer (stored as string) representing the user's current streak.
- **Depends/Used by:** UI header (`streakCount`) and progress/streak display.

**`wf_group_order`**
- **Read:** In `buildGroups()` when loading existing order: [legacy/vocab_app.html](legacy/vocab_app.html#L839).
- **Written:** When a new shuffled order is generated: [legacy/vocab_app.html](legacy/vocab_app.html#L845).
- **Removed (cleared):** Multiple places call `localStorage.removeItem('wf_group_order')` to force rebuild: `confirmImport()` ([legacy/vocab_app.html](legacy/vocab_app.html#L1524)), `loadDataset()` ([legacy/vocab_app.html](legacy/vocab_app.html#L1533)), `loadBuiltin()` ([legacy/vocab_app.html](legacy/vocab_app.html#L1542)), `confirmAddWord()` ([legacy/vocab_app.html](legacy/vocab_app.html#L1716)), `runBatch()` ([legacy/vocab_app.html](legacy/vocab_app.html#L1787)) — see all removal sites.
- **Data:** JSON array representing a stable shuffled ordering of all words (array of word keys).
- **Depends/Used by:** Grouping system (`buildGroups()`), group-based quiz, group UI (`renderGrpBanner()`). Removing the key forces a new shuffle/rebuild.

**`wf_active_group`**
- **Read:** In `buildGroups()` to restore the previously active group: [legacy/vocab_app.html](legacy/vocab_app.html#L856).
- **Written:** `setActiveGrp()` writes the selected index: [legacy/vocab_app.html](legacy/vocab_app.html#L867).
- **Data:** Integer index (stored as string) of the currently active group.
- **Depends/Used by:** Group selection UI, `getActiveGroup()`, `checkShowGroupDone()` and other group navigation logic.

## Notes / Next steps

- All `localStorage` usage in the codebase is contained in the legacy single-file app at [legacy/vocab_app.html](legacy/vocab_app.html). No `localStorage` calls were found elsewhere in `src/`.
- The report above is analysis-only; no application code was modified.
- Next step (optional): design a Storage abstraction and migrate reads/writes behind it. If you want, I can draft the Storage module and an automated migration plan.

---
Generated by repository scan on 2026-07-21.
