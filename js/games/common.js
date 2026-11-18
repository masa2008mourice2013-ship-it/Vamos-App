// Gemeinsame Helfer für die Spiele
import { S, save, award, learnedPairs } from '../store.js';
import { header, ic, esc } from '../ui.js';

export const gameHeader = (title) => header(title, ['#/spiele', 'Alle Spiele']);
export function pairs(min = 8) { return learnedPairs(min); }
export function useRound() {
  if (S.rounds < 1) return false;
  S.rounds--; S.games++; award('game1'); save(); return true;
}
export function noRounds() {
  return `<div class="card pad col" style="gap:10px;align-items:center;text-align:center">
  ${ic('clock', 36, '#FA6D1E')}<span class="h" style="font-size:22px">Keine Spielrunden mehr</span>
  <span class="sm muted">Ein Training bringt dir 3 neue Runden.</span>
  <a href="#/training" class="btn">Jetzt trainieren</a></div>`;
}
export function startScreen(title, text) {
  return `<div class="card pad col" style="gap:10px;text-align:center;align-items:center">
  <span class="h" style="font-size:22px">${esc(title)}</span><span class="sm muted">${esc(text)}</span>
  <span class="xs muted">Kostet 1 Spielrunde · du hast ${S.rounds}</span>
  <button type="button" class="btn" data-act="start">Los geht's!</button></div>`;
}
