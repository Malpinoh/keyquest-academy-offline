export type LessonLevel = "Beginner" | "Beginner+" | "Intermediate" | "Advanced" | "Mastery";

export interface LessonExercise {
  title: string;
  target: string;
  instruction: string;
}

export interface TypingLesson {
  id: string;
  title: string;
  level: LessonLevel;
  description: string;
  estimatedMinutes: number;
  exercises: LessonExercise[];
}

const exercise = (title: string, target: string, instruction: string): LessonExercise => ({ title, target, instruction });

export const LESSONS: TypingLesson[] = [
  { id: "home-row-basics", title: "Home Row Basics", level: "Beginner", description: "Learn the resting position for both hands.", estimatedMinutes: 5, exercises: [
    exercise("Find your home row", "asdf jkl;", "Place your left fingers on A, S, D and F. Place your right fingers on J, K, L and semicolon. Keep your thumbs relaxed near the space bar."),
    exercise("Left-hand home row", "asdf fdsa asdf", "Use your left pinky for A, ring finger for S, middle finger for D and index finger for F. Return each finger to its home key."),
    exercise("Right-hand home row", "jkl; ;lkj jkl;", "Use your right index finger for J, middle finger for K, ring finger for L and pinky for semicolon. Feel for the raised bump on J."),
    exercise("Combine both hands", "sad lad; fall; ask dad", "Combine both hands into short patterns. Keep your eyes on the text and focus on clean, steady keystrokes.")
  ]},
  { id: "left-hand-home-row", title: "Left Hand Control", level: "Beginner", description: "Build accuracy with the four left-hand home keys.", estimatedMinutes: 4, exercises: [
    exercise("A and S", "aaa sss asa sas", "Use your left pinky for A and ring finger for S. Return to the home position after each reach."),
    exercise("D and F", "ddd fff dfd fdf", "Use your middle finger for D and index finger for F. Keep your wrist relaxed."),
    exercise("Left-hand patterns", "fad sad dad ask fall", "Combine all four left-hand keys without looking down.")
  ]},
  { id: "right-hand-home-row", title: "Right Hand Control", level: "Beginner", description: "Build accuracy with J, K, L and semicolon.", estimatedMinutes: 4, exercises: [
    exercise("J and K", "jjj kkk jkj kjk", "Use your index finger for J and middle finger for K."),
    exercise("L and semicolon", "lll ;;; l;l ;l;", "Use your ring finger for L and pinky for semicolon."),
    exercise("Right-hand patterns", "jill; kill; ask; all", "Combine right-hand keys with a calm, even rhythm.")
  ]},
  { id: "home-row-words", title: "Home Row Words", level: "Beginner", description: "Turn home-row movement into familiar words.", estimatedMinutes: 5, exercises: [
    exercise("Short words", "ask dad sad lass fall", "Type each word smoothly. Accuracy matters more than speed."),
    exercise("Word groups", "a sad lad asks a lass", "Keep a steady rhythm and use the space bar with your thumb."),
    exercise("A short sentence", "dad asks a lad; a lass falls", "Type the complete sentence while keeping your eyes on the screen.")
  ]},
  { id: "top-row-keys", title: "Top Row Keys", level: "Beginner+", description: "Reach up from home row to the top row.", estimatedMinutes: 5, exercises: [
    exercise("Left top row", "qwer uiop", "Reach gently from the home row. Return each finger to its resting key."),
    exercise("Middle top row", "wert yuio", "Use the finger assigned to each key and avoid stretching your whole hand."),
    exercise("Top row patterns", "type your power quiet", "Practise common top-row combinations at a comfortable pace.")
  ]},
  { id: "bottom-row-keys", title: "Bottom Row Keys", level: "Beginner+", description: "Reach down accurately to the bottom row.", estimatedMinutes: 5, exercises: [
    exercise("Left bottom row", "zxcv", "Reach down from home row and return immediately."),
    exercise("Right bottom row", "bnm,", "Use the correct finger for each key. Keep your hands relaxed."),
    exercise("Bottom row words", "cab van mix box", "Combine bottom-row keys into short, useful words.")
  ]},
  { id: "mixed-rows", title: "Mixed Keyboard Rows", level: "Beginner+", description: "Move between all three letter rows.", estimatedMinutes: 6, exercises: [
    exercise("Row changes", "sad was fed ask", "Move between rows without losing your home position."),
    exercise("Mixed patterns", "quiet zebra moves fast", "Use all rows while maintaining accuracy."),
    exercise("Mixed practice", "we can make typing feel easy", "Type naturally and avoid watching your hands.")
  ]},
  { id: "common-words", title: "Everyday Words", level: "Beginner+", description: "Practise common words found in everyday writing.", estimatedMinutes: 5, exercises: [
    exercise("Useful words", "people time work learn good", "Aim for consistent rhythm across familiar words."),
    exercise("Longer words", "practice keyboard computer welcome", "Break longer words into smooth keystroke sequences."),
    exercise("Word flow", "people learn better when they practise", "Keep spaces accurate and avoid rushing.")
  ]},
  { id: "capital-letters", title: "Capital Letters", level: "Intermediate", description: "Use Shift correctly for uppercase letters.", estimatedMinutes: 5, exercises: [
    exercise("Left-side capitals", "Abc Def Ghi", "Hold the opposite Shift key when capitalising a letter."),
    exercise("Right-side capitals", "Jkl Mno Pqr", "Use your left Shift for letters typed by the right hand."),
    exercise("Names and places", "Lagos Abuja Kano Nigeria", "Practise capital letters in names and places.")
  ]},
  { id: "numbers-row", title: "Numbers Row", level: "Intermediate", description: "Reach for numbers without losing your position.", estimatedMinutes: 5, exercises: [
    exercise("Number sequence", "12345 67890", "Reach to the number row and return to home row."),
    exercise("Number groups", "2026 1999 080 1234", "Keep number groups accurate and use spaces deliberately."),
    exercise("Everyday numbers", "Room 12 costs 500 naira", "Practise numbers in a short, realistic phrase.")
  ]},
  { id: "punctuation", title: "Punctuation Practice", level: "Intermediate", description: "Build confidence with punctuation and symbols.", estimatedMinutes: 5, exercises: [
    exercise("Stops and commas", "Hello, world. How are you?", "Use punctuation keys carefully and include the correct spaces."),
    exercise("Questions and quotes", "She asked, 'Are you ready?'", "Use Shift when a symbol requires it."),
    exercise("Clear writing", "Yes, I can type; and I can improve.", "Focus on punctuation accuracy as well as letters.")
  ]},
  { id: "short-sentences", title: "Short Sentences", level: "Intermediate", description: "Type complete sentences with consistent rhythm.", estimatedMinutes: 6, exercises: [
    exercise("Simple sentence", "The sun is warm today.", "Read the whole sentence before you begin."),
    exercise("Longer sentence", "Practice every day and your typing will improve.", "Keep a comfortable pace from the first word to the last."),
    exercise("Sentence flow", "Good typing comes from patience, focus, and practice.", "Pay attention to spaces and punctuation.")
  ]},
  { id: "paragraphs", title: "Paragraph Practice", level: "Advanced", description: "Maintain accuracy across longer passages.", estimatedMinutes: 7, exercises: [
    exercise("Short paragraph", "Typing is a useful skill. It helps us communicate clearly and work with confidence.", "Read ahead while typing and keep your shoulders relaxed."),
    exercise("Build endurance", "A little practice each day can make a meaningful difference. Start slowly, stay accurate, and let your speed grow naturally.", "Keep an even rhythm across the complete passage."),
    exercise("Long passage", "When you learn to type without looking at the keyboard, you can give more attention to your ideas. Accuracy creates a strong foundation for speed.", "Stay relaxed and focus on accuracy from beginning to end.")
  ]},
  { id: "accuracy-training", title: "Accuracy Training", level: "Advanced", description: "Reduce mistakes through deliberate practice.", estimatedMinutes: 5, exercises: [
    exercise("Careful words", "their there these those through", "Type each word carefully and notice similar letter patterns."),
    exercise("Precision sentence", "Small, careful steps build reliable typing habits.", "Do not sacrifice accuracy to finish quickly."),
    exercise("Clean paragraph", "A reliable typist values correct letters, clear spaces, and thoughtful punctuation.", "Aim for at least 95% accuracy.")
  ]},
  { id: "speed-building", title: "Speed Building", level: "Advanced", description: "Develop a faster rhythm without losing control.", estimatedMinutes: 5, exercises: [
    exercise("Steady rhythm", "the quick brown fox jumps over the lazy dog", "Use a smooth rhythm rather than sudden bursts."),
    exercise("Flow practice", "we practise often to become more confident typists", "Increase your pace only while your accuracy remains strong."),
    exercise("Controlled speed", "consistent practice helps skilled typists work with greater ease", "Finish cleanly. Speed is useful only when the text is correct.")
  ]},
  { id: "long-form-typing", title: "Long-form Typing", level: "Advanced", description: "Build stamina for longer writing tasks.", estimatedMinutes: 8, exercises: [
    exercise("Extended passage", "Writing clearly takes attention. Typing comfortably allows you to focus on the message instead of searching for every key.", "Maintain posture and take a short pause if your hands feel tense."),
    exercise("Workplace passage", "A well-organised message makes information easier to understand. Use paragraphs, punctuation, and consistent spacing to guide your reader.", "Keep your pace even across the full passage."),
    exercise("Long-form finish", "The best way to improve is to practise with purpose. Review your mistakes, repeat difficult patterns, and celebrate steady progress over time.", "Stay accurate and relaxed throughout.")
  ]},
  { id: "timed-challenges", title: "Timed Challenges", level: "Mastery", description: "Apply your skills under a gentle time challenge.", estimatedMinutes: 5, exercises: [
    exercise("One-minute warm-up", "practice makes progress when focus and accuracy come first", "The timer is a guide. Keep your typing clean."),
    exercise("Challenge passage", "A confident typist works at a steady pace and corrects mistakes through regular practice.", "Maintain accuracy as you work at a quicker pace."),
    exercise("Final challenge", "Clear communication depends on good words, careful punctuation, and a calm typing rhythm.", "Complete the passage without rushing.")
  ]},
  { id: "professional-typing", title: "Professional Typing", level: "Mastery", description: "Practise realistic professional communication.", estimatedMinutes: 6, exercises: [
    exercise("Professional note", "Good morning, thank you for your message. I will review the details and respond shortly.", "Use a natural pace and accurate punctuation."),
    exercise("Work update", "The project is progressing well. The team will share the next update after the review is complete.", "Type as if preparing a real workplace update."),
    exercise("Email practice", "Hello team, please find the updated schedule attached. Let me know if you have any questions.", "Focus on professional accuracy and spacing.")
  ]},
  { id: "speed-accuracy-mastery", title: "Speed & Accuracy Mastery", level: "Mastery", description: "Bring speed, precision, and endurance together.", estimatedMinutes: 7, exercises: [
    exercise("Precision warm-up", "accuracy is the foundation of confident and efficient typing", "Begin at a pace you can fully control."),
    exercise("Balanced practice", "The strongest typists combine a relaxed posture with precise movement and consistent rhythm.", "Keep your accuracy high while increasing your pace."),
    exercise("Mastery passage", "Typing mastery is not a single fast result. It is the ability to communicate clearly, accurately, and comfortably whenever the keyboard is needed.", "Finish with control. Repeat this lesson whenever you want to sharpen your skills.")
  ]},
  { id: "editing-and-proofreading", title: "Editing and Proofreading", level: "Intermediate", description: "Practise the punctuation, spacing and careful corrections used when reviewing everyday writing.", estimatedMinutes: 6, exercises: [
    exercise("Punctuation check", "Please review the note, then send your reply.", "Type every comma and full stop. Pause briefly at punctuation instead of dropping it."),
    exercise("Capital letters", "Monday is the first day of our new project.", "Use Shift with the opposite hand when typing the capital letter."),
    exercise("Careful correction", "The final copy is clear, accurate, and ready to share.", "If you mistype a character, correct it calmly with Backspace and continue from the right position.")
  ]},
  { id: "forms-and-data-entry", title: "Forms and Data Entry", level: "Intermediate", description: "Build accuracy with dates, reference numbers, amounts and mixed letters in short sample records.", estimatedMinutes: 6, exercises: [
    exercise("Reference numbers", "Order 2048  Ticket 7315  Room 16", "Keep each number group separate. Read the next group before typing it."),
    exercise("Dates and amounts", "9 Nov 2026  Total NGN 18500.00", "Switch between letters, numbers and punctuation without rushing."),
    exercise("Sample record", "Item A12  Quantity 4  Price NGN 2500.50", "Treat every character as important. Check spaces, decimal points and digits before finishing.")
  ]},
]; 

export const LESSON_LEVELS: LessonLevel[] = ["Beginner", "Beginner+", "Intermediate", "Advanced", "Mastery"];
export const getLesson = (id: string | null | undefined) => LESSONS.find((lesson) => lesson.id === id) ?? LESSONS[0]!;
export const nextLesson = (id: string) => {
  const index = LESSONS.findIndex((lesson) => lesson.id === id);
  return LESSONS[Math.min(index + 1, LESSONS.length - 1)]!;
};
