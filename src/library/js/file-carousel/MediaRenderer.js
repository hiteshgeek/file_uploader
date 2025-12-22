/**
 * MediaRenderer.js
 *
 * Handles rendering preview content for each file type in the carousel.
 * Supports: image, video, audio, PDF, Excel, CSV, and text files.
 *
 * @module MediaRenderer
 * @requires MediaPreloader - For accessing preloaded content
 */

// ============================================================
// MEDIA RENDERER CLASS
// Renders file previews based on file type
// ============================================================

/**
 * MediaRenderer - Renders preview content for various file types
 *
 * @class
 * @param {Object} options - Configuration options from FileCarousel
 * @param {MediaPreloader} preloader - Preloader instance for cached content
 */
export class MediaRenderer {
  constructor(options, preloader) {
    this.options = options;
    this.preloader = preloader;
    this.activeLoadingInterval = null;
  }

  // ============================================================
  // PREVIEW CAPABILITY
  // ============================================================

  /**
   * Check if file type can be previewed
   * @param {string} carouselType - File type
   * @returns {boolean}
   */
  canPreview(carouselType) {
    return this.options.previewableTypes.includes(carouselType);
  }

  // ============================================================
  // MAIN RENDER METHOD
  // ============================================================

  /**
   * Render file preview into container
   * Determines the appropriate rendering based on file state and type
   *
   * @param {Object} file - File object
   * @param {number} index - File index
   * @param {HTMLElement} container - Container element for preview
   */
  render(file, index, container) {
    this.clearLoadingInterval();

    // File type cannot be previewed
    if (!this.canPreview(file.carouselType)) {
      return this.renderNoPreview(file, container);
    }

    const progress = this.preloader.getProgress(index);

    // Currently loading - show progress
    if (progress > 0 && progress < 100) {
      return this.renderLoading(file.carouselType, progress, container, index);
    }

    const wasAutoPreloaded = this.wasFileAutoPreloaded(file);

    // Not preloaded and manual loading is enabled
    if (!wasAutoPreloaded && progress === 0) {
      if (this.options.enableManualLoading) {
        return this.renderLoadButton(file, index, container);
      } else {
        return this.renderNoPreviewManualDisabled(file, container);
      }
    }

    // Fully loaded - render appropriate preview
    if (progress === 100) {
      switch (file.carouselType) {
        case "image":
          return this.renderImage(file, index, container);
        case "video":
          return this.renderVideo(file, index, container);
        case "audio":
          return this.renderAudio(file, index, container);
        case "pdf":
          return this.renderPDF(file, index, container);
        case "text":
          return this.renderText(file, index, container);
        case "csv":
          return this.renderCSV(file, index, container);
        case "excel":
          return this.renderExcel(file, index, container);
        default:
          return this.renderNoPreview(file, container);
      }
    }

    // Auto-preloaded but hasn't started - trigger preload
    if (wasAutoPreloaded && progress === 0) {
      this.preloader.preloadFile(file, index);
      return this.renderLoading(file.carouselType, 0, container, index);
    }

    // Fallback - show load button or no preview
    if (this.options.enableManualLoading) {
      return this.renderLoadButton(file, index, container);
    } else {
      return this.renderNoPreviewManualDisabled(file, container);
    }
  }

  // ============================================================
  // LOADING STATE
  // ============================================================

  /**
   * Clear active loading progress interval
   */
  clearLoadingInterval() {
    if (this.activeLoadingInterval) {
      clearInterval(this.activeLoadingInterval);
      this.activeLoadingInterval = null;
    }
  }

  /**
   * Check if file was configured for auto-preload
   * @private
   * @param {Object} file - File object
   * @returns {boolean}
   */
  wasFileAutoPreloaded(file) {
    const autoPreload = this.options.autoPreload;

    if (autoPreload === true) {
      return true;
    }

    if (Array.isArray(autoPreload)) {
      return autoPreload.includes(file.carouselType);
    }

    return false;
  }

  // ============================================================
  // PLACEHOLDER RENDERS
  // ============================================================

  /**
   * Render load button for manual loading
   * @private
   */
  renderLoadButton(file, index, container) {
    container.innerHTML = `
      <div class="fc-placeholder-content">
        <svg class="fc-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
        <h3 class="fc-placeholder-title">Preview Not Loaded</h3>
        <p class="fc-placeholder-desc">
          Click the button below to load and preview this ${file.carouselType}.
        </p>
        <button class="fc-placeholder-load-btn" data-fc-load-file="${index}">
          <svg class="fc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          Load Preview
        </button>
      </div>
    `;

    const loadBtn = container.querySelector("[data-fc-load-file]");
    loadBtn?.addEventListener("click", () => {
      this.loadAndRenderFile(file, index, container);
    });
  }

  /**
   * Render message when manual loading is disabled
   * @private
   */
  renderNoPreviewManualDisabled(file, container) {
    container.innerHTML = `
      <div class="fc-placeholder-content">
        <svg class="fc-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
        </svg>
        <h3 class="fc-placeholder-title">Preview Not Available</h3>
        <p class="fc-placeholder-desc">
          This file was not preloaded. Download the file to view it.
        </p>
        <button class="fc-placeholder-download-btn" data-fc-download-current>
          <svg class="fc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download File
        </button>
      </div>
    `;

    const downloadBtn = container.querySelector("[data-fc-download-current]");
    downloadBtn?.addEventListener("click", () => {
      const modal = this.options.container.querySelector("[data-fc-modal]");
      const modalDownloadBtn = modal.querySelector("[data-fc-download]");
      modalDownloadBtn?.click();
    });
  }

  /**
   * Load file manually and render preview
   * @private
   */
  async loadAndRenderFile(file, index, container) {
    this.renderLoading(file.carouselType, 0, container, index);

    try {
      await this.preloader.preloadFile(file, index);
      this.render(file, index, container);
    } catch (error) {
      this.clearLoadingInterval();
      container.innerHTML = `
        <div class="fc-placeholder-content">
          <svg class="fc-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="fc-placeholder-title">Failed to Load</h3>
          <p class="fc-placeholder-desc">
            Could not load the file. Try downloading it instead.
          </p>
        </div>
      `;
    }
  }

  /**
   * Render loading state with progress
   * @private
   */
  renderLoading(type, progress, container, index) {
    this.clearLoadingInterval();

    container.innerHTML = `
      <div class="fc-loading-container">
        <div class="fc-spinner"></div>
        <p class="fc-loading-text">Loading ${type.toUpperCase()}... ${Math.round(progress)}%</p>
        <div class="fc-progress-bar-container">
          <div class="fc-progress-bar" style="width: ${progress}%"></div>
        </div>
      </div>
    `;

    // Update progress periodically
    this.activeLoadingInterval = setInterval(() => {
      const currentProg = this.preloader.getProgress(index);

      if (currentProg === 100) {
        this.clearLoadingInterval();
        const file = this.options.files[index];
        this.render(file, index, container);
      } else {
        const progressText = container.querySelector(".fc-loading-text");
        const progressBar = container.querySelector(".fc-progress-bar");

        if (progressText && progressBar) {
          progressText.textContent = `Loading ${type.toUpperCase()}... ${Math.round(currentProg)}%`;
          progressBar.style.width = `${currentProg}%`;
        } else {
          this.clearLoadingInterval();
        }
      }
    }, 100);
  }

  // ============================================================
  // FILE TYPE RENDERERS
  // ============================================================

  /**
   * Render image preview
   * @private
   */
  renderImage(file, index, container) {
    const src = this.preloader.getPreloadedMedia(index) || file.url;
    container.innerHTML = `<img src="${src}" alt="${this.escapeHtml(file.name)}" class="fc-modal-image">`;
  }

  /**
   * Render video preview with controls
   * @private
   */
  renderVideo(file, index, container) {
    const src = this.preloader.getPreloadedMedia(index) || file.url;
    const video = document.createElement("video");
    video.controls = true;
    video.className = "fc-modal-video";
    video.src = src;
    container.innerHTML = "";
    container.appendChild(video);
  }

  /**
   * Render audio preview with player
   * @private
   */
  renderAudio(file, index, container) {
    const src = this.preloader.getPreloadedMedia(index) || file.url;
    container.innerHTML = `
      <div class="fc-audio-container">
        <div class="fc-audio-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
          </svg>
        </div>
        <p class="fc-audio-filename">${this.escapeHtml(file.name)}</p>
        <audio controls class="fc-modal-audio" src="${src}"></audio>
      </div>
    `;
  }

  /**
   * Render PDF preview using object embed
   * @private
   */
  renderPDF(file, index, container) {
    const src = this.preloader.getPreloadedMedia(index) || file.url;
    container.innerHTML = `<object class="fc-pdf-embed" data="${src}#toolbar=1" type="application/pdf"></object>`;
  }

  /**
   * Render text file preview
   * @private
   */
  renderText(file, index, container) {
    const content = this.preloader.getPreloadedMedia(index);
    if (!content) {
      return this.renderNoPreview(file, container);
    }

    const maxChars = this.options.maxTextPreviewChars;
    const preview =
      content.length > maxChars
        ? `${content.substring(0, maxChars)}\n\n... (File truncated for preview. Download to see full content.)`
        : content;

    container.innerHTML = `<div class="fc-text-preview">${this.escapeHtml(preview)}</div>`;
  }

  /**
   * Render CSV file as table
   * @private
   */
  renderCSV(file, index, container) {
    const content = this.preloader.getPreloadedMedia(index);
    if (!content) {
      return this.renderNoPreview(file, container);
    }

    const tableHtml = this.parseCSV(content);
    container.innerHTML = tableHtml;
  }

  /**
   * Render Excel file as table (requires XLSX library)
   * @private
   */
  renderExcel(file, index, container) {
    const arrayBuffer = this.preloader.getPreloadedMedia(index);
    if (!arrayBuffer) {
      return this.renderNoPreview(file, container);
    }

    const tableHtml = this.parseExcel(arrayBuffer);
    container.innerHTML = tableHtml;
  }

  /**
   * Render no-preview placeholder
   * @private
   */
  renderNoPreview(file, container) {
    container.innerHTML = `
      <div class="fc-placeholder-content">
        <svg class="fc-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
        <h3 class="fc-placeholder-title">Preview Not Available</h3>
        <p class="fc-placeholder-desc">
          This file type cannot be previewed. Click the download button to view it locally.
        </p>
      </div>
    `;
  }

  // ============================================================
  // DATA PARSING
  // ============================================================

  /**
   * Parse CSV content into HTML table
   * @private
   * @param {string} csvText - CSV file content
   * @returns {string} HTML table
   */
  parseCSV(csvText) {
    const lines = csvText.split("\n");
    const rows = [];

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === "") continue;

      const row = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          row.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      row.push(current.trim());
      rows.push(row);
    }

    if (rows.length === 0) {
      return '<div class="fc-placeholder-content"><p>No data found in CSV file.</p></div>';
    }

    const maxRows = Math.min(rows.length, this.options.maxPreviewRows);
    const headers = rows[0];
    const truncated = rows.length > this.options.maxPreviewRows;

    let html = '<div class="fc-csv-preview">';

    if (truncated) {
      html += `
        <div class="fc-table-info">
          Showing first ${this.options.maxPreviewRows} rows of ${rows.length} total rows.
          Download file to see all data.
        </div>
      `;
    }

    html += '<table class="fc-data-table"><thead><tr>';

    for (let h = 0; h < headers.length; h++) {
      html += `<th>${this.escapeHtml(headers[h].replace(/^"|"$/g, ""))}</th>`;
    }

    html += "</tr></thead><tbody>";

    for (let r = 1; r < maxRows; r++) {
      html += "<tr>";
      for (let c = 0; c < rows[r].length; c++) {
        html += `<td>${this.escapeHtml(rows[r][c].replace(/^"|"$/g, ""))}</td>`;
      }
      html += "</tr>";
    }

    html += "</tbody></table></div>";
    return html;
  }

  /**
   * Parse Excel file into HTML table
   * Requires XLSX library to be loaded globally
   *
   * @private
   * @param {ArrayBuffer} arrayBuffer - Excel file content
   * @returns {string} HTML table
   */
  parseExcel(arrayBuffer) {
    try {
      if (typeof XLSX === "undefined") {
        return '<div class="fc-placeholder-content"><p>XLSX library not loaded. Include it to preview Excel files.</p></div>';
      }

      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (data.length === 0) {
        return '<div class="fc-placeholder-content"><p>No data found in Excel file.</p></div>';
      }

      const maxRows = Math.min(data.length, this.options.maxPreviewRows);
      const truncated = data.length > this.options.maxPreviewRows;

      let html = '<div class="fc-excel-preview">';

      // Show sheet info if multiple sheets
      if (workbook.SheetNames.length > 1) {
        html += `
          <div class="fc-table-info fc-excel-info">
            Showing sheet: "${this.escapeHtml(firstSheetName)}"
            (Total sheets: ${workbook.SheetNames.length})
          </div>
        `;
      }

      if (truncated) {
        html += `
          <div class="fc-table-info">
            Showing first ${this.options.maxPreviewRows} rows of ${data.length} total rows.
            Download file to see all data.
          </div>
        `;
      }

      html += '<table class="fc-data-table fc-excel-table"><thead><tr>';

      const headers = data[0];
      for (let h = 0; h < headers.length; h++) {
        const headerValue =
          headers[h] !== undefined && headers[h] !== null
            ? String(headers[h])
            : "";
        html += `<th>${this.escapeHtml(headerValue)}</th>`;
      }

      html += "</tr></thead><tbody>";

      for (let r = 1; r < maxRows; r++) {
        html += "<tr>";
        for (let c = 0; c < data[r].length; c++) {
          const cellValue =
            data[r][c] !== undefined && data[r][c] !== null
              ? String(data[r][c])
              : "";
          html += `<td>${this.escapeHtml(cellValue)}</td>`;
        }
        html += "</tr>";
      }

      html += "</tbody></table></div>";
      return html;
    } catch (e) {
      return `
        <div class="fc-placeholder-content">
          <h3 class="fc-placeholder-title">Error Reading Excel File</h3>
          <p class="fc-placeholder-desc">Unable to parse the Excel file. Please download it to view.</p>
        </div>
      `;
    }
  }

  // ============================================================
  // UTILITIES
  // ============================================================

  /**
   * Escape HTML special characters
   * @private
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.clearLoadingInterval();
  }
}

export default MediaRenderer;
