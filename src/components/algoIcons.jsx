// Flat semantic icons for algorithm step scenes (concept-scene actors).
// Palette matches the concept cards: navy outline, white cells, teal/orange/gold accents.
const stroke = '#173c52';
const teal = '#2a9d8f';
const orange = '#e76f51';
const gold = '#f4a261';
const red = '#c0392b';
const cream = '#ffffff';
const cell = (x, y, w, h, fill = cream, dash = false) =>
  <rect x={x} y={y} width={w} height={h} rx="8" fill={fill} stroke={stroke} strokeWidth="5" strokeDasharray={dash ? '7 6' : undefined} />;
const wrap = (children) => <svg className="concept-hero" viewBox="0 0 128 128" aria-hidden="true">{children}</svg>;

export const algoIcons = {
  // Element pod lupą — patrzymy na wartość / szukamy minimum.
  look: wrap(<>{cell(26, 30, 58, 58)}<circle cx="78" cy="82" r="22" fill="#eefaf6" fillOpacity=".92" stroke={stroke} strokeWidth="6" /><line x1="95" y1="99" x2="112" y2="116" stroke={stroke} strokeWidth="8" strokeLinecap="round" /></>),
  // Porównanie pary — dwa elementy i znak zapytania.
  compare: wrap(<>{cell(12, 44, 36, 46)}<rect x="12" y="44" width="36" height="46" rx="8" fill={teal} opacity=".18" />{cell(80, 44, 36, 46)}<circle cx="64" cy="67" r="15" fill={orange} /><text x="64" y="75" textAnchor="middle" fontSize="24" fontWeight="800" fill="#fff">?</text></>),
  // Zamiana sąsiadów — dwie wartości zamieniają się miejscami.
  swap: wrap(<>{cell(10, 50, 30, 40)}<rect x="10" y="50" width="30" height="40" rx="8" fill={orange} opacity=".18" />{cell(88, 50, 30, 40)}<path d="M46 58 C58 42 70 42 82 54" fill="none" stroke={orange} strokeWidth="6" strokeLinecap="round" /><path d="M82 54 l-2 -12 m2 12 l10 -6" fill="none" stroke={orange} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /><path d="M82 82 C70 98 58 98 46 86" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" /><path d="M46 86 l2 12 m-2 -12 l-10 6" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></>),
  // Przesunięcie o jedną pozycję w prawo — zwalniamy miejsce.
  shift: wrap(<>{cell(12, 46, 34, 46)}<line x1="52" y1="69" x2="88" y2="69" stroke={teal} strokeWidth="8" strokeLinecap="round" /><path d="M84 56 L104 69 L84 82 Z" fill={teal} />{cell(96, 46, 24, 46, 'none', true)}</>),
  // Zapamiętana wartość — max, min, key albo temp trzymane na boku.
  keep: wrap(<>{cell(38, 56, 52, 52)}<rect x="38" y="56" width="52" height="52" rx="8" fill={gold} opacity=".2" /><line x1="64" y1="56" x2="64" y2="24" stroke={stroke} strokeWidth="6" /><path d="M64 22 L94 31 L64 40 Z" fill={gold} stroke={stroke} strokeWidth="4" strokeLinejoin="round" /></>),
  // Wstawienie klucza na zwolnione miejsce.
  insert: wrap(<>{cell(8, 56, 30, 42)}{cell(90, 56, 30, 42)}{cell(46, 56, 36, 42, 'none', true)}<line x1="64" y1="18" x2="64" y2="44" stroke={orange} strokeWidth="8" strokeLinecap="round" /><path d="M51 40 L64 56 L77 40 Z" fill={orange} /></>),
  // Licznik lub suma — akumulator rośnie krok po kroku.
  tally: wrap(<>{[44, 60, 76].map((x) => <line key={x} x1={x} y1="34" x2={x} y2="88" stroke={stroke} strokeWidth="7" strokeLinecap="round" />)}<line x1="36" y1="76" x2="84" y2="50" stroke={teal} strokeWidth="7" strokeLinecap="round" /><text x="98" y="80" textAnchor="middle" fontSize="42" fontWeight="800" fill={orange}>+</text></>),
  // Scalanie — dwa posortowane ciągi łączą się w jeden.
  merge: wrap(<>{cell(16, 26, 42, 14, teal)}<rect x="16" y="26" width="42" height="14" rx="5" fill={teal} opacity=".35" />{cell(70, 26, 42, 14, orange)}<rect x="70" y="26" width="42" height="14" rx="5" fill={orange} opacity=".35" /><path d="M37 48 C37 66 52 66 58 78" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" /><path d="M91 48 C91 66 76 66 70 78" fill="none" stroke={orange} strokeWidth="6" strokeLinecap="round" />{cell(22, 84, 84, 16)}<rect x="22" y="84" width="84" height="16" rx="6" fill={gold} opacity=".35" /></>),
  // Podział — jedna tablica rozbija się na dwie połowy.
  split: wrap(<>{cell(22, 24, 84, 16)}<rect x="22" y="24" width="84" height="16" rx="6" fill={stroke} opacity=".15" /><path d="M58 48 C52 62 40 62 38 74" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" /><path d="M70 48 C76 62 88 62 90 74" fill="none" stroke={orange} strokeWidth="6" strokeLinecap="round" />{cell(12, 80, 42, 14, teal)}<rect x="12" y="80" width="42" height="14" rx="5" fill={teal} opacity=".35" />{cell(74, 80, 42, 14, orange)}<rect x="74" y="80" width="42" height="14" rx="5" fill={orange} opacity=".35" /></>),
  // Pełne przejście pętli przez tablicę — wskaźnik wraca na początek.
  pass: wrap(<>{[18, 52, 86].map((x) => <rect key={x} x={x} y="62" width="24" height="30" rx="8" fill={cream} stroke={stroke} strokeWidth="5" />)}<path d="M96 48 C96 26 32 26 32 48" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" strokeDasharray="10 8" /><path d="M24 38 L32 52 L46 42" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /></>),
  // Posortowany wynik — rosnące słupki.
  'bars-sorted': wrap(<>{[[26, 30], [52, 48], [78, 66], [104, 84]].map(([x, h], i) => <rect key={x} x={x - 10} y={104 - h} width="18" height={h} rx="5" fill={i === 3 ? gold : teal} stroke={stroke} strokeWidth="4" />)}<line x1="16" y1="106" x2="112" y2="106" stroke={stroke} strokeWidth="6" strokeLinecap="round" /></>),
  // Ostrzeżenie — indeks poza zakresem, nieprawidłowe dane.
  warn: wrap(<><path d="M64 22 L116 104 L12 104 Z" fill={gold} stroke={stroke} strokeWidth="6" strokeLinejoin="round" /><line x1="64" y1="50" x2="64" y2="76" stroke={stroke} strokeWidth="9" strokeLinecap="round" /><circle cx="64" cy="90" r="6" fill={stroke} /></>),
  // Wskaźnik indeksu — strzałka pokazuje bieżący element.
  pointer: wrap(<>{cell(38, 60, 52, 52)}<line x1="64" y1="14" x2="64" y2="42" stroke={teal} strokeWidth="8" strokeLinecap="round" /><path d="M50 38 L64 56 L78 38 Z" fill={teal} /></>),
  // Cała tablica — rząd komórek.
  cells: wrap(<>{[14, 40, 66, 92].map((x) => <rect key={x} x={x} y="52" width="22" height="44" rx="8" fill={cream} stroke={stroke} strokeWidth="5" />)}<rect x="40" y="52" width="22" height="44" rx="8" fill={teal} opacity=".18" /></>),
  // Błąd wykonania — coś poszło nie tak w trakcie.
  crash: wrap(<>{cell(30, 38, 68, 52, 'none', true)}<path d="M40 30 L88 98 M88 30 L40 98" stroke={red} strokeWidth="8" strokeLinecap="round" /></>),
  // Stos — elementy piętrzą się, zdejmujemy od góry.
  stack: wrap(<>{[78, 58, 38].map((y, i) => <rect key={y} x={34 + i * 4} y={y} width={60 - i * 8} height="18" rx="6" fill={i === 0 ? gold : i === 1 ? teal : orange} fillOpacity={i === 0 ? 1 : .55} stroke={stroke} strokeWidth="4" />)}<line x1="22" y1="98" x2="106" y2="98" stroke={stroke} strokeWidth="6" strokeLinecap="round" /></>),
};

// Rząd elementów tablicy — wartości siedzą WEWNĄTRZ komórek, indeksy pod nimi.
// values: treść wszystkich komórek; at: wyróżniony indeks (-1 = brak);
// sortedFrom: komórki od tego indeksu są „posortowane" (gold);
// at >= liczby komórek rysuje czerwoną „widmową" komórkę poza zakresem.
export function RowIcon({ at = -1, value = '', values, total = 4, sortedFrom }) {
  const list = values || Array(total).fill('');
  const out = at >= list.length;
  const n = list.length + (out ? 1 : 0);
  const cw = 30, ch = 38, gap = 5, y = 30;
  const row = n * cw + (n - 1) * gap;
  const W = row + 14, x0 = (W - row) / 2;
  return <svg className="concept-hero" viewBox={`0 0 ${W} 104`} aria-hidden="true">
    {Array.from({ length: n }, (_, i) => {
      const x = x0 + i * (cw + gap);
      const on = i === at;
      const phantom = out && i === n - 1;
      const sorted = !on && !phantom && sortedFrom != null && i >= sortedFrom;
      const label = phantom ? '' : (on ? (list[i] || value) : list[i]);
      return <g key={i}>
        <rect x={x} y={y} width={cw} height={ch} rx="7"
          fill={on ? teal : sorted ? gold : '#fff8ea'} stroke={phantom ? red : stroke}
          strokeWidth={on || phantom ? 5 : 3.5}
          strokeDasharray={phantom ? '6 5' : undefined} opacity={phantom ? .6 : 1}
          fillOpacity={sorted ? .45 : 1} />
        {label && <text x={x + cw / 2} y={y + 25} textAnchor="middle" fontSize="11" fontWeight="800" fill={on ? '#fff' : stroke}>{label}</text>}
        {phantom && <text x={x + cw / 2} y={y + 26} textAnchor="middle" fontSize="15" fontWeight="800" fill={red}>✕</text>}
        <text x={x + cw / 2} y={y + ch + 15} textAnchor="middle" fontSize="11" fontWeight="700" fill={phantom ? red : '#5c6b72'}>{i}</text>
      </g>;
    })}
  </svg>;
}

// Para wartości w komórkach — stan przed/po, bez strzałek.
export function PairIcon({ a = '', b = '' }) {
  return wrap(<>
    <rect x="20" y="44" width="36" height="46" rx="8" fill="#fff8ea" stroke={stroke} strokeWidth="5" />
    <rect x="72" y="44" width="36" height="46" rx="8" fill="#fff8ea" stroke={stroke} strokeWidth="5" />
    <text x="38" y="74" textAnchor="middle" fontSize="20" fontWeight="800" fill={stroke}>{a}</text>
    <text x="90" y="74" textAnchor="middle" fontSize="20" fontWeight="800" fill={stroke}>{b}</text>
  </>);
}

// Zamiana pary — wartości w komórkach, łuki pokazują kto dokąd idzie.
export function SwapIcon({ a = '', b = '' }) {
  return wrap(<>
    <rect x="12" y="50" width="34" height="44" rx="8" fill={orange} fillOpacity=".14" stroke={stroke} strokeWidth="5" />
    <rect x="82" y="50" width="34" height="44" rx="8" fill={teal} fillOpacity=".14" stroke={stroke} strokeWidth="5" />
    <text x="29" y="78" textAnchor="middle" fontSize="19" fontWeight="800" fill={stroke}>{a}</text>
    <text x="99" y="78" textAnchor="middle" fontSize="19" fontWeight="800" fill={stroke}>{b}</text>
    <path d="M29 44 C52 16 76 16 99 44" fill="none" stroke={orange} strokeWidth="6" strokeLinecap="round" />
    <path d="M90 38 L99 49 L108 38" fill="none" stroke={orange} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M99 100 C76 128 52 128 29 100" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" />
    <path d="M20 106 L29 95 L38 106" fill="none" stroke={teal} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </>);
}

// Zapamiętana wartość — komórka z wartością w środku i pinezka na górze.
export function KeepIcon({ value = '' }) {
  return wrap(<>
    <rect x="42" y="52" width="44" height="46" rx="8" fill={gold} fillOpacity=".22" stroke={stroke} strokeWidth="5" />
    <text x="64" y="81" textAnchor="middle" fontSize="19" fontWeight="800" fill={stroke}>{value}</text>
    <line x1="64" y1="52" x2="64" y2="26" stroke={stroke} strokeWidth="6" />
    <path d="M64 24 L92 32 L64 40 Z" fill={gold} stroke={stroke} strokeWidth="4" strokeLinejoin="round" />
  </>);
}
