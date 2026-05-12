# junction-coach tasks

Work in order. Each task should take 1-2 hours with AI-assisted coding.

## Task 1 — Scaffold
- Next.js 14 + TS + Tailwind + App Router.
- Install: `mermaid`, `js-yaml`, `@types/js-yaml`, `lucide-react`.
- Create directory structure per the brief.
- **Done when:** `npm run dev` shows the landing hub.

## Task 2 — Content shapes and loaders
- `lib/types.ts`: `Question`, `TaxonomyNode`, `PlaybookEntry`, `CoachInputs`, `CoachOutput`.
- `lib/content.ts`: load and type-check YAML at build time.
- Stub `content/questions.yaml`, `content/taxonomy.yaml`, `content/playbook.yaml`.
- **Done when:** `npm run build` succeeds and content is queryable from a server component.

## Task 3 — Question Bank content
- 25 entries in `content/questions.yaml`, sourced and factual.
- Topic mix: 4 auth, 6 webhooks, 4 wearables, 5 labs, 3 compliance, 3 architecture.

## Task 4 — Voice file
- `lib/voice.md` with the three rules from CLAUDE.md.

## Task 5 — Question Bank page
- `/questions`: list with topic filter chips, search input, accordion entries, deep links.

## Task 6 — Coach taxonomy
- `content/taxonomy.yaml` with at least 12 distinct end-to-end paths.

## Task 7 — Coach wizard UI
- `/coach`: stepper flow, Mermaid diagram, curl + SDK + compliance checklist output.

## Task 8 — SE Playbook
- `content/playbook.yaml` and `/playbook` page covering all 25 IDs with P0/P1/P2 escalation.

## Task 9 — README, deploy, Loom
- README opens with the success metric and live URL. Deploy to Vercel. Loom embedded.
