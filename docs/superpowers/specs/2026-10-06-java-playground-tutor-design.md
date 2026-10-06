# Java Playground i tutor gry

## Cel

Uczeń tworzy własną grę w Javie w przeglądarce. Zachowujemy TeaVM, istniejący silnik i lekcje. Wzorzec interfejsu oraz tutora pochodzi z aktualnego web-learning-lab, bez przenoszenia jego runtime JavaScript.

## Nawigacja

Przenosimy selektory ścieżki i lekcji z web-learning-lab/src/components/Sidebar.jsx: zwijane details/summary, aktualny wybór, lista, zamknięcie po wyborze i przywrócenie fokusu. Zachowujemy etykiety, postęp i kolory Java Lab. W projekcie wzorcowym ten panel jest lewy; nie przenosimy go na prawą stronę, ponieważ prawa strona pozostaje dedykowana canvasowi. Mobile i zmiana rozmiaru muszą zachować dostęp do obu wyborów.

## Playground

Osobna ścieżka Playground, dostępna przy włączonym game-dev. Jeden własny projekt z GameMain.java i prostą działającą sceną gracza. Uczeń dodaje i usuwa własne klasy. Klasy silnika i launcher pozostają ukryte, dostępne jako dokumentacja readonly. Kod zapisujemy oddzielnie od lekcji w przeglądarce. RUN kompiluje i uruchamia scenę bez testów zadania i bez zaliczania postępu. Zachowujemy konsolę, canvas, fullscreen i debug colliderów.

Import/eksport JSON zawiera wersję formatu, pliki Java i plik wejściowy. Walidacja ogranicza rozmiar, rozszerzenia, duplikaty i ścieżki; odrzuca nadpisywanie klas silnika oraz launchera. Import wymaga potwierdzenia zastąpienia projektu i zatrzymuje bieżącą grę. Reset nie usuwa postępu kursu.

## Tutor

Pływający przycisk z robotem i zamykany panel zgodny z rodziną Lab. Tutor w Playground tłumaczy Javę i rzeczywiste API silnika; korzysta z katalogu dokumentacji oraz opisów metod. Rozmowa jest w pamięci, bez sekretów i bez zapisu w eksporcie projektu. Dołączanie kodu jest domyślnie wyłączone. Przed wysłaniem informujemy o przekazaniu pytań, a opcjonalnie kodu, do OpenRouter i dostawcy modelu.

Backend Node udostępnia /api/ai/config i /api/ai/chat oraz listę darmowych modeli zgodnie z wzorcem web-learning-lab. Klucz OPENROUTER_API_KEY pozostaje w środowisku backendu, nigdy w VITE_*, localStorage ani logach. Backend domyślnie nasłuchuje na loopback. npm run dev uruchamia oba serwery; statyczna aplikacja bez backendu nadal uruchamia gry, a tutor pokazuje brak konfiguracji.

Proponowane pliki .java wymagają jawnego zatwierdzenia. Walidujemy ścieżki i rozmiary; chronimy klasy silnika. Snapshot z chwili pytania pozwala wykryć późniejszą edycję i zablokować nieaktualne nadpisanie. Import/reset unieważnia propozycje. AI nie wykonuje kodu ani poleceń. Backend waliduje historię i kontekst, stosuje timeout oraz limity żądań. Testy nie wykonują płatnych zapytań.

## Diagnostyka startu gry

Potwierdzono brak serwera na 5182 i uruchomiono Vite. Nie potwierdzono jeszcze poprawności kompilacji i startu gry w przeglądarce. Weryfikacja oddziela kompilację testów Java, kompilację sceny, inicjalizację Wasm, eksporty launchera i pierwszą klatkę. Naprawa wymaga odtworzenia konkretnego błędu; nie uznajemy testów JVM za dowód działania TeaVM. Zachowujemy kod ucznia, nie resetujemy localStorage w ramach diagnozy.

## Weryfikacja i ograniczenia

Testy: selektory i fokus, zapis projektu, import/eksport i walidacja, brak zaliczania Playground, czyszczenie runtime, zgoda na kod, propozycje i konflikty, konfiguracja i błędy backendu. Pełne testy i build uruchamiamy sekwencyjnie; sprawdzamy desktop/mobile i rzeczywisty start sceny, jeżeli dostępna jest przeglądarka. Nie instalujemy Playwrighta ani nowych przeglądarek. Brak testu wizualnego zgłaszamy jawnie.

Poza zakresem: nowy silnik, lokalna kompilacja Java, logowanie, centralny hosting tutora i automatyczny agent. Publiczne udostępnienie backendu wymaga osobnej konfiguracji autoryzacji i kosztów.
