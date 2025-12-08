/**
 * Config Builder - Theme Manager
 * Theme switching via data-theme attribute (CSS-only approach)
 */

/**
 * Get the effective theme based on theme setting
 * @param {string} theme - 'light', 'dark', or 'system'
 * @returns {string} 'light' or 'dark'
 */
export function getEffectiveTheme(theme) {
  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }
  return theme;
}

/**
 * Apply theme class to container
 * @param {HTMLElement} container - The config builder container
 * @param {string} theme - 'light', 'dark', or 'system'
 * @returns {string} The effective theme that was applied
 */
export function applyThemeClass(container, theme) {
  if (!container) return "light";

  // Remove existing theme classes
  container.classList.remove("theme-light", "theme-dark");

  const effectiveTheme = getEffectiveTheme(theme);
  container.classList.add(`theme-${effectiveTheme}`);
  container.dataset.theme = theme;

  return effectiveTheme;
}

/**
 * Apply theme to a container element via data-theme attribute
 * CSS handles the actual styling based on the attribute
 * @param {HTMLElement} container - Container to apply theme to
 * @param {string} effectiveTheme - 'light' or 'dark'
 */
export function applyThemeToContainer(container, effectiveTheme) {
  if (!container) return;
  container.dataset.theme = effectiveTheme;
}

/**
 * Get theme variable overrides for light/dark mode
 * @deprecated Use CSS-only approach with data-theme attribute instead
 * @param {string} effectiveTheme - 'light' or 'dark'
 * @returns {Object} Empty object - CSS handles theming now
 */
export function getThemeVars(effectiveTheme) {
  // Return empty - CSS handles theming via [data-theme] selectors
  return {};
}

/**
 * Load saved theme from localStorage
 * @param {string} defaultTheme - Default theme if none saved
 * @returns {string} Saved theme or default
 */
export function loadSavedTheme(defaultTheme = "system") {
  return localStorage.getItem("fu-config-builder-theme") || defaultTheme;
}

/**
 * Save theme to localStorage
 * @param {string} theme - Theme to save
 */
export function saveTheme(theme) {
  localStorage.setItem("fu-config-builder-theme", theme);
}
