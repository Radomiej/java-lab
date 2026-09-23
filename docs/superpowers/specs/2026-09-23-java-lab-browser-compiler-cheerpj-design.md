# Java Lab — browser compiler + CheerpJ design

## Cel

Java Lab ma pozwolić uczniowi pisać kod Java i zobaczyć jego rzeczywisty wynik w przeglądarce, bez instalowania JDK i bez wysyłania kodu do serwera kompilującego. Dla programów konsolowych wynik ma trafić do panelu konsoli. Lekcje Swing mają pokazywać rzeczywiste okno Java uruchomione przez CheerpJ.

Ta specyfikacja zastępuje lokalny runner JDK opisany w `2026-09-22-java-lab-cheerpj-design.md` i planie implementacji. JAR będzie istnieć wyłącznie jako binarny bufor w pamięci przeglądarki; aplikacja nie zapisze go na dysku ani nie udostępni uczniowi jako artefaktu.

## Zatwierdzony kierunek

- **Kompilator:** `teavm-javac` w WebAssembly, uruchamiany w Web Workerze. Kompilator z OpenJDK przyjmuje pliki `.java`, a jego API udostępnia skompilowane pliki klas/JAR.
- **Runtime:** CheerpJ 4.3 uruchamia wynikowy bytecode. Nie używamy wyjścia `generateWebAssembly()` z TeaVM; przepływ wybiera `getOutputJar()` i przekazuje ten bufor do CheerpJ.
- **Przekazanie danych:** po kompilacji frontend inicjalizuje CheerpJ, umieszcza bajty JAR-a w wirtualnym `/str/` przez `cheerpOSAddStringFile`, tworzy display i uruchamia klasę startową przez `cheerpjRunMain`. JAR nie jest zapisywany ani wysyłany do backendu.
- **Konsola:** pomocnicza klasa startowa przekierowuje `System.out` i `System.err` przez zarejestrowany native callback CheerpJ do panelu konsoli w React. Uruchomienie Swing pokazuje prawdziwe komponenty w display CheerpJ.
- **Checker:** dotychczasowe reguły zadań pozostają w JavaScript. Zadanie jest zaliczone dopiero, gdy przejdą reguły treści i kompilacja; nieudana kompilacja wyświetla diagnostykę i nie zalicza zadania.
- **Frontend:** React/Vite pozostaje aplikacją kliencką. Express, lokalne wywołania `javac`/`java` i endpointy artefaktów przestają należeć do normalnego przepływu.
- **Postęp:** zapis lekcji, zadań i szkiców w `localStorage` pozostaje bez zmian.

## Przepływ ucznia

1. Uczeń edytuje pliki zadania w React.
2. Kliknięcie „Sprawdź i uruchom” uruchamia reguły zadania oraz kompilację w Web Workerze.
3. Worker pobiera i cache’uje moduł kompilatora oraz biblioteki klas wymagane przez `teavm-javac`, kompiluje źródła i zwraca diagnostykę albo bajty JAR-a.
4. Gdy reguły i kompilacja przejdą, frontend inicjalizuje CheerpJ i przekazuje JAR w pamięci do `/str/`.
5. `cheerpjRunMain` uruchamia pomocniczą klasę startową. Ta przechwytuje wyjście konsolowe i wywołuje klasę ucznia; CheerpJ renderuje okno Swing w display.
6. Sukces wykonania oraz pozytywne reguły zapisują zaliczenie zadania. Błąd kompilacji lub błędne reguły pozostawiają zadanie niezaliczone i pokazują komunikat.

## Obsługa błędów i granice

- Błędy składni i typów z `javac` pokazują plik, numer linii, kolumnę i treść diagnostyki; nie uruchamiają CheerpJ.
- Brak sieci albo błąd pobrania zasobów kompilatora/klaslibu pokazuje komunikat o niedostępności kompilatora. Ukończony cache pozwala ponownie używać zasobów; gwarancję pełnej pracy offline można dodać po self-hostingu zasobów.
- Błędy inicjalizacji CheerpJ oraz wyjątki/niezerowy kod zakończenia trafiają do konsoli diagnostycznej.
- Zakres pierwszej iteracji to podstawowa Java bez zewnętrznych bibliotek. JUnit 5 i Maven/Gradle nie są częścią kompilatora kursowego.
- CheerpJ 4.3 dokumentuje runtime Java 8/11/17. Wymagana jest zgodność poziomu bytecode’u emitowanego przez `teavm-javac`; dokładny target i obsługę API JDK trzeba potwierdzić w prototypie przed usunięciem starego runnera.
- `teavm-javac` jest projektem bez opublikowanych wydań, a jego README wymienia dalsze prace nad testami i analizą kodu. Zasoby powinny być ładowane z jawnie wskazanego źródła i izolowane od głównego wątku UI.
- CheerpJ pozostaje wymagany tylko jako przeglądarkowy runtime. Aplikacja nie uruchamia lokalnego JDK ani procesu systemowego ucznia.

## Zakres implementacji

- **Bramka techniczna przed migracją:** osobny prototyp ma skompilować prosty program konsolowy oraz program Swing (`JFrame`, `JLabel`, `JButton`) przez `teavm-javac`, pobrać bajty przez `getOutputJar()` i uruchomić je w CheerpJ. Prototyp potwierdza target bytecode’u, dostępność użytych klas JDK, API callbacku konsoli i renderowanie Swing. Do czasu przejścia tej bramki obecny runner i jego endpointy pozostają nietknięte; w razie niezgodności najpierw korygujemy projekt integracji.
- klient kompilatora `teavm-javac` i worker, z inicjalizacją SDK/classlib raz na sesję;
- diagnostyka kompilatora z mapowaniem do aktywnego pliku w edytorze;
- klasa startowa/adapter wyjścia dla konsoli i uruchomienia klasy kursowej przez CheerpJ;
- przekazywanie bajtów JAR-a do CheerpJ `/str/` bez pliku na dysku i bez endpointu backendowego;
- uproszczenie przycisków do jednego przepływu kompilacji, uruchomienia, walidacji i zaliczenia;
- usunięcie lokalnego runnera i nieużywanych zależności serwerowych;
- aktualizacja README z wymaganiami, zewnętrznymi zasobami i ograniczeniami.

## Kryteria akceptacji

- Uczeń może skompilować i uruchomić przykładowy program konsolowy w przeglądarce bez lokalnego JDK i bez endpointu kompilacji.
- Wyjście `System.out` i `System.err` z programu jest widoczne w konsoli aplikacji.
- Przykładowe zadanie z `JFrame`, `JLabel` i `JButton` pokazuje rzeczywiste okno w display CheerpJ.
- Niepoprawna składnia pokazuje diagnostykę i nie zalicza zadania.
- Poprawny kod spełniający reguły kursu zalicza zadanie i zapisuje postęp lokalnie.
- JAR istnieje jedynie w pamięci/wirtualnym `/str/`; nie powstaje trwały artefakt ani żądanie do backendu kompilującego.
- Prototyp potwierdza zgodność bytecode’u, klas JDK, mostka konsoli i Swinga; dopiero po jego powodzeniu można zastąpić stary przepływ.

## Źródła techniczne

- `teavm-javac`: https://github.com/konsoletyper/teavm-javac
- API pamięci wirtualnej CheerpJ: https://cheerpj.com/docs/guides/filesystem
- `cheerpjRunMain`: https://cheerpj.com/docs/reference/cheerpjRunMain.html
- Wersje runtime CheerpJ: https://cheerpj.com/docs/reference/cheerpjInit
