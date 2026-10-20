# Początek GameDev — 20 października 2026

Lekcja 401 zawiera 11 stron: pętla gry, Game i scena, GameObject, pozycja, zmiana X, renderer, rodzaje rendererów, skala, obrót, dane komponentu i niezależne instancje.

Lekcja 402 zawiera 5 nowych stron o własnym komponencie, podłączaniu zachowania, delta, wejściu i kontrolerze ruchu. Zachowuje 2 dotychczasowe strony o przytrzymaniu klawisza oraz kierunku po zatrzymaniu. Łącznie: 18 stron, w tym 16 nowych.

Diagramy pokazują rzeczywiste współrzędne i porównania przed/po. Transform bez renderera pozostaje niewidoczny; krzyżyki są pomocami dydaktycznymi. Zmiana X ma odwracalny przycisk. Renderer, Transform i zachowanie mają osobne role. Przykład CharacterController2D zawiera wymagany CircleCollider2D.

Nowe quizy tych dwóch lekcji używają indeksu rewizji 1. Indeks 0 zachowuje dotychczasowe pytania i klucze, także dla wcześniej wysłanych prac. Pozostałe quizy pozostają przy indeksie 0.

Weryfikacja:

- Vitest: testy stron, diagramów, quizów i przebiegu nauka → quiz → zadanie.
- JDK: wszystkie 15 przykładów kodu kompiluje się z rzeczywistym silnikiem; test uruchamia ruch, wejście, zmianę koloru i renderowanie.
- Przeglądarka: strony 401 na komputerze i telefonie, strony 402 na komputerze i telefonie; brak poziomego przepełnienia. Wyniki w game-intro-browser-check.json.
- Produkcyjny build Vite zakończony powodzeniem. Pozostaje istniejące ostrzeżenie o rozmiarze pakietów Monaco.

Zmiana dotyczy stron nauki i zgodności quizów. Materiały PDF nie są regenerowane w tej zmianie.
