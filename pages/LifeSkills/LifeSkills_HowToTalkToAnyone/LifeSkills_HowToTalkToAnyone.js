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
// UTILITY FUNCTIONS FOR TEXT TRUNCATION
// ============================================

// Function to get short section name (main content, not truncated from front)
function getShortSectionName(sectionNum, maxLength = 40) {
    const fullName = CONFIG.SECTION_NAMES[sectionNum];

    // Define patterns to remove from the beginning
    const prefixPatterns = [
        /^You only have /i,
        /^How to /i,
        /^The power of /i,
        /^Direct dial /i,
        /^Little /i
    ];

    // Apply patterns to get the core name
    let shortName = fullName;
    for (const pattern of prefixPatterns) {
        shortName = shortName.replace(pattern, '');
    }

    // If still too long, truncate from the end (not the beginning)
    if (shortName.length > maxLength) {
        // Try to find a good truncation point (at a space)
        let truncated = shortName.substring(0, maxLength - 3);
        const lastSpace = truncated.lastIndexOf(' ');

        if (lastSpace > maxLength * 0.7) { // If space is in reasonable position
            truncated = truncated.substring(0, lastSpace);
        }

        return truncated + '...';
    }

    return shortName;
}

// Function to get display name for progress tooltip (even shorter)
function getDisplaySectionName(sectionNum, maxLength = 30) {
    const fullName = CONFIG.SECTION_NAMES[sectionNum];

    // Special handling for each section to show the most important part
    const sectionDisplayNames = {
        '01': '10 seconds to show you\'re a somebody',
        '02': 'Know what to say after "Hi"',
        '03': 'Talk like the big players',
        '04': 'Be an insider in any crowd',
        '05': 'Why we\'re just alike!',
        '06': 'Power of praise, folly of flattery',
        '07': 'Direct dial their hearts',
        '08': 'Work a party like a politician',
        '09': 'Little tricks of big winners'
    };

    // Use the pre-defined display names
    const displayName = sectionDisplayNames[sectionNum] || fullName;

    // Truncate if still too long (from the end)
    if (displayName.length > maxLength) {
        let truncated = displayName.substring(0, maxLength - 3);
        const lastSpace = truncated.lastIndexOf(' ');

        if (lastSpace > maxLength * 0.6) { // If space is in reasonable position
            truncated = truncated.substring(0, lastSpace);
        }

        return truncated + '...';
    }

    return displayName;
}

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    layout: 'radial',
    selectedNode: null,
    lockedNode: null,
    searchQuery: '',
    activeSections: new Set(),
    learnedChapters: new Set(),
    data: null,
    root: null,
    activeRelationshipNode: null,
    relationshipLinks: [],
    relationshipCounts: new Map() // Store count of strong relationships per node
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
// TEXT SIMILARITY & RELATIONSHIP FUNCTIONS
// ============================================

// Calculate word frequency for a text
function getWordFrequency(text) {
    if (!text) return {};

    const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3); // Filter out small words

    const freq = {};
    words.forEach(word => {
        freq[word] = (freq[word] || 0) + 1;
    });
    return freq;
}

// Calculate cosine similarity between two texts
function calculateSimilarity(text1, text2) {
    const freq1 = getWordFrequency(text1);
    const freq2 = getWordFrequency(text2);

    const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);

    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;

    allWords.forEach(word => {
        const f1 = freq1[word] || 0;
        const f2 = freq2[word] || 0;
        dotProduct += f1 * f2;
        mag1 += f1 * f1;
        mag2 += f2 * f2;
    });

    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

// Calculate relatedness between a node and all other nodes
function calculateRelatedness(targetNode, allNodes) {
    const targetText = targetNode.data.summary || targetNode.data.key;
    const targetSection = getSectionNumber(targetNode);

    const similarities = allNodes
        .filter(n => n !== targetNode && isChapter(n))
        .map(n => {
            const nodeText = n.data.summary || n.data.key;
            const similarity = calculateSimilarity(targetText, nodeText);
            const nodeSection = getSectionNumber(n);

            // Boost similarity if in same section
            const sectionBoost = nodeSection === targetSection ? 0.1 : 0;

            return {
                node: n,
                similarity: similarity + sectionBoost,
                crossSection: nodeSection !== targetSection
            };
        })
        .sort((a, b) => b.similarity - a.similarity);

    // Get top 3, middle 3, and bottom 3
    const top3 = similarities.slice(0, 3);
    const bottom3 = similarities.slice(-3).reverse();

    // Middle 3 - get from around 33% and 66% of the list
    const midPoint = Math.floor(similarities.length / 2);
    const midStart = Math.max(4, midPoint - 1);
    const middle3 = similarities.slice(midStart, midStart + 3);

    return {
        top: top3,
        middle: middle3,
        bottom: bottom3,
        all: similarities
    };
}

// Calculate relationship counts for all nodes (for badges)
function calculateRelationshipCounts(allNodes) {
    const counts = new Map();
    const STRONG_THRESHOLD = 0.3; // Similarity threshold for "strong" relationship

    allNodes.filter(n => isChapter(n)).forEach(targetNode => {
        const targetText = targetNode.data.summary || targetNode.data.key;
        let strongCount = 0;

        allNodes.filter(n => n !== targetNode && isChapter(n)).forEach(n => {
            const nodeText = n.data.summary || n.data.key;
            const similarity = calculateSimilarity(targetText, nodeText);
            if (similarity >= STRONG_THRESHOLD) {
                strongCount++;
            }
        });

        counts.set(targetNode.data.key, strongCount);
    });

    return counts;
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
// TOOLTIP (HOVER) - FIXED POSITIONING
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

    const summary = d.data.summary || 'No summary available.';
    const truncatedSummary = summary.length > 150 ? summary.substring(0, 150) + '...' : summary;

    tooltip.html(`
        <div class="tooltip-title">${d.data.key || d.data.name}</div>
        <div class="tooltip-summary">${truncatedSummary}</div>
    `);

    // Position tooltip near mouse cursor
    const x = event.clientX;
    const y = event.clientY;

    // Get tooltip dimensions
    const tooltipNode = tooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 300;
    const tooltipHeight = tooltipNode.offsetHeight || 150;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate position (prevent going off-screen)
    let left = x + 15;
    let top = y + 15;

    // Adjust if tooltip would go off right edge
    if (left + tooltipWidth > viewportWidth) {
        left = x - tooltipWidth - 15;
    }

    // Adjust if tooltip would go off bottom edge
    if (top + tooltipHeight > viewportHeight) {
        top = y - tooltipHeight - 15;
    }

    tooltip
        .style('left', Math.max(10, left) + 'px')
        .style('top', Math.max(10, top) + 'px');

    tooltip.classed('visible', true);
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classed('visible', false);
    }
}

// ============================================
// INFO CARD (CLICK/LOCK)
// ============================================

let infoCard = null;
let infoCardBackdrop = null;

function createInfoCard() {
    if (!infoCardBackdrop) {
        infoCardBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', handleBackgroundClick);
    }

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

    positionInfoCard(event);

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

    const cardWidth = 320;
    const cardHeight = 250;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Position near the click, but ensure it's visible
    let left = event ? (event.clientX - cardWidth / 2) : (viewportWidth - cardWidth) / 2;
    let top = event ? (event.clientY - cardHeight / 2) : (viewportHeight - cardHeight) / 2;

    // Keep within viewport bounds
    left = Math.max(10, Math.min(left, viewportWidth - cardWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - cardHeight - 10));

    infoCard
        .style('left', left + 'px')
        .style('top', top + 'px');
}

// ============================================
// PROGRESS TOOLTIPS - FIXED POSITIONING
// ============================================

let progressTooltip = null;
let segmentTooltip = null;

function createProgressTooltip() {
    // Create progress summary tooltip
    progressTooltip = d3.select('body')
        .append('div')
        .attr('class', 'progress-tooltip')
        .attr('id', 'progress-tooltip');

    // Create segment tooltip
    segmentTooltip = d3.select('body')
        .append('div')
        .attr('class', 'segment-tooltip')
        .attr('id', 'segment-tooltip');

    return progressTooltip;
}

function showProgressTooltip(event) {
    if (!progressTooltip) createProgressTooltip();

    const total = 92;
    const learned = state.learnedChapters.size;
    const percentage = Math.round((learned / total) * 100);

    const learnedBySection = {};
    const totalBySection = {};

    Object.keys(CONFIG.SECTION_COLORS).forEach(sec => {
        learnedBySection[sec] = 0;
        totalBySection[sec] = 0;
    });

    if (state.root) {
        state.root.leaves().forEach(d => {
            if (isChapter(d)) {
                const sectionNum = getSectionNumber(d);
                if (sectionNum) {
                    totalBySection[sectionNum]++;
                    if (state.learnedChapters.has(d.data.key)) {
                        learnedBySection[sectionNum]++;
                    }
                }
            }
        });
    }

    let tooltipHTML = `
        <div class="progress-tooltip-title">📊 Progress Summary</div>
        <div class="progress-tooltip-content">
    `;

    // Show all sections in a grid (no scrolling needed)
    Object.keys(CONFIG.SECTION_NAMES).forEach(sectionNum => {
        const learnedCount = learnedBySection[sectionNum] || 0;
        const totalInSection = totalBySection[sectionNum] || 0;
        const sectionPercentage = totalInSection > 0 ? Math.round((learnedCount / totalInSection) * 100) : 0;

        // Use the new display name function that shows the most important part
        const displayName = getDisplaySectionName(sectionNum, 30);

        tooltipHTML += `
            <div class="progress-tooltip-section">
                <div class="progress-tooltip-section-name">
                    <span class="progress-tooltip-section-icon">${CONFIG.SECTION_ICONS[sectionNum]}</span>
                    <span title="${CONFIG.SECTION_NAMES[sectionNum]}">${displayName}</span>
                </div>
                <div class="progress-tooltip-section-count">
                    ${learnedCount}/${totalInSection}
                </div>
            </div>
        `;
    });

    tooltipHTML += `
        </div>
        <div class="progress-tooltip-total">
            <span>Total: ${learned}/${total} chapters</span>
            <span class="progress-tooltip-percentage">${percentage}%</span>
        </div>
    `;

    progressTooltip.html(tooltipHTML);

    // Position the tooltip at mouse or center of progress bar
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;

    const tooltipNode = progressTooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 400;
    const tooltipHeight = tooltipNode.offsetHeight || 300;

    let left = x - tooltipWidth / 2;
    let top = y - tooltipHeight - 20;

    // Adjust if out of bounds
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 10;
    }
    if (top < 10) top = y + 20;

    progressTooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .classed('visible', true);

    if (segmentTooltip) {
        segmentTooltip.classed('visible', false);
    }
}

function hideProgressTooltip() {
    if (progressTooltip) {
        progressTooltip.classed('visible', false);
    }
}

function showSegmentTooltip(event, sectionNum, learned, total) {
    if (!segmentTooltip) createProgressTooltip();

    const percentage = Math.round((learned / total) * 100);
    const sectionName = CONFIG.SECTION_NAMES[sectionNum];
    const shortSectionName = getShortSectionName(sectionNum, 40);

    segmentTooltip.html(`
        <strong>Section ${sectionNum}: ${shortSectionName}</strong>
        <div>${learned}/${total} chapters learned (${percentage}%)</div>
        <div>${CONFIG.SECTION_ICONS[sectionNum]} Click section to filter techniques</div>
    `);

    // Position near the progress segment
    const rect = event.target.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.bottom + 5;

    const tooltipNode = segmentTooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 250;
    const tooltipHeight = tooltipNode.offsetHeight || 100;

    let left = x - tooltipWidth / 2;
    let top = y;

    // Adjust if out of bounds
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight) {
        top = y - tooltipHeight - rect.height - 5;
    }

    segmentTooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .classed('visible', true);

    if (progressTooltip) {
        progressTooltip.classed('visible', false);
    }
}

function hideSegmentTooltip() {
    if (segmentTooltip) {
        segmentTooltip.classed('visible', false);
    }
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

    const btn = document.querySelector('.mark-learned-btn');
    if (btn) {
        const isLearned = state.learnedChapters.has(chapterKey);
        btn.classList.toggle('learned', isLearned);
        btn.textContent = isLearned ? '✓ Learned' : 'Mark as Learned';
    }
}

function toggleSection(sectionNum) {
    if (!state.root) return;

    // Get all chapters in this section
    const chaptersInSection = [];
    state.root.leaves().forEach(d => {
        if (isChapter(d)) {
            const chapterSection = getSectionNumber(d);
            if (chapterSection === sectionNum) {
                chaptersInSection.push(d.data.key);
            }
        }
    });

    // Check if all chapters are learned
    const allLearned = chaptersInSection.every(key => state.learnedChapters.has(key));

    // Toggle: if all are learned, unlearn all; otherwise, learn all
    if (allLearned) {
        chaptersInSection.forEach(key => state.learnedChapters.delete(key));
    } else {
        chaptersInSection.forEach(key => state.learnedChapters.add(key));
    }

    saveProgress();
    updateProgressUI();
    updateNodeStyles();
    updateProgressModal();
}

function updateProgressUI() {
    const total = 92;
    const learned = state.learnedChapters.size;
    const percentage = Math.round((learned / total) * 100);

    const progressWrapper = document.querySelector('.progress-bar-wrapper');
    const progressText = document.querySelector('.progress-text');

    if (!progressWrapper || !state.root) return;

    // Count learned chapters by section
    const learnedBySection = {};
    Object.keys(CONFIG.SECTION_COLORS).forEach(sec => {
        learnedBySection[sec] = 0;
    });

    // Iterate through all chapter nodes and count learned ones by section
    state.root.leaves().forEach(d => {
        if (isChapter(d) && state.learnedChapters.has(d.data.key)) {
            const sectionNum = getSectionNumber(d);
            if (sectionNum && learnedBySection[sectionNum] !== undefined) {
                learnedBySection[sectionNum]++;
            }
        }
    });

    // Clear existing segments
    progressWrapper.innerHTML = '';

    // Create colored segments for each section that has learned chapters
    Object.keys(CONFIG.SECTION_COLORS).forEach(sectionNum => {
        const count = learnedBySection[sectionNum];
        if (count > 0) {
            const segmentWidth = (count / total) * 100;
            const segment = document.createElement('div');
            segment.className = 'progress-bar-segment';
            segment.style.width = `${segmentWidth}%`;
            segment.style.backgroundColor = CONFIG.SECTION_COLORS[sectionNum];
            segment.title = `Section ${sectionNum}: ${count} learned`;
            progressWrapper.appendChild(segment);
        }
    });

    // Update text
    if (progressText) {
        progressText.textContent = `${learned}/${total}`;
    }
}

function updateNodeStyles() {
    if (!node) return;

    node.classed('node--learned', d => {
        return isChapter(d) && state.learnedChapters.has(d.data.key);
    });

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
    if (!progressModalBackdrop) {
        progressModalBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', hideProgressModal);
    }

    progressModal = d3.select('body')
        .append('div')
        .attr('class', 'progress-modal');

    return progressModal;
}

function showProgressModal() {
    if (!progressModal) createProgressModal();
    if (!state.root) return;

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

    let modalHTML = `
        <div class="progress-modal-header">
            <h3 class="progress-modal-title">Learning Progress</h3>
            <button class="progress-modal-close" onclick="hideProgressModal()">×</button>
        </div>
        <div class="progress-modal-body">
    `;

    Object.keys(CONFIG.SECTION_NAMES).forEach(sectionNum => {
        const chapters = chaptersBySection[sectionNum] || [];
        const learnedCount = chapters.filter(d => state.learnedChapters.has(d.data.key)).length;
        const allLearned = learnedCount === chapters.length && chapters.length > 0;

        modalHTML += `
            <div class="progress-section" data-section="${sectionNum}">
                <div class="progress-section-header" style="border-color: ${CONFIG.SECTION_COLORS[sectionNum]}">
                    <input type="checkbox"
                           class="section-toggle-checkbox"
                           ${allLearned ? 'checked' : ''}
                           onchange="toggleSection('${sectionNum}')"
                           title="Check/uncheck all chapters in this section">
                    <span class="progress-section-icon">${CONFIG.SECTION_ICONS[sectionNum]}</span>
                    <h4 class="progress-section-title">${CONFIG.SECTION_NAMES[sectionNum]}</h4>
                    <span class="progress-section-count">${learnedCount}/${chapters.length}</span>
                </div>
        `;

        chapters.forEach(d => {
            const isLearned = state.learnedChapters.has(d.data.key);
            modalHTML += `
                <div class="progress-item section-${sectionNum} ${isLearned ? 'learned' : ''}" data-chapter-key="${d.data.key.replace(/"/g, '&quot;')}">
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
    if (!progressModal || !progressModal.classed('visible') || !state.root) return;

    const modalBody = progressModal.select('.progress-modal-body').node();
    const scrollPosition = modalBody ? modalBody.scrollTop : 0;

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

    // Update section counts and section checkboxes
    Object.keys(CONFIG.SECTION_NAMES).forEach(sectionNum => {
        const chapters = chaptersBySection[sectionNum] || [];
        const learnedCount = chapters.filter(d => state.learnedChapters.has(d.data.key)).length;
        const allLearned = learnedCount === chapters.length && chapters.length > 0;

        // Update count
        const countEl = progressModal.select(`.progress-section:nth-child(${parseInt(sectionNum)}) .progress-section-count`);
        if (countEl.node()) {
            countEl.text(`${learnedCount}/${chapters.length}`);
        }

        // Update section checkbox
        const sectionCheckbox = progressModal.select(`.progress-section[data-section="${sectionNum}"] .section-toggle-checkbox`);
        if (sectionCheckbox.node()) {
            sectionCheckbox.property('checked', allLearned);
        }
    });

    // Update individual chapter checkboxes
    progressModal.selectAll('.progress-item').each(function() {
        const item = d3.select(this);
        const checkbox = item.select('input[type="checkbox"]');
        const chapterKey = this.getAttribute('data-chapter-key');

        if (!chapterKey) return;

        const isLearned = state.learnedChapters.has(chapterKey);

        checkbox.property('checked', isLearned);
        item.classed('learned', isLearned);
    });

    if (modalBody) {
        modalBody.scrollTop = scrollPosition;
    }
}

window.showProgressModal = showProgressModal;
window.hideProgressModal = hideProgressModal;
window.updateProgressModal = updateProgressModal;

// ============================================
// SEARCH & FILTER
// ============================================

function handleSearch(query) {
    state.searchQuery = query.toLowerCase();

    if (!node || !link) return;

    const counter = document.getElementById('search-counter');

    if (state.searchQuery) {
        state.activeSections.clear();
        updateSectionHighlighting();
    }

    if (!state.searchQuery) {
        node.classed('node--hidden', false);
        node.classed('node--highlighted', false);
        node.classed('node--dimmed', false);
        link.classed('link--hidden', false);
        link.classed('link--highlighted', false);
        link.classed('link--dimmed', false);

        if (counter) {
            counter.classList.remove('visible', 'has-results', 'no-results');
        }
        return;
    }

    let matches = 0;
    node.each(function(d) {
        if (isSection(d)) {
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
            d3.select(this)
                .classed('node--hidden', false)
                .classed('node--highlighted', true)
                .classed('node--dimmed', false);
        } else {
            d3.select(this)
                .classed('node--hidden', false)
                .classed('node--highlighted', false)
                .classed('node--dimmed', true);
        }
    });

    if (counter) {
        counter.textContent = `${matches} ${matches === 1 ? 'match' : 'matches'}`;
        counter.classList.add('visible');
        counter.classList.toggle('has-results', matches > 0);
        counter.classList.toggle('no-results', matches === 0);
    }

    link.each(function(d) {
        const sourceNode = d3.select(node.nodes().find(n => d3.select(n).datum() === d.source));
        const targetNode = d3.select(node.nodes().find(n => d3.select(n).datum() === d.target));

        const sourceHighlighted = sourceNode.classed('node--highlighted');
        const targetHighlighted = targetNode.classed('node--highlighted');

        if (sourceHighlighted && targetHighlighted) {
            d3.select(this)
                .classed('link--hidden', false)
                .classed('link--highlighted', true)
                .classed('link--dimmed', false);
        } else if (sourceHighlighted || targetHighlighted) {
            d3.select(this)
                .classed('link--hidden', false)
                .classed('link--highlighted', false)
                .classed('link--dimmed', false);
        } else {
            d3.select(this)
                .classed('link--hidden', false)
                .classed('link--highlighted', false)
                .classed('link--dimmed', true);
        }
    });
}

function filterBySection(sectionNum) {
    if (state.activeSections.has(sectionNum)) {
        state.activeSections.delete(sectionNum);
    } else {
        state.activeSections.add(sectionNum);
    }

    updateSectionHighlighting();
}

function updateSectionHighlighting() {
    const hasActiveSections = state.activeSections.size > 0;

    if (!hasActiveSections) {
        node.classed('node--highlighted', false);
        node.classed('node--dimmed', false);
        link.classed('link--highlighted', false);
        link.classed('link--dimmed', false);
        d3.selectAll('.legend-item').classed('active', false);
    } else {
        node.classed('node--highlighted', d => {
            const nodeSectionNum = getSectionNumber(d);
            return state.activeSections.has(nodeSectionNum);
        });

        node.classed('node--dimmed', d => {
            const nodeSectionNum = getSectionNumber(d);
            return !state.activeSections.has(nodeSectionNum);
        });

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

    if (isSection(d)) {
        const sectionNum = getSectionNumber(d);
        if (sectionNum) {
            filterBySection(sectionNum);
        }
        return;
    }

    if (state.lockedNode === d) {
        state.lockedNode = null;
        node.classed('node--locked', false);
        mouseouted(d);
        hideInfoCard();
        hideTooltip();
    } else {
        // Remove lock from previously locked node
        node.classed('node--locked', n => n === d);

        // Set new locked node
        state.lockedNode = d;
        mouseovered(d);
        hideTooltip();
        showInfoCard(d, event);
    }
}

function handleBackgroundClick() {
    if (state.lockedNode) {
        state.lockedNode = null;
        node.classed('node--locked', false);
        hideInfoCard();
        hideTooltip();
    }

    // Also hide relationship links
    hideRelationshipLinks();
}

// ============================================
// RELATIONSHIP PANEL & LEGEND
// ============================================

let relationshipPanel = null;
let miniLegend = null;

function createRelationshipPanel() {
    if (!relationshipPanel) {
        relationshipPanel = d3.select('body')
            .append('div')
            .attr('class', 'relationship-panel')
            .attr('id', 'relationship-panel');
    }
    return relationshipPanel;
}

function createMiniLegend() {
    if (!miniLegend) {
        miniLegend = d3.select('body')
            .append('div')
            .attr('class', 'mini-legend')
            .attr('id', 'mini-legend')
            .html(`
                <div class="mini-legend-title">Relationship Strength</div>
                <div class="mini-legend-item">
                    <span class="mini-legend-dot" style="background: #43A047;"></span>
                    <span>Most Related (Top 3)</span>
                </div>
                <div class="mini-legend-item">
                    <span class="mini-legend-dot" style="background: #FB8C00;"></span>
                    <span>Moderately Related</span>
                </div>
                <div class="mini-legend-item">
                    <span class="mini-legend-dot" style="background: #E53935;"></span>
                    <span>Least Related (Bottom 3)</span>
                </div>
            `);
    }
    return miniLegend;
}

function showRelationshipPanel(d, related) {
    if (!relationshipPanel) createRelationshipPanel();

    const avgSimilarity = (related.all.reduce((sum, r) => sum + r.similarity, 0) / related.all.length * 100).toFixed(0);
    const maxSimilarity = (related.top[0].similarity * 100).toFixed(0);

    let panelHTML = `
        <div class="relationship-panel-header">
            <div class="relationship-panel-icon">${getSectionIcon(d)}</div>
            <div class="relationship-panel-title">
                <h5>${d.data.key}</h5>
                <p>Related Techniques</p>
            </div>
            <button class="relationship-panel-close" onclick="hideRelationshipLinks()">×</button>
        </div>
        <div class="relationship-panel-stats">
            <div class="stat-item">
                <span class="stat-value">9</span>
                <span class="stat-label">Shown</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${avgSimilarity}%</span>
                <span class="stat-label">Avg</span>
            </div>
            <div class="stat-item">
                <span class="stat-value">${maxSimilarity}%</span>
                <span class="stat-label">Max</span>
            </div>
        </div>
        <div class="relationship-panel-body">
    `;

    const groups = [
        { type: 'top', items: related.top, color: '#43A047', label: 'Most Related', icon: '🔥' },
        { type: 'middle', items: related.middle, color: '#FB8C00', label: 'Moderately Related', icon: '➡️' },
        { type: 'bottom', items: related.bottom, color: '#E53935', label: 'Least Related', icon: '⚪' }
    ];

    groups.forEach(group => {
        panelHTML += `
            <div class="relationship-group">
                <div class="relationship-group-header">
                    <span class="relationship-group-icon">${group.icon}</span>
                    <span class="relationship-group-label" style="color: ${group.color}">${group.label}</span>
                </div>
                <div class="relationship-items">
        `;

        group.items.forEach(item => {
            const simPercent = (item.similarity * 100).toFixed(0);
            const crossSectionBadge = item.crossSection ? '<span class="cross-section-badge">Cross-Section</span>' : '';
            panelHTML += `
                <div class="relationship-item" data-node-key="${item.node.data.key}">
                    <div class="relationship-item-bar" style="width: ${simPercent}%; background: ${group.color};"></div>
                    <div class="relationship-item-content">
                        <span class="relationship-item-name">${item.node.data.key}</span>
                        ${crossSectionBadge}
                        <span class="relationship-item-score">${simPercent}%</span>
                    </div>
                </div>
            `;
        });

        panelHTML += `
                </div>
            </div>
        `;
    });

    panelHTML += `</div>`;

    relationshipPanel.html(panelHTML);
    relationshipPanel.classed('visible', true);
}

function hideRelationshipPanel() {
    if (relationshipPanel) {
        relationshipPanel.classed('visible', false);
    }
}

function showMiniLegend() {
    if (!miniLegend) createMiniLegend();
    miniLegend.classed('visible', true);
}

function hideMiniLegend() {
    if (miniLegend) {
        miniLegend.classed('visible', false);
    }
}

// ============================================
// RELATIONSHIP LINK VISUALIZATION
// ============================================

function showRelationshipLinks(event, d) {
    event.stopPropagation();

    if (!state.root) return;

    // If clicking the same node, toggle off
    if (state.activeRelationshipNode === d) {
        hideRelationshipLinks();
        return;
    }

    // Clear previous relationship visualization
    hideRelationshipLinks();

    // Set active node
    state.activeRelationshipNode = d;

    // Calculate relatedness
    const allNodes = state.root.leaves();
    const related = calculateRelatedness(d, allNodes);

    // Show the relationship panel
    showRelationshipPanel(d, related);

    // Create a curved line generator
    const line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

    // Get the link group
    const linkGroup = d3.select('.links');

    // Add relationship links with sequential animation
    const relationships = [
        { type: 'top', items: related.top, color: '#43A047', label: 'Most Related', delay: 0 },
        { type: 'middle', items: related.middle, color: '#FB8C00', label: 'Moderately Related', delay: 100 },
        { type: 'bottom', items: related.bottom, color: '#E53935', label: 'Least Related', delay: 200 }
    ];

    relationships.forEach(rel => {
        rel.items.forEach((item, index) => {
            const path = d.path(item.node);

            // Calculate opacity and thickness based on similarity score
            const minOpacity = 0.4;
            const maxOpacity = 0.9;
            const opacity = minOpacity + (item.similarity * (maxOpacity - minOpacity));

            const minWidth = 1.5;
            const maxWidth = 3.5;
            const strokeWidth = minWidth + (item.similarity * (maxWidth - minWidth));

            linkGroup.append('path')
                .attr('class', `relationship-link relationship-link--${rel.type}`)
                .attr('d', line(path))
                .attr('stroke', rel.color)
                .attr('stroke-width', strokeWidth)
                .attr('stroke-opacity', 0)
                .attr('fill', 'none')
                .transition()
                .delay(rel.delay + (index * 50)) // Sequential animation within each group
                .duration(400)
                .attr('stroke-opacity', opacity);
        });
    });

    // Highlight the related nodes
    node.classed('node--related-source', n => n === d);
    node.classed('node--related-top', n => related.top.some(r => r.node === n));
    node.classed('node--related-middle', n => related.middle.some(r => r.node === n));
    node.classed('node--related-bottom', n => related.bottom.some(r => r.node === n));
    node.classed('node--related-dimmed', n => {
        return n !== d &&
            !related.top.some(r => r.node === n) &&
            !related.middle.some(r => r.node === n) &&
            !related.bottom.some(r => r.node === n) &&
            isChapter(n);
    });

    // Also highlight the relationship dots
    if (relationshipDot) {
        relationshipDot.classed('relationship-dot--active', n => n === d);
    }
}

function hideRelationshipLinks() {
    // Remove all relationship links
    d3.selectAll('.relationship-link')
        .transition()
        .duration(200)
        .attr('stroke-opacity', 0)
        .remove();

    // Clear node highlighting
    if (node) {
        node.classed('node--related-source', false);
        node.classed('node--related-top', false);
        node.classed('node--related-middle', false);
        node.classed('node--related-bottom', false);
        node.classed('node--related-dimmed', false);
    }

    // Clear dot highlighting
    if (relationshipDot) {
        relationshipDot.classed('relationship-dot--active', false);
    }

    // Hide the panel
    hideRelationshipPanel();

    state.activeRelationshipNode = null;
}

// Make hideRelationshipLinks available globally
window.hideRelationshipLinks = hideRelationshipLinks;

// ============================================
// KEYBOARD NAVIGATION
// ============================================

function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(event) {
        if (event.key === '/' && document.activeElement.tagName !== 'INPUT') {
            event.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.focus();
            return;
        }

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
    const scale = 2;
    canvas.width = bbox.width * scale;
    canvas.height = bbox.height * scale;
    ctx.scale(scale, scale);

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
            <div class="progress-inline" title="Hover for progress details">
                <div class="progress-bar-wrapper">
                    <!-- Progress segments will be added by JS -->
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

    container.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            filterBySection(item.dataset.section);
        });
    });

    const progressInline = container.querySelector('.progress-inline');
    if (progressInline) {
        progressInline.style.cursor = 'pointer';
        progressInline.addEventListener('click', showProgressModal);
        progressInline.addEventListener('mouseenter', showProgressTooltip);
        progressInline.addEventListener('mouseleave', hideProgressTooltip);
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
    node
        .style('opacity', 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 8)
        .style('opacity', 1);

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

let svg, node, link, currentLinks, relationshipDot;

function createVisualization(data) {
    state.data = data;

    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = radius - 220;
    const verticalPadding = 100;
    const totalHeight = diameter + verticalPadding * 2;

    d3.select('#visualization-container').html('');

    svg = d3.select('#visualization-container')
        .append('svg')
        .attr('id', 'visualization-svg')
        .attr('width', diameter)
        .attr('height', totalHeight)
        .attr('viewBox', `0 0 ${diameter} ${totalHeight}`)
        .on('click', handleBackgroundClick);

    const g = svg.append('g')
        .attr('transform', `translate(${radius}, ${radius + verticalPadding})`);

    createGradients(svg);

    const root = packageHierarchy(data).sum(d => d.size);
    state.root = root;

    const cluster = d3.cluster().size([360, innerRadius]);
    cluster(root);

    const links = packageImports(root.leaves());
    currentLinks = links;

    const line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

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

    // Calculate relationship counts for badges
    state.relationshipCounts = calculateRelationshipCounts(root.leaves());

    // Add relationship dots (only for chapter nodes, not sections)
    const dotGroup = nodeGroup.append('g').attr('class', 'relationship-dots');

    const dotData = root.leaves().filter(d => isChapter(d));

    // Create container for each dot+badge
    const dotContainers = dotGroup.selectAll('.relationship-dot-container')
        .data(dotData)
        .enter()
        .append('g')
        .attr('class', 'relationship-dot-container')
        .attr('transform', d => {
            const textOffset = d.x < 180 ? -8 : 8;
            return `rotate(${d.x - 90})translate(${d.y + 8},0)${d.x < 180 ? '' : 'rotate(180)'}translate(${textOffset}, 0)`;
        });

    // Add the dots
    relationshipDot = dotContainers.append('circle')
        .attr('class', d => {
            const sectionNum = getSectionNumber(d);
            return `relationship-dot relationship-dot-section-${sectionNum}`;
        })
        .attr('r', 3.5)
        .attr('fill', d => getSectionColor(d))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .attr('cursor', 'pointer')
        .on('click', function(event, d) {
            showRelationshipLinks(event, d);
        })
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(150)
                .attr('r', 5);

            // Show mini legend
            showMiniLegend();

            // Show a small tooltip
            if (!tooltip) createTooltip();
            const strongCount = state.relationshipCounts.get(d.data.key) || 0;
            tooltip.html(`
                <div class="tooltip-title">Related Rules</div>
                <div class="tooltip-summary">Click to see related techniques<br>
                <strong>${strongCount}</strong> strong connections (>30% similarity)</div>
            `);

            const x = event.clientX;
            const y = event.clientY;
            tooltip
                .style('left', (x + 15) + 'px')
                .style('top', (y + 15) + 'px')
                .classed('visible', true);
        })
        .on('mouseout', function(event, d) {
            if (state.activeRelationshipNode !== d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr('r', 3.5);
            }
            hideTooltip();
            hideMiniLegend();
        });

    // Add count badges (small numbers on dots)
    dotContainers.append('text')
        .attr('class', 'relationship-count-badge')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '6px')
        .attr('font-weight', 'bold')
        .attr('fill', '#fff')
        .attr('pointer-events', 'none')
        .text(d => {
            const count = state.relationshipCounts.get(d.data.key) || 0;
            return count > 0 ? count : '';
        });

    updateLegendCounts(root.leaves());
    updateProgressUI();
    updateNodeStyles();
    animateEntrance();
}

// ============================================
// INITIALIZATION
// ============================================

function enhancedInit() {
    loadProgress();

    const legendContainer = document.getElementById('legend-container');
    if (legendContainer) {
        createLegend(legendContainer);
    }

    updateProgressUI();
    createProgressTooltip();
    createInfoCard();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }

    setupKeyboardNavigation();

    const exportPngBtn = document.getElementById('export-png');
    const exportSvgBtn = document.getElementById('export-svg');
    if (exportPngBtn) exportPngBtn.addEventListener('click', exportAsPNG);
    if (exportSvgBtn) exportSvgBtn.addEventListener('click', exportAsSVG);

    // Add resize handler to hide tooltips
    window.addEventListener('resize', () => {
        hideTooltip();
        hideProgressTooltip();
        hideSegmentTooltip();
    });

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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhancedInit);
} else {
    enhancedInit();
}

window.toggleLearned = toggleLearned;
window.toggleSection = toggleSection;
window.exportAsPNG = exportAsPNG;
window.exportAsSVG = exportAsSVG;