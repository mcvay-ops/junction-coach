"use client";

import { useMemo, useState, useEffect } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import type { Question, Topic } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";

const TOPIC_ORDER: Topic[] = [
  "auth",
  "webhooks",
  "wearables",
  "labs",
  "compliance",
  "architecture",
];

export function QuestionList({ questions }: { questions: Question[] }) {
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) setOpenId(hash);
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: questions.length };
    TOPIC_ORDER.forEach((t) => {
      c[t] = questions.filter((q) => q.topic === t).length;
    });
    return c;
  }, [questions]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return questions.filter((q) => {
      if (topic !== "all" && q.topic !== topic) return false;
      if (!needle) return true;
      return (
        q.question.toLowerCase().includes(needle) ||
        q.answer.toLowerCase().includes(needle)
      );
    });
  }, [questions, topic, query]);

  const byTopic = useMemo(() => {
    const groups: Record<string, Question[]> = {};
    filtered.forEach((q) => {
      groups[q.topic] = groups[q.topic] || [];
      groups[q.topic].push(q);
    });
    return groups;
  }, [filtered]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions and answers..."
          className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm outline-none focus:border-accent dark:border-ink-700 dark:bg-ink-900"
        />
        <div className="-mx-1 flex flex-wrap gap-2">
          <button
            onClick={() => setTopic("all")}
            className={`chip ${topic === "all" ? "chip-active" : ""}`}
          >
            All ({counts.all})
          </button>
          {TOPIC_ORDER.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`chip ${topic === t ? "chip-active" : ""}`}
            >
              {TOPIC_LABELS[t]} ({counts[t] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="rounded-md border border-dashed border-ink-300 p-6 text-center text-sm text-ink-500 dark:border-ink-700">
          No questions match. Try a different search.
        </div>
      )}

      {TOPIC_ORDER.map((t) => {
        const group = byTopic[t];
        if (!group?.length) return null;
        return (
          <section key={t} className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-500 dark:text-ink-400">
              {TOPIC_LABELS[t]} · {group.length}
            </h2>
            <ul className="flex flex-col gap-2">
              {group.map((q) => (
                <QuestionRow
                  key={q.id}
                  q={q}
                  open={openId === q.id}
                  onToggle={() =>
                    setOpenId((cur) => (cur === q.id ? null : q.id))
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

function QuestionRow({
  q,
  open,
  onToggle,
}: {
  q: Question;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li id={q.id} className="card p-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="text-sm font-medium">{q.question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-ink-200 px-4 py-4 text-sm leading-relaxed text-ink-700 dark:border-ink-800 dark:text-ink-200">
          <p className="mb-3 whitespace-pre-line">{q.answer.trim()}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <a
              href={q.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline"
            >
              <ExternalLink size={12} /> {q.sourceLabel}
            </a>
            {q.related.length > 0 && (
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-ink-500">Related:</span>
                {q.related.map((rid) => (
                  <a
                    key={rid}
                    href={`#${rid}`}
                    className="rounded-full border border-ink-200 px-2 py-0.5 font-mono text-[11px] text-ink-600 hover:border-accent hover:text-accent dark:border-ink-700 dark:text-ink-300"
                  >
                    {rid}
                  </a>
                ))}
              </span>
            )}
            <span className="ml-auto font-mono text-[11px] text-ink-400">#{q.id}</span>
          </div>
        </div>
      )}
    </li>
  );
}
