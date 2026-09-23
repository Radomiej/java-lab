# Java Lab — kurs Javy z CheerpJ

Lokalne laboratorium do nauki podstaw Javy dla uczniów. Kurs prowadzi od pierwszego programu, przez zmienne, warunki i pętle, do obiektów, dziedziczenia, kompozycji oraz prostych aplikacji Swing uruchamianych w przeglądarce przez CheerpJ.

## Uruchomienie

Wymagania:

- Node.js 18 lub nowszy,
- JDK 17 z programami `java`, `javac` i `jar` dostępnymi w `PATH`,
- połączenie z internetem przy pierwszym uruchomieniu panelu CheerpJ.

```powershell
cd C:\Nauka\java-lab
npm install
npm run dev:all
```

Otwórz `http://127.0.0.1:5182`.

Frontend działa na Vite, a lokalny runner Java na `http://127.0.0.1:3002`. Runner kompiluje kod poleceniem `javac --release 17`, uruchamia programy konsolowe lokalnie i przygotowuje JAR-y dla CheerpJ.

## Zawartość kursu

- Fundamenty: pierwszy program, zmienne, warunki, pętle.
- Obiekty: klasy, konstruktory, enkapsulacja, kompozycja.
- Dziedziczenie: klasy bazowe, polimorfizm, interfejsy.
- Swing: pierwsze okno, przyciski i prosta aplikacja.

Każda lekcja ma krótkie wyjaśnienie, przykład, zadania prowadzone i checkpoint automatycznie sprawdzający kod źródłowy.

## Ważne ograniczenia MVP

- Checkpointy są celowo prostym lokalnym checkerem tekstu i wyrażeń regularnych — nie zastępują pełnego kompilatora.
- Kompilowanie i uruchamianie odbywa się przez lokalny JDK, więc aplikacja nie jest jeszcze usługą wieloużytkownikową ani sandboxem produkcyjnym.
- CheerpJ uruchamia w przeglądarce gotowy JAR. Runtime jest ładowany z oficjalnego CDN: `https://cjrtnc.leaningtech.com/4.3/loader.js`.
- JUnit 5 nie jest uruchamiany w przeglądarkowym panelu CheerpJ w tej wersji. Można go dodać jako osobny lokalny tor testów Maven/Gradle w kolejnym etapie.

Przed użyciem w sieci publicznej runner powinien dostać izolację procesu, limity zasobów, autoryzację i czyszczenie artefaktów.

## Testy i build

```powershell
npm test -- --run
npm run build
```

## Git

Repozytorium zostało zainicjalizowane lokalnie. Dokumentacja architektury i plan implementacji są w `docs/superpowers/`.
