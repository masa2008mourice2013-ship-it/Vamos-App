// Seite 1: Start
import { S, save, racha, bestRacha, lastSevenDays, nivel, nivelProgress, currentCity, currentIndex, today } from '../store.js';
import { header, ic, jose, LOGO, esc, joseSay, stopSpeaking } from '../ui.js';
import { mapHTML } from '../map.js';
import { CITIES, WORLDS } from '../data.js';

function plan() {
  // Lerntage dieser Woche (in den Einstellungen wählbar)
  const now = new Date(); const dow = now.getDay() || 7; const set = new Set(S.days);
  const names = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  return (S.planDays && S.planDays.length ? S.planDays : [1, 3, 5]).slice().sort((a, b) => a - b).map((d) => [d, names[d]]).map(([d, l]) => {
    const x = new Date(now); x.setDate(now.getDate() - dow + d);
    const k = x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
    return { l, done: set.has(k), today: d === dow, past: d < dow };
  });
}

export function render(root) {
  const city = currentCity();
  const lv = S.levels[city.id];
  const r = racha();
  const days = lastSevenDays();
  root.innerHTML = header('¡Hola, ' + S.name + '!') + `
<div class="content">
  <div class="g2">
    <div class="card pad col" style="gap:4px">
      <div class="row or" style="gap:6px">${ic('flame', 18)}<span class="label">Racha</span></div>
      <span class="h" style="font-size:40px;line-height:1">${r}</span>
      <span class="sm muted">Trainings in Folge</span>
    </div>
    <div class="card pad col" style="gap:4px">
      <div class="row or" style="gap:6px">${ic('chart', 18)}<span class="label">Nivel ${nivel()}</span></div>
      <span class="h" style="font-size:40px;line-height:1">${S.xp}<span style="font-size:18px;font-weight:700" class="muted"> XP</span></span>
      <div class="bar"><div style="width:${Math.round(nivelProgress() * 100)}%"></div></div>
    </div>
  </div>

  <div class="card" style="padding:12px 14px;display:flex;flex-direction:column;gap:10px">
    <div class="between"><span style="font-weight:700;font-size:16px">${r} ${r === 1 ? 'Tag' : 'Tage'} in Folge gelernt</span><span class="xs muted">Rekord: ${bestRacha()} ${bestRacha() === 1 ? 'Tag' : 'Tage'}</span></div>
    <div class="between">${days.map((d) => `<div class="col" style="align-items:center;gap:4px"><div style="width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;${d.on ? 'background:#FA6D1E;color:#020124' : 'background:#18288A;color:#A9B4E8'};${d.today ? 'outline:2px solid #fff;outline-offset:2px' : ''}">${d.on ? ic('check', 16, '#020124', 3) : '–'}</div><span style="font-size:11px;${d.today ? 'font-weight:900' : 'color:#A9B4E8'}">${d.label}</span></div>`).join('')}</div>
    <span class="xs muted">Pausen von bis zu 2 Tagen sind erlaubt – passend zu deinem Trainingsplan.</span>
  </div>

  <div class="col" style="gap:6px;margin-top:6px">
    <div class="between"><span class="label or">${WORLDS[city.world]}</span><span class="xs muted">Level ${currentIndex() + 1} von ${CITIES.length}</span></div>
    ${mapHTML()}
  </div>

  <div class="card pad col" style="gap:8px">
    <span class="label or">Heutiges Training</span>
    <div class="between">
      <div class="col"><span class="h" style="font-size:24px;line-height:1.1">${esc(city.boss ? 'Endboss: ' + city.short : city.name)}</span><span class="sm muted">${esc(city.unidad)} · ${city.vocab.length} Vokabeln · ca. 8 Min</span></div>
      <div class="col" style="align-items:flex-end;gap:4px"><span style="display:flex;gap:2px">${'★'.repeat(lv.stars)}<span class="muted">${'☆'.repeat(3 - lv.stars)}</span></span></div>
    </div>
    <a href="#/training/${city.id}" class="btn" style="margin-top:6px">¡Vamos! Level starten ${ic('arrow', 22, 'currentColor', 3)}</a>
  </div>

  <div class="card pad col" style="gap:10px">
    <div class="between"><span style="font-weight:700;font-size:16px">Trainingsplan</span><span class="sm muted">ab ${esc(S.planTime || '14:30')}</span></div>
    <div style="display:grid;grid-template-columns:repeat(${Math.min(4, plan().length)},minmax(0,1fr));gap:8px">${plan().map((p) => p.done
      ? `<div class="row" style="justify-content:center;gap:6px;min-height:44px;border-radius:10px;background:#18288A;font-weight:700">${ic('check', 18, '#FA6D1E', 3)}${p.l}</div>`
      : p.today ? `<div class="row" style="justify-content:center;min-height:44px;border-radius:10px;border:2px solid #FA6D1E;font-weight:700;color:#FA6D1E">${p.l} · heute</div>`
        : `<div class="row" style="justify-content:center;min-height:44px;border-radius:10px;border:1px solid #2B3DA3;color:#A9B4E8">${p.l}${p.past ? ' · verpasst' : ''}</div>`).join('')}</div>
  </div>

  <a href="#/spiele" class="card row" style="padding:12px 14px;min-height:48px;color:#fff;text-decoration:none">${ic('pad', 24, '#FA6D1E')}<span style="flex:1;font-weight:700">${S.rounds} Spielrunden frei</span>${ic('arrow', 20, '#A9B4E8')}</a>
</div>
<button type="button" class="fab-jose" data-act="jose" aria-label="José fragen"><img src="${LOGO}" alt=""></button>`;

  // ---------- José ----------
  let typer = null;
  const greet = () => { const h = new Date().getHours(); return h < 12 ? '¡Buenos días' : h < 20 ? '¡Buenas tardes' : '¡Buenas noches'; };
  const learnedToday = S.days.includes(today());
  const lines = {
    ask: learnedToday
      ? `${greet()}, ${S.name}! Heute hast du schon trainiert – ¡olé! Lust auf eine Runde mehr oder ein Spiel?`
      : `${greet()}, ${S.name}! Ich bin José, dein Torero-Trainer.\n${r ? `Deine Racha steht bei ${r}. Machen wir weiter?` : 'Hast du Lust auf ein kurzes Training?'}`,
    yes: `¡Olé! Auf geht's: ${city.boss ? 'der Endboss ' + city.short + ' wartet' : city.name + ' wartet – ' + city.unidad.split(' · ')[0]} – ${city.vocab.length} Vokabeln, ca. 8 Minuten.`,
    no: 'Kein Problem, amigo. Ich erinnere dich später nochmal.\nWillst du vorher eine Runde Saque spielen?',
    bye: '¡Hasta luego! Ich warte hier auf dich.',
  };
  const btns = {
    ask: [['¡Sí, vamos!', 'say:yes', 1], [learnedToday ? 'Lieber spielen' : 'Jetzt nicht', learnedToday ? 'go:#/spiele' : 'say:no', 0]],
    yes: [['Training starten', 'go:#/training/' + city.id, 1]],
    no: [['Ja, kurz spielen', 'go:#/spiele/saque', 1], ['Nein, danke', 'say:bye', 0]],
    bye: [['Tschüss, José', 'close', 0]],
  };
  function openJose(step = 'ask') {
    closeJose();
    const ov = document.createElement('div');
    ov.className = 'overlay'; ov.id = 'jose-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'José, dein Torero-Trainer');
    ov.innerHTML = `<div class="overlay-in">
<button type="button" class="icbtn" data-jose="close" aria-label="José schließen" style="position:absolute;top:18px;right:18px">${ic('x', 20, 'currentColor', 2.4)}</button>
<div class="big-bubble" style="padding-right:52px"><b>José dice:</b><p aria-live="polite" id="jose-txt"></p><button type="button" class="say-btn" data-jose-say aria-label="José vorlesen lassen" style="top:12px;right:12px">${ic('speaker', 18)}</button></div>
<img src="${LOGO}" alt="José, der Torero" class="jose-bob" style="width:230px;margin-top:14px">
<div id="jose-btns" class="col" style="width:100%;gap:10px;margin-top:8px"></div></div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', (e) => {
      const b = e.target.closest('[data-jose]'); if (!b) return;
      const a = b.dataset.jose;
      if (a === 'close') { closeJose(); return; }
      if (a.startsWith('say:')) { type(a.slice(4)); return; }
      if (a.startsWith('go:')) { closeJose(); location.hash = a.slice(3); }
    });
    type(step);
    ov.querySelector('[data-jose="close"]').focus();
  }
  function type(step) {
    const txt = document.getElementById('jose-txt'); const bx = document.getElementById('jose-btns');
    if (!txt) return;
    const full = lines[step]; let n = 0; bx.innerHTML = ''; txt.dataset.full = full; joseSay(full);
    clearInterval(typer);
    typer = setInterval(() => {
      n += 2; txt.textContent = full.slice(0, n);
      if (n >= full.length) {
        clearInterval(typer);
        bx.innerHTML = btns[step].map(([l, a, prim]) => `<button type="button" class="${prim ? 'btn' : 'btn2'}" data-jose="${a}">${esc(l)}</button>`).join('');
      }
    }, 35);
  }
  function closeJose() { clearInterval(typer); stopSpeaking(); const o = document.getElementById('jose-ov'); if (o) o.remove(); }

  root.onclick = (e) => { if (e.target.closest('[data-act="jose"]')) openJose(); };
  if (S.greet !== false && S.lastGreet !== today()) { S.lastGreet = today(); save(); setTimeout(() => openJose(), 300); }
  return () => closeJose();
}
