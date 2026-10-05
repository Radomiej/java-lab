# Projekt: numeracja i ścieżka Game Dev

Status: zaimplementowane; dokument opisuje przyjęte kontrakty. Data projektu: 2026-10-02.

## Cel i granice

Uczeń buduje prostą grę 2D w Javie, w przeglądarce, na istniejącym TeaVM i rendererze Canvas. Nie zmieniamy działania lekcji konsolowych. Wbudowane mechanizmy pozostają ukryte w engine; uczeń widzi GameMain i potrzebne własne komponenty. Nie dodajemy Phaser, lokalnego JDK, JAR-ów ani pełnego pathfindingu.

## Numeracja i zapis postępów

Każda ścieżka ma stałą bazę: fundamentals 100, objects 200, inheritance 300, game-dev 400. Widoczne numery to baza + pozycja (1–99): 101, 102…; 201…; 301…; 401…. Wstawienie lekcji do jednej ścieżki nie zmienia numerów innych ścieżek. Istniejące identyfikatory konsolowych lekcji i zadań zostają bez zmian. Dla zastąpionych lekcji gry potrzebne jest jawne mapowanie zapisanego wyboru; starych zaliczeń nie przenosimy automatycznie na inne wymagania. Test wykrywa przekroczenie 99 lekcji i kolizje numerów.

## Lekcje

| Numer | Temat | Mechanizmy | Własny kod ucznia |
| --- | --- | --- | --- |
| 401 | Chodzenie i obrót | Input, CharacterController2D, Sprite, Transform | PlayerController, sprint / kierunek patrzenia |
| 402 | Trawa | TileMap i warstwa tła | konfiguracja planszy, wybór kafelków |
| 403 | Monety i UI | Trigger2D, kontakty, HUD | Coin, Collector, licznik punktów |
| 404 | Moby | FollowTarget2D, FleeTarget2D, FlankTarget2D, ObstacleAvoidance2D | dobór zachowań i parametrów |
| 405 | Pociski | Projectile2D i collider | Weapon, reguła trafienia / Health |
| 406 | Tweeny | Tweens, easing, Camera2D | reakcja na trafienie, shake, animacja skali |

Każda lekcja: krótka teoria, działający przykład, jedno zadanie prowadzone i dwa samodzielne bez podpowiedzi/rozwiązania. Zadania sprawdzają kompilację i stan obiektów Java, nie regexy ani piksele canvasu.

## Kontrakty silnika

Stan i czas należą do Javy; JavaScript tylko renderuje i przekazuje wejście. Ruch w px/s, delta w sekundach, obrót w radianach, pozycja środka. Obrót wizualny pozostawia AABB osiowe, co dokumentujemy.

CircleCollider2D rozszerza Collider2D. Promień jest jawny, skończony i dodatni, w pikselach świata; środek pokrywa się z transformem obiektu, a skala sprite'a nie zmienia promienia. Wspólna flaga isTrigger pozwala użyć koła także do zbierania; Trigger2D pozostaje zgodnym skrótem prostokątnego triggera. Narrow phase rozróżnia koło–koło, koło–AABB i AABB–AABB. Rozwiązanie kontaktu uwzględnia kształt, a nie tylko jego prostokąt obwiedniowy. Szybkie pociski wymagają testu odcinka ruchu przeciw powiększonemu kształtowi celu (swept collision); sama kontrola nakładania na końcu kroku nie wystarczy. Filtr owner działa przed blokowaniem i callbackiem.

TileMap rysuje przed obiektami, HUD po obiektach. Komendy kamery przesuwają świat, nie tło ekranowe/HUD; shake nie zmienia transformów symulacji. Dotychczasowe komendy renderera zachowują znaczenie.

AI wybiera kierunek, avoidance koryguje go, CharacterController2D wykonuje ruch. Jeden aktywny generator kierunku na obiekt; konflikt zgłasza czytelny błąd zamiast uzależniać wynik od kolejności komponentów. Cel usunięty lub nieaktywny zatrzymuje zachowanie. Omijanie lokalne może utknąć w ślepym zaułku; nie obiecujemy znalezienia drogi przez labirynt.

Projectile2D używa wspólnej fizyki, ignoruje owner i kończy życie po czasie lub trafieniu; reguły zdrowia i punktacji pozostają własnymi komponentami. Jedno trafienie nie może wielokrotnie uszkodzić celu w tej samej aktualizacji.

Tweeny obsługują pozycję, skalę, obrót i shake, jawne anulowanie i usunięcie obiektu. Nowy tween na tej samej właściwości zastępuje poprzedni. Czasy muszą być skończone i nieujemne; czas zero ustawia wynik od razu. Shake wraca do bazowej wartości i nie powoduje dryfu. Testy używają kontrolowanego czasu/ziarna zamiast zależeć od losowego obrazu.

## Dokumentacja i weryfikacja

Lista klas, pól i architektura: [game-engine.md](../../game-engine.md). Nowe API dostaje polskie opisy parametrów, wartości zwracanych, ograniczeń i przykładów w hover; Ctrl+klik prowadzi do źródła.

Testy: zakresy numeracji i zapis postępów; zadania używają asercji zachowania obiektów Java; kontrakt kursowy sprawdza rozwiązania w batchu przeglądarkowym TeaVM. Java runtime tests pokrywają ruch/rotację, jednorazowe zbieranie, AI i obstacle avoidance, filtr owner i czas życia pocisków, tweeny i anulowanie po destroy. Renderer testuje kolejność warstw i transform kamery bez oceniania kodu ucznia przez canvas.

## Kolejność wdrożenia

1. Numeracja i migracja zapisanego wyboru.
2. Warstwy renderowania, TileMap, lekcje 401–403.
3. Kontrakty ruchu AI i omijanie przeszkód, lekcja 404.
4. CircleCollider2D, kontakty mieszane, swept collision, filtry kontaktów i pociski, lekcja 405.
5. Tweeny i kamera, lekcja 406.
6. Dokumentacja API, regresje runtime i test końcowy przeglądarki.

Lista testów i statusu pozostałej weryfikacji znajduje się w [docs/todo.md](../../todo.md).
