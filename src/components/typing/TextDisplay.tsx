import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  target: string;
  typed: string;
  focused: boolean;
  className?: string;
}

/** Per-character highlighting: correct, incorrect, pending, with a caret. */
export function TextDisplay({ target, typed, focused, className }: Props) {
  const caretRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    caretRef.current?.scrollIntoView({ block: "nearest" });
  }, [typed.length]);

  // Render a window around the caret for performance on long texts.
  const start = Math.max(0, target.lastIndexOf(" ", Math.max(0, typed.length - 120)) + 1);
  const end = Math.min(target.length, typed.length + 400);
  const chars = [];
  for (let i = start; i < end; i++) {
    const ch = target[i];
    const t = typed[i];
    const state = i < typed.length ? (t === ch ? "ok" : "bad") : "todo";
    const isCaret = i === typed.length;
    chars.push(
      <span
        key={i}
        ref={isCaret ? caretRef : undefined}
        className={cn(
          "relative",
          state === "ok" && "text-success",
          state === "bad" && "rounded-sm bg-destructive/15 text-destructive underline decoration-2",
          state === "todo" && "text-muted-foreground",
        )}
      >
        {isCaret && focused && <span className="caret-blink absolute -left-px top-[0.1em] h-[1.2em] w-0.5 bg-primary" aria-hidden="true" />}
        {ch === " " && state === "bad" ? "·" : ch}
      </span>,
    );
  }
  return (
    <div className={cn("max-h-48 overflow-hidden font-mono text-lg leading-relaxed sm:text-2xl sm:leading-relaxed", className)}>
      {chars}
    </div>
  );
}
