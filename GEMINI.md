# Project Overview

This is a **Nuxt 4** starter template tailored for an e-commerce application. It is a modern web application built with **Vue.js** and **TypeScript**. 

Key technologies and architectural choices include:
- **Framework:** Nuxt 4 (with standard `app/` directory structure)
- **UI & Styling:** [Nuxt UI](https://ui.nuxt.com) and Tailwind CSS 4
- **Icons:** `@iconify-json/lucide` and `@iconify-json/simple-icons` integrations
- **Package Manager:** `pnpm`

## Building and Running

The project relies on `pnpm` for package management and script execution.

### Setup
Install all dependencies before starting:
```bash
pnpm install
```

### Development
Start the local development server (defaults to `http://localhost:3000`):
```bash
pnpm dev
```

### Production
Build the application for production deployment:
```bash
pnpm build
```

Preview the production build locally:
```bash
pnpm preview
```

### Linting and Type Checking
Run the ESLint linter:
```bash
pnpm lint
```

Run TypeScript type checking across Vue components:
```bash
pnpm typecheck
```

## Development Conventions

- **Application Structure:** All primary application code (pages, components, assets, etc.) is located inside the `app/` directory, adhering to modern Nuxt directory conventions.
- **Language:** **TypeScript** is the standard language for scripts and Vue components (`<script setup lang="ts">`).
- **UI Components:** Prefer utilizing pre-built **Nuxt UI** components (e.g., `<UPageHero>`, `<UPageSection>`, `<UPageCTA>`) combined with Tailwind utility classes for consistent styling and accessibility.
- **Linting & Formatting:** ESLint is strictly configured using the `@nuxt/eslint` module. Some explicit stylistic rules established in `nuxt.config.ts` include:
  - No trailing commas (`commaDangle: 'never'`)
  - One True Brace Style (`braceStyle: '1tbs'`)
- **Routing:** File-based routing is used via the `app/pages/` directory. The index route (`/`) is configured to be pre-rendered.
