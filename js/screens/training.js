// Seite 2: Training (Lernkarten mit gemischten Abfrage-Arten)
import { CITIES } from '../data.js';
import { S, save, unlocked, currentCity, allPairs, recordAnswer, finishTraining, recipeUnlocked } from '../store.js';
import { header, ic, jose, LOGO, esc, playTone, speak, canSpeak, shuffle, refreshCoins, stars } from '../ui.js';

const strip = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = (s) => s.toLowerCase().replace(/[¿¡!?.,]/g, '').replace(/\s+/g, ' ').trim();
const noArt = (s) => s.replace(/^(el|la|los|las|un|una|der|die|das)\s+/, '');

function mistakesBox() {
  const list = S.mistakes.slice(0, 6);
  return `<div style="background:#FA6D1E;color:#020124;border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:10px">
  <div class="between"><div class="row" style="gap:8px">${ic('cards', 20, '#020124')}<span style="font-weight:900;font-size:17px">Fehlerkiste</span></div><span class="sm" style="font-weight:700">${S.mistakes.length} zum Wiederholen</span></div>
  ${list.length ? list.map(([es, de]) => `<div class="between" style="padding:10px 12px;border-radius:10px;background:#020124"><span class="muted">${esc(de)}</span><span style="font-weight:700;color:#fff">${esc(es)}</span></div>`).join('') : '<span class="sm" style="font-weight:700">Leer – ¡perfecto! Keine Fehler offen.</span>'}
  ${S.mistakes.length >= 4 ? `<a href="#/training/fehler" style="min-height:48px;border:2px solid #020124;border-radius:12px;color:#020124;font-weight:900;display:flex;align-items:center;justify-content:center;text-decoration:none">Fehler nochmal üben</a>` : S.mistakes.length ? '<span class="xs" style="font-weight:700">Ab 4 Wörtern kannst du die Fehlerkiste extra üben.</span>' : ''}
</div>`;
}

function picker(root) {
  const cur = currentCity();
  const levels = CITIES.map((c, i) => ({ c, i, open: unlocked(i), lv: S.levels[c.id] }));
  root.innerHTML = header('Training') + `<div class="content">
  <a href="#/scannen" class="row" style="padding:10px 14px;min-height:52px;border-radius:12px;border:2px dashed #FA6D1E;color:#fff;text-decoration:none">${ic('cam', 26, '#FA6D1E')}<span class="col" style="flex:1"><span style="font-weight:900;font-size:15px">Vokabeln scannen</span><span class="xs muted">Liste aus Buch oder Heft abfotografieren</span></span>${ic('arrow', 20, '#FA6D1E')}</a>
  ${jose(`Heute empfehle ich dir: <b style="display:inline;color:#C2185B;letter-spacing:0;text-transform:none;font-size:14px">${esc(cur.boss ? cur.short : cur.name)}</b>. Oder such dir ein Level aus!`)}
  <a href="#/training/${cur.id}" class="btn">${esc(cur.boss ? 'Endboss starten' : cur.name + ' starten')} ${ic('arrow', 22, 'currentColor', 3)}</a>
  <div class="col" style="gap:8px">
    <span class="label muted">Alle Level</span>
    ${levels.map(({ c, open, lv }) => open
      ? `<a href="#/training/${c.id}" class="card row" style="padding:10px 14px;min-height:56px;color:#fff;text-decoration:none;${c.id === cur.id ? 'border:2px solid #FA6D1E' : ''}"><span class="col" style="flex:1"><span class="xs muted">${esc(c.unidad)}${c.id === S.school ? ' · <b style="color:#FA6D1E">Klasse ist hier</b>' : ''}</span><span style="font-weight:900">${esc(c.boss ? c.short + ' · ' + c.name : c.name)}</span></span><span>${stars(lv.stars)}</span></a>`
      : `<div class="card row" style="padding:10px 14px;min-height:56px;border-style:dashed;color:#A9B4E8">${ic('lock', 20)}<span class="col" style="flex:1"><span class="xs">${esc(c.unidad)}</span><span style="font-weight:700">${esc(c.boss ? c.short + ' · ' + c.name : c.name)}</span></span><span class="xs">2 Sterne im Level davor</span></div>`).join('')}
    ${S.own.length >= 4 ? `<a href="#/training/own" class="card row" style="padding:10px 14px;min-height:56px;color:#fff;text-decoration:none">${ic('cam', 20, '#FA6D1E')}<span class="col" style="flex:1"><span class="xs muted">Gescannt</span><span style="font-weight:900">Eigene Liste · ${S.own.length} Wörter</span></span>${ic('arrow', 18, '#A9B4E8')}</a>` : ''}
  </div>
  ${mistakesBox()}
</div>`;
}

export function render(root, params) {
  const lvl = params[0];
  if (!lvl) { picker(root); return; }
  let pool, label, cityId = null;
  if (lvl === 'fehler') { pool = S.mistakes.slice(); label = 'Fehlerkiste'; }
  else if (lvl === 'own') { pool = S.own.slice(); label = 'Eigene Liste'; }
  else {
    const i = CITIES.findIndex((c) => c.id === lvl);
    if (i < 0 || !unlocked(i)) { picker(root); return; }
    const c = CITIES[i]; cityId = c.id; label = c.boss ? 'Endboss · ' + c.short : c.unidad.split(' · ')[0];
    pool = c.vocab.concat(S.own.filter(([es]) => (S.ownTarget || {})[es] === c.id));
  }
  if (pool.length < 4) { picker(root); return; }

  const all = [...allPairs().entries()];
  let modes = S.direction === 'de-es' ? ['mc', 'type', 'mc'] : S.direction === 'es-de' ? ['mcr', 'card', 'listen'] : ['mc', 'mcr', 'card', 'type', 'listen'];
  if (!canSpeak()) modes = modes.filter((m) => m !== 'listen');
  if (S.typing === false) modes = modes.filter((m) => m !== 'type');
  if (!modes.length) modes = ['mc'];
  let list = shuffle(pool); while (list.length < S.qcount && pool.length) list = list.concat(shuffle(pool));
  const items = list.slice(0, S.qcount || 12).map(([es, de], k) => ({ es, de, mode: modes[k % modes.length] }));
  const st = { i: 0, answered: false, ok: false, picked: null, flipped: false, typed: '', note: '', combo: 0, correct: 0, done: false, result: null };

  function opts(item, toDe) {
    const others = shuffle(all.filter(([es]) => es !== item.es)).slice(0, 3);
    return shuffle([[item.es, item.de]].concat(others)).map(([es, de]) => (toDe ? de : es));
  }
  items.forEach((it) => { if (it.mode === 'mc') it.opts = opts(it, false); if (it.mode === 'mcr' || it.mode === 'listen') it.opts = opts(it, true); });

  function answer(ok, picked) {
    const it = items[st.i];
    st.answered = true; st.ok = ok; st.picked = picked;
    if (ok) { st.correct++; st.combo++; } else st.combo = 0;
    recordAnswer(it.es, it.de, ok);
    playTone(ok);
    draw();
  }
  function next() {
    st.i++; st.answered = false; st.picked = null; st.flipped = false; st.typed = ''; st.note = '';
    if (st.i >= items.length) {
      st.done = true;
      if (cityId) st.result = finishTraining(cityId, st.correct, items.length, st.combo);
      else { S.xp += st.correct * 10; S.rounds += 1; save(); st.result = { stars: 0, xp: st.correct * 10 }; }
      refreshCoins();
      playTone(true);
    }
    draw();
  }

  function question(it) {
    const prompt = { mc: 'Was heißt auf Spanisch …', mcr: 'Was heißt auf Deutsch …', listen: 'Hör zu: Was bedeutet das?', type: 'Schreib auf Spanisch …', card: 'Kennst du dieses Wort?' }[it.mode];
    const word = it.mode === 'mc' || it.mode === 'type' ? it.de : it.mode === 'listen' ? '' : it.es;
    let body = '';
    if (it.mode === 'mc' || it.mode === 'mcr' || it.mode === 'listen') {
      const right = it.mode === 'mc' ? it.es : it.de;
      body = `<div class="col" style="gap:10px">${it.opts.map((o) => {
        let cls = 'opt', m = '';
        if (st.answered && o === right) { cls += ' ok'; m = '✓ richtig'; } else if (st.answered && o === st.picked) { cls += ' bad'; m = '✕ leider nicht'; }
        return `<button type="button" class="${cls}" data-pick="${esc(o)}"><span>${esc(o)}</span><span class="m">${m}</span></button>`;
      }).join('')}</div>`;
    } else if (it.mode === 'type') {
      body = `<div class="col" style="gap:10px">
        <input class="inp" id="typed" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Spanisches Wort" value="${esc(st.typed)}" ${st.answered ? 'disabled' : ''}>
        <div class="acc">${['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡'].map((a) => `<button type="button" data-acc="${a}" ${st.answered ? 'disabled' : ''}>${a}</button>`).join('')}</div>
        ${st.answered ? '' : '<button type="button" class="btn" data-act="check">Prüfen</button>'}</div>`;
    } else {
      body = st.flipped || st.answered
        ? `<div class="card pad col" style="align-items:center;gap:4px;border-color:#FA6D1E"><span class="xs muted">Deutsch</span><span class="h" style="font-size:28px">${esc(it.de)}</span></div>
           ${st.answered ? '' : `<div class="g2"><button type="button" class="btn2" data-act="nope" style="border-color:#FF6B6B">Nicht gewusst</button><button type="button" class="btn2" data-act="knew" style="border-color:#3DDC84">Gewusst!</button></div>`}`
        : '<button type="button" class="btn" data-act="flip">Umdrehen</button>';
    }
    return `<div class="card col" style="padding:24px 20px;align-items:center;gap:8px;text-align:center">
      <span class="sm muted">${prompt}</span>
      ${it.mode === 'listen' ? `<button type="button" class="icbtn" data-act="say" aria-label="Nochmal anhören" style="width:72px;height:72px;border-radius:50%;border:2px solid #FA6D1E">${ic('speaker', 34)}</button>` : `<h2 class="h" style="margin:0;font-size:${word.length > 16 ? 32 : 44}px;line-height:1.05">${esc(word)}</h2>`}
      ${it.mode === 'mcr' || it.mode === 'card' ? `<button type="button" class="icbtn" data-act="say" aria-label="Aussprache anhören" style="margin-top:4px">${ic('speaker', 20)}</button>` : ''}
    </div>${body}`;
  }

  function feedback(it) {
    const line = st.ok
      ? (st.combo >= 3 ? `¡Olé! Combo x${st.combo} – du bist on fire!` : (st.note || '¡Olé! Genau so. Weiter so, campeón!'))
      : 'Tranquilo! Das Wort kommt in die Fehlerkiste. Beim nächsten Mal sitzt es.';
    return `<div class="col" style="gap:12px">
      ${jose(esc(line), st.ok ? '#3DDC84' : '#FF6B6B')}
      <div class="row"><button type="button" class="icbtn" data-act="sayes" aria-label="Spanisch anhören">${ic('speaker', 22)}</button>
      <div class="col"><span style="font-weight:900;font-size:18px;color:${st.ok ? '#3DDC84' : '#FF6B6B'}">${st.ok ? '¡Muy bien! +10 XP' : 'Merk dir:'}</span><span class="sm muted">${esc(it.de)} = ${esc(it.es)}</span></div></div>
      <button type="button" class="btn" data-act="next">${st.i + 1 >= items.length ? 'Ergebnis' : 'Weiter'}</button></div>`;
  }

  function summary() {
    const r = st.result || {};
    const city = CITIES.find((c) => c.id === cityId);
    const msg = !cityId ? 'Stark geübt!' : r.stars === 3 ? '¡Perfecto! 3 Sterne!' : r.stars === 2 ? '¡Muy bien! 2 Sterne – die nächste Stadt ist offen!' : 'Gut gemacht! Für 2 Sterne brauchst du 70 % richtig.';
    return header('Geschafft!', ['#/training', 'Training']) + `<div class="content" style="align-items:center;text-align:center">
      <img src="${LOGO}" alt="José jubelt" class="cheer" style="width:190px">
      <span class="h" style="font-size:28px">${msg}</span>
      ${cityId ? `<div style="transform:scale(1.8);margin:8px 0">${stars(r.stars)}</div>` : ''}
      <span class="muted">${st.correct} von ${items.length} richtig</span>
      <div class="card pad col" style="gap:8px;align-self:stretch;text-align:left">
        <span class="label or">Deine Belohnung</span>
        <span>+${r.xp || 0} XP</span>
        ${cityId ? '<span>+10 Münzen · +3 Spielrunden · +1 Glücksrad-Dreh</span><span>+1 Puzzleteil für dein Rezept</span>' : '<span>+1 Spielrunde</span>'}
        ${r.unlockedNext ? `<span style="color:#3DDC84;font-weight:900">Neue Stadt freigeschaltet!</span>` : ''}
        ${city && recipeUnlocked(city.id) ? `<a href="#/rezept/${city.recipe}" style="font-weight:900">Rezept freigeschaltet – ansehen ›</a>` : ''}
      </div>
      <a href="#/training/${lvl}" class="btn">Nochmal</a>
      <a href="#/tour" class="btn2">Zur Spanien-Tour</a>
    </div>`;
  }

  function draw() {
    if (st.done) { root.innerHTML = summary(); return; }
    const it = items[st.i];
    root.innerHTML = header('Training', ['#/training', 'Level']) + `<div class="content">
      <div class="row"><div class="bar" style="flex:1;height:8px"><div style="width:${Math.round(st.i / items.length * 100)}%"></div></div><span style="font-weight:700;font-size:14px">${st.i + 1}/${items.length}</span></div>
      <div class="between"><span class="label muted">${esc(label)}</span><span class="combo">COMBO x${st.combo}</span></div>
      ${question(it)}
      ${st.answered ? feedback(it) : ''}
      ${mistakesBox()}
    </div>`;
    if (it.mode === 'type' && !st.answered) { const inp = root.querySelector('#typed'); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    if (it.mode === 'listen' && !st.answered && !st.spoken) { st.spoken = true; setTimeout(() => speak(it.es), 250); }
    if (st.answered) { const b = root.querySelector('[data-act="next"]'); if (b) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
  }

  root.oninput = (e) => { if (e.target.id === 'typed') st.typed = e.target.value; };
  root.onkeydown = (e) => { if (e.key === 'Enter' && e.target.id === 'typed') { e.preventDefault(); const b = root.querySelector('[data-act="check"]'); if (b) b.click(); } };
  root.onclick = (e) => {
    if (st.done) return;
    const it = items[st.i];
    const pick = e.target.closest('[data-pick]');
    if (pick && !st.answered) { const right = it.mode === 'mc' ? it.es : it.de; const v = pick.dataset.pick; answer(v === right, v); return; }
    const acc = e.target.closest('[data-acc]');
    if (acc) { const inp = root.querySelector('#typed'); st.typed = inp.value + acc.dataset.acc; inp.value = st.typed; inp.focus(); return; }
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    if (act === 'say') speak(it.es);
    if (act === 'sayes') speak(it.es);
    if (act === 'flip') { st.flipped = true; draw(); }
    if (act === 'knew') answer(true, null);
    if (act === 'nope') answer(false, null);
    if (act === 'next') { st.spoken = false; next(); }
    if (act === 'check') {
      const t = norm(st.typed), r = norm(it.es);
      if (!t) return;
      if (t === r) answer(true, null);
      else if (strip(t) === strip(r)) { st.note = 'Fast perfekt! Achte auf den Akzent: ' + it.es; answer(true, null); }
      else if (noArt(t) === noArt(r) || strip(noArt(t)) === strip(noArt(r))) { st.note = 'Richtig! Mit Artikel heißt es: ' + it.es; answer(true, null); }
      else answer(false, st.typed);
    }
  };
  draw();
}
