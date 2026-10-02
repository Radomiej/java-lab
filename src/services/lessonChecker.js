function getFileText(files, file) {
  if (file) return typeof files[file] === "string" ? files[file] : "";
  return Object.values(files || {})
    .filter((value) => typeof value === "string")
    .join("\n");
}

function pass(label, detail) {
  return { passed: true, label, detail };
}

function fail(label, detail) {
  return { passed: false, label, detail };
}

function evaluateCheck(files, check, executionOutput = "") {
  const label = check.label || "Warunek zadania";
  const source = getFileText(files, check.file);
  const location = check.file ? ` w pliku ${check.file}` : "";

  if (check.kind === "outputContains") {
    const passed = executionOutput.includes(check.value);
    return passed
      ? pass(label, `Wynik programu zawiera: ${check.value}`)
      : fail(label, `Wynik programu nie zawiera: ${check.value}`);
  }

  if (check.kind === "outputEquals") {
    const passed = executionOutput.trim() === String(check.value).trim();
    return passed
      ? pass(label, "Wynik programu jest poprawny.")
      : fail(label, `Oczekiwano wyniku: ${check.value}`);
  }

  if (check.kind === "outputLines") {
    const actual = executionOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const expected = check.values.map((line) => String(line).trim());
    const passed = actual.length === expected.length && actual.every((line, index) => line === expected[index]);
    return passed
      ? pass(label, "Wszystkie linie wyniku są poprawne.")
      : fail(label, `Oczekiwano linii: ${expected.join(" | ")}`);
  }

  if (!source) {
    return fail(label, `Nie znaleziono kodu${location}.`);
  }

  if (check.kind === "contains" || check.kind === "fileContains") {
    const passed = source.includes(check.value);
    return passed
      ? pass(label, `Znaleziono wymagany fragment: ${check.value}`)
      : fail(label, `Brakuje fragmentu: ${check.value}`);
  }

  if (check.kind === "containsAll") {
    const missing = check.values.filter((value) => !source.includes(value));
    return missing.length === 0
      ? pass(label, "Wszystkie wymagane fragmenty są obecne.")
      : fail(label, `Brakuje: ${missing.join(", ")}`);
  }

  if (check.kind === "regex") {
    let matched = false;
    try {
      matched = new RegExp(check.value, check.flags || "m").test(source);
    } catch {
      return fail(label, "Reguła zadania ma niepoprawne wyrażenie regularne.");
    }
    return matched
      ? pass(label, "Kod pasuje do wymaganej struktury.")
      : fail(label, `Kod nie pasuje do wzorca: ${check.value}`);
  }

  if (check.kind === "excludes") {
    const passed = !source.includes(check.value);
    return passed
      ? pass(label, `Nie znaleziono zakazanego fragmentu: ${check.value}`)
      : fail(label, `Usuń zakazany fragment: ${check.value}`);
  }

  return fail(label, `Nieznany typ sprawdzenia: ${check.kind}`);
}

export function checkSource(files, checks = [], executionOutput = "") {
  const results = checks.map((check) => evaluateCheck(files || {}, check, executionOutput));
  const score = results.filter((result) => result.passed).length;
  const passed = results.length > 0 && score === results.length;
  return {
    passed,
    score,
    total: results.length,
    results,
    summary: passed
      ? "Wszystkie testy zadania są zaliczone."
      : `Zaliczone testy: ${score}/${results.length}.`,
  };
}

export function mergeCompilationResult(report, compilation) {
  if (compilation?.ok === true) return report;
  return {
    ...report,
    passed: false,
    results: [
      {
        passed: false,
        label: "Kompilacja programu",
        detail: compilation?.error || compilation?.diagnostics?.map((item) => item.message).filter(Boolean).join("\n") || "Brak potwierdzenia poprawnej kompilacji i uruchomienia.",
      },
      ...report.results,
    ],
    score: report.score,
    total: report.total + 1,
    summary: "Zadanie niezaliczone: kod nie kompiluje się.",
  };
}
