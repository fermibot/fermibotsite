/* ============================================
   GATTACA - GENETIC DESTINY TIMELINE
   D3.js Radial Visualization
   ============================================ */

console.log('Gattaca - Genetic Timeline v1.0 loaded');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Act colors - matching visual progression
    ACT_COLORS: {
        'act1': '#1565C0',  // Blue - Corporate perfection
        'act2': '#F9A825',  // Gold - Investigation & tension
        'act3': '#90A4AE'   // Silver - Resolution & ascent
    },

    // Identity Risk colors (Gattaca-themed) - distinct progression
    IDENTITY_RISK_COLORS: {
        'secure': '#4CAF50',     // Green - Identity safe
        'watchful': '#29B6F6',   // Light blue - Heightened awareness
        'threatened': '#FF5722', // Deep orange - At risk
        'crisis': '#E53935'      // Red - Exposure imminent
    },

    // Act icons
    ACT_ICONS: {
        'act1': '🧬',
        'act2': '🔍',
        'act3': '🚀'
    },

    // Act names
    ACT_NAMES: {
        'act1': 'Act I: Deception',
        'act2': 'Act II: Investigation',
        'act3': 'Act III: Ascension'
    },

    // Layout
    DIAMETER: 900,
    STORAGE_KEY: 'gattaca-viewed-scenes',
    DATA_FILE: 'AndrewNiccol_1997_Gattaca_scenes_analyzed_final.json?v=2026.01.16.49'
};

// ============================================
// DISCUSSION QUESTIONS
// ============================================

const DISCUSSION_QUESTIONS = [
    {
        id: 1,
        question: "Is Vincent's deception at Gattaca morally justified given the genetic discrimination he faces?",
        category: "Ethics",
        tags: ["vincent", "identity", "genetics", "gattaca-corporation"],
        relatedScenes: [25, 45, 85],
        relatedTags: ["identity", "genetics", "vincent"]
    },
    {
        id: 2,
        question: "Does Vincent's 'borrowed ladder' identity diminish his genuine achievements?",
        category: "Identity",
        tags: ["vincent", "jerome-eugene", "identity", "achievement"],
        relatedScenes: [1, 50, 120],
        relatedTags: ["identity", "vincent", "jerome-eugene"]
    },
    {
        id: 3,
        question: "What does Eugene/Jerome's character arc say about the cost of genetic perfection?",
        category: "Humanity",
        tags: ["jerome-eugene", "genetics", "perfection"],
        relatedScenes: [30, 90, 123],
        relatedTags: ["jerome-eugene", "genetics"]
    },
    {
        id: 4,
        question: "Is the society in Gattaca's genetic discrimination fundamentally different from other forms of discrimination?",
        category: "Society",
        tags: ["genetics", "gattaca-corporation", "discrimination"],
        relatedScenes: [15, 40, 70],
        relatedTags: ["genetics", "gattaca-corporation"]
    },
    {
        id: 5,
        question: "How does the film explore the relationship between genetic potential and actual achievement?",
        category: "Merit",
        tags: ["genetics", "achievement", "vincent", "jerome-eugene"],
        relatedScenes: [2, 60, 125],
        relatedTags: ["genetics", "vincent"]
    },
    {
        id: 6,
        question: "What role does the daily deception ritual play in Vincent's psychology and identity?",
        category: "Identity",
        tags: ["vincent", "identity", "home"],
        relatedScenes: [1, 2, 3],
        relatedTags: ["vincent", "identity", "home"]
    },
    {
        id: 7,
        question: "Is Irene and Vincent's relationship built on genuine connection or mutual deception?",
        category: "Relationships",
        tags: ["irene", "vincent", "romance"],
        relatedScenes: [51, 75, 110],
        relatedTags: ["irene", "vincent", "romance"]
    },
    {
        id: 8,
        question: "How does the film critique our current use of genetic testing and selection?",
        category: "Society",
        tags: ["genetics", "ethics"],
        relatedScenes: [11, 20, 40],
        relatedTags: ["genetics"]
    },
    {
        id: 9,
        question: "What is the significance of Vincent beating Anton in swimming despite genetic inferiority?",
        category: "Will vs. Genetics",
        tags: ["vincent", "anton"],
        relatedScenes: [18, 105],
        relatedTags: ["vincent", "anton"]
    },
    {
        id: 10,
        question: "Does the film suggest that determination can overcome any genetic limitation?",
        category: "Philosophy",
        tags: ["vincent", "genetics", "achievement"],
        relatedScenes: [5, 100, 125],
        relatedTags: ["vincent", "genetics"]
    },
    {
        id: 11,
        question: "How does Doctor Lamar's final revelation reframe the entire film?",
        category: "Ethics",
        tags: ["vincent", "gattaca-corporation"],
        relatedScenes: [124],
        relatedTags: ["vincent", "gattaca-corporation"]
    },
    {
        id: 12,
        question: "What does Eugene's final act say about the burden of unfulfilled genetic potential?",
        category: "Tragedy",
        tags: ["jerome-eugene", "genetics"],
        relatedScenes: [123],
        relatedTags: ["jerome-eugene"]
    },
    {
        id: 13,
        question: "Is Vincent's heart defect a disability or a symbol of his authentic humanity?",
        category: "Symbolism",
        tags: ["vincent", "genetics"],
        relatedScenes: [8, 95],
        relatedTags: ["vincent", "genetics"]
    },
    {
        id: 14,
        question: "How does the film's retro-futuristic aesthetic comment on progress and technology?",
        category: "Aesthetics",
        tags: ["gattaca-corporation"],
        relatedScenes: [4, 20, 30],
        relatedTags: ["gattaca-corporation"]
    },
    {
        id: 15,
        question: "What does the film suggest about the relationship between identity and biology?",
        category: "Identity",
        tags: ["identity", "genetics", "vincent"],
        relatedScenes: [1, 50, 125],
        relatedTags: ["identity", "genetics", "vincent"]
    }
];

// Make questions accessible globally
window.DISCUSSION_QUESTIONS = DISCUSSION_QUESTIONS;

// ============================================
// TAG SYSTEM - Gattaca Themes
// ============================================

// Tag icon mapping for Gattaca
const TAG_ICONS = {
    // Main Characters (only used ones)
    'vincent': '🎭',
    'jerome-eugene': '🦽',
    'irene': '💝',
    'anton': '👮',
    'lamar': '👨‍⚕️',

    // Genetics & Identity
    'genetics': '🧬',
    'identity': '🎭',
    'valid': '✓',
    'invalid': '✗',
    'deception': '🎭',
    'discrimination': '⚖️',

    // Locations
    'gattaca-corporation': '🏢',
    'home': '🏠',

    // Space & Mission
    'space-travel': '🚀',

    // Romance
    'romance': '💕',

    // Investigation & Danger
    'investigation': '🔍',
    'murder': '🔪',

    // Themes
    'determination': '💪',
    'sacrifice': '🕊️',
    'perfection': '⭐',
};

// Tag groups organized by category (only used tags)
const TAG_GROUPS = {
    'Characters': ['vincent', 'jerome-eugene', 'irene', 'anton', 'lamar'],
    'Genetics': ['genetics', 'valid', 'invalid', 'discrimination'],
    'Identity': ['identity', 'deception'],
    'Locations': ['gattaca-corporation', 'home'],
    'Mission': ['space-travel'],
    'Relationships': ['romance'],
    'Investigation': ['investigation', 'murder'],
    'Themes': ['determination', 'sacrifice', 'perfection']
};

// Canonical tag order (only used tags)
const ALL_TAGS_ORDERED = [
    'vincent', 'jerome-eugene', 'irene', 'anton', 'lamar',
    'genetics', 'valid', 'invalid', 'discrimination',
    'identity', 'deception',
    'gattaca-corporation', 'home',
    'space-travel',
    'romance',
    'investigation', 'murder',
    'determination', 'sacrifice', 'perfection'
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

            html += `<span class="tag-badge tag-${tag} ${activeClass} tag-non-clickable" title="${label}">${icon} ${label}</span>`;
        });

        html += `</div>`;
    }

    return html;
}

// ============================================
// RENDER DISCUSSION QUESTIONS
// ============================================

function renderDiscussionQuestions(sortMode = 'film-order') {
    const container = document.getElementById('questions-container');
    if (!container) {
        console.warn('Questions container not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Create book-club-grid wrapper
    const grid = document.createElement('div');
    grid.className = 'book-club-grid';

    // Sort questions based on sortMode
    let sortedQuestions = [...(state.discussionQuestions || [])];
    if (sortMode === 'theme') {
        // Sort by theme alphabetically, but keep ID as secondary sort for consistency
        sortedQuestions.sort((a, b) => {
            const themeCompare = (a.theme || '').localeCompare(b.theme || '');
            return themeCompare !== 0 ? themeCompare : a.id - b.id;
        });
    } else {
        // Default: sort by ID (film-order/timeline)
        sortedQuestions.sort((a, b) => a.id - b.id);
    }

    // Track current theme for group headers
    let currentTheme = null;

    sortedQuestions.forEach(q => {
        // Find scenes related to this question
        // In Gattaca JSON, discussionQuestions is array of IDs [1, 5, 9], not objects
        const relatedScenes = state.scenes.filter(s =>
            s.discussionQuestions && s.discussionQuestions.includes(q.id)
        );
        const sceneIds = relatedScenes.map(s => s.id);

        if (sceneIds.length === 0) return; // Skip if no scenes

        // Add theme group header when theme changes (only in theme sort mode)
        if (sortMode === 'theme' && q.theme && q.theme !== currentTheme) {
            currentTheme = q.theme;
            const themeHeader = document.createElement('div');
            themeHeader.className = 'theme-group-header';
            themeHeader.textContent = currentTheme;
            grid.appendChild(themeHeader);
        }

        const questionDiv = document.createElement('div');
        questionDiv.className = 'book-club-question';
        questionDiv.setAttribute('onclick', 'highlightBookClubScenes(this, event)');
        questionDiv.setAttribute('data-scenes', sceneIds.join(','));
        questionDiv.setAttribute('data-question-id', q.id);

        // Question header
        const header = document.createElement('div');
        header.className = 'question-header';
        header.innerHTML = `
            <span class="question-number">${q.id}</span>
            <p class="question-text">${q.question}</p>
        `;

        // Question tags - show category and related tags as styled badges
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'question-tags';
        tagsDiv.innerHTML = buildTagBadges(q.relatedTags);

        // Find first scene to determine act
        const firstScene = sceneIds[0];
        const scene = state.scenes.find(s => s.id === firstScene);
        const actIcon = scene ? CONFIG.ACT_ICONS[scene.act] : '🎬';
        const sceneText = sceneIds.length === 1 ? `Scene ${sceneIds[0]}` : `${sceneIds.length} scenes`;

        // Question meta
        const meta = document.createElement('span');
        meta.className = 'question-meta';
        meta.textContent = `${actIcon} ${sceneText} | ${q.category}`;

        // Assemble
        questionDiv.appendChild(header);
        questionDiv.appendChild(tagsDiv);
        questionDiv.appendChild(meta);

        grid.appendChild(questionDiv);
    });

    container.appendChild(grid);
    console.log(`Rendered ${state.discussionQuestions.length} discussion questions`);
}

// Sort discussion questions and update button states
window.sortQuestions = function(sortType) {
    // Update button active states
    document.querySelectorAll('.question-sort-toggle button[data-sort]').forEach(btn => {
        if (btn.dataset.sort === sortType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update sort mode indicator
    const indicator = document.getElementById('sort-mode-indicator');
    if (indicator) {
        if (sortType === 'theme') {
            indicator.textContent = '(Theme Order)';
        } else {
            indicator.textContent = '(Timeline Order)';
        }
    }

    // Re-render questions with new sort order
    renderDiscussionQuestions(sortType);
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
        // Add cache-busting parameter to ensure fresh data
        const response = await fetch(`${CONFIG.DATA_FILE}?v=${Date.now()}`);
        const data = await response.json();
        state.scenes = data.scenes;
        state.discussionQuestions = data.discussionQuestions || [];
        state.chapters = data.chapters || {};
        console.log(`Loaded ${state.scenes.length} Gattaca scenes, ${state.discussionQuestions.length} discussion questions, and ${Object.keys(state.chapters).length} chapters`);
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

    console.log('Gattaca visualization initialized');
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
    const timelineBtn = document.getElementById('sort-timeline-btn');
    const themeBtn = document.getElementById('sort-theme-btn');

    if (timelineBtn) {
        timelineBtn.addEventListener('click', function() {
            if (typeof window.sortQuestions === 'function') {
                window.sortQuestions('film-order');
            }
        });
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            if (typeof window.sortQuestions === 'function') {
                window.sortQuestions('theme');
            }
        });
    }

    // Clear question filter button
    const clearFilterBtn = document.getElementById('clear-question-filter');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            if (typeof window.clearQuestionFilter === 'function') {
                window.clearQuestionFilter();
            }
        });
    }

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
        name: 'Gattaca',
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

        // Standard foreshadowing/callback connections
        if (scene.foreshadowing) {
            scene.foreshadowing.forEach(connection => {
                const targetId = connection.sceneId || connection;
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'foreshadowing'
                    });
                    imports.push({
                        source: target,
                        target: node,
                        type: 'callback'
                    });
                }
            });
        }

        // Genetic Defiance - genes contradicted by outcomes (DNA helix cyan-gold)
        if (scene.geneticDefiance) {
            scene.geneticDefiance.forEach(connection => {
                const targetId = connection.sceneId || connection;
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'geneticDefiance'
                    });
                }
            });
        }

        // Invalid Triumph - invalids proving system wrong (rebellious red-gold)
        if (scene.invalidTriumph) {
            scene.invalidTriumph.forEach(connection => {
                const targetId = connection.sceneId || connection;
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'invalidTriumph'
                    });
                }
            });
        }

        // Transcendence - rising above limitations (ethereal purple-white)
        if (scene.transcendence) {
            scene.transcendence.forEach(connection => {
                const targetId = connection.sceneId || connection;
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'transcendence'
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

function getIdentityRiskColor(identityRisk) {
    return CONFIG.IDENTITY_RISK_COLORS[identityRisk] || '#666';
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

    // Section label for Acts - inline with items
    const actsContainer = grid.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '0.75rem')
        .style('flex-wrap', 'wrap');

    actsContainer.append('span')
        .attr('class', 'legend-section-label')
        .style('margin', '0')
        .text('Filter by Act:');

    // Act colors with scene counts - inline
    const actsRow = actsContainer.append('div')
        .attr('class', 'legend-items-row')
        .style('margin', '0');

    const actDetails = {
        'act1': { count: 9 },
        'act2': { count: 15 },
        'act3': { count: 9 }
    };

    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const item = actsRow.append('div')
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

    // Section label for Chapters - collapsible
    const chaptersHeader = grid.append('div')
        .attr('class', 'legend-section-label legend-collapsible-header')
        .style('cursor', 'pointer')
        .style('user-select', 'none')
        .on('click', function() {
            const content = d3.select(this.nextSibling);
            const isCollapsed = content.style('display') === 'none';
            content.style('display', isCollapsed ? 'block' : 'none');
            d3.select(this).select('.collapse-icon').text(isCollapsed ? '▼' : '▶');
        });

    chaptersHeader.append('span')
        .attr('class', 'collapse-icon')
        .text('▼')
        .style('margin-right', '0.5rem')
        .style('font-size', '0.7rem');

    chaptersHeader.append('span')
        .text('📖 Chapters:');

    // Chapters - 4 column layout like Discussion Topics
    const chaptersContainer = grid.append('div')
        .attr('class', 'legend-categories-container')
        .style('column-count', '4')
        .style('column-gap', '2rem')
        .style('margin-top', '0.5rem');

    // Get chapters in order (Gattaca chapters)
    const chapterOrder = [
        'ch01-opening-ritual',
        'ch02-flashback-birth',
        'ch03-identity-swap',
        'ch04-gattaca-life',
        'ch05-murder-investigation',
        'ch06-mounting-pressure',
        'ch07-truth-revealed',
        'ch08-final-launch'
    ];

    chapterOrder.forEach(chapterId => {
        const chapter = state.chapters[chapterId];
        if (!chapter) return;

        const chapterNum = chapterId.split('-')[0].replace('ch', '');
        const nameWithoutIcon = chapter.name.replace(/^[^\s]+\s/, ''); // Remove first emoji

        // Create row container for badge + line + count
        const row = chaptersContainer.append('div')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('justify-content', 'space-between')
            .style('width', '100%')
            .style('margin-bottom', '0.3rem')
            .style('break-inside', 'avoid');

        const item = row.append('div')
            .attr('class', 'legend-item legend-chapter-item')
            .attr('data-chapter', chapterId)
            .attr('title', `Click to filter: ${chapter.name} - ${chapter.description} (${chapter.scenes ? chapter.scenes.length : 0} scenes)`)
            .style('width', 'fit-content')
            .on('click', () => toggleChapterFilter(chapterId));

        // Add active indicator (checkmark)
        item.append('span')
            .attr('class', 'active-indicator')
            .text('✓');

        // Chapter number (styled as small badge, zero-padded)
        item.append('span')
            .style('background-color', chapter.color)
            .style('color', 'white')
            .style('font-weight', '700')
            .style('font-size', '0.65rem')
            .style('padding', '0.2rem 0.4rem')
            .style('border-radius', '3px')
            .style('margin-right', '0.4rem')
            .style('font-family', 'monospace')
            .text(String(chapterNum).padStart(2, '0'));

        // Chapter icon
        item.append('span')
            .attr('class', 'legend-icon')
            .text(chapter.icon);

        // Chapter name
        item.append('span')
            .attr('class', 'legend-text')
            .text(nameWithoutIcon);

        // Add connecting line
        row.append('span')
            .style('flex-grow', '1')
            .style('border-bottom', '1px dotted #ccc')
            .style('margin', '0 0.5rem')
            .style('min-width', '10px');

        // Add count (zero-padded)
        row.append('span')
            .style('font-size', '0.7rem')
            .style('color', '#888')
            .style('font-weight', '500')
            .style('font-family', 'monospace')
            .text(`(${String(chapter.scenes ? chapter.scenes.length : 0).padStart(2, '0')})`);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Psychological States - inline with items
    const statesContainer = grid.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '0.75rem')
        .style('flex-wrap', 'wrap');

    statesContainer.append('span')
        .attr('class', 'legend-section-label')
        .style('margin', '0')
        .text('Identity Risk:');

    // Identity risk states - Gattaca themed
    const statesRow = statesContainer.append('div')
        .attr('class', 'legend-items-row')
        .style('margin', '0');

    const identityRiskStates = [
        { key: 'secure', label: 'Secure', color: '#4CAF50', description: 'Identity safe, routine deception maintained' },
        { key: 'watchful', label: 'Watchful', color: '#29B6F6', description: 'Heightened awareness, need to be careful' },
        { key: 'threatened', label: 'Threatened', color: '#FF5722', description: 'Identity at risk, close calls with exposure' },
        { key: 'crisis', label: 'Crisis', color: '#E53935', description: 'Exposure imminent or direct confrontation' }
    ];

    identityRiskStates.forEach(riskState => {
        const item = statesRow.append('div')
            .attr('class', 'legend-item legend-marker-item')
            .attr('data-marker', riskState.key)
            .attr('title', riskState.description)
            .on('click', () => togglePsychologicalFilter(riskState.key));

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', riskState.color)
            .style('border', `2px solid ${riskState.color}`);

        item.append('span')
            .attr('class', 'legend-text')
            .text(riskState.label);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Question Tags - collapsible
    const topicsHeader = grid.append('div')
        .attr('class', 'legend-section-label legend-collapsible-header')
        .style('cursor', 'pointer')
        .style('user-select', 'none')
        .on('click', function() {
            const content = d3.select(this.nextSibling);
            const isCollapsed = content.style('display') === 'none';
            content.style('display', isCollapsed ? 'block' : 'none');
            d3.select(this).select('.collapse-icon').text(isCollapsed ? '▼' : '▶');
        });

    topicsHeader.append('span')
        .attr('class', 'collapse-icon')
        .text('▼')
        .style('margin-right', '0.5rem')
        .style('font-size', '0.7rem');

    topicsHeader.append('span')
        .text('Discussion Topics:');

    // Build discussion tags from centralized TAG_GROUPS - multi-column layout
    const categoriesContainer = grid.append('div')
        .attr('class', 'legend-categories-container')
        .style('column-count', '4')
        .style('column-gap', '2rem')
        .style('margin-top', '0.5rem');

    for (const [groupName, groupTags] of Object.entries(TAG_GROUPS)) {
        // Create category container (vertical column)
        const categoryContainer = categoriesContainer.append('div')
            .attr('class', 'legend-category-container')
            .style('display', 'inline-block')
            .style('width', '100%')
            .style('margin-bottom', '1rem')
            .style('padding-right', '1rem')
            .style('break-inside', 'avoid');

        // Add category label
        categoryContainer.append('div')
            .attr('class', 'legend-category-label')
            .style('font-weight', '700')
            .style('color', '#555')
            .style('margin-bottom', '0.5rem')
            .style('font-size', '0.9rem')
            .style('border-bottom', '2px solid #ddd')
            .style('padding-bottom', '0.3rem')
            .text(groupName);

        // Create vertical list of tags for this category
        const tagsList = categoryContainer.append('div')
            .attr('class', 'legend-category-tags')
            .style('display', 'flex')
            .style('flex-direction', 'column')
            .style('gap', '0.3rem');

        // Add tags for this category
        groupTags.forEach(tagKey => {
            const label = tagKey.charAt(0).toUpperCase() + tagKey.slice(1).replace(/-/g, ' ');
            const icon = TAG_ICONS[tagKey] || '🏷️';

            // Count scenes with this tag
            const sceneCount = state.scenes.filter(s => s.tags && s.tags.includes(tagKey)).length;

            // Create row container for badge + count
            const row = tagsList.append('div')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('justify-content', 'space-between')
                .style('width', '100%');

            const item = row.append('div')
                .attr('class', `legend-item legend-question-item tag-${tagKey}`)
                .attr('data-question', tagKey)
                .attr('title', `Filter scenes with ${label} (${sceneCount} scenes)`)
                .style('width', 'fit-content')
                .on('click', () => toggleTagFilter(tagKey));

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

            // Add connecting line
            row.append('span')
                .style('flex-grow', '1')
                .style('border-bottom', '1px dotted #ccc')
                .style('margin', '0 0.5rem')
                .style('min-width', '10px');

            // Add count outside the badge (zero-padded)
            row.append('span')
                .style('font-size', '0.7rem')
                .style('color', '#888')
                .style('font-weight', '500')
                .style('font-family', 'monospace')
                .text(`(${String(sceneCount).padStart(2, '0')})`);
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

    // Connection types inline - including Gattaca-specific types with descriptions
    const connectionTypes = [
        { key: 'foreshadowing', label: 'Foreshadowing', style: 'solid', color: '#00bcd4',
          description: 'Hints at future events - this scene plants seeds for what comes later' },
        { key: 'callback', label: 'Callback', style: 'dashed', color: '#8b0000',
          description: 'References past events - this scene echoes or resolves earlier moments' },
        { key: 'geneticDefiance', label: 'Genetic Defiance', style: 'solid', color: '#009688',
          description: 'Genetic predictions contradicted - outcomes defy what DNA determined' },
        { key: 'invalidTriumph', label: 'Invalid Triumph', style: 'solid', color: '#F9A825',
          description: '"Invalids" proving the system wrong - the genetically inferior succeed' },
        { key: 'transcendence', label: 'Transcendence', style: 'solid', color: '#9C27B0',
          description: 'Rising above limitations - characters transcend their genetic destiny' }
    ];

    connectionTypes.forEach(conn => {
        const item = connectionsRow.append('div')
            .attr('class', `legend-item legend-connection-item connection-${conn.key}`)
            .attr('data-connection', conn.key)
            .style('cursor', 'pointer')
            .style('display', 'flex')
            .style('align-items', 'center')
            .on('click', () => toggleConnectionFilter(conn.key));

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
            .attr('stroke-width', conn.style === 'dashed' ? 0.8 : 1)
            .attr('stroke-dasharray', conn.style === 'dashed' ? '4,2' : null)
            .attr('stroke-opacity', 0.3)
            .style('filter', conn.style === 'dashed' ? 'none' : 'drop-shadow(0 0 1px ' + conn.color + ')');

        item.append('span')
            .attr('class', 'legend-text')
            .text(conn.label);

        // Add info icon with custom tooltip
        item.append('span')
            .attr('class', 'connection-info-icon')
            .attr('data-description', conn.description)
            .style('margin-left', '4px')
            .style('font-size', '0.75rem')
            .style('opacity', '0.6')
            .style('cursor', 'help')
            .text('ℹ️')
            .on('click', (event) => event.stopPropagation())
            .on('mouseenter', function(event) {
                const desc = d3.select(this).attr('data-description');
                showInfoTooltip(desc, event);
            })
            .on('mouseleave', hideInfoTooltip);
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
    activeChapters: new Set(),
    activePsychological: new Set(),
    activeTags: new Set(),
    activeQuestions: new Set(),
    activeConnections: new Set()
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

function toggleChapterFilter(chapterId) {
    if (legendState.activeChapters.has(chapterId)) {
        legendState.activeChapters.delete(chapterId);
    } else {
        legendState.activeChapters.add(chapterId);
    }

    // Update legend item appearance
    d3.selectAll('.legend-chapter-item')
        .classed('active', function() {
            return legendState.activeChapters.has(this.dataset.chapter);
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

function toggleTagFilter(tagKey) {
    if (legendState.activeTags.has(tagKey)) {
        legendState.activeTags.delete(tagKey);
    } else {
        legendState.activeTags.add(tagKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-question-item')
        .classed('active', function() {
            return legendState.activeTags.has(this.dataset.question);
        });

    // Update visualization
    applyLegendFilters();
}

function toggleConnectionFilter(connectionType) {
    if (legendState.activeConnections.has(connectionType)) {
        legendState.activeConnections.delete(connectionType);
    } else {
        legendState.activeConnections.add(connectionType);
    }

    // Update legend item appearance
    d3.selectAll('.legend-connection-item')
        .classed('active', function() {
            return legendState.activeConnections.has(this.dataset.connection);
        });

    // Update link visibility based on active connection types
    applyConnectionFilters();
}

function toggleQuestionFilterById(questionId) {
    if (legendState.activeQuestions.has(questionId)) {
        legendState.activeQuestions.delete(questionId);
    } else {
        legendState.activeQuestions.add(questionId);
    }

    // Update legend question row appearance
    d3.selectAll('.legend-question-row')
        .style('background', function() {
            const qId = parseInt(this.dataset.questionId);
            return legendState.activeQuestions.has(qId) ? 'rgba(33, 150, 243, 0.1)' : 'transparent';
        })
        .style('border-left', function() {
            const qId = parseInt(this.dataset.questionId);
            return legendState.activeQuestions.has(qId) ? '3px solid #2196F3' : 'none';
        });

    // Update visualization
    applyLegendFilters();
}

function clearQuestionFilter() {
    legendState.activeQuestions.clear();

    // Update legend appearance
    d3.selectAll('.legend-question-row')
        .style('background', 'transparent')
        .style('border-left', 'none');

    // Update visualization
    applyLegendFilters();
}

window.clearQuestionFilter = clearQuestionFilter;

function applyLegendFilters() {
    if (!allNodes || !nodeGroup) return;

    const hasActFilter = legendState.activeActs.size > 0;
    const hasChapterFilter = legendState.activeChapters.size > 0;
    const hasPsychologicalFilter = legendState.activePsychological.size > 0;
    const hasTagFilter = legendState.activeTags.size > 0;
    const hasQuestionFilter = legendState.activeQuestions.size > 0;

    allNodes.forEach(node => {
        if (!node.data.id) return;

        let visible = true;

        // Act filter
        if (hasActFilter) {
            visible = visible && legendState.activeActs.has(node.data.act);
        }

        // Chapter filter
        if (hasChapterFilter) {
            visible = visible && legendState.activeChapters.has(node.data.chapter);
        }

        // Psychological filter
        if (hasPsychologicalFilter) {
            visible = visible && legendState.activePsychological.has(node.data.identityRisk);
        }

        // Tag filter
        if (hasTagFilter) {
            const hasMatchingTag = node.data.tags &&
                Array.from(legendState.activeTags).some(tag => node.data.tags.includes(tag));
            visible = visible && hasMatchingTag;
        }

        // Question filter (by discussion question IDs)
        if (hasQuestionFilter) {
            const hasMatchingQuestion = node.data.discussionQuestions &&
                Array.from(legendState.activeQuestions).some(qId =>
                    node.data.discussionQuestions.some(dq => dq.id === qId)
                );
            visible = visible && hasMatchingQuestion;
        }

        // Apply visibility
        const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);
        nodeElement.style('opacity', visible ? 1 : 0.15);
        // Keep pointer events enabled for all nodes to allow hover/tooltips
        nodeElement.style('pointer-events', 'auto');
    });

    // Update links
    if (linkGroup) {
        linkGroup.selectAll('.link').style('opacity', d => {
            const sourceHasMatchingTag = !hasTagFilter || (d.source.data.tags &&
                Array.from(legendState.activeTags).some(tag => d.source.data.tags.includes(tag)));
            const targetHasMatchingTag = !hasTagFilter || (d.target.data.tags &&
                Array.from(legendState.activeTags).some(tag => d.target.data.tags.includes(tag)));

            const sourceHasMatchingQuestion = !hasQuestionFilter || (d.source.data.discussionQuestions &&
                Array.from(legendState.activeQuestions).some(qId =>
                    d.source.data.discussionQuestions.some(dq => dq.id === qId)
                ));
            const targetHasMatchingQuestion = !hasQuestionFilter || (d.target.data.discussionQuestions &&
                Array.from(legendState.activeQuestions).some(qId =>
                    d.target.data.discussionQuestions.some(dq => dq.id === qId)
                ));

            const sourceVisible = d.source.data.id &&
                (!hasActFilter || legendState.activeActs.has(d.source.data.act)) &&
                (!hasPsychologicalFilter || legendState.activePsychological.has(d.source.data.identityRisk)) &&
                sourceHasMatchingTag &&
                sourceHasMatchingQuestion;

            const targetVisible = d.target.data.id &&
                (!hasActFilter || legendState.activeActs.has(d.target.data.act)) &&
                (!hasPsychologicalFilter || legendState.activePsychological.has(d.target.data.identityRisk)) &&
                targetHasMatchingTag &&
                targetHasMatchingQuestion;

            return (sourceVisible && targetVisible) ? 0.3 : 0.05;
        });
    }
}

function applyConnectionFilters() {
    if (!linkGroup) return;

    const hasConnectionFilter = legendState.activeConnections.size > 0;

    linkGroup.selectAll('.link')
        .attr('stroke-opacity', d => {
            if (!hasConnectionFilter) {
                // No filter - restore default opacity
                if (d.type === 'geneticDefiance' || d.type === 'invalidTriumph' || d.type === 'transcendence') return 0.4;
                return 0.2;
            }
            // Match hover highlight opacity (0.85-0.9)
            const isActiveType = legendState.activeConnections.has(d.type);
            return isActiveType ? 0.85 : 0.05;
        })
        .attr('stroke-width', d => {
            if (!hasConnectionFilter) {
                // Default widths
                if (d.type === 'geneticDefiance' || d.type === 'invalidTriumph' || d.type === 'transcendence') return 1.2;
                return d.type === 'callback' ? 0.5 : 0.6;
            }
            // Match hover highlight widths (2.5-3.0)
            const isActiveType = legendState.activeConnections.has(d.type);
            if (isActiveType) {
                return d.type === 'callback' ? 2.5 : 3.0;
            }
            return d.type === 'callback' ? 0.3 : 0.3;
        });
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
            const psychState = scene.identityRisk || 'unknown';

            modalHTML += `
                <div class="progress-item ${isViewed ? 'viewed' : ''}" data-scene-id="${scene.id}">
                    <input type="checkbox"
                           ${isViewed ? 'checked' : ''}
                           onchange="window.toggleSceneViewed(${scene.id})">
                    <span class="progress-item-number">${scene.id}.</span>
                    <label class="progress-item-label">${scene.title}</label>
                    <span class="progress-item-cognitive" style="background: ${getIdentityRiskColor(psychState)}" title="${psychState}"></span>
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
    const verticalOffset = 80;
    const padding = 200;

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

    // Add spooky glow filter for connection lines
    const spookyFilter = defs.append('filter')
        .attr('id', 'spooky-glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');

    spookyFilter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '1.5')
        .attr('result', 'blur');

    spookyFilter.append('feColorMatrix')
        .attr('in', 'blur')
        .attr('type', 'matrix')
        .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1.5 0')
        .attr('result', 'glow');

    spookyFilter.append('feMerge')
        .selectAll('feMergeNode')
        .data(['glow', 'SourceGraphic'])
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

    // Render all connections with colors - no expensive filters for performance
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
            // Gattaca-specific connection colors
            if (d.type === 'geneticDefiance') return '#009688';   // Teal - genetics
            if (d.type === 'invalidTriumph') return '#F9A825';    // Gold - triumph
            if (d.type === 'transcendence') return '#9C27B0';     // Purple - spiritual
            if (d.type === 'callback') return '#8b0000';          // Dark blood red
            return '#00bcd4';                                      // Cyan for foreshadowing
        })
        .attr('stroke-width', d => {
            if (d.type === 'geneticDefiance') return 1.2;
            if (d.type === 'invalidTriumph') return 1.2;
            if (d.type === 'transcendence') return 1.2;
            return d.type === 'callback' ? 0.5 : 0.6;
        })
        .attr('stroke-opacity', d => {
            if (d.type === 'geneticDefiance') return 0.4;
            if (d.type === 'invalidTriumph') return 0.4;
            if (d.type === 'transcendence') return 0.4;
            return 0.2;
        })
        .attr('stroke-dasharray', d => d.type === 'callback' ? '4,2' : null);

    // Draw nodes
    nodeGroup = g.append('g')
        .attr('class', 'nodes');

    const nodes = nodeGroup.selectAll('.node')
        .data(allNodes.filter(d => d.data.id))
        .join('g')
        .attr('class', d => {
            let classes = 'node';
            if (d.data.identityRisk) {
                classes += ` ${d.data.identityRisk}`;
            }
            return classes;
        })
        .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y},0)`)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            // Always show tooltip on hover, even when info card is pinned
            showTooltip(d, event);
            // Only highlight connections if no card is locked, or if hovering a different node
            if (!state.lockedNode || state.lockedNode.data.id !== d.data.id) {
                highlightConnections(d);
            }
        })
        .on('mouseout', function() {
            // Always hide tooltip on mouseout
            hideTooltip();
            // Restore locked node highlights if card is pinned
            if (state.lockedNode) {
                highlightConnections(state.lockedNode);
            } else {
                unhighlightAll();
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
        .attr('fill', d => getIdentityRiskColor(d.data.identityRisk))
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
            let psychologicalMatch = !state.psychologicalFilter || d.data.identityRisk === state.psychologicalFilter;
            return (actMatch && psychologicalMatch) ? 1 : 0.2;
        });

    linkGroup.selectAll('.link')
        .style('opacity', d => {
            let actMatch = state.currentFilter === 'all' ||
                          d.source.data.act === state.currentFilter ||
                          d.target.data.act === state.currentFilter;
            let psychologicalMatch = !state.psychologicalFilter ||
                                d.source.data.identityRisk === state.psychologicalFilter ||
                                d.target.data.identityRisk === state.psychologicalFilter;
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
        .classed('main-hovered', d => d.data.id === node.data.id)
        .classed('connection-highlighted', d => connectedIds.has(d.data.id) && d.data.id !== node.data.id)
        .classed('connection-dimmed', d => !connectedIds.has(d.data.id));

    // Highlight relevant connections - make them brighter and thicker
    linkGroup.selectAll('.link')
        .classed('highlighted', d => d.source.data.id === node.data.id)
        .attr('stroke-width', d => {
            const isFromNode = (d.source.data.id === node.data.id);
            if (isFromNode) {
                return d.type === 'callback' ? 2.5 : 3.0;
            }
            return d.type === 'callback' ? 0.5 : 0.6;
        })
        .attr('stroke-opacity', d => {
            const isFromNode = (d.source.data.id === node.data.id);
            if (isFromNode) {
                return d.type === 'callback' ? 0.9 : 0.85;
            }
            return d.type === 'callback' ? 0.2 : 0.2;
        });
}

function unhighlightAll() {
    state.hoveredNode = null;

    if (state.lockedNode) return;

    nodeGroup.selectAll('.node')
        .classed('main-hovered', false)
        .classed('connection-highlighted', false)
        .classed('connection-dimmed', false);

    // Reset connections to default styling
    linkGroup.selectAll('.link')
        .classed('highlighted', false)
        .attr('stroke-width', d => d.type === 'callback' ? 0.5 : 0.6)
        .attr('stroke-opacity', d => d.type === 'callback' ? 0.2 : 0.2);
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
    const psychologicalHtml = buildIdentityRiskTags(scene.identityRisk);

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
// INFO TOOLTIP (for connection legend icons)
// ============================================

let infoTooltip;

function initInfoTooltip() {
    infoTooltip = d3.select('body').append('div')
        .attr('class', 'info-tooltip')
        .style('position', 'fixed')
        .style('pointer-events', 'none')
        .style('background', 'rgba(0, 0, 0, 0.9)')
        .style('color', '#fff')
        .style('padding', '8px 12px')
        .style('border-radius', '4px')
        .style('font-size', '0.85rem')
        .style('max-width', '280px')
        .style('z-index', '10000')
        .style('opacity', 0)
        .style('display', 'none');
}

function showInfoTooltip(text, event) {
    if (!infoTooltip) initInfoTooltip();

    infoTooltip
        .text(text)
        .style('display', 'block')
        .style('opacity', 1)
        .style('left', (event.clientX + 10) + 'px')
        .style('top', (event.clientY - 30) + 'px');
}

function hideInfoTooltip() {
    if (infoTooltip) {
        infoTooltip
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
// SCREENPLAY VIEWER (PDF.js with Scrolling)
// ============================================

let screenplayViewer = null;
let screenplayBackdrop = null;
let pdfDoc = null;
let renderedPages = new Set();
let shouldStopRendering = false;

function initScreenplayViewer() {
    screenplayBackdrop = d3.select('body').append('div')
        .attr('class', 'screenplay-viewer-backdrop');
        // No click handler - keep background interactive

    screenplayViewer = d3.select('body').append('div')
        .attr('class', 'screenplay-viewer-modal');
}

// Parse and format screenplay text with styling
function formatScreenplayText(text) {
    if (!text) return 'No screenplay text available for this scene.';

    // Split into lines
    const lines = text.split('\n');
    const formatted = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Skip empty lines but preserve spacing
        if (!trimmed) {
            formatted.push('<span class="action">&nbsp;</span>');
            continue;
        }

        // Scene headings: INT. or EXT. at start
        if (/^(INT\.|EXT\.|INT\/EXT\.)/.test(trimmed)) {
            formatted.push(`<span class="scene-heading">${escapeHtml(line)}</span>`);
        }
        // Transitions: TO:, CUT TO:, FADE OUT, etc.
        else if (/^(FADE IN:|FADE OUT|CUT TO:|DISSOLVE TO:|FADE TO BLACK)/.test(trimmed)) {
            formatted.push(`<span class="transition">${escapeHtml(line)}</span>`);
        }
        // Character names: All caps line (possibly with (V.O.) or (O.S.))
        else if (/^[A-Z\s]+(\(V\.O\.\)|\(O\.S\.\)|\(CONT'D\))?$/.test(trimmed) && trimmed.length < 40) {
            formatted.push(`<span class="character">${escapeHtml(line)}</span>`);
        }
        // Parentheticals: Lines in parentheses
        else if (/^\(.*\)$/.test(trimmed)) {
            formatted.push(`<span class="parenthetical">${escapeHtml(line)}</span>`);
        }
        // Check if this is dialogue (follows a character name)
        else if (i > 0) {
            const prevTrimmed = lines[i - 1].trim();
            // If previous line was a character name or parenthetical, this is dialogue
            if (/^[A-Z\s]+(\(V\.O\.\)|\(O\.S\.\)|\(CONT'D\))?$/.test(prevTrimmed) || /^\(.*\)$/.test(prevTrimmed)) {
                formatted.push(`<span class="dialogue">${escapeHtml(line)}</span>`);
            } else {
                // Otherwise it's action/description
                formatted.push(`<span class="action">${escapeHtml(line)}</span>`);
            }
        }
        // Default to action
        else {
            formatted.push(`<span class="action">${escapeHtml(line)}</span>`);
        }
    }

    return formatted.join('\n');
}

// Helper function to escape HTML
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&#039;');
}

async function showScreenplayViewer(sceneData) {
    if (!screenplayViewer) initScreenplayViewer();

    // Get the full scene object from state
    const scene = state.scenes.find(s => s.id === sceneData.id);
    if (!scene) {
        console.error('Scene not found:', sceneData.id);
        return;
    }

    // Get and format screenplay text
    const formattedText = formatScreenplayText(scene.text);

    // Build screenplay viewer content with text
    let html = `
        <div class="screenplay-viewer-header">
            <div class="screenplay-viewer-title">
                <span class="screenplay-icon">📄</span>
                <div>
                    <div class="screenplay-title">Gattaca Screenplay</div>
                    <div class="screenplay-scene">Scene ${scene.id}: ${scene.title}</div>
                </div>
            </div>
            <button class="screenplay-close-btn" onclick="hideScreenplayViewer()">✕</button>
        </div>
        <div class="screenplay-viewer-content" id="screenplay-scroll-container">
            <div class="screenplay-text-content">
                <pre class="screenplay-text">${formattedText}</pre>
            </div>
        </div>
    `;

    screenplayViewer.html(html);

    // Show with animation
    setTimeout(() => {
        screenplayBackdrop.classed('active', true);
        screenplayViewer.classed('active', true);
    }, 10);

    console.log(`Displayed screenplay text for Scene ${scene.id}`);
}

// Update screenplay viewer content without reopening
function updateScreenplayViewer(sceneData) {
    if (!screenplayViewer || !screenplayViewer.classed('active')) {
        return; // Viewer is not open, nothing to update
    }

    // Get the full scene object from state
    const scene = state.scenes.find(s => s.id === sceneData.id);
    if (!scene) {
        console.error('Scene not found:', sceneData.id);
        return;
    }

    // Get and format screenplay text
    const formattedText = formatScreenplayText(scene.text);

    // Update only the content, keeping the viewer open
    const content = screenplayViewer.select('.screenplay-viewer-content');
    if (content.empty()) return;

    // Update header info
    screenplayViewer.select('.screenplay-scene')
        .text(`Scene ${scene.id}: ${scene.title}`);

    // Update screenplay text
    content.html(`
        <div class="screenplay-text-content">
            <pre class="screenplay-text">${formattedText}</pre>
        </div>
    `);

    // Scroll to top
    content.node().scrollTop = 0;

    console.log(`Updated screenplay viewer to Scene ${scene.id}`);
}

// Removed PDF rendering functions - now showing text directly

async function renderAllPages(targetPage) {
    const container = document.getElementById('screenplay-scroll-container');
    if (!container || !pdfDoc) return;

    const totalPages = pdfDoc.numPages;

    // Show loading with progress
    container.innerHTML = `
        <div class="screenplay-loading">
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p>Loading page ${targetPage}...</p>
        </div>
    `;

    // Get container width - wait a moment for layout
    await new Promise(resolve => setTimeout(resolve, 50));
    // Use full container width minus small padding (1rem = 16px on each side)
    const containerWidth = container.clientWidth - 32;

    console.log(`Container width: ${container.clientWidth}px, effective: ${containerWidth}px`);
    console.log(`Rendering ${totalPages} pages, starting at page ${targetPage}`);

    // Determine priority pages to render first
    const pagesToRenderFirst = [];
    for (let i = Math.max(1, targetPage - 3); i <= Math.min(totalPages, targetPage + 3); i++) {
        pagesToRenderFirst.push(i);
    }

    console.log(`Rendering priority pages: ${pagesToRenderFirst.join(', ')}`);

    // Pre-render priority pages OFF-SCREEN first
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = `${containerWidth}px`;
    document.body.appendChild(tempContainer);

    // Create and render priority pages in temp container
    for (const pageNum of pagesToRenderFirst) {
        if (shouldStopRendering) break;

        const pageDiv = document.createElement('div');
        pageDiv.className = 'screenplay-page';
        pageDiv.id = `screenplay-page-temp-${pageNum}`;

        const canvas = document.createElement('canvas');
        canvas.id = `screenplay-canvas-temp-${pageNum}`;
        canvas.className = 'screenplay-canvas';

        pageDiv.appendChild(canvas);
        tempContainer.appendChild(pageDiv);

        // Render into temp canvas
        await renderSinglePageToCanvas(pageNum, canvas, containerWidth);
    }

    // Now clear loading and create all page containers
    container.innerHTML = '';

    // Create page containers for all pages
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'screenplay-page';
        pageDiv.id = `screenplay-page-${pageNum}`;
        pageDiv.setAttribute('data-page', pageNum);

        const canvas = document.createElement('canvas');
        canvas.id = `screenplay-canvas-${pageNum}`;
        canvas.className = 'screenplay-canvas';

        const pageLabel = document.createElement('div');
        pageLabel.className = 'screenplay-page-label';
        pageLabel.textContent = `Page ${pageNum}`;

        pageDiv.appendChild(pageLabel);
        pageDiv.appendChild(canvas);
        container.appendChild(pageDiv);

        // Copy rendered content from temp canvas if available
        const tempCanvas = document.getElementById(`screenplay-canvas-temp-${pageNum}`);
        if (tempCanvas && tempCanvas.width > 0) {
            canvas.width = tempCanvas.width;
            canvas.height = tempCanvas.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(tempCanvas, 0, 0);
            renderedPages.add(pageNum);
            console.log(`✓ Page ${pageNum} copied from temp`);
        }
    }

    // Remove temp container
    document.body.removeChild(tempContainer);

    // NOW scroll to target page (pages are already rendered)
    const targetElement = document.getElementById(`screenplay-page-${targetPage}`);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    console.log(`Scrolled to page ${targetPage}, priority pages rendered`);

    // Render remaining pages in background
    setTimeout(() => {
        renderRemainingPages(containerWidth, pagesToRenderFirst);
    }, 300);
}

// Helper function to render a page to a specific canvas
async function renderSinglePageToCanvas(pageNum, canvas, containerWidth) {
    if (!pdfDoc || !canvas) return false;

    try {
        const page = await pdfDoc.getPage(pageNum);
        const ctx = canvas.getContext('2d');

        // Get viewport at scale 1.0 first
        const viewport = page.getViewport({scale: 1});

        // Calculate scale based on container width (fallback to 700px if container is too small)
        const effectiveWidth = containerWidth > 100 ? containerWidth : 700;
        const scale = effectiveWidth / viewport.width;
        const scaledViewport = page.getViewport({scale: scale});

        // Set canvas dimensions
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        console.log(`Rendering page ${pageNum}: containerWidth=${containerWidth}, scale=${scale.toFixed(2)}, canvas=${canvas.width}x${canvas.height}`);

        const renderContext = {
            canvasContext: ctx,
            viewport: scaledViewport
        };

        await page.render(renderContext).promise;
        console.log(`✓ Page ${pageNum} rendered successfully`);
        return true;
    } catch (error) {
        console.error(`Error rendering page ${pageNum}:`, error);
        return false;
    }
}

async function renderSinglePage(pageNum, containerWidth) {
    if (renderedPages.has(pageNum) || shouldStopRendering || !pdfDoc) return;

    const canvas = document.getElementById(`screenplay-canvas-${pageNum}`);
    if (!canvas || shouldStopRendering) return;

    const success = await renderSinglePageToCanvas(pageNum, canvas, containerWidth);
    if (success) {
        renderedPages.add(pageNum);
    }
}

async function renderRemainingPages(containerWidth, alreadyRendered) {
    if (shouldStopRendering || !pdfDoc) return;

    const totalPages = pdfDoc.numPages;
    console.log(`Starting background render of remaining pages (total: ${totalPages})`);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (shouldStopRendering || !pdfDoc) {
            console.log('Background rendering stopped');
            break;
        }

        if (!alreadyRendered.includes(pageNum) && !renderedPages.has(pageNum)) {
            await renderSinglePage(pageNum, containerWidth);
            // Small delay to avoid blocking UI
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    console.log(`Background rendering complete: ${renderedPages.size} pages rendered`);
}

function hideScreenplayViewer() {
    if (!screenplayViewer) return;

    console.log('Closing screenplay viewer');

    // Stop all rendering immediately
    shouldStopRendering = true;

    screenplayBackdrop.classed('active', false);
    screenplayViewer.classed('active', false);

    // Clean up after animation
    setTimeout(() => {
        if (pdfDoc) {
            pdfDoc = null;
        }
        renderedPages.clear();
    }, 300);
}

// Expose to window
window.showScreenplayViewer = showScreenplayViewer;
window.hideScreenplayViewer = hideScreenplayViewer;

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

function buildIdentityRiskTags(identityRisk) {
    if (!identityRisk) {
        return '<span class="info-card-type identity-risk-unknown">❓ unknown</span>';
    }

    // Map identity risk states to icons (Gattaca-themed)
    const stateIcons = {
        'secure': '🛡️',
        'watchful': '👁️',
        'threatened': '⚠️',
        'crisis': '🚨'
    };

    const stateLabels = {
        'secure': 'Secure',
        'watchful': 'Watchful',
        'threatened': 'Threatened',
        'crisis': 'Crisis'
    };

    const icon = stateIcons[identityRisk] || '❓';
    const label = stateLabels[identityRisk] || identityRisk;
    return `<span class="info-card-type identity-risk-${identityRisk}">${icon} ${label}</span>`;
}

function getIdentityRiskPrefix(identityRisk) {
    if (!identityRisk) {
        return '❓';
    }

    // Map identity risk states to icons
    const stateIcons = {
        'secure': '🛡️',
        'watchful': '👁️',
        'threatened': '⚠️',
        'crisis': '🚨'
    };

    return stateIcons[identityRisk] || '❓';
}

function buildConnectionsSection(scene) {
    const hasForeshadowing = scene.foreshadowing && scene.foreshadowing.length > 0;
    const hasCallbacks = scene.callbacks && scene.callbacks.length > 0;
    const hasGeneticDefiance = scene.geneticDefiance && scene.geneticDefiance.length > 0;
    const hasInvalidTriumph = scene.invalidTriumph && scene.invalidTriumph.length > 0;
    const hasTranscendence = scene.transcendence && scene.transcendence.length > 0;

    if (!hasForeshadowing && !hasCallbacks && !hasGeneticDefiance && !hasInvalidTriumph && !hasTranscendence) return '';

    let html = `<div class="info-card-connections">`;

    // Helper function to build connection links
    const buildLinks = (connections, icon, label, color) => {
        let linksHtml = `<div class="connections-group">
            <strong style="color: ${color}">${icon} ${label}:</strong>`;
        connections.forEach(connection => {
            const targetId = connection.sceneId || connection;
            const description = connection.description || '';
            const targetScene = state.scenes.find(s => s.id === targetId);
            if (targetScene) {
                linksHtml += `<a href="#" class="connection-link" style="border-left-color: ${color}"
                    onclick="window.navigateToScene(${targetId}); return false;"
                    title="Scene ${targetId}: ${targetScene.title}">
                    → Scene ${targetId}: ${description || targetScene.title}
                </a>`;
            }
        });
        linksHtml += `</div>`;
        return linksHtml;
    };

    // Standard connections
    if (hasForeshadowing) {
        html += buildLinks(scene.foreshadowing, '🔮', 'Foreshadows', '#00bcd4');
    }
    if (hasCallbacks) {
        html += buildLinks(scene.callbacks, '🔙', 'Callbacks', '#8b0000');
    }

    // Gattaca-specific connections
    if (hasGeneticDefiance) {
        html += buildLinks(scene.geneticDefiance, '🧬', 'Genetic Defiance', '#009688');
    }
    if (hasInvalidTriumph) {
        html += buildLinks(scene.invalidTriumph, '🏆', 'Invalid Triumph', '#F9A825');
    }
    if (hasTranscendence) {
        html += buildLinks(scene.transcendence, '✨', 'Transcendence', '#9C27B0');
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
    const currentIndex = state.scenes.findIndex(s => s.id === scene.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < state.scenes.length - 1;
    const previousId = hasPrevious ? state.scenes[currentIndex - 1].id : null;
    const nextId = hasNext ? state.scenes[currentIndex + 1].id : null;

    let html = `
        <div class="info-card-content-wrapper">
        <div class="info-card-header">
            <div class="info-card-header-top">
                <button class="info-card-nav-btn ${!hasPrevious ? 'disabled' : ''}"
                        onclick="${hasPrevious ? `window.navigateToScene(${previousId})` : 'return false'}"
                        ${!hasPrevious ? 'disabled' : ''}
                        title="${hasPrevious ? 'Previous scene' : 'First scene'}">
                    ← Previous
                </button>
                <span class="info-card-icon-centered">${getActIcon(scene.act)}</span>
                <button class="info-card-nav-btn ${!hasNext ? 'disabled' : ''}"
                        onclick="${hasNext ? `window.navigateToScene(${nextId})` : 'return false'}"
                        ${!hasNext ? 'disabled' : ''}
                        title="${hasNext ? 'Next scene' : 'Last scene'}">
                    Next →
                </button>
            </div>
            <div class="info-card-header-bottom">
                <div class="info-card-titles">
                    <p class="info-card-act">${CONFIG.ACT_NAMES[scene.act]}</p>
                    <h3 class="info-card-scene">${scene.id}. ${scene.title}</h3>
                </div>
                <button class="info-card-close" onclick="window.hideInfoCard()">&times;</button>
            </div>
        </div>
        <div class="info-card-action-bar">
            <button class="btn btn-sm btn-outline-secondary screenplay-viewer-btn"
                    onclick="window.showScreenplayViewer({id: ${scene.id}, title: '${scene.title.replace(/'/g, "\\'")}', startPage: ${scene.startPage || 1}, endPage: ${scene.endPage || 1}, screenplayPage: ${scene.screenplayPage || 1}}); event.stopPropagation();">
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
                ${summaryText || 'No summary available'}
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
        </div>
    `;

    infoCard.html(html);
    infoCard.classed('active', true);
    infoCardBackdrop.classed('active', true);

    // Add event listeners to connection links
    const connectionLinks = infoCard.node().querySelectorAll('.connection-link');
    connectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const sceneId = parseInt(this.getAttribute('data-scene-id'));
            jumpToSceneAndUpdate(sceneId);
        });
    });

    // Scroll to top of info card
    const infoCardElement = infoCard.node();
    if (infoCardElement) {
        const wrapper = infoCardElement.querySelector('.info-card-content-wrapper');
        if (wrapper) {
            wrapper.scrollTop = 0;
        }
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
                .classed('main-hovered', false)
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
            const wrapper = infoCardElement.querySelector('.info-card-content-wrapper');
            if (wrapper) {
                wrapper.scrollTop = 0;
            }
        }
    }
}

// Navigate to scene (for navigation buttons)
window.navigateToScene = function(sceneId) {
    if (!sceneId) return;
    jumpToSceneAndUpdate(sceneId);
};

// Jump to scene and update info card (keep card open)
function jumpToSceneAndUpdate(sceneId) {
    console.log('Jumping to scene:', sceneId);

    const targetNode = d3.selectAll('.node')
        .filter(d => d.data.id === sceneId)
        .node();

    if (targetNode) {
        const nodeData = d3.select(targetNode).datum();

        // Update the info card content
        showInfoCard(nodeData);

        // Update connection highlights
        highlightConnections(nodeData);

        // Update screenplay viewer if it's open
        updateScreenplayViewer(nodeData.data);

        // Scroll card to top
        const infoCardElement = document.querySelector('.info-card-modal');
        if (infoCardElement) {
            const wrapper = infoCardElement.querySelector('.info-card-content-wrapper');
            if (wrapper) {
                wrapper.scrollTop = 0;
            }
        }

        console.log('Updated to scene:', nodeData.data.id, nodeData.data.title);
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
            visible = visible && node.data.identityRisk === state.psychologicalFilter;
        }

        if (activeMarkers.size > 0) {
            visible = visible && activeMarkers.has(node.data.identityRisk);
        }

        const nodeElement = nodeGroup.selectAll('.node').filter(d => d === node);
        nodeElement.style('opacity', visible ? 1 : 0.15);
        // Keep pointer events enabled for all nodes to allow hover/tooltips
        nodeElement.style('pointer-events', 'auto');
    });

    if (linkGroup) {
        linkGroup.selectAll('.link').style('opacity', d => {
            const sourceVisible = d.source.data.id &&
                (state.currentFilter === 'all' || d.source.data.act === state.currentFilter) &&
                (!state.psychologicalFilter || d.source.data.identityRisk === state.psychologicalFilter) &&
                (activeMarkers.size === 0 || activeMarkers.has(d.source.data.identityRisk));

            const targetVisible = d.target.data.id &&
                (state.currentFilter === 'all' || d.target.data.act === state.currentFilter) &&
                (!state.psychologicalFilter || d.target.data.identityRisk === state.psychologicalFilter) &&
                (activeMarkers.size === 0 || activeMarkers.has(d.target.data.identityRisk));

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
            .classed('main-hovered', false)
            .classed('connection-highlighted', false)
            .classed('connection-dimmed', false);
    }

    if (linkGroup) {
        linkGroup.selectAll('.link')
            .classed('highlighted', false)
            .classed('dimmed', false);
    }

    // Clear legend filters (act, psychological, question, connections)
    legendState.activeActs.clear();
    legendState.activePsychological.clear();
    legendState.activeQuestions.clear();
    legendState.activeConnections.clear();

    // Update legend item appearance
    d3.selectAll('.legend-item[data-act]').classed('active', false);
    d3.selectAll('.legend-marker-item').classed('active', false);
    d3.selectAll('.legend-question-item').classed('active', false);
    d3.selectAll('.legend-connection-item').classed('active', false);

    // Reset connection line visibility
    applyConnectionFilters();

    // Reset tag badges to their original state (active for question's own tags, inactive for others)
    document.querySelectorAll('.book-club-question').forEach(questionCard => {
        questionCard.classList.remove('active');
        questionCard.style.display = '';

        const questionData = DISCUSSION_QUESTIONS.find(q => {
            const scenes = questionCard.dataset.scenes;
            return scenes && q.relatedScenes.join(',') === scenes;
        });

        if (questionData) {
            questionCard.querySelectorAll('.tag-badge').forEach(badge => {
                const classes = badge.className.split(' ');
                const tagClass = classes.find(c => c.startsWith('tag-') && c !== 'tag-badge');
                if (tagClass) {
                    const tag = tagClass.replace('tag-', '');
                    // Active if this tag belongs to this question, inactive otherwise
                    if (questionData.tags.includes(tag)) {
                        badge.classList.remove('inactive');
                    } else {
                        badge.classList.add('inactive');
                    }
                }
            });
        }
    });

    // Hide clear filter button
    const clearFilterBtn = document.getElementById('clear-question-filter');
    if (clearFilterBtn) {
        clearFilterBtn.style.display = 'none';
    }

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
            nodeElement.classed('main-hovered', false);
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
                (d.data.identityRisk && d.data.identityRisk.toLowerCase().includes(query));

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
            // Close screenplay viewer if open
            if (screenplayViewer && screenplayViewer.classed('active')) {
                hideScreenplayViewer();
            } else {
                clearAllSelections();
            }
        }

        // Arrow key navigation when info card is open
        if (infoCard && infoCard.classed('active')) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                // Only if not typing in an input field
                if (document.activeElement.tagName !== 'INPUT' &&
                    document.activeElement.tagName !== 'TEXTAREA') {
                    e.preventDefault();

                    // Get current scene from the info card
                    const sceneTitle = document.querySelector('.info-card-scene');
                    if (sceneTitle) {
                        const currentId = parseInt(sceneTitle.textContent.split('.')[0]);
                        const currentIndex = state.scenes.findIndex(s => s.id === currentId);

                        if (e.key === 'ArrowLeft' && currentIndex > 0) {
                            // Previous scene
                            window.navigateToScene(state.scenes[currentIndex - 1].id);
                        } else if (e.key === 'ArrowRight' && currentIndex < state.scenes.length - 1) {
                            // Next scene
                            window.navigateToScene(state.scenes[currentIndex + 1].id);
                        }
                    }
                }
            }
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

    // Re-append in sorted order and update numbering
    questions.forEach((question, index) => {
        grid.appendChild(question);

        // Update the question number display
        const numberSpan = question.querySelector('.question-number');
        if (numberSpan) {
            if (sortType === 'film-order') {
                // Timeline mode: sequential numbering 1-20
                numberSpan.textContent = index + 1;
            } else {
                // Theme mode: show original thematic number
                numberSpan.textContent = question.dataset.originalNumber;
            }
        }
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
                    ${scene.tensionLevel ? `<p><strong>Tension Level:</strong> ${scene.tensionLevel}/10</p>` : ''}
                    ${scene.chapter ? `<p><strong>Chapter:</strong> ${state.chapters?.[scene.chapter]?.name || scene.chapter}</p>` : ''}
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
