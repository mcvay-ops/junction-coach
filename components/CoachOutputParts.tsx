"use client";

import { useState } from "react";
import { AlertTriangle, Check, CheckCircle2, ClipboardCheck, Copy } from "lucide-react";
import type { MatchInfo } from "@/lib/types";

export function MatchBanner({ match, leafId }: { match: MatchInfo; leafId: string }) {
  const mismatches = match.fields.filter((f) => f.status === "mismatch");
  const Icon = match.exact ? CheckCircle2 : AlertTriangle;
  const tone = match.exact
    ? "border-accent/40 bg-accent-muted/40 text-accent dark:bg-ink-800"
    : "border-amber-400/60 bg-amber-50 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200";
  return (
    <section className={`rounded-xl border p-4 text-sm ${tone}`}>
      <div className="flex items-start gap-2">
        <Icon size={16} className="mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-semibold">
            {match.exact
              ? `Exact taxonomy match: ${leafId}`
              : `Closest match: ${leafId} (no leaf matched every input)`}
          </p>
          {mismatches.length > 0 && (
            <p className="mt-1 text-xs">
              Differed on:{" "}
              {mismatches
                .map(
                  (f) =>
                    `${f.key.replace(/_/g, " ")} (leaf=${f.leafValue}, you=${f.userValue})`,
                )
                .join("; ")}
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export function CopyMarkdownButton({ markdown }: { markdown: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <button onClick={copy} className="btn-ghost">
      {copied ? <ClipboardCheck size={14} /> : <Copy size={14} />}
      {copied ? "Copied Markdown" : "Copy as Markdown"}
    </button>
  );
}

export function CurlBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs font-semibold text-ink-700 dark:text-ink-200">{label}</p>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 text-[11px] text-ink-500 hover:text-accent"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-block whitespace-pre-wrap">{code.trim()}</pre>
    </div>
  );
}

export function Checklist({ title, items }: { title: string; items: string[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <div className="card">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <button
              onClick={() => toggle(i)}
              className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border ${
                checked.has(i)
                  ? "border-accent bg-accent text-white"
                  : "border-ink-300 dark:border-ink-700"
              }`}
              aria-label={checked.has(i) ? "Uncheck" : "Check"}
            >
              {checked.has(i) && <Check size={10} />}
            </button>
            <span className={checked.has(i) ? "text-ink-400 line-through" : ""}>
              {it}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
        {title}
      </h3>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-sm">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
