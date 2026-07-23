# WordForge

> A calm place to build your English knowledge, one word at a time.

---

# Vision

WordForge is a personal English knowledge system.

It is designed for long-term vocabulary acquisition through reading, reviewing, and knowledge building.

Unlike traditional flashcard applications, WordForge focuses on transforming words into lasting personal knowledge.

Target users include:

- IELTS learners
- Academic readers
- Researchers
- Professionals
- Lifelong English learners

---

# Product Philosophy

WordForge is **not** a flashcard app.

It is a place where users gradually build their own English knowledge base.

Every word should become:

- understandable
- memorable
- reusable
- connected to personal experience

The goal is not to memorize more words.

The goal is to build deeper understanding.

---

# Product Principles

## 1. Less is More

Every screen should have only one primary purpose.

Examples:

Review → Review vocabulary

Vocabulary → Manage vocabulary

Progress → View learning progress

Settings → Configure preferences

Avoid unnecessary buttons and visual clutter.

---

## 2. User Knowledge First

WordForge never owns the vocabulary.

Users create their own vocabulary library from:

- IELTS
- Research papers
- Books
- Websites
- Podcasts
- Daily reading

The user's vocabulary is the product.

---

## 3. Review is Invisible

Users never need to understand algorithms.

They only answer:

- Again
- Hard
- Good
- Easy

The review engine handles everything else.

---

## 4. Build for Years

Every design decision should support long-term learning.

Never optimize only for today's feature.

---

# Design Language

WordForge should feel:

- Calm
- Focused
- Comfortable
- Minimal
- Modern

Avoid:

- gamification
- unnecessary notifications
- excessive colors
- distracting animations

The interface should encourage deep concentration.

---

# UX Principles

Flashcards are clickable.

Avoid unnecessary confirmation dialogs.

Avoid extra clicks.

Large typography.

Comfortable spacing.

Consistent interaction.

Keyboard shortcuts should always remain available.

Hover effects should indicate interactive elements.

---

# Information Architecture

WordForge contains four major areas.

```
Review

Vocabulary

Progress

Settings
```

Each screen should have a single clear responsibility.

---

# Data Model

Core entities:

```
Word

Meaning

Example

ReviewProgress

Source
```

Word represents knowledge.

ReviewProgress represents learning state.

These should remain independent.

---

# Folder Structure

```
src/

    core/
        reviewEngine.js
        vocabRepository.js

    models/
        word.js
        review.js
        source.js

    services/
        storageService.js

    ui/
        components/
        pages/
        app.js

    styles/

    assets/
```

---

# Architecture Rules

UI never manipulates storage directly.

Review Engine never renders UI.

Storage Service is responsible for reading and writing data.

Business logic belongs in `core/`.

UI is responsible only for presentation.

Keep modules independent whenever possible.

---

# Coding Guidelines

Prefer:

- small modules
- reusable functions
- readable code
- clear naming

Avoid:

- duplicated logic
- oversized files
- tightly coupled modules

Write code that is easy to replace.

---

# AI Collaboration

## ChatGPT

Responsible for:

- Product planning
- UX design
- Architecture
- Code review
- Sprint planning

---

## GitHub Copilot

Responsible for:

- Feature implementation
- Refactoring
- Small improvements
- Bug fixing

Copilot should not invent product requirements.

When requirements are unclear, preserve existing behavior.

---

## Human

Responsible for:

- Product decisions
- Testing
- Final approval

Humans always have the final decision.

---

# Development Workflow

```
Product Design

↓

Sprint Planning

↓

Implementation

↓

Code Review

↓

Testing

↓

Commit

↓

Release
```

Every Sprint should improve the product while preserving architecture quality.

---

# Current Roadmap

## Foundation

✅ Flashcard UI

✅ Vocabulary Repository

✅ CSV Import

✅ Review Engine

✅ Vocabulary Data Model

✅ Flashcard UX Improvements

---

## Phase 1

⬜ Vocabulary Workspace

⬜ Search

⬜ Word Editor

⬜ Progress

⬜ Settings

---

## Phase 2

⬜ Favorites

⬜ Tags

⬜ Statistics

⬜ Export / Backup

---

## Phase 3

⬜ AI Example Generator

⬜ AI Explanation

⬜ AI Story Generator

⬜ AI Synonym Comparison

⬜ AI Writing Assistant

---

# Long-Term Goal

WordForge is not a flashcard application.

It is a lifelong English knowledge system.

Every word should become part of the user's thinking rather than simply something that has been memorized.

The product should remain simple enough to use every day, yet powerful enough to grow with the user for many years.