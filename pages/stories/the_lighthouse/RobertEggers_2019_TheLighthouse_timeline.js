/* ============================================
   THE LIGHTHOUSE - RADIAL TIMELINE VISUALIZATION
   Based on the HowToTalkToAnyone visualization style
   ============================================ */

console.log('The Lighthouse - Radial Timeline v1.0 loaded');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Act colors - more distinct palette
    ACT_COLORS: {
        'act1': '#2d7a4d',  // Green - Arrival & Tension
        'act2': '#7a5aa0',  // Brighter Purple - The Storm
        'act3': '#c44536'   // Brighter Red - Madness & Reckoning
    },

    // Scene type colors
    TYPE_COLORS: {
        'hallucination': '#b8860b',
        'violence': '#8b0000',
        'revelation': '#1a5a7a',
        'mythology': '#5E35B1',
        'conflict': '#E53935',
        'bonding': '#43A047',
        'labor': '#6D4C41',
        'horror': '#D81B60'
    },

    // Act icons
    ACT_ICONS: {
        'act1': '🚢',
        'act2': '⛈️',
        'act3': '🔥'
    },

    // Act full names
    ACT_NAMES: {
        'act1': 'Act I: Arrival & Tension (Week 1-2)',
        'act2': 'Act II: The Storm (Week 2-3)',
        'act3': 'Act III: Madness & Reckoning (Week 4+)'
    },

    // Layout dimensions
    DIAMETER: 900,
    STORAGE_KEY: 'lighthouse-viewed-scenes',
    DATA_FILE: 'RobertEggers_2019_TheLighthouse_scenes_analyzed.json?v=2026.01.16.02'
};

// ============================================
// DISCUSSION QUESTIONS
// ============================================

const DISCUSSION_QUESTIONS = [
    // ACT I
    { id: 1, question: "What were your first impressions of Pilot Rock? How does the setting establish the film's mood?",
      category: "Setting & Atmosphere", relatedScenes: [1], tags: ["setting", "atmosphere", "pilot-rock"] },
    { id: 2, question: "The departing keepers leave without a word. What does their silence foreshadow?",
      category: "Foreshadowing", relatedScenes: [1, 2], tags: ["foreshadowing", "keepers"] },
    { id: 3, question: "Young finds the mermaid carving hidden in his mattress. What might this object represent?",
      category: "Symbolism", relatedScenes: [2], tags: ["mermaid", "symbolism", "desire"] },
    { id: 4, question: "How does the film portray manual labor? What effect does endless work have on Young's psyche?",
      category: "Theme", relatedScenes: [3, 7], tags: ["labor", "psychology", "sisyphean"] },
    { id: 5, question: "How does Old establish dominance over Young? What tactics does he use?",
      category: "Power Dynamics", relatedScenes: [4, 9], tags: ["power", "dominance", "conflict"] },
    { id: 6, question: "Old toasts the light like a lover: \"To ye, me beauty!\" What is his relationship with the lighthouse?",
      category: "The Light", relatedScenes: [5], tags: ["light", "obsession", "worship"] },
    { id: 7, question: "Young's first vision shows a drowning man in a mackinaw coat. What is the film hinting at?",
      category: "Guilt & Identity", relatedScenes: [6], tags: ["hallucination", "guilt", "winslow"] },
    { id: 8, question: "What is the significance of the one-eyed gull? Why does it keep appearing?",
      category: "Mythology", relatedScenes: [7, 12, 16], tags: ["gull", "mythology", "omen"] },
    { id: 9, question: "Young falls while whitewashing the tower. Is Old's negligence intentional or accidental?",
      category: "Ambiguity", relatedScenes: [10], tags: ["power", "ambiguity", "accident"] },
    { id: 10, question: "Why is Old so protective of the lighthouse lamp? What might it symbolize?",
      category: "The Light", relatedScenes: [5, 11], tags: ["light", "forbidden", "knowledge"] },
    { id: 11, question: "\"Bad luck to kill a seabird.\" Why does Old react so violently to Young's dismissal of this belief?",
      category: "Mythology", relatedScenes: [12], tags: ["gull", "superstition", "curse"] },

    // ACT II
    { id: 12, question: "Why do Young and Old finally share their names? What does this vulnerability mean?",
      category: "Character", relatedScenes: [13], tags: ["identity", "bonding", "names"] },
    { id: 13, question: "Young's cigarette goes out—Old says someone is cursing him. Is this superstition or insight?",
      category: "Supernatural", relatedScenes: [14], tags: ["supernatural", "curse", "cigarette"] },
    { id: 14, question: "Young sees tentacles in the lantern room. Are his visions madness or glimpses of truth?",
      category: "Horror", relatedScenes: [15], tags: ["tentacles", "horror", "lovecraft"] },
    { id: 15, question: "Young kills the gull and the wind immediately changes. Coincidence or cosmic consequence?",
      category: "Mythology", relatedScenes: [16, 17], tags: ["gull", "curse", "albatross"] },
    { id: 16, question: "The last night before relief, they feast and sing together. Does their friendship feel genuine?",
      category: "Character", relatedScenes: [18], tags: ["bonding", "friendship", "irony"] },
    { id: 17, question: "The relief tender never arrives. How does this moment change the trajectory of the story?",
      category: "Turning Point", relatedScenes: [19], tags: ["isolation", "trapped", "storm"] },
    { id: 18, question: "Old tries to calm the sea with ritual and song. Is he a believer, a performer, or something more?",
      category: "Mythology", relatedScenes: [20], tags: ["neptune", "ritual", "mythology"] },
    { id: 19, question: "Time becomes impossible to track. How does the film convey the distortion of reality?",
      category: "Cinematography", relatedScenes: [21], tags: ["time", "madness", "editing"] },
    { id: 20, question: "They dig up buried liquor from a grave-sized hole. What does this foreshadow?",
      category: "Foreshadowing", relatedScenes: [22], tags: ["grave", "burial", "foreshadowing"] },
    { id: 21, question: "Young encounters the mermaid on the rocks. Is she real, a hallucination, or something in between?",
      category: "Ambiguity", relatedScenes: [23], tags: ["mermaid", "hallucination", "ambiguity"] },

    // ACT III
    { id: 22, question: "The men swing between friendship and violence. What drives these mood shifts?",
      category: "Psychology", relatedScenes: [24, 25], tags: ["violence", "bonding", "psychology"] },
    { id: 23, question: "Old delivers the Neptune curse. Does he have supernatural power, or is Young simply susceptible?",
      category: "Mythology", relatedScenes: [26], tags: ["curse", "neptune", "power"] },
    { id: 24, question: "Young confesses he's actually Thomas Howard. Does this change how you view his earlier actions?",
      category: "Identity", relatedScenes: [29], tags: ["identity", "confession", "winslow"] },
    { id: 25, question: "Old claims Young smashed the lifeboat—but did he? How reliable are either man's memories?",
      category: "Ambiguity", relatedScenes: [33], tags: ["ambiguity", "memory", "gaslighting"] },
    { id: 26, question: "Young discovers damning entries in Old's logbook. How does written record become a weapon?",
      category: "Power", relatedScenes: [35], tags: ["logbook", "power", "documentation"] },
    { id: 27, question: "Old repeatedly calls Young a \"dog.\" What does this dehumanization reveal?",
      category: "Power", relatedScenes: [36, 38], tags: ["dog", "dehumanization", "power"] },
    { id: 28, question: "During their fight, Old transforms into mermaid, then tentacles. What do these visions mean?",
      category: "Horror", relatedScenes: [37], tags: ["hallucination", "mermaid", "tentacles"] },
    { id: 29, question: "Young finally enters the light. What do you think he witnessed? Was it worth the cost?",
      category: "The Light", relatedScenes: [40], tags: ["light", "climax", "forbidden"] },
    { id: 30, question: "The ending echoes the Prometheus myth. What is the film saying about forbidden knowledge?",
      category: "Mythology", relatedScenes: [41], tags: ["prometheus", "mythology", "punishment"] }
];

// Make questions accessible globally
window.DISCUSSION_QUESTIONS = DISCUSSION_QUESTIONS;

// ============================================
// TAG SYSTEM - Scene Markers
// ============================================

const TAG_ICONS = {
    // Characters
    'young': '🧔',
    'old': '👴',

    // Key Symbols
    'light': '💡',
    'lighthouse': '🗼',
    'sea': '🌊',
    'storm': '⛈️',
    'mermaid': '🧜‍♀️',
    'gull': '🦅',
    'tentacles': '🐙',
    'logbook': '📔',

    // States & Themes
    'vision': '👁️',
    'alcohol': '🍺',
    'violence': '🔪',
    'labor': '⚒️',
    'conflict': '⚔️',
    'atmosphere': '🌫️',
    'quarters': '🏠',

    // Psychological States
    'madness': '🌀',
    'guilt': '😰',
    'obsession': '👀',
    'hallucination': '🌀'
};

const TAG_GROUPS = {
    'Characters': ['young', 'old'],
    'Key Symbols': ['light', 'lighthouse', 'mermaid', 'gull', 'tentacles', 'logbook'],
    'Environment': ['sea', 'storm', 'atmosphere', 'quarters'],
    'States': ['vision', 'alcohol', 'violence', 'labor', 'conflict'],
    'Psychology': ['madness', 'guilt', 'obsession', 'hallucination']
};

function buildTagBadges(tags) {
    if (!tags || tags.length === 0) return '';

    return tags.map(tag => {
        const icon = TAG_ICONS[tag] || '🏷️';
        const label = tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ');
        return `<span class="tag-badge tag-${tag}" title="${label}">${icon} ${label}</span>`;
    }).join(' ');
}

// ============================================
// CHAPTERS
// ============================================

const CHAPTERS = {
    'ch01-crossing': {
        id: 'ch01-crossing',
        name: '⛵ The Crossing',
        act: 'act1',
        description: 'A lighthouse tender emerges through fog, carrying two men to Pilot Rock.',
        sceneRange: '1-5'
    },
    'ch02-first-steps': {
        id: 'ch02-first-steps',
        name: '⚓ First Steps',
        act: 'act1',
        description: 'Young discovers the mermaid carving. Old establishes dominance.',
        sceneRange: '6-12'
    },
    'ch03-the-work': {
        id: 'ch03-the-work',
        name: '🔥 The Work',
        act: 'act1',
        description: 'Brutal labor begins. Old controls the light and the lantern room.',
        sceneRange: '13-20'
    },
    'ch04-bonds': {
        id: 'ch04-bonds',
        name: '📚 Bonds & Secrets',
        act: 'act1',
        description: 'Tentative rapport forms over meals. Names are revealed. Trust is fragile.',
        sceneRange: '21-27'
    },
    'ch05-dominance': {
        id: 'ch05-dominance',
        name: '🔨 Dominance & Danger',
        act: 'act2',
        description: 'Young plummets from the tower. Violence lurks beneath every interaction.',
        sceneRange: '28-41'
    },
    'ch06-omens': {
        id: 'ch06-omens',
        name: '🐦 Omens & Obsession',
        act: 'act2',
        description: 'Dead gulls in the cistern. The one-eyed gull stalks. Reality distorts.',
        sceneRange: '42-50'
    },
    'ch07-storm-arrives': {
        id: 'ch07-storm-arrives',
        name: '⛈️ The Storm Arrives',
        act: 'act2',
        description: 'The relief tender never comes. They are trapped. Time distorts.',
        sceneRange: '51-67'
    },
    'ch08-neptune': {
        id: 'ch08-neptune',
        name: '🌊 Neptune\'s Fury',
        act: 'act2',
        description: 'Old attempts to appease Neptune. The storm reaches biblical proportions.',
        sceneRange: '68-75'
    },
    'ch09-visions': {
        id: 'ch09-visions',
        name: '👁️ Visions & Violation',
        act: 'act3',
        description: 'Young hallucinates mermaids and tentacles. His mind fractures completely.',
        sceneRange: '76-87'
    },
    'ch10-confessions': {
        id: 'ch10-confessions',
        name: '🎭 Intoxicated Confessions',
        act: 'act3',
        description: 'They dance, almost kiss. Young confesses his stolen identity.',
        sceneRange: '88-89'
    },
    'ch11-ascension': {
        id: 'ch11-ascension',
        name: '🌀 The Ascension',
        act: 'act3',
        description: 'Young climbs the tower stairs, drawn to the forbidden light.',
        sceneRange: '90-112'
    },
    'ch12-reckoning': {
        id: 'ch12-reckoning',
        name: '💀 The Reckoning',
        act: 'act3',
        description: 'The light burns him. He falls. Seagulls devour his liver on the rocks.',
        sceneRange: '113-114'
    }
};

// ============================================
// SCENE DATA
// ============================================

// Scene data will be loaded from JSON file
let SCENES = [];
// Thematic connections
const THEMATIC_LINKS = [
    { source: 2, target: 35, theme: 'The Logbook' },
    { source: 5, target: 40, theme: 'The Forbidden Light' },
    { source: 6, target: 29, theme: 'Identity & Guilt' },
    { source: 6, target: 30, theme: 'The Doppelganger' },
    { source: 7, target: 41, theme: 'The One-Eyed Gull' },
    { source: 9, target: 36, theme: 'Dog Motif' },
    { source: 12, target: 17, theme: 'The Curse' },
    { source: 12, target: 26, theme: 'Neptune\'s Wrath' },
    { source: 15, target: 37, theme: 'Tentacles' },
    { source: 22, target: 38, theme: 'The Grave' },
    { source: 23, target: 37, theme: 'Mermaid Transformations' },
    { source: 10, target: 40, theme: 'The Fall' }
];

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    selectedNode: null,
    lockedNode: null,
    searchQuery: '',
    activeActs: new Set(),
    activeChapters: new Set(),  // Track active chapter filters
    activeTags: new Set(),  // Track active tag filters
    activeMarkers: new Set(),  // Track active scene type filters (hallucination, violence)
    activeConnections: new Set(),  // Track active connection type filters (foreshadowing, callback, thematic)
    viewedScenes: new Set(),
    data: null,
    root: null,
    showingFromModal: false  // Track if info card was opened from progress modal
};

// Load viewed scenes from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            state.viewedScenes = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

// Save viewed scenes to localStorage
function saveProgress() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify([...state.viewedScenes]));
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getActColor(actId) {
    return CONFIG.ACT_COLORS[actId] || '#666666';
}

function getActIcon(actId) {
    return CONFIG.ACT_ICONS[actId] || '';
}

function getActName(actId) {
    return CONFIG.ACT_NAMES[actId] || '';
}

function getTensionColor(tension) {
    if (tension <= 3) return '#43a047'; // Green - low tension
    if (tension <= 5) return '#ffc107'; // Yellow - medium tension
    if (tension <= 7) return '#ff9800'; // Orange - high tension
    return '#c44536'; // Red - extreme tension
}

function isScene(d) {
    return d.data && d.data.id !== undefined;
}

function isAct(d) {
    return d.data && d.data.act && !d.data.id;
}

// ============================================
// HIERARCHY CONSTRUCTION
// ============================================

function buildHierarchy() {
    // Build hierarchical data structure
    const root = {
        name: 'The Lighthouse',
        children: []
    };

    // Group scenes by act
    const acts = {};
    SCENES.forEach(scene => {
        if (!acts[scene.act]) {
            acts[scene.act] = {
                name: CONFIG.ACT_NAMES[scene.act],
                act: scene.act,
                children: []
            };
        }
        acts[scene.act].children.push({
            ...scene,
            name: scene.title
        });
    });

    root.children = Object.values(acts);
    return root;
}

function packageImports(nodes) {
    const map = {};
    const imports = [];

    // Build map of scene id to node
    nodes.forEach(d => {
        if (d.data.id) {
            map[d.data.id] = d;
        }
    });

    // Build connection paths for callbacks and foreshadowing
    nodes.forEach(d => {
        if (d.data.callbacks) {
            d.data.callbacks.forEach(targetId => {
                if (map[targetId]) {
                    imports.push({
                        source: map[targetId],
                        target: d,
                        type: 'callback'
                    });
                }
            });
        }
        if (d.data.foreshadowing) {
            d.data.foreshadowing.forEach(targetId => {
                if (map[targetId]) {
                    imports.push({
                        source: d,
                        target: map[targetId],
                        type: 'foreshadowing'
                    });
                }
            });
        }
    });

    // Add thematic links
    THEMATIC_LINKS.forEach(link => {
        if (map[link.source] && map[link.target]) {
            imports.push({
                source: map[link.source],
                target: map[link.target],
                type: 'thematic',
                theme: link.theme
            });
        }
    });

    return imports;
}

// ============================================
// TOOLTIP
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
    if (!d.data.id) return; // Only show for scenes

    const scene = d.data;
    const types = scene.types ? scene.types.map(t =>
        `<span class="tooltip-type" style="background: ${CONFIG.TYPE_COLORS[t] || '#666'};">${t}</span>`
    ).join(' ') : '';

    // Location and time info
    const locationTime = scene.location || scene.time ?
        `<div class="tooltip-location">${scene.location || ''}${scene.location && scene.time ? ' • ' : ''}${scene.time || ''}</div>` : '';

    tooltip.html(`
        <div class="tooltip-header">
            <span class="tooltip-icon">${getActIcon(scene.act)}</span>
            <span class="tooltip-title">${scene.id}. ${scene.title}</span>
        </div>
        ${locationTime}
        <div class="tooltip-types">${types}</div>
        <div class="tooltip-summary">${scene.summary}</div>
        ${scene.symbols ? `<div class="tooltip-symbols"><strong>Key Symbols:</strong> ${scene.symbols.join(', ')}</div>` : ''}
        <div class="tooltip-hint">Click for full details & connections</div>
    `);

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
        .classed('visible', true);
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classed('visible', false);
    }
}

// ============================================
// INFO CARD (CLICK)
// ============================================

let infoCard = null;
let infoCardBackdrop = null;

function createInfoCard() {
    if (!infoCardBackdrop) {
        infoCardBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', hideInfoCard);
    }

    infoCard = d3.select('body')
        .append('div')
        .attr('class', 'info-card')
        .attr('id', 'info-card');

    return infoCard;
}

function showInfoCard(d, event, updateInPlace = false) {
    if (!infoCard) createInfoCard();
    if (!d.data.id) return;

    const scene = d.data;
    const actColor = getActColor(scene.act);
    const isViewed = state.viewedScenes.has(scene.id);


    const types = scene.types ? scene.types.map(t =>
        `<span class="info-card-type" style="background: ${CONFIG.TYPE_COLORS[t] || '#666'};">${t}</span>`
    ).join(' ') : '';

    // Build connections HTML
    let connectionsHTML = '';

    if (scene.callbacks && scene.callbacks.length > 0) {
        const callbackItems = scene.callbacks.map(id => {
            const targetScene = SCENES.find(s => s.id === id);
            return targetScene ? `<a href="#" class="connection-link" data-scene="${id}">↩ #${id}: ${targetScene.title}</a>` : '';
        }).filter(x => x).join('');
        connectionsHTML += `<div class="connections-group"><strong>References Earlier:</strong>${callbackItems}</div>`;
    }

    if (scene.foreshadowing && scene.foreshadowing.length > 0) {
        const foreshadowItems = scene.foreshadowing.map(id => {
            const targetScene = SCENES.find(s => s.id === id);
            return targetScene ? `<a href="#" class="connection-link" data-scene="${id}">→ #${id}: ${targetScene.title}</a>` : '';
        }).filter(x => x).join('');
        connectionsHTML += `<div class="connections-group"><strong>Foreshadows:</strong>${foreshadowItems}</div>`;
    }

    // Thematic connections
    const thematicConnections = THEMATIC_LINKS.filter(l => l.source === scene.id || l.target === scene.id);
    if (thematicConnections.length > 0) {
        const thematicItems = thematicConnections.map(link => {
            const otherId = link.source === scene.id ? link.target : link.source;
            const otherScene = SCENES.find(s => s.id === otherId);
            return otherScene ? `<a href="#" class="connection-link thematic" data-scene="${otherId}">⚡ ${link.theme}: #${otherId}</a>` : '';
        }).filter(x => x).join('');
        connectionsHTML += `<div class="connections-group"><strong>Thematic Links:</strong>${thematicItems}</div>`;
    }

    infoCard.html(`
        <div class="info-card-header" style="border-left: 4px solid ${actColor};">
            <span class="info-card-icon">${getActIcon(scene.act)}</span>
            <div class="info-card-titles">
                <h5 class="info-card-scene">${scene.id}. ${scene.title}</h5>
                <p class="info-card-act">${getActName(scene.act)}</p>
            </div>
            <button class="info-card-close" onclick="window.hideInfoCard()" title="Close">×</button>
        </div>
        <div class="info-card-action-bar">
            <button class="btn btn-sm ${isViewed ? 'btn-success' : 'btn-outline-primary'}"
                    id="toggle-viewed-btn-${scene.id}"
                    onclick="window.toggleViewedFromCard(${scene.id})">
                ${isViewed ? '✓ Reviewed' : 'Mark as Reviewed'}
            </button>
        </div>
        ${scene.location || scene.time ? `
        <div class="info-card-location">
            ${scene.location ? `<span class="location-text">📍 ${scene.location}</span>` : ''}
            ${scene.time ? `<span class="time-text">🕐 ${scene.time}</span>` : ''}
        </div>
        ` : ''}
        <div class="info-card-types">${types}</div>
        ${scene.tags && scene.tags.length > 0 ? `
        <div class="info-card-tags">
            ${buildTagBadges(scene.tags)}
        </div>
        ` : ''}
        <div class="info-card-body">
            <p class="info-card-summary">${scene.summary}</p>
            ${scene.quotes && scene.quotes.length > 0 ? `
            <div class="info-card-quotes">
                <strong>💬 Key Dialogue:</strong>
                <div class="quotes-list">
                    ${scene.quotes.map(q => `<span class="quote-item">${q}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            ${scene.characters ? `
            <div class="info-card-characters">
                <strong>👤 Characters:</strong>
                <div class="characters-grid">
                    ${scene.characters.young ? `<span class="character-state"><strong>Young:</strong> ${scene.characters.young}</span>` : ''}
                    ${scene.characters.old ? `<span class="character-state"><strong>Old:</strong> ${scene.characters.old}</span>` : ''}
                </div>
            </div>
            ` : ''}
            ${scene.imagery ? `<p class="info-card-imagery"><strong>🎬 Visual Imagery:</strong> ${scene.imagery}</p>` : ''}
            ${scene.themes && scene.themes.length > 0 ? `
            <p class="info-card-themes"><strong>🎭 Themes:</strong> ${scene.themes.join(', ')}</p>
            ` : ''}
            ${scene.mythologyRef ? `<p class="info-card-mythology"><strong>📚 Mythology:</strong> ${scene.mythologyRef}</p>` : ''}
            ${scene.tension ? `
            <div class="info-card-tension">
                <strong>⚡ Tension Level:</strong>
                <div class="tension-bar">
                    <div class="tension-fill" style="width: ${scene.tension * 10}%; background: ${getTensionColor(scene.tension)};"></div>
                </div>
                <span class="tension-value">${scene.tension}/10</span>
            </div>
            ` : ''}
            ${scene.symbols ? `<p class="info-card-symbols"><strong>🔑 Key Symbols:</strong> ${scene.symbols.join(', ')}</p>` : ''}
        </div>
        ${connectionsHTML ? `<div class="info-card-connections">${connectionsHTML}</div>` : ''}
    `);

    // Add click handlers for connection links - UPDATE IN PLACE
    infoCard.selectAll('.connection-link').on('click', function(event) {
        event.preventDefault();
        const sceneId = parseInt(this.dataset.scene);
        const targetScene = state.root.descendants().find(d => d.data.id === sceneId);
        if (targetScene) {
            // Update in place - don't reposition
            showInfoCard(targetScene, null, true);
            // Update node highlighting
            highlightConnections(targetScene);

            // Scroll to top of the card
            infoCard.node().scrollTop = 0;
        }
    });

    // Reset scroll position to top only when opening a new card (not when clicking references)
    if (!updateInPlace) {
        infoCard.node().scrollTop = 0;
    }

    // Only show backdrop if not opening from progress modal
    if (infoCardBackdrop && !state.showingFromModal) {
        infoCardBackdrop.classed('visible', true);
    }
    infoCard.classed('visible', true);
}

// Toggle viewed status for a scene
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

// Toggle viewed from info card and update button
window.toggleViewedFromCard = function(sceneId) {
    toggleViewed(sceneId);
    const btn = document.getElementById(`toggle-viewed-btn-${sceneId}`);
    const isViewed = state.viewedScenes.has(sceneId);
    if (btn) {
        btn.className = `btn btn-sm ${isViewed ? 'btn-success' : 'btn-outline-primary'}`;
        btn.textContent = isViewed ? '✓ Reviewed' : 'Mark as Reviewed';
    }
};

// Update node visual styles based on viewed status
function updateNodeStyles() {
    if (!nodeGroup) return;

    // Update circle styles
    nodeGroup.selectAll('.node circle')
        .classed('viewed', d => state.viewedScenes.has(d.data.id));

    // Update checkmark visibility
    nodeGroup.selectAll('.node .node-checkmark')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0);

    // Update text label styles - color matches the act when viewed
    nodeGroup.selectAll('.node .node-label')
        .classed('viewed-label', d => state.viewedScenes.has(d.data.id))
        .attr('fill', d => state.viewedScenes.has(d.data.id) ? getActColor(d.data.act) : 'var(--viz-text)');
}

function hideInfoCard() {
    if (infoCard) {
        infoCard.classed('visible', false);
    }
    // Only hide backdrop if not showing from modal
    if (infoCardBackdrop && !state.showingFromModal) {
        infoCardBackdrop.classed('visible', false);
    }
    state.lockedNode = null;
    state.showingFromModal = false;
    hideTooltip(); // Also hide any tooltip that might be showing
    updateHighlights();
    // Update progress modal if it's still visible
    updateProgressModal();
}

window.hideInfoCard = hideInfoCard;

function clearAllSelections() {
    // Clear search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        state.searchQuery = '';
    }

    // Clear info card
    hideInfoCard();
    hideTooltip();

    // Clear locked node
    state.lockedNode = null;
    state.selectedNode = null;

    // Clear legend filters
    state.activeActs.clear();
    state.activeMarkers.clear();
    state.activeConnections.clear();

    // Update UI
    d3.selectAll('.legend-item[data-act]').classed('active', false);
    d3.selectAll('.legend-marker-item').classed('active', false);
    d3.selectAll('.legend-connection-item').classed('active', false);

    // Clear book club question highlights
    document.querySelectorAll('.book-club-question').forEach(q => {
        q.classList.remove('active');
    });

    // Reset all node visibility
    updateHighlights();
    renderTimeline();
}

window.clearAllSelections = clearAllSelections;

function positionInfoCard(event) {
    if (!infoCard) return;

    const cardNode = infoCard.node();
    const cardWidth = cardNode.offsetWidth || 400;
    const cardHeight = cardNode.offsetHeight || 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left, top;

    if (state.showingFromModal) {
        // Position to the right side when opened from progress modal
        // Progress modal is centered, so put info card on the right
        left = viewportWidth - cardWidth - 20;
        top = (viewportHeight - cardHeight) / 2;
    } else if (event && event.clientX !== undefined) {
        // Position near click
        left = event.clientX - cardWidth / 2;
        top = event.clientY - cardHeight / 2;
    } else {
        // Center in viewport
        left = (viewportWidth - cardWidth) / 2;
        top = (viewportHeight - cardHeight) / 2;
    }

    // Keep within viewport bounds
    left = Math.max(10, Math.min(left, viewportWidth - cardWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - cardHeight - 10));

    infoCard
        .style('left', left + 'px')
        .style('top', top + 'px');
}

// ============================================
// RADIAL VISUALIZATION
// ============================================

let svg, g, nodeGroup, linkGroup;
let currentLinks = [];
let allNodes = [];

function initVisualization() {
    const container = d3.select('#visualization-container');
    container.select('.loading-overlay').remove();

    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = radius - 150;
    const verticalOffset = 80; // Shift diagram down
    const padding = 200; // Add padding on all sides to prevent cutoff

    svg = container.append('svg')
        .attr('viewBox', `${-radius - padding} ${-radius - verticalOffset - padding} ${diameter + padding * 2} ${diameter + verticalOffset + padding * 2}`)
        .attr('width', '100%')
        .attr('height', diameter + verticalOffset + padding * 2)
        .style('max-width', `${diameter + padding * 2}px`)
        .style('font', '12px sans-serif');

    // Add gradient definitions
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

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

    // Draw links first (behind nodes)
    linkGroup = g.append('g')
        .attr('class', 'links')
        .attr('fill', 'none');

    // Draw curved links
    const line = d3.lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

    linkGroup.selectAll('.link')
        .data(currentLinks)
        .join('path')
        .attr('class', d => `link link-${d.type}`)
        .attr('d', d => {
            // Create path through parent
            const sourcePath = d.source.path(d.target);
            return line(sourcePath);
        })
        .attr('stroke', d => {
            if (d.type === 'callback') return '#8b5a8b';
            if (d.type === 'thematic') return '#b8860b';
            return '#5a8b5a';
        })
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', d => d.type === 'callback' ? '5,3' : null);

    // Draw nodes
    nodeGroup = g.append('g')
        .attr('class', 'nodes');

    const nodes = nodeGroup.selectAll('.node')
        .data(allNodes.filter(d => d.data.id)) // Only scene nodes
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y},0)`)
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
            state.lockedNode = d;
            showInfoCard(d, event);
            highlightConnections(d);
        });

    // Node circles
    nodes.append('circle')
        .attr('r', 8)
        .attr('fill', d => getActColor(d.data.act))
        .attr('stroke', d => {
            if (d.data.isHallucination) return '#b8860b';
            if (d.data.isViolence) return '#8b0000';
            return '#fff';
        })
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => d.data.isHallucination ? '3,2' : null);

    // Checkmark indicator - positioned between node and text
    nodes.append('text')
        .attr('class', 'node-checkmark')
        .attr('dy', '0.31em')
        .attr('x', d => d.x < 180 ? 20 : -20)
        .attr('text-anchor', 'middle')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('fill', d => getActColor(d.data.act))
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0)
        .text('✓');

    // Node labels
    nodes.append('text')
        .attr('class', 'node-label')
        .attr('data-act', d => d.data.act)
        .attr('dy', '0.31em')
        .attr('x', d => d.x < 180 ? 32 : -32)
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('fill', 'var(--viz-text)')
        .attr('font-size', '10px')
        .style('cursor', 'pointer')
        .text(d => `${d.data.id}. ${d.data.title}`);


    // Apply viewed styles for any previously viewed scenes
    updateNodeStyles();
}

function highlightConnections(d) {
    if (!d.data.id) return;

    const connectedIds = new Set();
    connectedIds.add(d.data.id);

    // Add callbacks and foreshadowing
    if (d.data.callbacks) d.data.callbacks.forEach(id => connectedIds.add(id));
    if (d.data.foreshadowing) d.data.foreshadowing.forEach(id => connectedIds.add(id));

    // Add thematic connections
    THEMATIC_LINKS.forEach(link => {
        if (link.source === d.data.id) connectedIds.add(link.target);
        if (link.target === d.data.id) connectedIds.add(link.source);
    });

    // Dim non-connected nodes
    nodeGroup.selectAll('.node')
        .classed('dimmed', n => !connectedIds.has(n.data.id))
        .classed('highlighted', n => connectedIds.has(n.data.id) && n.data.id !== d.data.id)
        .classed('selected', n => n.data.id === d.data.id);

    // Highlight connected links
    linkGroup.selectAll('.link')
        .classed('dimmed', l => l.source.data.id !== d.data.id && l.target.data.id !== d.data.id)
        .classed('highlighted', l => l.source.data.id === d.data.id || l.target.data.id === d.data.id);
}

function unhighlightAll() {
    nodeGroup.selectAll('.node')
        .classed('dimmed', false)
        .classed('highlighted', false)
        .classed('selected', false);

    linkGroup.selectAll('.link')
        .classed('dimmed', false)
        .classed('highlighted', false);
}

function updateHighlights() {
    if (state.lockedNode) {
        highlightConnections(state.lockedNode);
    } else {
        unhighlightAll();
    }
}

// ============================================
// LEGEND
// ============================================

function initLegend() {
    const legendContainer = d3.select('#legend-container');

    // Header with progress
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
        .text('0/41');

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
        .style('flex-wrap', 'wrap')
        .style('width', '100%');

    actsContainer.append('span')
        .attr('class', 'legend-section-label')
        .style('margin', '0')
        .text('Filter by Act:');

    // Act colors with scene counts - inline
    const actsRow = actsContainer.append('div')
        .attr('class', 'legend-items-row')
        .style('margin', '0');

    const actDetails = {
        'act1': { scenes: '1-38', count: 38 },
        'act2': { scenes: '39-76', count: 38 },
        'act3': { scenes: '77-114', count: 38 }
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

    // Chapters container - 4 column layout
    const chaptersContainer = grid.append('div')
        .attr('class', 'legend-categories-container')
        .style('column-count', '4')
        .style('column-gap', '2rem')
        .style('margin-top', '0.5rem')
        .style('display', 'block')
        .style('width', '100%');

    // Chapter order
    const chapterOrder = [
        'ch01-crossing', 'ch02-first-steps', 'ch03-the-work', 'ch04-bonds',
        'ch05-dominance', 'ch06-omens', 'ch07-storm-arrives', 'ch08-neptune',
        'ch09-visions', 'ch10-confessions', 'ch11-ascension', 'ch12-reckoning'
    ];

    chapterOrder.forEach(chapterId => {
        const chapter = CHAPTERS[chapterId];
        if (!chapter) return;

        // Calculate scene count for this chapter
        const sceneCount = SCENES.filter(s => s.chapter === chapterId).length;

        const chapterNum = chapterId.split('-')[0].replace('ch', '');
        const nameWithoutIcon = chapter.name.replace(/^[^\s]+\s/, '');

        // Create row container
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
            .attr('title', `Click to filter: ${chapter.name} - ${chapter.description} (${sceneCount} scenes)`)
            .style('width', 'fit-content')
            .on('click', () => toggleChapterFilter(chapterId));

        // Add active indicator (checkmark)
        item.append('span')
            .attr('class', 'active-indicator')
            .text('✓');

        // Chapter number badge
        item.append('span')
            .style('background-color', getActColor(chapter.act))
            .style('color', 'white')
            .style('font-weight', '700')
            .style('font-size', '0.65rem')
            .style('padding', '0.2rem 0.4rem')
            .style('border-radius', '3px')
            .style('margin-right', '0.4rem')
            .style('font-family', 'monospace')
            .text(String(chapterNum).padStart(2, '0'));

        // Chapter icon (extract from name)
        const icon = chapter.name.match(/^[^\s]+/)?.[0] || '';
        item.append('span')
            .attr('class', 'legend-icon')
            .text(icon);

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

        // Add scene count (zero-padded)
        row.append('span')
            .style('font-size', '0.7rem')
            .style('color', '#888')
            .style('font-weight', '500')
            .style('font-family', 'monospace')
            .text(`(${String(sceneCount).padStart(2, '0')})`);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Scene Markers - inline with items
    const markersContainer = grid.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '0.75rem')
        .style('flex-wrap', 'wrap')
        .style('width', '100%');

    markersContainer.append('span')
        .attr('class', 'legend-section-label')
        .style('margin', '0')
        .text('Scene Markers:');

    // Scene markers - inline
    const markersRow = markersContainer.append('div')
        .attr('class', 'legend-items-row')
        .style('margin', '0');

    // Special markers with descriptions - now clickable for filtering
    const specialMarkers = [
        { key: 'hallucination', label: 'Hallucination', color: '#b8860b', dashed: true, desc: 'Click to filter: visions/dreams', field: 'isHallucination' },
        { key: 'violence', label: 'Violence', color: '#8b0000', dashed: false, desc: 'Click to filter: violent scenes', field: 'isViolence' },
        { key: 'revelation', label: 'Revelation', color: '#1a5a7a', dashed: false, desc: 'Click to filter: key plot reveals', field: 'isRevelation' }
    ];

    specialMarkers.forEach(marker => {
        const item = markersRow.append('div')
            .attr('class', 'legend-item legend-marker-item')
            .attr('data-marker', marker.key)
            .attr('title', marker.desc)
            .on('click', () => toggleMarkerFilter(marker.key, marker.field));

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', marker.color)
            .style('border', marker.dashed ? '2px dashed #b8860b' : `2px solid ${marker.color}`);

        item.append('span')
            .attr('class', 'legend-text')
            .text(marker.label);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Connections - inline with items
    const connectionsContainer = grid.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '0.75rem')
        .style('flex-wrap', 'wrap')
        .style('width', '100%');

    connectionsContainer.append('span')
        .attr('class', 'legend-section-label')
        .style('margin', '0')
        .text('Connection Lines:');

    // Connection lines - inline
    const connectionsRow = connectionsContainer.append('div')
        .attr('class', 'legend-items-row')
        .style('margin', '0');

    // Connection type legend - now clickable for filtering
    const connectionTypes = [
        { key: 'foreshadowing', label: 'Foreshadowing', color: '#5a8b5a', style: 'solid', desc: 'Click to highlight: scenes that set up later events' },
        { key: 'callback', label: 'Callback', color: '#8b5a8b', style: 'dashed', desc: 'Click to highlight: scenes that reference earlier events' },
        { key: 'thematic', label: 'Thematic', color: '#b8860b', style: 'solid', desc: 'Click to highlight: scenes with shared symbols/motifs' }
    ];

    connectionTypes.forEach(conn => {
        const item = connectionsRow.append('div')
            .attr('class', 'legend-item legend-connection-item')
            .attr('data-connection', conn.key)
            .attr('title', conn.desc)
            .on('click', () => toggleConnectionFilter(conn.key));

        item.append('span')
            .attr('class', 'legend-line')
            .style('background-color', conn.color)
            .style('border-style', conn.style === 'dashed' ? 'dashed' : 'solid');

        item.append('span')
            .attr('class', 'legend-text')
            .text(conn.label);
    });

    // Add clear selection hint at bottom
    legendContainer.append('div')
        .attr('class', 'clear-selection-hint')
        .html('💡 <kbd>ESC</kbd> or <strong>click outside</strong> to clear selections');

    updateProgressUI();
}

function toggleActFilter(actId) {
    if (state.activeActs.has(actId)) {
        state.activeActs.delete(actId);
    } else {
        state.activeActs.add(actId);
    }

    // Update legend item appearance
    d3.selectAll('.legend-item[data-act]')
        .classed('active', function() {
            return state.activeActs.has(this.dataset.act);
        });

    // Apply combined filters
    applyNodeFilters();
}

function toggleChapterFilter(chapterId) {
    if (state.activeChapters.has(chapterId)) {
        state.activeChapters.delete(chapterId);
    } else {
        state.activeChapters.add(chapterId);
    }

    // Update legend item appearance
    d3.selectAll('.legend-chapter-item')
        .classed('active', function() {
            return state.activeChapters.has(this.dataset.chapter);
        });

    // Apply combined filters
    applyNodeFilters();
}

function toggleMarkerFilter(markerKey, field) {
    if (state.activeMarkers.has(markerKey)) {
        state.activeMarkers.delete(markerKey);
    } else {
        state.activeMarkers.add(markerKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-marker-item')
        .classed('active', function() {
            return state.activeMarkers.has(this.dataset.marker);
        });

    // Apply combined filters
    applyNodeFilters();
}

// Apply all filters to nodes
function applyNodeFilters() {
    if (!nodeGroup) return;

    const hasActFilter = state.activeActs.size > 0;
    const hasChapterFilter = state.activeChapters.size > 0;
    const hasMarkerFilter = state.activeMarkers.size > 0;

    if (!hasActFilter && !hasChapterFilter && !hasMarkerFilter) {
        // No filters - show all
        nodeGroup.selectAll('.node').classed('filtered', false);
    } else {
        nodeGroup.selectAll('.node')
            .classed('filtered', d => {
                let passesActFilter = true;
                let passesChapterFilter = true;
                let passesMarkerFilter = true;

                // Check act filter
                if (hasActFilter) {
                    passesActFilter = state.activeActs.has(d.data.act);
                }

                // Check chapter filter
                if (hasChapterFilter) {
                    passesChapterFilter = state.activeChapters.has(d.data.chapter);
                }

                // Check marker filter (scene must have at least one of the active markers)
                if (hasMarkerFilter) {
                    passesMarkerFilter = false;
                    if (state.activeMarkers.has('hallucination') && d.data.isHallucination) passesMarkerFilter = true;
                    if (state.activeMarkers.has('violence') && d.data.isViolence) passesMarkerFilter = true;
                    if (state.activeMarkers.has('revelation') && d.data.isRevelation) passesMarkerFilter = true;
                }

                // Must pass all active filters
                return !(passesActFilter && passesChapterFilter && passesMarkerFilter);
            });
    }
}

// Toggle connection type filter (foreshadowing, callback, thematic)
function toggleConnectionFilter(connectionKey) {
    if (state.activeConnections.has(connectionKey)) {
        state.activeConnections.delete(connectionKey);
    } else {
        state.activeConnections.add(connectionKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-connection-item')
        .classed('active', function() {
            return state.activeConnections.has(this.dataset.connection);
        });

    // Apply connection highlighting
    applyConnectionFilters();
}

// Highlight links based on connection type filter
function applyConnectionFilters() {
    if (!linkGroup) return;

    const hasConnectionFilter = state.activeConnections.size > 0;

    if (!hasConnectionFilter) {
        // No filters - reset all links
        linkGroup.selectAll('.link')
            .classed('highlighted', false)
            .classed('dimmed', false);
        nodeGroup.selectAll('.node')
            .classed('connection-highlighted', false)
            .classed('connection-dimmed', false);
        return;
    }

    // Find all scene IDs that have the selected connection types
    const highlightedSceneIds = new Set();

    nodeGroup.selectAll('.node').each(function(d) {
        if (!d.data.id) return;

        let hasMatchingConnection = false;

        // Check foreshadowing
        if (state.activeConnections.has('foreshadowing') && d.data.foreshadowing && d.data.foreshadowing.length > 0) {
            hasMatchingConnection = true;
            d.data.foreshadowing.forEach(id => highlightedSceneIds.add(id));
        }

        // Check callback
        if (state.activeConnections.has('callback') && d.data.callbacks && d.data.callbacks.length > 0) {
            hasMatchingConnection = true;
            d.data.callbacks.forEach(id => highlightedSceneIds.add(id));
        }

        // Check thematic
        if (state.activeConnections.has('thematic')) {
            const hasThematic = THEMATIC_LINKS.some(l => l.source === d.data.id || l.target === d.data.id);
            if (hasThematic) {
                hasMatchingConnection = true;
                THEMATIC_LINKS.forEach(l => {
                    if (l.source === d.data.id) highlightedSceneIds.add(l.target);
                    if (l.target === d.data.id) highlightedSceneIds.add(l.source);
                });
            }
        }

        if (hasMatchingConnection) {
            highlightedSceneIds.add(d.data.id);
        }
    });

    // Highlight matching links
    linkGroup.selectAll('.link')
        .classed('highlighted', function(d) {
            if (state.activeConnections.has('foreshadowing') && d.type === 'foreshadowing') return true;
            if (state.activeConnections.has('callback') && d.type === 'callback') return true;
            if (state.activeConnections.has('thematic') && d.type === 'thematic') return true;
            return false;
        })
        .classed('dimmed', function(d) {
            if (state.activeConnections.has('foreshadowing') && d.type === 'foreshadowing') return false;
            if (state.activeConnections.has('callback') && d.type === 'callback') return false;
            if (state.activeConnections.has('thematic') && d.type === 'thematic') return false;
            return true;
        });

    // Highlight matching nodes
    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', d => highlightedSceneIds.has(d.data.id))
        .classed('connection-dimmed', d => !highlightedSceneIds.has(d.data.id));
}

function updateProgressUI() {
    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    const progressWrapper = document.querySelector('.progress-bar-wrapper');
    const progressText = document.querySelector('.progress-text');

    if (!progressWrapper) return;

    // Count by act
    const viewedByAct = { act1: 0, act2: 0, act3: 0 };
    const totalByAct = { act1: 12, act2: 11, act3: 18 };

    state.viewedScenes.forEach(id => {
        const scene = SCENES.find(s => s.id === id);
        if (scene) {
            viewedByAct[scene.act]++;
        }
    });

    // Build progress segments
    progressWrapper.innerHTML = '';
    Object.entries(viewedByAct).forEach(([actId, count]) => {
        const actTotal = totalByAct[actId];
        const completionPercent = (count / actTotal) * 100;
        const actColor = getActColor(actId);

        // Convert hex color to RGB for rgba usage
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 100, g: 100, b: 100 };
        };

        const rgb = hexToRgb(actColor);

        const segment = document.createElement('div');
        segment.className = 'progress-bar-segment';
        segment.style.width = `${(actTotal / total) * 100}%`;
        // Light faded background using rgba (25% opacity)
        segment.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;

        const fill = document.createElement('div');
        fill.className = 'progress-inner-fill';
        fill.style.width = `${completionPercent}%`;
        // Full solid color for the completed portion
        fill.style.backgroundColor = actColor;
        segment.appendChild(fill);

        progressWrapper.appendChild(segment);
    });

    if (progressText) {
        progressText.textContent = `${viewed}/${total}`;
    }
}

// ============================================
// PROGRESS TOOLTIP (HOVER)
// ============================================

let progressTooltip = null;

function createProgressTooltip() {
    progressTooltip = d3.select('body')
        .append('div')
        .attr('class', 'progress-tooltip')
        .attr('id', 'progress-tooltip');
    return progressTooltip;
}

function showProgressTooltip(event) {
    if (!progressTooltip) createProgressTooltip();

    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Count by act
    const viewedByAct = { act1: 0, act2: 0, act3: 0 };
    const totalByAct = { act1: 12, act2: 11, act3: 18 };

    // Count by type
    const viewedByType = { hallucination: 0, violence: 0, revelation: 0 };
    const totalByType = { hallucination: 0, violence: 0, revelation: 0 };

    SCENES.forEach(scene => {
        if (scene.isHallucination) totalByType.hallucination++;
        if (scene.isViolence) totalByType.violence++;
        if (scene.isRevelation) totalByType.revelation++;

        if (state.viewedScenes.has(scene.id)) {
            viewedByAct[scene.act]++;
            if (scene.isHallucination) viewedByType.hallucination++;
            if (scene.isViolence) viewedByType.violence++;
            if (scene.isRevelation) viewedByType.revelation++;
        }
    });

    let tooltipHTML = `
        <div class="progress-tooltip-title">📊 Progress Summary</div>
        <div class="progress-tooltip-content">
    `;

    // Acts section
    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const count = viewedByAct[actId];
        const actTotal = totalByAct[actId];
        const actPercentage = Math.round((count / actTotal) * 100);

        tooltipHTML += `
            <div class="progress-tooltip-section" style="border-color: ${getActColor(actId)}">
                <div class="progress-tooltip-section-name">
                    <span class="progress-tooltip-section-icon">${CONFIG.ACT_ICONS[actId]}</span>
                    <span>${name.split('(')[0].trim()}</span>
                </div>
                <div class="progress-tooltip-section-count" style="color: ${getActColor(actId)}">
                    ${count}/${actTotal} (${actPercentage}%)
                </div>
            </div>
        `;
    });

    tooltipHTML += `
        </div>
        <div class="progress-tooltip-types">
            <div class="progress-tooltip-type-title">Scene Types Viewed:</div>
            <div class="progress-tooltip-type-grid">
                <span class="type-badge" style="background: #b8860b;">Hallucinations: ${viewedByType.hallucination}/${totalByType.hallucination}</span>
                <span class="type-badge" style="background: #8b0000;">Violence: ${viewedByType.violence}/${totalByType.violence}</span>
                <span class="type-badge" style="background: #1a5a7a;">Revelations: ${viewedByType.revelation}/${totalByType.revelation}</span>
            </div>
        </div>
        <div class="progress-tooltip-total">
            <span>Total: ${viewed}/${total} scenes</span>
            <span class="progress-tooltip-percentage">${percentage}%</span>
        </div>
        <div class="progress-tooltip-hint">Click for detailed view</div>
    `;

    progressTooltip.html(tooltipHTML);

    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    const tooltipNode = progressTooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 400;
    const tooltipHeight = tooltipNode.offsetHeight || 300;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.bottom + 10;

    // Adjust if out of bounds
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight - 10) {
        top = rect.top - tooltipHeight - 10;
    }

    progressTooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
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
            .on('click', closeAllModals);
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

    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Group scenes by act
    const scenesByAct = { act1: [], act2: [], act3: [] };
    SCENES.forEach(scene => {
        scenesByAct[scene.act].push(scene);
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
        const scenes = scenesByAct[actId];
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
            const typeIndicators = [];
            if (scene.isHallucination) typeIndicators.push('<span class="scene-type-dot" style="background:#b8860b" title="Hallucination"></span>');
            if (scene.isViolence) typeIndicators.push('<span class="scene-type-dot" style="background:#8b0000" title="Violence"></span>');
            if (scene.isRevelation) typeIndicators.push('<span class="scene-type-dot" style="background:#1a5a7a" title="Revelation"></span>');

            modalHTML += `
                <div class="progress-item ${isViewed ? 'viewed' : ''}" data-scene-id="${scene.id}">
                    <input type="checkbox"
                           ${isViewed ? 'checked' : ''}
                           onchange="window.toggleSceneViewed(${scene.id})">
                    <span class="progress-item-number">${scene.id}.</span>
                    <label class="progress-item-label">${scene.title}</label>
                    <span class="progress-item-types">${typeIndicators.join('')}</span>
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

// Close all modals (both progress modal and info card)
function closeAllModals() {
    hideInfoCard();
    hideProgressModal();
}

function updateProgressModal() {
    if (!progressModal || !progressModal.classed('visible')) return;

    const total = 41;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Update header count
    progressModal.select('.progress-modal-count')
        .text(`${viewed}/${total} scenes (${percentage}%)`);

    // Update each act section
    Object.keys(CONFIG.ACT_NAMES).forEach(actId => {
        const scenes = SCENES.filter(s => s.act === actId);
        const viewedCount = scenes.filter(s => state.viewedScenes.has(s.id)).length;
        const allViewed = viewedCount === scenes.length;

        // Update section count
        progressModal.select(`.progress-section[data-act="${actId}"] .progress-section-count`)
            .text(`${viewedCount}/${scenes.length}`);

        // Update section checkbox
        progressModal.select(`.progress-section[data-act="${actId}"] .section-toggle-checkbox`)
            .property('checked', allViewed);
    });

    // Update individual scene checkboxes
    progressModal.selectAll('.progress-item').each(function() {
        const item = d3.select(this);
        const sceneId = parseInt(this.dataset.sceneId);
        const isViewed = state.viewedScenes.has(sceneId);

        item.classed('viewed', isViewed);
        item.select('input[type="checkbox"]').property('checked', isViewed);
    });
}

// Toggle all scenes in an act
function toggleActViewed(actId) {
    const scenes = SCENES.filter(s => s.act === actId);
    const allViewed = scenes.every(s => state.viewedScenes.has(s.id));

    if (allViewed) {
        scenes.forEach(s => state.viewedScenes.delete(s.id));
    } else {
        scenes.forEach(s => state.viewedScenes.add(s.id));
    }

    saveProgress();
    updateProgressUI();
    updateProgressModal();
    updateNodeStyles();
}

// Toggle single scene viewed status
function toggleSceneViewed(sceneId) {
    if (state.viewedScenes.has(sceneId)) {
        state.viewedScenes.delete(sceneId);
    } else {
        state.viewedScenes.add(sceneId);
    }

    saveProgress();
    updateProgressUI();
    updateProgressModal();
    updateNodeStyles();
}

// Show scene info from modal - keep progress modal visible in background
function showSceneFromModal(sceneId) {
    const targetScene = state.root.descendants().find(d => d.data.id === sceneId);
    if (targetScene) {
        // Don't hide progress modal - show info card on top
        state.showingFromModal = true;
        showInfoCard(targetScene, null, false);
        highlightConnections(targetScene);
    }
}

// Reset all progress
function resetAllProgress() {
    if (confirm('Reset all viewing progress? This cannot be undone.')) {
        state.viewedScenes.clear();
        saveProgress();
        updateProgressUI();
        updateProgressModal();
        updateNodeStyles();
    }
}

// Mark all as viewed
function markAllViewed() {
    SCENES.forEach(s => state.viewedScenes.add(s.id));
    saveProgress();
    updateProgressUI();
    updateProgressModal();
    updateNodeStyles();
}

// Expose functions globally
window.hideProgressModal = hideProgressModal;
window.toggleActViewed = toggleActViewed;
window.toggleSceneViewed = toggleSceneViewed;
window.showSceneFromModal = showSceneFromModal;
window.resetAllProgress = resetAllProgress;
window.markAllViewed = markAllViewed;

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
                (d.data.symbols && d.data.symbols.some(s => s.toLowerCase().includes(query))) ||
                (d.data.types && d.data.types.some(t => t.toLowerCase().includes(query)));

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
            // Clear all selections: search, filters, locked nodes, everything
            clearAllSelections();
        }
    });

    // Click outside to clear selections
    document.addEventListener('click', function(e) {
        // Check if click is on an interactive element
        const clickedInteractive = e.target.closest(
            '.node, .legend-item, .legend-marker-item, .legend-connection-item, ' +
            '.info-card, #search-input, .book-club-question, ' +
            '[data-interactive]'
        );

        // If not clicking on interactive elements, clear all selections
        if (!clickedInteractive) {
            clearAllSelections();
        }
    });
}

// ============================================
// BOOK CLUB QUESTIONS
// ============================================

let activeBookClubQuestion = null;

function highlightBookClubScenes(element, event) {
    // Prevent any default behavior that might interfere on touch devices
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }

    const scenesAttr = element.dataset.scenes;
    if (!scenesAttr) return;

    const sceneIds = scenesAttr.split(',').map(id => parseInt(id.trim()));

    // Toggle active state on questions
    const allQuestions = document.querySelectorAll('.book-club-question');
    const isAlreadyActive = element.classList.contains('active');

    // Remove active from all questions
    allQuestions.forEach(q => q.classList.remove('active'));

    if (isAlreadyActive) {
        // If clicking the same question, clear highlights
        clearBookClubHighlights();
        activeBookClubQuestion = null;
        return;
    }

    // Set new active question
    element.classList.add('active');
    activeBookClubQuestion = element;

    // Highlight the relevant nodes
    if (!nodeGroup) return;

    nodeGroup.selectAll('.node')
        .classed('book-club-highlight', d => sceneIds.includes(d.data.id))
        .classed('book-club-dimmed', d => !sceneIds.includes(d.data.id));

    // Scroll to the visualization
    const vizContainer = document.getElementById('visualization-container');
    if (vizContainer) {
        vizContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function clearBookClubHighlights() {
    if (!nodeGroup) return;

    nodeGroup.selectAll('.node')
        .classed('book-club-highlight', false)
        .classed('book-club-dimmed', false);

    // Remove active state from all questions
    const allQuestions = document.querySelectorAll('.book-club-question');
    allQuestions.forEach(q => q.classList.remove('active'));

    activeBookClubQuestion = null;
}

// Add click handler to document to clear highlights when clicking outside questions
document.addEventListener('click', function(e) {
    // Check if click is outside the book club section
    const bookClubSection = document.getElementById('book-club-section');
    if (bookClubSection && !bookClubSection.contains(e.target) && activeBookClubQuestion) {
        clearBookClubHighlights();
    }
});

// Expose function globally for onclick handlers
window.highlightBookClubScenes = highlightBookClubScenes;
window.clearBookClubHighlights = clearBookClubHighlights;

// Toggle answer visibility
function toggleAnswer(event, button) {
    event.stopPropagation(); // Prevent triggering the question highlight

    const answerContent = button.nextElementSibling;
    const isVisible = answerContent.classList.contains('visible');

    if (isVisible) {
        answerContent.classList.remove('visible');
        button.classList.remove('active');
        button.textContent = 'Show Answer';
    } else {
        answerContent.classList.add('visible');
        button.classList.add('active');
        button.textContent = 'Hide Answer';
    }
}

window.toggleAnswer = toggleAnswer;

// Sort book club questions by chronological or thematic order
window.sortQuestions = function(sortType) {
    const grid = document.querySelector('.book-club-grid');
    if (!grid) return;

    // Update button states
    document.querySelectorAll('.sort-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sort === sortType);
    });

    // Get all question elements
    const questions = Array.from(grid.querySelectorAll('.book-club-question'));

    if (sortType === 'chronological') {
        // Sort by first scene number
        questions.sort((a, b) => {
            const aScenes = a.dataset.scenes.split(',').map(s => parseInt(s.trim()));
            const bScenes = b.dataset.scenes.split(',').map(s => parseInt(s.trim()));
            return Math.min(...aScenes) - Math.min(...bScenes);
        });
    } else {
        // Thematic: restore original DOM order by data-question-number
        questions.sort((a, b) => {
            const aNum = parseInt(a.querySelector('.question-number').textContent);
            const bNum = parseInt(b.querySelector('.question-number').textContent);
            return aNum - bNum;
        });
    }

    // Re-append in sorted order
    questions.forEach(q => grid.appendChild(q));
};

// ============================================
// DATA LOADING
// ============================================

async function loadSceneData() {
    try {
        const response = await fetch(CONFIG.DATA_FILE);
        const data = await response.json();

        // Load scenes from JSON
        if (data.scenes && Array.isArray(data.scenes)) {
            // Transform JSON scenes to match expected format
            SCENES = data.scenes.map(scene => ({
                id: scene.id,
                act: scene.act,
                chapter: scene.chapter || '',
                title: scene.title || scene.text?.substring(0, 50),
                types: scene.tags || [],
                tags: scene.tags || [],
                location: scene.location?.primary || '',
                time: scene.time?.narrative || scene.time?.approximate || '',
                summary: scene.plotSummary?.detailed || scene.text || '',
                symbols: scene.tags?.filter(t => ['light', 'mermaid', 'gull', 'tentacles', 'logbook'].includes(t)) || [],
                quotes: scene.keyDialogue || [],
                characters: {
                    young: scene.characterDevelopment?.Young?.state || '',
                    old: scene.characterDevelopment?.Old?.state || ''
                },
                imagery: scene.plotSummary?.brief || '',
                themes: scene.tags || [],
                tension: scene.tensionLevel || 5,
                psychologicalState: scene.psychologicalState || 'stable',
                mythologyRef: scene.significance || '',
                callbacks: scene.callbacks || [],
                foreshadowing: scene.foreshadowing || [],
                isHallucination: scene.psychologicalState === 'hallucination' || scene.tags?.includes('vision'),
                isViolence: scene.tags?.includes('violence')
            }));

            console.log(`✓ Loaded ${SCENES.length} scenes from ${data.metadata?.title || 'The Lighthouse'}`);
            console.log(`✓ Chapters: ${Object.keys(CHAPTERS).length}`);

            // Log connection stats
            const totalCallbacks = SCENES.reduce((sum, s) => sum + (s.callbacks?.length || 0), 0);
            const totalForeshadowing = SCENES.reduce((sum, s) => sum + (s.foreshadowing?.length || 0), 0);
            console.log(`✓ Connections: ${totalCallbacks} callbacks, ${totalForeshadowing} foreshadowing`);
        } else {
            throw new Error('Invalid scene data format');
        }

        return true;
    } catch (error) {
        console.error('Error loading scene data:', error);
        alert('Failed to load scene data. Please refresh the page.');
        return false;
    }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    // Load scene data first
    const loaded = await loadSceneData();
    if (!loaded) return;

    // Initialize visualization
    loadProgress();
    initLegend();
    initVisualization();
    initSearch();
});

