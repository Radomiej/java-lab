import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import TaskPanel from "./TaskPanel.jsx";

describe("expected console output", () => {
  afterEach(cleanup);
  it("separates lines and exposes spaces without changing the raw output", () => {
    const task = { id: "example", mode: "independent", title: "Example", prompt: "Print", steps: [], outputChecks: [{ kind: "outputLines", values: ["A B", "", " C "] }] };
    render(<TaskPanel lesson={{ tasks: [task] }} activeTask={task} completedTasks={[]} onTaskChange={() => {}} />);
    expect(screen.getByLabelText("Oczekiwane wyjście konsoli").textContent).toBe("A·B↵\n↵\n·C·↵\n");
    fireEvent.click(screen.getByRole("button", { name: "Pokaż białe znaki" }));
    expect(screen.getByLabelText("Oczekiwane wyjście konsoli").textContent).toBe("A B\n\n C \n");
  });
  it("does not invent console output for game behavior tests", () => {
    const task = { id: "game", title: "Game", mode: "guided", steps: [], outputChecks: [] };
    render(<TaskPanel lesson={{ tasks: [task] }} activeTask={task} completedTasks={[]} onTaskChange={() => {}} />);
    expect(screen.queryByLabelText("Oczekiwane wyjście konsoli")).not.toBeInTheDocument();
  });
});
