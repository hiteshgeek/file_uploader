<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Button Sizes - Utils Documentation</title>
    <link rel="stylesheet" href="<?php echo asset('media-hub.css'); ?>" />
    <link rel="icon" type="image/svg+xml" href="../../../src/assets/images/download.svg">
    <style>
        * {
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f7fa;
            color: #1a202c;
            line-height: 1.6;
        }

        .demo-layout {
            display: flex;
            min-height: 100vh;
        }

        .demo-content {
            flex: 1;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .demo-header {
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }

        .demo-header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1a202c;
            margin: 0 0 10px 0;
        }

        .demo-header p {
            font-size: 1.1rem;
            color: #718096;
            margin: 0;
        }

        .demo-section {
            background: #fff;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .demo-section h2 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .demo-section h2 .badge {
            font-size: 0.75rem;
            padding: 3px 8px;
            background: #6366f1;
            color: white;
            border-radius: 4px;
            font-weight: 500;
        }

        .demo-section > p {
            color: #718096;
            margin: 0 0 24px 0;
        }

        .demo-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 24px;
            align-items: center;
        }

        .demo-buttons-vertical {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
        }

        .size-row {
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .size-label {
            min-width: 100px;
            font-size: 14px;
            font-weight: 600;
            color: #4a5568;
        }

        .code-block {
            background: #1e293b;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            line-height: 1.6;
        }

        .code-block code {
            color: inherit;
            white-space: pre;
            display: block;
        }

        .code-block .comment {
            color: #64748b;
        }

        .code-block .tag {
            color: #f472b6;
        }

        .code-block .attr {
            color: #a5b4fc;
        }

        .code-block .string {
            color: #86efac;
        }

        .code-block .keyword {
            color: #c4b5fd;
        }

        .code-block .function {
            color: #93c5fd;
        }

        .code-block .property {
            color: #fbbf24;
        }

        /* Feature list */
        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
        }

        .feature-item svg {
            width: 20px;
            height: 20px;
            fill: #6366f1;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .feature-item h5 {
            margin: 0 0 4px 0;
            font-size: 14px;
            font-weight: 600;
            color: #2d3748;
        }

        .feature-item p {
            margin: 0;
            font-size: 13px;
            color: #718096;
        }

        /* API table */
        .api-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
        }

        .api-table th,
        .api-table td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        .api-table th {
            background: #f8fafc;
            font-weight: 600;
            color: #2d3748;
            font-size: 13px;
        }

        .api-table td {
            font-size: 14px;
            color: #4a5568;
        }

        .api-table code {
            background: #eef2ff;
            color: #4f46e5;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
        }

        /* Back link */
        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #6366f1;
            text-decoration: none;
            font-weight: 500;
            margin-bottom: 20px;
        }

        .back-link:hover {
            text-decoration: underline;
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
            background: rgba(99, 102, 241, 0.9);
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

        body.dark-theme .demo-section {
            background: #1e293b;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        body.dark-theme .demo-header {
            border-bottom-color: #334155;
        }

        body.dark-theme .demo-header h1 {
            color: #f1f5f9;
        }

        body.dark-theme .demo-header p,
        body.dark-theme .demo-section > p {
            color: #94a3b8;
        }

        body.dark-theme .demo-section h2 {
            color: #f1f5f9;
        }

        body.dark-theme .preview-area {
            background: #0f172a;
            border-color: #475569;
        }

        body.dark-theme .size-label {
            color: #94a3b8;
        }

        body.dark-theme .feature-item {
            background: #0f172a;
        }

        body.dark-theme .feature-item h5 {
            color: #f1f5f9;
        }

        body.dark-theme .feature-item p {
            color: #94a3b8;
        }

        body.dark-theme .api-table th {
            background: #0f172a;
            color: #f1f5f9;
        }

        body.dark-theme .api-table td {
            color: #cbd5e1;
            border-bottom-color: #334155;
        }

        body.dark-theme .api-table code {
            background: #312e81;
            color: #a5b4fc;
        }

        body.dark-theme .note-box {
            background: #1e3a5f;
            border-left-color: #3b82f6;
        }

        body.dark-theme .note-box strong {
            color: #93c5fd;
        }

        body.dark-theme .note-box p {
            color: #bfdbfe;
        }

        body.dark-theme .subsection {
            border-top-color: #334155;
        }

        body.dark-theme .subsection h3 {
            color: #f1f5f9;
        }

        body.dark-theme .theme-switcher {
            background: rgba(99, 102, 241, 0.9);
        }

        body.dark-theme .back-link {
            color: #a5b4fc;
        }

        /* Subsection */
        .subsection {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
        }

        .subsection h3 {
            font-size: 1.1rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0 0 16px 0;
        }

        /* Note box */
        .note-box {
            background: #dbeafe;
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            border-radius: 0 8px 8px 0;
            margin: 16px 0;
        }

        .note-box strong {
            color: #1e40af;
        }

        .note-box p {
            margin: 0;
            color: #1e3a8a;
            font-size: 14px;
        }

        /* Preview area */
        .preview-area {
            background: #f8fafc;
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 16px;
        }

        .preview-area-dark {
            background: #1e293b;
            border-color: #475569;
        }

        /* Size comparison table */
        .size-comparison {
            display: grid;
            grid-template-columns: auto 1fr 1fr 1fr 1fr;
            gap: 1px;
            background: #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 24px;
        }

        .size-comparison > div {
            background: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .size-comparison .header {
            background: #f8fafc;
            font-weight: 600;
            font-size: 13px;
            color: #4a5568;
        }

        .size-comparison .label {
            background: #f8fafc;
            font-weight: 500;
            font-size: 13px;
            color: #64748b;
            justify-content: flex-start;
        }
    </style>
</head>
<body>
    <?php include __DIR__ . '/sidebar.php'; ?>

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

    <main class="demo-content">
        <a href="../index.php" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Utils
        </a>

        <div class="demo-header">
            <h1>Button Sizes</h1>
            <p>A consistent button sizing system with four variants (xs, sm, md, lg) for both circular icon buttons and rectangular buttons.</p>
        </div>

        <!-- Overview Section -->
        <div class="demo-section">
            <h2>Overview</h2>
            <p>The button sizing system uses CSS custom properties for consistent sizing across all MediaHub components.</p>

            <div class="feature-list">
                <div class="feature-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <div>
                        <h5>Four Size Variants</h5>
                        <p>Extra small (xs), small (sm), medium (md), large (lg)</p>
                    </div>
                </div>
                <div class="feature-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <div>
                        <h5>Circular Buttons</h5>
                        <p>Perfect for icon-only action buttons</p>
                    </div>
                </div>
                <div class="feature-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <div>
                        <h5>Rectangular Buttons</h5>
                        <p>Text and icon buttons with proper padding</p>
                    </div>
                </div>
                <div class="feature-item">
                    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <div>
                        <h5>CSS Custom Properties</h5>
                        <p>Easy to customize via CSS variables</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Circular Buttons -->
        <div class="demo-section">
            <h2>Circular Icon Buttons <span class="badge">Capture Buttons</span></h2>
            <p>Circular buttons are perfect for icon-only actions like capture, toggle, and media controls.</p>

            <div class="preview-area">
                <div class="size-row" style="margin-bottom: 20px;">
                    <span class="size-label">Extra Small</span>
                    <button class="media-hub-capture-btn media-hub-capture-btn-xs" title="24px - Camera">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-capture-toggle media-hub-capture-toggle-xs" title="24px - Toggle">
                        <svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    </button>
                </div>
                <div class="size-row" style="margin-bottom: 20px;">
                    <span class="size-label">Small</span>
                    <button class="media-hub-capture-btn media-hub-capture-btn-sm" title="32px - Camera">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-capture-toggle media-hub-capture-toggle-sm" title="32px - Toggle">
                        <svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    </button>
                </div>
                <div class="size-row" style="margin-bottom: 20px;">
                    <span class="size-label">Medium (default)</span>
                    <button class="media-hub-capture-btn" title="40px - Camera">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-capture-toggle" title="40px - Toggle">
                        <svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    </button>
                </div>
                <div class="size-row">
                    <span class="size-label">Large</span>
                    <button class="media-hub-capture-btn media-hub-capture-btn-lg" title="48px - Camera">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-capture-toggle media-hub-capture-toggle-lg" title="48px - Toggle">
                        <svg viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    </button>
                </div>
            </div>

            <div class="code-block">
<code><span class="comment">&lt;!-- Circular capture buttons --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-btn media-hub-capture-btn-xs"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-btn media-hub-capture-btn-sm"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-btn"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span> <span class="comment">&lt;!-- Default medium --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-btn media-hub-capture-btn-lg"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span>

<span class="comment">&lt;!-- Circular toggle buttons --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-toggle media-hub-capture-toggle-xs"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-toggle media-hub-capture-toggle-sm"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-toggle"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span> <span class="comment">&lt;!-- Default medium --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-toggle media-hub-capture-toggle-lg"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span></code>
            </div>
        </div>

        <!-- Rectangular Buttons -->
        <div class="demo-section">
            <h2>Rectangular Buttons <span class="badge">Action Buttons</span></h2>
            <p>Rectangular buttons for actions like Download, Clear, and toolbar controls.</p>

            <div class="preview-area">
                <div class="size-row" style="margin-bottom: 20px;">
                    <span class="size-label">Extra Small</span>
                    <button class="media-hub-download-all btn-xs">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        Download
                    </button>
                    <button class="media-hub-clear-all btn-xs">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Clear
                    </button>
                    <button class="media-hub-toolbar-btn btn-xs">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Toolbar
                    </button>
                </div>
                <div class="size-row" style="margin-bottom: 20px;">
                    <span class="size-label">Small</span>
                    <button class="media-hub-download-all btn-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        Download
                    </button>
                    <button class="media-hub-clear-all btn-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Clear
                    </button>
                    <button class="media-hub-toolbar-btn btn-sm">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Toolbar
                    </button>
                </div>
                <div class="size-row" style="margin-bottom: 20px;">
                    <span class="size-label">Medium (default)</span>
                    <button class="media-hub-download-all">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        Download
                    </button>
                    <button class="media-hub-clear-all">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Clear
                    </button>
                    <button class="media-hub-toolbar-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Toolbar
                    </button>
                </div>
                <div class="size-row">
                    <span class="size-label">Large</span>
                    <button class="media-hub-download-all btn-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        Download
                    </button>
                    <button class="media-hub-clear-all btn-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Clear
                    </button>
                    <button class="media-hub-toolbar-btn btn-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                        Toolbar
                    </button>
                </div>
            </div>

            <div class="code-block">
<code><span class="comment">&lt;!-- Rectangular action buttons --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-download-all btn-xs"</span><span class="tag">&gt;</span>Download<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-download-all btn-sm"</span><span class="tag">&gt;</span>Download<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-download-all"</span><span class="tag">&gt;</span>Download<span class="tag">&lt;/button&gt;</span> <span class="comment">&lt;!-- Default medium --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-download-all btn-lg"</span><span class="tag">&gt;</span>Download<span class="tag">&lt;/button&gt;</span>

<span class="comment">&lt;!-- Toolbar buttons --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-toolbar-btn btn-xs"</span><span class="tag">&gt;</span>Toolbar<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-toolbar-btn btn-sm"</span><span class="tag">&gt;</span>Toolbar<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-toolbar-btn"</span><span class="tag">&gt;</span>Toolbar<span class="tag">&lt;/button&gt;</span> <span class="comment">&lt;!-- Default medium --&gt;</span>
<span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-toolbar-btn btn-lg"</span><span class="tag">&gt;</span>Toolbar<span class="tag">&lt;/button&gt;</span></code>
            </div>
        </div>

        <!-- Size Reference -->
        <div class="demo-section">
            <h2>Size Reference</h2>
            <p>Complete reference for all button size CSS custom properties.</p>

            <table class="api-table">
                <thead>
                    <tr>
                        <th>Size</th>
                        <th>Button Size (Circular)</th>
                        <th>Icon Size</th>
                        <th>Padding (Rectangular)</th>
                        <th>Font Size</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>xs</code></td>
                        <td>24px</td>
                        <td>12px</td>
                        <td>4px 8px</td>
                        <td>11px</td>
                    </tr>
                    <tr>
                        <td><code>sm</code></td>
                        <td>32px</td>
                        <td>14px</td>
                        <td>5px 12px</td>
                        <td>12px</td>
                    </tr>
                    <tr>
                        <td><code>md</code> (default)</td>
                        <td>40px</td>
                        <td>18px</td>
                        <td>7px 15px</td>
                        <td>14px</td>
                    </tr>
                    <tr>
                        <td><code>lg</code></td>
                        <td>48px</td>
                        <td>22px</td>
                        <td>10px 20px</td>
                        <td>16px</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- CSS Custom Properties -->
        <div class="demo-section">
            <h2>CSS Custom Properties</h2>
            <p>Override these CSS variables to customize button sizes globally.</p>

            <div class="code-block">
<code><span class="comment">/* Button Sizes (circular/icon buttons) */</span>
<span class="property">--fu-btn-size-xs</span>: 24px;
<span class="property">--fu-btn-size-sm</span>: 32px;
<span class="property">--fu-btn-size-md</span>: 40px;
<span class="property">--fu-btn-size-lg</span>: 48px;

<span class="comment">/* Button Icon Sizes (SVG inside buttons) */</span>
<span class="property">--fu-btn-icon-xs</span>: 12px;
<span class="property">--fu-btn-icon-sm</span>: 14px;
<span class="property">--fu-btn-icon-md</span>: 18px;
<span class="property">--fu-btn-icon-lg</span>: 22px;

<span class="comment">/* Button Padding (rectangular buttons) */</span>
<span class="property">--fu-btn-padding-xs</span>: 4px 8px;
<span class="property">--fu-btn-padding-sm</span>: 5px 12px;
<span class="property">--fu-btn-padding-md</span>: 7px 15px;
<span class="property">--fu-btn-padding-lg</span>: 10px 20px;

<span class="comment">/* Button Font Sizes */</span>
<span class="property">--fu-btn-font-xs</span>: 11px;
<span class="property">--fu-btn-font-sm</span>: 12px;
<span class="property">--fu-btn-font-md</span>: 14px;
<span class="property">--fu-btn-font-lg</span>: 16px;</code>
            </div>

            <div class="note-box">
                <p><strong>Tip:</strong> You can override these variables in your own CSS to create custom sizes or adjust the existing ones to match your design system.</p>
            </div>
        </div>

        <!-- All Buttons Aligned -->
        <div class="demo-section">
            <h2>Button Alignment Demo</h2>
            <p>All buttons in a container are vertically aligned using <code>align-items: center</code>.</p>

            <div class="preview-area">
                <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                    <button class="media-hub-capture-btn media-hub-capture-btn-xs">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-capture-btn media-hub-capture-btn-sm">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-capture-btn">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-capture-btn media-hub-capture-btn-lg">
                        <svg viewBox="0 0 24 24"><path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z"/><path d="M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
                    </button>
                    <button class="media-hub-download-all btn-sm">
                        <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                        Download
                    </button>
                    <button class="media-hub-toolbar-btn">
                        <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        Edit
                    </button>
                    <button class="media-hub-clear-all btn-lg">
                        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        Clear All
                    </button>
                </div>
            </div>

            <div class="code-block">
<code><span class="comment">&lt;!-- Container with flex alignment --&gt;</span>
<span class="tag">&lt;div</span> <span class="attr">style</span>=<span class="string">"display: flex; align-items: center; gap: 12px;"</span><span class="tag">&gt;</span>
  <span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-btn media-hub-capture-btn-xs"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span>
  <span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-capture-btn"</span><span class="tag">&gt;</span>...<span class="tag">&lt;/button&gt;</span>
  <span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-download-all btn-sm"</span><span class="tag">&gt;</span>Download<span class="tag">&lt;/button&gt;</span>
  <span class="tag">&lt;button</span> <span class="attr">class</span>=<span class="string">"media-hub-toolbar-btn"</span><span class="tag">&gt;</span>Edit<span class="tag">&lt;/button&gt;</span>
<span class="tag">&lt;/div&gt;</span></code>
            </div>
        </div>

        <!-- Button Classes Reference -->
        <div class="demo-section">
            <h2>Available Button Classes</h2>
            <p>Complete list of button classes that support size variants.</p>

            <table class="api-table">
                <thead>
                    <tr>
                        <th>Button Type</th>
                        <th>Base Class</th>
                        <th>Size Modifier</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Capture Button (circular)</td>
                        <td><code>.media-hub-capture-btn</code></td>
                        <td><code>-xs</code>, <code>-sm</code>, <code>-lg</code></td>
                    </tr>
                    <tr>
                        <td>Capture Toggle (circular)</td>
                        <td><code>.media-hub-capture-toggle</code></td>
                        <td><code>-xs</code>, <code>-sm</code>, <code>-lg</code></td>
                    </tr>
                    <tr>
                        <td>Download Button</td>
                        <td><code>.media-hub-download-all</code></td>
                        <td><code>.btn-xs</code>, <code>.btn-sm</code>, <code>.btn-lg</code></td>
                    </tr>
                    <tr>
                        <td>Clear Button</td>
                        <td><code>.media-hub-clear-all</code></td>
                        <td><code>.btn-xs</code>, <code>.btn-sm</code>, <code>.btn-lg</code></td>
                    </tr>
                    <tr>
                        <td>Toolbar Button</td>
                        <td><code>.media-hub-toolbar-btn</code></td>
                        <td><code>.btn-xs</code>, <code>.btn-sm</code>, <code>.btn-lg</code></td>
                    </tr>
                    <tr>
                        <td>Download Selected</td>
                        <td><code>.media-hub-download-selected</code></td>
                        <td><code>.btn-xs</code>, <code>.btn-sm</code>, <code>.btn-lg</code></td>
                    </tr>
                    <tr>
                        <td>Delete Selected</td>
                        <td><code>.media-hub-delete-selected</code></td>
                        <td><code>.btn-xs</code>, <code>.btn-sm</code>, <code>.btn-lg</code></td>
                    </tr>
                </tbody>
            </table>

            <div class="note-box">
                <p><strong>Note:</strong> Circular buttons use suffix modifiers (<code>-xs</code>, <code>-sm</code>, <code>-lg</code>) while rectangular buttons use separate classes (<code>.btn-xs</code>, <code>.btn-sm</code>, <code>.btn-lg</code>).</p>
            </div>
        </div>
    </main>

    <script type="module">
        import { TooltipManager } from '<?= asset('media-hub.js') ?>';

        // Initialize tooltip system for title attributes
        document.addEventListener('DOMContentLoaded', () => {
            TooltipManager.init(document.body);
        });

        // Theme Switcher
        const themeSwitcher = document.getElementById('theme-switcher');
        let currentTheme = localStorage.getItem('utils-demo-theme') || 'light';

        function applyTheme(theme) {
            currentTheme = theme;
            localStorage.setItem('utils-demo-theme', theme);

            // Update button states
            themeSwitcher.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.theme === theme);
            });

            // Apply theme
            let effectiveTheme = theme;
            if (theme === 'system') {
                effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            document.body.classList.toggle('dark-theme', effectiveTheme === 'dark');
            document.body.dataset.theme = effectiveTheme;
        }

        themeSwitcher.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
        });

        // Listen for system theme changes when in system mode
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        });

        // Apply saved theme on load
        applyTheme(currentTheme);
    </script>
</body>
</html>
