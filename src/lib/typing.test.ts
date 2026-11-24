import { describe, expect, it } from "vitest";
import { applyTypingInput, TEST_DURATIONS, LESSON_PASS_ACCURACY, calcAccuracy, calcWpm, countCorrect, computeStats } from "./typing";

describe("typing score helpers", () => {
  it("offers the four requested test durations", () => {
    expect(TEST_DURATIONS).toEqual([15, 30, 60, 120]);
  });
  it("retains the original lesson's 90 percent pass requirement", () => {
    expect(LESSON_PASS_ACCURACY).toBe(90);
  });
  it("counts actual inserted characters and preserves errors after Backspace", () => {
    const wrong = applyTypingInput("asdf", "", "ax", { total: 0, correct: 0 });
    expect(wrong.keys).toEqual({ total: 2, correct: 1 });
    const back = applyTypingInput("asdf", wrong.typed, "a", wrong.keys);
    const corrected = applyTypingInput("asdf", back.typed, "as", back.keys);
    expect(corrected.keys).toEqual({ total: 3, correct: 2 });
    expect(calcAccuracy(corrected.keys.correct, corrected.keys.total)).toBe(66.7);
  });
  it("rejects in-place edits that would bypass keystroke scoring", () => {
    expect(applyTypingInput("asdf", "ax", "as", { total: 2, correct: 1 })).toEqual({ typed: "ax", keys: { total: 2, correct: 1 } });
  });
  it("counts correct and incorrect typed characters against the target", () => {
    expect(countCorrect("home row", "home bow")).toEqual({ correct: 7, incorrect: 1 });
  });
  it("treats uppercase and lowercase as different characters", () => {
    expect(countCorrect("A", "a")).toEqual({ correct: 0, incorrect: 1 });
    expect(countCorrect("a", "A")).toEqual({ correct: 0, incorrect: 1 });
    expect(countCorrect("A", "A")).toEqual({ correct: 1, incorrect: 0 });
  });

  it("uses five characters as one standard word", () => {
    expect(calcWpm(250, 60_000)).toBe(50);
    expect(calcWpm(250, 0)).toBe(0);
  });

  it("reports accuracy as a percentage and treats an empty session as 100%", () => {
    expect(calcAccuracy(95, 100)).toBe(95);
    expect(calcAccuracy(0, 0)).toBe(100);
  });

  it("returns net speed, raw speed, accuracy and character counts together", () => {
    expect(computeStats("hello", "hellx", 60_000, { total: 5, correct: 4 })).toEqual({
      wpm: 1,
      rawWpm: 1,
      accuracy: 80,
      correctChars: 4,
      incorrectChars: 1,
    });
  });
});
