import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Clock3, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LESSONS, LESSON_LEVELS } from "@/lib/lesson-curriculum";
import { useEffect, useState } from "react";
import { loadLastLesson, useProgress } from "@/lib/progress";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/lessons")({
  head: () => pageHead({
    title: "Free Typing Lessons",
    description: "Follow a free, structured touch-typing course from home-row basics to professional typing, with short guided lessons and saved progress.",
    path: "/lessons",
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const { progress } = useProgress();
  const [lastId, setLastId] = useState<string | null>(null);
  useEffect(() => setLastId(loadLastLesson()), []);
  const completed = new Set(progress?.lessonsCompleted ?? []);
  const lastLesson = [...(progress?.sessions ?? [])].reverse().find((session) => session.kind === "lesson");
  const resumeId = lastId ?? (lastLesson ? LESSONS.find((lesson) => lesson.title === lastLesson.label)?.id : undefined);
  const resumeLesson = LESSONS.find((lesson) => lesson.id === resumeId) ?? LESSONS.find((lesson) => !completed.has(lesson.id)) ?? LESSONS[0]!;
  const completedCount = LESSONS.filter((lesson) => completed.has(lesson.id)).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="max-w-3xl">
        <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your typing classroom</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">A lesson for every step.</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">Learn touch typing in short, focused sessions. Start with the home row, build confidence across the keyboard, then develop speed and accuracy. Every lesson is free and can be repeated whenever you need it.</p>
      </header>

      <section className="mt-8 flex flex-col justify-between gap-5 rounded-2xl bg-[#263c4c] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-bright">Pick up where you left off</p>
          <h2 className="mt-2 text-2xl font-extrabold">{resumeLesson.title}</h2>
          <p className="mt-2 text-sm text-slate-200">{completedCount} of {LESSONS.length} lessons completed · {resumeLesson.estimatedMinutes} minute lesson</p>
        </div>
        <Button asChild size="lg" className="shrink-0 bg-cyan-bright font-bold text-[#2a3035] hover:bg-cyan-bright/80">
          <Link to="/learn" search={{ lesson: resumeLesson.id }}><PlayCircle className="mr-2 h-4 w-4" />{completed.has(resumeLesson.id) ? "Practise again" : "Continue learning"}</Link>
        </Button>
      </section>

      <div className="mt-8 flex items-center justify-between gap-3">
        <div><h2 className="text-xl font-bold">Course curriculum</h2><p className="mt-1 text-sm text-muted-foreground">Five stages · {LESSONS.length} guided lessons</p></div>
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">{completedCount}/{LESSONS.length} done</span>
      </div>

      <div className="mt-6 space-y-8">
        {LESSON_LEVELS.map((level, levelIndex) => {
          const items = LESSONS.filter((lesson) => lesson.level === level);
          return (
            <section key={level}>
              <div className="mb-3 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">{levelIndex + 1}</span><div><h3 className="font-bold">{level}</h3><p className="text-xs text-muted-foreground">{items.length} focused lessons</p></div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map((lesson, index) => {
                  const isDone = completed.has(lesson.id);
                  return (
                    <article key={lesson.id} className="flex min-w-0 items-start gap-4 rounded-xl border bg-card p-4 shadow-sm transition hover:border-primary/40">
                      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${isDone ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="font-bold"><Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} className="hover:text-primary hover:underline">{String(index + 1).padStart(2, "0")}. {lesson.title}</Link></h4>{isDone && <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">Completed</span>}</div>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">{lesson.description}</p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{lesson.estimatedMinutes} min · {lesson.exercises.length} exercises</span><div className="flex items-center gap-2"><Link to="/lessons/$lessonId" params={{ lessonId: lesson.id }} className="text-xs font-semibold text-primary hover:underline">Details</Link><Button asChild size="sm" variant={isDone ? "outline" : "default"} className="h-8"><Link to="/learn" search={{ lesson: lesson.id }}>{isDone ? "Repeat" : "Practise"}<ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link></Button></div></div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <section className="mt-14 grid gap-8 border-t pt-12 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="font-mono text-xs font-extrabold uppercase tracking-[.18em] text-primary">How the course works</p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">A structured path from first keys to confident typing.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">KeyQuest lessons are arranged so that new movement is introduced in small steps and then transferred into words, sentences and realistic writing. You do not need to chase a particular WPM before moving forward. The aim is to build reliable keyboard control that you can use outside a typing test.</p>
          <p className="mt-3 leading-7 text-muted-foreground">Each lesson contains short exercises with instructions explaining what to focus on. Repeating a completed lesson is encouraged when a particular key, pattern or punctuation mark still feels unfamiliar.</p>
        </div>
        <div className="rounded-2xl border bg-card p-5 sm:p-6">
          <h2 className="text-lg font-bold">What you will practise</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <li><strong className="text-foreground">Keyboard control:</strong> home-row position, finger assignments and movement between rows.</li>
            <li><strong className="text-foreground">Real writing:</strong> common words, sentences, paragraphs and longer passages.</li>
            <li><strong className="text-foreground">Accuracy:</strong> capitals, punctuation, spaces, numbers and careful correction.</li>
            <li><strong className="text-foreground">Performance:</strong> timed challenges, speed building and realistic school/work typing.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border bg-muted/30 p-6 sm:p-8">
        <h2 className="text-xl font-bold">How to use these lessons effectively</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div><h3 className="font-semibold">1. Start with accuracy</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Slow down enough to use the intended finger and notice mistakes. Speed can increase after the movement becomes familiar.</p></div>
          <div><h3 className="font-semibold">2. Repeat difficult lessons</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">A completed lesson is not a one-time requirement. Repeat it when a key pattern, number, capital or punctuation mark still causes errors.</p></div>
          <div><h3 className="font-semibold">3. Check transfer</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">After practising a drill, use a typing test or ordinary sentences to see whether the skill carries over into continuous text.</p></div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 border-t pt-10 sm:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold">Do I need to be fast before starting?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">No. The course is designed for beginners as well as learners who already type but want better technique. Early lessons deliberately prioritise controlled movement and accuracy.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold">Can I repeat lessons?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Yes. There are no locked lessons or required subscriptions. Repetition is part of learning, especially when you are working on a recurring error.</p>
        </div>
      </section>
      <p className="mt-10 text-center text-sm text-muted-foreground">There are no locked lessons. Repeat completed lessons as often as you like.</p>
    </div>
  );
}
