// Explicit task contracts, not inferred from the student's source code.
const outputs = {
  "fundamentals-01": [["Witaj, Java!", "Zaczynamy quest"], ["Misja: Znajdź skarb"], ["Start", "Las", "Skarb"]],
  "fundamentals-02": [["Ada", "100"], ["87.5", "true"], ["55"]],
  "fundamentals-03": [["1", "2", "3", "Zaliczone"], ["2", "4"], ["3", "2", "1"]],
  "fundamentals-04": [["30"], ["100"], ["Awans"]],
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
