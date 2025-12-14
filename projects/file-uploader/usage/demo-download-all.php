<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download All Demo - File Uploader</title>
    <link rel="stylesheet" href="<?php echo asset('media-hub.css'); ?>" />
    <link rel="icon" type="image/svg+xml" href="../../../src/assets/images/download.svg">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
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
            border-left: 4px solid #319795;
        }
        .info-box.warning {
            border-left-color: #f39c12;
            background: #fef5e7;
        }
        .info-box h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .info-box p {
            margin: 8px 0;
            font-size: 14px;
        }
        .info-box ul {
            margin: 0;
            padding-left: 20px;
        }
        .info-box li {
            margin: 6px 0;
            font-size: 14px;
        }
        .demo-section {
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 24px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 24px;
        }
        .feature-card {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
        }
        .feature-card h3 {
            font-size: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .feature-card p {
            font-size: 14px;
            color: #4a5568;
            line-height: 1.5;
        }
        .feature-card svg {
            width: 24px;
            height: 24px;
            color: #4299e1;
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
            background: rgba(49, 151, 149, 0.9);
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

        body.dark-theme .info-box p,
        body.dark-theme .info-box li {
            color: #cbd5e1;
        }

        body.dark-theme .demo-section {
            background: #1e293b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .feature-card {
            background: #0f172a;
            border-color: #334155;
        }

        body.dark-theme .feature-card h3 {
            color: #f1f5f9;
        }

        body.dark-theme .feature-card p {
            color: #94a3b8;
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
                    <h1>Download All Feature</h1>
                    <p>Smart downloading: single file or ZIP archive for multiple files</p>
                </div>

                <div class="info-box">
                    <h3>How It Works:</h3>
                    <p><strong>Single File:</strong> Downloads directly with original filename</p>
                    <p><strong>Multiple Files:</strong> Automatically creates a ZIP archive and downloads it</p>
                    <p><strong>Smart Cleanup:</strong> Temporary ZIP files are automatically deleted after download</p>
                </div>

                <div class="demo-section">
                    <div id="fileUploader"></div>

                    <div class="feature-grid">
                        <div class="feature-card">
                            <h3>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Individual Downloads
                            </h3>
                            <p>Each file has its own download button that downloads with the original filename.</p>
                        </div>

                        <div class="feature-card">
                            <h3>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="9" y1="9" x2="15" y2="9"></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                </svg>
                                Bulk Download
                            </h3>
                            <p>Click "Download All" to get all files at once. Multiple files are automatically zipped.</p>
                        </div>

                        <div class="feature-card">
                            <h3>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                                Auto Cleanup
                            </h3>
                            <p>Temporary ZIP files are automatically deleted after download to save server space.</p>
                        </div>
                    </div>
                </div>

                <div class="info-box warning">
                    <h3>Test Scenarios:</h3>
                    <ul>
                        <li>Upload 1 file → Click "Download All" → Downloads the single file directly</li>
                        <li>Upload 3-5 files → Click "Download All" → Creates and downloads a ZIP</li>
                        <li>Click individual download buttons → Each file downloads separately</li>
                        <li>Upload files, download all, then delete some → Button updates in real-time</li>
                    </ul>
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
                multiple: true
            },
            limitsDisplay: {
                showLimits: true,
                defaultLimitsView: 'concise'
            },
            callbacks: {
                onUploadSuccess: (fileObj, result) => {
                    console.log('✅ Uploaded:', fileObj.name);
                }
            }
        });

        console.log('%cDownload All Demo Active', 'color: #319795; font-weight: bold; font-size: 14px;');

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
