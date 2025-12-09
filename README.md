# Klausuren-Portal (Next.js + Mock-DB)

Ein modernes Web-Portal zur Verwaltung und Anzeige von Schulklausuren nach Klasse, Lehrer und Nummer. Mit **Passwort-Schutz** und produktionsbereit zum Deployment.

## Features

✅ Schönes UI mit Tailwind CSS  
✅ Passwort-geschützt (Login)  
✅ Auswahl nach Schulklasse (10., 11., 12., 13.)  
✅ Filterung nach Lehrer (Herr Bär, Herr Schuster, Herr Uka)  
✅ Anzeige und Download von Klausuren-Dokumenten  
✅ **Kein Setup nötig** - In-Memory Mock-Datenbank  
✅ Einfach zu deployen (Vercel, Netlify, etc.)

## Lokale Installation & Start

### 1. Abhängigkeiten installieren

```bash
cd "/Users/yannik/Projekt Datenbank"
npm install
```

### 2. `.env.local` erstellen

Erstelle eine `.env.local` Datei im Projektroot:

```
PORTAL_PASSWORD=admin123
```

Das ist alles, was du lokal brauchst! (Die Mock-DB funktioniert ohne MongoDB)

### 3. Dev-Server starten

```bash
npm run dev
```

Die Website läuft unter: **http://localhost:3000**

### 4. Login

- **Passwort:** `admin123` (oder dein gewähltes Passwort aus `.env.local`)

## Verwendung

1. Öffne `http://localhost:3000`
2. Gib das Passwort ein
3. Wähle eine **Schulklasse** (10., 11., 12., 13.)
4. Wähle einen **Lehrer** (Herr Bär, Herr Schuster, Herr Uka)
5. Klicke **"Klausuren anschauen"**
6. Wähle eine Klausur aus und lade sie herunter

## Deployment mit Vercel (einfachste Variante)

### Schritt 1: Repository auf GitHub hochladen

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <dein-github-repo>
git push -u origin main
```

### Schritt 2: Bei Vercel deployen

1. Gehe zu https://vercel.com
2. Klicke "New Project"
3. Verbinde dein GitHub Repository
4. Klicke "Import"
5. **Wichtig:** Unter "Environment Variables" hinzufügen:
   - Key: `PORTAL_PASSWORD`
   - Value: `dein-sicheres-passwort`
6. Klicke "Deploy"

Fertig! Deine Website ist nun live mit einer `.vercel.app` Domain.

### Schritt 3: Custom Domain verbinden (optional)

Unter "Settings" → "Domains" kannst du deine eigene Domain hinzufügen.

## Deployment mit anderen Anbietern

### Netlify

```bash
npm run build
npm install -g netlify-cli
netlify deploy --prod
```

Umgebungsvariable in Netlify Dashboard setzen:
- `PORTAL_PASSWORD=dein-passwort`

### Eigener Server (Node.js)

```bash
npm run build
npm start
```

Server läuft auf Port 3000 (oder `PORT` Umgebungsvariable).

## Sicherheit

⚠️ **Wichtig:**
- Ändere das Passwort! (aktuell: `admin123`)
- Passwörter in `.env` sind **nicht sicher** für Production
- Für echte Sicherheit: Nutze NextAuth oder JWT

## Projektstruktur

```
pages/
  _app.tsx          # Next.js App-Wrapper
  index.tsx         # Startseite (Klasse/Lehrer-Auswahl) - Auth-geschützt
  login.tsx         # Login-Seite
  exams/index.tsx   # Klausuren-Anzeige - Auth-geschützt
  api/
    classes.ts      # API: GET /api/classes
    teachers.ts     # API: GET /api/teachers?classId=...
    exams.ts        # API: GET /api/exams?classId=...&teacherId=...
    auth/login.ts   # API: POST /api/auth/login

lib/
  auth.ts           # Auth Hook (useAuthProtection)
  mockdb.ts         # In-Memory Datenbank

components/
  Layout.tsx        # Header mit Logout-Button

styles/
  globals.css       # Tailwind CSS
```

## Troubleshooting

**"Falsches Passwort"**
- Überprüfe `.env.local`: `PORTAL_PASSWORD=dein-passwort`
- Dev-Server neustarten: `npm run dev`

**Build-Fehler**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Seite lädt nicht**
- Überprüfe, ob Server läuft: `npm run dev`
- Öffne Browser-Console (F12) → Console Tab
- Sag mir welche Fehler dort stehen

## Nächste Schritte

- [ ] Admin-Panel zum Hochladen von Klausuren
- [ ] Multi-User-Support (pro Lehrer Login)
- [ ] Stripe-Integration für echte Zahlungen
- [ ] MongoDB-Integration für Production
- [ ] Sicherere Auth (JWT, OAuth)

---

**Viel Erfolg mit deinem Portal!** 🎓
