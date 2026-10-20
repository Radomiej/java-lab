# Moduły nauki Java — 20.10.2026

Wszystkie 36 lekcji kursu (z wyłączeniem otwartego placu zabaw) mają kolejność **Nauka → Quiz → Zadanie**. Uczeń może wrócić do wcześniejszego etapu; zmiana etapu nie usuwa zaznaczonych odpowiedzi ani kodu. Po ostatnim zadaniu prowadzi przycisk następnej lekcji. Podgląd gry pozostaje schowany do naciśnięcia przycisku lub RUN; opuszczenie zadania zatrzymuje grę.

| Zakres | Pokrycie |
| --- | --- |
| Lekcje | 36 |
| Strony wyjaśnień z diagramem lub sceną | 97 |
| Quizy | 36, łącznie 97 pytań o konkretne przykłady |
| Zadania kodowania | 108, w tym 72 samodzielne |
| Nowe spokojne infografiki PNG | 12, po jednej dla każdej lekcji fundamentów/OOP |
| GameDev | zachowane istniejące diagramy i sceny przypisane do konkretnych stron |

Infografiki znajdują się w `public/course-assets/java-concepts/`. Zostały wygenerowane wbudowanym narzędziem image_gen, obejrzane i poprawione: statyczna metoda collect, inicjalizacja Inventory, rzeczywiste przypisanie HP oraz test z AssertionError. Pierwsza grafika używa dokładnie komunikatów z kodu lekcji. Pełne prompty i poprawki zapisano w `java-lesson-infographic-prompts.json`. Kod obok obrazu pozostaje tekstem, więc jest czytelny również na telefonie i można go skopiować.

## Oddawanie prac

Quiz zapisuje `answer.json`; zadanie zapisuje bieżące pliki Java. Oba korzystają z istniejącego trwałego outboxa IndexedDB i `/api/submissions`. Komunikat **✓ Wysłano** pojawia się dopiero po przyjęciu oddania przez serwer (202 i zgodny identyfikator), po potwierdzeniu publikacji do brokera. Brak sieci pozostawia pracę w kolejce do ponowienia. Serwer odtwarza zadanie oraz materiały nauczyciela z deskryptora, zamiast ufać kluczowi lub rozwiązaniu klienta.

Publiczna lista `shared/assignments/javaQuizCatalog.js` zawiera wyłącznie metadata 36 quizów i 36 rodzin zadań lekcyjnych. Nie importuje programu kursu ani plików rozwiązań. Kod odtwarzający materiały nauczyciela jest importowany wyłącznie przez serwer. Szablony `java-course-*` używają indeksu 0–2 do wskazania jednego z trzech rzeczywistych zadań lekcji. Ich seed identyfikuje oddanie; treść tych istniejących zadań pozostaje stała. Oddzielny generator zachowuje swoje dwa dotychczasowe, losowane szablony Java.

Publisher Java kieruje `kind=submission` do `lab.submissions.v1`; telemetria nadal trafia do `java-lab.activity`. Metadata i prefix `java-quiz-` przekazano głównemu agentowi do synchronizacji lab-admin. Retencja, ograniczenie rozmiaru kolejki i rzeczywisty test odbioru w adminie są obsługiwane w równoległej pracy nad wspólnym brokerem. Ten raport nie twierdzi, że wykonano produkcyjne oddanie z niewdrożonego jeszcze Java Lab.

## Weryfikacja

- 22 testy Vitest w pięciu plikach: pokrycie lekcji, prywatność klucza, komplet materiałów, nawigacja i zachowanie quizu, potwierdzenie wysyłki, telemetria.
- 11 testów Node: istniejący outbox/retry/API oraz wszystkie 36 quizów i 108 zadań przez handler oddań z odtworzonym kluczem nauczyciela. Dodatkowy test publishera potwierdza osobny routing oddań i telemetrii oraz delivery_mode=2. Broker HTTP w tych testach jest kontrolowanym zastępstwem.
- Produkcyjny build Vite zakończony powodzeniem. Po nim dodano małe poprawki nawigacji i zatrzymywania podglądu, objęte końcowymi 22 testami Vitest.
- W przeglądarce przejrzano wszystkie 97 stron. Wyniki w `java-learning-module-browser-qa.json`; każda strona pokazała przypisany diagram/scenę.
- Sprawdzono quiz 2/2 → zadanie, domyślnie schowany edytor, zachowanie odpowiedzi po zmianie etapu oraz brak poziomego przepełnienia przy 1440 i 390 px.
- Wszystkie 12 końcowych infografik obejrzano. Nie uruchamiano ponownie pełnej macierzy kompilacji 108 rozwiązań Java; zadania pozostają istniejącymi zadaniami kursu.

Podglądy: [nauka na laptopie](java-learning-desktop.png), [quiz](java-quiz-desktop.png), [telefon](java-learning-mobile.png).

Źródła zasad języka: [klasy i obiekty — dev.java](https://dev.java/learn/language/oop/classes-objects/), [dziedziczenie — dev.java](https://dev.java/learn/language/oop/inheritance/), [przewodnik po języku i wyjątkach — dev.java](https://dev.java/learn/language/). Treść kursu i przykłady są własne; źródła służą weryfikacji znaczenia pojęć.

Wersja 0.1.2 jest przygotowana do publikacji z głównej gałęzi master. Stopka kursu pokazuje wersję i rewizję klienta. Status publikacji potwierdza raport zadania.
