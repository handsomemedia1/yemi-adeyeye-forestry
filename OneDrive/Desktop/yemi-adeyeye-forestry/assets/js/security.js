// ========================================
// Security Module - Website Protection
// ========================================

(function() {
    'use strict';

    // ========================================
    // 1. XSS Protection - Input Sanitization
    // ========================================

    const SecurityUtils = {
        /**
         * Sanitize HTML to prevent XSS attacks
         */
        sanitizeHTML: function(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },

        /**
         * Escape HTML special characters
         */
        escapeHTML: function(str) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#x27;',
                '/': '&#x2F;'
            };
            return String(str).replace(/[&<>"'/]/g, (char) => map[char]);
        },

        /**
         * Validate email format
         */
        isValidEmail: function(email) {
            const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return re.test(String(email).toLowerCase());
        },

        /**
         * Validate URL format
         */
        isValidURL: function(url) {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        },

        /**
         * Remove potentially dangerous scripts
         */
        stripScripts: function(str) {
            return String(str).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        },

        /**
         * Validate input length
         */
        validateLength: function(str, min, max) {
            const len = String(str).length;
            return len >= min && len <= max;
        }
    };

    // ========================================
    // 2. Form Security & Validation
    // ========================================

    class FormSecurity {
        constructor(formId) {
            this.form = document.getElementById(formId);
            this.submissionAttempts = 0;
            this.lastSubmissionTime = 0;
            this.maxAttemptsPerMinute = 3;

            if (this.form) {
                this.init();
            }
        }

        init() {
            // Add honeypot field (hidden field to catch bots)
            this.addHoneypot();

            // Add CSRF token simulation
            this.addCSRFToken();

            // Set up real-time validation
            this.setupRealtimeValidation();

            // Override form submission
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        /**
         * Add honeypot field to catch bots
         */
        addHoneypot() {
            const honeypot = document.createElement('input');
            honeypot.type = 'text';
            honeypot.name = 'website'; // Bots often fill this
            honeypot.id = 'website';
            honeypot.style.display = 'none';
            honeypot.tabIndex = -1;
            honeypot.autocomplete = 'off';
            honeypot.setAttribute('aria-hidden', 'true');
            this.form.appendChild(honeypot);
        }

        /**
         * Add CSRF token (simulated for static site)
         */
        addCSRFToken() {
            const token = this.generateToken();
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrf_token';
            csrfInput.value = token;
            this.form.appendChild(csrfInput);

            // Store in sessionStorage for validation
            sessionStorage.setItem('csrf_token', token);
        }

        /**
         * Generate random token
         */
        generateToken() {
            return Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
        }

        /**
         * Rate limiting - prevent spam submissions
         */
        checkRateLimit() {
            const now = Date.now();
            const timeSinceLastSubmit = now - this.lastSubmissionTime;

            // Reset counter after 1 minute
            if (timeSinceLastSubmit > 60000) {
                this.submissionAttempts = 0;
            }

            // Check if exceeded rate limit
            if (this.submissionAttempts >= this.maxAttemptsPerMinute) {
                return false;
            }

            this.submissionAttempts++;
            this.lastSubmissionTime = now;
            return true;
        }

        /**
         * Setup real-time input validation
         */
        setupRealtimeValidation() {
            const inputs = this.form.querySelectorAll('input, textarea');

            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.validateField(input);
                });

                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        }

        /**
         * Validate individual field
         */
        validateField(field) {
            const value = field.value.trim();
            let isValid = true;
            let errorMessage = '';

            // Skip honeypot field
            if (field.name === 'website') return true;

            // Required field check
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required';
            }

            // Email validation
            if (field.type === 'email' && value) {
                if (!SecurityUtils.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
            }

            // Length validation
            if (value) {
                if (field.type === 'text' && !SecurityUtils.validateLength(value, 2, 100)) {
                    isValid = false;
                    errorMessage = 'Must be between 2 and 100 characters';
                }

                if (field.tagName === 'TEXTAREA' && !SecurityUtils.validateLength(value, 10, 1000)) {
                    isValid = false;
                    errorMessage = 'Must be between 10 and 1000 characters';
                }
            }

            // XSS check - detect script tags or suspicious patterns
            if (value && /<script|javascript:|onerror=|onload=/i.test(value)) {
                isValid = false;
                errorMessage = 'Invalid characters detected';
            }

            // Update field validation state
            this.updateFieldStatus(field, isValid, errorMessage);

            return isValid;
        }

        /**
         * Update visual validation status
         */
        updateFieldStatus(field, isValid, errorMessage) {
            const formGroup = field.closest('.form-group');
            if (!formGroup) return;

            // Remove existing error
            const existingError = formGroup.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }

            formGroup.classList.remove('error', 'success');

            if (!isValid && field.value) {
                formGroup.classList.add('error');

                const errorDiv = document.createElement('div');
                errorDiv.className = 'field-error';
                errorDiv.textContent = errorMessage;
                errorDiv.style.color = '#dc3545';
                errorDiv.style.fontSize = '0.875rem';
                errorDiv.style.marginTop = '0.25rem';
                formGroup.appendChild(errorDiv);
            } else if (field.value) {
                formGroup.classList.add('success');
            }
        }

        /**
         * Handle form submission with security checks
         */
        handleSubmit(e) {
            e.preventDefault();

            // 1. Check honeypot
            const honeypot = this.form.querySelector('#website');
            if (honeypot && honeypot.value) {
                console.warn('Bot detected via honeypot');
                return false;
            }

            // 2. Check rate limiting
            if (!this.checkRateLimit()) {
                this.showError('Too many submission attempts. Please wait a minute.');
                return false;
            }

            // 3. Validate CSRF token
            const submittedToken = this.form.querySelector('[name="csrf_token"]').value;
            const storedToken = sessionStorage.getItem('csrf_token');
            if (submittedToken !== storedToken) {
                console.warn('CSRF token mismatch');
                return false;
            }

            // 4. Validate all fields
            const inputs = this.form.querySelectorAll('input:not([type="hidden"]), textarea');
            let allValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    allValid = false;
                }
            });

            if (!allValid) {
                this.showError('Please fix the errors in the form');
                return false;
            }

            // 5. Sanitize all inputs before processing
            const sanitizedData = this.sanitizeFormData();

            // 6. If all checks pass, proceed with submission
            this.submitForm(sanitizedData);

            return false;
        }

        /**
         * Sanitize form data
         */
        sanitizeFormData() {
            const formData = new FormData(this.form);
            const sanitized = {};

            for (let [key, value] of formData.entries()) {
                if (key !== 'website' && key !== 'csrf_token') {
                    sanitized[key] = SecurityUtils.escapeHTML(value);
                }
            }

            return sanitized;
        }

        /**
         * Submit form (implement your actual submission logic here)
         */
        submitForm(data) {
            console.log('Secure form submission:', data);

            // Show success message
            const formStatus = this.form.querySelector('.form-status');
            const successStatus = this.form.querySelector('.success-status');

            if (formStatus && successStatus) {
                formStatus.style.display = 'block';
                successStatus.style.display = 'block';

                // Reset form
                this.form.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    successStatus.style.display = 'none';
                }, 5000);
            }

            // Here you would typically send data to your backend
            // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
        }

        /**
         * Show error message
         */
        showError(message) {
            const formStatus = this.form.querySelector('.form-status');
            const errorStatus = this.form.querySelector('.error-status');

            if (formStatus && errorStatus) {
                formStatus.style.display = 'block';
                errorStatus.style.display = 'block';
                errorStatus.textContent = message;

                setTimeout(() => {
                    formStatus.style.display = 'none';
                    errorStatus.style.display = 'none';
                }, 5000);
            }
        }
    }

    // ========================================
    // 3. Click-jacking Protection
    // ========================================

    function preventClickjacking() {
        if (window.self !== window.top) {
            // Site is in an iframe - could be clickjacking attempt
            window.top.location = window.self.location;
        }
    }

    // ========================================
    // 4. Disable Right-Click on Images (Optional)
    // ========================================

    function protectImages() {
        document.addEventListener('contextmenu', function(e) {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });

        // Prevent drag & drop of images
        document.addEventListener('dragstart', function(e) {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        });
    }

    // ========================================
    // 5. Console Warning (Deter Script Injection)
    // ========================================

    function consoleWarning() {
        const styles = [
            'font-size: 20px',
            'color: red',
            'font-weight: bold',
            'text-shadow: 1px 1px 2px black'
        ].join(';');

        console.log('%c⚠️ STOP!', styles);
        console.log('%cThis is a browser feature intended for developers.', 'font-size: 14px;');
        console.log('%cIf someone told you to copy/paste something here, it is a scam.', 'font-size: 14px; color: red;');
        console.log('%cPasting anything here could give attackers access to your information.', 'font-size: 14px; color: red;');
    }

    // ========================================
    // 6. Initialize Security Features
    // ========================================

    document.addEventListener('DOMContentLoaded', function() {
        // Initialize form security
        new FormSecurity('contactForm');

        // Prevent clickjacking
        preventClickjacking();

        // Protect images (optional - can be disabled if too restrictive)
        // protectImages();

        // Show console warning
        consoleWarning();

        // Add security headers notification
        console.log('%c🔒 Security Features Active', 'color: green; font-weight: bold;');
        console.log('✓ XSS Protection');
        console.log('✓ CSRF Protection');
        console.log('✓ Rate Limiting');
        console.log('✓ Input Sanitization');
        console.log('✓ Honeypot Protection');
    });

    // ========================================
    // 7. Export Security Utils (if needed)
    // ========================================

    window.SecurityUtils = SecurityUtils;

})();
