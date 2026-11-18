// Seite 5: Trophäen – Glücksrad, Challenge, Spieler, Rezept-Puzzle, Sammelkarten, Abzeichen
import { CITIES, RECIPES, OUTFIT, BADGES } from '../data.js';
import { S, save, racha, currentCity, outfitUnlocked, outfitCounts, recipeUnlocked, daysLeftInWeek, unlocked } from '../store.js';
import { header, ic, jose, esc, LOGO, playTone, refreshCoins, toast } from '../ui.js';
import { avatarSVG, dishInner } from '../art.js';

const ORDER = [4, 1, 3, 5, 7, 0, 2, 6, 8];
const PRIZES = [['10', 'Münzen', 'c10'], ['+1', 'Runde', 'r1'], ['25', 'Münzen', 'c25'], ['Trikot', 'selten', 'shirt'], ['5', 'Münzen', 'c5'], ['+2', 'Runden', 'r2'], ['50', 'Münzen', 'c50'], ['Puzzle', '+1 Teil', 'puz']];
const RARE = [
  { id: 'flamenco', need: () => S.trainings >= 5, needText: 'ab 5 Trainings', reward: () => { S.coins += 50; return '+50 Münzen'; } },
  { id: 'jose', need: () => S.trainings >= 15 || racha() >= 10, needText: 'ab 15 Trainings', reward: () => { S.spins += 1; return '+1 Glücksrad-Dreh'; } },
];

function wheelSVG() {
  let wp = '';
  PRIZES.forEach(([a, b], k) => {
    const a0 = k * 45 * Math.PI / 180, b0 = (k + 1) * 45 * Math.PI / 180, R = 120;
    const fill = k === 3 ? '#C2185B' : k % 2 ? '#FA6D1E' : '#18288A'; const tc = k % 2 && k !== 3 ? '#020124' : '#FFFFFF';
    wp += `<path d="M0 0 L${(R * Math.sin(a0)).toFixed(1)} ${(-R * Math.cos(a0)).toFixed(1)} A${R} ${R} 0 0 1 ${(R * Math.sin(b0)).toFixed(1)} ${(-R * Math.cos(b0)).toFixed(1)} Z" fill="${fill}" stroke="#020124" stroke-width="2"/>`;
    wp += `<g transform="rotate(${k * 45 + 22.5}) translate(0 -80)"><text text-anchor="middle" font-family="Roboto, sans-serif" font-size="17" font-weight="900" fill="${tc}">${a}</text><text y="15" text-anchor="middle" font-family="Roboto, sans-serif" font-size="10" font-weight="700" fill="${tc}">${b}</text></g>`;
  });
  return `<div style="position:relative;width:260px;height:260px;align-self:center">
<svg viewBox="-130 -130 260 260" role="img" aria-label="Glücksrad mit 8 Feldern" style="width:100%;height:100%;display:block"><circle r="128" fill="#FA6D1E"/><g class="wheel-g" id="wheel">${wp}</g><circle r="26" fill="#020124" stroke="#FA6D1E" stroke-width="4"/></svg>
<img src="${LOGO}" alt="" style="position:absolute;left:50%;top:50%;width:44px;transform:translate(-50%,-50%)">
<div style="position:absolute;left:50%;top:-6px;transform:translateX(-50%);border-left:14px solid transparent;border-right:14px solid transparent;border-top:24px solid #fff" aria-hidden="true"></div></div>`;
}

function cityCard(c) {
  const l = S.levels[c.id];
  if (l.stars < 2) return `<div class="scard" style="background:#0B1A6E;border:2px dashed #2B3DA3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#A9B4E8">${ic('lock', 26)}<span style="font-weight:900;font-size:15px">${esc(c.short)}</span><span style="font-size:11px">${unlocked(CITIES.indexOf(c)) ? '2 Sterne holen' : 'noch gesperrt'}</span></div>`;
  const bg = c.boss ? '#C2185B' : '#FA6D1E', tc = c.boss ? '#fff' : '#020124';
  const rating = 60 + l.stars * 8 + Math.min(10, l.done);
  return `<div class="scard" style="background:${bg};color:${tc};padding:10px 12px 18px;display:flex;flex-direction:column;gap:4px;box-shadow:inset 0 0 0 3px #020124, inset 0 0 0 5px ${bg}">
<div class="between" style="align-items:flex-start"><div class="col" style="line-height:1"><span class="h" style="font-size:30px">${rating}</span><span style="font-weight:900;font-size:12px">${c.code}</span></div>${ic('pin', 22)}</div>
<span class="h" style="font-size:19px;text-align:center;margin:6px 0 4px;border-bottom:2px solid currentColor;padding-bottom:4px">${esc(c.short)}</span>
${[['VOC', c.vocab.length], ['EST', l.stars + '/3'], ['DAT', c.facts.length]].map(([k, v]) => `<div class="between" style="font-size:12px;font-weight:700"><span>${k}</span><span style="font-weight:900">${v}</span></div>`).join('')}</div>`;
}
function rareFront(id) {
  if (id === 'flamenco') return `<div class="scard holo" style="background:#C2185B;color:#fff;padding:10px 12px 18px;display:flex;flex-direction:column;gap:4px;box-shadow:inset 0 0 0 3px #020124, inset 0 0 0 5px #C2185B, 0 0 18px rgba(194,24,91,.7)">
<div class="between" style="align-items:flex-start"><div class="col" style="line-height:1"><span class="h" style="font-size:30px">91</span><span style="font-weight:900;font-size:10px;letter-spacing:1px">SELTEN</span></div><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 20 L3 9 q9 -8 18 0 z"/><path d="M12 20 L8 6 M12 20 V5 M12 20 L16 6"/></svg></div>
<span class="h" style="font-size:19px;text-align:center;margin:6px 0 2px;border-bottom:2px solid currentColor;padding-bottom:4px">Flamenco</span>
<span style="font-size:11px;text-align:center">Tanz aus Andalusien</span><span style="font-size:12px;font-weight:900;text-align:center;margin-top:auto">+50 Münzen</span></div>`;
  return `<div class="scard holo" style="background:#020124;color:#fff;padding:10px 12px 18px;display:flex;flex-direction:column;align-items:center;gap:2px;box-shadow:inset 0 0 0 3px #FA6D1E, 0 0 22px rgba(250,109,30,.85)">
<span style="font-weight:900;font-size:10px;letter-spacing:1.5px;color:#FA6D1E">LEGENDÄR</span><img src="${LOGO}" alt="José" style="width:96px"><span class="h or" style="font-size:18px">José de Oro</span><span style="font-size:11px;font-weight:700;text-align:center">+1 Glücksrad-Dreh</span>
<span class="spark" style="left:12px;top:30px"></span><span class="spark" style="right:14px;top:60px;animation-delay:.4s"></span><span class="spark" style="left:22px;bottom:40px;animation-delay:.8s"></span></div>`;
}
function rareCard(r, fresh) {
  if (S.revealed[r.id]) return `<div style="flex:0 0 132px;position:relative" class="${fresh ? 'card-reveal' : ''}">${fresh ? '<div class="card-burst"></div>' : ''}${rareFront(r.id)}</div>`;
  if (!r.need()) return `<div class="scard" style="background:#020124;border:2px dashed #FA6D1E;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#FA6D1E;opacity:.6"><span class="h" style="font-size:44px">?</span><span style="font-size:11px;font-weight:900">${r.id === 'jose' ? 'LEGENDÄR' : 'SELTEN'}</span><span style="font-size:11px;color:#A9B4E8">${r.needText}</span></div>`;
  return `<div style="flex:0 0 132px"><button type="button" class="card-back" data-rare="${r.id}" aria-label="Seltene Karte aufdecken"><span class="h" style="font-size:54px;line-height:1">?</span><span style="font-size:11px;font-weight:900;letter-spacing:1.5px">${r.id === 'jose' ? 'LEGENDÄR' : 'SELTEN'}</span><span style="font-size:11px;font-weight:700;color:#fff">Tippen zum Aufdecken</span></button></div>`;
}

export function render(root) {
  const st = { cat: 'frisur', spinning: false, rot: 0, result: '', fresh: null };

  function nextReward() {
    let best = null;
    OUTFIT.forEach((c) => c.opts.forEach(([, label, , at]) => { if (at > S.trainings && (!best || at < best[1])) best = [c.name + ': ' + label, at]; }));
    return best;
  }
  function puzzleCity() { const cc = currentCity(); if (!recipeUnlocked(cc.id)) return cc; return CITIES.find((c, i) => !recipeUnlocked(c.id) && unlocked(i)) || cc; }

  function draw() {
    const nr = nextReward();
    const pc = puzzleCity(); const pl = S.levels[pc.id]; const rec = RECIPES[pc.recipe];
    const [open, total] = outfitCounts();
    const order = ['frisur', 'haar', 'brille', 'band', 'trikot', 'hose', 'schuhe', 'extra'].map((id) => OUTFIT.find((c) => c.id === id));
    const cur = OUTFIT.find((c) => c.id === st.cat);
    const catBtn = (c) => `<button type="button" class="chip ${st.cat === c.id ? 'on' : ''}" data-cat="${c.id}" aria-pressed="${st.cat === c.id}" style="width:100%;min-height:44px;border-radius:10px;padding:0 6px;font-size:12px">${c.name}</button>`;
    const weekDone = S.week.correct >= 30;
    const freshRare = RARE.filter((r) => r.need() && !S.revealed[r.id]).length;
    const line = S.spins > 0 ? `Du hast ${S.spins === 1 ? 'einen Dreh' : S.spins + ' Drehs'} am Glücksrad! Und dein Puzzle „${rec.name}“ hat schon ${pl.pieces} von 9 Teilen.` : `Trainier weiter – jedes Training bringt dir einen Dreh am Glücksrad und ein Puzzleteil!`;

    root.innerHTML = header('Trophäen') + `<div class="content" style="gap:22px">
  ${jose(esc(line))}
  ${nr ? `<div style="background:#FA6D1E;color:#020124;border-radius:14px;padding:14px;display:flex;align-items:center;gap:14px">
    <div style="width:54px;height:54px;border-radius:50%;background:#020124;color:#FA6D1E;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('trophy', 28)}</div>
    <div class="col" style="flex:1;gap:6px"><span class="label" style="font-weight:900">Nächste Belohnung</span><span class="h" style="font-size:20px;line-height:1.1">${esc(nr[0])}</span>
    <div style="height:8px;background:rgba(2,1,36,.25);border-radius:4px;overflow:hidden"><div style="width:${Math.round(S.trainings / nr[1] * 100)}%;height:100%;background:#020124"></div></div>
    <span class="xs" style="font-weight:700">noch ${nr[1] - S.trainings} ${nr[1] - S.trainings === 1 ? 'Training' : 'Trainings'}</span></div></div>` : ''}

  <div class="col" style="gap:12px">
    <div class="between"><span class="h" style="font-size:22px">Glücksrad</span><span class="xs muted">${S.spins === 1 ? '1 Dreh verfügbar' : S.spins + ' Drehs verfügbar'}</span></div>
    ${wheelSVG()}
    <span aria-live="polite" id="wres" style="text-align:center;font-weight:900;font-size:17px;min-height:22px;color:#FA6D1E">${esc(st.result)}</span>
    <button type="button" class="btn ${S.spins > 0 ? '' : 'off'}" data-act="spin" ${S.spins > 0 ? '' : 'disabled'}>${S.spins > 0 ? 'Drehen!' : 'Nächster Dreh nach dem Training'}</button>
  </div>

  <div class="card pad col" style="gap:10px">
    <div class="row"><div style="width:50px;height:50px;border-radius:12px;background:#18288A;display:flex;align-items:center;justify-content:center;flex-shrink:0">${ic('chest', 30, '#FA6D1E')}</div>
    <div class="col" style="flex:1"><span class="label or">Wochen-Challenge</span><span class="h" style="font-size:20px;line-height:1.15">30 richtige Antworten</span></div></div>
    <div class="between sm"><span class="muted">${daysLeftInWeek() ? 'noch ' + daysLeftInWeek() + ' Tage' : 'letzter Tag!'}</span><span style="font-weight:900">${Math.min(30, S.week.correct)} / 30</span></div>
    <div class="bar" style="height:10px"><div style="width:${Math.min(100, Math.round(S.week.correct / 30 * 100))}%"></div></div>
    ${weekDone && !S.week.claimed ? '<button type="button" class="btn" data-act="chest">Schatztruhe öffnen!</button>' : `<span class="sm muted">${S.week.claimed ? 'Truhe geöffnet – nächste Woche gibt es eine neue!' : 'Belohnung: eine Schatztruhe mit Münzen und einem Extra-Dreh'}</span>`}
  </div>

  <div class="card pad col" style="gap:10px">
    <div class="between"><span class="h" style="font-size:22px">Duell der Woche</span><span class="xs or" style="font-weight:700">kommt bald</span></div>
    <span class="sm muted">Bald kann Mama auf ihrem eigenen Handy mitspielen – wer sammelt mehr XP? Euer Familien-Code ist schon reserviert.</span>
    <a href="#/profil" class="btn2">Profile &amp; Familien-Code ${ic('arrow', 18, 'currentColor', 2.6)}</a>
  </div>

  <div class="col" style="gap:12px">
    <div class="between"><span class="h" style="font-size:22px">Dein Spieler</span><span class="xs muted">${open} von ${total} Teilen freigeschaltet</span></div>
    <div class="between" style="gap:8px;align-items:center">
      <div class="col" style="gap:8px;width:92px">${order.slice(0, 4).map(catBtn).join('')}</div>
      <div style="flex-shrink:0">${avatarSVG(S.outfit, 150)}</div>
      <div class="col" style="gap:8px;width:92px">${order.slice(4).map(catBtn).join('')}</div>
    </div>
    <div class="g2" style="gap:8px">${cur.opts.map(([val, label, col, at]) => {
      const un = outfitUnlocked(cur.id, val, at); const on = S.outfit[cur.id] === val;
      return `<button type="button" data-opt="${esc(val)}" ${un ? '' : 'disabled'} aria-pressed="${on}" style="min-height:52px;border-radius:10px;display:flex;align-items:center;gap:10px;padding:6px 10px;text-align:left;cursor:${un ? 'pointer' : 'default'};${!un ? 'background:transparent;border:1px dashed #2B3DA3;color:#A9B4E8' : on ? 'background:#FA6D1E;border:2px solid #FA6D1E;color:#020124' : 'background:#020124;border:2px solid #2B3DA3;color:#fff'}">
        <span style="width:22px;height:22px;border-radius:50%;flex-shrink:0;${col === 'none' ? 'border:2px dashed currentColor' : `background:${col};border:2px solid ${on ? '#020124' : '#2B3DA3'}`};${un ? '' : 'opacity:.4'}"></span>
        <span class="col"><span style="font-size:13px;font-weight:700">${esc(label)}</span><span style="font-size:10px;font-weight:700;opacity:.8">${!un ? 'ab Training ' + at : on ? 'trägst du' : 'freigeschaltet'}</span></span></button>`;
    }).join('')}</div>
  </div>

  <div class="col" style="gap:10px">
    <div class="between"><span class="h" style="font-size:22px">Rezept-Puzzle</span><span class="xs muted">${pl.pieces} von 9 Teilen</span></div>
    <div class="card pad col" style="gap:12px">
      <div class="col"><span class="label or">${esc(pc.short)} · Gericht</span><span class="h" style="font-size:20px">${esc(rec.name)}</span></div>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;width:252px;align-self:center">${[...Array(9)].map((_, i) => {
        const r = Math.floor(i / 3), c = i % 3;
        return `<div style="position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;background:#0B1A6E;border:1px solid #2B3DA3">${ORDER.indexOf(i) < pl.pieces ? `<svg viewBox="${c * 100} ${r * 100} 100 100" aria-hidden="true" style="position:absolute;inset:0;width:100%;height:100%">${dishInner(pc.recipe)}</svg>` : `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#A9B4E8">${ic('lock', 18)}<span style="font-size:11px;font-weight:700">Teil ${i + 1}</span></div>`}</div>`;
      }).join('')}</div>
      <span class="sm muted">Jedes Training ${pc.id === 'start' ? 'im Start-Level' : 'in ' + esc(pc.short)} deckt ein Teil auf, 3 Sterne decken alles auf. Ist das Bild komplett, bekommst du das Rezept – mit Zutaten und Schritten auf Spanisch.</span>
    </div>
    <div class="col" style="gap:8px">${Object.entries(RECIPES).map(([id, r]) => recipeUnlocked(r.city)
      ? `<a href="#/rezept/${id}" class="card row" style="padding:12px 14px;color:#fff;text-decoration:none;border:2px solid #FA6D1E">${ic('pot', 26, '#FA6D1E')}<span class="col" style="flex:1"><span class="label or">Freigeschaltet${S.cooked[id] ? ' · gekocht' : ''}</span><span style="font-weight:900;font-size:16px">${esc(r.name)}</span></span>${ic('arrow', 20, '#A9B4E8')}</a>`
      : `<div class="card row" style="padding:12px 14px;color:#A9B4E8">${ic('lock', 22)}<span class="col" style="flex:1"><span style="font-weight:700;color:#fff">${esc(r.name)}</span><span class="xs">Puzzle ${S.levels[r.city].pieces}/9</span></span></div>`).join('')}</div>
  </div>

  <div class="col" style="gap:10px">
    <div class="between"><span class="h" style="font-size:22px">Sammelkarten</span><span class="xs ${freshRare ? 'or' : 'muted'}" style="font-weight:700">${freshRare ? freshRare + (freshRare === 1 ? ' neue Karte!' : ' neue Karten!') + ' · wischen' : 'wischen'}</span></div>
    <div class="scards">${CITIES.filter((c) => c.id !== 'start').map((c, k) => cityCard(c) + (k === 0 ? rareCard(RARE[0], st.fresh === 'flamenco') : k === 2 ? rareCard(RARE[1], st.fresh === 'jose') : '')).join('')}</div>
  </div>

  <div class="col" style="gap:10px"><span class="h" style="font-size:22px">Abzeichen · ${Object.keys(S.badges).length} von ${BADGES.length}</span>
    <div class="g4">${BADGES.map(([id, i, l]) => { const on = !!S.badges[id]; return `<div class="col" style="align-items:center;gap:6px;text-align:center"><div style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;${on ? 'background:#18288A;border:2px solid #FA6D1E' : 'background:#0B1A6E;border:1px dashed #2B3DA3'}">${ic(on ? i : 'lock', 24, on ? '#FA6D1E' : '#A9B4E8')}</div><span style="font-size:11px;font-weight:700;${on ? '' : 'color:#A9B4E8'}">${l}</span></div>`; }).join('')}</div>
  </div>
</div>`;
    const w = root.querySelector('#wheel'); if (w) { w.style.transition = 'none'; w.style.transform = `rotate(${st.rot}deg)`; }
  }

  function spin() {
    if (st.spinning || S.spins < 1) return;
    const k = Math.floor(Math.random() * 8);
    st.rot = st.rot - (st.rot % 360) + 360 * 5 + (360 - (k * 45 + 22.5));
    st.spinning = true; S.spins--; save();
    const w = root.querySelector('#wheel'); w.style.transition = ''; void w.getBoundingClientRect(); w.style.transform = `rotate(${st.rot}deg)`;
    const btn = root.querySelector('[data-act="spin"]'); btn.disabled = true; btn.textContent = 'Dreht …';
    setTimeout(() => {
      const p = PRIZES[k][2]; let txt = '';
      if (p[0] === 'c') { const n = +p.slice(1); S.coins += n; txt = n + ' Münzen'; }
      if (p === 'r1' || p === 'r2') { const n = +p[1]; S.rounds += n; txt = n + (n === 1 ? ' Extra-Spielrunde' : ' Extra-Spielrunden'); }
      if (p === 'puz') { const pc = puzzleCity(); S.levels[pc.id].pieces = Math.min(9, S.levels[pc.id].pieces + 1); txt = '1 Puzzleteil'; }
      if (p === 'shirt') { if (!S.bonusItems.includes('trikot:carmesi')) { S.bonusItems.push('trikot:carmesi'); txt = 'Seltenes Trikot Carmesí!'; } else { S.coins += 30; txt = '30 Münzen (Trikot hast du schon)'; } }
      save(); playTone(true); refreshCoins();
      st.spinning = false; st.result = '¡Premio! ' + txt; draw();
    }, 3300);
  }

  root.onclick = (e) => {
    const a = e.target.closest('[data-act]');
    if (a && a.dataset.act === 'spin') { spin(); return; }
    if (a && a.dataset.act === 'chest') { S.week.claimed = true; S.coins += 50; S.spins += 1; save(); playTone(true); refreshCoins(); toast('¡Tesoro! +50 Münzen und ein Extra-Dreh'); draw(); return; }
    const c = e.target.closest('[data-cat]'); if (c) { st.cat = c.dataset.cat; draw(); return; }
    const o = e.target.closest('[data-opt]'); if (o && !o.disabled) { S.outfit[st.cat] = o.dataset.opt; save(); draw(); return; }
    const r = e.target.closest('[data-rare]');
    if (r) { const rr = RARE.find((x) => x.id === r.dataset.rare); S.revealed[rr.id] = true; const txt = rr.reward(); save(); playTone(true); refreshCoins(); st.fresh = rr.id; draw(); toast('¡Carta nueva! ' + txt); }
  };
  draw();
}
