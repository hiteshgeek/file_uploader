/**
 * Config Builder - Variable Maps
 * CSS variable to selector mappings for style highlighting
 */

/**
 * Get mapping of CSS variables to their associated selectors
 * Used for highlighting elements in the preview when editing style variables
 * @returns {Object} Map of CSS variable names to selector strings
 */
export function getVarToSelectorMap() {
  return {
    // Primary colors - dropzone, buttons, links
    "--fu-primary-50": ".media-hub-dropzone",
    "--fu-primary-100": ".media-hub-limits-summary",
    "--fu-primary-400": ".media-hub-dropzone, .media-hub-btn",
    "--fu-primary-500":
      ".media-hub-dropzone:hover, .media-hub-btn:hover",
    "--fu-primary-600": ".media-hub-type-icon",
    "--fu-color-primary":
      ".media-hub-dropzone, .media-hub-btn, .media-hub-file-link",
    "--fu-color-primary-hover": ".media-hub-dropzone:hover",
    "--fu-color-primary-light": ".media-hub-dropzone",

    // Text colors
    "--fu-color-text": ".file-uploader, .media-hub-file-name, .media-hub-limits-title",
    "--fu-color-text-muted": ".media-hub-hint, .media-hub-file-size",
    "--fu-color-text-light": ".media-hub-dropzone-text",

    // Background colors
    "--fu-color-bg": ".file-uploader, .media-hub-file, .media-hub-type-card",
    "--fu-color-bg-light": ".media-hub-dropzone, .media-hub-limits",
    "--fu-color-bg-hover": ".media-hub-file:hover, .media-hub-limits-summary, .media-hub-compact-progress, .media-hub-type-progress, .media-hub-general-card-progress",

    // Border colors
    "--fu-color-border": ".file-uploader, .media-hub-file",
    "--fu-color-border-light": ".media-hub-dropzone, .media-hub-limits, .media-hub-type-card, .media-hub-type-header",
    "--fu-color-border-hover": ".media-hub-dropzone:hover",

    // Success colors (palette level)
    "--fu-success-50": ".media-hub-download",
    "--fu-success-500": ".media-hub-progress-fill, .media-hub-type-progress-fill, .media-hub-limit-progress-fill",
    "--fu-success-600": ".media-hub-download:hover",
    "--fu-success-700": ".media-hub-download:active",

    // Status colors (semantic)
    "--fu-color-success":
      ".media-hub-file-success, .media-hub-progress-bar",
    "--fu-color-success-bg": ".media-hub-file-success",
    "--fu-color-success-text": ".media-hub-file-success",
    "--fu-color-error": ".media-hub-file-error, .media-hub-error",
    "--fu-color-error-bg": ".media-hub-file-error",
    "--fu-color-error-text": ".media-hub-file-error",
    "--fu-color-error-hover": ".media-hub-remove:hover",

    // Error colors (palette level)
    "--fu-error-50": ".media-hub-error-message",
    "--fu-error-100": ".media-hub-error-details",
    "--fu-error-300": ".media-hub-type-card.error",
    "--fu-error-500": ".media-hub-remove",
    "--fu-error-600": ".media-hub-remove:hover, .media-hub-type-card.error",
    "--fu-error-700": ".media-hub-error-icon, .media-hub-type-card.error",
    "--fu-error-800": ".media-hub-remove:active",

    // Warning colors (palette level)
    "--fu-warning-400": ".media-hub-warning-icon",
    "--fu-warning-500": ".media-hub-type-card.warning",
    "--fu-warning-600": ".media-hub-type-card.warning",

    // Gray colors (palette level)
    "--fu-gray-50": ".media-hub-type-card",
    "--fu-gray-100": ".media-hub-type-header",
    "--fu-gray-200": ".media-hub-type-divider",
    "--fu-gray-300": ".media-hub-type-card",
    "--fu-gray-400": ".media-hub-type-icon.empty",
    "--fu-gray-500": ".media-hub-file-meta",
    "--fu-gray-600": ".media-hub-limits-text",

    // Spacing
    "--fu-spacing-xs": ".media-hub-limits-toggle",
    "--fu-spacing-sm": ".media-hub-file, .media-hub-type-header",
    "--fu-spacing-md": ".media-hub-dropzone, .media-hub-files, .media-hub-limits, .media-hub-type-card",
    "--fu-spacing-lg": ".file-uploader, .media-hub-limits, .media-hub-limits-grid",
    "--fu-spacing-xl": ".media-hub-dropzone",
    "--fu-spacing-2xl": ".media-hub-files",

    // Typography
    "--fu-font-size-xs": ".media-hub-limits-toggle, .media-hub-type-value",
    "--fu-font-size-sm": ".media-hub-file-size, .media-hub-hint, .media-hub-limits-title, .media-hub-type-name",
    "--fu-font-size-base": ".file-uploader, .media-hub-file-name",
    "--fu-font-weight-medium": ".media-hub-limits-title, .media-hub-type-name",
    "--fu-font-weight-semibold": ".media-hub-file-name",

    // Border radius
    "--fu-radius-xs": ".media-hub-compact-progress, .media-hub-type-progress, .media-hub-limit-progress",
    "--fu-radius-sm": ".media-hub-limits-toggle, .media-hub-type-icon",
    "--fu-radius-md": ".media-hub-btn, .media-hub-file, .media-hub-limits, .media-hub-type-card",
    "--fu-radius-lg": ".file-uploader, .media-hub-dropzone",
    "--fu-radius-round": ".media-hub-remove",

    // Shadows
    "--fu-shadow-sm": ".media-hub-file",
    "--fu-shadow-md": ".media-hub-file:hover, .media-hub-type-card:hover",

    // Transitions
    "--fu-transition-base": ".media-hub-file, .media-hub-btn",
    "--fu-transition-fast": ".media-hub-remove",

    // Component specific
    "--fu-dropzone-padding": ".media-hub-dropzone",
    "--fu-dropzone-border-width": ".media-hub-dropzone",
    "--fu-preview-height": ".media-hub-file-preview",
    "--fu-preview-height-mobile": ".media-hub-file-preview",
    "--fu-icon-size-sm": ".media-hub-file-icon",
    "--fu-icon-size-md": ".media-hub-type-icon",
    "--fu-icon-size-lg": ".media-hub-dropzone-icon",
    "--fu-icon-size-xl": ".media-hub-empty-icon",
    "--fu-button-size": ".media-hub-btn",
    "--fu-spinner-size": ".media-hub-spinner",
    "--fu-spinner-border-width": ".media-hub-spinner",
    "--fu-limit-item-width": ".media-hub-limit-item",
    "--fu-limit-item-width-large": ".media-hub-limit-item.large",
  };
}

/**
 * Get mapping of semantic variables to their source palette variables
 * This matches the CSS definitions in _variables.scss
 * @returns {Object} Map with 'light' and 'dark' mode mappings
 */
export function getVarSourceMap() {
  return {
    // Light mode semantic -> palette mappings
    light: {
      "--fu-color-primary": "--fu-primary-400",
      "--fu-color-primary-hover": "--fu-primary-500",
      "--fu-color-primary-light": "--fu-primary-50",
      "--fu-color-text": "--fu-gray-700",
      "--fu-color-text-muted": "--fu-gray-500",
      "--fu-color-text-light": "--fu-gray-600",
      "--fu-color-bg-light": "--fu-gray-50",
      "--fu-color-bg-hover": "--fu-primary-50",
      "--fu-color-border": "--fu-gray-300",
      "--fu-color-border-light": "--fu-gray-200",
      "--fu-color-border-hover": "--fu-primary-400",
      "--fu-color-success": "--fu-success-500",
      "--fu-color-success-bg": "--fu-success-100",
      "--fu-color-success-text": "--fu-success-700",
      "--fu-color-error": "--fu-error-500",
      "--fu-color-error-bg": "--fu-error-100",
      "--fu-color-error-text": "--fu-error-700",
      "--fu-color-error-hover": "--fu-error-800",
    },
    // Dark mode semantic -> palette mappings
    dark: {
      "--fu-color-text": "--fu-gray-200",
      "--fu-color-text-muted": "--fu-gray-400",
      "--fu-color-text-light": "--fu-gray-300",
      "--fu-color-bg": "--fu-gray-800",
      "--fu-color-bg-light": "--fu-gray-700",
      "--fu-color-bg-hover": "--fu-primary-900",
      "--fu-color-border": "--fu-gray-600",
      "--fu-color-border-light": "--fu-gray-700",
      "--fu-color-border-hover": "--fu-primary-400",
    },
  };
}
