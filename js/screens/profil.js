// Profil & Familie
import { S, save, resetAll, racha, nivel, knownCount } from '../store.js';
import { header, ic, jose, esc, toast } from '../ui.js';
import { CITIES } from '../data.js';
import { avatarSVG } from '../art.js';

export function render(root) {
  const st = { confirm: false };
  function draw() {
    root.innerHTML = header('Profil', ['#/trophaeen', 'Trophäen']) + `<div class="content" style="gap:18px">
  ${jose('¿Quién eres? Hier stellst du deinen Namen ein – und bald kann Mama mitspielen.')}
  <div class="card pad row" style="gap:14px">
    <div style="background:#020124;border-radius:12px;padding:6px">${avatarSVG(S.outfit, 90)}</div>
    <div class="col" style="flex:1;gap:4px"><span class="h" style="font-size:24px">${esc(S.name)}</span><span class="sm muted">Nivel ${nivel()} · ${S.xp} XP · Racha ${racha()}</span><span class="sm muted">${knownCount()} Vokabeln sicher · ${S.trainings} Trainings</span></div>
  </div>
  <div class="card pad col" style="gap:10px">
    <label for="nm" style="font-weight:700">Dein Name</label>
    <input id="nm" class="inp" maxlength="20" value="${esc(S.name)}" autocomplete="off">
    <button type="button" class="btn2" data-act="name">Name speichern</button>
  </div>
  <div class="card pad col" style="gap:10px">
    <label for="school" style="font-weight:700">Die Klasse ist gerade bei …</label>
    <select id="school" class="inp" style="font-size:15px">${CITIES.filter((c) => !c.boss).map((c) => `<option value="${c.id}" ${S.school === c.id ? 'selected' : ''}>${esc(c.unidad)}</option>`).join('')}</select>
    <span class="xs muted">Alle Level bis hierhin sind frei. Danach geht es mit 2 Sternen weiter.</span>
  </div>
  <div class="card pad between" style="gap:12px">
    <div class="col"><span style="font-weight:700">José spricht</span><span class="xs muted">Liest seine Sprechblasen laut vor</span></div>
    <button type="button" data-act="voice" aria-pressed="${S.voice !== false}" class="chip ${S.voice !== false ? 'on' : ''}" style="min-width:76px">${S.voice !== false ? 'An' : 'Aus'}</button>
  </div>
  <div class="card pad col" style="gap:12px">
    <span class="label or">Familie · kommt in Etappe 3</span>
    <span class="h" style="font-size:22px;line-height:1.15">Duell mit Mama</span>
    <div class="between" style="background:#020124;border:2px dashed #FA6D1E;border-radius:12px;padding:12px 14px"><span class="h or" style="font-size:22px;letter-spacing:2px">${esc(S.famCode)}</span><span class="xs muted">Familien-Code</span></div>
    <span class="sm muted">Sobald das Duell freigeschaltet ist, öffnet Mama die App auf ihrem Handy und gibt diesen Code ein. Geteilt werden nur Name, XP und Racha.</span>
  </div>
  <div class="card pad col" style="gap:8px">
    <span class="label or">App aufs Handy</span>
    <span class="sm" style="line-height:1.5">In Chrome auf Android: oben rechts auf <b>⋮</b> tippen → <b>„Zum Startbildschirm hinzufügen“</b> bzw. <b>„App installieren“</b>. Dann startet ¡Vamos! wie eine echte App – auch ohne Internet.</span>
  </div>
  <div class="card pad col" style="gap:10px;border-color:#FF6B6B">
    <span class="label" style="color:#FF6B6B">Fortschritt zurücksetzen</span>
    <span class="sm muted">Löscht alle XP, Sterne, Münzen und Fotos auf diesem Handy.</span>
    ${st.confirm ? `<div class="g2"><button type="button" class="btn2" data-act="cancel">Abbrechen</button><button type="button" class="btn2" data-act="reset" style="border-color:#FF6B6B;color:#FF6B6B">Ja, alles löschen</button></div>` : '<button type="button" class="btn2" data-act="ask" style="border-color:#FF6B6B;color:#FF6B6B">Zurücksetzen …</button>'}
  </div>
  <span class="xs muted" style="text-align:center">¡Vamos! · Etappe 1 · Version 1.3</span>
</div>`;
  }
  root.onchange = (e) => { if (e.target.id === 'school') { S.school = e.target.value; save(); toast('Gespeichert: ' + e.target.selectedOptions[0].textContent); draw(); } };
  root.onclick = (e) => {
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    if (act === 'name') { const v = root.querySelector('#nm').value.trim(); if (v) { S.name = v; save(); toast('¡Hola, ' + v + '!'); draw(); } }
    if (act === 'voice') { S.voice = S.voice === false; save(); draw(); }
    if (act === 'ask') { st.confirm = true; draw(); }
    if (act === 'cancel') { st.confirm = false; draw(); }
    if (act === 'reset') { Object.keys(localStorage).filter((k) => k.startsWith('vamos-')).forEach((k) => localStorage.removeItem(k)); resetAll(); location.hash = '#/start'; location.reload(); }
  };
  draw();
}
