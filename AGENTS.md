# AGENTS.md — java-lab

## Visual changelog (zmiany UI/curriculum)

Przy każdej zmianie widocznej dla ucznia (ikony, sceny, layout, ilustracje)
dokumentuj postęp według skilla `visual-changelog`
(`.devin/skills/visual-changelog/SKILL.md`):

- screenshoty przed/po w `artifacts/screenshots/` (katalog git-ignorowany),
- numerowane pozycje `CH-1`, `CH-2`, … w `artifacts/CHANGELOG.md` — numery
  stałe, nowe zmiany dopisuj kolejnym numerem,
- stan „przed" robisz przez `git stash` wyłącznie zmienionych plików,
  screenshot, potem `git stash pop`.

## Edytor / IntelliSense

- `src/components/studentJavaApi.js` — statyczna analiza kodu ucznia
  (`maskJava`, `studentJavaApi` klas/pól/metod, `localVariables` zasięgu
  lokalnego, `studentCompletionItems`). Przy zmianach podpowiedzi:
  `src/components/studentJavaCompletion.test.js` + `javaIntellisense.test.js`.
- `localVariables(masked)` dostaje tekst PRZED kursorem (maskowany) i zwraca
  zmienne/parametry w zasięgu — bloki `{}` i nagłówki `()` rozwiązuje
  przez `closeBrace`/dopasowanie nawiasów.

## Testy

- `npx vitest run <plik> --maxWorkers=1 --minWorkers=1` — zawsze 1 worker,
  sekwencyjnie (JDK/javac są ciężkie na tej maszynie).
- Po zmianach w scenach pojęciowych: `src/components/JavaConceptPages.test.jsx`.
- Render lekcji algorytmów można sprawdzić w przeglądarce: dev server Vite,
  URL `#/algorithms/<id-numeryczne>-<slug>/1-<slug-zadania>`, sceny paginowane
  `.explanation-pagination button`.

## Konwencje curriculum

- Ikony aktorów scen algorytmów: semantyczne klucze z
  `src/components/algoIcons.jsx` (`swap`, `compare`, `pointer`, `split`,
  `merge`, `cells`, `stack`, `warn`, `pass`, `bars-sorted`, `tally`, `look`,
  `prime`, `shift`, `insert`) — NIE sprite'y RPG z atlasu gry.
- Ikony parametryzowane: `actor(name, state, {icon:'row'|'pair'|'swap'|'keep', ...})`
  — wartości WEWNĄTRZ komórek, indeksy pod spodem; szczegóły w skillu
  `lesson-graphics` (`.devin/skills/lesson-graphics/SKILL.md`).
- Przy tablicach preferuj wartości nienumeryczne (`{"pies","kot","owca","koń"}`)
  — indeks zostaje liczbą, treść nie myli się z indeksem.
- Polska terminologia: „element tablicy" (nie „komórka"), „argumenty operatora"
  (nie „operandy"), „schemat Hornera" (nie „horyzont"), „liczniki" w counting
  sort (nie „kubełki"), indeksy zamiast metafor „palców".
