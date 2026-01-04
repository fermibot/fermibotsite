// ============================================
// FOOTER DYNAMIC CONTENT LOADER
// ============================================

(function() {
    // Category grouping and icons
    const categoryGroups = {
        'Mathematics & Probability': {
            icon: '📊',
            keywords: ['Bernoulli', 'Binomial', 'Poisson', 'Exponential', 'Geometric', 'Conditional', 'Expectation', 'Miscellaneous Concepts', 'Strategy', 'Graphs', 'Mathematics']
        },
        'Artificial Intelligence': {
            icon: '🤖',
            keywords: ['Machine Learning', 'Artificial Intelligence']
        },
        'Computer Science': {
            icon: '💻',
            keywords: ['Algorithms', 'Hashing', 'Sorting']
        },
        'Life Sciences': {
            icon: '🧬',
            keywords: ['Biology', 'Biochemistry', 'Physiology', 'Zoology']
        },
        'Simulation & Modeling': {
            icon: '🎲',
            keywords: ['Monte Carlo', 'Simulation']
        },
        'Art & Geometry': {
            icon: '🎨',
            keywords: ['Geometry', 'Mathematical Art']
        },
        'Personal Development': {
            icon: '🌟',
            keywords: ['Wellness', 'Life Skills']
        }
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
            let successPath = null;

            // Try each path until one works
            for (const path of possiblePaths) {
                try {
                    console.log('🔍 Trying to load cards.json from:', path);
                    const response = await fetch(path);
                    if (response.ok) {
                        data = await response.json();
                        successPath = path;
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

            const cards = data.cards || [];

            // Update stats
            const categoriesCountEl = document.getElementById('categoriesCount');
            const topicsCountEl = document.getElementById('topicsCount');

            if (categoriesCountEl) {
                categoriesCountEl.textContent = cards.length;
            }

            if (topicsCountEl) {
                const totalTopics = cards.reduce((sum, card) => sum + (card.links ? card.links.length : 0), 0);
                topicsCountEl.textContent = totalTopics + '+';
            }

            // Group categories
            const groupedCategories = {};

            cards.forEach(card => {
                let assigned = false;
                for (const [groupName, groupInfo] of Object.entries(categoryGroups)) {
                    if (groupInfo.keywords.some(keyword =>
                        card.category.includes(keyword) || card.title.includes(keyword)
                    )) {
                        if (!groupedCategories[groupName]) {
                            groupedCategories[groupName] = {
                                icon: groupInfo.icon,
                                categories: []
                            };
                        }
                        groupedCategories[groupName].categories.push(card);
                        assigned = true;
                        break;
                    }
                }
            });

            // Render sections
            const sectionsContainer = document.getElementById('footerSections');
            if (!sectionsContainer) {
                console.error('❌ Footer sections container not found');
                return;
            }

            sectionsContainer.innerHTML = '';

            Object.entries(groupedCategories).forEach(([groupName, groupData]) => {
                const section = document.createElement('div');
                section.className = 'footer-section';

                const totalInGroup = groupData.categories.reduce((sum, cat) =>
                    sum + (cat.links ? cat.links.length : 0), 0
                );

                section.innerHTML = `
                    <div class="footer-section-header">
                        <span class="footer-section-icon">${groupData.icon}</span>
                        <h3 class="footer-section-title">${groupName}</h3>
                        <span class="footer-section-count">${totalInGroup}</span>
                    </div>
                    <div class="footer-category-list">
                        ${groupData.categories.map(cat => `
                            <a href="/#cards-container" class="footer-category-item"
                               title="${cat.title} - ${cat.links ? cat.links.length : 0} topic(s)">
                                <span class="footer-category-name">${cat.title}</span>
                                <span class="footer-category-badge">${cat.links ? cat.links.length : 0}</span>
                            </a>
                        `).join('')}
                    </div>
                `;

                sectionsContainer.appendChild(section);
            });

            console.log('✅ Footer content loaded successfully');

        } catch (error) {
            console.error('❌ Error loading footer content:', error);
            const sectionsContainer = document.getElementById('footerSections');
            if (sectionsContainer) {
                sectionsContainer.innerHTML = `
                    <div class="footer-loading">
                        Unable to load categories. <a href="/" style="color: var(--footer-link);">Visit homepage</a>
                    </div>
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

    // Back to Top Button Functionality
    function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) {
            console.log('⚠️ Back to top button not found');
            return;
        }

        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        function scrollToTop(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        backToTop.addEventListener('click', scrollToTop);
        toggleBackToTop();

        backToTop.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop(e);
            }
        });

        console.log('✅ Back to top button initialized');
    }

    // Initialize back to top after footer is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackToTop);
    } else {
        initBackToTop();
    }
})();
