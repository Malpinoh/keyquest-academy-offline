import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLesson, LESSONS } from "@/lib/lesson-curriculum";
import { LESSON_LEARNING_NOTES } from "@/lib/lesson-learning-notes";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/lessons/$lessonId")({
  loader: ({ params }) => {
    const lesson = getLesson(params.lessonId);
    if (!lesson || lesson.id !== params.lessonId) throw notFound();
    return lesson;
  },
  head: ({ loaderData, params }) => loaderData
    ? pageHead({
        title: `${loaderData.title} — Free ${loaderData.level} Typing Lesson`,
        description: `${loaderData.description} Practise with ${loaderData.exercises.length} guided exercises in about ${loaderData.estimatedMinutes} minutes.`,
        path: `/lessons/${params.lessonId}`,
        type: "article",
      })
    : { meta: [{ title: "Typing lesson not found" }, { name: "robots", content: "noindex" }] },
  component: LessonDetailsPage,
});

function LessonDetailsPage() {
  const lesson = Route.useLoaderData();
  const lessonIndex = LESSONS.findIndex((item) => item.id === lesson.id);
  const previousLesson = lessonIndex > 0 ? LESSONS[lessonIndex - 1] : null;
  const nextLesson = lessonIndex >= 0 && lessonIndex < LESSONS.length - 1 ? LESSONS[lessonIndex + 1] : null;
  const learningNotes = LESSON_LEARNING_NOTES[lesson.id] ?? {
    objective: lesson.description,
    keyIdeas: [],
    commonMistakes: [],
    selfCheck: "Can you explain the main skill in this lesson before moving on?",
    successCriteria: "You can complete the lesson exercise with controlled, repeatable technique.",
    transferTask: "Use the skill in a short piece of ordinary text, then review the result."
  };
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <Link to="/lessons" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> All typing lessons
      </Link>
      <header className="mt-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-primary">KeyQuest guided typing course · {lesson.level}</p>
          <p className="text-xs font-semibold text-muted-foreground">Lesson {lessonIndex + 1} of {LESSONS.length}</p>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">{lesson.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{lesson.description}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Clock3 className="h-4 w-4" /> About {lesson.estimatedMinutes} minutes</span>
          <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" /> {lesson.exercises.length} guided exercises</span>
          <span>Free · Self-paced · Repeatable</span>
        </div>
        <Button asChild size="lg" className="mt-7">
          <Link to="/learn" search={{ lesson: lesson.id }}><PlayCircle className="mr-2 h-4 w-4" /> Start this lesson <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </header>
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Learning objective</p>
          <h2 className="mt-2 text-lg font-bold">What you should be able to do</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{learningNotes.objective}</p>
          <h3 className="mt-5 text-sm font-bold">Key ideas</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            {learningNotes.keyIdeas.map((idea) => <li key={idea}>{idea}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Watch out for</p>
          <h2 className="mt-2 text-lg font-bold">Common mistakes</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            {learningNotes.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}
          </ul>
        </div>
        <div className="rounded-xl border bg-muted/40 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Quick self-check</p>
          <h2 className="mt-2 text-lg font-bold">Check your understanding</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{learningNotes.selfCheck}</p>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">Use this question to review the skill before or after completing the guided exercises.</p>
        </div>
      </section>
      <section className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Ready to move on?</p>
          <h2 className="mt-2 text-lg font-bold">What success looks like</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{learningNotes.successCriteria}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Use it beyond the drill</p>
          <h2 className="mt-2 text-lg font-bold">Try this transfer task</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{learningNotes.transferTask}</p>
        </div>
      </section>
      <section className="mt-9 grid gap-6 md:grid-cols-[1fr_280px]">
        <div>
          <h2 className="text-2xl font-bold">What you will practise</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            This {lesson.level.toLowerCase()} lesson is designed around one manageable skill at a time. Read each instruction, type the displayed practice line, and use the on-screen keyboard and finger guidance to build a consistent technique. The exercises can be repeated, so you can focus on accuracy before trying to increase your pace.
          </p>
          <div className="mt-6 space-y-4">
            {lesson.exercises.map((exercise, index) => (
              <section key={exercise.title} className="rounded-xl border bg-card p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">Exercise {index + 1}</p>
                <h3 className="mt-2 text-lg font-bold">{exercise.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{exercise.instruction}</p>
                <div className="mt-3 overflow-x-auto rounded-lg bg-muted/70 p-3">
                  <p className="text-xs font-semibold text-muted-foreground">Practice text</p>
                  <p className="mt-1 whitespace-pre-wrap break-words font-mono text-sm leading-6">{exercise.target}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
        <aside className="h-fit rounded-xl border bg-muted/40 p-5">
          <h2 className="text-lg font-bold">A useful practice approach</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>Read the instruction before typing.</li>
            <li>Use the finger assigned to each key.</li>
            <li>Keep your hands relaxed and return to a comfortable position.</li>
            <li>Correct mistakes calmly instead of rushing.</li>
            <li>Repeat the exercise when you want more practice.</li>
          </ol>
          <h3 className="mt-6 font-bold">About this course level</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {lesson.level === "Beginner" || lesson.level === "Beginner+"
              ? "Beginner lessons introduce key positions, finger movement and short patterns. Work slowly and build familiarity with the keyboard."
              : lesson.level === "Intermediate"
                ? "Intermediate lessons combine familiar keys with more demanding patterns, punctuation, numbers or everyday typing tasks. Aim for clean, repeatable keystrokes."
                : lesson.level === "Advanced"
                  ? "Advanced lessons develop longer passages, steady rhythm and deliberate accuracy. Review difficult combinations and maintain a comfortable pace."
                  : "Mastery lessons combine several typing skills in realistic or timed practice. Focus on consistent accuracy and clear text rather than a single fast result."}
          </p>
        </aside>
      </section>
      <nav aria-label="Lesson navigation" className="mt-10 border-t pt-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {previousLesson ? (
            <Link
              to="/lessons/$lessonId"
              params={{ lessonId: previousLesson.id }}
              className="rounded-xl border bg-card p-4 transition-colors hover:bg-muted/60"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Previous lesson</p>
              <p className="mt-1 font-semibold text-primary">{previousLesson.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{previousLesson.level} · {previousLesson.estimatedMinutes} min</p>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link
              to="/lessons/$lessonId"
              params={{ lessonId: nextLesson.id }}
              className="rounded-xl border bg-card p-4 text-right transition-colors hover:bg-muted/60"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next lesson</p>
              <p className="mt-1 font-semibold text-primary">{nextLesson.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{nextLesson.level} · {nextLesson.estimatedMinutes} min</p>
            </Link>
          ) : <div />}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/lessons" className="text-sm font-semibold text-primary hover:underline">Browse the full curriculum</Link>
          <Button asChild><Link to="/learn" search={{ lesson: lesson.id }}>Practise now <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </nav>
    </article>
  );
}
