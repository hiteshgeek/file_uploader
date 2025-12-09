# MediaHub

A complete file management suite with upload, preview, and capture capabilities. Works standalone or integrates seamlessly with Bootstrap 3-5 forms.

## Features

- **Drag & Drop**: Intuitive drag and drop interface
- **File Type Validation**: Control allowed file types (images, videos, documents, archives)
- **File Preview**:
  - Image preview with thumbnails
  - Video preview with player
  - Generic file icon for other types
- **File Information**: Display file name, type, and size
- **AJAX Upload**: Files upload instantly via AJAX
- **Download Button**: Download uploaded files with original filename
- **Delete Functionality**: Remove uploaded files from server
- **Shared Configuration**: Same validation rules in PHP and JavaScript
- **Bootstrap Compatible**: Works with Bootstrap 3, 4, and 5
- **Standalone Mode**: Can be used without any framework
- **Responsive Design**: Mobile-friendly interface

## Installation

1. Copy all files to your web server
2. Ensure PHP is installed and configured (with ZipArchive extension for download all feature)
3. Set proper permissions:
   ```bash
   chmod 755 /var/www/html/file_uploader
   chmod 755 /var/www/html/file_uploader/uploads
   chmod 644 /var/www/html/file_uploader/*.php
   chmod 644 /var/www/html/file_uploader/*.js
   chmod 644 /var/www/html/file_uploader/*.css
   ```
4. Ensure web server can write to uploads directory:
   ```bash
   chown www-data:www-data /var/www/html/file_uploader/uploads
   # or
   chmod 777 /var/www/html/file_uploader/uploads  # Less secure, for testing only
   ```

## Quick Start

### Standalone Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="media-hub.css" />
  </head>
  <body>
    <div id="myUploader"></div>

    <script src="media-hub.js"></script>
    <script>
      const uploader = new FileUploader("#myUploader");
    </script>
  </body>
</html>
```

### With Bootstrap 5

```html
<!DOCTYPE html>
<html>
  <head>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="media-hub.css" />
  </head>
  <body>
    <div class="container">
      <form>
        <div class="mb-3">
          <label class="form-label">Upload Files</label>
          <div id="fileUploader"></div>
        </div>
      </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="media-hub.js"></script>
    <script>
      const uploader = new FileUploader("#fileUploader", {
        multiple: true,
      });
    </script>
  </body>
</html>
```

## Configuration

### PHP Configuration (`config.php`)

```php
return [
    'upload_dir' => __DIR__ . '/uploads/',
    'allowed_types' => ['image/jpeg', 'image/png', ...],
    'allowed_extensions' => ['jpg', 'png', 'pdf', ...],
    'max_file_size' => 10 * 1024 * 1024, // 10MB
    'unique_filenames' => true,
];
```

### JavaScript Options

```javascript
const uploader = new FileUploader("#element", {
  // Upload endpoints
  uploadUrl: "upload.php",
  deleteUrl: "delete.php",
  configUrl: "get-config.php",

  // File restrictions
  allowedExtensions: ["jpg", "png", "pdf"],
  maxFileSize: 10 * 1024 * 1024,
  maxFileSizeDisplay: "10MB",

  // File type detection
  imageExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
  videoExtensions: ["mp4", "mpeg", "mov", "avi", "webm"],

  // Upload settings
  multiple: true,
  autoFetchConfig: true, // Fetch config from server

  // Pre-load existing files (for edit forms)
  existingFiles: [
    { name: "photo.jpg", url: "/uploads/photo.jpg", meta: { dbId: 123 } }
  ],

  // Callbacks
  onUploadStart: (fileObj) => {},
  onUploadSuccess: (fileObj, result) => {},
  onUploadError: (fileObj, error) => {},
  onDeleteSuccess: (fileObj, result) => {},
  onDeleteError: (fileObj, error) => {},
});
```

## API Methods

### getFiles()

Returns all files (uploaded and uploading).

```javascript
const allFiles = uploader.getFiles();
```

### getUploadedFiles()

Returns only successfully uploaded files with full details.

```javascript
const uploadedFiles = uploader.getUploadedFiles();
```

### getUploadedFileNames()

**For form submission:** Returns array of server filenames only - perfect for storing in database.

```javascript
const fileNames = uploader.getUploadedFileNames();
// Returns: ['abc123_1234567890.jpg', 'def456_0987654321.pdf']

// Use in form submission
const formData = {
  name: "John Doe",
  email: "john@example.com",
  attachments: uploader.getUploadedFileNames(),
};
```

### getUploadedFilesData()

Returns detailed data about uploaded files for form submission.

```javascript
const filesData = uploader.getUploadedFilesData();
// Returns: [
//   {
//     originalName: 'resume.pdf',
//     serverFilename: 'abc123_1234567890.pdf',
//     size: 54321,
//     type: 'application/pdf',
//     extension: 'pdf',
//     url: 'uploads/abc123_1234567890.pdf',
//     isExisting: false
//   }
// ]
```

### loadExistingFiles(files)

Load pre-uploaded/existing files into the uploader. Use this when editing a record to display files that are already stored on the server.

```javascript
uploader.loadExistingFiles([
  {
    name: "photo.jpg",                        // Required: Original filename
    url: "/uploads/2024/photo_abc123.jpg",    // Required: URL to the file
    size: 1024000,                            // Optional: File size in bytes
    type: "image/jpeg",                       // Optional: MIME type (guessed from extension if not provided)
    serverFilename: "photo_abc123.jpg",       // Optional: Server-side filename
    meta: { dbId: 101 }                       // Optional: Custom data (returned in getFilesSummary)
  },
  {
    name: "document.pdf",
    url: "/uploads/2024/doc_xyz789.pdf",
    size: 2048000,
    serverFilename: "doc_xyz789.pdf",
    meta: { dbId: 102, category: "invoice" }
  },
  {
    name: "video.mp4",
    url: "/uploads/2024/video_def456.mp4",
    thumbnailUrl: "/uploads/2024/video_thumb.jpg",  // Optional: Thumbnail for videos
    duration: 120,                                   // Optional: Duration in seconds
    size: 5000000,
    meta: { dbId: 103 }
  }
]);
```

**Data Structure for Existing Files:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Original filename |
| `url` | string | Yes | URL to the file (for preview and download) |
| `size` | number | No | File size in bytes |
| `type` | string | No | MIME type (auto-guessed from extension if not provided) |
| `serverFilename` | string | No | Server-side filename (defaults to `name`) |
| `id` | string | No | Unique ID (auto-generated if not provided) |
| `thumbnailUrl` | string | No | Thumbnail URL for video files |
| `duration` | number | No | Duration in seconds for audio/video files |
| `serverData` | object | No | Additional server data to store |
| `meta` | object | No | Custom metadata (e.g., database ID) - returned in `getFilesSummary()` |

### getNewFiles()

Returns only newly uploaded files (excluding pre-existing files loaded via `loadExistingFiles`).

```javascript
const newFiles = uploader.getNewFiles();
```

### getExistingFiles()

Returns only pre-existing files that were loaded via `loadExistingFiles`.

```javascript
const existingFiles = uploader.getExistingFiles();
```

### getFilesSummary()

Returns a structured summary for form submission with clear separation between new, existing, and deleted files.

```javascript
const summary = uploader.getFilesSummary();
// Returns:
// {
//   newFiles: [
//     { originalName: 'new_photo.jpg', serverFilename: 'abc123.jpg', size: 1024, ... }
//   ],
//   existingFiles: [
//     { originalName: 'old_photo.jpg', serverFilename: 'xyz789.jpg', size: 2048, meta: { dbId: 101 }, ... }
//   ],
//   deletedExistingFiles: [
//     { id: '...', name: 'removed.pdf', serverFilename: 'removed_123.pdf', url: '/uploads/...', meta: { dbId: 102 } }
//   ]
// }
```

**Use Case - Edit Form:**

```javascript
// 1. Initialize uploader
const uploader = new FileUploader('#uploader');

// 2. Load existing files from your database/API
const existingFiles = await fetch('/api/record/123/files').then(r => r.json());
uploader.loadExistingFiles(existingFiles);

// 3. User can now:
//    - View existing files
//    - Delete existing files (tracked in deletedExistingFiles)
//    - Upload new files

// 4. On form submit, get the summary
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  uploader.disableCleanup(); // Prevent auto-cleanup

  const filesSummary = uploader.getFilesSummary();

  await fetch('/api/record/123/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // Your form data...
      files: filesSummary
    })
  });
});
```

### clear()

Removes all files and deletes them from the server.

```javascript
uploader.clear();
```

### destroy()

Removes the uploader from the DOM.

```javascript
uploader.destroy();
```

### disableCleanup()

Disables automatic file cleanup on page unload and destroy. **Call this before form submission** to prevent uploaded files from being deleted when the page navigates away.

```javascript
// Before submitting form
document.querySelector('form').addEventListener('submit', function(e) {
  uploader.disableCleanup();
});
```

### enableCleanup()

Re-enables automatic file cleanup on page unload and destroy.

```javascript
uploader.enableCleanup();
```

### setBehavior(optionName, value)

Set a behavior option at runtime. Useful for dynamically changing uploader behavior.

```javascript
// Disable specific cleanup options
uploader.setBehavior('cleanupOnUnload', false);
uploader.setBehavior('cleanupOnDestroy', false);

// Enable/disable other behavior options
uploader.setBehavior('preventDuplicates', true);
uploader.setBehavior('multiple', false);
```

**Available behavior options:**
- `multiple` - Allow multiple file uploads
- `autoUpload` - Automatically upload files when added
- `autoFetchConfig` - Fetch config from server on init
- `preventDuplicates` - Prevent duplicate file uploads
- `duplicateCheckBy` - How to check duplicates: "name", "size", or "name-size"
- `cleanupOnUnload` - Delete files when page unloads
- `cleanupOnDestroy` - Delete files when uploader is destroyed

### getBehavior(optionName)

Get the current value of a behavior option.

```javascript
const allowsMultiple = uploader.getBehavior('multiple');
const preventsDuplicates = uploader.getBehavior('preventDuplicates');
```

### setTheme(theme)

Set the uploader theme.

```javascript
uploader.setTheme('dark');  // 'auto', 'light', or 'dark'
```

### getTheme()

Get the current theme.

```javascript
const currentTheme = uploader.getTheme();
```

## Build System

MediaHub uses Gulp for building and bundling. See the **[Gulp Build Guide](GULP_BUILD_GUIDE.html)** for detailed information about the build system, available tasks, and bundle outputs.

**Quick reference:**
- Development: `npm run dev`
- Production: `npm run prod`
- With ConfigBuilder: `npm run with-config-builder`
- Full documentation: [GULP_BUILD_GUIDE.html](GULP_BUILD_GUIDE.html)

## File Structure

```
media_hub/
├── config.php              # Shared configuration
├── upload.php              # Upload handler
├── delete.php              # Delete handler
├── get-config.php          # Config API endpoint
├── dist/js/media-hub.js    # JavaScript bundle
├── dist/css/media-hub.css  # Styles bundle
├── index.php               # Main landing page
├── projects/               # Component projects
│   ├── file-uploader/      # FileUploader component
│   ├── file-carousel/      # FileCarousel component
│   ├── media-capture/      # MediaCapture component
│   └── utils/              # Utility components
├── uploads/                # Upload directory (auto-created)
└── README.md               # This file
```

## Security Features

- File type validation (MIME type + extension)
- File size validation
- Filename sanitization
- Directory traversal prevention
- Server-side validation matches client-side

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Customization

### Custom Styling

You can override the default styles by adding your own CSS:

```css
.media-hub-dropzone {
  border-color: #your-color;
  background-color: #your-bg;
}
```

### Custom Error Handling

```javascript
const uploader = new FileUploader("#element", {
  onUploadError: (fileObj, error) => {
    // Custom error handling
    alert(`Failed to upload ${fileObj.name}: ${error.message}`);
  },
});
```

## PHP Requirements

- PHP 7.0 or higher
- `fileinfo` extension enabled
- Write permissions on upload directory

## License

Free to use for personal and commercial projects.

## Demo

Open `index.php` in your browser to see the standalone demo, or check out the Bootstrap demos for framework integration examples.

---

## Gulp Build Guide

MediaHub uses Gulp 4 with Rollup for building JavaScript modules and Sass for stylesheets. The build system supports both development and production modes with separate bundles for core components and optional features.

### Build Architecture

The project is structured to generate multiple bundles:

**Core Bundles (Always Built):**
- `media-hub.js` / `media-hub.iife.js` - Main library (FileUploader, FileCarousel, MediaCapture)
- `media-hub.css` - Core component styles
- `main.js` / `main.iife.js` - Demo application scripts
- `main.css` - Demo application styles
- `bootstrap_*.js` / `bootstrap_*.iife.js` - Bootstrap integration scripts (versions 3, 4, 5)

**Optional Bundles (Built with `with-config-builder` task):**
- `config-builder.js` / `config-builder.iife.js` - ConfigBuilder component
- `config-builder.css` - ConfigBuilder styles

### Available Build Tasks

#### Development Build (Default)

```bash
npm run dev
# or
gulp dev
```

**What it does:**
- Builds core bundles (media-hub, main, bootstrap integrations)
- Excludes ConfigBuilder to reduce build time
- Generates source maps for debugging
- Watches files for changes and rebuilds automatically
- No minification or obfuscation

**Output Size (approximate):**
- `media-hub.js`: ~454KB (unminified)
- `media-hub.css`: ~130KB (unminified)

#### Production Build

```bash
npm run prod
# or
NODE_ENV=production gulp prod
```

**What it does:**
- Builds core bundles only (no ConfigBuilder)
- Minifies JavaScript using uglify-es
- Obfuscates JavaScript code
- Minifies CSS using clean-css
- Generates file hashes for cache busting (e.g., `media-hub-abc123.js`)
- Creates manifest files mapping original to hashed filenames
- No source maps or watch mode

**Output Size (approximate):**
- `media-hub-[hash].js`: ~210KB (minified + obfuscated)
- `media-hub-[hash].css`: ~60KB (minified)

#### Development Build with ConfigBuilder

```bash
npm run with-config-builder
# or
gulp with-config-builder
```

**What it does:**
- Builds all core bundles PLUS ConfigBuilder bundles
- Generates source maps
- Watches files for changes
- Includes ConfigBuilder-specific file watchers
- No minification or obfuscation

**Output Size (approximate):**
- `media-hub.js`: ~454KB
- `media-hub.css`: ~130KB
- `config-builder.js`: ~870KB (ConfigBuilder is feature-rich)
- `config-builder.css`: ~108KB

#### Production Build with ConfigBuilder

```bash
npm run with-config-builder:prod
# or
NODE_ENV=production gulp with-config-builder
```

**What it does:**
- Builds all bundles including ConfigBuilder
- Full minification and obfuscation
- File hashing for cache busting
- Creates comprehensive manifest files

**Output Size (approximate):**
- `media-hub-[hash].js`: ~210KB (minified)
- `media-hub-[hash].css`: ~60KB (minified)
- `config-builder-[hash].js`: ~400KB (minified + obfuscated)
- `config-builder-[hash].css`: ~50KB (minified)

#### Clean Task

```bash
npm run clean
# or
gulp clean
```

Removes all generated files from the `dist/` directory.

### Bundle Formats

All JavaScript bundles are generated in two formats:

1. **ESM (ES Modules)** - `filename.js`
   - Modern module format using `import/export`
   - Used by modern browsers with `<script type="module">`
   - Tree-shakeable and optimized

2. **IIFE (Immediately Invoked Function Expression)** - `filename.iife.js`
   - Classic script format for older browsers
   - Used with `<script nomodule>`
   - Exposes globals: `window.FileUploader`, `window.FileCarousel`, etc.

### HTML Integration

#### Using Core Library Only

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/css/media-hub-abc123.css">
</head>
<body>
  <div id="uploader"></div>

  <!-- Modern browsers -->
  <script type="module" src="dist/js/media-hub-abc123.js"></script>

  <!-- Fallback for older browsers -->
  <script nomodule src="dist/js/media-hub-abc123.iife.js"></script>

  <script type="module">
    import { FileUploader } from './dist/js/media-hub-abc123.js';
    const uploader = new FileUploader('#uploader');
  </script>

  <script nomodule>
    // For older browsers using IIFE
    const uploader = new FileUploader('#uploader');
  </script>
</body>
</html>
```

#### Using ConfigBuilder

When you need the ConfigBuilder component, include both bundles:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Core styles -->
  <link rel="stylesheet" href="dist/css/media-hub-abc123.css">

  <!-- ConfigBuilder styles -->
  <link rel="stylesheet" href="dist/css/config-builder-def456.css">
</head>
<body>
  <div id="config-builder"></div>

  <!-- Core library -->
  <script type="module" src="dist/js/media-hub-abc123.js"></script>
  <script nomodule src="dist/js/media-hub-abc123.iife.js"></script>

  <!-- ConfigBuilder -->
  <script type="module" src="dist/js/config-builder-def456.js"></script>
  <script nomodule src="dist/js/config-builder-def456.iife.js"></script>

  <script type="module">
    import ConfigBuilder from './dist/js/config-builder-def456.js';
    const builder = new ConfigBuilder('#config-builder');
  </script>

  <script nomodule>
    // For older browsers using IIFE
    const builder = new ConfigBuilder('#config-builder');
  </script>
</body>
</html>
```

### Manifest Files

In production builds, the build system generates manifest JSON files that map original filenames to their hashed versions:

**Location:** `dist/manifests/`

**Files:**
- `css-manifest.json` - CSS file mappings
- `js-manifest.json` - JavaScript file mappings

**Example manifest:**
```json
{
  "media-hub.css": "media-hub-abc123.css",
  "media-hub.js": "media-hub-abc123.js",
  "config-builder.css": "config-builder-def456.css",
  "config-builder.js": "config-builder-def456.js"
}
```

**Usage in PHP:**
```php
<?php
$manifest = json_decode(file_get_contents('dist/manifests/js-manifest.json'), true);
$mediaHubJs = $manifest['media-hub.js'] ?? 'media-hub.js';
?>
<script type="module" src="dist/js/<?= $mediaHubJs ?>"></script>
```

### Build Configuration

The build system is configured in [Gulpfile.js](Gulpfile.js). Key configuration:

**Source Directories:**
- Library JS: `src/library/js/`
- Library SCSS: `src/library/scss/`
- Assets JS: `src/assets/js/`
- Assets SCSS: `src/assets/scss/`

**Output Directory:** `dist/`
- JavaScript: `dist/js/`
- CSS: `dist/css/`
- Manifests: `dist/manifests/`

**Entry Points:**
- Core library: `src/library/js/index.js` → `media-hub.js`
- ConfigBuilder: `src/library/js/config-builder.js` → `config-builder.js`
- Core styles: `src/library/scss/index.scss` → `media-hub.css`
- ConfigBuilder styles: `src/library/scss/config-builder.scss` → `config-builder.css`

### Why Separate ConfigBuilder?

ConfigBuilder is an optional development tool that:
- Generates configuration code for FileUploader
- Provides a visual interface for setting options
- Is primarily used by developers, not end-users
- Adds ~870KB to the bundle size

By separating it into its own bundle:
- **50% smaller default bundle**: Main library is ~454KB vs ~905KB
- **Faster development**: Regular builds complete faster without ConfigBuilder
- **Selective loading**: Only include ConfigBuilder when needed
- **Better caching**: Users only download ConfigBuilder once
- **Cleaner separation**: Core functionality vs development tools

### File Watching

In development mode (`npm run dev` or `npm run with-config-builder`), the build system watches for file changes:

**When ConfigBuilder is excluded (`npm run dev`):**
- Watches: `src/library/js/**/*.js` (excluding ConfigBuilder files)
- Watches: `src/library/scss/**/*.scss` (excluding ConfigBuilder styles)
- Watches: `src/assets/**/*.{js,scss}`

**When ConfigBuilder is included (`npm run with-config-builder`):**
- Watches: `src/library/js/**/*.js` (including ConfigBuilder files)
- Watches: `src/library/scss/**/*.scss` (including ConfigBuilder styles)
- Watches: `src/assets/**/*.{js,scss}`

### Build Tools

The build system uses:
- **Gulp 4**: Task automation with async/await support
- **Rollup**: JavaScript module bundler with tree-shaking
- **Babel**: Transpiles modern JavaScript to ES5 for older browsers
- **Sass/SCSS**: CSS preprocessor with `@use` modules
- **PostCSS**: CSS transformations and autoprefixer
- **uglify-es**: JavaScript minification
- **javascript-obfuscator**: Code obfuscation for production
- **clean-css**: CSS minification
- **gulp-rev**: File hashing for cache busting

### Performance Comparison

| Build Mode | media-hub.js | config-builder.js | Total JS | Build Time |
|------------|-------------|-------------------|----------|------------|
| Dev (core only) | 454KB | - | 454KB | ~8s |
| Dev (with ConfigBuilder) | 454KB | 870KB | 1,324KB | ~12s |
| Prod (core only) | 210KB | - | 210KB | ~15s |
| Prod (with ConfigBuilder) | 210KB | 400KB | 610KB | ~20s |

### Troubleshooting

**Build fails with SCSS errors:**
- Ensure you're using `@use` instead of `@import` for Sass modules
- Check for duplicate variable definitions across modules

**JavaScript bundle is too large:**
- Use `npm run prod` to enable minification and obfuscation
- Exclude ConfigBuilder unless needed: `npm run dev` instead of `npm run with-config-builder`

**File changes not being detected:**
- Ensure you're running in watch mode: `npm run dev` or `npm run with-config-builder`
- Check that the file is not in an excluded pattern
- Restart the watch task if needed

**Manifest files not generated:**
- Manifests are only created in production builds (`npm run prod` or `npm run with-config-builder:prod`)
- Check `dist/manifests/` directory after production build

### Development Workflow

**Regular feature development (no ConfigBuilder needed):**
```bash
npm run dev
# Edit files in src/
# Changes automatically rebuild
```

**Working on ConfigBuilder or using it:**
```bash
npm run with-config-builder
# Edit files including ConfigBuilder
# Changes automatically rebuild
```

**Preparing for deployment:**
```bash
npm run prod
# Or with ConfigBuilder if needed:
npm run with-config-builder:prod
# Upload dist/ directory to server
```

### CI/CD Integration

For automated builds in CI/CD pipelines:

```bash
# Install dependencies
npm install

# Production build (core only)
npm run prod

# Or with ConfigBuilder
npm run with-config-builder:prod

# Outputs will be in dist/ directory
```
