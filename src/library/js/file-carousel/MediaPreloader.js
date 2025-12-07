/**
 * MediaPreloader.js
 *
 * Handles file preloading and caching for the carousel component.
 * Manages XHR requests with progress tracking and blob URL creation.
 *
 * @module MediaPreloader
 */

// ============================================================
// MEDIA PRELOADER CLASS
// Manages file downloading and caching with progress tracking
// ============================================================

/**
 * MediaPreloader - Handles file preloading and caching
 *
 * @class
 * @param {Object} options - Configuration options from FileCarousel
 */
export class MediaPreloader {
  constructor(options) {
    this.options = options;

    // ------------------------------------------------------------
    // STATE
    // ------------------------------------------------------------
    this.preloadedMedia = {};      // Cached blob URLs or content
    this.loadingProgress = {};     // Progress per file index (0-100)
    this.onProgressCallbacks = []; // Progress update callbacks
    this.activeRequests = {};      // Active XHR requests
    this.isPaused = false;         // Preloading paused state
  }

  // ============================================================
  // PROGRESS CALLBACKS
  // ============================================================

  /**
   * Register a progress callback
   * @param {Function} callback - Called with (index, progress)
   */
  onProgress(callback) {
    this.onProgressCallbacks.push(callback);
  }

  /**
   * Notify all registered callbacks of progress update
   * @private
   * @param {number} index - File index
   * @param {number} progress - Progress percentage (0-100)
   */
  notifyProgress(index, progress) {
    this.onProgressCallbacks.forEach((cb) => cb(index, progress));
  }

  // ============================================================
  // PRELOADING CONTROL
  // ============================================================

  /**
   * Preload multiple files
   * @param {Array} files - Files to preload
   */
  preloadAll(files) {
    this.isPaused = false;
    files.forEach((file, index) => {
      const originalIndex = this.options.files.indexOf(file);
      if (originalIndex !== -1) {
        this.preloadFile(file, originalIndex);
      }
    });
  }

  /**
   * Stop all active preloading
   */
  stop() {
    this.isPaused = true;

    // Abort all active XHR requests
    Object.keys(this.activeRequests).forEach((index) => {
      const xhr = this.activeRequests[index];
      if (xhr) {
        xhr.abort();
        delete this.activeRequests[index];
      }
    });

    // Reset progress for incomplete files
    Object.keys(this.loadingProgress).forEach((index) => {
      if (this.loadingProgress[index] < 100) {
        this.loadingProgress[index] = 0;
        this.notifyProgress(index, 0);
      }
    });
  }

  // ============================================================
  // PRELOAD LOGIC
  // ============================================================

  /**
   * Check if file should be preloaded based on configuration
   * @param {Object} file - File object
   * @returns {boolean}
   */
  shouldPreloadFile(file) {
    const autoPreload = this.options.autoPreload;

    if (autoPreload === true) {
      return (
        this.options.visibleTypes.includes(file.carouselType) &&
        this.options.previewableTypes.includes(file.carouselType)
      );
    }

    if (Array.isArray(autoPreload)) {
      return (
        this.options.visibleTypes.includes(file.carouselType) &&
        this.options.previewableTypes.includes(file.carouselType) &&
        autoPreload.includes(file.carouselType)
      );
    }

    return false;
  }

  /**
   * Check if file was configured for auto-preload
   * @param {Object} file - File object
   * @returns {boolean}
   */
  isFileAutoPreloaded(file) {
    if (this.options.autoPreload === true) {
      return true;
    }
    if (Array.isArray(this.options.autoPreload)) {
      return this.options.autoPreload.includes(file.carouselType);
    }
    return false;
  }

  /**
   * Get appropriate XHR response type for file type
   * @private
   * @param {string} carouselType - File type
   * @returns {string} XHR response type
   */
  getResponseType(carouselType) {
    switch (carouselType) {
      case "excel":
        return "arraybuffer";
      case "image":
      case "video":
      case "audio":
      case "pdf":
        return "blob";
      default:
        return "text";
    }
  }

  /**
   * Preload a single file
   * @param {Object} file - File object
   * @param {number} index - File index
   * @returns {Promise} Resolves with preloaded content
   */
  preloadFile(file, index) {
    // Already loaded
    if (this.preloadedMedia[index] && this.loadingProgress[index] === 100) {
      return Promise.resolve(this.preloadedMedia[index]);
    }

    // Preloading is paused
    if (this.isPaused) {
      return Promise.resolve(null);
    }

    // Check if file type can be preloaded
    const shouldPreload =
      this.options.visibleTypes.includes(file.carouselType) &&
      this.options.previewableTypes.includes(file.carouselType);

    if (!shouldPreload) {
      return Promise.resolve(null);
    }

    // Initialize progress
    if (this.loadingProgress[index] === undefined) {
      this.loadingProgress[index] = 0;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.activeRequests[index] = xhr;

      xhr.open("GET", file.url, true);
      xhr.responseType = this.getResponseType(file.carouselType);

      // Track download progress
      xhr.onprogress = (e) => {
        if (this.isPaused) {
          xhr.abort();
          return;
        }

        if (e.lengthComputable) {
          // Cap at 99% until fully loaded
          this.loadingProgress[index] = Math.min(
            (e.loaded / e.total) * 100,
            99
          );
        } else if (this.loadingProgress[index] < 90) {
          // Increment for unknown content length
          this.loadingProgress[index] += 5;
        }
        this.notifyProgress(index, this.loadingProgress[index]);
      };

      // Handle successful load
      xhr.onload = () => {
        delete this.activeRequests[index];

        if (xhr.status === 200) {
          // Create blob URL for binary content
          if (["image", "video", "audio", "pdf"].includes(file.carouselType)) {
            this.preloadedMedia[index] = URL.createObjectURL(xhr.response);
          } else {
            this.preloadedMedia[index] = xhr.response;
          }
          this.loadingProgress[index] = 100;
          this.notifyProgress(index, 100);
          resolve(this.preloadedMedia[index]);
        } else {
          this.loadingProgress[index] = 100;
          this.notifyProgress(index, 100);
          reject(new Error(`Failed to load: ${xhr.status}`));
        }
      };

      // Handle network errors
      xhr.onerror = () => {
        delete this.activeRequests[index];
        this.loadingProgress[index] = 100;
        this.notifyProgress(index, 100);
        reject(new Error("Network error"));
      };

      // Handle aborted requests
      xhr.onabort = () => {
        delete this.activeRequests[index];
        resolve(null);
      };

      xhr.send();
    });
  }

  // ============================================================
  // GETTERS
  // ============================================================

  /**
   * Get preloaded media content for file index
   * @param {number} index - File index
   * @returns {string|null} Blob URL or content
   */
  getPreloadedMedia(index) {
    return this.preloadedMedia[index];
  }

  /**
   * Get loading progress for file index
   * @param {number} index - File index
   * @returns {number} Progress percentage (0-100)
   */
  getProgress(index) {
    return this.loadingProgress[index] || 0;
  }

  /**
   * Check if file is fully loaded
   * @param {number} index - File index
   * @returns {boolean}
   */
  isLoaded(index) {
    return this.loadingProgress[index] === 100;
  }

  /**
   * Check if file is currently loading
   * @param {number} index - File index
   * @returns {boolean}
   */
  isLoading(index) {
    const progress = this.loadingProgress[index] || 0;
    return progress > 0 && progress < 100;
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  /**
   * Cleanup all preloaded media and stop active requests
   */
  cleanup() {
    this.stop();

    // Revoke all blob URLs to free memory
    Object.values(this.preloadedMedia).forEach((url) => {
      if (typeof url === "string" && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    this.preloadedMedia = {};
    this.loadingProgress = {};
  }
}

export default MediaPreloader;
