import { checkSource, mergeCompilationResult } from './lessonChecker.js';
import { formatJavaRuntimeError } from '../../public/vendor/teavm/java-errors.js';

export function buildTaskCheckRequest(task, files) {
  if (task.engine) return {
    files: { ...files, ...(task.javaTestFiles || {}) },
    mainClass: task.javaTestMainClass || task.mainClass,
    mode: 'console',
  };
  return {files,mainClass:task.mainClass,mode:task.runMode || 'console'};
}

export function evaluateTaskCheck(task, files, result) {
  if (task.engine) {
    const passed = result.ok === true;
    return {
      passed, score: passed ? 1 : 0, total: 1,
      results: [{passed,label:task.javaTestMainClass ? 'Testy Java' : 'Kompilacja i start sandboxa',
        detail:passed ? (task.javaTestMainClass ? 'Testy zachowania zakończone poprawnie.' : 'Program uruchomił się poprawnie.') : (result.error ? (/wasm:\/\/|dereferencing a null pointer/.test(result.error) ? formatJavaRuntimeError(result.error) : result.error) : 'Kompilacja lub uruchomienie nie powiodło się.')}],
      summary:passed ? (task.javaTestMainClass ? 'Kryteria zadania spełnione.' : 'Sandbox działa. Możesz rozwijać własną grę.') : result.validationFailure ? 'Zadanie nie spełnia jeszcze kryteriów.' : 'Popraw błędy programu.',
    };
  }
  return mergeCompilationResult(checkSource(files,[...(task.checks || []),...(task.outputChecks || [])],result.output || ''),result);
}
