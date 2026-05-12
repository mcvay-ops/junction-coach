# junction-coach

**Role success metric:** drop Product time on external technical calls below 10%.

This artifact is the lever. Three surfaces (Question Bank, Integration Coach, SE Playbook) that let a prospect, an AE, or an SE answer the top 25 pre-sales technical questions without paging Product.

> *"Communication between humans is like bad APIs. Imagine our customers had to call us every time they wanted a lab order to go through our system. A better API is one with no humans in the loop."*
> Junction team handbook

| | |
|---|---|
| **Live URL** | https://junction-coach.vercel.app (placeholder, update after first deploy) |
| **Loom walkthrough (3 min)** | (placeholder, update after recording) |
| **Repo** | https://github.com/mcvay-ops/junction-coach |

---

## What this is

A content-driven Solutions Engineering artifact, built as a single Next.js app. Three surfaces:

1. **Question Bank** (`/questions`). 25 of the most common pre-sales technical questions, every answer sourced from `docs.junction.com` or `pages.junction.com/handbook`. Topic filters, full-text search, deep-linkable entry ids.
2. **Integration Coach** (`/coach`). Six-question wizard. Inputs: use case, modality, region, integration pattern, delivery, compliance. Output: tailored architecture diagram (Mermaid), curl snippets, recommended SDK, compliance checklist, gotchas.
3. **SE Playbook** (`/playbook`). The same 25 questions, framed for the SE on a live call. Direct answer, qualifying questions, P0/P1/P2 escalation criteria, follow-up note template.

## Screenshots

_Add screenshots after first deploy. Recommended captures:_

- Landing page (hub of three cards)
- Question Bank with the `Webhooks` chip selected
- Coach output for `wearables + mobile_sdk + US + webhooks + BAA`
- Playbook entry expanded showing P0/P1/P2

## How the success metric is met

| Surface | Call it removes |
|---|---|
| Question Bank | "Which API key do I use?" "What is your retry policy?" "Apple Health vs widget?" "DELETE or POST cancel?" |
| Integration Coach | The 30-minute architecture review for a standard wearables-or-labs prospect |
| Playbook | When a call still happens, SE runs it without paging Product |

A prospect or AE can self-serve the first two. The Playbook is for me, not them; it is here so the reviewer can see how I would actually handle the call.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- `mermaid` for diagrams, rendered client-side
- `js-yaml` for content loading at build time
- No backend, no database. All three pages are statically prerendered.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static prerender
npm run typecheck
```

All content lives in `content/*.yaml`. Components render content; they do not contain content.

```
content/
├── questions.yaml   # 25 Q&A entries
├── taxonomy.yaml    # Coach decision tree (12 leaves)
└── playbook.yaml    # 25 SE playbook entries
```

## Deploy

Vercel, zero config. From the repo root:

1. Push the branch to GitHub.
2. In Vercel, **Add New → Project**, import `mcvay-ops/junction-coach`, accept all defaults (framework auto-detects as Next.js).
3. Optional: set `NEXT_PUBLIC_SITE_URL` to the assigned production URL so Open Graph and Twitter card links resolve absolutely. Without it, the layout falls back to `https://junction-coach.vercel.app`.
4. Once deployed, replace the **Live URL** row at the top of this README and embed the Loom.

Build command: `next build`. Output: static + edge (OG image is rendered at the edge by `next/og`).

## Voice rules (`lib/voice.md`)

1. Open with the answer, not the framing. No "Great question."
2. No filler: never "leverage," "passionate," "cutting-edge," "holistic," "synergy," "robust," "seamless."
3. No em dashes. Use periods, commas, or parentheses.

## What this claims, and does not claim

**Claims.** Every fact is verifiable against `docs.junction.com` or the Junction handbook. Every Question Bank entry links its source. The Coach produces sandbox-shaped curl and SDK code so a reviewer can read it (not run it). 25 questions cover auth, webhooks, wearables, labs, compliance, and architecture. The Coach taxonomy produces 12 distinct end-to-end recommendations.

**Does not claim.** Working calls against the live Junction API. Working webhook delivery. A production-grade integration. A custom design system. A test suite. This is a content artifact, deliberately scoped to the role's success metric.

## Who built this

Jordan McVay. Solutions Engineer (not a developer), shipping with AI-assisted coding. Built this as the submission artifact for the Junction Senior SE application: an artifact you can demo on a call without engineering on the line.

## Anti-scope

The brief explicitly cuts: webhook receivers, HMAC verification, idempotency stores, working calls against the live Junction API, auth/login, a custom design system, tests beyond compile-time type checks, and any backend or database. Each of those would have looked impressive and would not have moved the success metric.

## Repo

https://github.com/mcvay-ops/junction-coach
