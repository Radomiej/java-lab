---
name: visual-changelog
description: Dokumentuj zmiany UI/curriculum screenshotami przed/po i numerowanym changelogiem CH-N. Używaj gdy user prosi o „screen przed i po", porównanie wizualne zmian, changelog zmian, albo artefakty poza gitem.
---

# Visual changelog (screenshots CH-N)

Lokalny, niecommitowany dziennik zmian wizualnych w `artifacts/` (wpisane do `.gitignore`).

## Struktura

```
artifacts/
  CHANGELOG.md          — numerowane pozycje CH-1, CH-2, ...
  screenshots/
    CH-1-before.png
    CH-1-after.png
```

`artifacts/` jest w `.gitignore` — changelog i screenshoty NIE trafiają do repo.

## Workflow

1. **Screenshot PO** — aplikacja dev na bieżących zmianach (Playwright MCP):
   `browser_navigate` → znajdź element (np. `.concept-scene`) →
   `scrollIntoView` → `browser_take_screenshot` z pełną ścieżką
   `C:\Nauka\java-lab\artifacts\screenshots\CH-N-after.png`.
2. **Screenshot PRZED** — cofnij zmiany tylko na czas screenshota:
   - `git stash -m "before-shot" -- <zmienione pliki>` (stash TYLKO pliki zmiany;
     untracked pliki jak nowe komponenty mogą zostać — przestaną być używane).
   - `browser_navigate` na ten sam URL (Vite przeładuje), powtórz nawigację do
     tego samego widoku i screenshot `CH-N-before.png`.
   - `git stash pop` — natychmiast przywróć zmiany i sprawdź `git status`.
3. **Changelog** — dopisz pozycję w `artifacts/CHANGELOG.md`:
   nagłówek `## CH-N — <co i gdzie>`, punkty „Przed:/Po:", linki do screenshotów.
   Numery CH-N są stałe — nigdy nie numeruj od nowa.

## Uwagi

- Jeden wpis CH-N = jeden porównywalny widok. Jeśli zmiana obejmuje wiele
  ekranów, zrób osobne CH-N per reprezentatywny widok i opisz zakres zbiorczo.
- Ścieżka URL lekcji: `#/<track>/<id-lekcji-numeryczne>-<slug>/<nr>-<slug-zadania>`
  (np. `#/algorithms/402-sortowanie-babelkowe/1-posortuj-wyniki-druzyny` —
  prefiks to `lesson.id`, nie `order`). Sceny pojęciowe paginują się
  przyciskami `.explanation-pagination button`.
- Zawsze weryfikuj screenshot `read`-em po zapisie — czytelność ikon/tekstu
  łatwiej ocenić na obrazie niż z DOM.
