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

function evaluateCheck(files, check) {
  const label = check.label || "Warunek zadania";
  const source = getFileText(files, check.file);
  const location = check.file ? ` w pliku ${check.file}` : "";

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

export function checkSource(files, checks = []) {
  const results = checks.map((check) => evaluateCheck(files || {}, check));
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
