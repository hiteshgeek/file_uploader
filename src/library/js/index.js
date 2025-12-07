/**
 * FileUploader Library - Main Entry Point
 *
 * This library provides three independent, exportable components:
 * 1. FileUploader - Main file upload component
 * 2. FileCarousel - Media carousel/gallery viewer
 * 3. MediaCapture - Screen capture and recording utilities
 *
 * Each component can be used standalone or together.
 *
 * @example
 * // ES Module imports
 * import { FileUploader, FileCarousel, MediaCapture } from 'file-uploader';
 *
 * // Or import individual components
 * import { FileUploader } from 'file-uploader/file-uploader';
 * import { FileCarousel } from 'file-uploader/file-carousel';
 * import { MediaCapture } from 'file-uploader/media-capture';
 *
 * @module MediaHub
 */

// ============================================================
// PROJECT 1: FILE UPLOADER
// Main file upload component
// ============================================================
import FileUploader from "./components/FileUploader.js";

// ============================================================
// PROJECT 2: FILE CAROUSEL
// Media carousel/gallery viewer (standalone)
// ============================================================
import { FileCarousel } from "./file-carousel/index.js";

// ============================================================
// PROJECT 3: MEDIA CAPTURE
// Screen capture and recording utilities (standalone)
// ============================================================
import { MediaCapture } from "./media-capture/index.js";

// ============================================================
// PROJECT 4: CONFIG BUILDER
// Visual configuration interface for FileUploader
// ============================================================
import ConfigBuilder from "./components/ConfigBuilder.js";

// ============================================================
// UTILITIES
// Global tooltip system for all components
// ============================================================
import TooltipManager from "./utils/TooltipManager.js";

// ============================================================
// EXPORTS
// ============================================================

// Named exports for ES modules
export {
  FileUploader,
  FileCarousel,
  MediaCapture,
  ConfigBuilder,
  TooltipManager,
};

// Expose classes globally for IIFE build
if (typeof window !== "undefined") {
  window.FileUploader = FileUploader;
  window.FileCarousel = FileCarousel;
  window.MediaCapture = MediaCapture;
  window.ConfigBuilder = ConfigBuilder;
  window.TooltipManager = TooltipManager;
}
