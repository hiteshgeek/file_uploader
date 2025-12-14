<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Standalone Demo - File Uploader</title>
    <link rel="stylesheet" href="<?php echo asset('media-hub.css'); ?>" />
    <link rel="icon" type="image/svg+xml" href="../../../src/assets/images/download.svg">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background: #f7fafc;
            color: #2d3748;
        }

        .demo-main {
            padding: 40px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .demo-header {
            margin-bottom: 30px;
        }

        .demo-header h1 {
            font-size: 28px;
            font-weight: 700;
            color: #1a202c;
            margin-bottom: 8px;
        }

        .demo-header p {
            color: #718096;
            font-size: 16px;
        }

        .info-box {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border-left: 4px solid #4299e1;
        }

        .info-box h3 {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
        }

        .info-box ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 8px;
        }

        .info-box li {
            color: #4a5568;
            font-size: 14px;
            padding-left: 20px;
            position: relative;
        }

        .info-box li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #48bb78;
            font-weight: bold;
        }

        .demo-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }

        .demo-section h2 {
            font-size: 20px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 20px;
        }

        .button-group {
            display: flex;
            gap: 12px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-primary {
            background: #4299e1;
            color: white;
        }

        .btn-primary:hover {
            background: #3182ce;
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }

        .btn-secondary:hover {
            background: #cbd5e0;
        }

        #fileInfo {
            margin-top: 20px;
            padding: 15px;
            background: #f7fafc;
            border-radius: 6px;
            font-family: monospace;
            font-size: 13px;
            white-space: pre-wrap;
            display: none;
        }

        #fileInfo.show {
            display: block;
        }

        @media (max-width: 992px) {
            .demo-main {
                padding: 20px;
                padding-top: 70px;
            }
        }

        /* Theme Switcher */
        .theme-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px;
            background: rgba(66, 153, 225, 0.9);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            z-index: 1000;
        }

        .theme-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border: none;
            border-radius: 6px;
            background: transparent;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .theme-btn svg {
            width: 18px;
            height: 18px;
            stroke: currentColor;
            fill: none;
            stroke-width: 2;
        }

        .theme-btn:hover {
            background: rgba(255, 255, 255, 0.15);
            color: white;
        }

        .theme-btn.active {
            background: rgba(255, 255, 255, 0.25);
            color: white;
        }

        /* Dark theme styles */
        body.dark-theme {
            background: #0f172a;
            color: #e2e8f0;
        }

        body.dark-theme .demo-header h1 {
            color: #f1f5f9;
        }

        body.dark-theme .demo-header p {
            color: #94a3b8;
        }

        body.dark-theme .info-box {
            background: #1e293b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .info-box h3 {
            color: #f1f5f9;
        }

        body.dark-theme .info-box li {
            color: #cbd5e1;
        }

        body.dark-theme .demo-section {
            background: #1e293b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .demo-section h2 {
            color: #f1f5f9;
        }

        body.dark-theme #fileInfo {
            background: #0f172a;
            color: #cbd5e1;
        }
    </style>
</head>
<body>
    <!-- Theme Switcher -->
    <div class="theme-switcher" id="theme-switcher">
        <button class="theme-btn active" data-theme="light" title="Light Mode">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <button class="theme-btn" data-theme="dark" title="Dark Mode">
            <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button class="theme-btn" data-theme="system" title="System Default">
            <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </button>
    </div>
    <div class="demo-layout">
        <?php include __DIR__ . '/sidebar.php'; ?>

        <main class="demo-content">
            <div class="demo-main">
                <div class="demo-header">
                    <h1>Standalone Demo</h1>
                    <p>Basic standalone implementation with drag & drop, preview, and AJAX upload</p>
                </div>

                <div class="info-box">
                    <h3>Features Demonstrated:</h3>
                    <ul>
                        <li>Drag & drop file upload</li>
                        <li>File type validation</li>
                        <li>Image and video preview</li>
                        <li>Instant AJAX upload</li>
                        <li>Download individual files</li>
                        <li>Download all as ZIP</li>
                        <li>Delete uploaded files</li>
                        <li>Real-time limits display</li>
                    </ul>
                </div>

                <div class="demo-section">
                    <h2>Upload Files</h2>
                    <div id="fileUploader"></div>

                    <div class="button-group">
                        <button class="btn btn-primary" onclick="getUploadedFiles()">Get Uploaded Files</button>
                        <button class="btn btn-secondary" onclick="getAllFiles()">Get All Files</button>
                    </div>

                    <div id="fileInfo"></div>
                </div>
            </div>
        </main>
    </div>

    <script type="module" src="<?= asset('media-hub.js') ?>"></script>
    <script nomodule src="<?= asset('media-hub.js', 'nomodule') ?>"></script>

    <script type="module">
        import { FileUploader } from '<?= asset('media-hub.js') ?>';

        const uploader = new FileUploader('#fileUploader', {
            urls: {
                uploadUrl: '../../../api/upload.php',
                deleteUrl: '../../../api/delete.php',
                downloadAllUrl: '../../../api/download-all.php',
                cleanupZipUrl: '../../../api/cleanup-zip.php',
                configUrl: '../../../api/get-config.php'
            },
            behavior: {
                multiple: true,
                confirmBeforeDelete: false
            },
            limitsDisplay: {
                showLimits: true,
                defaultLimitsView: 'concise',
                allowLimitsViewToggle: true
            },
            callbacks: {
                onUploadSuccess: (fileObj, result) => {
                    console.log('✅ Uploaded:', fileObj.name);
                },
                onUploadError: (fileObj, error) => {
                    console.error('❌ Upload failed:', fileObj.name, error);
                }
            }
        });

        window.uploader = uploader;

        window.getUploadedFiles = function() {
            const files = uploader.getUploadedFiles();
            const info = document.getElementById('fileInfo');
            info.classList.add('show');
            info.textContent = 'Uploaded Files:\n' + JSON.stringify(files, null, 2);
        };

        window.getAllFiles = function() {
            const files = uploader.getFiles();
            const info = document.getElementById('fileInfo');
            info.classList.add('show');
            info.textContent = 'All Files:\n' + JSON.stringify(files, null, 2);
        };

        // Theme Switcher
        const themeSwitcher = document.getElementById('theme-switcher');
        let currentTheme = localStorage.getItem('demo-theme') || 'light';

        function applyTheme(theme) {
            currentTheme = theme;
            localStorage.setItem('demo-theme', theme);

            themeSwitcher.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === theme);
            });

            let effectiveTheme = theme;
            if (theme === 'system') {
                effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            document.body.classList.toggle('dark-theme', effectiveTheme === 'dark');
        }

        themeSwitcher.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
        });

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentTheme === 'system') applyTheme('system');
        });

        applyTheme(currentTheme);
    </script>
</body>
</html>
