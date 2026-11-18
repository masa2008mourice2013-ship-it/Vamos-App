// ¡Vamos! – gemeinsame Bausteine: Symbole, Header, Menü, José, Töne, Sprache
import { S } from './store.js';

const P = {
  home: '<path d="M3 11l9-7 9 7v9h-6v-6H9v6H3z"/>',
  cards: '<rect x="4" y="6" width="13" height="15" rx="2"/><path d="M8 3h10a2 2 0 012 2v13"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  pad: '<rect x="2.5" y="7" width="19" height="11" rx="5.5"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18" cy="13.5" r=".8"/>',
  trophy: '<path d="M7 4h10v5a5 5 0 01-10 0z"/><path d="M7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4M12 14v4M8 21h8"/>',
  flame: '<path d="M12 3c1 3 5 5 5 10a5 5 0 01-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3-1-5 1-8.5z"/>',
  chart: '<path d="M4 20l5-6 4 3 7-9"/><path d="M15 8h5v5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  speaker: '<path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  snake: '<path d="M4 18h6a3 3 0 000-6H8a3 3 0 010-6h10"/><circle cx="19" cy="6" r="1.5"/>',
  grid: '<path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  ball: '<circle cx="12" cy="12" r="9"/><path d="M12 3c-2 4-2 8 0 9s6 1 8 4M3.5 9c4 0 7 1 8.5 3M7 20c1-4 3-6 5-8"/>',
  memory: '<rect x="3" y="4" width="8" height="7" rx="1.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><rect x="3" y="13" width="8" height="7" rx="1.5"/><rect x="13" y="13" width="8" height="7" rx="1.5"/>',
  pot: '<path d="M3 12h18M5 12a7 7 0 0014 0"/><path d="M9 8c0-2 1-3 1-5M13 8c0-2 1-3 1-5"/>',
  cam: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
  chest: '<path d="M3 10h18v10H3z"/><path d="M3 10l2-5h14l2 5"/><path d="M10 10v4h4v-4"/>',
};
export function ic(name, size = 22, color = 'currentColor', sw = 2) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name] || ''}</svg>`;
}
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const LOGO = 'assets/logo.png';

export function header(title, back) {
  const b = back ? `<a class="back" href="${back[0]}">${ic('back', 18, 'currentColor', 2.4)}${esc(back[1])}</a>` : '';
  return `<header class="hdr">
  <div class="hdr-row">
    <img class="hdr-logo" src="${LOGO}" alt="¡Vamos!-Logo">
    <div class="hdr-time"><span class="hdr-date" data-date></span><span class="hdr-clock" data-clock></span></div>
    <div class="coin" title="Münzen"><i></i><span data-coins>${S.coins}</span></div>
  </div>
  <div class="title-row"><div class="slant"><h1>${esc(title)}</h1></div>${b}</div>
</header>`;
}
export function tickClock() {
  const n = new Date(); const p = (x) => String(x).padStart(2, '0');
  document.querySelectorAll('[data-clock]').forEach((el) => { el.textContent = p(n.getHours()) + ':' + p(n.getMinutes()) + ':' + p(n.getSeconds()); });
  document.querySelectorAll('[data-date]').forEach((el) => { el.textContent = n.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }); });
}
export function refreshCoins() { document.querySelectorAll('[data-coins]').forEach((el) => { el.textContent = S.coins; }); }

export function nav(active) {
  const items = [['#/start', 'home', 'Start'], ['#/training', 'cards', 'Training'], ['#/tour', 'pin', 'Tour'], ['#/spiele', 'pad', 'Spiele'], ['#/trophaeen', 'trophy', 'Trophäen']];
  return `<div class="nav-in">${items.map(([h, i, l]) => `<a href="${h}" class="${active === h ? 'on' : ''}"${active === h ? ' aria-current="page"' : ''}>${ic(i, 22)}${l}</a>`).join('')}</div>`;
}

export function jose(text, accent) {
  return `<div class="jose"><img src="${LOGO}" alt="José, der Torero" class="jose-bob"><div class="bubble" ${accent ? `style="box-shadow: inset 0 -3px 0 ${accent}"` : ''}><b>José</b><span data-jose-text>${text}</span><button type="button" class="say-btn" data-jose-say aria-label="José vorlesen lassen">${ic('speaker', 18)}</button></div></div>`;
}

let ctx;
export function playTone(happy) {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + 0.02;
    const notes = happy ? [523.25, 659.25, 783.99, 1046.5] : [392.0, 369.99, 349.23, 329.63];
    const len = happy ? 0.11 : 0.28;
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = happy ? 'triangle' : 'sawtooth'; o.frequency.setValueAtTime(f, t0 + i * len);
      const end = t0 + i * len + (happy ? 0.25 : (i === notes.length - 1 ? 0.7 : 0.26));
      g.gain.setValueAtTime(0.0001, t0 + i * len);
      g.gain.exponentialRampToValueAtTime(happy ? 0.25 : 0.12, t0 + i * len + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      let node = o;
      if (!happy) { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; o.connect(lp); node = lp; }
      node.connect(g); g.connect(ctx.destination); o.start(t0 + i * len); o.stop(end + 0.05);
    });
  } catch (e) { /* kein Ton */ }
}
export function canSpeak() { return 'speechSynthesis' in window; }
function voiceFor(lang) {
  try {
    const vs = speechSynthesis.getVoices(); const base = lang.slice(0, 2);
    return vs.find((v) => v.lang === lang) || vs.find((v) => v.lang.replace('_', '-').startsWith(base)) || null;
  } catch (e) { return null; }
}
if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); } catch (e) { /* */ } }
function utter(text, lang, rate) {
  const u = new SpeechSynthesisUtterance(text); u.lang = lang; u.rate = rate; u.pitch = lang.startsWith('es') ? 0.95 : 0.9;
  const v = voiceFor(lang); if (v) u.voice = v; return u;
}
export function speak(text, lang = 'es-ES', rate = 0.9) {
  try { speechSynthesis.cancel(); speechSynthesis.speak(utter(text, lang, rate)); } catch (e) { /* */ }
}
export function stopSpeaking() { try { speechSynthesis.cancel(); } catch (e) { /* */ } }
// José spricht: Spanische Ausrufe (¡…! ¿…?) auf Spanisch, der Rest auf Deutsch
export function joseSay(text, force = false) {
  if (!canSpeak() || (!force && S.voice === false)) return;
  const clean = String(text).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return;
  try {
    speechSynthesis.cancel();
    clean.split(/(¡[^!]*!|¿[^?]*\?)/).map((t) => t.trim()).filter(Boolean).forEach((t) => {
      const es = /^[¡¿]/.test(t);
      speechSynthesis.speak(utter(es ? t : t.replace(/[–—]/g, ','), es ? 'es-ES' : 'de-DE', es ? 0.95 : 1.0));
    });
  } catch (e) { /* */ }
}
export function toast(msg, ms = 2600) {
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), ms);
}
export function shuffle(a) { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }
export const stars = (n) => [0, 1, 2].map((i) => `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="${i < n ? '#FA6D1E' : 'none'}" stroke="${i < n ? '#FA6D1E' : '#A9B4E8'}" stroke-width="1.8" stroke-linejoin="round"/></svg>`).join('');
