// Seite 4: Spiele-Übersicht
import { S } from '../store.js';
import { header, ic, jose } from '../ui.js';

export function render(root) {
  const games = [
    ['serpiente', 'snake', 'Serpiente', 'Die Schlange frisst die Buchstaben des spanischen Worts in der richtigen Reihenfolge.', `Rekord: ${S.records.snake} Wörter`],
    ['tres', 'grid', 'Tres en raya', 'Tic-Tac-Toe gegen José: Nur wer die Vokabel weiß, darf sein Feld setzen.', `Siege: ${S.records.tres}`],
    ['saque', 'ball', 'Saque', 'Volleyball-Aufschlag: Tipp das richtige Wort, bevor der Ball aufkommt.', `Rekord: ${S.records.saque} Ballwechsel`],
    ['memoria', 'memory', 'Memoria', 'Memory: Finde die Paare aus deutschem und spanischem Wort.', S.records.memo ? `Bestzeit: ${Math.floor(S.records.memo / 60)}:${String(S.records.memo % 60).padStart(2, '0')}` : 'Noch keine Bestzeit'],
  ];
  const line = S.rounds > 0
    ? `Du hast ${S.rounds} ${S.rounds === 1 ? 'Spielrunde' : 'Spielrunden'}. Wie wär's mit Saque? ${S.records.saque ? `Dein Rekord liegt bei ${S.records.saque} Ballwechseln – schaffst du ${S.records.saque + 1}?` : 'Zeig mal, was du kannst!'}`
    : 'Keine Spielrunden mehr – ein Training bringt dir 3 neue! ¡Vamos!';
  root.innerHTML = header('Spiele') + `<div class="content">
  ${jose(line)}
  <div class="row" style="padding:12px 14px;border-left:4px solid #FA6D1E;background:#0B1A6E;border-radius:0 12px 12px 0">
    <div class="col"><span style="font-weight:900;font-size:17px">${S.rounds} ${S.rounds === 1 ? 'Spielrunde' : 'Spielrunden'} frei</span><span class="sm muted">Jedes Training schenkt dir 3 neue Runden.</span></div>
  </div>
  ${S.rounds < 1 ? `<a href="#/training" class="btn">Jetzt trainieren ${ic('arrow', 20, 'currentColor', 3)}</a>` : ''}
  <div class="g2">${games.map(([id, i, n, t, rec]) => `<a href="#/spiele/${id}" class="tile"><span class="ic">${ic(i, 32)}</span><span class="h" style="font-size:22px;line-height:1.1">${n}</span><span class="muted" style="font-size:13px;line-height:1.4">${t}</span><span class="muted" style="font-size:12px;font-weight:700;margin-top:auto">${rec}</span></a>`).join('')}</div>
</div>`;
}
