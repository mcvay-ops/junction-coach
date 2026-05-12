# junction-coach

## What this is
A content-driven Solutions Engineering artifact for the Junction Senior SE application. Three surfaces in one Next.js app:

1. **Question Bank** — searchable FAQ of the top 25 pre-sales technical questions answered from docs.junction.com and the Junction team handbook (pages.junction.com/handbook).
2. **Integration Coach** — guided wizard that takes prospect inputs and outputs tailored architecture + curl + SDK + compliance checklist.
3. **SE Playbook** — same questions, framed for the SE on a call, with escalation criteria using Junction's P0/P1/P2 urgency taxonomy.

## Anchor quote (use in README and Loom intro)
From the Junction team handbook: "Communication between humans is like bad APIs. Imagine our customers had to call us every time they wanted a lab order to go through our system. A better API is one with no humans in the loop."

This build is the API.

## Who is building this
Jordan McVay, a Solutions Engineer (not a developer). Ships with AI-assisted coding. Optimize for clarity, demo-ability, and accuracy of the Junction API surface.

## The single test for every change
"Does this directly keep Product off an external technical call?"

If no, cut it. This is the role's stated success metric.

## Junction's operating principles to write to (from the handbook)
- **Outrageous ambition** — pick the more ambitious framing
- **Go deep** — quality, sourced facts, understand the why
- **Owners, not employees** — pull the context, ship without being asked
- **Focus on Impact** — every line of work answers "does this meaningfully help"
- **High Standards, High Support** — direct, useful, no filler

## Junction's engineering values to write to (from the handbook)
- **Trust your peers** — owner makes the call
- **Strive for good outcomes, not perfect solutions** — shortcuts OK if they ladder up
- **Simple is better than clever** — KISS in the codebase and the content
- **Guardians, not carpenters** — own the developer experience end-to-end
- **Test strategically** — behaviors not coverage

## Stack (fixed — do not propose changes)
- Next.js 14, App Router, TypeScript
- Tailwind CSS, shadcn-style primitives where it saves time
- Mermaid for diagrams (`mermaid` npm)
- `js-yaml` for content loading
- Deployed to Vercel
- No backend, no database, no Docker

## Content discipline
- All Q&A, taxonomy nodes, and playbook entries live in `content/*.yaml`. Components render content. They do not contain content.
- Every Question Bank entry must include: id, question, topic, answer (one paragraph), source URL on docs.junction.com, related question IDs.
- Coach taxonomy must produce at least 12 distinct output combinations.
- Playbook entries must include: question, what to answer directly, when to qualify, escalation criteria, follow-up note template.

## Conventions
- Type-safe everywhere. No `any`. Content shapes defined in `lib/types.ts`.
- Keep components under 150 lines. Split when they grow.
- No client-side data fetching. Content is statically loaded at build time.
- No tests. This is a content artifact, not a service.

## Voice rules (also in `lib/voice.md`)
1. Open with the answer, not the framing. No "Great question."
2. No filler: never "leverage," "passionate," "cutting-edge," "holistic," "synergy."
3. No em dashes. Use periods, commas, or parentheses.

## Definition of done (overall)
- A reviewer can open the live URL, read three Question Bank entries, complete one Coach session, and skim the Playbook in under 5 minutes.
- All three surfaces work on mobile.
- README opens with the role's success metric and links the live URL prominently.
- 3-minute Loom recorded and embedded.

## Anti-scope (do NOT build)
- Webhook receivers, HMAC verification, idempotency stores
- Working integration against the live Junction API
- User auth, login, accounts
- A custom design system
- Tests beyond compile-time type checks
- Any backend or database
