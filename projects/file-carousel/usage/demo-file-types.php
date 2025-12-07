<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Type Support - FileCarousel</title>
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

        .type-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 16px;
        }

        .type-card {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .type-card:hover {
            border-color: #11998e;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(17, 153, 142, 0.15);
        }

        .type-card svg {
            width: 48px;
            height: 48px;
            margin-bottom: 12px;
        }

        .type-card h3 {
            font-size: 14px;
            font-weight: 600;
            color: #1a202c;
            margin-bottom: 4px;
        }

        .type-card p {
            font-size: 12px;
            color: #64748b;
        }

        .type-card.image svg { stroke: #3b82f6; }
        .type-card.video svg { stroke: #ef4444; }
        .type-card.audio svg { stroke: #8b5cf6; }
        .type-card.pdf svg { stroke: #dc2626; }
        .type-card.excel svg { stroke: #16a34a; }
        .type-card.csv svg { stroke: #0891b2; }
        .type-card.text svg { stroke: #64748b; }

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
            background: rgba(17, 153, 142, 0.9);
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

        body.dark-theme .type-card {
            background: #0f172a;
            border-color: #334155;
        }

        body.dark-theme .type-card:hover {
            border-color: #11998e;
        }

        body.dark-theme .type-card h3 {
            color: #f1f5f9;
        }

        body.dark-theme .type-card p {
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
                    <h1>File Type Support</h1>
                    <p>FileCarousel supports a wide variety of file types with custom renderers</p>
                </div>

                <div class="demo-section">
                    <h2>Supported File Types</h2>
                    <p>Click on any file type to see how it renders in the carousel:</p>

                    <div class="type-grid">
                        <div class="type-card image" onclick="openType('image')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <path d="M21 15l-5-5L5 21"/>
                            </svg>
                            <h3>Images</h3>
                            <p>JPG, PNG, GIF, WebP</p>
                        </div>

                        <div class="type-card video" onclick="openType('video')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="2" width="20" height="20" rx="2"/>
                                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
                            </svg>
                            <h3>Videos</h3>
                            <p>MP4, WebM, OGG</p>
                        </div>

                        <div class="type-card audio" onclick="openType('audio')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 18V5l12-2v13"/>
                                <circle cx="6" cy="18" r="3"/>
                                <circle cx="18" cy="16" r="3"/>
                            </svg>
                            <h3>Audio</h3>
                            <p>MP3, WAV, OGG</p>
                        </div>

                        <div class="type-card pdf" onclick="openType('pdf')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6"/>
                                <path d="M10 9h4M10 13h4M10 17h4"/>
                            </svg>
                            <h3>PDF</h3>
                            <p>PDF Documents</p>
                        </div>

                        <div class="type-card excel" onclick="openType('excel')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6"/>
                                <path d="M8 13h8M8 17h8M8 9h2"/>
                            </svg>
                            <h3>Excel</h3>
                            <p>XLS, XLSX</p>
                        </div>

                        <div class="type-card csv" onclick="openType('csv')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6"/>
                                <line x1="8" y1="13" x2="16" y2="13"/>
                                <line x1="8" y1="17" x2="16" y2="17"/>
                            </svg>
                            <h3>CSV</h3>
                            <p>Comma-Separated</p>
                        </div>

                        <div class="type-card text" onclick="openType('text')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <path d="M14 2v6h6"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <line x1="10" y1="9" x2="8" y2="9"/>
                            </svg>
                            <h3>Text</h3>
                            <p>TXT, JSON, XML</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="<?php echo asset('media-hub.js', 'nomodule'); ?>"></script>
    <script type="module">
        import { FileCarousel } from '<?php echo asset('media-hub.js'); ?>';

        const filesByType = {
            image: [
                { name: 'Mountain.jpg', url: 'https://picsum.photos/800/600?random=1', type: 'image', mime: 'image/jpeg' },
                { name: 'Ocean.jpg', url: 'https://picsum.photos/900/700?random=2', type: 'image', mime: 'image/jpeg' },
                { name: 'Forest.png', url: 'https://picsum.photos/1000/600?random=3', type: 'image', mime: 'image/png' },
            ],
            video: [
                { name: 'Sample Video.mp4', url: 'https://www.w3schools.com/html/mov_bbb.mp4', type: 'video', mime: 'video/mp4' },
            ],
            audio: [
                { name: 'Audio file support', url: '#', type: 'audio', mime: 'audio/mpeg', note: 'Audio files play in a custom player' },
            ],
            pdf: [
                { name: 'PDF Document', url: '#', type: 'pdf', mime: 'application/pdf', note: 'PDF files are embedded or shown as download' },
            ],
            excel: [
                { name: 'Spreadsheet.xlsx', url: '#', type: 'excel', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', note: 'Excel files render as tables' },
            ],
            csv: [
                { name: 'Data.csv', url: '#', type: 'csv', mime: 'text/csv', note: 'CSV files render as tables' },
            ],
            text: [
                { name: 'README.txt', url: '#', type: 'text', mime: 'text/plain', note: 'Text files render with syntax highlighting' },
            ],
        };

        let carousel = null;

        window.openType = function(type) {
            const files = filesByType[type];

            if (files[0].note) {
                alert(`${files[0].note}\n\nThis demo uses placeholder files.`);
                return;
            }

            if (carousel) {
                carousel.destroy();
            }

            carousel = new FileCarousel({
                container: document.body,
                files: files,
                autoPreload: true,
                showDownloadButton: true,
            });
            carousel.open(0);
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
