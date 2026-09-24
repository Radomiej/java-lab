export default function TaskPanel({ lesson, activeTask, completedTasks, onTaskChange }) {
  const modeLabels = { guided: "prowadzone", independent: "samodzielne", practice: "ćwiczenie", challenge: "wyzwanie" };

  return (
    <section className="task-panel" aria-labelledby="task-title">
      <div className="section-heading-row"><div><p className="eyebrow">Krok po kroku</p><h2 id="task-title">Wykonaj zadanie</h2></div><span className="count-badge">{lesson.tasks.length} {lesson.tasks.length === 1 ? "zadanie" : "zadania"}</span></div>
      <div className="task-list" role="tablist" aria-label="Zadania lekcji">
        {lesson.tasks.map((task, index) => (
          <button className={`task-button${activeTask.id === task.id ? " is-active" : ""}`} type="button" role="tab" aria-selected={activeTask.id === task.id} key={task.id} onClick={() => onTaskChange(task.id)}>
            <span className={`task-index task-index--${task.mode}`}>{String(index + 1).padStart(2, "0")}</span>
            <span className="task-button-copy"><small>{modeLabels[task.mode] || "zadanie"}</small><strong>{task.title}</strong></span>
            {completedTasks.includes(task.id) && <span className="task-done-label">✓</span>}
          </button>
        ))}
      </div>
      <div className="task-prompt"><span className="prompt-label">{activeTask.mode === "guided" ? "Polecenie prowadzone" : "Zadanie samodzielne"}</span><p>{activeTask.prompt}</p><ol>{activeTask.steps.map((step) => <li key={step}>{step}</li>)}</ol>{activeTask.mode === "guided" && activeTask.hints?.[0] && <p className="task-hint"><strong>Podpowiedź:</strong> {activeTask.hints[0]}</p>}</div>
    </section>
  );
}
