/**
 * FileUploader - Entry Point
 *
 * Main file upload component with drag & drop, preview, and AJAX upload.
 * Compatible with Bootstrap 3-5 and standalone usage.
 *
 * @module FileUploader
 *
 * @example
 * // Basic usage
 * import { FileUploader } from './file-uploader';
 *
 * const uploader = new FileUploader('#upload-container', {
 *   urls: {
 *     uploadUrl: '/api/upload',
 *     deleteUrl: '/api/delete'
 *   },
 *   limits: {
 *     perFileMaxSize: 10 * 1024 * 1024, // 10MB
 *     maxFiles: 10
 *   }
 * });
 *
 * @exports FileUploader - Main uploader class
 * @exports DEFAULT_OPTIONS - Default configuration options
 * @exports FileValidator - File validation utilities
 */

// Main class
import FileUploader from "../components/FileUploader.js";

// Configuration
import { DEFAULT_OPTIONS, mergeGroupedOptions, flattenOptions, getDefaultOptions } from "./config/DefaultOptions.js";

// Validators
import { FileValidator } from "./validators/FileValidator.js";

// Managers
import { UIBuilder } from "./managers/UIBuilder.js";
import { EventManager } from "./managers/EventManager.js";
import { UploadManager } from "./managers/UploadManager.js";
import { PreviewManager } from "./managers/PreviewManager.js";
import { CaptureManager } from "./managers/CaptureManager.js";
import { CaptureButtonBuilder } from "./managers/CaptureButtonBuilder.js";
import { LimitsDisplayManager } from "./managers/LimitsDisplayManager.js";
import { SelectionManager } from "./managers/SelectionManager.js";
import { CrossUploaderManager, uploaderRegistry } from "./managers/CrossUploaderManager.js";
import { CarouselManager } from "./managers/CarouselManager.js";

// Utilities
import * as helpers from "./utils/helpers.js";

export {
  // Main class
  FileUploader,

  // Configuration
  DEFAULT_OPTIONS,
  mergeGroupedOptions,
  flattenOptions,
  getDefaultOptions,

  // Validators
  FileValidator,

  // Managers
  UIBuilder,
  EventManager,
  UploadManager,
  PreviewManager,
  CaptureManager,
  CaptureButtonBuilder,
  LimitsDisplayManager,
  SelectionManager,
  CrossUploaderManager,
  CarouselManager,

  // Registry
  uploaderRegistry,

  // Utilities
  helpers
};

export default FileUploader;
