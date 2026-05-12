"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { MermaidDiagram } from "./MermaidDiagram";
import type { CoachOutput } from "@/lib/types";

const SURFACE_LABEL: Record<CoachOutput["apiSurface"], string> = {
  vital_api: "Vital API (application plane)",
  org_management_api: "Org Management API (control plane)",
  both: "Vital API + Org Management API",
};

export function CoachOutputView({ output }: { output: CoachOutput }) {
  return (
    <div className="flex flex-col gap-6">
      <section className="card">
        <header className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Recommended architecture
          </h3>
          <span className="font-mono text-[11px] text-ink-400">{output.leafId}</span>
        </header>
        <MermaidDiagram chart={output.mermaid.trim()} />
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            API surface
          </h3>
          <p className="mb-2 text-base font-semibold">{SURFACE_LABEL[output.apiSurface]}</p>
          <p className="text-sm text-ink-600 dark:text-ink-300">{output.apiSurfaceNote}</p>
        </div>
        <div className="card">
          <h3 className="mb-1 text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
            Recommended SDK
          </h3>
          <p className="text-sm">{output.recommendedSdk}</p>
        </div>
      </section>

      <section className="card">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          curl snippets
        </h3>
        <div className="flex flex-col gap-3">
          {output.curl.map((s, i) => (
            <CurlBlock key={i} label={s.label} code={s.code} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Checklist title="Compliance checklist" items={output.complianceChecklist} />
        <BulletList title="Gotchas" items={output.gotchas} />
      </section>
    </div>
  );
}

function CurlBlock({ label, code }: { label: string; code: string }) {
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

function Checklist({ title, items }: { title: string; items: string[] }) {
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

function BulletList({ title, items }: { title: string; items: string[] }) {
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
