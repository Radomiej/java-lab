import { checkSource, mergeCompilationResult } from './lessonChecker.js';

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
        detail:passed ? 'Program uruchomił się poprawnie.' : result.error || 'Kompilacja lub uruchomienie nie powiodło się.'}],
      summary:passed ? 'Sandbox działa. Możesz rozwijać własną grę.' : 'Popraw błędy programu.',
    };
  }
  return mergeCompilationResult(checkSource(files,[...(task.checks || []),...(task.outputChecks || [])],result.output || ''),result);
}
