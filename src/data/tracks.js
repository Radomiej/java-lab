export const trackOrder = ["fundamentals", "objects", "inheritance", "game-dev", "playground"];

export const tracks = {
  playground: {id:'playground',label:'Playground',shortLabel:'Własna gra',description:'Własna gra w Javie.',accent:'#e58a69',icon:'05'},
  fundamentals: {
    id: "fundamentals",
    label: "Fundamenty",
    shortLabel: "Podstawy",
    description: "Od pierwszego maina do metod i pętli.",
    accent: "#25b8a7",
    icon: "01",
  },
  objects: {
    id: "objects",
    label: "Obiekty",
    shortLabel: "OOP I",
    description: "Klasy, konstruktory, pola i kompozycja.",
    accent: "#7ab8ff",
    icon: "02",
  },
  inheritance: {
    id: "inheritance",
    label: "Dziedziczenie",
    shortLabel: "OOP II",
    description: "Polimorfizm, overriding i bezpieczne wyjątki.",
    accent: "#dcb86b",
    icon: "03",
  },
  "game-dev": {
    id: "game-dev",
    label: "Game Dev w Javie",
    shortLabel: "GAME",
    description: "GameObjecty, komponenty i pierwsza gra w przeglądarce.",
    accent: "#e58a69",
    icon: "04",
  },
};
