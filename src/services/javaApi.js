function apiError(code, message, details = {}) {
  const error = new Error(message);
  error.code = code;
  Object.assign(error, details);
  return error;
}

export async function compileAndRun(payload, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 20_000);
  try {
    const response = await fetch("/api/java/compile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: options.signal || controller.signal,
    });
    let body;
    try {
      body = await response.json();
    } catch {
      throw apiError("BAD_RESPONSE", "Serwer zwrócił nieczytelną odpowiedź.");
    }
    if (!response.ok || body.ok === false && body.code) {
      throw apiError(body.code || "SERVER_ERROR", body.message || body.output || "Serwer nie wykonał zadania.", body);
    }
    return body;
  } catch (error) {
    if (error.name === "AbortError") {
      throw apiError("TIMEOUT", "Połączenie z lokalnym runnerem trwało zbyt długo.");
    }
    if (error instanceof TypeError) {
      throw apiError("SERVER_UNAVAILABLE", "Nie znaleziono lokalnego serwera Javy. Uruchom npm run dev:server.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
