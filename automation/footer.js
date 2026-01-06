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
        'Statistics': '📊',
        'Machine Learning': '🤖',
        'Wellness': '🧘',
        'Life Skills': '💬'
    };

    function getPathPrefix() {
        // window.location.pathname = /pages/foo/bar.html => depth ~ 2+; /index.html => 1
        // We want a prefix that can reach the site root.
        const depth = (window.location.pathname.match(/\//g) || []).length - 1;
        return depth > 0 ? '../'.repeat(depth) : './';
    }

    async function loadJsonWithFallback(paths) {
        for (const path of paths) {
            try {
                const res = await fetch(path);
                if (res.ok) return await res.json();
            } catch (e) {
                // try next
            }
        }
        return null;
    }

    function showFooterLoadError(message) {
        const targets = [
            document.getElementById('footerTopicsGrid'),
            document.getElementById('footerExploreSections'),
            document.getElementById('footerPopularCategories')
        ].filter(Boolean);

        targets.forEach((el) => {
            el.innerHTML = `
                <div style="
                    background: rgba(220, 53, 69, 0.10);
                    border: 1px solid rgba(220, 53, 69, 0.25);
                    color: var(--footer-text);
                    padding: 10px 12px;
                    border-radius: 10px;
                    font-weight: 700;
                    text-align: center;
                ">
                    Footer couldn't load cards.json (${message}).
                    <div style="font-weight: 600; margin-top: 6px; opacity: 0.85;">
                        Tip: open the site via a local server (not file://) so fetch() works.
                    </div>
                </div>
            `;
        });
    }

    async function loadFooterContent() {
        try {
            const prefix = getPathPrefix();

            // cards.json (supports deep pages)
            const cards = await loadJsonWithFallback([
                // relative-first (works on deep pages)
                prefix + 'data/cards.json',
                // absolute (works when hosted at domain root)
                '/data/cards.json',
                '../data/cards.json',
                '../../data/cards.json',
                '../../../data/cards.json',
                '../../../../data/cards.json',
                '../../../../../data/cards.json'
            ]);

            if (!cards) {
                showFooterLoadError('cards.json not found');
                return;
            }

            const cardsArray = Array.isArray(cards.cards) ? cards.cards : [];

            // cardsOrder.json (optional)
            const order = await loadJsonWithFallback([
                prefix + 'data/cardsOrder.json',
                '/data/cardsOrder.json',
                '../data/cardsOrder.json',
                '../../data/cardsOrder.json',
                '../../../data/cardsOrder.json',
                '../../../../data/cardsOrder.json',
                '../../../../../data/cardsOrder.json'
            ]);

            const categoriesOrder = Array.isArray(order?.categoriesOrder) ? order.categoriesOrder : [];

            // Stats
            const categoriesCountEl = document.getElementById('footerCategoriesCount');
            const topicsCountEl = document.getElementById('footerTopicsCount');

            if (categoriesCountEl) categoriesCountEl.textContent = String(cardsArray.length);

            const totalTopics = cardsArray.reduce((sum, card) => sum + (Array.isArray(card.links) ? card.links.length : 0), 0);
            if (topicsCountEl) topicsCountEl.textContent = `${totalTopics}+`;

            // Group by categoryMain (preserve insertion order)
            const groups = new Map();
            for (const card of cardsArray) {
                const key = card.categoryMain || 'Other';
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(card);
            }

            // Ordered keys: cardsOrder.json first, then remaining
            const orderedKeys = [];
            const seen = new Set();
            for (const key of categoriesOrder) {
                if (groups.has(key) && !seen.has(key)) {
                    orderedKeys.push(key);
                    seen.add(key);
                }
            }
            for (const key of groups.keys()) {
                if (!seen.has(key)) {
                    orderedKeys.push(key);
                    seen.add(key);
                }
            }

            // Render tiles (one tile per categoryMain)
            const topicsGrid = document.getElementById('footerTopicsGrid');
            if (topicsGrid) {
                topicsGrid.innerHTML = '';

                for (const categoryMain of orderedKeys) {
                    const groupCards = groups.get(categoryMain) || [];
                    const icon = mainIcons[categoryMain] || '•';
                    const categoriesInGroup = groupCards.length;
                    const topicsInGroup = groupCards.reduce((sum, c) => sum + (Array.isArray(c.links) ? c.links.length : 0), 0);

                    const a = document.createElement('a');
                    a.href = '/#cards-container';
                    a.className = 'footer-topic-link';
                    a.setAttribute('aria-label', `Explore ${categoryMain} topics`);

                    a.innerHTML = `
                        <div class="footer-topic">
                            <div class="footer-topic-title">${icon} ${categoryMain}</div>
                            <div class="footer-topic-count">${categoriesInGroup} categories • ${topicsInGroup} topics</div>
                        </div>
                    `;

                    topicsGrid.appendChild(a);
                }
            }

            // Popular Categories (top N by topic count)
            const popularEl = document.getElementById('footerPopularCategories');
            if (popularEl) {
                const ranked = [...cardsArray]
                    .map((c) => ({
                        title: c.title,
                        topicCount: Array.isArray(c.links) ? c.links.length : 0
                    }))
                    .sort((a, b) => b.topicCount - a.topicCount)
                    .slice(0, 10);

                popularEl.innerHTML = '';

                ranked.forEach((c) => {
                    const chip = document.createElement('a');
                    chip.href = '/#cards-container';
                    chip.textContent = `${c.title} (${c.topicCount})`;
                    chip.style.cssText = `
                        text-decoration: none;
                        color: var(--footer-link);
                        background: rgba(102, 126, 234, 0.10);
                        border: 1px solid rgba(102, 126, 234, 0.25);
                        padding: 6px 10px;
                        border-radius: 999px;
                        font-size: 0.85rem;
                        font-weight: 600;
                        line-height: 1;
                    `;
                    chip.addEventListener('mouseenter', () => chip.style.color = 'var(--footer-link-hover)');
                    chip.addEventListener('mouseleave', () => chip.style.color = 'var(--footer-link)');
                    popularEl.appendChild(chip);
                });
            }

            // Explore by Section (categoryMain -> cards -> top links)
            const exploreEl = document.getElementById('footerExploreSections');
            if (exploreEl) {
                exploreEl.innerHTML = '';

                // basic accordion without external deps
                orderedKeys.forEach((categoryMain, idx) => {
                    const groupCards = groups.get(categoryMain) || [];
                    const icon = mainIcons[categoryMain] || '•';

                    const section = document.createElement('div');
                    section.style.cssText = `
                        background: var(--footer-category-bg);
                        border-radius: 12px;
                        margin-bottom: 10px;
                        overflow: hidden;
                        border: 1px solid rgba(0,0,0,0.06);
                    `;

                    const headerId = `footerSectionHeader_${idx}`;
                    const bodyId = `footerSectionBody_${idx}`;

                    const topicsInGroup = groupCards.reduce((sum, c) => sum + (Array.isArray(c.links) ? c.links.length : 0), 0);

                    section.innerHTML = `
                        <button id="${headerId}" type="button" style="
                            width: 100%;
                            text-align: left;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            gap: 10px;
                            padding: 12px 14px;
                            background: transparent;
                            border: none;
                            cursor: pointer;
                            font-weight: 800;
                            color: var(--footer-text);
                        ">
                            <span>${icon} ${categoryMain}</span>
                            <span style="font-weight:700; color: var(--footer-link); font-size: 0.9rem;">${groupCards.length} categories • ${topicsInGroup} topics</span>
                        </button>
                        <div id="${bodyId}" style="display:none; padding: 0 14px 14px;">
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin-top: 10px;"></div>
                        </div>
                    `;

                    const body = section.querySelector(`#${bodyId}`);
                    const grid = body.querySelector('div');

                    // Sort cards in group by topic count desc for usefulness
                    const sortedGroupCards = [...groupCards].sort((a, b) => (b.links?.length || 0) - (a.links?.length || 0));

                    sortedGroupCards.forEach((card) => {
                        const cardBox = document.createElement('div');
                        cardBox.style.cssText = `
                            background: rgba(255,255,255,0.6);
                            border-radius: 12px;
                            padding: 10px 12px;
                            border: 1px solid rgba(0,0,0,0.06);
                        `;
                        cardBox.innerHTML = `
                            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:6px;">
                                <div style="font-weight:800; font-size:0.95rem;">${card.title}</div>
                                <div style="font-weight:700; color: var(--footer-link); font-size:0.85rem;">${(card.links||[]).length}</div>
                            </div>
                            <ul style="margin:0; padding-left: 18px; font-size:0.85rem; line-height:1.45;">
                                ${(card.links || []).slice(0, 3).map(l => `<li><a href="/${l.url}" style="color: var(--footer-link); text-decoration:none;">${l.text}</a></li>`).join('')}
                                ${(card.links || []).length > 3 ? `<li><a href="/#cards-container" style="color: var(--footer-link-hover); text-decoration:none; font-weight:700;">More…</a></li>` : ''}
                            </ul>
                        `;
                        grid.appendChild(cardBox);
                    });

                    // Toggle behavior
                    const headerBtn = section.querySelector(`#${headerId}`);
                    headerBtn.addEventListener('click', () => {
                        const isOpen = body.style.display !== 'none';
                        body.style.display = isOpen ? 'none' : 'block';
                    });

                    // Open first section by default
                    if (idx === 0) body.style.display = 'block';

                    exploreEl.appendChild(section);
                });
            }

        } catch (error) {
            showFooterLoadError(error?.message || 'unknown error');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooterContent);
    } else {
        loadFooterContent();
    }
})();
