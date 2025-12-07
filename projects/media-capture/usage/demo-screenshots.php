<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screenshot Capture - MediaCapture</title>
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
            margin-bottom: 8px;
        }

        .demo-section > p {
            color: #718096;
            margin-bottom: 20px;
        }

        .capture-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
        }

        .capture-btn {
            padding: 20px;
            border: none;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            color: white;
        }

        .capture-btn svg {
            width: 32px;
            height: 32px;
        }

        .capture-btn.screen {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        }

        .capture-btn.region {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .capture-btn.fullpage {
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .capture-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .capture-btn span {
            font-size: 12px;
            opacity: 0.9;
            font-weight: 400;
        }

        .result-area {
            margin-top: 24px;
            text-align: center;
        }

        .result-area img {
            max-width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .result-info {
            margin-top: 12px;
            font-size: 13px;
            color: #64748b;
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
            background: rgba(59, 130, 246, 0.9);
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

        body.dark-theme .demo-section {
            background: #1e293b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .demo-section h2 {
            color: #f1f5f9;
        }

        body.dark-theme .demo-section > p {
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
                    <h1>Screenshot Capture</h1>
                    <p>Capture full screen, selected regions, or entire scrollable pages</p>
                </div>

                <div class="demo-section">
                    <h2>Capture Methods</h2>
                    <p>Click a button to try different capture methods:</p>

                    <div class="capture-buttons">
                        <button class="capture-btn screen" onclick="captureScreen()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="3" width="20" height="14" rx="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                            Screen Capture
                            <span>Select any screen or window</span>
                        </button>

                        <button class="capture-btn region" onclick="captureRegion()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                            </svg>
                            Region Capture
                            <span>Select a specific area</span>
                        </button>

                        <button class="capture-btn fullpage" onclick="captureFullPage()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <line x1="10" y1="9" x2="8" y2="9"/>
                            </svg>
                            Full Page
                            <span>Capture entire scrollable page</span>
                        </button>
                    </div>

                    <div class="result-area" id="resultArea"></div>
                </div>
            </div>
        </main>
    </div>

    <script src="<?php echo asset('media-hub.js', 'nomodule'); ?>"></script>
    <script type="module">
        import { MediaCapture } from '<?php echo asset('media-hub.js'); ?>';

        let mediaCapture = null;

        function initCapture() {
            mediaCapture = new MediaCapture({
                showRecordingUI: true,
                onCapture: (file, type) => {
                    showResult(file, type);
                },
                onError: (error, context) => {
                    console.error('Capture error:', error, context);
                }
            });
        }

        function showResult(file, type) {
            const resultArea = document.getElementById('resultArea');
            const url = URL.createObjectURL(file);

            resultArea.innerHTML = `
                <img src="${url}" alt="Screenshot">
                <div class="result-info">
                    <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB) - ${type} capture
                </div>
            `;
        }

        window.captureScreen = async function() {
            initCapture();
            try {
                await mediaCapture.captureScreen();
            } catch (e) {
                if (e.name !== 'AbortError') {
                    console.error('Screen capture failed:', e);
                }
            }
        };

        window.captureRegion = async function() {
            initCapture();
            try {
                await mediaCapture.captureRegion();
            } catch (e) {
                if (e.name !== 'AbortError') {
                    console.error('Region capture failed:', e);
                }
            }
        };

        window.captureFullPage = async function() {
            initCapture();
            try {
                await mediaCapture.captureFullPage();
            } catch (e) {
                console.error('Full page capture failed:', e);
            }
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
