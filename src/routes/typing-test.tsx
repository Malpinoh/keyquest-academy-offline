import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowLeft, Award, Clock3, Gauge, RotateCcw, Target, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextDisplay } from "@/components/typing/TextDisplay";
import { GuidedKeyboardStudio } from "@/components/typing/GuidedKeyboardStudio";
import { ClassroomArtwork, FingerGuideArtwork } from "@/components/home/ClassroomArtwork";
import { buildTestText } from "@/lib/passages";
import { addSession, bestWpm, loadProgress } from "@/lib/progress";
import { applyTypingInput, TEST_DURATIONS, calcAccuracy, calcWpm, countCorrect } from "@/lib/typing";
import { pageHead } from "@/lib/site";
import { recordTypingMistake } from "@/lib/adaptive-learning";
import { OfflineBonusOffer } from "@/components/OfflineBonusOffer";
import { DesktopPracticeNotice } from "@/components/site/DesktopPracticeNotice";

export const Route = createFileRoute("/typing-test")({
  head: () => pageHead({
    title: "Free Typing Speed Test",
    description: "Measure your typing speed and accuracy with a guided, timed typing test. Your results stay on this device.",
    path: "/typing-test",
  }),
  component: TypingTestPage,
});

type TestStatus = "ready" | "running" | "finished";

function TypingTestPage() {
  const [duration, setDuration] = useState(60);
  const [passageKey, setPassageKey] = useState(0);
  const [target, setTarget] = useState(() => buildTestText(60, 0.42));
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<TestStatus>("ready");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [keystrokes, setKeystrokes] = useState({ total: 0, correct: 0 });
  const [saved, setSaved] = useState(false);
  const [bestBefore, setBestBefore] = useState(0);
  const [persistent, setPersistent] = useState(true);
  const [bonusPractice, setBonusPractice] = useState(false);
  const [bonusPracticeUnlocked, setBonusPracticeUnlocked] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typedRef = useRef("");
  const keyStatsRef = useRef({ total: 0, correct: 0 });
  const startedAtRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  const finishTest = useCallback((finalElapsed?: number) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const elapsed = Math.max(1, Math.min(finalElapsed ?? (startedAtRef.current ? Date.now() - startedAtRef.current : 1), duration * 1000));
    setElapsedMs(elapsed);
    setStatus("finished");
    const { correct } = countCorrect(target, typedRef.current);
    const keys = keyStatsRef.current;
    const ok = !bonusPractice && keys.total > 0 ? addSession({
      kind: "test",
      label: `${duration}-second typing test`,
      wpm: calcWpm(correct, elapsed),
      accuracy: calcAccuracy(keys.correct, keys.total),
      errors: keys.total - keys.correct,
      durationSec: Math.max(1, Math.round(elapsed / 1000)),
    }) : true;
    setPersistent(ok);
    setSaved(!bonusPractice && keys.total > 0);
  }, [duration, target, bonusPractice]);

  useEffect(() => {
    if (status !== "running") return;
    const interval = window.setInterval(() => {
      const started = startedAtRef.current;
      if (started === null) return;
      const elapsed = Date.now() - started;
      setElapsedMs(Math.min(elapsed, duration * 1000));
      if (elapsed >= duration * 1000) finishTest(duration * 1000);
    }, 100);
    return () => window.clearInterval(interval);
  }, [status, duration, finishTest]);

  const startTest = () => {
    if (status === "running") return;
    startedAtRef.current = Date.now();
    finishedRef.current = false;
    typedRef.current = "";
    keyStatsRef.current = { total: 0, correct: 0 };
    setTyped("");
    setKeystrokes({ total: 0, correct: 0 });
    setElapsedMs(0);
    setSaved(false);
    setBestBefore(bestWpm(loadProgress(), "test"));
    setStatus("running");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const resetTest = (newDuration = duration) => {
    setTarget(buildTestText(newDuration, Math.random() + passageKey / 1000));
    setDuration(newDuration);
    setPassageKey((k) => k + 1);
    typedRef.current = "";
    keyStatsRef.current = { total: 0, correct: 0 };
    startedAtRef.current = null;
    finishedRef.current = false;
    setTyped("");
    setKeystrokes({ total: 0, correct: 0 });
    setElapsedMs(0);
    setSaved(false);
    setBonusPractice(false);
    setBonusPracticeUnlocked(false);
    setStatus("ready");
  };

  const startBonusPractice = () => {
    if (!bonusPracticeUnlocked || status === "running") return;
    const nextTarget = buildTestText(30, Math.random() + (passageKey + 1) / 1000);
    setTarget(nextTarget);
    setDuration(30);
    setPassageKey((key) => key + 1);
    typedRef.current = "";
    keyStatsRef.current = { total: 0, correct: 0 };
    startedAtRef.current = null;
    finishedRef.current = false;
    setTyped("");
    setKeystrokes({ total: 0, correct: 0 });
    setElapsedMs(0);
    setSaved(false);
    setBonusPractice(true);
    setBonusPracticeUnlocked(false);
    setStatus("ready");
  };

  const handleChange = (value: string) => {
    if (status !== "running" || finishedRef.current) return;
    const started = startedAtRef.current;
    if (started === null) return;
    if (Date.now() - started >= duration * 1000) { finishTest(duration * 1000); return; }
    const result = applyTypingInput(target, typedRef.current, value, keyStatsRef.current);
    for (let i = typedRef.current.length; i < result.typed.length; i++) {
      const expected = target[i];
      const actual = result.typed[i];
      if (expected && actual && expected !== actual) recordTypingMistake(expected, actual, "test");
    }
    typedRef.current = result.typed;
    keyStatsRef.current = result.keys;
    setTyped(result.typed);
    setKeystrokes(result.keys);
    setElapsedMs(Math.min(Date.now() - started, duration * 1000));
    if (result.typed.length >= target.length) finishTest();
  };

  const elapsed = status === "finished" || status === "running" ? elapsedMs : 0;
  const { correct: correctChars, incorrect: incorrectChars } = useMemo(() => countCorrect(target, typed), [target, typed]);
  const wpm = calcWpm(correctChars, elapsed);
  const rawWpm = calcWpm(typed.length, elapsed);
  const adjustedWpm = elapsed > 0 ? Math.max(0, Math.round(((correctChars - incorrectChars) / 5) / (elapsed / 60000))) : 0;
  const accuracy = calcAccuracy(keystrokes.correct, keystrokes.total);
  const remaining = Math.max(0, Math.ceil(duration - elapsed / 1000));
  const nextKey = target[typed.length] ?? null;
  const progress = Math.min(100, (typed.length / target.length) * 100);
  const isRunning = status === "running";

  return (
    <main id="main" className="h-full min-h-0 overflow-hidden bg-[#e9e5cf] px-2 py-2 text-[#303b30] dark:bg-[#202b23] dark:text-[#f1eedc] sm:px-3 sm:py-3">
      <DesktopPracticeNotice />
      <div className="mx-auto flex h-full min-h-0 max-w-[1700px] flex-col">
        <header className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b-2 border-[#a49b7a] pb-2 dark:border-[#596b54]">
          <div className="flex min-w-0 items-center gap-3">
            <a href="/" aria-label="Back to KeyQuest home" title="Back to home" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border-2 border-[#a49b7a] bg-[#f8f5e6] text-[#354132] shadow-[0_2px_0_#b6ad8e] transition hover:-translate-y-px hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#788b5c] dark:border-[#596b54] dark:bg-[#29372c] dark:text-[#f1eedc] dark:hover:bg-[#354634]">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div className="min-w-0">
            <p className="font-mono text-[10px] font-black uppercase tracking-[.2em] text-[#78805d] dark:text-[#d3c77d]">KeyQuest Academy · Classroom assessment</p>
            <h1 className="mt-1 font-display text-2xl font-black leading-tight sm:text-3xl">Typing speed test</h1>
            <p className="mt-1 text-xs text-[#66705b] dark:text-[#c6cebd]">Set your time, follow your instructor, and measure your progress.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-md border border-[#aaa080] bg-[#f8f5e6] p-1 shadow-inner dark:border-[#596b54] dark:bg-[#29372c]">
              {TEST_DURATIONS.map((seconds) => (
                <button key={seconds} type="button" disabled={isRunning} onClick={() => resetTest(seconds)} className={`rounded px-2.5 py-1.5 text-xs font-extrabold transition sm:px-3 ${duration === seconds ? "bg-[#e4cd70] text-[#283126] shadow-[0_1px_3px_rgba(0,0,0,.2)]" : "text-[#59634d] hover:bg-[#e9e4d1] dark:text-[#d6ddce] dark:hover:bg-[#354634]"} disabled:cursor-not-allowed disabled:opacity-50`}>{seconds}s</button>
              ))}
            </div>
            <Button type="button" size="sm" variant="outline" disabled={isRunning} onClick={() => resetTest()} className="h-9 rounded-md border-[#8e927c] bg-[#f8f5e6] text-[#354132] hover:bg-white dark:border-[#596b54] dark:bg-[#29372c] dark:text-[#f1eedc]"><RotateCcw className="mr-1.5 h-3.5 w-3.5"/>New passage</Button>
            {status !== "running" ? (
              <Button type="button" size="sm" onClick={startTest} className="h-9 rounded-md border border-[#927d3d] bg-[#e4cd70] font-extrabold text-[#283126] shadow-[0_2px_0_#9c8844] hover:bg-[#f0dc8a]">{status === "finished" ? "Try again" : "Start test"} <Zap className="ml-1.5 h-3.5 w-3.5"/></Button>
            ) : (
              <Button type="button" size="sm" onClick={() => finishTest()} className="h-9 rounded-md bg-[#304333] font-bold text-white hover:bg-[#405943]">Finish test</Button>
            )}
          </div>
        </header>

        <section className="grid shrink-0 grid-cols-4 gap-1.5 sm:gap-2" aria-label="Live typing statistics">
          <Metric icon={<Clock3 className="h-4 w-4"/>} label="Time remaining" value={remaining} suffix="sec" alert={isRunning && remaining <= 10}/>
          <Metric icon={<Gauge className="h-4 w-4"/>} label="Typing speed" value={wpm} suffix="WPM"/>
          <Metric icon={<Target className="h-4 w-4"/>} label="Accuracy" value={accuracy} suffix="%"/>
          <Metric icon={<Activity className="h-4 w-4"/>} label="Passage progress" value={Math.round(progress)} suffix="%"/>
        </section>

        <div className="mt-2 grid min-h-0 flex-1 grid-cols-[minmax(0,1.08fr)_minmax(0,.92fr)] items-stretch gap-2 overflow-hidden lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)]">
          <section className="flex min-h-0 flex-col overflow-hidden rounded-lg border-2 border-[#a49b7a] bg-[#f7f3e3] shadow-[0_3px_0_#b6ad8e,0_12px_28px_-22px_rgba(0,0,0,.5)] dark:border-[#596b54] dark:bg-[#29372c]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#b6ad8e] bg-[#ded8bd] px-4 py-3 dark:border-[#596b54] dark:bg-[#354634]">
              <div><p className="text-[10px] font-black uppercase tracking-[.17em] text-[#78805d] dark:text-[#d8ca7c]">Typing exercise · {duration} seconds</p><h2 className="font-display text-base font-black text-[#3e4c39] dark:text-[#f0ebd5]">Copy the passage below</h2></div>
              <span className="rounded border border-[#b9b08f] bg-[#fffbea] px-2.5 py-1 font-mono text-[11px] font-bold text-[#59634d] dark:border-[#596b54] dark:bg-[#1e2b22] dark:text-[#e8d783]">{typed.length.toLocaleString()} / {target.length.toLocaleString()} characters</span>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3">
              <div className="relative min-h-0 flex-1 overflow-hidden rounded-md border border-[#c6bea0] bg-[#fffdf2] p-2 shadow-inner dark:border-[#596b54] dark:bg-[#202d24] sm:p-3">
                <div className="mb-2 flex items-center justify-between text-[9px] font-extrabold uppercase tracking-[.14em] text-[#879071] dark:text-[#aeb99c]"><span>Passage window</span><span>{isRunning ? "Follow the cursor" : status === "finished" ? "Exercise complete" : "Ready when you are"}</span></div>
                <TextDisplay target={target} typed={typed} focused={isRunning} className="max-h-full overflow-hidden font-serif text-[12px] leading-[1.55] sm:text-[15px] sm:leading-[1.65] lg:text-[17px]"/>
                {status === "ready" && <div className="absolute inset-x-3 bottom-3 rounded bg-[#e9e5cf]/95 px-3 py-2 text-center text-[11px] font-semibold text-[#68705b] dark:bg-[#29372c]/95 dark:text-[#c6cebd]">Press <b>Start test</b> when you are comfortably positioned.</div>}
              </div>

              <label htmlFor="typing-input" className="mt-3 flex items-center justify-between gap-2 text-xs font-black text-[#46543e] dark:text-[#e8d783]"><span>Your typing area</span><span className="font-normal text-[#78805d] dark:text-[#b8c2ad]">{isRunning ? "The timer is running" : "Input unlocks when you start"}</span></label>
              <textarea id="typing-input" ref={inputRef} value={typed} onChange={(e) => handleChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault(); }} onPaste={(e) => e.preventDefault()} onDrop={(e) => e.preventDefault()} autoComplete="off" disabled={!isRunning} placeholder={isRunning ? "Begin typing the passage here…" : status === "finished" ? "Your test is complete. Start another round to continue." : "Start the test to activate this typing area…"} spellCheck={false} autoCapitalize="off" autoCorrect="off" className="mt-1 min-h-[88px] w-full resize-y rounded-md border-2 border-[#aaa080] bg-[#fffdf2] p-3 font-mono text-sm leading-6 text-[#303b30] outline-none transition placeholder:text-[#9a987f] focus:border-[#788b5c] focus:ring-2 focus:ring-[#788b5c]/20 disabled:cursor-not-allowed disabled:bg-[#ebe7d6] disabled:opacity-80 dark:border-[#596b54] dark:bg-[#202d24] dark:text-[#f1eedc] dark:disabled:bg-[#263329] sm:min-h-[62px]"/>
              <div className="mt-1 h-1.5 shrink-0 overflow-hidden rounded-full border border-[#b9b08f] bg-[#e2ddc8] dark:border-[#596b54] dark:bg-[#1e2b22]" role="progressbar" aria-label="Typing passage progress" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><div className="h-full bg-[#788b5c] transition-[width] duration-150" style={{width:`${progress}%`}}/></div>
              <div className="mt-1 flex shrink-0 flex-wrap justify-between gap-1 text-[10px] font-semibold text-[#68705b] dark:text-[#c6cebd]"><span>{correctChars} correct characters · {incorrectChars} incorrect characters</span><span>{keystrokes.total} keystrokes counted</span></div>
              {status === "finished" && <div className="mt-3 rounded-md border border-[#87976d] bg-[#e8ecd9] p-3 dark:border-[#596b54] dark:bg-[#26382b]" role="status"><div className="flex items-center gap-2 font-display text-sm font-black text-[#40553b] dark:text-[#e8d783]"><Trophy className="h-4 w-4"/> {bonusPractice ? "Bonus practice complete" : wpm > bestBefore && wpm > 0 ? "New personal best!" : "Test completed"}</div><p className="mt-1 text-xs text-[#59634d] dark:text-[#c6cebd]">{bonusPractice ? "This bonus round is practice only and does not change your saved test history." : saved ? (persistent ? "Your result has been saved on this device." : "Browser storage is unavailable, so this result is temporary.") : "No typing was recorded, so no session was saved."} {!bonusPractice && bestBefore > 0 ? `Previous best: ${bestBefore} WPM.` : ""}</p><div className="mt-2 grid grid-cols-3 gap-2 text-center"><div><b className="block text-lg">{wpm}</b><span className="text-[9px] uppercase">WPM</span></div><div><b className="block text-lg">{accuracy}%</b><span className="text-[9px] uppercase">Accuracy</span></div><div><b className="block text-lg">{keystrokes.total-keystrokes.correct}</b><span className="text-[9px] uppercase">Errors</span></div></div>{!bonusPractice && !bonusPracticeUnlocked && <OfflineBonusOffer rewardDescription="Unlock a separate 30-second bonus practice round. It will not change your saved typing-test score." onReward={() => setBonusPracticeUnlocked(true)}/>}{bonusPracticeUnlocked && <Button type="button" className="mt-3 w-full bg-[#304333] text-white hover:bg-[#405943]" onClick={startBonusPractice}>Start 30-second bonus practice</Button>}</div>}
            </div>
          </section>

          <aside className="grid min-h-0 min-w-0 grid-rows-[auto_auto_minmax(0,1fr)] gap-2 overflow-hidden">
            <div className="min-h-0 overflow-hidden rounded-lg border-2 border-[#a49b7a] bg-[#f7f3e3] shadow-[0_3px_0_#b6ad8e] dark:border-[#596b54] dark:bg-[#29372c]">
              <div className="flex items-center gap-3 border-b border-[#b6ad8e] bg-[#ded8bd] px-3 py-2 dark:border-[#596b54] dark:bg-[#354634]"><Award className="h-4 w-4 text-[#788b5c] dark:text-[#e5d27c]"/><div><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#78805d] dark:text-[#d8ca7c]">Your instructor</p><h2 className="font-display text-sm font-black text-[#3e4c39] dark:text-[#f0ebd5]">KeyQuest coach</h2></div></div>
              <div className="grid grid-cols-[72px_1fr] items-center gap-2 p-2">
                <ClassroomArtwork className="h-[70px] rounded border border-[#b6ad8e] dark:border-[#596b54]"/>
                <div><p className="font-display text-sm font-black text-[#40553b] dark:text-[#e8d783]">Let’s practise together!</p><p className="mt-1 text-[11px] leading-5 text-[#68705b] dark:text-[#c6cebd]">Keep your wrists relaxed, eyes on the passage, and let accuracy lead your speed.</p><p className="mt-2 text-[9px] font-extrabold uppercase tracking-wider text-[#78805d] dark:text-[#d8ca7c]">{isRunning ? "Keep a steady rhythm" : "Ready to begin"}</p></div>
              </div>
            </div>

            <div className="min-h-0 overflow-hidden rounded-lg border-2 border-[#a49b7a] bg-[#f7f3e3] p-2 shadow-[0_3px_0_#b6ad8e] dark:border-[#596b54] dark:bg-[#29372c]">
              <div className="flex items-center justify-between gap-2"><div><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#78805d] dark:text-[#d8ca7c]">Live performance</p><h2 className="font-display text-sm font-black text-[#3e4c39] dark:text-[#f0ebd5]">Speed & accuracy</h2></div><div className="relative grid h-[76px] w-[76px] shrink-0 place-items-center rounded-full" style={{background:`conic-gradient(#788b5c ${Math.min(100,accuracy)}%, #d5d0b9 0)`}}><div className="grid h-[60px] w-[60px] place-items-center rounded-full bg-[#f7f3e3] dark:bg-[#29372c]"><span className="text-center"><b className="block font-mono text-lg leading-5">{wpm}</b><span className="text-[8px] font-black uppercase tracking-wider">WPM</span></span></div></div></div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <MiniMetric label="Adjusted speed" value={adjustedWpm+" WPM"}/>
                <MiniMetric label="Raw speed" value={rawWpm+" WPM"}/>
                <MiniMetric label="Correct keys" value={keystrokes.correct}/>
                <MiniMetric label="Errors" value={keystrokes.total-keystrokes.correct}/>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-[#c6bea0] pt-2 text-[10px] font-bold text-[#68705b] dark:border-[#596b54] dark:text-[#c6cebd]"><span>Accuracy meter</span><span>{accuracy}%</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#ded9c0] dark:bg-[#1e2b22]"><div className="h-full rounded-full bg-[#788b5c] transition-all" style={{width:`${accuracy}%`}}/></div>
            </div>

            <div className="min-h-0 overflow-hidden rounded-lg border-2 border-[#a49b7a] bg-[#f7f3e3] p-2 shadow-[0_3px_0_#b6ad8e] dark:border-[#596b54] dark:bg-[#29372c]">
              <div className="mb-2 flex items-center justify-between gap-2"><div><p className="text-[9px] font-black uppercase tracking-[.16em] text-[#78805d] dark:text-[#d8ca7c]">Finger placement</p><h2 className="font-display text-sm font-black text-[#3e4c39] dark:text-[#f0ebd5]">Hands & keyboard guide</h2></div><span className="rounded bg-[#e9e5cf] px-2 py-1 text-[9px] font-extrabold text-[#65705a] dark:bg-[#202d24] dark:text-[#d8ca7c]">{nextKey ? "Next: "+(nextKey === " " ? "SPACE" : nextKey.toUpperCase()) : "Home row"}</span></div>
              <div className="grid min-h-0 grid-cols-[.55fr_1.45fr] items-center gap-1 border-b border-[#c6bea0] pb-1 dark:border-[#596b54]">
                <FingerGuideArtwork className="min-w-0"/>
                <div className="min-w-0"><p className="mb-1 text-center text-[9px] font-bold text-[#68705b] dark:text-[#c6cebd]">Colour-coded finger zones · highlighted key follows the passage</p><GuidedKeyboardStudio next={isRunning ? nextKey : null} className="[&>div:first-child]:!rounded-md [&>div:first-child]:!p-1 [&>div:first-child>div:first-child]:!mb-1 [&>div:first-child>div:nth-child(2)]:!p-0.5 [&>div:first-child>div:nth-child(2)>div]:!space-y-0.5 [&>div:first-child>div:nth-child(2)>div>div]:!gap-0.5 [&>div:nth-child(2)]:!mt-1 [&>div:nth-child(2)]:!text-[8px] [&>p]:!mt-1 [&>p]:!text-[9px]"/></div>
              </div>
              <p className="mt-2 text-[10px] leading-4 text-[#68705b] dark:text-[#c6cebd]">Rest your left fingers on A–S–D–F and right fingers on J–K–L–;. Use the matching finger for each highlighted key.</p>
            </div>
          </aside>
        </div>

        
      </div>

      <section className="mx-auto mt-4 max-w-[1700px] shrink-0 rounded-lg border-2 border-[#a49b7a] bg-[#f7f3e3] p-4 text-[#46543e] dark:border-[#596b54] dark:bg-[#29372c] dark:text-[#d8dfd2] sm:p-5">
        <div className="grid gap-5 lg:grid-cols-3">
          <div><h2 className="font-display text-base font-black">What your WPM means</h2><p className="mt-2 text-xs leading-5 text-[#68705b] dark:text-[#c6cebd]">Words per minute is a speed estimate based on the number of correctly typed characters. Use it to compare your own practice sessions, rather than treating one score as a measure of your overall typing ability.</p></div>
          <div><h2 className="font-display text-base font-black">Why accuracy matters</h2><p className="mt-2 text-xs leading-5 text-[#68705b] dark:text-[#c6cebd]">A higher WPM is useful only when you can produce text accurately. If errors keep appearing, slow down, use the intended fingers and practise the patterns that cause mistakes before trying to increase speed.</p></div>
          <div><h2 className="font-display text-base font-black">How to improve your result</h2><p className="mt-2 text-xs leading-5 text-[#68705b] dark:text-[#c6cebd]">Take the test regularly, but do not make testing your only practice. Use <a href="/lessons" className="font-bold underline underline-offset-2">KeyQuest lessons</a> to build technique, repeat difficult exercises, then return here to check whether your accuracy and speed improve.</p></div>
        </div>
      </section>
    </main>
  );
}

function Metric({icon,label,value,suffix,alert=false}:{icon:React.ReactNode;label:string;value:string|number;suffix:string;alert?:boolean}) {
  return <div className={`flex items-center gap-2 rounded-md border-2 px-3 py-2 shadow-[0_2px_0_rgba(110,105,77,.22)] ${alert ? "border-[#b94e3b] bg-[#f5e1d9] text-[#9d3528] dark:bg-[#442d28]" : "border-[#a49b7a] bg-[#f7f3e3] text-[#3e4c39] dark:border-[#596b54] dark:bg-[#29372c] dark:text-[#f1eedc]"}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-[#c6bea0] bg-[#e9e5cf] text-[#657b4c] dark:border-[#596b54] dark:bg-[#202d24] dark:text-[#e5d27c]">{icon}</span><div className="min-w-0"><p className="truncate text-[9px] font-black uppercase tracking-[.12em] opacity-70">{label}</p><p className="font-mono text-xl font-black leading-6 tabular-nums">{value}<span className="ml-1 text-[9px] font-bold">{suffix}</span></p></div></div>;
}

function MiniMetric({label,value}:{label:string;value:string|number}) {
  return <div className="rounded border border-[#c6bea0] bg-[#fffbea] px-2 py-1.5 dark:border-[#596b54] dark:bg-[#202d24]"><p className="text-[8px] font-bold uppercase tracking-wider text-[#78805d] dark:text-[#b8c2ad]">{label}</p><p className="mt-0.5 font-mono text-sm font-black text-[#3e4c39] dark:text-[#f1eedc]">{value}</p></div>;
}
