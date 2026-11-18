// Zeichnungen: Spieler-Figur und Gerichte (bis echte Fotos kommen)
export function avatarSVG(sel, size = 150) {
  const SK = '#D9A27A';
  const shirts = { basic: ['#E4E7F5', '#E4E7F5', 0, 0], orange: ['#FA6D1E', '#020124', 0, 1], carmesi: ['#C2185B', '#FFFFFF', 0, 1], blanco: ['#FFFFFF', '#020124', 0, 1], streifen: ['#0B1A6E', '#FFFFFF', 1, 1] };
  const pants = { standard: '#3A4170', navy: '#020124', weiss: '#E4E7F5', carmesi: '#C2185B' };
  const shoes = { keine: null, orange: '#FA6D1E', weiss: '#FFFFFF', schwarz: '#1A1A1A' };
  const sh = shirts[sel.trikot] || shirts.basic; const hair = sel.haar; const shoe = shoes[sel.schuhe];
  const stripe = sel.hose === 'carmesi' ? '#FFFFFF' : sel.hose === 'standard' ? '#3A4170' : '#FA6D1E';
  const hairs = {
    kurz: `<path d="M56 44 q2 -26 26 -26 q22 0 22 24 q-8 -10 -24 -10 q-14 0 -24 12z" fill="${hair}"/>`,
    locken: `<g fill="${hair}"><circle cx="60" cy="36" r="9"/><circle cx="66" cy="26" r="9"/><circle cx="78" cy="21" r="10"/><circle cx="91" cy="23" r="10"/><circle cx="101" cy="32" r="9"/><circle cx="104" cy="42" r="6"/><circle cx="57" cy="45" r="6"/></g>`,
    undercut: `<path d="M58 40 q0 -14 10 -18 q14 -12 34 -4 q-6 2 -6 6 q6 2 8 10 q-14 -6 -28 -4 q-12 2 -18 10z" fill="${hair}"/>`,
    lang: `<path d="M56 46 q-2 -30 24 -30 q26 0 24 30 v22 q-4 4 -8 0 v-26 q-8 -8 -16 -8 q-8 0 -16 8 v26 q-4 4 -8 0z" fill="${hair}"/>`,
  };
  return `<svg viewBox="0 0 160 230" width="${size}" role="img" aria-label="Dein Spieler" style="display:block;height:auto">
<ellipse cx="80" cy="222" rx="46" ry="6" fill="#18288A"/>
<rect x="62" y="150" width="14" height="62" rx="6" fill="${SK}"/><rect x="84" y="150" width="14" height="62" rx="6" fill="${SK}"/>
<rect x="58" y="200" width="22" height="12" rx="5" fill="#C9CEE6"/><rect x="80" y="200" width="22" height="12" rx="5" fill="#C9CEE6"/>
${shoe ? `<rect x="54" y="204" width="28" height="15" rx="7" fill="${shoe}"/><rect x="78" y="204" width="28" height="15" rx="7" fill="${shoe}"/><path d="M58 212h18M84 212h18" stroke="${sel.schuhe === 'weiss' ? '#FA6D1E' : '#FFFFFF'}" stroke-width="2"/>` : ''}
<rect x="58" y="138" width="44" height="30" rx="6" fill="${pants[sel.hose] || pants.standard}"/>
<rect x="60" y="140" width="5" height="26" fill="${stripe}"/><rect x="95" y="140" width="5" height="26" fill="${stripe}"/>
<rect x="38" y="84" width="14" height="52" rx="7" fill="${SK}" transform="rotate(12 45 86)"/><rect x="108" y="84" width="14" height="52" rx="7" fill="${SK}" transform="rotate(-12 115 86)"/>
<rect x="72" y="66" width="16" height="14" fill="${SK}"/>
<path d="M52 82 q28 -10 56 0 l6 60 h-68 z" fill="${sh[0]}"/><path d="M38 86 l14 -4 l2 22 l-14 2z M122 86 l-14 -4 l-2 22 l14 2z" fill="${sh[0]}"/>
${sh[2] ? '<g fill="#FA6D1E"><rect x="62" y="80" width="7" height="62"/><rect x="76" y="78" width="7" height="64"/><rect x="90" y="80" width="7" height="62"/></g>' : ''}
${sh[3] ? `<text x="80" y="122" text-anchor="middle" font-family="Roboto, sans-serif" font-size="26" font-weight="900" fill="${sh[1]}">10</text>` : ''}
<circle cx="80" cy="46" r="24" fill="${SK}"/>
${hairs[sel.frisur] || hairs.kurz}
<circle cx="71" cy="49" r="2.6" fill="#2A1A14"/><circle cx="89" cy="49" r="2.6" fill="#2A1A14"/>
<path d="M72 58 q8 7 16 0" fill="none" stroke="#2A1A14" stroke-width="2.4" stroke-linecap="round"/>
${sel.band !== 'keins' ? `<g fill="${sel.band}"><rect x="55" y="32" width="50" height="9" rx="4"/><path d="M104 36 l10 -6 l-2 10z"/></g>` : ''}
${sel.brille === 'sonne' ? '<g><rect x="62" y="43" width="15" height="10" rx="4" fill="#020124"/><rect x="83" y="43" width="15" height="10" rx="4" fill="#020124"/><path d="M77 47h6" stroke="#020124" stroke-width="2.4"/></g>' : ''}
${sel.brille === 'sport' ? '<path d="M58 44 q22 -6 44 0 l-2 9 q-20 -4 -40 0z" fill="#FA6D1E" stroke="#020124" stroke-width="2"/>' : ''}
${sel.extra === 'ball' ? '<g><circle cx="132" cy="136" r="16" fill="#fff"/><path d="M117 132 q15 -10 30 0 M119 144 q13 8 26 0 M132 120 q-8 16 0 32" fill="none" stroke="#FA6D1E" stroke-width="2.4"/></g>' : ''}
${sel.extra === 'pokal' ? '<g fill="#E8A317"><path d="M120 118 h24 v10 a12 12 0 0 1 -24 0z"/><rect x="129" y="140" width="6" height="8"/><rect x="123" y="148" width="18" height="5" rx="2"/></g>' : ''}
</svg>`;
}

// Gericht-Zeichnung 300x300 (für Puzzle und Rezeptkarte)
export function dishInner(id) {
  const plate = '<rect width="300" height="300" fill="#18288A"/><ellipse cx="150" cy="168" rx="138" ry="112" fill="#fff"/><ellipse cx="150" cy="168" rx="118" ry="94" fill="none" stroke="#E4E7F5" stroke-width="4"/>';
  const d = {
    tortilla: '<ellipse cx="150" cy="172" rx="100" ry="58" fill="#C98A2E"/><ellipse cx="150" cy="162" rx="100" ry="56" fill="#E8B04A"/><path d="M150 162 L250 162 A100 56 0 0 1 208 207 Z" fill="#F7D98A"/><path d="M162 172 q36 4 78 0 M170 182 q30 4 60 2" stroke="#E9C063" stroke-width="3" fill="none"/><g fill="#D08A2A" opacity=".55"><ellipse cx="100" cy="150" rx="14" ry="6"/><ellipse cx="140" cy="138" rx="10" ry="5"/><ellipse cx="120" cy="180" rx="12" ry="5"/></g>',
    bocadillo: '<rect x="38" y="162" width="224" height="52" rx="26" fill="#D9A15B" stroke="#A86A2C" stroke-width="5"/><g fill="none" stroke-width="10"><circle cx="72" cy="152" r="19" stroke="#E9B95C"/><circle cx="108" cy="146" r="19" stroke="#F0C56C"/><circle cx="144" cy="152" r="19" stroke="#E9B95C"/><circle cx="180" cy="146" r="19" stroke="#F0C56C"/><circle cx="216" cy="152" r="19" stroke="#E9B95C"/></g><path d="M38 140 q0 -52 112 -54 q112 2 112 54 q0 10 -12 10 h-200 q-12 0 -12 -10z" fill="#E3AE68" stroke="#A86A2C" stroke-width="5"/><path d="M220 240 l52 -10 a28 28 0 0 1 -52 10z" fill="#F5D442" stroke="#C9A81A" stroke-width="4"/>',
    gazpacho: '<ellipse cx="150" cy="168" rx="92" ry="64" fill="#E4E7F5"/><ellipse cx="150" cy="160" rx="80" ry="50" fill="#D8442F"/><g fill="#7CC36E"><rect x="120" y="140" width="12" height="12" rx="2"/><rect x="160" y="160" width="12" height="12" rx="2"/></g><g fill="#F1E3C2"><rect x="140" y="170" width="12" height="12" rx="2"/><rect x="178" y="140" width="10" height="10" rx="2"/></g><path d="M118 150 q30 -12 64 0" stroke="#F26A52" stroke-width="5" fill="none"/>',
    paella: '<ellipse cx="150" cy="172" rx="118" ry="70" fill="#2B2B2B"/><ellipse cx="150" cy="166" rx="106" ry="60" fill="#F2B530"/><g fill="#E58A1F"><circle cx="110" cy="150" r="5"/><circle cx="160" cy="140" r="4"/><circle cx="190" cy="175" r="5"/><circle cx="130" cy="185" r="4"/></g><g fill="#B5562E"><ellipse cx="120" cy="165" rx="16" ry="10"/><ellipse cx="185" cy="152" rx="16" ry="10"/></g><g fill="#5DAA4A"><rect x="150" y="175" width="22" height="6" rx="3"/><rect x="95" y="140" width="22" height="6" rx="3"/></g><path d="M200 196 l40 -6 a20 20 0 0 1 -40 6z" fill="#F5D442"/>',
    pantomate: '<g><rect x="60" y="120" width="90" height="100" rx="20" fill="#E3AE68" stroke="#A86A2C" stroke-width="5"/><rect x="155" y="112" width="90" height="100" rx="20" fill="#E3AE68" stroke="#A86A2C" stroke-width="5"/><path d="M70 140 q35 -10 70 6 q-10 50 -60 60 q-14 -30 -10 -66z" fill="#E0523C" opacity=".85"/><path d="M165 132 q35 -10 70 6 q-10 50 -60 60 q-14 -30 -10 -66z" fill="#E0523C" opacity=".85"/></g><circle cx="240" cy="230" r="20" fill="#D8442F"/>',
    churros: '<g fill="#D29A4E" stroke="#A86A2C" stroke-width="3"><rect x="50" y="110" width="150" height="20" rx="10" transform="rotate(-12 125 120)"/><rect x="55" y="150" width="150" height="20" rx="10" transform="rotate(-6 130 160)"/><rect x="60" y="190" width="150" height="20" rx="10"/></g><ellipse cx="225" cy="190" rx="40" ry="34" fill="#E4E7F5"/><ellipse cx="225" cy="180" rx="32" ry="16" fill="#4A2A1A"/>',
  };
  return plate + (d[id] || d.tortilla);
}
export const dishSVG = (id, label) => `<svg viewBox="0 0 300 300" role="img" aria-label="${label || 'Zeichnung des Gerichts'}" style="width:100%;height:auto;display:block">${dishInner(id)}</svg>`;
