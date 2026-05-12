"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import type { CoachInputs, Taxonomy } from "@/lib/types";
import { buildCoachOutput, buildSteps, fillInputs } from "@/lib/coach";
import { CoachOutputView } from "./CoachOutput";
import { ProgressBar, SelectedInputs } from "./CoachWizardParts";

export function CoachWizard({ taxonomy }: { taxonomy: Taxonomy }) {
  const [inputs, setInputs] = useState<Partial<CoachInputs>>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const steps = useMemo(() => buildSteps(inputs.use_case), [inputs.use_case]);
  const current = steps[stepIdx];
  const totalSteps = steps.length;

  const select = (value: string) => {
    if (!current) return;
    const next: Partial<CoachInputs> = { ...inputs, [current.key]: value };
    if (current.key === "use_case") {
      delete next.modality;
      delete next.integration_pattern;
    }
    setInputs(next);
  };

  const canAdvance =
    current && (inputs as Record<string, unknown>)[current.key] !== undefined;

  const handleNext = () => {
    if (stepIdx < totalSteps - 1) {
      setStepIdx((i) => i + 1);
    } else {
      setDone(true);
    }
  };

  const handleBack = () => {
    if (done) {
      setDone(false);
      return;
    }
    setStepIdx((i) => Math.max(0, i - 1));
  };

  const reset = () => {
    setInputs({});
    setStepIdx(0);
    setDone(false);
  };

  if (done) {
    const filled = fillInputs(inputs);
    const output = buildCoachOutput(filled, taxonomy);
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button onClick={handleBack} className="btn-ghost">
            <ArrowLeft size={14} /> Edit inputs
          </button>
          <button onClick={reset} className="btn-ghost">
            <RefreshCw size={14} /> Start over
          </button>
          <SelectedInputs inputs={filled} />
        </div>
        <CoachOutputView output={output} />
      </div>
    );
  }

  return (
    <div>
      <ProgressBar current={stepIdx + 1} total={totalSteps} />
      <div className="card mt-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
          Step {stepIdx + 1} of {totalSteps}
        </p>
        <h2 className="mb-4 text-xl font-semibold tracking-tight">{current?.question}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {current?.options.map((o) => {
            const active = inputs[current.key as keyof CoachInputs] === o.value;
            return (
              <button
                key={o.value}
                onClick={() => select(o.value)}
                className={`flex flex-col items-start gap-1 rounded-lg border px-4 py-3 text-left transition ${
                  active
                    ? "border-accent bg-accent-muted dark:bg-ink-800"
                    : "border-ink-200 hover:border-accent dark:border-ink-700"
                }`}
              >
                <span className="text-sm font-medium">{o.label}</span>
                {o.hint && <span className="text-xs text-ink-500 dark:text-ink-400">{o.hint}</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button onClick={handleBack} disabled={stepIdx === 0} className="btn-ghost">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={handleNext} disabled={!canAdvance} className="btn">
          {stepIdx === totalSteps - 1 ? "See recommendation" : "Next"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
