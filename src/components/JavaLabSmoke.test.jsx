import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App.jsx";

afterEach(() => {cleanup(); vi.restoreAllMocks(); localStorage.clear(); window.history.replaceState(null,'','/');});
beforeEach(() => {vi.spyOn(window,'scrollTo').mockImplementation(()=>{});});

describe("Java Lab workspace", () => {
  it('keeps theory, quiz and editor visible together on one lesson page',()=>{
    render(<App/>);
    expect(screen.getByRole('region',{name:'Teoria i przykład'})).toBeInTheDocument();
    expect(screen.getByRole('region',{name:'Krótka próba'})).toBeInTheDocument();
    expect(screen.getByRole('textbox',{name:'Kod pliku Main.java'})).toBeInTheDocument();
    const taskRegion = screen.getByRole('region',{name:'Zadanie do wykonania'});
    expect(taskRegion).toContainElement(screen.getByRole('textbox',{name:'Kod pliku Main.java'}));
    expect(within(taskRegion).getAllByRole('tab', { name: /Powitaj gracza|Komunikat misji|Trzy linie historii/ })).toHaveLength(3);
    expect(screen.queryByRole('button',{name:'1. Nauka'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'2. Quiz'})).not.toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'3. Zadanie'})).not.toBeInTheDocument();
  });
  it('offers solutions only for guided exercises, not independent tasks',()=>{
    render(<App />);
    expect(screen.getByRole('button',{name:'Pokaż rozwiązanie'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab',{name:/Komunikat misji/i}));
    expect(screen.queryByRole('button',{name:'Pokaż rozwiązanie'})).not.toBeInTheDocument();
    expect(screen.queryByText(/Podpowiedź:/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab',{name:/Powitaj gracza/i}));
    expect(screen.getByRole('button',{name:'Pokaż rozwiązanie'})).toBeInTheDocument();
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
    // Lekcje Game Dev używają układu pilota — edytor jest widoczny bez etapów.
    expect(screen.getByRole('textbox',{name:'Kod pliku GameMain.java'})).toBeInTheDocument();
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
    // Wynik gry nie montuje się stale; uczeń otwiera go dopiero na żądanie.
    expect(screen.queryByRole('button',{name:'Pełny ekran gry'})).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Pokaż podgląd wyniku'}));
    const canvas=document.querySelector('.game-canvas');
    expect(canvas).toBeInTheDocument();
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

  it("shows the pilot layout for GameDev and the one-page lesson flow for 413", () => {
    render(<App />);
    fireEvent.click(screen.getByRole('tab',{name:/Algorytmy/i}));

    fireEvent.click(screen.getByRole('button',{name:/Sortowanie bąbelkowe/i}));
    expect(screen.queryByRole('button',{name:'1. Nauka'})).not.toBeInTheDocument();
    expect(screen.getByText(/Teoria pod ręką/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Przewidź i sprawdź/));
    expect(screen.getByRole('button',{name:/Następny krok/})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/Następny krok/}));
    expect(screen.getByText('Krok 2 / 11')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button',{name:/Liczby pierwsze/i}));
    expect(screen.getByRole('region',{name:'Teoria i przykład'})).toBeInTheDocument();
    expect(screen.getByRole('region',{name:'Krótka próba'})).toBeInTheDocument();
    expect(screen.getByRole('region',{name:'Zadanie do wykonania'})).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'1. Nauka'})).not.toBeInTheDocument();
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
