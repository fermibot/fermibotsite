/* ============================================
   THE SHINING - PSYCHOLOGICAL DESCENT TIMELINE
   D3.js Radial Visualization
   ============================================ */

console.log('The Shining - Psychological Timeline v1.0 loaded');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Act colors - matching visual progression
    ACT_COLORS: {
        'act1': '#4A90E2',  // Blue - Arrival
        'act2': '#D32F2F',  // Red - Deterioration
        'act3': '#212121'   // Black - Terror
    },

    // Psychological state colors
    PSYCHOLOGICAL_COLORS: {
        'stable': '#66BB6A',
        'deteriorating': '#FF9800',
        'psychotic': '#C62828'
    },

    // Act icons
    ACT_ICONS: {
        'act1': '🏔️',
        'act2': '🔥',
        'act3': '❄️'
    },

    // Act names
    ACT_NAMES: {
        'act1': 'Act I: Arrival',
        'act2': 'Act II: Deterioration',
        'act3': 'Act III: Terror'
    },

    // Layout
    DIAMETER: 900,
    STORAGE_KEY: 'shining-viewed-scenes',
    DATA_FILE: 'shining_scenes.json'
};

// ============================================
// DISCUSSION QUESTIONS
// ============================================

const DISCUSSION_QUESTIONS = [
    {
        id: 1,
        question: "Is Jack's descent into madness supernatural possession or psychological breakdown?",
        tags: ["supernatural", "psychology", "interpretation"],
        relatedScenes: [2, 6, 12, 16, 23]
    },
    {
        id: 2,
        question: "What does the Overlook Hotel represent symbolically?",
        tags: ["symbolism", "hotel", "evil"],
        relatedScenes: [2, 4, 6, 22, 33]
    },
    {
        id: 3,
        question: "How does Kubrick use symmetry and visual composition to create unease?",
        tags: ["kubrick", "cinematography", "visual"],
        relatedScenes: [1, 4, 7, 10, 22]
    },
    {
        id: 4,
        question: "What is the significance of Danny's 'shining' ability?",
        tags: ["supernatural", "danny", "psychic"],
        relatedScenes: [3, 5, 10, 19, 27]
    },
    {
        id: 5,
        question: "How does the film explore the cycle of abuse and family violence?",
        tags: ["family", "violence", "abuse"],
        relatedScenes: [3, 8, 12, 17, 25]
    },
    {
        id: 6,
        question: "What is the meaning of the photograph at the end?",
        tags: ["symbolism", "time", "photograph"],
        relatedScenes: [6, 12, 23, 33]
    },
    {
        id: 7,
        question: "How does isolation contribute to Jack's transformation?",
        tags: ["isolation", "madness", "environment"],
        relatedScenes: [1, 2, 6, 7, 9]
    },
    {
        id: 8,
        question: "What role does the hedge maze play symbolically and literally?",
        tags: ["symbolism", "maze", "escape"],
        relatedScenes: [4, 7, 31, 32]
    },
    {
        id: 9,
        question: "How does Kubrick deviate from Stephen King's novel, and why?",
        tags: ["kubrick", "adaptation", "interpretation"],
        relatedScenes: [2, 20, 23, 33]
    },
    {
        id: 10,
        question: "What is the significance of Room 237?",
        tags: ["supernatural", "room-237", "symbolism"],
        relatedScenes: [5, 13, 18, 20, 21]
    },
    {
        id: 11,
        question: "How does the film portray Wendy's character and her survival?",
        tags: ["family", "wendy", "survival"],
        relatedScenes: [8, 15, 18, 21, 25, 29]
    },
    {
        id: 12,
        question: "What does the Gold Room represent in Jack's psyche?",
        tags: ["symbolism", "psychology", "hotel"],
        relatedScenes: [16, 17, 22, 23]
    },
    {
        id: 13,
        question: "Is the supernatural real or a projection of mental illness?",
        tags: ["supernatural", "psychology", "interpretation"],
        relatedScenes: [10, 16, 20, 22, 23]
    },
    {
        id: 14,
        question: "How does the film explore alcoholism and addiction?",
        tags: ["addiction", "psychology", "jack"],
        relatedScenes: [3, 16, 17, 21]
    },
    {
        id: 15,
        question: "What is the meaning of 'REDRUM' and mirror imagery?",
        tags: ["symbolism", "danny", "prophecy"],
        relatedScenes: [27, 28, 29]
    },
    {
        id: 16,
        question: "How do the Grady twins function as symbols of innocence corrupted?",
        tags: ["supernatural", "symbolism", "children"],
        relatedScenes: [2, 3, 10, 23]
    },
    {
        id: 17,
        question: "What does Delbert Grady mean by 'You've always been the caretaker'?",
        tags: ["time", "supernatural", "identity"],
        relatedScenes: [2, 6, 23, 33]
    },
    {
        id: 18,
        question: "How does the film use color symbolism (red, blue, orange)?",
        tags: ["kubrick", "visual", "symbolism"],
        relatedScenes: [1, 4, 10, 22, 27]
    },
    {
        id: 19,
        question: "What is the significance of Native American imagery and the burial ground?",
        tags: ["symbolism", "history", "supernatural"],
        relatedScenes: [4, 5]
    },
    {
        id: 20,
        question: "How does Danny's intelligence and resourcefulness save him?",
        tags: ["danny", "survival", "intelligence"],
        relatedScenes: [29, 31, 32]
    }
];

// Make questions accessible globally
window.DISCUSSION_QUESTIONS = DISCUSSION_QUESTIONS;

// ============================================
// CENTRALIZED TAG SYSTEM
// ============================================

// Tag icon mapping - using actual scene tags
const TAG_ICONS = {
    // Core supernatural/horror
    'supernatural': '👻',
    'madness': '🌀',
    'violence': '🪓',
    'isolation': '🏔️',
    'possession': '😈',
    'ghosts': '👤',
    // Family dynamics
    'family': '👨‍👩‍👦',
    'family-violence': '💔',
    'family-breakdown': '⚠️',
    'abuse': '💢',
    'alcoholism': '🍺',
    // Psychic/visions
    'shining': '✨',
    'psychic': '🔮',
    'vision': '👁️',
    'prophecy': '🔮',
    'redrum': '🪞',
    // Key locations
    'hotel': '🏨',
    'maze': '🌿',
    'room-237': '🚪',
    'gold-room': '🏛️',
    'pantry': '🔒',
    // Characters
    'grady': '👔',
    'grady-twins': '👯',
    'halloran': '🧑',
    'tony': '🗣️',
    'lloyd': '🍸',
    // Key objects
    'photograph': '📸',
    'manuscript': '📝',
    'axe': '🪓',
    'baseball-bat': '⚾',
    'mirror': '🪞',
    // Themes
    'cyclical-time': '⏰',
    'history': '📜',
    'indian-burial-ground': '🪦',
    'cabin-fever': '❄️',
    'breakdown': '💥',
    'deterioration': '📉',
    // Actions
    'escape': '🏃',
    'survival': '🛡️',
    'chase': '🏃‍♂️',
    'attack': '⚔️',
    'rescue': '🚁',
    'trap': '🪤'
};

// Tag groups organized by actual scene tags
const TAG_GROUPS = {
    'Horror & Madness': ['supernatural', 'madness', 'violence', 'isolation', 'possession', 'ghosts'],
    'Family & Relationships': ['family', 'family-violence', 'family-breakdown', 'abuse', 'alcoholism'],
    'Psychic Powers': ['shining', 'psychic', 'vision', 'prophecy', 'redrum', 'tony'],
    'Key Locations': ['hotel', 'maze', 'room-237', 'gold-room', 'pantry'],
    'Characters': ['grady', 'grady-twins', 'halloran', 'lloyd'],
    'Symbols & Objects': ['photograph', 'manuscript', 'axe', 'baseball-bat', 'mirror'],
    'Time & History': ['cyclical-time', 'history', 'indian-burial-ground'],
    'Survival & Action': ['escape', 'survival', 'chase', 'attack', 'rescue', 'trap']
};

// Canonical tag order (flattened from groups)
const ALL_TAGS_ORDERED = [
    'supernatural', 'madness', 'violence', 'isolation', 'possession', 'ghosts',
    'family', 'family-violence', 'family-breakdown', 'abuse', 'alcoholism',
    'shining', 'psychic', 'vision', 'prophecy', 'redrum', 'tony',
    'hotel', 'maze', 'room-237', 'gold-room', 'pantry',
    'grady', 'grady-twins', 'halloran', 'lloyd',
    'photograph', 'manuscript', 'axe', 'baseball-bat', 'mirror',
    'cyclical-time', 'history', 'indian-burial-ground',
    'escape', 'survival', 'chase', 'attack', 'rescue', 'trap'
];

function buildTagBadges(tags) {
    if (!tags || tags.length === 0) return '';

    return tags.map(tag => {
        const icon = TAG_ICONS[tag] || '🏷️';
        const label = tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ');
        return `<span class="tag-badge tag-${tag}" title="${label}">${icon} ${label}</span>`;
    }).join(' ');
}

// Build ALL tags with only relevant ones highlighted
function buildAllTagsWithHighlights(activeTags) {
    const activeSet = new Set(activeTags || []);
    let html = '';

    for (const [groupName, groupTags] of Object.entries(TAG_GROUPS)) {
        html += `<div class="tag-group">`;
        html += `<span class="tag-group-label">${groupName}:</span>`;

        groupTags.forEach(tag => {
            const icon = TAG_ICONS[tag] || '🏷️';
            const label = tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ');
            const isActive = activeSet.has(tag);
            const activeClass = isActive ? '' : 'inactive';

            html += `<span class="tag-badge tag-${tag} ${activeClass}" title="Click to filter scenes with ${label}" onclick="window.toggleQuestionFilter('${tag}'); event.stopPropagation();">${icon} ${label}</span>`;
        });

        html += `</div>`;
    }

    return html;
}

// ============================================
// RENDER DISCUSSION QUESTIONS
// ============================================

function renderDiscussionQuestions() {
    const container = document.getElementById('questions-container');
    if (!container) {
        console.warn('Questions container not found');
        return;
    }

    // Create book-club-grid wrapper
    const grid = document.createElement('div');
    grid.className = 'book-club-grid';

    DISCUSSION_QUESTIONS.forEach(q => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'book-club-question';
        questionDiv.setAttribute('onclick', 'highlightBookClubScenes(this, event)');
        questionDiv.setAttribute('data-scenes', q.relatedScenes.join(','));

        // Question header
        const header = document.createElement('div');
        header.className = 'question-header';
        header.innerHTML = `
            <span class="question-number">${q.id}</span>
            <p class="question-text">${q.question}</p>
        `;

        // Question tags - show ALL tags with active/inactive states using centralized function
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'question-tags';
        tagsDiv.innerHTML = buildAllTagsWithHighlights(q.tags);

        // Find first scene to determine act
        const firstScene = q.relatedScenes[0];
        const scene = state.scenes.find(s => s.id === firstScene);
        const actIcon = scene ? CONFIG.ACT_ICONS[scene.act] : '🎬';
        const sceneText = q.relatedScenes.length === 1 ? `Scene ${q.relatedScenes[0]}` : `Scenes ${q.relatedScenes[0]}-${q.relatedScenes[q.relatedScenes.length-1]}`;

        // Question meta
        const meta = document.createElement('span');
        meta.className = 'question-meta';
        meta.textContent = `${actIcon} ${sceneText}`;

        // Show Answer button
        const answerToggle = document.createElement('button');
        answerToggle.className = 'answer-toggle';
        answerToggle.textContent = 'Show Answer';
        answerToggle.setAttribute('onclick', 'toggleAnswer(event, this)');

        // Answer content (hidden by default)
        const answerContent = document.createElement('div');
        answerContent.className = 'answer-content';
        answerContent.innerHTML = `<p>This question explores key themes in The Shining. Consider how multiple scenes work together to develop this idea, and how Kubrick's visual storytelling reinforces the narrative.</p>`;

        // Assemble
        questionDiv.appendChild(header);
        questionDiv.appendChild(tagsDiv);
        questionDiv.appendChild(meta);
        questionDiv.appendChild(answerToggle);
        questionDiv.appendChild(answerContent);

        grid.appendChild(questionDiv);
    });

    container.appendChild(grid);
    console.log(`Rendered ${DISCUSSION_QUESTIONS.length} discussion questions`);
}

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    scenes: [],
    root: null,
    viewedScenes: new Set(),
    currentFilter: 'all',
    psychologicalFilter: null,
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
        console.log(`Loaded ${state.scenes.length} The Shining scenes`);
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
    renderDiscussionQuestions();  // Render discussion questions
    initVisualization();
    setupEventListeners();
    initSearch();
    updateProgressUI();

    console.log('The Shining visualization initialized');
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

    // Psychological filter buttons
    document.querySelectorAll('[data-psychological]').forEach(btn => {
        btn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            document.querySelectorAll('[data-psychological]').forEach(b => b.classList.remove('active'));

            if (isActive) {
                state.psychologicalFilter = null;
            } else {
                this.classList.add('active');
                state.psychologicalFilter = this.dataset.psychological;
            }
            filterVisualization();
        });
    });

    // Sort buttons for discussion questions
    document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.addEventListener('click', function() {
            const sortType = this.dataset.sort;
            if (typeof window.sortQuestions === 'function') {
                window.sortQuestions(sortType);
            }
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
}

// ============================================
// HIERARCHY BUILDING
// ============================================

function buildHierarchy() {
    const root = {
        name: 'The Shining',
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
                    // Create foreshadowing link: source → target (solid blue)
                    imports.push({
                        source: node,
                        target: target,
                        type: 'foreshadowing'
                    });

                    // Also create callback link: target ← source (dashed purple)
                    imports.push({
                        source: target,
                        target: node,
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

function getPsychologicalColor(psychologicalState) {
    return CONFIG.PSYCHOLOGICAL_COLORS[psychologicalState] || '#666';
}

function getActIcon(act) {
    return CONFIG.ACT_ICONS[act] || '';
}

function formatCharacterName(name) {
    if (!name) return '';
    return name
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
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
        .text('0/33');

    // Grid of legend items
    const grid = legendContainer.append('div')
        .attr('class', 'legend-grid');

    // Separator after header
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Acts
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Filter by Act:');

    // Act colors with scene counts
    const actDetails = {
        'act1': { count: 9 },
        'act2': { count: 15 },
        'act3': { count: 9 }
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

    // Section label for Psychological States
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Psychological States:');

    // Psychological states
    const psychologicalStates = [
        { key: 'stable', label: 'Stable', color: '#66BB6A' },
        { key: 'deteriorating', label: 'Deteriorating', color: '#FF9800' },
        { key: 'psychotic', label: 'Psychotic', color: '#C62828' }
    ];

    psychologicalStates.forEach(state => {
        const item = grid.append('div')
            .attr('class', 'legend-item legend-marker-item')
            .attr('data-marker', state.key)
            .attr('title', `Click to filter: ${state.label}`)
            .on('click', () => togglePsychologicalFilter(state.key));

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

    // Build discussion tags from centralized TAG_GROUPS with group headers
    for (const [groupName, groupTags] of Object.entries(TAG_GROUPS)) {
        // Create a wrapper div for the entire group row (spans full width, one line per group)
        const groupRow = grid.append('div')
            .attr('class', 'legend-tag-group-row');

        // Add group label inline
        groupRow.append('span')
            .attr('class', 'legend-tag-group-label')
            .text(groupName + ':');

        // Add tags inline in the same row
        groupTags.forEach(tagKey => {
            const label = tagKey.charAt(0).toUpperCase() + tagKey.slice(1).replace(/-/g, ' ');
            const icon = TAG_ICONS[tagKey] || '🏷️';

            const item = groupRow.append('div')
                .attr('class', `legend-item legend-question-item tag-${tagKey}`)
                .attr('data-question', tagKey)
                .attr('title', `Filter scenes with ${label} discussion`)
                .on('click', () => toggleQuestionFilter(tagKey));

            // Add active indicator (dot)
            item.append('span')
                .attr('class', 'active-indicator')
                .text('✓');

            item.append('span')
                .attr('class', 'legend-icon')
                .text(icon);

            item.append('span')
                .attr('class', 'legend-text')
                .text(label);
        });
    }

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Connection Lines - all on one line
    const connectionsRow = grid.append('div')
        .attr('class', 'legend-connections-row');

    // Section label inline
    connectionsRow.append('span')
        .attr('class', 'legend-section-label')
        .style('margin-right', '0.5rem')
        .text('Connection Lines:');

    // Connection types inline
    const connectionTypes = [
        { key: 'foreshadowing', label: 'Foreshadows (what this scene hints at)', style: 'solid', color: '#3498db' },
        { key: 'callback', label: 'Callbacks (what earlier scenes hinted at this)', style: 'dashed', color: '#9b59b6' }
    ];

    connectionTypes.forEach(conn => {
        const item = connectionsRow.append('div')
            .attr('class', 'legend-item legend-connection-item')
            .style('cursor', 'default')
            .style('pointer-events', 'none')
            .style('display', 'flex')
            .style('align-items', 'center');

        const svg = item.append('svg')
            .attr('width', 30)
            .attr('height', 12)
            .style('vertical-align', 'middle')
            .style('margin-right', '8px');

        svg.append('line')
            .attr('x1', 0)
            .attr('y1', 6)
            .attr('x2', 30)
            .attr('y2', 6)
            .attr('stroke', conn.color)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', conn.style === 'dashed' ? '5,3' : null);

        item.append('span')
            .attr('class', 'legend-text')
            .text(conn.label);
    });

    // Add clear selection hint at bottom right of legend
    legendContainer.append('div')
        .attr('class', 'clear-selection-hint')
        .html('💡 <kbd>ESC</kbd> or <strong>click outside</strong> to clear selections');
}

// ============================================
// LEGEND FILTERING
// ============================================

const legendState = {
    activeActs: new Set(),
    activePsychological: new Set(),
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

function togglePsychologicalFilter(psychKey) {
    if (legendState.activePsychological.has(psychKey)) {
        legendState.activePsychological.delete(psychKey);
    } else {
        legendState.activePsychological.add(psychKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-marker-item')
        .classed('active', function() {
            return legendState.activePsychological.has(this.dataset.marker);
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

    // Update tag badges in discussion questions to reflect active state
    document.querySelectorAll('.tag-badge').forEach(badge => {
        const tagMatch = badge.className.match(/tag-(\S+)/);
        if (tagMatch && tagMatch[1]) {
            const tag = tagMatch[1].replace(/\s+inactive$/, '');
            if (legendState.activeQuestions.has(tag)) {
                badge.classList.remove('inactive');
            } else {
                // Only add inactive if the parent question doesn't have this tag active
                const parentQuestion = badge.closest('.book-club-question');
                if (parentQuestion) {
                    const questionTags = parentQuestion.querySelector('.question-tags');
                    if (questionTags) {
                        const activeTagsInQuestion = Array.from(questionTags.querySelectorAll('.tag-badge:not(.inactive)'))
                            .map(b => {
                                const m = b.className.match(/tag-(\S+)/);
                                return m ? m[1] : null;
                            })
                            .filter(Boolean);
                        if (!activeTagsInQuestion.includes(tag)) {
                            badge.classList.add('inactive');
                        }
                    }
                }
            }
        }
    });

    // Update visualization
    applyLegendFilters();
}

// Expose to window for onclick handlers
window.toggleQuestionFilter = toggleQuestionFilter;

function applyLegendFilters() {
    if (!allNodes || !nodeGroup) return;

    const hasActFilter = legendState.activeActs.size > 0;
    const hasPsychologicalFilter = legendState.activePsychological.size > 0;
    const hasQuestionFilter = legendState.activeQuestions.size > 0;

    allNodes.forEach(node => {
        if (!node.data.id) return;

        let visible = true;

        // Act filter
        if (hasActFilter) {
            visible = visible && legendState.activeActs.has(node.data.act);
        }

        // Psychological filter
        if (hasPsychologicalFilter) {
            visible = visible && legendState.activePsychological.has(node.data.psychologicalState);
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
                (!hasPsychologicalFilter || legendState.activePsychological.has(d.source.data.psychologicalState)) &&
                sourceHasMatchingTag;

            const targetVisible = d.target.data.id &&
                (!hasActFilter || legendState.activeActs.has(d.target.data.act)) &&
                (!hasPsychologicalFilter || legendState.activePsychological.has(d.target.data.psychologicalState)) &&
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
            const psychState = scene.psychologicalState || 'unknown';

            modalHTML += `
                <div class="progress-item ${isViewed ? 'viewed' : ''}" data-scene-id="${scene.id}">
                    <input type="checkbox"
                           ${isViewed ? 'checked' : ''}
                           onchange="window.toggleSceneViewed(${scene.id})">
                    <span class="progress-item-number">${scene.id}.</span>
                    <label class="progress-item-label">${scene.title}</label>
                    <span class="progress-item-cognitive" style="background: ${getPsychologicalColor(psychState)}" title="${psychState}"></span>
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

function initVisualization() {
    // Create legend first
    createLegendWithProgress();

    const container = d3.select('#visualization-container');
    container.html(''); // Clear loading overlay

    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = radius - 150;
    const verticalOffset = 50;
    const padding = 150;

    svg = container.append('svg')
        .attr('viewBox', `${-radius - padding} ${-radius - verticalOffset - padding} ${diameter + padding * 2} ${diameter + verticalOffset + padding * 2}`)
        .attr('width', '100%')
        .attr('height', diameter + verticalOffset + padding * 2)
        .style('max-width', `${diameter + padding * 2}px`)
        .style('font', '12px sans-serif');

    // Add glow filter for search and selection highlighting
    const defs = svg.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

    filter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '3')
        .attr('result', 'blur');

    filter.append('feMerge')
        .selectAll('feMergeNode')
        .data(['blur', 'SourceGraphic'])
        .enter()
        .append('feMergeNode')
        .attr('in', d => d);

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

    const nodeRadius = 18;

    linkGroup.selectAll('.link')
        .data(currentLinks)
        .join('path')
        .attr('class', d => `link link-${d.type}`)
        .attr('d', d => {
            const sourcePath = d.source.path(d.target);
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
            if (d.data.psychologicalState) {
                classes += ` ${d.data.psychologicalState}`;
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
            hideTooltip();
            showInfoCard(d);
            highlightConnections(d);
        });

    // Node circles with psychological state coloring
    nodes.append('circle')
        .attr('r', 6)
        .attr('fill', d => getPsychologicalColor(d.data.psychologicalState))
        .attr('stroke', d => getActColor(d.data.act))
        .attr('stroke-width', 2);

    // Checkmarks
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

    // Click outside to clear all selections
    svg.on('click', function() {
        clearAllSelections();
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
            let psychologicalMatch = !state.psychologicalFilter || d.data.psychologicalState === state.psychologicalFilter;
            return (actMatch && psychologicalMatch) ? 1 : 0.2;
        });

    linkGroup.selectAll('.link')
        .style('opacity', d => {
            let actMatch = state.currentFilter === 'all' ||
                          d.source.data.act === state.currentFilter ||
                          d.target.data.act === state.currentFilter;
            let psychologicalMatch = !state.psychologicalFilter ||
                                d.source.data.psychologicalState === state.psychologicalFilter ||
                                d.target.data.psychologicalState === state.psychologicalFilter;
            return (actMatch && psychologicalMatch) ? 0.3 : 0.05;
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
    });

    // Highlight connected nodes
    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', d => d.data.id === node.data.id)
        .classed('connection-dimmed', d => !connectedIds.has(d.data.id));

    // Highlight relevant links
    linkGroup.selectAll('.link')
        .style('opacity', d => {
            const isFromNode = (d.source.data.id === node.data.id);
            return isFromNode ? 1 : 0.1;
        })
        .classed('highlighted', d => d.source.data.id === node.data.id)
        .classed('dimmed', d => d.source.data.id !== node.data.id);
}

function unhighlightAll() {
    state.hoveredNode = null;

    if (state.lockedNode) return;

    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', false)
        .classed('connection-dimmed', false);

    linkGroup.selectAll('.link')
        .style('opacity', null)
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

    // Build psychological state
    const psychologicalHtml = buildPsychologicalStateTags(scene.psychologicalState);

    let html = `
        <div class="tooltip-header">
            <span class="tooltip-icon">${getActIcon(scene.act)}</span>
            <span class="tooltip-title">${scene.id}. ${scene.title}</span>
        </div>
        ${locationTimeHtml}
        <div class="tooltip-cognitive">
            ${psychologicalHtml}
        </div>
        ${scene.tags && scene.tags.length > 0 ? `
        <div class="tooltip-tags">
            ${buildTagBadges(scene.tags)}
        </div>
        ` : ''}
        <div class="tooltip-hint">Click for full details & connections</div>
    `;

    tooltip.html(html)
        .classed('visible', true);

    // Position tooltip
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
        .attr('class', 'info-card-backdrop');

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
    if (loc.description) {
        html += `<div class="location-significance"><em>${loc.description}</em></div>`;
    }
    if (scene.time) {
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

    html += `</div></div>`;
    return html;
}

function buildCharacterSection(scene) {
    if (!scene.characterDevelopment) return '';

    const charDev = scene.characterDevelopment;
    let html = `<div class="info-card-section">
        <div class="info-card-section-title">👤 Character Development</div>`;

    // Build character development for Jack, Wendy, Danny
    ['Jack', 'Wendy', 'Danny'].forEach(charName => {
        const char = charDev[charName];
        if (char) {
            html += `<div class="character-block">
                <div class="character-name">${charName} Torrance</div>`;

            if (char.state) {
                html += `<div class="character-state"><strong>State:</strong> ${char.state}</div>`;
            }
            if (char.arc) {
                html += `<div class="character-arc"><strong>Arc:</strong> ${char.arc}</div>`;
            }

            html += `</div>`;
        }
    });

    html += `</div>`;
    return html;
}

function buildDialogueSection(scene) {
    if (!scene.keyDialogue || scene.keyDialogue.length === 0) return '';

    let html = `<div class="info-card-quotes">
        <strong>💬 Key Dialogue:</strong>
        <div class="quotes-list">`;

    scene.keyDialogue.forEach(dialogue => {
        const speaker = dialogue.speaker || '';
        const quote = dialogue.quote || '';
        const sig = dialogue.significance ? ` — ${dialogue.significance}` : '';
        html += `<div class="quote-item"><strong>${speaker}:</strong> <em>"${quote}"</em>${sig}</div>`;
    });

    html += `</div></div>`;
    return html;
}

function buildThemesSection(scene) {
    if (!scene.tags || scene.tags.length === 0) return '';

    let html = `<div class="info-card-quotes">
        <strong>🎭 Themes:</strong>
        <div class="quotes-list">`;

    html += `<div class="quote-item">${scene.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1).replace(/-/g, ' ')).join(', ')}</div>`;

    html += `</div></div>`;
    return html;
}

function getTensionColor(tension) {
    if (tension <= 3) return '#43a047'; // Green - low tension
    if (tension <= 5) return '#ffc107'; // Yellow - medium tension
    if (tension <= 7) return '#ff9800'; // Orange - high tension
    return '#c62828'; // Dark red - extreme tension (matching psychotic state)
}

function buildTensionBar(scene) {
    if (!scene.tensionLevel) return '';

    const tensionLevel = Math.min(10, Math.max(1, scene.tensionLevel));
    const tensionPercent = (tensionLevel / 10) * 100;

    return `<div class="info-card-section">
        <div class="info-card-section-title">⚡ Tension Level</div>
        <div class="tension-bar-wrapper">
            <div class="tension-bar">
                <div class="tension-fill" style="width: ${tensionPercent}%; background: ${getTensionColor(tensionLevel)};"></div>
            </div>
            <span class="tension-value">${tensionLevel}/10</span>
        </div>
    </div>`;
}

function buildPsychologicalStateTags(psychologicalState) {
    if (!psychologicalState) {
        return '<span class="info-card-type psychological-unknown">❓ unknown</span>';
    }

    // Map psychological states to appropriate icons
    const stateIcons = {
        'stable': '😊',
        'deteriorating': '⚠️',
        'psychotic': '😱'
    };

    const icon = stateIcons[psychologicalState] || '❓';
    const state = psychologicalState.replace(/_/g, ' ');
    return `<span class="info-card-type psychological-${psychologicalState}">${icon} ${state}</span>`;
}

function getPsychologicalStatePrefix(psychologicalState) {
    if (!psychologicalState) {
        return '❓';
    }

    // Map psychological states to appropriate icons
    const stateIcons = {
        'stable': '😊',
        'deteriorating': '⚠️',
        'psychotic': '😱'
    };

    return stateIcons[psychologicalState] || '❓';
}

function buildConnectionsSection(scene) {
    const hasForeshadowing = scene.foreshadowing && scene.foreshadowing.length > 0;

    if (!hasForeshadowing) return '';

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

    html += `</div>`;
    return html;
}

function showInfoCard(node) {
    if (!infoCard) initInfoCard();

    const scene = node.data;

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

    // Build location/time display
    let locationTimeHtml = '';
    if (scene.location || scene.time) {
        locationTimeHtml = '<div class="info-card-location" style="display: block; padding: 0.5rem 1rem;">';

        if (scene.location && scene.location.primary) {
            locationTimeHtml += `<div class="location-text" style="margin-bottom: 0.15rem;">📍 ${scene.location.primary}</div>`;
        }

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
                locationTimeHtml += `<div class="time-text" style="margin-bottom: 0.15rem;">🕐 ${timeText}</div>`;
            }
        }

        if (scene.location && scene.location.description) {
            locationTimeHtml += `<div style="font-size: 0.85rem; color: var(--viz-text-muted);">💡 ${scene.location.description}</div>`;
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
        <div class="info-card-action-bar">
            <button class="btn btn-sm btn-outline-secondary"
                    onclick="window.showScreenplayExcerpt(${scene.id})">
                📄 View Screenplay
            </button>
            <button class="btn btn-sm ${isViewed ? 'btn-success' : 'btn-outline-primary'}"
                    id="toggle-viewed-btn-${scene.id}"
                    onclick="window.toggleViewedFromCard(${scene.id})">
                ${isViewed ? '✓ Reviewed' : 'Mark as Reviewed'}
            </button>
        </div>
        ${locationTimeHtml}
        ${scene.tags && scene.tags.length > 0 ? `
        <div class="info-card-tags-section">
            <div class="info-card-tags-label">🏷️ Discussion Topics</div>
            <div class="info-card-tags">
                ${buildTagBadges(scene.tags)}
            </div>
        </div>
        ` : ''}
        <div class="info-card-body">
            <div class="info-card-summary">
                <strong>${getPsychologicalStatePrefix(scene.psychologicalState)}</strong> | ${summaryText || 'No summary available'}
            </div>
            ${buildTensionBar(scene)}
            ${buildCharacterSection(scene)}
            ${buildDialogueSection(scene)}
            ${buildThemesSection(scene)}
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
        state.hoveredNode = null;

        if (nodeGroup) {
            nodeGroup.selectAll('.node')
                .classed('connection-highlighted', false)
                .classed('connection-dimmed', false);
        }

        if (linkGroup) {
            linkGroup.selectAll('.link')
                .style('opacity', null)
                .classed('highlighted', false)
                .classed('dimmed', false);
        }
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
// PSYCHOLOGICAL MARKER FILTERS
// ============================================

let activeMarkers = new Set();

function setupPsychologicalMarkers() {
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

// Update the filterVisualization function to include psychological markers
filterVisualization = function() {
    if (!state.root || !allNodes) return;

    allNodes.forEach(node => {
        if (!node.data.id) return;

        let visible = true;

        if (state.currentFilter !== 'all') {
            visible = visible && node.data.act === state.currentFilter;
        }

        if (state.psychologicalFilter) {
            visible = visible && node.data.psychologicalState === state.psychologicalFilter;
        }

        if (activeMarkers.size > 0) {
            visible = visible && activeMarkers.has(node.data.psychologicalState);
        }

        const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);
        nodeElement.style('opacity', visible ? 1 : 0.15);
        nodeElement.style('pointer-events', visible ? 'auto' : 'none');
    });

    if (linkGroup) {
        linkGroup.selectAll('.link').style('opacity', d => {
            const sourceVisible = d.source.data.id &&
                (state.currentFilter === 'all' || d.source.data.act === state.currentFilter) &&
                (!state.psychologicalFilter || d.source.data.psychologicalState === state.psychologicalFilter) &&
                (activeMarkers.size === 0 || activeMarkers.has(d.source.data.psychologicalState));

            const targetVisible = d.target.data.id &&
                (state.currentFilter === 'all' || d.target.data.act === state.currentFilter) &&
                (!state.psychologicalFilter || d.target.data.psychologicalState === state.psychologicalFilter) &&
                (activeMarkers.size === 0 || activeMarkers.has(d.target.data.psychologicalState));

            return (sourceVisible && targetVisible) ? 0.3 : 0.05;
        });
    }
};

// ============================================
// CLEAR ALL SELECTIONS
// ============================================

function clearAllSelections() {
    // Clear search
    const searchInput = document.getElementById('search-input');
    const searchCounter = document.getElementById('search-counter');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.blur();
    }
    if (searchCounter) {
        searchCounter.classList.remove('visible');
    }

    // Clear info card
    hideInfoCard();
    hideTooltip();

    // Clear locked node and unhighlight connections
    state.lockedNode = null;
    state.hoveredNode = null;

    // Remove all highlight classes
    if (nodeGroup) {
        nodeGroup.selectAll('.node')
            .classed('connection-highlighted', false)
            .classed('connection-dimmed', false);
    }

    if (linkGroup) {
        linkGroup.selectAll('.link')
            .classed('highlighted', false)
            .classed('dimmed', false);
    }

    // Clear legend filters (act, psychological, question)
    legendState.activeActs.clear();
    legendState.activePsychological.clear();
    legendState.activeQuestions.clear();

    // Update legend item appearance
    d3.selectAll('.legend-item[data-act]').classed('active', false);
    d3.selectAll('.legend-marker-item').classed('active', false);
    d3.selectAll('.legend-question-item').classed('active', false);

    // Clear book club question highlights
    document.querySelectorAll('.book-club-question').forEach(q => {
        q.classList.remove('active');
    });

    // Reset visualization filters
    applyLegendFilters();

    // Show all nodes and reset opacity
    if (allNodes && nodeGroup) {
        allNodes.forEach(node => {
            if (!node.data.id) return;
            const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);
            nodeElement.style('opacity', 1);
            nodeElement.style('pointer-events', 'auto');
            nodeElement.classed('highlighted', false);
            nodeElement.classed('search-match', false);
            nodeElement.classed('search-dimmed', false);
            nodeElement.classed('connection-highlighted', false);
            nodeElement.classed('connection-dimmed', false);
        });
    }

    // Reset all links to default opacity (remove inline styles to use stroke-opacity attribute)
    if (linkGroup) {
        linkGroup.selectAll('.link')
            .style('opacity', null)  // Remove inline opacity to restore default stroke-opacity
            .classed('highlighted', false)
            .classed('dimmed', false);
    }
}

// Make clearAllSelections globally accessible
window.clearAllSelections = clearAllSelections;

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
            if (searchCounter) searchCounter.classList.remove('visible');
            return;
        }

        let matchCount = 0;

        nodeGroup.selectAll('.node').each(function(d) {
            const matches =
                d.data.title.toLowerCase().includes(query) ||
                (d.data.summary && d.data.summary.toLowerCase().includes(query)) ||
                (d.data.tags && d.data.tags.some(t => t.toLowerCase().includes(query))) ||
                (d.data.psychologicalState && d.data.psychologicalState.toLowerCase().includes(query));

            d3.select(this)
                .classed('search-match', matches)
                .classed('search-dimmed', !matches);

            if (matches) matchCount++;
        });

        if (searchCounter) {
            searchCounter.textContent = `${matchCount}`;
            searchCounter.classList.add('visible');
            searchCounter.classList.toggle('has-results', matchCount > 0);
            searchCounter.classList.toggle('no-results', matchCount === 0);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            clearAllSelections();
        }
    });
}

// ============================================
// BOOK CLUB QUESTIONS
// ============================================

window.toggleAnswer = function(event, button) {
    event.stopPropagation();
    const answerContent = button.nextElementSibling;
    const isShowing = answerContent.classList.contains('visible');

    if (isShowing) {
        answerContent.classList.remove('visible');
        button.textContent = 'Show Answer';
    } else {
        answerContent.classList.add('visible');
        button.textContent = 'Hide Answer';
    }
};

window.highlightBookClubScenes = function(questionElement, event) {
    if (event.target.classList.contains('answer-toggle')) {
        return;
    }

    const scenesStr = questionElement.dataset.scenes;
    if (!scenesStr) return;

    const sceneIds = scenesStr.split(',').map(s => parseInt(s.trim()));

    const wasActive = questionElement.classList.contains('active');

    document.querySelectorAll('.book-club-question').forEach(q => {
        q.classList.remove('active');
    });

    if (wasActive) {
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

    questionElement.classList.add('active');

    if (allNodes) {
        allNodes.forEach(node => {
            if (!node.data.id) return;

            const isHighlighted = sceneIds.includes(node.data.id);
            const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);

            nodeElement.style('opacity', isHighlighted ? 1 : 0.2);
            nodeElement.classed('highlighted', isHighlighted);

            if (isHighlighted) {
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

    const vizContainer = document.getElementById('visualization-container');
    if (vizContainer) {
        vizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Sort questions by thematic or chronological order
window.sortQuestions = function(sortType) {
    const grid = document.querySelector('.book-club-grid');
    if (!grid) return;

    // Update button states
    document.querySelectorAll('[data-sort]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortType);
    });

    const questions = Array.from(grid.querySelectorAll('.book-club-question'));

    // Initialize order attributes on first run - store original serial number
    if (!questions[0].dataset.originalNumber) {
        questions.forEach((q, index) => {
            q.dataset.originalNumber = index + 1; // Store original serial number (1-based)
            q.dataset.thematicOrder = index; // Store original thematic position (0-based for sorting)
        });
    }

    // Sort based on type
    if (sortType === 'film-order') {
        // Sort by first scene number (chronological in film)
        questions.sort((a, b) => {
            const aScenesStr = a.dataset.scenes || '';
            const bScenesStr = b.dataset.scenes || '';
            const aFirstScene = parseInt(aScenesStr.split(',')[0]) || 999;
            const bFirstScene = parseInt(bScenesStr.split(',')[0]) || 999;
            return aFirstScene - bFirstScene;
        });
    } else {
        // Sort by original thematic order
        questions.sort((a, b) => {
            return parseInt(a.dataset.thematicOrder) - parseInt(b.dataset.thematicOrder);
        });
    }

    // Re-append in sorted order (numbers don't change, they stay with their questions)
    questions.forEach((question) => {
        grid.appendChild(question);
    });
};

// ============================================
// START
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initialize();
    setupPsychologicalMarkers();

    // Show screenplay excerpt for a scene
    window.showScreenplayExcerpt = function(sceneId) {
        const scene = state.scenes.find(s => s.id === sceneId);
        if (!scene) return;

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.className = 'screenplay-modal-overlay';
        overlay.onclick = () => document.body.removeChild(overlay);

        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'screenplay-modal';
        modal.onclick = (e) => e.stopPropagation();

        // Build summary text
        let summaryText = '';
        if (scene.plotSummary) {
            if (typeof scene.plotSummary === 'string') {
                summaryText = scene.plotSummary;
            } else if (scene.plotSummary.detailed) {
                summaryText = scene.plotSummary.detailed;
            } else if (scene.plotSummary.brief) {
                summaryText = scene.plotSummary.brief;
            }
        }

        modal.innerHTML = `
            <div class="screenplay-modal-header">
                <h4>Scene ${scene.id}: ${scene.title}</h4>
                <button class="screenplay-modal-close" onclick="this.closest('.screenplay-modal-overlay').remove()">&times;</button>
            </div>
            <div class="screenplay-modal-body">
                <div class="screenplay-info">
                    <p><strong>Act:</strong> ${CONFIG.ACT_NAMES[scene.act]}</p>
                    <p><strong>Location:</strong> ${scene.location?.primary || 'Unknown'}</p>
                    ${scene.time?.narrative ? `<p><strong>Time:</strong> ${scene.time.narrative}</p>` : ''}
                    <p><strong>Psychological State:</strong> ${getPsychologicalStatePrefix(scene.psychologicalState)} ${scene.psychologicalState || 'Unknown'}</p>
                </div>
                <div class="screenplay-content">
                    <h5>Scene Summary</h5>
                    <p>${summaryText || 'No summary available'}</p>
                    ${scene.significance ? `
                    <h5>Significance</h5>
                    <p>${scene.significance}</p>
                    ` : ''}
                    ${scene.keyDialogue && scene.keyDialogue.length > 0 ? `
                    <h5>Key Dialogue</h5>
                    ${scene.keyDialogue.map(d => `
                        <div class="dialogue-item">
                            <p><strong>${d.speaker}:</strong> "${d.quote}"</p>
                            ${d.significance ? `<p class="dialogue-context">${d.significance}</p>` : ''}
                        </div>
                    `).join('')}
                    ` : ''}
                </div>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);
    };

    // Sort questions by film order by default
    setTimeout(() => {
        if (typeof window.sortQuestions === 'function') {
            sortQuestions('film-order');
        }
    }, 100);

    // Add click to page background to clear selections
    document.body.addEventListener('click', function(e) {
        if (!e.target.closest('.node') &&
            !e.target.closest('.legend-item') &&
            !e.target.closest('.book-club-question') &&
            !e.target.closest('.info-card-modal') &&
            !e.target.closest('button') &&
            !e.target.closest('input') &&
            !e.target.closest('svg') &&
            !e.target.closest('.controls-bar') &&
            !e.target.closest('#legend-container')) {
            clearAllSelections();
        }
    });
});
