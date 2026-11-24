import type { HTMLAttributes } from "react";

export function ClassroomArtwork({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`relative overflow-hidden bg-[#d9d3b6] ${className}`}
      role="img"
      aria-label="KeyQuest typing instructor in a classroom"
      {...props}
    >
      <img
        src="https://images.unsplash.com/photo-1758874384359-dc7644cb2be4?auto=format&fit=crop&fm=jpg&q=85&w=1200"
        alt="KeyQuest typing instructor"
        className="h-full w-full object-cover object-center"
        loading="eager"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent px-5 pb-4 pt-12">
        <p className="font-display text-sm font-black tracking-[.14em] text-white drop-shadow-md sm:text-base">MEET YOUR INSTRUCTOR</p>
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
