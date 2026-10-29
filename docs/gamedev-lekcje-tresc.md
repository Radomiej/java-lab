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
- Polecenie: Masz gotowy Player w (80,90). Dodaj mu tylko ShapeRenderer 40×30 w kolorze #76b9f2. Uruchom: niewidoczny dotąd obiekt stanie się widoczny.
- Cel: Utworzyć GameObject i dodać renderer w oddzielnych czytelnych instrukcjach.
- Wyjaśnienie rozwiązania: GameObject już istnieje i ma pozycję. Dodanie ShapeRenderer nadaje mu widoczny wygląd. Komponenty określają, co obiekt potrafi: renderer rysuje, kontroler porusza, collider wykrywa kontakt.
- Kryteria (widok ucznia):
  - Istnieje jeden aktywny obiekt Player z własnym Transform i komponentem ShapeRenderer.
  - Player znajduje się w pozycji (80, 90). Prostokąt ma szerokość 40 px, wysokość 30 px i kolor #76b9f2.
  - Na mapie prostokąt sięga w poziomie od x = 60 do x = 100, a w pionie od y = 75 do y = 105. To jego krawędzie; środek obiektu nadal jest w (80, 90).
  - Po 20 aktualizacjach nadal istnieje jeden Player, a jego pozycja nie zmienia się.

**g2d.scene.modified** (modified / Samodzielnie) — Dwie osobne platformy
- Polecenie: Masz dwie widoczne platformy. Samodzielnie dopisz przesunięcie tylko PlatformB o 40 px w prawo. PlatformA ma pozostać bez zmian.
- Cel: Wykazać niezależność instancji.
- Kryteria (widok ucznia):
  - PlatformA i PlatformB są osobnymi obiektami, każdy z własnym Transform i ShapeRenderer.
  - PlatformA ma pozycję (120, 180), szerokość 100 px i wysokość 20 px.
  - Po przesunięciu PlatformB ma pozycję (340, 120), szerokość 80 px i wysokość 20 px.
  - Zmiana koloru lub pozycji PlatformB nie zmienia PlatformA.

**g2d.scene.independent** (independent / Rozbudowa) — Mała arena
- Polecenie: Gracz i pozycje obiektów są gotowe. Samodzielnie dodaj Enemy wygląd slime 32×32, a Coin wygląd coin 16×16. Nie twórz kolejnych obiektów.
- Cel: Złożyć czytelną scenę z kilku instancji.
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
- Polecenie: Gracz, kontroler i odczyt WASD/strzałek są gotowe. Dopisz jedno wywołanie move(x, y, speed) w PlayerController. Po uruchomieniu D ma przesuwać gracza w prawo, a brak klawiszy zatrzymywać.
- Cel: Wywołać kontroler ruchem wynikającym z wejścia.
- Wyjaśnienie rozwiązania: Gotowy kod odczytuje WASD i strzałki. Jedno wywołanie move przekazuje kierunek i prędkość kontrolerowi. Kontroler uwzględnia czas oraz normalizuje przekątną — nie mnożymy speed ponownie przez delta.
- Kryteria (widok ucznia):
  - D trzymane 0.5 s przesuwa Player do (160,100); ArrowRight daje identyczny wynik.
  - Przez 0.5 s bez wejścia pozycja pozostaje (100,100).
  - A+D oraz W+S dają zerowy ruch na danej osi.
  - S+D przez sekundę daje dystans 120 px, z zachowaniem równych składowych.

**g2d.input.modified** (modified / Samodzielnie) — Sprint
- Polecenie: Gotowy gracz porusza się z prędkością 100. Samodzielnie zmień parametr move: przytrzymany Shift daje 200 px/s, bez Shift 100. Nie kopiuj logiki kierunku.
- Cel: Przekazywać zmienny parametr bez kopiowania logiki ruchu.
- Kryteria (widok ucznia):
  - Shift podwaja prędkość ruchu do 200 px/s.
  - Po puszczeniu Shift prędkość wraca do 100 px/s.
  - Sprint na ukos nie jest szybszy — składowe pozostają wyrównane.
  - Sam Shift nie porusza postaci.

**g2d.input.independent** (independent / Rozbudowa) — Jedna akcja — jeden pocisk
- Polecenie: Ruch jest gotowy, a komponent ActionShooter obserwuje licznik: co 10 aktualizacji sprawdza, czy actions wynosi 1 — wtedy wystrzeliwuje Fireball w ostatnim kierunku postaci i zeruje licznik. Uzupełnij ActionCounter tak, aby jedno nowe naciśnięcie Space zwiększało actions raz. Przytrzymanie nie może naliczać kolejnych akcji — wtedy licznik przekroczy 1 i strzał nie wypadnie.
- Cel: Obsłużyć zbocze klawisza w osobnym komponencie.
- Kryteria (widok ucznia):
  - Jedno naciśnięcie Space daje dokładnie jeden Fireball w ciągu 10 aktualizacji.
  - Po strzale licznik actions wraca do 0; kolejny strzał wymaga nowego naciśnięcia.
  - Trzymanie Space nie strzela wielokrotnie — licznik rośnie tylko na zboczu klawisza.
  - Ruch z D działa równocześnie; pocisk startuje z pozycji postaci.

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
- Polecenie: Gracz i widoczna ściana są gotowe. Dodaj ścianie tylko Collider2D(20,200). Uruchom i przytrzymaj D: gracz ma zatrzymać się przed ścianą na x=174.
- Cel: Dodać dwa jawne collidery.
- Wyjaśnienie rozwiązania: Widoczna ściana sama nie blokuje ruchu. Dodanie Collider2D o wymiarach 20×200 daje kontrolerowi fizyczną przeszkodę. Gracz o połowie szerokości 16 zatrzyma środek na x=174.
- Kryteria (widok ucznia):
  - Po sekundzie D środek Player zatrzymuje się na x=174, y=180; prawa krawędź dotyka x=190.
  - Bez collidera na ścianie ten sam ruch dochodzi do x=220.
  - Sprite ściany i collider mają niezależnie ustawione wymiary; sam Sprite nie blokuje ruchu.

**g2d.collisions.modified** (modified / Samodzielnie) — Koło i skala wizualna
- Polecenie: Samodzielnie zamień box gracza na CircleCollider2D(12) oraz ustaw skalę grafiki na (2,2). Ściana jest gotowa; D ma zatrzymać środek gracza na x=178.
- Cel: Stosować promień niezależny od Sprite.
- Kryteria (widok ucznia):
  - Przy tej samej ścianie Player zatrzymuje się na x=178.
  - Po zmianie scale=(2,2) punkt zatrzymania nadal wynosi x=178.
  - Jawna zmiana promienia na 20 zmienia punkt zatrzymania na x=170; sama skala tego nie robi.

**g2d.collisions.independent** (independent / Rozbudowa) — Korytarz i granice świata
- Polecenie: Gotowe są ruch, gracz i widoczne ściany korytarza. Samodzielnie dodaj ścianom collidery i ustaw granice świata 640×360. Sprawdź blokowanie ruchu i ślizganie po ścianie.
- Cel: Złożyć obszar z nieprzenikalnymi ścianami.
- Kryteria (widok ucznia):
  - Ruch w lewo zatrzymuje środek na x=192, w prawo na x=268.
  - Podczas ruchu ukośnego wzdłuż ściany x nie przekracza ograniczenia, a y nadal rośnie.
  - Środek koła na mapie może przesuwać się w poziomie od x = 12 do x = 628, a w pionie od y = 12 do y = 348. Dzięki marginesowi 12 px koło nie wychodzi poza granice świata.
  - Krok 0.1 s przy speed=600 nie przenosi gracza na drugą stronę ściany.

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
- Polecenie: Gracz, Slime, cel i obliczenie dx/dy są gotowe. Dopisz jedno wywołanie move(dx,dy,speed) w EnemyAI. Wróg ma zacząć pościg z prędkością 60.
- Cel: Napisać własny komponent pościgu.
- Wyjaśnienie rozwiązania: Cel, kierunek i kontroler są gotowe. Wywołanie move(dx, dy, speed) uruchamia pościg. Kierunek liczymy jako pozycja celu minus pozycja przeciwnika; kontroler normalizuje wektor.
- Kryteria (widok ucznia):
  - Po sekundzie Slime ma pozycję (160,100) na pustej scenie.
  - Dla celu po przekątnej Slime pokonuje 60 px w sekundę.
  - Jeżeli Slime i target są w tym samym punkcie, nie powstaje NaN ani niekontrolowany ruch.
  - Zniszczenie celu lub target=null zatrzymuje AI bez błędu.

**g2d.enemy-ai.modified** (modified / Samodzielnie) — Dwa tempa pościgu
- Polecenie: Slime i Bat mają własne prędkości 40 i 80 oraz referencję do gracza. Samodzielnie napisz onUpdate wspólnego EnemyAI: oblicz kierunek do celu i wywołaj kontroler.
- Cel: Użyć jednej klasy dla różnych instancji.
- Kryteria (widok ucznia):
  - Na osobnych prostych odcinkach po 0.5 s Slime przebywa 20 px, a Bat 40 px.
  - Zmiana name gracza nie zatrzymuje obu AI.
  - Po przeniesieniu celu na drugą stronę przeciwnicy zmieniają kierunek następnego kroku.
  - Oba sprite’y pozostają pionowo; wygląd może się odbijać przez flipX, rotation pozostaje 0.

**g2d.enemy-ai.independent** (independent / Rozbudowa) — Przeciwnik utrzymuje dystans
- Polecenie: Masz gotową scenę, ruch gracza i komponent FleeAI. Samodzielnie napisz ucieczkę: przy odległości <120 oddalaj się z prędkością 60; poza zasięgiem stój.
- Cel: Samodzielnie zaprogramować prostą regułę AI.
- Kryteria (widok ucznia):
  - Dla target=(300,100),enemy=(250,100) po 0.5 s wróg znajduje się w (220,100).
  - Gdy odległość wynosi 120 lub więcej, następny krok nie oddala przeciwnika.
  - Przy tym samym położeniu celu i wroga stosujesz jawny kierunek awaryjny (1,0), bez NaN.
  - FleeAI jednego wroga nie zmienia parametrów EnemyAI drugiego; do jednego obiektu podłączony jest tylko jeden aktywny autor kierunku ruchu.

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
- Polecenie: Lot pocisku, trigger, filtrowanie celu i Health są gotowe. Dopisz tylko hp.damage(damage) w ProjectileHit. Po trafieniu HP celu spadnie z 3 do 2; pocisk zniknie.
- Cel: Zadać obrażenia dopiero po kontakcie.
- Wyjaśnienie rozwiązania: Lot, trigger i Health są gotową bazą. hp.damage(damage) odejmuje zdrowie trafionemu celowi. Guard spent i usunięcie pocisku zapewniają jedno trafienie; owner chroni właściciela.
- Kryteria (widok ucznia):
  - Po 0.2 s pocisk jest w (140,100), cel nadal ma 3 HP.
  - Po dotarciu odcinka ruchu do zakresu kontaktu cel ma 2 HP, a pocisk jest wycofany.
  - Po kolejnych krokach cel nadal ma 2 HP; jeden pocisk nie nalicza trafienia wielokrotnie.
  - Pozycja celu nie jest celem tweena, który odejmuje HP już w momencie wystrzału.
  - Po uruchomieniu WASD/strzałki poruszają graczem, a Space tworzy pocisk w ostatnim kierunku ruchu.
  - Trzy trafienia po 1 obrażeniu pokonują przeciwnika z HP=3; kontakt wroga odbiera HP graczowi z ochroną między trafieniami.

**g2d.projectiles.modified** (modified / Samodzielnie) — Właściciel i czas życia
- Polecenie: Pocisk już lata i trafia. Samodzielnie zmień jego lifetime z 2 do 0.5 sekundy; zachowaj owner=Player i jedno trafienie. Sprawdź cel oraz zniknięcie pocisku.
- Cel: Odrzucać samouszkodzenie i usuwać nietrafione pociski.
- Kryteria (widok ucznia):
  - Zaraz po utworzeniu w środku Player jego Health nie maleje.
  - Pocisk lecący obok wszystkich celów istnieje po 0.4 s i znika po 0.5 s.
  - Dwa pociski utworzone w różnych chwilach mają własne czasy życia.
  - Po wygaśnięciu pocisk nie rysuje się, nie bierze udziału w kontaktach i nie ma aktywnej aktualizacji.
  - Po uruchomieniu WASD/strzałki poruszają graczem, a Space tworzy pocisk w ostatnim kierunku ruchu.
  - Trzy trafienia po 1 obrażeniu pokonują przeciwnika z HP=3; kontakt wroga odbiera HP graczowi z ochroną między trafieniami.

**g2d.projectiles.independent** (independent / Rozbudowa) — Szybki pocisk i pierwszy cel
- Polecenie: Trafienie i obiekty sceny są gotowe. Samodzielnie dodaj pociskowi Projectile2D(1,0,3000,1,player) i ustaw hitLayers=2. Ma trafić pierwszego wroga, ignorując sojusznika i właściciela.
- Cel: Użyć ciągłego wykrywania kontaktu silnika.
- Kryteria (widok ucznia):
  - Przy kroku 0.1 s pocisk wykrywa cel r=8 między swoim startem a końcem kroku, mimo braku nakładania w pozycji końcowej.
  - Przy dwóch celach na tej samej linii obrażenia otrzymuje tylko bliższy.
  - Sojusznik znajdujący się przed Enemy nie zużywa pocisku ani nie traci HP.
  - Nie powstają powtórne obrażenia po destroy; wynik trafienia jest taki sam przy krokach 0.1 s i 0.05 s dla tego nieruchomego układu.
  - Po uruchomieniu WASD/strzałki poruszają graczem, a Space tworzy pocisk w ostatnim kierunku ruchu.
  - Trzy trafienia po 1 obrażeniu pokonują przeciwnika z HP=3; kontakt wroga odbiera HP graczowi z ochroną między trafieniami.

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
- Polecenie: Dodaj Counter do PlayerA i PlayerB; po dwóch aktualizacjach wyłącz tylko Counter PlayerB i wykonaj jeszcze trzy.
- Cel: Przechowywać stan w instancjach i rozumieć enabled.
- Kryteria (widok ucznia):
  - Po pierwszych dwóch aktualizacjach oba liczniki wynoszą 2.
  - Po wyłączeniu B i trzech aktualizacjach A=5,B=2.
  - Ponowne włączenie B i jedna aktualizacja daje A=6,B=3, bez ponownej inicjalizacji.

**g2d.components.independent** (independent / Rozbudowa) — Obiekt z określonym czasem życia
- Polecenie: Napisz Lifetime z remaining=0.3 s. Dodaj go do Spark i usuń obiekt po upływie czasu. W onDestroy zwiększ pomocniczy licznik cleanup.
- Cel: Wykorzystać komponent i zniszczenie bez duplikacji skutków.
- Kryteria (widok ucznia):
  - Po 0.2 s Spark istnieje; po 0.3 s jest zniszczony i wycofany z aktywnej sceny.
  - cleanup wzrasta dokładnie raz także po kolejnych aktualizacjach i powtórnym żądaniu destroy.
  - Dwa Spark utworzone w różnych chwilach mają niezależny remaining.
  - Zniszczony Spark nie jest aktualizowany ani rysowany.

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
- Polecenie: Nadaj Mover pola velocityX/velocityY. Drop w (200,40) ma v=(0,60); Spark w (20,30) ma v=(-40,20).
- Cel: Użyć jednego komponentu dla różnych obiektów.
- Kryteria (widok ucznia):
  - Po 0.5 s Drop=(200,70),Spark=(0,40).
  - Po 1 s Drop=(200,100),Spark=(-20,50), bez automatycznego ograniczania tych obiektów do ekranu.
  - Zmiana prędkości Drop nie zmienia prędkości Spark.

**g2d.time.independent** (independent / Rozbudowa) — Ten sam dystans w każdym kierunku
- Polecenie: Napisz DirectionMover z direction i speed. Dla (3,4) i speed=100 obiekt ma pokonać 100 px w sekundę; kierunek zerowy zatrzymuje ruch.
- Cel: Normalizować kierunek bez NaN.
- Kryteria (widok ucznia):
  - Ze startu (100,100) po sekundzie direction=(3,4) daje (160,180).
  - Dla (1,1) długość przesunięcia po sekundzie wynosi 100, nie około 141.421.
  - Dla (0,0) pozycja jest stała i wszystkie współrzędne są skończone.
  - Zmiana kierunku na przeciwny odwraca ruch bez zmiany jego prędkości.

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
- Polecenie: Ground i gracz są gotowe. Dodaj Ground komponent TileMap z grass i kafelkiem 32.
- Cel: Wypełnić tło bez setek GameObjectów.
- Wyjaśnienie rozwiązania: TileMap wypełnia tło kafelkami. To jeden komponent jednego obiektu, a nie setki obiektów sceny.
- Kryteria (widok ucznia):
  - Ground i Player są dwoma obiektami; kafelki nie są osobnymi obiektami.
  - Tło grass wypełnia viewport 640×360, a także viewport 320×200 po zmianie rozmiaru.
  - Player jest rysowany po tle, ze środkiem (100,100) i wymiarami 32×32.

**g2d.graphics.modified** (modified / Samodzielnie) — Piasek i kierunek patrzenia
- Polecenie: Zmień mapę na sand z kafelkiem 48. FacingVisual ustawia Sprite.flipX przy ruchu lewo/prawo i zachowuje ostatnie odbicie po zatrzymaniu.
- Cel: Zachować ruch fizyczny przy odbijaniu grafiki.
- Kryteria (widok ucznia):
  - Render tła używa sand i kafelka 48, bez resztek grass.
  - Po A sprite.flipX=true; bez klawiszy pozostaje true; po D=false.
  - Transform.rotation=0, scale.x=1 i rozmiar collidera nie zmieniają się podczas odbicia.

**g2d.graphics.independent** (independent / Rozbudowa) — Arena z czytelnymi warstwami
- Polecenie: Zbuduj tło, ścieżkę jako ShapeRenderer 400×32 ze środkiem (320,180), Player i dekorację. Ustaw jawne warstwy: tło -10, ścieżka -5, Player 0, dekoracja 5.
- Cel: Rozdzielić wygląd od mechaniki i kolejności tworzenia.
- Kryteria (widok ucznia):
  - Kolejność rysowania odpowiada warstwom nawet po odwróceniu kolejności tworzenia obiektów.
  - Ścieżka ma środek w (320, 180), szerokość 400 px i wysokość 32 px. Bez collidera nie blokuje ruchu.
  - Zmiana skali dekoracji nie przesuwa jej środka ani Player.
  - Tło nadal składa się z jednego obiektu TileMap.

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
- Polecenie: Fala 1: start=0,interval=1,count=3,hp=2,speed=40. Fala 2: start=5,interval=0.5,count=4,hp=3,speed=60. Pierwszy spawn każdej fali jest po jednym interwale od jej startu.
- Cel: Oddzielić definicję fali od kodu tworzenia.
- Kryteria (widok ucznia):
  - Fala 1 tworzy wrogów w t=1,2,3; Fala 2 w t=5.5,6,6.5,7.
  - Do t=4 są utworzone trzy jednostki pierwszej fali; do t=7 cztery drugiej.
  - Jednostki fali 1 mają HP=2,speed=40; fali 2 HP=3,speed=60; zmiana danych drugiej nie modyfikuje już żyjących jednostek pierwszej.
  - Numer fali przełącza się na 2 w t=5, nawet przed pierwszym jej spawnem.

**g2d.waves.independent** (independent / Rozbudowa) — Pojawienie poza widokiem
- Polecenie: Losuj kąty ze wspólnego generatora o seed=42. Dla gracza w środku dużego świata spawnuj na okręgu r=0.5×hypot(game.getViewportWidth(),game.getViewportHeight())+40. Maksymalnie 100 żywych przeciwników; brak miejsca w limicie pomija dany spawn bez odkładania nieograniczonej kolejki.
- Cel: Zbudować deterministyczny i ograniczony spawner.
- Kryteria (widok ucznia):
  - Dla tego samego seeda pierwsze 20 pozycji jest powtarzalne, a wyniki Java i JS są równoważne.
  - Wszystkie punkty spawnu leżą poza viewportem i na zadanym promieniu z tolerancją 1e-6.
  - Zmiana viewportu z 320×200 na 640×360 przelicza promień, nie tworząc wrogów na widocznej planszy.
  - Przy 100 żywych wrogach nowy termin nie zwiększa liczby; po usunięciu jednego następny termin może utworzyć jednego.
  - Restart z seed=42 odtwarza pierwszą sekwencję bez użycia czasu systemowego.

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
- Polecenie: Masz gotowe Health i reakcje na obrażenia. Uzupełnij currentHealth=Math.max(0,currentHealth-amount) w damage.
- Cel: Chronić zakres i skutki zmiany stanu.
- Wyjaśnienie rozwiązania: Odejmowanie zmienia zdrowie, a Math.max zatrzymuje wynik na zero. Istniejące reakcje mogą wtedy wykryć śmierć dokładnie raz.
- Kryteria (widok ucznia):
  - Obrażenia 2 zmieniają 5→3; leczenie 10 zmienia 3→5.
  - Obrażenia 10 zmieniają 5→0 i generują jedną śmierć; kolejne obrażenia nie generują następnej.
  - damage(0) i heal(0) niczego nie zmieniają; ujemny lub niecałkowity argument jest odrzucony jako nieprawidłowy bez zmiany HP.
  - Health drugiego obiektu nie zmienia się przy operacjach na pierwszym; zwykłe leczenie nie wskrzesza obiektu o zdrowiu 0.
  - Health po śmierci pozostawia właściciela w scenie; usunięcie lub przejście LOST należy do podłączonego zachowania, nie do Health.

**g2d.health.modified** (modified / Samodzielnie) — 0.75 sekundy ochrony
- Polecenie: Ustaw graczowi maxHealth=5 i invulnerabilityAfterHit=0.75 s. Przyjęte trafienie uruchamia ochronę; odrzucone nie przedłuża jej.
- Cel: Odmierzać nietykalność w Health konkretnego gracza.
- Kryteria (widok ucznia):
  - Trafienie 1 w t=0 zmienia zdrowie 5→4 i ustawia lokalną ochronę.
  - Trafienie w t=0.5 jest odrzucone; trafienie w t=0.75 jest przyjęte i daje zdrowie=3.
  - Odrzucone trafienie w t=0.5 nie przesuwa końca pierwszej ochrony na t=1.25.
  - Health przeciwnika z duration=0 przyjmuje kolejne trafienia niezależnie od ochrony gracza.

**g2d.health.independent** (independent / Rozbudowa) — Dwa zagrożenia, jedno trafienie
- Polecenie: Dodaj dwa obiekty ContactDamage, po 1 obrażeniu. PlayerA i PlayerB mają oddzielne Health(3), ochronę 0.75 s. Tylko ich Health decyduje, czy kontakt zada obrażenia. Usunięcie lub wyłączenie zmarłego obiektu wykonuje osobny odbiorca onDeath; Health samo nie niszczy właściciela.
- Cel: Połączyć kontakt i regułę przyjmowania obrażeń.
- Kryteria (widok ucznia):
  - Dwa kontakty z PlayerA w tej samej chwili zabierają łącznie 1 HP, pozostawiając 2.
  - Trafienie PlayerB w tej samej chwili zabiera mu 1 HP mimo ochrony PlayerA.
  - Przy ciągłym kontakcie A przyjmuje następne trafienie dopiero po upływie własnego 0.75 s.
  - Przy dojściu A do 0 zgłoszenie śmierci i usunięcie/wyłączenie zachowania są jednokrotne; B działa dalej.
  - W stanie Game nie ma współdzielonego pola sterującego nietykalnością wszystkich graczy; pomiar dwóch instancji potwierdza niezależność.

## Lekcja 11 — g2d.weapons „Weapon, cooldown i automatyczny atak"
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
- Polecenie: Broń już tworzy pocisk po Space. Dopisz timer=cooldown po strzale, aby rozpocząć oczekiwanie na kolejny atak.
- Cel: Połączyć naciśnięcie, timer i tworzenie pocisku.
- Wyjaśnienie rozwiązania: Ustawienie timera po strzale ogranicza tempo ataku. Kolejne aktualizacje zmniejszają go o delta.
- Kryteria (widok ucznia):
  - Pierwsze nowe Space tworzy jeden pocisk we właściwej pozycji z owner=Player.
  - Trzymanie Space przez 10 aktualizacji nie tworzy kolejnych pocisków.
  - Ponowne Space po 0.2 s jest blokowane; nowe naciśnięcie po 0.6 s od pierwszego jest przyjęte.
  - Przy wcześniejszym ruchu w lewo pocisk leci w lewo; sam Player zachowuje rotation=0.

**g2d.weapons.modified** (modified / Samodzielnie) — Autoatak
- Polecenie: Zmień Weapon na automatyczny: pierwszy strzał po 0.5 s, kolejne co 0.5 s, pod warunkiem obecności żywego celu w zasięgu 200. Timer jest lokalny dla broni.
- Cel: Zastąpić przycisk harmonogramem bez usuwania cooldownu.
- Kryteria (widok ucznia):
  - Przy stale dostępnym, nieśmiertelnym testowym celu do t=0.49 nie ma strzału, do t=0.5 jest jeden, do t=1.5 są trzy.
  - Brak celu przez 2 s daje zero pocisków; jego późniejsze pojawienie się powoduje najwyżej jeden natychmiastowy strzał, bez nadrabiania serii.
  - Naciśnięcie lub trzymanie Space nie przyspiesza autoataku.
  - Dwie instancje Weapon mają niezależne cooldowny i nie blokują się nawzajem.

**g2d.weapons.independent** (independent / Rozbudowa) — Najbliższy poprawny cel
- Polecenie: Weapon szuka najbliższego żywego przeciwnika w zapytaniu kołowym r=200, które obejmuje przecinające je collidery. Kandydatów porównaj po odległości środka jednym przejściem; przy remisie wybierz mniejszy stabilny identyfikator obiektu.
- Cel: Wybrać cel według odległości i reguł gry.
- Kryteria (widok ucznia):
  - Dla wrogów w odległościach 80 i 140 wybierany jest ten w odległości 80 niezależnie od kolejności kolekcji.
  - Zniszczony, nieaktywny, martwy przeciwnik oraz sojusznik nie są poprawnymi celami.
  - Cel z kołem r=10 i środkiem w odległości 210 dotyka obszaru zapytania r=200 i jest dopuszczalny; przy 210.01 nie jest. Bez poprawnego kandydata nie tworzy się pocisk.
  - Dwa jednakowo oddalone poprawne cele dają deterministyczny wybór w Java i JS.
  - Pocisk jedynie celuje przy wystrzale; HP zmniejsza rzeczywisty kontakt z rozdziału 12.

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
- Polecenie: Masz gotowy Pickup i Wallet. Dopisz zwiększenie wallet.gold o wartość zebranej monety.
- Cel: Zmienić stan Wallet w odpowiedzi na kontakt.
- Wyjaśnienie rozwiązania: Trigger wykrywa kontakt bez blokowania ruchu. Zapis nagrody zmienia stan portfela; gotowe usunięcie monety zapobiega podwójnej nagrodzie.
- Kryteria (widok ucznia):
  - Przed kontaktem gold=0 i Coin istnieje.
  - Wejście gracza w Coin daje gold=1 i usuwa Coin po bieżącej fazie kontaktów.
  - Dziesięć dalszych kroków, ponowny kontakt i powtórne żądanie zebrania nie zmieniają gold=1.
  - Moneta nie blokuje ruchu gracza.

**g2d.triggers.modified** (modified / Samodzielnie) — Różne wartości przedmiotów
- Polecenie: Utwórz CoinA wartości 5 i CoinB wartości 10. Pickup przyjmuje gracza mającego Wallet; przeciwnik nie ma Wallet i nie zbiera nagrody.
- Cel: Konfigurować instancje i filtrować odbiorcę.
- Kryteria (widok ucznia):
  - Kontakt Enemy z CoinA nie zmienia stanu monety ani Wallet gracza.
  - Zebranie CoinB i potem CoinA daje kolejno gold=10 i gold=15.
  - Zmiana wartości CoinA na 7 daje w tej samej sekwencji gold=17 bez zmiany kodu logiki.
  - Nakładanie się obu triggerów daje sumę nagród dokładnie raz.

**g2d.triggers.independent** (independent / Rozbudowa) — Skrzynia otwiera się raz
- Polecenie: Napisz Chest: pierwsze wejście gracza daje 20 złota i ustawia opened=true. Skrzynia pozostaje widoczna jako otwarta dekoracja.
- Cel: Utrzymywać stan obiektu po przyznaniu nagrody.
- Kryteria (widok ucznia):
  - Przed kontaktem opened=false,gold=0; po kontakcie opened=true,gold=20.
  - Wyjście i ponowne wejście oraz 20 kroków pozostawiają gold=20.
  - Enemy nie otwiera skrzyni; po jego kontakcie gracz nadal może odebrać nagrodę.
  - Dwie skrzynie mają niezależne opened i razem dają 40 złota.

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
- Polecenie: Masz gotową reakcję na śmierć wroga i orb. Dodaj orb komponent XpOrb(1), aby przechowywał wartość nagrody.
- Cel: Obsłużyć skutek śmierci raz.
- Wyjaśnienie rozwiązania: Wygląd orba nie jest jego wartością. Komponent XpOrb przechowuje XP, które później odbierze gracz.
- Kryteria (widok ucznia):
  - Po śmierci Enemy w (220,120) powstaje jeden XpOrb w (220,120),kills=1.
  - Powtórne obrażenia i kilka kontaktów pocisków w tej samej klatce nie tworzą kolejnych orbów.
  - Po śmierci Enemy nie jest aktywnym celem broni i nie zadaje kontaktowych obrażeń.
  - Śmierć innego Enemy daje drugi osobny orb i kills=2.

**g2d.loot-xp.modified** (modified / Samodzielnie) — Zbieranie doświadczenia
- Polecenie: Dodaj graczowi Experience i zbieranie XpOrb. W tym zadaniu doświadczenie tylko się sumuje; progi awansu dopiszesz dalej. Orb A ma value=3, B value=4.
- Cel: Oddzielić XP od waluty Wallet.
- Kryteria (widok ucznia):
  - Zebranie A i B daje Experience.xp=7 i usuwa oba orby.
  - Wallet.gold pozostaje bez zmian; moneta zwiększa gold i nie zmienia xp.
  - Kontakt przeciwnika z orbem go nie zbiera.
  - Powtórne przetworzenie kontaktu z tym samym orbem nie dodaje ponownie XP.

**g2d.loot-xp.independent** (independent / Rozbudowa) — Dwa awanse z jednego łupu
- Polecenie: Experience startuje z level=1,xp=0,pendingChoices=0. Koszt kolejnego poziomu wynosi 5×bieżący level. Dodawanie XP może przekroczyć kilka progów.
- Cel: Obliczyć progi w pętli i zachować nadwyżkę.
- Kryteria (widok ucznia):
  - Dodanie 4 daje level=1,xp=4,pendingChoices=0; dodanie kolejnego 1 daje level=2,xp=0,pendingChoices=1.
  - Dodanie 16 od stanu początkowego daje level=3,xp=1,pendingChoices=2, bo zużywa 5+10.
  - Przyznanie XP<=0 nie zmienia stanu.
  - Dwa osobne wywołania 8 i 8 dają ten sam wynik co jedno 16.
  - PendingChoices nie jest automatycznie kasowane przez następny update ani przez kolejne XP.

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
- Polecenie: Wywołaj Game.setWorldBounds(0,0,2000,1200), ustaw Player=(400,300), Camera2D.follow(player). Poruszaj gracza po świecie większym niż ekran.
- Cel: Oddzielić granice świata od rozmiaru viewportu.
- Kryteria (widok ucznia):
  - Na viewport 320×200 Player jest rysowany w (160,100), podczas gdy jego world position zmienia się.
  - Na viewport 500×300 środek gracza na ekranie to (250,150).
  - Po przejściu Player za x=640 kamera nadal śledzi go bez ograniczenia do starej szerokości ekranu.
  - Nie ma zmiany prędkości ruchu przy zmianie rozmiaru viewportu.

**g2d.camera.independent** (independent / Rozbudowa) — Wskaż punkt świata
- Polecenie: Napisz CursorMarker: pobierz game.input.getPointerPosition(), sprawdź null przed pierwszym zdarzeniem, przelicz punkt przez Camera2D.screenToWorld i ustaw tam marker świata. Widok ma origin=(60,150).
- Cel: Przeliczyć wejście myszy/touch na świat.
- Kryteria (widok ucznia):
  - Wskaźnik screen=(220,100) ustawia marker world=(280,250).
  - Po zmianie origin na (100,200) ten sam screen point daje world=(320,300).
  - Ponowne przeliczenie world→screen daje pierwotne (220,100) z tolerancją 1e-6.
  - Marker nie przesuwa kamery ani gracza; kliknięcie UI w późniejszych rozdziałach może być odfiltrowane bez zmiany przeliczenia.

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
- Polecenie: Gotowy HUD ma tekst i UITransform. Ustaw jego anchor na TOP_LEFT, aby pozycja (12,12) była odsunięciem od lewego górnego rogu.
- Cel: Umieścić element UI według anchor i pivot.
- Wyjaśnienie rozwiązania: Anchor wskazuje punkt odniesienia na ekranie. HUD pozostaje przy nim po zmianie rozmiaru canvasu i ruchu kamery.
- Kryteria (widok ucznia):
  - Prostokąt UI ma lewy górny róg (12,12) i środek (112,21).
  - Środek tekstu to (112,21), a jego domyślne align=center,baseline=middle.
  - Przesunięcie kamery i resize viewportu nie zmieniają offsetu HUD od lewego górnego rogu.
  - Zmiana Wallet.gold na 5 aktualizuje tekst do „Złoto: 5” bez tworzenia nowego HUD.

**g2d.canvas-ui.modified** (modified / Samodzielnie) — Ten sam prostokąt w Canvas
- Polecenie: W onDrawUI narysuj Canvas.drawRect o środku (80,90), rozmiarach 40×30 i kolorze #76b9f2. Napis „Start” umieść jako center/middle w (80,140).
- Cel: Zrozumieć manualne komendy bez obiektów fizycznych.
- Kryteria (widok ucznia):
  - Prostokąt ma pozycję (80, 90), szerokość 40 px i wysokość 30 px. Tekst jest wyśrodkowany w (80, 140).
  - Rysunek istnieje w każdej klatce także wtedy, gdy nie ma nowego input.
  - Wywołania rysowania nie tworzą GameObject, collidera ani komponentu zachowania.
  - Ruch kamery nie przesuwa manualnego HUD i styl pojedynczego rysunku nie przecieka do kolejnych komend.

**g2d.canvas-ui.independent** (independent / Rozbudowa) — Pasek z nieruchomym lewym brzegiem
- Polecenie: Narysuj pasek o maksymalnej szerokości 200, wysokości 12 i lewym brzegu x=20,yCenter=40. Dla current=3,max=5 szerokość ma wynosić 120. Tekst akapitu pod paskiem wyrównaj jawnie do lewej.
- Cel: Obliczyć geometrię HUD dla zmiennej wartości.
- Kryteria (widok ucznia):
  - Dla 3/5 szerokość=120,środek=(80,40),lewy brzeg=20.
  - Dla 0/5 pasek ma szerokość 0; dla 5/5 szerokość=200,środek=(120,40).
  - Pasek o szerokości 200 px pokazuje od 0% do 100%: ujemna wartość daje pusty pasek, a wartość ponad maksimum daje pełny pasek. Maksimum równe 0 nie powoduje błędu.
  - Tekst akapitu rozpoczyna się w x=20 dzięki jawnemu align=left; po ruchu kamery położenie HUD nie zmienia się.

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
- Polecenie: Dodaj ProgressBar zdrowia i XP oraz tekst poziomu. HUD jest zakotwiczony TOP_LEFT z offsetem (12,12), a panel wyboru CENTER i dopasowuje szerokość do min(360,game.getViewportWidth()-32). HudView odczytuje HP/XP w onLateUpdate trybu UI, po kontaktach i przed rysowaniem.
- Cel: Wyświetlać stan komponentów z poprawnym zakotwiczeniem.
- Kryteria (widok ucznia):
  - Dla HP=3/5 wypełnienie wynosi 0.6; dla XP=4 przy progu 10 wynosi 0.4.
  - Wartości mniejsze od zera i większe od maksimum nie wychodzą poza obrys paska; maksimum 0 nie powoduje błędu.
  - Na viewport 320×200 panel ma szerokość 288, mieści się w ekranie i pozostaje wycentrowany.
  - Na viewport 640×360 panel ma szerokość 360; HUD zachowuje odległość 12 od lewego górnego rogu.
  - Zmiana kamery nie przesuwa UI ani jego obszarów kliknięcia.

**g2d.ui-flow.independent** (independent / Rozbudowa) — Menu obsługiwane klawiaturą
- Polecenie: Po inicjalizacji i otwarciu menu wywołaj Button.focus() na pierwszym przycisku. Tab przechodzi po trzech przyciskach, Shift+Tab wraca, a zwolnienie Enter aktywuje focus. isFocused() pozwala wyróżnić aktywny przycisk; zachowaj skróty 1/2/3. Zamknięcie dezaktywuje przyciski i zwalnia fokus.
- Cel: Zbudować przewidywalną nawigację bez myszy.
- Kryteria (widok ucznia):
  - Po otwarciu focus jest na pierwszym przycisku; Tab daje drugi, trzeci, ponownie pierwszy.
  - Shift+Tab z pierwszego przechodzi na trzeci; Enter wybiera dokładnie ten przycisk.
  - Trzymanie Enter nie przyznaje kolejnych wyborów; nowy poziom wymaga nowego naciśnięcia.
  - Naciśnięcie wskaźnika w przycisku i puszczenie poza nim nie kupuje ulepszenia.
  - Po zamknięciu menu jego focus nie przechwytuje klawiatury gry; po ponownym otwarciu focus jest przewidywalny i widoczny.

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
- Polecenie: Wybór ulepszenia i pauza są gotowe. Dopisz speed.speed+=30 w apply dla wyboru szybkości.
- Cel: Obsłużyć jeden pendingChoice i wrócić do gry.
- Wyjaśnienie rozwiązania: Zmiana parametru istniejącego PlayerController wzmacnia tego gracza. Nie tworzymy drugiego kontrolera ani nowej postaci.
- Kryteria (widok ucznia):
  - Przy speed=120,pendingChoices=1 menu się otwiera i świat stoi.
  - Nowe naciśnięcie 1 daje speed=150,pendingChoices=0, zamyka menu i usuwa tylko powód upgrade.
  - Trzymanie 1 przez kolejne aktualizacje nie dodaje następnych 30.
  - Przy pendingChoices=2 pierwszy wybór pozostawia menu aktywne z pendingChoices=1; drugie nowe naciśnięcie realizuje drugi wybór.

**g2d.upgrades.modified** (modified / Samodzielnie) — Trzy ulepszenia
- Polecenie: Dodaj wybór 2: Weapon.damage+1 oraz wybór 3: cooldown×0.8 z minimum 0.1 s. Wszystkie trzy opcje kosztują jeden pendingChoice.
- Cel: Zmieniać broń przez dane bez obchodzenia jej działania.
- Kryteria (widok ucznia):
  - Wybór 2 zmienia damage=1→2; następny utworzony pocisk zadaje 2 po rzeczywistym kontakcie.
  - Pocisk wystrzelony przed wyborem zachowuje wcześniejsze damage=1.
  - Wybór 3 zmienia cooldown=0.5→0.4; powtarzanie nigdy nie obniża go poniżej 0.1.
  - Niepoprawny klawisz i wybór przy zamkniętym menu nie zmieniają parametrów ani pendingChoices.
  - W jednej aktualizacji można przyznać tylko jedną opcję, nawet gdy naciśnięto 1 i 2 jednocześnie.

**g2d.upgrades.independent** (independent / Rozbudowa) — Sklep za złoto
- Polecenie: Dodaj tryb sklepu: zakup +1 damage kosztuje 20 złota. Sklep i awans korzystają z tej samej definicji efektu, ale awans jest darmowy i zużywa pendingChoice.
- Cel: Współdzielić efekt ulepszenia przy odrębnej autoryzacji zakupu.
- Kryteria (widok ucznia):
  - Przy gold=19 próba zakupu nie zmienia damage ani gold, a sklep pozostaje otwarty z komunikatem braku złota.
  - Przy gold=20 zakup daje gold=0 i damage+1 dokładnie raz, po czym zamyka sklep.
  - Darmowy wybór awansu przy gold=0 nadal działa i nie tworzy ujemnego gold.
  - Wybór sklepu nie zużywa pendingChoice; darmowy awans nie wydaje gold.
  - Trzymanie przycisku zakupu i podwójny event UI nie dokonują ponownej transakcji.

## Lekcja 19 — g2d.feedback „Feedback trafienia, tweeny i floating text"
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

**g2d.feedback.guided** (guided / Z przykładem) — Liniowy lot dekoracji
- Polecenie: Moneta jest gotowa w (160,160). Dodaj Tweens.position(coin,160,100,1), aby w sekundę przesunęła się o 60 px w górę.
- Cel: Przewidzieć wartości interpolacji.
- Wyjaśnienie rozwiązania: Tween interpoluje pozycję w czasie. Przy halfway moneta jest na y=130; po sekundzie na y=100.
- Kryteria (widok ucznia):
  - W t=0.5 pozycja Coin wynosi (160,130); w t=1 wynosi (160,100).
  - Po t=1.5 pozycja pozostaje (160,100).
  - Pierwotny rozmiar i skala Coin nie zmieniają się.
  - Ten sam czas daje te same pozycje w Java i JS; domyślne easing nie jest inne w jednym runtime.

**g2d.feedback.modified** (modified / Samodzielnie) — Shake bez zmiany kolizji
- Polecenie: HitFeedback reaguje tylko na przyjęte obrażenie Health: shake grafiki o sile 8 przez 0.3 s oraz niewielki shake Camera2D. Nie przesuwaj fizycznego Transform gracza. Dodaj floating text po trafieniu: tekst „−1” unosi się o 40 px w 0.5 s, a potem znika.
- Cel: Dodać efekt przy przyjętym trafieniu.
- Kryteria (widok ucznia):
  - Podczas efektu współrzędne świata i collider gracza pozostają takie same jak bez efektu.
  - Podczas wstrząsu sama grafika przesuwa się na każdej osi o wartość od −8 do 8 px względem swojej zwykłej pozycji. W trakcie efektu widać drganie, nie tylko nieruchomy obraz.
  - Po 0.3 s offset wraca do 0; efekt nie kumuluje trwałego przesunięcia.
  - Trafienie odrzucone przez nietykalność nie uruchamia ponownie efektu.
  - HUD nie trzęsie się z kamerą, a działanie kontaktów jest niezmienione.
  - Tylko zaakceptowane obrażenia tworzą DamageText.
  - Po zakończeniu tweenu DamageText jest usunięty.

**g2d.feedback.independent** (independent / Rozbudowa) — Zastąpienie i dwa zegary
- Polecenie: Animuj x z 0 do 100 przez 1 s. W t=0.25 zastąp ten tween nowym do 200 przez 0.5 s. Dodaj natychmiastową skalę duration=0 i puls przycisku w UI podczas pauzy.
- Cel: Poprawnie użyć kontraktu tweenów w interaktywnej grze.
- Kryteria (widok ucznia):
  - W t=0.25 x=25; nowy tween zaczyna z 25, a w t=0.5 x=112.5.
  - W t=0.75 x=200; po t=1.25 nadal 200, bez powrotu do starego celu 100.
  - Tween scale do (2,2) z duration=0 daje taki stan natychmiast.
  - Podczas pauzy WORLD tween świata stoi, ale tween przycisku UI postępuje.
  - Zniszczenie animowanego obiektu usuwa jego aktywne tweeny i nie wykonuje późniejszego zapisu do zniszczonego Transform.
  - Włączenie lub wyłączenie losowego shake nie zmienia sekwencji typów/pozycji spawnów, ponieważ efekty mają oddzielny RNG.

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
- Polecenie: Fabryka tworzy wygląd, zdrowie i kontroler wroga. Dopisz dodanie EnemyAI(target,spec.speed) do tworzonego enemy.
- Cel: Usunąć duplikację tworzenia bez współdzielenia stanu.
- Wyjaśnienie rozwiązania: Fabryka składa zachowania. Jeden dodatkowy komponent daje wszystkim jednostkom tworzonym według konfiguracji własny pościg.
- Kryteria (widok ucznia):
  - Dwa Slime mają oddzielne Health,EnemyAI i collider; uszkodzenie pierwszego nie uszkadza drugiego.
  - Bat otrzymuje HP=2,speed=80,radius=10 i właściwą teksturę.
  - Zmiana hp żywej instancji nie zmienia EnemySpec ani przyszłej wartości początkowej.
  - Scena tworzy oba typy przez tę samą fabrykę zamiast kopiować konfigurację do obsługi kolejnych fal.

**g2d.composition.modified** (modified / Samodzielnie) — Trzeci typ z tych samych klocków
- Polecenie: Dodaj Ghost: hp=3,speed=35,radius=12,Sprite ghost. Używa istniejących EnemyAI,Health,LootOnDeath. Broń identyfikuje przeciwników regułą zespołu/roli, nie listą nazw.
- Cel: Rozszerzyć grę bez warunków zależnych od nazw.
- Kryteria (widok ucznia):
  - Ghost rzeczywiście ściga, otrzymuje obrażenia, umiera i pozostawia XP tak samo jak inne typy.
  - Nazwanie instancji Ghost_17 zamiast Ghost nie wyklucza jej z celowania ani kontaktów.
  - Zmiana danych Ghost nie zmienia zachowania Slime i Bat.
  - Dodanie nowego typu wymaga nowej definicji danych i wywołania fabryki, bez dopisywania wyjątków w Weapon,Health oraz XpPickup.

**g2d.composition.independent** (independent / Rozbudowa) — Dwie bronie w Loadout
- Polecenie: Napisz Loadout zawierający referencje do dwóch broni należących do Player. Dagger: cooldown=0.5,damage=1; Orb: cooldown=1,damage=2. Obie automatyczne; pierwszy strzał po swoim cooldownie.
- Cel: Skomponować niezależne timery i wspólnego właściciela.
- Kryteria (widok ucznia):
  - Przy stałym celu do t=1 Dagger oddaje dwa strzały, Orb jeden; ich timery nie są współdzielone.
  - Każdy pocisk ma owner=Player i damage zgodne z bronią, która go utworzyła.
  - Wyłączenie jednej broni nie wyłącza drugiej ani ruchu gracza.
  - Ulepszenie obrażeń całego Loadout zwiększa przyszłe pociski obu broni o 1, bez zmiany już lecących.
  - Bronie odczytują pozycję i Health właściciela przez referencję; parametrów obu broni nie przenosi się do globalnych pól Game.

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
- Polecenie: Gotowy start składa nową rundę. Dopisz state="RUNNING" na końcu start, aby stan gry odpowiadał utworzonej scenie.
- Cel: Rozpocząć czas rozgrywki dopiero po świadomej akcji.
- Wyjaśnienie rozwiązania: RUNNING oznacza trwającą rundę. UI oraz reguły końca rundy korzystają z tego samego stanu, zamiast niezależnych flag.
- Kryteria (widok ucznia):
  - W READY czas świata=0, brak aktywnej walki i spawnów mimo 5 s działania UI.
  - Start przełącza do RUNNING dokładnie raz i tworzy jednego gracza z właściwą konfiguracją.
  - Przytrzymanie Enter lub podwójny click nie uruchamia dwóch pętli ani dwóch graczy.
  - Input ze Start nie staje się strzałem lub wyborem ulepszenia w tej samej klatce.

**g2d.run-state.modified** (modified / Samodzielnie) — Przegrana i czytelny wynik
- Polecenie: Po śmierci głównego gracza przejdź do LOST, zatrzymaj WORLD i pokaż przeżyty czas, poziom, pokonanych oraz przycisk Restart.
- Cel: Obsłużyć śmierć gracza na poziomie rozgrywki.
- Kryteria (widok ucznia):
  - Pierwsze zejście Health gracza do 0 zmienia stan na LOST; kolejne sygnały nie tworzą następnych paneli.
  - W LOST nie zmieniają się czas świata, fala, pociski ani wyniki walki.
  - Panel pokazuje końcowe wartości RunStats i Experience zapisane przed zamrożeniem.
  - UI nadal przyjmuje kliknięcie Restart i klawiaturę, choć symulacja stoi.

**g2d.run-state.independent** (independent / Rozbudowa) — Nowa gra i cel przetrwania
- Polecenie: W RunController.onLateUpdate, po kontaktach kroku, dodaj WON po 120 s czasu symulacji przy żywym graczu. Jeżeli w końcowym kroku gracz otrzyma śmiertelny cios, pierwszeństwo ma LOST; onDeath może ustawić LOST i pauzę od razu. Restart tworzy świeży przebieg z seed=42.
- Cel: Zachować jednoznaczne przejścia i czysty nowy przebieg.
- Kryteria (widok ucznia):
  - Żywy gracz w t=119.95 pozostaje RUNNING; po osiągnięciu 120 s jest WON.
  - Śmiertelne trafienie w końcowym kroku daje LOST, bez jednoczesnego panelu WON.
  - Restart zeruje czas,falę,kills,gold,xp,pendingChoices,ulepszenia i przywraca bazowe HP/prędkość/bronie.
  - Po trzech restartach istnieje tylko jeden aktywny zestaw gracza, spawnera, HUD oraz wejścia; stare tweeny i referencje są wycofane.
  - Ponowny start z seed=42 odtwarza pierwsze pozycje spawnów; restart gry nie resetuje zapisanych prac ani zaliczeń kursu.

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
- Polecenie: Test obciążenia już tworzy pociski. Dopisz shots++ po każdym faktycznie utworzonym pocisku, aby raport liczył operacje.
- Cel: Wykazać ograniczoną liczbę obiektów.
- Wyjaśnienie rozwiązania: Licznik mierzy to, co wykonano, a nie liczbę klatek. Razem z liczbą aktywnych obiektów pomaga ocenić koszt symulacji.
- Kryteria (widok ucznia):
  - Po ustaleniu rytmu liczba żywych pocisków nie przekracza 6, mimo ponad 90 utworzonych łącznie.
  - Po 1.1 s od ostatniego strzału aktywnych pocisków jest 0.
  - Usunięte pociski nie pozostają w aktywnych kontaktach, aktualizacjach ani tweenach.
  - Po powtórzeniu całego scenariusza wynik liczby aktywnych obiektów jest taki sam.

**g2d.performance.modified** (modified / Samodzielnie) — Celowanie jednym przejściem
- Polecenie: Wybieraj najbliższy poprawny cel jednym przejściem dopiero przy gotowej broni. Fixture testowe liczy oceny odległości.
- Cel: Usunąć wielokrotne liczenie odległości i sortowanie całej listy.
- Kryteria (widok ucznia):
  - Dla 1000 poprawnych kandydatów jeden wybór ocenia najwyżej 1000 odległości.
  - Przy 10 wyborach limit wynosi 10000, a nie koszt wielokrotnego sortowania przy każdym update.
  - Wybrany cel jest identyczny jak w referencyjnym poprawnym algorytmie dla losowych i remisowych danych.
  - Podczas dodatniego cooldownu nie wykonujesz nowego pełnego wyszukiwania przy każdej klatce.
  - Martwe i nieaktywne obiekty nadal są odrzucane; optymalizacja nie zmienia reguł celowania.

**g2d.performance.independent** (independent / Rozbudowa) — Minuta obciążenia bez narastania
- Polecenie: Przygotuj 60 s deterministycznego obciążenia: do 200 wrogów, maksymalnie 300 aktywnych pocisków i 200 orbów XP. Przy limicie XP połącz nagrody z zachowaniem ich sumy. Użyj profilu z tej samej definicji na obu runtime. Wyeksportuj pełny projekt, odtwórz go przez import i ponownie uruchom; zapisz wynik oraz pomiar w REPORT.md.
- Cel: Złożyć grę z jawnymi limitami i zachować nagrody.
- Kryteria (widok ucznia):
  - Przez cały przebieg żaden limit aktywnych obiektów nie jest przekroczony po zakończeniu kroku.
  - Suma XP zebrana przez gracza plus XP pozostająca w świecie równa się XP wytworzonej przez zabitych wrogów; łączenie nie gubi nagród.
  - Po zatrzymaniu spawnera, zniszczeniu wrogów i zebraniu XP pozostają tylko obiekty bazowe; po maksymalnym lifetime nie ma pocisków.
  - Dziesięć startów i zakończeń nie zwiększa liczby aktywnych listenerów, timerów, kontaktów ani tweenów.
  - Raport zawiera liczby obiektów i operacji oraz opis urządzenia dla pomiaru FPS/p95; brak pomiaru FPS nie jest zastępowany zmyśloną wartością.
  - Eksport zawiera wszystkie pliki, język i wersję API; po imporcie projekt uruchamia się.

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

**g2d.survivor.guided** (guided / Z przykładem) — Działający rdzeń survivor
- Polecenie: Gotowa arena ma ruch, walkę, fale i rozwój. Ustaw zasięg Weapon gracza na 240 px, uruchom rundę i sprawdź automatyczny atak.
- Cel: Złożyć pierwszą grywalną wersję z własnych komponentów.
- Wyjaśnienie rozwiązania: Parametr range określa, które cele rozważa broń. Ta mała konfiguracja zmienia zasięg walki bez kopiowania mechaniki.
- Kryteria (widok ucznia):
  - Player porusza się WASD/strzałkami w tempie 120, bez szybszej przekątnej; sprite i collider mają wspólny środek.
  - Broń działa bez przycisku ataku i wybiera najbliższego żywego wroga w range=240; obrażenia są skutkiem kontaktu pocisku.
  - Każdy Slime goni gracza; śmierć zwiększa kills raz i daje jeden orb 1 XP.
  - Zebranie 5 XP daje level=2 i jeden pendingChoice; wybór szybkości zwiększa speed 120→150 raz.
  - Health gracza chroni go 0.75 s między przyjętymi obrażeniami niezależnie od liczby stykających się wrogów.
  - Kamera śledzi świat, HUD zdrowia/XP/poziomu pozostaje na ekranie.

**g2d.survivor.modified** (modified / Samodzielnie) — Pełna runda i rozwój postaci
- Polecenie: Rozbuduj grę do czterech fal zaczynających się w t=0,30,60,90 s; interwały 1.5,1,0.75,0.5 s. Od fali 2 losuj także Bat HP=1,speed=65; od fali 3 Ghost HP=3,speed=35. Fala 4 używa wszystkich typów. Dodaj trzy ulepszenia, pełną pauzę, start/przegraną/zwycięstwo w 120 s i restart.
- Cel: Dodać eskalację, kompletne menu oraz warunki końca.
- Kryteria (widok ucznia):
  - Numer fali przełącza się dokładnie w 30,60,90 s symulacji, a skład typów i interwały odpowiadają definicjom.
  - Przy seed=42 sekwencja typów i pozycji jest powtarzalna; wszyscy przeciwnicy zachowują pionowe sprite’y.
  - Menu awansu zatrzymuje ruch,kontakty,broń,pociski,lifetime,ochronę,spawn,tweeny i czas rundy; przyciski i skróty UI nadal działają.
  - Ulepszenia szybkość+30,damage+1,cooldown×0.8(min0.1) są stosowane raz do właściwych komponentów.
  - HP=0 kończy rundę przegraną; 120 s przy żywym graczu kończy zwycięstwem; wyniki i przycisk Restart są widoczne.
  - Po restarcie wszystkie parametry i zegary nowej rundy wracają do wartości początkowych.

**g2d.survivor.independent** (independent / Rozbudowa) — Własny wariant i kompletny projekt
- Polecenie: Dodaj drugą auto broń Orb: cooldown=1,damage=2,speedPocisku=220,lifetime=3,range=240; własny wygląd areny oraz jedną skrzynię 20 złota otwierającą sklep +1 damage za 20. Utrzymaj reguły XP. Oddaj kompletny projekt w wybranym języku z instrukcją sterowania i opisem jednej świadomej zmiany balansu. Pełny port do drugiego języka jest opcjonalnym rozszerzeniem.
- Cel: Dostarczyć w swoim języku kompletną grę z drugą bronią, nagrodami i mierzalnym działaniem.
- Kryteria (widok ucznia):
  - Obie bronie strzelają według niezależnych timerów, a ich pociski mają właściwego właściciela i obrażenia; ulepszenie damage całego Loadout obejmuje przyszłe strzały obu.
  - Skrzynia daje 20 złota tylko graczowi i tylko raz; zakup odejmuje 20 i przyznaje jeden efekt. XP oraz darmowe wybory pozostają niezależne.
  - Wspólny deterministyczny przebieg obejmuje ruch,trafienie,śmierć wroga,zbiór XP,awans,5 s pauzy UI,wybór i restart; projekt ucznia przechodzi te warunki w wybranym języku, a para rozwiązań autorów przechodzi je w obu.
  - Osobny 120-sekundowy scenariusz osiąga zwycięstwo, a wymuszony scenariusz śmierci pokazuje przegraną; nie wystarcza zmiana napisu numeru fali.
  - Próba obciążenia przestrzega limitów 200 wrogów,300 pocisków,200 orbów i zachowuje sumę XP; po restarcie nie pozostają aktywne obiekty poprzedniej rundy.
  - Eksport projektu otwiera się w czystej sesji odpowiedniego Labu z engineApiVersion=2.0.0, wszystkimi własnymi plikami i instrukcją WASD/strzałki,Escape,1–3/kliknięcie,Restart; uczeń nie musi oddawać drugiej wersji językowej.
  - Własny wygląd zachowuje czytelny HUD i kontrast celów; instrukcja określa dokładną zmienioną wartość balansu oraz porównuje jej zauważalne skutki w co najmniej dwóch przebiegach.
