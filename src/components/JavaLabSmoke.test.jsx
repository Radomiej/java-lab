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
});
