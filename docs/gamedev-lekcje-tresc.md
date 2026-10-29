# Treść lekcji Game Dev (Java Lab) — zrzut 2026-10-29

Legenda:
- wiersze `1..N` = strony paginowanego wyjaśnienia „ZOBACZ, JAK TO DZIAŁA" (to widzi uczeń w lekcji),
- wiersz `teoria` = pole `lesson.theory` zapisane w obiekcie lekcji; pager go nie używa — wyświetlałaby je tylko ścieżka awaryjna `SharedExplanation` dla lekcji bez dedykowanych stron,
- wiersz `wskazówka` = pole `lesson.tips`; od tej wersji renderuje się jako pasek „Zapamiętaj" pod pagerem wyjaśnień,
- `### Zadania` = treść panelu zadań (polecenie, cel, wyjaśnienie rozwiązania, kryteria dla ucznia).
- `Scaffolding` wyświetla się jako podpowiedź w TaskPanel; lekcje bez własnego tekstu dostają domyślne.

## Lekcja 1 — g2d.scene „Scena, obiekty i komponenty"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 501)
Scaffolding: Gotowa baza: infrastruktura i mechaniki jeszcze niewyjaśnione w kursie. Edytuj wyłącznie miejsce TODO; pliki pomocnicze możesz obejrzeć.

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Gra działa w pętli | Gra to program, który wielokrotnie odczytuje wejście, aktualizuje swój stan i rysuje obraz. Gdy gracz naciska D, program może zmienić pozycję postaci, a kolejna klatka pokaże ją w nowym miejscu. Sam rysunek nie podejmuje decyzji.<br><br>efekt: Wejście → zmiana danych → nowy obraz. Ten cykl powtarza się podczas gry.<br>kontekst: Fragment metody onCreate() w klasie GameMain. | src/data/gameIntroPages.js |
| 2 | Game jest gospodarzem sceny | Scena to obiekty aktualnie tworzące nasz świat gry. W tym silniku przechowuje je obiekt Game; nie tworzymy osobnej klasy Scene. Nasza klasa rozszerza Game. Silnik uruchamia onCreate() raz, aby przygotować scenę. RUN w laboratorium uruchamia tę grę.<br><br>kod: public class GameMain extends Game { ⏎     @Override ⏎     public void onCreate() { ⏎         // Tutaj przygotujemy obiekty sceny. ⏎     } ⏎ }<br>efekt: Pusta scena nie ma jeszcze gracza ani skrzynki. Samo GameMain nie rysuje postaci.<br>kontekst: Plik GameMain.java. Klasy silnika są importowane przez laboratorium. | src/data/gameIntroPages.js |
| 3 | GameObject to jeden obiekt w scenie | createObject tworzy obiekt, rejestruje go w bieżącym Game i zwraca referencję. GameObject to pojemnik na dane i komponenty: może reprezentować gracza, skrzynkę lub monetę. Nazwa Player pomaga go rozpoznać; nie nadaje mu grafiki ani sterowania.<br><br>kod: GameObject player = createObject("Player");<br>efekt: W scenie istnieje Player z własnym Transform w (0, 0). Na planszy nadal nie widać postaci.<br>kontekst: Fragment metody onCreate() w klasie GameMain. | src/data/gameIntroPages.js |
| 4 | Transform odpowiada: gdzie jest obiekt? | Każdy GameObject dostaje własny Transform automatycznie. setPosition(100, 150) ustawia x i y. Początek świata jest w lewym górnym rogu: X rośnie w prawo, Y w dół. To punkt odniesienia obiektu, a nie rozmiar jego grafiki.<br><br>kod: GameObject player = createObject("Player"); ⏎ player.setPosition(100, 150);<br>efekt: Player ma x=100 i y=150. Krzyżyk na schemacie jest pomocą do nauki; sam Transform nie rysuje go w grze.<br>kontekst: Fragment metody onCreate() w klasie GameMain. | src/data/gameIntroPages.js |
| 5 | Zmień tylko X i porównaj wynik | Transform przechowuje liczby. Jeśli zmienisz tylko x, obiekt przesunie się poziomo. y pozostanie bez zmian. Nie tworzysz nowego obiektu: zmieniasz pozycję tego samego Player.<br><br>kod: player.setPosition(100, 150); // przed zmianą ⏎ player.transform.x = 220;     // zmieniamy tylko X<br>efekt: Po zmianie Player jest w (220, 150): 120 px w prawo, bez zmiany wysokości.<br>kontekst: Dalszy fragment onCreate(); player jest obiektem z poprzedniego przykładu. | src/data/gameIntroPages.js |
| 6 | Renderer sprawia, że obiekt widać | Renderer jest komponentem odpowiedzialnym za rysowanie. ShapeRenderer rysuje prosty kształt. Tworzymy komponent, a addComponent podłącza go do Player. Prostokąt ma szerokość 40 i wysokość 24; jego środek wypada w pozycji obiektu.<br><br>kod: GameObject player = createObject("Player"); ⏎ player.setPosition(100, 150); ⏎ player.addComponent( ⏎     new ShapeRenderer(40, 24, "#4b9483") ⏎ );<br>efekt: Widać prostokąt 40×24 px, ze środkiem w (100, 150). Przed dodaniem renderera ten sam obiekt istniał, ale był niewidoczny.<br>kontekst: Fragment metody onCreate() w klasie GameMain. | src/data/gameIntroPages.js |
| 7 | Wybierz renderer do rodzaju obrazu | ShapeRenderer rysuje kształt, Sprite rysuje grafikę z zasobów, a TextRenderer napis. Wszystkie są komponentami wyglądu. Nie dodają samodzielnie sterowania, punktów życia ani kolizji. W tych przykładach każdy renderer trafia do osobnego obiektu.<br><br>kod: shape.addComponent(new ShapeRenderer(40, 24, "#4b9483")); ⏎ hero.addComponent(new Sprite(Assets.PLAYER01, 40, 40)); ⏎ label.addComponent(new TextRenderer("Start", 16, "#173b46"));<br>efekt: shape pokazuje prostokąt, hero grafikę gracza, a label napis Start. Są to trzy sposoby rysowania.<br>kontekst: Fragment onCreate(); shape, hero i label są trzema wcześniej utworzonymi GameObject. | src/data/gameIntroPages.js |
| 8 | Skala zmienia rozmiar rysunku | Transform przechowuje też scale: mnożniki rozmiaru grafiki w osiach X i Y. Początkowo to (1,1). Wartość (2,1) daje dwa razy szerszy obraz, bez zmiany wysokości. Pozycja obiektu pozostaje punktem odniesienia.<br><br>kod: player.transform.scale.set(2, 1);<br>efekt: Prostokąt renderera 40×24 jest rysowany jako 80×24. Jego środek nadal jest w (100,150).<br>kontekst: Fragment onCreate(); player ma ShapeRenderer(40,24), pozycję (100,150) i obrót 0. | src/data/gameIntroPages.js |
| 9 | Obrót dotyczy grafiki wokół pozycji obiektu | rotation jest kątem w radianach. Math.PI/2 to ćwierć obrotu, czyli 90°. Ten przykład zaczyna ze skalą (1,1). Obracamy ten sam prostokąt wokół punktu obiektu; nie zmieniamy x ani y.<br><br>kod: player.transform.rotation = Math.PI / 2;<br>efekt: Prostokąt 40×24 jest teraz ustawiony pionowo. Jego środek pozostaje w (100,150).<br>kontekst: Fragment onCreate(); player ma ShapeRenderer(40,24), pozycję (100,150) i skalę (1,1). | src/data/gameIntroPages.js |
| 10 | Komponent ma własne dane i jedną rolę | addComponent zwraca dodany komponent. Możemy zachować tę referencję i zmienić jego kolor. Transform nadal odpowiada za pozycję, obrót i skalę, a ShapeRenderer za kształt i kolor. Zmiana koloru nie przesuwa Player. Transform jest polem obiektu; nie dodajemy go przez addComponent.<br><br>kod: GameObject player = createObject("Player"); ⏎ player.setPosition(100, 150); ⏎ ShapeRenderer skin = player.addComponent( ⏎     new ShapeRenderer(40, 24, "#4b9483") ⏎ ); ⏎ skin.color = "#d9973b";<br>efekt: Ten sam prostokąt zmienia kolor z zielonego na pomarańczowy. Pozycja (100, 150) i rozmiar 40×24 pozostają takie same.<br>kontekst: Fragment metody onCreate() w klasie GameMain. | src/data/gameIntroPages.js |
| 11 | Dwa obiekty to dwa niezależne zestawy danych | Każde createObject tworzy nową instancję GameObject z osobnym Transform. Każdy nowy komponent to osobna instancja. Zmiana pozycji First nie przesuwa Second. Nie podłączaj tej samej instancji komponentu do dwóch obiektów.<br><br>kod: GameObject first = createObject("First"); ⏎ first.setPosition(100, 150); ⏎ first.addComponent(new ShapeRenderer(40, 24, "#4b9483")); ⏎ GameObject second = createObject("Second"); ⏎ second.setPosition(220, 100); ⏎ second.addComponent(new ShapeRenderer(40, 24, "#d9973b")); ⏎ first.transform.x = 140;<br>efekt: First jest teraz w (140, 150). Second nadal jest w (220, 100). Każdy ma własny Transform i renderer.<br>kontekst: Fragment metody onCreate() w klasie GameMain. | src/data/gameIntroPages.js |
| teoria | Obiekt, pozycja i wygląd | Game przechowuje scenę. GameObject jest jednym obiektem, np. graczem. Transform przechowuje pozycję, a Sprite lub ShapeRenderer określa wygląd. Sam obiekt bez renderera nie jest widoczny. X rośnie w prawo, Y w dół. Transform określa pozycję obiektu w świecie, np. (100,100). Sprite i collider są umieszczane względem tego punktu; domyślne wyśrodkowanie renderera jest osobną regułą rysowania.<br><br>kod: GameObject box = createObject("Box"); ⏎ box.setPosition(200, 120); ⏎ box.addComponent(new ShapeRenderer(40, 30, "#76b9f2")); | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Dwa wywołania createObject tworzą niezależne obiekty. | src/data/gameDevTeaching.js |

### Zadania lekcji 1

**g2d.scene.guided** (guided / Z przykładem) — Pierwszy obiekt
- Polecenie: Masz gotowy obiekt Player w pozycji (80, 90). Dodaj mu tylko komponent ShapeRenderer o wymiarach 40×30 i kolorze #76b9f2. Uruchom program: niewidoczny dotąd obiekt stanie się widoczny.
- Cel: Utworzyć GameObject i dodać renderer w oddzielnych, czytelnych instrukcjach.
- Wyjaśnienie rozwiązania: GameObject już istnieje i ma pozycję. Dodanie ShapeRenderer nadaje mu widoczny wygląd. Komponenty określają, co obiekt potrafi: renderer rysuje, kontroler porusza, collider wykrywa kontakt.
- Kryteria (widok ucznia):
  - Istnieje jeden aktywny obiekt Player z własnym Transform i komponentem ShapeRenderer.
  - Player znajduje się w pozycji (80, 90). Prostokąt ma szerokość 40 px, wysokość 30 px i kolor #76b9f2.
  - Na mapie prostokąt sięga w poziomie od x = 60 do x = 100, a w pionie od y = 75 do y = 105. To jego krawędzie; środek obiektu nadal jest w (80, 90).
  - Po 20 aktualizacjach nadal istnieje jeden Player, a jego pozycja nie zmienia się.

**g2d.scene.modified** (modified / Samodzielnie) — Dwie osobne platformy
- Polecenie: Masz dwie widoczne platformy. Samodzielnie dopisz przesunięcie tylko obiektu PlatformB o 40 px w prawo. PlatformA ma pozostać bez zmian.
- Cel: Wykazać niezależność instancji obiektów.
- Kryteria (widok ucznia):
  - PlatformA i PlatformB są osobnymi obiektami, każdy z własnym Transform i ShapeRenderer.
  - PlatformA ma pozycję (120, 180), szerokość 100 px i wysokość 20 px.
  - Po przesunięciu PlatformB ma pozycję (340, 120), szerokość 80 px i wysokość 20 px.
  - Zmiana koloru lub pozycji PlatformB nie zmienia PlatformA.

**g2d.scene.independent** (independent / Rozbudowa) — Mała arena
- Polecenie: Gracz i pozycje obiektów są gotowe. Samodzielnie dodaj obiektowi Enemy komponent Sprite z teksturą slime (32×32), a obiektowi Coin — Sprite z teksturą coin (16×16). Nie twórz kolejnych obiektów.
- Cel: Złożyć czytelną scenę z kilku niezależnych obiektów.
- Kryteria (widok ucznia):
  - Scena zawiera dokładnie trzy obiekty: Player z teksturą player, Enemy z teksturą slime i Coin z teksturą coin.
  - Player ma pozycję (100, 100), szerokość 32 px i wysokość 32 px.
  - Enemy ma pozycję (280, 100), szerokość 32 px i wysokość 32 px.
  - Coin ma pozycję (180, 180), szerokość 16 px i wysokość 16 px.
  - Przesunięcie Coin do (200, 180) nie przesuwa Player ani Enemy.
  - Bez dodanego zachowania obiekty nie zmieniają pozycji po upływie sekundy.

## Lekcja 2 — g2d.input „Sterowanie i kierunek postaci"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 502)
Scaffolding: Gotowa baza: infrastruktura i mechaniki jeszcze niewyjaśnione w kursie. Edytuj wyłącznie miejsce TODO; pliki pomocnicze możesz obejrzeć.

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Własny komponent opisuje zachowanie | Renderer pokazuje obiekt, ale nim nie porusza. Własna klasa MoveRight rozszerza Component i opisuje ruch. Silnik wywołuje onUpdate(delta) w kolejnych klatkach dla podłączonego, aktywnego komponentu. gameObject oznacza jego właściciela. Samo napisanie klasy nie podłącza jej do gracza.<br><br>kod: public class MoveRight extends Component { ⏎     @Override ⏎     public void onUpdate(double delta) { ⏎         gameObject.transform.x += 20 * delta; ⏎     } ⏎ }<br>efekt: MoveRight potrafi przesuwać właściciela w prawo z prędkością 20 px/s. Zacznie działać po podłączeniu.<br>kontekst: Osobny plik MoveRight.java. To nasza klasa, a nie gotowy komponent silnika. | src/data/gameIntroPages.js |
| 2 | Podłącz zachowanie do konkretnego obiektu | Player ma już pozycję i wygląd. addComponent(new MoveRight()) daje mu teraz zachowanie z poprzedniej strony. Renderer i MoveRight korzystają z tego samego właściciela: ruch zmienia Transform, a renderer rysuje obiekt w nowym miejscu.<br><br>kod: GameObject player = createObject("Player"); ⏎ player.setPosition(100, 150); ⏎ player.addComponent(new ShapeRenderer(40, 24, "#4b9483")); ⏎ player.addComponent(new MoveRight());<br>efekt: Po 1 sekundzie Player przechodzi z (100, 150) do (120, 150). Renderer nie wykonuje ruchu; pokazuje jego wynik.<br>kontekst: Fragment metody onCreate() w klasie GameMain. | src/data/gameIntroPages.js |
| 3 | delta mówi, ile czasu minęło | delta to czas od poprzedniej aktualizacji, w sekundach. Prędkość razy czas daje przesunięcie. Dla 20 px/s i delta=0.05 otrzymujemy 1 px. Dzięki temu ruch zależy od czasu, a nie od liczby klatek. Silnik przekazuje delta; nie wpisujemy jej na stałe.<br><br>kod: gameObject.transform.x += 20 * delta;<br>efekt: Dla x=100 i delta=0.05: 100 + 20×0.05 = 101. Y pozostaje 150.<br>kontekst: Linia z onUpdate(double delta) komponentu MoveRight. | src/data/gameIntroPages.js |
| 4 | Klawisz decyduje, czy wykonać ruch | Dostęp do gry udostępnia Game właściciela komponentu. input.isKeyDown("d") zwraca true, gdy D jest przytrzymane. Warunek if decyduje, czy zmienić pozycję w tej klatce. Bez wciśniętego D ten komponent nie wykonuje ruchu.<br><br>kod: public class MoveWithD extends Component { ⏎     @Override ⏎     public void onUpdate(double delta) { ⏎         if (getGame().input.isKeyDown("d")) { ⏎             gameObject.transform.x += 120 * delta; ⏎         } ⏎     } ⏎ }<br>efekt: D przytrzymane: ruch w prawo. D zwolnione: brak zmiany x. Pozycja Y nie jest zmieniana.<br>kontekst: Plik MoveWithD.java. W GameMain podłącz new MoveWithD() zamiast new MoveRight(). | src/data/gameIntroPages.js |
| 5 | Kontroler gracza a komponent ruchu | W zadaniu PlayerController jest naszą klasą: czyta klawisze i wybiera kierunek. CharacterController2D jest komponentem silnika: wykonuje move(kierunekX, kierunekY, prędkość), uwzględniając czas. requireComponent szuka go na tym samym obiekcie. Do ruchu tym kontrolerem potrzebny jest też collider: obszar obiektu dla systemu ruchu i kontaktów. Tutaj dodajemy koło o promieniu 12. Szczegóły colliderów poznasz w następnej lekcji.<br><br>kod: public class PlayerController extends Component { ⏎     @Override ⏎     public void onUpdate(double delta) { ⏎         double x = getGame().input.isKeyDown("d") ? 1 : 0; ⏎         requireComponent(CharacterController2D.class) ⏎             .move(x, 0, 120); ⏎     } ⏎ }<br>setupCode: player.addComponent(new CircleCollider2D(12)); ⏎ player.addComponent(new CharacterController2D()); ⏎ player.addComponent(new PlayerController());<br>efekt: D daje kierunek (1, 0). PlayerController podejmuje decyzję, CharacterController2D wykonuje ruch, a renderer pokazuje wynik.<br>kontekst: Plik PlayerController.java. Przygotowanie obiektu w GameMain pokazano powyżej. PlayerController jest osobnym plikiem. | src/data/gameIntroPages.js |
| 6 | Przytrzymanie czy nowe naciśnięcie? | Przytrzymanie służy do chodzenia. Nowe naciśnięcie wywołuje pojedynczą akcję. Trzy klatki przytrzymania nie powinny oznaczać trzech nowych naciśnięć. | shared/lab-game-v2/editor/lessonVisuals.js |
| 7 | Kierunek zostaje po zatrzymaniu | CharacterController2D.getDirection() zwraca kopię ostatniego niezerowego kierunku. Po ruchu w prawo i puszczeniu D gracz stoi, ale kierunek nadal wynosi (1,0). Broń w lekcji 5 użyje go do strzału. | shared/lab-game-v2/editor/lessonVisuals.js |
| 8 | Jak pobrać komponent z obiektu? | PlayerController i CharacterController2D to dwa komponenty tego samego GameObject. Wewnątrz komponentu piszesz this.requireComponent(CharacterController2D) — zwraca komponent albo zgłasza błąd, gdy obiekt go nie ma. Wersja getComponent zwraca komponent lub null; sprawdź wynik, zanim wywołasz metodę. Komponent innego obiektu bierzesz z jego referencji: other.getComponent(...) w onTrigger, a sam obiekt znajdziesz przez this.game.find("Nazwa").<br><br>nota: requireComponent zgłasza błąd od razu — to najbezpieczniejszy wybór, gdy komponent musi istnieć. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Odczyt wejścia i wykonanie ruchu | PlayerController jest Twoją klasą: odczytuje klawisze i decyduje o kierunku. CharacterController2D wykonuje ruch z uwzględnieniem przeszkód. Przytrzymanie klawisza służy do chodzenia; nowe naciśnięcie do pojedynczej akcji. Kliknij planszę, aby klawiatura sterowała grą, a nie edytorem.<br><br>kod: requireComponent(CharacterController2D.class).move(x, y, 120); | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | move otrzymuje kierunek i prędkość; kontroler uwzględnia czas aktualizacji. | src/data/gameDevTeaching.js |

### Zadania lekcji 2

**g2d.input.guided** (guided / Z przykładem) — Ruch WASD i strzałkami
- Polecenie: Gracz, kontroler i odczyt klawiszy WASD/strzałek są gotowe. Dopisz jedno wywołanie move(x, y, speed) w PlayerController. Po uruchomieniu klawisz D ma przesuwać gracza w prawo, a puszczenie klawiszy — zatrzymywać postać.
- Cel: Przekazać odczytany kierunek wejścia do kontrolera ruchu.
- Wyjaśnienie rozwiązania: Gotowy kod odczytuje WASD i strzałki. Jedno wywołanie move przekazuje kierunek i prędkość kontrolerowi. Kontroler uwzględnia czas oraz normalizuje ruch po przekątnej — nie mnożymy speed ponownie przez delta.
- Kryteria (widok ucznia):
  - Przytrzymanie D przez 0.5 s przesuwa obiekt Player do (160, 100); ArrowRight daje taki sam wynik.
  - Przez 0.5 s bez wciśniętych klawiszy pozycja pozostaje (100, 100).
  - Jednoczesne A+D oraz W+S dają zerowy ruch na danej osi.
  - Przytrzymanie S+D przez sekundę daje dystans 120 px z zachowaniem równych składowych.

**g2d.input.modified** (modified / Samodzielnie) — Sprint
- Polecenie: Gotowy gracz porusza się z prędkością 100 px/s. Samodzielnie zmień argument prędkości w move: przytrzymany Shift daje 200 px/s, a bez Shift — 100 px/s. Nie kopiuj logiki kierunku.
- Cel: Przekazywać zmienną prędkość bez duplikowania logiki ruchu.
- Kryteria (widok ucznia):
  - Przytrzymany Shift podwaja prędkość ruchu do 200 px/s.
  - Po puszczeniu Shift prędkość wraca do 100 px/s.
  - Sprint po przekątnej nie jest szybszy — składowe kierunku pozostają znormalizowane.
  - Sam klawisz Shift bez kierunku nie porusza postaci.

**g2d.input.independent** (independent / Rozbudowa) — Jedna akcja — jeden pocisk
- Polecenie: Ruch jest gotowy, a komponent ActionShooter obserwuje licznik: co 10 aktualizacji sprawdza, czy actions wynosi 1 — wtedy wystrzeliwuje Fireball w ostatnim kierunku postaci i zeruje licznik. Uzupełnij ActionCounter tak, aby jedno nowe naciśnięcie Space zwiększało actions o 1. Przytrzymanie klawisza nie może naliczać kolejnych akcji — inaczej licznik przekroczy 1 i strzał nie nastąpi.
- Cel: Wykrywać pojedyncze naciśnięcie klawisza w osobnym komponencie.
- Kryteria (widok ucznia):
  - Jedno naciśnięcie Space daje dokładnie jeden pocisk Fireball w ciągu 10 aktualizacji.
  - Po strzale licznik actions wraca do 0; kolejny strzał wymaga nowego naciśnięcia.
  - Przytrzymanie Space nie strzela wielokrotnie — licznik rośnie tylko przy nowym naciśnięciu klawisza.
  - Ruch klawiszem D działa równocześnie; pocisk startuje z pozycji postaci.

## Lekcja 3 — g2d.collisions „Collidery, przeszkody i granice świata"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 503)
Scaffolding: Gotowa baza: infrastruktura i mechaniki jeszcze niewyjaśnione w kursie. Edytuj wyłącznie miejsce TODO; pliki pomocnicze możesz obejrzeć.

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Obraz i fizyczny kształt | Sprite jest grafiką, collider opisuje obszar kontaktu. Koło może być mniejsze od sprite’a. Oba kształty mają własne wymiary. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Ruch zatrzymuje się przy ścianie | CharacterController2D sprawdza przeszkodę podczas ruchu. Bezpośrednie setPosition zmienia pozycję, ale nie zastępuje ruchu z kolizjami. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Ruch wzdłuż przeszkody | Przy kontakcie kontroler może zablokować składową skierowaną w ścianę i pozostawić ruch wzdłuż niej. Sprawdź kształty przez opcję Collidery. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Grafika i fizyczny kształt | Sprite jest obrazem. Collider2D to prostokąt blokujący ruch, a CircleCollider2D to koło o podanym promieniu. Collider ma osobne wymiary i może być mniejszy od grafiki. CharacterController2D sprawdza przeszkody podczas ruchu. Bezpośrednie setPosition zmienia pozycję, ale nie zastępuje ruchu z kolizjami. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Włącz Collidery w podglądzie, aby zobaczyć kształty kontaktu. | src/data/gameDevTeaching.js |

### Zadania lekcji 3

**g2d.collisions.guided** (guided / Z przykładem) — Ściana zatrzymuje gracza
- Polecenie: Gracz i widoczna ściana są gotowe. Dodaj ścianie tylko komponent Collider2D(20, 200). Uruchom grę i przytrzymaj D: gracz ma zatrzymać się przed ścianą na x = 174.
- Cel: Dodać collider blokujący ruch.
- Wyjaśnienie rozwiązania: Widoczna ściana sama nie blokuje ruchu. Dodanie Collider2D o wymiarach 20×200 daje kontrolerowi fizyczną przeszkodę. Gracz o połowie szerokości 16 zatrzyma środek na x = 174.
- Kryteria (widok ucznia):
  - Po sekundzie ruchu w prawo (D) środek obiektu Player zatrzymuje się na x = 174, y = 180; prawa krawędź dotyka x = 190.
  - Bez collidera na ścianie ten sam ruch dochodzi do x = 220.
  - Sprite ściany i jej collider mają niezależnie ustawione wymiary; sam Sprite nie blokuje ruchu.

**g2d.collisions.modified** (modified / Samodzielnie) — Koło i skala wizualna
- Polecenie: Samodzielnie zamień prostokątny collider gracza na CircleCollider2D(12) oraz ustaw skalę grafiki na (2, 2). Ściana jest gotowa; ruch w prawo (D) ma zatrzymać środek gracza na x = 178.
- Cel: Stosować promień collidera niezależny od skali Sprite’a.
- Kryteria (widok ucznia):
  - Przy tej samej ścianie obiekt Player zatrzymuje się na x = 178.
  - Po zmianie skali grafiki na (2, 2) punkt zatrzymania nadal wynosi x = 178.
  - Jawna zmiana promienia na 20 przesuwa punkt zatrzymania na x = 170; sama skala grafiki tego nie zmienia.

**g2d.collisions.independent** (independent / Rozbudowa) — Korytarz i granice świata
- Polecenie: Gotowe są ruch, gracz i widoczne ściany korytarza. Samodzielnie dodaj ścianom collidery i ustaw granice świata 640×360. Sprawdź blokowanie ruchu i ślizganie wzdłuż ściany.
- Cel: Zbudować korytarz z nieprzenikalnymi ścianami i granicami świata.
- Kryteria (widok ucznia):
  - Ruch w lewo zatrzymuje środek gracza na x = 192, a w prawo na x = 268.
  - Podczas ruchu ukośnego wzdłuż ściany współrzędna x nie przekracza granicy ściany, a y nadal rośnie.
  - Środek koła na mapie może przesuwać się w poziomie od x = 12 do x = 628, a w pionie od y = 12 do y = 348. Dzięki marginesowi 12 px koło nie wychodzi poza granice świata.
  - Krok 0.1 s przy prędkości 600 px/s nie przenosi gracza na drugą stronę ściany.

## Lekcja 4 — g2d.enemy-ai „Pierwszy przeciwnik i pościg"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 504)
Scaffolding: Gotowa baza: infrastruktura i mechaniki jeszcze niewyjaśnione w kursie. Edytuj wyłącznie miejsce TODO; pliki pomocnicze możesz obejrzeć.

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Wektor od przeciwnika do celu | Kierunek wyznaczamy jako pozycja celu minus pozycja przeciwnika. Dla przeciwnika (100,150) i celu (160,150) otrzymujemy (60,0), czyli w prawo. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Stała prędkość pościgu | Znormalizuj różnicę pozycji, zanim pomnożysz ją przez prędkość. Dzięki temu odległy cel nie powoduje szybszego ruchu. Obsłuż brak celu i odległość zero. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Decyzja i wykonanie ruchu | EnemyAI wybiera kierunek. Kontroler wykonuje ruch i uwzględnia przeszkody. Parametry pozwalają uzyskać różne zachowania tej samej klasy.<br><br>nota: Nie kopiuj całej klasy tylko po to, aby zmienić prędkość.<br>scenka: Wróg w (100, 150): EnemyAI:
cel (160, 150)
kierunek w prawo / Wróg rusza: Kontroler:
60 px/s × 0.5 s
x: 100 → 130 [Ściana może zatrzymać ruch] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (enemy-ai:2) |
| teoria | Decyzja AI, potem ruch | EnemyAI jest Twoim komponentem. Kierunek do celu to pozycja celu minus pozycja przeciwnika. Normalizacja daje sam kierunek niezależny od odległości. Kontroler odpowiada za ruch i przeszkody. Zmiana kierunku lub prędkości daje różne zachowania bez kopiowania całej klasy. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Obsłuż brak celu i zerową odległość przed obliczeniem ruchu. | src/data/gameDevTeaching.js |

### Zadania lekcji 4

**g2d.enemy-ai.guided** (guided / Z przykładem) — Pościg za graczem
- Polecenie: Gracz, Slime, cel i obliczenie dx oraz dy są gotowe. Dopisz jedno wywołanie move(dx, dy, speed) w EnemyAI. Przeciwnik ma ruszyć w pościg z prędkością 60 px/s.
- Cel: Uruchomić pościg w komponencie EnemyAI.
- Wyjaśnienie rozwiązania: Cel, kierunek i kontroler są gotowe. Wywołanie move(dx, dy, speed) uruchamia pościg. Kierunek liczymy jako pozycja celu minus pozycja przeciwnika; kontroler sam normalizuje wektor.
- Kryteria (widok ucznia):
  - Po sekundzie Slime znajduje się w pozycji (160, 100) na pustej scenie.
  - Gdy cel leży po przekątnej, Slime pokonuje 60 px w ciągu sekundy.
  - Jeżeli Slime i cel są w tym samym punkcie, nie powstaje wartość NaN ani niekontrolowany ruch.
  - Zniszczenie celu lub target = null zatrzymuje przeciwnika bez błędu.

**g2d.enemy-ai.modified** (modified / Samodzielnie) — Dwa tempa pościgu
- Polecenie: Slime i Bat mają własne prędkości (40 i 80 px/s) oraz referencję do gracza. Samodzielnie napisz metodę onUpdate wspólnego komponentu EnemyAI: oblicz kierunek do celu i wywołaj kontroler ruchu.
- Cel: Użyć jednej klasy komponentu dla różnych instancji przeciwników.
- Kryteria (widok ucznia):
  - Na osobnych prostych odcinkach po 0.5 s Slime przebywa 20 px, a Bat 40 px.
  - Zmiana nazwy obiektu gracza nie zatrzymuje żadnego z przeciwników.
  - Po przeniesieniu celu na drugą stronę przeciwnicy zmieniają kierunek w następnym kroku.
  - Oba sprite’y pozostają ustawione pionowo (rotation = 0), a kierunek poziomy może być odzwierciedlany przez flipX.

**g2d.enemy-ai.independent** (independent / Rozbudowa) — Przeciwnik utrzymuje dystans
- Polecenie: Masz gotową scenę, ruch gracza i komponent FleeAI. Samodzielnie napisz ucieczkę: gdy odległość od gracza jest mniejsza niż 120 px, oddalaj się z prędkością 60 px/s; poza tym zasięgiem stój w miejscu.
- Cel: Samodzielnie zaprogramować regułę ucieczki AI.
- Kryteria (widok ucznia):
  - Dla celu w (300, 100) i przeciwnika w (250, 100) po 0.5 s przeciwnik znajduje się w (220, 100).
  - Gdy odległość wynosi 120 px lub więcej, w następnym kroku przeciwnik się nie przemieszcza.
  - Gdy cel i przeciwnik są w tym samym punkcie, stosowany jest jawny kierunek awaryjny (1, 0), bez wartości NaN.
  - FleeAI jednego przeciwnika nie zmienia parametrów EnemyAI drugiego; każdym obiektem steruje tylko jeden aktywny komponent ruchu.

## Lekcja 5 — g2d.projectiles „Pociski, HP i pierwsza pętla walki"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 505)
Scaffolding: Gotowe Health, FireWeapon, ContactDamage i EnemyAI pozwalają grać. W tej lekcji zmieniasz trafienie; Health rozbudujesz w lekcji 10, Weapon w 11, AI w 14, a efekty w 19.

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Pocisk i HP tworzą walkę | Space tworzy pocisk w kierunku CharacterController2D.getDirection(). Kontakt pocisku z wrogiem wywołuje Health.damage(1): HP 3 → 2. Przy HP=0 wróg znika. Kontakt wroga odbiera HP graczowi. Health jest teraz gotowe; w lekcji 10 napiszesz i rozbudujesz ten komponent. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Pocisk: wygląd, lot i trafienie | Sprite rysuje pocisk, komponent lotu wykonuje ruch — prosta klasa ProjectileMotion w pierwszych zadaniach albo silnikowy Projectile2D, który wykrywa kontakt na całym odcinku ruchu. ProjectileHit zmienia HP celu. Owner wskazuje obiekt strzelający. Każdy komponent ma osobną odpowiedzialność. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Jedno trafienie zużywa pocisk | Poprawny cel otrzymuje obrażenia. Pocisk ignoruje właściciela i sojuszników. Flaga zużycia chroni przed drugim trafieniem tego samego pocisku. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Pocisk jako zestaw zachowań | Pocisk to GameObject z wyglądem, kształtem kontaktu oraz komponentami lotu i trafienia. Lot wykorzystuje kierunek i czas. Trafienie sprawdza cel i odejmuje zdrowie; musi ignorować właściciela i sojuszników. Flaga zużycia zapobiega wielokrotnemu zadaniu obrażeń. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Czas życia usuwa chybione pociski ze sceny. | src/data/gameDevTeaching.js |

### Zadania lekcji 5

**g2d.projectiles.guided** (guided / Z przykładem) — Prawdziwy lot pocisku
- Polecenie: Lot pocisku, trigger, rozpoznawanie celu i komponent Health są gotowe. Dopisz tylko wywołanie hp.damage(damage) w ProjectileHit. Po trafieniu zdrowie celu spadnie z 3 do 2, a pocisk zniknie.
- Cel: Zadać obrażenia dopiero w chwili kontaktu pocisku z celem.
- Wyjaśnienie rozwiązania: Lot, trigger i Health tworzą gotową bazę. Wywołanie hp.damage(damage) odejmuje zdrowie trafionemu celowi. Flaga zużycia (spent) i usunięcie pocisku gwarantują pojedyncze trafienie, a pole owner chroni strzelającego.
- Kryteria (widok ucznia):
  - Po 0.2 s pocisk znajduje się w (140, 100), a cel nadal ma 3 HP.
  - Gdy pocisk dotrze do obszaru kontaktu celu, zdrowie celu spada do 2 HP, a pocisk zostaje usunięty ze sceny.
  - W kolejnych krokach cel nadal ma 2 HP — jeden pocisk zadaje obrażenia tylko raz.
  - Obrażenia wynikają z rzeczywistego kontaktu pocisku z celem, a nie z odjęcia HP już w chwili wystrzału.
  - Po uruchomieniu klawisze WASD/strzałki poruszają graczem, a Space wystrzeliwuje pocisk w ostatnim kierunku ruchu.
  - Trzy trafienia po 1 pkt obrażeń pokonują przeciwnika z HP = 3; kontakt z wrogiem odbiera HP graczowi z krótką ochroną między trafieniami.

**g2d.projectiles.modified** (modified / Samodzielnie) — Właściciel i czas życia
- Polecenie: Pocisk już lata i trafia. Samodzielnie skróć jego czas życia (lifetime) z 2 do 0.5 sekundy; zachowaj owner = Player oraz pojedyncze trafienie. Sprawdź trafienie w cel oraz znikanie pocisku po czasie.
- Cel: Chronić właściciela przed własnym pociskiem i usuwać pociski po upływie czasu życia.
- Kryteria (widok ucznia):
  - Tuż po utworzeniu pocisku w pozycji gracza zdrowie Player nie maleje.
  - Pocisk lecący obok wszystkich celów istnieje jeszcze po 0.4 s i znika po 0.5 s.
  - Dwa pociski wystrzelone w różnych chwilach mają niezależne czasy życia.
  - Po wygaśnięciu pocisk nie jest rysowany, nie bierze udziału w kolizjach i nie wykonuje onUpdate.
  - Po uruchomieniu klawisze WASD/strzałki poruszają graczem, a Space wystrzeliwuje pocisk w ostatnim kierunku ruchu.
  - Trzy trafienia po 1 pkt obrażeń pokonują przeciwnika z HP = 3; kontakt z wrogiem odbiera HP graczowi z krótką ochroną między trafieniami.

**g2d.projectiles.independent** (independent / Rozbudowa) — Szybki pocisk i pierwszy cel
- Polecenie: Obsługa trafienia i obiekty sceny są gotowe. Samodzielnie dodaj pociskowi komponent Projectile2D(1, 0, 3000, 1, player) i ustaw hitLayers = 2. Pocisk ma trafić pierwszego wroga na linii strzału, pomijając sojusznika i właściciela.
- Cel: Użyć ciągłego wykrywania kolizji na całym odcinku ruchu pocisku.
- Kryteria (widok ucznia):
  - Przy kroku 0.1 s szybki pocisk wykrywa cel o promieniu r = 8 pomiędzy początkiem a końcem ruchu, nawet jeśli na końcu kroku byłby już za celem.
  - Gdy dwa cele stoją na jednej linii, obrażenia otrzymuje tylko bliższy z nich.
  - Sojusznik stojący przed przeciwnikiem nie zatrzymuje pocisku ani nie traci HP.
  - Po wywołaniu destroy pocisk nie zadaje obrażeń ponownie; wynik trafienia jest taki sam dla kroków 0.1 s oraz 0.05 s.
  - Po uruchomieniu klawisze WASD/strzałki poruszają graczem, a Space wystrzeliwuje pocisk w ostatnim kierunku ruchu.
  - Trzy trafienia po 1 pkt obrażeń pokonują przeciwnika z HP = 3; kontakt z wrogiem odbiera HP graczowi z krótką ochroną między trafieniami.

## Lekcja 6 — g2d.components „Własna klasa komponentu i cykl życia"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 506)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Właściciel i zachowanie | Komponent należy do GameObject. Klasa opisuje zachowanie, a każda nowa instancja przechowuje własne dane. gameObject wskazuje właściciela komponentu.<br><br>nota: Do dwóch właścicieli dodaj dwie instancje.<br>scenka: Bohater Ada: Counter A: counts = 0 / Bohater Bob: Counter B: counts = 0 | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (components:0) |
| 2 | Osobny stan każdej instancji | Zmiana licznika komponentu A nie zmienia komponentu B. Pole instancji należy do jednego komponentu; static jest wspólne dla klasy. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Cykl życia komponentu | onCreate inicjalizuje komponent raz. onUpdate(delta) aktualizuje go w kolejnych klatkach. onDestroy sprząta zasoby przy usuwaniu.<br><br>nota: Tworzenie i aktualizowanie to różne momenty.<br>scenka: Powstaje bohater: onCreate()
HP ustawione na 8 [1 raz] / Bohater żyje: onUpdate(delta)
sprawdza ruch [co klatkę] / Bohater znika: onDestroy()
usunięcie reakcji [1 raz na końcu] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (components:2) |
| teoria | Komponent ma własny stan | Klasa dziedzicząca po Component opisuje zachowanie, a new tworzy jego instancję. onCreate inicjalizuje komponent; onUpdate(delta) wykonuje aktualizacje. gameObject wskazuje właściciela. Zwykłe pole należy do konkretnej instancji. Pole static byłoby wspólne dla wszystkich instancji, więc nie nadaje się na osobny licznik każdej postaci.<br><br>kod: public class Counter extends Component { ⏎     public int counts = 0; ⏎     @Override public void onUpdate(double delta) { ⏎         counts++; ⏎     } ⏎ } | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Dodaj nową instancję komponentu do każdego obiektu. | src/data/gameDevTeaching.js |

### Zadania lekcji 6

**g2d.components.guided** (guided / Z przykładem) — Licznik aktualizacji
- Polecenie: Masz gotową klasę Counter i scenę. Dopisz zwiększenie counts o 1 w onUpdate.
- Cel: Uzupełnić pola i metodę własnego komponentu.
- Wyjaśnienie rozwiązania: Pole counts należy do instancji komponentu. counts++ zapisuje kolejną aktualizację; tworzenie obiektu i inicjalizacja pozostają poza pętlą.
- Kryteria (widok ucznia):
  - Po uruchomieniu counts=0; po trzech aktualizacjach counts=3.
  - Znacznik inicjalizacji ma wartość 1 również po trzeciej aktualizacji.
  - Komponent ma poprawnego właściciela Player; nie tworzysz kolejnych Player w onUpdate.

**g2d.components.modified** (modified / Samodzielnie) — Dwa liczniki
- Polecenie: Dodaj osobne instancje Counter do obiektów PlayerA i PlayerB; po dwóch aktualizacjach wyłącz tylko licznik obiektu PlayerB i wykonaj jeszcze trzy aktualizacje.
- Cel: Przechowywać stan w osobnych instancjach i sterować polem enabled.
- Kryteria (widok ucznia):
  - Po pierwszych dwóch aktualizacjach oba liczniki wynoszą 2.
  - Po wyłączeniu komponentu B i trzech kolejnych aktualizacjach licznik A wynosi 5, a B wynosi 2.
  - Ponowne włączenie komponentu B i jedna aktualizacja dają A = 6 oraz B = 3, bez ponownej inicjalizacji.

**g2d.components.independent** (independent / Rozbudowa) — Obiekt z określonym czasem życia
- Polecenie: Napisz komponent Lifetime z polem remaining = 0.3 s. Dodaj go do obiektu Spark i usuń obiekt po upływie tego czasu. W metodzie onDestroy zwiększ pomocniczy licznik cleanup.
- Cel: Odliczać czas życia w komponencie i wykonać sprzątanie dokładnie raz.
- Kryteria (widok ucznia):
  - Po 0.2 s obiekt Spark jeszcze istnieje; po 0.3 s zostaje zniszczony i usunięty z aktywnej sceny.
  - Licznik cleanup zwiększa się dokładnie raz, także po kolejnych aktualizacjach i powtórnym wywołaniu destroy.
  - Dwa obiekty Spark utworzone w różnych chwilach odliczają swój czas remaining niezależnie.
  - Zniszczony obiekt Spark nie jest już aktualizowany ani rysowany.

## Lekcja 7 — g2d.time „Czas, wektory i stała prędkość"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 507)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Prędkość razy czas | Przesunięcie = kierunek × prędkość × delta. Dla ruchu w prawo: 120 px/s × 0.5 s = 60 px. Z x=100 otrzymujemy x=160 niezależnie od liczby klatek. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Dlaczego normalizujemy przekątną? | Kierunek (1,1) ma długość √2. Podziel obie składowe przez √2: około (0.707,0.707). Wtedy długość kierunku wynosi 1 i sprint po przekątnej ma tę samą prędkość.<br><br>nota: Podpowiedź: długość = √(x²+y²); dzielimy tylko, gdy długość > 0. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Brak kierunku oznacza brak ruchu | Dla (0,0) długość jest zerowa. Nie dziel przez zero: pozostaw wektor zerowy. Gdy klawisze są zwolnione, gracz stoi. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Prędkość nie jest przesunięciem | delta to czas aktualizacji w sekundach. Ruch z prędkością 100 pikseli/s przez 0,1 sekundy daje 10 pikseli przesunięcia. Mnożenie przez delta uniezależnia ruch od liczby klatek. Normalizacja kierunku zapobiega szybszemu ruchowi po przekątnej; dla wektora zerowego nie dziel przez jego długość. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Przesunięcie = kierunek × prędkość × delta. | src/data/gameDevTeaching.js |

### Zadania lekcji 7

**g2d.time.guided** (guided / Z przykładem) — 80 pikseli na sekundę
- Polecenie: Masz gotowy Mover z velocityX=80 i delta. Dopisz przesunięcie transform.x o velocityX*delta.
- Cel: Zastosować delta w ruchu.
- Wyjaśnienie rozwiązania: Prędkość jest w px/s, a delta w sekundach. Ich iloczyn daje przesunięcie w tej aktualizacji, niezależne od liczby klatek.
- Kryteria (widok ucznia):
  - Po 0.5 s pozycja wynosi (140,80), po 1 s (180,80).
  - 10 kroków po 0.1 s i 20 kroków po 0.05 s daje tę samą pozycję końcową.
  - Krok o delta=0 nie zmienia pozycji.

**g2d.time.modified** (modified / Samodzielnie) — Prędkość jako konfiguracja
- Polecenie: Dodaj w komponencie Mover pola velocityX oraz velocityY. Obiekt Drop w (200, 40) ma prędkość (0, 60), a Spark w (20, 30) ma prędkość (-40, 20).
- Cel: Użyć jednej klasy komponentu z różnymi parametrami dla różnych obiektów.
- Kryteria (widok ucznia):
  - Po 0.5 s obiekt Drop jest w (200, 70), a Spark w (0, 40).
  - Po 1 s obiekt Drop jest w (200, 100), a Spark w (-20, 50), bez automatycznego zatrzymywania na krawędzi ekranu.
  - Zmiana prędkości obiektu Drop nie zmienia prędkości obiektu Spark.

**g2d.time.independent** (independent / Rozbudowa) — Ten sam dystans w każdym kierunku
- Polecenie: Napisz komponent DirectionMover z polami direction i speed. Dla kierunku (3, 4) i speed = 100 obiekt ma pokonać dokładnie 100 px w sekundę; kierunek zerowy (0, 0) zatrzymuje ruch.
- Cel: Znormalizować wektor kierunku bez dzielenia przez zero.
- Kryteria (widok ucznia):
  - Startując z (100, 100), po sekundzie ruchu w kierunku (3, 4) obiekt dociera do (160, 180).
  - Dla kierunku (1, 1) długość przesunięcia po sekundzie wynosi 100 px, a nie około 141.421 px.
  - Dla kierunku (0, 0) pozycja się nie zmienia, a współrzędne pozostają poprawnymi liczbami (bez NaN).
  - Zmiana kierunku na przeciwny odwraca zwrot ruchu bez zmiany prędkości.

## Lekcja 8 — g2d.graphics „Sprite, kafelki, odbicie i warstwy"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 508)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Warstwy układają obraz | TileMap rysuje tło, Sprite postać. Podaj jawne wymiary. Niższa warstwa layer znajduje się pod wyższą. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | flipX: porównaj obie strony | flipX odbija tę samą teksturę poziomo. Asymetryczny łucznik pozwala zobaczyć zmianę kierunku. To zmiana wyglądu, nie odbicie prędkości. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Odbicie nie zmienia collidera | Pozycja i fizyczny kształt pozostają takie same. Włącz podgląd colliderów: koło nie zmienia rozmiaru ani położenia, kiedy odbijasz grafikę. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Wygląd, lustrzane odbicie i warstwy | Sprite rysuje teksturę o podanych wymiarach. TileMap wypełnia obszar kafelkami. Niższa warstwa layer jest rysowana pod wyższą. flipX odbija obraz poziomo, flipY pionowo. W drugim zadaniu postać łucznika ma asymetryczny wygląd: naciśnij A, puść klawisz, potem naciśnij D i obserwuj zmianę strony. Włącz Collidery: gracz ma CircleCollider2D(12), a ściana prostokątny Collider2D. Lustrzane odbicie zmienia grafikę; kształt collidera pozostaje taki sam. Odbijanie prędkości po uderzeniu w ścianę to osobne zachowanie fizyczne. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Kliknij planszę, użyj A/D i włącz Collidery. Zmiana kierunku jest zadaniem w FacingVisual.onUpdate(). | src/data/gameDevTeaching.js |

### Zadania lekcji 8

**g2d.graphics.guided** (guided / Z przykładem) — Łąka pod postacią
- Polecenie: Obiekt Ground i gracz są gotowe. Dodaj obiektowi Ground komponent TileMap z teksturą grass i rozmiarem kafelka 32.
- Cel: Wypełnić tło kafelkami za pomocą jednego obiektu.
- Wyjaśnienie rozwiązania: TileMap wypełnia tło kafelkami. To jeden komponent na jednym obiekcie, a nie setki osobnych obiektów w scenie.
- Kryteria (widok ucznia):
  - Ground i Player są dwoma obiektami; pojedyncze kafelki nie tworzą osobnych obiektów GameObject.
  - Tło grass wypełnia widok 640×360, a po zmianie rozmiaru także widok 320×200.
  - Player jest rysowany na wierzchu tła, ze środkiem w (100, 100) i wymiarami 32×32 px.

**g2d.graphics.modified** (modified / Samodzielnie) — Piasek i kierunek patrzenia
- Polecenie: Zmień tło na teksturę sand z kafelkiem 48. Komponent FacingVisual ma ustawiać Sprite.flipX przy ruchu w lewo/prawo i zachowywać ostatnie odbicie po zatrzymaniu.
- Cel: Odbijać sam wygląd postaci bez zmiany jej fizyki.
- Kryteria (widok ucznia):
  - Tło używa tekstury sand i kafelka 48 px.
  - Po ruchu w lewo (A) sprite.flipX wynosi true i pozostaje true po zatrzymaniu; po ruchu w prawo (D) zmienia się na false.
  - Podczas odbicia Transform.rotation wynosi 0, scale.x wynosi 1, a rozmiar collidera się nie zmienia.

**g2d.graphics.independent** (independent / Rozbudowa) — Arena z czytelnymi warstwami
- Polecenie: Zbuduj tło, ścieżkę jako ShapeRenderer 400×32 ze środkiem w (320, 180), obiekt Player oraz dekorację. Ustaw jawne warstwy (layer): tło -10, ścieżka -5, Player 0, dekoracja 5.
- Cel: Sterować kolejnością rysowania za pomocą warstw niezależnie od kolejności tworzenia obiektów.
- Kryteria (widok ucznia):
  - Kolejność rysowania odpowiada wartościom layer nawet po odwróceniu kolejności tworzenia obiektów.
  - Ścieżka ma środek w (320, 180), szerokość 400 px i wysokość 32 px. Bez collidera nie blokuje ruchu.
  - Zmiana skali dekoracji nie przesuwa jej środka ani obiektu Player.
  - Tło nadal składa się z jednego obiektu z komponentem TileMap.

## Lekcja 9 — g2d.waves „Fale, konfiguracja i powtarzalny spawn"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 509)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Spawn według harmonogramu | Spawner odmierza czas symulacji. Zaplanowane momenty tworzenia jednostek nie zależą od liczby klatek. Duża delta może obejmować kilka momentów. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Dane fali i powtarzalność | Konfiguracja opisuje jednostki i momenty spawnu. Seed pozwala odtworzyć losowanie w tym samym scenariuszu.<br><br>nota: Te same dane wejściowe pomagają porównać Java i JS.<br>scenka: Plan fali: seed: 42
2 jednostki
spawn: 1 s i 2 s / Powtórzenie tego planu: ten sam seed + te same dane
→ te same losowania [Łatwiej odtworzyć błąd] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (waves:1) |
| 3 | Limit żywych jednostek | Liczba utworzonych wrogów i liczba żywych to różne wartości. Limit dotyczy aktywnych jednostek; pokonani wrogowie zwalniają miejsce. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Harmonogram i powtarzalny spawn | Spawner odmierza czas symulacji i tworzy przeciwników zgodnie z danymi fali. Seed pozwala odtworzyć losowanie. Limit żywych wrogów chroni scenę przed nieograniczonym wzrostem. Przy dużej delta mogło minąć kilka zaplanowanych momentów spawnu. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Liczba utworzonych wrogów i liczba nadal żywych to różne wartości. | src/data/gameDevTeaching.js |

### Zadania lekcji 9

**g2d.waves.guided** (guided / Z przykładem) — Trzy pojawienia w czasie
- Polecenie: Masz gotowy harmonogram [1,2,3] i WaveSpawner. Dopisz elapsed+=delta, aby czas uruchamiał kolejne spawny.
- Cel: Utworzyć WaveSpawner zamiast instrukcji w każdej klatce.
- Wyjaśnienie rozwiązania: Timer odmierza czas symulacji. Bez zwiększania elapsed momenty zapisane w harmonogramie nigdy nie nadejdą.
- Kryteria (widok ucznia):
  - W t=0.99 liczba utworzonych wrogów wynosi 0; w t=1 wynosi 1; w t=2 wynosi 2; w t=3 wynosi 3.
  - Do t=5 nadal utworzono łącznie 3, a nie jednego wroga na klatkę.
  - Każdy wróg ma Sprite, jawny collider, Health i EnemyAI o właściwej konfiguracji.
  - 10×0.1 s i 20×0.05 s odtwarzają tę samą pierwszą granicę spawnu.

**g2d.waves.modified** (modified / Samodzielnie) — Dwie fale z danych
- Polecenie: Fala 1: start = 0, interval = 1, count = 3, hp = 2, speed = 40. Fala 2: start = 5, interval = 0.5, count = 4, hp = 3, speed = 60. Pierwszy przeciwnik każdej fali pojawia się po jednym interwale od jej startu.
- Cel: Oddzielić dane konfiguracji fali od kodu tworzącego jednostki.
- Kryteria (widok ucznia):
  - Fala 1 tworzy wrogów w t = 1, 2, 3; fala 2 w t = 5.5, 6, 6.5, 7.
  - Do t = 4 utworzone są trzy jednostki pierwszej fali; do t = 7 — cztery jednostki drugiej fali.
  - Jednostki fali 1 mają HP = 2 i speed = 40, a fali 2 — HP = 3 i speed = 60; zmiana danych drugiej fali nie modyfikuje już utworzonych jednostek pierwszej.
  - Numer fali przełącza się na 2 w t = 5, jeszcze przed pierwszym pojawieniem się wroga z tej fali.

**g2d.waves.independent** (independent / Rozbudowa) — Pojawienie poza widokiem
- Polecenie: Losuj kąty ze wspólnego generatora o ziarnie seed = 42. Dla gracza w środku świata twórz przeciwników na okręgu o promieniu r = 0.5 × hypot(game.getViewportWidth(), game.getViewportHeight()) + 40. Obowiązuje limit 100 żywych przeciwników; gdy limit jest pełny, pomiń bieżący spawn zamiast odkładać go w kolejce.
- Cel: Zbudować deterministyczny spawner z limitem aktywnych jednostek.
- Kryteria (widok ucznia):
  - Dla tego samego seeda pierwsze 20 pozycji spawnu jest powtarzalne i zgodne między Javą a JS.
  - Wszystkie punkty spawnu leżą poza widocznym obszarem ekranu na zadanym promieniu (z dokładnością 1e-6).
  - Zmiana rozmiaru widoku z 320×200 na 640×360 przelicza promień, nie tworząc wrogów wewnątrz widocznej planszy.
  - Przy 100 żywych wrogach kolejny termin spawnu nie zwiększa ich liczby; po usunięciu jednego wroga następny termin może utworzyć kolejnego.
  - Restart z seed = 42 odtwarza tę samą sekwencję pozycji bez używania zegara systemowego.

## Lekcja 10 — g2d.health „Health, obrażenia i nietykalność gracza"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 510)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Trafienie odejmuje HP | Health przechowuje HP tej jednostki. damage(1) odejmuje jeden punkt: 5 → 4. Kontakt wykrywa collider; obrażenia zadaje osobny komponent. | shared/lab-game-v2/editor/lessonVisuals.js + nadpisanie w src/components/JavaLessonExplanation.jsx |
| 2 | Nietykalność odrzuca kolejny cios | Po przyjętym trafieniu odliczamy czas ochrony. Cios podczas ochrony pozostawia 4 HP. Timer należy do tej jednostki, nie do globalnego stanu gry. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Śmierć uruchamia się raz | Gdy zdrowie spadnie do zera, onDeath uruchamia reakcję. Usunięcie jednostki i utworzenie łupu to osobne decyzje. Nie przyznawaj łupu wielokrotnie.<br><br>nota: Zdrowie jednostki nie jest stanem całej rundy.<br>scenka: Ostatni cios: HP: 1 → 0 [onDeath: łup i usunięcie] / Następna aktualizacja: jednostka już martwa [Nie tworzy drugiego łupu] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (health:2) |
| teoria | Zdrowie konkretnej jednostki | Health przechowuje zdrowie jednego obiektu. damage odejmuje zdrowie, heal przywraca je bez przekraczania maksimum. Nietykalność odlicza czas po trafieniu i odrzuca kolejne obrażenia w tym okresie. onDeath uruchamia reakcję na śmierć; usunięcie obiektu i przyznanie łupu to osobne decyzje gry. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Zdrowie i czas nietykalności należą do instancji, nie do static. | src/data/gameDevTeaching.js |

### Zadania lekcji 10

**g2d.health.guided** (guided / Z przykładem) — Zdrowie z kontrolowanymi metodami
- Polecenie: Masz gotowy komponent Health i reakcje na obrażenia. Uzupełnij przypisanie currentHealth = Math.max(0, currentHealth - amount) w metodzie damage.
- Cel: Chronić zakres punktów zdrowia i wywoływać śmierć najwyżej raz.
- Wyjaśnienie rozwiązania: Odejmowanie zmniejsza punkty zdrowia, a Math.max zatrzymuje wartość na zerze. Podłączone reakcje wykrywają wtedy zejście do zera dokładnie raz.
- Kryteria (widok ucznia):
  - Obrażenia 2 zmieniają HP z 5 na 3; leczenie 10 zmienia HP z 3 na 5 (do maksimum).
  - Obrażenia 10 zmieniają HP z 5 na 0 i zgłaszają śmierć dokładnie raz; kolejne obrażenia nie zgłaszają jej ponownie.
  - Wywołania damage(0) i heal(0) niczego nie zmieniają; ujemny lub niecałkowity argument jest odrzucany bez zmiany HP.
  - Operacje na Health jednego obiektu nie zmieniają Health drugiego; zwykłe leczenie nie wskrzesza obiektu o HP równym 0.
  - Po śmierci komponent Health pozostawia właściciela w scenie — jego usunięcie lub przejście do stanu LOST należy do osobnego komponentu.

**g2d.health.modified** (modified / Samodzielnie) — 0.75 sekundy ochrony
- Polecenie: Ustaw graczowi maxHealth = 5 oraz invulnerabilityAfterHit = 0.75 s. Przyjęte trafienie uruchamia czas ochrony; trafienie odrzucone podczas ochrony nie przedłuża jej.
- Cel: Odmierzać czas nietykalności w komponencie Health konkretnej postaci.
- Kryteria (widok ucznia):
  - Trafienie o sile 1 w t = 0 zmienia zdrowie z 5 na 4 i włącza ochronę.
  - Trafienie w t = 0.5 zostaje odrzucone; trafienie w t = 0.75 zostaje przyjęte i zmniejsza zdrowie do 3.
  - Odrzucone trafienie w t = 0.5 nie przesuwa końca ochrony na t = 1.25.
  - Komponent Health przeciwnika z czasem ochrony 0 przyjmuje kolejne trafienia niezależnie od ochrony gracza.

**g2d.health.independent** (independent / Rozbudowa) — Dwa zagrożenia, jedno trafienie
- Polecenie: Dodaj dwa obiekty z komponentem ContactDamage zadającym po 1 pkt obrażeń. Obiekty PlayerA i PlayerB mają osobne komponenty Health(3) z ochroną 0.75 s. O przyjęciu obrażeń decyduje wyłącznie ich własny Health; usunięcie lub wyłączenie pokonanego obiektu wykonuje osobny odbiorca onDeath.
- Cel: Połączyć obrażenia kontaktowe z lokalnym czasem ochrony w Health.
- Kryteria (widok ucznia):
  - Dwa jednoczesne kontakty z PlayerA zabierają łącznie 1 HP, pozostawiając 2 HP.
  - Kontakt z PlayerB w tej samej chwili zabiera mu 1 HP niezależnie od aktywnej ochrony PlayerA.
  - Przy ciągłym kontakcie PlayerA przyjmuje kolejne obrażenia dopiero po upływie własnych 0.75 s ochrony.
  - Gdy zdrowie PlayerA spadnie do 0, śmierć i wyłączenie zachowania następują raz, a PlayerB działa dalej.
  - Obiekt Game nie przechowuje wspólnego pola nietykalności dla wszystkich graczy — każda instancja Health ma własny zegar ochrony.

## Lekcja 11 — g2d.weapons „Weapon, czas odnowienia i automatyczny atak"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 511)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Najpierw wybierz poprawny cel | Automatyczna broń szuka żywego celu. Bez celu nie tworzy pocisku. Przy równej odległości stosuj stałą regułę, np. ID.<br><br>nota: Wybór celu jest oddzielony od ruchu gracza.<br>scenka: Cel A: żywy: odległość 40
ID 2 [Wybrany] / Cel B: żywy: odległość 80
ID 3 [Za daleko] / Cel C: martwy: odległość 10
ID 1 [Pomijamy] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (weapons:0) |
| 2 | Cooldown na osi czasu | Odejmuj delta od czasu oczekiwania. Po strzale ustaw cooldown ponownie. Przykład odstępu 0.5 s: strzał, oczekiwanie, następny strzał. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Broń tworzy pocisk | Gdy cel istnieje i cooldown się skończył, utwórz jeden pocisk i rozpocznij nowe oczekiwanie. Pocisk odpowiada za lot i trafienie. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Odstęp między strzałami | Weapon przechowuje parametry broni i pozostały cooldown. Odejmuj delta od czasu oczekiwania, a po strzale ustaw go ponownie. Automatyczny atak najpierw wybiera żywy cel. Gdy celu nie ma, nie tworzy pocisku. Wyboru celu nie mieszaj z ruchem gracza. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Przy równej odległości wybieraj cel według stałej reguły, np. ID. | src/data/gameDevTeaching.js |

### Zadania lekcji 11

**g2d.weapons.guided** (guided / Z przykładem) — Broń uruchamiana spacją
- Polecenie: Broń tworzy już pocisk po naciśnięciu Space. Dopisz timer = cooldown po strzale, aby rozpocząć odliczanie czasu do kolejnego ataku.
- Cel: Połączyć naciśnięcie klawisza, odliczanie czasu odnowienia i wystrzelenie pocisku.
- Wyjaśnienie rozwiązania: Ustawienie timera po strzale ogranicza częstotliwość ataków. W kolejnych aktualizacjach timer zmniejsza się o delta.
- Kryteria (widok ucznia):
  - Pierwsze naciśnięcie Space tworzy jeden pocisk w pozycji gracza z owner = Player.
  - Przytrzymanie Space przez 10 aktualizacji nie tworzy kolejnych pocisków.
  - Ponowne naciśnięcie Space po 0.2 s jest blokowane przez cooldown; naciśnięcie po 0.6 s oddaje kolejny strzał.
  - Po wcześniejszym ruchu w lewo pocisk leci w lewo, a sam obiekt Player zachowuje rotation = 0.

**g2d.weapons.modified** (modified / Samodzielnie) — Autoatak
- Polecenie: Zmień Weapon na broń automatyczną: pierwszy strzał następuje po 0.5 s, a kolejne co 0.5 s, o ile w zasięgu 200 px znajduje się żywy cel. Timer odnowienia należy do instancji broni.
- Cel: Zastąpić wyzwalanie klawiszem automatycznym odliczaniem czasu.
- Kryteria (widok ucznia):
  - Przy stale obecnym celu do t = 0.49 nie pada żaden strzał, w t = 0.5 pada pierwszy, a do t = 1.5 padają łącznie trzy.
  - Gdy przez 2 s brak celu, nie powstają pociski; pojawienie się celu później wyzwala najwyżej jeden strzał naraz, bez wystrzeliwania zaległej serii.
  - Naciśnięcie ani przytrzymanie Space nie przyspiesza automatycznego ataku.
  - Dwie instancje Weapon mają niezależne timery i nie blokują się wzajemnie.

**g2d.weapons.independent** (independent / Rozbudowa) — Najbliższy poprawny cel
- Polecenie: Komponent Weapon szuka najbliższego żywego przeciwnika w obszarze kołowym o promieniu r = 200 px (uwzględniając przecięcie z colliderem celu). Porównaj kandydatów w jednym przejściu według odległości środków; w razie remisu wybierz obiekt o mniejszym identyfikatorze (id).
- Cel: Wyszukiwać najbliższy cel zgodnie z zasięgiem i regułami gry.
- Kryteria (widok ucznia):
  - Spośród wrogów w odległościach 80 px i 140 px wybierany jest ten w odległości 80 px, niezależnie od kolejności na liście.
  - Zniszczony, nieaktywny lub martwy przeciwnik oraz sojusznik są pomijani.
  - Cel z kołem o promieniu r = 10 i środkiem w odległości 210 px styka się z obszarem zapytania r = 200 px i zostaje uwzględniony; przy odległości 210.01 px jest poza zasięgiem. Gdy brak kandydata, pocisk nie powstaje.
  - Dwa cele w tej samej odległości dają ten sam, powtarzalny wybór w Javie i JS.
  - Broń jedynie nadaje pociskowi kierunek przy wystrzale; punkty zdrowia odejmuje dopiero rzeczywiste trafienie pocisku.

## Lekcja 12 — g2d.triggers „Triggery, monety i własny Wallet"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 512)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Trigger nie blokuje przejścia | Trigger wykrywa nakładanie obiektów, ale przepuszcza gracza. Przydaje się do monet, skrzynek i stref. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Nagroda zmienia stan Wallet | Komponent sprawdza, kto wszedł w kontakt, a potem przyznaje nagrodę właściwemu graczowi. Przykładowa moneta dodaje jedno złoto. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Jedna moneta, jedna nagroda | Kontakt może trwać wiele aktualizacji. Oznacz monetę jako zebraną i usuń ją, aby nie dodawać nagrody w każdej klatce.<br><br>nota: Kolejny kontakt z zużytą monetą nie daje złota.<br>scenka: Pierwszy kontakt z monetą: claimed: false → true
Wallet: 4 → 5 [+1 złota] / Następna aktualizacja: claimed = true
Wallet = 5 [Moneta usunięta; brak drugiej nagrody] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (triggers:2) |
| teoria | Kontakt bez blokowania | Trigger wykrywa nakładanie obiektów, ale nie zatrzymuje ruchu. Nadaje się do monet i skrzynek. Twój komponent reaguje w onTrigger(other): sprawdza komponent drugiego obiektu, np. Wallet, i przyznaje nagrodę. Zabezpiecz ją przed powtórzeniem; kontakt może trwać wiele aktualizacji. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Nagroda za jeden przedmiot ma zostać przyznana tylko raz. | src/data/gameDevTeaching.js |

### Zadania lekcji 12

**g2d.triggers.guided** (guided / Z przykładem) — Zbierz jedną monetę
- Polecenie: Masz gotowe komponenty Pickup i Wallet. Dopisz zwiększenie wallet.gold o wartość zebranej monety.
- Cel: Zmienić stan komponentu Wallet po wejściu w trigger monety.
- Wyjaśnienie rozwiązania: Trigger wykrywa nałożenie obiektów bez blokowania ruchu. Dodanie wartości do portfela i usunięcie monety gwarantują pojedynczą nagrodę.
- Kryteria (widok ucznia):
  - Przed kontaktem gold wynosi 0, a obiekt Coin istnieje na scenie.
  - Wejście gracza w Coin zwiększa gold do 1 i usuwa monetę po zakończeniu bieżącego kroku kolizji.
  - Kolejne kroki symulacji ani ponowne wywołanie zbierania nie zwiększają gold ponad 1.
  - Moneta jest triggerem i nie zatrzymuje ruchu gracza.

**g2d.triggers.modified** (modified / Samodzielnie) — Różne wartości przedmiotów
- Polecenie: Utwórz monety CoinA o wartości 5 i CoinB o wartości 10. Komponent Pickup przyznaje złoto tylko obiektowi posiadającemu Wallet — przeciwnik nie ma Wallet, więc nie zbiera monet.
- Cel: Konfigurować wartość w instancjach i sprawdzać obecność komponentu odbiorcy.
- Kryteria (widok ucznia):
  - Kontakt przeciwnika (Enemy) z CoinA nie usuwa monety i nie zmienia stanu Wallet gracza.
  - Zebranie najpierw CoinB, a potem CoinA daje kolejno gold = 10 oraz gold = 15.
  - Zmiana wartości CoinA na 7 daje w tej samej kolejności gold = 17 bez zmian w kodzie klasy Pickup.
  - Jednoczesne wejście w oba triggery dodaje obie wartości dokładnie raz.

**g2d.triggers.independent** (independent / Rozbudowa) — Skrzynia otwiera się raz
- Polecenie: Napisz komponent Chest: pierwsze wejście gracza dodaje 20 złota i ustawia opened = true. Skrzynia nie znika ze sceny — pozostaje widoczna jako otwarta.
- Cel: Zachować obiekt na scenie i zablokować powtórne odebranie nagrody flagą stanu.
- Kryteria (widok ucznia):
  - Przed kontaktem opened = false i gold = 0; po wejściu gracza opened = true i gold = 20.
  - Wyjście i ponowne wejście w skrzynię oraz kolejne kroki symulacji pozostawiają gold = 20.
  - Kontakt przeciwnika nie otwiera skrzyni — gracz nadal może odebrać z niej 20 złota.
  - Dwie osobne skrzynie mają własne pola opened i łącznie dają 40 złota.

## Lekcja 13 — g2d.loot-xp „Śmierć przeciwnika, łup i doświadczenie"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 513)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Od śmierci do zebrania | Jednokrotny sygnał śmierci tworzy łup w miejscu przeciwnika. Zebranie przekazuje wartość do Experience gracza.<br><br>nota: Po zebraniu orb znika.<br>scenka: Pokonany wróg: HP = 0
orb: 2 XP [Łup zostaje w miejscu wroga] / Gracz zbiera orb: Experience: 1 → 3 XP [Orb znika] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (loot-xp:0) |
| 2 | Nadwyżka XP pozostaje | Przykład: próg 5 XP, zapas 4 XP, nagroda 2 XP. Po awansie odejmujemy próg: 4+2−5=1 XP na kolejnym poziomie. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Duża nagroda może dać kilka awansów | Sprawdzaj próg w pętli. Dopóki XP wystarcza, odejmij aktualny próg i zwiększ poziom. Nie zeruj całego zapasu po pierwszym awansie.<br><br>nota: Pętla kończy się, gdy XP jest mniejsze od kolejnego progu.<br>scenka: Nagroda +12 XP: XP: 0 → 12
próg: 5 / Awans pierwszy: 12 − 5 = 7 XP
nowy próg: 6 [+1 poziom] / Awans drugi: 7 − 6 = 1 XP
nowy próg: 7 [1 < 7: koniec pętli] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (loot-xp:2) |
| teoria | Od łupu do awansu | Reakcja na śmierć tworzy łup w miejscu pokonanego przeciwnika. Zbieranie przekazuje jego wartość do Experience gracza. Awans odejmuje próg od zgromadzonego XP, a nie zeruje cały zapas. Duża nagroda może dać kilka poziomów, więc sprawdzaj próg w pętli. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Nadwyżka doświadczenia przechodzi na kolejny poziom. | src/data/gameDevTeaching.js |

### Zadania lekcji 13

**g2d.loot-xp.guided** (guided / Z przykładem) — Przeciwnik zostawia łup
- Polecenie: Masz gotową reakcję na śmierć wroga i tworzony obiekt orba. Dodaj obiektowi orba komponent XpOrb(1), aby przechowywał wartość nagrody.
- Cel: Utworzyć łup z wartością XP dokładnie raz po śmierci przeciwnika.
- Wyjaśnienie rozwiązania: Sam wygląd orba nie przechowuje jego wartości. Komponent XpOrb zapisuje liczbę punktów doświadczenia, którą później zbierze gracz.
- Kryteria (widok ucznia):
  - Po śmierci Enemy w (220, 120) powstaje jeden obiekt z komponentem XpOrb w (220, 120), a licznik kills wynosi 1.
  - Powtórne obrażenia ani kontakt kilku pocisków w tej samej klatce nie tworzą dodatkowych orbów.
  - Po śmierci Enemy nie jest już celem broni i nie zadaje obrażeń kontaktowych.
  - Śmierć kolejnego przeciwnika tworzy drugi osobny orb i zwiększa kills do 2.

**g2d.loot-xp.modified** (modified / Samodzielnie) — Zbieranie doświadczenia
- Polecenie: Dodaj graczowi komponent Experience oraz obsługę zbierania XpOrb. W tym zadaniu doświadczenie tylko się sumuje; progi awansu dopiszesz w kolejnym zadaniu. Orb A ma value = 3, a Orb B ma value = 4.
- Cel: Oddzielić punkty doświadczenia (Experience) od złota w portfelu (Wallet).
- Kryteria (widok ucznia):
  - Zebranie orbów A i B daje łącznie Experience.xp = 7 i usuwa oba orby ze sceny.
  - Wallet.gold pozostaje bez zmian; zebranie monety zwiększa gold, ale nie zmienia xp.
  - Kontakt przeciwnika z orbem nie powoduje jego zebrania.
  - Ponowne przetworzenie kontaktu z tym samym orbem nie dodaje punktów doświadczenia po raz drugi.

**g2d.loot-xp.independent** (independent / Rozbudowa) — Dwa awanse z jednego łupu
- Polecenie: Komponent Experience startuje z level = 1, xp = 0 oraz pendingChoices = 0. Próg kolejnego poziomu wynosi 5 × bieżący level. Jedno dodanie XP może przekroczyć kilka progów naraz.
- Cel: Obliczać kolejne awanse w pętli i zachowywać nadwyżkę XP.
- Kryteria (widok ucznia):
  - Dodanie 4 XP daje level = 1, xp = 4, pendingChoices = 0; dodanie kolejnego 1 XP daje level = 2, xp = 0, pendingChoices = 1.
  - Dodanie 16 XP od stanu początkowego daje level = 3, xp = 1, pendingChoices = 2 (zużywa progi 5 oraz 10).
  - Wywołanie z wartością XP <= 0 nie zmienia stanu komponentu.
  - Dwa osobne dodania po 8 XP dają taki sam stan końcowy jak jedno dodanie 16 XP.
  - Liczba oczekujących wyborów (pendingChoices) nie zeruje się sama w kolejnej aktualizacji ani przy zdobyciu następnego XP.

## Lekcja 14 — g2d.enemy-tactics „AI: wykrywanie, flankowanie i ucieczka"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 514)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Wróg widzi gracza w zasięgu | Porównaj odległość z detectionRange. Poza zasięgiem wróg stoi; po wejściu gracza w zasięg rozpoczyna pościg. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Podejście z boku | Dodaj do celu przesunięcie prostopadłe do kierunku pościgu. Ten sam kontroler realizuje ruch w kierunku nowego punktu. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Ucieczka | Odwróć kierunek do gracza i sprawdź dystans. Po osiągnięciu bezpiecznej odległości przestań przekazywać ruch. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Reguła AI wybiera kierunek | Zasięg określa, kiedy wróg zaczyna pościg. Kierunek prostopadły (-dy, dx) pozwala podejść z boku; normalizacja utrzymuje długość wektora. Ten sam kontroler wykonuje pogoń, flankowanie i ucieczkę. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Przy zerowej odległości nie dziel przez zero. | src/data/gameDevTeaching.js |

### Zadania lekcji 14

**g2d.enemy-tactics.guided** (guided / Z przykładem) — Zasięg wykrywania
- Polecenie: Pościg już działa. Dodaj warunek: jeśli Math.hypot(dx,dy)>150, wróć bez ruchu.
- Cel: Ograniczyć pościg zasięgiem wykrywania.
- Wyjaśnienie rozwiązania: Odległość decyduje, czy wróg widzi cel. Poza zasięgiem brak move zatrzymuje go; w zasięgu używa gotowego pościgu.
- Kryteria (widok ucznia):
  - Po sekundzie poza zasięgiem Slime pozostaje na x=100.
  - Po przesunięciu gracza do (200,100), sekunda pościgu przesuwa Slime do x=160.

**g2d.enemy-tactics.modified** (modified / Samodzielnie) — Podejście z boku
- Polecenie: Samodzielnie skieruj Slime do punktu 80 px obok gracza, w kierunku prostopadłym do kierunku pościgu. Gotowy kontroler realizuje ruch.
- Cel: Użyć prostopadłego przesunięcia celu do flankowania.
- Kryteria (widok ucznia):
  - Cel ruchu uwzględnia prostopadłe przesunięcie 80 px.
  - Slime i Bat zachowują niezależne prędkości 40 i 80.

**g2d.enemy-tactics.independent** (independent / Rozbudowa) — Ucieczka w zasięgu
- Polecenie: Napisz FleeAI: w zasięgu 120 uciekaj od gracza; poza zasięgiem zatrzymaj ruch.
- Cel: Zaprogramować ucieczkę z warunkiem zasięgu.
- Kryteria (widok ucznia):
  - Slime w (240,100) oddala się od gracza w (300,100).
  - Po sekundzie Slime ma x=180; poza zasięgiem 120 stoi.

## Lekcja 15 — g2d.camera „Kamera i przestrzenie współrzędnych"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 515)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Świat i ekran | Kamera wybiera fragment świata. Obiekt pozostaje w (80,180). Gdy początek widoku przesuniemy z (0,0) do (60,150), ekranowa pozycja zmieni się z (80,180) na (20,30). | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Śledzenie gracza i stały HUD | follow(player) przesuwa widok za graczem. Gdy gracz idzie 60 jednostek w prawo, kamera także przesuwa początek widoku o 60. Gracz pozostaje na ekranie w (85,82), a tło się przesuwa. HUD używa współrzędnych ekranu. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Kliknięcie ekranu na mapie świata | screenToWorld odwraca przeliczenie. Ekran (20,30) + początek widoku (60,150) daje świat (80,180). Sprawdź null przed użyciem pozycji kursora. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Świat i ekran to różne współrzędne | Pozycja świata należy do obiektu. Kamera określa widoczny fragment świata. Gdy początek widoku to (60,150), punkt świata (80,180) pojawia się na ekranie w (20,30). screenToWorld wykonuje odwrotne przeliczenie. Nie przesuwaj obiektów ani colliderów tylko po to, aby przesunąć widok.<br><br>kod: Camera2D camera = getGame().find("Camera") ⏎     .getComponent(Camera2D.class); ⏎ Vector2 pointer = getGame().input.getPointerPosition(); ⏎ // pointer może być null przed pierwszym ruchem myszy. | src/data/gameDevTeaching.js |
| teoria 2 | Wskaźnik i przyciski myszy | (pointerTheory — pełny tekst w pliku) | src/data/lessons/gameDevCourse.js |
| wskazówka | Zapamiętaj | Ekran (20,30) + początek widoku (60,150) = świat (80,180). | src/data/gameDevTeaching.js |

### Zadania lekcji 15

**g2d.camera.guided** (guided / Z przykładem) — Przesunięty widok
- Polecenie: Masz gotową kamerę i obiekty. Ustaw camera.getComponent(Camera2D).offsetX na 80; offsetY=40 jest już ustawione.
- Cel: Obliczyć wynik przesunięcia kamery.
- Wyjaśnienie rozwiązania: Przesunięcie widoku zmienia miejsce rysowania, a nie pozycje obiektów i colliderów w świecie.
- Kryteria (widok ucznia):
  - Player ma transform=(100,100), a środek renderu ekranowego=(20,60).
  - Punkt świata (80,40) jest widoczny w lewym górnym rogu (0,0).
  - Dodanie i przesunięcie kamery nie zmienia współrzędnych colliderów ani wyników kontaktu.

**g2d.camera.modified** (modified / Samodzielnie) — Kamera śledzi gracza
- Polecenie: Wywołaj Game.setWorldBounds(0, 0, 2000, 1200), ustaw pozycję Player na (400, 300) oraz włącz Camera2D.follow(player). Poruszaj graczem po świecie większym niż ekran.
- Cel: Oddzielić granice świata od rozmiaru widoku kamery.
- Kryteria (widok ucznia):
  - Przy widoku 320×200 gracz jest rysowany na środku ekranu w (160, 100), podczas gdy jego pozycja w świecie się zmienia.
  - Przy widoku 500×300 środek gracza na ekranie wypada w (250, 150).
  - Po przejściu gracza poza x = 640 kamera nadal podąża za nim, nie zatrzymując się na szerokości pojedynczego ekranu.
  - Zmiana rozmiaru widoku nie zmienia prędkości ruchu postaci w świecie.

**g2d.camera.independent** (independent / Rozbudowa) — Wskaż punkt świata
- Polecenie: Napisz komponent CursorMarker: pobierz game.input.getPointerPosition(), sprawdź czy wynik nie jest null przed pierwszym ruchem myszy, przelicz punkt metodą Camera2D.screenToWorld i ustaw tam znacznik świata. Kamera ma początek widoku origin = (60, 150).
- Cel: Przeliczyć współrzędne kursora z ekranu na współrzędne świata.
- Kryteria (widok ucznia):
  - Wskaźnik w punkcie ekranu (220, 100) ustawia znacznik w punkcie świata (280, 250).
  - Po zmianie początku widoku (origin) na (100, 200) ten sam punkt ekranu daje w świecie (320, 300).
  - Przeliczenie z powrotem ze świata na ekran zwraca pierwotny punkt (220, 100) z dokładnością 1e-6.
  - Znacznik nie przesuwa kamery ani gracza.

## Lekcja 16 — g2d.canvas-ui „Canvas, ręczne rysowanie i HUD"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 516)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Świat i interfejs | Obiekty gry należą do świata. UITransform umieszcza HUD względem ekranu. Kamera nie powinna zabierać napisu HP poza widok. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Jawne rozmiary figur | GameCanvas pozwala wysyłać własne polecenia rysowania. Pozycja prostokąta w tym API oznacza jego środek; szerokość i wysokość podajemy osobno. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Pasek pokazuje proporcję | ProgressBar zamienia wartość procentową na długość wypełnienia. setProgress(50) daje połowę paska. Używaj tej samej skali w danych i w UI. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | HUD pozostaje na ekranie | Renderery rysują obiekty za Ciebie. GameCanvas pozwala wysyłać własne polecenia rysowania, np. pasek zależny od zdrowia. Pozycja prostokąta oznacza jego środek. UITransform umieszcza HUD względem ekranu, więc przesunięcie kamery nie zabiera napisu poza widok. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Rozdziel współrzędne świata gry i interfejsu. | src/data/gameDevTeaching.js |

### Zadania lekcji 16

**g2d.canvas-ui.guided** (guided / Z przykładem) — HUD w rogu ekranu
- Polecenie: Gotowy obiekt HUD ma tekst i komponent UITransform. Ustaw jego punkt zaczepienia (anchor) na TOP_LEFT, aby pozycja (12, 12) oznaczała odsunięcie od lewego górnego rogu ekranu.
- Cel: Umieścić element interfejsu względem narożnika ekranu.
- Wyjaśnienie rozwiązania: Punkt zaczepienia (anchor) wskazuje narożnik odniesienia na ekranie. Dzięki temu HUD pozostaje na miejscu podczas ruchu kamery i zmiany rozmiaru planszy.
- Kryteria (widok ucznia):
  - Prostokąt elementu UI ma lewy górny róg w (12, 12) i środek w (112, 21).
  - Środek tekstu wypada w (112, 21), z wyrównaniem align = center oraz baseline = middle.
  - Przesunięcie kamery ani zmiana rozmiaru widoku nie zmieniają odstępu HUD od lewego górnego rogu.
  - Zmiana Wallet.gold na 5 aktualizuje napis na „Złoto: 5” bez tworzenia nowego obiektu HUD.

**g2d.canvas-ui.modified** (modified / Samodzielnie) — Ten sam prostokąt w Canvas
- Polecenie: W metodzie onDrawUI narysuj prostokąt Canvas.drawRect o środku (80, 90), wymiarach 40×30 i kolorze #76b9f2. Napis „Start” umieść wyśrodkowany (center/middle) w punkcie (80, 140).
- Cel: Rysować elementy interfejsu bezpośrednio na Canvasie bez tworzenia obiektów fizycznych.
- Kryteria (widok ucznia):
  - Prostokąt ma pozycję (80, 90), szerokość 40 px i wysokość 30 px. Tekst jest wyśrodkowany w (80, 140).
  - Rysunek pojawia się w każdej klatce, także wtedy, gdy żaden klawisz nie jest wciśnięty.
  - Wywołania rysowania nie tworzą obiektu GameObject, collidera ani dodatkowego komponentu.
  - Ruch kamery nie przesuwa rysowanego HUD, a ustawienia stylu nie wpływają na kolejne polecenia rysowania.

**g2d.canvas-ui.independent** (independent / Rozbudowa) — Pasek z nieruchomym lewym brzegiem
- Polecenie: Narysuj pasek o maksymalnej szerokości 200 px, wysokości 12 px, lewym brzegu x = 20 i środku pionowym yCenter = 40. Dla current = 3 i max = 5 szerokość wypełnienia ma wynosić 120 px. Tekst pod paskiem wyrównaj jawnie do lewej krawędzi.
- Cel: Obliczać szerokość i środek paska postępu przy nieruchomej lewej krawędzi.
- Kryteria (widok ucznia):
  - Dla wartości 3 z 5 szerokość wynosi 120 px, środek (80, 40), a lewy brzeg x = 20.
  - Dla 0 z 5 pasek ma szerokość 0 px; dla 5 z 5 szerokość wynosi 200 px, a środek (120, 40).
  - Pasek o szerokości 200 px pokazuje od 0% do 100%: ujemna wartość daje pusty pasek, a wartość ponad maksimum daje pełny pasek. Maksimum równe 0 nie powoduje błędu.
  - Tekst pod paskiem zaczyna się w x = 20 dzięki wyrównaniu align = left; ruch kamery nie zmienia pozycji HUD.

## Lekcja 17 — g2d.ui-flow „Pauza i działające menu"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 517)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Naciśnij, a potem zwolnij | Przycisk uzbraja się po naciśnięciu i uruchamia akcję przy poprawnym zwolnieniu. Sama obecność kursora nad przyciskiem nie jest kliknięciem. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Focus wskazuje jedną opcję | Klawiatura potrzebuje jednego aktywnego wyboru. Focus powinien być widoczny, a obsłużone wejście zużyte przez UI. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Paski i rozciągane przyciski | ProgressBar rozdziela ramkę i wypełnienie. 9patch zachowuje narożniki przy rozciąganiu przycisku. Sprawdź układ po zmianie rozmiaru planszy. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Naciśnięcie, zwolnienie i focus | UI składa się z obiektów i komponentów przycisków, tekstu oraz pasków. Przycisk uzbraja się przy naciśnięciu, a zatwierdza przy zwolnieniu zgodnie z regułami interakcji. Focus wskazuje opcję dla klawiatury. UI zużywa obsłużone wejście, aby kliknięcie menu nie wywoływało również strzału. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Sprawdź mysz, klawiaturę i układ po zmianie rozmiaru planszy. | src/data/gameDevTeaching.js |

### Zadania lekcji 17

**g2d.ui-flow.guided** (guided / Z przykładem) — Przyciski wyboru
- Polecenie: Menu i wybór ulepszenia są gotowe. W MenuView dopisz ustawienie object.active=open dla przycisków, aby zamykały się razem z panelem.
- Cel: Podłączyć Button do już napisanej reguły ulepszenia.
- Wyjaśnienie rozwiązania: Stan otwarcia menu steruje widocznością i aktywnością przycisków. Zamknięte menu nie może nadal odbierać wejścia.
- Kryteria (widok ucznia):
  - Kliknięcie środka przycisku Obrażenia przyznaje dokładnie jeden efekt wyboru 2.
  - Klawisz 2 daje ten sam wynik co przycisk.
  - Podczas wyboru świat pozostaje zatrzymany do zakończenia menu.
  - Kliknięcie UI jest zużyte; nie uruchamia równocześnie strzału lub akcji świata.
  - Przy zamkniętym panelu jego przyciski nie przyjmują kliknięć.

**g2d.ui-flow.modified** (modified / Samodzielnie) — Paski zdrowia i XP
- Polecenie: Dodaj paski ProgressBar dla zdrowia i XP oraz tekst poziomu. Obiekt HUD zakotwicz w TOP_LEFT z przesunięciem (12, 12), a panel wyboru w CENTER o szerokości min(360, game.getViewportWidth() - 32). Komponent HudView odczytuje HP i XP w metodzie onLateUpdate (po kolizjach, przed rysowaniem).
- Cel: Wyświetlać aktualny stan komponentów na zakotwiczonym interfejsie.
- Kryteria (widok ucznia):
  - Dla HP = 3/5 wypełnienie paska wynosi 0.6; dla XP = 4 przy progu 10 wypełnienie wynosi 0.4.
  - Wartości mniejsze od zera i większe od maksimum są ograniczane do zakresu paska; maksimum równe 0 nie powoduje błędu.
  - Przy widoku 320×200 panel ma szerokość 288 px, mieści się na ekranie i jest wyśrodkowany.
  - Przy widoku 640×360 panel ma szerokość 360 px, a HUD zachowuje odstęp 12 px od lewego górnego rogu.
  - Przesunięcie kamery nie zmienia pozycji elementów UI ani ich obszarów kliknięcia.

**g2d.ui-flow.independent** (independent / Rozbudowa) — Menu obsługiwane klawiaturą
- Polecenie: Po otwarciu menu wywołaj Button.focus() na pierwszym przycisku. Klawisz Tab przechodzi kolejno po trzech przyciskach, Shift+Tab cofa wybór, a puszczenie klawisza Enter aktywuje zaznaczony przycisk. Metoda isFocused() wyróżnia aktywny przycisk; zachowaj też skróty 1/2/3. Zamknięcie menu wyłącza przyciski i zwalnia fokus.
- Cel: Zbudować pełną obsługę menu z klawiatury i myszy.
- Kryteria (widok ucznia):
  - Po otwarciu menu fokus znajduje się na pierwszym przycisku; kolejne naciśnięcia Tab przechodzą na drugi, trzeci i z powrotem na pierwszy.
  - Shift+Tab na pierwszym przycisku przenosi fokus na trzeci; puszczenie Enter wybiera aktualnie zaznaczony przycisk.
  - Przytrzymanie Enter nie wybiera kolejnych ulepszeń — każdy wybór wymaga nowego naciśnięcia.
  - Wciśnięcie przycisku myszy nad przyciskiem UI i puszczenie poza nim nie uruchamia ulepszenia.
  - Po zamknięciu menu fokus nie przechwytuje klawiszy sterowania grą, a po ponownym otwarciu wraca na pierwszy przycisk.

## Lekcja 18 — g2d.upgrades „Wybór ulepszenia i własne reguły zakupów"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 518)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Awans otwiera wybór | Awans tworzy oczekującą nagrodę i zatrzymuje świat. Uczeń wybiera jedną opcję, która zmienia konkretny komponent.<br><br>nota: Zatwierdzenie zużywa jeden oczekujący wybór.<br>scenka: Awans bohatera: 1 oczekujący wybór
świat zatrzymany [Wybierz: szybkość ALBO siła] / Wybrano szybkość: prędkość: 120 → 150
0 oczekujących wyborów [Wracamy do walki] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (upgrades:0) |
| 2 | Parametr przed i po wyborze | Przykładowe ulepszenie dodaje 30 px/s. Prędkość zmienia się z 120 na 150 px/s. Zmień stan właściwej instancji kontrolera. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Zakup jest warunkowy | Najpierw sprawdź Wallet. Przy udanym zakupie odejmij cenę i zmień statystykę. Brak pieniędzy pozostawia zarówno złoto, jak i statystykę bez zmian.<br><br>nota: Nie odejmuj pieniędzy za nieudany zakup.<br>scenka: Mam 8 złota; cena 5: Wallet: 8 → 3
obrażenia: 1 → 2 [Kupiono] / Mam 3 złota; cena 5: Wallet: 3 → 3
obrażenia: 1 → 1 [Nie kupiono — nic nie zmieniaj] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (upgrades:2) |
| teoria | Jeden wybór, jedna zmiana | Awans tworzy oczekujący wybór i zatrzymuje świat. Opcja zmienia parametr konkretnego komponentu, np. prędkość PlayerController albo obrażenia Weapon. Zatwierdzenie zmniejsza liczbę oczekujących wyborów. Zakup dodatkowo sprawdza Wallet i odejmuje cenę tylko przy udanej transakcji. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Brak pieniędzy nie może zmieniać statystyk. | src/data/gameDevTeaching.js |

### Zadania lekcji 18

**g2d.upgrades.guided** (guided / Z przykładem) — Awans daje wybór
- Polecenie: Menu wyboru ulepszenia i pauza są gotowe. Dopisz speed.speed += 30 w metodzie apply dla ulepszenia szybkości.
- Cel: Zastosować jedno oczekujące ulepszenie (pendingChoice) i wznowić grę.
- Wyjaśnienie rozwiązania: Modyfikujemy pole istniejącego komponentu PlayerController na graczu — nie tworzymy nowego kontrolera ani nowego obiektu gracza.
- Kryteria (widok ucznia):
  - Gdy speed = 120 i pendingChoices = 1, menu się otwiera, a świat gry zostaje zatrzymany.
  - Naciśnięcie klawisza 1 zwiększa speed do 150, zmniejsza pendingChoices do 0, zamyka menu i zwalnia pauzę ulepszenia.
  - Przytrzymanie klawisza 1 przez kolejne aktualizacje nie dodaje następnych 30 do prędkości.
  - Przy pendingChoices = 2 pierwszy wybór zostawia otwarte menu z pendingChoices = 1; dopiero drugie naciśnięcie wykorzystuje drugi wybór.

**g2d.upgrades.modified** (modified / Samodzielnie) — Trzy ulepszenia
- Polecenie: Dodaj opcję 2 (zwiększenie Weapon.damage o 1) oraz opcję 3 (mnożenie cooldown przez 0.8, nie mniej niż 0.1 s). Każda z trzech opcji zużywa jeden punkt pendingChoices.
- Cel: Modyfikować parametry broni gracza przez wybór ulepszenia.
- Kryteria (widok ucznia):
  - Opcja 2 zwiększa damage z 1 do 2; kolejny wystrzelony pocisk zadaje 2 pkt obrażeń przy trafieniu.
  - Pocisk wystrzelony przed wyborem ulepszenia zachowuje swoje wcześniejsze obrażenia (damage = 1).
  - Opcja 3 zmniejsza cooldown z 0.5 do 0.4 s; wielokrotne ulepszanie nigdy nie obniża go poniżej 0.1 s.
  - Inny klawisz lub próba wyboru przy zamkniętym menu nie zmieniają parametrów ani pendingChoices.
  - W jednej aktualizacji można wykorzystać najwyżej jeden wybór, nawet przy jednoczesnym naciśnięciu klawiszy 1 i 2.

**g2d.upgrades.independent** (independent / Rozbudowa) — Sklep za złoto
- Polecenie: Dodaj tryb sklepu: zakup ulepszenia +1 do obrażeń kosztuje 20 złota. Sklep i awans korzystają z tej samej metody ulepszenia, ale awans jest darmowy i zużywa pendingChoices, natomiast sklep pobiera złoto z Wallet.
- Cel: Współdzielić logikę ulepszenia między darmowym awansem a zakupem za złoto.
- Kryteria (widok ucznia):
  - Gdy gold = 19, próba zakupu nie zmienia damage ani gold, a sklep pozostaje otwarty z informacją o braku złota.
  - Gdy gold = 20, zakup zmniejsza gold do 0, zwiększa damage o 1 dokładnie raz i zamyka sklep.
  - Darmowy wybór z awansu działa także przy gold = 0 i nie obniża złota poniżej zera.
  - Zakup w sklepie nie zmniejsza pendingChoices, a darmowy awans nie odejmuje złota.
  - Przytrzymanie przycisku zakupu ani podwójne zdarzenie kliknięcia nie wykonują transakcji wielokrotnie.

## Lekcja 19 — g2d.feedback „Efekty trafienia, tweeny i unoszący się tekst"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 519)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Liczba obrażeń nad celem | Trafienie tworzy osobny obiekt tekstu. Tween przesuwa go w górę, a po zakończeniu efektu usuwasz ten obiekt. Efekt wizualny nie zmienia collidera przeciwnika. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Shake ma początek i koniec | Krótki wstrząs kamery daje informację o trafieniu. Po czasie efekt wraca do spokoju. Wybierz świadomie domenę czasu podczas pauzy. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Nowy efekt tej samej właściwości | Określ, czy nowy tween zastępuje poprzedni. Dwa efekty zapisujące tę samą właściwość bez reguły mogą wzajemnie nadpisywać wynik.<br><br>nota: Wygląd i fizyka pozostają oddzielnymi odpowiedzialnościami.<br>scenka: Trwa efekt A: x: 0 → 100
obecnie x=25 / Nowy efekt B zastępuje A: x: 25 → 200
tylko B zapisuje pozycję [Jedna właściwość, jeden aktywny efekt] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (feedback:2) |
| teoria | Animacja wyglądu nie zmienia fizyki | Tween płynnie zmienia właściwość od wartości początkowej do końcowej w podanym czasie. Shake daje krótki wstrząs; przezroczystość pozwala uzyskać zanikanie. Efekt wizualny powinien pozostawić fizykę zgodną z regułami gry. Nowy efekt tej samej właściwości wymaga określonej reguły zastępowania. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Wybierz świadomie, czy efekt zatrzymuje się podczas pauzy. | src/data/gameDevTeaching.js |

### Zadania lekcji 19

**g2d.feedback.guided** (guided / Z przykładem) — Płynny ruch dekoracji
- Polecenie: Moneta jest gotowa w (160, 160). Dodaj wywołanie Tweens.position(coin, 160, 100, 1), aby w ciągu sekundy przesunęła się płynnie o 60 px w górę.
- Cel: Zastosować liniową interpolację pozycji w czasie (tween).
- Wyjaśnienie rozwiązania: Tween płynnie przelicza pozycję w czasie. W połowie sekundy moneta jest na y = 130, a po pełnej sekundzie dociera do y = 100.
- Kryteria (widok ucznia):
  - W chwili t = 0.5 pozycja obiektu Coin wynosi (160, 130); w t = 1 wynosi (160, 100).
  - Po t = 1.5 pozycja pozostaje równa (160, 100).
  - Rozmiar i skala obiektu Coin nie zmieniają się.
  - Dla tego samego czasu pozycje w Javie i JS są identyczne.

**g2d.feedback.modified** (modified / Samodzielnie) — Wstrząs bez zmiany kolizji
- Polecenie: Komponent HitFeedback reaguje wyłącznie na przyjęte obrażenia w Health: uruchamia wstrząs grafiki o sile 8 przez 0.3 s oraz lekki wstrząs kamery Camera2D, bez przesuwania fizycznego Transform gracza. Po trafieniu utwórz też napis „−1”, który unosi się o 40 px w 0.5 s i znika.
- Cel: Dodać wizualną informację o trafieniu bez naruszania pozycji fizycznej.
- Kryteria (widok ucznia):
  - Podczas trwania efektu współrzędne świata i collider gracza pozostają takie same jak bez efektu.
  - Podczas wstrząsu sama grafika przesuwa się na każdej osi o wartość od −8 do 8 px względem swojej zwykłej pozycji. W trakcie efektu widać drganie, nie tylko nieruchomy obraz.
  - Po 0.3 s przesunięcie wizualne wraca do 0 i nie odkłada trwałego błędu pozycji.
  - Trafienie odrzucone przez czas nietykalności nie uruchamia efektu ponownie.
  - Elementy HUD nie drgają razem z kamerą, a wykrywanie kolizji działa bez zmian.
  - Tylko przyjęte obrażenia tworzą obiekt DamageText.
  - Po zakończeniu animacji (tweena) obiekt DamageText zostaje usunięty.

**g2d.feedback.independent** (independent / Rozbudowa) — Zastąpienie tweena i dwa zegary
- Polecenie: Animuj współrzędną x od 0 do 100 przez 1 s. W chwili t = 0.25 zastąp ten tween nowym — do wartości 200 w 0.5 s. Dodaj natychmiastową zmianę skali (duration = 0) oraz pulsowanie przycisku UI działające podczas pauzy świata.
- Cel: Zastępować aktywny tween tej samej właściwości i rozróżniać zegar świata od zegara UI.
- Kryteria (widok ucznia):
  - W chwili t = 0.25 współrzędna x wynosi 25; nowy tween startuje od 25 i w t = 0.5 osiąga x = 112.5.
  - W chwili t = 0.75 współrzędna x wynosi 200 i po t = 1.25 pozostaje równa 200, bez cofania do dawnego celu 100.
  - Tween skali do (2, 2) z czasem duration = 0 ustawia docelową skalę natychmiast.
  - Podczas pauzy świata tween obiektu w świecie stoi w miejscu, natomiast tween przycisku UI nadal postępuje.
  - Zniszczenie animowanego obiektu usuwa jego aktywne tweeny i nie modyfikuje już usuniętego Transform.
  - Włączenie lub wyłączenie losowego wstrząsu nie zmienia kolejności ani pozycji spawnowanych wrogów, ponieważ efekty wizualne korzystają z osobnego generatora liczb losowych.

## Lekcja 20 — g2d.projectile-types „Pociski naprowadzane i przebijające"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 520)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Pocisk naprowadzany | W każdej aktualizacji wyznacz kierunek do celu i normalizuj go. Projectile2D wykonuje lot, a osobny komponent wybiera kierunek. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Przebicie | maxHits=2 pozwala dotknąć dwóch celów. Pamięć trafionych obiektów nie pozwala wielokrotnie trafić tego samego wroga. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Sweep przy dużej prędkości | Sprawdzaj cały odcinek lotu pocisku. Dzięki temu szybki pocisk trafia cel między pozycją poprzednią a następną. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Lot i trafienie są osobnymi zachowaniami | Homing aktualizuje kierunek Projectile2D do celu. maxHits określa limit trafień; silnik pamięta trafione obiekty. Sweep bada cały odcinek ruchu, dlatego szybki pocisk nie przeskakuje przez cel. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Zmiana typu pocisku nie wymaga kopiowania całej broni. | src/data/gameDevTeaching.js |

### Zadania lekcji 20

**g2d.projectile-types.guided** (guided / Z przykładem) — Pocisk naprowadzany
- Polecenie: Kierunek do celu i Projectile2D są gotowe. W Homing zapisz obliczony d jako direction pocisku; w Javie użyj direction.set(d.x,d.y).
- Cel: Naprowadzać pocisk na cel podczas lotu.
- Wyjaśnienie rozwiązania: Homing aktualizuje cel lotu, a Projectile2D wykonuje ruch i sweep. Aktualizacja wektora pozwala pociskowi zmieniać kierunek podczas lotu.
- Kryteria (widok ucznia):
  - Homing aktualizuje direction pocisku do celu; Projectile2D wykonuje ruch i wykrywa kontakt na całym odcinku.
  - Pocisk ignoruje właściciela i trafia tylko wroga; znika po trafieniu albo po końcu życia.
  - Zmiana kierunku w Homing kieruje pocisk do Enemy; po sekundzie HP celu wynosi 2.

**g2d.projectile-types.modified** (modified / Samodzielnie) — Dwa trafienia
- Polecenie: Ustaw maxHits=2 i dopisz HitCount: każdy trafiony przeciwnik otrzymuje jedno obrażenie; pocisk trafia obu przeciwników i znika.
- Cel: Pozwolić pociskowi trafić więcej niż jeden cel.
- Kryteria (widok ucznia):
  - maxHits=2 pozwala jednemu pociskowi trafić dwóch różnych przeciwników.
  - HitCount usuwa pocisk po drugim trafieniu, zanim skończy się jego czas życia.
  - Enemy i EnemyB tracą po 1 HP; ten sam cel nie otrzymuje powtórnych obrażeń.

**g2d.projectile-types.independent** (independent / Rozbudowa) — Szybki pocisk i pierwszy cel
- Polecenie: Dodaj Projectile2D o prędkości 3000 i ustaw hitLayers=2. W jednym kroku ma trafić pierwszego wroga i ominąć sojusznika.
- Cel: Zastosować ciągłe wykrywanie kontaktu w nowym typie pocisku.
- Kryteria (widok ucznia):
  - Przy prędkości 3000 pocisk trafia pierwszego wroga w jednym kroku; HP Enemy spada do 2.
  - hitLayers=2 pomija sojusznika na linii lotu; pocisk nie rani właściciela.

## Lekcja 21 — g2d.composition „Kompozycja, fabryki i wyposażenie"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 521)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Fabryka składa jednostkę | Dane wybierają wygląd, zdrowie i zachowanie. Fabryka tworzy GameObject i dodaje potrzebne komponenty.<br><br>nota: Różne dane mogą korzystać z tych samych klas.<br>scenka: Dane rycerza: wygląd: knight
HP: 8
prędkość: 90 / Dane łucznika: wygląd: ranger
HP: 5
prędkość: 120 / Fabryka składa obu: nowy Sprite
nowy Health
nowy kontroler [Te same klasy, inne dane] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (composition:0) |
| 2 | Wspólne klasy, osobne instancje | Dwie jednostki współdzielą definicję Health, lecz mają osobny stan. Nie dodawaj tej samej instancji komponentu do dwóch właścicieli. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Referencja prowadzi do komponentu | Zachowaj referencję do potrzebnego komponentu. Pozwala zmienić parametr bez szukania obiektu w każdej klatce i bez dokładania wszystkich danych do Game.<br><br>nota: Kompozycja rozdziela odpowiedzialności.<br>scenka: Gracz: weapon → jego Weapon
damage = 1 / Ulepszenie przez referencję: ten sam Weapon
damage: 1 → 2 [Nie twórz drugiej broni] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (composition:2) |
| teoria | Składanie jednostek z komponentów | Fabryka tworzy obiekt i dodaje wybrane komponenty. Jednostki mogą współdzielić klasy Health i ruchu, ale mieć różne parametry broni lub AI. Referencja do komponentu pozwala zmienić jego ustawienia bez szukania obiektu co klatkę. Nowa jednostka otrzymuje nowe instancje komponentów. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Nie dodawaj tej samej instancji komponentu do dwóch właścicieli. | src/data/gameDevTeaching.js |

### Zadania lekcji 21

**g2d.composition.guided** (guided / Z przykładem) — Fabryka przeciwników
- Polecenie: Fabryka tworzy już wygląd, zdrowie i kontroler ruchu wroga. Dopisz dodanie komponentu EnemyAI(target, spec.speed) do tworzonego obiektu enemy.
- Cel: Tworzyć kompletnych przeciwników w jednej metodzie fabryki bez duplikowania kodu.
- Wyjaśnienie rozwiązania: Fabryka składa obiekt z komponentów na podstawie przekazanych danych. Dopisanie EnemyAI w jednym miejscu wyposaża w pościg każdy typ wroga.
- Kryteria (widok ucznia):
  - Dwa obiekty Slime mają osobne instancje Health, EnemyAI oraz collidera — zranienie pierwszego nie rani drugiego.
  - Jednostka Bat otrzymuje HP = 2, speed = 80, promień collidera 10 oraz teksturę bat.
  - Zmiana bieżącego HP żywego wroga nie modyfikuje obiektu konfiguracji EnemySpec ani kolejnych tworzonych jednostek.
  - Scena tworzy oba typy wrogów za pomocą tej samej metody fabryki.

**g2d.composition.modified** (modified / Samodzielnie) — Trzeci typ z tych samych klocków
- Polecenie: Dodaj definicję Ghost (hp = 3, speed = 35, radius = 12, tekstura ghost), korzystającą z istniejących komponentów EnemyAI, Health oraz LootOnDeath. Broń powinna rozpoznawać wrogów po warstwie/komponencie, a nie po nazwie obiektu.
- Cel: Dodać nowy typ przeciwnika samymi danymi konfiguracji.
- Kryteria (widok ucznia):
  - Ghost ściga gracza, przyjmuje obrażenia, ginie i upuszcza XP tak samo jak pozostałe typy wrogów.
  - Zmiana nazwy obiektu na Ghost_17 nie wyklucza go z namierzania ani z kolizji.
  - Zmiana parametrów Ghost nie wpływa na działanie jednostek Slime i Bat.
  - Dodanie nowego typu wymaga wyłącznie nowego wpisu danych i wywołania fabryki, bez dopisywania warunków w Weapon, Health czy XpPickup.

**g2d.composition.independent** (independent / Rozbudowa) — Dwie bronie w Loadout
- Polecenie: Napisz komponent Loadout przechowujący referencje do dwóch broni gracza: Dagger (cooldown = 0.5, damage = 1) oraz Orb (cooldown = 1, damage = 2). Obie strzelają automatycznie; pierwszy strzał każdej broni pada po upływie jej własnego czasu odnowienia.
- Cel: Złożyć zestaw dwóch niezależnych broni należących do jednego gracza.
- Kryteria (widok ucznia):
  - Przy stałym celu do chwili t = 1 Dagger oddaje dwa strzały, a Orb jeden — ich timery działają niezależnie.
  - Każdy pocisk ma owner = Player oraz obrażenia zgodne z bronią, która go wystrzeliła.
  - Wyłączenie jednej broni nie zatrzymuje drugiej ani ruchu gracza.
  - Ulepszenie obrażeń w Loadout zwiększa obrażenia przyszłych pocisków obu broni o 1, nie zmieniając pocisków już lecących.
  - Bronie odczytują pozycję właściciela przez referencję; parametry broni nie są zapisywane w globalnych polach klasy Game.

## Lekcja 22 — g2d.run-state „Start, przegrana, zwycięstwo i restart"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 522)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Stan całej rundy | READY czeka na start. RUNNING oznacza grę. LOST i WON kończą przebieg. Stan rundy jest oddzielony od zdrowia jednej jednostki. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Restart tworzy świeży przebieg | Sprzątnij obiekty, timery i reakcje poprzedniej rundy. Utwórz nową instancję gracza. Nie zostawiaj starego komponentu z poprzednim stanem.<br><br>nota: Nowa runda nie dziedziczy zużytych zasobów poprzedniej.<br>scenka: Koniec starej rundy: HP = 0
12 wrogów
3 aktywne timery [Usuń obiekty i reakcje] / Nowa runda: nowy gracz: HP = 8
0 starych wrogów
0 starych timerów [Świeże instancje] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (run-state:1) |
| 3 | Jednoczesna śmierć i zwycięstwo | Ustal priorytet, gdy oba warunki zajdą w tej samej aktualizacji. Zatwierdź jeden wynik i nie uruchamiaj zakończenia ponownie.<br><br>nota: Reguła priorytetu należy do projektu gry.<br>scenka: Ta sama klatka: gracz umiera
ostatni wróg umiera [Dwa warunki naraz] / Przykładowa reguła gry: śmierć ma pierwszeństwo
wynik: LOST [Zakończ rundę tylko raz] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (run-state:2) |
| teoria | Stan całej rozgrywki | READY oznacza oczekiwanie na start, RUNNING trwającą grę, a WON i LOST jej koniec. Stan rozgrywki nie jest zdrowiem postaci. Restart tworzy świeży przebieg i sprząta poprzednie obiekty, timery oraz reakcje. Określ priorytet, gdy zwycięstwo i śmierć następują w tej samej aktualizacji. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Po restarcie gracz powinien być nową instancją. | src/data/gameDevTeaching.js |

### Zadania lekcji 22

**g2d.run-state.guided** (guided / Z przykładem) — Ekran startowy
- Polecenie: Gotowa metoda start przygotowuje nową rundę. Dopisz state = "RUNNING" na końcu metody start, aby stan gry odpowiadał utworzonej scenie.
- Cel: Rozpoczynać odliczanie czasu rozgrywki dopiero po kliknięciu Start.
- Wyjaśnienie rozwiązania: Stan RUNNING oznacza trwającą rundę. Interfejs oraz reguły końca gry korzystają z tego samego pola stanu zamiast osobnych flag.
- Kryteria (widok ucznia):
  - W stanie READY czas świata wynosi 0 i nie trwają walka ani spawny, mimo że interfejs działa przez 5 s.
  - Wywołanie start przełącza stan na RUNNING dokładnie raz i tworzy jednego gracza z właściwą konfiguracją.
  - Przytrzymanie klawisza Enter ani podwójne kliknięcie nie uruchamiają dwóch rund ani dwóch graczy.
  - Kliknięcie przycisku Start nie wywołuje jednocześnie strzału ani wyboru ulepszenia w tej samej klatce.

**g2d.run-state.modified** (modified / Samodzielnie) — Przegrana i czytelny wynik
- Polecenie: Po śmierci gracza przełącz stan na LOST, zatrzymaj świat gry i wyświetl przeżyty czas, osiągnięty poziom, liczbę pokonanych wrogów oraz przycisk Restart.
- Cel: Obsłużyć śmierć gracza jako przejście stanu całej rozgrywki.
- Kryteria (widok ucznia):
  - Pierwsze zejście zdrowia gracza do 0 zmienia stan na LOST; kolejne sygnały nie tworzą dodatkowych paneli.
  - W stanie LOST nie zmieniają się czas świata, numer fali, pociski ani wyniki walki.
  - Panel podsumowania pokazuje końcowe wartości RunStats i Experience zapisane w chwili przegranej.
  - Interfejs nadal obsługuje kliknięcie przycisku Restart oraz klawiaturę, mimo że symulacja świata jest zatrzymana.

**g2d.run-state.independent** (independent / Rozbudowa) — Nowa gra i cel przetrwania
- Polecenie: W metodzie RunController.onLateUpdate (po rozstrzygnięciu kontaktów w danym kroku) ustaw stan WON po osiągnięciu 120 s czasu symulacji przy żywym graczu. Jeżeli w tym samym kroku gracz otrzymał śmiertelny cios, pierwszeństwo ma stan LOST. Restart tworzy świeży przebieg z ziarnem seed = 42.
- Cel: Zapewnić jednoznaczny priorytet końca rundy i pełny reset przy restarcie.
- Kryteria (widok ucznia):
  - Żywy gracz w chwili t = 119.95 ma nadal stan RUNNING; po osiągnięciu 120 s stan zmienia się na WON.
  - Śmiertelne trafienie w ostatnim kroku daje stan LOST, bez jednoczesnego wyświetlenia panelu zwycięstwa.
  - Restart zeruje czas, falę, liczbę pokonanych (kills), złoto, XP, oczekujące wybory (pendingChoices) i ulepszenia oraz przywraca początkowe HP, prędkość i bronie.
  - Po trzech restartach istnieje dokładnie jeden aktywny gracz, spawner, HUD i układ wejścia; dawne tweeny oraz referencje są usunięte.
  - Ponowny start z seed = 42 odtwarza początkowe pozycje spawnów.

## Lekcja 23 — g2d.performance „Wydajność, testowanie i zapis projektu"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 523)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Sprawdzaj pobliskich kandydatów | Podział przestrzeni ogranicza kandydatów kontaktu. Nie trzeba porównywać każdej pary odległych obiektów. Gęste skupisko nadal wymaga sprawdzenia rzeczywistych kontaktów. | shared/lab-game-v2/editor/lessonVisuals.js |
| 2 | Sprzątanie ogranicza liczbę obiektów | Mierz aktywne pociski i łupy. Usuń pocisk po końcu życia. Limit kontroluje wzrost sceny, ale nie zastępuje pomiaru kosztu aktualizacji. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Optymalizacja zachowuje nagrody | Łączenie orbów zmniejsza liczbę obiektów, lecz suma XP musi pozostać ta sama. Przykład: 2+3 XP staje się jednym orbem o wartości 5. | shared/lab-game-v2/editor/lessonVisuals.js |
| teoria | Najpierw zmierz koszt | Obserwuj liczbę aktywnych obiektów, pocisków, łupów i operacji podczas aktualizacji. Usuwaj obiekty po końcu życia. Limity i łączenie łupu ograniczają koszt, ale muszą zachować sumę nagród. Test wydajności nie zastępuje testów reguł gry. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Przy łączeniu kulek XP suma ich wartości musi pozostać taka sama. | src/data/gameDevTeaching.js |

### Zadania lekcji 23

**g2d.performance.guided** (guided / Z przykładem) — Pociski nie zostają na zawsze
- Polecenie: Scenariusz obciążeniowy już tworzy pociski. Dopisz shots++ po każdym faktycznie utworzonym pocisku, aby raport zliczał wykonane strzały.
- Cel: Potwierdzić, że usuwanie pocisków utrzymuje stałą liczbę aktywnych obiektów.
- Wyjaśnienie rozwiązania: Licznik zlicza faktycznie wykonane operacje, a nie liczbę klatek. W połączeniu z liczbą aktywnych obiektów pokazuje koszt symulacji.
- Kryteria (widok ucznia):
  - Po ustabilizowaniu rytmu strzałów liczba jednocześnie aktywnych pocisków nie przekracza 6, mimo utworzenia ponad 90 pocisków łącznie.
  - Po 1.1 s od ostatniego strzału liczba aktywnych pocisków spada do 0.
  - Usunięte pociski nie pozostają w systemie kolizji, aktualizacjach ani tweenach.
  - Powtórzenie całego scenariusza daje taką samą liczbę aktywnych obiektów.

**g2d.performance.modified** (modified / Samodzielnie) — Celowanie jednym przejściem
- Polecenie: Wyszukuj najbliższy poprawny cel jednym przejściem po liście dopiero wtedy, gdy broń jest gotowa do strzału. Środowisko testowe zlicza obliczenia odległości.
- Cel: Uniknąć wielokrotnego liczenia odległości i sortowania całej listy w każdej klatce.
- Kryteria (widok ucznia):
  - Dla 1000 poprawnych kandydatów pojedynczy wybór celu oblicza odległość najwyżej 1000 razy.
  - Dla 10 kolejnych strzałów łączna liczba obliczeń nie przekracza 10 000.
  - Wybrany cel jest taki sam jak w algorytmie wzorcowym, także przy równych odległościach.
  - Gdy trwa odliczanie cooldownu, broń nie przeszukuje listy celów w każdej klatce.
  - Martwe i nieaktywne obiekty są nadal pomijane — optymalizacja nie zmienia reguł wyboru celu.

**g2d.performance.independent** (independent / Rozbudowa) — Minuta obciążenia bez narastania
- Polecenie: Przygotuj 60-sekundowy deterministyczny test obciążenia: maksymalnie 200 żywych wrogów, 300 aktywnych pocisków i 200 orbów XP. Po osiągnięciu limitu orbów łącz nagrody tak, aby zachować ich łączną wartość. Wyeksportuj projekt, zaimportuj go z powrotem i zapisz pomiary w pliku REPORT.md.
- Cel: Utrzymać limity obiektów i zachować sumę nagród podczas długiego przebiegu.
- Kryteria (widok ucznia):
  - Przez cały przebieg żaden z limitów aktywnych obiektów nie zostaje przekroczony na koniec kroku.
  - Suma XP zebranego przez gracza oraz XP leżącego na mapie jest równa łącznemu XP z pokonanych wrogów — łączenie orbów nie gubi punktów.
  - Po zatrzymaniu spawnera, pokonaniu wrogów i zebraniu łupu na scenie zostają tylko obiekty bazowe, a po upływie czasu życia znikają wszystkie pociski.
  - Dziesięć kolejnych uruchomień i zakończeń rundy nie zwiększa liczby aktywnych nasłuchiwaczy, timerów, kolizji ani tweenów.
  - Raport zawiera liczby obiektów i operacji oraz opis środowiska pomiaru.
  - Wyeksportowany projekt zawiera wszystkie pliki, oznaczenie języka i wersję API, a po imporcie uruchamia się bez błędów.

## Lekcja 24 — g2d.survivor „Projekt końcowy: Łąka przetrwania"
Definicja lekcji: shared/lab-game-v2/course/manifest.js → src/data/lessons/gameDevCourse.js (track game-dev, order 524)
Scaffolding: Gotowa baza: infrastruktura i mechaniki z wcześniejszych lekcji. Uzupełniasz wyłącznie logikę tego zadania; pliki pomocnicze możesz obejrzeć. (domyślne)

| Page | Tytuł | Treść | Miejsce w kodzie |
|---|---|---|---|
| 1 | Jedna pętla rozgrywki | Najpierw połącz ruch i jednego przeciwnika. Następnie dodaj pociski, łup oraz doświadczenie. Rozwijaj grę etapami.<br><br>nota: Każdy etap powinien dawać widoczny efekt.<br>scenka: Najpierw ruch i wróg: unikaj jednego przeciwnika [Sprawdź sterowanie] / Potem walka i łup: strzał → trafienie → orb XP [Sprawdź trafienia] / Na końcu rozwój: XP → awans → ulepszenie [Sprawdź powrót do walki] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (survivor:0) |
| 2 | Rozwój przerywa walkę na wybór | Fale, walka, awans i pauza tworzą wspólny przebieg. Wybór ulepszenia zmienia komponent, a potem świat może ruszyć dalej. | shared/lab-game-v2/editor/lessonVisuals.js |
| 3 | Sprawdź cały przebieg gry | Testy reguł nie zastępują ręcznej próby planszy. Sprawdź start, sterowanie, przeciwników, przegraną, restart i odtworzenie eksportu.<br><br>nota: W rozwiązaniu pierwsze Slime pojawiają się po 1.5 s.<br>scenka: Próba całej rundy: start → ruch → walka
przegrana → restart [Nowa runda ma świeże HP] / Próba eksportu: zapisz → importuj → uruchom [Sterowanie i gra nadal działają] | shared/lab-game-v2/editor/lessonVisuals.js + src/data/gameConceptScenes.js (survivor:2) |
| teoria | Połącz mechaniki etapami | Projekt końcowy łączy ruch, fale, walkę, łup, awans, pauzę i restart. Najpierw zbuduj scenę, potem jedną pętlę walki, następnie ulepszenia i interfejs. Testy zachowania sprawdzają reguły w Javie; ręczny test planszy potwierdza sterowanie i czytelność obrazu. | src/data/gameDevTeaching.js |
| wskazówka | Zapamiętaj | Sprawdź start, przegraną, restart i odtworzenie eksportu. | src/data/gameDevTeaching.js |

### Zadania lekcji 24

**g2d.survivor.guided** (guided / Z przykładem) — Działający rdzeń gry survivor
- Polecenie: Gotowa arena zawiera ruch, walkę, fale przeciwników i rozwój postaci. Ustaw zasięg broni (Weapon.range) gracza na 240 px, uruchom rundę i sprawdź automatyczny atak.
- Cel: Złożyć pierwszą grywalną wersję z własnych komponentów.
- Wyjaśnienie rozwiązania: Parametr range określa zasięg wyszukiwania celów przez broń. Zmiana jednego parametru konfiguracji dostosowuje walkę bez przepisywania logiki.
- Kryteria (widok ucznia):
  - Player porusza się klawiszami WASD/strzałkami z prędkością 120 px/s (bez przyspieszania po przekątnej); sprite i collider mają wspólny środek.
  - Broń strzela automatycznie do najbliższego żywego wroga w zasięgu 240 px, a obrażenia wynikają z trafienia pocisku.
  - Każdy Slime ściga gracza; jego śmierć zwiększa licznik kills o 1 i zostawia jeden orb o wartości 1 XP.
  - Zebranie 5 XP daje poziom 2 oraz jeden oczekujący wybór (pendingChoice); wybór szybkości zwiększa prędkość z 120 do 150 px/s.
  - Komponent Health gracza daje 0.75 s ochrony po przyjętym trafieniu niezależnie od liczby stykających się wrogów.
  - Kamera podąża za graczem, a HUD ze zdrowiem, XP i poziomem pozostaje nieruchomy na ekranie.

**g2d.survivor.modified** (modified / Samodzielnie) — Pełna runda i rozwój postaci
- Polecenie: Rozbuduj grę do czterech fal rozpoczynających się w t = 0, 30, 60 i 90 s z interwałami 1.5, 1, 0.75 oraz 0.5 s. Od fali 2 losuj także jednostkę Bat (HP = 1, speed = 65), a od fali 3 — Ghost (HP = 3, speed = 35). Fala 4 wykorzystuje wszystkie trzy typy. Dodaj trzy ulepszenia, pełną pauzę na czas wyboru, obsługę startu, przegranej, zwycięstwa po 120 s oraz restart.
- Cel: Dodać kolejne fale przeciwników, menu ulepszeń oraz warunki końca rundy.
- Kryteria (widok ucznia):
  - Numer fali przełącza się dokładnie w 30, 60 i 90 s symulacji, a zestawy jednostek i interwały zgadzają się z konfiguracją.
  - Dla ziarna seed = 42 kolejność typów i pozycji wrogów jest powtarzalna, a wszystkie sprite’y pozostają ustawione pionowo.
  - Otwarte menu awansu zatrzymuje ruch, kolizje, broń, pociski, czasy życia, ochronę po trafieniu, spawner, tweeny świata i zegar rundy; przyciski oraz skróty klawiszowe menu nadal działają.
  - Ulepszenia (prędkość +30, obrażenia +1, czas odnowienia ×0.8 z minimum 0.1 s) modyfikują odpowiednie komponenty dokładnie raz.
  - Zejście HP do 0 kończy rundę przegraną, a przetrwanie 120 s — zwycięstwem; na ekranie widać podsumowanie i przycisk Restart.
  - Po restarcie wszystkie statystyki i zegary nowej rundy wracają do wartości początkowych.

**g2d.survivor.independent** (independent / Rozbudowa) — Własny wariant i kompletny projekt
- Polecenie: Dodaj drugą automatyczną broń Orb (cooldown = 1, damage = 2, prędkość pocisku = 220, lifetime = 3, range = 240), własny wygląd areny oraz jedną skrzynię dającą 20 złota i otwierającą sklep z ulepszeniem +1 obrażeń za 20 złota. Zachowaj dotychczasowe reguły XP. Przygotuj kompletny projekt z krótkim opisem sterowania i jednej wybranej zmiany balansu.
- Cel: Zbudować kompletną grę z dwiema broniami, sklepem za złoto i powtarzalnym przebiegiem.
- Kryteria (widok ucznia):
  - Obie bronie strzelają według własnych, niezależnych timerów, a ich pociski mają właściwego właściciela i obrażenia; ulepszenie obrażeń w Loadout zwiększa obrażenia kolejnych pocisków obu broni.
  - Skrzynia przyznaje 20 złota tylko graczowi i tylko raz; zakup w sklepie odejmuje 20 złota i zwiększa obrażenia o 1. Zdobywanie XP i darmowe awanse działają niezależnie od sklepu.
  - Deterministyczny przebieg testowy obejmuje ruch, trafienie, śmierć wroga, zebranie XP, awans, 5 s pauzy w menu, wybór ulepszenia oraz restart.
  - Scenariusz przetrwania 120 s kończy się zwycięstwem, a scenariusz utraty HP — przegraną.
  - Test obciążeniowy utrzymuje limity 200 wrogów, 300 pocisków i 200 orbów oraz zachowuje łączną wartość XP; po restarcie nie zostają obiekty z poprzedniej rundy.
  - Wyeksportowany projekt otwiera się w nowej sesji laboratorium z engineApiVersion = 2.0.0, wszystkimi plikami i opisem sterowania (WASD/strzałki, Escape, 1–3/kliknięcie, Restart).
  - Wygląd areny zapewnia czytelny HUD i wyraźny kontrast postaci; opis wskazuje zmieniony parametr balansu i jego wpływ na rozgrywkę.
