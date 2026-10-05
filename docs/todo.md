# Game Dev — status

Rozszerzenie silnika i sześć lekcji są zaimplementowane. Szczegóły klas, pól, architektury i cyklu klatki: [silnik](game-engine.md). Decyzje projektowe: [specyfikacja](superpowers/specs/2026-10-02-game-dev-expansion-design.md).

## Wdrożone

- [x] Numeracja kursów w osobnych zakresach setek, migracja zapisanego wyboru i test limitu numerów.
- [x] Lekcje 401–406: chodzenie i obrót, trawa, monety i HUD, AI, pociski, tweeny i shake.
- [x] Po trzy zadania na lekcję, w tym dwa samodzielne bez podpowiedzi.
- [x] CircleCollider2D oraz kontakty koło–koło i koło–AABB; swept collision dla szybkich pocisków.
- [x] FollowTarget2D, FleeTarget2D, FlankTarget2D i lokalne ObstacleAvoidance2D.
- [x] Projectile2D z ownerem i czasem życia, Tweens oraz Camera2D.
- [x] Opisy API i nawigacja do źródeł silnika z edytora.
- [x] Usuwanie plików ucznia z potwierdzeniem; pliki startowe i wbudowane pliki silnika są chronione.
- [x] Java behavioral tests kompilują rozwiązania i asercje. Osobny test przeglądarkowy uruchamia kursowy batch na TeaVM.
- [x] Testy regresji kursów i kontraktów istniejącego silnika.

## Weryfikacja końcowa

- [ ] Pełne `npm test`.
- [ ] `npm run build`.
- [ ] Ponownie sprawdzić ręczne potwierdzenie usuwania pliku w otwartej przeglądarce.
- [ ] Zacommitować po zielonej weryfikacji.
