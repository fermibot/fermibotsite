// Cache-bust index.css by appending a local-time version query.
// This avoids stale CSS when users have aggressive caching.
(function cacheBustIndexCss() {
    try {
        const pad2 = (n) => String(n).padStart(2, '0');
        const now = new Date();
        const version = `${now.getFullYear()}.${pad2(now.getMonth() + 1)}.${pad2(now.getDate())}.${pad2(now.getHours())}.${pad2(now.getMinutes())}.${pad2(now.getSeconds())}`;

        const links = document.querySelectorAll('link[rel~="stylesheet"][href]');
        links.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href) return;

            // Only touch links that clearly point to index.css (any relative depth).
            // Avoid double-appending if already versioned.
            if (!href.includes('index.css')) return;
            if (href.includes('?v=')) return;

            const separator = href.includes('?') ? '&' : '?';
            link.setAttribute('href', `${href}${separator}v=${version}`);
        });
    } catch (e) {
        // Silently ignore; styling should still load even if cache-busting fails.
        // console.warn('CSS cache-busting failed', e);
    }
})();
