// ¡Vamos! – Start der App und Navigation zwischen den Bildschirmen
import { nav, tickClock, joseSay, stopSpeaking } from './ui.js';
import * as start from './screens/start.js';
import * as training from './screens/training.js';
import * as tour from './screens/tour.js';
import * as spiele from './screens/spiele.js';
import * as trophaeen from './screens/trophaeen.js';
import * as scannen from './screens/scannen.js';
import * as rezept from './screens/rezept.js';
import * as profil from './screens/profil.js';
import * as bildnachweise from './screens/bildnachweise.js';
import { openViewer } from './photos.js';
import * as serpiente from './games/serpiente.js';
import * as tres from './games/tres.js';
import * as saque from './games/saque.js';
import * as memoria from './games/memoria.js';

const routes = {
  start: [start, '#/start'], training: [training, '#/training'], tour: [tour, '#/tour'], spiele: [spiele, '#/spiele'],
  trophaeen: [trophaeen, '#/trophaeen'], scannen: [scannen, '#/training'], rezept: [rezept, '#/trophaeen'], profil: [profil, '#/einstellungen'], einstellungen: [profil, '#/einstellungen'], bildnachweise: [bildnachweise, '#/einstellungen'],
  serpiente: [serpiente, '#/spiele'], tres: [tres, '#/spiele'], saque: [saque, '#/spiele'], memoria: [memoria, '#/spiele'],
};

const root = document.getElementById('screen');
const navEl = document.getElementById('nav');
let cleanup = null;

function go() {
  const parts = (location.hash.replace(/^#\/?/, '') || 'start').split('/');
  let name = parts[0];
  if (name === 'spiele' && parts[1]) name = parts[1];
  const r = routes[name] || routes.start;
  if (typeof cleanup === 'function') { try { cleanup(); } catch (e) { /* */ } }
  cleanup = null;
  stopSpeaking(); lastSaid = '';
  root.innerHTML = '';
  root.onclick = null; root.oninput = null; root.onchange = null; root.onkeydown = null;
  window.scrollTo(0, 0);
  navEl.innerHTML = nav(r[1]);
  cleanup = r[0].render(root, parts.slice(1)) || null;
  tickClock();
  root.focus({ preventScroll: true });
}
// José spricht automatisch, sobald eine neue Sprechblase auftaucht
let lastSaid = '', sayTimer = null;
new MutationObserver(() => {
  clearTimeout(sayTimer);
  sayTimer = setTimeout(() => {
    if (document.getElementById('jose-ov')) return;
    const el = root.querySelector('[data-jose-text]'); if (!el) return;
    const t = el.textContent.trim();
    if (t && t !== lastSaid) { lastSaid = t; joseSay(t); }
  }, 350);
}).observe(root, { childList: true, subtree: true });
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-jose-say]'); if (!b) return;
  const t = b.closest('.bubble, .big-bubble').querySelector('[data-jose-text], #jose-txt');
  if (t) joseSay(t.dataset.full || t.textContent, true);
});
document.addEventListener('click', (e) => { const w = e.target.closest('[data-wiki]'); if (w) openViewer(w.dataset.wiki); });
window.addEventListener('hashchange', go);
setInterval(tickClock, 1000);
go();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
}
