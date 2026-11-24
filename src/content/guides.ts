// Original guide content for the Resource Center. Each block renders through ArticleLayout.
export type Block =
  | { type: "p"; text: string }
  | { type: "linkedP"; before: string; label: string; slug: string; after: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "tip"; text: string }
  | { type: "example"; title: string; text: string };

export interface Guide {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  readMinutes: number;
  practiceTask: { title: string; instructions: string[]; successCheck: string };
  updated: string;
  related: string[];
  body: Block[];
}

export const GUIDES: Guide[] = [
  {
    slug: "touch-typing-basics",
    title: "Touch Typing Basics: A Practical Starting Point",
    shortTitle: "Touch typing basics",
    description:
      "What touch typing is, why it is worth learning, and a step-by-step plan for your first two weeks of practice.",
    readMinutes: 6,
    practiceTask: { title: "Build a no-look home-row reset", instructions: ["Find F and J by touch", "Type “asdf jkl;” slowly three times", "Type “sad dad asks” while keeping your eyes on the screen."], successCheck: "You can return to the home position without searching and complete the short phrase with deliberate finger assignments." },
    updated: "2026-11-09",
    related: ["finger-placement", "daily-practice-routine", "choose-and-check-keyboard-layout"],
    body: [
      { type: "p", text: "Touch typing means typing without looking at the keyboard. Each finger is responsible for a small group of keys, and over time your hands learn where those keys are by feel. Instead of hunting for letters, you think a word and your fingers produce it." },
      { type: "p", text: "It is a skill, not a talent. Almost everyone who practices consistently can learn it, and the early stages feel slow for everyone. That slowness is normal and temporary." },
      { type: "h2", text: "Why touch typing is worth the effort" },
      { type: "ul", items: [
        "Your eyes stay on the screen, so you catch mistakes as they happen instead of after a whole sentence.",
        "You spend less mental energy on finding keys and more on what you actually want to write.",
        "Using all ten fingers spreads the work out, which many people find more comfortable over long sessions.",
        "Speed tends to grow naturally once the movements are automatic, without you forcing it.",
      ] },
      { type: "h2", text: "The core ideas" },
      { type: "h3", text: "1. The home row is your base" },
      { type: "p", text: "Your fingers rest on the middle row of letter keys: A S D F for the left hand and J K L ; for the right. Every reach to another key starts here and returns here. The small raised bumps on F and J let you find this position without looking." },
      { type: "linkedP", before: "For a full key-by-key breakdown, read our guide to ", label: "correct finger placement", slug: "finger-placement", after: "." },
      { type: "h3", text: "2. Each finger owns specific keys" },
      { type: "p", text: "Keys are grouped in roughly diagonal columns. Your left index finger, for example, covers R, T, F, G, V and B. Using the assigned finger every time is what makes the movement automatic. Using whichever finger is closest might feel faster today, but it prevents the habit from forming." },
      { type: "h3", text: "3. Accuracy first, speed second" },
      { type: "p", text: "Typing slowly and correctly trains the right movements. Typing quickly with lots of corrections trains hesitation and backspacing." },
      { type: "linkedP", before: "We explain the reasoning in ", label: "why accuracy comes before speed", slug: "accuracy-before-speed", after: "." },
      { type: "h2", text: "Your first two weeks" },
      { type: "ol", items: [
        "Days 1–3: Learn the home row only. Practice ASDF and JKL; until you can type them without looking. The KeyQuest home row lesson is designed for exactly this.",
        "Days 4–7: Add the top row reaches (E, I, R, U are a good start), always returning to home row after each key.",
        "Days 8–10: Add the bottom row and common punctuation. Expect your speed to dip while you learn new reaches.",
        "Days 11–14: Type real sentences. Take one short typing test per day to see your baseline, but do not chase the number.",
      ] },
      { type: "tip", text: "If you feel the urge to look down, cover your hands with a light cloth or simply keep your eyes fixed on the text. If you need to check a key, pause and reset deliberately; then return your eyes to the text. Avoid turning every uncertain reach into a rushed search." },
      { type: "h2", text: "Prepare a consistent practice space" },
      { type: "p", text: "Use the keyboard you normally expect to type on, and make sure the text you are copying is easy to read. Sit where you can reach the keyboard without stretching your shoulders. Keep the screen in front of you rather than turning your head repeatedly between a separate page and the keyboard. Before a timed test, check that the correct keyboard language or layout is active." },
      { type: "h2", text: "Know when to move to the next row" },
      { type: "p", text: "Move on when you can find the home keys without searching, use the assigned fingers for the basic patterns, and complete short lines with controlled accuracy. You do not need to reach a particular WPM before learning the next row. When a new row makes you slower, return to a short home-row warm-up and then practise the new keys in small groups." },
      { type: "h2", text: "What to expect" },
      { type: "p", text: "Switching from a familiar hunt-and-peck method to touch typing can temporarily make you slower because you are learning a different movement pattern. That short-term dip does not prove the new method is failing. Your progress depends on your starting habits, practice quality and consistency, so there is no reliable number of days in which everyone should expect to catch up. Compare your results over several similar sessions rather than judging the change from one test." },
      { type: "example", title: "A realistic first session", text: "Five minutes of home row drills, two minutes of rest, then five more minutes. Stop while you still feel focused. Short, frequent sessions tend to work better than long, tiring ones." },
    ],
  },
  {
    slug: "finger-placement",
    title: "Correct Finger Placement: Home Row and Key Zones",
    shortTitle: "Finger placement",
    description:
      "Exactly where each finger rests, which keys each finger types, and posture tips to keep your hands comfortable.",
    readMinutes: 7,
    practiceTask: { title: "Trace a key to its finger", instructions: ["Choose one top-row and one bottom-row letter", "Name the finger responsible for each", "Type each letter five times, returning to home row after every reach."], successCheck: "You use the same assigned finger for each key and can explain how you found the home position again." },
    updated: "2026-11-09",
    related: ["touch-typing-basics", "accuracy-before-speed", "choose-and-check-keyboard-layout"],
    body: [
      { type: "p", text: "Good finger placement is the foundation of touch typing. Once your hands know where 'home' is, every other key becomes a small, repeatable reach from that position." },
      { type: "linkedP", before: "If you are new to the skill, start with the overview in ", label: "Touch Typing Basics", slug: "touch-typing-basics", after: "." },
      { type: "h2", text: "Finding the home row" },
      { type: "ol", items: [
        "Look for the raised bumps on the F and J keys. Place your left index finger on F and your right index finger on J.",
        "Let your other left fingers fall naturally onto D (middle), S (ring) and A (pinky).",
        "Let your other right fingers fall onto K (middle), L (ring) and ; (pinky).",
        "Rest one or both thumbs lightly on the space bar.",
      ] },
      { type: "tip", text: "Rest your fingers, do not press. Your fingertips should touch the keys lightly, with your wrists floating rather than leaning hard on the desk." },
      { type: "h2", text: "Which finger types which key" },
      { type: "p", text: "On a standard QWERTY keyboard, each finger covers a slanted column of keys:" },
      { type: "ul", items: [
        "Left pinky: Q, A, Z (plus Tab, Caps Lock and left Shift).",
        "Left ring: W, S, X.",
        "Left middle: E, D, C.",
        "Left index: R, F, V and also T, G, B.",
        "Right index: U, J, M and also Y, H, N.",
        "Right middle: I, K, and the comma.",
        "Right ring: O, L, and the period.",
        "Right pinky: P, ;, /, plus Enter, Backspace and right Shift.",
        "Thumbs: the space bar.",
      ] },
      { type: "p", text: "Your index fingers do the most work because they each cover two columns. That is expected; they are usually the strongest and most agile fingers." },
      { type: "h2", text: "Recover your home position" },
      { type: "p", text: "If you lose your place, stop instead of sweeping your hands across the keyboard. Find the raised marks on F and J with your index fingers, let the other fingers settle onto the home row, and continue when both hands feel centred. This small reset is more reliable than guessing where your hands landed." },
      { type: "h2", text: "Reaching and returning" },
      { type: "p", text: "When you type a key off the home row, move only the finger that is needed, then bring it back. For example, to type E, lift your left middle finger from D up to E and return to D. Your other fingers stay anchored on the home row as reference points." },
      { type: "example", title: "Practice drill", text: "Type 'ded ded kik kik' slowly. Feel your middle fingers reach up and come back home each time. Then try 'frf juj' for the index fingers." },
      { type: "h2", text: "Capital letters with Shift" },
      { type: "p", text: "Use the Shift key on the opposite side from the letter. For a capital J (right hand), hold left Shift with your left pinky. For a capital F (left hand), hold right Shift with your right pinky. This keeps one hand free to type the letter normally." },
      { type: "h2", text: "Posture and comfort" },
      { type: "ul", items: [
        "Sit with your feet flat and your back supported.",
        "Keep your elbows roughly at a right angle and your shoulders relaxed.",
        "Position the screen so the top is at or slightly below eye level.",
        "Keep wrists straight and avoid bending them sharply up or sideways.",
        "Take short breaks. If anything aches or tingles, stop and rest. Persistent pain is a reason to talk to a health professional, not to push through.",
      ] },
      { type: "p", text: "Ready to try it? The KeyQuest beginner lesson walks you through the home row with a highlighted on-screen keyboard." },
    ],
  },
  {
    slug: "wpm-and-accuracy",
    title: "What WPM and Accuracy Really Mean",
    shortTitle: "WPM and accuracy explained",
    description:
      "How words per minute and accuracy are calculated, how KeyQuest scores your tests, and how to read your results honestly.",
    readMinutes: 6,
    practiceTask: { title: "Compare two fair typing attempts", instructions: ["Choose a 60-second test", "Record WPM and accuracy", "Repeat with the same duration and similar passage difficulty", "Compare both results, not just the higher score."], successCheck: "You can explain why the two attempts are comparable and distinguish speed from keystroke accuracy." },
    updated: "2026-11-09",
    related: ["accuracy-before-speed", "daily-practice-routine", "fix-common-typing-mistakes", "why-typing-speed-gets-stuck"],
    body: [
      { type: "p", text: "Typing results are usually reported as two numbers: words per minute (WPM) and accuracy. They are simple ideas, but they can be calculated in slightly different ways, which is why different typing sites can give different scores for the same performance." },
      { type: "linkedP", before: "When deciding what to improve first, see our guide to ", label: "accuracy before speed", slug: "accuracy-before-speed", after: "." },
      { type: "h2", text: "Words per minute" },
      { type: "p", text: "Real words have different lengths, so typing tests use a standard 'word' of five characters, including spaces and punctuation. This means typing 'cat' and typing 'elephant' do not count equally — characters do." },
      { type: "example", title: "The KeyQuest formula", text: "WPM = (correctly typed characters, including spaces ÷ 5) ÷ minutes elapsed. If you correctly type 250 characters in 60 seconds, that is 250 ÷ 5 = 50 standard words in one minute, or 50 WPM." },
      { type: "p", text: "Because KeyQuest only counts characters that match the passage, uncorrected mistakes lower your WPM. We also show 'raw' speed in some places, which counts every character you typed whether it was right or not." },
      { type: "h2", text: "Accuracy" },
      { type: "p", text: "KeyQuest measures accuracy per keystroke: the percentage of characters you typed that were correct at the moment you typed them. If you type a wrong letter and then fix it with Backspace, the passage ends up correct, but the original mistake still counts against your accuracy." },
      { type: "example", title: "Example", text: "You press 200 character keys and 190 of them were correct when pressed. Your accuracy is 190 ÷ 200 = 95%." },
      { type: "p", text: "The error count shown for a completed test is based on incorrect characters still present in the typed passage at the end. A wrong character that you correct with Backspace still counts as an incorrect keystroke for accuracy, but it is no longer included in the remaining-error count. Backspace presses themselves are not counted as keystrokes." },
      { type: "h2", text: "Compare results under similar conditions" },
      { type: "p", text: "A useful comparison keeps the test duration, keyboard, input layout and passage difficulty reasonably similar. A short passage with familiar words is not directly comparable with a longer passage containing names, numbers or punctuation. Record the conditions when a result surprises you, then repeat a similar test before deciding that your ability has changed." },
      { type: "h2", text: "How to read your numbers" },
      { type: "ul", items: [
        "Compare yourself to yourself. Your own trend over weeks is far more meaningful than a comparison with someone else's score on a different site.",
        "Short tests are noisy. A 15-second test can swing a lot from one attempt to the next. Longer tests (60 or 120 seconds) give a steadier picture.",
        "Passages matter. Text with more punctuation, capitals or unusual words will usually produce a lower WPM.",
        "A test is a snapshot, not a certificate. Your result shows how you typed this passage, on this device, today.",
      ] },
      { type: "h2", text: "What is a 'good' score?" },
      { type: "p", text: "There is no single correct answer, and we prefer not to make up benchmarks. A more useful goal is consistency: aim to keep accuracy at or above about 95% while your WPM slowly rises. If accuracy drops below that, slow down. Our guide on why accuracy comes before speed explains the reasoning." },
      { type: "tip", text: "Try the same test duration several times over a week and look at the average rather than the single best run. The Progress page shows your recent results so you can do this." },
    ],
  },
  {
    slug: "accuracy-before-speed",
    title: "Why Accuracy Comes Before Speed",
    shortTitle: "Accuracy before speed",
    description:
      "Why careful, correct typing builds faster typists in the long run, and simple techniques to slow down productively.",
    readMinutes: 5,
    practiceTask: { title: "Find a controlled practice pace", instructions: ["Type a short passage at a comfortable pace", "Note accuracy and repeated errors", "Slow down if errors interrupt your rhythm", "Repeat the passage or a similar fresh one."], successCheck: "You finish with fewer disruptive errors and a pace you can reproduce; do not treat one percentage as a universal pass rule." },
    updated: "2026-11-09",
    related: ["wpm-and-accuracy", "daily-practice-routine", "fix-common-typing-mistakes"],
    body: [
      { type: "p", text: "It is tempting to measure progress by speed alone. But in typing, the fastest route to speed is usually to stop chasing it for a while and focus on hitting the right keys." },
      { type: "h2", text: "Mistakes are expensive" },
      { type: "p", text: "Every error costs more than one keystroke. You have to notice it, stop, press Backspace (sometimes several times), and retype. A single mistake can easily cost the time of three or four correct characters, and it breaks your rhythm." },
      { type: "example", title: "A quick comparison", text: "Typist A types quickly but makes frequent mistakes and spends a lot of time fixing them. Typist B types a little slower but rarely needs Backspace. In a real writing task, Typist B often finishes first, and with less frustration." },
      { type: "h2", text: "You practice what you repeat" },
      { type: "p", text: "Every keystroke reinforces a movement. If you regularly reach for the wrong key or use the wrong finger, that habit gets stronger too. Slow, correct repetition teaches your hands the movement you actually want." },
      { type: "h2", text: "How to practice accuracy" },
      { type: "ol", items: [
        "Use a comfortable pace that keeps errors manageable; around 95% can be a useful personal practice target, not a universal standard. Slow down when errors begin to interrupt your rhythm.",
        "Keep a steady rhythm. Even keystrokes, like a metronome, are better than bursts and pauses.",
        "Read slightly ahead. Look at the next word while typing the current one.",
        "When you make an error, fix it calmly and continue. Do not rush to make up the time.",
        "Notice patterns. If the same letter pair keeps tripping you up, practice it on its own for a minute.",
      ] },
      { type: "h2", text: "Practise difficult letter combinations" },
      { type: "p", text: "If a particular pair or sequence causes repeated errors, isolate it for a short drill. Type the first letter, the second letter, and then the pair slowly. Put the pair into a familiar word, then type a complete sentence that contains it. Return to normal text after a few repetitions so you can check whether the movement transfers beyond the drill." },
      { type: "h2", text: "When to push for speed" },
      { type: "p", text: "Once your accuracy stays high for several sessions in a row, try short bursts slightly faster than comfortable — for example, a single 30-second test where you aim for a few WPM more than usual. Then return to your normal pace. Alternating like this lets speed grow without breaking good habits." },
      { type: "tip", text: "KeyQuest's guided lesson steps currently use a 90% minimum accuracy threshold before you can continue. This is a product rule for lesson progression, not a universal typing standard; your own practice target can be higher." },
    ],
  },
  {
    slug: "daily-practice-routine",
    title: "How to Build an Effective Daily Typing Practice Routine",
    shortTitle: "Daily practice routine",
    description:
      "A simple 15-minute daily plan, how to warm up, what to track, and how to stay consistent without burning out.",
    readMinutes: 6,
    practiceTask: { title: "Complete a focused 15-minute session", instructions: ["Warm up on the home row for two minutes", "Spend five minutes on one weak pattern", "Type ordinary sentences for five minutes", "Use two minutes to review and one minute to plan the next session."], successCheck: "You can name the one skill you practised, one error you noticed and the next small target." },
    updated: "2026-11-09",
    related: ["touch-typing-basics", "accuracy-before-speed", "typing-practice-for-school-and-work"],
    body: [
      { type: "p", text: "Typing improves with regular, focused practice. You do not need hours a day. A short routine you actually stick to will beat an ambitious plan you abandon after a week." },
      { type: "linkedP", before: "If you are still learning the keyboard, begin with ", label: "touch typing basics", slug: "touch-typing-basics", after: " before increasing your practice time." },
      { type: "h2", text: "A 15-minute routine" },
      { type: "ol", items: [
        "Warm-up (2 minutes): Place your hands on the home row and type a few slow lines like 'asdf jkl; fjdk sla;'. Focus on relaxed fingers.",
        "Focused drill (5 minutes): Work on one thing — a new row, a tricky letter pair, or capital letters. Use a lesson or write your own short drill.",
        "Real text (5 minutes): Type full sentences. Take a 60-second test or copy a paragraph from something you are reading.",
        "Measure (2 minutes): Take one typing test at your usual duration. Note your WPM and accuracy.",
        "Cool down (1 minute): Stretch your fingers and wrists, and check your posture.",
      ] },
      { type: "h2", text: "Set a small daily goal" },
      { type: "p", text: "A goal measured in sessions is easier to keep than a goal measured in WPM. The KeyQuest Progress page lets you set a daily goal of practice sessions (lessons, tests, or games) and shows how many you have completed today." },
      { type: "h2", text: "Track the right things" },
      { type: "ul", items: [
        "Accuracy trend: Is it staying at or above about 95%?",
        "Average WPM over a week, rather than your single best result.",
        "Which keys or combinations cause you trouble.",
        "How consistent you have been — days practiced matters.",
      ] },
      { type: "h2", text: "Adapt the routine to your current stage" },
      { type: "p", text: "A beginner can spend most of a session on finger placement and short key patterns. Someone who already types ordinary sentences can devote more time to punctuation, numbers and longer passages. A more experienced typist can use realistic documents and review recurring errors. Keep one focused goal for each session rather than trying to improve every part of typing at once." },
      { type: "h2", text: "Keeping it fresh" },
      { type: "p", text: "Variety helps you stay engaged. Mix lessons, timed tests and games. Games like KeyQuest Space Mission are useful for practicing quick word recognition, but they are a supplement to structured practice rather than a replacement." },
      { type: "example", title: "A sample week", text: "Monday–Friday: the 15-minute routine. Saturday: one longer 120-second test and a game session. Sunday: rest, or a light 5-minute warm-up." },
      { type: "h2", text: "Avoiding burnout and strain" },
      { type: "ul", items: [
        "Stop when your focus drops. Tired practice tends to build sloppy habits.",
        "Take a short break at least every 20–30 minutes of continuous typing.",
        "If you feel pain, stop. Comfort comes before progress.",
      ] },
      { type: "tip", text: "Practice at roughly the same time each day — for example, right before you check email. Linking a new habit to an existing one makes it easier to remember." },
    ],
  },

  {
    slug: "fix-common-typing-mistakes",
    title: "How to Find and Fix Your Most Common Typing Mistakes",
    shortTitle: "Fix common typing mistakes",
    description: "A practical method for spotting repeated typing errors, practising difficult key combinations and turning mistakes into focused drills.",
    readMinutes: 7,
    practiceTask: { title: "Turn one repeated error into a drill", instructions: ["Identify one recurring substitution, missed space or punctuation error", "Practise the movement slowly for one minute", "Put it into two familiar words", "Use it in a new sentence."], successCheck: "The same error appears less often in a fresh sentence, not only in the memorised drill." },
    updated: "2026-11-09",
    related: ["accuracy-before-speed", "finger-placement", "daily-practice-routine", "why-typing-speed-gets-stuck"],
    body: [
      { type: "p", text: "Typing errors are useful information. A low score tells you that something went wrong, but a list of repeated mistakes can show you what to practise next. Instead of repeating an entire test whenever your accuracy drops, identify the small movement or pattern that caused the problem." },
      { type: "linkedP", before: "For help checking which finger should reach each key, use the ", label: "finger placement guide", slug: "finger-placement", after: "." },
      { type: "h2", text: "Start by identifying the pattern" },
      { type: "p", text: "After a practice session, pause before starting another one. Ask what kind of mistake appeared most often. Did you confuse two nearby letters, miss the space bar, forget a capital letter, or lose your place in a longer sentence? These problems need different practice." },
      { type: "ul", items: [
        "Repeated letter substitutions may point to a finger reaching for the wrong key or an unfamiliar key position.",
        "Missing spaces can mean you are concentrating on letters and forgetting to give the thumb a consistent job.",
        "Capitalisation and punctuation errors often appear when Shift or punctuation keys are introduced too quickly.",
        "Mistakes near the end of a passage may happen when attention or posture starts to fade.",
        "A sudden cluster of unexpected characters may indicate that your computer is using a different keyboard layout from the one printed on the keys."
      ] },
      { type: "h2", text: "Turn one error into a short drill" },
      { type: "p", text: "Choose one recurring problem and create a small practice line around it. Keep the drill short enough that you can repeat it carefully. If you keep confusing E and R, practise a few controlled sequences such as 'ere rer ree' before returning to ordinary words. Do not turn the drill into a speed contest." },
      { type: "example", title: "A focused correction session", text: "If you often mistype 'the' as 'teh', first type 'th th th' slowly, then 'the the the', and finally use the word in a sentence. Finish by typing a fresh sentence that contains the same pattern. The goal is to make the correct movement repeatable, not to memorise one line." },
      { type: "h2", text: "Check your finger movement" },
      { type: "p", text: "Return to the finger-placement guide and check which finger should reach the problem key. Keep the other fingers relaxed near their home positions. If you use a different finger every time, the movement may remain inconsistent. Practise the assigned movement slowly, then test it in a word and a sentence." },
      { type: "h2", text: "Separate a typing habit from a technical problem" },
      { type: "p", text: "Not every unexpected character is a typing mistake. If the key you press repeatedly produces a different symbol, check your operating system's keyboard language and layout settings. Also check whether a modifier key such as Shift, Alt or Ctrl is stuck. Try a plain text field and a few known keys before changing settings." },
      { type: "h2", text: "Measure improvement fairly" },
      { type: "p", text: "Use the same type of drill more than once, but do not judge progress from one attempt. Compare several sessions under similar conditions: the same keyboard, a similar passage difficulty and the same test duration. Look for fewer repeated errors and steadier accuracy, not only a higher best score." },
      { type: "ol", items: [
        "Write down one or two errors that appeared repeatedly.",
        "Practise the movement slowly for one or two minutes.",
        "Use the same pattern in familiar words and a complete sentence.",
        "Take a fresh short test and check whether that error appears less often.",
        "Move to a different problem only after the first one becomes more reliable."
      ] },
      { type: "tip", text: "Do not practise every mistake at once. One clearly defined target makes a better drill than a long list of letters you are trying to fix simultaneously." }
    ],
  },
  {
    slug: "typing-practice-for-school-and-work",
    title: "Typing Practice for School, Study and Everyday Work",
    shortTitle: "Typing for school and work",
    description: "Learn how to move from keyboard drills to useful writing tasks such as notes, assignments, emails, forms and everyday documents.",
    readMinutes: 7,
    practiceTask: { title: "Create and proofread a useful short document", instructions: ["Type a short three-sentence study note or workplace update", "Include a heading and punctuation", "Review once for missing words and once for spacing and punctuation."], successCheck: "The message is complete, readable and checked against what you intended to communicate." },
    updated: "2026-11-09",
    related: ["daily-practice-routine", "wpm-and-accuracy", "accuracy-before-speed"],
    body: [
      { type: "p", text: "Typing drills help your fingers learn where keys are, but everyday tasks ask you to do more than repeat letter patterns. Students write notes and assignments. People at work prepare messages, reports, lists and forms. A useful practice plan gradually connects keyboard control with the kind of writing you actually need to produce." },
      { type: "linkedP", before: "For a repeatable short session, follow the ", label: "daily typing practice routine", slug: "daily-practice-routine", after: "." },
      { type: "h2", text: "Build the skill in stages" },
      { type: "ol", items: [
        "Learn the key positions with short lessons. Do not rush past the home row just because the first exercises feel simple.",
        "Practise common words and short sentences so your fingers move between keys without stopping after every letter.",
        "Add capitals, punctuation, numbers and symbols when you can already type ordinary sentences with control.",
        "Use realistic paragraphs and short documents to practise keeping your place across several lines.",
        "Review your work for missing words, duplicated letters, spaces and punctuation. A typing score cannot replace proofreading."
      ] },
      { type: "h2", text: "Practice for school and study" },
      { type: "p", text: "For schoolwork, use practice passages that resemble the tasks you expect to type: a short explanation, a set of notes, a paragraph summary or a list of questions. Practise headings, paragraph breaks, commas and full stops. When copying notes, look at a small phrase, remember it, and type it accurately rather than staring at each key." },
      { type: "example", title: "A study practice task", text: "Type a short paragraph explaining something you learned today. Add a heading, write three complete sentences, and finish with one question. Read the result once for typing errors and once for meaning. This practises both keyboard control and careful review." },
      { type: "h2", text: "Practice for office and everyday tasks" },
      { type: "p", text: "For work, practise the formats you use most often. An email needs a greeting, clear sentences and a closing. A simple report needs headings and paragraphs. A data-entry task needs careful numbers, dates and consistent spacing. Use fictional details in practice exercises; do not enter private customer information, passwords or confidential workplace data into a public typing website." },
      { type: "h2", text: "Do not confuse speed with completed work" },
      { type: "p", text: "A high WPM result on a short passage does not automatically mean that a person can prepare a clear document quickly. Real tasks include deciding what to write, organising information, correcting errors and checking facts. Treat a typing test as one measure of keyboard fluency, not a complete measure of writing or job performance." },
      { type: "h2", text: "A practical 20-minute session" },
      { type: "ul", items: [
        "Five minutes: work on one lesson or a key pattern that needs attention.",
        "Five minutes: type ordinary sentences with capitals and punctuation.",
        "Seven minutes: prepare a short school, personal or workplace-style passage.",
        "Three minutes: review spelling, spacing and punctuation, then note one thing to practise next time."
      ] },
      { type: "h2", text: "Use realistic material safely" },
      { type: "p", text: "Choose public-domain text, your own writing or made-up practice material. Avoid pasting private messages, personal records, exam answers, company documents or other confidential text into a website unless you have permission and understand how that service handles submitted information." },
      { type: "tip", text: "Make the practice task resemble a real task, but keep the information fictional. You can train the same keyboard movements without exposing anyone's private details." }
    ],
  },
  {
    slug: "why-typing-speed-gets-stuck",
    title: "Why Your Typing Speed Gets Stuck: Diagnose the Bottleneck",
    shortTitle: "When typing speed gets stuck",
    description: "A practical troubleshooting guide to identify whether accuracy, hesitation, finger movement, reading, or test conditions are holding back your typing progress.",
    readMinutes: 8,
    practiceTask: { title: "Run a one-variable plateau check", instructions: ["Take two similar 60-second tests and record the average", "Pick one bottleneck, such as pauses or repeated substitutions", "Drill that issue for two minutes", "Type a fresh sentence and retest under similar conditions."], successCheck: "You can identify one specific bottleneck and decide whether it improved without changing several practice variables at once." },
    updated: "2026-11-22",
    related: ["wpm-and-accuracy", "fix-common-typing-mistakes", "daily-practice-routine"],
    body: [
      { type: "p", text: "A typing score can stay almost unchanged for days or weeks even when you keep practising. That does not automatically mean you have reached your limit. Often, one part of the task is slowing the whole performance: accuracy, unfamiliar key reaches, pauses between words, reading ahead, or the conditions of the test. The useful next step is to identify the bottleneck instead of repeating the same test without a plan." },
      { type: "h2", text: "First, make sure the comparison is fair" },
      { type: "p", text: "Before diagnosing a plateau, compare results from similar tests. Use the same duration, a similar passage difficulty, the same keyboard and the same input layout. A passage with many capitals, numbers or punctuation can produce a lower score than familiar plain text. Compare several attempts across a few sessions rather than treating one unusually good or bad result as your normal level." },
      { type: "h2", text: "Use the symptom to choose what to practise" },
      { type: "ul", items: [
        "Your accuracy drops as you try to type faster: reduce the pace until you can type cleanly, then add short controlled speed bursts.",
        "You pause before particular letters or punctuation: practise those key reaches and combinations slowly, then use them in real words and sentences.",
        "You type individual words well but lose rhythm in sentences: practise short phrases and complete sentences, keeping your eyes a little ahead of your fingers.",
        "You keep looking down at the keyboard: return to the home row, use the F and J bumps to reset your hands, and practise short passages without chasing speed.",
        "Your score changes dramatically between tests: standardise the test duration and passage difficulty, then use the average of several attempts.",
        "You make more mistakes near the end: shorten the practice block, take a brief rest, and check whether posture or attention is changing."
      ] },
      { type: "h2", text: "Run a five-minute bottleneck check" },
      { type: "ol", items: [
        "Take one 60-second test at a comfortable pace and record WPM and accuracy.",
        "Write down the two most noticeable problems: for example, missed spaces, repeated letter substitutions, hesitation on capitals, or looking down.",
        "Choose only one problem. Do not try to correct every weakness in the same session.",
        "Spend two minutes practising the relevant key or phrase slowly and correctly.",
        "Type a fresh sentence containing the same pattern, then take another comparable short test."
      ] },
      { type: "example", title: "Example: speed falls when accuracy falls", text: "Suppose your usual result is 34 WPM at 96% accuracy, but attempts to reach 40 WPM produce 29 WPM at 87% accuracy. The faster attempt is not yet a useful improvement. For the next few sessions, return to a pace that keeps your accuracy stable. Add one brief faster attempt only after the controlled practice, and compare both accuracy and speed." },
      { type: "h2", text: "Build a drill that transfers to real typing" },
      { type: "p", text: "A drill should move from a small movement to normal language. Start with the difficult keys or letter pair, repeat it carefully, put it into familiar words, and finish with a new sentence. If the pattern only works inside the drill, it has not transferred yet. Use a different sentence on the next attempt so you are practising the movement rather than memorising a line." },
      { type: "h2", text: "Try a one-week experiment" },
      { type: "ol", items: [
        "Day 1: Record a baseline using two similar 60-second tests. Note accuracy and the main recurring error.",
        "Days 2–3: Spend five focused minutes on that one error, followed by five minutes of ordinary sentences.",
        "Day 4: Rest from timed testing or do a light lesson without chasing a score.",
        "Days 5–6: Repeat the focused drill, then use a fresh passage under the same test conditions.",
        "Day 7: Compare the average results and error pattern with Day 1. Keep the drill if the problem is becoming less frequent; otherwise reassess the cause."
      ] },
      { type: "h2", text: "Know what progress looks like" },
      { type: "p", text: "Progress may appear first as fewer pauses, fewer repeated mistakes, more consistent accuracy or less need to look down. WPM may rise later. These changes matter because fluent typing is a combination of accurate finger movement, visual tracking and steady rhythm, not just a high number on one short test." },
      { type: "tip", text: "Choose one measurable target for your next session, such as keeping accuracy steady or reducing one repeated error. A specific target gives you more useful feedback than simply trying to type faster." }
    ],
  },
  {
    slug: "choose-and-check-keyboard-layout",
    title: "Keyboard Layouts Explained: QWERTY, Language Settings and Key Positions",
    shortTitle: "Keyboard layouts explained",
    description: "Understand why the characters on screen may not match the symbols printed on your keyboard, and how to check your layout before practising.",
    readMinutes: 6,
    practiceTask: { title: "Check the active keyboard layout", instructions: ["Open a plain text field", "Type a few letters, digits and punctuation marks whose positions you know", "Compare the output with the active layout", "Confirm the layout before starting a lesson."], successCheck: "The output matches the layout you intended to use; if it does not, you know to check system settings before changing typing technique." },
    updated: "2026-11-09",
    related: ["finger-placement", "touch-typing-basics", "fix-common-typing-mistakes"],
    body: [
      { type: "p", text: "A keyboard layout is the arrangement of characters and functions assigned to physical keys. QWERTY is a widely used layout, but it is not the only one. Your computer's selected input layout determines which character is produced when you press a key. That means the symbols printed on a physical keyboard and the characters entered by the computer do not always match." },
      { type: "linkedP", before: "Once your layout is confirmed, review the ", label: "finger placement guide", slug: "finger-placement", after: " for standard QWERTY key zones." },
      { type: "h2", text: "Physical keyboard and software layout are different things" },
      { type: "p", text: "The physical keyboard is the hardware in front of you. The software layout is the mapping your operating system uses to interpret key presses. A laptop may have keys printed for one regional layout while the operating system is set to another. This can make punctuation and some letter positions appear incorrect even when the keyboard itself is working." },
      { type: "h2", text: "Check the layout before a typing test" },
      { type: "ol", items: [
        "Look at the language or input indicator in your computer's taskbar or system panel.",
        "Open the keyboard or language settings and confirm the selected layout matches the physical keyboard you are using.",
        "In a plain text editor, test a few letters and punctuation marks whose positions you know.",
        "If the output is unexpected, check the selected input source and any keyboard shortcuts that switch layouts.",
        "Change settings only when you know which layout you want, and test again before beginning a timed exercise."
      ] },
      { type: "h2", text: "Why punctuation can be confusing" },
      { type: "p", text: "Some keyboard layouts place punctuation marks and symbols in different positions or require a different modifier key. This is especially noticeable when typing quotation marks, brackets, slash marks and symbols above the number row. If letters work but punctuation does not, check the active layout before assuming that you have forgotten the finger position." },
      { type: "h2", text: "Learn one layout consistently" },
      { type: "p", text: "For a beginner, consistency matters. Choose the layout you use for your normal school, work or personal tasks and practise with it regularly. Switching layouts during every session makes it harder to build a dependable sense of where characters are located. If you genuinely need two layouts, practise them separately and confirm which one is active before each task." },
      { type: "h2", text: "Laptop, desktop and external keyboards" },
      { type: "p", text: "Laptop keyboards can have a compact arrangement, while full-size desktop keyboards may include a separate number pad and additional navigation keys. An external keyboard can also have a different physical arrangement from the laptop keyboard. The main letter-row finger assignments remain a useful starting point on standard QWERTY keyboards, but special keys and punctuation may differ." },
      { type: "h2", text: "A quick layout check exercise" },
      { type: "example", title: "Before you start", text: "Open a plain text field and type the alphabet, the number row, and a short punctuation sequence such as comma, full stop, slash and question mark. Compare the output with the keys you pressed. If the result is consistent with your selected layout, begin your lesson. If not, check your system input settings first." },
      { type: "tip", text: "If one key produces the wrong character in every application, investigate the keyboard layout or hardware. If it happens only in one website or app, check that app's input behaviour before changing your system settings." }
    ],
  },
]; 

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
