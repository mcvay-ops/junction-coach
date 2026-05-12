import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://junction-coach.vercel.app";
const description =
  "Solutions Engineering artifact for Junction: Question Bank, Integration Coach, and SE Playbook for the top 25 pre-sales technical questions, sourced from docs.junction.com and the Junction handbook.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "junction-coach",
    template: "%s | junction-coach",
  },
  description,
  openGraph: {
    title: "junction-coach",
    description,
    url: siteUrl,
    siteName: "junction-coach",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "junction-coach",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-ink-200 dark:border-ink-800">
          <div className="container-page flex items-center justify-between py-4 md:py-5">
            <Link href="/" className="text-base font-semibold tracking-tight">
              junction<span className="text-accent">-coach</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link href="/questions" className="rounded-md px-3 py-1.5 text-ink-700 hover:text-accent dark:text-ink-200">
                Questions
              </Link>
              <Link href="/coach" className="rounded-md px-3 py-1.5 text-ink-700 hover:text-accent dark:text-ink-200">
                Coach
              </Link>
              <Link href="/playbook" className="rounded-md px-3 py-1.5 text-ink-700 hover:text-accent dark:text-ink-200">
                Playbook
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-12 border-t border-ink-200 py-6 text-center text-xs text-ink-500 dark:border-ink-800">
          <div className="container-page">
            Built by Jordan McVay as an SE artifact. Sourced from docs.junction.com and the Junction handbook. No PHI, no live API calls.
          </div>
        </footer>
      </body>
    </html>
  );
}
