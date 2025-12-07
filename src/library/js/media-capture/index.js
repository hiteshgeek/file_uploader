/**
 * MediaCapture - Entry Point
 *
 * A unified screen capture and recording component.
 * Can be used independently or integrated with FileUploader.
 *
 * Features:
 * - Full screen screenshot capture
 * - Region selection screenshot capture
 * - Full page (scrolling) screenshot capture
 * - Video screen recording with audio
 * - Audio-only recording
 *
 * @module MediaCapture
 *
 * @example
 * // Standalone usage
 * import { MediaCapture } from './media-capture';
 *
 * const capture = new MediaCapture({
 *   onCapture: (file, type) => {
 *     console.log('Captured:', file.name, type);
 *   },
 *   onRecordingStart: () => console.log('Recording started'),
 *   onRecordingStop: (file, type) => console.log('Recording stopped:', file.name)
 * });
 *
 * // Screenshot methods
 * capture.captureScreen();       // Full screen screenshot (uses getDisplayMedia)
 * capture.captureRegion();       // Region selection screenshot
 * capture.captureFullPage();     // Full page screenshot with scroll
 *
 * // Recording methods
 * capture.startVideoRecording(); // Screen + optional audio recording
 * capture.startAudioRecording(); // Audio-only recording
 * capture.pauseRecording();      // Pause active recording
 * capture.resumeRecording();     // Resume paused recording
 * capture.stopRecording();       // Stop any active recording
 *
 * // Cleanup
 * capture.destroy();
 *
 * @exports MediaCapture - Main unified capture/recording class
 * @exports ScreenCapture - Direct screen capture (getDisplayMedia)
 * @exports PageCapture - Page/region capture with html2canvas
 * @exports VideoRecorder - Video recording
 * @exports AudioRecorder - Audio recording
 * @exports AudioWorkletRecorder - Advanced audio recording
 * @exports RecordingUI - Recording UI controls
 * @exports RecordingSizeManager - Recording size tracking
 */

import MediaCapture from "./MediaCapture.js";
import ScreenCapture from "./capture/ScreenCapture.js";
import PageCapture from "./capture/PageCapture.js";
import VideoRecorder from "./recording/VideoRecorder.js";
import AudioRecorder from "./recording/AudioRecorder.js";
import AudioWorkletRecorder from "./recording/AudioWorkletRecorder.js";
import RecordingUI from "./ui/RecordingUI.js";
import RecordingSizeManager from "./recording/RecordingSizeManager.js";

export {
  MediaCapture,
  ScreenCapture,
  PageCapture,
  VideoRecorder,
  AudioRecorder,
  AudioWorkletRecorder,
  RecordingUI,
  RecordingSizeManager
};

export default MediaCapture;
