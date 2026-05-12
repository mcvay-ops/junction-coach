import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type {
  Question,
  PlaybookEntry,
  Taxonomy,
  TaxonomyLeaf,
  CoachInputs,
  CoachOutput,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

function loadYaml<T>(file: string): T {
  const full = path.join(CONTENT_DIR, file);
  const raw = fs.readFileSync(full, "utf8");
  const parsed = yaml.load(raw);
  if (parsed === null || parsed === undefined) {
    throw new Error(`Content file ${file} is empty`);
  }
  return parsed as T;
}

let _questions: Question[] | null = null;
let _playbook: PlaybookEntry[] | null = null;
let _taxonomy: Taxonomy | null = null;

export function getQuestions(): Question[] {
  if (_questions) return _questions;
  const data = loadYaml<{ questions: Question[] }>("questions.yaml");
  _questions = data.questions;
  return _questions;
}

export function getQuestionById(id: string): Question | undefined {
  return getQuestions().find((q) => q.id === id);
}

export function getPlaybook(): PlaybookEntry[] {
  if (_playbook) return _playbook;
  const data = loadYaml<{ entries: PlaybookEntry[] }>("playbook.yaml");
  _playbook = data.entries;
  return _playbook;
}

export function getPlaybookEntry(id: string): PlaybookEntry | undefined {
  return getPlaybook().find((p) => p.id === id);
}

export function getTaxonomy(): Taxonomy {
  if (_taxonomy) return _taxonomy;
  _taxonomy = loadYaml<Taxonomy>("taxonomy.yaml");
  return _taxonomy;
}

function leafScore(leaf: TaxonomyLeaf, inputs: CoachInputs): number {
  let score = 0;
  let total = 0;
  (Object.keys(leaf.match) as (keyof CoachInputs)[]).forEach((k) => {
    total += 1;
    if (leaf.match[k] === inputs[k]) score += 1;
  });
  // weight by match-ratio so partial-match leaves still win over no-match
  return total === 0 ? 0 : score / total + score * 0.001;
}

export function pickLeaf(inputs: CoachInputs): TaxonomyLeaf {
  const tax = getTaxonomy();
  let best: TaxonomyLeaf | null = null;
  let bestScore = -1;
  for (const leaf of tax.leaves) {
    const s = leafScore(leaf, inputs);
    if (s > bestScore) {
      bestScore = s;
      best = leaf;
    }
  }
  if (!best) {
    throw new Error("No taxonomy leaves defined");
  }
  return best;
}

export function buildOutput(inputs: CoachInputs): CoachOutput {
  const leaf = pickLeaf(inputs);
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
