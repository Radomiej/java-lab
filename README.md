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

- Node.js 22 lub nowszy,
- przeglądarka z obsługą WebAssembly GC,
- brak JDK — nie jest potrzebne do pracy ucznia.

```powershell
cd C:\Nauka\java-lab
npm install
npm run dev
```

Otwórz `http://127.0.0.1:5182`.

## Playground i tutor AI

Ścieżka **05 Playground** zawiera własny projekt gry: `GameMain.java` tworzy
scenę, a `PlayerController.java` steruje bohaterem. RUN kompiluje i uruchamia
grę w przeglądarce. Pliki zapisują się niezależnie od postępu kursu; przyciski
eksportu i importu JSON pozwalają przenosić projekt (maksymalnie 256 KiB).

Ikona robota otwiera tutora. Aby go włączyć, skopiuj `.env.example` do `.env`,
uzupełnij `OPENROUTER_API_KEY` i uruchom ponownie `npm run dev`. Klucz zostaje
na backendzie (port 5184), nigdy w kodzie przeglądarki. Lista modeli obejmuje
tylko modele z zerową ceną w katalogu OpenRouter; nadal obowiązują ich limity.
Kod jest wysyłany dopiero po zaznaczeniu „Dołącz kod”, a każda proponowana
zmiana pliku wymaga osobnego zatwierdzenia. Rozmowa nie jest eksportowana.

Java i canvas działają także bez tutora. Statyczny deploy wymaga osobnego
backendu `/api/ai` dla AI; `npm run dev:frontend` uruchamia sam frontend.
Flaga `game-dev.enabled = false` ukrywa zarówno Game Dev, jak i Playground.

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

Ikona książki w górnym pasku otwiera dokumentację z koncepcją silnika,
architekturą i przeszukiwanym wykazem wbudowanych klas oraz przykładów.
Kontrolery `TopDownCharacterController2D` i `PlatformerCharacterController2D`
udostępniają stany chodzenia/biegu; bindingi `KeyPressed`, `KeyDoublePressed`
i `NoneOfKeysPressed` przyjmują callbacki Java. `Game.debug` lub przycisk
„Collidery” włącza podgląd rzeczywistej geometrii kolizji.
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

Ścieżki mają osobne zakresy: 101–199 fundamenty, 201–299 obiekty, 301–399
dziedziczenie, 401–499 algorytmy, 501–599 game-dev i 601 playground.
Game Dev obejmuje ruch/odbicie, trawę, monety/HUD, AI, pociski, tweeny,
skrzynki (507) i wybór ulepszeń (508). Każda lekcja ma trzy zadania,
w tym dwa samodzielne bez podpowiedzi. `Sprite.flipX` odbija lewo/prawo,
a `Sprite.flipY` góra/dół. Kierunek strzału daje `CharacterController2D.getDirection()` — pamięta ostatni niezerowy kierunek ruchu.

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

Po wyłączeniu ścieżka 05 znika z nawigacji, a zapisany wybór wraca do
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


## Analityka Umami

### Witryna: Java Lab

Dashboard: https://mws03-52051.wykr.es/websites/4b479aa8-360b-40f5-9376-4ac07836a8c7
Website ID: `4b479aa8-360b-40f5-9376-4ac07836a8c7`. Public configuration lives in `src/services/labAnalytics.js`.
Only the exact production hostname is tracked; localhost and preview deployments are excluded.
Set `VITE_ANALYTICS_ENABLED=false` to disable tracking. Browser Do Not Track is respected.

## Events
- `lesson_open`, `task_open`: stable curriculum IDs, topic and current task.
- `topic_change`: topic selection.
- `task_run_started`, `task_run_result`: execution and coarse outcome.
- `technical_error`: uncaught error / unhandled rejection class only, capped at 10 per page.
- `resource_download`: PDF, archive or project export category; no file contents or user filenames.
- `lesson_search`: search usage and length bucket if a search field exists; no search text.
- Existing `task_focus_minute` and `task_focus_session` measure visible task time. Existing `task_run_*` include pass/fail and runner failure stage.

## Privacy and rollout
No student code, SQL, prompts, query results, connection details, names, installation IDs, raw errors or stacks are sent to Umami. No session recordings. Analytics failure never blocks learning.
Java's existing optional teacher session telemetry is a separate feature, unchanged by this integration; its snapshots are not forwarded to Umami.
No extra npm dependencies or private API keys. Deploy this local change to activate collection. Website creation is complete, but production reception has not been verified before deployment.
No tests were added or run for this change. Visual behavior is unchanged; no visual QA was run.


## GameDev Java: PDF i stabilność runtime

Java Lab używa lokalnego komponentu src/components/GameCoursePdf.jsx i trzech materiałów kurs-gamedev-java*.pdf (8,5,7 stron). Wspólny komponent i PDF-y JS dla Web Lab pozostają osobne. Źródło: scripts/build-java-courses.py, ilustracje docs/course-assets. Generator wymaga ReportLab, Pillow i fontów Arial/Consolas; renderer podglądów scripts/render-java-course-previews.py przyjmuje --pdftoppm. Kontrola 17 przykładów: node scripts/check-java-course-code.mjs używa vendored kompilatora TeaVM i aktualnych klas silnika. Raporty są w docs/java-course-*.json.

Kryteria dla ucznia są redagowane w src/data/gameDevStudentCopy.js: podają pozycję, szerokość i wysokość zamiast wyliczonych krawędzi grafiki. Testy zachowania pozostają osobne.

Nowy runner jawnie negocjuje potwierdzenia klatek: worker ma najwyżej jedną klatkę w locie i czeka na ACK po synchronicznym rysowaniu. Starsze klienty korzystają z trybu zgodności. Stdout/stderr mają limit20tys.znaków, logi gry są scalane i ograniczone do4tys.na poziom na klatkę. Asercje Java są przechowywane osobno, żeby nadmiar zwykłego tekstu nie ukrywał wyników sprawdzania. Usunięto potwierdzone ryzyka przeciążenia; zgłoszona awaria białej karty Chrome nie została odtworzona i jej przyczyna nie jest jeszcze potwierdzona.


Statystyki edycji: snapshot.editingActivity zawiera liczbę znaków wpisanych ręcznie, znaków wklejonych, liczbę i największy rozmiar wklejenia, akcje usuwania oraz tempo w znakach/min z ostatnich 60 sekund (na początku okno ma minimum 10 sekund). Liczniki dotyczą jednej sesji/karty i resetują się po jej ponownym otwarciu. Obejmują tylko edytory kodu; pola nazwy i wyszukiwania są pomijane. Dodatkowe metryki zawierają liczby i znaczniki czasu, bez treści schowka ani rejestru klawiszy. Autouzupełnianie, formatowanie i cofanie nie są liczone jako ręczne pisanie. Metryki są orientacyjne i raportowane przez klienta, nie służą do automatycznego ustalania autorstwa. Aktualizacja przez heartbeat co 15 s i zapisy/Play; stare sesje bez pomiaru mają editingActivity=null.


### Client version and event review (2026-10-19)

All custom events include `client_version` (`package.json` version + deployment commit). `client_loaded` is sent once per page load, alongside the tracker's single automatic pageview. Existing production domain, website ID, `VITE_ANALYTICS_ENABLED=false`, and Do Not Track remain in effect. Java also respects `analytics.enabled` before loading the tracker.

Lesson/task context includes stable IDs and lesson number. Web reports one result per actual preview/check run, rather than a new result for each subsequent iframe signal. SQL run events use `execution_ok`; `task_check_result.passed` records curriculum validation, not merely valid SQL. Java `task_focus_session.duration_seconds` is total visible task time, including full minutes; it overlaps the separate minute events and must not be summed with them.

Only controlled metadata is forwarded: no code, SQL, output, student names, installation IDs, credentials or raw error text. Versioned lesson/task hash links can be copied with the lesson button; saved drafts stay local. Pageview URLs exclude query and hash. Automated checks cover version propagation, metadata filtering, deduplication, production-domain/DNT guards, task navigation and offline telemetry.


### Window focus telemetry
Teacher session snapshots include optional `focused` status. Window focus/blur and document visibility changes send a heartbeat immediately; older clients remain compatible. Presence is independent of the 45-second connection timeout. Focus is sent only to the existing teacher backend, not Umami.

## Nauka, quiz i samodzielna praca

Każda z 36 lekcji kursu ma teraz etapy Nauka → Quiz → Zadanie: 97 stron z ilustracjami, 36 quizów i 108 zadań. Dwanaście nowych spokojnych infografik wyjaśnia fundamenty i OOP. Quizy oraz kod można oddać do nauczyciela przez trwały outbox; oznaczenie „✓ Wysłano” wymaga potwierdzenia serwera. Szczegóły, zakres testów i podglądy: [raport modułów](docs/java-learning-modules-update.md).
