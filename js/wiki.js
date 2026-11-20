// Echte Fotos aus Wikipedia / Wikimedia Commons – live geladen, mit Bildnachweis
// Die Bilder stehen unter freien Lizenzen (meist CC BY-SA). Fotograf und Lizenz werden angezeigt.

const ES = 'https://es.wikipedia.org/w/api.php';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';
const KEY = 'vamos-wiki-v1';
const RETRY = 7 * 864e5; // nicht gefundene Bilder nach 7 Tagen erneut versuchen

// Anzeigename in der App → Titel des spanischen Wikipedia-Artikels
export const WIKI = {
  'Museo Guggenheim': 'Museo Guggenheim Bilbao', 'Ría de Bilbao': 'Ría de Bilbao', 'Casco Viejo': 'Casco Viejo de Bilbao',
  'Pintxos': 'Pincho', 'Bacalao al pil-pil': 'Bacalao al pil pil', 'Txangurro': 'Txangurro',
  'Palacio Real': 'Palacio Real de Madrid', 'Museo del Prado': 'Museo del Prado', 'Parque del Retiro': 'Parque del Retiro',
  'Bocadillo de calamares': 'Bocadillo de calamares', 'Churros con chocolate': 'Churro', 'Cocido madrileño': 'Cocido madrileño',
  'Ciudad de las Artes y las Ciencias': 'Ciudad de las Artes y las Ciencias', 'La Lonja de la Seda': 'Lonja de la Seda', 'Playa de la Malvarrosa': 'Playa de la Malvarrosa',
  'Paella valenciana': 'Paella valenciana', 'Paella (vereinfacht)': 'Paella valenciana', 'Horchata': 'Horchata de chufa', 'Fartons': 'Fartón',
  'Universidad de Salamanca': 'Universidad de Salamanca', 'Plaza Mayor': 'Plaza Mayor de Salamanca', 'Catedral Nueva': 'Catedral Nueva de Salamanca',
  'Patatas meneás': 'Patatas meneás', 'Hornazo': 'Hornazo', 'Jamón de Guijuelo': 'Jamón de Guijuelo',
  'Fiesta de San Fermín': 'Sanfermines', 'Plaza del Castillo': 'Plaza del Castillo (Pamplona)', 'Murallas (Stadtmauer)': 'Murallas de Pamplona',
  'Chistorra': 'Chistorra', 'Pimientos del piquillo': 'Pimiento del piquillo', 'Queso Idiazábal': 'Queso Idiazábal',
  'Sagrada Família': 'Templo Expiatorio de la Sagrada Familia', 'Park Güell': 'Parque Güell', 'Playa de la Barceloneta': 'Playa de la Barceloneta',
  'Pan con tomate': 'Pan con tomate', 'Crema catalana': 'Crema catalana', 'Escalivada': 'Escalivada',
  'Catedral y La Giralda': 'Giralda', 'Real Alcázar': 'Real Alcázar de Sevilla', 'Plaza de España': 'Plaza de España (Sevilla)',
  'Gazpacho': 'Gazpacho', 'Salmorejo': 'Salmorejo', 'Tapas': 'Tapa (gastronomía)',
  'La Boca': 'La Boca', 'Plaza de Mayo': 'Plaza de Mayo', 'Teatro Colón': 'Teatro Colón',
  'Alfajores': 'Alfajor', 'Alfajores de maicena': 'Alfajor', 'Empanadas': 'Empanada', 'Dulce de leche': 'Dulce de leche',
  'Estancia': 'Estancia (finca)', 'La llanura': 'Llanura pampeana', 'Fiesta gaucha': 'Gaucho', 'Asado': 'Asado', 'Chimichurri': 'Chimichurri',
  'Aconcagua': 'Aconcagua', 'Cordillera de los Andes': 'Cordillera de los Andes', 'Mendoza': 'Mendoza (Argentina)',
  'Mate': 'Mate (infusión)', 'Humita': 'Humita', 'Locro': 'Locro', 'Tortilla de patatas': 'Tortilla de patatas',
};

let cache = null;
function load() { if (!cache) { try { cache = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { cache = {}; } } return cache; }
function store() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch (e) { /* voll */ } }
export function cached(name) { const c = load()[name]; return c && c.thumb ? c : null; }
export function allCached() { return Object.entries(load()).filter(([, v]) => v && v.thumb); }

const strip = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
async function api(base, params) {
  const u = new URL(base);
  Object.entries(Object.assign({ format: 'json', origin: '*', formatversion: '2' }, params)).forEach(([k, v]) => u.searchParams.set(k, v));
  const r = await fetch(u.toString()); if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.json();
}
const PAGE = { prop: 'pageimages|extracts|info', inprop: 'url', piprop: 'thumbnail|name', pithumbsize: '800', exintro: '1', explaintext: '1', exsentences: '2', exlimit: 'max' };
function toInfo(p) {
  if (!p || p.missing || !p.thumbnail) return null;
  return { thumb: p.thumbnail.source, file: p.pageimage, title: p.title, url: p.fullurl || ('https://es.wikipedia.org/wiki/' + encodeURIComponent(p.title)), extract: (p.extract || '').slice(0, 400) };
}

const pending = new Map();
// Lädt Bilder für mehrere Namen (fehlende werden über Wikipedia gesucht)
export function getImages(names) {
  const c = load(); const now = Date.now();
  const fresh = [...new Set(names)].filter((n) => !pending.has(n) && (!(n in c) || (c[n] && c[n].miss && now - c[n].miss > RETRY)));
  if (!fresh.length) return Promise.all(names.map((n) => pending.get(n) || Promise.resolve(cached(n))));
  const job = (async () => {
    const out = {};
    try {
      const titles = fresh.map((n) => WIKI[n] || n);
      const j = await api(ES, Object.assign({ action: 'query', redirects: '1', titles: titles.join('|') }, PAGE));
      const q = j.query || {}; const map = {};
      (q.normalized || []).forEach((x) => { map[x.from] = x.to; });
      (q.redirects || []).forEach((x) => { map[x.from] = x.to; });
      const byTitle = {}; (q.pages || []).forEach((p) => { byTitle[p.title] = p; });
      fresh.forEach((n, i) => { let t = titles[i]; for (let k = 0; k < 3 && map[t]; k++) t = map[t]; out[n] = toInfo(byTitle[t]); });
      // Nicht gefunden? Dann über die Wikipedia-Suche
      for (const n of fresh.filter((x) => !out[x])) {
        try {
          const s = await api(ES, Object.assign({ action: 'query', generator: 'search', gsrsearch: WIKI[n] || n, gsrlimit: '3', gsrnamespace: '0' }, PAGE));
          const pages = ((s.query || {}).pages || []).sort((a, b) => (a.index || 0) - (b.index || 0));
          out[n] = toInfo(pages.find((p) => p.thumbnail)) || null;
        } catch (e) { /* weiter */ }
      }
      // Bildnachweis von Wikimedia Commons holen
      const files = [...new Set(Object.values(out).filter(Boolean).map((v) => v.file).filter(Boolean))];
      for (let k = 0; k < files.length; k += 40) {
        try {
          const m = await api(COMMONS, { action: 'query', prop: 'imageinfo', iiprop: 'extmetadata|url', titles: files.slice(k, k + 40).map((f) => 'File:' + f).join('|') });
          const norm = {}; ((m.query || {}).normalized || []).forEach((x) => { norm[x.to] = x.from; });
          ((m.query || {}).pages || []).forEach((p) => {
            const ii = (p.imageinfo || [])[0]; if (!ii) return;
            const md = ii.extmetadata || {}; const fname = (norm[p.title] || p.title).replace(/^File:/, '').replace(/^Archivo:/, '');
            Object.values(out).forEach((v) => { if (v && (v.file === fname || 'File:' + v.file === p.title || v.file.replace(/_/g, ' ') === p.title.replace(/^File:/, ''))) {
              v.artist = strip(md.Artist && md.Artist.value).slice(0, 80) || 'unbekannt';
              v.license = strip(md.LicenseShortName && md.LicenseShortName.value) || 'freie Lizenz';
              v.filepage = ii.descriptionurl || ('https://commons.wikimedia.org/wiki/File:' + encodeURIComponent(v.file));
            } });
          });
        } catch (e) { /* Bild trotzdem zeigen */ }
      }
      fresh.forEach((n) => { c[n] = out[n] || { miss: Date.now() }; });
      store();
    } catch (e) { /* offline – Platzhalter bleiben */ }
    fresh.forEach((n) => pending.delete(n));
    return out;
  })();
  fresh.forEach((n) => pending.set(n, job.then((o) => o[n] || null)));
  return Promise.all(names.map((n) => pending.get(n) || Promise.resolve(cached(n))));
}

export const credit = (v) => v ? `Foto: ${v.artist || 'Wikimedia Commons'}${v.license ? ' · ' + v.license : ''} · Wikimedia Commons` : '';

// Deutsche Fassung: Einleitung aus der deutschen Wikipedia (über den Sprachlink des Artikels)
export async function getGerman(name) {
  const c = load(); const v = c[name]; if (!v || !v.title) return null;
  if (v.deExtract !== undefined) return v.deExtract;
  try {
    const l = await api(ES, { action: 'query', prop: 'langlinks', lllang: 'de', titles: v.title });
    const page = ((l.query || {}).pages || [])[0] || {}; const link = (page.langlinks || [])[0];
    if (!link) { v.deExtract = null; store(); return null; }
    const deTitle = link.title || link['*'];
    const d = await api('https://de.wikipedia.org/w/api.php', { action: 'query', prop: 'extracts|info', inprop: 'url', exintro: '1', explaintext: '1', exsentences: '2', titles: deTitle });
    const dp = ((d.query || {}).pages || [])[0] || {};
    v.deExtract = dp.extract ? { text: dp.extract.slice(0, 400), url: dp.fullurl || '' } : null; store();
    return v.deExtract;
  } catch (e) { return undefined; }
}
