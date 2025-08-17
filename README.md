# Deutsch Grammatik Trainer (GermanGrammarTrainer)

Lightweight single-page React app (Vite) to help 6th‑grade students in Zurich practice German grammar. The UI is intentionally simple and game-like: short interactive lessons, XP/streaks, badges, progress chart, and import/export for teachers or parents.

## Key features

- 25+ curated lessons covering conjugation, tenses, modal verbs, sentence structure, orthography and an exam-style practice test.
- Interactive exercises: fill-in and multiple-choice with instant feedback.
- Gamification: XP, level, streaks and badges stored in localStorage.
- Progress export/import (JSON) for sharing with teachers/parents.
- TypeScript + ESLint (type-aware rules) and a CI workflow for lint/build.

## Quick start

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Run development server (Vite):

   ```powershell
   npm run dev
   # open http://localhost:5173/
   ```

3. Lint the codebase:

   ```powershell
   npm run lint
   ```

4. Build production bundle:

   ```powershell
   npm run build
   # output in `dist/`
   ```

5. Serve the production build locally (preview):

   ```powershell
   npm run preview
   # open http://localhost:4173/
   ```

## Notes on TypeScript and ESLint

- The project uses TypeScript and `@typescript-eslint` for type-aware linting. To avoid transient peer dependency conflicts during install, the project pins TypeScript to a compatible version. If you change TypeScript or `@typescript-eslint` versions, update `eslint.config.js` accordingly.
- ESLint is configured in `eslint.config.js` with a TypeScript-specific block for `.ts/.tsx` files.

## CI

- A GitHub Actions workflow is included at `.github/workflows/ci.yml`. It runs `npm ci` (with a fallback to `npm install --legacy-peer-deps`), `npm run lint` and `npm run build` on push/PR to `main`.

## Project structure (important files)

- `src/App.tsx` — main app (TypeScript). Contains lessons, components, gamification and localStorage persistence.
- `src/main.tsx` — app entry.
- `src/App.css` — styles.
- `tsconfig.json` — TypeScript config.
- `eslint.config.js` — ESLint configuration with TypeScript rules.
- `.github/workflows/ci.yml` — CI workflow.

## Contributing

- Add new lessons by editing the `lessons` array in `src/App.tsx`.
- Keep UI small and exercise-focused (short questions, immediate feedback).
- When updating lint/TypeScript packages, run `npm ci` locally and ensure CI still passes.

## Troubleshooting

- If `npm install` fails due to peer dependency conflicts, run:

  ```powershell
  npm install --legacy-peer-deps
  ```

- If ESLint warns about TypeScript version compatibility, either pin the TypeScript version in `package.json` to a supported release or update `@typescript-eslint/*` to a release that supports your TypeScript.

## License

- MIT
