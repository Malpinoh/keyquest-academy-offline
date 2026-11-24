import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, Gamepad2, Gauge, Keyboard, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { ClassroomArtwork, FingerGuideArtwork } from "@/components/home/ClassroomArtwork";
import { pageHead } from "@/lib/site";
import { loadProgress } from "@/lib/progress";
import { AdSlot } from "@/components/ads/AdSlot";

export const Route = createFileRoute("/")({
  head: () => pageHead({
    title: "KeyQuest Academy — Your Personal Typing Classroom",
    description: "Learn touch typing in a friendly classroom with guided lessons, typing tests, practice games and progress you can track.",
    path: "/",
  }),
  component: Index,
});

function Index() {
  const progress = loadProgress();
  return (
    <main className="bg-[#e9e5cf] text-[#303b30] dark:bg-[#202b23] dark:text-[#f1eedc]">
      <section className="border-b-4 border-[#9b8955] bg-[linear-gradient(180deg,#f6f0d9_0%,#e4dfc4_100%)] dark:border-[#65765b] dark:bg-[linear-gradient(180deg,#344536_0%,#26352a_100%)]">
        <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-4 py-8 sm:px-7 sm:py-12 lg:grid-cols-[.88fr_1.12fr] lg:gap-10 lg:py-14">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 border border-[#a9a080] bg-[#fffbea] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-[#526044] shadow-[2px_2px_0_#b7ae8c] dark:border-[#718064] dark:bg-[#26382b] dark:text-[#e8d783]">
              <span className="h-2 w-2 rounded-full bg-[#b94e3b]" /> Your personal typing classroom
            </div>
            <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[.2em] text-[#78805d] dark:text-[#d3c77d]">KeyQuest Academy presents</p>
            <h1 className="max-w-xl font-display text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl xl:text-[3.8rem]">
              Welcome to your
              <span className="mt-1 block text-[#536b43] dark:text-[#e3d17a]">typing classroom.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#505b49] dark:text-[#d6ddce] sm:text-lg">
              Meet your instructor, learn where every finger belongs, and build confident typing skills one lesson at a time.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-md border border-[#927d3d] bg-[#e4cd70] px-5 font-extrabold text-[#283126] shadow-[inset_0_1px_rgba(255,255,255,.6),0_3px_0_#9c8844] hover:bg-[#f0dc8a]">
                <Link to="/lessons">Start Learning <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-[#7f8874] bg-[#f8f5e6] px-5 font-bold text-[#354132] hover:bg-white dark:border-[#69765e] dark:bg-[#26342b] dark:text-[#f1efd9]">
                <Link to="/typing-test">Try a typing test</Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[#65705a] dark:text-[#c7d0bd]">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Free practice</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Learn at your pace</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Progress saved locally</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 rounded-xl border border-[#b7a979] bg-[#d7d0ad] shadow-[0_12px_28px_-18px_rgba(31,43,31,.7)] dark:border-[#718064] dark:bg-[#1d2b21]" />
            <div className="relative overflow-hidden rounded-lg border-[5px] border-[#786c4d] bg-[#f4efd9] p-1 shadow-[inset_0_0_0_1px_#fff9df] dark:border-[#68775c]">
              <div className="flex items-center justify-between border-b border-[#9e9677] bg-[#303f32] px-4 py-2.5 text-[#f5f0dc]">
                <span className="font-display text-xs font-black tracking-[.13em]">KEYQUEST CLASSROOM</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e4d27b]">Lesson 01</span>
              </div>
              <ClassroomArtwork className="block h-auto w-full" />
              <div className="flex items-center justify-between gap-3 bg-[#e7e0c6] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#59634c]">
                <span>Learn • Practise • Improve</span><span>Est. for learners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdSlot placement="home-top" format="horizontal" className="py-5 sm:py-7" />

      <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-7 sm:py-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#758052] dark:text-[#d7c879]">Inside your classroom</p><h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">Get to know your keyboard</h2></div>
          <p className="max-w-md text-sm leading-6 text-[#66705b] dark:text-[#c6cebd]">Start with the home row. Your instructor will help you build the right habits.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <div className="overflow-hidden rounded-lg border-2 border-[#a49b7a] bg-[#f7f3e3] shadow-[0_3px_0_#b6ad8e,0_12px_28px_-22px_rgba(0,0,0,.5)] dark:border-[#596b54] dark:bg-[#29372c]">
            <div className="flex items-center justify-between border-b border-[#b6ad8e] bg-[#ded8bd] px-4 py-3 dark:border-[#596b54] dark:bg-[#354634]"><h3 className="font-display text-sm font-black text-[#3e4c39] dark:text-[#f0ebd5]">PRACTISE THE HOME ROW</h3><span className="text-[10px] font-extrabold uppercase tracking-wider text-[#687456] dark:text-[#d8ca7c]">A S D F · J K L ;</span></div>
            <div className="p-4 sm:p-5">
              <p className="mb-3 text-sm text-[#59634d] dark:text-[#c8d0bf]">Rest your fingers gently on the home-row keys before you begin.</p>
              <VirtualKeyboard highlight={["a", "s", "d", "f", "j", "k", "l", ";"]} className="border border-[#c4bea4] bg-[#e9e4d1] p-2 dark:border-[#52624f] dark:bg-[#202d24]" />
              <div className="mt-3 rounded border border-[#c6bea0] bg-[#fffbea] px-4 py-3 font-mono text-base font-bold tracking-[.2em] text-[#46543e] dark:border-[#596b54] dark:bg-[#1e2b22] dark:text-[#e8d783]">asdf&nbsp; jkl;&nbsp; asdf&nbsp; jkl;</div>
            </div>
          </div>
          <div className="rounded-lg border-2 border-[#a49b7a] bg-[#f7f3e3] p-4 shadow-[0_3px_0_#b6ad8e] dark:border-[#596b54] dark:bg-[#29372c]">
            <h3 className="font-display text-sm font-black text-[#3e4c39] dark:text-[#f0ebd5]">WHERE YOUR FINGERS GO</h3>
            <p className="mt-2 text-xs leading-5 text-[#68705b] dark:text-[#c6cebd]">Use this separate guide to learn the resting position for both hands.</p>
            <FingerGuideArtwork className="mt-4 block h-auto w-full" />
            <div className="mt-3 border-t border-[#c6bea0] pt-3 text-xs font-semibold leading-5 text-[#68705b] dark:border-[#596b54] dark:text-[#c6cebd]">Left hand: A S D F<br />Right hand: J K L ;</div>
            <Link to="/learn" search={{ lesson: "home-row-basics" }} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#526b43] hover:underline dark:text-[#e4d27b]">Explore the home row lesson <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#b7ae8e] bg-[#ded9c0] dark:border-[#4e604d] dark:bg-[#29372c]">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-7 sm:py-14">
          <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#758052] dark:text-[#d7c879]">Your learning programme</p>
          <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">Choose your next activity</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Feature to="/lessons" icon={<BookOpen className="h-5 w-5" />} number="01 · LEARN" title="Guided lessons" text="Build your skills from home-row basics to confident keyboard use." />
            <Feature to="/typing-test" icon={<Gauge className="h-5 w-5" />} number="02 · MEASURE" title="Typing tests" text="Measure your words per minute, accuracy and improvement." />
            <Feature to="/games" icon={<Gamepad2 className="h-5 w-5" />} number="03 · PLAY" title="Typing games" text="Practise your keyboard skills through short, fun challenges." />
          </div>
        </div>
      </section>

      <section className="border-t border-[#b7ae8e] bg-[#f2edd7] dark:border-[#4e604d] dark:bg-[#222f26]">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-7 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#758052] dark:text-[#d7c879]">How KeyQuest teaches</p>
            <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">Learn the movement, practise the skill, then measure the result.</h2>
            <p className="mt-3 text-sm leading-7 text-[#626a55] dark:text-[#c9d1c0]">KeyQuest is designed as a learning path rather than a collection of disconnected typing tools. Each stage gives you a reason to slow down, repeat a movement, and check whether the improvement carries into ordinary words and sentences.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <MethodStep number="01" title="Build the habit" text="Start with finger placement and home-row control. Learn which finger should move before trying to make it move quickly." />
            <MethodStep number="02" title="Transfer to real text" text="Move from key drills into words, sentences, capitals, punctuation and longer passages so the skill works beyond a single exercise." />
            <MethodStep number="03" title="Measure honestly" text="Use WPM, accuracy, mistakes and recent results to decide what to practise next. A single personal best is never the whole story." />
          </div>
          <div className="mt-6 rounded-lg border border-[#b8ae8d] bg-[#fffbea] px-4 py-4 text-sm leading-6 text-[#5f674f] dark:border-[#596b54] dark:bg-[#26342a] dark:text-[#cbd4c1]">
            <strong className="text-[#3e4b38] dark:text-[#eee8ce]">The goal is usable typing, not just a high score.</strong> Practice should eventually help with messages, assignments, notes, forms and everyday writing. That is why the curriculum moves from keyboard control toward realistic text.
          </div>
        </div>
      </section>

      <section className="border-t border-[#b7ae8e] bg-[#e9e5cf] dark:border-[#4e604d] dark:bg-[#202b23]">
        <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-7 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#758052] dark:text-[#d7c879]">Before you begin</p>
            <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">A practical classroom for everyday typing.</h2>
            <p className="mt-3 text-sm leading-7 text-[#626a55] dark:text-[#c9d1c0]">KeyQuest is built for learners who want more than a one-off speed score. The public lessons explain the skill, guided practice gives you a place to repeat it, and the typing test helps you see whether the improvement carries over to timed text.</p>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <MethodStep number="WHO" title="New typists" text="Learn the home row, finger positions and basic keyboard control from the beginning without needing previous touch-typing experience." />
            <MethodStep number="WHY" title="Skill builders" text="If you already type but make frequent mistakes, use the accuracy-focused lessons and guides to identify what to practise next." />
            <MethodStep number="WHERE" title="Real work" text="The curriculum eventually moves toward words, sentences, punctuation and professional typing so practice can transfer to everyday writing." />
          </div>
        </div>
      </section>

      <section className="border-y border-[#b7ae8e] bg-[#f2edd7] dark:border-[#4e604d] dark:bg-[#222f26]">
        <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-7 sm:py-14">
          <p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#758052] dark:text-[#d7c879]">Common questions</p>
          <h2 className="mt-2 font-display text-2xl font-black sm:text-3xl">How KeyQuest works</h2>
          <div className="mt-6 divide-y divide-[#c5bc9c] rounded-lg border-2 border-[#b1a887] bg-[#f7f3e3] px-5 dark:divide-[#52624f] dark:border-[#596b54] dark:bg-[#29372c]">
            <div className="py-5">
              <h3 className="font-black">Do I need an account to practise?</h3>
              <p className="mt-2 text-sm leading-6 text-[#65705b] dark:text-[#c6cebd]">No. KeyQuest's Phase 1 practice runs in the browser. Practice progress is saved locally on the device rather than synced to an online learner profile.</p>
            </div>
            <div className="py-5">
              <h3 className="font-black">Should I focus on WPM or accuracy first?</h3>
              <p className="mt-2 text-sm leading-6 text-[#65705b] dark:text-[#c6cebd]">Accuracy is the better starting point for most learners. Once the correct finger movements become more consistent, speed can be developed without deliberately practising the wrong keystrokes faster.</p>
            </div>
            <div className="py-5">
              <h3 className="font-black">Can I repeat a lesson?</h3>
              <p className="mt-2 text-sm leading-6 text-[#65705b] dark:text-[#c6cebd]">Yes. Repetition is part of the learning process. If a lesson exposes a recurring mistake, repeat the relevant exercise before moving on.</p>
            </div>
            <div className="py-5">
              <h3 className="font-black">Can I use KeyQuest on a phone?</h3>
              <p className="mt-2 text-sm leading-6 text-[#65705b] dark:text-[#c6cebd]">You can read the public lessons and guides on a phone. Keyboard-dependent practice is designed for a physical keyboard, so the lesson, test and game interfaces provide desktop-focused guidance where needed.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-extrabold">
            <Link to="/lessons" className="text-[#526b43] hover:underline dark:text-[#e5d27c]">Browse the lessons <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
            <Link to="/resources" className="text-[#526b43] hover:underline dark:text-[#e5d27c]">Read the typing guides <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
            <Link to="/about" className="text-[#526b43] hover:underline dark:text-[#e5d27c]">About KeyQuest <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-7 sm:py-14">
        <div className="grid gap-5 rounded-lg border-2 border-[#66765a] bg-[#304333] p-5 text-[#f4f0dc] shadow-[0_4px_0_#1f3024] sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[.2em] text-[#e5d27c]">Your learner record</p><h2 className="mt-2 font-display text-2xl font-black">Every lesson moves you forward.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#d2d9c9]">Keep track of your practice sessions and completed lessons on this device.</p></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-28 rounded border border-[#78856b] bg-[#26382b] p-3"><Trophy className="h-5 w-5 text-[#e5d27c]" /><p className="mt-2 text-2xl font-black tabular-nums">{progress.sessions.length}</p><p className="text-[11px] text-[#d2d9c9]">Sessions</p></div>
            <div className="min-w-28 rounded border border-[#78856b] bg-[#26382b] p-3"><Target className="h-5 w-5 text-[#e5d27c]" /><p className="mt-2 text-2xl font-black tabular-nums">{progress.lessonsCompleted.length}</p><p className="text-[11px] text-[#d2d9c9]">Lessons done</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MethodStep({ number, title, text }: { number: string; title: string; text: string }) {
  return <article className="rounded-lg border-2 border-[#b1a887] bg-[#f7f3e3] p-5 shadow-[0_3px_0_#b6ad8e] dark:border-[#596b54] dark:bg-[#29372c]">
    <span className="font-mono text-xs font-black text-[#78805d] dark:text-[#d8ca7c]">{number}</span>
    <h3 className="mt-2 text-lg font-black text-[#3e4c39] dark:text-[#f0ebd5]">{title}</h3>
    <p className="mt-2 text-sm leading-6 text-[#65705b] dark:text-[#c6cebd]">{text}</p>
  </article>;
}

function Feature({ to, icon, number, title, text }: { to: "/lessons" | "/typing-test" | "/games"; icon: React.ReactNode; number: string; title: string; text: string }) {
  return <Link to={to} className="group block rounded-lg border-2 border-[#b1a887] bg-[#f7f3e3] p-5 shadow-[0_3px_0_#b6ad8e] transition hover:-translate-y-1 hover:border-[#74865d] dark:border-[#596b54] dark:bg-[#25342a] dark:hover:border-[#a9b57a]"><span className="inline-flex rounded border border-[#aeb392] bg-[#e9e5ce] p-3 text-[#536b43] dark:border-[#63765d] dark:bg-[#354634] dark:text-[#e5d27c]">{icon}</span><p className="mt-4 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#78805d] dark:text-[#d4c77c]">{number}</p><h3 className="mt-1 text-lg font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[#65705b] dark:text-[#c6cebd]">{text}</p><span className="mt-4 inline-flex items-center text-sm font-extrabold text-[#526b43] dark:text-[#e5d27c]">Enter section <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" /></span></Link>;
}
