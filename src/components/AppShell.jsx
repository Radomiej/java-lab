import { useEffect, useRef, useState } from "react";

export default function AppShell({ sidebar, main, inspector }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [panelSizes, setPanelSizes] = useState({ sidebar: 260, inspector: 380 });
  const resizeRef = useRef(null);

  useEffect(() => {
    const move = (event) => {
      if (!resizeRef.current) return;
      const { panel, startX, startSize } = resizeRef.current;
      const delta = event.clientX - startX;
      setPanelSizes((current) => ({
        ...current,
        [panel]: Math.max(panel === "sidebar" ? 210 : 300, Math.min(panel === "sidebar" ? 420 : 720, startSize + (panel === "sidebar" ? delta : -delta))),
      }));
    };
    const stop = () => { resizeRef.current = null; document.body.classList.remove("is-resizing-panels"); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", stop); };
  }, []);

  const startResize = (panel, event) => {
    event.preventDefault();
    resizeRef.current = { panel, startX: event.clientX, startSize: panelSizes[panel] };
    document.body.classList.add("is-resizing-panels");
  };

  return (
    <div className={`app-shell${!inspector ? ' app-shell--no-inspector' : ''}${sidebarOpen ? " app-shell--sidebar-open" : ""}${sidebarCollapsed ? " app-shell--sidebar-collapsed" : ""}`} style={{ "--sidebar-size": `${panelSizes.sidebar}px`, "--inspector-size": `${panelSizes.inspector}px` }}>
      <button className="sidebar-backdrop" type="button" aria-label="Zamknij menu" onClick={() => setSidebarOpen(false)} />
      <aside className="sidebar-region" id="course-sidebar">{sidebar}</aside>
      <button className="panel-resizer panel-resizer--sidebar" type="button" aria-label="Zmień szerokość panelu ścieżek" onPointerDown={(event) => startResize("sidebar", event)} />
      <main className="main-region">
        <header className="mobile-header">
          <button className="icon-button" type="button" onClick={() => setSidebarOpen(true)} aria-label="Otwórz lekcje">☰</button>
          <span className="mobile-brand"><span className="brand-mark">J</span> Java Lab</span>
          <span className="mobile-status"><span className="status-dot" /> w przeglądarce</span>
        </header>
        <div className="workspace-toolbar">
          <button className="button button--ghost" type="button" onClick={() => setSidebarCollapsed((value) => !value)}>
            {sidebarCollapsed ? "Pokaż panel ścieżek" : "Schowaj panel ścieżek"}
          </button>
          <span className="toolbar-note">TeaVM · WebAssembly · Java 21 · zasoby lokalne</span>
        </div>
        {main}
      </main>
      {inspector && <>
        <button className="panel-resizer panel-resizer--inspector" type="button" aria-label="Zmień szerokość panelu gry" onPointerDown={(event) => startResize("inspector", event)} />
        <aside className="inspector-region" aria-label="Podgląd gry">{inspector}</aside>
      </>}
    </div>
  );
}
