<?php
include_once __DIR__ . '/../../../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Submission Demo - File Uploader</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo asset('media-hub.css'); ?>" />
    <link rel="icon" type="image/svg+xml" href="../../../src/assets/images/download.svg">
    <style>
        .demo-main {
            padding: 40px;
            max-width: 1000px;
            margin: 0 auto;
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
            <div class="demo-main">
                <div class="bg-light p-4 rounded mb-4">
                    <h1 class="display-5">Form Submission Demo</h1>
                    <p class="lead">Shows how to submit uploaded file names to backend</p>
                </div>

                <div class="alert alert-info">
                    <strong>How it works:</strong>
                    <ol class="mb-0 mt-2">
                        <li>Files are uploaded instantly via AJAX to <code>upload.php</code></li>
                        <li>Server returns the stored filename (e.g., <code>abc123_1234567890.jpg</code>)</li>
                        <li>When form is submitted, only the server filenames are sent</li>
                        <li>Backend saves these filenames in database</li>
                    </ol>
                </div>

                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">User Profile Form</h3>
                    </div>
                    <div class="card-body">
                        <form id="profileForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="name" class="form-label">Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="name" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Profile Picture</label>
                                <div id="profilePicture"></div>
                                <small class="form-text text-muted">Upload your profile picture</small>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Documents</label>
                                <div id="documents"></div>
                                <small class="form-text text-muted">Upload any supporting documents</small>
                            </div>

                            <div class="d-grid gap-2 d-md-flex">
                                <button type="submit" class="btn btn-primary">Submit Form</button>
                                <button type="button" class="btn btn-secondary" onclick="resetForm()">Reset</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">Form Data Preview</h4>
                    </div>
                    <div class="card-body">
                        <p>This shows the data that would be sent to the backend:</p>
                        <pre id="formDataPreview" class="bg-light p-3 rounded"><code>{
  "name": "",
  "email": "",
  "profilePicture": [],
  "documents": []
}</code></pre>
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

        // Initialize uploaders
        const profileUploader = new FileUploader('#profilePicture', {
            urls: {
                uploadUrl: '../../../api/upload.php',
                deleteUrl: '../../../api/delete.php',
                downloadAllUrl: '../../../api/download-all.php',
                configUrl: '../../../api/get-config-profile.php'
            },
            behavior: {
                multiple: false
            },
            limitsDisplay: {
                showLimits: true,
                defaultLimitsView: 'concise'
            },
            callbacks: {
                onUploadSuccess: (fileObj, result) => {
                    console.log('Profile picture uploaded:', result.file.filename);
                    updatePreview();
                },
                onDeleteSuccess: () => {
                    updatePreview();
                }
            }
        });

        const documentsUploader = new FileUploader('#documents', {
            urls: {
                uploadUrl: '../../../api/upload.php',
                deleteUrl: '../../../api/delete.php',
                downloadAllUrl: '../../../api/download-all.php',
                configUrl: '../../../api/get-config-documents.php'
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
                    console.log('Document uploaded:', result.file.filename);
                    updatePreview();
                },
                onDeleteSuccess: () => {
                    updatePreview();
                }
            }
        });

        // Update preview whenever form changes
        document.getElementById('name').addEventListener('input', updatePreview);
        document.getElementById('email').addEventListener('input', updatePreview);

        function updatePreview() {
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                // Just the server filenames - ready for database storage
                profilePicture: profileUploader.getUploadedFileNames(),
                documents: documentsUploader.getUploadedFileNames()
            };

            document.getElementById('formDataPreview').innerHTML =
                '<code>' + JSON.stringify(formData, null, 2) + '</code>';
        }

        // Handle form submission
        document.getElementById('profileForm').addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data with uploaded filenames
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                profilePicture: profileUploader.getUploadedFileNames(),
                documents: documentsUploader.getUploadedFileNames()
            };

            console.log('Submitting form data:', formData);

            // Example: Send to backend
            try {
                const response = await fetch('../submit-form-example.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName: formData.name,
                        email: formData.email,
                        resumeFiles: formData.profilePicture,
                        portfolioFiles: formData.documents,
                        terms: true
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Show success message
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-success alert-dismissible fade show';
                    alert.innerHTML = `
                        <strong>Success!</strong> Form submitted successfully.
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    document.querySelector('.demo-main').insertBefore(
                        alert,
                        document.querySelector('.card')
                    );

                    console.log('Backend response:', result);
                } else {
                    throw new Error(result.error || 'Submission failed');
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Error: ' + error.message);
            }
        });

        window.resetForm = function() {
            if (confirm('Are you sure you want to reset the form?')) {
                document.getElementById('profileForm').reset();
                profileUploader.clear();
                documentsUploader.clear();
                updatePreview();
            }
        };

        // Initialize preview
        updatePreview();

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
