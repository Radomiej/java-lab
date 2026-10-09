import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App.jsx";

afterEach(() => {cleanup(); vi.restoreAllMocks(); localStorage.clear();});

describe("Java Lab workspace", () => {
  it('offers solutions for guided and independent exercises when solution files exist',()=>{
    render(<App />);
    expect(screen.getByRole('button',{name:'Pokaż rozwiązanie'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab',{name:/Komunikat misji/i}));
    fireEvent.click(screen.getByRole('button',{name:'Pokaż rozwiązanie'}));
    expect(screen.getByRole('textbox',{name:'Kod pliku Main.java'}).textContent).not.toContain('TODO');
  });
  it('offers formatting as an accessible icon without visible button text', () => {
    render(<App />);
    const format = screen.getByRole('button', {name:'Formatuj kod'});
    expect(format.textContent).toBe('');
    expect(format).toHaveAttribute('title', 'Formatuj kod (Shift+Alt+F)');
    expect(format.querySelector('svg')).not.toBeNull();
  });
  it('lets the student delete a newly created file after confirmation, not a starter file',()=>{
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({setTransform(){},fillRect(){},fillText(){}});
    const confirm=vi.spyOn(window,'confirm').mockReturnValue(false);
    render(<App />);
    fireEvent.click(screen.getByRole('tab',{name:/Game Dev w Javie/i}));
    expect(screen.queryByRole('button',{name:'Usuń plik'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'+ Dodaj plik'}));
    fireEvent.change(screen.getByRole('textbox',{name:'Nazwa nowej klasy'}),{target:{value:'Enemy'}});
    fireEvent.click(screen.getByRole('button',{name:'Dodaj',exact:true}));
    fireEvent.click(screen.getByRole('button',{name:'Usuń plik'}));
    expect(screen.getByRole('tab',{name:/Enemy.java/})).toBeInTheDocument();
    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button',{name:'Usuń plik'}));
    expect(screen.queryByRole('tab',{name:/Enemy.java/})).not.toBeInTheDocument();
    expect(screen.getByRole('tab',{name:/GameMain.java/})).toBeInTheDocument();
  });
  it('shows only the simple game entry, not engine sources or TeaVM bindings', () => {
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({setTransform(){},fillRect(){},fillText(){}});
    render(<App />);
    fireEvent.click(screen.getByRole('tab',{name:/Game Dev w Javie/i}));
    expect(screen.getByRole('tab',{name:/GameMain.java/})).toBeInTheDocument();
    expect(screen.queryByRole('tab',{name:/^J Main\.java$/})).not.toBeInTheDocument();
    expect(screen.queryByRole('tab',{name:/Sprite.java/})).not.toBeInTheDocument();
    expect(screen.queryByRole('tab',{name:/GameLauncher.java/})).not.toBeInTheDocument();
    expect(screen.getByRole('textbox',{name:'Kod pliku GameMain.java'})).toBeInTheDocument();
  });
  it('keeps one RUN and the console in the main area for ordinary Java', () => {
    render(<App />);
    expect(screen.getAllByRole('button',{name:/^▶?\s*RUN$/})).toHaveLength(1);
    expect(document.querySelector('main .runtime-console')).toBeInTheDocument();
    expect(document.querySelector('.inspector-region')).not.toBeInTheDocument();
  });
  it('places actions above the code and attaches the console directly below it', () => {
    render(<App />);
    const toolbar = screen.getByRole('toolbar',{name:'Akcje edytora'});
    const editor = screen.getByRole('textbox',{name:'Kod pliku Main.java'});
    const consolePanel = screen.getByRole('region',{name:'Konsola'});
    expect(toolbar).toContainElement(screen.getByRole('button',{name:/RUN/}));
    expect(toolbar.compareDocumentPosition(editor) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(editor.closest('.code-editor-wrap').nextElementSibling).toBe(consolePanel);
    expect(consolePanel.closest('.editor-shell')).toBe(editor.closest('.editor-shell'));
  });
  it('enlarges the existing game canvas as a modal and closes it with Escape', () => {
    vi.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({setTransform(){},fillRect(){},fillText(){}});
    render(<App />);
    fireEvent.click(screen.getByRole('tab',{name:/Game Dev w Javie/i}));
    const canvas=document.querySelector('.game-canvas');
    fireEvent.click(screen.getByRole('button',{name:'Pełny ekran gry'}));
    expect(screen.getByRole('dialog',{name:'Podgląd gry'})).toContainElement(canvas);
    fireEvent.keyDown(document,{key:'Escape'});
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.querySelector('.game-canvas')).toBe(canvas);
  });
  it("renders the first lesson and its primary actions", () => {
    render(<App />);

    expect(screen.getAllByText("Java Lab").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Pierwszy program Javy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /RUN/ })).toBeInTheDocument();
    expect(screen.getByRole('heading',{name:'Konsola'})).toBeInTheDocument();
  });

  it("hides hints after switching to an independent task", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: /Komunikat misji/i }));

    expect(screen.getByText(/Komunikat misji/i)).toBeInTheDocument();
    expect(screen.queryByText(/Podpowiedź:/i)).not.toBeInTheDocument();
  });

  it("pokazuje ścieżkę 04 Game Dev i pozwala schować lewy panel", () => {
    render(<App />);

    expect(screen.getByRole("tab", { name: /Game Dev w Javie/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Schowaj panel ścieżek/i }));

    expect(screen.getByRole("button", { name: /Pokaż panel ścieżek/i })).toBeInTheDocument();
    expect(document.querySelector(".app-shell--sidebar-collapsed")).toBeInTheDocument();
  });

  it("ukrywa ścieżkę Game Dev, gdy flaga runtime jest wyłączona", () => {
    globalThis.__JAVA_LAB_FEATURE_FLAGS__ = { "game-dev.enabled": false };
    render(<App />);

    expect(screen.queryByRole("tab", { name: /Game Dev w Javie/i })).not.toBeInTheDocument();
    delete globalThis.__JAVA_LAB_FEATURE_FLAGS__;
  });
});
