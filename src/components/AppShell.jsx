import { useState } from "react";

export default function AppShell({ sidebar, main, inspector }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`app-shell${sidebarOpen ? " app-shell--sidebar-open" : ""}${sidebarCollapsed ? " app-shell--sidebar-collapsed" : ""}`}>
      <button className="sidebar-backdrop" type="button" aria-label="Zamknij menu" onClick={() => setSidebarOpen(false)} />
      <aside className="sidebar-region" id="course-sidebar">{sidebar}</aside>
      <main className="main-region">
        <header className="mobile-header">
          <button className="icon-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Otwórz lekcje">☰</button>
          <span className="mobile-brand"><span className="brand-mark">J</span> Java Lab</span>
          <span className="mobile-status"><span className="status-dot" /> lokalnie</span>
        </header>
        <div className="workspace-toolbar">
          <button className="button button--ghost" type="button" onClick={() => setSidebarCollapsed((value) => !value)}>
            {sidebarCollapsed ? "Pokaż ścieżki" : "Schowaj ścieżki"}
          </button>
          <span className="toolbar-note">JDK 17 · CheerpJ 4.3 · zapis lokalny</span>
        </div>
        {main}
      </main>
      <aside className="inspector-region" aria-label="Wynik programu i diagnostyka">{inspector}</aside>
    </div>
  );
}
