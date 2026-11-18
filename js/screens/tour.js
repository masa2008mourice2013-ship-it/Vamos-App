// Seite 3: Spanien-Tour
import { CITIES, RECIPES, WORLDS } from '../data.js';
import { S, unlocked, currentIndex, recipeUnlocked } from '../store.js';
import { header, ic, jose, LOGO, esc, stars, speak, canSpeak } from '../ui.js';
import { mapHTML } from '../map.js';

export function render(root) {
  const cur = currentIndex();
  const curC = CITIES[cur];
  const lv = S.levels[curC.id];
  const need = lv.stars >= 2 ? 0 : 2 - lv.stars;
  const next = CITIES[cur + 1];
  const line = curC.boss
    ? `Der Endboss wartet! Zeig ${curC.short}, was du gelernt hast – Vokabeln aus der ganzen Welt in einem Level.`
    : need && next ? `Noch ${need} ${need === 1 ? 'Stern' : 'Sterne'} in ${curC.id === 'start' ? 'deinem Start-Level' : curC.name}, dann reisen wir nach ${next.boss ? 'Pamplona zum Endboss' : next.name}! ${curC.world === 1 ? 'Und Vorsicht: El Toro wartet in Pamplona …' : 'Und Vorsicht: El Cóndor wartet in den Anden …'}`
      : 'Weiter so – ¡vamos!';

  const card = (c) => {
    const i = CITIES.indexOf(c);
    const open = unlocked(i); const l = S.levels[c.id];
    const isCur = i === cur;
    const numStyle = c.boss ? 'background:#C2185B;color:#fff' : isCur ? 'background:#FA6D1E;color:#020124' : l.stars >= 2 ? 'background:#18288A;color:#FA6D1E;border:2px solid #FA6D1E' : 'background:#020124;color:#A9B4E8;border:2px solid #A9B4E8';
    const status = c.boss ? (c.id === 'condor' ? 'Endboss · El Cóndor' : 'Endboss · El Toro') : isCur ? `Level ${c.num} · aktuell` : l.stars >= 2 ? `Level ${c.num} · geschafft` : open ? `Level ${c.num}` : `Level ${c.num} · gesperrt`;
    const statusColor = c.boss ? '#C2185B' : isCur ? '#FA6D1E' : '#A9B4E8';
    const r = RECIPES[c.recipe];
    return `<details class="city" ${isCur ? 'open' : ''} style="${isCur ? 'border-color:#FA6D1E' : c.boss ? 'border-color:#C2185B' : ''}">
<summary><span class="num" style="${numStyle}">${c.boss ? '!' : c.num}</span>
<span class="col" style="flex:1"><span style="font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${statusColor}">${status}</span><span class="h" style="font-size:21px">${esc(c.name)}</span></span>
${open ? stars(l.stars) : ic('lock', 18, '#A9B4E8')}<span class="chev">${ic('chev', 22, '#A9B4E8', 2.4)}</span></summary>
<div style="padding:0 14px 16px;display:flex;flex-direction:column;gap:14px">
  <span class="sm muted">${esc(c.tag)} · ${esc(c.unidad)}</span>
  <div class="g3">${c.sights.map((s) => `<div style="aspect-ratio:4/3;border-radius:10px;background:#18288A;border:1px dashed #2B3DA3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:6px;text-align:center">${ic('cam', 20, '#A9B4E8')}<span style="font-size:10px;font-weight:700;color:#A9B4E8;line-height:1.2">${esc(s)}</span></div>`).join('')}</div>
  <div class="col" style="gap:6px"><span class="label or">Essen</span><div class="row" style="flex-wrap:wrap;gap:6px">${c.food.map((f) => `<span style="background:#18288A;border-radius:999px;padding:5px 12px;font-size:13px">${esc(f)}</span>`).join('')}</div></div>
  ${c.es ? `<div class="col" style="gap:8px;padding:12px;border-radius:12px;background:#020124;border:1px solid #2B3DA3">
    <span class="label or">En español · zum Anhören</span>
    <p style="margin:0;font-size:15px;line-height:1.5">${esc(c.es)}</p>
    ${canSpeak() ? `<div class="say-row"><button type="button" class="chip on" data-read="${c.id}" data-rate="0.9" style="display:flex;align-items:center;gap:6px">${ic('speaker', 18)}Vorlesen</button><button type="button" class="chip" data-read="${c.id}" data-rate="0.65">Langsam</button><button type="button" class="chip" data-stop="1">Stopp</button></div>` : ''}
  </div>` : ''}
  <div class="col" style="gap:6px"><span class="label or">Gut zu wissen</span><ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.45">${c.facts.map((f) => `<li style="margin-bottom:4px">${esc(f)}</li>`).join('')}</ul></div>
  <div class="col" style="gap:6px"><span class="label or">Vokabeln aus ${esc(c.name)}</span><div class="col" style="gap:4px;font-size:14px">${c.vocab.slice(0, 4).map(([es, de]) => `<button type="button" data-word="${esc(es)}" class="between" style="padding:7px 10px;border-radius:8px;background:#020124;border:none;color:#fff;font-size:14px;cursor:pointer;text-align:left"><span class="row" style="gap:6px;font-weight:700">${ic('speaker', 14, '#FA6D1E')}${esc(es)}</span><span class="muted">${esc(de)}</span></button>`).join('')}</div></div>
  ${open ? `<a href="#/training/${c.id}" class="btn" style="${c.boss ? 'background:#C2185B;color:#fff' : ''}">${c.boss ? 'Endboss herausfordern' : 'Zu den Lernkarten'} ${ic('arrow', 20, 'currentColor', 3)}</a>`
    : `<div class="row sm muted" style="justify-content:center;min-height:48px;border:1px dashed #2B3DA3;border-radius:12px">${ic('lock', 18)} Mit 2 Sternen in ${esc(CITIES[i - 1].short)} geht's hierher</div>`}
  ${r ? `<a href="#/rezept/${c.recipe}" class="row" style="color:#fff;text-decoration:none;gap:10px">${ic('pot', 22, '#FA6D1E')}<span style="flex:1;font-weight:700">${esc(r.name)}</span><span class="xs ${recipeUnlocked(c.id) ? 'or' : 'muted'}">${recipeUnlocked(c.id) ? 'Rezept ansehen ›' : `Puzzle ${l.pieces}/9`}</span></a>` : ''}
</div></details>`;
  };
  const cards = [1, 2].map((w) => `<span class="label ${CITIES[cur].world === w ? 'or' : 'muted'}" style="margin-top:8px">${WORLDS[w]}</span>` + CITIES.filter((c) => c.id !== 'start' && c.world === w).map(card).join('')).join('');

  root.innerHTML = header('Spanien-Tour') + `<div class="content">
  ${jose(esc(line), '#C2185B')}
  <div class="between"><span class="label or">${WORLDS[curC.world]}</span><span class="xs muted">Level ${cur + 1} von ${CITIES.length}</span></div>
  ${mapHTML()}
  <div class="row" style="flex-wrap:wrap;gap:14px;font-size:12px;color:#A9B4E8">
    <span class="row" style="gap:6px"><span style="width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid #FA6D1E;overflow:hidden;display:flex;align-items:center;justify-content:center"><img src="${LOGO}" alt="" style="width:16px"></span>Du bist hier</span>
    <span class="row" style="gap:6px"><span style="width:14px;height:14px;border-radius:50%;border:2px solid #A9B4E8"></span>Noch gesperrt</span>
    <span class="row" style="gap:6px"><span style="width:14px;height:14px;border-radius:50%;background:#C2185B"></span>Endboss</span>
  </div>
  <div class="col" style="gap:4px;margin-top:8px"><span class="h" style="font-size:24px">Deine Tour</span><span class="sm muted">Tipp auf eine Stadt: Essen, Fakten und die Vokabeln dazu.</span></div>
  <div class="col" style="gap:10px">${cards}</div>
</div>`;
  root.onclick = (e) => {
    const r = e.target.closest('[data-read]');
    if (r) { const c = CITIES.find((x) => x.id === r.dataset.read); speak(c.es, 'es-ES', +r.dataset.rate); return; }
    if (e.target.closest('[data-stop]')) { speechSynthesis.cancel(); return; }
    const w = e.target.closest('[data-word]'); if (w) speak(w.dataset.word, 'es-ES', 0.85);
  };
}
