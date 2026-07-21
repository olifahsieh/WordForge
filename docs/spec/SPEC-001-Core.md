# SPEC-001

## Objective

Create a maintainable architecture for WordForge.

---

## Core Layers

UI

Learning Domain

Vocabulary Repository

Persistence

---

## Rule

UI never accesses Persistence directly.

All persistence must go through Repository or Domain.

---

Status

Draft