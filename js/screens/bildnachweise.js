// Bildnachweise für die Wikipedia-Fotos
import { header, esc, ic } from '../ui.js';
import { allCached, credit } from '../wiki.js';

export function render(root) {
  const list = allCached().sort((a, b) => a[0].localeCompare(b[0], 'de'));
  root.innerHTML = header('Bildnachweise', ['#/einstellungen', 'Einstellungen']) + `<div class="content">
  <p class="sm muted" style="margin:0;line-height:1.5">Die Fotos in ¡Vamos! stammen aus Wikipedia und Wikimedia Commons. Sie stehen unter freien Lizenzen (meist Creative Commons). Hier stehen alle Fotos, die auf diesem Handy schon geladen wurden – mit Fotograf und Lizenz.</p>
  ${list.length ? list.map(([name, v]) => `<div class="card row" style="padding:10px;align-items:flex-start;gap:12px">
    <img src="${esc(v.thumb)}" alt="" style="width:72px;height:54px;object-fit:cover;border-radius:8px;flex-shrink:0">
    <div class="col" style="flex:1;min-width:0;gap:2px"><span style="font-weight:700">${esc(name)}</span><span class="xs muted" style="line-height:1.4">${esc(credit(v))}</span>
    <a href="${esc(v.filepage || v.url)}" target="_blank" rel="noopener" class="xs" style="font-weight:700">Bildquelle ansehen ›</a></div></div>`).join('')
    : `<div class="card pad col" style="align-items:center;gap:8px;text-align:center">${ic('img', 32, '#A9B4E8')}<span class="sm muted">Noch keine Fotos geladen. Öffne in der Spanien-Tour eine Stadt.</span></div>`}
</div>`;
}
