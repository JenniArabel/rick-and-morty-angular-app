# AGENTS.md

Angular 20 SPA (Rick & Morty character browser) consuming the public Rick and Morty API plus an external auth API. The Angular app is at the repo root.

## Commands (run at the repo root)

- `npm start` — dev server (`ng serve`, default config = development).
- `npm run build` — production build (`ng build`, default = production with budget limits).
- `npm test` — Karma + Jasmine unit tests (`ng test`). Requires a real Chrome browser (no headless/CI config is set up); if Chrome is unavailable, tests won't run.

## Conventions & quirks (agent will likely miss these)

- **Components are pure standalone components**: `templateUrl` with an external `.html` file and NO style/`styleUrl` property. `skipStyle: true` is set in `.vscode/settings.json` schematics. Do not add `.css` files to new components; keep styling in Tailwind utility classes in the HTML.
- **Tailwind CSS v4** (PostCSS plugin, `@import "tailwindcss"` in `src/styles.css`). No `tailwind.config.js`; theme config lives in CSS. Don't fall back to v3 config patterns.
- **Hash-based routing** via `HashLocationStrategy` (see `app.config.ts`). URLs look like `/#/characters`. Keep this; `ng serve` reloads work because of the hash strategy.
- **State management is Angular signals**, not NgRx/Observable-based state. Components use `signal()`/`computed()` and `signal<..>([])` (e.g. `characters`, `loading`, `error` in `characters-page.component.ts`).
- **Dependency injection via `inject()`**, not constructor injection. HTTP services use `inject(HttpClient)`.
- **Validation helpers** live in `src/app/utils/form-utils.ts` (static validators + Spanish error messages). Use these shared validators rather than duplicating regex/validation per form.
- **UI copy & code comments are Spanish**; identifiers/kibbab filenames are English. Match that (Spanish strings/messages, English naming).

## API / auth

- Rick & Morty data: `https://rickandmortyapi.com/api` in `src/app/services/characters.service.ts`.
- Auth: external `http://api-auth.academy.mobydigital.com/api/user/{login,register}` in `src/app/services/auth.service.ts`. Auth state persists to `localStorage` under keys `authToken` / `currentUser`.
- Guarded by function guards in `src/app/auth/guards/`: `authGuard` (requires login) and `noAuthGuard` (blocks logged-in users). `auth/` child routes are lazily loaded.
- Public search/filter notes: characters page limits display to 10 per page and has 500ms debounce on search.

## Not yet implemented

- `/episodes` and `/locations` routes intentionally point at `NotFoundComponent` — placeholder surfaces, not real features.