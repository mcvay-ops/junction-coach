import type { CoachInputs } from "@/lib/types";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
      <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function SelectedInputs({ inputs }: { inputs: CoachInputs }) {
  const entries = Object.entries(inputs).filter(([, v]) => v && v !== "na");
  return (
    <div className="ml-2 flex flex-wrap gap-1">
      {entries.map(([k, v]) => (
        <span
          key={k}
          className="rounded-full border border-ink-200 px-2 py-0.5 text-[11px] text-ink-600 dark:border-ink-700 dark:text-ink-300"
        >
          {k.replace(/_/g, " ")}: <strong>{String(v).replace(/_/g, " ")}</strong>
        </span>
      ))}
    </div>
  );
}
