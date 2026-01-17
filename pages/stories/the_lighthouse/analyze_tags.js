const fs = require('fs');
const data = JSON.parse(fs.readFileSync('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'utf-8'));

// Get all unique tags
const allTags = new Set();
const tagCounts = {};
const orphanScenes = [];

data.scenes.forEach(scene => {
    if (scene.tags && scene.tags.length > 0) {
        scene.tags.forEach(tag => {
            allTags.add(tag);
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    } else {
        orphanScenes.push(scene.id);
    }
});

console.log('=== Current Tags and Counts ===');
Object.entries(tagCounts).sort((a,b) => b[1] - a[1]).forEach(([tag, count]) => {
    console.log(`${tag}: ${count}`);
});

console.log('\n=== Orphan Scenes (no tags) ===');
console.log('Count:', orphanScenes.length);
if (orphanScenes.length > 0) {
    console.log('Scene IDs:', orphanScenes.join(', '));
}

console.log('\n=== Total Scenes:', data.scenes.length);

// Analyze text content for potential new tags
console.log('\n=== Analyzing text for potential new tags ===');

const potentialTags = {
    'death': 0,
    'secret': 0,
    'power': 0,
    'isolation': 0,
    'fog': 0,
    'night': 0,
    'day': 0,
    'sleep': 0,
    'dream': 0,
    'work': 0,
    'fear': 0,
    'anger': 0,
    'desire': 0,
    'memory': 0,
    'time': 0,
    'hunger': 0,
    'cold': 0,
    'wet': 0,
    'naked': 0,
    'scream': 0,
    'cry': 0,
    'laugh': 0,
    'dance': 0,
    'drink': 0,
    'confession': 0,
    'prayer': 0,
    'curse': 0
};

data.scenes.forEach(scene => {
    const text = (scene.text || '').toLowerCase();
    const title = (scene.title || '').toLowerCase();
    const combined = text + ' ' + title;

    for (const keyword of Object.keys(potentialTags)) {
        if (combined.includes(keyword)) {
            potentialTags[keyword]++;
        }
    }
});

console.log('Potential new tags from text analysis:');
Object.entries(potentialTags)
    .filter(([_, count]) => count > 0)
    .sort((a,b) => b[1] - a[1])
    .forEach(([tag, count]) => {
        console.log(`  ${tag}: ${count} scenes`);
    });

