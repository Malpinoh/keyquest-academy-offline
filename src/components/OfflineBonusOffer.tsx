import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

type OfflineBonusOfferProps = {
  rewardDescription: string;
  onReward: () => void;
  className?: string;
};

/** Optional local practice bonus. This component never contacts an ad provider or network. */
export function OfflineBonusOffer({ rewardDescription, onReward, className = "" }: OfflineBonusOfferProps) {
  return (
    <div className={`mt-4 rounded-xl border border-amber-300/25 bg-amber-300/10 p-3 text-left text-white ${className}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-300/15 text-amber-200">
          <Gift className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">Optional practice bonus</p>
          <p className="mt-1 text-xs leading-5 text-slate-200">{rewardDescription}</p>
          <Button type="button" size="sm" onClick={onReward} className="mt-3 bg-amber-300 font-bold text-slate-950 hover:bg-amber-200">
            Unlock bonus
          </Button>
          <p className="mt-2 text-[11px] leading-5 text-amber-100/80">Available locally. No advertisement or internet connection is required.</p>
        </div>
      </div>
    </div>
  );
}
