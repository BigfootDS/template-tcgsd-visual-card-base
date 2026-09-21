# template-tcgsd-visual-card-base

Updated: 21 September 2026.

Example visual-card template built with Astro and React. Releases package index.html, metadata.json, and supporting assets into a ZIP.

## Project-wide context

Read [central CONTEXT.md](../app-tcg-set-designer/CONTEXT.md), [tooling guidance](../app-tcg-set-designer/docs/TOOLING.md), and [next steps](../app-tcg-set-designer/docs/NEXT-STEPS.md). If the repositories are not siblings, use the [central repository](https://github.com/BigfootDS/app-tcg-set-designer).

## Current implementation

The example uses text-only `tcgsd:` placeholders and version 1 `public/metadata.json`, with `templateAuthor` and localised name arrays. The API installs its HTML/assets ZIP and renders previews. React components produce static markup without client hydration. The canonical contract and schema live in the central repository; keep `contracts/visual-template-v1.schema.json` identical to its canonical copy.

## Commands

- `npm ci` installs locked dependencies.
- `npm run check` runs Oxlint, Astro sync, TypeScript 7 checks, native metadata tests, and an Astro production build.
- `npm run dev` starts the Astro preview development server.
- `npm run build` writes the template into dist/.

## Constraints

- Preserve the ZIP layout and relative asset paths expected by consumers.
- Treat metadata as an API contract: coordinate schema changes with the API and central documentation.
- TypeScript 7 checks ordinary TS/TSX. Astro component compilation is verified by the build; full Astro language-server diagnostics remain a follow-up compatibility task.
- Keep template rendering independent of any developer machine hostname or filesystem path.
