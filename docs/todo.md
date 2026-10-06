# Game Dev — status

Rozszerzenie silnika i osiem lekcji są zaimplementowane. Szczegóły klas, pól, architektury i cyklu klatki: [silnik](game-engine.md). Decyzje projektowe: [specyfikacja](superpowers/specs/2026-10-02-game-dev-expansion-design.md).

## Wdrożone

- [x] Numeracja kursów w osobnych zakresach setek, migracja zapisanego wyboru i test limitu numerów.
- [x] Lekcje 401–408: chodzenie i odbicie, trawa, monety i HUD, AI, pociski, tweeny i shake, skrzynki oraz wybór ulepszeń.
- [x] Sprite.flipX i flipY, kierunek strzału niezależny od odbicia, chodzący wróg w 405.
- [x] Bezszwowa trawa, warianty odbić kafelków i tekstura skrzynki.
- [x] Dokumentacja pod ikoną książki: koncepcja, architektura, 33 klasy z przykładami i wyszukiwaniem.
- [x] Kontrolery top-down i platformer: stany chodzenia/biegu, grawitacja, skok i podłoże.
- [x] KeyPressed, KeyDoublePressed i NoneOfKeysPressed; callbacki i dynamiczne dodawanie bindingów.
- [x] Game.debug i przycisk Collidery pokazujące geometrię fizyki oraz triggery.
- [x] Bohater RPG i niebieski/czerwony przeciwnik czytelne na trawie.
- [x] Po trzy zadania na lekcję, w tym dwa samodzielne bez podpowiedzi.
- [x] CircleCollider2D oraz kontakty koło–koło i koło–AABB; swept collision dla szybkich pocisków.
- [x] FollowTarget2D, FleeTarget2D, FlankTarget2D i lokalne ObstacleAvoidance2D.
- [x] Projectile2D z ownerem i czasem życia, Tweens oraz Camera2D.
- [x] Opisy API i nawigacja do źródeł silnika z edytora.
- [x] Usuwanie plików ucznia z potwierdzeniem; pliki startowe i wbudowane pliki silnika są chronione.
- [x] Java behavioral tests kompilują rozwiązania i asercje. Osobny test przeglądarkowy uruchamia kursowy batch na TeaVM.
- [x] Testy regresji kursów i kontraktów istniejącego silnika.

## Weryfikacja końcowa

### Playground i tutor (2026-10-06)

- [x] Własny projekt 501, zapis niezależny od kursu, import/eksport JSON i bezpośredni RUN gry.
- [x] Selektory ścieżki i lekcji, przejęte z web-learning-lab.
- [x] Tutor OpenRouter: tylko darmowy katalog, klucz na backendzie, kod opt-in, zmiany zatwierdzane osobno.
- [x] Ochrona przed importem plików silnika, powtórzonymi kluczami JSON i utratą edycji po przekroczeniu limitu.
- [x] In-app browser: lekcja 402 i Playground uruchamiają się; bohater reaguje na klawisze, debug pokazuje collider.
- [x] Fullscreen/Escape, mobilny tutor i mobilny selektor ścieżek; tymczasowy viewport przywrócony.
- [x] Końcowa integracja: 115 testów, build i przegląd kodu.
- [ ] Sprawdzić rzeczywistą odpowiedź dostawcy po skonfigurowaniu OPENROUTER_API_KEY (bez klucza UI poprawnie wyłącza wysyłanie).

### Wcześniejsza weryfikacja silnika

- [x] Pełne `npm test` — rozwiązania 401–408 i regresje silnika.
- [x] `npm run build`.
- [x] Python: krawędzie trawy, przezroczystość sprite’ów, flipX/flipY i podgląd kafelków.
- [ ] Ręczny test nowych scen w przeglądarce /tools/course-batch-check.html.
- [ ] Ponownie sprawdzić ręczne potwierdzenie usuwania pliku w otwartej przeglądarce.
- [ ] Zacommitować po zielonej weryfikacji.
