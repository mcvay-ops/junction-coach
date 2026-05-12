"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import type { CoachInputs, Taxonomy } from "@/lib/types";
import { buildCoachOutput, buildSteps, fillInputs } from "@/lib/coach";
import { CoachOutputView } from "./CoachOutput";
import { SelectedInputs, StepNav } from "./CoachWizardParts";

export function CoachWizard({ taxonomy }: { taxonomy: Taxonomy }) {
  const [inputs, setInputs] = useState<Partial<CoachInputs>>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const steps = useMemo(() => buildSteps(inputs.use_case), [inputs.use_case]);
  const safeStepIdx = Math.min(stepIdx, steps.length - 1);
  const current = steps[safeStepIdx];
  const totalSteps = steps.length;

  const select = (value: string) => {
    if (!current) return;
    const next: Partial<CoachInputs> = { ...inputs, [current.key]: value };
    if (current.key === "use_case" && value !== inputs.use_case) {
      delete next.modality;
      delete next.integration_pattern;
    }
    setInputs(next);
  };

  const canAdvance =
    current && (inputs as Record<string, unknown>)[current.key] !== undefined;

  const handleNext = () => {
    if (safeStepIdx < totalSteps - 1) {
      setStepIdx(safeStepIdx + 1);
    } else {
      setDone(true);
    }
  };

  const handleBack = () => {
    if (done) {
      setDone(false);
      return;
    }
    setStepIdx(Math.max(0, safeStepIdx - 1));
  };

  const jumpTo = (idx: number) => {
    const target = Math.max(0, Math.min(idx, steps.length - 1));
    setStepIdx(target);
    setDone(false);
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
        <StepNav
          steps={steps}
          currentIdx={safeStepIdx}
          inputs={inputs}
          onJump={jumpTo}
          done
        />
        <div className="mt-4 mb-4 flex flex-wrap items-center gap-2">
          <button onClick={handleBack} className="btn-ghost">
            <ArrowLeft size={14} /> Edit inputs
          </button>
          <button onClick={reset} className="btn-ghost">
            <RefreshCw size={14} /> Start over
          </button>
          <SelectedInputs inputs={filled} steps={steps} onJump={jumpTo} />
        </div>
        <CoachOutputView output={output} inputs={filled} />
      </div>
    );
  }

  return (
    <div>
      <StepNav
        steps={steps}
        currentIdx={safeStepIdx}
        inputs={inputs}
        onJump={jumpTo}
      />
      {Object.keys(inputs).length > 0 && (
        <div className="mt-3">
          <SelectedInputs inputs={inputs} steps={steps} onJump={jumpTo} />
        </div>
      )}
      <div className="card mt-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent">
          Step {safeStepIdx + 1} of {totalSteps}
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
        <button onClick={handleBack} disabled={safeStepIdx === 0} className="btn-ghost">
          <ArrowLeft size={14} /> Back
        </button>
        <button onClick={handleNext} disabled={!canAdvance} className="btn">
          {safeStepIdx === totalSteps - 1 ? "See recommendation" : "Next"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
