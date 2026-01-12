/* ============================================
   LIMITLESS - COGNITIVE ENHANCEMENT TIMELINE
   D3.js Radial Visualization
   ============================================ */

console.log('Limitless - Cognitive Timeline v1.0 loaded');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Act colors
    ACT_COLORS: {
        'act1': '#27ae60',  // Green - Rock Bottom
        'act2': '#3498db',  // Blue - Ascending
        'act3': '#9b59b6'   // Purple - Consequences
    },

    // Cognitive state colors
    COGNITIVE_COLORS: {
        'baseline': '#7f8c8d',
        'enhanced': '#3498db',
        'withdrawal': '#e74c3c',
        'enhanced_unstable': '#e67e22',
        'unclear': '#95a5a6'
    },

    // Act icons
    ACT_ICONS: {
        'act1': '💊',
        'act2': '🧠',
        'act3': '⚡'
    },

    // Act names
    ACT_NAMES: {
        'act1': 'Act I: Rock Bottom',
        'act2': 'Act II: Ascending',
        'act3': 'Act III: Consequences'
    },

    // Layout
    DIAMETER: 900,
    STORAGE_KEY: 'limitless-viewed-scenes',
    DATA_FILE: 'limitless_scenes_50.json'
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    scenes: [],
    root: null,
    viewedScenes: new Set(),
    currentFilter: 'all',
    cognitiveFilter: null,
    hoveredNode: null,
    lockedNode: null,
    searchQuery: ''
};

// ============================================
// LOAD DATA
// ============================================

async function loadSceneData() {
    try {
        const response = await fetch(CONFIG.DATA_FILE);
        const data = await response.json();
        state.scenes = data.scenes;
        console.log(`Loaded ${state.scenes.length} Limitless scenes`);
        return true;
    } catch (error) {
        console.error('Failed to load scene data:', error);
        return false;
    }
}

// ============================================
// INITIALIZATION
// ============================================

async function initialize() {
    const loaded = await loadSceneData();
    if (!loaded) {
        console.error('Could not load scene data');
        return;
    }

    loadProgress();
    initVisualization();
    setupEventListeners();
    initSearch();
    updateProgressUI();

    console.log('Limitless visualization initialized');
}

// ============================================
// PROGRESS TRACKING
// ============================================

function loadProgress() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (stored) {
            const ids = JSON.parse(stored);
            state.viewedScenes = new Set(ids);
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

function saveProgress() {
    try {
        const ids = Array.from(state.viewedScenes);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

function toggleViewed(sceneId) {
    if (state.viewedScenes.has(sceneId)) {
        state.viewedScenes.delete(sceneId);
    } else {
        state.viewedScenes.add(sceneId);
    }
    saveProgress();
    updateProgressUI();
    updateNodeStyles();
}

function updateProgressUI() {
    const total = state.scenes.length;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Update HTML progress bar (if exists)
    const countElement = document.getElementById('progress-count');
    const barElement = document.getElementById('progress-bar');

    if (countElement) {
        countElement.textContent = `${viewed}/${total}`;
    }

    if (barElement) {
        barElement.style.width = `${percentage}%`;
        barElement.setAttribute('aria-valuenow', percentage);
    }

    // Update legend progress bar
    const progressText = d3.select('.progress-text');
    if (!progressText.empty()) {
        progressText.text(`${viewed}/${total}`);
    }

    const progressBarWrapper = d3.select('.progress-bar-wrapper');
    if (!progressBarWrapper.empty()) {
        // Clear and redraw progress bars
        progressBarWrapper.html('');

        const acts = ['act1', 'act2', 'act3'];
        acts.forEach((actId) => {
            const name = CONFIG.ACT_NAMES[actId] || actId;
            const actScenes = state.scenes.filter(s => s.act === actId);
            const actViewed = actScenes.filter(s => state.viewedScenes.has(s.id)).length;
            const actPercentage = actScenes.length > 0 ? (actViewed / actScenes.length) * 100 : 0;

            const segment = progressBarWrapper.append('div')
                .attr('class', 'progress-bar-segment')
                .style('width', `${100 / 3}%`)
                .style('background-color', '#e0e0e0');

            segment.append('div')
                .attr('class', 'progress-bar-fill')
                .style('width', `${actPercentage}%`)
                .style('background-color', getActColor(actId))
                .style('height', '100%')
                .attr('title', `${name}: ${actViewed}/${actScenes.length}`);
        });

        console.log('Progress bar updated:', viewed, '/', total);
    } else {
        console.warn('Progress bar wrapper not found');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.currentFilter = this.dataset.filter;
            filterVisualization();
        });
    });

    // Cognitive filter buttons
    document.querySelectorAll('[data-cognitive]').forEach(btn => {
        btn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            document.querySelectorAll('[data-cognitive]').forEach(b => b.classList.remove('active'));

            if (isActive) {
                state.cognitiveFilter = null;
            } else {
                this.classList.add('active');
                state.cognitiveFilter = this.dataset.cognitive;
            }
            filterVisualization();
        });
    });

    // Reset progress (only if button exists)
    const resetBtn = document.getElementById('reset-progress');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset all progress? This cannot be undone.')) {
                state.viewedScenes.clear();
                saveProgress();
                updateProgressUI();
                updateNodeStyles();
            }
        });
    }

    // Click outside to close info card
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('info-card-backdrop')) {
            hideInfoCard();
        }
    });
}

// ============================================
// HIERARCHY BUILDING
// ============================================

function buildHierarchy() {
    const root = {
        name: 'Limitless',
        children: [
            {
                name: 'Act I',
                act: 'act1',
                children: state.scenes.filter(s => s.act === 'act1')
            },
            {
                name: 'Act II',
                act: 'act2',
                children: state.scenes.filter(s => s.act === 'act2')
            },
            {
                name: 'Act III',
                act: 'act3',
                children: state.scenes.filter(s => s.act === 'act3')
            }
        ]
    };
    return root;
}

// ============================================
// LINK GENERATION
// ============================================

function packageImports(nodes) {
    const map = new Map(nodes.map(d => [d.data.id, d]));
    const imports = [];

    nodes.forEach(node => {
        const scene = node.data;

        if (scene.foreshadowing) {
            scene.foreshadowing.forEach(targetId => {
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'foreshadowing'
                    });
                }
            });
        }

        if (scene.callbacks) {
            scene.callbacks.forEach(targetId => {
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'callback'
                    });
                }
            });
        }
    });

    return imports;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getActColor(act) {
    return CONFIG.ACT_COLORS[act] || '#666';
}

function getCognitiveColor(cognitiveState) {
    return CONFIG.COGNITIVE_COLORS[cognitiveState] || '#666';
}

function getActIcon(act) {
    return CONFIG.ACT_ICONS[act] || '';
}

function formatCharacterName(name) {
    if (!name) return '';
    // Convert camelCase to spaced name (e.g., "JohnSteadman" → "John Steadman")
    return name
        .replace(/([A-Z])/g, ' $1')  // Add space before capital letters
        .trim()                        // Remove leading space
        .replace(/\s+/g, ' ')          // Normalize multiple spaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Tag icon mapping
const TAG_ICONS = {
    'ethics': '⚖️',
    'power': '👑',
    'identity': '🎭',
    'enhancement': '🧠',
    'addiction': '💊',
    'consequence': '⚠️',
    'violence': '⚔️',
    'relationships': '👥',
    'transformation': '🦋',
    'ambition': '🎯',
    'hubris': '🔥',
    'withdrawal': '💢',
    'control': '🎮',
    'memory': '🧩',
    'sacrifice': '🕯️'
};

function buildTagBadges(tags) {
    if (!tags || tags.length === 0) return '';

    return tags.map(tag => {
        const icon = TAG_ICONS[tag] || '🏷️';
        const label = tag.charAt(0).toUpperCase() + tag.slice(1);
        return `<span class="tag-badge tag-${tag}" title="${label}">${icon} ${label}</span>`;
    }).join(' ');
}

// ============================================
// VISUALIZATION
// ============================================

let svg, g, nodeGroup, linkGroup;
let currentLinks = [];
let allNodes = [];

// ============================================
// LEGEND WITH PROGRESS BAR
// ============================================

function createLegendWithProgress() {
    const legendContainer = d3.select('#legend-container');

    if (legendContainer.empty()) {
        console.error('Legend container not found');
        return;
    }

    // Header with progress bar
    const header = legendContainer.append('div')
        .attr('class', 'legend-header');

    header.append('span')
        .attr('class', 'legend-title')
        .text('Scenes Explored');

    const progressInline = header.append('div')
        .attr('class', 'progress-inline')
        .attr('title', 'Hover for summary, click for details')
        .on('mouseenter', showProgressTooltip)
        .on('mouseleave', hideProgressTooltip)
        .on('click', showProgressModal);

    progressInline.append('div')
        .attr('class', 'progress-bar-wrapper');

    progressInline.append('span')
        .attr('class', 'progress-text')
        .text('0/20');

    // Grid of legend items
    const grid = legendContainer.append('div')
        .attr('class', 'legend-grid');

    // Section label for Acts
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Filter by Act:');

    // Act colors with scene counts
    const actDetails = {
        'act1': { count: 15 },
        'act2': { count: 25 },
        'act3': { count: 10 }
    };

    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const item = grid.append('div')
            .attr('class', 'legend-item')
            .attr('data-act', actId)
            .attr('title', `Click to filter: ${name} (${actDetails[actId].count} scenes)`)
            .on('click', () => toggleActFilter(actId));

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', getActColor(actId));

        item.append('span')
            .attr('class', 'legend-icon')
            .text(CONFIG.ACT_ICONS[actId]);

        item.append('span')
            .attr('class', 'legend-text')
            .html(`${name.split(':')[0]} <small>(${actDetails[actId].count})</small>`);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Cognitive States
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Cognitive States:');

    // Cognitive states
    const cognitiveStates = [
        { key: 'baseline', label: 'Baseline (20%)', color: '#7f8c8d' },
        { key: 'enhanced', label: 'Enhanced (100%)', color: '#3498db' },
        { key: 'withdrawal', label: 'Withdrawal', color: '#e74c3c' }
    ];

    cognitiveStates.forEach(state => {
        const item = grid.append('div')
            .attr('class', 'legend-item legend-marker-item')
            .attr('data-marker', state.key)
            .attr('title', `Click to filter: ${state.label}`)
            .on('click', () => toggleCognitiveFilter(state.key));

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', state.color)
            .style('border', `2px solid ${state.color}`);

        item.append('span')
            .attr('class', 'legend-text')
            .text(state.label);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Question Tags
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Discussion Topics:');

    // Discussion tags
    const discussionTags = [
        { key: 'ethics', label: 'Ethics', icon: '⚖️' },
        { key: 'power', label: 'Power', icon: '👑' },
        { key: 'identity', label: 'Identity', icon: '🎭' },
        { key: 'enhancement', label: 'Enhancement', icon: '🧠' },
        { key: 'addiction', label: 'Addiction', icon: '💊' },
        { key: 'consequence', label: 'Consequence', icon: '⚠️' },
        { key: 'violence', label: 'Violence', icon: '⚔️' },
        { key: 'relationships', label: 'Relationships', icon: '👥' },
        { key: 'transformation', label: 'Transformation', icon: '🦋' },
        { key: 'ambition', label: 'Ambition', icon: '🎯' },
        { key: 'hubris', label: 'Hubris', icon: '🔥' },
        { key: 'withdrawal', label: 'Withdrawal', icon: '💢' }
    ];

    discussionTags.forEach(tag => {
        const item = grid.append('div')
            .attr('class', `legend-item legend-question-item tag-${tag.key}`)
            .attr('data-question', tag.key)
            .attr('title', `Filter scenes with ${tag.label} discussion`)
            .on('click', () => toggleQuestionFilter(tag.key));

        item.append('span')
            .attr('class', 'legend-icon')
            .text(tag.icon);

        item.append('span')
            .attr('class', 'legend-text')
            .text(tag.label);
    });
}

// ============================================
// LEGEND FILTERING
// ============================================

const legendState = {
    activeActs: new Set(),
    activeCognitive: new Set(),
    activeQuestions: new Set()
};

function toggleActFilter(actId) {
    if (legendState.activeActs.has(actId)) {
        legendState.activeActs.delete(actId);
    } else {
        legendState.activeActs.add(actId);
    }

    // Update legend item appearance
    d3.selectAll('.legend-item[data-act]')
        .classed('active', function() {
            return legendState.activeActs.has(this.dataset.act);
        });

    // Update visualization
    applyLegendFilters();
}

function toggleCognitiveFilter(cogKey) {
    if (legendState.activeCognitive.has(cogKey)) {
        legendState.activeCognitive.delete(cogKey);
    } else {
        legendState.activeCognitive.add(cogKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-marker-item')
        .classed('active', function() {
            return legendState.activeCognitive.has(this.dataset.marker);
        });

    // Update visualization
    applyLegendFilters();
}

function toggleQuestionFilter(questionKey) {
    if (legendState.activeQuestions.has(questionKey)) {
        legendState.activeQuestions.delete(questionKey);
    } else {
        legendState.activeQuestions.add(questionKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-question-item')
        .classed('active', function() {
            return legendState.activeQuestions.has(this.dataset.question);
        });

    // Update visualization
    applyLegendFilters();
}

function applyLegendFilters() {
    if (!allNodes || !nodeGroup) return;

    const hasActFilter = legendState.activeActs.size > 0;
    const hasCognitiveFilter = legendState.activeCognitive.size > 0;
    const hasQuestionFilter = legendState.activeQuestions.size > 0;

    allNodes.forEach(node => {
        if (!node.data.id) return;

        let visible = true;

        // Act filter
        if (hasActFilter) {
            visible = visible && legendState.activeActs.has(node.data.act);
        }

        // Cognitive filter
        if (hasCognitiveFilter) {
            visible = visible && legendState.activeCognitive.has(node.data.cognitiveState);
        }

        // Question tag filter
        if (hasQuestionFilter) {
            const hasMatchingTag = node.data.tags &&
                Array.from(legendState.activeQuestions).some(q => node.data.tags.includes(q));
            visible = visible && hasMatchingTag;
        }

        // Apply visibility
        const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);
        nodeElement.style('opacity', visible ? 1 : 0.15);
        nodeElement.style('pointer-events', visible ? 'auto' : 'none');
    });

    // Update links
    if (linkGroup) {
        linkGroup.selectAll('.link').style('opacity', d => {
            const sourceHasMatchingTag = !hasQuestionFilter || (d.source.data.tags &&
                Array.from(legendState.activeQuestions).some(q => d.source.data.tags.includes(q)));
            const targetHasMatchingTag = !hasQuestionFilter || (d.target.data.tags &&
                Array.from(legendState.activeQuestions).some(q => d.target.data.tags.includes(q)));

            const sourceVisible = d.source.data.id &&
                (!hasActFilter || legendState.activeActs.has(d.source.data.act)) &&
                (!hasCognitiveFilter || legendState.activeCognitive.has(d.source.data.cognitiveState)) &&
                sourceHasMatchingTag;

            const targetVisible = d.target.data.id &&
                (!hasActFilter || legendState.activeActs.has(d.target.data.act)) &&
                (!hasCognitiveFilter || legendState.activeCognitive.has(d.target.data.cognitiveState)) &&
                targetHasMatchingTag;

            return (sourceVisible && targetVisible) ? 0.3 : 0.05;
        });
    }
}

// ============================================
// PROGRESS TOOLTIP (HOVER)
// ============================================

let progressTooltip = null;

function showProgressTooltip(event) {
    const total = state.scenes.length;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Count by act
    const actCounts = {};
    Object.keys(CONFIG.ACT_NAMES).forEach(act => {
        const actScenes = state.scenes.filter(s => s.act === act);
        const actViewed = actScenes.filter(s => state.viewedScenes.has(s.id)).length;
        actCounts[act] = { total: actScenes.length, viewed: actViewed };
    });

    if (!progressTooltip) {
        progressTooltip = d3.select('body').append('div')
            .attr('class', 'progress-tooltip');
    }

    let html = `
        <div class="progress-tooltip-header">
            <strong>📊 Progress Overview</strong>
        </div>
        <div class="progress-tooltip-body">
            <div class="progress-tooltip-total">
                <span class="progress-number">${viewed}/${total}</span>
                <span class="progress-label">scenes reviewed</span>
                <span class="progress-percentage">(${percentage}%)</span>
            </div>
            <div class="progress-tooltip-acts">
    `;

    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const counts = actCounts[actId];
        const actPercentage = Math.round((counts.viewed / counts.total) * 100);
        html += `
            <div class="progress-tooltip-act">
                <span class="act-icon">${CONFIG.ACT_ICONS[actId]}</span>
                <span class="act-name">${name.split(':')[0]}</span>
                <span class="act-count">${counts.viewed}/${counts.total}</span>
                <div class="act-mini-bar">
                    <div class="act-mini-fill" style="width: ${actPercentage}%; background: ${getActColor(actId)}"></div>
                </div>
            </div>
        `;
    });

    html += `
            </div>
            <div class="progress-tooltip-hint">Click for detailed breakdown →</div>
        </div>
    `;

    progressTooltip.html(html);

    // Position tooltip
    const progressBar = document.querySelector('.progress-inline');
    const rect = progressBar.getBoundingClientRect();
    progressTooltip
        .style('left', `${rect.left + window.scrollX}px`)
        .style('top', `${rect.bottom + window.scrollY + 5}px`)
        .classed('visible', true);
}

function hideProgressTooltip() {
    if (progressTooltip) {
        progressTooltip.classed('visible', false);
    }
}

// ============================================
// PROGRESS MODAL (CLICK)
// ============================================

let progressModal = null;
let progressModalBackdrop = null;

function createProgressModal() {
    if (!progressModalBackdrop) {
        progressModalBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'progress-modal-backdrop')
            .on('click', hideProgressModal);
    }

    progressModal = d3.select('body')
        .append('div')
        .attr('class', 'progress-modal')
        .attr('id', 'progress-modal');

    return progressModal;
}

function showProgressModal() {
    hideProgressTooltip();
    if (!progressModal) createProgressModal();

    const total = state.scenes.length;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Group scenes by act
    const scenesByAct = { act1: [], act2: [], act3: [] };
    state.scenes.forEach(scene => {
        if (scene.act && scenesByAct[scene.act]) {
            scenesByAct[scene.act].push(scene);
        }
    });

    let modalHTML = `
        <div class="progress-modal-header">
            <h3 class="progress-modal-title">📊 Viewing Progress</h3>
            <div class="progress-modal-summary">
                <span class="progress-modal-count">${viewed}/${total} scenes (${percentage}%)</span>
            </div>
            <button class="progress-modal-close" onclick="window.hideProgressModal()">×</button>
        </div>
        <div class="progress-modal-body">
    `;

    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const scenes = scenesByAct[actId] || [];
        const viewedCount = scenes.filter(s => state.viewedScenes.has(s.id)).length;
        const allViewed = viewedCount === scenes.length;

        modalHTML += `
            <div class="progress-section" data-act="${actId}">
                <div class="progress-section-header" style="border-color: ${getActColor(actId)}">
                    <input type="checkbox"
                           class="section-toggle-checkbox"
                           ${allViewed ? 'checked' : ''}
                           onchange="window.toggleActViewed('${actId}')"
                           title="Check/uncheck all scenes in this act">
                    <span class="progress-section-icon">${CONFIG.ACT_ICONS[actId]}</span>
                    <h4 class="progress-section-title" style="color: ${getActColor(actId)}">${name}</h4>
                    <span class="progress-section-count">${viewedCount}/${scenes.length}</span>
                </div>
                <div class="progress-section-scenes">
        `;

        scenes.forEach(scene => {
            const isViewed = state.viewedScenes.has(scene.id);
            const cogState = scene.cognitiveState || 'unknown';

            modalHTML += `
                <div class="progress-item ${isViewed ? 'viewed' : ''}" data-scene-id="${scene.id}">
                    <input type="checkbox"
                           ${isViewed ? 'checked' : ''}
                           onchange="window.toggleSceneViewed(${scene.id})">
                    <span class="progress-item-number">${scene.id}.</span>
                    <label class="progress-item-label">${scene.title}</label>
                    <span class="progress-item-cognitive" style="background: ${getCognitiveColor(cogState)}" title="${cogState}"></span>
                    <button class="progress-item-info-btn" onclick="window.showSceneFromModal(${scene.id})" title="View details">ℹ️</button>
                </div>
            `;
        });

        modalHTML += `
                </div>
            </div>
        `;
    });

    modalHTML += `
        </div>
        <div class="progress-modal-footer">
            <button class="btn btn-sm btn-outline-secondary" onclick="window.resetAllProgress()">🔄 Reset All</button>
            <button class="btn btn-sm btn-outline-primary" onclick="window.markAllViewed()">✓ Mark All Viewed</button>
        </div>
    `;

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

// Window functions for onclick handlers
window.hideProgressModal = hideProgressModal;
window.toggleActViewed = function(actId) {
    const actScenes = state.scenes.filter(s => s.act === actId);
    const allViewed = actScenes.every(s => state.viewedScenes.has(s.id));

    actScenes.forEach(scene => {
        if (allViewed) {
            state.viewedScenes.delete(scene.id);
        } else {
            state.viewedScenes.add(scene.id);
        }
    });

    saveProgress();
    updateProgressUI();
    updateNodeStyles();
    showProgressModal(); // Refresh modal
};

window.toggleSceneViewed = function(sceneId) {
    toggleViewed(sceneId);
    showProgressModal(); // Refresh modal
};

window.showSceneFromModal = function(sceneId) {
    const node = allNodes.find(n => n.data && n.data.id === sceneId);
    if (node) {
        hideProgressModal();
        showInfoCard(node);
    }
};

window.resetAllProgress = function() {
    if (confirm('Reset all progress? This cannot be undone.')) {
        state.viewedScenes.clear();
        saveProgress();
        updateProgressUI();
        updateNodeStyles();
        showProgressModal(); // Refresh modal
    }
};

window.markAllViewed = function() {
    state.scenes.forEach(scene => {
        state.viewedScenes.add(scene.id);
    });
    saveProgress();
    updateProgressUI();
    updateNodeStyles();
    showProgressModal(); // Refresh modal
};

// ============================================
// VISUALIZATION
// ============================================
// VISUALIZATION
// ============================================

function initVisualization() {
    // Create legend first
    createLegendWithProgress();

    const container = d3.select('#visualization-container');
    container.html(''); // Clear loading overlay


    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = radius - 150;
    const verticalOffset = 50; // Shift diagram down by 50px to match lighthouse
    const padding = 150; // Add padding on all sides to prevent cutoff

    svg = container.append('svg')
        .attr('viewBox', `${-radius - padding} ${-radius - verticalOffset - padding} ${diameter + padding * 2} ${diameter + verticalOffset + padding * 2}`)
        .attr('width', '100%')
        .attr('height', diameter + verticalOffset + padding * 2)
        .style('max-width', `${diameter + padding * 2}px`)
        .style('font', '12px sans-serif');

    g = svg.append('g');

    // Build hierarchy
    const hierarchyData = buildHierarchy();
    state.root = d3.hierarchy(hierarchyData);

    // Create cluster layout
    const cluster = d3.cluster()
        .size([360, innerRadius]);

    cluster(state.root);

    // Get all nodes
    allNodes = state.root.descendants();

    // Build links
    currentLinks = packageImports(allNodes.filter(d => d.data.id));

    // Draw links
    linkGroup = g.append('g')
        .attr('class', 'links')
        .attr('fill', 'none');

    const line = d3.lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

    const nodeRadius = 18; // Space to leave before node

    linkGroup.selectAll('.link')
        .data(currentLinks)
        .join('path')
        .attr('class', d => `link link-${d.type}`)
        .attr('d', d => {
            const sourcePath = d.source.path(d.target);
            // Adjust endpoints to stop before nodes
            if (sourcePath.length > 0) {
                sourcePath[0] = {...sourcePath[0], y: sourcePath[0].y - nodeRadius};
                sourcePath[sourcePath.length - 1] = {...sourcePath[sourcePath.length - 1], y: sourcePath[sourcePath.length - 1].y - nodeRadius};
            }
            return line(sourcePath);
        })
        .attr('stroke', d => {
            if (d.type === 'callback') return '#9b59b6';
            return '#3498db';
        })
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', d => d.type === 'callback' ? '5,3' : null);

    // Draw nodes
    nodeGroup = g.append('g')
        .attr('class', 'nodes');

    const nodes = nodeGroup.selectAll('.node')
        .data(allNodes.filter(d => d.data.id))
        .join('g')
        .attr('class', d => {
            let classes = 'node';
            if (d.data.cognitiveState) {
                classes += ` ${d.data.cognitiveState}`;
            }
            return classes;
        })
        .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y},0)`)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            if (!state.lockedNode) {
                highlightConnections(d);
                showTooltip(d, event);
            }
        })
        .on('mouseout', function() {
            if (!state.lockedNode) {
                unhighlightAll();
                hideTooltip();
            }
        })
        .on('click', function(event, d) {
            event.stopPropagation();
            console.log('Node clicked:', d.data.id, d.data.title);
            state.lockedNode = d;
            showInfoCard(d);
            highlightConnections(d);
        });

    // Node circles with cognitive state coloring
    nodes.append('circle')
        .attr('r', 6)
        .attr('fill', d => getCognitiveColor(d.data.cognitiveState))
        .attr('stroke', d => getActColor(d.data.act))
        .attr('stroke-width', 2);

    // MDT supply indicator ring
    nodes.append('circle')
        .attr('class', 'mdt-supply-ring')
        .attr('r', 9)
        .attr('fill', 'none')
        .attr('stroke', d => {
            if (!d.data.mdtTracking) return 'transparent';
            const remaining = d.data.mdtTracking.pillsRemaining || d.data.mdtTracking.remaining;
            const status = getMDTSupplyStatus(remaining);
            if (status.status === 'critical') return '#e74c3c';
            if (status.status === 'low') return '#e67e22';
            if (status.status === 'moderate') return '#f39c12';
            if (status.status === 'plenty') return '#27ae60';
            return 'transparent';
        })
        .attr('stroke-width', d => {
            if (!d.data.mdtTracking) return 0;
            const remaining = d.data.mdtTracking.pillsRemaining || d.data.mdtTracking.remaining;
            const status = getMDTSupplyStatus(remaining);
            return status.status === 'critical' ? 2.5 : 2;
        })
        .attr('stroke-dasharray', d => {
            if (!d.data.mdtTracking) return 'none';
            const remaining = d.data.mdtTracking.pillsRemaining || d.data.mdtTracking.remaining;
            const status = getMDTSupplyStatus(remaining);
            return status.status === 'critical' ? '2,2' : 'none';
        })
        .style('opacity', 0.8);

    // Brain for enhanced cognitive state - always upright
    nodes.append('text')
        .attr('class', 'node-brain')
        .attr('x', 0)
        .attr('y', 0)
        .attr('dy', '0.3em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .attr('transform', d => `rotate(${-(d.x - 90)})`) // Counter-rotate to keep upright
        .style('opacity', d => {
            const cogState = d.data.cognitiveState || '';
            return cogState.includes('enhanced') ? 1 : 0;
        })
        .style('pointer-events', 'none')
        .text('🧠');

    // Checkmarks
    // Checkmark positioned between node and text
    nodes.append('text')
        .attr('class', 'node-checkmark')
        .attr('dy', '0.31em')
        .attr('x', d => d.x < 180 ? 20 : -20)
        .attr('text-anchor', 'middle')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('fill', '#2ecc71')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0)
        .text('✓');

    // Labels
    nodes.append('text')
        .attr('class', 'node-label')
        .attr('dy', '0.31em')
        .attr('x', d => d.x < 180 ? 32 : -32)
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('font-size', '10px')
        .attr('fill', 'var(--viz-text)')
        .text(d => `${d.data.id}. ${d.data.title}`);

    updateNodeStyles();

    // Click outside to deselect
    svg.on('click', function() {
        hideInfoCard();
        hideTooltip();
        unhighlightAll();
    });
}

function updateNodeStyles() {
    if (!nodeGroup) return;

    nodeGroup.selectAll('.node')
        .classed('viewed', d => state.viewedScenes.has(d.data.id));

    nodeGroup.selectAll('.node circle')
        .attr('stroke-width', d => state.viewedScenes.has(d.data.id) ? 3 : 2)
        .attr('stroke', d => state.viewedScenes.has(d.data.id) ? '#2ecc71' : getActColor(d.data.act))
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 0.25 : 1);

    nodeGroup.selectAll('.node .node-checkmark')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0);

    nodeGroup.selectAll('.node .node-label')
        .classed('viewed-label', d => state.viewedScenes.has(d.data.id))
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 0.25 : 1);
}

// ============================================
// FILTERING
// ============================================

function filterVisualization() {
    nodeGroup.selectAll('.node')
        .style('opacity', d => {
            let actMatch = state.currentFilter === 'all' || d.data.act === state.currentFilter;
            let cognitiveMatch = !state.cognitiveFilter || d.data.cognitiveState === state.cognitiveFilter;
            return (actMatch && cognitiveMatch) ? 1 : 0.2;
        });

    linkGroup.selectAll('.link')
        .style('opacity', d => {
            let actMatch = state.currentFilter === 'all' ||
                          d.source.data.act === state.currentFilter ||
                          d.target.data.act === state.currentFilter;
            let cognitiveMatch = !state.cognitiveFilter ||
                                d.source.data.cognitiveState === state.cognitiveFilter ||
                                d.target.data.cognitiveState === state.cognitiveFilter;
            return (actMatch && cognitiveMatch) ? 0.3 : 0.05;
        });
}

// ============================================
// HIGHLIGHTING
// ============================================

function highlightConnections(node) {
    state.hoveredNode = node;

    const connectedIds = new Set([node.data.id]);
    currentLinks.forEach(link => {
        if (link.source.data.id === node.data.id) {
            connectedIds.add(link.target.data.id);
        }
        if (link.target.data.id === node.data.id) {
            connectedIds.add(link.source.data.id);
        }
    });

    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', d => d.data.id === node.data.id)
        .classed('connection-dimmed', d => !connectedIds.has(d.data.id));

    linkGroup.selectAll('.link')
        .classed('highlighted', d =>
            d.source.data.id === node.data.id || d.target.data.id === node.data.id)
        .classed('dimmed', d =>
            d.source.data.id !== node.data.id && d.target.data.id !== node.data.id);
}

function unhighlightAll() {
    state.hoveredNode = null;

    if (state.lockedNode) return;

    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', false)
        .classed('connection-dimmed', false);

    linkGroup.selectAll('.link')
        .classed('highlighted', false)
        .classed('dimmed', false);
}

// ============================================
// TOOLTIP
// ============================================

let tooltip;

function initTooltip() {
    tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'fixed')
        .style('pointer-events', 'none')
        .style('opacity', 0);
}

function showTooltip(node, event) {
    if (!tooltip) initTooltip();

    const scene = node.data;

    // Handle different plotSummary formats
    let summaryText = '';
    if (scene.plotSummary) {
        if (typeof scene.plotSummary === 'string') {
            summaryText = scene.plotSummary;
        } else if (scene.plotSummary.brief) {
            summaryText = scene.plotSummary.brief;
        } else if (scene.plotSummary.detailed) {
            summaryText = scene.plotSummary.detailed;
        }
    } else if (scene.summary) {
        summaryText = scene.summary;
    }

    // Location and time info
    const locationTime = [];
    if (scene.location && scene.location.primary) {
        locationTime.push(`📍 ${scene.location.primary}`);
    }
    if (scene.time) {
        const timeStr = typeof scene.time === 'string' ? scene.time : scene.time.narrative || scene.time.runtime;
        if (timeStr) locationTime.push(`🕐 ${timeStr}`);
    }
    const locationTimeHtml = locationTime.length > 0 ?
        `<div class="tooltip-location">${locationTime.join(' • ')}</div>` : '';

    // Build cognitive state
    const cognitiveHtml = buildCognitiveStateTags(scene.cognitiveState);

    // Build MDT tracker with progress bar
    let mdtHtml = '';
    if (scene.mdtTracking && scene.mdtTracking.pillsRemaining) {
        const remaining = scene.mdtTracking.pillsRemaining;
        const status = getMDTSupplyStatus(remaining);

        mdtHtml = `
        <div class="tooltip-mdt-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                <strong style="font-size: 0.75rem;">💊 MDT-48 Supply</strong>
                <span class="mdt-status-indicator mdt-status-${status.status}">${status.label}</span>
            </div>
            <div class="mdt-gauge-bar-bg" style="position: relative; height: 18px;">
                <div class="mdt-gauge-bar ${status.class}" style="width: ${status.percentage || 0}%"></div>
                <div class="mdt-gauge-count-overlay" style="font-size: 0.7rem;">
                    ${remaining}
                </div>
            </div>
        </div>`;
    }

    let html = `
        <div class="tooltip-header">
            <span class="tooltip-icon">${getActIcon(scene.act)}</span>
            <span class="tooltip-title">${scene.id}. ${scene.title}</span>
        </div>
        ${locationTimeHtml}
        <div class="tooltip-cognitive">
            ${cognitiveHtml}
        </div>
        ${mdtHtml}
        ${scene.tags && scene.tags.length > 0 ? `
        <div class="tooltip-tags">
            ${buildTagBadges(scene.tags)}
        </div>
        ` : ''}
        <div class="tooltip-hint">Click for full details & connections</div>
    `;

    tooltip.html(html)
        .classed('visible', true);

    // Better positioning like the_lighthouse
    const x = event.clientX;
    const y = event.clientY;
    const tooltipNode = tooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 300;
    const tooltipHeight = tooltipNode.offsetHeight || 150;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = x + 15;
    let top = y + 15;

    if (left + tooltipWidth > viewportWidth) {
        left = x - tooltipWidth - 15;
    }
    if (top + tooltipHeight > viewportHeight) {
        top = y - tooltipHeight - 15;
    }

    tooltip
        .style('left', Math.max(10, left) + 'px')
        .style('top', Math.max(10, top) + 'px')
        .style('opacity', 1)
        .style('display', 'block');
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classed('visible', false)
            .style('display', 'none')
            .style('opacity', 0);
    }
}

// ============================================
// INFO CARD
// ============================================

let infoCardBackdrop, infoCard;

function initInfoCard() {
    infoCardBackdrop = d3.select('body').append('div')
        .attr('class', 'info-card-backdrop')
        .on('click', hideInfoCard);

    infoCard = d3.select('body').append('div')
        .attr('class', 'info-card-modal');
}

// ============================================
// INFO CARD SECTION BUILDERS
// ============================================

function buildLocationSection(scene) {
    if (!scene.location) return '';

    const loc = scene.location;
    let html = `<div class="info-card-section">
        <div class="info-card-section-title">📍 Location & Time</div>
        <div class="info-card-section-content">`;

    if (loc.primary) {
        html += `<div class="location-primary"><strong>Setting:</strong> ${loc.primary}</div>`;
    }
    if (loc.significance) {
        html += `<div class="location-significance"><em>${loc.significance}</em></div>`;
    }
    if (scene.time) {
        // Handle time as object or string
        let timeText = '';
        if (typeof scene.time === 'string') {
            timeText = scene.time;
        } else if (scene.time.narrative) {
            timeText = scene.time.narrative;
            if (scene.time.runtime) {
                timeText += ` (${scene.time.runtime})`;
            }
        } else if (scene.time.runtime) {
            timeText = scene.time.runtime;
        }
        if (timeText) {
            html += `<div class="scene-time"><strong>When:</strong> ${timeText}</div>`;
        }
    }
    if (scene.duration) {
        html += `<div class="scene-duration"><strong>Duration:</strong> ${scene.duration}</div>`;
    }

    html += `</div></div>`;
    return html;
}

function buildCharacterSection(scene) {
    if (!scene.characterDevelopment) return '';

    const chars = scene.characterDevelopment;
    const charEntries = Object.entries(chars);

    if (charEntries.length === 0) return '';

    let html = `<div class="info-card-characters">
        <strong>👤 Characters:</strong>
        <div class="characters-grid">`;

    for (const [charName, charData] of charEntries) {
        // Build a compact summary of character state
        let summary = [];
        if (charData.state) summary.push(charData.state);
        if (charData.cognitiveLevel) summary.push(`🧠 ${charData.cognitiveLevel}`);

        const summaryText = summary.join(', ');
        // Format character name (handle camelCase)
        const displayName = formatCharacterName(charName);
        html += `<span class="character-state"><strong>${displayName}:</strong> ${summaryText}</span>`;
    }

    html += `</div></div>`;
    return html;
}

function buildDialogueSection(scene) {
    if (!scene.keyDialogue || scene.keyDialogue.length === 0) return '';

    let html = `<div class="info-card-quotes">
        <strong>💬 Key Dialogue:</strong>
        <div class="quotes-list">`;

    scene.keyDialogue.forEach(dialogue => {
        const speaker = formatCharacterName(dialogue.speaker || dialogue.character);
        const quote = dialogue.quote || dialogue.line;
        const sig = dialogue.significance ? ` — ${dialogue.significance}` : '';
        html += `<div class="quote-item"><strong>${speaker}:</strong> <em>"${quote}"</em>${sig}</div>`;
    });

    html += `</div></div>`;
    return html;
}

function buildVisualSection(scene) {
    if (!scene.visualStorytelling) return '';

    const visual = scene.visualStorytelling;
    let html = `<div class="info-card-quotes">
        <strong>🎬 Visual Storytelling:</strong>
        <div class="quotes-list">`;

    if (visual.cameraWork) {
        html += `<div class="quote-item"><strong>Camera:</strong> ${visual.cameraWork}</div>`;
    }
    if (visual.colorPalette) {
        html += `<div class="quote-item"><strong>Colors:</strong> ${visual.colorPalette}</div>`;
    }
    if (visual.symbolism) {
        // Handle symbolism - could be array or string
        let symbolismText = '';
        if (Array.isArray(visual.symbolism)) {
            symbolismText = visual.symbolism.join(', ');
        } else {
            symbolismText = visual.symbolism;
        }
        html += `<div class="quote-item"><strong>Symbolism:</strong> ${symbolismText}</div>`;
    }

    html += `</div></div>`;
    return html;
}

function buildThemesSection(scene) {
    if (!scene.thematicElements) return '';

    const thematic = scene.thematicElements;

    let html = `<div class="info-card-quotes">
        <strong>🎭 Themes:</strong>
        <div class="quotes-list">`;

    if (thematic.primaryThemes && Array.isArray(thematic.primaryThemes)) {
        html += `<div class="quote-item">${thematic.primaryThemes.join(', ')}</div>`;
    }

    if (thematic.exploration) {
        html += `<div class="quote-item"><em>${thematic.exploration}</em></div>`;
    }

    if (thematic.moralQuestions && Array.isArray(thematic.moralQuestions)) {
        html += `<div class="quote-item"><strong>Questions:</strong> ${thematic.moralQuestions.join(' • ')}</div>`;
    }

    html += `</div></div>`;
    return html;
}

function buildSciFiSection(scene) {
    if (!scene.scienceFiction) return '';

    const sci = scene.scienceFiction;
    let html = `<div class="info-card-section">
        <div class="info-card-section-title">🧪 Science Fiction Analysis</div>
        <div class="info-card-section-content">`;

    if (sci.concept) {
        html += `<div class="scifi-item"><strong>Concept:</strong> ${sci.concept}</div>`;
    }
    if (sci.realism) {
        html += `<div class="scifi-item"><strong>Realism:</strong> ${sci.realism}</div>`;
    }
    if (sci.consequences) {
        html += `<div class="scifi-item"><strong>Consequences:</strong> ${sci.consequences}</div>`;
    }

    html += `</div></div>`;
    return html;
}

function buildSymbolsSection(scene) {
    if (!scene.symbols || scene.symbols.length === 0) return '';

    let html = `<div class="info-card-quotes">
        <strong>🔣 Symbols:</strong>
        <div class="quotes-list">`;

    if (Array.isArray(scene.symbols)) {
        scene.symbols.forEach(symbolObj => {
            if (typeof symbolObj === 'object' && symbolObj.symbol) {
                // Array of objects with symbol and meaning
                html += `<div class="quote-item"><strong>${symbolObj.symbol}:</strong> ${symbolObj.meaning}</div>`;
            } else if (typeof symbolObj === 'string') {
                // Simple string array
                html += `<div class="quote-item">${symbolObj}</div>`;
            }
        });
    }

    html += `</div></div>`;
    return html;
}

function buildTensionBar(scene) {
    if (!scene.tension) return '';

    const tensionLevel = Math.min(10, Math.max(1, scene.tension));
    const tensionPercent = (tensionLevel / 10) * 100;

    return `<div class="info-card-section">
        <div class="info-card-section-title">⚡ Tension Level: ${tensionLevel}/10</div>
        <div class="tension-bar-container">
            <div class="tension-bar" style="width: ${tensionPercent}%"></div>
        </div>
    </div>`;
}

function getMDTSupplyStatus(remaining) {
    if (!remaining) {
        return { status: 'na', label: 'N/A', class: 'mdt-supply-na', percentage: 0 };
    }

    // Check for N/A or pre-MDT states
    if (remaining === 'N/A' || remaining === 'None' || remaining === 'Pre-MDT') {
        return { status: 'na', label: 'N/A', class: 'mdt-supply-na', percentage: 0 };
    }

    // Check for depleted/zero state (after having pills)
    if (remaining === 'Zero' || remaining === '0' || remaining === 'Depleted') {
        return { status: 'none', label: 'DEPLETED', class: 'mdt-supply-none', percentage: 0 };
    }

    // Extract numeric value from string like "~75 pills"
    const numMatch = remaining.toString().match(/\d+/);
    if (!numMatch) {
        return { status: 'unknown', label: remaining, class: 'mdt-supply-none', percentage: 0 };
    }

    const count = parseInt(numMatch[0]);

    if (count >= 100) {
        return { status: 'plenty', label: 'PLENTY', class: 'mdt-supply-plenty', percentage: 100 };
    } else if (count >= 50) {
        return { status: 'moderate', label: 'MODERATE', class: 'mdt-supply-moderate', percentage: (count / 200) * 100 };
    } else if (count >= 20) {
        return { status: 'low', label: 'LOW', class: 'mdt-supply-low', percentage: (count / 200) * 100 };
    } else if (count > 0) {
        return { status: 'critical', label: 'CRITICAL', class: 'mdt-supply-critical', percentage: (count / 200) * 100 };
    } else {
        return { status: 'none', label: 'DEPLETED', class: 'mdt-supply-none', percentage: 0 };
    }
}

function calculateConsumptionRate(scene) {
    // Check if current scene has MDT tracking
    if (!scene.mdtTracking) return null;

    const currentRemaining = scene.mdtTracking.pillsRemaining || scene.mdtTracking.remaining;
    if (!currentRemaining) return null;

    // Find previous scene with MDT data
    const currentId = scene.id;
    let prevScene = null;

    for (let i = currentId - 2; i >= 0; i--) {
        const s = state.scenes[i];
        if (s && s.mdtTracking && (s.mdtTracking.pillsRemaining || s.mdtTracking.remaining)) {
            prevScene = s;
            break;
        }
    }

    if (!prevScene) return null;

    const prevRemaining = prevScene.mdtTracking.pillsRemaining || prevScene.mdtTracking.remaining;
    if (!prevRemaining) return null;

    // Safe toString with null check
    const currentMatch = String(currentRemaining).match(/\d+/);
    const prevMatch = String(prevRemaining).match(/\d+/);

    if (!currentMatch || !prevMatch) return null;

    const currentCount = parseInt(currentMatch[0]);
    const prevCount = parseInt(prevMatch[0]);
    const consumed = prevCount - currentCount;
    const scenesGap = scene.id - prevScene.id;

    if (consumed <= 0) return null;

    return {
        consumed: consumed,
        scenesGap: scenesGap,
        rate: consumed / scenesGap,
        prevScene: prevScene.id
    };
}

function buildMDTTracker(scene) {
    if (!scene.mdtTracking) return '';

    const mdt = scene.mdtTracking;
    const remaining = mdt.pillsRemaining || mdt.remaining;
    const supplyStatus = getMDTSupplyStatus(remaining);
    const consumptionRate = calculateConsumptionRate(scene);

    let html = `<div class="mdt-section">`;

    // Compact header with supply status
    if (remaining) {
        html += `<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="font-size: 0.85rem;">💊 MDT-48 Supply</strong>
            <span class="mdt-status-indicator mdt-status-${supplyStatus.status}">${supplyStatus.label}</span>
        </div>`;

        // Visual gauge with overlaid number
        html += `<div class="mdt-gauge-bar-bg" style="position: relative;">
            <div class="mdt-gauge-bar ${supplyStatus.class}" style="width: ${supplyStatus.percentage || 0}%"></div>
            <div class="mdt-gauge-count-overlay">
                ${remaining}
            </div>
        </div>`;
    }

    // Compact info
    html += `<div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; margin-top: 0.5rem;">`;

    if (mdt.pillsTaken) {
        html += `<div><strong>Taken:</strong> ${mdt.pillsTaken}</div>`;
    }

    // Consumption rate - more compact
    if (consumptionRate) {
        const rateColor = consumptionRate.rate > 2 ? '#e74c3c' : consumptionRate.rate > 1 ? '#f39c12' : '#27ae60';
        const rateIcon = consumptionRate.rate > 2 ? '📈' : consumptionRate.rate > 1 ? '📊' : '📉';
        html += `<div style="color: ${rateColor}; font-size: 0.85rem;">
            <strong>${rateIcon} Rate:</strong> ${consumptionRate.consumed} pills since scene ${consumptionRate.prevScene} (${consumptionRate.rate.toFixed(1)}/scene)
        </div>`;
    }

    if (mdt.effects) {
        html += `<div><strong>Effects:</strong> ${mdt.effects}</div>`;
    }

    html += `</div></div>`;
    return html;
}

function buildCognitiveStateTags(cognitiveState) {
    if (!cognitiveState) {
        return '<span class="info-card-type cognitive-unknown">🧠 unknown</span>';
    }

    // Check if it's a transition (contains →)
    if (cognitiveState.includes('→')) {
        // Parse the transition: "withdrawal → enhanced (drinking Gennady's blood)"
        const arrowParts = cognitiveState.split('→');
        const fromState = arrowParts[0].trim().replace(/_/g, ' ');

        // Extract state without note
        const toPartFull = arrowParts[1].trim();
        const parenMatch = toPartFull.match(/^([^(]+)(\(.+\))?$/);
        const toState = parenMatch ? parenMatch[1].trim().replace(/_/g, ' ') : toPartFull.replace(/_/g, ' ');

        return `<span class="info-card-type cognitive-${fromState.replace(/ /g, '_')}">🧠 ${fromState}</span>
                <span style="margin: 0 0.3rem; color: var(--viz-text);">→</span>
                <span class="info-card-type cognitive-${toState.replace(/ /g, '_')}">🧠 ${toState}</span>`;
    }

    // State with note in parentheses but no transition: "enhanced (from blood)"
    // Strip out the note and just show the state
    const parenMatch = cognitiveState.match(/^([^(]+)(\(.+\))?$/);
    const state = parenMatch ? parenMatch[1].trim().replace(/_/g, ' ') : cognitiveState.replace(/_/g, ' ');

    return `<span class="info-card-type cognitive-${state.replace(/ /g, '_')}">🧠 ${state}</span>`;
}

function extractCognitiveContext(cognitiveState) {
    if (!cognitiveState) return '';

    // Extract context from parentheses if present
    const parenMatch = cognitiveState.match(/\((.+)\)/);
    return parenMatch ? parenMatch[1] : '';
}

function buildConnectionsSection(scene) {
    const hasForeshadowing = scene.foreshadowing && scene.foreshadowing.length > 0;
    const hasCallbacks = scene.callbacks && scene.callbacks.length > 0;

    if (!hasForeshadowing && !hasCallbacks) return '';

    let html = `<div class="info-card-connections">`;

    if (hasForeshadowing) {
        html += `<div class="connections-group">
            <strong>🔮 Foreshadows:</strong>`;
        scene.foreshadowing.forEach(sceneId => {
            const targetScene = state.scenes.find(s => s.id === sceneId);
            if (targetScene) {
                html += `<a href="#" class="connection-link" onclick="window.jumpToScene(${sceneId}); return false;">
                    Scene ${sceneId}: ${targetScene.title}
                </a>`;
            }
        });
        html += `</div>`;
    }

    if (hasCallbacks) {
        html += `<div class="connections-group">
            <strong>↩️ Callbacks to:</strong>`;
        scene.callbacks.forEach(sceneId => {
            const targetScene = state.scenes.find(s => s.id === sceneId);
            if (targetScene) {
                html += `<a href="#" class="connection-link" onclick="window.jumpToScene(${sceneId}); return false;">
                    Scene ${sceneId}: ${targetScene.title}
                </a>`;
            }
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function showInfoCard(node) {
    if (!infoCard) initInfoCard();

    const scene = node.data;

    // Debug logging
    console.log('showInfoCard called for scene:', scene.id, scene.title);

    if (!scene) {
        console.error('No scene data found for node');
        return;
    }

    const isViewed = state.viewedScenes.has(scene.id);

    // Handle different plotSummary formats
    let summaryText = '';
    if (scene.plotSummary) {
        if (typeof scene.plotSummary === 'string') {
            summaryText = scene.plotSummary;
        } else if (scene.plotSummary.detailed) {
            summaryText = scene.plotSummary.detailed;
        } else if (scene.plotSummary.brief) {
            summaryText = scene.plotSummary.brief;
        }
    } else if (scene.summary) {
        summaryText = scene.summary;
    }

    // Build location/time display with icons only
    let locationTimeHtml = '';
    if (scene.location || scene.time) {
        locationTimeHtml = '<div class="info-card-location" style="display: block; padding: 0.5rem 1rem;">';

        // Location
        if (scene.location && scene.location.primary) {
            locationTimeHtml += `<div class="location-text" style="margin-bottom: 0.15rem;">📍 ${scene.location.primary}</div>`;
        }

        // Time
        if (scene.time) {
            let timeText = '';
            if (typeof scene.time === 'string') {
                timeText = scene.time;
            } else if (scene.time.narrative) {
                timeText = scene.time.narrative;
                if (scene.time.runtime) {
                    timeText += ` • ${scene.time.runtime}`;
                }
            } else if (scene.time.runtime) {
                timeText = scene.time.runtime;
            }
            if (timeText) {
                locationTimeHtml += `<div class="time-text" style="margin-bottom: 0.15rem;">🕐 ${timeText}`;
                if (scene.duration) {
                    locationTimeHtml += ` • ${scene.duration}`;
                }
                locationTimeHtml += `</div>`;
            }
        } else if (scene.duration) {
            locationTimeHtml += `<div class="time-text" style="margin-bottom: 0.15rem;">🕐 ${scene.duration}</div>`;
        }

        // Context (location significance or description) - AFTER time
        if (scene.location && (scene.location.significance || scene.location.description)) {
            const contextText = scene.location.significance || scene.location.description;
            locationTimeHtml += `<div style="font-size: 0.85rem; color: var(--viz-text-muted);">💡 ${contextText}</div>`;
        }

        locationTimeHtml += '</div>';
    }

    // Build comprehensive info card
    let html = `
        <div class="info-card-header">
            <span class="info-card-icon">${getActIcon(scene.act)}</span>
            <div class="info-card-titles">
                <h3 class="info-card-scene">${scene.id}. ${scene.title}</h3>
                <p class="info-card-act">${CONFIG.ACT_NAMES[scene.act]}</p>
            </div>
            <button class="info-card-close" onclick="window.hideInfoCard()">&times;</button>
        </div>
        ${locationTimeHtml}
        <div class="info-card-types">
            ${buildCognitiveStateTags(scene.cognitiveState)}
        </div>
        ${scene.tags && scene.tags.length > 0 ? `
        <div class="info-card-tags-section">
            <div class="info-card-tags-label">🏷️ Discussion Topics</div>
            <div class="info-card-tags">
                ${buildTagBadges(scene.tags)}
            </div>
        </div>
        ` : ''}
        <div class="info-card-body">
            ${buildMDTTracker(scene)}
            <div class="info-card-summary">
                ${summaryText || 'No summary available'}
                ${extractCognitiveContext(scene.cognitiveState) ? `<div style="margin-top: 0.25rem; font-size: 0.85rem; color: var(--viz-text-muted);">💡 ${extractCognitiveContext(scene.cognitiveState)}</div>` : ''}
            </div>
            ${buildCharacterSection(scene)}
            ${buildDialogueSection(scene)}
            ${buildVisualSection(scene)}
            ${buildThemesSection(scene)}
            ${buildSciFiSection(scene)}
            ${buildSymbolsSection(scene)}
            ${buildTensionBar(scene)}
            ${scene.significance ? `
            <div class="info-card-quotes">
                <strong>💡 Significance:</strong>
                <div class="quotes-list">
                    <div class="quote-item">${scene.significance}</div>
                </div>
            </div>
            ` : ''}
        </div>
        ${buildConnectionsSection(scene)}
        <div class="info-card-footer">
            <button class="btn btn-sm ${isViewed ? 'btn-success' : 'btn-outline-primary'}"
                    id="toggle-viewed-btn-${scene.id}"
                    onclick="window.toggleViewedFromCard(${scene.id})">
                ${isViewed ? '✓ Reviewed' : 'Mark as Reviewed'}
            </button>
        </div>
    `;

    infoCard.html(html);
    infoCard.classed('active', true);
    infoCardBackdrop.classed('active', true);

    // Scroll to top of info card
    const infoCardElement = infoCard.node();
    if (infoCardElement) {
        infoCardElement.scrollTop = 0;
    }
}

// Add function to toggle from card and update button
window.toggleViewedFromCard = function(sceneId) {
    toggleViewed(sceneId);
    const btn = document.getElementById(`toggle-viewed-btn-${sceneId}`);
    const isViewed = state.viewedScenes.has(sceneId);
    if (btn) {
        btn.className = `btn btn-sm ${isViewed ? 'btn-success' : 'btn-outline-primary'}`;
        btn.textContent = isViewed ? '✓ Reviewed' : 'Mark as Reviewed';
    }
};

function hideInfoCard() {
    if (infoCard) {
        infoCard.classed('active', false);
        infoCardBackdrop.classed('active', false);
        state.lockedNode = null;
        unhighlightAll();
    }
}

// Jump to scene from connection link
function jumpToScene(sceneId) {
    const targetNode = d3.selectAll('.node')
        .filter(d => d.data.id === sceneId)
        .node();

    if (targetNode) {
        const nodeData = d3.select(targetNode).datum();
        showInfoCard(nodeData);
        highlightConnections(nodeData);

        // Scroll the info card to the top
        const infoCardElement = document.querySelector('.info-card-modal');
        if (infoCardElement) {
            infoCardElement.scrollTop = 0;
        }
    }
}

// Make functions globally accessible
window.hideInfoCard = hideInfoCard;
window.toggleViewed = toggleViewed;
window.jumpToScene = jumpToScene;

// ============================================
// COGNITIVE MARKER FILTERS
// ============================================

let activeMarkers = new Set();

function setupCognitiveMarkers() {
    document.querySelectorAll('[data-marker]').forEach(btn => {
        btn.addEventListener('click', function() {
            const marker = this.dataset.marker;

            if (activeMarkers.has(marker)) {
                activeMarkers.delete(marker);
                this.classList.remove('active');
            } else {
                activeMarkers.add(marker);
                this.classList.add('active');
            }

            filterVisualization();
        });
    });
}

// Update the filterVisualization function to include cognitive markers
filterVisualization = function() {
    if (!state.root || !allNodes) return;

    allNodes.forEach(node => {
        if (!node.data.id) return;

        let visible = true;

        // Act filter
        if (state.currentFilter !== 'all') {
            visible = visible && node.data.act === state.currentFilter;
        }

        // Cognitive filter
        if (state.cognitiveFilter) {
            visible = visible && node.data.cognitiveState === state.cognitiveFilter;
        }

        // Marker filter (AND logic - scene must have at least one active marker)
        if (activeMarkers.size > 0) {
            visible = visible && activeMarkers.has(node.data.cognitiveState);
        }

        // Apply visibility
        const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);
        nodeElement.style('opacity', visible ? 1 : 0.15);
        nodeElement.style('pointer-events', visible ? 'auto' : 'none');
    });

    // Update links
    if (linkGroup) {
        linkGroup.selectAll('.link').style('opacity', d => {
            const sourceVisible = d.source.data.id &&
                (state.currentFilter === 'all' || d.source.data.act === state.currentFilter) &&
                (!state.cognitiveFilter || d.source.data.cognitiveState === state.cognitiveFilter) &&
                (activeMarkers.size === 0 || activeMarkers.has(d.source.data.cognitiveState));

            const targetVisible = d.target.data.id &&
                (state.currentFilter === 'all' || d.target.data.act === state.currentFilter) &&
                (!state.cognitiveFilter || d.target.data.cognitiveState === state.cognitiveFilter) &&
                (activeMarkers.size === 0 || activeMarkers.has(d.target.data.cognitiveState));

            return (sourceVisible && targetVisible) ? 0.3 : 0.05;
        });
    }
};

// ============================================
// SEARCH
// ============================================

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchCounter = document.getElementById('search-counter');

    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        state.searchQuery = query;

        if (!query) {
            nodeGroup.selectAll('.node').classed('search-match', false).classed('search-dimmed', false);
            searchCounter.classList.remove('visible');
            return;
        }

        let matchCount = 0;

        nodeGroup.selectAll('.node').each(function(d) {
            const matches =
                d.data.title.toLowerCase().includes(query) ||
                (d.data.summary && d.data.summary.toLowerCase().includes(query)) ||
                (d.data.tags && d.data.tags.some(t => t.toLowerCase().includes(query))) ||
                (d.data.cognitiveState && d.data.cognitiveState.toLowerCase().includes(query));

            d3.select(this)
                .classed('search-match', matches)
                .classed('search-dimmed', !matches);

            if (matches) matchCount++;
        });

        searchCounter.textContent = `${matchCount}`;
        searchCounter.classList.add('visible');
        searchCounter.classList.toggle('has-results', matchCount > 0);
        searchCounter.classList.toggle('no-results', matchCount === 0);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
            hideInfoCard();
        }
    });
}

// ============================================
// BOOK CLUB QUESTIONS
// ============================================

window.toggleAnswer = function(event, button) {
    event.stopPropagation();
    const answerContent = button.nextElementSibling;
    const isShowing = answerContent.classList.contains('show');

    if (isShowing) {
        answerContent.classList.remove('show');
        button.textContent = 'Show Answer';
    } else {
        answerContent.classList.add('show');
        button.textContent = 'Hide Answer';
    }
};

window.highlightBookClubScenes = function(questionElement, event) {
    // Don't trigger if clicking answer button
    if (event.target.classList.contains('answer-toggle')) {
        return;
    }

    const scenesStr = questionElement.dataset.scenes;
    if (!scenesStr) return;

    const sceneIds = scenesStr.split(',').map(s => parseInt(s.trim()));

    // Toggle active state
    const wasActive = questionElement.classList.contains('active');

    // Remove active from all questions
    document.querySelectorAll('.book-club-question').forEach(q => {
        q.classList.remove('active');
    });

    if (wasActive) {
        // Deactivate - show all scenes
        if (allNodes) {
            allNodes.forEach(node => {
                if (!node.data.id) return;
                const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);
                nodeElement.style('opacity', 1);
                nodeElement.classed('highlighted', false);
            });
        }
        return;
    }

    // Activate this question
    questionElement.classList.add('active');

    // Highlight relevant scenes
    if (allNodes) {
        allNodes.forEach(node => {
            if (!node.data.id) return;

            const isHighlighted = sceneIds.includes(node.data.id);
            const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);

            nodeElement.style('opacity', isHighlighted ? 1 : 0.2);
            nodeElement.classed('highlighted', isHighlighted);

            if (isHighlighted) {
                // Pulse effect
                nodeElement.select('circle')
                    .transition()
                    .duration(300)
                    .attr('r', 8)
                    .transition()
                    .duration(300)
                    .attr('r', 6);
            }
        });
    }

    // Scroll visualization into view
    const vizContainer = document.getElementById('visualization-container');
    if (vizContainer) {
        vizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initialize();
    setupCognitiveMarkers();
});

