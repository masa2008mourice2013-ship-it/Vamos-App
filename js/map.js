// Spanien-Karte mit Route, Logo-Nadel und Endboss
import { CITIES } from './data.js';
import { S, unlocked, currentIndex } from './store.js';
import { LOGO } from './ui.js';

const W = 1750, H = 1340;
const lbl = (x, y, t, c = '#FFFFFF', anchor = 'middle', size = 55, w = 700) =>
  `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Roboto, sans-serif" font-size="${size}" font-weight="${w}" fill="${c}" stroke="#020124" stroke-width="16" paint-order="stroke">${t}</text>`;

export function mapHTML({ withPin = true } = {}) {
  const cur = currentIndex();
  const pts = CITIES.filter((c) => c.pos);
  // Route
  const path = 'M' + pts.map((c) => c.pos.join(' ')).join(' L');
  const curCity = CITIES[cur];
  const start = [1740, 20];
  let marks = '';
  pts.forEach((c) => {
    const i = CITIES.indexOf(c);
    const [x, y] = c.pos;
    const lv = S.levels[c.id];
    if (c.boss) {
      marks += `<circle cx="${x}" cy="${y}" r="165" fill="#C2185B" opacity="0.18"/><circle cx="${x}" cy="${y}" r="125" fill="#C2185B" opacity="0.3"/>
<circle cx="${x}" cy="${y}" r="95" fill="#C2185B" stroke="#FFFFFF" stroke-width="12"/>
<path d="M${x - 50} ${y - 16} q-22 -46 12 -62 M${x + 50} ${y - 16} q22 -46 -12 -62 M${x - 38} ${y - 8} q38 52 76 0 M${x - 18} ${y + 30} h36" fill="none" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>`;
      return;
    }
    const done = lv.stars >= 2;
    const isCur = i === cur;
    if (done) {
      marks += `<circle cx="${x}" cy="${y}" r="56" fill="#18288A" stroke="#FA6D1E" stroke-width="10"/><path d="M${x - 24} ${y} l16 18 l32 -36" fill="none" stroke="#FA6D1E" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>` + lbl(x, y + 125, c.name, '#FFFFFF');
    } else if (isCur) {
      marks += lbl(x, y + 95, c.name.toUpperCase(), '#FA6D1E', 'middle', 62, 900);
    } else {
      marks += `<circle cx="${x}" cy="${y}" r="52" fill="#020124" stroke="#A9B4E8" stroke-width="8"/><text x="${x}" y="${y + 19}" text-anchor="middle" font-family="Roboto, sans-serif" font-size="54" font-weight="700" fill="#A9B4E8">${c.num}</text>` + lbl(x - (c.id === 'valencia' ? 30 : 0), y + 125, c.name, '#A9B4E8', 'middle');
    }
  });
  const pinPos = curCity.pos || (cur === 0 ? [1640, 120] : [160, 1230]);
  const pct = (p) => `left:${(p[0] / W * 100).toFixed(2)}%; top:${(p[1] / H * 100).toFixed(2)}%`;
  const boss = CITIES.find((c) => c.boss);
  const firstDone = S.levels.start.stars >= 2;
  return `<div class="map" role="img" aria-label="Spanien-Karte: Du bist bei ${curCity.name}. Endboss El Toro wartet in Pamplona.">
<img class="base" src="assets/spain-map.png" alt="">
<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
<path d="M${start[0]} ${start[1]} Q1150 160 ${pts[0].pos[0]} ${pts[0].pos[1]}" fill="none" stroke="${firstDone ? '#FA6D1E' : '#A9B4E8'}" stroke-width="${firstDone ? 16 : 13}" ${firstDone ? '' : 'stroke-dasharray="2 34"'} stroke-linecap="round"/>
<path d="${path}" fill="none" stroke="#A9B4E8" stroke-width="13" stroke-dasharray="2 34" stroke-linecap="round"/>
<path d="M${pts[pts.length - 1].pos[0]} ${pts[pts.length - 1].pos[1]} Q240 1240 40 1300" fill="none" stroke="#A9B4E8" stroke-width="13" stroke-dasharray="2 34" stroke-linecap="round"/>
${lbl(30, 1290, '✈ a Buenos Aires', '#A9B4E8', 'start', 52, 700)}
<rect x="1520" y="0" width="230" height="86" rx="18" fill="#FA6D1E"/><text x="1635" y="60" text-anchor="middle" font-family="Roboto, sans-serif" font-size="50" font-weight="900" fill="#020124">START</text>
${marks}
</svg>
${withPin ? `<div class="pin" style="${pct(pinPos)}" aria-hidden="true"><div class="c"><img src="${LOGO}" alt=""></div><div class="tip"></div></div>` : ''}
<div class="boss-tag" style="${pct([boss.pos[0] + 120, boss.pos[1] - 60])}" aria-hidden="true"><span>JEFE FINAL</span><span>El Toro · Pamplona</span></div>
</div>`;
}
export { unlocked };
