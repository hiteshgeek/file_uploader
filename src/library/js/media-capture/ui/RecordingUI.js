/**
 * RecordingUI.js
 *
 * Manages all video and audio recording UI components and interactions.
 * Provides toolbar, timer, pause/resume controls, and audio toggles.
 *
 * @module RecordingUI
 */

import { getIcon } from "../../shared/icons.js";
import TooltipManager from "../../utils/TooltipManager.js";

export default class RecordingUI {
  /**
   * @param {Object|FileUploader} uploaderOrOptions - FileUploader instance or options object
   *
   * When passed a FileUploader instance (legacy mode):
   *   - this.uploader references the FileUploader
   *   - this.standaloneMode = false
   *
   * When passed an options object (standalone mode for MediaCapture):
   *   - this.options contains the options
   *   - this.standaloneMode = true
   *   - Callbacks: onPause, onResume, onStop
   */
  constructor(uploaderOrOptions) {
    // Detect if we're in standalone mode (options object) or uploader mode
    // FileUploader instances have instanceId starting with 'media-hub-' (set before RecordingUI is created)
    const isFileUploader = uploaderOrOptions &&
      typeof uploaderOrOptions.instanceId === 'string' &&
      uploaderOrOptions.instanceId.startsWith('media-hub-');

    this.standaloneMode = !isFileUploader;

    if (this.standaloneMode) {
      // Standalone mode - options object passed (from MediaCapture)
      this.uploader = null;
      this.standaloneOptions = uploaderOrOptions || {};
    } else {
      // FileUploader mode - FileUploader instance passed
      this.uploader = uploaderOrOptions;
      this.standaloneOptions = null;
    }

    this.recordingToolbar = null;
    this.recordingToolbarButtons = null;
    this.recordingTimerInterval = null;
    this.recordingType = null; // 'video' or 'audio'
    this.externalContainerButtons = null; // Original buttons in external container to hide during recording
    this.externalRecordingIndicator = null; // Recording indicator for external container
    this.standaloneContainer = null; // Container for standalone mode UI
    this.standaloneIndicator = null; // Recording indicator for standalone mode
  }

  /**
   * Get options - works in both modes
   * @private
   */
  getOptions() {
    if (this.standaloneMode) {
      return this.standaloneOptions || {};
    }
    return this.uploader?.options || {};
  }

  /**
   * Get media capture specific options
   * Handles both nested (FileUploader: options.mediaCapture) and flat (standalone) paths
   * @private
   */
  getMediaCaptureOptions() {
    const options = this.getOptions();
    // In FileUploader mode, mediaCapture options are nested
    // In standalone mode, they're passed flat
    return options.mediaCapture || options;
  }

  /**
   * Get the CSS class for button size
   * @returns {string} Size class or empty string for default (md)
   */
  getButtonSizeClass() {
    const options = this.getOptions();
    // Support both nested (FileUploader: buttons.buttonSize) and flat (standalone: buttonSize) paths
    const size = options.buttons?.buttonSize || options.buttonSize;
    if (size && size !== "md") {
      return `media-hub-capture-btn-${size}`;
    }
    return "";
  }

  /**
   * Get the CSS class for timer size
   * @returns {string} Size class or empty string for default (md)
   */
  getTimerSizeClass() {
    const options = this.getOptions();
    // Support both nested (FileUploader: buttons.timerSize) and flat (standalone: timerSize) paths
    const size = options.buttons?.timerSize || options.timerSize;
    if (size && size !== "md") {
      return `timer-${size}`;
    }
    return "";
  }

  /**
   * Get the container for recording toolbar
   * Uses external container if specified, otherwise internal captureButtonContainer
   * @returns {HTMLElement|null}
   */
  getToolbarContainer() {
    const options = this.getOptions();
    // Support both nested (FileUploader: mediaCapture.externalRecordingToolbarContainer)
    // and flat (standalone: externalRecordingToolbarContainer) option paths
    const externalContainer = options.mediaCapture?.externalRecordingToolbarContainer || options.externalRecordingToolbarContainer;
    if (externalContainer) {
      // Support both string selector and element reference
      if (typeof externalContainer === 'string') {
        const el = document.querySelector(externalContainer);
        if (el) return el;
      } else if (externalContainer instanceof HTMLElement && document.body.contains(externalContainer)) {
        // Verify element is still in DOM
        return externalContainer;
      }
    }

    // In standalone mode, return the standalone container or null
    if (this.standaloneMode) {
      return this.standaloneContainer;
    }

    return this.uploader?.captureButtonContainer;
  }

  /**
   * Check if using external container
   * @returns {boolean}
   */
  isUsingExternalContainer() {
    const options = this.getOptions();
    return !!(options.mediaCapture?.externalRecordingToolbarContainer || options.externalRecordingToolbarContainer);
  }

  /**
   * Hide original buttons in the container before showing recording toolbar
   * @param {HTMLElement} container - The toolbar container
   */
  hideOriginalButtons(container) {
    if (this.isUsingExternalContainer() && container) {
      // Find all capture buttons in the external container and hide them
      const captureButtons = container.querySelectorAll('.media-hub-capture-btn');
      this.externalContainerButtons = Array.from(captureButtons);

      // Also find and hide the modal trigger button (sibling of the container)
      const parent = container.parentElement;
      if (parent) {
        const modalBtn = parent.querySelector('.fu-config-builder-modal-btn');
        if (modalBtn) {
          this.externalContainerButtons.push(modalBtn);
        }
      }

      this.externalContainerButtons.forEach(btn => {
        btn.style.display = 'none';
      });
    }
  }

  /**
   * Show original buttons in the container after recording stops
   */
  showOriginalButtons() {
    if (this.externalContainerButtons) {
      this.externalContainerButtons.forEach(btn => {
        btn.style.display = '';
      });
      this.externalContainerButtons = null;
    }
  }

  /**
   * Show countdown before recording starts
   * @param {number} duration - Countdown duration in seconds
   * @returns {Promise<void>}
   */
  async showCountdown(duration) {
    return new Promise((resolve) => {
      const countdown = document.createElement("div");
      countdown.className = "media-hub-countdown-overlay";
      countdown.innerHTML = `
        <div class="media-hub-countdown-content">
          <div class="media-hub-countdown-number">${duration}</div>
          <div class="media-hub-countdown-text">Get ready to record...</div>
        </div>
      `;
      document.body.appendChild(countdown);

      const numberElement = countdown.querySelector(".media-hub-countdown-number");
      let remaining = duration;

      const interval = setInterval(() => {
        remaining--;
        if (remaining > 0) {
          numberElement.textContent = remaining;
          numberElement.classList.remove("pulse");
          void numberElement.offsetWidth; // Force reflow
          numberElement.classList.add("pulse");
        } else {
          clearInterval(interval);
          countdown.remove();
          resolve();
        }
      }, 1000);
    });
  }

  /**
   * Create and show video recording toolbar
   */
  createRecordingToolbar() {
    if (this.recordingToolbar) {
      this.recordingToolbar.remove();
    }

    const captureContainer = this.getToolbarContainer();
    if (!captureContainer) return;

    // Hide original buttons in external container
    this.hideOriginalButtons(captureContainer);

    this.recordingType = 'video';

    const isExternal = this.isUsingExternalContainer();

    const sizeClass = this.getButtonSizeClass();
    const btnClass = `media-hub-capture-btn${sizeClass ? ` ${sizeClass}` : ""}`;

    // Create pause button
    const pauseBtn = document.createElement("button");
    pauseBtn.type = "button";
    pauseBtn.className = btnClass;
    pauseBtn.setAttribute("data-action", "pause");
    pauseBtn.setAttribute("data-tooltip", "Pause Recording");
    pauseBtn.setAttribute("data-tooltip-position", "top");
    pauseBtn.innerHTML = getIcon("pause");
    pauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.togglePauseRecording();
    });

    // Create system audio button if enabled (only for internal toolbar)
    const mediaCaptureOptions = this.getMediaCaptureOptions();
    let systemAudioBtn = null;
    if (!isExternal && mediaCaptureOptions.enableSystemAudio) {
      systemAudioBtn = document.createElement("button");
      systemAudioBtn.type = "button";
      systemAudioBtn.className = btnClass;
      systemAudioBtn.setAttribute("data-action", "system-audio");

      // Check if system audio is available
      const hasSystemAudio = this.uploader?.videoRecorder?.systemAudioStream;
      if (!hasSystemAudio) {
        systemAudioBtn.disabled = true;
        systemAudioBtn.classList.add("muted");
        systemAudioBtn.setAttribute("data-tooltip", "No System Audio Available");
        systemAudioBtn.setAttribute("data-tooltip-position", "top");
        systemAudioBtn.innerHTML = getIcon("system_sound_mute");
      } else {
        systemAudioBtn.setAttribute("data-tooltip", "Toggle System Audio");
        systemAudioBtn.setAttribute("data-tooltip-position", "top");
        systemAudioBtn.innerHTML = getIcon("system_sound");
      }

      systemAudioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleSystemAudio();
      });
    }

    // Create microphone button if enabled (only for internal toolbar)
    let micBtn = null;
    if (!isExternal && mediaCaptureOptions.enableMicrophoneAudio) {
      micBtn = document.createElement("button");
      micBtn.type = "button";
      micBtn.className = btnClass;
      micBtn.setAttribute("data-action", "microphone");

      // Check if microphone is available
      const hasMic = this.uploader?.videoRecorder?.microphoneStream;
      if (!hasMic) {
        micBtn.disabled = true;
        micBtn.classList.add("muted");
        micBtn.setAttribute("data-tooltip", "No Microphone Available");
        micBtn.setAttribute("data-tooltip-position", "top");
        micBtn.innerHTML = getIcon("mic_mute");
      } else {
        micBtn.setAttribute("data-tooltip", "Toggle Microphone");
        micBtn.setAttribute("data-tooltip-position", "top");
        micBtn.innerHTML = getIcon("mic");
      }

      micBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMicrophone();
      });
    }

    // Create stop button
    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = `${btnClass} media-hub-capture-btn-stop`;
    stopBtn.setAttribute("data-action", "stop");
    stopBtn.setAttribute("data-tooltip", "Stop Recording");
    stopBtn.setAttribute("data-tooltip-position", "top");
    stopBtn.innerHTML = getIcon("stop");
    stopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.uploader?.stopVideoRecording();
    });

    // Append buttons to capture button container in order
    captureContainer.appendChild(pauseBtn);
    if (systemAudioBtn) captureContainer.appendChild(systemAudioBtn);
    if (micBtn) captureContainer.appendChild(micBtn);
    captureContainer.appendChild(stopBtn);

    // Store references for cleanup
    this.recordingToolbarButtons = [pauseBtn, systemAudioBtn, micBtn, stopBtn].filter(Boolean);

    // Initialize tooltips for recording toolbar buttons
    TooltipManager.init(captureContainer);
  }

  /**
   * Create and show audio recording toolbar
   */
  createAudioRecordingToolbar() {
    if (this.recordingToolbar) {
      this.recordingToolbar.remove();
    }

    const captureContainer = this.getToolbarContainer();
    if (!captureContainer) return;

    // Hide original buttons in external container
    this.hideOriginalButtons(captureContainer);

    this.recordingType = 'audio';

    const isExternal = this.isUsingExternalContainer();

    const sizeClass = this.getButtonSizeClass();
    const btnClass = `media-hub-capture-btn${sizeClass ? ` ${sizeClass}` : ""}`;

    // Create pause button
    const pauseBtn = document.createElement("button");
    pauseBtn.type = "button";
    pauseBtn.className = btnClass;
    pauseBtn.setAttribute("data-action", "pause");
    pauseBtn.setAttribute("data-tooltip", "Pause Recording");
    pauseBtn.setAttribute("data-tooltip-position", "top");
    pauseBtn.innerHTML = getIcon("pause");
    pauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.togglePauseAudioRecording();
    });

    // Create system audio button if enabled (only for internal toolbar)
    const mediaCaptureOptions = this.getMediaCaptureOptions();
    let systemAudioBtn = null;
    if (!isExternal && mediaCaptureOptions.enableSystemAudio) {
      systemAudioBtn = document.createElement("button");
      systemAudioBtn.type = "button";
      systemAudioBtn.className = btnClass;
      systemAudioBtn.setAttribute("data-action", "system-audio");

      // Check if system audio is available
      const hasSystemAudio = this.uploader?.audioRecorder?.systemAudioStream;
      if (!hasSystemAudio) {
        systemAudioBtn.disabled = true;
        systemAudioBtn.classList.add("muted");
        systemAudioBtn.setAttribute("data-tooltip", "No System Audio Available");
        systemAudioBtn.setAttribute("data-tooltip-position", "top");
        systemAudioBtn.innerHTML = getIcon("system_sound_mute");
      } else {
        systemAudioBtn.setAttribute("data-tooltip", "Toggle System Audio");
        systemAudioBtn.setAttribute("data-tooltip-position", "top");
        systemAudioBtn.innerHTML = getIcon("system_sound");
      }

      systemAudioBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleAudioSystemAudio();
      });
    }

    // Create stop button (red by default)
    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = `${btnClass} media-hub-capture-btn-stop`;
    stopBtn.setAttribute("data-action", "stop");
    stopBtn.setAttribute("data-tooltip", "Stop Recording");
    stopBtn.setAttribute("data-tooltip-position", "top");
    stopBtn.innerHTML = getIcon("stop");
    stopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.uploader?.stopAudioRecording();
    });

    // Append buttons to capture button container in order
    captureContainer.appendChild(pauseBtn);
    if (systemAudioBtn) captureContainer.appendChild(systemAudioBtn);
    captureContainer.appendChild(stopBtn);

    // Store references for cleanup
    this.recordingToolbarButtons = [pauseBtn, systemAudioBtn, stopBtn].filter(Boolean);

    // Initialize tooltips for audio recording toolbar buttons
    TooltipManager.init(captureContainer);
  }

  /**
   * Remove recording toolbar
   */
  removeRecordingToolbar() {
    if (this.recordingToolbarButtons) {
      this.recordingToolbarButtons.forEach(btn => {
        if (btn) btn.remove();
      });
      this.recordingToolbarButtons = null;
    }
    // Restore original buttons in external container
    this.showOriginalButtons();
    this.recordingType = null;
  }

  /**
   * Toggle pause/resume video recording
   */
  togglePauseRecording() {
    if (!this.uploader?.videoRecorder) return;

    const status = this.uploader.videoRecorder.getRecordingStatus();
    const pauseBtn = this.getToolbarContainer()?.querySelector('[data-action="pause"]');

    if (status.isPaused) {
      this.uploader.videoRecorder.resumeRecording();
      if (pauseBtn) {
        pauseBtn.innerHTML = getIcon("pause");
        pauseBtn.setAttribute("data-tooltip", "Pause Recording");
        pauseBtn.classList.remove("paused");
      }
      // Remove paused state from recording indicators
      this.setRecordingIndicatorPausedState(false);
    } else {
      this.uploader.videoRecorder.pauseRecording();
      if (pauseBtn) {
        pauseBtn.innerHTML = getIcon("play");
        pauseBtn.setAttribute("data-tooltip", "Resume Recording");
        pauseBtn.classList.add("paused");
      }
      // Add paused state to recording indicators
      this.setRecordingIndicatorPausedState(true);
    }
  }

  /**
   * Toggle pause/resume audio recording
   */
  togglePauseAudioRecording() {
    if (!this.uploader?.audioRecorder) return;

    const status = this.uploader.audioRecorder.getRecordingStatus();
    const pauseBtn = this.getToolbarContainer()?.querySelector('[data-action="pause"]');

    if (status.isPaused) {
      this.uploader.audioRecorder.resumeRecording();
      if (pauseBtn) {
        pauseBtn.innerHTML = getIcon("pause");
        pauseBtn.setAttribute("data-tooltip", "Pause Recording");
        pauseBtn.classList.remove("paused");
      }
      // Remove paused state from recording indicators
      this.setRecordingIndicatorPausedState(false);
    } else {
      this.uploader.audioRecorder.pauseRecording();
      if (pauseBtn) {
        pauseBtn.innerHTML = getIcon("play");
        pauseBtn.setAttribute("data-tooltip", "Resume Recording");
        pauseBtn.classList.add("paused");
      }
      // Add paused state to recording indicators
      this.setRecordingIndicatorPausedState(true);
    }
  }

  /**
   * Set paused state on all recording indicators
   * @param {boolean} isPaused - Whether recording is paused
   */
  setRecordingIndicatorPausedState(isPaused) {
    // Standalone recording indicator
    if (this.standaloneIndicator) {
      const dot = this.standaloneIndicator.querySelector(".media-hub-recording-dot");
      if (dot) {
        dot.classList.toggle("paused", isPaused);
      }
    }

    // Internal recording indicator (uploader mode)
    if (this.uploader?.recordingIndicator) {
      const dot = this.uploader.recordingIndicator.querySelector(".media-hub-recording-dot");
      if (dot) {
        dot.classList.toggle("paused", isPaused);
      }
    }

    // External recording indicator
    if (this.externalRecordingIndicator) {
      const dot = this.externalRecordingIndicator.querySelector(".media-hub-recording-dot");
      if (dot) {
        dot.classList.toggle("paused", isPaused);
      }
    }
  }

  /**
   * Toggle system audio for video recording
   */
  toggleSystemAudio() {
    if (!this.uploader?.videoRecorder) return;

    const enabled = this.uploader.videoRecorder.toggleSystemAudio();
    const btn = this.getToolbarContainer()?.querySelector('[data-action="system-audio"]');

    if (btn) {
      const iconName = enabled ? "system_sound" : "system_sound_mute";
      btn.innerHTML = getIcon(iconName);
      btn.classList.toggle("muted", !enabled);
      btn.setAttribute("data-tooltip", enabled ? "Mute System Audio" : "Unmute System Audio");
    }
  }

  /**
   * Toggle system audio for audio recording
   */
  toggleAudioSystemAudio() {
    if (!this.uploader?.audioRecorder) return;

    const enabled = this.uploader.audioRecorder.toggleSystemAudio();
    const btn = this.getToolbarContainer()?.querySelector('[data-action="system-audio"]');

    if (btn) {
      const iconName = enabled ? "system_sound" : "system_sound_mute";
      btn.innerHTML = getIcon(iconName);
      btn.classList.toggle("muted", !enabled);
      btn.setAttribute("data-tooltip", enabled ? "Mute System Audio" : "Unmute System Audio");
    }
  }

  /**
   * Toggle microphone for video recording
   */
  toggleMicrophone() {
    if (!this.uploader?.videoRecorder) return;

    const enabled = this.uploader.videoRecorder.toggleMicrophoneAudio();
    const btn = this.getToolbarContainer()?.querySelector('[data-action="microphone"]');

    if (btn) {
      const iconName = enabled ? "mic" : "mic_mute";
      btn.innerHTML = getIcon(iconName);
      btn.classList.toggle("muted", !enabled);
      btn.setAttribute("data-tooltip", enabled ? "Mute Microphone" : "Unmute Microphone");
    }
  }

  /**
   * Format time as MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  formatTime(seconds) {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  /**
   * Build time display text based on options
   * @param {number} elapsed - Elapsed time in seconds
   * @param {number} maxSeconds - Maximum recording time in seconds
   * @param {boolean} showRemaining - Whether to show remaining time
   * @returns {string} Formatted time display text
   */
  buildTimeDisplayText(elapsed, maxSeconds, showRemaining) {
    const mediaCaptureOptions = this.getMediaCaptureOptions();
    const showTime = mediaCaptureOptions.showRecordingTime !== false;
    const showLimit = mediaCaptureOptions.showRecordingLimit !== false;

    if (!showTime) return "";

    if (showRemaining && showLimit && maxSeconds > 0) {
      // Show remaining time
      const remaining = Math.max(0, maxSeconds - elapsed);
      return `-${this.formatTime(remaining)} / ${this.formatTime(maxSeconds)}`;
    } else if (showLimit && maxSeconds > 0) {
      // Show elapsed / total format
      return `${this.formatTime(elapsed)} / ${this.formatTime(maxSeconds)}`;
    } else {
      // Just show elapsed time
      return this.formatTime(elapsed);
    }
  }

  /**
   * Start recording timer display
   */
  startRecordingTimer() {
    // Initialize start time for standalone mode
    if (this.standaloneMode) {
      this.recordingStartTime = Date.now();
    }

    this.recordingTimerInterval = setInterval(() => {
      let elapsed = 0;
      let maxSeconds = 0;
      let sizeStatus = null;
      const mediaCaptureOptions = this.getMediaCaptureOptions();

      if (this.standaloneMode) {
        // Standalone mode: calculate elapsed from start time
        elapsed = Math.floor((Date.now() - this.recordingStartTime) / 1000);
        maxSeconds = this.recordingType === 'audio'
          ? Math.floor(mediaCaptureOptions.maxAudioRecordingDuration || 300)
          : Math.floor(mediaCaptureOptions.maxVideoRecordingDuration || 300);
      } else {
        // Uploader mode: get from recorder
        const recorder = this.recordingType === 'audio' ? this.uploader?.audioRecorder : this.uploader?.videoRecorder;

        if (recorder) {
          elapsed = recorder.getRecordingDuration();
          maxSeconds = this.recordingType === 'audio'
            ? Math.floor(mediaCaptureOptions.maxAudioRecordingDuration || 300)
            : Math.floor(mediaCaptureOptions.maxVideoRecordingDuration || 300);

          // Get size status if available
          if (typeof recorder.getSizeStatus === 'function') {
            sizeStatus = recorder.getSizeStatus();
          }
        }
      }

      // Update time on all recording indicators (internal, external, and standalone)
      const timeElements = [];

      // Standalone recording indicator
      const standaloneTimeEl = this.standaloneIndicator?.querySelector(".media-hub-recording-time");
      if (standaloneTimeEl) timeElements.push(standaloneTimeEl);

      // Internal recording indicator (uploader mode)
      const internalTimeEl = this.uploader?.recordingIndicator?.querySelector(".media-hub-recording-time");
      if (internalTimeEl) timeElements.push(internalTimeEl);

      // External recording indicator
      const externalTimeEl = this.externalRecordingIndicator?.querySelector(".media-hub-recording-time");
      if (externalTimeEl) timeElements.push(externalTimeEl);

      timeElements.forEach(timeElement => {
        // Check if this is minimal view (external/modal/standalone) - only show elapsed time
        const isMinimal = timeElement.dataset.minimal === "true";
        if (isMinimal) {
          // Minimal view: only elapsed time (MM:SS)
          timeElement.textContent = this.formatTime(elapsed);
        } else {
          // Full view: check if we should show remaining time or elapsed/total
          const showRemaining = timeElement.dataset.showRemaining === "true";
          const timeText = this.buildTimeDisplayText(elapsed, maxSeconds, showRemaining);
          timeElement.textContent = timeText;
        }
      });

      // Update size display on all recording indicators (only in uploader mode)
      if (sizeStatus && mediaCaptureOptions.showRecordingSize !== false) {
        const sizeElements = [];

        // Internal size element
        const internalSizeEl = this.uploader?.recordingIndicator?.querySelector(".media-hub-recording-size");
        if (internalSizeEl) sizeElements.push(internalSizeEl);

        // External size element
        const externalSizeEl = this.externalRecordingIndicator?.querySelector(".media-hub-recording-size");
        if (externalSizeEl) sizeElements.push(externalSizeEl);

        sizeElements.forEach(sizeElement => {
          // Add approximation symbol (~) to indicate estimated size
          sizeElement.textContent = `~${sizeStatus.formattedSize}`;
          // Add warning class if approaching limit
          if (sizeStatus.isWarning) {
            sizeElement.classList.add('warning');
          }
          if (sizeStatus.isNearLimit) {
            sizeElement.classList.add('danger');
          }
        });
      }
    }, 1000);
  }

  /**
   * Stop recording timer display
   */
  stopRecordingTimer() {
    if (this.recordingTimerInterval) {
      clearInterval(this.recordingTimerInterval);
      this.recordingTimerInterval = null;
    }
  }

  /**
   * Setup handler for when user stops screen sharing from system button
   */
  setupStreamEndedHandler() {
    // Skip in standalone mode - MediaCapture handles this directly
    if (this.standaloneMode) return;

    if (this.recordingType === 'video') {
      if (!this.uploader?.videoRecorder?.stream) return;

      // Listen for when user clicks "Stop sharing" from browser/system
      this.uploader.videoRecorder.stream.getTracks().forEach((track) => {
        track.onended = async () => {
          // Check if recording is still in progress before stopping
          if (this.uploader?.videoRecorder?.isRecording) {
            // User stopped sharing from system button, gracefully stop recording
            try {
              await this.uploader.stopVideoRecording();
            } catch (error) {
              // Ignore "no recording in progress" errors
              if (!error.message?.includes('No recording in progress')) {
                console.error('Error stopping video recording:', error);
              }
            }
          }
        };
      });
    } else if (this.recordingType === 'audio') {
      // For audio recording, setup handlers for both mic and system audio streams
      const audioRecorder = this.uploader?.audioRecorder;
      if (!audioRecorder) return;

      const setupTrackEndHandler = (stream, stopFn) => {
        if (!stream) return;
        stream.getTracks().forEach((track) => {
          track.onended = async () => {
            // Check if recording is still in progress before stopping
            if (audioRecorder && audioRecorder.isRecording) {
              // User stopped sharing from system button, gracefully stop recording
              try {
                await stopFn();
              } catch (error) {
                // Ignore "no recording in progress" errors
                if (!error.message?.includes('No recording in progress')) {
                  console.error('Error stopping audio recording:', error);
                }
              }
            }
          };
        });
      };

      if (audioRecorder.microphoneStream) {
        setupTrackEndHandler(audioRecorder.microphoneStream, () => this.uploader?.stopAudioRecording());
      }
      if (audioRecorder.systemAudioStream) {
        setupTrackEndHandler(audioRecorder.systemAudioStream, () => this.uploader?.stopAudioRecording());
      }
    }
  }

  /**
   * Get icon name for recording type
   * @param {string} type - Recording type (video, audio, webcam)
   * @returns {string} Icon name
   */
  getRecordingTypeIcon(type) {
    const iconMap = {
      video: "video",
      audio: "audio",
      webcam: "webcam"
    };
    return iconMap[type] || "video";
  }

  /**
   * Get tooltip text for recording type
   * @param {string} type - Recording type (video, audio, webcam)
   * @returns {string} Tooltip text
   */
  getRecordingTypeTooltip(type) {
    const tooltipMap = {
      video: "Screen Recording",
      audio: "Audio Recording",
      webcam: "Webcam Recording"
    };
    return tooltipMap[type] || "Recording";
  }

  /**
   * Create an external recording indicator for the external toolbar container
   * External/modal indicators use a minimal view: type icon + dot + elapsed time only (no limit, no size)
   * @param {HTMLElement} container - The external container
   */
  createExternalRecordingIndicator(container) {
    if (this.externalRecordingIndicator) {
      this.externalRecordingIndicator.remove();
    }

    const mediaCaptureOptions = this.getMediaCaptureOptions();
    const showTime = mediaCaptureOptions.showRecordingTime !== false;
    // External/modal view is minimal - elapsed time only, no limit, no size

    this.externalRecordingIndicator = document.createElement("div");
    const timerSizeClass = this.getTimerSizeClass();
    this.externalRecordingIndicator.className = `media-hub-recording-indicator media-hub-recording-indicator--minimal${timerSizeClass ? ` ${timerSizeClass}` : ""}`;

    // Recording type icon
    const typeIcon = this.getRecordingTypeIcon(this.recordingType);
    const typeTooltip = this.getRecordingTypeTooltip(this.recordingType);

    // Minimal view: type icon + dot + elapsed time only (no limit, no size)
    let innerHTML = `<span class="media-hub-recording-type" data-tooltip="${typeTooltip}" data-tooltip-position="top">${getIcon(typeIcon)}</span>`;
    innerHTML += '<span class="media-hub-recording-dot"></span>';
    if (showTime) {
      innerHTML += `<span class="media-hub-recording-time" data-timer-format="elapsed" data-minimal="true">00:00</span>`;
    }
    this.externalRecordingIndicator.innerHTML = innerHTML;

    // Prevent click propagation
    this.externalRecordingIndicator.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Minimal view doesn't have toggle - always shows elapsed time only

    // Insert at the beginning of the container (before toolbar buttons)
    container.insertBefore(this.externalRecordingIndicator, container.firstChild);
  }

  /**
   * Show recording indicator
   */
  showRecordingIndicator() {
    if (this.isUsingExternalContainer()) {
      const container = this.getToolbarContainer();
      if (container) {
        this.createExternalRecordingIndicator(container);
      }
    } else if (this.uploader?.recordingIndicator) {
      // Add/update recording type icon for internal indicator
      this.updateInternalRecordingTypeIcon();
      this.uploader.recordingIndicator.style.display = "flex";
    }
    this.startRecordingTimer();
  }

  /**
   * Update/add recording type icon to internal recording indicator
   */
  updateInternalRecordingTypeIcon() {
    if (!this.uploader?.recordingIndicator) return;

    const typeIcon = this.getRecordingTypeIcon(this.recordingType);
    const typeTooltip = this.getRecordingTypeTooltip(this.recordingType);

    // Check if type icon already exists
    let typeIconEl = this.uploader.recordingIndicator.querySelector(".media-hub-recording-type");

    if (!typeIconEl) {
      // Create and insert type icon at the beginning
      typeIconEl = document.createElement("span");
      typeIconEl.className = "media-hub-recording-type";
      this.uploader.recordingIndicator.insertBefore(typeIconEl, this.uploader.recordingIndicator.firstChild);
    }

    // Update icon content and tooltip
    typeIconEl.innerHTML = getIcon(typeIcon);
    typeIconEl.setAttribute("data-tooltip", typeTooltip);
    typeIconEl.setAttribute("data-tooltip-position", "top");
  }

  /**
   * Hide recording indicator
   */
  hideRecordingIndicator() {
    this.stopRecordingTimer();

    // Remove external recording indicator
    if (this.externalRecordingIndicator) {
      this.externalRecordingIndicator.remove();
      this.externalRecordingIndicator = null;
    }

    // Hide internal recording indicator
    if (this.uploader?.recordingIndicator) {
      this.uploader.recordingIndicator.style.display = "none";

      // Reset timer display to initial state
      const timeElement = this.uploader.recordingIndicator.querySelector(
        ".media-hub-recording-time"
      );
      if (timeElement) {
        // Reset to 00:00 / max duration format
        const mediaCaptureOptions = this.getMediaCaptureOptions();
        const maxSeconds = this.recordingType === 'audio'
          ? Math.floor(mediaCaptureOptions.maxAudioRecordingDuration || 300)
          : Math.floor(mediaCaptureOptions.maxVideoRecordingDuration || 300);

        const totalMinutes = Math.floor(maxSeconds / 60);
        const totalSeconds = maxSeconds % 60;
        timeElement.textContent = `00:00 / ${String(totalMinutes).padStart(2, "0")}:${String(totalSeconds).padStart(2, "0")}`;

        // Reset the display mode preference
        timeElement.dataset.showRemaining = "false";
      }
    }
  }

  /**
   * Cleanup all UI elements
   */
  cleanup() {
    this.removeRecordingToolbar();
    this.hideRecordingIndicator();
  }

  /**
   * Show recording UI (called by MediaCapture)
   * @param {string} type - Recording type ('video' or 'audio')
   */
  show(type) {
    this.recordingType = type;

    if (this.standaloneMode) {
      // In standalone mode, create a floating recording indicator
      this.createStandaloneRecordingUI(type);
    } else {
      this.setupStreamEndedHandler();

      if (type === "video") {
        this.createRecordingToolbar();
      } else if (type === "audio") {
        this.createAudioRecordingToolbar();
      }

      this.showRecordingIndicator();
    }

    this.startRecordingTimer();
  }

  /**
   * Create standalone recording UI for MediaCapture
   * Creates a floating toolbar at the top of the screen
   * @param {string} type - Recording type ('video' or 'audio')
   * @private
   */
  createStandaloneRecordingUI(type) {
    // Remove existing standalone UI if any
    this.removeStandaloneUI();

    const options = this.getOptions();
    const sizeClass = this.getButtonSizeClass();
    const timerSizeClass = this.getTimerSizeClass();
    const btnClass = `media-hub-capture-btn${sizeClass ? ` ${sizeClass}` : ""}`;

    // Create floating container
    this.standaloneContainer = document.createElement("div");
    this.standaloneContainer.className = "media-hub-standalone-recording-bar";
    this.standaloneContainer.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      background: rgba(0, 0, 0, 0.85);
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 999999;
      backdrop-filter: blur(10px);
    `;

    // Recording indicator
    this.standaloneIndicator = document.createElement("div");
    this.standaloneIndicator.className = `media-hub-recording-indicator media-hub-recording-indicator--minimal${timerSizeClass ? ` ${timerSizeClass}` : ""}`;
    this.standaloneIndicator.style.cssText = "display: flex; align-items: center; gap: 8px; color: white;";

    const typeIcon = this.getRecordingTypeIcon(type);
    this.standaloneIndicator.innerHTML = `
      <span class="media-hub-recording-type" style="color: white;">${getIcon(typeIcon)}</span>
      <span class="media-hub-recording-dot"></span>
      <span class="media-hub-recording-time" data-minimal="true" style="color: white; font-family: monospace;">00:00</span>
    `;
    this.standaloneContainer.appendChild(this.standaloneIndicator);

    // Button container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = "display: flex; gap: 8px;";

    // Pause button
    const pauseBtn = document.createElement("button");
    pauseBtn.type = "button";
    pauseBtn.className = btnClass;
    pauseBtn.id = "mc-pause-btn";
    pauseBtn.setAttribute("data-action", "pause");
    pauseBtn.setAttribute("data-tooltip", "Pause Recording");
    pauseBtn.setAttribute("data-tooltip-position", "bottom");
    pauseBtn.innerHTML = getIcon("pause");
    pauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (options.onPause) {
        options.onPause();
      }
    });
    buttonContainer.appendChild(pauseBtn);

    // Stop button
    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = `${btnClass} media-hub-capture-btn-stop`;
    stopBtn.setAttribute("data-action", "stop");
    stopBtn.setAttribute("data-tooltip", "Stop Recording");
    stopBtn.setAttribute("data-tooltip-position", "bottom");
    stopBtn.innerHTML = getIcon("stop");
    stopBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (options.onStop) {
        options.onStop();
      }
    });
    buttonContainer.appendChild(stopBtn);

    this.standaloneContainer.appendChild(buttonContainer);

    // Store buttons for cleanup
    this.recordingToolbarButtons = [pauseBtn, stopBtn];

    // Add to document
    document.body.appendChild(this.standaloneContainer);

    // Initialize tooltips
    TooltipManager.init(this.standaloneContainer);
  }

  /**
   * Remove standalone recording UI
   * @private
   */
  removeStandaloneUI() {
    if (this.standaloneContainer) {
      this.standaloneContainer.remove();
      this.standaloneContainer = null;
    }
    if (this.standaloneIndicator) {
      this.standaloneIndicator = null;
    }
  }

  /**
   * Hide recording UI (called by MediaCapture)
   */
  hide() {
    if (this.standaloneMode) {
      this.removeStandaloneUI();
    } else {
      this.cleanup();
    }
    this.stopRecordingTimer();
  }

  /**
   * Set paused state for recording indicator (called by MediaCapture)
   * @param {boolean} isPaused - Whether recording is paused
   */
  setPaused(isPaused) {
    this.setRecordingIndicatorPausedState(isPaused);

    // Update pause button in toolbar (standalone mode)
    const pauseBtn = document.getElementById("mc-pause-btn");
    if (pauseBtn) {
      pauseBtn.innerHTML = isPaused ? getIcon("play") : getIcon("pause");
      pauseBtn.setAttribute("data-tooltip", isPaused ? "Resume Recording" : "Pause Recording");

      // Update click handler to call appropriate callback
      const options = this.getOptions();
      pauseBtn.onclick = (e) => {
        e.stopPropagation();
        if (isPaused && options.onResume) {
          options.onResume();
        } else if (!isPaused && options.onPause) {
          options.onPause();
        }
      };
    }
  }

  /**
   * Destroy the UI and cleanup
   */
  destroy() {
    if (this.standaloneMode) {
      this.removeStandaloneUI();
    } else {
      this.cleanup();
    }
    this.stopRecordingTimer();
    this.recordingToolbar = null;
    this.recordingToolbarButtons = null;
    this.externalContainerButtons = null;
    this.externalRecordingIndicator = null;
    this.standaloneContainer = null;
    this.standaloneIndicator = null;
  }
}
