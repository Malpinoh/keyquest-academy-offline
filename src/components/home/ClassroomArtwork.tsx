import type { HTMLAttributes } from "react";

export function ClassroomArtwork({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative isolate flex min-h-[240px] items-center justify-center overflow-hidden bg-gradient-to-br from-[#d9d3b6] via-[#b9c4a4] to-[#71856b] ${className}`}
      role="img"
      aria-label="Illustrated KeyQuest learning room with a desk, keyboard and screen"
      {...props}
    >
      <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#f5e7ad]/60 blur-2xl" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-[#6e765a]/35" />
      <div className="relative z-10 w-[78%] max-w-[420px] rounded-2xl border-[10px] border-[#46543e] bg-[#f4f0df] p-3 shadow-2xl">
        <div className="flex aspect-[16/9] items-center justify-center rounded-lg bg-gradient-to-br from-[#263c34] to-[#637a61]">
          <div className="text-center text-[#f4f0df]">
            <div className="font-mono text-xs uppercase tracking-[.25em] text-[#e4ce70]">KEYQUEST</div>
            <div className="mt-2 text-2xl font-black sm:text-3xl">Learn by doing.</div>
            <div className="mt-1 text-xs text-white/80">One key at a time</div>
          </div>
        </div>
        <div className="mx-auto h-4 w-1/3 bg-[#46543e]" />
        <div className="mx-auto h-2 w-1/2 rounded-b-lg bg-[#46543e]" />
      </div>
      <div className="absolute bottom-5 left-[8%] z-20 hidden -rotate-6 rounded-xl border border-[#8c7544] bg-[#f4f0df] p-3 shadow-lg sm:block">
        <div className="grid grid-cols-4 gap-1">
          {["A","S","D","F","J","K","L",";"].map((key) => <span key={key} className="grid h-7 w-7 place-items-center rounded border border-[#8c7544] bg-[#e4ce70] font-mono text-xs font-bold text-[#46543e]">{key}</span>)}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#1d2b22]/85 to-transparent px-5 pb-4 pt-12">
        <p className="font-display text-sm font-black tracking-[.14em] text-white drop-shadow-md sm:text-base">YOUR PRACTICE ROOM</p>
        <p className="mt-1 text-xs font-semibold text-white/90 drop-shadow-md">Friendly guidance, one lesson at a time.</p>
      </div>
    </div>
  );
}

export function FingerGuideArtwork({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      role="img"
      aria-label="Separate two-hand finger placement guide"
      {...props}
    >
      <div className="mx-auto flex max-w-[300px] items-end justify-center gap-5 py-3">
        <div className="flex items-end gap-1.5">
          {["A", "S", "D", "F"].map((key, i) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="grid h-8 w-8 place-items-center rounded-lg border-2 border-[#8c7544] bg-[#e4ce70] text-[10px] font-black text-[#46543e]">{key}</div>
              <span className="h-10 w-2.5 rounded-full bg-[#a66c4d]" style={{ height: 32 + i * 7 }} />
            </div>
          ))}
        </div>
        <div className="h-10 w-px bg-[#b7ae8e]" />
        <div className="flex items-end gap-1.5">
          {["J", "K", "L", ";"].map((key, i) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="grid h-8 w-8 place-items-center rounded-lg border-2 border-[#8c7544] bg-[#e4ce70] text-[10px] font-black text-[#46543e]">{key}</div>
              <span className="w-2.5 rounded-full bg-[#a66c4d]" style={{ height: 32 + (3 - i) * 7 }} />
            </div>
          ))}
        </div>
      </div>
      <p className="text-center text-[10px] font-extrabold tracking-[.12em] text-[#56634b]">FINGER PLACEMENT GUIDE</p>
    </div>
  );
}
