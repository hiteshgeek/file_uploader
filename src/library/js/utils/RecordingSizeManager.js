/**
 * RecordingSizeManager Class
 *
 * Manages recording file size estimation, tracking, and auto-stop functionality.
 * Uses a hybrid approach:
 * 1. Sets bitrate caps for predictable maximum file sizes
 * 2. Monitors actual accumulated size in real-time
 * 3. Auto-stops recording when approaching file size limits
 */

export default class RecordingSizeManager {
  /**
   * Default bitrate presets for different quality levels
   */
  static QUALITY_PRESETS = {
    low: {
      videoBitsPerSecond: 1000000,    // 1 Mbps
      audioBitsPerSecond: 64000,      // 64 Kbps
      label: 'Low (1 Mbps)'
    },
    medium: {
      videoBitsPerSecond: 2500000,    // 2.5 Mbps
      audioBitsPerSecond: 128000,     // 128 Kbps
      label: 'Medium (2.5 Mbps)'
    },
    high: {
      videoBitsPerSecond: 5000000,    // 5 Mbps
      audioBitsPerSecond: 192000,     // 192 Kbps
      label: 'High (5 Mbps)'
    },
    ultra: {
      videoBitsPerSecond: 8000000,    // 8 Mbps
      audioBitsPerSecond: 256000,     // 256 Kbps
      label: 'Ultra (8 Mbps)'
    }
  };

  /**
   * Default audio-only bitrate presets
   */
  static AUDIO_QUALITY_PRESETS = {
    low: {
      audioBitsPerSecond: 64000,      // 64 Kbps
      label: 'Low (64 Kbps)'
    },
    medium: {
      audioBitsPerSecond: 128000,     // 128 Kbps
      label: 'Medium (128 Kbps)'
    },
    high: {
      audioBitsPerSecond: 192000,     // 192 Kbps
      label: 'High (192 Kbps)'
    },
    ultra: {
      audioBitsPerSecond: 320000,     // 320 Kbps
      label: 'Ultra (320 Kbps)'
    }
  };

  /**
   * @param {Object} options - Configuration options
   * @param {number} options.maxFileSize - Maximum file size in bytes (required for auto-stop)
   * @param {number} options.videoBitsPerSecond - Video bitrate (default: 2.5 Mbps)
   * @param {number} options.audioBitsPerSecond - Audio bitrate (default: 128 Kbps)
   * @param {string} options.quality - Quality preset ('low', 'medium', 'high', 'ultra')
   * @param {number} options.warningThreshold - Percentage of max size to trigger warning (default: 0.8 = 80%)
   * @param {number} options.stopThreshold - Percentage of max size to auto-stop (default: 0.95 = 95%)
   * @param {Function} options.onSizeUpdate - Callback when size is updated (currentSize, estimatedTotal, percentage)
   * @param {Function} options.onWarning - Callback when warning threshold is reached
   * @param {Function} options.onLimitReached - Callback when stop threshold is reached (should trigger stop)
   */
  constructor(options = {}) {
    // Apply quality preset if specified
    const preset = options.quality ? RecordingSizeManager.QUALITY_PRESETS[options.quality] : null;

    this.options = {
      maxFileSize: options.maxFileSize || null,
      videoBitsPerSecond: options.videoBitsPerSecond || preset?.videoBitsPerSecond || 2500000,
      audioBitsPerSecond: options.audioBitsPerSecond || preset?.audioBitsPerSecond || 128000,
      warningThreshold: options.warningThreshold || 0.8,
      stopThreshold: options.stopThreshold || 0.95,
      onSizeUpdate: options.onSizeUpdate || null,
      onWarning: options.onWarning || null,
      onLimitReached: options.onLimitReached || null,
    };

    // Tracking state
    this.reset();
  }

  /**
   * Reset all tracking state
   */
  reset() {
    this.accumulatedSize = 0;
    this.startTime = null;
    this.chunks = [];
    this.warningTriggered = false;
    this.isTracking = false;
    this.recordingType = null; // 'video' or 'audio'
  }

  /**
   * Get MediaRecorder options with bitrate constraints
   * @param {string} type - 'video' or 'audio'
   * @returns {Object} Options for MediaRecorder constructor
   */
  getMediaRecorderOptions(type = 'video') {
    const options = {};

    if (type === 'video') {
      options.videoBitsPerSecond = this.options.videoBitsPerSecond;
      options.audioBitsPerSecond = this.options.audioBitsPerSecond;
    } else {
      options.audioBitsPerSecond = this.options.audioBitsPerSecond;
    }

    return options;
  }

  /**
   * Start tracking recording size
   * @param {string} type - 'video' or 'audio'
   */
  startTracking(type = 'video') {
    this.reset();
    this.startTime = Date.now();
    this.isTracking = true;
    this.recordingType = type;
  }

  /**
   * Stop tracking and return final stats
   * @returns {Object} Final recording statistics
   */
  stopTracking() {
    this.isTracking = false;
    const duration = this.getDuration();

    return {
      finalSize: this.accumulatedSize,
      duration: duration,
      averageBitrate: duration > 0 ? (this.accumulatedSize * 8) / duration : 0,
      chunkCount: this.chunks.length
    };
  }

  /**
   * Process a data chunk from MediaRecorder
   * Called from MediaRecorder.ondataavailable
   * @param {Blob} chunk - The data chunk
   * @returns {Object} Current size info and status
   */
  processChunk(chunk) {
    if (!this.isTracking) return null;

    const chunkSize = chunk.size;
    this.accumulatedSize += chunkSize;
    this.chunks.push({
      size: chunkSize,
      timestamp: Date.now()
    });

    const status = this.getStatus();

    // Trigger callbacks
    if (this.options.onSizeUpdate) {
      this.options.onSizeUpdate(status);
    }

    // Check thresholds
    if (this.options.maxFileSize) {
      const percentage = this.accumulatedSize / this.options.maxFileSize;

      // Warning threshold
      if (!this.warningTriggered && percentage >= this.options.warningThreshold) {
        this.warningTriggered = true;
        if (this.options.onWarning) {
          this.options.onWarning(status);
        }
      }

      // Stop threshold
      if (percentage >= this.options.stopThreshold) {
        if (this.options.onLimitReached) {
          this.options.onLimitReached(status);
        }
      }
    }

    return status;
  }

  /**
   * Get current recording status
   * @returns {Object} Current status with size, estimates, and percentages
   */
  getStatus() {
    const duration = this.getDuration();
    const currentBitrate = this.getCurrentBitrate();
    const estimatedFinalSize = this.getEstimatedFinalSize();

    let percentage = 0;
    let remainingSize = null;
    let remainingTime = null;

    if (this.options.maxFileSize) {
      percentage = (this.accumulatedSize / this.options.maxFileSize) * 100;
      remainingSize = Math.max(0, this.options.maxFileSize - this.accumulatedSize);

      // Estimate remaining time based on current bitrate
      if (currentBitrate > 0) {
        remainingTime = (remainingSize * 8) / currentBitrate; // in seconds
      }
    }

    return {
      accumulatedSize: this.accumulatedSize,
      formattedSize: this.formatBytes(this.accumulatedSize),
      duration: duration,
      currentBitrate: currentBitrate,
      formattedBitrate: this.formatBitrate(currentBitrate),
      estimatedFinalSize: estimatedFinalSize,
      formattedEstimatedSize: this.formatBytes(estimatedFinalSize),
      percentage: Math.min(100, percentage),
      remainingSize: remainingSize,
      formattedRemainingSize: remainingSize !== null ? this.formatBytes(remainingSize) : null,
      remainingTime: remainingTime,
      formattedRemainingTime: remainingTime !== null ? this.formatDuration(remainingTime) : null,
      maxFileSize: this.options.maxFileSize,
      formattedMaxSize: this.options.maxFileSize ? this.formatBytes(this.options.maxFileSize) : null,
      isWarning: this.warningTriggered,
      isNearLimit: this.options.maxFileSize ? (this.accumulatedSize / this.options.maxFileSize) >= this.options.stopThreshold : false
    };
  }

  /**
   * Get recording duration in seconds
   * @returns {number} Duration in seconds
   */
  getDuration() {
    if (!this.startTime) return 0;
    return (Date.now() - this.startTime) / 1000;
  }

  /**
   * Calculate current bitrate based on accumulated data
   * @returns {number} Current bitrate in bits per second
   */
  getCurrentBitrate() {
    const duration = this.getDuration();
    if (duration <= 0) return 0;
    return (this.accumulatedSize * 8) / duration;
  }

  /**
   * Estimate maximum recording time based on file size limit
   * @param {number} maxSize - Maximum file size in bytes (optional, uses options.maxFileSize)
   * @returns {number} Estimated max duration in seconds
   */
  estimateMaxDuration(maxSize = null) {
    const limit = maxSize || this.options.maxFileSize;
    if (!limit) return Infinity;

    // Use configured bitrates for estimation
    let totalBitrate;
    if (this.recordingType === 'audio') {
      totalBitrate = this.options.audioBitsPerSecond;
    } else {
      totalBitrate = this.options.videoBitsPerSecond + this.options.audioBitsPerSecond;
    }

    // Convert bits per second to bytes per second, then calculate duration
    const bytesPerSecond = totalBitrate / 8;
    return limit / bytesPerSecond;
  }

  /**
   * Estimate file size for a given duration
   * @param {number} durationSeconds - Duration in seconds
   * @returns {number} Estimated size in bytes
   */
  estimateSizeForDuration(durationSeconds) {
    let totalBitrate;
    if (this.recordingType === 'audio') {
      totalBitrate = this.options.audioBitsPerSecond;
    } else {
      totalBitrate = this.options.videoBitsPerSecond + this.options.audioBitsPerSecond;
    }

    const bytesPerSecond = totalBitrate / 8;
    return bytesPerSecond * durationSeconds;
  }

  /**
   * Get estimated final size based on current bitrate and remaining time
   * @param {number} maxDuration - Maximum recording duration in seconds (optional)
   * @returns {number} Estimated final size in bytes
   */
  getEstimatedFinalSize(maxDuration = null) {
    const currentBitrate = this.getCurrentBitrate();
    if (currentBitrate <= 0) {
      // Use configured bitrate for estimation if no data yet
      return this.estimateSizeForDuration(maxDuration || 60);
    }

    if (maxDuration) {
      const remainingDuration = Math.max(0, maxDuration - this.getDuration());
      const remainingSize = (currentBitrate / 8) * remainingDuration;
      return this.accumulatedSize + remainingSize;
    }

    return this.accumulatedSize;
  }

  /**
   * Check if recording can continue without exceeding limit
   * @param {number} additionalSeconds - Additional seconds to record
   * @returns {boolean} True if safe to continue
   */
  canContinue(additionalSeconds = 10) {
    if (!this.options.maxFileSize) return true;

    const currentBitrate = this.getCurrentBitrate();
    const estimatedBitrate = currentBitrate > 0 ? currentBitrate :
      ((this.recordingType === 'audio' ? 0 : this.options.videoBitsPerSecond) + this.options.audioBitsPerSecond);

    const additionalBytes = (estimatedBitrate / 8) * additionalSeconds;
    const projectedTotal = this.accumulatedSize + additionalBytes;

    return projectedTotal < (this.options.maxFileSize * this.options.stopThreshold);
  }

  /**
   * Format bytes to human-readable string
   * @param {number} bytes - Size in bytes
   * @returns {string} Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Format bitrate to human-readable string
   * @param {number} bitsPerSecond - Bitrate in bits per second
   * @returns {string} Formatted string
   */
  formatBitrate(bitsPerSecond) {
    if (bitsPerSecond === 0) return '0 bps';
    if (bitsPerSecond >= 1000000) {
      return (bitsPerSecond / 1000000).toFixed(2) + ' Mbps';
    } else if (bitsPerSecond >= 1000) {
      return (bitsPerSecond / 1000).toFixed(1) + ' Kbps';
    }
    return bitsPerSecond.toFixed(0) + ' bps';
  }

  /**
   * Format duration to human-readable string
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted string (MM:SS or HH:MM:SS)
   */
  formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Get a summary of recording limits and estimates
   * @param {number} maxDuration - Maximum recording duration in seconds
   * @returns {Object} Summary information
   */
  getSummary(maxDuration = 300) {
    const estimatedSize = this.estimateSizeForDuration(maxDuration);
    const maxDurationForSize = this.estimateMaxDuration();

    return {
      configuredBitrate: {
        video: this.options.videoBitsPerSecond,
        audio: this.options.audioBitsPerSecond,
        total: this.options.videoBitsPerSecond + this.options.audioBitsPerSecond,
        formatted: this.formatBitrate(this.options.videoBitsPerSecond + this.options.audioBitsPerSecond)
      },
      maxFileSize: {
        bytes: this.options.maxFileSize,
        formatted: this.options.maxFileSize ? this.formatBytes(this.options.maxFileSize) : 'No limit'
      },
      estimatedSizeForDuration: {
        duration: maxDuration,
        bytes: estimatedSize,
        formatted: this.formatBytes(estimatedSize)
      },
      maxDurationForFileSize: {
        seconds: maxDurationForSize,
        formatted: maxDurationForSize !== Infinity ? this.formatDuration(maxDurationForSize) : 'Unlimited'
      },
      thresholds: {
        warning: this.options.warningThreshold * 100 + '%',
        stop: this.options.stopThreshold * 100 + '%'
      }
    };
  }
}
