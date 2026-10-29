// Explicit task contracts, not inferred from the student's source code.
const outputs = {
  "fundamentals-01": [["Witaj, Java!", "Zaczynamy quest"], ["Misja: Znajdź skarb"], ["Start", "Las", "Skarb"]],
  "fundamentals-02": [["Ada", "100"], ["87.5", "true"], ["55"]],
  "fundamentals-03": [["1", "2", "3", "Zaliczone"], ["2", "4"], ["3", "2", "1"]],
  "fundamentals-04": [["30"], ["100"], ["Awans"]],
  "algorithms-01": [["9"], ["15"], ["2"]],
  "algorithms-02": [["1", "2", "5", "9"], ["1", "2", "3", "4"], ["9", "5", "2", "1"]],
  "algorithms-03": [["2", "3", "4", "7"], ["3"], ["7", "4", "3", "2"]],
  "algorithms-04": [["1", "2", "5", "8"], ["1", "3", "7", "9"], ["8", "5", "2", "1"]],
  "algorithms-05": [["[1, 2, 3, 4, 5]"], ["[1, 2, 4, 5]"], ["[5, 4, 3, 2, 1]"]],
  "algorithms-06": [["2"], ["2", "4", "5", "7", "9"], ["9", "7", "5", "4", "2"]],
  "algorithms-07": [["1", "1", "2", "3", "4"], ["0", "2", "3", "3"], ["2"]],
  "algorithms-08": [["1", "3", "5", "7", "8"], ["1", "2", "4", "6", "9"], ["1", "2", "5", "8"]],
  "algorithms-09": [["3"], ["1"], ["3"]],
  "algorithms-10": [["720"], ["1024"], ["10"]],
  "algorithms-11": [["13"], ["55"], ["20"]],
  "algorithms-12": [["6"], ["24"], ["true"]],
  "algorithms-13": [["true"], ["10"], ["13"]],
  "algorithms-14": [["true"], ["avaJ"], ["true"]],
  "algorithms-15": [["DEF"], ["ABC"], ["URYYB"]],
  "algorithms-16": [["1101"], ["FF"], ["13"]],
  "algorithms-17": [["7"], ["2"], ["4"]],
  "algorithms-18": [["5"], ["13", "24"], ["22"]],
  "algorithms-19": [["5"], ["2"], ["true"]],
  "algorithms-20": [["4"], ["true"], ["2"]],
  "objects-05": [["Smok"], ["Klucz"], ["Quest: Smok"]],
  "objects-06": [["Zaginiony klucz"], ["Zamek"], ["15"]],
  "objects-07": [["Planner gotowy"], ["Mapa"], ["Bohater gotowy"]],
  "objects-08": [["true"], ["false"], ["35"]],
  "inheritance-09": [["Luna"], ["Borin"], ["Nox"]],
  "inheritance-10": [["Mage"], ["Warrior"], ["Bohater z tarczą"]],
  "inheritance-11": [["Mage", "Warrior"], ["Healer", "Archer"], ["Czar", "Miecz"]],
  "inheritance-12": [["Punkty nie mogą być ujemne"], ["42"], ["Nazwa jest wymagana"]],
};

export function withConsoleExpectations(lesson) {
  if (!outputs[lesson.id]) return lesson;
  return {
    ...lesson,
    tasks: lesson.tasks.map((task, index) => ({
      ...task,
      checks: [],
      outputChecks: [{ kind: "outputLines", label: "Wynik uruchomionego programu", values: outputs[lesson.id][index] }],
    })),
  };
}
