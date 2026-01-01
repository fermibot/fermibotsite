// ============================================
// AUTOMATIC THEME SUPPORT INITIALIZATION
// ============================================
// This runs immediately when loadObjects.js is loaded
// No changes needed to individual pages!

(function autoInitTheme() {
    // Set data-bs-theme="auto" on html element
    if (!document.documentElement.hasAttribute('data-bs-theme')) {
        document.documentElement.setAttribute('data-bs-theme', 'auto');
    }

    // Calculate path depth for relative paths
    function getPathPrefix() {
        const depth = (window.location.pathname.match(/\//g) || []).length - 1;
        return depth > 0 ? '../'.repeat(depth) : './';
    }

    const pathPrefix = getPathPrefix();

    // Load theme support CSS
    if (!document.querySelector('link[href*="theme-support.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = pathPrefix + 'automation/theme-support.css';
        document.head.appendChild(link);
        console.log('📝 Loading theme CSS from:', link.href);
    }

    // Load color-modes.js if not already loaded
    if (!document.querySelector('script[src*="color-modes.js"]')) {
        const script = document.createElement('script');
        script.src = pathPrefix + 'bootstrap/assets/color-modes.js';
        script.onload = function() {
            console.log('✅ color-modes.js loaded successfully from:', script.src);
        };
        script.onerror = function() {
            console.error('❌ Failed to load color-modes.js from:', script.src);
            console.log('Calculated path prefix:', pathPrefix);
            console.log('Current pathname:', window.location.pathname);
        };
        document.head.appendChild(script);
        console.log('📝 Attempting to load color-modes.js from:', script.src);
    } else {
        console.log('✅ color-modes.js already loaded');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectThemeComponents);
    } else {
        injectThemeComponents();
    }

    function injectThemeComponents() {
        console.log('🎨 Injecting theme components...');

        // Create theme icons container if it doesn't exist
        if (!document.getElementById('theme_icons_auto')) {
            const iconsDiv = document.createElement('div');
            iconsDiv.id = 'theme_icons_auto';
            document.body.insertBefore(iconsDiv, document.body.firstChild);

            console.log('📝 Loading theme icons from:', pathPrefix + 'automation/theme_icons_svg.html');
            // Load theme icons SVG
            fetch(pathPrefix + 'automation/theme_icons_svg.html')
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch: ' + response.status);
                    return response.text();
                })
                .then(html => {
                    iconsDiv.innerHTML = html;
                    console.log('✅ Theme icons loaded');
                })
                .catch(err => console.error('❌ Could not load theme icons:', err));
        }

        // Create theme toggle container if it doesn't exist
        if (!document.getElementById('theme_toggle_auto')) {
            const toggleDiv = document.createElement('div');
            toggleDiv.id = 'theme_toggle_auto';
            document.body.appendChild(toggleDiv);

            console.log('📝 Loading theme toggle from:', pathPrefix + 'automation/theme_toggle.html');
            // Load theme toggle widget
            fetch(pathPrefix + 'automation/theme_toggle.html')
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch: ' + response.status);
                    return response.text();
                })
                .then(html => {
                    toggleDiv.innerHTML = html;
                    console.log('✅ Theme toggle HTML loaded');

                    // Initialize Bootstrap dropdown and theme switching
                    function initThemeToggle() {
                        const dropdownButton = document.getElementById('bd-theme');
                        if (!dropdownButton) {
                            console.warn('⚠️ Theme toggle button not found');
                            return;
                        }

                        // Initialize Bootstrap dropdown
                        if (typeof bootstrap !== 'undefined' && bootstrap.Dropdown) {
                            new bootstrap.Dropdown(dropdownButton);
                            console.log('✅ Theme toggle initialized with Bootstrap 5');
                        } else if (typeof $ !== 'undefined' && $.fn.dropdown) {
                            $(dropdownButton).dropdown();
                            console.log('✅ Theme toggle initialized with Bootstrap 4/jQuery');
                        } else {
                            console.log('⏳ Bootstrap not ready yet, retrying...');
                            setTimeout(initThemeToggle, 200);
                            return;
                        }

                        // Set up theme switching functionality
                        setupThemeSwitching();
                    }

                    function setupThemeSwitching() {
                        console.log('🔧 Setting up theme switching...');

                        const getStoredTheme = () => localStorage.getItem('theme');
                        const setStoredTheme = theme => localStorage.setItem('theme', theme);

                        const getPreferredTheme = () => {
                            const storedTheme = getStoredTheme();
                            if (storedTheme) return storedTheme;
                            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                        };

                        const setTheme = theme => {
                            console.log('🎨 Setting theme to:', theme);
                            if (theme === 'auto') {
                                const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                document.documentElement.setAttribute('data-bs-theme', preferredTheme);
                                console.log('  → Applied theme:', preferredTheme, '(auto)');
                            } else {
                                document.documentElement.setAttribute('data-bs-theme', theme);
                                console.log('  → Applied theme:', theme);
                            }
                            updateThemeUI(theme);
                        };

                        const updateThemeUI = theme => {
                            const themeButtons = document.querySelectorAll('[data-bs-theme-value]');
                            const activeIcon = document.querySelector('.theme-icon-active use');

                            themeButtons.forEach(btn => {
                                const btnTheme = btn.getAttribute('data-bs-theme-value');
                                const isActive = btnTheme === theme;

                                btn.classList.toggle('active', isActive);
                                btn.setAttribute('aria-pressed', isActive);

                                const checkIcon = btn.querySelector('svg:last-child');
                                if (checkIcon) {
                                    checkIcon.classList.toggle('d-none', !isActive);
                                }
                            });

                            // Update main button icon
                            if (activeIcon) {
                                const iconMap = {
                                    'light': '#sun-fill',
                                    'dark': '#moon-stars-fill',
                                    'auto': '#circle-half'
                                };
                                activeIcon.setAttribute('href', iconMap[theme] || iconMap.auto);
                            }
                        };

                        // Set initial theme
                        const initialTheme = getStoredTheme() || 'auto';
                        setTheme(initialTheme);

                        // Add click listeners to theme buttons
                        document.querySelectorAll('[data-bs-theme-value]').forEach(button => {
                            button.addEventListener('click', () => {
                                const theme = button.getAttribute('data-bs-theme-value');
                                setStoredTheme(theme);
                                setTheme(theme);
                                console.log('✅ Theme changed to:', theme);
                            });
                        });

                        // Listen for system theme changes when in auto mode
                        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                            const currentTheme = getStoredTheme();
                            if (currentTheme === 'auto' || !currentTheme) {
                                setTheme('auto');
                                console.log('🔄 System theme changed, updating auto theme');
                            }
                        });

                        console.log('✅ Theme switching ready');
                    }

                    setTimeout(initThemeToggle, 100);
                })
                .catch(err => console.error('❌ Could not load theme toggle:', err));
        }
    }
})();

// ============================================
// EXISTING FUNCTIONS
// ============================================

function loadHeaderFooter(headerPath, footerPath, themeTogglePath) {
    document.addEventListener("DOMContentLoaded", function () {

        // Load the header
        fetch(headerPath)
            .then(response => response.text())
            .then(html => {
                document.getElementById("header_placeholder").innerHTML = html;
            });

        // Load the footer
        fetch(footerPath)
            .then(response => response.text())
            .then(html => {
                document.getElementById("footer_placeholder").innerHTML = html;
            });

        // Load theme_toggle.html (if provided - for backwards compatibility)
        if (themeTogglePath && document.getElementById("theme_toggle")) {
            fetch(themeTogglePath)
                .then(response => response.text())
                .then(html => {
                    document.getElementById("theme_toggle").innerHTML = html;
                });
        }
    });
}

function loadThemeIcons(themePath) {
    document.addEventListener("DOMContentLoaded", function () {
        // Load the header
        fetch(themePath)
            .then(response => response.text())
            .then(html => {
                document.getElementById("theme_icons_placeholder").innerHTML = html;
            });
    });
}


function styleImageIcons(className) {
    const elements = document.getElementsByClassName(className);
    const lightColors = ['#E0FFFF', '#E6E6FA', '#ADD8E6', '#87CEFA', '#B0E0E6', '#AFEEEE', '#98FB98', '#90EE90', '#F0E68C', '#FAFAD2', '#FFFFE0', '#FFB6C1', '#FFC0CB', '#FFDAB9', '#FFE4B5', '#FFE4E1', '#FFEFD5', '#D3D3D3', '#DCDCDC', '#E0E0E0', '#F0F0F0', '#F5F5F5', '#F5DEB3', '#EEE8AA', '#D2B48C', '#BC8F8F', '#DEB887', '#FFF0F5', '#FFF5EE', '#F0FFF0', '#F5FFFA', '#F0F8FF', '#F8F8FF', '#FAF0E6', '#FAEBD7', '#FDF5E6', '#FFFAF0'];

    Array.from(elements).forEach(element => {
        // Randomly select a light color
        const randomColor = lightColors[Math.floor(Math.random() * lightColors.length)];


        // Apply styles to each element
        element.style.width = '256px';
        element.style.height = '256px';
        element.style.objectFit = 'cover';
        element.style.borderRadius = '50%';
        element.style.border = `2px solid ${'lightblue'}`;
        element.style.background = 'white';
        element.style.padding = '5px';
        element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        element.style.display = 'block';
        element.style.marginLeft = 'auto';
        element.style.marginRight = 'auto';
        element.style.transition = 'transform 0.3s ease, border-color 0.5s ease';

        // Add hover effect
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.05)';
            element.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
    });
}

// Usage example:
document.addEventListener('DOMContentLoaded', () => {
    styleImageIcons('icon-image');
});