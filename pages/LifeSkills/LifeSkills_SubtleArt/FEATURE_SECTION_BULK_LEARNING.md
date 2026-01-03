# Feature: Bulk Section Learning

## New Feature
When you mark a **section node** (like 💭 Core Philosophy or 🔑 Key Principles) as learned, all concepts within that section are automatically marked as learned as well.

## How It Works

### Marking a Section as Learned
1. Click on any section node (the large colored circles with emoji icons)
2. Click "Mark Entire Section as Learned"
3. **Result**: The section node AND all concepts in that section are marked with the green dotted border

### Unmarking a Section
1. Click on a learned section node (one with green dotted border)
2. Click "Section Learned (Unmark All)"
3. **Result**: The section node AND all concepts in that section lose the green dotted border

### Smart Auto-Marking
The system also works in reverse:
- When you manually mark the **last remaining concept** in a section as learned
- The **section node automatically gets marked** as learned too
- When you unmark **any concept** in a learned section
- The **section node automatically gets unmarked**

## Visual Feedback

### In Detail Panel
When you select a section node, the detail panel shows:
- **Summary**: Includes the section description + count of concepts
  - Example: "This section contains 5 concepts. 3 of 5 learned."
- **Button label changes**:
  - Not learned: "○ Mark Entire Section as Learned"
  - Learned: "✓ Section Learned (Unmark All)"

### In Progress Display
- The section progress indicators at the bottom update to show "X/Y" learned per section
- The overall progress bar reflects all learned concepts (including those marked via section)

## Implementation Details

### Updated Functions

#### 1. `toggleLearned()` - Lines ~548-605
Now handles three scenarios:

**A. Section Node Selected + Currently Learned → Unmark All**
```javascript
if (STATE.selectedNode.isSection && isCurrentlyLearned) {
    STATE.learnedConcepts.delete(STATE.selectedNode.id);
    conceptsInSection.forEach(concept => {
        STATE.learnedConcepts.delete(concept.id);
    });
}
```

**B. Section Node Selected + Not Learned → Mark All**
```javascript
if (STATE.selectedNode.isSection && !isCurrentlyLearned) {
    STATE.learnedConcepts.add(STATE.selectedNode.id);
    conceptsInSection.forEach(concept => {
        STATE.learnedConcepts.add(concept.id);
    });
}
```

**C. Regular Concept Node → Smart Section Update**
```javascript
// Toggle the concept
if (isCurrentlyLearned) {
    STATE.learnedConcepts.delete(STATE.selectedNode.id);
} else {
    STATE.learnedConcepts.add(STATE.selectedNode.id);
}

// Check if all concepts in section are now learned
const allConceptsLearned = conceptsInSection.every(concept => 
    STATE.learnedConcepts.has(concept.id)
);

// Auto-mark or unmark the section node
if (allConceptsLearned) {
    STATE.learnedConcepts.add(sectionNode.id);
} else {
    STATE.learnedConcepts.delete(sectionNode.id);
}
```

#### 2. `showDetailPanel()` - Lines ~386-435
Enhanced to show section-specific information:
- Counts concepts in section
- Shows "X of Y learned" for sections
- Changes button label for sections
- Provides clearer action description

## Use Cases

### Fast Progress Tracking
✅ "I've already read about Core Philosophy" → Click the 💭 section, mark as learned
- Result: All 3 concepts in Core Philosophy instantly marked

### Batch Review
✅ "I want to review all Key Principles" → Click 🔑 Key Principles section
- See: "5 concepts. 2 of 5 learned"
- Decision: Review the 3 remaining ones

### Clean Slate
✅ "I want to reset one topic" → Click the learned section, unmark it
- Result: All concepts in that section cleared

### Natural Completion
✅ "I just learned the last concept in a section"
- System automatically marks the section as complete
- Visual confirmation that you've mastered that topic area

## Benefits

1. **Efficiency**: Mark 5+ concepts with one click
2. **Organization**: Track progress at section level
3. **Motivation**: See sections turn green as you complete them
4. **Flexibility**: Still works with individual concept marking
5. **Smart**: Auto-completes sections when all concepts are learned
6. **Intuitive**: Visual feedback shows exactly what will happen

## Technical Notes

### Data Structure
- Section nodes are identified by `node.isSection === true`
- Concepts belong to sections via `node.section` property (e.g., '01', '02')
- All tracking stored in `STATE.learnedConcepts` Set
- Persisted to localStorage on every change

### Edge Cases Handled
- ✅ Marking section when some concepts already learned (adds remaining)
- ✅ Unmarking section (removes all, even if individually marked)
- ✅ Manually learning last concept (auto-marks section)
- ✅ Unmarking any concept in learned section (auto-unmarks section)
- ✅ Progress display updates correctly for both methods
- ✅ Green dotted borders persist through all interactions

## Example Flow

1. **Start**: No concepts learned, all circles white
2. **Click 💭 Core Philosophy section** → Opens detail panel
3. **See**: "This section contains 3 concepts. 0 of 3 learned."
4. **Click**: "○ Mark Entire Section as Learned"
5. **Result**: 
   - 💭 Core Philosophy gets green dotted border
   - All 3 concepts (Don't Try, Happiness is a Problem, You Are Not Special) get green borders
   - Progress bar shows: "3/36 (8%)"
   - Section progress shows: "3/3" for Core Philosophy
6. **Click any concept** in Core Philosophy → Shows "✓ Learned" already

## Files Modified
- `LifeSkills_SubtleArt.js`
  - `toggleLearned()` - Enhanced with section bulk operations
  - `showDetailPanel()` - Added section-specific UI/text

## Testing Checklist
- [x] Mark a section as learned → all concepts marked
- [x] Unmark a learned section → all concepts unmarked
- [x] Mark last concept manually → section auto-marks
- [x] Unmark any concept in learned section → section auto-unmarks
- [x] Section count displays correctly in detail panel
- [x] Button labels change appropriately for sections
- [x] Progress bar reflects bulk changes
- [x] Section progress indicators update correctly
- [x] Changes persist after page reload
- [x] Green dotted borders appear/disappear correctly
- [x] Mixed state (some learned, some not) handled correctly

## Date
January 3, 2026

## Related Features
- Green dotted highlight persistence (see BUG_FIX_LEARNED_HIGHLIGHTS.md)
- Progress tracking system
- localStorage persistence

