// Serpiente – Snake: Buchstaben des spanischen Worts in der richtigen Reihenfolge fressen
import { S, save, addCoins, recordAnswer } from '../store.js';
import { esc, playTone, shuffle, refreshCoins, ic } from '../ui.js';
import { gameHeader, pairs, useRound, noRounds, startScreen } from './common.js';

const N = 14;
const delay = (words, idx) => Math.max(170, 420 - words * 25 - idx * 4); // langsam starten, allmählich schneller
const ABC = 'ABCDEFGHIJLMNOPRSTUVÑÁÉÍÓÚ';
const heart = (on) => `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 6-8 11-8 11z" fill="${on ? '#C2185B' : 'none'}" stroke="${on ? '#C2185B' : '#A9B4E8'}" stroke-width="2"/></svg>`;

export function render(root) {
  const vocab = shuffle(pairs(8));
  let wi = 0;
  const st = { started: false, running: false, over: false, snake: [], dir: [1, 0], next: [1, 0], items: [], word: null, letters: [], idx: 0, lives: 3, words: 0, grow: 0, msg: '' };
  let loop = null, cv = null, ctx = null;

  function newWord() {
    const [es, de] = vocab[wi % vocab.length]; wi++;
    st.word = { es, de }; st.letters = es.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑ]/g, '').split(''); st.idx = 0;
    placeItems();
  }
  function free() {
    let p; let tries = 0;
    do { p = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; tries++; }
    while (tries < 500 && (st.snake.some((s) => s[0] === p[0] && s[1] === p[1]) || st.items.some((i) => i.x === p[0] && i.y === p[1]) || (Math.abs(p[0] - st.snake[0][0]) + Math.abs(p[1] - st.snake[0][1]) < 3)));
    return p;
  }
  function placeItems() {
    st.items = [];
    const need = st.letters[st.idx];
    const decoys = shuffle(ABC.split('').filter((c) => c !== need)).slice(0, 3);
    [need].concat(decoys).forEach((ch) => { const [x, y] = free(); st.items.push({ x, y, ch }); });
  }
  function resetSnake() { st.snake = [[5, 7], [4, 7], [3, 7]]; st.dir = [1, 0]; st.next = [1, 0]; }
  function loseLife(text) {
    playTone(false); st.lives--; st.msg = text;
    if (st.lives <= 0) {
      st.running = false; st.over = true;
      if (st.words > S.records.snake) S.records.snake = st.words;
      addCoins(st.words * 3); refreshCoins(); save();
      st.msg = `Spiel vorbei! ${st.words} ${st.words === 1 ? 'Wort' : 'Wörter'} – +${st.words * 3} Münzen`;
      draw(); return;
    }
    resetSnake(); placeItems(); hud();
  }
  function step() {
    if (!st.running) return;
    st.dir = st.next;
    const h = [st.snake[0][0] + st.dir[0], st.snake[0][1] + st.dir[1]];
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || st.snake.some((s) => s[0] === h[0] && s[1] === h[1])) { loseLife('Autsch! Wand oder Schwanz erwischt.'); paint(); return; }
    st.snake.unshift(h);
    const hit = st.items.findIndex((i) => i.x === h[0] && i.y === h[1]);
    if (hit >= 0) {
      const ch = st.items[hit].ch;
      if (ch === st.letters[st.idx]) {
        st.idx++; st.grow++;
        if (st.idx >= st.letters.length) {
          playTone(true); st.words++; addCoins(2); refreshCoins(); recordAnswer(st.word.es, st.word.de, true);
          st.msg = '¡Olé! ' + st.word.de + ' = ' + st.word.es; newWord();
        } else { st.msg = ''; placeItems(); }
        clearInterval(loop); loop = setInterval(step, delay(st.words, st.idx));
        hud();
      } else {
        st.items.splice(hit, 1);
        loseLife(`Falscher Buchstabe! Gesucht war ${st.letters[st.idx]}.`);
      }
    }
    if (st.grow > 0) st.grow--; else st.snake.pop();
    paint();
  }
  function paint() {
    if (!ctx) return;
    const s = cv.width / N;
    ctx.fillStyle = '#0B1A6E'; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.strokeStyle = '#18288A'; ctx.lineWidth = 1;
    for (let i = 1; i < N; i++) { ctx.beginPath(); ctx.moveTo(i * s, 0); ctx.lineTo(i * s, cv.height); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, i * s); ctx.lineTo(cv.width, i * s); ctx.stroke(); }
    const rr = (x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); ctx.fill(); };
    st.items.forEach((it) => {
      ctx.fillStyle = '#FFFFFF'; rr(it.x * s + 2, it.y * s + 2, s - 4, s - 4, s * 0.2);
      ctx.fillStyle = '#020124'; ctx.font = `900 ${Math.round(s * 0.6)}px Roboto, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(it.ch, it.x * s + s / 2, it.y * s + s / 2 + 1);
    });
    st.snake.forEach((p, k) => { ctx.fillStyle = k === 0 ? '#FA6D1E' : (k % 2 ? '#FF8F52' : '#FA6D1E'); rr(p[0] * s + 1, p[1] * s + 1, s - 2, s - 2, k === 0 ? s * 0.35 : s * 0.22); });
    if (st.snake.length) {
      const [hx, hy] = st.snake[0]; ctx.fillStyle = '#020124';
      const ex = st.dir[0] !== 0 ? [hx * s + s / 2 + st.dir[0] * s * 0.18] : [hx * s + s * 0.3, hx * s + s * 0.7];
      const ey = st.dir[1] !== 0 ? [hy * s + s / 2 + st.dir[1] * s * 0.18] : [hy * s + s * 0.3, hy * s + s * 0.7];
      (st.dir[0] !== 0 ? ey.map((y) => [ex[0], y]) : ex.map((x) => [x, ey[0]])).forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, s * 0.09, 0, 7); ctx.fill(); });
    }
  }
  function slots() {
    return st.letters.map((ch, i) => `<span style="min-width:26px;height:34px;padding:0 3px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:17px;${i < st.idx ? 'background:#FA6D1E;color:#020124' : i === st.idx ? 'border:2px solid #FA6D1E;color:#FA6D1E' : 'border:2px solid #2B3DA3'}">${i < st.idx ? ch : i === st.idx ? '?' : ''}</span>`).join('');
  }
  function hud() {
    const h = root.querySelector('#hud'); if (!h) return;
    h.innerHTML = `<div class="between"><div class="col"><span class="xs muted">Friss das spanische Wort für …</span><span class="h" style="font-size:24px;line-height:1.1">${esc(st.word.de)}</span></div>
      <div class="col" style="align-items:flex-end;gap:4px"><div class="row" style="gap:2px">${[0, 1, 2].map((i) => heart(i < st.lives)).join('')}</div><span class="xs muted" style="font-weight:700">Wörter: ${st.words}</span></div></div>
      <div class="row" style="gap:4px;justify-content:center;flex-wrap:wrap" aria-label="Fortschritt">${slots()}</div>
      <span aria-live="polite" class="sm" style="text-align:center;min-height:18px;font-weight:700;color:#A9B4E8">${esc(st.msg)}</span>`;
  }
  const dbtn = (d, path, label) => `<button type="button" data-dir="${d}" aria-label="${label}" style="width:64px;height:52px;border-radius:12px;border:1px solid #2B3DA3;background:#0B1A6E;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${path}"/></svg></button>`;
  function draw() {
    if (!st.started || st.over) {
      root.innerHTML = gameHeader('Serpiente') + `<div class="content">${st.over ? `<div class="card pad col" style="gap:10px;align-items:center;text-align:center"><span class="h" style="font-size:22px">${esc(st.msg)}</span><span class="sm muted">Rekord: ${S.records.snake} Wörter</span></div>` : ''}
      ${S.rounds < 1 ? noRounds() : startScreen('Serpiente', 'Steuere die Schlange mit den Pfeilen oder durch Wischen. Friss die Buchstaben des spanischen Worts in der richtigen Reihenfolge. Falscher Buchstabe oder Wand = ein Leben weg.')}</div>`;
      return;
    }
    root.innerHTML = gameHeader('Serpiente') + `<div class="content" style="gap:10px">
      <div id="hud" class="col" style="gap:8px"></div>
      <canvas id="cv" width="700" height="700" role="img" aria-label="Spielfeld" style="width:100%;max-width:400px;align-self:center;aspect-ratio:1;border-radius:14px;border:2px solid #2B3DA3;touch-action:none"></canvas>
      <div class="col" style="align-items:center;gap:6px">${dbtn('0,-1', 'M12 5l-7 8h14z', 'Nach oben')}<div class="row" style="gap:6px">${dbtn('-1,0', 'M5 12l8-7v14z', 'Nach links')}${dbtn('0,1', 'M12 19l-7-8h14z', 'Nach unten')}${dbtn('1,0', 'M19 12l-8-7v14z', 'Nach rechts')}</div></div>
    </div>`;
    cv = root.querySelector('#cv'); ctx = cv.getContext('2d');
    let sx = 0, sy = 0;
    cv.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    cv.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) > 20) turn(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)]); });
    hud(); paint();
  }
  function turn(d) { if (d[0] === -st.dir[0] && d[1] === -st.dir[1]) return; st.next = d; }
  const key = (e) => { const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]; if (m && st.running) { e.preventDefault(); turn(m); } };
  window.addEventListener('keydown', key);
  root.onclick = (e) => {
    const a = e.target.closest('[data-act]');
    if (a && a.dataset.act === 'start') {
      if (!useRound()) { draw(); return; }
      Object.assign(st, { started: true, over: false, running: true, lives: 3, words: 0, grow: 0, msg: '' });
      resetSnake(); newWord(); draw();
      clearInterval(loop); loop = setInterval(step, delay(0, 0)); return;
    }
    const d = e.target.closest('[data-dir]'); if (d) turn(d.dataset.dir.split(',').map(Number));
  };
  draw();
  return () => { clearInterval(loop); window.removeEventListener('keydown', key); };
}
