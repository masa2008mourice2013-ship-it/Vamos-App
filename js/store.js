// ¡Vamos! – Spielstand: wird im Browser des Handys gespeichert (localStorage)
import { CITIES, OUTFIT } from './data.js';

const KEY = 'vamos-state-v1';

function fresh() {
  const levels = {};
  CITIES.forEach((c) => { levels[c.id] = { stars: 0, done: 0, pieces: 0 }; });
  return {
    v: 1, name: 'Mourice', xp: 0, coins: 0, rounds: 3, spins: 1, trainings: 0, days: [],
    levels, words: {}, mistakes: [], own: [], maxCombo: 0,
    week: { id: weekId(), correct: 0, claimed: false },
    outfit: { frisur: 'kurz', haar: '#2A1A14', brille: 'keine', band: 'keins', trikot: 'basic', hose: 'standard', schuhe: 'keine', extra: 'nichts' },
    bonusItems: [], revealed: {}, cooked: {}, badges: {}, records: { saque: 0, snake: 0, memo: 0, tres: 0 },
    games: 0, lastGreet: '', famCode: 'VAMOS-' + String(Math.floor(1000 + Math.random() * 9000)), hadMistakes: false,
  };
}

export let S = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = Object.assign(fresh(), JSON.parse(raw));
      CITIES.forEach((c) => { if (!s.levels[c.id]) s.levels[c.id] = { stars: 0, done: 0, pieces: 0 }; });
      if (s.week.id !== weekId()) s.week = { id: weekId(), correct: 0, claimed: false };
      return s;
    }
  } catch (e) { /* ignore */ }
  return fresh();
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* voll */ } }
export function resetAll() { S = fresh(); save(); }

// ---------- Datum ----------
export function today() { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function dayNum(s) { const [y, m, d] = s.split('-').map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); }
export function weekId() {
  const d = new Date(); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const n = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - n);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return t.getUTCFullYear() + '-W' + Math.ceil(((t - y0) / 864e5 + 1) / 7);
}
export function daysLeftInWeek() { const n = new Date().getDay() || 7; return 7 - n; }

// Racha: Lerntage in Folge – Pausen von bis zu 2 Tagen sind erlaubt (passt zu Mo/Mi/Fr)
export function racha() {
  if (!S.days.length) return 0;
  const nums = [...new Set(S.days)].map(dayNum).sort((a, b) => b - a);
  if (dayNum(today()) - nums[0] > 3) return 0;
  let n = 1;
  for (let i = 1; i < nums.length; i++) { if (nums[i - 1] - nums[i] <= 3) n++; else break; }
  return n;
}
export function bestRacha() {
  const nums = [...new Set(S.days)].map(dayNum).sort((a, b) => a - b);
  let best = 0, cur = 0, prev = null;
  nums.forEach((x) => { cur = prev !== null && x - prev <= 3 ? cur + 1 : 1; best = Math.max(best, cur); prev = x; });
  return best;
}
export function lastSevenDays() {
  const out = []; const set = new Set(S.days); const names = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    out.push({ label: i === 0 ? 'heute' : names[d.getDay()], on: set.has(k), today: i === 0 });
  }
  return out;
}

// ---------- Level ----------
export const nivel = () => Math.floor(S.xp / 200) + 1;
export const nivelProgress = () => (S.xp % 200) / 200;
export function unlocked(i) { return i === 0 || S.levels[CITIES[i - 1].id].stars >= 2; }
export function currentIndex() {
  for (let i = 0; i < CITIES.length; i++) { if (unlocked(i) && S.levels[CITIES[i].id].stars < 2) return i; }
  return CITIES.length - 1;
}
export const currentCity = () => CITIES[currentIndex()];
export function recipeUnlocked(cityId) { const l = S.levels[cityId]; return l && (l.pieces >= 9 || l.stars >= 3); }

// ---------- Wörter ----------
export function wordStat(es) { if (!S.words[es]) S.words[es] = { c: 0, w: 0, run: 0, seen: 0 }; return S.words[es]; }
export function allPairs() {
  const m = new Map();
  CITIES.forEach((c) => c.vocab.forEach(([es, de]) => m.set(es, de)));
  S.own.forEach(([es, de]) => m.set(es, de));
  return m;
}
export function learnedPairs(min = 8) {
  const all = allPairs();
  let list = [...all.entries()].filter(([es]) => S.words[es] && S.words[es].seen > 0);
  if (list.length < min) {
    const extra = currentCity().vocab.concat(CITIES[0].vocab).filter(([es]) => !list.some((p) => p[0] === es));
    list = list.concat(extra).slice(0, Math.max(min, list.length));
  }
  return list;
}
export function knownCount() { return Object.values(S.words).filter((w) => w.c >= 2).length; }
export function recordAnswer(es, de, ok) {
  const w = wordStat(es); w.seen++;
  if (ok) {
    w.c++; w.run++;
    if (w.run >= 2 && S.mistakes.some((m) => m[0] === es)) { S.mistakes = S.mistakes.filter((m) => m[0] !== es); if (!S.mistakes.length && S.hadMistakes) award('cleanbox'); }
    S.week.correct++;
  } else {
    w.w++; w.run = 0; S.hadMistakes = true;
    if (!S.mistakes.some((m) => m[0] === es)) S.mistakes.unshift([es, de]);
  }
  save();
}

// ---------- Belohnungen ----------
export function addXP(n) { S.xp += n; save(); }
export function addCoins(n) { S.coins += n; save(); }
export function award(id) { if (!S.badges[id]) { S.badges[id] = today(); save(); return true; } return false; }

export function finishTraining(cityId, correct, total, combo) {
  const ratio = total ? correct / total : 0;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
  const l = S.levels[cityId] || (S.levels[cityId] = { stars: 0, done: 0, pieces: 0 });
  const before = l.stars;
  l.stars = Math.max(l.stars, stars); l.done++;
  l.pieces = l.stars >= 3 ? 9 : Math.min(9, l.pieces + 1);
  const xp = correct * 10 + 20;
  S.xp += xp; S.coins += 10; S.rounds += 3; S.spins += 1; S.trainings++;
  S.maxCombo = Math.max(S.maxCombo, combo);
  if (!S.days.includes(today())) S.days.push(today());
  award('first');
  if (racha() >= 5) award('racha5');
  if (racha() >= 10) award('racha10');
  if (S.maxCombo >= 10) award('combo10');
  if (knownCount() >= 50) award('words50');
  if (knownCount() >= 100) award('words100');
  if (cityId === 'pamplona' && stars >= 2) award('boss');
  save();
  return { stars, xp, newStars: l.stars > before, unlockedNext: before < 2 && l.stars >= 2 };
}

export function outfitUnlocked(cat, val, at) {
  return S.trainings >= at || S.bonusItems.includes(cat + ':' + val);
}
export function outfitCounts() {
  let total = 0, open = 0;
  OUTFIT.forEach((c) => c.opts.forEach((o) => { total++; if (outfitUnlocked(c.id, o[0], o[3])) open++; }));
  return [open, total];
}

// Fotos (eigene Rezeptfotos) separat speichern
export function savePhoto(id, dataUrl) { try { localStorage.setItem('vamos-photo-' + id, dataUrl); return true; } catch (e) { return false; } }
export function getPhoto(id) { try { return localStorage.getItem('vamos-photo-' + id); } catch (e) { return null; } }
