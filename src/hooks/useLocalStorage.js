import { useCallback, useState } from "react";

function readValue(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue));

  const updateValue = useCallback(
    (nextValue) => {
      setValue((currentValue) => {
        const resolved = typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // The caller still receives the in-memory value when storage is full or blocked.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, updateValue];
}
