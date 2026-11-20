// Einstellungen & Profil
import { S, save, resetAll, racha, nivel, knownCount, savePhoto, getPhoto, today } from '../store.js';
import { header, ic, jose, esc, toast, profilePic, playTone, joseSay, voicesFor, previewVoice, onVoices, canSpeak } from '../ui.js';
import { CITIES } from '../data.js';

// Quadratisch zuschneiden und verkleinern (Profilbild)
function squareCrop(file, size = 320) {
  return new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(img.width, img.height);
      const c = document.createElement('canvas'); c.width = size; c.height = size;
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = rej; img.src = url;
  });
}

const DAYS = [[1, 'Mo'], [2, 'Di'], [3, 'Mi'], [4, 'Do'], [5, 'Fr'], [6, 'Sa'], [7, 'So']];

export function render(root) {
  const st = { unlocked: !S.parentPin, pinMsg: '', confirm: false };

  const sw = (key, on) => `<button type="button" class="switch" role="switch" aria-checked="${on}" data-sw="${key}"><span class="sr-only" style="position:absolute;left:-9999px">${on ? 'An' : 'Aus'}</span></button>`;
  const seg = (key, opts) => `<div class="seg">${opts.map(([v, l]) => `<button type="button" class="chip ${String(S[key]) === String(v) ? 'on' : ''}" aria-pressed="${String(S[key]) === String(v)}" data-seg="${key}" data-val="${v}">${l}</button>`).join('')}</div>`;
  const row = (title, sub, control) => `<div class="set-row"><div class="col" style="flex:1;min-width:0"><span style="font-weight:700">${title}</span>${sub ? `<span class="xs muted">${sub}</span>` : ''}</div>${control}</div>`;
  const block = (title, sub, control) => `<div class="col" style="gap:8px;padding:12px 14px"><div class="col"><span style="font-weight:700">${title}</span>${sub ? `<span class="xs muted">${sub}</span>` : ''}</div>${control}</div>`;
  const file = (cap, label, cls, icon) => `<label class="${cls}" style="position:relative;min-height:46px;font-size:14px">${ic(icon, 18)}${label}<input type="file" accept="image/*" ${cap ? 'capture="user"' : ''} data-photo style="position:absolute;width:1px;height:1px;opacity:0"></label>`;

  function draw() {
    const hasPhoto = !!getPhoto('profile');
    const learnedToday = S.days.includes(today());
    root.innerHTML = header('Einstellungen', ['#/start', 'Start']) + `<div class="content" style="gap:22px">
  ${jose(`¡Hola, ${esc(S.name)}! Hier stellst du alles ein – und du kannst ein Profilbild machen.`)}

  <section class="set-sec" aria-labelledby="h-profil">
    <span class="label or" id="h-profil">Mein Profil</span>
    <div class="card pad col" style="gap:14px;align-items:center;text-align:center">
      <div style="width:132px;height:132px;border-radius:50%;border:4px solid #FA6D1E;overflow:hidden;display:flex;align-items:center;justify-content:center">${profilePic(124)}</div>
      <div class="col" style="gap:2px"><span class="h" style="font-size:26px">${esc(S.name)}</span><span class="sm muted">Nivel ${nivel()} · ${S.xp} XP · Racha ${racha()}</span><span class="sm muted">${knownCount()} Vokabeln sicher · ${S.trainings} Trainings · ${Object.keys(S.badges).length} Abzeichen</span></div>
      <div class="g2" style="width:100%;gap:8px">${file(true, 'Selfie machen', 'btn', 'cam')}${file(false, 'Aus Galerie', 'btn2', 'img')}</div>
      <div class="seg" style="justify-content:center">
        <button type="button" class="chip ${S.avatarMode === 'figur' || !hasPhoto ? 'on' : ''}" data-mode="figur">Spieler-Figur zeigen</button>
        ${hasPhoto ? `<button type="button" class="chip ${S.avatarMode === 'foto' ? 'on' : ''}" data-mode="foto">Foto zeigen</button><button type="button" class="chip" data-act="delphoto" style="border-color:#FF6B6B;color:#FF6B6B">Foto löschen</button>` : ''}
      </div>
      <span class="xs muted">Das Bild bleibt nur auf diesem Handy. Die Figur ziehst du unter Trophäen an.</span>
    </div>
    <div class="card pad col" style="gap:10px">
      <label for="nm" style="font-weight:700">Dein Name</label>
      <div class="row"><input id="nm" class="inp" maxlength="20" value="${esc(S.name)}" autocomplete="off" style="flex:1"><button type="button" class="icbtn" data-act="name" aria-label="Name speichern" style="width:52px;height:52px;background:#FA6D1E;color:#020124;border:none">${ic('check', 22, 'currentColor', 3)}</button></div>
    </div>
  </section>

  <section class="set-sec" aria-labelledby="h-lernen">
    <span class="label or" id="h-lernen">Lernen</span>
    <div class="card">
      ${block('Fragen pro Training', 'Mehr Fragen = mehr XP', seg('qcount', [[8, '8 · kurz'], [12, '12 · normal'], [20, '20 · lang']]))}
      ${block('Abfrage-Richtung', 'Was soll José fragen?', seg('direction', [['mix', 'Gemischt'], ['de-es', 'Deutsch → Spanisch'], ['es-de', 'Spanisch → Deutsch']]))}
      ${row('Eintipp-Fragen', 'Wörter selbst schreiben (mit á, ñ …)', sw('typing', S.typing !== false))}
    </div>
  </section>

  <section class="set-sec" aria-labelledby="h-plan">
    <span class="label or" id="h-plan">Trainingsplan</span>
    <div class="card">
      ${block('Lerntage', 'Diese Tage zeigt die Startseite – und an ihnen kommen später die Erinnerungen', `<div class="seg">${DAYS.map(([d, l]) => `<button type="button" class="chip ${S.planDays.includes(d) ? 'on' : ''}" aria-pressed="${S.planDays.includes(d)}" data-day="${d}" style="min-width:44px">${l}</button>`).join('')}</div>`)}
      ${row('Uhrzeit', 'Ab wann wird gelernt?', `<input type="time" id="ptime" class="inp" value="${esc(S.planTime)}" style="width:120px;height:44px;font-size:16px">`)}
      <div style="padding:0 14px 12px"><span class="xs muted">Push-Erinnerungen aufs Handy kommen mit Etappe 2.</span></div>
    </div>
  </section>

  <section class="set-sec" aria-labelledby="h-ton">
    <span class="label or" id="h-ton">Ton & Stimme</span>
    <div class="card">
      ${row('José spricht', 'Liest seine Sprechblasen vor', sw('voice', S.voice !== false))}
      ${row('Langsamer sprechen', 'Gut zum Mitlesen', sw('slowVoice', !!S.slowVoice))}
      ${canSpeak() ? ['es', 'de'].map((b) => { const vs = voicesFor(b); const key = b === 'es' ? 'voiceEs' : 'voiceDe'; return block(b === 'es' ? 'Stimme für Spanisch' : 'Stimme für Deutsch (José)', vs.length ? 'Probier die Stimmen mit ▶ aus und nimm die natürlichste.' : 'Auf diesem Gerät ist keine Stimme installiert – siehe Tipp unten.', vs.length ? `<div class="row"><select class="inp" data-voice="${key}" style="flex:1;font-size:14px;height:48px"><option value="">Automatisch (beste Stimme)</option>${vs.map((v) => `<option value="${esc(v.name)}" ${S[key] === v.name ? 'selected' : ''}>${esc(v.name.replace(/Microsoft |Google /, ''))} · ${esc(v.lang)}${v.localService ? '' : ' · online'}</option>`).join('')}</select><button type="button" class="icbtn" data-prev="${key}" aria-label="Stimme anhören" style="width:48px;height:48px;background:#FA6D1E;color:#020124;border:none">▶</button></div>` : ''); }).join('') : ''}
      <details style="padding:0 14px 12px"><summary class="sm or" style="cursor:pointer;font-weight:700;min-height:32px">Tipp: noch natürlichere Stimmen auf Android</summary>
        <ol class="sm" style="margin:8px 0 0;padding-left:18px;line-height:1.55">
          <li>Handy-<b>Einstellungen</b> öffnen → nach <b>„Sprachausgabe“</b> (oder „Text-in-Sprache“) suchen.</li>
          <li>Als bevorzugtes Modul <b>„Google Sprachausgabe“</b> wählen (bei Samsung statt „Samsung TTS“).</li>
          <li>Auf das <b>Zahnrad</b> daneben → <b>„Sprachdaten installieren“</b> → <b>Spanisch (Spanien)</b> und <b>Deutsch</b> laden.</li>
          <li>Bei der Sprache auf <b>„Stimme“</b> tippen: Es gibt mehrere Varianten – die natürlichste auswählen.</li>
          <li>Chrome einmal ganz schließen, App neu öffnen – die neuen Stimmen erscheinen dann hier in der Auswahl.</li>
        </ol></details>
      ${row('Töne', 'Jubel- und Wah-wah-Töne', sw('sounds', S.sounds !== false))}
      ${row('José-Begrüßung', 'Einmal am Tag beim Öffnen', sw('greet', S.greet !== false))}
      <div style="padding:0 14px 12px"><button type="button" class="btn2" data-act="test" style="min-height:44px;font-size:14px">${ic('speaker', 18)} Testen</button></div>
    </div>
  </section>

  <section class="set-sec" aria-labelledby="h-spiele">
    <span class="label or" id="h-spiele">Spiele</span>
    <div class="card">${block('Tempo der Schlange (Serpiente)', '', seg('snakeSpeed', [['slow', 'Gemütlich'], ['normal', 'Normal'], ['fast', 'Schnell']]))}</div>
  </section>

  <section class="set-sec" aria-labelledby="h-eltern">
    <span class="label or" id="h-eltern">Eltern-Bereich</span>
    ${st.unlocked ? `<div class="card">
      ${block('Die Klasse ist gerade bei …', 'Alle Level bis hierhin sind frei. Danach geht es mit 2 Sternen weiter.', `<select id="school" class="inp" style="font-size:15px">${CITIES.filter((c) => !c.boss).map((c) => `<option value="${c.id}" ${S.school === c.id ? 'selected' : ''}>${esc(c.unidad)}</option>`).join('')}</select>`)}
      ${block('Eltern-PIN', S.parentPin ? 'Ist gesetzt – dieser Bereich ist geschützt.' : 'Optional: Schützt Klassenstand, Sicherung und Zurücksetzen.', `<div class="row"><input id="pin" class="inp" inputmode="numeric" maxlength="4" placeholder="4 Ziffern" style="flex:1;letter-spacing:4px"><button type="button" class="btn2" data-act="setpin" style="width:auto;min-height:52px;font-size:14px">${S.parentPin ? 'Ändern' : 'Setzen'}</button>${S.parentPin ? '<button type="button" class="btn2" data-act="delpin" style="width:auto;min-height:52px;font-size:14px">Entfernen</button>' : ''}</div>`)}
      ${block('Familien-Code', 'Für das Duell mit Mama (kommt mit Etappe 3)', `<div class="between" style="background:#020124;border:2px dashed #FA6D1E;border-radius:12px;padding:10px 14px"><span class="h or" style="font-size:20px;letter-spacing:2px">${esc(S.famCode)}</span></div>`)}
      ${block('Spielstand sichern', 'Der Fortschritt liegt nur auf diesem Handy. Eine Sicherung schützt vor Verlust und hilft beim Handywechsel.', `<div class="g2" style="gap:8px"><button type="button" class="btn2" data-act="export" style="min-height:46px;font-size:14px">Sicherung speichern</button><label class="btn2" style="position:relative;min-height:46px;font-size:14px">Wiederherstellen<input type="file" accept="application/json,.json" data-import style="position:absolute;width:1px;height:1px;opacity:0"></label></div>`)}
      ${block('Fortschritt zurücksetzen', 'Löscht alle XP, Sterne, Münzen und Fotos auf diesem Handy.', st.confirm ? `<div class="g2"><button type="button" class="btn2" data-act="cancel">Abbrechen</button><button type="button" class="btn2" data-act="reset" style="border-color:#FF6B6B;color:#FF6B6B">Ja, alles löschen</button></div>` : '<button type="button" class="btn2" data-act="ask" style="border-color:#FF6B6B;color:#FF6B6B;min-height:46px;font-size:14px">Zurücksetzen …</button>')}
    </div>` : `<div class="card pad col" style="gap:10px"><span class="sm muted">Dieser Bereich ist mit einer Eltern-PIN geschützt.</span>
      <div class="row"><input id="pinin" class="inp" inputmode="numeric" maxlength="4" placeholder="PIN" style="flex:1;letter-spacing:4px" aria-label="Eltern-PIN"><button type="button" class="btn2" data-act="unlock" style="width:auto;min-height:52px">Öffnen</button></div>
      ${st.pinMsg ? `<span class="sm" style="color:#FF6B6B;font-weight:700">${esc(st.pinMsg)}</span>` : ''}</div>`}
  </section>

  <section class="set-sec">
    <span class="label or">Fotos</span>
    <a href="#/bildnachweise" class="card row" style="padding:12px 14px;color:#fff;text-decoration:none">${ic('img', 22, '#FA6D1E')}<span class="col" style="flex:1"><span style="font-weight:700">Bildnachweise</span><span class="xs muted">Die Fotos kommen von Wikipedia / Wikimedia Commons</span></span>${ic('arrow', 18, '#A9B4E8')}</a>
  </section>
  <section class="set-sec">
    <span class="label or">App aufs Handy</span>
    <div class="card pad"><span class="sm" style="line-height:1.5">In Chrome auf Android: oben rechts auf <b>⋮</b> → <b>„App installieren“</b>. Dann startet ¡Vamos! wie eine echte App – auch ohne Internet.</span></div>
  </section>
  <span class="xs muted" style="text-align:center">¡Vamos! · Version 1.6${learnedToday ? ' · heute schon trainiert ✓' : ''}</span>
</div>`;
  }

  root.onclick = (e) => {
    let x;
    if ((x = e.target.closest('[data-sw]'))) { S[x.dataset.sw] = x.getAttribute('aria-checked') !== 'true'; save(); draw(); return; }
    if ((x = e.target.closest('[data-seg]'))) { const k = x.dataset.seg; const v = x.dataset.val; S[k] = k === 'qcount' ? +v : v; save(); draw(); return; }
    if ((x = e.target.closest('[data-day]'))) { const d = +x.dataset.day; S.planDays = S.planDays.includes(d) ? S.planDays.filter((n) => n !== d) : S.planDays.concat(d); if (!S.planDays.length) S.planDays = [d]; save(); draw(); return; }
    if ((x = e.target.closest('[data-prev]'))) { const key = x.dataset.prev; const sel = root.querySelector(`[data-voice="${key}"]`); const lang = key === 'voiceEs' ? 'es-ES' : 'de-DE'; if (sel.value) previewVoice(sel.value, lang); else joseSay(lang === 'es-ES' ? '¡Hola, Mourice! ¿Vamos a aprender español?' : 'Hallo Mourice! Lust auf ein kurzes Training?', true); return; }
    if ((x = e.target.closest('[data-mode]'))) { S.avatarMode = x.dataset.mode; save(); draw(); return; }
    if (!(x = e.target.closest('[data-act]'))) return;
    const a = x.dataset.act;
    if (a === 'name') { const v = root.querySelector('#nm').value.trim(); if (v) { S.name = v; save(); toast('¡Hola, ' + v + '!'); draw(); } }
    if (a === 'test') { playTone(true); joseSay('¡Hola! So klinge ich gerade. ¡Vamos!', true); }
    if (a === 'delphoto') { try { localStorage.removeItem('vamos-photo-profile'); } catch (err) { /* */ } S.avatarMode = 'figur'; save(); draw(); }
    if (a === 'unlock') { const v = root.querySelector('#pinin').value; if (v === S.parentPin) { st.unlocked = true; st.pinMsg = ''; } else st.pinMsg = 'Falsche PIN.'; draw(); }
    if (a === 'setpin') { const v = root.querySelector('#pin').value.trim(); if (/^\d{4}$/.test(v)) { S.parentPin = v; save(); toast('Eltern-PIN gespeichert'); draw(); } else toast('Bitte genau 4 Ziffern eingeben'); }
    if (a === 'delpin') { S.parentPin = ''; save(); toast('PIN entfernt'); draw(); }
    if (a === 'ask') { st.confirm = true; draw(); }
    if (a === 'cancel') { st.confirm = false; draw(); }
    if (a === 'reset') { Object.keys(localStorage).filter((k) => k.startsWith('vamos-')).forEach((k) => localStorage.removeItem(k)); resetAll(); location.hash = '#/start'; location.reload(); }
    if (a === 'export') {
      const data = {}; Object.keys(localStorage).filter((k) => k.startsWith('vamos-')).forEach((k) => { data[k] = localStorage.getItem(k); });
      const blob = new Blob([JSON.stringify({ app: 'vamos', saved: new Date().toISOString(), data })], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const link = document.createElement('a');
      link.href = url; link.download = `vamos-spielstand-${today()}.json`; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000); toast('Sicherung gespeichert – sie liegt bei den Downloads.');
    }
  };
  root.onchange = async (e) => {
    const t = e.target;
    if (t.id === 'school') { S.school = t.value; save(); toast('Gespeichert: ' + t.selectedOptions[0].textContent); draw(); return; }
    if (t.matches('[data-voice]')) { S[t.dataset.voice] = t.value; save(); toast(t.value ? 'Stimme gespeichert' : 'Automatische Stimme'); return; }
    if (t.id === 'ptime') { S.planTime = t.value || '14:30'; save(); toast('Uhrzeit gespeichert'); return; }
    if (t.matches('[data-photo]')) {
      const f = t.files && t.files[0]; if (!f) return;
      try { const d = await squareCrop(f); if (!savePhoto('profile', d)) { toast('Speicher voll – Foto zu groß.'); return; } S.avatarMode = 'foto'; save(); playTone(true); toast('¡Qué guapo! Profilbild gespeichert.'); draw(); } catch (err) { toast('Das Foto konnte nicht gelesen werden.'); }
      return;
    }
    if (t.matches('[data-import]')) {
      const f = t.files && t.files[0]; if (!f) return;
      try {
        const j = JSON.parse(await f.text());
        if (j.app !== 'vamos' || !j.data || !j.data['vamos-state-v1']) throw new Error('falsch');
        Object.keys(localStorage).filter((k) => k.startsWith('vamos-')).forEach((k) => localStorage.removeItem(k));
        Object.entries(j.data).forEach(([k, v]) => { if (k.startsWith('vamos-')) localStorage.setItem(k, v); });
        toast('Spielstand wiederhergestellt!'); setTimeout(() => { location.hash = '#/start'; location.reload(); }, 900);
      } catch (err) { toast('Das ist keine gültige ¡Vamos!-Sicherung.'); }
    }
  };
  onVoices(() => { if (location.hash.includes('einstellungen') || location.hash.includes('profil')) draw(); });
  draw();
}
