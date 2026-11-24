// Original short passages written for KeyQuest Academy.
export const PASSAGES: string[] = [
  "A good typist does not rush. They keep their fingers relaxed, eyes on the screen, and let each key arrive in its own time.",
  "The lighthouse keeper wrote a short note every evening, listing the ships she had seen and the color of the sky at dusk.",
  "Practice for ten focused minutes and you will often learn more than in an hour of distracted, hurried tapping.",
  "Our school garden grew tomatoes, beans, and one enormous sunflower that leaned toward the library window every afternoon.",
  "When you make a mistake, pause, fix it calmly, and continue. Accuracy builds the habits that speed is later made from.",
  "The night train hummed through quiet valleys while passengers read, slept, or watched the small lights of distant farms.",
  "Bring a notebook, two pencils, a bottle of water, and a curious mind. The museum tour begins at nine sharp.",
  "Every keyboard has small bumps on the F and J keys so your index fingers can find home without looking down.",
  "She built a tiny robot from spare parts, and it learned to sort socks by color faster than anyone in the house.",
  "Rain tapped softly on the roof as the class compared notes about volcanoes, glaciers, and the slow work of rivers.",
  "Strong posture helps: feet flat, shoulders loose, wrists floating just above the keys, and the screen at eye level.",
  "The bakery opens early, so the smell of warm bread drifts down the street long before the first bus arrives.",
];

export function buildTestText(durationSec: number, seed = Math.random()): string {
  const order = [...PASSAGES.keys()];
  let s = seed;
  for (let i = order.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  // Aim for more text than a fast typist can finish (~140 WPM).
  const target = Math.max(200, Math.ceil((durationSec / 60) * 140 * 5));
  const parts: string[] = [];
  let len = 0;
  let k = 0;
  while (len < target) {
    const p = PASSAGES[order[k % order.length]!]!;
    parts.push(p);
    len += p.length + 1;
    k++;
  }
  return parts.join(" ");
}
