/**
 * MediaCapture.js
 *
 * Unified screen capture and recording class.
 * Acts as a facade for ScreenCapture, PageCapture, VideoRecorder, and AudioRecorder.
 *
 * @module MediaCapture
 * @requires ScreenCapture - For direct screen capture
 * @requires PageCapture - For page/region capture with html2canvas
 * @requires VideoRecorder - For video recording
 * @requires AudioRecorder - For audio recording
 * @requires RecordingUI - For recording UI controls
 */

import ScreenCapture from "./capture/ScreenCapture.js";
import PageCapture from "./capture/PageCapture.js";
import VideoRecorder from "./recording/VideoRecorder.js";
import AudioRecorder from "./recording/AudioRecorder.js";
import RecordingUI from "./ui/RecordingUI.js";

// ============================================================
// MEDIA CAPTURE CLASS
// Unified facade for all capture and recording functionality
// ============================================================

/**
 * MediaCapture - Unified screen capture and recording
 *
 * Provides a single interface for:
 * - Full screen screenshot capture
 * - Region selection screenshot capture
 * - Full page (scrolling) screenshot capture
 * - Video screen recording with audio
 * - Audio-only recording
 *
 * @class
 * @param {Object} options - Configuration options
 * @param {Function} options.onCapture - Callback when screenshot captured (file, type)
 * @param {Function} options.onRecordingStart - Callback when recording starts
 * @param {Function} options.onRecordingStop - Callback when recording stops (file, type)
 * @param {Function} options.onRecordingPause - Callback when recording pauses
 * @param {Function} options.onRecordingResume - Callback when recording resumes
 * @param {Function} options.onError - Callback on error (error, context)
 * @param {Object} options.screenCaptureOptions - Options for ScreenCapture
 * @param {Object} options.pageCaptureOptions - Options for PageCapture
 * @param {Object} options.videoRecorderOptions - Options for VideoRecorder
 * @param {Object} options.audioRecorderOptions - Options for AudioRecorder
 * @param {Object} options.recordingUIOptions - Options for RecordingUI
 * @param {boolean} options.showRecordingUI - Show recording UI controls (default: true)
 *
 * @example
 * const capture = new MediaCapture({
 *   onCapture: (file, type) => console.log('Captured:', file.name, type),
 *   onRecordingStart: () => console.log('Recording started'),
 *   onRecordingStop: (file, type) => console.log('Recording stopped:', file.name)
 * });
 *
 * // Screenshots
 * await capture.captureScreen();
 * await capture.captureRegion();
 * await capture.captureFullPage();
 *
 * // Recording
 * await capture.startVideoRecording();
 * capture.stopRecording();
 */
export default class MediaCapture {
  constructor(options = {}) {
    // ------------------------------------------------------------
    // CONFIGURATION
    // ------------------------------------------------------------
    this.options = {
      // Callbacks
      onCapture: options.onCapture || null,
      onRecordingStart: options.onRecordingStart || null,
      onRecordingStop: options.onRecordingStop || null,
      onRecordingPause: options.onRecordingPause || null,
      onRecordingResume: options.onRecordingResume || null,
      onError: options.onError || null,

      // Show recording UI
      showRecordingUI: options.showRecordingUI !== false,

      // Sub-component options
      screenCaptureOptions: options.screenCaptureOptions || {},
      pageCaptureOptions: options.pageCaptureOptions || {},
      videoRecorderOptions: options.videoRecorderOptions || {},
      audioRecorderOptions: options.audioRecorderOptions || {},
      recordingUIOptions: options.recordingUIOptions || {},

      ...options,
    };

    // ------------------------------------------------------------
    // STATE
    // ------------------------------------------------------------
    this.isRecording = false;
    this.isPaused = false;
    this.recordingType = null; // 'video' or 'audio'

    // ------------------------------------------------------------
    // SUB-COMPONENTS (lazy initialized)
    // ------------------------------------------------------------
    this._screenCapture = null;
    this._pageCapture = null;
    this._videoRecorder = null;
    this._audioRecorder = null;
    this._recordingUI = null;
  }

  // ============================================================
  // LAZY INITIALIZATION
  // ============================================================

  /**
   * Get or create ScreenCapture instance
   * @private
   */
  get screenCapture() {
    if (!this._screenCapture) {
      this._screenCapture = new ScreenCapture(this.options.screenCaptureOptions);
    }
    return this._screenCapture;
  }

  /**
   * Get or create PageCapture instance
   * @private
   */
  get pageCapture() {
    if (!this._pageCapture) {
      this._pageCapture = new PageCapture({
        ...this.options.pageCaptureOptions,
        onCaptureComplete: (file) => this.handleCapture(file, "region"),
        onCaptureError: (error) => this.handleError(error, "pageCapture"),
      });
    }
    return this._pageCapture;
  }

  /**
   * Get or create VideoRecorder instance
   * @private
   */
  get videoRecorder() {
    if (!this._videoRecorder) {
      this._videoRecorder = new VideoRecorder({
        ...this.options.videoRecorderOptions,
        onAutoStop: (file) => this.handleRecordingStop(file, "video"),
      });
    }
    return this._videoRecorder;
  }

  /**
   * Get or create AudioRecorder instance
   * @private
   */
  get audioRecorder() {
    if (!this._audioRecorder) {
      this._audioRecorder = new AudioRecorder(this.options.audioRecorderOptions);
    }
    return this._audioRecorder;
  }

  /**
   * Get or create RecordingUI instance
   * @private
   */
  get recordingUI() {
    if (!this._recordingUI && this.options.showRecordingUI) {
      this._recordingUI = new RecordingUI({
        ...this.options.recordingUIOptions,
        onPause: () => this.pauseRecording(),
        onResume: () => this.resumeRecording(),
        onStop: () => this.stopRecording(),
      });
    }
    return this._recordingUI;
  }

  // ============================================================
  // SCREENSHOT METHODS
  // ============================================================

  /**
   * Capture full screen screenshot using getDisplayMedia
   * Shows screen selection dialog to user
   *
   * @returns {Promise<File>} Captured screenshot file
   */
  async captureScreen() {
    try {
      const file = await this.screenCapture.capture();
      this.handleCapture(file, "screen");
      return file;
    } catch (error) {
      this.handleError(error, "captureScreen");
      throw error;
    }
  }

  /**
   * Capture region screenshot with selection overlay
   * User draws a selection rectangle on the page
   *
   * @returns {Promise<File>} Captured screenshot file
   */
  async captureRegion() {
    try {
      const file = await this.pageCapture.captureRegion();
      // Callback handled in pageCapture options
      return file;
    } catch (error) {
      this.handleError(error, "captureRegion");
      throw error;
    }
  }

  /**
   * Capture full page screenshot with scroll
   * Captures entire scrollable page content
   *
   * @returns {Promise<File>} Captured screenshot file
   */
  async captureFullPage() {
    try {
      const file = await this.pageCapture.captureFullPage();
      this.handleCapture(file, "fullPage");
      return file;
    } catch (error) {
      this.handleError(error, "captureFullPage");
      throw error;
    }
  }

  /**
   * Capture visible viewport
   *
   * @returns {Promise<File>} Captured screenshot file
   */
  async captureViewport() {
    try {
      const file = await this.pageCapture.captureViewport();
      this.handleCapture(file, "viewport");
      return file;
    } catch (error) {
      this.handleError(error, "captureViewport");
      throw error;
    }
  }

  // ============================================================
  // RECORDING METHODS
  // ============================================================

  /**
   * Start video screen recording
   *
   * @param {Object} options - Recording options (override defaults)
   * @param {boolean} options.enableSystemAudio - Record system audio
   * @param {boolean} options.enableMicrophoneAudio - Record microphone
   * @returns {Promise<void>}
   */
  async startVideoRecording(options = {}) {
    if (this.isRecording) {
      throw new Error("Recording already in progress");
    }

    try {
      // Merge options
      if (options.enableSystemAudio !== undefined) {
        this.videoRecorder.options.systemAudioConstraints = options.enableSystemAudio;
      }
      if (options.enableMicrophoneAudio !== undefined) {
        this.videoRecorder.options.microphoneAudioConstraints = options.enableMicrophoneAudio;
      }

      await this.videoRecorder.startRecording();

      this.isRecording = true;
      this.isPaused = false;
      this.recordingType = "video";

      // Show recording UI
      if (this.recordingUI) {
        this.recordingUI.show("video");
      }

      this.handleRecordingStart("video");
    } catch (error) {
      this.isRecording = false;
      this.recordingType = null;
      this.handleError(error, "startVideoRecording");
      throw error;
    }
  }

  /**
   * Start audio-only recording
   *
   * @param {Object} options - Recording options (override defaults)
   * @param {boolean} options.enableMicrophoneAudio - Record microphone
   * @param {boolean} options.enableSystemAudio - Record system audio
   * @returns {Promise<void>}
   */
  async startAudioRecording(options = {}) {
    if (this.isRecording) {
      throw new Error("Recording already in progress");
    }

    try {
      // Apply options
      if (options.enableMicrophoneAudio !== undefined) {
        this.audioRecorder.options.enableMicrophoneAudio = options.enableMicrophoneAudio;
      }
      if (options.enableSystemAudio !== undefined) {
        this.audioRecorder.options.enableSystemAudio = options.enableSystemAudio;
      }

      await this.audioRecorder.startRecording();

      this.isRecording = true;
      this.isPaused = false;
      this.recordingType = "audio";

      // Show recording UI
      if (this.recordingUI) {
        this.recordingUI.show("audio");
      }

      this.handleRecordingStart("audio");
    } catch (error) {
      this.isRecording = false;
      this.recordingType = null;
      this.handleError(error, "startAudioRecording");
      throw error;
    }
  }

  /**
   * Pause active recording
   */
  pauseRecording() {
    if (!this.isRecording || this.isPaused) return;

    if (this.recordingType === "video") {
      this.videoRecorder.pauseRecording();
    } else if (this.recordingType === "audio") {
      this.audioRecorder.pauseRecording();
    }

    this.isPaused = true;

    if (this.recordingUI) {
      this.recordingUI.setPaused(true);
    }

    if (this.options.onRecordingPause) {
      this.options.onRecordingPause(this.recordingType);
    }
  }

  /**
   * Resume paused recording
   */
  resumeRecording() {
    if (!this.isRecording || !this.isPaused) return;

    if (this.recordingType === "video") {
      this.videoRecorder.resumeRecording();
    } else if (this.recordingType === "audio") {
      this.audioRecorder.resumeRecording();
    }

    this.isPaused = false;

    if (this.recordingUI) {
      this.recordingUI.setPaused(false);
    }

    if (this.options.onRecordingResume) {
      this.options.onRecordingResume(this.recordingType);
    }
  }

  /**
   * Stop active recording and return file
   *
   * @returns {Promise<File>} Recorded file
   */
  async stopRecording() {
    if (!this.isRecording) {
      throw new Error("No recording in progress");
    }

    try {
      let file;

      if (this.recordingType === "video") {
        file = await this.videoRecorder.stopRecording();
      } else if (this.recordingType === "audio") {
        file = await this.audioRecorder.stopRecording();
      }

      const type = this.recordingType;

      // Reset state
      this.isRecording = false;
      this.isPaused = false;
      this.recordingType = null;

      // Hide recording UI
      if (this.recordingUI) {
        this.recordingUI.hide();
      }

      this.handleRecordingStop(file, type);

      return file;
    } catch (error) {
      this.handleError(error, "stopRecording");
      throw error;
    }
  }

  // ============================================================
  // RECORDING STATE
  // ============================================================

  /**
   * Get current recording duration in seconds
   * @returns {number}
   */
  getRecordingDuration() {
    if (!this.isRecording) return 0;

    if (this.recordingType === "video") {
      return this.videoRecorder.getElapsedTime() / 1000;
    } else if (this.recordingType === "audio") {
      return this.audioRecorder.getElapsedTime() / 1000;
    }

    return 0;
  }

  /**
   * Toggle microphone during recording
   * @param {boolean} enabled - Enable or disable microphone
   */
  toggleMicrophone(enabled) {
    if (!this.isRecording) return;

    if (this.recordingType === "video") {
      this.videoRecorder.setMicrophoneEnabled(enabled);
    } else if (this.recordingType === "audio") {
      this.audioRecorder.setMicrophoneEnabled(enabled);
    }
  }

  /**
   * Get available microphone devices
   * @returns {Promise<MediaDeviceInfo[]>}
   */
  async getMicrophoneDevices() {
    return VideoRecorder.getMicrophoneDevices();
  }

  // ============================================================
  // CALLBACK HANDLERS
  // ============================================================

  /**
   * Handle capture complete
   * @private
   */
  handleCapture(file, type) {
    if (this.options.onCapture && file) {
      this.options.onCapture(file, type);
    }
  }

  /**
   * Handle recording start
   * @private
   */
  handleRecordingStart(type) {
    if (this.options.onRecordingStart) {
      this.options.onRecordingStart(type);
    }
  }

  /**
   * Handle recording stop
   * @private
   */
  handleRecordingStop(file, type) {
    if (this.options.onRecordingStop && file) {
      this.options.onRecordingStop(file, type);
    }
  }

  /**
   * Handle error
   * @private
   */
  handleError(error, context) {
    console.error(`MediaCapture [${context}]:`, error);

    if (this.options.onError) {
      this.options.onError(error, context);
    }
  }

  // ============================================================
  // CLEANUP
  // ============================================================

  /**
   * Cleanup and destroy all components
   */
  destroy() {
    // Stop any active recording
    if (this.isRecording) {
      try {
        this.stopRecording();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    // Destroy sub-components
    if (this._screenCapture) {
      this._screenCapture.destroy?.();
      this._screenCapture = null;
    }

    if (this._pageCapture) {
      this._pageCapture.destroy?.();
      this._pageCapture = null;
    }

    if (this._videoRecorder) {
      this._videoRecorder.destroy?.();
      this._videoRecorder = null;
    }

    if (this._audioRecorder) {
      this._audioRecorder.destroy?.();
      this._audioRecorder = null;
    }

    if (this._recordingUI) {
      this._recordingUI.destroy?.();
      this._recordingUI = null;
    }
  }
}

export { MediaCapture };
