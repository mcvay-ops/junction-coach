import type { CoachInputs } from "@/lib/types";
import type { Step } from "@/lib/coach";

interface StepNavProps {
  steps: Step[];
  currentIdx: number;
  inputs: Partial<CoachInputs>;
  onJump: (idx: number) => void;
  done?: boolean;
}

export function StepNav({ steps, currentIdx, inputs, onJump, done }: StepNavProps) {
  const totalSteps = steps.length;
  const filledIdx = (idx: number) => {
    const k = steps[idx]?.key;
    return k ? inputs[k] !== undefined : false;
  };
  const fillPct = done
    ? 100
    : Math.round(((currentIdx + (filledIdx(currentIdx) ? 1 : 0)) / totalSteps) * 100);

  return (
    <div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
        <div className="h-full bg-accent transition-all" style={{ width: `${fillPct}%` }} />
      </div>
      <ol className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
        {steps.map((s, idx) => {
          const active = !done && idx === currentIdx;
          const filled = filledIdx(idx);
          const reachable = done || idx <= currentIdx || filled;
          return (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => reachable && onJump(idx)}
                disabled={!reachable}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 transition ${
                  active
                    ? "border-accent bg-accent-muted text-accent dark:bg-ink-800"
                    : filled
                      ? "border-ink-300 text-ink-700 hover:border-accent dark:border-ink-700 dark:text-ink-200"
                      : "border-ink-200 text-ink-400 dark:border-ink-800"
                } ${reachable ? "cursor-pointer" : "cursor-not-allowed"}`}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full text-[10px] font-semibold ${
                    filled || active
                      ? "bg-accent text-white"
                      : "bg-ink-200 text-ink-500 dark:bg-ink-800"
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="max-w-[10rem] truncate">{s.key.replace(/_/g, " ")}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface SelectedInputsProps {
  inputs: Partial<CoachInputs>;
  steps?: Step[];
  onJump?: (idx: number) => void;
}

export function SelectedInputs({ inputs, steps, onJump }: SelectedInputsProps) {
  const entries = Object.entries(inputs).filter(([, v]) => v && v !== "na");
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {entries.map(([k, v]) => {
        const stepIdx = steps?.findIndex((s) => s.key === k) ?? -1;
        const clickable = onJump && stepIdx >= 0;
        const base =
          "rounded-full border border-ink-200 px-2 py-0.5 text-[11px] text-ink-600 dark:border-ink-700 dark:text-ink-300";
        const content = (
          <>
            {k.replace(/_/g, " ")}: <strong>{String(v).replace(/_/g, " ")}</strong>
          </>
        );
        return clickable ? (
          <button
            key={k}
            type="button"
            onClick={() => onJump!(stepIdx)}
            className={`${base} transition hover:border-accent hover:text-accent`}
          >
            {content}
          </button>
        ) : (
          <span key={k} className={base}>
            {content}
          </span>
        );
      })}
    </div>
  );
}
