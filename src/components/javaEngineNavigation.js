const docs = {
  'Sprite.flipX': 'Odbija obraz lewo/prawo względem osi Y. true włącza odbicie. Nie zmienia pozycji, kierunku strzału ani collidera; mnoży renderowaną scale.x przez -1.',
  'Sprite.flipY': 'Odbija obraz góra/dół względem osi X. true włącza odbicie. Nie zmienia pozycji ani collidera; mnoży renderowaną scale.y przez -1. Oba flipy można łączyć.',
  'CharacterController2D.move': 'Ustawia kierunek ruchu (`x`, `y`), nie pozycję. Silnik normalizuje kierunek, więc przekątna nie przyspiesza ruchu. `double speed` określa prędkość w pikselach na sekundę. Wariant bez speed używa 200. Kierunek (0, 0) zatrzymuje ruch. Silnik uwzględnia delta — nie mnoż kierunku przez czas. Zwraca void.\n\n```java\nrequireComponent(CharacterController2D.class).move(x, y, 120);\n```',
  'Component.requireComponent': 'Pobiera wymagany komponent z tego samego GameObject; nie tworzy nowego. `Class<T> type` określa typ: `CharacterController2D.class` oznacza klasę komponentu, a wynik T jest typu CharacterController2D. Brak komponentu powoduje `IllegalArgumentException`.\n\n```java\nCharacterController2D controller = requireComponent(CharacterController2D.class);\ncontroller.move(x, y, 120);\n```\nWywołanie łańcuchowe najpierw pobiera komponent, następnie uruchamia jego metodę move.',
  getComponent: 'Pobiera komponent podanego typu z obiektu. Zwraca null, jeśli go nie ma. Argument .class określa szukany typ.',
  addComponent: 'Dodaje komponent do obiektu i zwraca dodaną instancję.',
  hasComponent: 'Sprawdza, czy obiekt ma komponent podanego typu. Zwraca boolean.',
  isKeyDown: 'Sprawdza, czy klawisz jest obecnie wciśnięty.',
  createObject: 'Tworzy obiekt gry i dodaje go do sceny.',
  'Tweens.position': 'Animuje pozycję środka do x/y. seconds to czas w sekundach. Zwraca Tween z easing (linear/smooth) i cancel(). Nowa animacja zastępuje poprzednią tej właściwości.',
  'Tweens.scale': 'Animuje scale.x/y do podanych wartości. seconds to czas w sekundach; 0 ustawia wynik od razu. Zwraca Tween z easing i cancel(). Skala obrazu nie zmienia collidera.',
  'Tweens.rotation': 'Animuje rotation.z do kąta radians w radianach. seconds to czas w sekundach. Zwraca Tween z easing i cancel().',
  'Tweens.shake': 'Wstrząsa obrazem: strength w pikselach, seconds w sekundach. Nie zmienia pozycji fizycznej. Zwraca Tween; cancel() usuwa offset bez dryfu.',
  'Tween.cancel': 'Zatrzymuje tween i usuwa jego komponent. Pozycja/skala/obrót pozostają aktualne; shake przywraca zerowy offset.',
  'Camera2D.shake': 'Wstrząsa renderowanymi sprite’ami: strength w pikselach, seconds w sekundach. Nie zmienia colliderów, pozycji ani HUD.',
  'Camera2D.stopShake': 'Kończy shake kamery i zeruje offsetX/offsetY.',
  'ObstacleAvoidance2D.steer': 'Zwraca skorygowany kierunek x/y przy pobliskich colliderach. lookAhead podaj w pikselach, weight to waga korekty. Nie wyszukuje drogi w labiryncie.',
  'Physics2D.overlaps': 'Test geometrii koło–koło, koło–prostokąt lub AABB–AABB, bez emisji kontaktów. Obrót i skala sprite’a nie zmieniają kształtu collidera.',
  onDrawBackground: 'Rysowanie komponentu po clear, przed aktualizacją i sprite’ami. Dobry hook do tła i ścieżek.',
  onDrawUI: 'Rysowanie po fizyce i sprite’ach. Odczytaj aktualne punkty/zdrowie i narysuj HUD.',
};

const classDocs={
  Sprite:'Grafika obiektu: texture to nazwa tekstury, width/height to rozmiar w pikselach. flipX odbija lewo/prawo, flipY góra/dół. Obrót i skala należą do Transform; collider pozostaje niezależny.',
  CircleCollider2D:'Kołowy collider. radius: dodatni, skończony promień w pikselach świata. Środek to transform.x/y. isTrigger=true daje kontakt bez blokowania. Skala sprite’a nie zmienia promienia.',
  TileMap:'Komponent tła: texture to klucz atlasu (np. grass); tileSize to rozmiar kafelka w pikselach, minimum 8. Nie tworzy colliderów.',
  FollowTarget2D:'AI podążania: target z tej samej gry, speed w px/s, stopDistance w px. Wymaga CharacterController2D. Brak aktywnego celu zatrzymuje ruch.',
  FleeTarget2D:'AI ucieczki: target to zagrożenie, speed w px/s, safeDistance w px. Wymaga CharacterController2D.',
  FlankTarget2D:'AI flankowania: target, speed w px/s, radius w px i clockwise. Zbliża się do promienia i obiega cel.',
  Steering2D:'Baza AI. Jeden aktywny generator kierunku na obiekt; ObstacleAvoidance2D może korygować ruch.',
  ObstacleAvoidance2D:'Lokalne omijanie colliderów: lookAhead w px, weight to siła korekty. Nie gwarantuje przejścia labiryntu.',
  Projectile2D:'Pocisk: direction, speed w px/s, lifetime w sekundach, owner. Dodaje kontroler i domyślny kołowy trigger; pomija owner i znika po trafieniu. Własne obrażenia piszesz w onTrigger.',
  Tween:'Animacja: property, easing (linear/smooth), completed. cancel() zatrzymuje animację, a shake usuwa offset.',
  Tweens:'Fabryka position, scale, rotation i shake. Czasy w sekundach. Nowy tween tej samej właściwości zastępuje poprzedni.',
  Camera2D:'offsetX/offsetY przesuwają renderowane sprite’y. shake(strength,seconds), stopShake(). Tło ekranowe i HUD pozostają nieruchome.',
};

export function resolveEngineSymbol(sources, model, position) {
  const token = model?.getWordAtPosition(position);
  if (!token) return null;
  const word = token.word;
  const file = `${word}.java`;
  if (Object.hasOwn(sources, file)) {
    const line = sources[file].split('\n').findIndex(text => new RegExp(`\\b(class|interface)\\s+${word}\\b`).test(text)) + 1;
    return {file, word, line:line || 1, column:1, signatures:[]};
  }
  const content = model.getValue?.() ?? '';
  const text = model.getLineContent?.(position.lineNumber) ?? '';
  const prefix = text.slice(0, (token.startColumn ?? text.indexOf(word) + 1) - 1);
  let owner = prefix.match(/(?:requireComponent|getComponent)\s*\(\s*(\w+)\.class\s*\)\s*\.\s*$/)?.[1];
  if (!owner) {
    const receiver = prefix.match(/(\w+)\s*\.\s*$/)?.[1];
    if (receiver) {
      if (Object.hasOwn(sources, `${receiver}.java`)) owner = receiver;
      else if (receiver === 'gameObject' && /extends\s+(Component|PlayerController2D)\b/.test(content)) owner = 'GameObject';
      else owner = content.match(new RegExp(`\\b(\\w+)\\s+${receiver}\\b`))?.[1];
    } else owner = content.match(/\bclass\s+\w+\s+extends\s+(\w+)/)?.[1] ?? content.match(/\bclass\s+(\w+)/)?.[1];
  }
  const visited = new Set();
  while (owner && Object.hasOwn(sources, `${owner}.java`) && !visited.has(owner)) {
    visited.add(owner);
    const targetFile = `${owner}.java`;
    const matches = sources[targetFile].split('\n').flatMap((text, index) => {
      const signature = text.trim().match(/^(?:public|protected)\s+.*?\([^)]*\)/)?.[0]
        ?? text.trim().match(/^(?:public|protected)\s+[^{}()]+;/)?.[0];
      return signature && new RegExp(`\\b${word}\\b`).test(signature)
        ? [{line:index + 1,column:text.indexOf(word) + 1,signature}] : [];
    });
    if (matches.length) return {file:targetFile,owner,word,line:matches[0].line,column:matches[0].column,signatures:matches.map(item => item.signature)};
    owner = sources[targetFile].match(/\bextends\s+(\w+)/)?.[1];
  }
  return null;
}

export function createEngineDefinitionProvider(sources, getModel, ownsModel = () => true) {
  return {
    provideDefinition(model, position) {
      if (!ownsModel(model)) return null;
      const symbol = resolveEngineSymbol(sources, model, position);
      if (!symbol) return null;
      return {uri:getModel(symbol.file).uri,range:{startLineNumber:symbol.line,startColumn:symbol.column,endLineNumber:symbol.line,endColumn:symbol.column + symbol.word.length}};
    },
  };
}

export function createEngineHoverProvider(sources, ownsModel = () => true) {
  return {provideHover(model, position) {
    if (!ownsModel(model)) return null;
    const symbol = resolveEngineSymbol(sources, model, position);
    if (!symbol) return null;
    const token = model.getWordAtPosition(position);
    return {range:{startLineNumber:position.lineNumber,endLineNumber:position.lineNumber,startColumn:token.startColumn,endColumn:token.endColumn},
      contents:[{value:`\`\`\`java\n${symbol.signatures.join('\n') || symbol.word}\n\`\`\``},
        {value:docs[`${symbol.owner}.${symbol.word}`] ?? docs[symbol.word] ?? classDocs[symbol.word] ?? `API silnika: ${symbol.file}. Ctrl+klik lub F12 otwiera źródło tylko do odczytu.`}]};
  }};
}
