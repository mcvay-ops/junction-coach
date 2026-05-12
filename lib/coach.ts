import type {
  CoachInputs,
  CoachOutput,
  Compliance,
  Delivery,
  IntegrationPattern,
  Modality,
  Region,
  Taxonomy,
  TaxonomyLeaf,
  UseCase,
} from "./types";

export type StepKey = keyof CoachInputs;

export interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export interface Step {
  key: StepKey;
  question: string;
  options: Option<string>[];
}

export const USE_CASES: Option<UseCase>[] = [
  { value: "wearables", label: "Wearables", hint: "Cloud providers, Apple HealthKit, Health Connect" },
  { value: "labs", label: "Labs", hint: "Diagnostics, biomarker panels, fulfillment" },
  { value: "both", label: "Both", hint: "Wearables + labs in one product" },
];

export const MODALITIES: Option<Modality>[] = [
  { value: "in_person", label: "In-person (PSC)", hint: "Quest / LabCorp draw sites" },
  { value: "at_home", label: "At-home kit", hint: "Self-collection by mail" },
  { value: "mobile_phlebotomy", label: "Mobile phlebotomy", hint: "Phlebotomist visits the user" },
  { value: "hybrid", label: "Hybrid", hint: "Multiple modalities or labs + wearables" },
];

export const REGIONS: Option<Region>[] = [
  { value: "us", label: "US" },
  { value: "eu", label: "EU" },
];

export const PATTERNS: Option<IntegrationPattern>[] = [
  { value: "link_widget", label: "Link Widget", hint: "Hosted browser widget for cloud providers" },
  { value: "custom_link_api", label: "Custom Link API", hint: "Your own connection UI" },
  { value: "mobile_sdk", label: "Mobile SDK", hint: "iOS / Android, HealthKit / Health Connect" },
];

export const DELIVERIES: Option<Delivery>[] = [
  { value: "webhooks", label: "Webhooks", hint: "You run an HTTPS endpoint" },
  { value: "etl_pubsub", label: "ETL: Google Pub/Sub" },
  { value: "etl_rabbitmq", label: "ETL: RabbitMQ" },
  { value: "etl_eventhubs", label: "ETL: Azure Event Hubs" },
];

export const COMPLIANCES: Option<Compliance>[] = [
  { value: "hipaa", label: "HIPAA" },
  { value: "hipaa_soc2", label: "HIPAA + SOC 2" },
  { value: "hipaa_soc2_baa", label: "HIPAA + SOC 2 + signed BAA" },
];

export function buildSteps(useCase: UseCase | undefined): Step[] {
  const steps: Step[] = [
    { key: "use_case", question: "What is the use case?", options: USE_CASES },
  ];
  if (useCase === "labs" || useCase === "both") {
    steps.push({ key: "modality", question: "Which lab modality?", options: MODALITIES });
  }
  steps.push({ key: "region", question: "Which region?", options: REGIONS });
  if (useCase !== "labs") {
    steps.push({ key: "integration_pattern", question: "How will users connect?", options: PATTERNS });
  }
  steps.push({ key: "delivery", question: "How do you want events delivered?", options: DELIVERIES });
  steps.push({ key: "compliance", question: "What is the compliance posture?", options: COMPLIANCES });
  return steps;
}

export function pickLeaf(taxonomy: Taxonomy, inputs: CoachInputs): TaxonomyLeaf {
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

export function fillInputs(partial: Partial<CoachInputs>): CoachInputs {
  return {
    use_case: partial.use_case ?? "wearables",
    modality: partial.modality ?? "na",
    region: partial.region ?? "us",
    integration_pattern: partial.integration_pattern ?? "link_widget",
    delivery: partial.delivery ?? "webhooks",
    compliance: partial.compliance ?? "hipaa",
  };
}

export function buildCoachOutput(inputs: CoachInputs, taxonomy: Taxonomy): CoachOutput {
  const leaf = pickLeaf(taxonomy, inputs);
  return {
    leafId: leaf.id,
    apiSurface: leaf.api_surface,
    apiSurfaceNote: leaf.api_surface_note,
    recommendedSdk: leaf.recommended_sdk,
    mermaid: leaf.mermaid_template,
    curl: leaf.curl_snippets,
    complianceChecklist: leaf.compliance_checklist,
    gotchas: leaf.gotchas,
  };
}
