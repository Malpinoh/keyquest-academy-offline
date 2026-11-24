import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Rocket, RotateCcw, Sparkles, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullscreenButton } from "@/components/site/FullscreenButton";
import { addSession } from "@/lib/progress";
import { recordTypingMistake, shouldOfferTraining } from "@/lib/adaptive-learning";
import { AdaptiveTraining } from "@/components/AdaptiveTraining";
import { pageHead } from "@/lib/site";
import { SpaceFlightScene } from "@/components/games/SpaceFlightScene";
import { TypingRaceScene } from "@/components/games/TypingRaceScene";
import { KeyChallengeScene } from "@/components/games/KeyChallengeScene";
import { WordPopScene } from "@/components/games/WordPopScene";
import { OfflineBonusOffer } from "@/components/OfflineBonusOffer";
import { DesktopPracticeNotice } from "@/components/site/DesktopPracticeNotice";

export const Route = createFileRoute("/games")({
  head: () => pageHead({ title: "Free Typing Games Arcade", description: "Play four free interactive typing games to improve speed, accuracy and keyboard confidence.", path: "/games" }),
  component: GamesArcade,
});

type GameId = "space" | "racer" | "pop" | "keys";
const GAME_LIST = [
  { id: "space" as const, name: "Space Mission", detail: "Power your ship with every word", icon: Rocket },
  { id: "racer" as const, name: "Typing Racer", detail: "Race to the finish line", icon: Zap },
  { id: "pop" as const, name: "Word Pop", detail: "Pop words before time runs out", icon: Sparkles },
  { id: "keys" as const, name: "Key Challenge", detail: "Train reaction and key accuracy", icon: Timer },
];
const GAME_LEARNING_GUIDES: Record<GameId, { intro: string; objective: string; controls: string; skills: string[]; tips: string[]; scoring: string }> = {
  space: {
    intro: "Space Mission is a timed word-typing challenge set in an arcade-style space battle. Each round presents a target word. Type the complete word accurately and submit it to fire at the target while protecting your ship from incoming asteroids.",
    objective: "Destroy the required number of targets before the 60-second mission ends. Your ship has a limited number of shields, so repeated mistakes and asteroids that reach the fighter can end the run.",
    controls: "Select a difficulty, choose Start Mission, type the target shown above the input field, and press Enter or the Power up button. The input receives focus when the mission starts.",
    skills: ["Reading a word before typing it", "Accurate letter sequences and word completion", "Maintaining focus while a timer is running", "Recovering from mistakes without losing rhythm"],
    tips: ["Look at the whole target before entering the first letter.", "Use a steady pace; a clean word is more valuable than a rushed incorrect one.", "Use the feedback and remaining shields to decide when to slow down.", "Start on Easy to become familiar with the word patterns."],
    scoring: "Correct target words add points. Higher difficulty gives more base points, and consecutive correct words build a combo bonus. Incorrect words reduce your protection."
  },
  racer: {
    intro: "Typing Racer turns word practice into a 3D circuit race. Each correct letter builds your speed in real time, completing a word moves your car forward, and typing mistakes reduce momentum while rival drivers compete for the finish.",
    objective: "Reach the finish line before a rival does and before the 90-second race clock expires. The challenge rewards accurate word entry and a consistent typing rhythm.",
    controls: "Choose a difficulty and press Start race. After the countdown, type the displayed word. Correct letters increase your speed immediately; submit a complete word to advance along the circuit. Incorrect letters slow your car, and speed gradually falls when you stop typing.",
    skills: ["Typing common words without looking down", "Building speed while preserving accuracy", "Reading and entering short words quickly", "Maintaining concentration under a time limit"],
    tips: ["Keep your eyes on the displayed word rather than your hands.", "Use the same comfortable finger positions you practise in the lessons.", "Avoid guessing; a correct word advances your car.", "Try another difficulty after you can finish consistently."],
    scoring: "Each completed word adds race distance and points. Correct keystrokes build a separate speed meter, mistakes reduce speed and affect accuracy, and the first racer to reach the finish line wins."
  },
  pop: {
    intro: "Word Pop is a timed typing game in which you enter the glowing target word before the next bubble appears. Correct entries trigger a pop effect and bring a new word into the arena.",
    objective: "Build the highest score you can during the 60-second round while protecting your three lives. A wrong entry costs a life and breaks your combo.",
    controls: "Choose a difficulty and press Start. Type the highlighted target into the input field and submit it with Enter or the on-screen button. The game focuses the input when the round begins.",
    skills: ["Recognising and typing short or longer words", "Accurate spelling under time pressure", "Keeping a consistent typing rhythm", "Maintaining focus after a mistake"],
    tips: ["Read the full target before you begin.", "Prioritise correct spelling over a rushed submission.", "Build a streak of correct words to increase combo points.", "Choose Easy first if you are still learning the keyboard."],
    scoring: "Correct words award points based on difficulty. Consecutive correct entries increase the combo bonus; an incorrect word costs a life and resets the combo."
  },
  keys: {
    intro: "Key Challenge is a 3D keyboard reaction exercise. A key lights up on the virtual keyboard and you must press that exact key on your physical keyboard.",
    objective: "Survive the 45-second sequence while keeping your three lives. The target changes after a correct key press, so you must locate each new key quickly and accurately.",
    controls: "Select a difficulty and press Start challenge. Watch the glowing key in the 3D keyboard scene, then press the matching key on your physical keyboard. Mouse clicks do not count as key presses.",
    skills: ["Locating letters across different keyboard rows", "Improving key recognition and reaction time", "Using the physical keyboard without looking down", "Reducing accidental or neighbouring-key presses"],
    tips: ["Keep both hands near the home row before the round starts.", "Watch the target key carefully before pressing.", "Use Easy for home-row letters, then progress to other rows.", "If you miss, reset your focus and identify the next target before pressing."],
    scoring: "Every correct key adds points. A wrong key costs one life. The session is cleared if you survive until the timer reaches zero."
  }
};

const WORDS: Record<Difficulty, string[]> = {
  easy: ["star","moon","ship","beam","hope","blue","fast","glow","jump","kind","wave","safe","path","zoom","dust","tree","bird","calm"],
  medium: ["planet","rocket","comet","galaxy","launch","orbit","signal","cosmic","meteor","energy","travel","engine","system","bright","future","typing","garden","window"],
  hard: ["asteroid","telescope","spaceship","starlight","astronaut","gravity","satellite","universe","discovery","trajectory","navigation","atmosphere","exploration","constellation","keyboard","precision"],
};
const KEY_SETS: Record<Difficulty, string[]> = { easy: [..."asdfjkl;"], medium: [..."qwertyuiop"], hard: [..."zxcvbnm,./"] };
type Difficulty = "easy" | "medium" | "hard";
const SPACE_GOAL: Record<Difficulty, number> = { easy: 10, medium: 9, hard: 8 };
const SPACE_MAX_MISSES = 5;
const pickWord = (d: Difficulty, prev = "") => { const a = WORDS[d].filter(x => x !== prev); return a[Math.floor(Math.random()*a.length)] ?? WORDS[d][0] ?? "star"; };

function GamesArcade() {
  const [game, setGame] = useState<GameId>("space");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  return <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
     <DesktopPracticeNotice />
    <div className="mb-3"><p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-primary">KeyQuest · Arcade</p><h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Play. Practise. <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">Level up.</span></h1><p className={"mt-1 max-w-2xl text-sm text-muted-foreground "+(game==="racer"?"hidden":"")}>Four interactive games designed to build real keyboard skills, speed and accuracy.</p></div>
    <div className="mb-3 grid grid-cols-2 gap-2 lg:grid-cols-4">{GAME_LIST.map(g => { const Icon=g.icon; return <button key={g.id} onClick={()=>setGame(g.id)} className={"rounded-xl border p-2 text-left transition hover:shadow-lg "+(game===g.id?"border-primary bg-primary/5 ring-1 ring-primary":"bg-card hover:bg-muted/50")}><span className="flex items-center gap-2"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4"/></span><span><b className="block text-sm">{g.name}</b><span className="block text-[10px] text-muted-foreground">{game==="racer"?"":g.detail}</span></span></span><span className="mt-1 block text-[10px] font-bold text-primary">{game===g.id?"Selected":"Play →"}</span></button>; })}</div>
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2"><b className="text-xs">Difficulty</b><div className="flex gap-2">{(["easy","medium","hard"] as Difficulty[]).map(d=><button key={d} onClick={()=>setDifficulty(d)} className={"rounded-full px-3 py-1.5 text-[11px] font-bold capitalize "+(difficulty===d?"bg-primary text-primary-foreground":"bg-muted text-muted-foreground")}>{d}</button>)}</div></div>
    <div key={game+ difficulty}>{game==="space"&&<SpaceMission difficulty={difficulty}/>}{game==="racer"&&<TypingRacer difficulty={difficulty}/>}{game==="pop"&&<WordPop difficulty={difficulty}/>}{game==="keys"&&<KeyChallenge difficulty={difficulty}/>}</div>
    <section className="mx-auto mt-12 max-w-5xl"><h2 className="mb-5 text-2xl font-extrabold">Explore all four typing games</h2><div className="space-y-5">{GAME_LIST.map((item) => <GameLearningGuide key={item.id} game={item.id} />)}</div></section>
    <p className="mt-5 text-center text-xs text-muted-foreground">Results are saved in this browser's KeyQuest progress. No account or download required.</p>
  </div>;
}

function GameLearningGuide({game}:{game:GameId}) {
  const guide = GAME_LEARNING_GUIDES[game];
  const title = GAME_LIST.find((item) => item.id === game)?.name ?? "Typing game";
  return (
    <article className="mx-auto mt-10 max-w-5xl rounded-2xl border bg-card p-5 sm:p-8">
      <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-primary">How to play and what you will learn</p>
      <h2 className="mt-2 text-2xl font-extrabold">{title}: rules, controls and typing skills</h2>
      <p className="mt-4 leading-7 text-muted-foreground">{guide.intro}</p>
      <section className="mt-6">
        <h3 className="text-lg font-bold">Game objective</h3>
        <p className="mt-2 leading-7 text-muted-foreground">{guide.objective}</p>
      </section>
      <section className="mt-6">
        <h3 className="text-lg font-bold">How to play</h3>
        <p className="mt-2 leading-7 text-muted-foreground">{guide.controls}</p>
      </section>
      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-lg font-bold">Typing skills practised</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{guide.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
        </div>
        <div>
          <h3 className="text-lg font-bold">Practice tips</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{guide.tips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
        </div>
      </section>
      <section className="mt-6 rounded-xl bg-muted/60 p-4">
        <h3 className="font-bold">Scoring and feedback</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.scoring}</p>
      </section>
      <div className="mt-6 flex flex-wrap gap-3 border-t pt-5">
        <Link to="/lessons" className="text-sm font-semibold text-primary hover:underline">Build your skills with guided lessons</Link>
        <Link to="/typing-test" className="text-sm font-semibold text-primary hover:underline">Measure your typing speed and accuracy</Link>
      </div>
    </article>
  );
}

function Panel({children,className=""}:{children:React.ReactNode;className?:string}) { return <section className={"rounded-[2rem] border bg-card p-4 shadow-sm sm:p-6 "+className}>{children}</section>; }
function Stat({label,value}:{label:string;value:string|number}) { return <div className="rounded-xl bg-muted/70 px-3 py-3 text-center"><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-xl font-extrabold tabular-nums">{value}</p></div>; }
function recordWordMistakes(expected:string, actual:string) { for(let i=0;i<Math.max(expected.length,actual.length);i++){ if(expected[i] && actual[i] && expected[i]?.toLowerCase()!==actual[i]?.toLowerCase()) recordTypingMistake(expected[i] ?? "",actual[i] ?? "","game"); } }
function useStats() { const [score,setScore]=useState(0),[correct,setCorrect]=useState(0),[errors,setErrors]=useState(0); return {score,setScore,correct,setCorrect,errors,setErrors,accuracy:correct+errors?Math.round(correct/(correct+errors)*100):100,reset:()=>{setScore(0);setCorrect(0);setErrors(0);}}; }

function SpaceMission({difficulty}:{difficulty:Difficulty}) {
 const [offerTraining,setOfferTraining]=useState(false);
 const [rewardedExtraLife,setRewardedExtraLife]=useState(false);
 const [persistent,setPersistent]=useState(true);
 const startedAt=useRef<number | null>(null);
 const [status,setStatus]=useState<"ready"|"playing"|"finished">("ready"),[index,setIndex]=useState(0),[input,setInput]=useState(""),[time,setTime]=useState(60),[outcome,setOutcome]=useState<"won"|"lost"|null>(null);
 const [shields,setShields]=useState(SPACE_MAX_MISSES),[streak,setStreak]=useState(0),[feedback,setFeedback]=useState("");
 const goal=SPACE_GOAL[difficulty];
 const stats=useStats(), inputRef=useRef<HTMLInputElement>(null), area=useRef<HTMLElement>(null), ended=useRef(false), word=WORDS[difficulty][index%WORDS[difficulty].length] ?? "star";
 const finish=useCallback((result:"won"|"lost")=>{if(ended.current)return;ended.current=true;setOutcome(result);setPersistent(addSession({kind:"game",label:"Space Mission ("+difficulty+")",wpm:0,accuracy:stats.accuracy,errors:stats.errors,durationSec:Math.round((Date.now()-(startedAt.current??Date.now()))/1000),score:stats.score}));setStatus("finished");},[difficulty,stats.accuracy,stats.errors,stats.score]);
 useEffect(()=>{if(status!=="playing")return;if(stats.correct>=goal){finish("won");return;}if(stats.errors>=SPACE_MAX_MISSES||shields<=0){finish("lost");return;}if(time<=0){finish("lost");return;}const t=window.setInterval(()=>setTime(Math.max(0,Math.ceil(60-(Date.now()-(startedAt.current??Date.now()))/1000))),100);return()=>window.clearInterval(t);},[status,time,finish,stats.correct,stats.errors,goal,shields]);
 const start=()=>{startedAt.current=Date.now();ended.current=false;setOutcome(null);stats.reset();setIndex(0);setInput("");setTime(60);setShields(SPACE_MAX_MISSES+(rewardedExtraLife?1:0));setRewardedExtraLife(false);setStreak(0);setFeedback("SAFE LAUNCH: 15 seconds to get comfortable. Asteroid attacks begin after the grace period.");setStatus("playing");window.setTimeout(()=>inputRef.current?.focus(),0);};
 const submit=(e:FormEvent)=>{e.preventDefault();if(!input.trim()||status!=="playing"||ended.current)return;if(Date.now()-(startedAt.current??Date.now())>=60000){finish("lost");return;}if(input.trim().toLowerCase()===word){const base=difficulty==="easy"?10:difficulty==="medium"?20:30;const bonus=Math.min(streak*2,20);stats.setCorrect(n=>n+1);stats.setScore(n=>n+base+bonus);setStreak(n=>n+1);setFeedback(streak>0?"Direct hit! Combo x"+(streak+1)+" — bonus +"+bonus+" points.":"Direct hit! Target destroyed — next signal incoming.");setIndex(n=>n+1);}else {stats.setErrors(n=>n+1);setShields(n=>Math.max(0,n-1));setStreak(0);setFeedback("Missed signal! Shield lost. Check the target and try again.");recordWordMistakes(word,input.trim());}setInput("");};
 if(offerTraining)return <AdaptiveTraining onComplete={()=>setOfferTraining(false)}/>;
 return <Panel className="border-indigo-300/20 bg-[#070b20] text-white"><div className="mb-4 flex items-center justify-between"><b className="text-sm text-cyan-200"><Sparkles className="mr-2 inline h-4 w-4"/>SPACE MISSION / {difficulty.toUpperCase()}</b><FullscreenButton targetRef={area}/></div><section ref={area}><div className="relative h-[500px] overflow-hidden rounded-2xl border border-cyan-200/20 bg-[radial-gradient(ellipse_at_25%_25%,rgba(59,130,246,0.18),transparent_55%),radial-gradient(ellipse_at_80%_75%,rgba(139,92,246,0.16),transparent_55%),#030712] shadow-[0_0_45px_rgba(34,211,238,0.10)] sm:h-[580px] lg:h-[660px]"><SpaceFlightScene targetWord={word} score={stats.score} active={status==="playing"} damageCount={stats.errors} shields={shields} gameOver={status==="finished" && outcome==="lost"} onObstacleHit={()=>{if(ended.current)return;stats.setErrors(n=>n+1);setShields(n=>Math.max(0,n-1));setStreak(0);setFeedback("WARNING: Incoming asteroid bomb hit your fighter! Shield damaged.");}}/>{status!=="playing"&&<div className="absolute inset-0 flex items-center justify-center bg-slate-950/55 p-6 text-center"><div><Rocket className="mx-auto h-10 w-10 text-cyan-200"/><h2 className="mt-3 text-2xl font-extrabold">{status==="finished"?(outcome==="won"?"Mission complete!":"GAME OVER — SHIP DESTROYED"):"Ready for launch?"}</h2><p className="mt-2 text-sm text-slate-200" role="status">{status==="finished"?(outcome==="won"?`Mission cleared: ${stats.correct} targets destroyed, ${stats.accuracy}% accuracy and ${stats.score} points. ${persistent?"Result saved on this device.":"Storage unavailable; result is temporary."}`:stats.errors>=SPACE_MAX_MISSES?`HULL BREACH. All five shields are gone. You destroyed ${stats.correct} of ${goal} enemy ships. Launch again and protect your fighter.`:`TIME EXPIRED. You destroyed ${stats.correct} of ${goal} enemy ships before the sector timer reached zero.`):`Destroy ${goal} targets in 60 seconds. You have ${SPACE_MAX_MISSES} shields. Every correct word fires your ship's weapon. Incoming asteroids keep advancing and bomb your fighter if you do not destroy them in time.`}</p><p className="mt-4 font-mono text-3xl font-black tracking-widest text-cyan-200">{word.toUpperCase()}</p>{status==="finished"&&outcome==="lost"&&<OfflineBonusOffer rewardDescription="Get one extra shield on your next Space Mission attempt." onReward={()=>setRewardedExtraLife(true)}/>}<Button onClick={start} className="mt-5 bg-cyan-300 font-bold text-slate-950 hover:bg-cyan-200"><Zap className="mr-2 h-4 w-4"/>{status==="finished"?"Play again":"Start Mission"}</Button></div></div>}</div>{status==="playing"&&<form onSubmit={submit} className="mx-auto mt-4 flex max-w-xl gap-2"><label className="sr-only" htmlFor="space-word">Type the target word</label><p id="space-target" className="sr-only" aria-live="polite" data-target-word={word}>Target word: {word}</p><input id="space-word" aria-describedby="space-target" ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} autoComplete="off" autoCapitalize="off" autoCorrect="off" onPaste={e=>e.preventDefault()} onDrop={e=>e.preventDefault()} spellCheck={false} className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-mono text-lg text-white outline-none" placeholder="Type target word…"/><Button type="submit" className="bg-cyan-300 text-slate-950 hover:bg-cyan-200">Power up</Button></form>}<p aria-live="polite" className="mt-2 min-h-5 text-center text-xs font-semibold text-cyan-100">{status==="playing"?feedback:""}</p><div className="mt-4 grid grid-cols-5 gap-2"><div className="text-center"><p className="text-xs text-white/60">Score</p><b className="text-xl text-cyan-200">{stats.score}</b></div><div className="text-center"><p className="text-xs text-white/60">Accuracy</p><b className="text-xl text-cyan-200">{stats.accuracy}%</b></div><div className="text-center"><p className="text-xs text-white/60">Targets</p><b className="text-xl text-cyan-200">{stats.correct}/{goal}</b></div><div className="text-center"><p className="text-xs text-white/60">Shields</p><b className="text-xl text-cyan-200">{"◆".repeat(shields)||"0"}</b></div><div className="text-center"><p className="text-xs text-white/60">Time</p><b className="text-xl text-cyan-200">{time}s</b></div></div></section></Panel>;
}

function TypingRacer({difficulty}:{difficulty:Difficulty}) {
 const [offerTraining,setOfferTraining]=useState(false);
 const [status,setStatus]=useState<"ready"|"countdown"|"playing"|"finished">("ready");
 const [countdown,setCountdown]=useState(3);
 const [rewardedRetry,setRewardedRetry]=useState(false);
 const [word,setWord]=useState(()=>pickWord(difficulty));
 const [input,setInput]=useState("");
 const [time,setTime]=useState(90);
 const [progress,setProgress]=useState(0);
 const [rivalProgress,setRivalProgress]=useState(0);
 const [speed,setSpeed]=useState(0);
 const [errorSignal,setErrorSignal]=useState(0);
 const [keyHits,setKeyHits]=useState(0),[keyErrors,setKeyErrors]=useState(0);
 const [outcome,setOutcome]=useState<"won"|"lost"|null>(null);
 const stats=useStats(),ref=useRef<HTMLInputElement>(null),ended=useRef(false),area=useRef<HTMLElement>(null),lastKeyAt=useRef(0);
 const wordGain=difficulty==="easy"?8:difficulty==="medium"?10:12;
 const validPrefix=input.length>0&&word.toLowerCase().startsWith(input.toLowerCase());
 const liveProgress=Math.min(99.5,progress+(validPrefix?(input.length/word.length)*wordGain*0.68:0));
 const typingAccuracy=keyHits+keyErrors?Math.round(keyHits/(keyHits+keyErrors)*100):100;
 const finish=useCallback((result:"won"|"lost")=>{
   if(ended.current)return; ended.current=true; setOutcome(result);
   addSession({kind:"game",label:"Typing Racer ("+difficulty+")",wpm:Math.round(stats.correct/Math.max(1,(90-time)/60)),accuracy:typingAccuracy,errors:stats.errors,durationSec:Math.max(1,90-time),score:stats.score});
   setStatus("finished"); setOfferTraining(shouldOfferTraining());
 },[difficulty,stats.correct,stats.errors,stats.score,time,typingAccuracy]);
 useEffect(()=>{
   if(status!=="countdown")return;
   const timer=window.setTimeout(()=>{
     if(countdown<=1){setCountdown(0);setStatus("playing");window.setTimeout(()=>ref.current?.focus(),0);}
     else setCountdown(n=>n-1);
   },850);
   return()=>window.clearTimeout(timer);
 },[status,countdown]);
 useEffect(()=>{
   if(status!=="playing")return;
   const timer=window.setInterval(()=>setTime(n=>Math.max(0,n-1)),1000);
   return()=>window.clearInterval(timer);
 },[status]);
 useEffect(()=>{
   if(status!=="playing")return;
   if(progress>=100){finish("won");return;}
   if(rivalProgress>=100||time<=0)finish("lost");
 },[status,progress,rivalProgress,time,finish]);
 useEffect(()=>{
   if(status!=="playing")return;
   const timer=window.setInterval(()=>setRivalProgress(n=>Math.min(100,n+(difficulty==="easy"?0.45:difficulty==="medium"?0.58:0.70))),500);
   return()=>window.clearInterval(timer);
 },[status,difficulty]);
 useEffect(()=>{
   if(status!=="playing")return;
   const timer=window.setInterval(()=>{if(Date.now()-lastKeyAt.current>650)setSpeed(s=>Math.max(0,s-3));},250);
   return()=>window.clearInterval(timer);
 },[status]);
 const start=()=>{
   ended.current=false;stats.reset();setWord(pickWord(difficulty));setInput("");setTime(90+(rewardedRetry?10:0));setRewardedRetry(false);
   setProgress(0);setRivalProgress(0);setSpeed(0);setErrorSignal(0);setKeyHits(0);setKeyErrors(0);lastKeyAt.current=Date.now();setOutcome(null);setCountdown(3);setStatus("countdown");
 };
 const handleTyping=(value:string)=>{
   if(status!=="playing"||ended.current)return;
   if(value.length>input.length){
     const entered=value.slice(input.length);
     for(let i=0;i<entered.length;i++){
       const index=input.length+i, expected=word[index]??"";
       if(expected&&word.slice(0,index+1).toLowerCase()===value.slice(0,index+1).toLowerCase()){
         setKeyHits(n=>n+1);setSpeed(s=>Math.min(100,s+7));
       }else{
         setKeyErrors(n=>n+1);setSpeed(s=>Math.max(8,s-24));setErrorSignal(n=>n+1);stats.setErrors(n=>n+1);
         if(expected)recordTypingMistake(expected,entered[i]??"","game");
       }
     }
     lastKeyAt.current=Date.now();
   }
   setInput(value.slice(0,word.length));
 };
 const submit=(e:FormEvent)=>{
   e.preventDefault();if(!input.trim()||input.length!==word.length||status!=="playing"||ended.current)return;
   if(input.trim().toLowerCase()===word.toLowerCase()){
     stats.setCorrect(n=>n+1);stats.setScore(n=>n+100+Math.round(speed));
     setProgress(n=>Math.min(100,n+wordGain));
     setSpeed(s=>Math.min(100,s+14));
     setWord(old=>pickWord(difficulty,old));setInput("");
   }else{
     setSpeed(s=>Math.max(8,s-18));setErrorSignal(n=>n+1);
     setInput("");
   }
 };
 if(offerTraining)return <AdaptiveTraining onComplete={()=>setOfferTraining(false)}/>;
 return <section ref={area} className="w-full"><Panel className="!p-3 sm:!p-4 border-slate-700/40 bg-[#08111c] text-white">
   <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-orange-300">KeyQuest Grand Prix</p><h2 className="mt-0.5 text-xl font-black">Typing Racer</h2><p className="hidden text-xs text-slate-300 sm:block">Every correct keystroke builds speed. Mistakes cost momentum.</p></div><div className="flex items-center gap-3"><FullscreenButton targetRef={area}/><div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-right"><p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Race clock</p><p className="font-mono text-xl font-black text-amber-300">{time}s</p></div></div></div>
   <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
     <TypingRaceScene progress={liveProgress} rivalProgress={rivalProgress} speed={speed} errorSignal={errorSignal} active={status==="playing"}/>
     <div className="pointer-events-none absolute right-3 top-3 z-10 rounded-lg bg-slate-950/75 px-3 py-2 text-right"><p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Race position</p><p className="text-xl font-black text-white">{liveProgress>=rivalProgress?"1st":"2nd"}</p></div>
     <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-white/10 bg-slate-950/75 px-3 py-2"><p className="text-[9px] font-bold uppercase tracking-widest text-slate-300">Speed</p><p className="font-mono text-xl font-black text-cyan-300">{Math.round(speed*2.4)} <span className="text-[9px] text-slate-300">KM/H</span></p></div>
     {status!=="playing"&&<div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/65 p-5 text-center backdrop-blur-[2px]"><div className="max-w-md"><p className="text-xs font-black uppercase tracking-[.24em] text-orange-300">{status==="countdown"?"Lights out in":"Race results"}</p><h3 className="mt-2 text-3xl font-black">{status==="countdown"?countdown:(status==="finished"?(outcome==="won"?"🏆 YOU WIN!":"RACE OVER"):"Start your engines")}</h3><p className="mt-2 text-sm text-slate-200">{status==="countdown"?"Get ready — the race is about to begin.":(status==="finished"?(outcome==="won"?"You crossed the finish line first. Excellent driving!":"A rival reached the finish first. Improve your typing rhythm and try again."):"Type the target word to launch. Each correct letter builds speed; completing a word moves you down the circuit.")}</p>{status==="finished"&&outcome==="lost"&&<OfflineBonusOffer rewardDescription="Get 10 extra seconds in your next race." onReward={()=>setRewardedRetry(true)}/>}{status!=="countdown"&&<Button onClick={start} className="mt-5 bg-orange-400 font-black text-slate-950 hover:bg-orange-300"><Zap className="mr-2 h-4 w-4"/>{status==="finished"?"Race again":"Start race"}</Button>}</div></div>}
   </div>
   {status==="playing"?<div className="mx-auto mt-2 grid max-w-3xl grid-cols-1 items-center gap-2 sm:grid-cols-[auto_1fr]"><div className="text-center sm:min-w-36"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Type this word</p><p className="font-mono text-3xl font-black tracking-wider text-white">{word.toUpperCase()}</p><p className="mt-1 text-[10px] font-bold text-cyan-300">{validPrefix?Math.round((input.length/word.length)*100)+"% COMPLETE":"CHECK YOUR KEYS"}</p></div><form onSubmit={submit} className="flex min-w-0 gap-2"><label className="sr-only" htmlFor="race-word">Type displayed word</label><input id="race-word" ref={ref} value={input} onChange={e=>handleTyping(e.target.value)} autoComplete="off" autoCapitalize="off" autoCorrect="off" onPaste={e=>e.preventDefault()} onDrop={e=>e.preventDefault()} spellCheck={false} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 font-mono text-base text-white outline-none focus:border-orange-300" placeholder="Type each letter to accelerate"/><Button type="submit" className="bg-orange-400 px-3 font-bold text-slate-950 hover:bg-orange-300">Go</Button></form></div>:null}
   <div className="mt-2 grid grid-cols-2 gap-2">
     <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3"><div className="flex justify-between text-xs font-bold"><span className="text-cyan-200">YOU · BLUE CAR</span><span>{Math.round(progress)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-300 transition-all duration-300" style={{width:progress+"%"}}/></div></div>
     <div className="rounded-xl border border-rose-300/20 bg-rose-400/10 p-3"><div className="flex justify-between text-xs font-bold"><span className="text-rose-200">RIVAL · RED CAR</span><span>{Math.round(rivalProgress)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-rose-400 transition-all duration-300" style={{width:rivalProgress+"%"}}/></div></div>
   </div>
   <div className="mt-2 grid grid-cols-4 gap-2"><GameStat label="Words" value={stats.correct}/><GameStat label="Score" value={stats.score}/><GameStat label="Accuracy" value={typingAccuracy+"%"}/><GameStat label="Time" value={time+"s"}/></div>
 </Panel></section>;
}

function WordPop({difficulty}:{difficulty:Difficulty}) {
 const [rewardedExtraLife,setRewardedExtraLife]=useState(false);
 const [status,setStatus]=useState<"ready"|"playing"|"finished">("ready"),[word,setWord]=useState(()=>pickWord(difficulty)),[input,setInput]=useState(""),[time,setTime]=useState(60),[combo,setCombo]=useState(0),[popSignal,setPopSignal]=useState(0),[feedback,setFeedback]=useState(""),[lives,setLives]=useState(3);
 const stats=useStats(),ref=useRef<HTMLInputElement>(null),area=useRef<HTMLElement>(null),ended=useRef(false);
 const finish=useCallback(()=>{if(ended.current)return;ended.current=true;const elapsed=Math.max(1,60-time);addSession({kind:"game",label:"Word Pop ("+difficulty+")",wpm:Math.round(stats.correct/(elapsed/60)),accuracy:stats.accuracy,errors:stats.errors,durationSec:elapsed,score:stats.score});setStatus("finished");},[difficulty,stats.correct,stats.accuracy,stats.errors,stats.score,time]);
 useEffect(()=>{if(status!=="playing")return;if(time<=0){finish();return;}const t=window.setTimeout(()=>setTime(n=>Math.max(0,n-1)),1000);return()=>window.clearTimeout(t);},[status,time,finish]);
 const start=()=>{ended.current=false;stats.reset();setWord(pickWord(difficulty));setInput("");setTime(60);setCombo(0);setLives(3+(rewardedExtraLife?1:0));setRewardedExtraLife(false);setPopSignal(0);setFeedback("ARENA LIVE — type the glowing target before it escapes.");setStatus("playing");window.setTimeout(()=>ref.current?.focus(),0);};
 const submit=(e:FormEvent)=>{e.preventDefault();if(!input.trim()||status!=="playing"||ended.current)return;const typed=input.trim().toLowerCase();if(typed===word.toLowerCase()){const base=difficulty==="easy"?10:difficulty==="medium"?15:20;const bonus=Math.min(combo*3,30);stats.setCorrect(n=>n+1);stats.setScore(n=>n+base+bonus);setCombo(n=>n+1);setFeedback(combo>=2?"POP! Combo x"+(combo+1)+" — +"+(base+bonus)+" points.":"POP! Target destroyed — new bubble incoming.");setPopSignal(n=>n+1);setWord(old=>pickWord(difficulty,old));}else{stats.setErrors(n=>n+1);setCombo(0);setLives(n=>{const next=Math.max(0,n-1);if(next===0)window.setTimeout(finish,0);return next;});setFeedback("MISS! Shield lost. Watch the glowing target.");recordWordMistakes(word,input.trim());}setInput("");};
 return <section ref={area} className="w-full"><Panel className="!p-3 sm:!p-4 border-fuchsia-300/20 bg-[#070616] text-white">
   <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-fuchsia-300">KeyQuest Reflex Arena</p><h2 className="mt-0.5 text-xl font-black">Word Pop</h2><p className="hidden text-xs text-slate-300 sm:block">Find the glowing target, type it exactly, and smash it before time runs out.</p></div><div className="flex items-center gap-2"><FullscreenButton targetRef={area}/><div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-right"><p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Arena time</p><p className="font-mono text-xl font-black text-fuchsia-200">{time}s</p></div></div></div>
   <div className="relative"><WordPopScene targetWord={word} popSignal={popSignal} active={status==="playing"} difficulty={difficulty}/>{status!=="playing"&&<div className="absolute inset-0 z-20 flex items-center justify-center rounded-[1.5rem] bg-slate-950/70 p-5 text-center backdrop-blur-[2px]"><div className="max-w-md"><p className="text-xs font-black uppercase tracking-[.24em] text-fuchsia-300">{status==="finished"?"Arena results":"Ready to pop"}</p><h3 className="mt-2 text-3xl font-black">{status==="finished"?"ROUND COMPLETE":"Enter the arena"}</h3><p className="mt-2 text-sm text-slate-200">{status==="finished"?"You popped "+stats.correct+" targets with "+stats.accuracy+"% accuracy and scored "+stats.score+" points.":"Three lives. Sixty seconds. The glowing bubble is your target; type its word and press Enter to smash it."}</p>{status==="finished"&&<OfflineBonusOffer rewardDescription="Get one extra life in your next Word Pop round." onReward={()=>setRewardedExtraLife(true)}/>}<Button onClick={start} className="mt-5 bg-fuchsia-400 font-black text-slate-950 hover:bg-fuchsia-300"><Sparkles className="mr-2 h-4 w-4"/>{status==="finished"?"Pop again":"Start Word Pop"}</Button></div></div>}</div>
   {status==="playing"&&<form onSubmit={submit} className="mx-auto mt-3 flex max-w-3xl gap-2"><div className="hidden min-w-36 items-center justify-center rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 text-center sm:flex"><p><span className="block text-[9px] font-black uppercase tracking-widest text-fuchsia-200">Target</span><span className="font-mono text-xl font-black text-white">{word.toUpperCase()}</span></p></div><label className="sr-only" htmlFor="pop-word">Type the glowing target word</label><input id="pop-word" ref={ref} value={input} onChange={e=>setInput(e.target.value)} autoComplete="off" autoCapitalize="off" autoCorrect="off" onPaste={e=>e.preventDefault()} onDrop={e=>e.preventDefault()} spellCheck={false} className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 font-mono text-lg text-white outline-none focus:border-fuchsia-300" placeholder="Type the glowing word…"/><Button type="submit" className="bg-fuchsia-400 px-4 font-black text-slate-950 hover:bg-fuchsia-300">POP</Button></form>}
   <p aria-live="polite" className="mt-2 min-h-5 text-center text-xs font-bold text-fuchsia-100">{status==="playing"?feedback:""}</p><div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5"><GameStat label="Popped" value={stats.correct}/><GameStat label="Score" value={stats.score}/><GameStat label="Accuracy" value={stats.accuracy+"%"}/><GameStat label="Combo" value={"x"+combo}/><GameStat label="Lives" value={"♥".repeat(lives)||"0"}/></div>
 </Panel></section>;
}
function KeyChallenge({difficulty}:{difficulty:Difficulty}) {
 const [rewardedExtraLife,setRewardedExtraLife]=useState(false);
 const [status,setStatus]=useState<"ready"|"playing"|"finished">("ready");
 const [target,setTarget]=useState(KEY_SETS[difficulty][0] ?? "a");
 const [time,setTime]=useState(45),[lives,setLives]=useState(3),[hitSignal,setHitSignal]=useState(0),[missSignal,setMissSignal]=useState(0),[feedback,setFeedback]=useState(""),[outcome,setOutcome]=useState<"won"|"lost"|null>(null);
 const stats=useStats(),area=useRef<HTMLElement>(null),ended=useRef(false),startedAt=useRef(0);
 const next=useCallback((prev:string)=>{const a=KEY_SETS[difficulty].filter(k=>k!==prev);return a[Math.floor(Math.random()*a.length)]??KEY_SETS[difficulty][0]??"a";},[difficulty]);
 const finish=useCallback((result:"won"|"lost")=>{if(ended.current)return;ended.current=true;setOutcome(result);const elapsed=Math.max(1,Math.round((Date.now()-startedAt.current)/1000));addSession({kind:"game",label:"Key Challenge ("+difficulty+")",wpm:Math.round(stats.correct/(elapsed/60)),accuracy:stats.accuracy,errors:stats.errors,durationSec:elapsed,score:stats.score});setStatus("finished");},[difficulty,stats.correct,stats.accuracy,stats.errors,stats.score]);
 useEffect(()=>{if(status!=="playing")return;if(time<=0){finish("lost");return;}const t=window.setTimeout(()=>setTime(n=>Math.max(0,n-1)),1000);return()=>window.clearTimeout(t);},[status,time,finish]);
 useEffect(()=>{if(status!=="playing")return;const onKey=(e:KeyboardEvent)=>{if(e.ctrlKey||e.metaKey||e.altKey||e.key.length!==1)return;e.preventDefault();if(ended.current)return;if(e.key.toLowerCase()===target.toLowerCase()){stats.setCorrect(n=>n+1);stats.setScore(n=>n+10);setHitSignal(n=>n+1);setFeedback("Perfect strike! Next key incoming.");setTarget(old=>next(old));}else{stats.setErrors(n=>n+1);setMissSignal(n=>n+1);setLives(n=>{const left=Math.max(0,n-1);if(left===0)window.setTimeout(()=>finish("lost"),0);return left;});setFeedback("Wrong key! One life lost — refocus.");recordTypingMistake(target,e.key,"game");}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[status,target,next,finish]);
 const start=()=>{ended.current=false;startedAt.current=Date.now();stats.reset();setTarget(next(""));setTime(45);setLives(3+(rewardedExtraLife?1:0));setRewardedExtraLife(false);setHitSignal(0);setMissSignal(0);setOutcome(null);setFeedback("SYSTEM ONLINE — strike the glowing key on your physical keyboard.");setStatus("playing");};
 return <section ref={area} className="w-full"><Panel className="!p-3 sm:!p-4 border-cyan-300/20 bg-[#07101d] text-white">
   <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-cyan-300">KeyQuest · Reflex Training</p><h2 className="mt-0.5 text-xl font-black">Key Challenge</h2><p className="hidden text-xs text-slate-300 sm:block">Hit the highlighted key on your physical keyboard before your lives run out.</p></div><div className="flex items-center gap-2"><FullscreenButton targetRef={area}/><div className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-right"><p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Time left</p><p className="font-mono text-xl font-black text-cyan-200">{time}s</p></div></div></div>
   <div className="relative"><KeyChallengeScene target={target} hitSignal={hitSignal} missSignal={missSignal} active={status==="playing"}/>{status!=="playing"&&<div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-slate-950/75 p-5 text-center backdrop-blur-[2px]"><div className="max-w-md"><p className="text-xs font-black uppercase tracking-[.24em] text-cyan-300">{status==="finished"?"Session results":"Training simulator"}</p><h3 className="mt-2 text-3xl font-black">{status==="finished"?(outcome==="won"?"TIME CLEARED!":"GAME OVER"):"Ready, operator?"}</h3><p className="mt-2 text-sm text-slate-200">{status==="finished"?(outcome==="won"?"You survived the full 45-second key sequence.":"You used all three lives. Train your reaction and try again."):"A 3D keyboard training arena. Find the glowing key and press that exact key on your physical keyboard. Three lives. Forty-five seconds."}</p><p className="mt-3 font-mono text-sm font-bold text-cyan-100">No mouse clicks · Physical keyboard only</p>{status==="finished"&&outcome==="lost"&&<OfflineBonusOffer rewardDescription="Get one extra life in your next Key Challenge." onReward={()=>setRewardedExtraLife(true)}/>}<Button onClick={start} className="mt-5 bg-cyan-300 font-black text-slate-950 hover:bg-cyan-200"><Zap className="mr-2 h-4 w-4"/>{status==="finished"?"Play again":"Start challenge"}</Button></div></div>}</div>
   {status==="playing"&&<div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3"><div><p className="text-[9px] font-black uppercase tracking-widest text-cyan-200">Your target key</p><p className="font-mono text-4xl font-black text-white">{target.toUpperCase()}</p></div><div className="text-right"><p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Lives remaining</p><p className="text-2xl tracking-widest text-rose-300">{"♥".repeat(lives)||"0"}</p></div></div>}
   <p aria-live="polite" className="mt-2 min-h-5 text-center text-xs font-bold text-cyan-100">{status==="playing"?feedback:""}</p>
   <div className="mt-2 grid grid-cols-4 gap-2"><GameStat label="Correct" value={stats.correct}/><GameStat label="Score" value={stats.score}/><GameStat label="Accuracy" value={stats.accuracy+"%"}/><GameStat label="Lives" value={lives+"/3"}/></div>
 </Panel></section>;
}
function GameStat({label,value}:{label:string;value:string|number}) { return <div className="text-center"><p className="text-xs uppercase tracking-wider text-white/60">{label}</p><p className="mt-1 text-xl font-bold tabular-nums text-cyan-200">{value}</p></div>; }
