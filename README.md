# TCGSD example visual-card template

Build a server-managed template ZIP for TCG Set Designer. Astro and React generate static HTML; template scripts and client hydration do not run in previews.

## Development

Use Node 24 and npm 11. Run `npm ci`, then `npm run check` to lint, type-check, validate metadata, and build. `npm run dev` starts Astro's development server.

The build writes `index.html`, `metadata.json`, and supporting assets to `dist/`. ZIP the contents of that directory, then extract the package into the API's `TEMPLATES_PATH/example-template/` directory.

## Card placeholders

Put placeholders in text nodes:

```html
<h1>tcgsd:name</h1>
<p>tcgsd:types</p>
<p>tcgsd:resource1</p>
```

The API selects translated text and escapes inserted content. Attribute placeholders are rejected. Use relative asset paths or the `/tcgsd-template-assets` prefix configured in Astro.

## Metadata and project guidance

`public/metadata.json` follows the version 1 schema in `contracts/visual-template-v1.schema.json`. Use `templateAuthor`, localised name arrays, and ISO 639-1 language codes such as `ja` for Japanese. Keep the metadata version aligned with `package.json`.

Read [CONTEXT.md](CONTEXT.md), [AGENTS.md](AGENTS.md), and the central [template contract](https://github.com/BigfootDS/app-tcg-set-designer/blob/main/docs/TEMPLATE-CONTRACT.md). The canonical schema and all project-wide decisions live in `app-tcg-set-designer`.
