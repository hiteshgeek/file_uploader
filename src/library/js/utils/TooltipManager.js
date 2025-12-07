/**
 * TooltipManager - Global Fixed Tooltip System
 *
 * A robust tooltip system that uses position:fixed to escape
 * any overflow:hidden or scrollable containers.
 *
 * Features:
 * - Fixed positioning (escapes scroll containers)
 * - Smart positioning (auto-flips if near viewport edge)
 * - Support for keyboard shortcuts display
 * - Theme-aware (uses CSS variables)
 * - Singleton pattern (one tooltip for all elements)
 *
 * Usage:
 * 1. Auto-init: Add data-tooltip="text" to any element
 *    Optional: data-tooltip-position="top|bottom|left|right"
 *    Optional: data-tooltip-shortcut="Ctrl+S"
 *
 * 2. Manual: TooltipManager.init(container) to scan for tooltips
 *
 * 3. Programmatic:
 *    TooltipManager.show(element, "text", { position: "right" })
 *    TooltipManager.hide()
 *
 * @module TooltipManager
 */

class TooltipManager {
  static instance = null;
  static tooltipElement = null;
  static currentTarget = null;
  static hideTimeout = null;
  static showDelay = 200;
  static hideDelay = 100;
  static offset = 10;
  static systemThemeMediaQuery = null;

  /**
   * Initialize the tooltip system
   * @param {HTMLElement} container - Container to scan for tooltip elements
   */
  static init(container = document.body) {
    // Create tooltip element if it doesn't exist
    if (!this.tooltipElement) {
      this.createTooltipElement();
    }

    // Setup system theme change listener
    this.setupSystemThemeListener();

    // Bind events to elements with data-tooltip attribute
    this.bindEvents(container);

    return this;
  }

  /**
   * Setup listener for system theme changes (prefers-color-scheme)
   */
  static setupSystemThemeListener() {
    // Only setup once
    if (this.systemThemeMediaQuery) return;

    this.systemThemeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    // Listen for system theme changes
    this.systemThemeMediaQuery.addEventListener("change", (e) => {
      // If tooltip is currently visible and using system theme, update it
      if (this.currentTarget && this.tooltipElement?.classList.contains("visible")) {
        this.applyThemeFromTarget(this.currentTarget);
      }
    });
  }

  /**
   * Create the global tooltip DOM element
   */
  static createTooltipElement() {
    // Check if already exists in DOM
    this.tooltipElement = document.querySelector(".fu-global-tooltip");

    if (!this.tooltipElement) {
      this.tooltipElement = document.createElement("div");
      this.tooltipElement.className = "fu-global-tooltip";
      this.tooltipElement.innerHTML = `
        <div class="fu-global-tooltip__arrow"></div>
        <div class="fu-global-tooltip__content">
          <span class="fu-global-tooltip__text"></span>
        </div>
      `;
      document.body.appendChild(this.tooltipElement);
    }

    return this.tooltipElement;
  }

  /**
   * Bind hover events to elements with data-tooltip
   * @param {HTMLElement} container - Container to scan
   */
  static bindEvents(container) {
    const elements = container.querySelectorAll("[data-tooltip]");

    elements.forEach((el) => {
      // Skip if already bound
      if (el._tooltipBound) return;

      // Skip elements using CSS-only tooltips (has-tooltip class without data-tooltip-fixed)
      // Unless they explicitly want fixed positioning
      if (el.classList.contains("has-tooltip") && !el.dataset.tooltipFixed) {
        return;
      }

      el._tooltipBound = true;

      // Bind events with proper this context
      const handleEnter = (e) => this.handleMouseEnter(e);
      const handleLeave = (e) => this.handleMouseLeave(e);

      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
      el.addEventListener("focus", handleEnter);
      el.addEventListener("blur", handleLeave);
    });
  }

  /**
   * Handle mouse enter event
   */
  static handleMouseEnter(e) {
    const target = e.currentTarget;
    const text = target.dataset.tooltip;

    if (!text) return;

    clearTimeout(this.hideTimeout);

    // Small delay before showing
    setTimeout(() => {
      if (target.matches(":hover") || target === document.activeElement) {
        this.show(target, text, {
          position: target.dataset.tooltipPosition || "top",
          shortcut: target.dataset.tooltipShortcut,
        });
      }
    }, this.showDelay);
  }

  /**
   * Handle mouse leave event
   */
  static handleMouseLeave(e) {
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.hideDelay);
  }

  /**
   * Show tooltip for an element
   * @param {HTMLElement} target - Element to show tooltip for
   * @param {string} text - Tooltip text
   * @param {Object} options - Options { position, shortcut }
   */
  static show(target, text, options = {}) {
    if (!this.tooltipElement) {
      this.createTooltipElement();
    }

    this.currentTarget = target;

    const { position = "top", shortcut = null } = options;

    // Detect theme from target element's context
    this.applyThemeFromTarget(target);

    // Update content
    const contentEl = this.tooltipElement.querySelector(
      ".fu-global-tooltip__content"
    );
    const textEl = this.tooltipElement.querySelector(
      ".fu-global-tooltip__text"
    );

    textEl.textContent = text;

    // Add or remove shortcut badge
    let shortcutEl = contentEl.querySelector(".fu-global-tooltip__shortcut");
    if (shortcut) {
      if (!shortcutEl) {
        shortcutEl = document.createElement("span");
        shortcutEl.className = "fu-global-tooltip__shortcut";
        contentEl.appendChild(shortcutEl);
      }
      shortcutEl.textContent = shortcut;
    } else if (shortcutEl) {
      shortcutEl.remove();
    }

    // Calculate position
    const pos = this.calculatePosition(target, position);

    // Apply position
    this.tooltipElement.style.left = `${pos.x}px`;
    this.tooltipElement.style.top = `${pos.y}px`;
    this.tooltipElement.setAttribute("data-position", pos.finalPosition);

    // Show
    this.tooltipElement.classList.add("visible");
  }

  /**
   * Detect and apply theme from the target element's context
   * Checks for various theme indicators (data-theme, .theme-dark, .theme-light, etc.)
   * Falls back to system theme (prefers-color-scheme) when no explicit theme is set
   * @param {HTMLElement} target - Target element to check theme from
   */
  static applyThemeFromTarget(target) {
    // Check for theme in the element or its ancestors
    const themeContainer =
      target.closest("[data-theme]") ||
      target.closest(".theme-dark") ||
      target.closest(".theme-light") ||
      target.closest(".fu-config-builder");

    // Remove existing theme classes
    this.tooltipElement.classList.remove("theme-dark", "theme-light");
    this.tooltipElement.removeAttribute("data-theme");

    if (themeContainer) {
      // Check data-theme attribute
      const dataTheme = themeContainer.getAttribute("data-theme");
      if (dataTheme) {
        // Handle "system" theme value
        if (dataTheme === "system") {
          this.applySystemTheme();
          return;
        }
        this.tooltipElement.setAttribute("data-theme", dataTheme);
        return;
      }

      // Check theme classes
      if (themeContainer.classList.contains("theme-dark")) {
        this.tooltipElement.classList.add("theme-dark");
        this.tooltipElement.setAttribute("data-theme", "dark");
      } else if (themeContainer.classList.contains("theme-light")) {
        this.tooltipElement.classList.add("theme-light");
        this.tooltipElement.setAttribute("data-theme", "light");
      }
    } else {
      // No explicit theme found, fall back to system preference
      this.applySystemTheme();
    }
  }

  /**
   * Apply theme based on system preference (prefers-color-scheme)
   */
  static applySystemTheme() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = prefersDark ? "dark" : "light";

    this.tooltipElement.classList.add(`theme-${theme}`);
    this.tooltipElement.setAttribute("data-theme", theme);
  }

  /**
   * Hide the tooltip
   */
  static hide() {
    if (this.tooltipElement) {
      this.tooltipElement.classList.remove("visible");
    }
    this.currentTarget = null;
  }

  /**
   * Calculate tooltip position with smart flipping
   * @param {HTMLElement} target - Target element
   * @param {string} preferredPosition - Preferred position
   * @returns {Object} { x, y, finalPosition }
   */
  static calculatePosition(target, preferredPosition) {
    const targetRect = target.getBoundingClientRect();
    const tooltipRect = this.tooltipElement.getBoundingClientRect();

    // Make tooltip visible but transparent to measure
    this.tooltipElement.style.visibility = "hidden";
    this.tooltipElement.style.opacity = "0";
    this.tooltipElement.style.display = "block";

    // Get actual tooltip dimensions
    const tooltipWidth = this.tooltipElement.offsetWidth;
    const tooltipHeight = this.tooltipElement.offsetHeight;

    // Viewport dimensions
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x, y;
    let finalPosition = preferredPosition;

    // Calculate position based on preference
    const positions = {
      top: () => {
        x = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        y = targetRect.top - tooltipHeight - this.offset;
      },
      bottom: () => {
        x = targetRect.left + targetRect.width / 2 - tooltipWidth / 2;
        y = targetRect.bottom + this.offset;
      },
      left: () => {
        x = targetRect.left - tooltipWidth - this.offset;
        y = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      },
      right: () => {
        x = targetRect.right + this.offset;
        y = targetRect.top + targetRect.height / 2 - tooltipHeight / 2;
      },
    };

    // Try preferred position first
    positions[preferredPosition]();

    // Check if tooltip fits in viewport, flip if needed
    const padding = 8;

    // Flip horizontal positions
    if (preferredPosition === "left" && x < padding) {
      positions.right();
      finalPosition = "right";
    } else if (
      preferredPosition === "right" &&
      x + tooltipWidth > viewport.width - padding
    ) {
      positions.left();
      finalPosition = "left";
    }

    // Flip vertical positions
    if (preferredPosition === "top" && y < padding) {
      positions.bottom();
      finalPosition = "bottom";
    } else if (
      preferredPosition === "bottom" &&
      y + tooltipHeight > viewport.height - padding
    ) {
      positions.top();
      finalPosition = "top";
    }

    // Clamp to viewport edges
    x = Math.max(padding, Math.min(x, viewport.width - tooltipWidth - padding));
    y = Math.max(
      padding,
      Math.min(y, viewport.height - tooltipHeight - padding)
    );

    // Reset visibility
    this.tooltipElement.style.visibility = "";
    this.tooltipElement.style.opacity = "";

    return { x, y, finalPosition };
  }

  /**
   * Update tooltip content dynamically
   * @param {string} text - New text
   * @param {string} shortcut - New shortcut (optional)
   */
  static updateContent(text, shortcut = null) {
    if (!this.tooltipElement) return;

    const textEl = this.tooltipElement.querySelector(
      ".fu-global-tooltip__text"
    );
    if (textEl) {
      textEl.textContent = text;
    }

    const contentEl = this.tooltipElement.querySelector(
      ".fu-global-tooltip__content"
    );
    let shortcutEl = contentEl?.querySelector(".fu-global-tooltip__shortcut");

    if (shortcut) {
      if (!shortcutEl) {
        shortcutEl = document.createElement("span");
        shortcutEl.className = "fu-global-tooltip__shortcut";
        contentEl.appendChild(shortcutEl);
      }
      shortcutEl.textContent = shortcut;
    } else if (shortcutEl) {
      shortcutEl.remove();
    }
  }

  /**
   * Destroy the tooltip system
   */
  static destroy() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
    this.currentTarget = null;
    clearTimeout(this.hideTimeout);
    this.systemThemeMediaQuery = null;
  }
}

export default TooltipManager;
