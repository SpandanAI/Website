import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  useEffect(() => {
    document.title = "SpandanAI";
  }, []);

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-5 py-24 outline-none sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink">This page is not available.</h1>
      <p className="mt-4 text-base leading-[1.7] text-muted">Return to the SpandanAI homepage.</p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:border-blue-600 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 focus-visible:ring-offset-2"
      >
        Back to Home
      </Link>
    </main>
  );
}
