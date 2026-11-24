import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getGuide } from "@/content/guides";
import { pageHead } from "@/lib/site";

const GUIDE_PRACTICE_LESSONS: Record<string, { id: string; label: string }> = {
  "touch-typing-basics": { id: "home-row-basics", label: "Practise the home row" },
  "finger-placement": { id: "home-row-basics", label: "Practise finger placement" },
  "wpm-and-accuracy": { id: "timed-challenges", label: "Try a timed challenge" },
  "accuracy-before-speed": { id: "accuracy-training", label: "Practise accuracy" },
  "daily-practice-routine": { id: "mixed-rows", label: "Start a guided practice session" },
  "fix-common-typing-mistakes": { id: "accuracy-training", label: "Practise accuracy" },
  "typing-practice-for-school-and-work": { id: "professional-typing", label: "Practise professional typing" },
  "choose-and-check-keyboard-layout": { id: "mixed-rows", label: "Practise the keyboard rows" },
  "why-typing-speed-gets-stuck": { id: "timed-challenges", label: "Run a focused timed challenge" },
};
export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => { const g = getGuide(params.slug); if (!g) throw notFound(); return g; },
  head: ({ loaderData, params }) => loaderData ? pageHead({ title: loaderData.title, description: loaderData.description, path: `/resources/${params.slug}`, type: "article" }) : { meta: [{ title: "Guide not found" }, { name: "robots", content: "noindex" }] },
  component: Guide,
});
function Guide() {
  const g = Route.useLoaderData();
  const practice = GUIDE_PRACTICE_LESSONS[g.slug] ?? { id: "home-row-basics", label: "Start with the home row" };
  return (
    <article className="prose-kq mx-auto max-w-3xl px-4 py-12">
      <Link to="/resources">← All guides</Link>
      <h1 className="mt-4 text-4xl font-bold">{g.title}</h1>
      <p className="text-muted-foreground">{g.readMinutes} min read · Updated {g.updated}</p>
      {g.body.map((b, i) => b.type === "h2" ? <h2 key={i}>{b.text}</h2> : b.type === "h3" ? <h3 key={i}>{b.text}</h3> : b.type === "ul" ? <ul key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ul> : b.type === "ol" ? <ol key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ol> : b.type === "example" ? <div key={i} className="my-4 rounded-xl border bg-muted/50 p-4"><strong>{b.title}</strong><p>{b.text}</p></div> : b.type === "linkedP" ? <p key={i}>{b.before}<Link to="/resources/$slug" params={{ slug: b.slug }}>{b.label}</Link>{b.after}</p> : <p key={i}>{b.text}</p>)}
      <section className="my-8 rounded-2xl border bg-muted/40 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">KeyQuest practice task</p>
        <h2 className="mt-2 text-xl font-bold">{g.practiceTask.title}</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {g.practiceTask.instructions.map((step, index) => <li key={index}>{step}</li>)}
        </ol>
        <p className="mt-4 text-sm"><strong>Check your result:</strong> {g.practiceTask.successCheck}</p>
      </section>
      <section className="mt-8 border-t pt-5"><h2>Put it into practice</h2><p><Link to="/learn" search={{ lesson: practice.id }}>{practice.label}</Link> · <Link to="/typing-test">Take a typing speed test</Link> · <Link to="/lessons">Browse all guided lessons</Link></p><h2>Related guides</h2><ul>{g.related.map(slug => { const related = getGuide(slug); return related ? <li key={slug}><Link to="/resources/$slug" params={{ slug }}>{related.title}</Link></li> : null; })}</ul></section>
    </article>
  );
}
