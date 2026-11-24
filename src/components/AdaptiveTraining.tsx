import { useMemo, useState } from "react";
import { CheckCircle2, Target, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildAdaptivePrompt, getPriorityWeaknesses, recordTrainingResult } from "@/lib/adaptive-learning";
import { calcAccuracy } from "@/lib/typing";

export function AdaptiveTraining({ onComplete }: { onComplete: () => void }) {
 const [weaknesses] = useState(() => getPriorityWeaknesses(4));
 const patterns = useMemo(
  () => [...new Set(weaknesses.map(item => item.pattern))],
  [weaknesses],
 );
 const target = useMemo(() => buildAdaptivePrompt(patterns, 18), [patterns]);
 const [typed,setTyped] = useState("");
 const [keystrokes,setKeystrokes] = useState({ total: 0, correct: 0 });
 const [finished,setFinished] = useState(false);
 const accuracy = calcAccuracy(keystrokes.correct, keystrokes.total);
 const done = typed.length >= target.length;
 const passed = done && accuracy >= 90;

 const handleChange = (value: string) => {
  const nextValue = value.slice(0, target.length);
  let prefix = 0;
  while (prefix < typed.length && prefix < nextValue.length && typed[prefix] === nextValue[prefix]) prefix++;

  let suffix = 0;
  while (
   suffix < typed.length - prefix &&
   suffix < nextValue.length - prefix &&
   typed[typed.length - 1 - suffix] === nextValue[nextValue.length - 1 - suffix]
  ) suffix++;

  const inserted = nextValue.slice(prefix, nextValue.length - suffix);
  if (inserted.length > 0) {
   let correct = 0;
   for (let index = 0; index < inserted.length; index++) {
    if (inserted[index]?.toLowerCase() === target[prefix + index]?.toLowerCase()) correct++;
   }
   setKeystrokes(current => ({
    total: current.total + inserted.length,
    correct: current.correct + correct,
   }));
  }
  setTyped(nextValue);
 };

 const finish = () => {
  recordTrainingResult(patterns, accuracy, passed);
  setFinished(true);
 };

 const retry = () => {
  setTyped("");
  setKeystrokes({ total: 0, correct: 0 });
  setFinished(false);
 };

 return <section className="mx-auto w-full max-w-2xl rounded-2xl border bg-card p-6 shadow-lg">
  <div className="flex items-center gap-3">
   <span className="rounded-xl bg-primary/10 p-3 text-primary"><Target className="h-6 w-6"/></span>
   <div>
    <p className="text-xs font-bold uppercase tracking-wider text-primary">Personalised correction</p>
    <h2 className="text-2xl font-extrabold">Let’s strengthen your weak keys</h2>
   </div>
   <Button type="button" variant="ghost" size="sm" className="ml-auto shrink-0" onClick={onComplete}>Skip for now</Button>
  </div>
  <p className="mt-3 text-sm text-muted-foreground">
   Your recent practice shows repeated difficulty with: <b>{patterns.map(pattern => pattern.toUpperCase()).join(", ")}</b>.
   This short drill gives those patterns extra practice.
  </p>
  {!finished ? <>
   <div className="mt-5 rounded-xl border bg-muted/40 p-4 font-mono text-lg leading-8 tracking-wide">{target}</div>
   <textarea
    autoFocus
    autoCapitalize="off"
    autoCorrect="off"
    value={typed}
    onChange={event => handleChange(event.target.value)}
    disabled={done}
    spellCheck={false}
    onPaste={event => event.preventDefault()}
    onDrop={event => event.preventDefault()}
    className="mt-4 min-h-28 w-full rounded-xl border bg-background p-4 font-mono text-base"
    placeholder="Type the practice text above…"
   />
   <div className="mt-3 flex items-center justify-between text-sm">
    <span>{typed.length}/{target.length} characters</span>
    <b>{accuracy}% accuracy</b>
   </div>
   <p className="mt-2 text-xs text-muted-foreground">
    Accuracy counts every character attempt. If you correct a mistake with Backspace, the earlier incorrect attempt still counts, just as it does in the typing test.
   </p>
   {done && <div className="mt-4"><Button onClick={finish}>Check my training</Button></div>}
  </> : <div className="mt-6 rounded-xl border p-5 text-center">
   <CheckCircle2 className="mx-auto h-10 w-10 text-primary"/>
   <h3 className="mt-2 text-xl font-bold">{passed ? "Training passed!" : "Not quite — one more try"}</h3>
   <p className="mt-1 text-sm text-muted-foreground">
    Your accuracy: {accuracy}%. {passed ? "Your weakness profile has been updated." : "You need at least 90% accuracy to pass."}
   </p>
   <div className="mt-4 flex justify-center gap-2">
    {!passed && <Button variant="outline" onClick={retry}><RotateCcw className="mr-2 h-4 w-4"/>Try again</Button>}
    <Button onClick={onComplete} disabled={!passed}>{passed ? "Return to activity" : "Continue"}</Button>
   </div>
  </div>}
 </section>;
}
