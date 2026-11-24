import { beforeEach, describe, expect, it, vi } from "vitest";
import { addSession, bestWpm, completeLesson, loadProgress, parseProgress, resetProgress, sessionsToday, setDailyGoal } from "./progress";

describe("parseProgress", () => {
  it("returns empty progress for corrupt JSON", () => {
    const p = parseProgress("{not json");
    expect(p.sessions).toEqual([]);
    expect(p.dailyGoalSessions).toBe(3);
  });
  it("drops malformed sessions and keeps valid ones", () => {
    const raw = JSON.stringify({ sessions: [{ id: "a", kind: "test", label: "Test", date: "2026-01-01", wpm: 40, accuracy: 95, errors: 2, durationSec: 60 }, { id: 1 }], lessonsCompleted: ["home-row", 5] });
    const p = parseProgress(raw);
    expect(p.sessions).toHaveLength(1);
    expect(p.lessonsCompleted).toEqual(["home-row"]);
  });
  it("rejects an out-of-range daily goal", () => {
    expect(parseProgress(JSON.stringify({ dailyGoalSessions: 99 })).dailyGoalSessions).toBe(3);
  });
});

describe("local practice persistence", () => {
  beforeEach(() => { vi.restoreAllMocks(); window.localStorage.clear(); resetProgress(); });
  it("saves recent sessions and computes the best only from tests", () => {
    addSession({ kind: "test", label: "15-second typing test", wpm: 32, accuracy: 95, errors: 1, durationSec: 15 });
    addSession({ kind: "game", label: "Space Mission", wpm: 99, accuracy: 100, errors: 0, durationSec: 10 });
    expect(loadProgress().sessions).toHaveLength(2);
    expect(bestWpm(loadProgress())).toBe(32);
    expect(sessionsToday(loadProgress())).toBe(2);
  });
  it("saves lesson completion once even after a retry", () => {
    completeLesson("home-row-basics"); completeLesson("home-row-basics");
    expect(loadProgress().lessonsCompleted).toEqual(["home-row-basics"]);
  });
  it("persists the daily goal and clears all practice records on reset", () => {
    setDailyGoal(5); completeLesson("home-row-basics");
    expect(loadProgress().dailyGoalSessions).toBe(5);
    resetProgress();
    expect(loadProgress()).toEqual({ version: 1, sessions: [], lessonsCompleted: [], dailyGoalSessions: 3 });
  });
  it("keeps a session in memory if localStorage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage disabled"); });
    expect(addSession({ kind: "test", label: "Test", wpm: 20, accuracy: 90, errors: 1, durationSec: 15 })).toBe(false);
    expect(loadProgress().sessions.at(-1)?.wpm).toBe(20);
  });
  it("rejects broken numeric data and invalid dates", () => {
    expect(parseProgress(JSON.stringify({ sessions: [{ id: "a", kind: "test", label: "Test", date: "bad", wpm: -1, accuracy: 200, errors: 0, durationSec: 15 }] })).sessions).toEqual([]);
  });
});
