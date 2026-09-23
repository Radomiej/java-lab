import express from "express";
import { mkdir } from "node:fs/promises";
import { compileJava, readRuntimeArtifact, runtimeRoot } from "./javaRunner.js";

const app = express();
const port = Number(process.env.PORT || 3002);

app.disable("x-powered-by");
app.use(express.json({ limit: "320kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "java-lab-runner" });
});

app.post("/api/java/compile", async (request, response) => {
  try {
    const result = await compileJava(request.body || {});
    response.status(result.ok === false && result.phase === "compile" ? 422 : 200).json(result);
  } catch (error) {
    const status = {
      JDK_NOT_FOUND: 503,
      TIMEOUT: 408,
      UNSAFE_PATH: 400,
      INVALID_MAIN: 400,
    }[error.code] || 500;
    response.status(status).json({
      ok: false,
      code: error.code || "RUNNER_ERROR",
      message: error.message || "Lokalny runner nie wykonał zadania.",
    });
  }
});

app.get("/runtime/jobs/:jobId/app.jar", async (request, response) => {
  try {
    const artifact = await readRuntimeArtifact(request.params.jobId, "app.jar");
    response.type("application/java-archive").send(artifact);
  } catch (error) {
    response.status(error.code === "NOT_FOUND" ? 404 : 500).json({
      ok: false,
      code: error.code || "ARTIFACT_ERROR",
      message: error.message || "Nie znaleziono artefaktu.",
    });
  }
});

await mkdir(runtimeRoot, { recursive: true });
app.listen(port, "127.0.0.1", () => {
  console.log(`Java Lab runner listening on http://127.0.0.1:${port}`);
});
