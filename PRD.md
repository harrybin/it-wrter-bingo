# Tech Bingo - Spielkonzept

Ein modernes Bingo-Spiel mit IT-Fachbegriffen anstelle von Zahlen für ein spielerisches Lernerlebnis.

**Experience Qualities**: 
1. Intuitiv - Sofortige Verständlichkeit durch klare visuelle Hierarchie
2. Interaktiv - Befriedigende Klick-Erfahrung mit direktem visuellen Feedback
3. Modern - Zeitgemäße Ästhetik mit glassmorphen Elementen und subtilen Animationen

**Complexity Level**: Light Application (multiple features with basic state)
- Einfaches Gameplay mit persistentem Zustand und mehreren Interaktionsmöglichkeiten

## Essential Features

**Bingo-Feld generieren**
- Functionality: Erstellt ein 5x5 Raster mit zufällig verteilten IT-Begriffen
- Purpose: Jedes Spiel ist einzigartig und herausfordernd
- Trigger: Beim Laden der App oder durch "Neues Spiel" Button
- Progression: App-Start → Begriffe mischen → 5x5 Raster anzeigen → Spiel bereit
- Success criteria: 25 eindeutige Begriffe sind sichtbar und klickbar

**Begriff markieren/demarkieren**
- Functionality: Klick auf Feld togglet zwischen markiert/unmarkiert
- Purpose: Spieler können ihre Fortschritte verfolgen
- Trigger: Mausklick oder Touch auf beliebiges Feld
- Progression: Feld klicken → Visueller Zustandswechsel → Markierung gespeichert
- Success criteria: Zustand bleibt bei Seitenreload erhalten

**Bingo-Erkennung**
- Functionality: Automatische Prüfung auf komplette Reihen (horizontal, vertikal, diagonal)
- Purpose: Sofortige Erfolgsmeldung steigert Spielfreude
- Trigger: Nach jeder Markierung automatisch
- Progression: Markierung setzen → Bingo-Check → Erfolg anzeigen (falls vorhanden)
- Success criteria: Korrekte Erkennung aller 12 möglichen Bingo-Linien mit Celebration

**Neues Spiel starten**
- Functionality: Zurücksetzen des Spielfelds mit neuer Begriffsmischung
- Purpose: Beliebig viele Runden spielbar
- Trigger: "Neues Spiel" Button
- Progression: Button klicken → Begriffe neu mischen → Markierungen löschen → Neues Feld anzeigen
- Success criteria: Vollständiger Reset mit neuer Anordnung

## Edge Case Handling

- **Alle Begriffe markiert**: Gratulation mit Option für neues Spiel
- **Mehrfache Bingos**: Hervorhebung aller gewinnenden Linien gleichzeitig
- **Schnelle Klicks**: Debouncing verhindert ungewollte Mehrfachmarkierungen
- **Kleine Bildschirme**: Responsive Anpassung der Feldgrößen

## Design Direction

Das Design soll modern und technisch-elegant wirken, passend zur IT-Thematik, mit glassmorphen Elementen und einer minimalistischen Benutzeroberfläche, die den Fokus auf das Gameplay legt.

## Color Selection

Triadic - Drei ausgewogene Farben schaffen ein dynamisches, tech-orientiertes Erscheinungsbild mit klarer visueller Hierarchie.

- **Primary Color**: Kühles Blau (oklch(0.65 0.2 230)) - Vermittelt Technologie und Vertrauen
- **Secondary Colors**: Warmes Orange (oklch(0.75 0.15 60)) für Akzente und Interaktionen
- **Accent Color**: Leuchtendes Grün (oklch(0.7 0.18 150)) für Erfolg und markierte Felder
- **Foreground/Background Pairings**: 
  - Background (Dunkles Blau oklch(0.15 0.05 230)): Weißer Text (oklch(0.98 0 0)) - Ratio 15.2:1 ✓
  - Card (Transparentes Weiß oklch(0.95 0 0 / 0.1)): Dunkler Text (oklch(0.2 0 0)) - Ratio 12.8:1 ✓
  - Primary (Kühles Blau oklch(0.65 0.2 230)): Weißer Text (oklch(0.98 0 0)) - Ratio 8.9:1 ✓
  - Accent (Grün oklch(0.7 0.18 150)): Weißer Text (oklch(0.98 0 0)) - Ratio 7.2:1 ✓

## Font Selection

Inter für klare Lesbarkeit und moderne Technik-Ästhetik mit optimalen Zeichenabständen für deutsche Begriffe.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - Bingo-Felder: Inter Medium/14px/normal spacing auf Desktop, 12px auf Mobile
  - Buttons: Inter SemiBold/16px/wide letter spacing
  - Status: Inter Regular/18px/normal spacing

## Animations

Subtile, zweckorientierte Animationen verstärken das Feedback ohne vom Gameplay abzulenken und schaffen einen premium-Eindruck.

- **Purposeful Meaning**: Glassmorphe Hover-Effekte verstärken die moderne Tech-Ästhetik
- **Hierarchy of Movement**: Bingo-Erfolg hat höchste Animationspriorität, Feld-Markierungen mittlere Priorität

## Component Selection

- **Components**: Card für Bingo-Felder, Button für Aktionen, Badge für Status-Anzeigen
- **Customizations**: Glassmorphe Card-Varianten mit backdrop-blur, Custom Bingo-Grid Layout
- **States**: 
  - Bingo-Felder: Default, Hover (glassmorpher Glow), Selected (grüner Akzent), Winning-Line (goldener Rahmen)
  - Buttons: Standard shadcn Zustände mit custom Glassmorphie
- **Icon Selection**: Phosphor Icons - Plus für neues Spiel, Crown für Bingo-Erfolg
- **Spacing**: Konsistente 4px-8px-16px Abstände, größere Gaps für Touch-Freundlichkeit
- **Mobile**: Stapelbasierte Layouts, vergrößerte Touch-Targets (min 44px), reduzierte Textgrößen