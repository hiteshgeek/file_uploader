<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FileUploader Integration - FileCarousel</title>
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
            border-left: 4px solid #11998e;
        }

        .info-box h3 {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
        }

        .info-box p {
            color: #4a5568;
            font-size: 14px;
            line-height: 1.6;
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

        .code-block {
            background: #1e293b;
            border-radius: 8px;
            padding: 20px;
            overflow-x: auto;
        }

        .code-block pre {
            margin: 0;
            color: #e2e8f0;
            font-family: 'Fira Code', monospace;
            font-size: 13px;
            line-height: 1.6;
        }

        .code-block .keyword { color: #c792ea; }
        .code-block .string { color: #c3e88d; }
        .code-block .property { color: #82aaff; }
        .code-block .comment { color: #676e95; }

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

        body.dark-theme .info-box {
            background: #1e293b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .info-box h3 {
            color: #f1f5f9;
        }

        body.dark-theme .info-box p {
            color: #cbd5e1;
        }

        body.dark-theme .demo-section {
            background: #1e293b;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .demo-section h2 {
            color: #f1f5f9;
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
                    <h1>FileUploader Integration</h1>
                    <p>Use FileCarousel with the FileUploader component for a complete file management solution</p>
                </div>

                <div class="info-box">
                    <h3>How It Works</h3>
                    <p>
                        FileUploader has built-in carousel preview support. When enabled, clicking on an uploaded file
                        opens the FileCarousel modal for a full-screen preview. This integration is automatic when you
                        set <code>enableCarouselPreview: true</code> in the FileUploader configuration.
                    </p>
                </div>

                <div class="demo-section">
                    <h2>Upload Files to Test</h2>
                    <div id="fileUploader"></div>
                </div>

                <div class="demo-section">
                    <h2>Integration Code</h2>
                    <div class="code-block">
                        <pre><span class="keyword">import</span> { FileUploader } <span class="keyword">from</span> <span class="string">'file-uploader'</span>;

<span class="comment">// FileUploader automatically includes FileCarousel</span>
<span class="keyword">const</span> uploader = <span class="keyword">new</span> FileUploader(<span class="string">'#myUploader'</span>, {
  <span class="property">urls</span>: {
    <span class="property">uploadUrl</span>: <span class="string">'/api/upload'</span>,
    <span class="property">deleteUrl</span>: <span class="string">'/api/delete'</span>,
  },

  <span class="comment">// Enable carousel preview</span>
  <span class="property">carousel</span>: {
    <span class="property">enableCarouselPreview</span>: <span class="keyword">true</span>,
    <span class="property">carouselShowDownloadButton</span>: <span class="keyword">true</span>,
    <span class="property">carouselAutoPreload</span>: <span class="keyword">true</span>,
  },

  <span class="comment">// Carousel options are passed through</span>
  <span class="property">carouselOptions</span>: {
    <span class="property">maxPreviewRows</span>: <span class="number">100</span>,
    <span class="property">maxTextPreviewChars</span>: <span class="number">50000</span>,
  },
});</pre>
                    </div>
                </div>

                <div class="demo-section">
                    <h2>Standalone Integration</h2>
                    <div class="code-block">
                        <pre><span class="keyword">import</span> { FileUploader, FileCarousel } <span class="keyword">from</span> <span class="string">'file-uploader'</span>;

<span class="comment">// Create uploader without built-in carousel</span>
<span class="keyword">const</span> uploader = <span class="keyword">new</span> FileUploader(<span class="string">'#myUploader'</span>, {
  <span class="property">carousel</span>: {
    <span class="property">enableCarouselPreview</span>: <span class="keyword">false</span>,
  },
});

<span class="comment">// Create standalone carousel</span>
<span class="keyword">let</span> carousel = <span class="keyword">null</span>;

<span class="comment">// Add custom click handler</span>
document.addEventListener(<span class="string">'click'</span>, (e) => {
  <span class="keyword">const</span> fileItem = e.target.closest(<span class="string">'.file-item'</span>);
  <span class="keyword">if</span> (fileItem) {
    <span class="keyword">const</span> files = uploader.getFiles();
    <span class="keyword">const</span> index = parseInt(fileItem.dataset.index);

    <span class="keyword">if</span> (carousel) carousel.destroy();
    carousel = <span class="keyword">new</span> FileCarousel({
      <span class="property">container</span>: document.body,
      <span class="property">files</span>: files,
      <span class="property">autoPreload</span>: <span class="keyword">true</span>,
    });
    carousel.open(index);
  }
});</pre>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="<?php echo asset('media-hub.js', 'nomodule'); ?>"></script>
    <script type="module">
        import { FileUploader } from '<?php echo asset('media-hub.js'); ?>';

        const uploader = new FileUploader('#fileUploader', {
            uploadUrl: '../../../api/upload.php',
            deleteUrl: '../../../api/delete.php',
            multiple: true,
            enableCarouselPreview: true,
            carouselShowDownloadButton: true,
        });

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
