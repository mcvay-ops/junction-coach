import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { Question, PlaybookEntry, Taxonomy } from "./types";

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
