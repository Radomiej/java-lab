import { beforeEach, describe, expect, it, vi } from "vitest";
import { compileAndRun } from "./javaApi.js";

describe("javaApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("posts source files and returns a successful runner response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, output: "Witaj", jarUrl: "/runtime/jobs/a/app.jar" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      compileAndRun({
        files: { "Main.java": "class Main {}" },
        mainClass: "Main",
        mode: "console",
      }),
    ).resolves.toMatchObject({ ok: true, output: "Witaj" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/java/compile",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("normalizes an unavailable JDK into an instructional error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ code: "JDK_NOT_FOUND", message: "Zainstaluj JDK 17." }),
    }));

    await expect(
      compileAndRun({ files: { "Main.java": "class Main {}" }, mainClass: "Main" }),
    ).rejects.toMatchObject({ code: "JDK_NOT_FOUND", message: "Zainstaluj JDK 17." });
  });
});
