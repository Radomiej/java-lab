// SERVER ONLY: reference implementations must never enter a client bundle.
// 20 task variants for the „1 · Podstawy Javy” family. Topics match lessons
// fundamentals-01/02/03 (program i println, zmienne i typy, warunki i pętle);
// every task requires writing a static method, per the generator contract.

const RETURNS = { int: '0', double: '0.0', String: 'null', boolean: 'false' };

const LEVEL_LINE = [
  'Metoda jest już zaimplementowana — Twoim zadaniem jest wywołanie jej w main.',
  'Ciało metody zwraca wynik tymczasowy — uzupełnij je; main już wywołuje metodę.',
  'Napisz cały program samodzielnie: klasę Main, metodę, pole result i main.',
];

const eq = (expected, call) => `${JSON.stringify(expected)}.equals(${call})`;
const num = (expected, call) => `${call} == ${expected}`;
const dbl = (expected, call) => `Math.abs(${call} - (${expected})) <= 0.001`;

export const javaBasicsVariants = [
  {
    id: 'greet', topic: '01',
    build({ pick }) {
      const name = pick(['Ada', 'Bolek', 'Celina', 'Dorian']);
      return {
        title: 'Powitanie gracza',
        contract: 'Metoda greet(String name) zwraca powitanie w formie „Witaj, <imię>!” — sama nic nie wypisuje.',
        signature: 'static String greet(String name)', resultType: 'String',
        body: 'return "Witaj, " + name + "!";',
        call: `greet(${JSON.stringify(name)})`, callDisplay: `greet(„${name}”)`,
        resultExpr: eq(`Witaj, ${name}!`, 'Main.result'),
        checks: ['Ada', 'Zofia', 'Maks'].map(n => ({ label: `greet(${JSON.stringify(n)})`, expr: eq(`Witaj, ${n}!`, `Main.greet(${JSON.stringify(n)})`) })),
      };
    },
  },
  {
    id: 'banner', topic: '01',
    build({ pick }) {
      const text = pick(['Mapa', 'Start', 'Quest', 'Boss']);
      return {
        title: 'Ramka z tytułem',
        contract: 'Metoda banner(String text) zwraca tekst otoczony znakami równości: „=== <tekst> ===”.',
        signature: 'static String banner(String text)', resultType: 'String',
        body: 'return "=== " + text + " ===";',
        call: `banner(${JSON.stringify(text)})`, callDisplay: `banner(„${text}”)`,
        resultExpr: eq(`=== ${text} ===`, 'Main.result'),
        checks: ['Gra', 'Koniec', 'Poziom'].map(t => ({ label: `banner(${JSON.stringify(t)})`, expr: eq(`=== ${t} ===`, `Main.banner(${JSON.stringify(t)})`) })),
      };
    },
  },
  {
    id: 'menu-line', topic: '01',
    build({ int, pick }) {
      const number = int(1, 4), option = pick(['Start', 'Wczytaj', 'Zapisz', 'Wyjście']);
      return {
        title: 'Pozycja menu',
        contract: 'Metoda menuLine(int number, String option) zwraca numerowaną pozycję menu: „<numer>. <opcja>”.',
        signature: 'static String menuLine(int number, String option)', resultType: 'String',
        body: 'return number + ". " + option;',
        call: `menuLine(${number}, ${JSON.stringify(option)})`, callDisplay: `menuLine(${number}, „${option}”)`,
        resultExpr: eq(`${number}. ${option}`, 'Main.result'),
        checks: [[1, 'Start'], [3, 'Opcje'], [4, 'Wyjście']].map(([n, o]) => ({ label: `menuLine(${n}, ${JSON.stringify(o)})`, expr: eq(`${n}. ${o}`, `Main.menuLine(${n}, ${JSON.stringify(o)})`) })),
      };
    },
  },
  {
    id: 'hero-card', topic: '01',
    build({ int, pick }) {
      const name = pick(['Ada', 'Bolek', 'Celina', 'Dorian']), level = int(2, 9);
      return {
        title: 'Karta bohatera',
        contract: 'Metoda heroCard(String name, int level) zwraca kartę w formie „<imię> (lvl <poziom>)”.',
        signature: 'static String heroCard(String name, int level)', resultType: 'String',
        body: 'return name + " (lvl " + level + ")";',
        call: `heroCard(${JSON.stringify(name)}, ${level})`, callDisplay: `heroCard(„${name}”, ${level})`,
        resultExpr: eq(`${name} (lvl ${level})`, 'Main.result'),
        checks: [['Ada', 1], ['Olek', 5], ['Igor', 12]].map(([n, l]) => ({ label: `heroCard(${JSON.stringify(n)}, ${l})`, expr: eq(`${n} (lvl ${l})`, `Main.heroCard(${JSON.stringify(n)}, ${l})`) })),
      };
    },
  },
  {
    id: 'join-words', topic: '01',
    build({ pick }) {
      const words = pick([['Mapa', 'Las', 'Most'], ['Miecz', 'Tarcza', 'Łuk'], ['Klucz', 'Zamek', 'Brama']]);
      return {
        title: 'Lista przedmiotów',
        contract: 'Metoda joinWords(String a, String b, String c) zwraca trzy słowa połączone przecinkiem i spacją: „a, b, c”.',
        signature: 'static String joinWords(String a, String b, String c)', resultType: 'String',
        body: 'return a + ", " + b + ", " + c;',
        call: `joinWords(${words.map(JSON.stringify).join(', ')})`, callDisplay: `joinWords(${words.map(w => `„${w}”`).join(', ')})`,
        resultExpr: eq(words.join(', '), 'Main.result'),
        checks: [['A', 'B', 'C'], ['HP', 'MP', 'XP'], ['Góra', 'Dolina', 'Rzeka']].map(w => ({ label: `joinWords(${w.map(JSON.stringify).join(', ')})`, expr: eq(w.join(', '), `Main.joinWords(${w.map(JSON.stringify).join(', ')})`) })),
      };
    },
  },
  {
    id: 'level-label', topic: '01',
    build({ int }) {
      const top = int(10, 30), level = int(1, 9);
      return {
        title: 'Etykieta poziomu',
        contract: `Metoda levelLabel(int level) zwraca etykietę w formie „Poziom <level>/${top}”.`,
        signature: 'static String levelLabel(int level)', resultType: 'String',
        body: `return "Poziom " + level + "/${top}";`,
        call: `levelLabel(${level})`, callDisplay: `levelLabel(${level})`,
        resultExpr: eq(`Poziom ${level}/${top}`, 'Main.result'),
        checks: [1, 5, top].map(l => ({ label: `levelLabel(${l})`, expr: eq(`Poziom ${l}/${top}`, `Main.levelLabel(${l})`) })),
      };
    },
  },
  {
    id: 'add-points', topic: '02',
    build({ int }) {
      const a = int(5, 30), b = int(2, 20);
      return {
        title: 'Suma punktów',
        contract: 'Metoda addPoints(int base, int bonus) zwraca sumę obu argumentów.',
        signature: 'static int addPoints(int base, int bonus)', resultType: 'int',
        body: 'return base + bonus;',
        call: `addPoints(${a}, ${b})`, callDisplay: `addPoints(${a}, ${b})`,
        resultExpr: num(a + b, 'Main.result'),
        checks: [[7, 4], [0, 5], [-3, 10]].map(([x, y]) => ({ label: `addPoints(${x}, ${y})`, expr: num(x + y, `Main.addPoints(${x}, ${y})`) })),
      };
    },
  },
  {
    id: 'damage', topic: '02',
    build({ int }) {
      const k = int(2, 3), base = int(5, 20), bonus = int(1, 10);
      return {
        title: 'Obrażenia z bonusem',
        contract: `Metoda damage(int base, int bonus) zwraca obrażenia: base + ${k}·bonus.`,
        signature: 'static int damage(int base, int bonus)', resultType: 'int',
        body: `return base + ${k} * bonus;`,
        call: `damage(${base}, ${bonus})`, callDisplay: `damage(${base}, ${bonus})`,
        resultExpr: num(base + k * bonus, 'Main.result'),
        checks: [[10, 3], [0, 4], [7, 0]].map(([x, y]) => ({ label: `damage(${x}, ${y})`, expr: num(x + k * y, `Main.damage(${x}, ${y})`) })),
      };
    },
  },
  {
    id: 'average', topic: '02',
    build({ int }) {
      const a = int(1, 9), b = int(1, 9), c = int(1, 9);
      return {
        title: 'Średnia trzech pomiarów',
        contract: 'Metoda average(int a, int b, int c) zwraca średnią arytmetyczną jako double (nie obcinaj do int!).',
        signature: 'static double average(int a, int b, int c)', resultType: 'double',
        body: 'return (a + b + c) / 3.0;',
        call: `average(${a}, ${b}, ${c})`, callDisplay: `average(${a}, ${b}, ${c})`,
        resultExpr: dbl((a + b + c) / 3, 'Main.result'),
        checks: [[2, 4, 6], [1, 2, 2], [0, 0, 9]].map(([x, y, z]) => ({ label: `average(${x}, ${y}, ${z})`, expr: dbl((x + y + z) / 3, `Main.average(${x}, ${y}, ${z})`) })),
      };
    },
  },
  {
    id: 'coins', topic: '02',
    build({ int }) {
      const g = int(1, 9), s = int(0, 9), c = int(0, 9);
      return {
        title: 'Wartość sakiewki',
        contract: 'Metoda coins(int gold, int silver, int copper) zwraca łączną wartość monet: gold·100 + silver·10 + copper.',
        signature: 'static int coins(int gold, int silver, int copper)', resultType: 'int',
        body: 'return gold * 100 + silver * 10 + copper;',
        call: `coins(${g}, ${s}, ${c})`, callDisplay: `coins(${g}, ${s}, ${c})`,
        resultExpr: num(g * 100 + s * 10 + c, 'Main.result'),
        checks: [[1, 2, 3], [0, 0, 7], [2, 0, 0]].map(([x, y, z]) => ({ label: `coins(${x}, ${y}, ${z})`, expr: num(x * 100 + y * 10 + z, `Main.coins(${x}, ${y}, ${z})`) })),
      };
    },
  },
  {
    id: 'hp-percent', topic: '02',
    build({ int }) {
      const hp = int(1, 9), max = int(10, 20);
      return {
        title: 'Procent zdrowia',
        contract: 'Metoda hpPercent(int hp, int max) zwraca procent zdrowia jako liczbę całkowitą: 100·hp/max (dzielenie int obcina resztę).',
        signature: 'static int hpPercent(int hp, int max)', resultType: 'int',
        body: 'return 100 * hp / max;',
        call: `hpPercent(${hp}, ${max})`, callDisplay: `hpPercent(${hp}, ${max})`,
        resultExpr: num(Math.floor(100 * hp / max), 'Main.result'),
        checks: [[3, 4], [1, 3], [7, 10], [0, 8]].map(([x, y]) => ({ label: `hpPercent(${x}, ${y})`, expr: num(Math.floor(100 * x / y), `Main.hpPercent(${x}, ${y})`) })),
      };
    },
  },
  {
    id: 'xp-curve', topic: '02',
    build({ int }) {
      const k = int(5, 15), level = int(2, 8);
      return {
        title: 'Krzywa doświadczenia',
        contract: `Metoda xpForLevel(int level) zwraca wymagane XP: level·level·${k}.`,
        signature: 'static int xpForLevel(int level)', resultType: 'int',
        body: `return level * level * ${k};`,
        call: `xpForLevel(${level})`, callDisplay: `xpForLevel(${level})`,
        resultExpr: num(level * level * k, 'Main.result'),
        checks: [1, 4, 10].map(l => ({ label: `xpForLevel(${l})`, expr: num(l * l * k, `Main.xpForLevel(${l})`) })),
      };
    },
  },
  {
    id: 'trip-cost', topic: '02',
    build({ int }) {
      const fee = int(10, 25), km = int(5, 30), rate = int(2, 6);
      return {
        title: 'Koszt podróży',
        contract: `Metoda tripCost(int km, int rate) zwraca koszt przejazdu: km·rate + ${fee} (stała opłata).`,
        signature: 'static int tripCost(int km, int rate)', resultType: 'int',
        body: `return km * rate + ${fee};`,
        call: `tripCost(${km}, ${rate})`, callDisplay: `tripCost(${km}, ${rate})`,
        resultExpr: num(km * rate + fee, 'Main.result'),
        checks: [[10, 3], [0, 5], [25, 2]].map(([x, y]) => ({ label: `tripCost(${x}, ${y})`, expr: num(x * y + fee, `Main.tripCost(${x}, ${y})`) })),
      };
    },
  },
  {
    id: 'can-enter', topic: '03',
    build({ int }) {
      const required = int(3, 10), level = required + int(0, 5);
      return {
        title: 'Wstęp do lochu',
        contract: 'Metoda canEnter(int level, int required) zwraca true, gdy level jest większy lub równy required.',
        signature: 'static boolean canEnter(int level, int required)', resultType: 'boolean',
        body: 'return level >= required;',
        call: `canEnter(${level}, ${required})`, callDisplay: `canEnter(${level}, ${required})`,
        resultExpr: num(level >= required, 'Main.result'),
        checks: [[required - 1, required], [required, required], [required + 3, required]].map(([x, y]) => ({ label: `canEnter(${x}, ${y})`, expr: num(x >= y, `Main.canEnter(${x}, ${y})`) })),
      };
    },
  },
  {
    id: 'grade', topic: '03',
    build({ int }) {
      const hi = int(80, 95), lo = int(40, 60);
      return {
        title: 'Ocena z punktów',
        contract: `Metoda grade(int points) zwraca „Celujący” dla points ≥ ${hi}, „Zaliczony” dla points ≥ ${lo}, w pozostałych „Popraw”.`,
        signature: 'static String grade(int points)', resultType: 'String',
        body: `if (points >= ${hi}) {\n            return "Celujący";\n        } else if (points >= ${lo}) {\n            return "Zaliczony";\n        }\n        return "Popraw";`,
        call: `grade(${hi})`, callDisplay: `grade(${hi})`,
        resultExpr: eq('Celujący', 'Main.result'),
        checks: [[hi, 'Celujący'], [hi - 1, 'Zaliczony'], [lo, 'Zaliczony'], [lo - 1, 'Popraw']].map(([p, g]) => ({ label: `grade(${p})`, expr: eq(g, `Main.grade(${p})`) })),
      };
    },
  },
  {
    id: 'sum-to', topic: '03',
    build({ int }) {
      const n = int(4, 15);
      return {
        title: 'Suma ciągu',
        contract: 'Metoda sumTo(int n) zwraca sumę liczb od 1 do n włącznie; użyj pętli for.',
        signature: 'static int sumTo(int n)', resultType: 'int',
        body: 'int sum = 0;\n        for (int i = 1; i <= n; i++) {\n            sum += i;\n        }\n        return sum;',
        call: `sumTo(${n})`, callDisplay: `sumTo(${n})`,
        resultExpr: num(n * (n + 1) / 2, 'Main.result'),
        checks: [1, 4, 10].map(x => ({ label: `sumTo(${x})`, expr: num(x * (x + 1) / 2, `Main.sumTo(${x})`) })),
      };
    },
  },
  {
    id: 'count-even', topic: '03',
    build({ int }) {
      const values = Array.from({ length: int(6, 8) }, () => int(-9, 40));
      const expected = values.filter(v => v % 2 === 0).length;
      const arr = `new int[]{${values.join(', ')}}`;
      return {
        title: 'Licznik parzystych',
        contract: 'Metoda countEven(int[] values) zwraca liczbę parzystych elementów tablicy; użyj pętli i warunku.',
        signature: 'static int countEven(int[] values)', resultType: 'int',
        body: 'int count = 0;\n        for (int value : values) {\n            if (value % 2 == 0) count++;\n        }\n        return count;',
        call: `countEven(${arr})`, callDisplay: `countEven(${JSON.stringify(values)})`,
        resultExpr: num(expected, 'Main.result'),
        checks: [
          { label: 'countEven dla danych z polecenia', expr: num(expected, `Main.countEven(${arr})`) },
          { label: 'countEven pusta tablica', expr: num(0, 'Main.countEven(new int[]{})') },
          { label: 'countEven same nieparzyste', expr: num(0, 'Main.countEven(new int[]{1, 3, 5})') },
        ],
      };
    },
  },
  {
    id: 'first-above', topic: '03',
    build({ int }) {
      const threshold = int(10, 30);
      const values = [int(1, threshold - 1), int(1, threshold - 1), threshold + int(0, 10), int(1, 40), int(1, 40)];
      const expected = values.find(v => v >= threshold) ?? -1;
      const arr = `new int[]{${values.join(', ')}}`;
      return {
        title: 'Pierwszy powyżej progu',
        contract: `Metoda firstAbove(int[] values, int threshold) zwraca pierwszy element ≥ threshold; gdy brak — zwraca -1.`,
        signature: 'static int firstAbove(int[] values, int threshold)', resultType: 'int',
        body: 'for (int value : values) {\n            if (value >= threshold) return value;\n        }\n        return -1;',
        call: `firstAbove(${arr}, ${threshold})`, callDisplay: `firstAbove(${JSON.stringify(values)}, ${threshold})`,
        resultExpr: num(expected, 'Main.result'),
        checks: [
          { label: 'firstAbove dla danych z polecenia', expr: num(expected, `Main.firstAbove(${arr}, ${threshold})`) },
          { label: 'firstAbove brak pasujących', expr: num(-1, `Main.firstAbove(new int[]{1, 2, 3}, ${threshold})`) },
          { label: 'firstAbove pierwszy element', expr: num(threshold + 5, `Main.firstAbove(new int[]{${threshold + 5}, 1, 2}, ${threshold})`) },
        ],
      };
    },
  },
  {
    id: 'hits-to-zero', topic: '03',
    build({ int }) {
      const hp = int(10, 30), dmg = int(2, 7);
      const expected = Math.ceil(hp / dmg);
      return {
        title: 'Trafienia do zera',
        contract: 'Metoda hitsToZero(int hp, int dmg) zwraca liczbę trafień potrzebną, by hp spadło do zera; użyj pętli while.',
        signature: 'static int hitsToZero(int hp, int dmg)', resultType: 'int',
        body: 'int hits = 0;\n        while (hp > 0) {\n            hp -= dmg;\n            hits++;\n        }\n        return hits;',
        call: `hitsToZero(${hp}, ${dmg})`, callDisplay: `hitsToZero(${hp}, ${dmg})`,
        resultExpr: num(expected, 'Main.result'),
        checks: [[9, 3], [1, 5], [10, 4], [20, 5]].map(([x, y]) => ({ label: `hitsToZero(${x}, ${y})`, expr: num(Math.ceil(x / y), `Main.hitsToZero(${x}, ${y})`) })),
      };
    },
  },
  {
    id: 'status-hp', topic: '03',
    build({ int }) {
      const hi = int(65, 80), lo = int(20, 40);
      return {
        title: 'Stan zdrowia',
        contract: `Metoda status(int hp) zwraca „Zdrowy” dla hp ≥ ${hi}, „Ranny” dla hp ≥ ${lo}, w pozostałych „Krytyczny”.`,
        signature: 'static String status(int hp)', resultType: 'String',
        body: `if (hp >= ${hi}) {\n            return "Zdrowy";\n        } else if (hp >= ${lo}) {\n            return "Ranny";\n        }\n        return "Krytyczny";`,
        call: `status(${hi + 5})`, callDisplay: `status(${hi + 5})`,
        resultExpr: eq('Zdrowy', 'Main.result'),
        checks: [[hi, 'Zdrowy'], [hi - 1, 'Ranny'], [lo, 'Ranny'], [lo - 1, 'Krytyczny'], [0, 'Krytyczny']].map(([p, s]) => ({ label: `status(${p})`, expr: eq(s, `Main.status(${p})`) })),
      };
    },
  },
];

function javaTestSource(spec) {
  const lines = [
    '        try { Main.main(new String[0]); } catch (Throwable t) { check("main uruchamia się bez błędów", false); }',
    `        try { check("main zapisuje wynik w polu result", ${spec.resultExpr}); } catch (Throwable t) { check("main zapisuje wynik w polu result", false); }`,
  ];
  for (const item of spec.checks) {
    lines.push(`        try { check(${JSON.stringify(item.label)}, ${item.expr}); } catch (Throwable t) { check(${JSON.stringify(item.label)}, false); }`);
  }
  return `public class JavaTest {
    static int passed, failed;
    static void check(String label, boolean ok) {
        System.out.println((ok ? "PASS" : "FAIL") + ": " + label);
        if (ok) passed++; else failed++;
    }
    public static void main(String[] args) {
${lines.join('\n')}
        System.out.println((failed == 0 ? "TESTY ZALICZONE" : "TESTY NIEZALICZONE") + " (" + passed + "/" + (passed + failed) + ")");
    }
}
`;
}

function starterFor(level, spec) {
  if (level === 2) {
    return { 'Main.java': `// TODO: napisz klasę Main z metodą ${spec.signature.slice('static '.length)}, polem public static ${spec.resultType} result i main zgodnie z poleceniem.\n` };
  }
  const body = level === 0 ? spec.body : `// TODO\n        return ${RETURNS[spec.resultType]};`;
  const main = level === 0
    ? `        // TODO: wywołaj ${spec.callDisplay}, zapisz wynik w polu result i wypisz go przez System.out.println\n`
    : `        result = ${spec.call};\n        System.out.println(result);\n`;
  return {
    'Main.java': `public class Main {
    ${spec.signature} {
        ${body}
    }

    public static ${spec.resultType} result;

    public static void main(String[] args) {
${main}    }
}
`,
  };
}

function referenceFor(spec) {
  return {
    'Main.java': `public class Main {
    ${spec.signature} {
        ${spec.body}
    }

    public static ${spec.resultType} result;

    public static void main(String[] args) {
        result = ${spec.call};
        System.out.println(result);
    }
}
`,
  };
}

// ctx: {int(min,max), pick(array), level: 0 easy | 1 standard | 2 challenge}
export function assembleBasicsTask(variant, ctx) {
  const spec = variant.build(ctx);
  const prompt = `${spec.contract} W main wywołaj ${spec.callDisplay}, zapisz wynik w polu result i wypisz go jedną linią. ${LEVEL_LINE[ctx.level]}`;
  const criteria = [
    `Metoda zwraca poprawny wynik dla dowolnych argumentów zgodnych z opisem, nie tylko przykładu.`,
    `main zapisuje wynik wywołania ${spec.callDisplay} w polu result i wypisuje go jedną linią.`,
    'Zachowaj klasę Main, sygnaturę metody i nazwę pola result — testy odwołują się do nich wprost.',
  ];
  return {
    title: spec.title, prompt, criteria,
    starterFiles: starterFor(ctx.level, spec), referenceFiles: referenceFor(spec),
    params: { kind: 'method-task', variant: variant.id, topic: variant.topic, javaTest: javaTestSource(spec) },
  };
}
