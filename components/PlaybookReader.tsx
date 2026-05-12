"use client";

import { useMemo, useState } from "react";
import type { Question, PlaybookEntry, Topic } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import { PlaybookRow } from "./PlaybookRow";

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

