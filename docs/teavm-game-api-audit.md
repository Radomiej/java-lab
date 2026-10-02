# Audit wrappera TeaVM

## Aktualny stan i mapa wymagań

Poniższa mapa jest stanem końcowego audytu; dalsze sekcje zachowują historię diagnoz i wcześniejszych wyników.

| Wymaganie | Implementacja | Dowód |
| --- | --- | --- |
| Kompilacja własnych plików Java w przeglądarce | `source-path.js`, `teavm.worker.js`, `teavmRunner.js` | Rzeczywista kompilacja 9 gier i 36 rozwiązań konsolowych; podgląd produkcyjny |
| Scena, obiekty, własne komponenty i lifecycle | `gameCoreRuntime.js` | 24/24 asercji `core-api-check.html`, w tym kopie list i mutacje podczas aktualizacji |
| Sprite, ruch, collider, trigger, granice świata | `Game.step`, `Physics2D`, komponenty 2D | 25 asercji kontraktu 2D i 27/27 scenariuszy gier |
| Pomost Java → JS → canvas, atlas, obrót i skala | Eksport `frame`, parser workera, `gameInterop.js` | Test sprite/canvas, niezależne porównanie renderowania transformacji, widoczna scena w buildzie produkcyjnym |
| Wejście, zmiana rozmiaru, zatrzymanie i restart | Eksporty `setKey/resize/dispose`, interop, lifecycle workera | Próby sprite/input/restart, cleanup oraz wyjątków eksportów |
| Błędy renderowania i możliwość ponowienia | Renderer oraz obsługa błędu w App | Próba przerwania pobrania atlasu i ponowienia, test App |
| Sandbox i testy obiektów Java bez canvasu | `taskExecution.js`, `javaTestFiles/javaTestMainClass` | Test Java przyjmuje poprawny kontroler i odrzuca nieruchomy; tryb sprawdzania `console`, bez sond klatek |
| Kurs podstaw Javy bez regresji | Walidacja kompilacji i wyniku konsoli | 36/36 rozwiązań konsolowych; cały zestaw Vitest 53/53 |
| Flaga Game Dev i regulacja paneli | `featureFlags.js`, AppShell, GamePreview | Test dynamicznego wyłączenia zatrzymuje forwarding klatek; test UI ścieżki i ukrywania panelu |

Porównano core oraz komponenty i adapter Phaser w `game-dev/JS/engine`.
Java używa `gameObject` zamiast JS `object`, `getGame()` zamiast gettera,
`Class<T>` zamiast konstruktora typu i `transform.x/y` zamiast `position.x/y`.
Statyczne `Input` jest fasadą jednej instancji modułu WASM; ponowne uruchomienie
ładuje nową instancję. Pętla i adapter należą do hosta, nie do kodu ucznia.
Warstwa renderowania jest Canvas 2D, nie pełnym SDK Phaser/Babylon ani backendem
desktopowym. Dostępny pakiet grafik to lokalny atlas; dodatkowe pakiety obrazów
projektu odniesienia nie są automatycznie importowane.

Punkt odniesienia: `C:/Nauka/game-dev/JS/engine/core/` oraz żądanie uruchamiania własnych klas gry w przeglądarce przez TeaVM i canvas. Nie zmieniamy lekcji podstaw Javy w lekcje silnika. Nie przenosimy backendów desktopowych AWT/LWJGL do przeglądarki.

## Potwierdzone

- Java z edytora kompiluje się w przeglądarce do WebAssembly; bez lokalnego JDK/JAR.
- Eksporty `tick`, `frame`, `setKey`, `resize` łączą Javę z workerem i canvasem.
- Komendy clear/rect/text oraz centrowanie etykiety są wykonywane przez canvas.
- Klawiatura trafia do `Input`; blur zwalnia klawisze. Rozmiar canvasu trafia do Javy.
- Użytkownik tworzy pliki i własne komponenty; pliki wbudowanego API są chronione.
- `GameObject.addComponent`, aktywność, włączenie komponentów i pozycje ułamkowe działają.
- Importy `engine.*` są adaptowane do ograniczeń menedżera plików kompilatora Playground.
- 27 scenariuszy dziewięciu rozwiązań gry przeszło rzeczywisty runtime. Osobny test kontraktu potwierdził 16 asercji API, odrzucenie niezamkniętego `if()` i poprawne uruchomienie po błędzie.
- Testy regresyjne wykryły i potwierdziły naprawę dynamicznego wyłączenia Game Dev oraz utraty komunikatu konsoli z pierwszej klatki.

## Uzupełnione kontrakty core

- `Game`: tworzenie i przechowywanie obiektów, start, krok symulacji, disposal — zweryfikowane kontraktem.
- Wspólne hooki `onCreate`, `onUpdate`, `onDestroy`; zachowanie istniejących lekcji używających `start/update`.
- Zapytania `getComponent`, `getComponents`, `hasComponent`, `requireComponent` uwzględniające podklasy.
- Usuwanie komponentów i obiektów, jednokrotne sprzątanie, bezpieczne mutacje podczas aktualizacji.
- Powiadomienia o zmianie komponentów oraz hooki kontaktów.
## Końcowa regresja — 2026-10-02

- Świeży `npm run build` zakończył się kodem 0. Produkcyjny podgląd na porcie 5282 skompilował Javę i pokazał sprite gracza na planszy ze statusem „Gra gotowa”.
- Po poprawce kontaktów z triggerem za ścianą ponowiono wszystkie dziewięć rozwiązań: 27/27 scenariuszy przeszło w rzeczywistym TeaVM.
- Świeży `npm test`: 50/50 testów w 15 plikach, kod wyjścia 0.
- Po dodaniu obsługi wyjątków eksportów wejścia i resize: 53/53 testów. `/tools/game-export-errors-check.html` potwierdził w rzeczywistym TeaVM błędy Java z obu eksportów, jednokrotny cleanup, brak dalszych klatek i ponowne uruchomienie po błędzie wejścia.
- Rozszerzony kontrakt 2D: 25 asercji, w tym obrót/skala w protokole renderowania i brak kontaktu z triggerem zasłoniętym przez ścianę.

Te wyniki zamykają wcześniejsze braki regresji i podglądu produkcyjnego. Nie są deklaracją pełnej zgodności z Phaser/Babylon: wrapper udostępnia API sceny i komponentów 2D. Fizyka używa osiowych AABB; obrót i skala sprite'a dotyczą renderowania, nie obróconych brył kolizji. Ocena ucznia nie odczytuje canvasu ani protokołu klatek — uruchamia program lub dostarczone asercje Java.

## Integracja i zatrzymanie runtime

Test `/tools/game-cleanup-check.html` przeszedł w in-app browserze 2026-10-02.
Kod ucznia kompilowany rzeczywistym kompilatorem TeaVM tworzy `StudentGame`
i komponent `Mover`, którego rysowanie trafia do canvasu. Zatrzymanie runtime
wywołuje eksport Java `dispose`: `Component.onDestroy` i `Game.onDestroy`
wykonują się po jednym razie, a worker wysyła potwierdzenie `game-stopped`.
Ta próba potwierdza rysowanie i cleanup przy stop; nie dowodzi jeszcze
poprawności restartu, ruchu ani niezaimplementowanych komponentów fizyki.

## Komponenty 2D i pełna ścieżka sprite

`Sprite`, `Collider2D`, `Trigger2D`, `CharacterController2D` i `Vector2`
są dostępne w API. `Game.step` zeruje prędkość przed hookami użytkownika,
integruje ruch kontrolera, rozwiązuje proste kontakty AABB osiami i emituje
sprite w klatce. Trigger nie blokuje ruchu; wyłączony kontroler nie przesuwa
obiektu, a wyłączony sprite nie jest emitowany. Test
`/tools/components-2d-check.html` przeszedł 19 asercji w rzeczywistym TeaVM:
również szybki ruch przez cienką ścianę, kontakt dwóch kontrolerów bez
dodatkowego collidera, jednokrotne powiadomienie pary, granice świata,
zmniejszenie świata i wyłączenie granic.

Rozszerzony kontrakt 2D przeszedł następnie 22 asercje: usuwanie komponentu
podczas automatycznego kontaktu, zniszczenie drugiego obiektu ze sprzątaniem
raz oraz dispose całej gry podczas kontaktu.

`/tools/renderer-recovery-check.html` przeszedł w in-app browserze:
prawdziwe pobranie atlasu przerwane AbortController zgłasza błąd,
ponowienie pobiera zasób i odczyt pikseli potwierdza narysowanie sprite'a,
a nieznana tekstura emituje czytelny błąd. Osobny test App potwierdza,
że zdarzenie renderera pokazuje błąd w kursie i pozwala uruchomić ponownie.
Regresja Vitest naprawy ponawiania przeszła; cały zestaw ma 49 testów.

`/tools/sprite-canvas-check.html` przeszedł 2026-10-02 w in-app browserze:
odczyt pikseli potwierdził narysowanie atlasu na canvasie, zdarzenie klawiatury
przesunęło obiekt przez własny komponent Java, a ponowne uruchomienie
odtworzyło pozycję początkową nowej sceny. Atlas jest lokalnym zasobem repo,
nie zależy od CDN. Ten test nie zastępuje migracji lekcji ani testów
trudniejszych przypadków fizyki wymienionych powyżej.

## Kurs i ocena sandboxa

Wszystkie dziewięć rozwiązań Game Dev używa sceny `StudentGame`, komponentów
i sprite'ów; moneta jest zbierana przez `onTrigger`. Regresja 27 scenariuszy
przeszła w rzeczywistym TeaVM po migracji lekcji, przed późniejszym dodaniem
domyślnych granic świata. Te scenariusze są diagnostyką silnika, nie oceną ucznia.
Ocena Game Dev uruchamia Javę w trybie konsolowym, bez canvasu i regexów.
Opcjonalne `javaTestFiles` i `javaTestMainClass` uruchamiają asercje po stronie
Javy. Kontroler ma test bezruchu, ruchu i zatrzymania; próba
`/tools/java-object-tests-check.html` potwierdziła poprawny kontroler oraz
odrzucenie celowo wadliwej implementacji.

Aktualna weryfikacja: 48 testów Vitest przeszło, build produkcyjny przeszedł
(ostrzeżenie rozmiaru bundla Monaco), a kontrakt core ponownie zaliczył
22 asercje po dodaniu granic świata. Nie jest to dowód zamknięcia punktów
w sekcji „Pozostałe prace”.

## Implementacja rozszerzonego core w trakcie weryfikacji

`src/data/gameCoreRuntime.js` zawiera implementację `Game`, nowych hooków,
zapytań i usuwania komponentów, listenerów zmian oraz dispatch kontaktów.
Jest używana przez lekcje przez reexport w `gameEngineRuntime.js`.
Kontrakt 22 asercji przeszedł w rzeczywistym runtime TeaVM, w tym mutacje
podczas klatki i przerwanie inicjalizacji po zniszczeniu obiektu.
Test kontraktu: `/tools/core-api-check.html`; reproduktory:
`/tools/core-api-isolation.html`.

Izolacja potwierdziła, że małe źródła z `Class<?>` i `Class<T>` kompilują się.
Zastąpienie `Class.isInstance`, usunięcie generycznych parametrów Class,
minimalna klasa Game i jawne importy wewnątrz engine nie usuwają błędu.
Izolacja potwierdziła przyczynę: `@SuppressWarnings("unchecked")` powoduje
przepełnienie stosu w przeglądarkowym javac. Same deklaracje z adnotacjami
powodują ten błąd; pełne klasy bez tych adnotacji kompilują się i przechodzą
kontrakt. Usunięcie adnotacji nie zmienia działania zapytań po klasie.
