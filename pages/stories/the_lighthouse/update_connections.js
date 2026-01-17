#!/usr/bin/env node
/**
 * Create accurate scene connections for The Lighthouse (114 scenes)
 * Based on thorough analysis of the screenplay's narrative threads
 *
 * Connection Types:
 * - Foreshadowing: Scene A hints at what happens in Scene B (A < B)
 * - Callbacks: Scene B references Scene A (A < B, stored in B)
 * - Thematic: Scenes share common themes
 */

const fs = require('fs');

// Load the scene data
const inputFile = 'RobertEggers_2019_TheLighthouse_scenes_analyzed.json';
const data = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

console.log(`Loaded ${data.scenes.length} scenes`);

// ============================================
// FORESHADOWING CONNECTIONS
// Scene A foreshadows what happens in Scene B (A points to B)
// ============================================

const foreshadowingMap = {
    // Opening - the journey sets up isolation
    1: [6, 52, 94],  // Fog/isolation foreshadows cabin fever

    // The Lighthouse appearance - obsession with light
    3: [14, 30, 40, 78, 108, 112],  // First sight of lighthouse foreshadows light obsession

    // First meeting/power dynamics
    5: [12, 31, 36, 76, 106],  // Meeting Old foreshadows power struggle

    // Living quarters - confinement
    6: [52, 56, 60, 94],  // Quarters foreshadow claustrophobia/cabin fever

    // The first meal/ritual
    8: [12, 31, 56, 109],  // First dinner foreshadows ritual toasts

    // Mermaid carving discovery
    10: [32, 33, 67, 68, 86, 103],  // Mermaid foreshadows sexual obsession/visions

    // First toast
    12: [56, 71, 94, 109],  // Toast ritual foreshadows drinking/final toast

    // Old's light obsession introduced
    14: [30, 40, 78, 108, 112, 113],  // Light obsession foreshadows climax

    // Young's past hinted (log drive)
    15: [37, 75, 76, 86],  // Past hints foreshadow identity revelation
    16: [37, 75, 76, 86],

    // Supply shed discovery
    23: [46, 83, 107],  // Tools/supplies foreshadow violence

    // One-eyed gull introduction
    27: [32, 46, 87, 114],  // Gull foreshadows killing/Prometheus ending

    // The forbidden light
    30: [40, 78, 108, 112, 113],  // Forbidden room foreshadows finale

    // Old's warnings about gulls/previous keeper
    31: [46, 87, 114],  // Warnings foreshadow consequences

    // Mermaid obsession deepens
    32: [67, 68, 86, 103],  // Fantasy foreshadows hallucinations
    33: [67, 68, 86, 103],

    // Storm begins
    35: [52, 56, 60, 94],  // Storm foreshadows extended isolation

    // Winslow name first mentioned
    37: [75, 76, 86],  // Name foreshadows identity revelation

    // Old with tentacles vision
    40: [67, 68, 86, 103, 113],  // Vision foreshadows more hallucinations

    // Killing the gull
    46: [87, 104, 114],  // Murder foreshadows curse/Prometheus

    // Drinking escalates
    56: [71, 72, 73, 94, 95],  // Drinking foreshadows madness

    // The knife
    73: [78, 81, 82, 83, 90, 104],  // Knife threat foreshadows violence

    // Identity confession
    75: [86, 90, 104, 106],  // Confession foreshadows breakdown
    76: [86, 90, 104, 106],

    // Violence with knife
    78: [104, 106, 109],  // Violence foreshadows murder

    // The keys
    83: [107, 108, 112],  // Getting keys foreshadows finale

    // Doppelganger vision
    86: [103, 104, 106],  // Vision foreshadows violence

    // Dead gull returns
    87: [104, 114],  // Gull curse foreshadows ending

    // Lobster pot/mermaid transformation
    103: [104, 106],  // Sexual horror foreshadows murder

    // Burying Old
    104: [106, 107, 108],  // First murder attempt foreshadows axe

    // Prometheus speech
    107: [113, 114],  // Mythology foreshadows liver ending

    // Reaching the light
    112: [113, 114],  // Climbing foreshadows fall/death
    113: [114]  // Light revelation foreshadows Prometheus
};

// ============================================
// CALLBACK CONNECTIONS
// Scene B references Scene A (stored as array in B)
// ============================================

const callbackMap = {
    // Later scenes referencing earlier ones
    12: [8],  // Toast references first meal
    14: [3],  // Light obsession references first lighthouse view

    31: [27],  // Old's warnings reference gull
    32: [10, 27],  // Fantasy references mermaid carving, gull
    33: [10],  // Fantasy references mermaid

    37: [15, 16],  // Name reference callbacks to past hints
    40: [14, 30],  // Vision callbacks to light obsession

    46: [27, 31],  // Killing gull callbacks to warnings

    52: [6, 35],  // Cabin fever callbacks to confinement, storm
    56: [12, 8],  // Drinking callbacks to toast ritual

    67: [10, 32, 33, 40],  // Mermaid vision callbacks to earlier
    68: [10, 32, 33, 40],

    71: [56, 12],  // Drinking callbacks
    73: [23],  // Knife callbacks to supplies

    75: [15, 16, 37],  // Confession callbacks to hints
    76: [15, 16, 37, 27],  // Confession callbacks

    78: [73, 30],  // Violence callbacks

    83: [30, 73],  // Keys/desk callbacks

    86: [10, 15, 16, 32, 33, 40, 75, 76],  // Doppelganger callbacks to identity/mermaid
    87: [27, 31, 46],  // Dead gull callbacks

    90: [73, 78],  // Violence callbacks

    94: [52, 56],  // Cabin fever callbacks

    103: [10, 32, 33, 67, 68],  // Lobster head callbacks to mermaid
    104: [46, 87, 73, 78],  // Violence callbacks

    106: [75, 76, 104],  // Axe murder callbacks
    107: [31, 27, 46],  // Prometheus speech callbacks to gull mythology

    108: [14, 30, 83],  // Light climb callbacks
    109: [12, 8],  // Final toast callbacks to first

    112: [14, 30, 40, 108],  // Reaching light callbacks
    113: [3, 14, 30, 40, 107],  // Light revelation callbacks
    114: [27, 31, 46, 87, 107]  // Prometheus ending callbacks
};

// ============================================
// THEMATIC LINKS
// Pairs of scenes connected by theme
// ============================================

const thematicLinks = [
    // Light/Obsession theme
    { source: 3, target: 14, theme: 'Light Obsession' },
    { source: 14, target: 30, theme: 'Light Obsession' },
    { source: 30, target: 40, theme: 'Light Obsession' },
    { source: 40, target: 78, theme: 'Light Obsession' },
    { source: 78, target: 108, theme: 'Light Obsession' },
    { source: 108, target: 112, theme: 'Light Obsession' },
    { source: 112, target: 113, theme: 'Light Obsession' },

    // Mermaid/Sexual obsession theme
    { source: 10, target: 32, theme: 'Mermaid Obsession' },
    { source: 32, target: 33, theme: 'Mermaid Obsession' },
    { source: 33, target: 67, theme: 'Mermaid Obsession' },
    { source: 67, target: 68, theme: 'Mermaid Obsession' },
    { source: 68, target: 86, theme: 'Mermaid Obsession' },
    { source: 86, target: 103, theme: 'Mermaid Obsession' },

    // Gull/Curse theme
    { source: 27, target: 31, theme: 'Gull Curse' },
    { source: 31, target: 46, theme: 'Gull Curse' },
    { source: 46, target: 87, theme: 'Gull Curse' },
    { source: 87, target: 114, theme: 'Gull Curse' },

    // Identity/Madness theme
    { source: 15, target: 37, theme: 'Identity Crisis' },
    { source: 37, target: 75, theme: 'Identity Crisis' },
    { source: 75, target: 76, theme: 'Identity Crisis' },
    { source: 76, target: 86, theme: 'Identity Crisis' },
    { source: 86, target: 90, theme: 'Identity Crisis' },

    // Power dynamics theme
    { source: 5, target: 12, theme: 'Power Struggle' },
    { source: 12, target: 31, theme: 'Power Struggle' },
    { source: 31, target: 36, theme: 'Power Struggle' },
    { source: 36, target: 76, theme: 'Power Struggle' },
    { source: 76, target: 106, theme: 'Power Struggle' },
    { source: 106, target: 107, theme: 'Power Struggle' },

    // Isolation/Cabin fever theme
    { source: 1, target: 6, theme: 'Isolation' },
    { source: 6, target: 35, theme: 'Isolation' },
    { source: 35, target: 52, theme: 'Isolation' },
    { source: 52, target: 56, theme: 'Isolation' },
    { source: 56, target: 60, theme: 'Isolation' },
    { source: 60, target: 94, theme: 'Isolation' },

    // Alcohol/Madness theme
    { source: 12, target: 56, theme: 'Alcohol & Madness' },
    { source: 56, target: 71, theme: 'Alcohol & Madness' },
    { source: 71, target: 72, theme: 'Alcohol & Madness' },
    { source: 72, target: 94, theme: 'Alcohol & Madness' },
    { source: 94, target: 95, theme: 'Alcohol & Madness' },

    // Violence theme
    { source: 46, target: 73, theme: 'Violence' },
    { source: 73, target: 78, theme: 'Violence' },
    { source: 78, target: 90, theme: 'Violence' },
    { source: 90, target: 104, theme: 'Violence' },
    { source: 104, target: 106, theme: 'Violence' },

    // Prometheus/Mythology theme
    { source: 27, target: 31, theme: 'Prometheus Myth' },
    { source: 31, target: 107, theme: 'Prometheus Myth' },
    { source: 107, target: 113, theme: 'Prometheus Myth' },
    { source: 113, target: 114, theme: 'Prometheus Myth' },

    // Toast ritual theme
    { source: 8, target: 12, theme: 'Ritual & Toast' },
    { source: 12, target: 31, theme: 'Ritual & Toast' },
    { source: 31, target: 56, theme: 'Ritual & Toast' },
    { source: 56, target: 109, theme: 'Ritual & Toast' },

    // Guilt/Secret theme
    { source: 15, target: 16, theme: 'Guilt & Secrets' },
    { source: 16, target: 75, theme: 'Guilt & Secrets' },
    { source: 75, target: 76, theme: 'Guilt & Secrets' },
    { source: 76, target: 104, theme: 'Guilt & Secrets' }
];

// ============================================
// UPDATE THE JSON
// ============================================

// Clear existing connections and add new ones
data.scenes.forEach(scene => {
    // Clear old connections
    scene.foreshadowing = [];
    scene.callbacks = [];

    // Add foreshadowing (this scene points to future scenes)
    if (foreshadowingMap[scene.id]) {
        scene.foreshadowing = foreshadowingMap[scene.id];
    }

    // Add callbacks (this scene references past scenes)
    if (callbackMap[scene.id]) {
        scene.callbacks = callbackMap[scene.id];
    }
});

// Update metadata with thematic links
data.thematicLinks = thematicLinks;

// Count connections
let totalForeshadowing = 0;
let totalCallbacks = 0;
data.scenes.forEach(s => {
    totalForeshadowing += s.foreshadowing.length;
    totalCallbacks += s.callbacks.length;
});

console.log(`\nConnection Summary:`);
console.log(`- Foreshadowing links: ${totalForeshadowing}`);
console.log(`- Callback links: ${totalCallbacks}`);
console.log(`- Thematic pairs: ${thematicLinks.length}`);

// Write updated JSON
fs.writeFileSync(inputFile, JSON.stringify(data, null, 2), 'utf-8');
console.log(`\nUpdated ${inputFile}`);

// Also update the THEMATIC_LINKS in the timeline.js file
console.log('\n=== THEMATIC_LINKS for timeline.js ===');
console.log('const THEMATIC_LINKS = [');
thematicLinks.forEach((link, i) => {
    const comma = i < thematicLinks.length - 1 ? ',' : '';
    console.log(`    { source: ${link.source}, target: ${link.target}, theme: '${link.theme}' }${comma}`);
});
console.log('];');

