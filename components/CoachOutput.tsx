"use client";

import { MermaidDiagram } from "./MermaidDiagram";
import {
  BulletList,
  Checklist,
  CopyMarkdownButton,
  CurlBlock,
  MatchBanner,
} from "./CoachOutputParts";
import { outputToMarkdown } from "@/lib/coach";
import type { CoachInputs, CoachOutput } from "@/lib/types";

const SURFACE_LABEL: Record<CoachOutput["apiSurface"], string> = {
  vital_api: "Vital API (application plane)",
  org_management_api: "Org Management API (control plane)",
  both: "Vital API + Org Management API",
};

export function CoachOutputView({
  output,
  inputs,
}: {
  output: CoachOutput;
  inputs: CoachInputs;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <CopyMarkdownButton markdown={outputToMarkdown(inputs, output)} />
      </div>

      <MatchBanner match={output.match} leafId={output.leafId} />

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
