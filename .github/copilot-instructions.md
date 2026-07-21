# WordForge Copilot Instructions

## Project Overview

WordForge is a Personal Vocabulary Operating System.

This project is being migrated from a legacy single-file HTML application into a modular architecture.

The primary objective is maintainability while preserving existing behavior.

---

# Engineering Principles

Always prioritize:

1. Preserve behavior.
2. Make the smallest possible change.
3. Prefer readability over cleverness.
4. Keep modules loosely coupled.
5. Protect user vocabulary data.

---

# Legacy Rules

The folder:

legacy/

contains the original stable application.

Never perform large modifications inside this folder.

When migrating functionality:

- Extract incrementally.
- Keep the legacy implementation working.
- Never rewrite the entire application.

---

# Architecture

Current architecture:

src/

    core/

    modules/

    services/

    ui/

The architecture should emerge gradually.

Do not create unnecessary folders or abstractions.

---

# Development Workflow

Before editing code:

1. Read the relevant document under docs/spec/.
2. Explain your implementation plan.
3. Wait for approval if the task changes architecture.

---

# Code Changes

Prefer:

- Small commits
- Small patches
- One logical change per task

Avoid:

- Large refactors
- Massive formatting-only commits
- Unrelated changes

---

# Documentation

When requested, update:

- CHANGELOG.md
- docs/spec/
- docs/adr/

to reflect engineering decisions.

---

# Communication

When completing a task:

1. Explain what changed.
2. Explain why.
3. Mention any risks.
4. Suggest the next incremental step.

Never make assumptions when requirements are ambiguous.