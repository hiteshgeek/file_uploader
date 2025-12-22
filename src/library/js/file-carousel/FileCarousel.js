/**
 * FileCarousel.js
 *
 * Main carousel component for file/media preview in a modal gallery.
 * Supports images, videos, audio, PDFs, Excel, CSV, and text files.
 *
 * @module FileCarousel
 * @requires MediaPreloader - For file preloading and caching
 * @requires MediaRenderer - For rendering file previews
 * @requires ModalController - For modal UI management
 */

import { MediaPreloader } from "./MediaPreloader.js";
import { MediaRenderer } from "./MediaRenderer.js";
import { ModalController } from "./ModalController.js";
import { getIcon } from "../shared/icons.js";

// ============================================================
// FILE CAROUSEL CLASS
// Main orchestrator for the carousel component
// ============================================================

/**
 * FileCarousel - A modal gallery viewer for various file types
 *
 * @class
 * @param {Object} options - Configuration options
 * @param {HTMLElement} options.container - Container element for the carousel
 * @param {Array} options.files - Array of file objects to display
 * @param {boolean|Array} options.autoPreload - Auto-preload files (true, false, or array of types)
 * @param {boolean} options.enableManualLoading - Allow manual loading of non-preloaded files
 * @param {boolean} options.showDownloadButton - Show download button in modal
 * @param {Array} options.visibleTypes - File types to show in carousel
 * @param {Array} options.previewableTypes - File types that can be previewed
 * @param {Function} options.onFileClick - Callback when file is clicked
 * @param {Function} options.onFileDownload - Custom download handler
 * @param {number} options.maxPreviewRows - Max rows for CSV/Excel preview
 * @param {number} options.maxTextPreviewChars - Max characters for text preview
 * @param {HTMLElement|string} options.gridContainer - Container for file grid (element or selector)
 * @param {boolean} options.renderGrid - Whether to render file grid (default: false)
 * @param {string} options.theme - Theme for grid: 'light', 'dark', or 'system' (default: 'system')
 *
 * @example
 * const carousel = new FileCarousel({
 *   container: document.getElementById('carousel-container'),
 *   files: [...],
 *   autoPreload: true
 * });
 *
 * carousel.open(0); // Open modal at index 0
 * carousel.updateFiles(newFiles); // Update file list
 * carousel.destroy(); // Cleanup
 */
export default class FileCarousel {
  constructor(options = {}) {
    // ------------------------------------------------------------
    // CONFIGURATION
    // Merge provided options with defaults
    // ------------------------------------------------------------
    this.options = {
      container: options.container || document.body,
      files: this.normalizeFiles(options.files || []),
      autoPreload: options.autoPreload !== undefined ? options.autoPreload : true,
      enableManualLoading:
        options.enableManualLoading !== undefined
          ? options.enableManualLoading
          : true,
      showDownloadButton:
        options.showDownloadButton !== undefined
          ? options.showDownloadButton
          : true,
      visibleTypes: options.visibleTypes || [
        "image",
        "video",
        "audio",
        "pdf",
        "excel",
        "csv",
        "text",
      ],
      previewableTypes: options.previewableTypes || [
        "image",
        "video",
        "audio",
        "pdf",
        "csv",
        "excel",
        "text",
      ],
      onFileClick: options.onFileClick || null,
      onFileDownload: options.onFileDownload || null,
      maxPreviewRows: options.maxPreviewRows || 100,
      maxTextPreviewChars: options.maxTextPreviewChars || 50000,
      // Grid options
      renderGrid: options.renderGrid || false,
      gridContainer: options.gridContainer || null,
      // Theme option: 'light', 'dark', or 'system' (default)
      theme: options.theme || "system",
    };

    // ------------------------------------------------------------
    // STATE
    // Internal state management
    // ------------------------------------------------------------
    this.currentIndex = 0;

    // ------------------------------------------------------------
    // SUB-COMPONENTS
    // Initialize helper classes
    // ------------------------------------------------------------
    this.preloader = new MediaPreloader(this.options);
    this.renderer = new MediaRenderer(this.options, this.preloader);
    this.modal = new ModalController(
      this.options,
      this.preloader,
      this.renderer
    );

    this.init();
  }

  // ============================================================
  // FILE NORMALIZATION
  // ============================================================

  /**
   * Normalize files to ensure they have required properties
   * Converts 'type' to 'carouselType' for backward compatibility
   * @private
   * @param {Array} files - Array of file objects
   * @returns {Array} Normalized files
   */
  normalizeFiles(files) {
    return files.map((file) => {
      // If carouselType is already set, return as-is
      if (file.carouselType) {
        return file;
      }

      // Copy file to avoid mutating original
      const normalized = { ...file };

      // Convert 'type' to 'carouselType'
      if (file.type && !file.carouselType) {
        normalized.carouselType = file.type;
      }

      return normalized;
    });
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Initialize the carousel component
   * @private
   */
  init() {
    this.render();

    // Render file grid if enabled
    if (this.options.renderGrid) {
      this.renderGrid();
    }

    // Start preloading if enabled
    if (this.shouldAutoPreload()) {
      this.preloader.preloadAll(this.getAutoPreloadFiles());
    }

    this.attachEventListeners();
  }

  /**
   * Check if auto-preloading is enabled
   * @private
   * @returns {boolean}
   */
  shouldAutoPreload() {
    return this.options.autoPreload !== false;
  }

  /**
   * Get files that should be auto-preloaded based on configuration
   * @private
   * @returns {Array} Files to preload
   */
  getAutoPreloadFiles() {
    if (this.options.autoPreload === true) {
      return this.getPreloadableFiles();
    } else if (Array.isArray(this.options.autoPreload)) {
      // Only preload specific file types
      return this.options.files.filter(
        (file) =>
          this.options.visibleTypes.includes(file.carouselType) &&
          this.options.previewableTypes.includes(file.carouselType) &&
          this.options.autoPreload.includes(file.carouselType)
      );
    }
    return [];
  }

  /**
   * Get all files that can be preloaded
   * @private
   * @returns {Array} Preloadable files
   */
  getPreloadableFiles() {
    return this.options.files.filter(
      (file) =>
        this.options.visibleTypes.includes(file.carouselType) &&
        this.options.previewableTypes.includes(file.carouselType)
    );
  }

  /**
   * Get all visible files
   * @returns {Array} Visible files
   */
  getVisibleFiles() {
    return this.options.files;
  }

  // ============================================================
  // RENDERING
  // ============================================================

  /**
   * Render the carousel HTML into the container
   * @private
   */
  render() {
    const container = this.options.container;

    // Create a wrapper element to hold the carousel modal
    this.modalWrapper = document.createElement("div");
    this.modalWrapper.className = "fc-wrapper";
    this.modalWrapper.innerHTML = this.generateHTML();

    // Append to container instead of replacing content
    container.appendChild(this.modalWrapper);
  }

  /**
   * Generate the modal HTML structure
   * @private
   * @returns {string} HTML string
   */
  generateHTML() {
    const showToggleButton =
      this.options.autoPreload !== true && this.options.enableManualLoading;

    return `
      <div class="fc-modal" data-fc-modal>
        <div class="fc-modal-container">
          <div class="fc-modal-header">
            <div class="fc-modal-title-section">
              <h2 class="fc-modal-file-name" data-fc-modal-filename>File Name</h2>
              <span class="fc-file-badge" data-fc-modal-filetype>TYPE</span>
            </div>
            <div class="fc-modal-actions">
              ${
                showToggleButton
                  ? `
              <button class="fc-modal-btn fc-preload-toggle-btn" data-fc-preload-toggle title="Toggle Preload">
                <svg class="fc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span class="fc-btn-text">Load All</span>
              </button>
              `
                  : ""
              }
              ${
                this.options.showDownloadButton
                  ? `<button class="fc-modal-btn fc-download-btn" data-fc-download title="Download (D)">
                <svg class="fc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </button>`
                  : ""
              }
              <button class="fc-modal-btn fc-close-btn" data-fc-close title="Close (Esc)">
                <svg class="fc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="fc-modal-content-wrapper">
            <button class="fc-nav-button fc-prev" data-fc-prev>
              <svg class="fc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <div class="fc-modal-content" data-fc-modal-content></div>
            <button class="fc-nav-button fc-next" data-fc-next>
              <svg class="fc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          <div class="fc-thumbnail-strip" data-fc-thumbnail-strip></div>
        </div>
      </div>
    `;
  }

  // ============================================================
  // EVENT HANDLING
  // ============================================================

  /**
   * Attach event listeners for keyboard navigation
   * @private
   */
  attachEventListeners() {
    this.modal.attachEventListeners();

    // Keyboard shortcuts
    this.keyboardHandler = (e) => {
      if (!this.modal.isOpen()) return;

      switch (e.key) {
        case "ArrowLeft":
          this.modal.prev();
          break;
        case "ArrowRight":
          this.modal.next();
          break;
        case "Escape":
          this.modal.close();
          break;
        case "d":
        case "D":
          this.downloadFile(this.modal.currentIndex);
          break;
      }
    };

    document.addEventListener("keydown", this.keyboardHandler);
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  /**
   * Open carousel modal at specific file index
   * @param {number} index - File index to open
   */
  open(index) {
    if (index >= 0 && index < this.options.files.length) {
      this.modal.open(index, this.options.files);
    }
  }

  /**
   * Close the carousel modal
   */
  close() {
    this.modal.close();
  }

  /**
   * Check if carousel is currently open
   * @returns {boolean}
   */
  isOpen() {
    return this.modal.isOpen();
  }

  /**
   * Download file at specified index
   * @param {number} index - File index to download
   */
  downloadFile(index) {
    const file = this.options.files[index];

    if (this.options.onFileDownload) {
      this.options.onFileDownload(file, index);
    } else {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // ============================================================
  // FILE GRID RENDERING
  // ============================================================

  /**
   * Render file grid into the grid container
   * Creates clickable file items that open the carousel
   */
  renderGrid() {
    const container = this.getGridContainer();
    if (!container) return;

    // Check if grid container is same as modal container
    const isSameAsModalContainer = container === this.options.container;

    // Remove existing grid wrapper if present (instead of clearing all content)
    if (this.gridWrapper && this.gridWrapper.parentNode) {
      this.gridWrapper.parentNode.removeChild(this.gridWrapper);
    }

    // Only clear container if it's a separate grid container (not the modal container)
    if (!isSameAsModalContainer) {
      container.innerHTML = "";
    }

    // Add grid class and theme
    container.classList.add("fc-file-grid");
    this.applyTheme(container);

    // Create grid wrapper
    this.gridWrapper = document.createElement("div");
    this.gridWrapper.className = "fc-grid-wrapper";

    // Render each file
    this.options.files.forEach((file, index) => {
      const item = this.createGridItem(file, index);
      this.gridWrapper.appendChild(item);
    });

    container.appendChild(this.gridWrapper);
  }

  /**
   * Apply theme to the grid container
   * @private
   * @param {HTMLElement} container - Grid container element
   */
  applyTheme(container) {
    // Remove existing theme classes
    container.classList.remove("fc-theme-light", "fc-theme-dark");

    const theme = this.options.theme;

    if (theme === "light") {
      container.classList.add("fc-theme-light");
    } else if (theme === "dark") {
      container.classList.add("fc-theme-dark");
    }
    // 'system' uses CSS prefers-color-scheme (no class needed)
  }

  /**
   * Set theme dynamically
   * @param {string} theme - 'light', 'dark', or 'system'
   */
  setTheme(theme) {
    this.options.theme = theme;
    const container = this.getGridContainer();
    if (container) {
      this.applyTheme(container);
    }
  }

  /**
   * Get the grid container element
   * @private
   * @returns {HTMLElement|null}
   */
  getGridContainer() {
    const { gridContainer } = this.options;

    if (!gridContainer) {
      return this.options.container;
    }

    if (typeof gridContainer === "string") {
      return document.querySelector(gridContainer);
    }

    return gridContainer;
  }

  /**
   * Create a grid item element for a file
   * @private
   * @param {Object} file - File object
   * @param {number} index - File index
   * @returns {HTMLElement}
   */
  createGridItem(file, index) {
    const item = document.createElement("div");
    item.className = "fc-grid-item";
    item.dataset.index = index;
    item.dataset.type = file.carouselType;

    // Create thumbnail/icon
    const visual = document.createElement("div");
    visual.className = "fc-grid-visual";

    if (file.thumbnail && (file.carouselType === "image" || file.carouselType === "video")) {
      // Use thumbnail for images/videos
      const img = document.createElement("img");
      img.src = file.thumbnail;
      img.alt = file.name;
      img.className = "fc-grid-thumbnail";
      visual.appendChild(img);

      // Add video play icon overlay
      if (file.carouselType === "video") {
        const playIcon = document.createElement("div");
        playIcon.className = "fc-grid-play-icon";
        playIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        visual.appendChild(playIcon);
      }
    } else {
      // Use icon for other types
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "fc-grid-icon";
      iconWrapper.innerHTML = this.getFileTypeIcon(file.carouselType);
      visual.appendChild(iconWrapper);
    }

    item.appendChild(visual);

    // Create file name
    const name = document.createElement("span");
    name.className = "fc-grid-name";
    name.textContent = file.name;
    name.title = file.name;
    item.appendChild(name);

    // Click handler
    item.addEventListener("click", () => {
      if (this.options.onFileClick) {
        this.options.onFileClick(file, index);
      }
      this.open(index);
    });

    return item;
  }

  /**
   * Get icon HTML for file type
   * @private
   * @param {string} type - File type
   * @returns {string} SVG HTML string
   */
  getFileTypeIcon(type) {
    const iconMap = {
      audio: "audio",
      pdf: "pdf_file",
      excel: "excel",
      csv: "csv_file",
      text: "text_file",
      document: "document",
      archive: "zip_file",
      image: "image",
      video: "video",
    };

    const iconName = iconMap[type] || "text_file";
    return getIcon(iconName, { class: "fc-grid-type-icon" });
  }

  /**
   * Refresh the file grid (call after updateFiles)
   */
  refreshGrid() {
    if (this.options.renderGrid) {
      this.renderGrid();
    }
  }

  /**
   * Cleanup and destroy the carousel
   * Removes event listeners and clears preloaded media
   */
  destroy() {
    document.removeEventListener("keydown", this.keyboardHandler);
    this.preloader.cleanup();
    this.modal.destroy();

    // Remove only the carousel wrapper, not entire container content
    if (this.modalWrapper && this.modalWrapper.parentNode) {
      this.modalWrapper.parentNode.removeChild(this.modalWrapper);
    }

    // Remove grid wrapper if exists
    if (this.gridWrapper && this.gridWrapper.parentNode) {
      this.gridWrapper.parentNode.removeChild(this.gridWrapper);
    }
  }

  /**
   * Manually trigger preloading of all files
   */
  preloadFiles() {
    this.preloader.preloadAll(this.getPreloadableFiles());
  }

  /**
   * Update files in the carousel
   * @param {Array} files - New files array in carousel format
   */
  updateFiles(files) {
    // Cleanup existing preloaded media
    this.preloader.cleanup();

    // Update files (normalize to ensure carouselType exists)
    this.options.files = this.normalizeFiles(files);

    // Reset the thumbnail strip when files change
    const strip = this.modalWrapper?.querySelector("[data-fc-thumbnail-strip]");
    if (strip) {
      strip.innerHTML = "";
    }

    // Preload new files if auto-preload is enabled
    if (this.shouldAutoPreload()) {
      this.preloader.preloadAll(this.getAutoPreloadFiles());
    }
  }

  /**
   * Get current file index
   * @returns {number}
   */
  getCurrentIndex() {
    return this.modal.currentIndex;
  }

  /**
   * Get current file
   * @returns {Object|null}
   */
  getCurrentFile() {
    return this.options.files[this.modal.currentIndex] || null;
  }
}

export { FileCarousel };
