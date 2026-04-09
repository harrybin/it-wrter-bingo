# IT-Wörter Bingo

Interaktive Bingo-Web-App zum Lernen von IT-Begriffen.

## Features

- 5x5 Bingo-Feld mit zufälligen IT-Begriffen
- Klickbare Felder mit automatischer Bingo-Erkennung (Reihen, Spalten, Diagonalen)
- Spielstatistik (gespielte Runden, erreichte Bingos)
- Zusätzlicher Reiter für Zufalls-Begriffsauswahl
- Responsives UI für Desktop und Mobile

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui Komponenten
- Playwright für End-to-End-Tests

## Entwicklung

```bash
npm install
npm run dev
```

App lokal öffnen: <http://localhost:5173>

Alternativ mit PowerShell-Skript:

```powershell
.\run.ps1
```

## Verfügbare Skripte

- `npm run dev` – Entwicklungsserver starten
- `npm run build` – Produktions-Build erstellen
- `npm run preview` – Build lokal ansehen
- `npm run lint` – ESLint ausführen
- `npm run test:e2e` – Playwright-Tests ausführen

## Hinweis

Dieses Projekt wurde ursprünglich mit GitHub Spark erstellt und danach eigenständig weiterentwickelt.
