import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App.jsx";

afterEach(cleanup);

describe("Java Lab workspace", () => {
  it("renders the first lesson and its primary actions", () => {
    render(<App />);

    expect(screen.getAllByText("Java Lab").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Pierwszy program Javy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sprawdź zadanie/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Uruchom w przeglądarce/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /TeaVM/i })).toBeInTheDocument();
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
