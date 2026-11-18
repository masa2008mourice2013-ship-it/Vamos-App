// Saque – Volleyball: richtiges Wort antippen, bevor der Ball landet
import { S, save, award, addCoins, recordAnswer } from '../store.js';
import { esc, playTone, shuffle, refreshCoins } from '../ui.js';
import { gameHeader, pairs, useRound, noRounds } from './common.js';

const heart = (on) => `<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 6-8 11-8 11z" fill="${on ? '#C2185B' : 'none'}" stroke="${on ? '#C2185B' : '#A9B4E8'}" stroke-width="2"/></svg>`;

export function render(root) {
  const vocab = pairs(8);
  const st = { playing: false, over: false, t: 0, rally: 0, lives: 3, q: null, msg: 'Tipp auf „Aufschlag!“ – das kostet 1 Spielrunde.', good: null, started: false };
  let loop = null, wait = null;
  function court() {
    const t = Math.min(st.t, 1);
    const x = (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 150 + t * t * 300;
    const y = (1 - t) * (1 - t) * 230 + 2 * (1 - t) * t * -40 + t * t * 226;
    return `<svg viewBox="0 0 350 300" role="img" aria-label="Volleyballfeld" style="width:100%;height:auto;display:block;border-radius:14px;background:#0B1A6E;border:2px solid #2B3DA3">
<rect x="0" y="250" width="350" height="50" fill="#18288A"/><line x1="0" y1="250" x2="350" y2="250" stroke="#fff" stroke-width="2"/>
<rect x="172" y="150" width="6" height="100" fill="#A9B4E8"/>
<g stroke="#A9B4E8" stroke-width="1" opacity=".7">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="150" y1="${150 + i * 10}" x2="200" y2="${150 + i * 10}"/>`).join('')}${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${150 + i * 10}" y1="150" x2="${150 + i * 10}" y2="220"/>`).join('')}</g>
<rect x="148" y="146" width="54" height="6" rx="2" fill="#fff"/>
<path d="M30 230 Q150 -40 300 250" fill="none" stroke="#A9B4E8" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round" opacity=".6"/>
<g id="ball" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><circle r="24" fill="#fff"/><path d="M-22 -6 q22 -14 44 0 M-20 10 q20 11 40 0 M0 -24 q-11 24 0 48" fill="none" stroke="#FA6D1E" stroke-width="3"/>
<rect x="-60" y="-56" width="120" height="26" rx="6" fill="#FA6D1E"/><text y="-38" text-anchor="middle" font-family="Roboto, sans-serif" font-size="15" font-weight="900" fill="#020124">${esc(st.q ? st.q.es : '¿listo?')}</text></g></svg>`;
  }
  function serve() {
    const p = vocab[Math.floor(Math.random() * vocab.length)];
    const others = shuffle(vocab.filter((x) => x[0] !== p[0])).slice(0, 2).map((x) => x[1]);
    Object.assign(st, { playing: true, over: false, t: 0, q: { es: p[0], de: p[1], options: shuffle([p[1]].concat(others)) } });
    draw();
  }
  function miss(text) {
    playTone(false); recordAnswer(st.q.es, st.q.de, false);
    st.lives--; st.playing = false; st.t = 1; st.good = false;
    if (st.lives <= 0) {
      st.over = true; addCoins(st.rally * 2); refreshCoins();
      if (st.rally > S.records.saque) S.records.saque = st.rally;
      if (st.rally >= 10) award('saque10'); save();
      st.msg = `Spiel vorbei! ${st.rally} Ballwechsel – +${st.rally * 2} Münzen`;
      draw(); return;
    }
    st.msg = text; draw(); wait = setTimeout(serve, 1300);
  }
  function pick(o) {
    if (!st.playing) return;
    if (o === st.q.de) { playTone(true); recordAnswer(st.q.es, st.q.de, true); st.rally++; st.playing = false; st.good = true; st.msg = '¡Punto! ' + st.q.es + ' = ' + st.q.de; draw(); wait = setTimeout(serve, 700); }
    else miss('Daneben! ' + st.q.es + ' = ' + st.q.de);
  }
  loop = setInterval(() => {
    if (!st.playing) return;
    st.t += 50 / (5200 / (1 + st.rally * 0.12));
    if (st.t >= 1) { miss('Aufprall! ' + st.q.es + ' = ' + st.q.de); return; }
    const t = st.t; const x = (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 150 + t * t * 300; const y = (1 - t) * (1 - t) * 230 + 2 * (1 - t) * t * -40 + t * t * 226;
    const b = root.querySelector('#ball'); if (b) b.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    const bar = root.querySelector('#timebar'); if (bar) bar.style.width = Math.round((1 - t) * 100) + '%';
  }, 50);
  function draw() {
    const idle = !st.playing && (!st.q || st.over);
    root.innerHTML = gameHeader('Saque') + `<div class="content" style="gap:12px">
    <div class="g3">
      <div class="card col" style="padding:8px 10px;align-items:center"><span class="xs muted" style="font-weight:700">BALLWECHSEL</span><span class="h" style="font-size:22px">${st.rally}</span></div>
      <div class="card col" style="padding:8px 10px;align-items:center"><span class="xs muted" style="font-weight:700">TEMPO</span><span class="h or" style="font-size:22px">x${(1 + st.rally * 0.12).toFixed(1).replace('.', ',')}</span></div>
      <div class="card col" style="padding:8px 10px;align-items:center"><span class="xs muted" style="font-weight:700">LEBEN</span><div class="row" style="gap:2px;margin-top:3px">${[0, 1, 2].map((i) => heart(i < st.lives)).join('')}</div></div>
    </div>
    ${court()}
    <span aria-live="polite" style="font-weight:700;text-align:center;min-height:20px;color:${st.playing ? '#fff' : st.good === true ? '#3DDC84' : st.good === false ? '#FF6B6B' : '#A9B4E8'}">${esc(st.playing ? 'Was heißt ' + st.q.es + '? Schnell!' : st.msg)}</span>
    ${st.playing ? `<div class="g3">${st.q.options.map((o) => `<button type="button" data-opt="${esc(o)}" style="min-height:56px;border-radius:12px;border:2px solid #2B3DA3;background:#0B1A6E;color:#fff;font-weight:700;font-size:15px;cursor:pointer;padding:4px">${esc(o)}</button>`).join('')}</div>
    <div class="bar"><div id="timebar" style="width:${Math.round((1 - st.t) * 100)}%"></div></div>` : ''}
    ${idle ? (S.rounds < 1 && (!st.started || st.over) ? noRounds() : `<button type="button" class="btn" data-act="start">${st.over ? 'Nochmal spielen' : 'Aufschlag!'}</button>`) : ''}
  </div>`;
  }
  root.onclick = (e) => {
    const a = e.target.closest('[data-act]');
    if (a && a.dataset.act === 'start') { if (useRound()) { playTone(true); st.started = true; Object.assign(st, { rally: 0, lives: 3, good: null, msg: '' }); serve(); } else draw(); return; }
    const o = e.target.closest('[data-opt]'); if (o) pick(o.dataset.opt);
  };
  draw();
  return () => { clearInterval(loop); clearTimeout(wait); };
}
