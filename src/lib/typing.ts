// Pure scoring helpers. WPM convention: (correctly typed characters incl. spaces / 5) per minute.

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number; // 0-100, based on keystrokes
  correctChars: number;
  incorrectChars: number; // currently wrong characters in the typed text
}

export const TEST_DURATIONS = [15, 30, 60, 120] as const;
export const LESSON_PASS_ACCURACY = 90;

/** Append-only typing allows Backspace, while keeping scoring identical on physical and mobile keyboards. */
export function applyTypingInput(target: string, previous: string, value: string, keys: { total: number; correct: number }) {
  const typed = value.slice(0, target.length);
  const next = { ...keys };
  if (typed.length > previous.length && typed.startsWith(previous)) {
    for (let i = previous.length; i < typed.length; i++) {
      next.total += 1;
      if (typed[i] === target[i]) next.correct += 1;
    }
  } else if (!previous.startsWith(typed)) {
    return { typed: previous, keys: next };
  }
  return { typed, keys: next };
}

export function countCorrect(target: string, typed: string): { correct: number; incorrect: number } {
  let correct = 0;
  let incorrect = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === target[i]) correct++;
    else incorrect++;
  }
  return { correct, incorrect };
}

export function calcWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

export function calcAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  return Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10;
}

export function computeStats(
  target: string,
  typed: string,
  elapsedMs: number,
  keystrokes: { total: number; correct: number },
): TypingStats {
  const { correct, incorrect } = countCorrect(target, typed);
  return {
    wpm: calcWpm(correct, elapsedMs),
    rawWpm: calcWpm(typed.length, elapsedMs),
    accuracy: calcAccuracy(keystrokes.correct, keystrokes.total),
    correctChars: correct,
    incorrectChars: incorrect,
  };
}
