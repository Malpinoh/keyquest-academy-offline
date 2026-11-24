import { useEffect, useState } from "react";

// Guest progress stored only in this browser's localStorage. All access is guarded:
// unavailable storage (private mode, disabled) or corrupt JSON falls back to defaults.

export type SessionKind = "test" | "lesson" | "game";

export interface Session {
  id: string;
  kind: SessionKind;
  label: string;
  date: string; // ISO
  wpm: number;
  accuracy: number;
  errors: number;
  durationSec: number;
  score?: number;
}

export interface Progress {
  version: 1;
  sessions: Session[];
  lessonsCompleted: string[];
  dailyGoalSessions: number;
}

const KEY = "keyquest.progress.v1";
const EVENT = "keyquest:progress";
const MAX_SESSIONS = 200;

export const emptyProgress = (): Progress => ({
  version: 1,
  sessions: [],
  lessonsCompleted: [],
  dailyGoalSessions: 3,
});

let memoryFallback: Progress | null = null;

export function storageAvailable(): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const t = "__kq_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function isSession(s: unknown): s is Session {
  if (!s || typeof s !== "object") return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o["id"] === "string" &&
    (o["kind"] === "test" || o["kind"] === "lesson" || o["kind"] === "game") &&
    typeof o["label"] === "string" &&
    typeof o["date"] === "string" && Number.isFinite(Date.parse(o["date"])) &&
    typeof o["wpm"] === "number" && Number.isFinite(o["wpm"]) && o["wpm"] >= 0 &&
    typeof o["accuracy"] === "number" && Number.isFinite(o["accuracy"]) && o["accuracy"] >= 0 && o["accuracy"] <= 100 &&
    typeof o["errors"] === "number" && Number.isFinite(o["errors"]) && o["errors"] >= 0 &&
    typeof o["durationSec"] === "number" && Number.isFinite(o["durationSec"]) && o["durationSec"] >= 0
  );
}

export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  try {
    const data = JSON.parse(raw) as Partial<Progress>;
    if (!data || typeof data !== "object") return emptyProgress();
    return {
      version: 1,
      sessions: Array.isArray(data.sessions) ? data.sessions.filter(isSession).slice(-MAX_SESSIONS) : [],
      lessonsCompleted: Array.isArray(data.lessonsCompleted)
        ? [...new Set(data.lessonsCompleted.filter((x): x is string => typeof x === "string"))]
        : [],
      dailyGoalSessions:
        typeof data.dailyGoalSessions === "number" && Number.isFinite(data.dailyGoalSessions) && data.dailyGoalSessions >= 1 && data.dailyGoalSessions <= 20
          ? Math.round(data.dailyGoalSessions)
          : 3,
    };
  } catch {
    return emptyProgress();
  }
}

export function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress();
  if (!storageAvailable()) return memoryFallback ?? emptyProgress();
  try {
    return parseProgress(window.localStorage.getItem(KEY));
  } catch {
    return emptyProgress();
  }
}

/** Returns true if persisted to localStorage, false if only kept in memory. */
export function saveProgress(p: Progress): boolean {
  memoryFallback = p;
  let ok = false;
  if (storageAvailable()) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(p));
      ok = true;
    } catch {
      ok = false;
    }
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
  return ok;
}

export function addSession(s: Omit<Session, "id" | "date">): boolean {
  const p = loadProgress();
  const session: Session = {
    ...s,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
  };
  p.sessions = [...p.sessions, session].slice(-MAX_SESSIONS);
  return saveProgress(p);
}

export function completeLesson(id: string): boolean {
  const p = loadProgress();
  if (!p.lessonsCompleted.includes(id)) p.lessonsCompleted = [...p.lessonsCompleted, id];
  return saveProgress(p);
}

export function setDailyGoal(n: number): boolean {
  const p = loadProgress();
  p.dailyGoalSessions = Math.min(20, Math.max(1, Math.round(n)));
  return saveProgress(p);
}

export function resetProgress(): boolean {
  const ok = saveProgress(emptyProgress());
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(LAST_LESSON_KEY);
      window.localStorage.removeItem("keyquest.adaptive.v1");
    } catch { /* Optional storage; progress was reset in memory. */ }
  }
  return ok;
}

export function bestWpm(p: Progress, kind: SessionKind = "test", label?: string): number {
  return p.sessions
    .filter((s) => s.kind === kind && (!label || s.label === label))
    .reduce((m, s) => Math.max(m, s.wpm), 0);
}

export function sessionsToday(p: Progress, now = new Date()): number {
  const d = now.toDateString();
  return p.sessions.filter((s) => new Date(s.date).toDateString() === d).length;
}

/** Hydration-safe hook: returns null until loaded on the client. */
export function useProgress(): { progress: Progress | null; persistent: boolean } {
  const [state, setState] = useState<{ progress: Progress | null; persistent: boolean }>({
    progress: null,
    persistent: true,
  });
  useEffect(() => {
    const update = () => setState({ progress: loadProgress(), persistent: storageAvailable() });
    update();
    window.addEventListener(EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return state;
}


const LAST_LESSON_KEY = "keyquest.last-lesson.v1";

/** Remembers the learner's most recently opened lesson on this device. */
export function saveLastLesson(id: string): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(LAST_LESSON_KEY, id); } catch { /* storage is optional */ }
}

export function loadLastLesson(): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(LAST_LESSON_KEY); } catch { return null; }
}
