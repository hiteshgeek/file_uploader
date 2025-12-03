import { FileUploader } from "./components/FileUploader.js";
// import { icons } from "./icons.js";

export { FileUploader };

// Expose FileUploader class directly for IIFE build
if (typeof window !== "undefined") {
  window.FileUploader = FileUploader;
}
