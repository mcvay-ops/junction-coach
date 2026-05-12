import { ExternalLink, ChevronDown } from "lucide-react";
import type { Question } from "@/lib/types";

export function QuestionRow({
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
