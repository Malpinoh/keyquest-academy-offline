import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookOpen, Clock3, Search } from "lucide-react";
import { pageHead } from "@/lib/site";
import { GUIDES } from "@/content/guides";

export const Route = createFileRoute("/resources/")({
  head: () => pageHead({
    title: "Typing Resource Center: Guides and Practice Advice",
    description: "Practical, original guides to touch typing, finger placement, WPM, accuracy, and building a daily practice routine.",
    path: "/resources",
  }),
  component: ResourceCenter,
});

function ResourceCenter() {
  const [query, setQuery] = useState("");
  const guides = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GUIDES;
    return GUIDES.filter((guide) => [guide.title, guide.description, guide.shortTitle, ...guide.body.flatMap((block) => block.type === "ul" || block.type === "ol" ? block.items : "text" in block ? [block.text] : [])].join(" ").toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">Learn a skill for life</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Typing Resource Center</h1>
        <p className="mt-4 text-lg text-muted-foreground">Clear, practical guidance to help you build comfortable finger placement, improve accuracy and develop a practice routine that lasts.</p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <label htmlFor="guide-search" className="mb-2 block text-sm font-semibold">Find a guide</label>
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input id="guide-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search typing, accuracy, finger placement…" className="w-full rounded-xl border bg-background py-3 pl-10 pr-4 outline-none focus-visible:ring-2 focus-visible:ring-ring" /></div>
        <p aria-live="polite" className="mt-2 text-xs text-muted-foreground">Showing {guides.length} of {GUIDES.length} practical guides.</p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl rounded-2xl border bg-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Choose a guide for the problem you are solving</h2>
        <p className="mt-2 text-muted-foreground">Use the guides alongside the interactive course. Read the explanation, try the matching exercise, then return to the guide when a particular typing problem appears in your practice.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="font-semibold">Learning the basics</p>
            <p className="mt-1 text-sm text-muted-foreground">Start with touch typing basics and finger placement if you are still learning where the keys belong.</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="font-semibold">Improving results</p>
            <p className="mt-1 text-sm text-muted-foreground">Use the WPM, accuracy and mistake guides when your test results show a specific problem.</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="font-semibold">Building a habit</p>
            <p className="mt-1 text-sm text-muted-foreground">Use the daily routine and school/work practice guides to turn keyboard drills into useful writing practice.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, index) => (
          <article key={guide.slug} className="group flex flex-col rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 sm:p-6">
            <div className="flex items-center justify-between gap-3"><span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"><BookOpen className="h-3.5 w-3.5" /> Guide {String(index + 1).padStart(2, "0")}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{guide.readMinutes} min</span></div>
            <h2 className="mt-5 text-xl font-bold leading-snug"><Link to="/resources/$slug" params={{ slug: guide.slug }} className="hover:text-primary hover:underline">{guide.title}</Link></h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
            <div className="mt-5 border-t pt-4"><Link to="/resources/$slug" params={{ slug: guide.slug }} className="text-sm font-semibold text-primary hover:underline">Read guide <span aria-hidden="true">→</span></Link></div>
          </article>
        ))}
      </div>

      {guides.length === 0 && <div className="mt-8 rounded-2xl border border-dashed p-10 text-center"><h2 className="text-xl font-bold">No guides found</h2><p className="mt-2 text-muted-foreground">Try a different search term, such as “home row” or “accuracy”.</p></div>}

      <div className="mt-12 rounded-2xl bg-muted/50 p-6 sm:p-8">
        <h2 className="text-2xl font-bold">Put the advice into practice</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">Reading is a useful start, but typing improves through focused repetition. Begin with the home row lesson, then use a short test to create your baseline.</p>
        <div className="mt-5 flex flex-wrap gap-3"><Link to="/learn" className="inline-flex rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:opacity-90">Start the beginner lesson</Link><Link to="/typing-test" className="inline-flex rounded-lg border bg-background px-4 py-2.5 font-semibold hover:bg-muted">Take a typing test</Link></div>
      </div>
    </section>
  );
}
