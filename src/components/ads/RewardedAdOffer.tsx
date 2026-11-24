import { useState } from "react";
import { Gift, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isRewardedAdReady, showRewardedAd, type RewardedAdPlacement } from "@/lib/rewarded-ads";

type RewardedAdOfferProps = {
  placement: RewardedAdPlacement;
  rewardDescription: string;
  onReward: () => void;
  className?: string;
};

export function RewardedAdOffer({ placement, rewardDescription, onReward, className = "" }: RewardedAdOfferProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const ready = isRewardedAdReady(placement);

  const claim = async () => {
    if (!ready || loading) return;
    setLoading(true);
    setMessage("");
    const result = await showRewardedAd(placement);
    setLoading(false);
    if (result === "completed") {
      onReward();
      setMessage("Reward unlocked. It will be applied to your next attempt.");
    } else if (result === "skipped") {
      setMessage("No reward was granted because the ad was not completed.");
    } else {
      setMessage("The ad is unavailable right now. You can continue without it.");
    }
  };

  return (
    <div className={`mt-4 rounded-xl border border-amber-300/25 bg-amber-300/10 p-3 text-left text-white ${className}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-300/15 text-amber-200">
          {ready ? <Gift className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold">Optional reward</p>
          <p className="mt-1 text-xs leading-5 text-slate-200">{rewardDescription}</p>
          {ready ? (
            <Button type="button" size="sm" disabled={loading} onClick={claim} className="mt-3 bg-amber-300 font-bold text-slate-950 hover:bg-amber-200">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Loading ad…" : "Watch ad for reward"}
            </Button>
          ) : (
            <p className="mt-2 text-[11px] leading-5 text-amber-100/80">Rewarded ads are not connected yet. This option will activate only after KeyQuest receives access to an approved ad provider. You can always play again without an ad.</p>
          )}
          {message && <p role="status" aria-live="polite" className="mt-2 text-xs font-semibold text-amber-100">{message}</p>}
        </div>
      </div>
    </div>
  );
}
