---
name: lesson-graphics
description: Twórz i poprawiaj grafiki/sceny pojęciowe w lekcjach (ikony aktorów, ilustracje kroków algorytmów, przykłady). Używaj gdy user prosi o poprawę obrazków w lekcji, dopasowanie ikon do przykładów, nowe wizualizacje pojęć, albo gdy piszesz nowe strony concept-pages.
---

# Grafiki lekcyjne (concept scenes)

Sceny pojęciowe renderuje `JavaLessonExplanation.jsx` — aktorzy z
`javaConceptPages.js` (albo `gameConceptScenes`/`gameIntroPages` dla game-dev).
Każdy aktor: `actor(nazwa, stan, sprite, efekt?)`.

## Zasady treści (nauczone z review)

- **NIGDY sprite'y RPG** (`knight`, `ranger`, `rogue`, `coin`, `potion`,
  `wizard`, `cleric`, `player`) przy pojęciach algorytmicznych — postać
  nie mówi nic o operacji. Sprite'y atlasu zostaw tematom fabularnym.
- **Wartość WEWNĄTRZ komórki**, nie w podpisie pod ikoną — uczeń ma
  mapować „co gdzie siedzi" na pierwszy rzut oka.
- **Indeks liczbą, treść czymś innym** — przy tablicach używaj słów
  (`{"pies","kot","owca","koń"}`) zamiast `{4,9,2,7}`: `pets[0]` i wartość
  nie mylą się wizualnie. Liczby zostaw tam, gdzie sam fakt liczbowości
  jest przedmiotem (findMax, sortowanie wyników).
- **Stan = zdanie dokończenia**, np. `'pierwszy element'`, `'temp = 9'`,
  `'9 na ostatniej pozycji'` — nie powtarzaj wartości z ikony.
- **Kod przykładowy i result muszą się zgadzać ze sceną** — jeśli zmieniasz
  dane w aktorach, zsynchronizuj `code` i `result` tej strony.

## System ikon

Statyczne (klucz stringa): `look`, `compare`, `swap`, `shift`, `keep`,
`insert`, `tally`, `merge`, `split`, `pass`, `bars-sorted`, `warn`,
`pointer`, `cells`, `crash`, `stack` — mapa `algoIcons` w
`src/components/algoIcons.jsx`.

Parametryzowane (obiekt jako 3. arg `actor()`):
```js
actor('pets[0]', 'pierwszy element', {icon:'row', at:0, values:['pies','kot','owca','koń']})
actor('pets[4]', 'poza zakresem', {icon:'row', at:4, values:[...]}, 'ArrayIndexOutOfBounds')
actor('Zamiana 1', '{1, 9, 5, 2}', {icon:'swap', a:'9', b:'1'})
actor('Przed', 'values[i] = 9', {icon:'pair', a:'9', b:'1'})
actor('temp', 'temp = 9', {icon:'keep', value:'9'})
```

- `row` — `at` (wyróżnienie, -1=brak), `values[]` (treść komórek),
  `total` (gdy bez values), `sortedFrom` (gold = posortowany ogon);
  `at >= length` → czerwona komórka-widmo poza zakresem.
- `swap` — łuki: pomarańczowa `a` w prawo, teal `b` w lewo.
- Dispatch: `dynamicIcons` w `JavaLessonExplanation.jsx` → dodaj tam
  nowy komponent przy rozszerzaniu.

## Styl graficzny

Paleta sceny: navy `#173c52`, teal `#2a9d8f`, orange `#e76f51`,
gold `#f4a261`, red `#c0392b`, tło komórki `#fff8ea`. `viewBox` ~128×128,
klasa `concept-hero` (render 112×112), `aria-hidden`. Tekst w SVG:
`fontSize` 11–20, `fontWeight` 700–800, `textAnchor="middle"`.
Mapowania `key` przy generowaniu elementów w `.map()`.

## Checklist przed zakończeniem

1. `npx vitest run src/components/JavaConceptPages.test.jsx --maxWorkers=1 --minWorkers=1`
2. Screenshot sceny w przeglądarce (skill `visual-changelog`) — oceń
   czytelność tekstu w komórkach przy faktycznym renderze.
3. Kod/tekst/result strony spójne z aktorami.
4. Wpis `CH-N` w `artifacts/CHANGELOG.md` + sekcja w `artifacts/index.html`.

## Interaktywne tablice w pilocie (Game Dev)

Zasada: gdy pojęcie ma zmienną, którą uczeń może zmienić, preferuj interaktywną
tablicę nad statycznym diagramem — kod i efekt pokazujemy obok siebie.

- pozycja → `CoordinateBoard` (przeciąganie/strzałki zmieniają transform.x/y),
- wektor/odległość/zasięg → `ChaseVectorBoard` (tryby move/normalize/range),
- obecność/nieobecność komponentu → `ComponentToggleBoard` (przełącznik
  widać/nie widać: kod przekreślony + podgląd z/bez komponentu; marker
  Transform widoczny zawsze).

Zawsze: affordance-hint (dymek/ikona) znikający po pierwszej interakcji,
obsługa klawiatury + role/aria (`role="switch"`, `aria-checked`, `role="status"`),
`prefers-reduced-motion` wyłącza animację hintu.

Kontrakt `board` w notatce (`extra` w `note()`):
- `{ board: { kind: 'chase', mode: 'move'|'normalize'|'range' } }`,
- `{ board: { kind: 'coordinates', start: { x, y }, ghost? } }`,
- `{ board: { kind: 'components', object: { name, x, y }, objectCode, components: [{ id, label, code, kind: 'sprite'|'shape'|'collider', on, object?, asset?, width?, height?, color?, radius? }] } }`
  — `objectCode` to dosłowne linie kodu startera (utworzenie i pozycjonowanie
  obiektu, składnia danego labu); komponent może nieść własne `object`
  ({name,x,y}) — tablica rysuje osobny marker Transform na każdy odrębny
  obiekt, a komponent bez `object` przypada bazowemu `object`.

Te widżety są BAJTOWO identyczne w java-lab i web-learning-lab (kopiuj, nie
forkuj — precedens: ChaseVectorBoard, CoordinateBoard). Różnią się tylko
łańcuchy `code` w notatkach (Java vs `GameLab.` w JS).

Testy: `src/components/<Board>.test.jsx` w obu labach + rozszerzony test
pokrycia `src/data/gameDevTaskLearning.test.js` (`board.kind` ∈ chase |
coordinates | components). Uruchom: `npx vitest run <pliki> --maxWorkers=1
--minWorkers=1` sekwencyjnie w każdym labie.
