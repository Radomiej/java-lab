import { useEffect, useRef, useState } from "react";
import { formatJavaSource, triggerEditorAction } from "./javaEditorCommands.js";
import { createJavaCompletionProvider } from "./javaIntellisense.js";
import EditorHelp from "./EditorHelp.jsx";
import { gameEngineRuntimeFiles } from "../data/gameEngineRuntime.js";

function fileIcon(fileName) {
  return fileName.endsWith(".java") ? "J" : "·";
}

function insertIndent(event, source, activeFile, onCodeChange) {
  if (event.key !== "Tab") return;

  event.preventDefault();
  const start = event.currentTarget.selectionStart;
  const end = event.currentTarget.selectionEnd;
  onCodeChange(activeFile, `${source.slice(0, start)}  ${source.slice(end)}`);
  requestAnimationFrame(() => {
    event.currentTarget.selectionStart = start + 2;
    event.currentTarget.selectionEnd = start + 2;
  });
}

export default function CodeEditor({
  files,
  activeFile,
  taskId,
  onFileChange,
  onCodeChange,
  onCheck,
  onCompile,
  onReset,
  onSolution,
  runner,
  engine,
}) {
  const readOnly = Boolean(engine && Object.hasOwn(gameEngineRuntimeFiles, activeFile));
  const [newClassName, setNewClassName] = useState("");
  const [fileError, setFileError] = useState("");
  const [addingFile, setAddingFile] = useState(false);
  const source = files[activeFile] || "";
  const editorHostRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const completionProviderRef = useRef(null);
  const editorActionsRef = useRef([]);
  const modelsRef = useRef(new Map());
  const modelListenersRef = useRef(new Map());
  const filesRef = useRef(files);
  const activeFileRef = useRef(activeFile);
  const onCodeChangeRef = useRef(onCodeChange);
  const [editorReady, setEditorReady] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const workspaceKey = taskId || "lesson";

  useEffect(() => {
    if (editorReady) editorRef.current?.updateOptions({ readOnly });
  }, [editorReady, readOnly]);

  useEffect(() => {
    filesRef.current = files;
    activeFileRef.current = activeFile;
    onCodeChangeRef.current = onCodeChange;
  }, [activeFile, files, onCodeChange]);

  useEffect(() => {
    setEditorReady(false);
    setLoadError(null);
    let cancelled = false;

    async function mountMonaco() {
      try {
        const [monacoModule, workerModule, javaLanguageModule] = await Promise.all([
          import("monaco-editor"),
          import("monaco-editor/esm/vs/editor/editor.worker?worker"),
          import("monaco-editor/esm/vs/basic-languages/java/java.js"),
        ]);

        if (cancelled || !editorHostRef.current) return;

        const monaco = monacoModule.default || monacoModule;
        const EditorWorker = workerModule.default;
        const javaLanguage = javaLanguageModule.default || javaLanguageModule;
        globalThis.MonacoEnvironment = {
          ...(globalThis.MonacoEnvironment || {}),
          getWorker: () => new EditorWorker(),
        };

        if (!monaco.languages.getLanguages().some((language) => language.id === "java")) {
          monaco.languages.register({
            id: "java",
            aliases: ["Java", "java"],
            extensions: [".java", ".jav"],
          });
          monaco.languages.setMonarchTokensProvider("java", javaLanguage.language);
          monaco.languages.setLanguageConfiguration("java", javaLanguage.conf);
        }

        const editor = monaco.editor.create(editorHostRef.current, {
          automaticLayout: true,
          fontSize: 13,
          lineHeight: 21,
          minimap: { enabled: false },
          padding: { top: 14, bottom: 14 },
          scrollBeyondLastLine: false,
          suggest: {
            showFunctions: true,
            showKeywords: true,
            showMethods: true,
          },
          tabSize: 2,
          theme: "vs-dark",
          wordWrap: "off",
        });

        const editorActions = [
          {
            id: "java-lab.format-document",
            label: "Java Lab: Formatuj kod",
            keybindings: [
              monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
              monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
            ],
            run: (currentEditor) => {
              const model = currentEditor.getModel();
              if (!model) return;

              const formatted = formatJavaSource(model.getValue());
              if (formatted === model.getValue()) return;
              currentEditor.pushUndoStop();
              currentEditor.executeEdits("java-lab-format", [{
                range: model.getFullModelRange(),
                text: formatted,
              }]);
              currentEditor.pushUndoStop();
            },
          },
          {
            id: "java-lab.delete-line",
            label: "Java Lab: Usuń linię",
            keybindings: [
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD,
              monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK,
            ],
            run: (currentEditor) => triggerEditorAction(currentEditor, "editor.action.deleteLines"),
          },
          {
            id: "java-lab.toggle-comment",
            label: "Java Lab: Przełącz komentarz linii",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash],
            run: (currentEditor) => triggerEditorAction(currentEditor, "editor.action.commentLine"),
          },
          {
            id: "java-lab.move-line-up",
            label: "Java Lab: Przenieś linię wyżej",
            keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.UpArrow],
            run: (currentEditor) => triggerEditorAction(currentEditor, "editor.action.moveLinesUpAction"),
          },
          {
            id: "java-lab.move-line-down",
            label: "Java Lab: Przenieś linię niżej",
            keybindings: [monaco.KeyMod.Alt | monaco.KeyCode.DownArrow],
            run: (currentEditor) => triggerEditorAction(currentEditor, "editor.action.moveLinesDownAction"),
          },
          {
            id: "java-lab.duplicate-line-up",
            label: "Java Lab: Duplikuj linię wyżej",
            keybindings: [
              monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.UpArrow,
              monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.UpArrow,
            ],
            run: (currentEditor) => triggerEditorAction(currentEditor, "editor.action.copyLinesUpAction"),
          },
          {
            id: "java-lab.duplicate-line-down",
            label: "Java Lab: Duplikuj linię niżej",
            keybindings: [
              monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.DownArrow,
              monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.DownArrow,
            ],
            run: (currentEditor) => triggerEditorAction(currentEditor, "editor.action.copyLinesDownAction"),
          },
        ];
        editorActionsRef.current = editorActions.map((action) => editor.addAction(action));

        const getOrCreateModel = (fileName) => {
          if (modelsRef.current.has(fileName)) return modelsRef.current.get(fileName);

          const uri = monaco.Uri.parse(
            `inmemory://java-lab/${encodeURIComponent(workspaceKey)}/${encodeURIComponent(fileName)}`,
          );
          const model = monaco.editor.createModel(filesRef.current[fileName] || "", "java", uri);
          const listener = model.onDidChangeContent(() => {
            onCodeChangeRef.current(fileName, model.getValue());
          });
          modelsRef.current.set(fileName, model);
          modelListenersRef.current.set(fileName, listener);
          return model;
        };

        editor.setModel(getOrCreateModel(activeFileRef.current));
        const completionProvider = monaco.languages.registerCompletionItemProvider(
          "java",
          createJavaCompletionProvider(monaco),
        );

        editorRef.current = editor;
        monacoRef.current = monaco;
        completionProviderRef.current = completionProvider;
        setEditorReady(true);
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : "Nie udało się załadować Monaco.");
        }
      }
    }

    mountMonaco();

    return () => {
      cancelled = true;
      completionProviderRef.current?.dispose();
      completionProviderRef.current = null;
      editorActionsRef.current.forEach((action) => action.dispose());
      editorActionsRef.current = [];
      editorRef.current?.dispose();
      editorRef.current = null;
      modelListenersRef.current.forEach((listener) => listener.dispose());
      modelListenersRef.current.clear();
      modelsRef.current.forEach((model) => model.dispose());
      modelsRef.current.clear();
      monacoRef.current = null;
    };
  }, [workspaceKey]);

  useEffect(() => {
    if (!editorReady || !editorRef.current || !monacoRef.current) return;

    const model = modelsRef.current.get(activeFile);
    if (model) {
      editorRef.current.setModel(model);
      return;
    }

    const uri = monacoRef.current.Uri.parse(
      `inmemory://java-lab/${encodeURIComponent(workspaceKey)}/${encodeURIComponent(activeFile)}`,
    );
    const nextModel = monacoRef.current.editor.createModel(source, "java", uri);
    const listener = nextModel.onDidChangeContent(() => {
      onCodeChangeRef.current(activeFile, nextModel.getValue());
    });
    modelsRef.current.set(activeFile, nextModel);
    modelListenersRef.current.set(activeFile, listener);
    editorRef.current.setModel(nextModel);
  }, [activeFile, editorReady, source, workspaceKey]);

  useEffect(() => {
    if (!editorReady) return;

    const model = modelsRef.current.get(activeFile);
    if (model && model.getValue() !== source) {
      model.setValue(source);
    }
  }, [activeFile, editorReady, source]);

  return (
    <div className="editor-shell">
      <div className="editor-tabs" role="tablist" aria-label="Pliki lekcji">
        {Object.keys(files).map((fileName) => (
          <button
            className={`editor-tab${activeFile === fileName ? " is-active" : ""}`}
            type="button"
            role="tab"
            aria-selected={activeFile === fileName}
            key={fileName}
            onClick={() => onFileChange(fileName)}
          >
            <span className="file-icon">{fileIcon(fileName)}</span>
            {fileName}
          </button>
        ))}
      {engine && <button className="editor-tab editor-tab--add" type="button" onClick={() => { setAddingFile(!addingFile); setFileError(""); }}>+ Dodaj plik</button>}
      </div>
      <div className="editor-card-heading">
        <strong>{activeFile}{readOnly ? " · API silnika (tylko odczyt)" : ""}</strong>
        <span className="editor-card-heading-actions">
          <span className="editor-language">Java · UTF-8 · Monaco</span>
          <EditorHelp />
        </span>
      </div>
      {engine && addingFile && <form className="editor-add-file" onSubmit={(event) => {
        event.preventDefault();
        const name = newClassName.trim().replace(/\.java$/, "");
        if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) {
          setFileError("Podaj poprawną nazwę klasy Java.");
          return;
        }
        const file = `${name}.java`;
        if (Object.hasOwn(files, file)) {
          setFileError("Taki plik już istnieje.");
          return;
        }
        onCodeChange(file, `public class ${name} {\n}\n`);
        onFileChange(file);
        setNewClassName("");
        setFileError("");
        setAddingFile(false);
      }}>
        <input autoFocus aria-label="Nazwa nowej klasy" value={newClassName} onChange={(event) => setNewClassName(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setAddingFile(false); }} placeholder="Enemy.java" />
        <button type="submit" className="button button--ghost">Dodaj</button>
        <button type="button" className="button button--ghost" onClick={() => setAddingFile(false)}>Anuluj</button>
        {fileError && <span role="alert">{fileError}</span>}
      </form>}
      {loadError ? (
        <div className="code-editor-wrap code-editor-fallback-wrap">
          <textarea
            className="code-editor"
            aria-label={`Kod pliku ${activeFile}`}
            spellCheck="false"
            value={source}
            readOnly={readOnly}
            onChange={(event) => onCodeChange(activeFile, event.target.value)}
            onKeyDown={(event) => insertIndent(event, source, activeFile, onCodeChange)}
          />
        </div>
      ) : (
        <div className="code-editor-wrap monaco-editor-wrap">
          <div
            ref={editorHostRef}
            className="monaco-editor-host"
            data-testid="monaco-editor"
            role="textbox"
            aria-label={`Kod pliku ${activeFile}`}
          />
          {!editorReady && <div className="monaco-loading" aria-live="polite">Ładowanie edytora…</div>}
        </div>
      )}
      <div className="editor-actions">
        <button className="button button--primary" type="button" onClick={onCheck} disabled={runner.status === "compiling"}>✓ Sprawdź zadanie</button>
        <button className="button button--teavm" type="button" onClick={onCompile} disabled={runner.status === "compiling"}>▶ Uruchom w przeglądarce</button>
        {onSolution && <button className="button button--ghost button--solution" type="button" onClick={onSolution}>Pokaż rozwiązanie</button>}
        <button className="button button--ghost" type="button" onClick={onReset}>Przywróć start</button>
      </div>
    </div>
  );
}
