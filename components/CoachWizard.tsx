"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import type {
  CoachInputs,
  Taxonomy,
  UseCase,
  Modality,
  Region,
  IntegrationPattern,
  Delivery,
  Compliance,
  TaxonomyLeaf,
  CoachOutput,
} from "@/lib/types";
import { CoachOutputView } from "./CoachOutput";

type StepKey = keyof CoachInputs;

interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

const USE_CASES: Option<UseCase>[] = [
  { value: "wearables", label: "Wearables", hint: "Cloud providers, Apple HealthKit, Health Connect" },
  { value: "labs", label: "Labs", hint: "Diagnostics, biomarker panels, fulfillment" },
  { value: "both", label: "Both", hint: "Wearables + labs in one product" },
];

const MODALITIES: Option<Modality>[] = [
  { value: "in_person", label: "In-person (PSC)", hint: "Quest / LabCorp draw sites" },
  { value: "at_home", label: "At-home kit", hint: "Self-collection by mail" },
  { value: "mobile_phlebotomy", label: "Mobile phlebotomy", hint: "Phlebotomist visits the user" },
  { value: "hybrid", label: "Hybrid", hint: "Multiple modalities or labs + wearables" },
];

const REGIONS: Option<Region>[] = [
  { value: "us", label: "US" },
  { value: "eu", label: "EU" },
];

const PATTERNS: Option<IntegrationPattern>[] = [
  { value: "link_widget", label: "Link Widget", hint: "Hosted browser widget for cloud providers" },
  { value: "custom_link_api", label: "Custom Link API", hint: "Your own connection UI" },
  { value: "mobile_sdk", label: "Mobile SDK", hint: "iOS / Android, HealthKit / Health Connect" },
];

const DELIVERIES: Option<Delivery>[] = [
  { value: "webhooks", label: "Webhooks", hint: "You run an HTTPS endpoint" },
  { value: "etl_pubsub", label: "ETL: Google Pub/Sub" },
  { value: "etl_rabbitmq", label: "ETL: RabbitMQ" },
  { value: "etl_eventhubs", label: "ETL: Azure Event Hubs" },
];

const COMPLIANCES: Option<Compliance>[] = [
  { value: "hipaa", label: "HIPAA" },
  { value: "hipaa_soc2", label: "HIPAA + SOC 2" },
  { value: "hipaa_soc2_baa", label: "HIPAA + SOC 2 + signed BAA" },
];

interface Step {
  key: StepKey;
  question: string;
  options: Option<string>[];
}

function pickLeafLocal(taxonomy: Taxonomy, inputs: CoachInputs): TaxonomyLeaf {
  let best: TaxonomyLeaf | null = null;
  let bestScore = -1;
  for (const leaf of taxonomy.leaves) {
    let score = 0;
    let total = 0;
    (Object.keys(leaf.match) as (keyof CoachInputs)[]).forEach((k) => {
      total += 1;
      if (leaf.match[k] === inputs[k]) score += 1;
    });
    const s = total === 0 ? 0 : score / total + score * 0.001;
    if (s > bestScore) {
      bestScore = s;
      best = leaf;
    }
  }
  if (!best) throw new Error("No taxonomy leaves defined");
  return best;
}

export function CoachWizard({ taxonomy }: { taxonomy: Taxonomy }) {
  const [inputs, setInputs] = useState<Partial<CoachInputs>>({});
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);

  const steps: Step[] = useMemo(() => {
    const baseSteps: Step[] = [
      { key: "use_case", question: "What is the use case?", options: USE_CASES },
    ];
    if (inputs.use_case === "labs" || inputs.use_case === "both") {
      baseSteps.push({ key: "modality", question: "Which lab modality?", options: MODALITIES });
    }
    baseSteps.push({ key: "region", question: "Which region?", options: REGIONS });
    if (inputs.use_case !== "labs") {
      baseSteps.push({ key: "integration_pattern", question: "How will users connect?", options: PATTERNS });
    }
    baseSteps.push({ key: "delivery", question: "How do you want events delivered?", options: DELIVERIES });
    baseSteps.push({ key: "compliance", question: "What is the compliance posture?", options: COMPLIANCES });
    return baseSteps;
  }, [inputs.use_case]);

  const current = steps[stepIdx];
  const totalSteps = steps.length;

  const select = (value: string) => {
    if (!current) return;
    const next: Partial<CoachInputs> = { ...inputs, [current.key]: value };
    // Reset downstream answers if the use_case branch changes the step list.
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
    const filled: CoachInputs = {
      use_case: inputs.use_case ?? "wearables",
      modality: inputs.modality ?? "na",
      region: inputs.region ?? "us",
      integration_pattern: inputs.integration_pattern ?? "link_widget",
      delivery: inputs.delivery ?? "webhooks",
      compliance: inputs.compliance ?? "hipaa",
    };
    const leaf = pickLeafLocal(taxonomy, filled);
    const output: CoachOutput = {
      leafId: leaf.id,
      apiSurface: leaf.api_surface,
      apiSurfaceNote: leaf.api_surface_note,
      recommendedSdk: leaf.recommended_sdk,
      mermaid: leaf.mermaid_template,
      curl: leaf.curl_snippets,
      complianceChecklist: leaf.compliance_checklist,
      gotchas: leaf.gotchas,
    };
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

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
      <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

function SelectedInputs({ inputs }: { inputs: CoachInputs }) {
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
