import Link from "next/link";
import { BookOpen, Compass, ListChecks } from "lucide-react";

const cards = [
  {
    href: "/questions",
    title: "Question Bank",
    blurb:
      "25 of the most common pre-sales technical questions, answered with sources. Filter by topic, search by phrase, deep-link any entry.",
    icon: BookOpen,
    eyebrow: "Removes calls",
  },
  {
    href: "/coach",
    title: "Integration Coach",
    blurb:
      "Guided wizard. Pick a use case, modality, region, integration pattern, and compliance needs. Get a tailored architecture, curl snippets, SDK pick, and checklist.",
    icon: Compass,
    eyebrow: "Replaces calls",
  },
  {
    href: "/playbook",
    title: "SE Playbook",
    blurb:
      "The same 25 questions framed for the SE on a live call. Direct answer, qualifying questions, P0 / P1 / P2 escalation criteria, and a follow-up note template.",
    icon: ListChecks,
    eyebrow: "Runs calls",
  },
];

export default function Page() {
  return (
    <div className="container-page">
      <section className="mb-10 md:mb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          A Solutions Engineering artifact for Junction.
        </p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight md:text-5xl">
          Built to keep Product off external technical calls.
        </h1>
        <p className="max-w-2xl text-base text-ink-600 dark:text-ink-300 md:text-lg">
          The Junction handbook frames the role&apos;s success metric in its own voice:{" "}
          <em>
            &ldquo;Communication between humans is like bad APIs. A better API is one with no humans in the loop.&rdquo;
          </em>{" "}
          This is that API. Three surfaces, sourced from docs.junction.com and the team handbook.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="group card flex flex-col gap-3 hover:border-accent">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-accent-muted text-accent dark:bg-ink-800">
                <c.icon size={18} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                {c.eyebrow}
              </span>
            </div>
            <h2 className="text-lg font-semibold tracking-tight">{c.title}</h2>
            <p className="text-sm text-ink-600 dark:text-ink-300">{c.blurb}</p>
            <span className="mt-auto pt-2 text-xs font-medium text-accent">Open →</span>
          </Link>
        ))}
      </section>

      <section className="mt-12 rounded-xl border border-ink-200 bg-ink-50 p-5 text-sm leading-relaxed text-ink-700 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-200">
        <p className="mb-2 font-semibold">Scope</p>
        <p className="mb-2">
          Every fact verifies against docs.junction.com or the Junction handbook. Every entry links its source. The Coach renders sandbox-shaped curl
          and SDK snippets so a reviewer can read them, not run them.
        </p>
        <p>
          This is not a working integration against the live Junction API, not a webhook receiver, and not a production-grade demo. It is a content
          artifact, optimized for one outcome: the role&apos;s success metric.
        </p>
      </section>
    </div>
  );
}
