export type Topic =
  | "auth"
  | "webhooks"
  | "wearables"
  | "labs"
  | "compliance"
  | "architecture";

export const TOPIC_LABELS: Record<Topic, string> = {
  auth: "Auth",
  webhooks: "Webhooks",
  wearables: "Wearables",
  labs: "Labs",
  compliance: "Compliance",
  architecture: "Architecture",
};

export interface Question {
  id: string;
  question: string;
  topic: Topic;
  answer: string;
  sourceUrl: string;
  sourceLabel: string;
  related: string[];
}

export interface PlaybookEntry {
  id: string;
  directAnswer: string;
  qualifyWhen: string[];
  escalateWhen: {
    p0: string;
    p1: string;
    p2: string;
  };
  followUpTemplate: string;
}

export type UseCase = "wearables" | "labs" | "both";
export type Modality =
  | "in_person"
  | "at_home"
  | "mobile_phlebotomy"
  | "hybrid"
  | "na";
export type Region = "us" | "eu";
export type ApiSurface = "vital_api" | "org_management_api" | "both";
export type IntegrationPattern =
  | "link_widget"
  | "custom_link_api"
  | "mobile_sdk";
export type Delivery =
  | "webhooks"
  | "etl_pubsub"
  | "etl_rabbitmq"
  | "etl_eventhubs";
export type Compliance = "hipaa" | "hipaa_soc2" | "hipaa_soc2_baa";

export interface CoachInputs {
  use_case: UseCase;
  modality: Modality;
  region: Region;
  integration_pattern: IntegrationPattern;
  delivery: Delivery;
  compliance: Compliance;
}

export interface TaxonomyLeaf {
  id: string;
  match: Partial<CoachInputs>;
  api_surface: ApiSurface;
  api_surface_note: string;
  recommended_sdk: string;
  mermaid_template: string;
  curl_snippets: { label: string; code: string }[];
  compliance_checklist: string[];
  gotchas: string[];
}

export interface Taxonomy {
  leaves: TaxonomyLeaf[];
}

export type MatchStatus = "match" | "mismatch" | "unconstrained";

export interface MatchField {
  key: keyof CoachInputs;
  userValue: string;
  leafValue?: string;
  status: MatchStatus;
}

export interface MatchInfo {
  exact: boolean;
  fields: MatchField[];
}

export interface CoachOutput {
  leafId: string;
  apiSurface: ApiSurface;
  apiSurfaceNote: string;
  recommendedSdk: string;
  mermaid: string;
  curl: { label: string; code: string }[];
  complianceChecklist: string[];
  gotchas: string[];
  match: MatchInfo;
}
