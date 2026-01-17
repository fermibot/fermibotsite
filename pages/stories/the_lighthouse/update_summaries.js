// Node.js script to update summaries to clean prose format
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'RobertEggers_2019_TheLighthouse_scenes_analyzed.json');

function parseScreenplayText(text) {
    const lines = text.split('\n');
    const actionDescriptions = [];
    const dialogueExchanges = [];
    let currentSpeaker = null;
    let currentDialogue = [];

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Skip page numbers like "77."
        if (/^\d+\.$/.test(line)) continue;

        // Check if it's a character name (all caps, short)
        if (/^[A-Z][A-Z\s']+(\s*\(.*\))?$/.test(line) && line.length < 30) {
            if (currentSpeaker && currentDialogue.length > 0) {
                dialogueExchanges.push([currentSpeaker, currentDialogue.join(' ')]);
            }
            currentSpeaker = line.split('(')[0].trim();
            currentDialogue = [];
        } else if (currentSpeaker) {
            // Skip stage directions in parentheses
            if (/^\(.*\)$/.test(line)) continue;
            if (line === '--') {
                currentDialogue.push('[pause]');
            } else {
                currentDialogue.push(line);
            }
        } else {
            actionDescriptions.push(line);
        }
    }

    if (currentSpeaker && currentDialogue.length > 0) {
        dialogueExchanges.push([currentSpeaker, currentDialogue.join(' ')]);
    }

    return { actionDescriptions, dialogueExchanges };
}

function generateCleanSummary(scene) {
    const text = scene.text || '';
    if (!text) return 'No description available.';

    const { actionDescriptions, dialogueExchanges } = parseScreenplayText(text);
    const summaryParts = [];

    // Action/Visual description
    if (actionDescriptions.length > 0) {
        let actionText = actionDescriptions.join(' ');
        // Remove page numbers and screenplay directions
        actionText = actionText.replace(/\b\d+\.\s*/g, '');
        actionText = actionText.replace(/\s+/g, ' ').trim();
        actionText = actionText.replace(/\b(CLOSE ON|WIDE|EXTREMELY WIDE SHOT|CUT TO|FADE|HOLD):\s*/g, '');
        actionText = actionText.replace(/\bHold\.\s*/g, '');
        if (actionText) {
            summaryParts.push(actionText);
        }
    }

    // Dialogue
    if (dialogueExchanges.length > 0) {
        const dialogueNarrative = [];
        for (const [speaker, dialogue] of dialogueExchanges) {
            let cleanDialogue = dialogue.replace(/\b\d+\.\s*/g, '').replace(/\s+/g, ' ').trim();
            if (cleanDialogue && cleanDialogue !== '[pause]') {
                if (cleanDialogue.length > 200) {
                    cleanDialogue = cleanDialogue.substring(0, 197) + '...';
                }
                dialogueNarrative.push(`${speaker}: "${cleanDialogue}"`);
            } else if (cleanDialogue === '[pause]') {
                dialogueNarrative.push(`${speaker} remains silent.`);
            }
        }
        if (dialogueNarrative.length > 0) {
            summaryParts.push(dialogueNarrative.join(' '));
        }
    }

    let fullSummary = summaryParts.join(' ').replace(/\s+/g, ' ').trim();

    // Fallback if too short
    if (fullSummary.length < 50 && text) {
        let cleanText = text.replace(/\b\d+\.\s*/g, '').replace(/\s+/g, ' ').trim();
        if (cleanText.length > 600) {
            cleanText = cleanText.substring(0, 597) + '...';
        }
        fullSummary = cleanText;
    }

    return fullSummary;
}

// Main
console.log('Loading JSON...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

console.log(`Processing ${data.scenes.length} scenes...`);
for (const scene of data.scenes) {
    const summary = generateCleanSummary(scene);
    if (!scene.plotSummary) scene.plotSummary = {};
    scene.plotSummary.detailed = summary;
    scene.summary = summary;
}

console.log('Writing updated JSON...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

console.log('Done! Sample summaries:');
for (const i of [1, 23, 98]) {
    if (i <= data.scenes.length) {
        const summary = data.scenes[i - 1].summary;
        console.log(`\n--- Scene ${i} ---`);
        console.log(summary.length > 300 ? summary.substring(0, 300) + '...' : summary);
    }
}

