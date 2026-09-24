import { createPortal } from "react-dom";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import "./EditorHelp.css";

const SHORTCUT_GROUPS = [
  {
    title: "Pisanie kodu",
    shortcuts: [
      [["Tab"], "Wstaw dwa spacje"],
      [["Ctrl", "D"], "Usuń całą bieżącą linię"],
      [["Ctrl", "/"], "Przełącz komentarz linii"],
    ],
  },
  {
    title: "Formatowanie i ruch",
    shortcuts: [
      [["Ctrl", "Shift", "F"], "Formatuj kod"],
      [["Shift", "Alt", "F"], "Formatuj kod (VS Code)"],
      [["Alt", "↑"], ["Alt", "↓"], "Przenieś linię w górę lub w dół"],
      [["Shift", "Alt", "↑"], ["Shift", "Alt", "↓"], "Duplikuj linię"],
    ],
  },
  {
    title: "Podpowiedzi",
    shortcuts: [
      [["Ctrl", "Spacja"], "Otwórz IntelliSense"],
      [["Esc"], "Zamknij listę podpowiedzi albo tę pomoc"],
    ],
  },
];

function ShortcutKeys({ keys }) {
  return (
    <span className="editor-help-keymap">
      {keys.map((key, index) => (
        <span className="editor-help-key-part" key={`${key}-${index}`}>
          {index > 0 && <span aria-hidden="true" className="editor-help-key-plus">+</span>}
          <kbd>{key}</kbd>
        </span>
      ))}
    </span>
  );
}

export default function EditorHelp() {
  const [open, setOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState({});
  const controlRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const suppressFocusRef = useRef(false);
  const tooltipId = useId();

  useLayoutEffect(() => {
    if (!open) return undefined;

    const positionPanel = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const margin = 12;
      const gap = 8;
      const triggerRect = trigger.getBoundingClientRect();
      const width = Math.min(440, window.innerWidth - margin * 2);
      const maxHeight = Math.max(220, window.innerHeight - margin * 2);
      const panelHeight = Math.min(panel.scrollHeight || maxHeight, maxHeight);
      const roomBelow = window.innerHeight - triggerRect.bottom - gap - margin;
      const top = roomBelow >= Math.min(panelHeight, 300)
        ? triggerRect.bottom + gap
        : Math.max(margin, triggerRect.top - gap - panelHeight);
      const left = Math.min(
        Math.max(margin, triggerRect.right - width),
        window.innerWidth - margin - width,
      );

      setPanelStyle({ top, left, width, maxHeight });
    };

    positionPanel();
    window.addEventListener("resize", positionPanel);
    window.addEventListener("scroll", positionPanel, true);
    return () => {
      window.removeEventListener("resize", positionPanel);
      window.removeEventListener("scroll", positionPanel, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      suppressFocusRef.current = true;
      triggerRef.current?.focus();
      suppressFocusRef.current = false;
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <span
      ref={controlRef}
      className="editor-help-control"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        if (document.activeElement !== triggerRef.current) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        className="button button--ghost editor-help-button"
        type="button"
        title="Skróty edytora"
        aria-label="Skróty edytora"
        aria-controls={tooltipId}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onFocus={() => {
          if (!suppressFocusRef.current) setOpen(true);
        }}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">?</span>
      </button>
      {open && createPortal(
        <div
          ref={panelRef}
          id={tooltipId}
          className="editor-help-tooltip"
          role="tooltip"
          aria-label="Sterowanie edytorem"
          style={panelStyle}
        >
          <div className="editor-help-header">
            <strong>Sterowanie edytorem</strong>
            <span>Skróty działają, gdy kursor jest w aktywnym pliku.</span>
          </div>
          <div className="editor-help-groups">
            {SHORTCUT_GROUPS.map((group) => (
              <section className="editor-help-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="editor-help-shortcuts">
                  {group.shortcuts.map(([keys, alternativeKeys, description]) => {
                    const isAlternative = Array.isArray(alternativeKeys);
                    const shortcutDescription = isAlternative ? description : alternativeKeys;
                    return (
                      <div className="editor-help-shortcut" key={shortcutDescription}>
                        <span className="editor-help-keymaps">
                          <ShortcutKeys keys={keys} />
                          {isAlternative && (
                            <span className="editor-help-alternative">
                              <span className="editor-help-or">lub</span>
                              <ShortcutKeys keys={alternativeKeys} />
                            </span>
                          )}
                        </span>
                        <span>{shortcutDescription}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
          <div className="editor-help-platform-note">Na macOS użyj <kbd>⌘</kbd> zamiast <kbd>Ctrl</kbd>.</div>
        </div>,
        document.body,
      )}
    </span>
  );
}
