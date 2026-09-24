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

Kurs używa składni i API Java 21, zgodnie z aktualnym kompilatorem TeaVM
Playground. Podstawowe przykłady działają w całości w przeglądarce, a wersja
bytecode'u jest sprawdzana podczas diagnostyki.

Kurs skupia się na konsolowej Javie i podstawach obiektowości.

JUnit 5 nie jest ładowany do runtime'u lekcji. Zadania mają szybki checker
źródła, a pełne testy JUnit mogą zostać dodane jako osobny etap kompilowany
przez TeaVM, gdy będzie potrzebny stabilny wariant test runnera.

## Zawartość kursu

Każda lekcja ma trzy zadania: jedno prowadzone z rozwiązaniem i dwa
samodzielne. Podpowiedź oraz przycisk pokazania rozwiązania są dostępne tylko
w zadaniu prowadzonym, żeby dwa kolejne ćwiczenia sprawdzały samodzielność.

- Fundamenty: pierwszy program, zmienne, typy, warunki, pętle i metody.
- Obiekty: klasy, konstruktory, enkapsulacja i kompozycja.
- Dziedziczenie: klasy bazowe, overriding, polimorfizm i wyjątki.

## Testy i build

```powershell
npm test -- --run
npm run build
```
