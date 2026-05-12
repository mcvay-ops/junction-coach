import { QuestionList } from "@/components/QuestionList";
import { getQuestions } from "@/lib/content";

export const metadata = {
  title: "Question Bank — junction-coach",
  description:
    "25 of the most common Junction pre-sales technical questions answered, sourced from docs.junction.com and the Junction handbook.",
};

export default function QuestionsPage() {
  const questions = getQuestions();
  return (
    <div className="container-page">
      <header className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          Question Bank
        </p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">
          The questions Product no longer takes.
        </h1>
        <p className="max-w-2xl text-sm text-ink-600 dark:text-ink-300">
          25 entries, every answer linked to a source on docs.junction.com or the Junction handbook. Filter by topic, search by phrase, deep-link any entry by id.
        </p>
      </header>
      <QuestionList questions={questions} />
    </div>
  );
}
