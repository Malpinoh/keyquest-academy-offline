# KeyQuest Academy

Build a new original educational web app called KeyQuest Academy. This is a new project; do not modify any existing projects. Goal: a genuinely useful, polished typing tutor and educational resource site with strong AdSense readiness, not a thin landing page. AdSense approval is never guaranteed. Do not copy Mavis Beacon's branding, characters, proprietary text, or exact interface.

BRAND: “KeyQuest Academy” with tagline “Learn to Type. Level Up. Master Your Keyboard.” Use an original premium educational-tech visual system: midnight navy, electric violet and cyan accents, crisp accessible typography, subtle gradients, thoughtful spacing, keyboard motifs, original CSS/SVG illustrations, light/dark mode. Avoid generic template styling, excessive glassmorphism, fake statistics/testimonials, stock-photo dependence, heavy 3D, and paid assets. Responsive desktop/tablet/mobile; accessible contrast, visible focus, keyboard navigation, reduced-motion support. Keep performance lightweight for low-powered devices and slower connections.

TECH: use the platform's standard React + TypeScript + Tailwind/shadcn stack and reusable components. No paid AI APIs, no required backend or auth in Phase 1. All typing/game logic runs in the browser. Persist guest progress with guarded localStorage and explain data stays on this device; handle unavailable/corrupt storage gracefully. Keep the code organized so it can later be exported and continued locally on Linux Mint and deployed via Vercel. Inspect generated structure before adding complexity.

PHASE 1 — build a small but genuinely working foundation:
1) Homepage with clear hero, “Start Learning” and “Take a Typing Test” CTAs; a working typing-demo preview if feasible; explain lessons, typing tests, games and progress; keyboard/finger-placement illustration; learning path; resource links; useful footer. No fake claims.
2) Functional typing test with 15, 30, 60 and 120 second durations; original short passages; live countdown, WPM, accuracy and error counts; per-character correct/incorrect highlighting; physical keyboard input; start/restart and final results; save personal bests and recent results locally. Use the standard convention WPM = correctly typed characters including spaces divided by 5 per minute; document scoring clearly and do not present an untested result as a real-world guarantee. Ensure timer stops cleanly and results cannot be double-submitted.
3) One beginner lesson for home row ASDF and JKL; with clear finger placement instructions, a virtual keyboard highlighting target keys, guided practice, feedback, progress and completion/retry state. Prioritize accuracy before speed. Persist completion locally.
4) Guest progress dashboard with best WPM, latest result, accuracy, lessons completed, practice sessions, daily goal and recent activity. Derive stats from actual locally saved sessions, never hardcode fake progress. Include reset progress with confirmation and an empty state for new learners.
5) One playable original game, “KeyQuest Space Mission”: type target words to power a ship/collect energy. Real keyboard interaction, clear objectives, at least a few difficulty levels, score and accuracy, win/game-over states and replay. Lightweight CSS/SVG/canvas only; sound optional and off by default.
6) Resource Center with several substantial, original, practical starter guides, not thin placeholder pages: touch typing basics, correct finger placement, what WPM and accuracy mean, why accuracy comes before speed, and how to build an effective daily practice routine. Use an accessible reusable article template, real actionable examples, headings, internal links, and honest helpful content. Avoid mass-generated filler and keyword stuffing.
7) Trust and site foundations: About, Contact (a working contact form only if it can function honestly without a backend; otherwise provide a clear contact placeholder/configuration note and avoid claiming messages are sent), Privacy Policy, Terms, 404 page, sitemap.xml and robots.txt, semantic HTML, unique page titles/descriptions, canonical URL setup that can be configured later, social metadata, clean navigation, sensible internal links. Legal text should be editable and accurately describe current local-storage behavior; don't claim services or data practices that aren't implemented. No live ad placements yet; design layouts so ads can be added later without interrupting typing exercises.

IMPLEMENTATION DETAILS: Build functional routes/pages for Home, Typing Test, Learn (beginner lesson), Progress, Games, Resources and individual guide pages, About, Contact, Privacy, Terms. Keep navigation clear. Buttons and controls must work; don't leave dead CTA links. Use original content and example passages. Include empty/loading/error states where applicable. Avoid adding authentication, Supabase, subscriptions, leaderboards, cloud sync, analytics, or paid integrations in Phase 1. These can be later phases after core experience is verified.

QUALITY CHECK: Test and fix the actual app's build/types and the key flows: timer selection/start/countdown/end/restart, typing scoring, accuracy and errors, passage completion, local save/reload, beginner lesson completion/retry, dashboard empty and populated states, game start/game-over/replay, all navigation and footer links, mobile layouts, light/dark mode, keyboard focus, reduced motion, and localStorage failure. Do not claim tests passed unless actually verified. Prioritize working functionality over visual decoration.

At completion, report: pages/features implemented, what works vs anything incomplete, tests/build checks actually performed, how to preview and publish, and any configuration still needed. Name the project KeyQuest Academy.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/dbd12b16-66b0-48c9-a935-6ca28e6a7fd8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
