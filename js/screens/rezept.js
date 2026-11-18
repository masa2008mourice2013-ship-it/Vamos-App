// Rezeptkarte
import { RECIPES, CITIES } from '../data.js';
import { S, save, award, recipeUnlocked, savePhoto, getPhoto } from '../store.js';
import { header, ic, jose, esc, LOGO, playTone, speak, toast } from '../ui.js';
import { dishSVG } from '../art.js';

function fmt(x) {
  const w = Math.floor(x + 1e-9), f = x - w;
  const fr = Math.abs(f - 0.5) < 0.01 ? '½' : Math.abs(f - 0.25) < 0.01 ? '¼' : Math.abs(f - 0.75) < 0.01 ? '¾' : f > 0.01 ? null : '';
  if (fr === null) return String(Math.round(x * 10) / 10).replace('.', ',');
  return ((w ? String(w) : '') + fr) || '0';
}
function compress(file) {
  return new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 900; const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas'); c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
      res(c.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = rej; img.src = url;
  });
}

export function render(root, params) {
  const id = params[0] in RECIPES ? params[0] : 'tortilla';
  const r = RECIPES[id];
  const city = CITIES.find((c) => c.id === r.city);
  if (!recipeUnlocked(r.city)) {
    const p = S.levels[r.city].pieces;
    root.innerHTML = header('Rezept', ['#/trophaeen', 'Trophäen']) + `<div class="content">
      <span class="label or">Rezeptkarte · ${esc(city.short)}</span><h2 class="h" style="margin:0;font-size:30px">${esc(r.name)}</h2>
      <div class="card pad col" style="align-items:center;gap:10px;text-align:center">${ic('lock', 40, '#A9B4E8')}<span class="h" style="font-size:20px">Noch gesperrt</span>
      <span class="sm muted">Puzzle ${p} von 9 Teilen. Trainier in ${esc(city.short)} weiter – mit 3 Sternen ist das Rezept sofort frei.</span>
      <a href="#/training/${city.id}" class="btn">Zum Training</a></div></div>`;
    return;
  }
  const st = { lang: 'both', servings: r.base, have: {}, done: {}, photo: getPhoto(id) };

  function draw() {
    const cooked = !!S.cooked[id];
    const t = (es, de) => (st.lang === 'de' ? de : es);
    root.innerHTML = header('Rezept', ['#/trophaeen', 'Trophäen']) + `<div class="content" style="gap:18px">
  <div class="col" style="gap:4px"><span class="label or">Rezeptkarte · ${esc(city.short)}</span><h2 class="h" style="margin:0;font-size:32px;line-height:1.05">${esc(r.name)}</h2><span class="sm muted">${esc(r.sub)}</span></div>
  <div style="position:relative;background:#0B1A6E;border:1px solid #2B3DA3;border-radius:14px;overflow:hidden">
    ${st.photo ? `<img src="${st.photo}" alt="${esc(S.name)}s eigenes Foto von ${esc(r.name)}" style="width:100%;height:260px;object-fit:cover;display:block">` : `<div style="max-width:300px;margin:0 auto">${dishSVG(id, 'Zeichnung: ' + r.name)}</div>`}
    <span style="position:absolute;left:10px;top:10px;background:rgba(2,1,36,.85);font-size:11px;font-weight:900;letter-spacing:1px;padding:4px 10px;border-radius:999px">${st.photo ? esc(S.name.toUpperCase()) + 'S FOTO' : 'ZEICHNUNG'}</span>
    <label style="position:absolute;right:10px;bottom:10px;display:flex;align-items:center;gap:6px;min-height:40px;padding:0 12px;border-radius:999px;background:#FA6D1E;color:#020124;font-weight:900;font-size:13px;cursor:pointer">${ic('cam', 20)}${st.photo ? 'Neues Foto' : 'Dein Foto'}<input type="file" accept="image/*" data-photo style="position:absolute;width:1px;height:1px;opacity:0"></label>
  </div>
  <div class="g3">${[['ZEIT', r.time], ['LEVEL', r.level], ['BELOHNUNG', '+30 XP']].map(([k, v], i) => `<div class="card col" style="padding:8px;align-items:center;text-align:center"><span class="xs muted" style="font-weight:700">${k}</span><span style="font-weight:900;font-size:14px;${i === 2 ? 'color:#FA6D1E' : ''}">${esc(v)}</span></div>`).join('')}</div>
  <div class="col" style="gap:6px"><span class="label muted">Sprache</span><div class="g3" style="gap:6px">${[['es', 'Español'], ['de', 'Deutsch'], ['both', 'Beide']].map(([k, l]) => `<button type="button" class="chip ${st.lang === k ? 'on' : ''}" data-lang="${k}" aria-pressed="${st.lang === k}" style="border-radius:10px;min-height:44px">${l}</button>`).join('')}</div></div>
  ${r.hot ? jose('Ojo: Hier wird mit heißem Öl oder Herd gearbeitet. Koch zusammen mit Mama oder Papa!', '#C2185B') : jose('Das Rezept schaffst du fast allein – frag trotzdem kurz, bevor du loslegst!')}
  <div class="col" style="gap:10px">
    <div class="between"><span class="h" style="font-size:22px">Ingredientes</span>
      <div class="row" style="gap:8px"><button type="button" class="icbtn" data-act="less" aria-label="Weniger Portionen" style="width:40px;height:40px;font-size:20px;font-weight:900">−</button><span style="font-weight:900;min-width:80px;text-align:center">${st.servings} Personen</span><button type="button" class="icbtn" data-act="more" aria-label="Mehr Portionen" style="width:40px;height:40px;font-size:20px;font-weight:900">+</button></div></div>
    ${r.ingr.map(([es, de, q, u], k) => {
      const on = !!st.have[k]; const big = u.trim() === 'ml' || u.trim() === 'g';
      const raw = q * st.servings / r.base; const val = big ? Math.round(raw / 10) * 10 : raw >= 2 ? Math.round(raw) : Math.max(0.5, Math.round(raw * 2) / 2);
      return `<button type="button" data-have="${k}" aria-pressed="${on}" style="width:100%;min-height:54px;display:flex;align-items:center;gap:12px;padding:6px 12px;border-radius:12px;background:#0B1A6E;border:1px solid #2B3DA3;color:#fff;text-align:left;cursor:pointer;${on ? 'opacity:.7' : ''}">
        <span style="width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:900;flex-shrink:0;${on ? 'background:#3DDC84;color:#020124' : 'border:2px solid #A9B4E8'}">${on ? '✓' : ''}</span>
        <span class="col" style="flex:1"><span style="font-weight:700;font-size:15px">${esc(t(es, de))}</span>${st.lang === 'both' ? `<span class="xs muted">${esc(de)}</span>` : ''}</span>
        <span style="font-weight:900;color:#FA6D1E">${big ? val : fmt(val)}${esc(u)}</span></button>`;
    }).join('')}
    <span class="xs muted">Tipp: Hak ab, was ihr schon zu Hause habt.</span>
  </div>
  <div class="col" style="gap:10px">
    <div class="between"><span class="h" style="font-size:22px">Preparación</span><span class="xs muted">${Object.values(st.done).filter(Boolean).length} von ${r.steps.length} Schritten</span></div>
    ${r.steps.map(([es, de], k) => { const on = !!st.done[k]; return `<div style="display:flex;align-items:flex-start;gap:12px;padding:12px;border-radius:12px;background:#0B1A6E;border:1px solid ${on ? '#3DDC84' : '#2B3DA3'}">
      <button type="button" data-step="${k}" aria-label="Schritt ${k + 1} ${on ? 'wieder öffnen' : 'als erledigt markieren'}" style="width:36px;height:36px;border-radius:50%;border:none;flex-shrink:0;font-weight:900;font-size:15px;cursor:pointer;${on ? 'background:#3DDC84' : 'background:#FA6D1E'};color:#020124">${on ? '✓' : k + 1}</button>
      <div class="col" style="flex:1;gap:3px;min-width:0"><span style="font-weight:700;font-size:15px;line-height:1.4;${on ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(t(es, de))}</span>${st.lang === 'both' ? `<span class="sm muted" style="line-height:1.4">${esc(de)}</span>` : ''}</div>
      <button type="button" class="icbtn" data-say="${k}" aria-label="Schritt auf Spanisch vorlesen" style="width:40px;height:40px;background:#020124">${ic('speaker', 18)}</button></div>`; }).join('')}
  </div>
  <div class="card pad col" style="gap:8px"><span class="label or">Vokabeln aus der Küche</span>
    <div class="g2" style="gap:6px">${r.vocab.map(([es, de]) => `<div class="col" style="padding:8px 10px;border-radius:8px;background:#020124"><span style="font-weight:700">${esc(es)}</span><span class="xs muted">${esc(de)}</span></div>`).join('')}</div>
    <button type="button" class="btn2" data-act="learn" style="margin-top:4px">Als Lernkarten üben ${ic('arrow', 18, 'currentColor', 2.6)}</button></div>
  <div class="card pad row" style="align-items:flex-start;gap:12px"><span class="h or" style="font-size:28px;line-height:1">?</span><div class="col" style="gap:4px"><span style="font-weight:900">${esc(r.fun[0])}</span><span class="sm muted" style="line-height:1.45">${esc(r.fun[1])}</span></div></div>
  ${cooked ? `<div class="row" style="gap:14px;padding:12px 14px;border-radius:14px;background:#0B1A6E;border:2px solid #3DDC84"><img src="${LOGO}" alt="José jubelt" class="cheer" style="width:84px;flex-shrink:0"><div class="col" style="gap:2px"><span class="h" style="font-size:22px;color:#3DDC84">¡Que aproveche!</span><span class="sm muted">Gekocht! Abzeichen „Cocinero“ gehört dir.</span></div></div>
    ${st.photo ? '' : `<div class="col" style="gap:10px;padding:16px;border-radius:14px;border:2px dashed #FA6D1E;background:#0B1A6E"><span class="h" style="font-size:20px">Zeig uns dein Gericht!</span><span class="sm muted">Mach ein Foto – es wird das Titelbild deiner Rezeptkarte und bringt +10 Bonus-XP.</span>
      <label class="btn" style="position:relative">${ic('cam', 20)}Foto aufnehmen<input type="file" accept="image/*" capture="environment" data-photo style="position:absolute;width:1px;height:1px;opacity:0"></label>
      <label class="btn2" style="position:relative">Aus Galerie wählen<input type="file" accept="image/*" data-photo style="position:absolute;width:1px;height:1px;opacity:0"></label></div>`}`
    : '<button type="button" class="btn" data-act="cooked">¡Hecho! Ich habe gekocht</button>'}
</div>`;
  }

  root.onclick = (e) => {
    const g = (sel) => e.target.closest(sel);
    let x;
    if ((x = g('[data-lang]'))) { st.lang = x.dataset.lang; draw(); return; }
    if ((x = g('[data-have]'))) { st.have[x.dataset.have] = !st.have[x.dataset.have]; draw(); return; }
    if ((x = g('[data-step]'))) { st.done[x.dataset.step] = !st.done[x.dataset.step]; draw(); return; }
    if ((x = g('[data-say]'))) { speak(r.steps[+x.dataset.say][0]); return; }
    if ((x = g('[data-act]'))) {
      const a = x.dataset.act;
      if (a === 'less') { st.servings = Math.max(1, st.servings - 1); draw(); }
      if (a === 'more') { st.servings = Math.min(10, st.servings + 1); draw(); }
      if (a === 'cooked') { S.cooked[id] = true; S.xp += 30; award('cook'); save(); playTone(true); draw(); }
      if (a === 'learn') {
        r.vocab.forEach(([es, de]) => { if (!S.own.some((o) => o[0] === es)) S.own.push([es, de]); });
        save(); location.hash = S.own.length >= 4 ? '#/training/own' : '#/training';
      }
    }
  };
  root.onchange = async (e) => {
    if (!e.target.matches('[data-photo]')) return;
    const f = e.target.files && e.target.files[0]; if (!f) return;
    try {
      const data = await compress(f);
      if (!savePhoto(id, data)) { toast('Speicher voll – Foto konnte nicht gespeichert werden.'); return; }
      const first = !st.photo; st.photo = data;
      if (first) { S.xp += 10; S.cooked[id] = true; award('cook'); save(); }
      playTone(true); toast('Foto gespeichert! ' + (first ? '+10 XP' : '')); draw();
    } catch (err) { toast('Das Foto konnte nicht gelesen werden.'); }
  };
  draw();
}
