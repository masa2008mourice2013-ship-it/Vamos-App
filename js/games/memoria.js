// Memoria – Paare aus Deutsch und Spanisch finden
import { S, save, award, addCoins, recordAnswer } from '../store.js';
import { esc, playTone, shuffle, LOGO, refreshCoins } from '../ui.js';
import { gameHeader, pairs, useRound, noRounds, startScreen } from './common.js';

export function render(root) {
  const st = { started: false, deck: [], open: [], matched: [], moves: 0, secs: 0, running: false, won: false, busy: false, best: false };
  function fresh() {
    const p = shuffle(pairs(8)).slice(0, 6); const deck = [];
    p.forEach(([es, de], k) => { deck.push({ id: k, lang: 'DE', text: de, es, de }); deck.push({ id: k, lang: 'ES', text: es, es, de }); });
    Object.assign(st, { deck: shuffle(deck), open: [], matched: [], moves: 0, secs: 0, running: false, won: false, busy: false, best: false });
  }
  const timer = setInterval(() => { if (st.running && !st.won) { st.secs++; const el = root.querySelector('[data-secs]'); if (el) el.textContent = fmt(st.secs); } }, 1000);
  const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  function flip(i) {
    if (st.busy || st.open.includes(i) || st.matched.includes(st.deck[i].id)) return;
    st.running = true;
    const open = st.open.concat(i);
    if (open.length < 2) { st.open = open; draw(); return; }
    st.moves++;
    const [a, b] = open;
    if (st.deck[a].id === st.deck[b].id) {
      playTone(true); st.matched.push(st.deck[a].id); st.open = [];
      recordAnswer(st.deck[a].es, st.deck[a].de, true);
      if (st.matched.length === 6) {
        st.won = true; addCoins(15); refreshCoins();
        if (!S.records.memo || st.secs < S.records.memo) { S.records.memo = st.secs; st.best = true; }
        if (st.secs < 60) award('memo60'); save();
      }
      draw();
    } else {
      st.open = open; st.busy = true; draw();
      setTimeout(() => { st.open = []; st.busy = false; draw(); }, 900);
    }
  }
  function draw() {
    let inner;
    if (!st.started) inner = S.rounds < 1 ? noRounds() : startScreen('Memoria', 'Decke immer zwei Karten auf und finde die Paare aus Deutsch und Spanisch. So schnell wie möglich!');
    else inner = `<div class="g3">
      <div class="card col" style="padding:8px 10px;align-items:center"><span class="xs muted" style="font-weight:700">ZEIT</span><span class="h" style="font-size:22px" data-secs>${fmt(st.secs)}</span></div>
      <div class="card col" style="padding:8px 10px;align-items:center"><span class="xs muted" style="font-weight:700">ZÜGE</span><span class="h" style="font-size:22px">${st.moves}</span></div>
      <div class="card col" style="padding:8px 10px;align-items:center"><span class="xs muted" style="font-weight:700">PAARE</span><span class="h" style="font-size:22px">${st.matched.length}/6</span></div></div>
    <span aria-live="polite" style="font-weight:700;text-align:center;color:${st.won ? '#FA6D1E' : '#A9B4E8'}">${st.won ? `¡Perfecto! Alle Paare gefunden – +15 Münzen${st.best ? ' · neue Bestzeit!' : ''}` : 'Finde die Paare: Deutsch + Spanisch'}</span>
    <div class="g3">${st.deck.map((c, i) => {
      const m = st.matched.includes(c.id); const shown = m || st.open.includes(i);
      return `<button type="button" data-card="${i}" aria-label="${shown ? esc(c.text) : 'Verdeckte Karte ' + (i + 1)}" style="height:92px;border-radius:12px;display:flex;align-items:center;justify-content:center;text-align:center;padding:6px;cursor:pointer;color:#fff;background:${shown && !m ? '#18288A' : '#0B1A6E'};border:2px solid ${m ? '#3DDC84' : shown ? '#FA6D1E' : '#2B3DA3'};${m ? 'opacity:.75' : ''}">${shown ? `<span class="col" style="align-items:center;gap:4px"><span style="font-size:10px;font-weight:900;letter-spacing:1px;color:${c.lang === 'DE' ? '#A9B4E8' : '#FA6D1E'}">${c.lang === 'DE' ? 'DEUTSCH' : 'ESPAÑOL'}</span><span style="font-weight:700;font-size:15px;line-height:1.2">${esc(c.text)}</span></span>` : `<img src="${LOGO}" alt="" style="width:48px;opacity:.9">`}</button>`;
    }).join('')}</div>
    ${st.won ? `<button type="button" class="btn" data-act="again">Nochmal spielen</button>` : ''}`;
    root.innerHTML = gameHeader('Memoria') + `<div class="content">${inner}</div>`;
  }
  root.onclick = (e) => {
    const a = e.target.closest('[data-act]');
    if (a && (a.dataset.act === 'start' || a.dataset.act === 'again')) { if (useRound()) { fresh(); st.started = true; } else st.started = false; draw(); return; }
    const c = e.target.closest('[data-card]'); if (c && st.started && !st.won) flip(+c.dataset.card);
  };
  draw();
  return () => clearInterval(timer);
}
