// Node.js script to extract and populate keyDialogue from text field
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'RobertEggers_2019_TheLighthouse_scenes_analyzed.json');

function cleanDialogue(quote) {
    // Remove stage directions that got mixed in with dialogue
    let cleaned = quote
        // Remove sentences with character names doing actions
        .replace(/\s*(YOUNG|OLD)\s+(SMILES?|LAUGHS?|LOOKS?|STOPS?|WALKS?|STANDS?|SITS?|PAUSES?|MAKES?|DOES|POINTS?|THROWS?|RUMMAGES?|ABSORBS?|stepping)[^.!?]*[.!?]/gi, '')
        .replace(/\s*For once,\s*(YOUNG|OLD)[^.!?]*[.!?]/gi, '')
        .replace(/\s*(YOUNG|OLD)\s+is\s+[^.!?]*[.!?]/gi, '')
        .replace(/\s*(He|She)\s+(points?|throws?|smiles?|looks?|walks?|rummages?)[^.!?]*[.!?]/gi, '')
        // Remove common stage directions
        .replace(/\s*Pause\.\s*/gi, '')
        .replace(/\s*They smile at each other like old friends\.\s*/gi, '')
        .replace(/\s*In horror\.\s*/gi, '')
        .replace(/\s*Crazed\.\s*/gi, '')
        .replace(/\s*Manic\.\s*/gi, '')
        .replace(/\s*Young smiles in triumph and does a celebratory jig!\s*/gi, '')
        .replace(/\s*He throws it to OLD'S feet!\s*/gi, '')
        .replace(/\s*OLD, stepping on it, breaks it in two and throws it in the stove\.\s*/gi, '')
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim();
    return cleaned;
}

function extractDialogue(text) {
    if (!text) return [];

    const lines = text.split('\n');
    const dialogueExchanges = [];
    let currentSpeaker = null;
    let currentDialogue = [];

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Skip page numbers like "77."
        if (/^\d+\.$/.test(line)) continue;

        // Check if it's a character name (all caps, short)
        // Match patterns like: YOUNG, OLD, YOUNG (CONT'D), OLD (V.O.), etc.
        if (/^[A-Z][A-Z\s']+(\s*\(.*\))?$/.test(line) && line.length < 30) {
            // Save previous dialogue if any
            if (currentSpeaker && currentDialogue.length > 0) {
                let quote = currentDialogue.join(' ')
                    .replace(/\s+/g, ' ')
                    .replace(/\b\d+\.\s*/g, '')  // Remove page numbers
                    .trim();
                quote = cleanDialogue(quote);
                if (quote && quote !== '--' && quote.length > 0) {
                    dialogueExchanges.push({
                        speaker: currentSpeaker,
                        quote: quote
                    });
                }
            }
            // Start new speaker - remove (CONT'D) etc from name
            currentSpeaker = line.split('(')[0].trim();
            currentDialogue = [];
        } else if (currentSpeaker) {
            // Skip standalone stage directions in parentheses like "(suddenly)"
            if (/^\(.*\)$/.test(line)) continue;

            // It's dialogue content
            if (line !== '--') {
                currentDialogue.push(line);
            }
        }
    }

    // Capture last dialogue
    if (currentSpeaker && currentDialogue.length > 0) {
        let quote = currentDialogue.join(' ')
            .replace(/\s+/g, ' ')
            .replace(/\b\d+\.\s*/g, '')
            .trim();
        quote = cleanDialogue(quote);
        if (quote && quote !== '--' && quote.length > 0) {
            dialogueExchanges.push({
                speaker: currentSpeaker,
                quote: quote
            });
        }
    }

    return dialogueExchanges;
}

// Main
console.log('Loading JSON...');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

let totalDialogueCount = 0;
let scenesWithDialogue = 0;

console.log(`Processing ${data.scenes.length} scenes...`);
for (const scene of data.scenes) {
    const dialogue = extractDialogue(scene.text);
    scene.keyDialogue = dialogue;

    if (dialogue.length > 0) {
        scenesWithDialogue++;
        totalDialogueCount += dialogue.length;
    }
}

console.log('Writing updated JSON...');
fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

console.log(`Done!`);
console.log(`- Scenes with dialogue: ${scenesWithDialogue}`);
console.log(`- Total dialogue exchanges: ${totalDialogueCount}`);

// Show sample
console.log('\n--- Sample from Scene 98 ---');
const scene98 = data.scenes.find(s => s.id === 98);
if (scene98 && scene98.keyDialogue) {
    console.log(`Found ${scene98.keyDialogue.length} dialogue exchanges`);
    scene98.keyDialogue.slice(0, 5).forEach((d, i) => {
        console.log(`${i+1}. ${d.speaker}: "${d.quote.substring(0, 80)}${d.quote.length > 80 ? '...' : ''}"`);
    });
}

