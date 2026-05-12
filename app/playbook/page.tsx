import { PlaybookReader } from "@/components/PlaybookReader";
import { getPlaybook, getQuestions } from "@/lib/content";

export const metadata = {
  title: "SE Playbook — junction-coach",
  description:
    "Internal SE playbook for the same 25 questions: direct answer, qualifying questions, P0/P1/P2 escalation, and follow-up template.",
};

export default function PlaybookPage() {
  const questions = getQuestions();
  const entries = getPlaybook();
  return (
    <div className="container-page">
      <header className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          SE Playbook
        </p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">
          How I run the calls that still happen.
        </h1>
        <p className="max-w-2xl text-sm text-ink-600 dark:text-ink-300">
          Direct answer first. Qualifying questions if needed. Junction's P0/P1/P2 framing on escalation. A follow-up note template I would actually send.
        </p>
      </header>
      <PlaybookReader questions={questions} entries={entries} />
    </div>
  );
}
