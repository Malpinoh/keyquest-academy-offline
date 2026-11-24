import { cn } from "@/lib/utils";

export type Finger = "LP" | "LR" | "LM" | "LI" | "RI" | "RM" | "RR" | "RP" | "TH";

export const FINGER_NAMES: Record<Finger, string> = {
  LP: "left pinky", LR: "left ring", LM: "left middle", LI: "left index",
  RI: "right index", RM: "right middle", RR: "right ring", RP: "right pinky", TH: "thumb",
};

type Key = { k: string; label?: string; f?: Finger; width?: number; sub?: string };

const LETTER_ROWS: { keys: Key[]; indent: string }[] = [
  {
    indent: "0%",
    keys: "qwertyuiop".split("").map((k, i) => ({
      k, f: (["LP", "LR", "LM", "LI", "LI", "RI", "RI", "RM", "RR", "RP"] as Finger[])[i],
    })),
  },
  {
    indent: "3.5%",
    keys: "asdfghjkl;".split("").map((k, i) => ({
      k, f: (["LP", "LR", "LM", "LI", "LI", "RI", "RI", "RM", "RR", "RP"] as Finger[])[i],
    })),
  },
  {
    indent: "7%",
    keys: "zxcvbnm,./".split("").map((k, i) => ({
      k, f: (["LP", "LR", "LM", "LI", "LI", "RI", "RI", "RM", "RR", "RP"] as Finger[])[i],
    })),
  },
];

const NUMBER_KEYS: Key[] = [
  { k: "`", label: "` ~", width: 0.86 },
  ...("1234567890".split("").map((k, i) => ({ k, label: `${k} ${"!@#$%^&*()"[i]}`, width: 0.86, f: (["LP", "LR", "LM", "LI", "LI", "RI", "RI", "RM", "RR", "RP"] as Finger[])[i] }))),
  { k: "-", label: "- _", width: 0.86 }, { k: "=", label: "= +", width: 0.86 }, { k: "Backspace", width: 1.85 },
];

export function fingerFor(ch: string): Finger | null {
  const c = ch.toLowerCase();
  if (c === " ") return "TH";
  for (const row of LETTER_ROWS) for (const key of row.keys) if (key.k === c) return key.f ?? null;
  return null;
}

interface Props {
  highlight?: string[];
  next?: string | null;
  className?: string;
}

export function VirtualKeyboard({ highlight = [], next = null, className }: Props) {
  const n = next?.toLowerCase() ?? null;
  const targets = highlight.map((key) => key.toLowerCase());

  const renderKey = (key: Key, index: number) => {
    const isNext = n === key.k.toLowerCase();
    const isTarget = targets.includes(key.k.toLowerCase());
    const isHome = key.k === "f" || key.k === "j";
    return (
      <div
        key={`${key.k}-${index}`}
        className={cn(
          "relative flex h-9 min-w-0 flex-1 flex-col items-center justify-center rounded-md border border-key-edge border-b-[3px] bg-key px-0.5 font-mono text-[11px] font-semibold text-foreground shadow-sm transition-[background-color,border-color,transform,box-shadow] duration-150 sm:h-11 sm:rounded-lg sm:text-sm",
          isTarget && "bg-accent text-accent-foreground",
          isNext && "z-10 -translate-y-0.5 border-primary bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30",
        )}
        style={{ flexGrow: key.width ?? 1, flexBasis: 0 }}
        aria-hidden="true"
      >
        <span className="leading-none">{key.label ?? key.k.toUpperCase()}</span>
        {key.sub && <span className="mt-0.5 text-[8px] font-normal opacity-60">{key.sub}</span>}
        {isHome && <span className="absolute bottom-1 h-0.5 w-2 rounded-full bg-current/50 sm:w-3" />}
      </div>
    );
  };

  const renderModifier = (label: string, width: number, key: string) => (
    <div key={key} className="flex h-9 items-center justify-center rounded-md border border-key-edge border-b-[3px] bg-key px-1 font-sans text-[9px] font-medium text-muted-foreground shadow-sm sm:h-11 sm:rounded-lg sm:px-2 sm:text-[11px]" style={{ flex: width }}>
      {label}
    </div>
  );

  return (
    <div className={cn("select-none rounded-2xl border bg-muted/40 p-2.5 sm:p-4", className)} aria-label="QWERTY keyboard diagram">
      <div className="overflow-x-auto pb-1">
        <div className="mx-auto flex min-w-[510px] max-w-3xl flex-col gap-1.5 sm:gap-2">
          <div className="flex gap-1 sm:gap-1.5">
            {NUMBER_KEYS.map(renderKey)}
          </div>
          <div className="flex gap-1 sm:gap-1.5">
            {renderModifier("Tab", 1.45, "tab")}
            {LETTER_ROWS[0].keys.map(renderKey)}
            {renderModifier("\\", 1.45, "backslash")}
          </div>
          <div className="flex gap-1 sm:gap-1.5" style={{ paddingLeft: "2.7%" }}>
            {renderModifier("Caps", 1.8, "caps")}
            {LETTER_ROWS[1].keys.map(renderKey)}
            {renderModifier("Enter", 1.8, "enter")}
          </div>
          <div className="flex gap-1 sm:gap-1.5" style={{ paddingLeft: "5.4%" }}>
            {renderModifier("Shift", 2.35, "left-shift")}
            {LETTER_ROWS[2].keys.map(renderKey)}
            {renderModifier("Shift", 2.35, "right-shift")}
          </div>
          <div className="flex gap-1 sm:gap-1.5">
            {renderModifier("Ctrl", 1.25, "ctrl")}
            {renderModifier("Fn", 1, "fn")}
            {renderModifier("Win", 1.1, "win")}
            {renderModifier("Alt", 1.1, "alt")}
            <div
              className={cn(
                "flex h-9 items-center justify-center rounded-md border border-key-edge border-b-[3px] bg-key font-sans text-[10px] font-medium text-muted-foreground shadow-sm transition-colors sm:h-11 sm:rounded-lg sm:text-xs",
                n === " " && "border-primary bg-primary text-primary-foreground ring-2 ring-primary/30",
              )}
              style={{ flex: 5.2 }}
            >
              space
            </div>
            {renderModifier("Alt", 1.1, "altgr")}
            {renderModifier("Ctrl", 1.25, "right-ctrl")}
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground sm:text-xs">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-accent" /> Lesson keys</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-primary" /> Next key</span>
        <span>Small bars mark the F and J home positions</span>
      </div>
    </div>
  );
}
