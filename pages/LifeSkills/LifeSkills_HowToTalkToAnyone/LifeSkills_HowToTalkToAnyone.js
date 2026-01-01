/* ============================================
   HOW TO TALK TO ANYONE - ENHANCED VISUALIZATION
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Section colors - Vibrant Rainbow
    SECTION_COLORS: {
        '01': '#E53935',  // Vibrant Red - First impressions
        '02': '#FB8C00',  // Vibrant Orange - Conversation starters
        '03': '#FFD600',  // Vibrant Yellow - Big player talk
        '04': '#43A047',  // Vibrant Green - Insider status
        '05': '#00ACC1',  // Vibrant Cyan - Rapport building
        '06': '#1E88E5',  // Vibrant Blue - Praise techniques
        '07': '#5E35B1',  // Vibrant Purple - Phone skills
        '08': '#D81B60',  // Vibrant Pink - Party networking
        '09': '#6D4C41'   // Vibrant Brown - Winner tricks
    },

    // Section icons
    SECTION_ICONS: {
        '01': '👀',
        '02': '💬',
        '03': '🎩',
        '04': '🔑',
        '05': '🤝',
        '06': '⭐',
        '07': '📞',
        '08': '🎉',
        '09': '🏆'
    },

    // Section full names
    SECTION_NAMES: {
        '01': 'You only have 10 seconds to show you\'re a somebody',
        '02': 'How to Know What to Say After You Say "Hi"',
        '03': 'How to talk like the big boys \'n\' girls',
        '04': 'How to be an insider in any crowd',
        '05': 'Why, we\'re just alike!',
        '06': 'The power of praise, the folly of flattery',
        '07': 'Direct dial their hearts',
        '08': 'How to work a party like a politician works a room',
        '09': 'Little tricks of big winners'
    },

    // Layout dimensions
    DIAMETER: 1000,
    STORAGE_KEY: 'how-to-talk-learned-chapters'
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    layout: 'radial',
    selectedNode: null,
    lockedNode: null,
    searchQuery: '',
    activeSections: new Set(), // Changed from activeSection to Set for multi-select
    learnedChapters: new Set(),
    data: null,
    root: null
};

// Load learned chapters from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            state.learnedChapters = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

// Save learned chapters to localStorage
function saveProgress() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify([...state.learnedChapters]));
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Extract section number from node name
function getSectionNumber(d) {
    if (!d || !d.data || !d.data.name) return null;
    const name = d.data.name;

    // Check if it's a section node
    if (name.includes('section_name')) {
        const match = name.match(/section_name\.(\d{2})/);
        return match ? match[1] : null;
    }

    // Check imports for chapter nodes
    if (d.data.imports && d.data.imports.length > 0) {
        const importMatch = d.data.imports[0].match(/section_name\.(\d{2})/);
        return importMatch ? importMatch[1] : null;
    }

    return null;
}

// Get section color for a node
function getSectionColor(d) {
    const sectionNum = getSectionNumber(d);
    return sectionNum ? CONFIG.SECTION_COLORS[sectionNum] : '#666666';
}

// Get section icon for a node
function getSectionIcon(d) {
    const sectionNum = getSectionNumber(d);
    return sectionNum ? CONFIG.SECTION_ICONS[sectionNum] : '';
}

// Get section name for a node
function getSectionName(d) {
    const sectionNum = getSectionNumber(d);
    return sectionNum ? CONFIG.SECTION_NAMES[sectionNum] : '';
}

// Check if node is a chapter (not a section)
function isChapter(d) {
    return d.data.name && d.data.name.includes('chapter_name');
}

// Check if node is a section
function isSection(d) {
    return d.data.name && d.data.name.includes('section_name');
}

// Count connections for a node
function countConnections(d, links) {
    return links.filter(l => l.source === d || l.target === d).length;
}

// ============================================
// HIERARCHY FUNCTIONS
// ============================================

function packageHierarchy(classes) {
    const map = {};

    function find(name, data) {
        let node = map[name];
        if (!node) {
            node = map[name] = data || { name: name, children: [] };
            if (name.length) {
                const i = name.lastIndexOf(".");
                node.parent = find(name.substring(0, i));
                node.parent.children.push(node);
                node.key = name.substring(i + 1);
            }
        }
        return node;
    }

    classes.forEach(function(d) {
        find(d.name, d);
    });

    return d3.hierarchy(map[""]);
}

function packageImports(nodes) {
    const map = {};
    const imports = [];

    nodes.forEach(function(d) {
        map[d.data.name] = d;
    });

    nodes.forEach(function(d) {
        if (d.data.imports) {
            d.data.imports.forEach(function(i) {
                if (map[i]) {
                    imports.push(map[d.data.name].path(map[i]));
                }
            });
        }
    });

    return imports;
}

// ============================================
// TOOLTIP (HOVER)
// ============================================

let tooltip = null;

function createTooltip() {
    tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip');
    return tooltip;
}

function showTooltip(d, event) {
    if (!tooltip) createTooltip();

    // Show tooltip for all nodes (chapters and sections)
    const summary = d.data.summary || 'No summary available.';
    const truncatedSummary = summary.length > 150 ? summary.substring(0, 150) + '...' : summary;

    tooltip.html(`
        <div class="tooltip-title">${d.data.key || d.data.name}</div>
        <div class="tooltip-summary">${truncatedSummary}</div>
    `);

    // Position tooltip
    positionTooltip(event);

    tooltip.classed('visible', true);
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classed('visible', false);
    }
}

function positionTooltip(event) {
    if (!tooltip) return;

    // Position tooltip in the center of the visualization diagram, slightly higher
    const container = document.getElementById('visualization-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const tooltipWidth = 300; // max-width from CSS
    const tooltipHeight = 100; // approximate

    // Center horizontally, position higher vertically (subtract 80px offset)
    const left = rect.left + (rect.width - tooltipWidth) / 2;
    const top = rect.top + (rect.height - tooltipHeight) / 2 - 80 + window.scrollY;

    tooltip
        .style('left', Math.max(10, left) + 'px')
        .style('top', Math.max(10, top) + 'px');
}

// ============================================
// INFO CARD (CLICK/LOCK)
// ============================================

let infoCard = null;
let infoCardBackdrop = null;

function createInfoCard() {
    // Create backdrop
    if (!infoCardBackdrop) {
        infoCardBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', handleBackgroundClick);
    }

    // Create info card
    infoCard = d3.select('body')
        .append('div')
        .attr('class', 'info-card')
        .attr('id', 'info-card');

    return infoCard;
}

function showInfoCard(d, event) {
    if (!infoCard) createInfoCard();
    if (!isChapter(d)) return;

    const sectionNum = getSectionNumber(d);
    const isLearned = state.learnedChapters.has(d.data.key);

    infoCard
        .attr('data-section', sectionNum)
        .html(`
            <div class="info-card-header">
                <span class="info-card-icon">${getSectionIcon(d)}</span>
                <div class="info-card-titles">
                    <h5 class="info-card-chapter">${d.data.key}</h5>
                    <p class="info-card-section">${getSectionName(d)}</p>
                </div>
            </div>
            <div class="info-card-body">
                <p class="info-card-summary">${d.data.summary || 'No summary available.'}</p>
            </div>
            <div class="info-card-footer">
                <span class="info-card-connections">${countConnections(d, currentLinks)} connection(s)</span>
                <button class="btn btn-sm btn-outline-secondary mark-learned-btn ${isLearned ? 'learned' : ''}"
                        onclick="toggleLearned('${d.data.key.replace(/'/g, "\\'")}')">
                    ${isLearned ? '✓ Learned' : 'Mark as Learned'}
                </button>
            </div>
        `);

    // Position the card
    positionInfoCard(event);

    // Show backdrop and card
    if (infoCardBackdrop) {
        infoCardBackdrop.classed('visible', true);
    }
    infoCard.classed('visible', true);
}

function hideInfoCard() {
    if (infoCard) {
        infoCard.classed('visible', false);
    }
    if (infoCardBackdrop) {
        infoCardBackdrop.classed('visible', false);
    }
}

function positionInfoCard(event) {
    if (!infoCard) return;

    // Position card in the center of the viewport for maximum visibility
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const cardWidth = 320;
    const cardHeight = 250; // Approximate height

    const left = (viewportWidth - cardWidth) / 2;
    const top = (viewportHeight - cardHeight) / 2 + window.scrollY;

    infoCard
        .style('left', Math.max(10, left) + 'px')
        .style('top', Math.max(10, top) + 'px');
}

// ============================================
// PROGRESS TRACKER
// ============================================

function toggleLearned(chapterKey) {
    if (state.learnedChapters.has(chapterKey)) {
        state.learnedChapters.delete(chapterKey);
    } else {
        state.learnedChapters.add(chapterKey);
    }

    saveProgress();
    updateProgressUI();
    updateNodeStyles();

    // Update the button in info card if visible
    const btn = document.querySelector('.mark-learned-btn');
    if (btn) {
        const isLearned = state.learnedChapters.has(chapterKey);
        btn.classList.toggle('learned', isLearned);
        btn.textContent = isLearned ? '✓ Learned' : 'Mark as Learned';
    }
}

function updateProgressUI() {
    const total = 92;
    const learned = state.learnedChapters.size;
    const percentage = Math.round((learned / total) * 100);

    const progressFill = document.querySelector('.progress-bar-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
        progressText.textContent = `${learned}/${total}`;
    }
}

function updateNodeStyles() {
    if (!node) return;

    node.classed('node--learned', d => {
        return isChapter(d) && state.learnedChapters.has(d.data.key);
    });

    // Update text to show/hide checkmark
    node.text(d => {
        const isLearned = state.learnedChapters.has(d.data.key);
        return isLearned ? `✓ ${d.data.key}` : d.data.key;
    });
}

// ============================================
// PROGRESS MODAL
// ============================================

let progressModal = null;
let progressModalBackdrop = null;

function createProgressModal() {
    // Create backdrop
    if (!progressModalBackdrop) {
        progressModalBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', hideProgressModal);
    }

    // Create modal
    progressModal = d3.select('body')
        .append('div')
        .attr('class', 'progress-modal');

    return progressModal;
}

function showProgressModal() {
    if (!progressModal) createProgressModal();
    if (!state.root) return;

    // Group chapters by section
    const chaptersBySection = {};
    state.root.leaves().forEach(d => {
        if (isChapter(d)) {
            const sectionNum = getSectionNumber(d);
            if (sectionNum) {
                if (!chaptersBySection[sectionNum]) {
                    chaptersBySection[sectionNum] = [];
                }
                chaptersBySection[sectionNum].push(d);
            }
        }
    });

    // Build modal content
    let modalHTML = `
        <div class="progress-modal-header">
            <h3 class="progress-modal-title">Learning Progress</h3>
            <button class="progress-modal-close" onclick="hideProgressModal()">×</button>
        </div>
        <div class="progress-modal-body">
    `;

    // Add sections
    Object.keys(CONFIG.SECTION_NAMES).forEach(sectionNum => {
        const chapters = chaptersBySection[sectionNum] || [];
        const learnedCount = chapters.filter(d => state.learnedChapters.has(d.data.key)).length;

        modalHTML += `
            <div class="progress-section">
                <div class="progress-section-header" style="border-color: ${CONFIG.SECTION_COLORS[sectionNum]}">
                    <span class="progress-section-icon">${CONFIG.SECTION_ICONS[sectionNum]}</span>
                    <h4 class="progress-section-title">${CONFIG.SECTION_NAMES[sectionNum]}</h4>
                    <span class="progress-section-count">${learnedCount}/${chapters.length}</span>
                </div>
        `;

        chapters.forEach(d => {
            const isLearned = state.learnedChapters.has(d.data.key);
            modalHTML += `
                <div class="progress-item ${isLearned ? 'learned' : ''}">
                    <input type="checkbox"
                           ${isLearned ? 'checked' : ''}
                           onchange="toggleLearned('${d.data.key.replace(/'/g, "\\'")}'); updateProgressModal()">
                    <label class="progress-item-label">${d.data.key}</label>
                </div>
            `;
        });

        modalHTML += `</div>`;
    });

    modalHTML += `</div>`;

    progressModal.html(modalHTML);

    // Show modal and backdrop
    if (progressModalBackdrop) {
        progressModalBackdrop.classed('visible', true);
    }
    progressModal.classed('visible', true);
}

function hideProgressModal() {
    if (progressModal) {
        progressModal.classed('visible', false);
    }
    if (progressModalBackdrop) {
        progressModalBackdrop.classed('visible', false);
    }
}

function updateProgressModal() {
    // Re-render the modal to reflect changes
    if (progressModal && progressModal.classed('visible')) {
        hideProgressModal();
        setTimeout(() => showProgressModal(), 50);
    }
}

// Make functions globally available
window.showProgressModal = showProgressModal;
window.hideProgressModal = hideProgressModal;
window.updateProgressModal = updateProgressModal;

// ============================================
// SEARCH & FILTER
// ============================================

function handleSearch(query) {
    state.searchQuery = query.toLowerCase();

    console.log('Search:', state.searchQuery, 'Node:', !!node, 'Link:', !!link);

    if (!node || !link) return;

    // Clear section highlighting when searching
    if (state.searchQuery) {
        state.activeSections.clear();
        updateSectionHighlighting();
    }

    if (!state.searchQuery) {
        // Clear filter
        node.classed('node--hidden', false);
        node.classed('node--highlighted', false);
        node.classed('node--dimmed', false);
        link.classed('link--hidden', false);
        link.classed('link--highlighted', false);
        link.classed('link--dimmed', false);
        return;
    }

    // Filter nodes
    let matches = 0;
    node.each(function(d) {
        if (isSection(d)) {
            // Always show sections normally during search
            d3.select(this)
                .classed('node--hidden', false)
                .classed('node--highlighted', false)
                .classed('node--dimmed', false);
            return;
        }

        const nameMatch = d.data.key && d.data.key.toLowerCase().includes(state.searchQuery);
        const summaryMatch = d.data.summary && d.data.summary.toLowerCase().includes(state.searchQuery);
        const found = nameMatch || summaryMatch;

        if (found) {
            matches++;
            // Highlight matching nodes
            d3.select(this)
                .classed('node--hidden', false)
                .classed('node--highlighted', true)
                .classed('node--dimmed', false);
        } else {
            // Dim non-matching nodes
            d3.select(this)
                .classed('node--hidden', false)
                .classed('node--highlighted', false)
                .classed('node--dimmed', true);
        }
    });

    console.log('Found', matches, 'matches');

    // Highlight/dim links based on connected nodes
    link.each(function(d) {
        const sourceNode = d3.select(node.nodes().find(n => d3.select(n).datum() === d.source));
        const targetNode = d3.select(node.nodes().find(n => d3.select(n).datum() === d.target));

        const sourceHighlighted = sourceNode.classed('node--highlighted');
        const targetHighlighted = targetNode.classed('node--highlighted');

        if (sourceHighlighted && targetHighlighted) {
            // Both nodes match - highlight the link
            d3.select(this)
                .classed('link--hidden', false)
                .classed('link--highlighted', true)
                .classed('link--dimmed', false);
        } else if (sourceHighlighted || targetHighlighted) {
            // One node matches - show link normally
            d3.select(this)
                .classed('link--hidden', false)
                .classed('link--highlighted', false)
                .classed('link--dimmed', false);
        } else {
            // Neither node matches - dim the link
            d3.select(this)
                .classed('link--hidden', false)
                .classed('link--highlighted', false)
                .classed('link--dimmed', true);
        }
    });
}

function filterBySection(sectionNum) {
    // Toggle section in the set
    if (state.activeSections.has(sectionNum)) {
        state.activeSections.delete(sectionNum);
    } else {
        state.activeSections.add(sectionNum);
    }

    // Update highlighting based on selected sections
    updateSectionHighlighting();
}

function updateSectionHighlighting() {
    const hasActiveSections = state.activeSections.size > 0;

    if (!hasActiveSections) {
        // No sections selected - show everything normally
        node.classed('node--highlighted', false);
        node.classed('node--dimmed', false);
        link.classed('link--highlighted', false);
        link.classed('link--dimmed', false);
        d3.selectAll('.legend-item').classed('active', false);
    } else {
        // Highlight selected sections, dim others
        node.classed('node--highlighted', d => {
            const nodeSectionNum = getSectionNumber(d);
            return state.activeSections.has(nodeSectionNum);
        });

        node.classed('node--dimmed', d => {
            const nodeSectionNum = getSectionNumber(d);
            return !state.activeSections.has(nodeSectionNum);
        });

        // Highlight links within selected sections
        link.classed('link--highlighted', l => {
            const sourceSectionNum = getSectionNumber(l.source);
            const targetSectionNum = getSectionNumber(l.target);
            return state.activeSections.has(sourceSectionNum) && state.activeSections.has(targetSectionNum);
        });

        link.classed('link--dimmed', l => {
            const sourceSectionNum = getSectionNumber(l.source);
            const targetSectionNum = getSectionNumber(l.target);
            return !state.activeSections.has(sourceSectionNum) || !state.activeSections.has(targetSectionNum);
        });

        // Update legend items
        d3.selectAll('.legend-item').classed('active', function() {
            const sectionNum = this.dataset.section;
            return state.activeSections.has(sectionNum);
        });
    }
}

// ============================================
// MOUSE INTERACTIONS
// ============================================

function mouseovered(d) {
    if (state.lockedNode) return;

    node.each(function(n) {
        n.target = n.source = false;
    });

    link
        .classed("link--target", function(l) {
            if (l.target === d) return l.source.source = true;
        })
        .classed("link--source", function(l) {
            if (l.source === d) return l.target.target = true;
        })
        .filter(function(l) {
            return l.target === d || l.source === d;
        })
        .raise();

    node
        .classed("node--target", function(n) {
            return n.target;
        })
        .classed("node--source", function(n) {
            return n.source;
        });
}

function mouseouted(d) {
    if (state.lockedNode) return;

    link
        .classed("link--target", false)
        .classed("link--source", false);

    node
        .classed("node--target", false)
        .classed("node--source", false);
}

function handleNodeClick(event, d) {
    event.stopPropagation();

    // If clicking a section node, toggle section highlighting
    if (isSection(d)) {
        const sectionNum = getSectionNumber(d);
        if (sectionNum) {
            filterBySection(sectionNum);
        }
        return;
    }

    // For chapter nodes, show info card
    if (state.lockedNode === d) {
        // Unlock
        state.lockedNode = null;
        node.classed('node--locked', false);
        mouseouted(d);
        hideInfoCard();
        hideTooltip();
    } else {
        // Lock this node
        state.lockedNode = d;
        node.classed('node--locked', n => n === d);
        mouseovered(d);
        hideTooltip(); // Hide tooltip when showing info card
        showInfoCard(d, event);
    }
}

function handleBackgroundClick() {
    if (state.lockedNode) {
        const lockedNode = state.lockedNode;
        state.lockedNode = null;
        node.classed('node--locked', false);
        mouseouted(lockedNode);
        hideInfoCard();
        hideTooltip();
    }
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        // Focus search on /
        if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
            event.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.focus();
            return;
        }

        // Escape to clear
        if (event.key === 'Escape') {
            handleBackgroundClick();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = '';
                handleSearch('');
                searchInput.blur();
            }
            return;
        }
    });
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportAsPNG() {
    const svgElement = document.querySelector('#visualization-svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const bbox = svgElement.getBoundingClientRect();
    const scale = 2; // For retina
    canvas.width = bbox.width * scale;
    canvas.height = bbox.height * scale;
    ctx.scale(scale, scale);

    // Fill background
    ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--viz-bg').trim() || '#ffffff';
    ctx.fillRect(0, 0, bbox.width, bbox.height);

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.download = 'how-to-talk-to-anyone-visualization.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
}

function exportAsSVG() {
    const svgElement = document.querySelector('#visualization-svg');
    if (!svgElement) return;

    const svgClone = svgElement.cloneNode(true);
    const svgString = new XMLSerializer().serializeToString(svgClone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'how-to-talk-to-anyone-visualization.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
}

// ============================================
// LEGEND
// ============================================

function createLegend(container) {
    const legendHtml = `
        <div class="legend-header">
            <h5 class="legend-title">Book Sections</h5>
            <div class="progress-inline">
                <div class="progress-bar-wrapper">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">0/92</span>
            </div>
        </div>
        <div class="legend-items">
            ${Object.entries(CONFIG.SECTION_NAMES).map(([num, name]) => `
                <div class="legend-item section-${num}" data-section="${num}" tabindex="0" title="${name}">
                    <span class="legend-color" style="background-color: ${CONFIG.SECTION_COLORS[num]}"></span>
                    <span class="legend-icon">${CONFIG.SECTION_ICONS[num]}</span>
                    <span class="legend-label">${name}</span>
                    <span class="legend-count" id="count-${num}">0</span>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = legendHtml;

    // Add click handlers for legend items
    container.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            filterBySection(item.dataset.section);
        });
    });

    // Add click handler for progress tracker
    const progressInline = container.querySelector('.progress-inline');
    if (progressInline) {
        progressInline.style.cursor = 'pointer';
        progressInline.addEventListener('click', showProgressModal);
    }
}

function updateLegendCounts(nodes) {
    const counts = {};
    Object.keys(CONFIG.SECTION_NAMES).forEach(num => counts[num] = 0);

    nodes.forEach(d => {
        if (isChapter(d)) {
            const sectionNum = getSectionNumber(d);
            if (sectionNum && counts[sectionNum] !== undefined) {
                counts[sectionNum]++;
            }
        }
    });

    Object.entries(counts).forEach(([num, count]) => {
        const el = document.getElementById(`count-${num}`);
        if (el) el.textContent = count;
    });
}

// ============================================
// GRADIENT DEFINITIONS
// ============================================

function createGradients(svg) {
    const defs = svg.append('defs');

    // Create gradients for each section pair
    Object.entries(CONFIG.SECTION_COLORS).forEach(([srcNum, srcColor]) => {
        Object.entries(CONFIG.SECTION_COLORS).forEach(([tgtNum, tgtColor]) => {
            const gradient = defs.append('linearGradient')
                .attr('id', `gradient-${srcNum}-${tgtNum}`)
                .attr('gradientUnits', 'userSpaceOnUse');

            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', srcColor);

            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', tgtColor);
        });
    });

    return defs;
}


// ============================================
// ENTRANCE ANIMATIONS
// ============================================

function animateEntrance() {
    // Animate nodes
    node
        .style('opacity', 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 8)
        .style('opacity', 1);

    // Animate links
    link.each(function() {
        const path = d3.select(this);
        const length = this.getTotalLength();

        path
            .attr('stroke-dasharray', `${length} ${length}`)
            .attr('stroke-dashoffset', length)
            .transition()
            .delay(400)
            .duration(1500)
            .attr('stroke-dashoffset', 0)
            .on('end', function() {
                path.attr('stroke-dasharray', null);
            });
    });
}

// ============================================
// MAIN VISUALIZATION
// ============================================

let svg, node, link, currentLinks;

function createVisualization(data) {
    state.data = data;

    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = radius - 220;  // Slightly smaller to give more room for arcs
    const verticalPadding = 100;  // Extra space at top and bottom
    const totalHeight = diameter + verticalPadding * 2;

    // Clear any existing visualization
    d3.select('#visualization-container').html('');

    // Create SVG with extra vertical space
    svg = d3.select('#visualization-container')
        .append('svg')
        .attr('id', 'visualization-svg')
        .attr('width', diameter)
        .attr('height', totalHeight)
        .attr('viewBox', `0 0 ${diameter} ${totalHeight}`)
        .on('click', handleBackgroundClick);

    // Center the diagram with vertical offset
    const g = svg.append('g')
        .attr('transform', `translate(${radius}, ${radius + verticalPadding})`);

    // Create gradients
    createGradients(svg);

    // Build hierarchy
    const root = packageHierarchy(data).sum(d => d.size);
    state.root = root;

    // Create cluster layout
    const cluster = d3.cluster().size([360, innerRadius]);
    cluster(root);

    // Get links
    const links = packageImports(root.leaves());
    currentLinks = links;

    // Create line generator
    const line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

    // Draw links
    const linkGroup = g.append('g').attr('class', 'links');

    link = linkGroup.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .each(function(d) {
            d.source = d[0];
            d.target = d[d.length - 1];
        })
        .attr('class', d => {
            const srcSection = getSectionNumber(d.source);
            const tgtSection = getSectionNumber(d.target);
            return `link gradient-link link-${srcSection}-${tgtSection}`;
        })
        .attr('d', line)
        .attr('stroke', d => {
            const srcSection = getSectionNumber(d.source);
            const tgtSection = getSectionNumber(d.target);
            return `url(#gradient-${srcSection}-${tgtSection})`;
        });

    // Draw nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');

    node = nodeGroup.selectAll('.node')
        .data(root.leaves())
        .enter()
        .append('text')
        .attr('class', d => {
            const sectionNum = getSectionNumber(d);
            const classes = ['node'];
            if (sectionNum) classes.push(`section-${sectionNum}`);
            if (isSection(d)) classes.push('node-section');
            return classes.join(' ');
        })
        .attr('dy', '0.31em')
        .attr('transform', d => {
            return `rotate(${d.x - 90})translate(${d.y + 8},0)${d.x < 180 ? '' : 'rotate(180)'}`;
        })
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .text(d => {
            const isLearned = state.learnedChapters.has(d.data.key);
            return isLearned ? `✓ ${d.data.key}` : d.data.key;
        })
        .on('mouseover', function(event, d) {
            mouseovered(d);
            if (!state.lockedNode) {
                showTooltip(d, event);
            }
        })
        .on('mouseout', function(event, d) {
            mouseouted(d);
            if (!state.lockedNode) {
                hideTooltip();
            }
        })
        .on('click', handleNodeClick);

    // Update legend counts
    updateLegendCounts(root.leaves());

    // Update progress UI
    updateProgressUI();
    updateNodeStyles();

    // Animate entrance
    animateEntrance();
}

// ============================================
// INITIALIZATION
// ============================================

function enhancedInit() {
    // Load progress from localStorage
    loadProgress();

    // Create legend
    const legendContainer = document.getElementById('legend-container');
    if (legendContainer) {
        createLegend(legendContainer);
    }

    // Update progress UI to show initial state
    updateProgressUI();

    // Create info card
    createInfoCard();

    // Setup search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    // Setup keyboard navigation
    setupKeyboardNavigation();

    // Setup export buttons
    const exportPngBtn = document.getElementById('export-png');
    const exportSvgBtn = document.getElementById('export-svg');
    if (exportPngBtn) exportPngBtn.addEventListener('click', exportAsPNG);
    if (exportSvgBtn) exportSvgBtn.addEventListener('click', exportAsSVG);

    // Load data and create visualization
    d3.json('LifeSkills_HowToTalkToAnyone.json')
        .then(data => {
            state.data = data;
            createVisualization(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            const container = document.getElementById('visualization-container');
            if (container) {
                container.innerHTML = `
                    <div class="loading-overlay">
                        <p>Error loading visualization data.</p>
                    </div>
                `;
            }
        });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhancedInit);
} else {
    enhancedInit();
}

// Make functions available globally for onclick handlers
window.toggleLearned = toggleLearned;
window.exportAsPNG = exportAsPNG;
window.exportAsSVG = exportAsSVG;
