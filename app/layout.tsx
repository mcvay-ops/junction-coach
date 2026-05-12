import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://junction-coach.vercel.app";
const title = "junction-coach. Built to keep Product off external technical calls.";
const description =
  "A Solutions Engineering artifact for Junction. Three surfaces (Question Bank, Integration Coach, SE Playbook) sourced from docs.junction.com and the team handbook.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | junction-coach",
  },
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "junction-coach",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
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
          <div className="container-page flex flex-col items-center gap-1">
            <p>Built by Jordan McVay. Sandbox only. No PHI. No live API calls.</p>
            <p className="flex flex-wrap items-center justify-center gap-x-2">
              <a
                href="https://linkedin.com/in/jordan-mcvay"
                className="hover:text-accent"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="https://github.com/mcvay-ops"
                className="hover:text-accent"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <span aria-hidden="true">·</span>
              <a href="mailto:mcvay.jordan@gmail.com" className="hover:text-accent">
                mcvay.jordan@gmail.com
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
