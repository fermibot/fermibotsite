# Bug Fix: Green Dotted Highlights for Learned Concepts

## Problem
The green dotted highlights around learned concepts were disappearing randomly when:
- Hovering over nodes
- Clicking to select/deselect nodes
- Using search functionality
- Filtering by section
- Switching between different views

## Root Cause
The `learned` CSS class was not being preserved when other classes (like `dimmed`, `selected`, `highlighted`) were being toggled. D3.js's `.classed()` method was overwriting the class state instead of preserving it across operations.

## Solution
Added explicit preservation of the `learned` class in all functions that manipulate node classes:

### 1. **selectNode()** - Line ~298
```javascript
function selectNode(node) {
    STATE.selectedNode = node;
    highlightNode(node);
    showDetailPanel(node);
    STATE.nodeElements.classed('selected', d => d === node);
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
}
```

### 2. **deselectNode()** - Line ~306
```javascript
function deselectNode() {
    STATE.selectedNode = null;
    clearHighlight();
    hideDetailPanel();
    STATE.nodeElements.classed('selected', false);
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
}
```

### 3. **highlightNode()** - Line ~314
```javascript
function highlightNode(node) {
    const connectedNodes = new Set([node.id]);
    const connectedLinks = new Set();
    // ... connection logic ...
    
    STATE.nodeElements.classed('dimmed', d => !connectedNodes.has(d.id));
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
    STATE.linkElements
        .classed('highlighted', l => connectedLinks.has(l))
        .classed('dimmed', l => !connectedLinks.has(l));
}
```

### 4. **clearHighlight()** - Line ~336
```javascript
function clearHighlight() {
    STATE.nodeElements.classed('dimmed', false);
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
    STATE.linkElements.classed('highlighted', false).classed('dimmed', false);
}
```

### 5. **filterVisualization()** - Line ~508
```javascript
function filterVisualization() {
    STATE.nodeElements.classed('dimmed', d => {
        // Search and section filter logic...
        return false;
    });
    // Preserve learned class after filtering
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
}
```

### 6. **initializeVisualization()** - Line ~265
```javascript
// After storing references
STATE.svg = svg;
STATE.simulation = simulation;
STATE.nodeElements = node;
STATE.linkElements = link;

// Apply learned class to nodes that were previously marked as learned
updateVisualization();
```

## How It Works Now

1. **Initial Load**: When the page loads, `updateVisualization()` is called after creating all nodes, applying the `learned` class to any previously saved concepts from localStorage.

2. **Interactions**: Every time a node's visual state changes (selection, highlighting, filtering), the `learned` class is explicitly reapplied based on the current state of `STATE.learnedConcepts`.

3. **Toggle Learned**: When a user marks/unmarks a concept as learned, `updateVisualization()` updates all nodes, and then the detail panel is refreshed.

## CSS Impact
The learned class styling remains unchanged:
```css
.node.learned circle {
    stroke: #28a745;
    stroke-width: 3px;
    stroke-dasharray: 5, 5;
}
```

The green dotted border will now:
- ✅ Persist through all interactions
- ✅ Remain visible when hovering over other nodes
- ✅ Stay visible when selecting/deselecting
- ✅ Persist through search and filter operations
- ✅ Be present on page reload (from localStorage)

## Testing Checklist
- [x] Mark a concept as learned - green dotted border appears
- [x] Hover over other nodes - learned border stays
- [x] Click to select another node - learned border stays
- [x] Use search - learned border stays on matching nodes
- [x] Filter by section - learned border stays on visible nodes
- [x] Reload page - learned concepts still show green border
- [x] Toggle learned off - green border disappears correctly
- [x] Toggle learned back on - green border reappears

## Files Modified
- `LifeSkills_SubtleArt.js` - 6 functions updated

## Date
January 3, 2026

