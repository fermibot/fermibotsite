#!/usr/bin/env node
/**
 * Create accurate scene connections for The Lighthouse
 * Based on thorough analysis of the screenplay
 */

const fs = require('fs');

// Load the scene data
const data = JSON.parse(fs.readFileSync('RobertEggers_2019_TheLighthouse_scenes_analyzed.json', 'utf-8'));

console.log('Total scenes:', data.scenes.length);

// First, let's understand the scene structure by printing titles
console.log('\n=== Scene Overview ===');
data.scenes.forEach(s => {
    const tags = s.tags ? s.tags.join(', ') : 'none';
    console.log(`${s.id}: ${s.title} [${tags}]`);
});

// Key motifs to track for connections:
// 1. The Mermaid - scenes with mermaid tag
// 2. The Gull - scenes with gull tag
// 3. The Light - scenes with light tag
// 4. Violence - scenes with violence tag
// 5. Identity - scenes with identity tag
// 6. Madness/Hallucination - scenes with madness, hallucination, vision tags
// 7. Alcohol - scenes with alcohol tag
// 8. The Logbook - scenes with logbook tag

// Find scenes by tag
function findScenesByTag(tag) {
    return data.scenes.filter(s => s.tags && s.tags.includes(tag)).map(s => s.id);
}

console.log('\n=== Scenes by Key Motifs ===');
console.log('Mermaid:', findScenesByTag('mermaid'));
console.log('Gull:', findScenesByTag('gull'));
console.log('Light:', findScenesByTag('light'));
console.log('Violence:', findScenesByTag('violence'));
console.log('Identity:', findScenesByTag('identity'));
console.log('Madness:', findScenesByTag('madness'));
console.log('Hallucination:', findScenesByTag('hallucination'));
console.log('Vision:', findScenesByTag('vision'));
console.log('Alcohol:', findScenesByTag('alcohol'));
console.log('Logbook:', findScenesByTag('logbook'));
console.log('Mythology:', findScenesByTag('mythology'));
console.log('Death:', findScenesByTag('death'));
console.log('Secret:', findScenesByTag('secret'));
console.log('Guilt:', findScenesByTag('guilt'));

