export type ActivitySource = "lesson" | "game" | "test";
export interface Weakness { pattern: string; expected: string; actual: string; count: number; lastSeen: string; lastSource: ActivitySource; }
export interface TrainingRecord { id: string; patterns: string[]; accuracy: number; passed: boolean; date: string; }
interface AdaptiveState { version: 1; weaknesses: Weakness[]; training: TrainingRecord[]; }
const KEY = "keyquest.adaptive.v1";
const empty = (): AdaptiveState => ({ version: 1, weaknesses: [], training: [] });
export function loadAdaptiveState(): AdaptiveState {
  if (typeof window === "undefined") return empty();
  try { const value = JSON.parse(localStorage.getItem(KEY) || "null"); if (value?.version === 1 && Array.isArray(value.weaknesses) && Array.isArray(value.training)) return value; } catch { /* optional local storage */ }
  return empty();
}
function save(state: AdaptiveState) { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private browsing or storage limits */ } }
export function recordTypingMistake(expected: string, actual: string, source: ActivitySource) {
  if (typeof window === "undefined" || !expected || !actual || expected.toLowerCase() === actual.toLowerCase()) return;
  const state = loadAdaptiveState();
  const pattern = expected.toLowerCase();
  const existing = state.weaknesses.find(item => item.pattern === pattern && item.actual === actual.toLowerCase());
  if (existing) { existing.count += 1; existing.lastSeen = new Date().toISOString(); existing.lastSource = source; }
  else state.weaknesses.push({ pattern, expected: pattern, actual: actual.toLowerCase(), count: 1, lastSeen: new Date().toISOString(), lastSource: source });
  state.weaknesses = state.weaknesses.sort((a,b) => b.count-a.count).slice(0,40);
  save(state);
  window.dispatchEvent(new Event("keyquest:adaptive"));
}

/** Rank unique target keys by their combined mistake count, not by individual wrong-key variants. */
export function getPriorityWeaknesses(limit = 5) {
  const grouped = new Map<string, Weakness>();
  for (const item of loadAdaptiveState().weaknesses) {
    if (item.count < 1) continue;
    const key = item.pattern.toLowerCase();
    const current = grouped.get(key);
    if (current) {
      current.count += item.count;
      if (item.lastSeen > current.lastSeen) {
        current.lastSeen = item.lastSeen;
        current.lastSource = item.lastSource;
        current.actual = item.actual;
      }
    } else {
      grouped.set(key, { ...item, pattern: key, expected: key });
    }
  }
  return [...grouped.values()]
    .filter(item => item.count >= 2)
    .sort((a,b) => b.count-a.count || b.lastSeen.localeCompare(a.lastSeen))
    .slice(0,limit);
}
export function recordTrainingResult(patterns: string[], accuracy: number, passed: boolean) {
  const state = loadAdaptiveState();
  const uniquePatterns = [...new Set(patterns.map(pattern => pattern.toLowerCase()))];
  state.training = [{ id: Date.now().toString(36), patterns: uniquePatterns, accuracy, passed, date: new Date().toISOString() }, ...state.training].slice(0,100);
  if (passed) state.weaknesses = state.weaknesses.map(item => uniquePatterns.includes(item.pattern) ? { ...item, count: Math.max(0, item.count - 2) } : item).filter(item => item.count > 0);
  save(state);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("keyquest:adaptive"));
}

const PRACTICE_WORDS = [
  "about","after","again","along","answer","artist","basic","best","better","bright",
  "bring","build","calm","care","carry","cause","clear","close","come","correct",
  "create","daily","dance","early","earth","easy","enjoy","every","exact","extra",
  "fast","first","focus","follow","found","friend","game","garden","gentle","great",
  "group","happy","hard","have","heart","help","home","hope","house","idea",
  "inside","just","keep","kind","know","large","learn","least","left","letter",
  "light","little","live","look","make","many","match","matter","meaning","might",
  "minute","more","move","music","never","new","next","night","number","often",
  "once","open","order","other","over","paper","part","people","place","plain",
  "play","point","power","practice","press","quick","quiet","read","ready","real",
  "right","round","safe","same","school","screen","second","see","sentence","seven",
  "shape","share","short","show","simple","since","skill","small","smart","smooth",
  "sound","space","speak","speed","spell","start","state","steady","step","still",
  "stone","story","study","such","sure","table","take","task","teach","team",
  "tell","than","thank","their","there","these","thing","think","three","time",
  "today","together","touch","train","travel","tree","true","type","under","until",
  "use","usual","value","very","voice","wait","walk","want","water","way",
  "well","what","when","where","which","while","white","whole","will","with",
  "word","work","write","year","yes","young","zero","zone","jump","jazz","queen","box","six","quiz"
];

/** Build a varied word drill that practises each weak key without repeating one matching word. */
export function buildAdaptivePrompt(patterns: string[], count = 24) {
  const alphabet = [...new Set(patterns.map(pattern => pattern.toLowerCase()).filter(Boolean))];
  if (!alphabet.length) alphabet.push("e","t","a","o");
  const candidates = new Map(alphabet.map(key => [
    key,
    PRACTICE_WORDS.filter(word => word.includes(key)),
  ]));
  const used = new Map<string, number>();
  const words: string[] = [];
  for (let index = 0; index < count; index++) {
    const key = alphabet[index % alphabet.length]!;
    const options = candidates.get(key) ?? [];
    const cursor = used.get(key) ?? 0;
    let word = options.length ? options[cursor % options.length]! : key;
    if (word === words[words.length - 1] && options.length > 1) word = options[(cursor + 1) % options.length]!;
    used.set(key, cursor + 1);
    words.push(word);
  }
  return words.join(" ");
}
export function shouldOfferTraining() { return getPriorityWeaknesses(3).length > 0; }
