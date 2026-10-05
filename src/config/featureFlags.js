const DEFAULT_FLAGS = {
  "game-dev.enabled": true,
};

function isUmamiConfigured(env) {
  return Boolean(env?.VITE_UMAMI_SCRIPT_URL && env?.VITE_UMAMI_WEBSITE_ID);
}

function defaultAnalyticsEnabled(env) {
  if (!isUmamiConfigured(env) || env?.VITE_ANALYTICS_ENABLED === "false") return false;
  return env?.VITE_ANALYTICS_ENABLED === "true" || env?.VERCEL === "1";
}

export function getFeatureFlags(source = globalThis, env = import.meta.env) {
  const runtimeFlags = source?.__JAVA_LAB_FEATURE_FLAGS__;
  return {
    ...DEFAULT_FLAGS,
    "analytics.enabled": defaultAnalyticsEnabled(env),
    ...(runtimeFlags || {}),
  };
}

export function isFeatureEnabled(flagName, source = globalThis) {
  return getFeatureFlags(source)[flagName] !== false;
}

export function setRuntimeFeatureFlag(flagName, enabled, source = globalThis) {
  source.__JAVA_LAB_FEATURE_FLAGS__ = {
    ...(source.__JAVA_LAB_FEATURE_FLAGS__ || {}),
    [flagName]: enabled,
  };
  source.dispatchEvent?.(new Event("java-lab-feature-flags-changed"));
}

export { DEFAULT_FLAGS };
