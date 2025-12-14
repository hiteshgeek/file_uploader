<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap 4 Demo - File Uploader</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="<?php echo asset('media-hub.css'); ?>" />
    <link rel="icon" type="image/svg+xml" href="../../../src/assets/images/download.svg">
    <style>
        .demo-layout { display: flex; min-height: 100vh; }
        .demo-content { flex: 1; margin-left: 280px; }
        @media (max-width: 992px) {
            .demo-content { margin-left: 0; padding-top: 60px; }
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
            background: rgba(0, 123, 255, 0.9);
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
            background: #1a202c;
            color: #e2e8f0;
        }

        body.dark-theme .jumbotron {
            background: #2d3748;
        }

        body.dark-theme .jumbotron h1,
        body.dark-theme .jumbotron p {
            color: #f1f5f9;
        }

        body.dark-theme .card {
            background: #2d3748;
            border-color: #4a5568;
        }

        body.dark-theme .card-body {
            background: #2d3748;
        }

        body.dark-theme .form-control {
            background: #4a5568;
            border-color: #5a6575;
            color: #e2e8f0;
        }

        body.dark-theme label {
            color: #e2e8f0;
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
            <div class="container py-5">
                <div class="jumbotron">
                    <h1 class="display-4">File Uploader</h1>
                    <p class="lead">Bootstrap 4 Integration</p>
                    <hr class="my-4">
                    <p>Modern file uploader with full Bootstrap 4 support, drag & drop, validation, and instant uploads.</p>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">Project Submission Form</h3>
                    </div>
                    <div class="card-body">
                        <form id="submissionForm">
                            <div class="form-group">
                                <label for="projectName">Project Name</label>
                                <input type="text" class="form-control" id="projectName" placeholder="Enter project name" required>
                            </div>

                            <div class="form-group">
                                <label for="description">Description</label>
                                <textarea class="form-control" id="description" rows="3" placeholder="Enter project description" required></textarea>
                            </div>

                            <div class="form-group">
                                <label>Project Images</label>
                                <div id="projectImages"></div>
                                <small class="form-text text-muted">Upload project screenshots or images</small>
                            </div>

                            <div class="form-group">
                                <label>Additional Files</label>
                                <div id="additionalFiles"></div>
                                <small class="form-text text-muted">Upload any supporting documents</small>
                            </div>

                            <button type="submit" class="btn btn-primary">Submit Project</button>
                            <button type="reset" class="btn btn-secondary">Reset</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <script type="module" src="<?= asset('media-hub.js') ?>"></script>
    <script nomodule src="<?= asset('media-hub.js', 'nomodule') ?>"></script>

    <script type="module">
        import { FileUploader } from '<?= asset('media-hub.js') ?>';

        // Project Images uploader
        const imagesUploader = new FileUploader('#projectImages', {
            urls: {
                uploadUrl: '../../../api/upload.php',
                deleteUrl: '../../../api/delete.php',
                downloadAllUrl: '../../../api/download-all.php',
                configUrl: '../../../api/get-config-profile.php'
            },
            behavior: {
                multiple: true
            },
            limitsDisplay: {
                showLimits: true,
                defaultLimitsView: 'concise',
                allowLimitsViewToggle: true
            }
        });

        // Additional Files uploader
        const filesUploader = new FileUploader('#additionalFiles', {
            urls: {
                uploadUrl: '../../../api/upload.php',
                deleteUrl: '../../../api/delete.php',
                downloadAllUrl: '../../../api/download-all.php',
                configUrl: '../../../api/get-config.php'
            },
            behavior: {
                multiple: true
            },
            limitsDisplay: {
                showLimits: true,
                defaultLimitsView: 'concise',
                allowLimitsViewToggle: true
            }
        });

        document.getElementById('submissionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const images = imagesUploader.getUploadedFiles();
            const files = filesUploader.getUploadedFiles();

            console.log('Form submitted:', {
                projectName: document.getElementById('projectName').value,
                description: document.getElementById('description').value,
                images: images,
                files: files
            });

            alert('Project submitted! Check console for details.');
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
