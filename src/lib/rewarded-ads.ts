/**
 * Provider-neutral rewarded-ad boundary.
 *
 * KeyQuest intentionally ships with no provider registered. Register the approved
 * Google H5 Games Ads adapter here only after Google grants access and the
 * production publisher configuration is available.
 */
export type RewardedAdPlacement =
  | "space-extra-life"
  | "racer-retry"
  | "word-pop-extra-life"
  | "key-challenge-extra-life"
  | "typing-bonus-practice";

export type RewardedAdResult = "completed" | "skipped" | "unavailable" | "error";

export interface RewardedAdProvider {
  isReady(placement: RewardedAdPlacement): boolean;
  show(placement: RewardedAdPlacement): Promise<RewardedAdResult>;
}

let provider: RewardedAdProvider | null = null;

export function registerRewardedAdProvider(nextProvider: RewardedAdProvider | null) {
  provider = nextProvider;
}

export function isRewardedAdReady(placement: RewardedAdPlacement) {
  return provider?.isReady(placement) ?? false;
}

export async function showRewardedAd(placement: RewardedAdPlacement): Promise<RewardedAdResult> {
  if (!provider || !provider.isReady(placement)) return "unavailable";
  try {
    return await provider.show(placement);
  } catch {
    return "error";
  }
}
