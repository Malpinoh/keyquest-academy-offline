import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Activity, ArrowLeft, BookOpen, CalendarDays, RotateCcw, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bestWpm, resetProgress, sessionsToday, setDailyGoal, useProgress } from "@/lib/progress";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/progress")({
  head: () => {
    const seo = pageHead({
      title: "Typing Practice Progress Dashboard",
      description: "Review your personal typing speed, accuracy, completed lessons and daily practice goal. Progress is stored locally on your device.",
      path: "/progress",
    });
    return {
      ...seo,
      meta: [...seo.meta, { name: "robots", content: "noindex,nofollow" }],
    };
  },
  component: ProgressPage,
});

function ProgressPage() {
  const { progress, persistent } = useProgress();
  const [resetOk, setResetOk] = useState(true);
  const [goal, setGoal] = useState<number | null>(null);
  const data = progress;
  const dailyGoal = goal ?? data?.dailyGoalSessions ?? 3;
  const today = useMemo(() => data ? sessionsToday(data) : 0, [data]);
  const best = data ? bestWpm(data, "test") : 0;
  const tests = data?.sessions.filter((s) => s.kind === "test") ?? [];
  const averageAccuracy = tests.length ? Math.round(tests.reduce((sum, s) => sum + s.accuracy, 0) / tests.length) : 0;
  const latest = data?.sessions.slice().reverse().slice(0, 8) ?? [];

  const changeGoal = (value: number) => {
    setGoal(value);
    setDailyGoal(value);
  };

  const clear = () => {
    if (window.confirm("Reset all KeyQuest progress saved in this browser? This cannot be undone.")) {
      setResetOk(resetProgress());
      setGoal(null);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-primary">Your learning space</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Your Progress</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">A private snapshot of your practice on this device. Every number below comes from your saved sessions, not sample data.</p>
        </div>
        <Button variant="outline" onClick={clear}><RotateCcw className="mr-2 h-4 w-4" />Reset progress</Button>
      </div>

      {latest[0] && <div className="mt-6 border-y py-4"><h2 className="font-bold">Latest result</h2><p className="mt-2 text-muted-foreground">{latest[0].label} · {latest[0].wpm} WPM · {latest[0].accuracy}% accuracy · {latest[0].errors} errors</p></div>}
      {!resetOk && <p role="status" className="mt-4 text-destructive">Progress was reset for this visit, but browser storage could not be updated.</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={<Trophy className="h-5 w-5" />} label="Personal best" value={data ? `${best} WPM` : "—"} note="Best completed typing test" />
        <Metric icon={<Target className="h-5 w-5" />} label="Average accuracy" value={tests.length ? `${averageAccuracy}%` : "—"} note={tests.length ? `Across ${tests.length} test${tests.length === 1 ? "" : "s"}` : "Take a test to begin"} />
        <Metric icon={<BookOpen className="h-5 w-5" />} label="Lessons completed" value={String(data?.lessonsCompleted.length ?? 0)} note="Unique lessons finished" />
        <Metric icon={<Activity className="h-5 w-5" />} label="Practice sessions" value={String(data?.sessions.length ?? 0)} note="Tests, lessons and games" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-7">
          <div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-3 text-primary"><CalendarDays className="h-5 w-5" /></div><div><h2 className="text-xl font-bold">Today's practice goal</h2><p className="text-sm text-muted-foreground">Build a routine that feels manageable.</p></div></div>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div><p className="text-4xl font-extrabold tabular-nums">{Math.min(today, dailyGoal)}<span className="text-xl text-muted-foreground"> / {dailyGoal}</span></p><p className="mt-1 text-sm text-muted-foreground">sessions completed today</p></div>
            <span className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{today >= dailyGoal ? "Goal reached" : `${dailyGoal - today} to go`}</span>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(100, (today / dailyGoal) * 100)}%` }} /></div>
          <label htmlFor="daily-goal" className="mt-6 block text-sm font-semibold">Daily session target</label>
          <select id="daily-goal" value={dailyGoal} onChange={(e) => changeGoal(Number(e.target.value))} className="mt-2 w-full rounded-lg border bg-background px-3 py-2">
            {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n} value={n}>{n} session{n === 1 ? "" : "s"} per day</option>)}
          </select>
          <p className="mt-3 text-xs text-muted-foreground">A session can be a typing test, a lesson or a game. Rest days are okay too.</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-card sm:p-7">
          <h2 className="text-xl font-bold">Recent activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your latest saved practice sessions.</p>
          {latest.length ? (
            <ul className="mt-5 divide-y">
              {latest.map((session) => (
                <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
                  <div><p className="font-semibold">{session.label}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(session.date).toLocaleString()} · {session.kind}</p></div>
                  <div className="text-right"><p className="font-bold tabular-nums">{session.wpm > 0 ? `${session.wpm} WPM` : `${session.accuracy}%`}</p><p className="text-xs text-muted-foreground">{session.accuracy}% accuracy</p></div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed p-7 text-center">
              <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-3 font-bold">Your story starts here</h3>
              <p className="mt-2 text-sm text-muted-foreground">Complete a lesson or typing test and your real results will appear here.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2"><Button asChild><Link to="/learn">Start a lesson</Link></Button><Button asChild variant="outline"><Link to="/typing-test">Take a test</Link></Button></div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
        {persistent ? "Privacy note: your progress is stored in this browser on this device. It is not synced to an account or uploaded to a server." : "Browser storage is unavailable. Progress may be held temporarily in memory and could disappear when you leave or reload this page."}
      </div>
    </section>
  );
}

function Metric({ icon, label, value, note }: { icon: ReactNode; label: string; value: string; note: string }) {
  return <div className="rounded-2xl border bg-card p-5 shadow-card"><div className="flex items-center justify-between gap-2"><p className="text-sm text-muted-foreground">{label}</p><span className="text-primary">{icon}</span></div><p className="mt-3 text-3xl font-extrabold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>;
}
