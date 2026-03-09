# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Tech Stack

- **Ruby 4.0.0** / **Rails 8.1.1** / **PostgreSQL** (with `pg_trgm` for fuzzy search)
- **Sidekiq** (Redis) for background jobs
- **React 19** + **JSX** bundled with **Webpack 5** (Node 24)
- **Clearance** for authentication (sign-up disabled)
- **Cloudinary** for image hosting
- **handy-components** npm library for generic CRUD UI

## Commands

```bash
# Start Rails server
bundle exec rails server

# Start Sidekiq worker (required for background jobs)
bundle exec sidekiq

# Frontend — watch mode for development
npm run dev

# Run tests
bundle exec rails test

# Run a single test file
bundle exec rails test test/models/card_test.rb

# Run a single test by line number
bundle exec rails test test/models/card_test.rb:42

# Database migrations
bundle exec rails db:migrate

# Run a one-off production script
bundle exec rails runner scripts/my_script.rb
```

## Production Scripts

One-off maintenance scripts live in `/scripts/` as plain Ruby files (no rake tasks). Run them with `bundle exec rails runner scripts/script_name.rb`.

## Architecture Overview

### Two-Layer Controller Pattern

1. **Public controllers** (`app/controllers/*.rb`) — handle `index` and `show` only, render ERB views. These serve the initial page HTML shell.
2. **API controllers** (`app/controllers/api/*_controller.rb`) — handle all mutations (create/update/destroy) and return JSON via Jbuilder. All require login via Clearance.

ERB views contain a single `<div id="some-id">` that React mounts into. Rails renders the shell, then React hydrates the interactive UI by hitting the API controllers.

### Frontend: handy-components Library

The React frontend uses the **`handy-components`** npm library for generic CRUD components:

- **`FullIndex`** — sortable, paginated index table with optional inline "new entity" modal.
- **`SearchIndex`** — like `FullIndex` but with a search/filter panel.
- **`SimpleDetails`** — declarative detail/edit form that auto-generates UI and wires up GET/PUT/DELETE to matching API routes.

The entry point is `frontend/entry.jsx`. On `DOMContentLoaded`, it scans for known element IDs and mounts the appropriate component. Webpack bundles everything to `app/assets/javascripts/me/bundle.js`.

Custom components live in `frontend/containers/` for complex pages (quiz details, quiz run, card details, language-specific word details).

### Frontend Conventions

- Always import React explicitly: `import React, { useState, ... } from 'react'`. Do not remove the React import even if a linter flags it as unused.

### JSON Convention

API responses use **camelCase keys**. The `RenderErrors` concern transforms ActiveRecord error keys with `camelize(:lower)` and returns 422. Jbuilder templates in `app/views/api/` follow this convention. The frontend expects camelCase throughout.

### Key Controller Concerns

- **`RenderErrors`** — standardizes validation error responses (422 with camelCase keys). Use `render_errors(@entity)` on failed saves.
- **`SearchIndex`** — pagination, sorting, and fuzzy search via PostgreSQL ILIKE.
- **`AvailableQuestions`** — maps question types to models and calculates available question count for quizzes.
- **`Wordable`** — shared word tagging logic.

### Background Jobs: Worker → Job Model Pattern

1. A `Job` record is created before the worker is enqueued, storing a unique `job_id`.
2. The worker finds the Job, does its work, updates `current_value` for progress.
3. On completion, result stored in `metadata` (JSONB column) and `status` set to `'success'`.
4. The frontend polls `GET /api/jobs` to check status.

Workers: `CreateVocabularyCards` (batch card creation), `FetchWordDefinitions` (external API lookup).

### Quiz System

The `Quiz` model's `run()` method generates question data from associated `QuizQuestion` records. Question types are mapped via `QUESTION_MODELS_MAP` in the `AvailableQuestions` concern. Each question type corresponds to a model (Card, Noun, Verb, etc.) with language-specific logic. Quizzes support chained questions (parent/child), max question limits, and tag-based word filtering.

### Language Model Concerns

Language-specific logic lives in model concerns (`app/models/concerns/`):

- **`French`** — vowel-sound detection for article selection, verb conjugation (present/past/future), noun/adjective gender/number forms.
- **`Spanish`** — estar conjugation, verb form mappings, subject pronoun generation.
- **`Hindi`** — noun/verb/adjective translation and sentence construction.

### Polymorphic Tags

`CardTag` is polymorphic — a single tag system works across Card, Noun, Verb, Adjective, SpanishNoun, FrenchVerb, etc. Tags filter which words appear in quiz questions.

### Card Configuration

The `Card` model stores question-specific options in a `config` JSONB column validated against `config/schemas/card.json`. Options include `line_count`, `inconsolata`, `no_repeat`, `screaming_snake`.

### External Integrations

- **Cloudinary** — image storage for card questions
- **Words API** — definition fetching (`WORDS_API_KEY` env var)
