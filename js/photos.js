// Foto-Kacheln mit Wikipedia-Bildern + Großansicht mit Bildnachweis
import { getImages, cached, credit } from './wiki.js';
import { ic, esc, speak } from './ui.js';

export function tile(name, h = '') {
  const c = cached(name);
  const inner = c
    ? `<img src="${esc(c.thumb)}" alt="${esc(name)}" loading="lazy" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
    : `<span class="col" style="align-items:center;gap:4px;color:#A9B4E8">${ic('cam', 20)}</span>`;
  return `<button type="button" class="wtile" data-wiki="${esc(name)}" aria-label="${esc(name)} – Foto ansehen" style="${h}">${inner}<span class="wcap">${esc(name)}</span></button>`;
}

// Platzhalter durch echte Fotos ersetzen
export async function hydrate(el) {
  const tiles = [...el.querySelectorAll('[data-wiki]:not([data-done])')];
  if (!tiles.length) return;
  const names = [...new Set(tiles.map((t) => t.dataset.wiki))];
  const res = await getImages(names);
  const byName = {}; names.forEach((n, i) => { byName[n] = res[i]; });
  tiles.forEach((t) => {
    t.dataset.done = '1';
    const v = byName[t.dataset.wiki] || cached(t.dataset.wiki);
    if (v && v.thumb && !t.querySelector('img')) {
      const img = new Image(); img.src = v.thumb; img.alt = t.dataset.wiki; img.loading = 'lazy';
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .4s';
      img.onload = () => { img.style.opacity = '1'; };
      const ph = t.querySelector('.col'); if (ph) ph.remove();
      t.prepend(img);
    }
  });
}

export function openViewer(name) {
  const v = cached(name);
  const ov = document.createElement('div');
  ov.className = 'overlay'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', name);
  ov.innerHTML = `<div class="overlay-in" style="padding-top:64px;gap:14px;align-items:stretch">
  <button type="button" class="icbtn" data-close aria-label="Schließen" style="position:absolute;top:16px;right:16px">${ic('x', 20, 'currentColor', 2.4)}</button>
  ${v ? `<img src="${esc(v.thumb)}" alt="${esc(name)}" style="width:100%;max-height:52vh;object-fit:cover;border-radius:14px;border:2px solid #FA6D1E">` : `<div class="card pad col" style="align-items:center;gap:8px;text-align:center">${ic('cam', 36, '#A9B4E8')}<span class="sm muted">Für dieses Ziel gibt es (noch) kein Foto – oder du bist gerade offline.</span></div>`}
  <span class="h" style="font-size:26px">${esc(name)}</span>
  ${v && v.extract ? `<div class="card pad col" style="gap:8px"><span class="label or">Wikipedia · en español</span><p style="margin:0;line-height:1.5">${esc(v.extract)}</p>
    <div class="say-row"><button type="button" class="chip on" data-say="0.92" style="display:flex;align-items:center;gap:6px">${ic('speaker', 18)}Vorlesen</button><button type="button" class="chip" data-say="0.7">Langsam</button></div></div>` : ''}
  ${v ? `<span class="xs muted" style="line-height:1.4">${esc(credit(v))}</span>
  <div class="g2" style="gap:8px"><a class="btn2" href="${esc(v.url)}" target="_blank" rel="noopener" style="min-height:46px;font-size:14px">Wikipedia-Artikel</a><a class="btn2" href="${esc(v.filepage || v.url)}" target="_blank" rel="noopener" style="min-height:46px;font-size:14px">Bildquelle</a></div>` : ''}
</div>`;
  document.body.appendChild(ov);
  const close = () => { try { speechSynthesis.cancel(); } catch (e) { /* */ } ov.remove(); };
  ov.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]') || e.target === ov) { close(); return; }
    const s = e.target.closest('[data-say]'); if (s && v) speak(v.extract, 'es-ES', +s.dataset.say);
  });
  ov.querySelector('[data-close]').focus();
}
