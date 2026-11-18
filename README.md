# ¡Vamos! – Spanisch mit José

Die Vokabel-App für Mourice. Etappe 1: alle Bildschirme, Training, 4 Spiele, José, Spanien-Tour, Trophäen, Rezepte und Vokabel-Scanner. Der Fortschritt wird auf dem Handy gespeichert, und die App lässt sich auf Android installieren.

## Was ist in diesem Ordner?

| Datei / Ordner | Wofür |
|---|---|
| `index.html` | Die Startseite der App |
| `css/` | Aussehen (Farben, Schriften, Abstände) |
| `js/` | Die Funktionen: Bildschirme, Spiele, Spielstand |
| `js/data.js` | **Inhalte**: Städte, Vokabeln, Fakten, Rezepte – hier kommen später die Vokabeln aus dem Buch rein |
| `assets/` | Logo, Spanien-Karte, App-Symbole |
| `manifest.webmanifest`, `sw.js` | Damit sich die App installieren lässt und offline läuft |
| `netlify.toml` | Einstellungen für Netlify |

## 1. Dateien zu GitHub hochladen

1. Auf github.com einloggen, oben rechts auf **+** → **New repository**.
2. Name: `vamos-app`. Sichtbarkeit: **Private** (geht auch mit Netlify). Auf **Create repository** klicken.
3. Auf der neuen, leeren Seite auf den Link **uploading an existing file** klicken.
4. Die ZIP-Datei auf dem Computer entpacken. Den **Inhalt** des Ordners (also `index.html`, `css`, `js`, `assets` usw. – nicht den Ordner selbst) ins Browserfenster ziehen.
5. Warten, bis alle Dateien in der Liste stehen. Unten auf **Commit changes** klicken.

## 2. Mit Netlify verbinden

1. Auf app.netlify.com einloggen → **Add new site** → **Import an existing project**.
2. **GitHub** wählen und Netlify den Zugriff erlauben (bei „Only select repositories“ `vamos-app` auswählen).
3. Das Repository `vamos-app` anklicken.
4. Bei den Einstellungen nichts ändern (Build command leer lassen). Auf **Deploy** klicken.
5. Nach etwa einer Minute ist die App online. Unter **Site configuration** → **Change site name** einen schönen Namen vergeben, z. B. `vamos-mourice` → Adresse: `https://vamos-mourice.netlify.app`.

## 3. Auf Mourice' Android-Handy installieren

1. Die Adresse in **Chrome** öffnen.
2. Oben rechts auf **⋮** → **App installieren** (oder **Zum Startbildschirm hinzufügen**).
3. Fertig: José ist jetzt als App-Symbol auf dem Startbildschirm und funktioniert auch ohne Internet.

Wichtig: Der Spielstand liegt im Browser des Handys. Bitte nicht „Browserdaten löschen“ für diese Seite.

## Später etwas ändern

Geänderte Dateien bei GitHub einfach neu hochladen (**Add file** → **Upload files**) und **Commit changes** klicken. Netlify veröffentlicht die neue Version automatisch nach etwa einer Minute.

## Nächste Etappen

- **Etappe 2:** Push-Erinnerungen Mo/Mi/Fr um 14:30
- **Etappe 3:** Duell mit Mama (Familien-Code) und echte Fotos aus Wikipedia
- **Vokabeln aus ¡Apúntate! 3:** sobald das Inhaltsverzeichnis da ist

Hinweis: Der Vokabel-Scanner nutzt die kostenlose Texterkennung Tesseract.js und lädt beim ersten Scan einmalig das Sprachwissen (einige MB) aus dem Internet.
