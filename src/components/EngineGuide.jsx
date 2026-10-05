import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {engineGuide} from '../data/engineGuide.js';
import './EngineGuide.css';

export default function EngineGuide() {
  const [open,setOpen]=useState(false);
  const [section,setSection]=useState('concept');
  const [query,setQuery]=useState('');
  const dialogRef=useRef(null), triggerRef=useRef(null);
  useEffect(()=>{
    if(!open)return;
    const dialog=dialogRef.current;
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    dialog.showModal();
    return ()=>{dialog.close();document.body.style.overflow=previousOverflow;triggerRef.current?.focus();};
  },[open]);
  const search=query.trim().toLocaleLowerCase('pl');
  const entries=engineGuide.filter(item=>`${item.name} ${item.group} ${item.description} ${item.fields}`.toLocaleLowerCase('pl').includes(search));
  return <>
    <button ref={triggerRef} type="button" className="button button--ghost engine-guide-trigger" title="Dokumentacja silnika" aria-label="Dokumentacja silnika" aria-haspopup="dialog" onClick={()=>setOpen(true)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 5v15M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z"/></svg>
      <span>Dokumentacja</span>
    </button>
    {open&&createPortal(<dialog ref={dialogRef} className="engine-guide" aria-labelledby="engine-guide-title" onCancel={event=>{event.preventDefault();setOpen(false);}} onClick={event=>{if(event.target===event.currentTarget)setOpen(false);}}>
      <div className="engine-guide-inner">
        <header className="engine-guide-heading"><div><p className="eyebrow">Game Dev · Java Lab</p><h2 id="engine-guide-title">Dokumentacja silnika</h2></div><button type="button" className="button button--ghost" aria-label="Zamknij dokumentację" onClick={()=>setOpen(false)}>Zamknij ×</button></header>
        <nav className="engine-guide-nav" aria-label="Rozdziały dokumentacji">
          {[['concept','Koncepcja'],['architecture','Architektura'],['components','Komponenty i API']].map(([id,label])=><button type="button" key={id} aria-current={section===id?'page':undefined} className={section===id?'is-active':''} onClick={()=>setSection(id)}>{label}</button>)}
        </nav>
        <div className="engine-guide-content">
          {section==='concept'&&<>
            <h3>Obiekt + komponenty = zachowanie</h3>
            <p><code>GameMain extends Game</code> tworzy scenę. Każdy <code>GameObject</code> ma pozycję i listę komponentów. Dodajesz tylko to, czego obiekt potrzebuje.</p>
            <div className="engine-guide-composition"><strong>Gracz</strong><span>Sprite → wygląd</span><span>CharacterController2D → ruch</span><span>CircleCollider2D → kolizje</span><span>PlayerController → Twoje sterowanie</span></div>
            <pre><code>{'GameObject player = createObject("Gracz").setPosition(180, 120);\nplayer.addComponent(new Sprite("player"));\nplayer.addComponent(new CharacterController2D());\nplayer.addComponent(new CircleCollider2D(12));\nplayer.addComponent(new PlayerController());'}</code></pre>
            <h3>Co daje silnik, a co piszesz sam?</h3>
            <p>Silnik daje rysowanie, wejście z klawiatury, ruch, kolizje, zachowania AI i animacje. Ty piszesz reguły gry: sterowanie, punkty, obrażenia, skrzynki oraz wybór ulepszeń. Klasy PlayerController, Weapon, Health, Chest i UpgradeMenu należą do przykładów ucznia.</p>
            <h3>Pierwszy własny komponent</h3>
            <pre><code>{'public class PlayerController extends Component {\n    public void onUpdate(double delta) {\n        double x = (Input.isKeyDown("d") ? 1 : 0)\n                 - (Input.isKeyDown("a") ? 1 : 0);\n        requireComponent(CharacterController2D.class).move(x, 0, 120);\n        if (x != 0) requireComponent(Sprite.class).flipX = x < 0;\n    }\n}'}</code></pre>
            <p>Pozycja jest środkiem sprite’a; dodatnie Y biegnie w dół. Prędkość podaj w px/s, czas w sekundach. <code>move</code> już uwzględnia czas klatki. <code>requireComponent</code> pobiera istniejący komponent z tego samego obiektu.</p>
            <h3>Dwa rodzaje postaci</h3><p><code>TopDownCharacterController2D</code> porusza się po obu osiach bez grawitacji. <code>PlatformerCharacterController2D</code> ma ruch poziomy, grawitację i skok. Do jednej postaci dodaj jeden kontroler. Oba odbijają sprite przez flipX i udostępniają <code>isWalk()</code>, <code>isRunning()</code> oraz <code>setRunning(boolean)</code>. Metody sprawdzają zadaną prędkość, także przy blokującej ścianie.</p>
            <h3>Wiązania klawiszy</h3>
            <pre><code>{'// W GameMain.onCreate, po utworzeniu player:\nTopDownCharacterController2D character =\n    player.addComponent(new TopDownCharacterController2D());\nplayer.addComponent(new KeyPressed("W", () -> debug = true));\nplayer.addComponent(new KeyDoublePressed("D",\n    () -> character.setRunning(true)));\nplayer.addComponent(new NoneOfKeysPressed(\n    new String[]{"W", "A", "S", "D"},\n    () -> character.setRunning(false)));\n// Własny komponent ruchu dodaj po tych bindingach.\n// W nim controller.move(x,y) używa wybranego trybu biegu.'}</code></pre>
            <p>Bindingi można dodawać i wyłączać także podczas gry. Callback to <code>Runnable</code>, zapisany jako <code>() → ...</code>. Brak klawiszy oznacza „żaden nie jest trzymany”; callback jest wtedy wykonywany w każdej klatce. Komponenty aktualizują się w kolejności dodania — bindingi dodaj przed komponentem ruchu. Jawne <code>move(x,y,speed)</code> wybiera prędkość niezależnie od wcześniejszego trybu biegu.</p>
            <p>Importy silnika i wspólny pakiet są dopisywane automatycznie. Źródła wbudowanych klas otworzysz przez Ctrl+klik lub F12. Kliknij planszę, żeby sterować grą.</p>
          </>}
          {section==='architecture'&&<>
            <h3>Od kodu Java do obrazu</h3>
            <ol className="engine-guide-flow"><li><strong>Kod ucznia</strong><span>GameMain oraz własne komponenty.</span></li><li><strong>Kompilator w przeglądarce</strong><span>Java → bytecode → TeaVM → WebAssembly.</span></li><li><strong>Java + canvas</strong><span>Java przechowuje stan; JavaScript przekazuje klawisze i rysuje klatki.</span></li></ol>
            <p>Przeglądarka wykonuje kompilację i grę. Uczeń nie potrzebuje lokalnego JDK. Canvas pokazuje wynik; nie przechowuje zdrowia, punktów ani reguł gry.</p>
            <h3>Cykl życia</h3>
            <dl className="engine-guide-hooks"><dt>onCreate()</dt><dd>Raz przy utworzeniu sceny lub komponentu: przygotuj obiekty i stan.</dd><dt>onUpdate(delta)</dt><dd>W każdej klatce: odczytaj klawisze, ustaw kierunek ruchu, aktualizuj reguły.</dd><dt>onCollision / onTrigger</dt><dd>Reakcja na kontakt. Zbieranie zabezpiecz przed wielokrotnym naliczaniem, np. destroy().</dd><dt>onDrawBackground / onDrawUI</dt><dd>Tło przed światem; HUD po fizyce i sprite’ach.</dd><dt>onDestroy()</dt><dd>Sprzątanie przy usunięciu komponentu lub zamknięciu sceny.</dd></dl>
            <pre><code>{'Klatka Game.step(delta):\nnowe komponenty → tło → wyzerowanie prędkości\n→ onUpdate sceny i komponentów → fizyka i kontakty\n→ sprite’y → HUD → sprzątanie → koniec wejścia'}</code></pre>
            <h3>Sprawdzanie zadań</h3><p>RUN kompiluje kod, wykonuje asercje na obiektach Java i uruchamia scenę. Testy badają zachowanie, np. zmianę HP albo pojedynczą nagrodę; wygląd canvasu pozostaje miejscem eksperymentowania.</p>
            <h3>Debugowanie colliderów</h3><p>Przycisk „Collidery” w podglądzie gry pokazuje żółte kontury ciał i niebieskie przerywane kontury triggerów. Możesz też ustawić <code>debug = true</code> w GameMain.onCreate albo <code>getGame().debug = true</code> w komponencie podczas gry. Wyświetlana geometria pochodzi z fizyki, jest niezależna od obrotu, odbicia i skali grafiki.</p>
            <h3>Granice modelu</h3><p>Collider jest kołem albo prostokątem bez obrotu. Skala i odbicia sprite’a nie zmieniają collidera. AI omija lokalne przeszkody, ale nie szuka drogi w labiryncie. Kamera przesuwa sprite’y; HUD i kafelkowe tło pozostają nieruchome.</p>
          </>}
          {section==='components'&&<>
            <label className="engine-guide-search">Znajdź klasę lub funkcję<input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="np. Sprite, kolizje, shake…"/></label>
            <p className="engine-guide-count">{entries.length} z {engineGuide.length} wbudowanych klas i interfejsów. Przykłady z createObject umieść w GameMain.onCreate; hooki w swoim komponencie. Nazwy player, enemy i object oznaczają wcześniej utworzone obiekty.</p>
            {entries.map(item=><details className="engine-guide-entry" key={item.name} open={search?true:undefined}><summary><strong>{item.name}</strong><span>{item.group}</span></summary><p>{item.description}</p><h4>Pola i metody</h4><p className="engine-guide-fields">{item.fields}</p><h4>Przykład użycia</h4><pre><code>{item.example}</code></pre></details>)}
            {!entries.length&&<p>Brak wyników. Spróbuj nazwy klasy lub słowa „ruch”, „grafika”, „AI”.</p>}
            <p>Tekstury: player (bohater RPG), slime / slime-blue (niebieski), slime-red (czerwony), bat, coin, heart, gem, projectile, potion, tree, grass, dirt, stone, sand, wood, leaves, water, coal-ore, chest. Podaj nazwę w konstruktorze Sprite lub TileMap.</p>
          </>}
        </div>
      </div>
    </dialog>,document.body)}
  </>;
}
