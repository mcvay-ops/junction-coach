"use client";

import { useMemo, useState, useEffect } from "react";
import type { Question, Topic } from "@/lib/types";
import { TOPIC_LABELS } from "@/lib/types";
import { QuestionRow } from "./QuestionRow";

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

