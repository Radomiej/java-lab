import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App.jsx";

describe("Java Lab workspace", () => {
  it("renders the first lesson and its primary actions", () => {
    render(<App />);

    expect(screen.getAllByText("Java Lab").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Pierwszy program Javy" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sprawdź zadanie/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Uruchom w przeglądarce/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /CheerpJ/i })).not.toBeInTheDocument();
  });
});
