# Java Lab — kurs Javy w przeglądarce

Java Lab to kurs podstaw Javy dla uczniów: od `class` i `main`, przez zmienne,
warunki, pętle i metody, po obiekty, kompozycję, dziedziczenie oraz
polimorfizm.

Główna aplikacja działa all-in-browser. Kod z edytora trafia do Web Workera,
TeaVM kompiluje go do WebAssembly, a wynik `main()` jest pokazywany w panelu
konsoli. Kurs nie uruchamia lokalnego JDK, nie tworzy JAR-a i nie wymaga
lokalnego serwera Java.

Kod jest edytowany w Monaco. Przycisk `?` przy nazwie pliku otwiera tooltip z
podpowiedziami IntelliSense i skrótami klawiszowymi znanymi z Eclipse oraz VS
Code.

## Uruchomienie

Wymagania:

- Node.js 18 lub nowszy,
- przeglądarka z obsługą WebAssembly GC,
- brak JDK — nie jest potrzebne do pracy ucznia.

```powershell
cd C:\Nauka\java-lab
npm install
npm run dev
```

Otwórz `http://127.0.0.1:5182`.

Oficjalne pliki TeaVM Playground są przechowywane w
`public/vendor/teavm/cdn/`, a worker ładuje je z tego samego originu. Dzięki
temu aplikacja nie zależy od CORS na CDN i nadal wykonuje kompilację w
przeglądarce.

## Co jest uruchamiane

1. Edytor przechowuje kod lekcji w pamięci przeglądarki i w lokalnym postępie.
2. Worker ładuje kompilator TeaVM, SDK javac oraz TeaVM classlib.
3. Java jest kompilowana w workerze, a następnie TeaVM generuje WebAssembly.
4. Moduł WebAssembly uruchamia `main()` i przechwytuje `System.out` do
   panelu wyniku.

## Wersja Javy i ograniczenia

Kurs używa składni Java 21 oraz podzbioru API dostępnego w TeaVM
Playground. To nie jest pełne JDK: przykłady wyjątków wypisują własny komunikat
w `catch`, ponieważ biblioteka kompilatora nie udostępnia `getMessage()`.
Podstawowe przykłady działają w całości w przeglądarce, a wersja
bytecode'u jest sprawdzana podczas diagnostyki.

Kurs skupia się na konsolowej Javie i podstawach obiektowości. Ścieżka 04
**Game Dev w Javie** pozwala składać sceny z `GameObject` i `Component`, a
Java generuje komendy rysowania, które worker przekazuje do canvasu 2D.
Klawiatura i rozmiar planszy wracają przez eksporty TeaVM do kodu Java.
`GameObject.addComponent(...)` podpina własne klasy rozszerzające `Component`;
Scena użytkownika rozszerza `Game`: `onCreate` tworzy obiekty, `onUpdate`
wykonuje logikę, a `onDestroy` sprząta zasoby. `Game.step(delta)` aktualizuje
komponenty, ruch, kontakty i sprite'y. Pozycje mają typ `double`, a delta
jest czasem klatki w sekundach (silnik ogranicza krok do 0.1 s).
`Sprite` wybiera teksturę z lokalnego atlasu; pozycja oznacza środek obrazu.
`transform.rotation.z` podaje obrót w radianach, `transform.scale.x/y`
skalę, w tym odbicie przez wartości ujemne. `CharacterController2D.move`
normalizuje kierunek i przyjmuje prędkość w pikselach na sekundę.
`Collider2D` blokuje ruch, a `Trigger2D` wywołuje `onTrigger` bez blokowania.
Granice świata kontrolera można wyłączyć przez `collideWorldBounds = false`.
API udostępnia `GameCanvas.getWidth()` i `getHeight()`.
Starsze `GameObject.update/draw` i `GameLoop` pozostają kompatybilne.
Edytor pokazuje tylko `GameMain.java` oraz własne komponenty ucznia.
`GameMain extends Game` jest punktem startowym sceny. Launcher z `main()`
i eksportami TeaVM jest generowany poza edytorem. Wszystkie pliki gry
otrzymują automatycznie pakiet `lab` i importy API; biblioteka zachowuje
osobny pakiet `engine`.

Ctrl+klik na nazwie klasy lub rozpoznanej metody silnika (lub F12) otwiera jej źródło tylko do
odczytu. Te pliki nie zajmują zakładek, dopóki ich nie otworzysz.

Jeden przycisk `RUN` uruchamia program i sprawdza zadanie. Konsola znajduje
się pod edytorem. W Game Dev po testach Java uruchamia się podgląd sceny;
prawy panel zawiera tylko canvas. Przycisk pełnego ekranu powiększa ten sam
canvas do modala bez ponownego uruchomienia gry; Escape zamyka modal.
Panel ścieżek można schować przyciskiem nad edytorem.

## Dokumentacja silnika

Lista klas i pól, cykl klatki, ograniczenia kolizji oraz diagramy Mermaid:
[Silnik Java Lab](docs/game-engine.md).

Ścieżki mają osobne zakresy 101–199, 201–299, 301–399, 401–499.
Game Dev obejmuje ruch/odbicie, trawę, monety/HUD, AI, pociski, tweeny,
skrzynki (407) i wybór ulepszeń (408). Każda lekcja ma trzy zadania,
w tym dwa samodzielne bez podpowiedzi. `Sprite.flipX` odbija lewo/prawo,
a `Sprite.flipY` góra/dół. Kierunek strzału jest zapisany osobno w `PlayerController.facing`.

Kontrola krawędzi trawy i odbić grafiki w Pythonie, bez dodatkowych bibliotek:
`python tools/check-game-art.py`. Opcja `--preview PATH.png` zapisuje podgląd kafelków i sprite’ów.
CircleCollider2D obsługuje koła i kontakty z prostokątami, Projectile2D
sprawdza odcinek lotu i pomija właściciela. AI ma gotowe zachowania
podążania, ucieczki, flankowania i lokalnego omijania przeszkód (nie A*).
Tweeny animują pozycję, skalę, obrót lub wizualny shake; kamera nie rusza stanu fizyki.
Własne pliki ucznia można usuwać z potwierdzeniem; pliki startowe i engine są chronione.

Plan prac: [docs/todo.md](docs/todo.md).

## Flagi funkcji

Game Dev jest włączony domyślnie przez flagę `game-dev.enabled`. Można go
wyłączyć dynamicznie z konfiguracji hosta aplikacji:

```js
window.__JAVA_LAB_FEATURE_FLAGS__ = { "game-dev.enabled": false };
window.dispatchEvent(new Event("java-lab-feature-flags-changed"));
```

Po wyłączeniu ścieżka 04 znika z nawigacji, a zapisany wybór wraca do
dostępnej lekcji.

Analityka Umami używa flagi `analytics.enabled`. Włącza się automatycznie w
buildzie Vercel, jeśli ustawiono `VITE_UMAMI_SCRIPT_URL` (pełny adres skryptu,
np. `https://stats.example.com/script.js`) i `VITE_UMAMI_WEBSITE_ID`. Opcjonalne
`VITE_ANALYTICS_ENABLED=false` wyłącza ją również na Vercel, a `true` pozwala
uruchomić skonfigurowaną analitykę lokalnie. Po zmianie zmiennych Vercel wymaga
nowego deploymentu.

Umami zapisuje `task_run_started`, `task_run_result`, `task_focus_minute` i
`task_focus_session` z numerem lekcji, ID zadania, wynikiem oraz liczbą sekund
widocznej pracy. Każdy `task_focus_minute` odpowiada minucie aktywnej karty, co
pozwala porównywać czas zliczając zdarzenia dla zadania; końcówka jest zapisana
w `task_focus_session`. Pomiar czasu zatrzymuje się, gdy karta przeglądarki jest
ukryta. Nie wysyłamy kodu źródłowego,
wyjścia programu ani treści diagnostyki. Można dynamicznie zmienić flagę przez
`window.__JAVA_LAB_FEATURE_FLAGS__["analytics.enabled"]` i wysłać zdarzenie
`java-lab-feature-flags-changed`; przykładowy plik zmiennych jest w
[`.env.example`](.env.example).

JUnit 5 nie jest ładowany do runtime'u lekcji. Każde sprawdzenie zadania wymaga
poprawnej kompilacji i uruchomienia w TeaVM. Wszystkie 36 zadań konsolowych
porównują wynik programu, nie fragmenty kodu ani regexy. Sam wynik nie dowodzi
użycia konkretnej konstrukcji języka — np. wypisanie stałej zamiast obliczenia
może dać ten sam rezultat. Game Dev jest sandboxem: domyślne sprawdzenie
wymaga kompilacji i poprawnego startu programu, bez oceny obrazu ani regexów.
Zadanie może dostarczyć `javaTestFiles` i `javaTestMainClass`: test tworzy
obiekty, wykonuje `Game.step` i sprawdza ich stan asercjami po stronie Javy.
Lekcja kontrolera ma taki test. Nie jest to biblioteka JUnit 5.

## Zawartość kursu

Każda lekcja ma trzy zadania: jedno prowadzone z rozwiązaniem i dwa
samodzielne. Podpowiedź oraz przycisk pokazania rozwiązania są dostępne tylko
w zadaniu prowadzonym, żeby dwa kolejne ćwiczenia sprawdzały samodzielność.

- Fundamenty: pierwszy program, zmienne, typy, warunki, pętle i metody.
- Obiekty: klasy, konstruktory, enkapsulacja i kompozycja.
- Dziedziczenie: klasy bazowe, overriding, polimorfizm i wyjątki.
- Game Dev w Javie: `GameObject`, `Component`, sceny i mini-gra w przeglądarce.

## Testy i build

Wewnętrzne scenariusze regresyjne Game Dev używają rzeczywistego runtime TeaVM:
uruchamia nowy moduł dla każdego scenariusza, podaje klawisze i czas, a potem
porównują komendy renderera. Nie są używane do zaliczania kodu ucznia.
Testy wszystkich osiemnastu rozwiązań Game Dev można uruchomić
na `/tools/game-runtime-check.html` przy działającym serwerze developerskim.
Rozszerzone API sprawdza `/tools/expanded-engine-check.html`.
Deweleloperskie testy źródeł Java wymagają istniejącego JDK 21+ (JAVA_HOME,
PATH lub katalog .jdks); nie jest ono potrzebne uczniowi ani aplikacji w przeglądarce.
Kontrakty core i fizyki są w `/tools/core-api-check.html` i
`/tools/components-2d-check.html`; test kontrolera wyłącznie po stronie Javy
w `/tools/java-object-tests-check.html`. Rendering, transformacje i retry
atlasu mają osobne strony diagnostyczne `sprite-canvas-check.html`,
`sprite-transform-check.html` i `renderer-recovery-check.html` w `/tools/`.

Podgląd obsługuje strzałki, WASD oraz klawisze odczytywane we własnym kodzie.
`Input.isKeyDown()` sprawdza trzymanie, a `isKeyPressed()` nowe naciśnięcie
zapamiętane do najbliższej klatki. Worker przesyła całą klatkę razem. Konsola
odbiera komunikaty również z `update()`. Błąd aktualizacji zatrzymuje pętlę;
timeout kompilacji lub zawieszenie runtime pozwalają utworzyć nowy worker.

```powershell
npm test -- --run
npm run build
```
