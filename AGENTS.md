# Repository guidance

Read this repository's CONTEXT.md and the project-wide guidance in ../app-tcg-set-designer/AGENTS.md before changing code. If the central repository is checked out elsewhere, locate it rather than creating a competing roadmap here.

- Check the current branch and working tree before editing. Preserve unrelated work.
- Put project-wide documentation, architecture decisions, and recommended next tasks in app-tcg-set-designer. Keep local context focused on this repository.
- Update local commands and context when implementation changes. Use Australian English.
- Use the Node version in .nvmrc, npm ci, the committed lockfile, TypeScript 7, and Oxlint. Run npm run check for changes to dependencies, build configuration, or application code.
- Preserve the ZIP layout and relative asset paths expected by consumers.
- Treat metadata as an API contract: coordinate schema changes with the API and central documentation.
- TypeScript 7 checks ordinary TS/TSX. Astro component compilation is verified by the build; full Astro language-server diagnostics remain a follow-up compatibility task.
- Keep template rendering independent of any developer machine hostname or filesystem path.
