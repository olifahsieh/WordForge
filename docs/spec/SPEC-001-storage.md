# SPEC-001 Storage Extraction

## Goal

Introduce a Storage module without changing application behavior.

---

## Scope

Only extract one localStorage key:

- wf_mastery

No other keys should be modified.

---

## Requirements

- Preserve existing behavior.
- Do not modify UI.
- Do not change learning logic.
- Introduce `src/core/storage.js`.

---

## Acceptance Criteria

- Flashcard still works.
- Quiz still works.
- Existing mastery data is preserved.