"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Question, PlaybookEntry, Topic } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";

const TOPIC_ORDER: Topic[] = [
  "auth",
  "webhooks",
  "wearables",
  "labs",
  "compliance",
  "architecture",
];

interface Row {
  question: Question;
  entry: PlaybookEntry;
}

export function PlaybookReader({
  questions,
  entries,
}: {
  questions: Question[];
  entries: PlaybookEntry[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const rows: Record<Topic, Row[]> = useMemo(() => {
    const byId = new Map(entries.map((e) => [e.id, e]));
    const out: Record<string, Row[]> = {};
    questions.forEach((q) => {
      const entry = byId.get(q.id);
      if (!entry) return;
      out[q.topic] = out[q.topic] || [];
      out[q.topic].push({ question: q, entry });
    });
    return out as Record<Topic, Row[]>;
  }, [questions, entries]);

  return (
    <div>
      <div className="mb-6 rounded-lg border-l-4 border-accent bg-accent-muted/40 p-4 text-sm leading-relaxed dark:bg-ink-900">
        <p className="font-semibold">Internal SE reference.</p>
        <p className="text-ink-700 dark:text-ink-200">
          Linked from the README so reviewers can see how I would run the calls that still happen, even after the Question Bank and Coach drop the rest.
          Each entry is the same 25 questions, framed for the live call.
        </p>
      </div>

      {TOPIC_ORDER.map((t) => {
        const group = rows[t];
        if (!group?.length) return null;
        return (
          <section key={t} className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400">
              {TOPIC_LABELS[t]} · {group.length}
            </h2>
            <ul className="flex flex-col gap-2">
              {group.map(({ question, entry }) => (
                <PlaybookRow
                  key={entry.id}
                  question={question}
                  entry={entry}
                  open={openId === entry.id}
                  onToggle={() =>
                    setOpenId((cur) => (cur === entry.id ? null : entry.id))
                  }
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function PlaybookRow({
  question,
  entry,
  open,
  onToggle,
}: {
  question: Question;
  entry: PlaybookEntry;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li id={entry.id} className="card p-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-medium">{question.question}</span>
        <span className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-ink-400">#{entry.id}</span>
          <ChevronDown
            size={16}
            className={`shrink-0 text-ink-500 transition ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-ink-200 px-4 py-4 text-sm leading-relaxed text-ink-700 dark:border-ink-800 dark:text-ink-200">
          <Block label="Direct answer">
            <p className="whitespace-pre-line">{entry.directAnswer.trim()}</p>
          </Block>
          <Block label="Qualify when">
            <ul className="list-disc pl-5">
              {entry.qualifyWhen.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </Block>
          <Block label="Escalate when">
            <div className="grid gap-2 md:grid-cols-3">
              <Pill level="P0" copy={entry.escalateWhen.p0} />
              <Pill level="P1" copy={entry.escalateWhen.p1} />
              <Pill level="P2" copy={entry.escalateWhen.p2} />
            </div>
          </Block>
          <Block label="Follow-up note template">
            <pre className="code-block whitespace-pre-wrap">{entry.followUpTemplate.trim()}</pre>
          </Block>
        </div>
      )}
    </li>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {label}
      </p>
      {children}
    </div>
  );
}

const LEVEL_STYLE: Record<string, string> = {
  P0: "border-red-300 bg-red-50 text-red-900 dark:border-red-700 dark:bg-red-950/40 dark:text-red-100",
  P1: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100",
  P2: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-100",
};

function Pill({ level, copy }: { level: "P0" | "P1" | "P2"; copy: string }) {
  return (
    <div className={`rounded-md border p-2 text-xs ${LEVEL_STYLE[level]}`}>
      <p className="mb-1 font-semibold">{level}</p>
      <p>{copy}</p>
    </div>
  );
}
