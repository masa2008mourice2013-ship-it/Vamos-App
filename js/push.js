// Push-Erinnerungen: Anmelden, Einstellungen übertragen, Bestätigen
import { PUSH_SERVER } from './config.js';
import { S, save, today } from './store.js';

const server = () => PUSH_SERVER.replace(/\/$/, '');
export const pushConfigured = () => !!PUSH_SERVER;
export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
export const permission = () => ('Notification' in window ? Notification.permission : 'denied');

function keyBytes(b64) { const s = b64.replace(/-/g, '+').replace(/_/g, '/'); const bin = atob(s + '==='.slice((s.length + 3) % 4)); return Uint8Array.from(bin, (c) => c.charCodeAt(0)); }
async function post(path, body) {
  const r = await fetch(server() + path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return r.json().catch(() => ({ ok: r.ok }));
}
function payload(sub) {
  return { id: S.pushId, sub, on: S.pushOn, name: S.name, days: S.planDays, time: S.planTime, until: S.pushUntil || '20:00', interval: S.pushInterval || 15 };
}

export async function enablePush() {
  if (!pushConfigured()) throw new Error('Der Push-Server ist noch nicht eingetragen.');
  if (!pushSupported()) throw new Error('Dieses Gerät oder dieser Browser kann keine Push-Nachrichten.');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Benachrichtigungen wurden nicht erlaubt. Du kannst sie in den Chrome-Einstellungen für diese Seite erlauben.');
  const reg = await navigator.serviceWorker.ready;
  const { publicKey } = await (await fetch(server() + '/vapid')).json();
  let sub = await reg.pushManager.getSubscription();
  if (sub) { try { const k = new Uint8Array(sub.options.applicationServerKey || []); if (k.length && btoa(String.fromCharCode(...k)) !== btoa(String.fromCharCode(...keyBytes(publicKey)))) { await sub.unsubscribe(); sub = null; } } catch (e) { /* */ } }
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) });
  if (!S.pushId) S.pushId = 'mo-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  S.pushOn = true; save();
  const res = await post('/subscribe', payload(sub.toJSON()));
  if (!res.ok) throw new Error(res.error || 'Der Push-Server hat nicht geantwortet.');
  return true;
}
export async function disablePush() {
  S.pushOn = false; save();
  try { if (pushConfigured() && S.pushId) await post('/unsubscribe', { id: S.pushId }); } catch (e) { /* offline */ }
  try { const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription(); if (sub) await sub.unsubscribe(); } catch (e) { /* */ }
}
// Nach Änderungen (Lerntage, Uhrzeit, Abstand, Name) neu übertragen
export async function syncPush() {
  if (!S.pushOn || !pushConfigured() || !pushSupported()) return;
  try { const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription(); if (sub) await post('/subscribe', payload(sub.toJSON())); } catch (e) { /* offline – beim nächsten Mal */ }
}
export async function testPush() { return post('/test', { id: S.pushId }); }
// "Heute erledigt" – stoppt die Wiederholungen für heute
export function ackPush() {
  if (!S.pushOn || !pushConfigured() || !S.pushId || S.pushAck === today()) return;
  S.pushAck = today(); save();
  post('/ack', { id: S.pushId }).catch(() => { S.pushAck = ''; save(); });
}
