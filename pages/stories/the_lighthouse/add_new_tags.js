const fs = require('fs');
const data = JSON.parse(fs.readFileSync('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'utf-8'));

// New tags to add based on text analysis
const newTagKeywords = {
    'night': ['night', 'evening', 'darkness', 'dark'],
    'day': ['day', 'morning', 'afternoon', 'sunset', 'sunrise'],
    'fog': ['fog', 'mist', 'haze'],
    'sleep': ['sleep', 'bed', 'dream', 'wake', 'asleep'],
    'death': ['death', 'dead', 'die', 'dying', 'kill', 'murder'],
    'fear': ['fear', 'afraid', 'terror', 'terrified', 'scared'],
    'secret': ['secret', 'hidden', 'hide', 'hiding'],
    'naked': ['naked', 'nude', 'undress'],
    'isolation': ['alone', 'lonely', 'isolation', 'isolated', 'solitude'],
    'food': ['eat', 'food', 'meal', 'dinner', 'supper', 'hungry', 'hunger'],
    'identity': ['name', 'winslow', 'howard', 'thomas', 'ephraim', 'identity', 'who are you'],
    'mythology': ['neptune', 'prometheus', 'proteus', 'triton', 'poseidon', 'god', 'curse'],
    'sexual': ['pleasure', 'ecstasy', 'moaning', 'intimate'],
    'weather': ['rain', 'wind', 'wave', 'thunder', 'lightning']
};

// Process each scene
data.scenes.forEach(scene => {
    const text = (scene.text || '').toLowerCase();
    const title = (scene.title || '').toLowerCase();
    const combined = text + ' ' + title;

    // Ensure tags array exists
    if (!scene.tags) {
        scene.tags = [];
    }

    // Add new tags based on keywords
    for (const [tag, keywords] of Object.entries(newTagKeywords)) {
        const hasKeyword = keywords.some(kw => combined.includes(kw));
        if (hasKeyword && !scene.tags.includes(tag)) {
            scene.tags.push(tag);
        }
    }

    // Special handling for scene 26 (the orphan)
    if (scene.id === 26) {
        // Check what's in scene 26
        console.log('Scene 26 text:', scene.text?.substring(0, 200));
        console.log('Scene 26 title:', scene.title);

        // Add relevant tags based on content
        if (!scene.tags.includes('young')) scene.tags.push('young');
        if (!scene.tags.includes('vision')) scene.tags.push('vision');
        if (!scene.tags.includes('hallucination')) scene.tags.push('hallucination');
    }

    // Ensure 'young' or 'old' is tagged if mentioned
    if (combined.includes('young') && !scene.tags.includes('young')) {
        scene.tags.push('young');
    }
    if (combined.includes('old') && !scene.tags.includes('old')) {
        scene.tags.push('old');
    }
});

// Write updated data
fs.writeFileSync('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', JSON.stringify(data, null, 2), 'utf-8');

// Report new tag counts
const newTagCounts = {};
data.scenes.forEach(scene => {
    if (scene.tags) {
        scene.tags.forEach(tag => {
            newTagCounts[tag] = (newTagCounts[tag] || 0) + 1;
        });
    }
});

console.log('\n=== Updated Tag Counts ===');
Object.entries(newTagCounts)
    .sort((a,b) => b[1] - a[1])
    .forEach(([tag, count]) => {
        console.log(`${tag}: ${count}`);
    });

// Check for orphans
const orphans = data.scenes.filter(s => !s.tags || s.tags.length === 0);
console.log('\n=== Remaining Orphan Scenes ===');
console.log('Count:', orphans.length);
if (orphans.length > 0) {
    orphans.forEach(s => console.log(`  Scene ${s.id}: ${s.title}`));
}

