# Java Lab — kurs Javy w przeglądarce

Java Lab to kurs podstaw Javy dla uczniów: od `class` i `main`, przez zmienne,
warunki, pętle i metody, po obiekty, kompozycję, dziedziczenie oraz
polimorfizm.

Główna aplikacja działa all-in-browser. Kod z edytora trafia do Web Workera,
TeaVM kompiluje go do WebAssembly, a wynik `main()` jest pokazywany w panelu
konsoli. Kurs nie uruchamia lokalnego JDK, nie tworzy JAR-a i nie wymaga
lokalnego serwera Java.

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

Kurs uczy składni i API na poziomie Java 17. Aktualny oficjalny kompilator
TeaVM Playground jest zbudowany na javac, który emituje bytecode Java 21; worker
raportuje tę informację diagnostycznie, zamiast udawać, że jest to major 61.
Podstawowe przykłady kursu działają w tym trybie w przeglądarce. W repozytorium
jest też eksperymentalny wariant kompilatora target 17 w
`tools/teavm-javac-java17/`, ale obecny backend TeaVM 0.15 nie generuje z niego
poprawnego WASM nawet dla Hello World (`dereferencing a null pointer`), dlatego
nie jest używany przez aplikację.

Swing pozostaje osobną ścieżką wyjaśniającą API. TeaVM nie dostarcza w tym
runtime biblioteki `javax.swing`, więc lekcje Swing mogą sprawdzać strukturę
kodu, ale nie otwierają natywnego okna w przeglądarce. Interfejs webowy kursu
jest zbudowany w React.

JUnit 5 nie jest ładowany do runtime'u lekcji. Zadania mają szybki checker
źródła, a pełne testy JUnit mogą zostać dodane jako osobny etap kompilowany
przez TeaVM, gdy będzie potrzebny stabilny wariant test runnera.

## Zawartość kursu

- Fundamenty: pierwszy program, zmienne, typy, warunki, pętle i metody.
- Obiekty: klasy, konstruktory, enkapsulacja i kompozycja.
- Dziedziczenie: klasy bazowe, overriding, polimorfizm i wyjątki.
- Swing: teoria komponentów GUI i ograniczenia uruchamiania w TeaVM.

## Testy i build

```powershell
npm test -- --run
npm run build
```

W `tools/browser-poc/` pozostawiono wcześniejsze spike'i CheerpJ/TeaVM do
porównań technicznych. Nie są używane przez główny kurs React.
