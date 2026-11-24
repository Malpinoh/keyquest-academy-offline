import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, BookOpen, Gauge, Gamepad2, ShieldCheck } from "lucide-react";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title: "About KeyQuest Academy", description: "Learn about KeyQuest Academy's approach to practical, accessible touch-typing education.", path: "/about" }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <p className="font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary">About the academy</p>
      <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Typing is a skill you can build.</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">KeyQuest Academy is a browser-based learning project built to help people become more comfortable and accurate at a keyboard. It combines guided practice, honest feedback and useful explanations in one lightweight place.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Value icon={<BookOpen className="h-5 w-5" />} title="Learn with purpose" text="Begin with finger placement and build up through repeatable exercises. Lessons explain what to practice and why." />
        <Value icon={<Gauge className="h-5 w-5" />} title="Understand your results" text="Typing tests report speed and accuracy using a stated scoring method. Your own trend matters more than a single score." />
        <Value icon={<Gamepad2 className="h-5 w-5" />} title="Make practice engaging" text="Short game rounds add variety, while structured lessons remain the foundation for learning good technique." />
        <Value icon={<ShieldCheck className="h-5 w-5" />} title="Start without an account" text="Phase 1 practice works in your browser. Saved progress stays in this browser's local storage and is not synced to a profile." />
      </div>
      <section className="mt-10 rounded-2xl border bg-muted/30 p-6 sm:p-8">
        <p className="font-mono text-xs font-extrabold uppercase tracking-[.18em] text-primary">How KeyQuest fits together</p>
        <h2 className="mt-2 text-2xl font-bold">Learn, practise, measure, then adjust.</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">KeyQuest is organised around a simple learning loop. The lessons introduce a technique or keyboard pattern, the practice activities give you repeated attempts, and the typing test lets you check whether the skill holds up during continuous timed text. If a pattern keeps causing mistakes, the guides and practice activities give you a place to work on that specific weakness rather than simply chasing a higher score.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card p-4"><h3 className="font-bold">1. Learn</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Understand finger placement, key movement, punctuation and the reason behind each exercise.</p></div>
          <div className="rounded-xl border bg-card p-4"><h3 className="font-bold">2. Practise</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Repeat guided exercises or use the typing games to build consistency without needing an account.</p></div>
          <div className="rounded-xl border bg-card p-4"><h3 className="font-bold">3. Measure</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Use timed tests to compare speed and accuracy over time, then return to practice when the results reveal a weakness.</p></div>
        </div>
      </section>

      <h2 className="mt-10 text-2xl font-bold">Our learning approach</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">We encourage learners to develop accuracy and comfortable technique before chasing speed. There is no guaranteed WPM improvement or fixed timeline: results depend on your starting point, keyboard, practice habits and consistency.</p>
      <p className="mt-3 leading-relaxed text-muted-foreground">KeyQuest Academy is an independent project. It is not affiliated with or endorsed by Mavis Beacon or other typing software providers. Lessons and guides are written for this project and are intended for general education.</p>
      <div className="mt-8 flex flex-wrap gap-3"><Link to="/learn" className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground">Start a lesson</Link><Link to="/resources" className="rounded-lg border px-4 py-2.5 font-semibold hover:bg-muted">Explore the guides</Link></div>
    </article>
  );
}

function Value({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <section className="rounded-2xl border bg-card p-5"><span className="inline-flex rounded-lg bg-primary/10 p-3 text-primary">{icon}</span><h2 className="mt-4 text-lg font-bold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p></section>;
}
