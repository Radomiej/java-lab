import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import EditorHelp from "./EditorHelp.jsx";

afterEach(cleanup);

describe("editor shortcut help", () => {
  it("keeps the shortcut list in a tooltip opened from the help button", () => {
    render(<EditorHelp />);

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Skróty edytora" }));

    expect(screen.getByRole("tooltip")).toHaveTextContent("Ctrl+Shift+F");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Usuń całą bieżącą linię");
    expect(screen.getByRole("tooltip")).toHaveTextContent("Przenieś linię");
  });

  it("closes the tooltip with Escape without reopening it on focus", () => {
    render(<EditorHelp />);
    const trigger = screen.getByRole("button", { name: "Skróty edytora" });

    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
