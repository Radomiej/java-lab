const DEFAULT_FLAGS = {
  "game-dev.enabled": true,
};

export function getFeatureFlags(source = globalThis) {
  const runtimeFlags = source?.__JAVA_LAB_FEATURE_FLAGS__;
  return { ...DEFAULT_FLAGS, ...(runtimeFlags || {}) };
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
