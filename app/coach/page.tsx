import { CoachWizard } from "@/components/CoachWizard";
import { getTaxonomy } from "@/lib/content";

export const metadata = {
  title: "Integration Coach — junction-coach",
  description:
    "Guided wizard that turns prospect inputs into a tailored Junction integration architecture, curl snippets, SDK pick, and compliance checklist.",
};

export default function CoachPage() {
  const taxonomy = getTaxonomy();
  return (
    <div className="container-page">
      <header className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          Integration Coach
        </p>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Replace the architecture call.
        </h1>
        <p className="max-w-2xl text-sm text-ink-600 dark:text-ink-300">
          Six questions. One tailored output: architecture diagram, curl snippets, recommended SDK, compliance checklist, and gotchas — drawn from the same taxonomy I would walk a prospect through on a call.
        </p>
      </header>
      <CoachWizard taxonomy={taxonomy} />
    </div>
  );
}
