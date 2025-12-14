<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bootstrap 5 Demo - File Uploader</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
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
            background: rgba(13, 110, 253, 0.9);
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
                <div class="bg-light p-5 rounded mb-4">
                    <h1 class="display-4">File Uploader</h1>
                    <p class="lead">Bootstrap 5 Integration</p>
                    <hr class="my-4">
                    <p>Modern file uploader with full Bootstrap 5 support, drag & drop, validation, and instant uploads.</p>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">Job Application Form</h3>
                    </div>
                    <div class="card-body">
                        <form id="applicationForm" class="needs-validation" novalidate>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="fullName" class="form-label">Full Name</label>
                                    <input type="text" class="form-control" id="fullName" required>
                                    <div class="invalid-feedback">Please provide your full name.</div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="email" class="form-label">Email Address</label>
                                    <input type="email" class="form-control" id="email" required>
                                    <div class="invalid-feedback">Please provide a valid email.</div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label for="position" class="form-label">Position Applied For</label>
                                <select class="form-select" id="position" required>
                                    <option value="">Choose...</option>
                                    <option value="developer">Software Developer</option>
                                    <option value="designer">UI/UX Designer</option>
                                    <option value="manager">Project Manager</option>
                                    <option value="analyst">Data Analyst</option>
                                </select>
                                <div class="invalid-feedback">Please select a position.</div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Resume/CV <span class="text-danger">*</span></label>
                                <div id="resume"></div>
                                <div class="form-text">Upload your resume (documents only)</div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Portfolio / Work Samples</label>
                                <div id="portfolio"></div>
                                <div class="form-text">Upload images, videos, or documents showcasing your work</div>
                            </div>

                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="terms" required>
                                    <label class="form-check-label" for="terms">
                                        I agree to the terms and conditions
                                    </label>
                                    <div class="invalid-feedback">You must agree before submitting.</div>
                                </div>
                            </div>

                            <div class="d-grid gap-2 d-md-flex">
                                <button type="submit" class="btn btn-primary">Submit Application</button>
                                <button type="reset" class="btn btn-secondary">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script type="module" src="<?= asset('media-hub.js') ?>"></script>
    <script nomodule src="<?= asset('media-hub.js', 'nomodule') ?>"></script>

    <script type="module">
        import { FileUploader } from '<?= asset('media-hub.js') ?>';

        // Resume uploader - documents only
        const resumeUploader = new FileUploader('#resume', {
            urls: {
                uploadUrl: '../../../api/upload.php',
                deleteUrl: '../../../api/delete.php',
                downloadAllUrl: '../../../api/download-all.php',
                configUrl: '../../../api/get-config-documents.php'
            },
            behavior: {
                multiple: false
            },
            limitsDisplay: {
                showLimits: true,
                defaultLimitsView: 'concise',
                allowLimitsViewToggle: false
            }
        });

        // Portfolio uploader - multiple file types
        const portfolioUploader = new FileUploader('#portfolio', {
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

        // Bootstrap 5 form validation
        document.getElementById('applicationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const form = e.target;
            form.classList.add('was-validated');

            if (form.checkValidity()) {
                const resumeFiles = resumeUploader.getUploadedFiles();
                const portfolioFiles = portfolioUploader.getUploadedFiles();

                if (resumeFiles.length === 0) {
                    alert('Please upload your resume');
                    return;
                }

                console.log('Application submitted:', {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    position: document.getElementById('position').value,
                    resume: resumeFiles,
                    portfolio: portfolioFiles
                });

                alert('Application submitted successfully! Check console for details.');
            }
        });

        // Theme Switcher (Bootstrap 5 uses data-bs-theme)
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

            document.documentElement.setAttribute('data-bs-theme', effectiveTheme);
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
