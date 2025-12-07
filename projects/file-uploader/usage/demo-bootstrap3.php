<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap 3 Demo - File Uploader</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
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
            background: rgba(51, 122, 183, 0.9);
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
            background: #222;
            color: #e2e8f0;
        }

        body.dark-theme .panel {
            background: #333;
            border-color: #444;
        }

        body.dark-theme .panel-heading {
            background: #444 !important;
            border-color: #555;
        }

        body.dark-theme .page-header h1 {
            color: #f1f5f9;
        }

        body.dark-theme .alert-info {
            background: #1e3a4c;
            border-color: #2a4a5c;
            color: #a0d2e4;
        }

        body.dark-theme .form-control {
            background: #444;
            border-color: #555;
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
            <div class="container" style="margin-top: 40px; padding-bottom: 40px;">
                <div class="page-header">
                    <h1>File Uploader <small>Bootstrap 3 Integration</small></h1>
                </div>

                <div class="alert alert-info">
                    <h4>Features:</h4>
                    <ul>
                        <li>Fully integrated with Bootstrap 3 forms</li>
                        <li>Drag & drop file upload</li>
                        <li>File type validation and preview</li>
                        <li>Instant AJAX upload</li>
                    </ul>
                </div>

                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 class="panel-title">User Registration Form</h3>
                    </div>
                    <div class="panel-body">
                        <form id="registrationForm">
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" class="form-control" id="name" placeholder="Enter your name" required>
                            </div>

                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" class="form-control" id="email" placeholder="Enter email" required>
                            </div>

                            <div class="form-group">
                                <label>Profile Picture</label>
                                <div id="profilePicture"></div>
                                <p class="help-block">Upload your profile picture (images only)</p>
                            </div>

                            <div class="form-group">
                                <label>Supporting Documents</label>
                                <div id="documents"></div>
                                <p class="help-block">Upload any supporting documents</p>
                            </div>

                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Submit</button>
                                <button type="reset" class="btn btn-default">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
    <script type="module" src="<?= asset('media-hub.js') ?>"></script>
    <script nomodule src="<?= asset('media-hub.js', 'nomodule') ?>"></script>

    <script type="module">
        import { FileUploader } from '<?= asset('media-hub.js') ?>';

        // Profile Picture uploader - single image only
        const profileUploader = new FileUploader('#profilePicture', {
            uploadUrl: '../../../api/upload.php',
            deleteUrl: '../../../api/delete.php',
            downloadAllUrl: '../../../api/download-all.php',
            configUrl: '../../../api/get-config-profile.php',
            multiple: false,
            showLimits: true,
            defaultLimitsView: 'concise',
            allowLimitsViewToggle: false
        });

        // Documents uploader - multiple files
        const documentsUploader = new FileUploader('#documents', {
            uploadUrl: '../../../api/upload.php',
            deleteUrl: '../../../api/delete.php',
            downloadAllUrl: '../../../api/download-all.php',
            configUrl: '../../../api/get-config-documents.php',
            multiple: true,
            showLimits: true,
            defaultLimitsView: 'concise',
            allowLimitsViewToggle: true
        });

        // Form submission
        document.getElementById('registrationForm').addEventListener('submit', (e) => {
            e.preventDefault();

            const profileFiles = profileUploader.getUploadedFiles();
            const documentFiles = documentsUploader.getUploadedFiles();

            if (profileFiles.length === 0) {
                alert('Please upload a profile picture');
                return;
            }

            console.log('Form submitted with:', {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                profilePicture: profileFiles,
                documents: documentFiles
            });

            alert('Form submitted successfully! Check console for details.');
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
