// Vokabeln scannen – kostenlose Texterkennung direkt auf dem Handy (Tesseract.js)
import { S, save, currentCity } from '../store.js';
import { header, ic, jose, esc, LOGO, playTone } from '../ui.js';

const TESS = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
function loadTess() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = TESS; s.onload = () => res(window.Tesseract); s.onerror = rej; document.head.appendChild(s); });
}
const DE_ART = /\b(der|die|das|den|dem|ein|eine)\b/i;
const ES_ART = /^(el|la|los|las|un|una)\s/i;
const ODD = /[^a-zA-ZäöüÄÖÜßáéíóúñÁÉÍÓÚÑü¿¡?!\s,.'()\-/]/;

export function parse(text) {
  const rows = [];
  text.split(/\n+/).forEach((raw) => {
    let line = raw.replace(/^[\s\d.)•·*\-–]+/, '').replace(/\s+$/, '');
    if (line.length < 3 || /^(vokabel|unidad|lección|seite|página)/i.test(line)) return;
    let parts = line.split(/\t| {2,}| [-–—=:] | → /).map((p) => p.trim()).filter(Boolean);
    if (parts.length < 2) {
      const esMid = line.slice(1).search(/\s(el|la|los|las|un|una)\s/i);
      const m = line.slice(1).search(DE_ART);
      if (DE_ART.test(line.split(' ')[0]) && esMid > 0) parts = [line.slice(esMid + 2).trim(), line.slice(0, esMid + 1).trim()];
      else if (m > 0) parts = [line.slice(0, m + 1).trim(), line.slice(m + 1).trim()];
    }
    let es = parts[0] || '', de = parts.slice(1).join(' ') || '';
    if (de && DE_ART.test(es.split(' ')[0]) && ES_ART.test(de)) [es, de] = [de, es];
    const unsure = !de || ODD.test(es) || ODD.test(de) || es.length > 40;
    rows.push({ es, de, on: true, unsure });
  });
  return rows.slice(0, 40);
}

export function render(root) {
  const city = currentCity();
  const st = { step: 'start', pct: 0, info: '', rows: [], target: 'level', added: 0, err: '' };
  const cam = (cap, label, cls) => `<label class="${cls}" style="position:relative">${ic(cap ? 'cam' : 'img', 22)}${label}<input type="file" accept="image/*" ${cap ? 'capture="environment"' : ''} data-scan style="position:absolute;width:1px;height:1px;opacity:0"></label>`;

  function draw() {
    let inner = '';
    if (st.step === 'start') inner = `
      ${jose('Fotografier die Vokabelliste aus deinem Buch oder Heft – ich mache Lernkarten daraus!')}
      <ul style="margin:0;padding-left:18px;font-size:14px;color:#A9B4E8;line-height:1.6"><li>Gutes Licht, kein Schatten auf der Seite</li><li>Seite gerade halten, nah ran</li><li>Spanisch und Deutsch sollten beide drauf sein</li><li>Gedruckte Listen klappen am besten, Handschrift nicht immer</li></ul>
      ${st.err ? `<span style="color:#FF6B6B;font-weight:700">${esc(st.err)}</span>` : ''}
      ${cam(true, 'Foto aufnehmen', 'btn')}${cam(false, 'Aus Galerie wählen', 'btn2')}
      <span class="xs muted">Beim ersten Scan lädt die App einmalig das Sprachwissen für Spanisch und Deutsch (einige MB) – am besten im WLAN.</span>`;
    if (st.step === 'scan') inner = `<div class="col" style="align-items:center;gap:18px;padding-top:30px">
      <img src="${LOGO}" alt="José liest" class="jose-bob" style="width:170px"><span class="h" style="font-size:24px;text-align:center">José liest deine Vokabeln …</span>
      <div class="bar" style="width:100%;height:10px"><div style="width:${st.pct}%"></div></div><span class="sm muted">${esc(st.info)}</span></div>`;
    if (st.step === 'review') {
      const sel = st.rows.filter((r) => r.on && r.es && r.de).length;
      const uns = st.rows.filter((r) => r.unsure).length;
      inner = `${jose(st.rows.length ? `¡Listo! Ich habe ${st.rows.length} Zeilen gefunden.${uns ? ` Bei ${uns} bin ich unsicher – schau sie dir bitte an.` : ''}` : 'Hmm, ich konnte leider nichts lesen. Probier es nochmal mit mehr Licht.')}
      <div class="col" style="gap:6px"><span class="label or">Hinzufügen zu</span><div class="row" style="gap:8px;flex-wrap:wrap">
        <button type="button" class="chip ${st.target === 'level' ? 'on' : ''}" data-target="level">${esc(city.boss ? 'Endboss' : city.name)}</button>
        <button type="button" class="chip ${st.target === 'own' ? 'on' : ''}" data-target="own">Eigene Liste</button></div></div>
      <div style="display:grid;grid-template-columns:30px minmax(0,1fr) minmax(0,1fr);gap:6px;font-size:11px;font-weight:700;letter-spacing:1px;color:#A9B4E8"><span></span><span>ESPAÑOL</span><span>DEUTSCH</span></div>
      <div class="col" style="gap:6px">${st.rows.map((r, i) => `<div style="display:grid;grid-template-columns:30px minmax(0,1fr) minmax(0,1fr);gap:6px;align-items:center;opacity:${r.on ? 1 : 0.45}">
        <button type="button" data-tog="${i}" aria-pressed="${r.on}" aria-label="${r.on ? 'Abwählen' : 'Auswählen'}: ${esc(r.es)}" style="width:28px;height:28px;border-radius:7px;padding:0;display:flex;align-items:center;justify-content:center;cursor:pointer;${r.on ? 'background:#FA6D1E;border:2px solid #FA6D1E' : 'background:transparent;border:2px solid #A9B4E8'}">${r.on ? ic('check', 16, '#020124', 3) : ''}</button>
        <input class="inp small ${r.unsure ? 'unsure' : ''}" aria-label="Spanisch" data-es="${i}" value="${esc(r.es)}">
        <input class="inp small ${r.unsure && !r.de ? 'unsure' : ''}" aria-label="Deutsch" data-de="${i}" value="${esc(r.de)}"></div>`).join('')}</div>
      <button type="button" class="btn2" data-act="addrow" style="min-height:44px;border-style:dashed">+ Zeile hinzufügen</button>
      <span class="xs or" style="font-weight:700">Orange umrandet = José ist unsicher. Bitte kurz prüfen.</span>
      <button type="button" class="btn" data-act="add" ${sel ? '' : 'disabled'}>${sel} ${sel === 1 ? 'Vokabel' : 'Vokabeln'} hinzufügen</button>
      <button type="button" class="btn2" data-act="reset">Neu scannen</button>`;
    }
    if (st.step === 'done') inner = `<div class="col" style="align-items:center;gap:16px;padding-top:20px">
      <img src="${LOGO}" alt="José jubelt" class="cheer" style="width:190px">
      <div class="big-bubble" style="text-align:center"><b>José</b><p>¡Genial! ${st.added} neue Vokabeln sind jetzt in ${st.target === 'level' ? esc(city.boss ? 'deinem Endboss-Level' : city.name) : 'deiner eigenen Liste'}. Sollen wir sie gleich üben?</p></div>
      <a href="#/training/${st.target === 'level' ? city.id : 'own'}" class="btn" style="margin-top:12px">Jetzt üben ${ic('arrow', 20, 'currentColor', 3)}</a>
      <button type="button" class="btn2" data-act="reset">Noch eine Seite scannen</button></div>`;
    root.innerHTML = header('Scannen', ['#/training', 'Training']) + `<div class="content">${inner}</div>`;
  }
  const sync = (e) => {
    const t = e.target;
    if (t.dataset.es !== undefined) { const r = st.rows[+t.dataset.es]; r.es = t.value; r.unsure = false; }
    if (t.dataset.de !== undefined) { st.rows[+t.dataset.de].de = t.value; }
  };
  root.oninput = sync;
  root.onchange = async (e) => {
    sync(e);
    if (!e.target.matches('[data-scan]')) return;
    const f = e.target.files && e.target.files[0]; if (!f) return;
    st.step = 'scan'; st.pct = 2; st.info = 'Texterkennung wird geladen …'; draw();
    try {
      const T = await loadTess();
      const res = await T.recognize(f, 'spa+deu', { logger: (m) => {
        if (m.status === 'recognizing text') { st.pct = Math.round(30 + m.progress * 70); st.info = 'Text wird erkannt …'; }
        else if (m.progress !== undefined) { st.pct = Math.max(st.pct, Math.round(m.progress * 30)); st.info = 'Sprachwissen wird geladen …'; }
        const b = root.querySelector('.bar > div'); if (b) b.style.width = st.pct + '%';
        const s = root.querySelector('.sm.muted'); if (s) s.textContent = st.info;
      } });
      st.rows = parse(res.data.text || ''); st.step = 'review'; playTone(true);
    } catch (err) { st.step = 'start'; st.err = 'Die Texterkennung konnte nicht starten. Bist du online?'; }
    draw();
  };
  root.onclick = (e) => {
    let x;
    if ((x = e.target.closest('[data-target]'))) { st.target = x.dataset.target; draw(); return; }
    if ((x = e.target.closest('[data-tog]'))) { const r = st.rows[+x.dataset.tog]; r.on = !r.on; draw(); return; }
    if ((x = e.target.closest('[data-act]'))) {
      const a = x.dataset.act;
      if (a === 'reset') { Object.assign(st, { step: 'start', rows: [], err: '' }); draw(); }
      if (a === 'addrow') { st.rows.push({ es: '', de: '', on: true, unsure: false }); draw(); }
      if (a === 'add') {
        const sel = st.rows.filter((r) => r.on && r.es.trim() && r.de.trim());
        S.ownTarget = S.ownTarget || {};
        sel.forEach((r) => { const es = r.es.trim(), de = r.de.trim(); if (!S.own.some((o) => o[0] === es)) S.own.push([es, de]); if (st.target === 'level') S.ownTarget[es] = city.id; });
        save(); st.added = sel.length; st.step = 'done'; playTone(true); draw();
      }
    }
  };
  draw();
}
