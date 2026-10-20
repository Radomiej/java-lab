// Public metadata only; no lesson solutions or answer keys.
export const javaQuizLessons = [
  {
    "id": "fundamentals-01",
    "title": "Pierwszy program Javy",
    "order": 101
  },
  {
    "id": "fundamentals-02",
    "title": "Zmienne i typy danych",
    "order": 102
  },
  {
    "id": "fundamentals-03",
    "title": "Warunki i pętle",
    "order": 103
  },
  {
    "id": "fundamentals-04",
    "title": "Metody i odpowiedzialność",
    "order": 104
  },
  {
    "id": "objects-05",
    "title": "Klasa i obiekt",
    "order": 201
  },
  {
    "id": "objects-06",
    "title": "Konstruktor i enkapsulacja",
    "order": 202
  },
  {
    "id": "objects-07",
    "title": "Kompozycja",
    "order": 203
  },
  {
    "id": "objects-08",
    "title": "Obiekt gotowy do testowania",
    "order": 204
  },
  {
    "id": "inheritance-09",
    "title": "Dziedziczenie przez extends",
    "order": 301
  },
  {
    "id": "inheritance-10",
    "title": "Overriding",
    "order": 302
  },
  {
    "id": "inheritance-11",
    "title": "Polimorfizm",
    "order": 303
  },
  {
    "id": "inheritance-12",
    "title": "Wyjątki i bezpieczny program",
    "order": 304
  },
  {
    "id": "g2d.scene",
    "title": "Scena, obiekty i komponenty",
    "order": 401
  },
  {
    "id": "g2d.input",
    "title": "Sterowanie i kierunek postaci",
    "order": 402
  },
  {
    "id": "g2d.collisions",
    "title": "Collidery, przeszkody i granice świata",
    "order": 403
  },
  {
    "id": "g2d.enemy-ai",
    "title": "Pierwszy przeciwnik i pościg",
    "order": 404
  },
  {
    "id": "g2d.projectiles",
    "title": "Pociski, HP i pierwsza pętla walki",
    "order": 405
  },
  {
    "id": "g2d.components",
    "title": "Własna klasa komponentu i cykl życia",
    "order": 406
  },
  {
    "id": "g2d.time",
    "title": "Czas, wektory i stała prędkość",
    "order": 407
  },
  {
    "id": "g2d.graphics",
    "title": "Sprite, kafelki, odbicie i warstwy",
    "order": 408
  },
  {
    "id": "g2d.waves",
    "title": "Fale, konfiguracja i powtarzalny spawn",
    "order": 409
  },
  {
    "id": "g2d.health",
    "title": "Health, obrażenia i nietykalność gracza",
    "order": 410
  },
  {
    "id": "g2d.weapons",
    "title": "Weapon, cooldown i automatyczny atak",
    "order": 411
  },
  {
    "id": "g2d.triggers",
    "title": "Triggery, monety i własny Wallet",
    "order": 412
  },
  {
    "id": "g2d.loot-xp",
    "title": "Śmierć przeciwnika, łup i doświadczenie",
    "order": 413
  },
  {
    "id": "g2d.enemy-tactics",
    "title": "AI: wykrywanie, flankowanie i ucieczka",
    "order": 414
  },
  {
    "id": "g2d.camera",
    "title": "Kamera i przestrzenie współrzędnych",
    "order": 415
  },
  {
    "id": "g2d.canvas-ui",
    "title": "Canvas, ręczne rysowanie i HUD",
    "order": 416
  },
  {
    "id": "g2d.ui-flow",
    "title": "Pauza i działające menu",
    "order": 417
  },
  {
    "id": "g2d.upgrades",
    "title": "Wybór ulepszenia i własne reguły zakupów",
    "order": 418
  },
  {
    "id": "g2d.feedback",
    "title": "Feedback trafienia, tweeny i floating text",
    "order": 419
  },
  {
    "id": "g2d.projectile-types",
    "title": "Pociski naprowadzane i przebijające",
    "order": 420
  },
  {
    "id": "g2d.composition",
    "title": "Kompozycja, fabryki i wyposażenie",
    "order": 421
  },
  {
    "id": "g2d.run-state",
    "title": "Start, przegrana, zwycięstwo i restart",
    "order": 422
  },
  {
    "id": "g2d.performance",
    "title": "Wydajność, testowanie i zapis projektu",
    "order": 423
  },
  {
    "id": "g2d.survivor",
    "title": "Projekt końcowy: Łąka przetrwania",
    "order": 424
  }
];
export const javaQuizTemplates = javaQuizLessons.map(lesson=>({id:'java-quiz-'+lesson.id,appId:'java-lab',name:'Quiz · '+lesson.title,kind:'quiz'}));

export const javaCourseTemplates = javaQuizLessons.map(lesson=>({id:'java-course-'+lesson.id,appId:'java-lab',name:'Zadanie · '+lesson.title,kind:'course-task'}));
