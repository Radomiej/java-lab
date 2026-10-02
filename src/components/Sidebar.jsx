function lessonIsComplete(lesson, completedTasks) {
  return lesson.tasks.length > 0 && lesson.tasks.every((task) => completedTasks.includes(task.id));
}

export default function Sidebar({ tracks, trackOrder, lessons, selectedTrack, selectedLessonId, completedTasks, completedCount, onTrackChange, onLessonChange, onOpenSettings }) {
  const track = tracks[selectedTrack] || tracks[trackOrder[0]];
  const trackLessons = lessons.filter((lesson) => lesson.track === selectedTrack);
  const totalTasks = lessons.reduce((sum, lesson) => sum + lesson.tasks.length, 0);

  return (
    <nav className="sidebar" aria-label="Nawigacja kursu">
      <div className="sidebar-brand">
        <span className="brand-mark" aria-hidden="true">J</span>
        <div className="sidebar-brand-copy"><strong>Java Lab</strong><span>Ucz się przez budowanie</span></div>
        <button className="sidebar-settings-button" type="button" onClick={onOpenSettings} aria-label="Wyczyść postęp">↺</button>
      </div>

      <div className="sidebar-progress" aria-label="Postęp kursu">
        <div className="progress-heading"><span>Twój postęp</span><strong>{completedCount}</strong></div>
        <div className="progress-track"><span style={{ width: `${(100 * completedCount) / Math.max(1, totalTasks)}%` }} /></div>
        <span className="progress-caption">z {totalTasks} zadań zaliczonych</span>
      </div>

      <div className="sidebar-section-title">Ścieżki nauki</div>
      <div className="track-list" role="tablist" aria-label="Ścieżki nauki">
        {trackOrder.map((trackId) => {
          const item = tracks[trackId];
          return (
            <button className={`track-button${selectedTrack === trackId ? " is-active" : ""}`} role="tab" aria-selected={selectedTrack === trackId} type="button" key={trackId} onClick={() => onTrackChange(trackId)}>
              <span className="track-icon" style={{ "--track-accent": item.accent }}>{item.icon}</span>
              <span>{item.label}</span>
              <span className="track-count">{lessons.filter((lesson) => lesson.track === trackId).length}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-section-heading"><span>{track.label}</span><span>{trackLessons.length} lekcje</span></div>
      <div className="lesson-list">
        {trackLessons.map((lesson) => (
          <button className={`lesson-button${selectedLessonId === lesson.id ? " is-active" : ""}`} type="button" key={lesson.id} aria-current={selectedLessonId === lesson.id ? "page" : undefined} onClick={() => onLessonChange(lesson.id)}>
            <span className="lesson-number">{String(lesson.order).padStart(2, "0")}</span>
            <span className="lesson-copy"><strong>{lesson.title}</strong><small>{lesson.summary}</small><em>{lesson.tasks.length} {lesson.tasks.length === 1 ? "zadanie" : "zadania"}</em></span>
            {lessonIsComplete(lesson, completedTasks) && <span className="lesson-check" aria-label="Ukończona">✓</span>}
          </button>
        ))}
      </div>

      <div className="sidebar-footer"><span>{lessons.length} lekcji</span><span className="offline-badge"><span className="status-dot" /> lokalnie</span></div>
    </nav>
  );
}
