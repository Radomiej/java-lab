# Java Lab — CheerpJ design

## Cel

`java-lab` ma być lokalnym, polskojęzycznym laboratorium do nauki Javy dla uczniów. Interfejs ma przypominać istniejące `web-learning-lab` i `databases`: uczeń wybiera ścieżkę, czyta krótką teorię, edytuje kod, uruchamia go, dostaje konkretne wyniki testów i zachowuje postęp lokalnie.

Pierwsza wersja obejmuje cztery ścieżki:

1. Fundamenty — program, zmienne, warunki, pętle i metody.
2. Obiekty — klasy, konstruktor, enkapsulacja i kompozycja.
3. Dziedziczenie — `extends`, overriding, polimorfizm i wyjątki.
4. Swing — okno, komponenty, zdarzenia i mały projekt GUI.

## Decyzje techniczne

- React 18 + Vite + JSX.
- Node/Express jako lokalny serwer kompilacji.
- JDK 17 jako domyślny target źródła.
- Java Compiler API przez proces `javac`; kod ucznia jest kompilowany w izolowanym katalogu zadania.
- CheerpJ 4.3 ładowany w przeglądarce z oficjalnego runtime’u i używany do uruchamiania wynikowego JAR-a, także aplikacji Swing.
- Własny runner testów kursowych w JavaScript, oparty na jawnych regułach źródła: wymagane fragmenty, wyrażenia regularne, zakazane fragmenty i sygnatury. Dzięki temu pierwsze lekcje mogą działać bez pełnego uruchomienia programu.
- JUnit 5 nie jest częścią przeglądarkowego runnera. Późniejszy endpoint JDK może uruchamiać testy Maven/Surefire, ale pierwsza wersja używa lekkiego testera zrozumiałego dla ucznia.
- Postęp i szkice kodu są zapisywane w `localStorage`.

## Przepływ ucznia

1. Aplikacja otwiera pierwszą lekcję i pokazuje postęp.
2. Uczeń wybiera lekcję oraz zadanie.
3. Czyta cel, teorię, przykład i listę kroków.
4. Edytuje `Main.java` lub pliki zadania.
5. Przycisk `Sprawdź zadanie` uruchamia własny walidator i pokazuje testy zielone/czerwone.
6. Przycisk `Skompiluj i uruchom` wywołuje lokalny endpoint JDK; wynik konsolowy trafia do panelu diagnostycznego.
7. Dla zadania Swing endpoint zwraca JAR, a CheerpJ uruchamia go w osadzonym panelu.
8. Po zaliczeniu zadania postęp jest zapisany lokalnie.

## Bezpieczeństwo i ograniczenia

- Serwer działa wyłącznie lokalnie i nie może być wystawiany bez dodatkowej izolacji.
- Każda kompilacja ma osobny katalog roboczy i limit czasu.
- Rozmiar kodu wejściowego i wynikowego logu jest ograniczony.
- Uruchomienie programu musi być wykonywane poza głównym wątkiem UI; front-end pokazuje stan `gotowe`, `kompilowanie`, `uruchamianie` albo `błąd`.
- Kod ucznia nie dostaje automatycznie dostępu do sekretów procesu Node.
- CheerpJ ładowany z CDN wymaga sieci przy pierwszym uruchomieniu. Możliwe będzie późniejsze vendoringowanie runtime’u po sprawdzeniu licencji.

## Model danych lekcji

Każda lekcja ma:

- `id`, `track`, `order`, `title`, `summary`;
- `objective` i `theory` w krótkich blokach krok po kroku;
- `starterFiles` z nazwą i zawartością plików;
- zadania z `prompt`, `steps`, `hints`, `checks` i opcjonalnym `runMode`;
- opcjonalny `mainClass` dla uruchamiania programu lub Swinga.

## Pierwszy zakres funkcjonalny

- cztery ścieżki i szesnaście lekcji;
- jeden lub dwa zadania w każdej lekcji;
- edytor wielu plików Java z lokalnym zapisem;
- walidator statyczny z czytelnymi komunikatami;
- endpoint kompilacji i uruchomienia JDK;
- komponent CheerpJ gotowy do uruchomienia JAR-a;
- przykładowa lekcja Swing z `JFrame`, `JLabel`, `JButton` i listenerem;
- testy Vitest dla danych kursu, walidatora, storage i API;
- README z uruchomieniem, wymaganiami i ograniczeniami.

## Poza zakresem pierwszej wersji

- automatyczne uruchamianie JUnit 5 w przeglądarce;
- konta uczniów, synchronizacja serwerowa i oceny online;
- Android, JavaFX, sieć i biblioteki zewnętrzne;
- pełna składnia Java IDE, autouzupełnianie i debugowanie bytecode’u.

## Kryteria akceptacji

- `npm test` przechodzi dla wszystkich testów aplikacji.
- `npm run build` buduje frontend.
- Aplikacja pokazuje lekcje, pozwala zmienić kod, zapisać szkic i przełączać zadania.
- Poprawny kod spełniający reguły lekcji otrzymuje zielone wyniki i zapisuje zadanie jako ukończone.
- Błędny kod otrzymuje konkretne komunikaty, bez awarii całego UI.
- Brak JDK jest pokazany jako instrukcyjny błąd, a nie jako crash serwera.
- README opisuje, że CheerpJ uruchamia JAR-y i że kompilacja wymaga lokalnego JDK.
