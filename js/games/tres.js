// Tres en raya – Tic-Tac-Toe mit Vokabelfrage
import { S, save, recordAnswer, addCoins } from '../store.js';
import { ic, esc, playTone, shuffle, LOGO, refreshCoins } from '../ui.js';
import { gameHeader, pairs, useRound, noRounds, startScreen } from './common.js';

const X = `<svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#FA6D1E" stroke-width="3.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

export function render(root) {
  const vocab = pairs(8);
  const st = { started: false, board: Array(9).fill(''), phase: 'pick', cell: null, q: null, msg: null, wins: 0, losses: 0 };
  let timer = null;
  const winner = (b) => { for (const [a, c, d] of L) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a]; return b.every((v) => v) ? 'draw' : null; };
  function finish(b) {
    const w = winner(b); if (!w) return false;
    st.board = b; st.phase = 'end';
    if (w === 'X') { playTone(true); st.wins++; S.records.tres++; addCoins(20); refreshCoins(); st.msg = '¡Ganaste! +20 Münzen'; }
    else if (w === 'O') { playTone(false); st.losses++; st.msg = 'José gewinnt diese Runde'; }
    else st.msg = 'Unentschieden – ¡empate!';
    save(); return true;
  }
  function cpu(board) {
    const b = board.slice();
    const find = (m) => { for (const l of L) { const v = l.map((i) => b[i]); if (v.filter((x) => x === m).length === 2 && v.includes('')) return l[v.indexOf('')]; } return null; };
    let i = Math.random() < 0.85 ? find('O') : null;
    if (i === null && Math.random() < 0.8) i = find('X');
    if (i === null && !b[4]) i = 4;
    if (i === null) { const free = b.map((v, k) => (v ? null : k)).filter((k) => k !== null); i = free[Math.floor(Math.random() * free.length)]; }
    b[i] = 'O';
    if (!finish(b)) { st.board = b; st.phase = 'pick'; st.msg = null; }
    draw();
  }
  function ask(i) {
    const p = vocab[Math.floor(Math.random() * vocab.length)];
    const others = shuffle(vocab.filter((x) => x[0] !== p[0])).slice(0, 2).map((x) => x[0]);
    st.phase = 'ask'; st.cell = i; st.q = { de: p[1], es: p[0], options: shuffle([p[0]].concat(others)) };
    draw();
  }
  function answer(o) {
    const { q, cell } = st; const b = st.board.slice();
    const ok = o === q.es; recordAnswer(q.es, q.de, ok); playTone(ok);
    if (ok) { b[cell] = 'X'; if (finish(b)) { draw(); return; } st.board = b; st.msg = '¡Bien! Dein Kreuz sitzt. José überlegt …'; }
    else st.msg = 'Leider nicht: ' + q.de + ' = ' + q.es + '. José ist dran …';
    st.phase = 'cpu'; draw();
    timer = setTimeout(() => cpu(b), 1100);
  }
  function draw() {
    let inner;
    if (!st.started) inner = S.rounds < 1 ? noRounds() : startScreen('Tres en raya', 'Tipp auf ein freies Feld und beantworte die Vokabelfrage. Richtig? Dann landet dein Kreuz. Drei in einer Reihe gewinnen!');
    else inner = `
    <div class="card between" style="padding:10px 14px"><div class="row" style="gap:8px">${X.replace(/54/g, '22')}<b>Du</b></div><span class="h" style="font-size:26px">${st.wins} : ${st.losses}</span><div class="row" style="gap:8px"><b>José</b><img src="${LOGO}" alt="" style="width:28px"></div></div>
    <span aria-live="polite" style="font-weight:700;text-align:center;min-height:20px;color:${st.phase === 'end' ? '#FA6D1E' : '#fff'}">${esc(st.phase === 'ask' ? 'Richtig beantworten – dann landet dein Kreuz!' : st.msg || 'Du bist dran: Tipp auf ein freies Feld.')}</span>
    <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:300px;max-width:100%;align-self:center">
      ${st.board.map((v, i) => `<button type="button" data-cell="${i}" aria-label="Feld ${i + 1}: ${v === 'X' ? 'Kreuz' : v === 'O' ? 'José' : 'frei'}" style="aspect-ratio:1;border-radius:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;background:${i === st.cell && st.phase === 'ask' ? '#18288A' : '#0B1A6E'};border:2px solid ${i === st.cell && st.phase === 'ask' ? '#FA6D1E' : '#2B3DA3'}">${v === 'X' ? X : v === 'O' ? `<img src="${LOGO}" alt="" style="width:70px">` : ''}</button>`).join('')}
    </div>
    ${st.phase === 'ask' ? `<div class="col" style="background:#0B1A6E;border:2px solid #FA6D1E;border-radius:14px;padding:14px;gap:10px"><span class="sm muted">Was heißt auf Spanisch …</span><span class="h" style="font-size:26px">${esc(st.q.de)}</span><div class="g3">${st.q.options.map((o) => `<button type="button" data-opt="${esc(o)}" style="min-height:48px;border-radius:10px;border:2px solid #2B3DA3;background:#020124;color:#fff;font-weight:700;font-size:14px;cursor:pointer;padding:4px">${esc(o)}</button>`).join('')}</div></div>` : ''}
    ${st.phase === 'end' ? `<button type="button" class="btn" data-act="again">Nochmal spielen${S.rounds ? '' : ' (keine Runden)'}</button>` : ''}`;
    root.innerHTML = gameHeader('Tres en raya') + `<div class="content">${inner}</div>`;
  }
  root.onclick = (e) => {
    const a = e.target.closest('[data-act]');
    if (a && a.dataset.act === 'start') { if (useRound()) { st.started = true; draw(); } return; }
    if (a && a.dataset.act === 'again') { if (useRound()) { Object.assign(st, { board: Array(9).fill(''), phase: 'pick', cell: null, q: null, msg: null }); } else st.started = false; draw(); return; }
    const c = e.target.closest('[data-cell]');
    if (c && st.phase === 'pick' && !st.board[+c.dataset.cell]) { ask(+c.dataset.cell); return; }
    const o = e.target.closest('[data-opt]');
    if (o && st.phase === 'ask') answer(o.dataset.opt);
  };
  draw();
  return () => clearTimeout(timer);
}
