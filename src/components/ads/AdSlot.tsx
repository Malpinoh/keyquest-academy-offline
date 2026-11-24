import type { HTMLAttributes } from "react";

/**
 * Central AdSense configuration.
 * Keep the publisher ID empty until KeyQuest is approved and an account is created.
 * After approval, set VITE_ADSENSE_CLIENT and per-placement VITE_ADSENSE_SLOT_* values.
 */
export const ADSENSE_CONFIG = {
  publisherId: import.meta.env.VITE_ADSENSE_CLIENT ?? "",
  enabled: false,
} as const;

type AdSlotProps = HTMLAttributes<HTMLDivElement> & {
  placement: "home-top" | "home-middle" | "lessons-list" | "progress-summary" | "article-inline";
  format?: "horizontal" | "rectangle" | "auto";
};

const slotLabels: Record<AdSlotProps["placement"], string> = {
  "home-top": "Home page — top",
  "home-middle": "Home page — middle",
  "lessons-list": "Lessons page",
  "progress-summary": "Progress page",
  "article-inline": "Guide article",
};

/**
 * Reserved responsive space for a future responsive AdSense display unit.
 * No ad request is made until the site has an approved AdSense account and real unit IDs.
 */
export function AdSlot({ placement, format = "auto", className = "", ...props }: AdSlotProps) {
  // Do not render empty ad boxes before the site has an approved account and live ad units.
  if (!ADSENSE_CONFIG.enabled || !ADSENSE_CONFIG.publisherId) return null;

  return (
    <aside
      aria-label={`Advertisement space: ${slotLabels[placement]}`}
      data-ad-placement={placement}
      className={`mx-auto w-full max-w-[1100px] px-4 sm:px-6 ${className}`}
      {...props}
    >
      <div
        className={[
          "relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#aaa58e] bg-[#f4f0df]/70 text-center dark:border-[#65715f] dark:bg-[#263329]/60",
          format === "horizontal" ? "min-h-[100px] sm:min-h-[120px] lg:min-h-[120px]" :
          format === "rectangle" ? "min-h-[250px] max-w-[336px]" :
          "min-h-[100px] sm:min-h-[180px] lg:min-h-[250px]",
        ].join(" ")}
      >
        <div className="px-4 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#777b68] dark:text-[#b9c2ae]">Advertisement</p>
          <p className="mt-1 text-xs text-[#8a8b7b] dark:text-[#aab5a2]">Ad space reserved · {slotLabels[placement]}</p>
        </div>
      </div>
    </aside>
  );
}
