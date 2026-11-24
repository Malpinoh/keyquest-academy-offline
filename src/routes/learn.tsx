import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";
import { FullscreenButton } from "@/components/site/FullscreenButton";
import { GuidedKeyboardStudio } from "@/components/typing/GuidedKeyboardStudio";
import { Button } from "@/components/ui/button";
import { TextDisplay } from "@/components/typing/TextDisplay";
import { fingerFor, FINGER_NAMES } from "@/components/typing/VirtualKeyboard";
import { addSession, completeLesson, saveLastLesson } from "@/lib/progress";
import { applyTypingInput, LESSON_PASS_ACCURACY, calcAccuracy, calcWpm, countCorrect } from "@/lib/typing";
import { pageHead } from "@/lib/site";
import { getLesson, nextLesson, type TypingLesson } from "@/lib/lesson-curriculum";
import { recordTypingMistake } from "@/lib/adaptive-learning";
import { DesktopPracticeNotice } from "@/components/site/DesktopPracticeNotice";

export const Route = createFileRoute("/learn")({
  validateSearch: (search: Record<string, unknown>): { lesson?: string } => {
    const parsed = z.object({ lesson: z.string().optional() }).safeParse(search);
    return parsed.success && parsed.data.lesson ? { lesson: parsed.data.lesson } : {};
  },
  head: () => {
    const head = pageHead({ title: "Interactive Typing Practice", description: "Practise touch typing with guided finger placement, a responsive keyboard and locally saved lesson progress.", path: "/learn" });
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex,follow" }] };
  },
  component: LessonPage,
});

function LessonPage() {
  const { lesson: id } = Route.useSearch();
  const lesson = getLesson(id);
  return <HomeRowLesson key={lesson.id} lesson={lesson} />;
}

function HomeRowLesson({ lesson }: { lesson: TypingLesson }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [keys, setKeys] = useState({ total: 0, correct: 0 });
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finished, setFinished] = useState(false);
  const [complete, setComplete] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fullscreenRef = useRef<HTMLElement>(null);
  const started = useRef<number | null>(null);
  const typedRef = useRef("");
  const keysRef = useRef({ total: 0, correct: 0 });
  const accumulated = useRef({ total: 0, correct: 0, chars: 0, elapsed: 0 });
  const committed = useRef(false);
  const step = lesson.exercises[stepIndex];
  useEffect(() => { saveLastLesson(lesson.id); }, [lesson.id]);
  useEffect(() => {
    if (finished || complete) return;
    const timer = window.setInterval(() => {
      if (started.current !== null) setElapsedMs(Date.now() - started.current);
    }, 100);
    return () => window.clearInterval(timer);
  }, [finished, complete]);
  if (!step) return null;
  const accuracy = calcAccuracy(keys.correct, keys.total);
  const nextChar = step.target[typed.length] ?? null;
  const needsShift = nextChar !== null && /^[A-Z]$/.test(nextChar);
  const resetStep = () => {
    started.current = null; typedRef.current = ""; keysRef.current = { total: 0, correct: 0 };
    setTyped(""); setKeys({ total: 0, correct: 0 }); setElapsedMs(0); setFinished(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };
  const change = (value: string) => {
    if (finished || complete) return;
    if (started.current === null && value.length > 0) started.current = Date.now();
    const result = applyTypingInput(step.target, typedRef.current, value, keysRef.current);
    for (let i = typedRef.current.length; i < result.typed.length; i++) {
      const expected = step.target[i], actual = result.typed[i];
      if (expected && actual && expected !== actual) recordTypingMistake(expected, actual, "lesson");
    }
    typedRef.current = result.typed; keysRef.current = result.keys;
    setTyped(result.typed); setKeys(result.keys);
    if (result.typed.length === step.target.length) {
      setElapsedMs(Math.max(1, Date.now() - (started.current ?? Date.now())));
      setFinished(true);
      window.setTimeout(() => document.getElementById("lesson-continue")?.focus(), 0);
    }
  };
  const continueLesson = () => {
    if (!finished || committed.current) return;
    if (accuracy < LESSON_PASS_ACCURACY) { resetStep(); return; }
    const sum = accumulated.current;
    sum.total += keys.total; sum.correct += keys.correct;
    sum.chars += countCorrect(step.target, typed).correct; sum.elapsed += elapsedMs;
    if (stepIndex < lesson.exercises.length - 1) { setStepIndex(i => i + 1); resetStep(); return; }
    committed.current = true;
    const lessonSaved = completeLesson(lesson.id);
    const sessionSaved = addSession({ kind: "lesson", label: lesson.title, wpm: calcWpm(sum.chars, sum.elapsed), accuracy: calcAccuracy(sum.correct, sum.total), errors: sum.total - sum.correct, durationSec: Math.round(sum.elapsed / 1000) });
    setStorageOk(lessonSaved && sessionSaved); setComplete(true);
  };
  const retry = () => {
    accumulated.current = { total: 0, correct: 0, chars: 0, elapsed: 0 }; committed.current = false;
    setComplete(false); setStepIndex(0); resetStep();
  };
  const wpm = calcWpm(countCorrect(step.target, typed).correct, elapsedMs);
  const progressPercent = Math.round(((stepIndex + (finished ? 1 : typed.length / Math.max(step.target.length, 1))) / lesson.exercises.length) * 100);
  if (complete) return <>
    <DesktopPracticeNotice />
    <section className="mx-auto max-w-3xl px-4 py-16 text-center">
    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><CheckCircle2 className="h-10 w-10" /></div>
    <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[.2em] text-primary" role="status">Lesson complete</p>
    <h1 className="mt-3 text-3xl font-extrabold">Excellent work. You did it!</h1>
    <p className="mt-3 text-muted-foreground">You completed {lesson.title}.</p>
    <div className="mx-auto mt-7 grid max-w-xl grid-cols-3 gap-3">{[[calcWpm(accumulated.current.chars, accumulated.current.elapsed)+"","WPM"],[calcAccuracy(accumulated.current.correct, accumulated.current.total)+"%","Accuracy"],[(accumulated.current.total-accumulated.current.correct)+"","Errors"]].map(([value,label])=><div key={label} className="rounded-xl border bg-card p-4"><p className="text-2xl font-extrabold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{label}</p></div>)}</div>
    <p className="mt-4 text-sm text-muted-foreground">{storageOk ? "Your completion and practice session were saved on this device." : "Browser storage is unavailable. Your completion is temporary and may disappear after reloading."}</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3"><Button onClick={retry}><RotateCcw className="mr-2 h-4 w-4" />Repeat lesson</Button><Button asChild variant="outline"><Link to="/learn" search={{ lesson: nextLesson(lesson.id).id }}>Next lesson</Link></Button><Button asChild variant="ghost"><Link to="/lessons">All lessons</Link></Button><Button asChild variant="ghost"><Link to="/progress">View progress</Link></Button></div>
  </section>
  </>;
  return <>
    <DesktopPracticeNotice />
    <main ref={fullscreenRef} className="desktop-practice-surface kq-lesson-shell min-h-screen bg-[#dfe1cf] text-[#293329] dark:bg-[#17231b] dark:text-[#edf0df]">
    <div className="kq-lesson-frame mx-auto flex w-full max-w-[1720px] flex-col gap-2 px-2 py-2 lg:h-[calc(100svh-4.5rem)] lg:min-h-[650px] lg:overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-md border border-[#68745b] bg-[#303b31] px-3 py-2 text-[#f2efd9] shadow-[0_3px_0_#202a22]">
        <div className="flex min-w-0 items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="h-8 text-[#f2efd9] hover:bg-white/10 hover:text-white"><Link to="/lessons"><ArrowLeft className="mr-1.5 h-4 w-4" />Lessons</Link></Button>
          <span className="hidden h-6 w-px bg-white/20 sm:block" />
          <div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#e8d77d]">KeyQuest typing classroom</p><p className="truncate text-[11px] text-[#d2d9c9]">{lesson.level} · {lesson.title} · Exercise {stepIndex + 1} of {lesson.exercises.length}</p></div>
        </div>
        <div className="flex items-center gap-2"><span className="hidden rounded-sm border border-[#839276] bg-[#43513e] px-2 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-[#e5ebd9] sm:inline-flex">Practice session</span><FullscreenButton targetRef={fullscreenRef} /><Button variant="outline" size="sm" onClick={retry} className="h-8 border-[#89947d] bg-[#e7e4d1] text-xs text-[#30392d] hover:bg-white"><RotateCcw className="mr-1.5 h-3.5 w-3.5" />Restart</Button></div>
      </header>

      <section className="kq-classic-panel flex min-h-0 flex-1 flex-col overflow-hidden border-[#858a70] bg-[#f3efd9] dark:border-[#596b52] dark:bg-[#28362b]">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#b8b69a] bg-[#e2dfc6] px-3 py-2 dark:border-[#596b52] dark:bg-[#354432]">
          <div className="min-w-0"><p className="text-[9px] font-black uppercase tracking-[.18em] text-[#64734d] dark:text-[#e0d27b]">Lesson instructions</p><h1 className="truncate text-lg font-extrabold text-[#303a2e] dark:text-[#f2efd9]">{lesson.title}</h1></div>
          <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-[#67705a] dark:text-[#cbd5bf]">Classic typing lesson</span>
        </div>

        <div className="kq-lesson-columns grid min-h-0 flex-1 gap-2 p-2 xl:grid-cols-[minmax(180px,220px)_minmax(0,1fr)_minmax(180px,220px)]">
          <aside className="kq-lesson-left flex min-h-0 flex-col gap-2">
            <div className="kq-classic-panel shrink-0 overflow-hidden border-[#8d9278] bg-[#e8e2c9] p-2 dark:border-[#596b52] dark:bg-[#263429]">
              <div className="mb-1 flex items-center justify-between"><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#5d6b4b] dark:text-[#d7ca79]">Your instructor</p><span className="text-[8px] font-bold uppercase text-[#68745b] dark:text-[#d7ca79]">KeyQuest coach</span></div>
              <div className="grid grid-cols-[72px_1fr] items-center gap-2"><CoachIllustration /><div><p className="text-xs font-extrabold text-[#354130] dark:text-[#f2efd9]">Let’s practise together!</p><p className="mt-1 text-[10px] leading-4 text-[#626a54] dark:text-[#cbd5bf]">Watch the highlighted key and use the matching finger.</p></div></div>
            </div>
            {showGuide && <div className="kq-classic-panel min-h-0 flex-1 overflow-y-auto border-[#a6a88e] bg-[#f7f2d9] p-2 dark:border-[#5b6b54] dark:bg-[#2a382b]">
              <div className="mb-1"><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#65734f] dark:text-[#dfd17c]">Separate finger guide</p><h2 className="text-xs font-extrabold">Finger positions</h2></div>
              <FingerPlacementGuide active={nextChar ? fingerFor(nextChar) : null} />
            </div>}
            <button onClick={() => setShowGuide(v => !v)} className="shrink-0 rounded border border-[#8d967b] bg-[#f7f3df] px-2 py-1.5 text-[10px] font-bold text-[#3d4938] hover:bg-white dark:border-[#687a5e] dark:bg-[#26342a] dark:text-[#f0efd9]" aria-expanded={showGuide}>{showGuide ? "Hide finger guide" : "Show finger guide"}</button>
          </aside>

          <section className="flex min-h-0 min-w-0 flex-col gap-2">
            <div className="kq-inset-panel min-h-0 flex-1 overflow-y-auto border-[#c4bd91] bg-[#fff9d9] p-3 dark:border-[#677252] dark:bg-[#1d2a20]">
              <p className="text-[9px] font-black uppercase tracking-[.16em] text-[#6c754d] dark:text-[#d7ca79]">Read the instruction, then type the line below</p>
              <h2 className="mt-1 text-base font-extrabold text-[#303a2e] dark:text-[#f3efd9]">{step.title}</h2>
              <p className="mt-1 text-xs leading-5 text-[#555a42] dark:text-[#d6dccb]">{step.instruction}</p>
              <div className="mt-3 border-t border-[#ded6a7] pt-3 dark:border-[#4d5c45]"><TextDisplay target={step.target} typed={typed} focused={!finished} className="min-h-14 font-mono text-lg leading-[1.9] tracking-wide text-[#30372d] dark:text-[#f3efd9] sm:text-xl" /></div>
            </div>
            <div className="shrink-0">
              <label htmlFor="lesson-input" className="block text-[9px] font-black uppercase tracking-wider text-[#505b45] dark:text-[#d5ddc9]">Typing input</label>
              <input id="lesson-input" ref={inputRef} value={typed} onChange={e => change(e.target.value)} onKeyDown={e => setCapsLockOn(e.getModifierState("CapsLock"))} onPaste={e => e.preventDefault()} onDrop={e => e.preventDefault()} disabled={finished} autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} placeholder="Click here and type the practice line…" className="mt-1 w-full rounded-md border-2 border-[#9da38a] bg-[#fffdf1] px-3 py-2 font-mono text-sm text-[#283329] outline-none transition focus:border-[#617a4c] focus:ring-4 focus:ring-[#617a4c]/15 disabled:opacity-60 dark:border-[#5e7156] dark:bg-[#17251b] dark:text-[#f3efd9]" />
              <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2"><div role="status" className="text-[10px] font-semibold text-[#58614c] dark:text-[#cbd5c1]">{finished ? accuracy >= LESSON_PASS_ACCURACY ? "Good work! Continue when ready." : "Retry and aim for " + LESSON_PASS_ACCURACY + "% accuracy." : nextChar ? <><span>Next key: {nextChar === " " ? "SPACE" : nextChar.toUpperCase()} · {FINGER_NAMES[fingerFor(nextChar) ?? "TH"]}</span>{needsShift && <span className="ml-2 inline-flex rounded border border-[#c5a94d] bg-[#fff2b8] px-2 py-0.5 font-extrabold text-[#66551c] dark:border-[#8f813f] dark:bg-[#4a4324] dark:text-[#f2df8a]">{capsLockOn ? "Caps Lock ON · type normally" : "UPPERCASE · hold SHIFT (Caps Lock off)"}</span>}</> : "Exercise complete"}</div><div className="flex gap-1.5">{finished && <Button id="lesson-continue" size="sm" onClick={continueLesson} className="h-8 rounded-md border border-[#9c8844] bg-[#dfc96f] text-xs font-extrabold text-[#283126] shadow-[0_2px_0_#9c8844] hover:bg-[#eddb8d]">{accuracy < LESSON_PASS_ACCURACY ? "Try again" : stepIndex === lesson.exercises.length - 1 ? "Finish" : "Next"}<ArrowLeft className="ml-1 h-3 w-3 rotate-180" /></Button>}<Button size="sm" variant="outline" onClick={resetStep} className="h-8 border-[#9da38a] bg-[#f5f1df] text-xs text-[#394435] hover:bg-white dark:border-[#65745c] dark:bg-[#303e32] dark:text-[#f0efd9]">Clear</Button></div></div>
            </div>
            <div className="kq-classic-panel min-w-0 shrink-0 border-[#9da18a] bg-[#d7d8c7] p-1.5 dark:border-[#5b6b54] dark:bg-[#18251c]"><GuidedKeyboardStudio next={nextChar} /></div>
          </section>

          <aside className="kq-lesson-right grid content-start grid-cols-2 gap-2 xl:grid-cols-1">
            <div className="kq-classic-panel flex flex-col items-center border-[#8d9278] bg-[#e8e2c9] p-2 dark:border-[#596b52] dark:bg-[#263429]">
              <p className="text-[9px] font-black uppercase tracking-[.16em] text-[#5d6b4b] dark:text-[#d7ca79]">Live typing speed</p>
              <div className="relative mt-1 grid h-24 w-24 place-items-center rounded-full border-[7px] border-[#65724f] bg-[conic-gradient(from_225deg,#b9b68e_0deg,#d8ca75_110deg,#b9b68e_250deg,#b9b68e_360deg)] shadow-[inset_0_2px_8px_rgba(0,0,0,.22),0_3px_0_#46533d]"><div className="grid h-[66px] w-[66px] place-items-center rounded-full border border-[#9a956d] bg-[#f7f1d2] text-center dark:border-[#77845e] dark:bg-[#243126]"><div><p className="font-mono text-2xl font-black text-[#374331] dark:text-[#f0df82]">{wpm}</p><p className="text-[8px] font-black uppercase tracking-widest text-[#65704f] dark:text-[#cdd6bc]">WPM</p></div></div></div>
            </div>
            <div className="kq-classic-panel grid grid-cols-2 gap-1.5 p-2"><Metric label="Accuracy" value={accuracy + "%"} detail="Correct keys" /><Metric label="Errors" value={String(keys.total - keys.correct)} detail="Mistyped" /><Metric label="Time" value={Math.floor(elapsedMs / 1000) + "s"} detail="Elapsed" /><Metric label="Progress" value={Math.min(100, progressPercent) + "%"} detail="Lesson" /></div>
            <div className="col-span-2 rounded-md border border-[#b9b89f] bg-[#e9e7d4] p-2 dark:border-[#53634c] dark:bg-[#202d23] xl:col-span-1">
              <div className="mb-1 flex justify-between text-[9px] font-black uppercase tracking-wider"><span>Lesson completion</span><span>{Math.min(100, progressPercent)}%</span></div><div className="h-2.5 overflow-hidden rounded-sm border border-[#9d9d8d] bg-[#f8f6e9] shadow-inner"><div className="h-full bg-gradient-to-r from-[#778e58] to-[#c1b85d] transition-all duration-300" style={{ width: Math.min(100, progressPercent) + "%" }} /></div>
              <div className="mt-2 flex flex-wrap gap-1 text-[9px] font-bold"><span className="rounded-sm border border-[#a5a28b] bg-[#f6f2df] px-2 py-1">Exercise {stepIndex + 1}/{lesson.exercises.length}</span><span className="rounded-sm border border-[#a5a28b] bg-[#f6f2df] px-2 py-1">{Math.floor(elapsedMs / 1000)} sec</span></div>
            </div>
          </aside>
        </div>
      </section>
      <footer className="shrink-0 text-center text-[9px] font-semibold text-[#5f6a51] dark:text-[#bdc9b4]">KeyQuest Academy · Practice progress is saved on this device.</footer>
    </div>
  </main>
  </>;
}

function Metric({label,value,detail}:{label:string;value:string;detail:string}) {
 return <div className="bg-white p-4 dark:bg-[#1b2a38] sm:p-5"><p className="text-[10px] font-black uppercase tracking-[.15em] text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">{value}</p><p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">{detail}</p></div>;
}

function CoachIllustration() {
  return <div className="mx-auto w-full max-w-[112px] overflow-hidden rounded-xl border border-[#9da38a] bg-[#d9d7c3] shadow-[0_3px_0_rgba(70,83,61,.35)] dark:border-[#596b52] dark:bg-[#263429]">
    <div className="grid aspect-[4/5] place-items-center bg-gradient-to-br from-[#d8d4b8] via-[#aab89b] to-[#536c57]">
      <div className="grid h-16 w-16 place-items-center rounded-full border-4 border-[#f4f0df] bg-[#405b46] text-xl font-black text-[#f4e8b4] shadow-lg">KQ</div>
      <span className="sr-only">KeyQuest learning coach illustration</span>
    </div>
  </div>;
}

function FingerPlacementGuide({active}:{active:string|null}) {
 const activeName = active && active in FINGER_NAMES ? FINGER_NAMES[active as keyof typeof FINGER_NAMES] : null;
 const colors=["#f59e0b","#fb7185","#a78bfa","#22c55e","#22c55e","#a78bfa","#fb7185","#f59e0b"];
 return <div className="grid gap-2">
  <div className="rounded-lg border border-[#d0c9a9] bg-[#fffdf0] p-2 dark:border-slate-700 dark:bg-[#172431]">
   <div className="grid grid-cols-2 gap-1">
    <div><p className="mb-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">Left hand</p><HandDiagram side="left" active={activeName} /></div>
    <div><p className="mb-3 text-center text-[10px] font-black uppercase tracking-wider text-slate-500">Right hand</p><HandDiagram side="right" active={activeName} /></div>
   </div>
   <div className="mt-2 flex flex-wrap justify-center gap-1 text-[8px] text-slate-500">{["Pinky","Ring","Middle","Index","Thumb"].map((name,i)=><span key={name} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800"><i className="h-2 w-2 rounded-full" style={{background:colors[i]}} />{name}</span>)}</div>
  </div>
  <div className="rounded-lg border border-[#d0c9a9] bg-[#fffdf0] p-2 dark:border-slate-700 dark:bg-[#172431]">
   <h3 className="font-extrabold">Home row positions</h3>
   <p className="mt-1 text-xs leading-5 text-slate-500">Rest your fingers lightly on these eight keys. Your index fingers sit on F and J.</p>
   <div className="mt-2 grid grid-cols-4 gap-1">{[{key:"A",finger:"Left pinky",color:colors[0]},{key:"S",finger:"Left ring",color:colors[1]},{key:"D",finger:"Left middle",color:colors[2]},{key:"F",finger:"Left index",color:colors[3]},{key:"J",finger:"Right index",color:colors[4]},{key:"K",finger:"Right middle",color:colors[5]},{key:"L",finger:"Right ring",color:colors[6]},{key:";",finger:"Right pinky",color:colors[7]}].map(item=><div key={item.key} className="rounded-md border p-1 text-center dark:border-slate-600"><span className="mx-auto grid h-6 w-6 place-items-center rounded-md text-xs font-black text-white" style={{background:item.color}}>{item.key}</span><p className="mt-1 text-[8px] font-semibold leading-3 text-slate-500">{item.finger}</p></div>)}</div>
   <div className="mt-4 rounded-xl bg-violet-50 p-3 dark:bg-violet-950/40"><p className="text-xs font-bold text-violet-900 dark:text-violet-100">Current finger</p><p className="mt-1 text-sm font-extrabold text-violet-700 dark:text-violet-300">{activeName ? activeName.replace("-"," ") : "Ready to begin"}</p><p className="mt-1 text-[11px] text-violet-800/70 dark:text-violet-200/70">Follow the highlighted key and use the matching finger.</p></div>
  </div>
 </div>;
}

function HandDiagram({side,active}:{side:"left"|"right";active:string|null}) {
 const isLeft=side==="left";
 const colors=["#f59e0b","#fb7185","#a78bfa","#22c55e","#38bdf8"];
 const normalizedActive=active?.toLowerCase().replace(/\s+/g,"-") ?? null;
 const selected=normalizedActive?.startsWith(isLeft?"left-":"right-") ? normalizedActive : null;
 return <svg viewBox="0 0 220 180" className="mx-auto w-full max-w-[250px]" role="img" aria-label={isLeft?"Left hand finger positions":"Right hand finger positions"}>
  <path d={isLeft?"M50 153c-10-9-13-24-8-37l18-48c3-8 12-10 17-4 2 3 2 7 1 11l-7 22 16-68c2-9 12-12 18-5 3 3 3 7 2 11l-9 59 18-72c2-9 13-11 18-3 2 3 2 7 1 11l-16 68 23-55c4-9 15-9 19-1 2 4 1 8-1 12l-27 75c-8 22-25 34-48 34H77c-11 0-20-3-27-10z":"M170 153c10-9 13-24 8-37l-18-48c-3-8-12-10-17-4-2 3-2 7-1 11l7 22-16-68c-2-9-12-12-18-5-3 3-3 7-2 11l9 59-18-72c-2-9-13-11-18-3-2 3-2 7-1 11l16 68-23-55c-4-9-15-9-19-1-2 4-1 8 1 12l27 75c8 22 25 34 48 34h8c11 0 20-3 27-10z"} fill="#f1c6a8" stroke="#b77959" strokeWidth="2"/>
  {Array.from({length:4},(_,i)=>{const x=(isLeft?69:151)+(i*(isLeft?24:-24));const y=[72,53,47,62][i];const ids=isLeft?["left-pinky","left-ring","left-middle","left-index"]:["right-pinky","right-ring","right-middle","right-index"];const on=selected===ids[i];return <g key={i}><circle cx={x} cy={y} r="9" fill={colors[i]} stroke="white" strokeWidth="2" opacity={on?1:.78}/>{on&&<circle cx={x} cy={y} r="14" fill="none" stroke={colors[i]} strokeWidth="3"/>}</g>;})}
  <circle cx={isLeft?150:70} cy="127" r="9" fill={colors[4]} stroke="white" strokeWidth="2"/>
  <text x="110" y="173" fontSize="10" fill="currentColor" textAnchor="middle" opacity=".65">{isLeft?"A · S · D · F":"J · K · L · ;"}</text>
 </svg>;
}
