// ============================================
// FOOTER DYNAMIC CONTENT LOADER
// ============================================

(function() {
    // Icon mapping for categoryMain (fallback is a dot)
    const mainIcons = {
        'Probability Distributions': '📊',
        'Probability Theory': '📈',
        'Mathematics': '📐',
        'Computer Science': '💻',
        'Life Sciences': '🧬',
        'General': '🌟'
    };

    async function loadFooterContent() {
        try {
            console.log('🦶 Footer script started');

            // Try multiple paths to find cards.json
            const possiblePaths = [
                '/data/cards.json',              // Root absolute path
                '../data/cards.json',            // One level up
                '../../data/cards.json',         // Two levels up
                '../../../data/cards.json',      // Three levels up
                '../../../../data/cards.json',   // Four levels up
                '../../../../../data/cards.json' // Five levels up
            ];

            let data = null;

            // Try each path until one works
            for (const path of possiblePaths) {
                try {
                    console.log('🔍 Trying to load cards.json from:', path);
                    const response = await fetch(path);
                    if (response.ok) {
                        data = await response.json();
                        console.log('✅ Successfully loaded cards.json from:', path);
                        break;
                    }
                } catch (e) {
                    // Continue to next path
                    console.log('❌ Failed to load from:', path);
                }
            }

            if (!data) {
                throw new Error('Could not find cards.json in any expected location');
            }

            const cards = Array.isArray(data.cards) ? data.cards : [];

            // Stats
            const categoriesCountEl = document.getElementById('footerCategoriesCount');
            const topicsCountEl = document.getElementById('footerTopicsCount');

            if (categoriesCountEl) categoriesCountEl.textContent = String(cards.length);

            const totalTopics = cards.reduce((sum, card) => sum + (Array.isArray(card.links) ? card.links.length : 0), 0);
            if (topicsCountEl) topicsCountEl.textContent = `${totalTopics}+`;

            // Group by categoryMain (preserve first-seen order)
            const groups = new Map();
            for (const card of cards) {
                const key = card.categoryMain || 'Other';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(card);
            }

            // Render tiles (one tile per categoryMain)
            const topicsGrid = document.getElementById('footerTopicsGrid');
            if (!topicsGrid) return;

            topicsGrid.innerHTML = '';

            for (const [categoryMain, groupCards] of groups.entries()) {
                const icon = mainIcons[categoryMain] || '•';
                const categoriesInGroup = groupCards.length;
                const topicsInGroup = groupCards.reduce((sum, c) => sum + (Array.isArray(c.links) ? c.links.length : 0), 0);

                const a = document.createElement('a');
                a.href = '/#cards-container';
                a.className = 'footer-topic-link';
                a.setAttribute('aria-label', `Explore ${categoryMain} topics`);

                // Short count label like "5 categories • 12 topics"
                a.innerHTML = `
                    <div class="footer-topic">
                        <div class="footer-topic-title">${icon} ${categoryMain}</div>
                        <div class="footer-topic-count">${categoriesInGroup} categories • ${topicsInGroup} topics</div>
                    </div>
                `;

                topicsGrid.appendChild(a);
            }

            console.log('✅ Footer content loaded successfully');

        } catch (error) {
            console.error('❌ Error loading footer content:', error);
            const topicsGrid = document.getElementById('footerTopicsGrid');
            if (topicsGrid) {
                topicsGrid.innerHTML = `
                    <a href="/" class="footer-topic-link" aria-label="Visit homepage">
                        <div class="footer-topic">
                            <div class="footer-topic-title">🏠 Home</div>
                            <div class="footer-topic-count">Unable to load footer topics</div>
                        </div>
                    </a>
                `;
            }
        }
    }

    // Load content when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooterContent);
    } else {
        loadFooterContent();
    }
})();
