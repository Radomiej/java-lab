import { useMemo } from "react";

function fileIcon(fileName) {
  return fileName.endsWith(".java") ? "J" : "·";
}

export default function CodeEditor({ files, activeFile, onFileChange, onCodeChange, onCheck, onCompile, onReset, onSolution, runner }) {
  const source = files[activeFile] || "";
  const lineCount = useMemo(() => Math.max(1, source.split("\n").length), [source]);

  const handleKeyDown = (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const start = event.currentTarget.selectionStart;
    const end = event.currentTarget.selectionEnd;
    onCodeChange(activeFile, `${source.slice(0, start)}  ${source.slice(end)}`);
    requestAnimationFrame(() => {
      event.currentTarget.selectionStart = start + 2;
      event.currentTarget.selectionEnd = start + 2;
    });
  };

  return (
    <div className="editor-shell">
      <div className="editor-tabs" role="tablist" aria-label="Pliki lekcji">
        {Object.keys(files).map((fileName) => <button className={`editor-tab${activeFile === fileName ? " is-active" : ""}`} type="button" role="tab" aria-selected={activeFile === fileName} key={fileName} onClick={() => onFileChange(fileName)}><span className="file-icon">{fileIcon(fileName)}</span>{fileName}</button>)}
      </div>
      <div className="editor-card-heading"><strong>{activeFile}</strong><span className="editor-language">Java · UTF-8</span></div>
      <div className="code-editor-wrap">
        <div className="line-numbers" aria-hidden="true">{Array.from({ length: lineCount }, (_, index) => <span key={index}>{index + 1}</span>)}</div>
        <textarea className="code-editor" aria-label={`Kod pliku ${activeFile}`} spellCheck="false" value={source} onChange={(event) => onCodeChange(activeFile, event.target.value)} onKeyDown={handleKeyDown} />
      </div>
      <p className="editor-help">Tab wstawia dwa spacje. Kod zostaje w tej przeglądarce i jest uruchamiany przez TeaVM.</p>
      <div className="editor-actions">
        <button className="button button--primary" type="button" onClick={onCheck}>✓ Sprawdź zadanie</button>
        <button className="button button--teavm" type="button" onClick={onCompile} disabled={runner.status === "compiling"}>▶ Uruchom w przeglądarce</button>
        {onSolution && <button className="button button--ghost button--solution" type="button" onClick={onSolution}>Pokaż rozwiązanie</button>}
        <button className="button button--ghost" type="button" onClick={onReset}>Przywróć start</button>
      </div>
    </div>
  );
}
