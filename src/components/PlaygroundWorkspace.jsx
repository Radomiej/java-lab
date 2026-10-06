import CodeEditor from './CodeEditor.jsx';
import PlaygroundTools from './PlaygroundTools.jsx';
export default function PlaygroundWorkspace({project,activeFile,onFileChange,onCodeChange,onDeleteFile,onRun,onReset,onImport,runner}){
  return <div className="lesson-workspace"><section className="lesson-overview"><h1>Własna gra w Javie</h1><p>Rozwijaj GameMain i własne komponenty. RUN kompiluje projekt i uruchamia grę. Kliknij planszę, aby sterować strzałkami lub WASD.</p><PlaygroundTools project={project} onImport={onImport}/></section><section className="editor-section"><CodeEditor files={project.files} protectedFiles={{'GameMain.java':project.files['GameMain.java']}} activeFile={activeFile} taskId="playground-game-project" engine onFileChange={onFileChange} onCodeChange={onCodeChange} onDeleteFile={onDeleteFile} onCheck={onRun} onReset={onReset} runner={runner}/></section></div>;
}
