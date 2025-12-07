/**
 * FileCarousel - Entry Point
 *
 * A standalone media carousel/gallery viewer component.
 * Can be used independently or integrated with FileUploader.
 *
 * @module FileCarousel
 *
 * @example
 * // Standalone usage
 * import { FileCarousel } from './file-carousel';
 *
 * const carousel = new FileCarousel({
 *   container: document.getElementById('carousel-container'),
 *   files: [
 *     { name: 'image.jpg', url: '/files/image.jpg', carouselType: 'image', thumbnail: '/thumbs/image.jpg' },
 *     { name: 'video.mp4', url: '/files/video.mp4', carouselType: 'video', thumbnail: '/thumbs/video.jpg' },
 *     { name: 'document.pdf', url: '/files/document.pdf', carouselType: 'pdf' }
 *   ],
 *   autoPreload: true,
 *   showDownloadButton: true
 * });
 *
 * carousel.open(0); // Open at first file
 *
 * @exports FileCarousel - Main carousel class
 * @exports MediaPreloader - Handles file preloading and caching
 * @exports MediaRenderer - Renders preview content for each file type
 * @exports ModalController - Manages modal operations and navigation
 */

import FileCarousel from "./FileCarousel.js";
import { MediaPreloader } from "./MediaPreloader.js";
import { MediaRenderer } from "./MediaRenderer.js";
import { ModalController } from "./ModalController.js";

export { FileCarousel, MediaPreloader, MediaRenderer, ModalController };
export default FileCarousel;
