from pathlib import Path
import json,math,re
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/courses'; OUT.mkdir(parents=True,exist_ok=True)
ASSETS=ROOT/'docs/course-assets'
for name,file in [('Body','arial.ttf'),('Bold','arialbd.ttf'),('Code','consola.ttf')]:
 pdfmetrics.registerFont(TTFont(name,'C:/Windows/Fonts/'+file))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold')
W,H=595.28,841.89
navy=HexColor('#102b46');teal=HexColor('#008f95')
style=ParagraphStyle('body',fontName='Body',fontSize=10.5,leading=15.5,textColor=navy)
examples=[]; documents=[]
def document(file,title):
 global c,page,y,current_file
 current_file=file; page=0; c=canvas.Canvas(str(OUT/file),pagesize=(W,H));c.setTitle(title);c.setAuthor('Java Lab');documents.append({'file':file,'title':title})
def start(label,title):
 global page,y
 page+=1;c.setFillColor(teal);c.rect(40,H-48,38,4,fill=1,stroke=0);c.setFont('Bold',10);c.drawString(88,H-47,'GAMEDEV JAVA / '+label)
 c.setFillColor(navy);size=24
 while pdfmetrics.stringWidth(title,'Bold',size)>W-80:size-=.5
 c.setFont('Bold',size);c.drawString(40,H-90,title);y=H-115
 c.bookmarkPage('page'+str(page));c.addOutlineEntry(title,'page'+str(page),0)
def text(s):
 global y
 p=Paragraph(s,style);_,h=p.wrap(W-80,H);p.drawOn(c,40,y-h);y-=h+12
def sub(s):
 global y
 c.setFillColor(teal);c.setFont('Bold',13);c.drawString(40,y-15,s);y-=28

def code(s,kind='create',context=''):
 global y
 s=s.strip('\n'); lines=s.splitlines();size=9
 if max(pdfmetrics.stringWidth(line,'Code',size) for line in lines)>W-102:raise ValueError(('long code line',current_file,page))
 h=len(lines)*12+22;c.setFillColor(HexColor('#edf4f8'));c.roundRect(40,y-h,W-80,h,8,fill=1,stroke=0);c.setFillColor(navy);c.setFont('Code',size)
 for j,line in enumerate(lines):c.drawString(51,y-17-j*12,line)
 y-=h+14;examples.append({'document':current_file,'page':page,'kind':kind,'code':s,'context':context})
def art(name,height=300):
 global y
 c.drawImage(str(ASSETS/(name+'.webp')),40,y-height,width=W-80,height=height,mask='auto');y-=height+16

def chart(title,fn,duration=1,height=95):
 global y
 sub(title);x0=76;bottom=y-height-10;width=W-130
 c.setFont('Body',8.5)
 for v in [0,.25,.5,.75,1]:
  c.setStrokeColor(HexColor('#dbe5eb'));c.line(x0,bottom+height*v,x0+width,bottom+height*v);c.setFillColor(navy);c.drawRightString(x0-8,bottom+height*v-3,str(round(v*100))+'%')
 c.setStrokeColor(teal);c.setLineWidth(2);path=c.beginPath()
 for i in range(201):
  t=i/200;x=x0+width*t;yy=bottom+height*fn(t)
  if i==0:path.moveTo(x,yy)
  else:path.lineTo(x,yy)
 c.drawPath(path);c.setFillColor(navy)
 for t in [0,.25,.5,.75,1]:c.drawCentredString(x0+width*t,bottom-15,f'{duration*t:g} s')
 y=bottom-32

def end():
 assert y>58,(current_file,page,y)
 c.setStrokeColor(HexColor('#dbe5eb'));c.line(40,44,W-40,44);c.setFillColor(navy);c.setFont('Body',8.5);c.drawString(40,28,'Java Lab · GameLab 2D · kod Java zgodny z API laboratorium');c.drawRightString(W-40,28,str(page));c.showPage()
def finish(expected):
 assert page==expected,(current_file,page);documents[-1]['pages']=page;c.save()

document('kurs-gamedev-java.pdf','GameDev Java — współrzędne, cykl życia i komponenty')
start('WPROWADZENIE','Pierwsza gra w Javie')
art('plansza-3')
text('Pracujesz w Java Lab, w ścieżce Game Dev albo we własnym projekcie Playground. Kod sceny zapisujesz w <b>GameMain.java</b>, a własne komponenty w osobnych plikach Java. RUN uruchamia scenę; nie dopisujesz wywołania GameLab.run().')
sub('Po tym kursie potrafisz')
text('1. Odczytać pozycję i rozmiar obiektu.<br/>2. Oddzielić tworzenie sceny od aktualizacji w czasie.<br/>3. Złożyć gracza z komponentów i napisać sterowanie WASD.')
text('Wymagane podstawy: zmienne, klasy, metoda i instrukcja if. Każdy pełny plik zawiera import engine.*; edytor Java Lab udostępnia ten sam silnik. Przewiduj wynik przed RUN i porównuj go z zachowaniem gry.')
end()
start('01 / WSPÓŁRZĘDNE','Pozycja to środek obiektu')
art('plansza-1')
text('Bez przesuniętej kamery punkt (0, 0) jest w lewym górnym rogu planszy. X rośnie w prawo, Y w dół. Pozycja obiektu oznacza jego <b>środek</b>, a szerokość i wysokość opisują rozmiar grafiki.')
code('GameObject player = createObject("Player");\nplayer.setPosition(160, 100);\nplayer.addComponent(new ShapeRenderer(32, 32, "#008f95"));')
text('<b>Przewidź:</b> ruch o 40 px w prawo z (160, 100) daje (200, 100). Ruch o 30 px w górę daje (160, 70). Gracz w (100, 100) o wymiarach 32 × 32 px ma po 16 px grafiki z każdej strony środka.')
end()
start('02 / CYKL ŻYCIA','Twórz raz, aktualizuj wiele razy')
art('plansza-2',275)
code('import engine.*;\npublic class GameMain extends Game {\n    @Override public void onCreate() {\n        // Utwórz obiekty i dodaj komponenty.\n    }\n    @Override public void onUpdate(double delta) {\n        // Aktualizuj stan gry.\n    }\n}',kind='class')
text('<b>onCreate()</b> buduje scenę. <b>onUpdate(double delta)</b> wykonuje się wielokrotnie. Delta to czas w sekundach od poprzedniej aktualizacji; 60 FPS jest przykładem, a nie gwarancją. Nie twórz kolejnego gracza w każdej klatce.')
end()
start('03 / KOMPONENTY','Obiekt ma stan i zachowania')
art('plansza-3')
text('<b>GameObject</b> reprezentuje Player. Jego <b>Transform</b> już istnieje i przechowuje pozycję, obrót oraz skalę. Pozostałe komponenty dodajesz przez addComponent(new ...).')
text('<b>ShapeRenderer</b> rysuje kształt. <b>Sprite</b> rysuje teksturę. <b>CharacterController2D</b> wykonuje ruch. <b>PlayerMove</b> z następnej strony odczytuje klawiaturę. <b>Collider2D</b> określa obszar kolizji.')
text('Brak renderera nie usuwa obiektu, ale może sprawić, że go nie widzisz. Sam renderer nie dodaje sterowania. W Javie pobierasz komponent przez getComponent(CharacterController2D.class).')
end()
start('PRAKTYKA / 1','GameMain.java: zbuduj gracza')
text('W Playground umieść poniższy kod w GameMain.java. Dodaj także plik PlayerMove.java z kolejnej strony. Każda publiczna klasa ma własny plik o tej samej nazwie.')
code('import engine.*;\n\npublic class GameMain extends Game {\n    @Override public void onCreate() {\n        GameObject player = createObject("Player");\n        player.setPosition(160, 100);\n        player.addComponent(\n            new ShapeRenderer(32, 32, "#008f95")\n        );\n        player.addComponent(new CharacterController2D());\n        player.addComponent(new PlayerMove());\n    }\n    @Override public void onUpdate(double delta) {}\n}',kind='class-player')
sub('Sprawdź wynik')
text('Widzisz jeden kwadrat o szerokości 32 px i wysokości 32 px. Jego środek znajduje się w (160, 100). Kliknij planszę przed użyciem WASD, aby otrzymała fokus klawiatury.')
text('Kolejność: utwórz obiekt → ustaw pozycję → dodaj wygląd → dodaj kontroler → dodaj własne sterowanie. Oddzielne instrukcje ułatwiają znalezienie błędu.')
end()
start('PRAKTYKA / 2','PlayerMove.java: sterowanie WASD')
code('import engine.*;\n\npublic class PlayerMove extends Component {\n    @Override public void onUpdate(double delta) {\n        CharacterController2D controller =\n            getComponent(CharacterController2D.class);\n        InputManager input = getGame().input;\n        double x = 0;\n        double y = 0;\n        if (input.isKeyDown("a")) x -= 1;\n        if (input.isKeyDown("d")) x += 1;\n        if (input.isKeyDown("w")) y -= 1;\n        if (input.isKeyDown("s")) y += 1;\n        controller.move(x, y, 120);\n    }\n}',kind='class')
text('A i D zmieniają kierunek osi X, a W i S osi Y. Bez wciśniętego klawisza kierunek wynosi (0, 0). Kontroler normalizuje ruch po skosie, aby nie był szybszy.')
text('<b>120 oznacza prędkość w px/s.</b> Kontroler sam uwzględnia czas. Nie przekazuj 120 * delta jako prędkości: pomnożyłbyś czas drugi raz. Własny komponent korzysta z getGame().input, a scena GameMain może używać bezpośrednio input.')
sub('Zmień i sprawdź')
text('Ustaw start w (320, 180), prędkość 180 px/s i inny kolor. Usuń na chwilę PlayerMove. Wyjaśnij, dlaczego kwadrat pozostaje widoczny, ale przestaje reagować na klawisze.')
end()
start('CZAS / 04','Delta: ruch niezależny od FPS')
text('Jeśli sam aktualizujesz pozycję bez kontrolera, obliczasz drogę jako prędkość × czas. Poniższy komponent przesuwa obiekt w prawo z prędkością 90 px/s.')
code('import engine.*;\npublic class AutoMove extends Component {\n    @Override public void onUpdate(double delta) {\n        transform.x += 90 * delta;\n    }\n}',kind='class')
text('Przy delta = 0,02 przesunięcie wynosi 1,8 px. Przy delta = 0,01 wynosi 0,9 px. Po tej samej sekundzie łączna droga ma być podobna. Nie łącz AutoMove i PlayerMove, jeżeli oba sterują tą samą pozycją.')
sub('Mini-projekt: gracz i znacznik')
text('Player: pozycja (80, 80), szerokość 32 px, wysokość 32 px, WASD i prędkość 120 px/s. Marker: pozycja (320, 180), szerokość 24 px, wysokość 24 px, kolor pomarańczowy, bez sterowania.')
code('GameObject marker = createObject("Marker");\nmarker.setPosition(320, 180);\nmarker.addComponent(new ShapeRenderer(24, 24, "#ff8c28"));')
end()
start('PODSUMOWANIE','Sprawdź rozumienie i typowe błędy')
sub('Kryteria mini-projektu')
text('1. Powstają dokładnie dwa obiekty, oba w onCreate().<br/>2. Player ma rozmiar 32 × 32 px; Marker 24 × 24 px.<br/>3. Tylko Player ma kontroler i PlayerMove.<br/>4. Po puszczeniu klawiszy ruch ustaje.<br/>5. Ruch w górę zmniejsza Y.')
sub('Typowe błędy')
text('<b>Nieznana klasa:</b> sprawdź nazwę pliku, wielkość liter i import engine.*.<br/><b>NullPointerException przy move:</b> dodaj CharacterController2D przed sterowaniem.<br/><b>Obiektów stale przybywa:</b> przenieś createObject() z onUpdate() do onCreate().<br/><b>Brak ruchu:</b> kliknij planszę, sprawdź klawisze i obecność PlayerMove.')
sub('Pytania i odpowiedzi')
text('Czy Transform trzeba dodać ręcznie? <b>Nie.</b><br/>Czy szerokość 32 oznacza pozycję X = 32? <b>Nie: rozmiar i pozycja to inne wielkości.</b><br/>Czy renderer zapewnia sterowanie? <b>Nie.</b><br/>Ile wynosi 90 × 0,02? <b>1,8 px.</b><br/>Co wywołuje RUN? <b>Silnik tworzy nową scenę i uruchamia jej cykl życia.</b>')
text('Dalszy krok: kamera i HUD, potem animacje. Fragmenty kodu dodawaj w opisanej metodzie; pełne klasy zapisuj w osobnych plikach Java.')
end();finish(8)

document('kurs-gamedev-java-kamera-ui.pdf','GameDev Java — kamera, viewport i HUD')
start('KAMERA / 01','Świat, kamera i viewport')
art('kamera')
text('<b>Świat</b> zawiera pozycje obiektów. <b>Kamera</b> wybiera widoczny fragment świata. <b>Viewport</b> jest obszarem planszy canvas, nie całym oknem przeglądarki.')
text('Ilustracja pokazuje ogólną ideę; obecne API Java Camera2D przesuwa widok, ale nie udostępnia zoomu. Powiększenie canvasu przez CSS nie jest zmianą pozycji obiektów ani fizyki.')
text('<b>HUD</b> to tekst lub inne elementy przypięte do ekranu. Gdy kamera przesuwa mapę, licznik punktów powinien pozostać w tym samym miejscu.')
end()
start('KAMERA / 02','Śledzenie gracza')
text('Dodaj te instrukcje do onCreate() po przygotowaniu gracza z poprzedniego kursu. Nazwa player wskazuje już istniejący obiekt, nie nową kopię postaci.')
code('GameObject cameraObject = createObject("Camera");\nCamera2D camera = cameraObject.addComponent(new Camera2D());\ncamera.follow(player);\nCharacterController2D controller =\n    player.getComponent(CharacterController2D.class);\ncontroller.constrainToBounds = false;',context='GameObject player = createObject("Player");\nplayer.addComponent(new CharacterController2D());')
text('<b>constrainToBounds = false</b> pozwala wyjść poza początkowy obszar canvasu. Własne ściany i granice mapy przygotowujesz osobno. Java używa tej nazwy pola; nie kopiuj innej nazwy z kodu JavaScript.')
sub('Przelicz pozycję')
text('Bez zoomu i drżenia: ekran = świat − przesunięcie widoku. Gdy Player jest w (500, 300), a canvas ma 640 × 360, follow ustawia widok tak, aby Player był w (320, 180) na ekranie.')
code('Vector2 world = new Vector2(700, 300);\nVector2 screen = camera.worldToScreen(world);\n// Dla przykładu powyżej: screen = (520, 180).',context='GameObject target = createObject("Player");\nCamera2D camera = createObject("Camera").addComponent(new Camera2D());\ncamera.follow(target);')
end()
start('KAMERA / 03','Offset i znaczniki świata')
text('Kontynuuj onCreate() z poprzedniej strony. Samo przestawienie Transform obiektu Camera nie steruje widokiem: używaj follow(), stopFollowing() i offsetX/offsetY.')
code('camera.stopFollowing();\ncamera.offsetX = 180;\ncamera.offsetY = 120;\n// Powrót do śledzenia bez dodatkowego przesunięcia:\ncamera.offsetX = 0;\ncamera.offsetY = 0;\ncamera.follow(player);\ncamera.shake(4, 0.2);',context='GameObject player = createObject("Player");\nCamera2D camera = createObject("Camera").addComponent(new Camera2D());')
text('Przy śledzeniu offset jest dodawany do przesunięcia widoku. Dodatni offsetX przesuwa widok w prawo, więc obiekty wyglądają na przesunięte w lewo. Shake drży obrazem, bez przesuwania fizycznego gracza.')
code('GameObject ground = createObject("Ground");\nground.addComponent(new TileMap(Assets.GRASS, 32));\nGameObject marker = createObject("Marker");\nmarker.setPosition(700, 300);\nmarker.addComponent(new Sprite(Assets.CHEST, 32, 32));')
text('TileMap tworzy powtarzalne tło, a nie gotową mapę z kolizjami. Przy Player w (500, 300), canvasie 640 × 360 i follow(), Marker w (700, 300) jest na ekranie w (520, 180). OffsetX = 40 zmienia ekranowe X na 480.')
end()
start('HUD / 04','TextRenderer w przestrzeni ekranu')
text('Poniższy pełny przykład zapisujesz w GameMain.java. W Javie tekst aktualizujesz przez pole score.text. Nie przekazujesz funkcji JavaScript do konstruktora TextRenderer.')
code('import engine.*;\npublic class GameMain extends Game {\n    private int points = 0;\n    private TextRenderer score;\n    @Override public void onCreate() {\n        GameObject hud = createObject("HUD");\n        hud.setPosition(12, 24);\n        score = hud.addComponent(\n            new TextRenderer("Punkty: 0", 18, "#ffffff")\n        );\n        score.space = "screen";\n        score.align = "left";\n        score.baseline = "alphabetic";\n    }\n    @Override public void onUpdate(double delta) {\n        if (input.isKeyPressed("Space")) points++;\n        score.text = "Punkty: " + points;\n    }\n}',kind='class')
text('<b>space = "screen"</b> odłącza tekst od ruchu kamery. <b>align = "left"</b> przypina lewy brzeg tekstu do X = 12. Przy baseline = "alphabetic" Y = 24 oznacza linię bazową tekstu.')
text('isKeyPressed reaguje raz na nowe naciśnięcie. isKeyDown oznacza przytrzymanie i dodawałby punkty wielokrotnie. Własny komponent używa getGame().input zamiast input sceny.')
end()
start('ZADANIE / 05','Mapa się przesuwa, HUD zostaje')
text('Połącz gracza WASD z kamerą śledzącą, tłem i HUD-em. Dodaj trzy skrzynki o rozmiarze 32 × 32 px w pozycjach (100, 100), (700, 300) i (900, 600). Wyłącz constrainToBounds w kontrolerze gracza.')
sub('Kryteria zaliczenia')
text('1. Przy offsetach 0 gracz jest w środku widoku.<br/>2. Ruch kamery nie zmienia pozycji skrzynek w świecie.<br/>3. HUD pozostaje przy ekranie.<br/>4. Nowe naciśnięcie spacji dodaje jeden punkt; przytrzymanie nie dodaje go co klatkę.<br/>5. Możesz wyjść poza szerokość początkowego canvasu.')
sub('Sprawdź i wyjaśnij')
text('Czy obiekt poza ekranem znika? <b>Nie.</b><br/>Czy kamera przesuwa collidery w świecie? <b>Nie.</b><br/>Czy setPosition() obiektu Camera zastępuje follow()? <b>Nie.</b><br/>Czy API Camera2D ma zoom? <b>Nie w tej wersji.</b><br/>Jak HUD pozostaje na ekranie? <b>TextRenderer.space = "screen".</b>')
text('Wariant: zamiast zwykłej pozycji HUD użyj UITransform i kotwic z dokumentacji silnika. Wprowadzaj jedną zmianę naraz, aby oddzielić błędy świata, kamery i interfejsu.')
end();finish(5)

document('kurs-gamedev-java-tweeny.pdf','GameDev Java — tweeny, PingPong i FadeOut')
start('TWEENY / 01','Od początku do celu')
art('tweeny')
text('Tween zmienia właściwość obiektu przez określony czas. Postęp czasu to elapsed / duration, od 0 do 1. Easing przekształca ten postęp w część zmiany wartości.')
text('Java Lab udostępnia Tweens.position(), scale(), rotation() i shake(). <b>PingPong, FadeOut i Pulse w tym materiale są własnymi komponentami</b>, które dopiero napiszesz. Nie są gotowymi metodami Tweens.')
text('Pozycja i czas to różne wielkości: 50% czasu nie musi oznaczać 50% drogi. Ilustracja pokazuje ideę, a dokładny przebieg odczytuj z wykresów na kolejnych stronach.')
end()
start('TWEENY / 02','Linear i smooth: czytaj wykres')
chart('Linear: równomierna zmiana wartości',lambda t:t)
chart('Smooth: wolniejszy start i zakończenie',lambda t:t*t*(3-2*t))
text('Oś X przedstawia czas, a Y część zmiany wartości. Linear: e = t. Smooth: e = t² × (3 − 2t). Nachylenie wykresu pokazuje szybkość zmiany, a nie liczbę klatek.')
text('Przy t = 0,25 linear daje 25%, a smooth 15,625%. Dla ruchu X od 100 do 300 oznacza to odpowiednio X = 150 i X = 131,25. W połowie czasu obie krzywe osiągają połowę zmiany.')
end()
start('TWEENY / 03','Pozycja, skala, obrót i drżenie')
text('Fragment do onCreate(). Ustaw easing jawnie, żeby wynik ćwiczenia nie zależał od wartości domyślnej. W obecnym API Java domyślny Tween.easing ma wartość "linear".')
code('GameObject object = createObject("Animated");\nobject.addComponent(new Sprite(Assets.CHEST, 32, 32));\nTween movement = Tweens.position(object, 300, 100, 1);\nmovement.easing = "linear";\nTween pulse = Tweens.scale(object, 1.3, 1.3, 0.3);\npulse.easing = "smooth";\nTweens.rotation(object, Math.PI / 2, 0.5);\nTweens.shake(object, 6, 0.2);')
text('Skala 1,3 to 130% rozmiaru bazowego. Obrót jest w radianach: Math.PI / 2 to 90°. Shake zmienia visualOffset, bez zmiany położenia fizycznego. Skala grafiki nie powiększa automatycznie collidera.')
code('Tween movement = Tweens.position(object, 300, 100, 1);\nmovement.onComplete(() -> System.out.println("Cel osiągnięty"));\n// Jeżeli chcesz przerwać animację:\nmovement.cancel();',context='GameObject object = createObject("Animated");')
text('Naturalne zakończenie wywołuje callback; cancel() nie oznacza completed = true. Nowy tween tej samej właściwości zastępuje poprzedni. Nie twórz tweena bezwarunkowo w każdej aktualizacji.')
end()
start('PINGPONG / 04','Tam i z powrotem')
chart('Pozycja na drodze A → B → A',lambda t:2*t if t<=.5 else 2*(1-t),2,75)
code('import engine.*;\npublic class PingPong extends Component {\n    private double a, b;\n    private boolean toB = true;\n    private Tween tween;\n    @Override public void onCreate() {\n        a = transform.x; b = a + 200; startLeg();\n    }\n    private void startLeg() {\n        double target = toB ? b : a;\n        tween = Tweens.position(gameObject, target, transform.y, 1);\n        tween.easing = "linear";\n    }\n    @Override public void onUpdate(double delta) {\n        if (!tween.completed) return;\n        toB = !toB; startLeg();\n    }\n}',kind='class')
text('Dodaj new PingPong() do obiektu z rendererem. Jedna droga trwa 1 s, pełny cykl 2 s. To wykres pozycji na odcinku, nie całkowitego postępu czasu. Zmień easing na "smooth" i porównaj zawracanie.')
end()
start('FADEOUT / 05','Wygaszanie koloru ShapeRenderer')
text('Nie ma Tweens.fadeOut ani pola Sprite.opacity. Ten własny komponent zmienia kolor ShapeRenderer przez rgba. Nie stosuj go do tekstury Sprite.')
code('import engine.*;\npublic class FadeOut extends Component {\n    private double elapsed = 0;\n    private double duration = 1;\n    private ShapeRenderer renderer;\n    @Override public void onCreate() {\n        renderer = getComponent(ShapeRenderer.class);\n        if (renderer == null)\n            throw new IllegalStateException("Brak ShapeRenderer");\n    }\n    @Override public void onUpdate(double delta) {\n        elapsed = Math.min(duration, elapsed + delta);\n        double t = elapsed / duration;\n        double opacity = 1 - t;\n        renderer.color = "rgba(255, 140, 40, " + opacity + ")";\n        if (t >= 1) setEnabled(false);\n    }\n}',kind='class')
chart('Przezroczystość maleje: 100% → 0%',lambda t:1-t,height=65)
text('Dodaj new FadeOut() do pomarańczowego kształtu. Niewidoczny obiekt nadal istnieje. Dla jednorazowego efektu możesz na końcu użyć gameObject.destroy(), zamiast tylko wyłączać komponent.')
end()
start('WARIANTY / 06','FadeIn i pulsowanie')
text('<b>FadeIn:</b> użyj opacity = t, a początkowy kolor rgba(..., 0) ustaw już w onCreate(). <b>FadeOut smooth:</b> oblicz e = t × t × (3 − 2t), potem opacity = 1 − e.')
chart('Pulsowanie: minimum → maksimum → minimum',lambda t:(1-math.cos(2*math.pi*t))/2,2,75)
code('import engine.*;\npublic class Pulse extends Component {\n    private double elapsed = 0;\n    @Override public void onUpdate(double delta) {\n        elapsed += delta;\n        double cycle = elapsed / 2;\n        double wave = (1 - Math.cos(cycle * Math.PI * 2)) / 2;\n        double scale = 1 + 0.2 * wave;\n        transform.scale.x = scale;\n        transform.scale.y = scale;\n    }\n}',kind='class')
text('To ręczna animacja cykliczna: skala zmienia się od 1 do 1,2, a pełny cykl trwa 2 s. Kołysanie obrotu możesz obliczyć jako Math.sin(czas × częstotliwość) × amplituda; amplituda jest w radianach.')
end()
start('ZADANIA / 07','Zaplanuj animację, potem ją napisz')
text('1. Przesuń kształt z X = 100 do X = 300 w 2 s, porównując linear i smooth.<br/>2. Zmień czas jednego odcinka PingPong na 0,8 s.<br/>3. Wydłuż FadeOut do 2 s.<br/>4. Zmień FadeOut w FadeIn.<br/>5. Zwiększ maksymalną skalę Pulse do 1,4.')
sub('Mini-projekt: reakcja skrzynki')
text('W onCreate() przygotuj pole chest wskazujące widoczną skrzynkę. Dodaj poniższy fragment do onUpdate(double delta) sceny. Spacja wyzwala jedno drżenie na nowe naciśnięcie, nie na każdą klatkę przytrzymania.')
code('if (input.isKeyPressed("Space")) {\n    Tweens.shake(chest, 6, 0.2);\n}',kind='update',context='private GameObject chest;')
sub('Pytania i odpowiedzi')
text('Czy 50% czasu zawsze oznacza 50% drogi? <b>Nie.</b><br/>Ile trwa PingPong przy 0,8 s na odcinek? <b>1,6 s.</b><br/>Jaka jest opacity po 0,5 s w FadeOut trwającym 2 s? <b>0,75.</b><br/>Czy cancel() wywołuje onComplete()? <b>Nie.</b><br/>Czy zniknięcie grafiki usuwa obiekt? <b>Nie.</b>')
text('Nie łącz dwóch animacji nadpisujących tę samą właściwość. Każdy własny komponent dodawaj do istniejącego obiektu z odpowiednim rendererem. Zachowaj nazwy klas i plików Java.')
end();finish(7)
(ROOT/'docs/java-course-examples.json').write_text(json.dumps(examples,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'docs/java-course-manifest.json').write_text(json.dumps(documents,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(documents,ensure_ascii=False))
