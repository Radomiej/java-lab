# Widoczność lekcji GameDev 401–424

Audyt rozwiązań 72 zadań: kompilacja Java, kryteria zachowania, sterowanie gotowych kontrolerów oraz polecenia rysowania w widoku 640×360. Dla scen rundy audyt uruchamia Start. Pomiar poleceń rysowania sprawdza położenie ich środka; nie zastępuje ręcznej oceny każdego kadru w przeglądarce. Startery zawierające TODO mogą celowo nie realizować jeszcze docelowego efektu.

| Lekcja | Co uczeń może zobaczyć / jak sprawdzić |
|---|---|
| 401 Obiekty | Figura lub sprite we wskazanej pozycji. |
| 402 Komponenty | Obiekt; oddzielne liczniki Counter są sprawdzane w wynikach testów, nie w HUD. |
| 403 Czas | Przesunięcie po upływie czasu; prędkość jest mnożona przez delta. |
| 404 Input | Kliknięcie planszy i WASD/strzałki; TODO kontrolera trzeba uzupełnić. |
| 405 Grafika | Podłoże, sprite; zadanie odbicia ma asymetrycznego łucznika oraz ścianę z colliderem. A/D zmienia flipX; kontury włącza opcja Collidery. |
| 406 Kolizje | Postać zatrzymuje się na przeszkodzie; kontury pokazują kontakt. |
| 407 Triggery | Moneta znika po zebraniu. Wartość Wallet jest w testach. |
| 408 Kamera | Ruch gracza względem podłoża; kamera śledząca utrzymuje postać przy środku ekranu. |
| 409 Canvas/UI | Tekst, figury i pasek HUD we współrzędnych ekranu. |
| 410 Health | Postać i przeciwnik; HP oraz ochrona są w testach, nie każde zadanie ma pasek zdrowia. |
| 411 AI | Przeciwnik podąża za graczem lub ucieka. |
| 412 Pociski | Lot i zniknięcie pocisku; trzeba obserwować od początku RUN. |
| 413 Broń | Strzał po cooldownie; wariant ręczny wymaga Space. |
| 414 Łup/XP | Orb po śmierci oraz zniknięcie po zebraniu; poziom/XP są także w testach. |
| 415 Fale | Pierwsze spawny po 1 s. Wariant poza widokiem ma kamerę śledzącą i podłoże; wrogowie wchodzą na ekran z zewnątrz. |
| 416 Pauza | Escape zatrzymuje świat; UI i komunikat pauzy pozostają aktywne. |
| 417 Ulepszenia | Wybór po awansie; efekt parametrów sprawdzają testy i dalsza rozgrywka. |
| 418 UI | Focus, przyciski i pasek; akcja po zwolnieniu myszy/klawisza. |
| 419 Feedback | Krótki efekt trafienia, tween i shake; obserwuj moment kontaktu. |
| 420 Kompozycja | Jednostki utworzone z konfiguracji; różnice HP/prędkości są w testach. |
| 421 Wydajność | Pociski co 0.2 s; od pierwszej klatki jest widoczna informacja o scenariuszu. Limity i sprzątanie potwierdzają testy. FPS/p95 trzeba zmierzyć na urządzeniu. |
| 422 Stan rundy | Start/Enter, przegrana/wygrana, Restart. |
| 423 Przenośność | Scena zależna od wariantu; eksport i import trzeba wykonać jako osobną czynność. |
| 424 Survivor | Start/Enter; ruch, automatyczna broń, pierwszy Slime po 1.5 s, XP i rozwój. Starter wymaga uzupełnienia RunController.start. |

## Poprawione problemy

- 405: symetryczna postać nie pokazywała czytelnie flipX; dodano łucznika, collider postaci i ścianę. Odbicie oznacza odbicie lustrzane grafiki, a nie fizyczne odbicie od ściany.
- 408: kamera bez podłoża maskowała ruch; starter kamery zachowuje gotowy kontroler gracza.
- 415: gracz w (2000,2000) był poza widokiem; dodano śledzącą kamerę i podłoże w obu językach.
- 421: początkowy pusty kadr zastąpiono opisem scenariusza testu.
- 424: brak Player w starterze daje czytelny komunikat Java zamiast stosu WebAssembly.

## Materiały

Każda z 24 lekcji GameDev otrzymała schemat „reguła → kod/API → co obserwować” ze sprite’ami. Cztery dostarczone ilustracje są przy pierwszych lekcjach podstaw Java. Trzy identyczne PDF-y z Web Lab są dostępne w Java Lab oraz playgroundzie; zachowują przykłady JavaScript i są oznaczone jako materiały wspólnego silnika.

## Weryfikacja

- 72 rozwiązania Java: kompilacja i kryteria zachowania zaliczone.
- Audyt pierwszej klatki rozwiązań: 72/72 z przynajmniej jednym poleceniem rysowania w widoku; dane w `artifacts/course-visibility-audit.json`.
- JavaScript: 227 testów przykładów zaliczonych.
- Widoki Java: 11 testów workspace, test przeglądarki PDF oraz 2 testy infografik zaliczone.
- Podgląd schematu 405 sprawdzony w przeglądarce; poprawiono też pozycję kolumn po schowaniu panelu ścieżek.
