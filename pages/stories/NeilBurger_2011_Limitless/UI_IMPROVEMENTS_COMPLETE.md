# UI Improvements - Complete ✓

## Summary

Implemented 5 major UI improvements to enhance the visual consistency and usability of the Limitless timeline visualization.

## Changes Made

### 1. ✓ Made All Badges Squarish

**Changed**: `border-radius: 12px` → `border-radius: 4px`

**Locations Updated**:
- `.tag-badge` in `limitless_custom.css`
- `.question-tag` override in `limitless_custom.css`
- `.legend-question-item` in `limitless_custom.css`

**Result**: All badges (tooltips, info cards, questions, legend filters) now have consistent squarish appearance with subtle rounding.

---

### 2. ✓ Fixed Legend Filter Badge Colors

**Problem**: Discussion topic filters in legend didn't have the same coloring as tag badges elsewhere

**Solution**:
- Added 15 new CSS selectors: `.legend-question-item.tag-{name}`
- Each matches the color scheme of corresponding `.tag-{name}` badges
- Updated JavaScript to add color classes to legend items

**JavaScript Change** (`limitless_timeline.js` line 504):
```javascript
// Before:
.attr('class', 'legend-item legend-question-item')

// After:
.attr('class', `legend-item legend-question-item tag-${tag.key}`)
```

**CSS Added** (15 color selectors):
```css
.legend-question-item.tag-ethics {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
    border-color: #e74c3c;
}
/* ... 14 more tag colors ... */
```

**Result**: Legend filter items now have exact same background colors, text colors, and border colors as tag badges.

---

### 3. ✓ Increased SVG Canvas Padding

**Problem**: SVG was cutting off nodes on all 4 edges

**Solution**: Added 150px padding on all sides while keeping diameter unchanged

**JavaScript Change** (`limitless_timeline.js` line 898-908):
```javascript
const diameter = CONFIG.DIAMETER;
const radius = diameter / 2;
const padding = 150; // Add padding on all sides to prevent cutoff

svg = container.append('svg')
    .attr('viewBox', `${-radius - padding} ${-radius - verticalOffset - padding} ${diameter + padding * 2} ${diameter + verticalOffset + padding * 2}`)
    .attr('width', '100%')
    .attr('height', diameter + verticalOffset + padding * 2)
    .style('max-width', `${diameter + padding * 2}px`)
```

**Result**:
- Diagram circle size unchanged
- Canvas expanded by 300px total (150px each side)
- No more node cutoff at edges

---

### 4. ✓ Fixed Scene Text Overlapping Nodes

**Problem**: Text labels positioned too close to node circles, causing overlap

**Solution**: Increased horizontal offset from 10px to 14px

**JavaScript Change** (`limitless_timeline.js` line 1043):
```javascript
// Before:
.attr('x', d => d.x < 180 ? 10 : -10)

// After:
.attr('x', d => d.x < 180 ? 14 : -14)
```

**Result**: Text now floats 14px away from nodes instead of 10px, preventing overlap with node circles.

---

### 5. ✓ Gray Out Viewed Scenes Instead of Bold

**Problem**: Marked-as-reviewed scenes were bolded (font-weight: 600), which made them more prominent instead of less

**Solution**: Changed to 40% opacity instead of bold

**JavaScript Changes** (`limitless_timeline.js` line 1066-1075):

**Node Circles**:
```javascript
nodeGroup.selectAll('.node circle')
    .attr('stroke-width', d => state.viewedScenes.has(d.data.id) ? 3 : 2)
    .attr('stroke', d => state.viewedScenes.has(d.data.id) ? '#2ecc71' : getActColor(d.data.act))
    .style('opacity', d => state.viewedScenes.has(d.data.id) ? 0.4 : 1); // Added
```

**Node Labels**:
```javascript
nodeGroup.selectAll('.node .node-label')
    .classed('viewed-label', d => state.viewedScenes.has(d.data.id))
    // Before: .attr('font-weight', d => state.viewedScenes.has(d.data.id) ? 600 : 400)
    .style('opacity', d => state.viewedScenes.has(d.data.id) ? 0.4 : 1); // After
```

**Result**:
- Viewed scenes appear grayed out at 40% opacity
- Both node circle AND text are grayed out
- Green checkmark still visible
- Green stroke still applied
- Clearly distinguishable from unviewed scenes

---

## Files Modified

### `limitless_custom.css`
1. Changed `.tag-badge` border-radius: 12px → 4px
2. Changed `.question-tag` border-radius: 12px → 4px
3. Changed `.legend-question-item` border-radius: 8px → 4px
4. Updated `.legend-question-item` styling (opacity, border)
5. Added 15 new `.legend-question-item.tag-{name}` color selectors

### `limitless_timeline.js`
1. Line 504: Added `tag-${tag.key}` class to legend items
2. Line 902: Added `padding` constant (150px)
3. Line 905-908: Updated SVG viewBox with padding
4. Line 1043: Increased text offset from 10 to 14
5. Line 1069: Added opacity to viewed node circles
6. Line 1075: Replaced font-weight with opacity for viewed labels

---

## Visual Improvements Summary

| Improvement | Before | After |
|-------------|--------|-------|
| **Badge Shape** | Very rounded (12px) | Squarish (4px) |
| **Legend Colors** | No color coding | Matches tag badges exactly |
| **SVG Canvas** | Nodes cut off at edges | 150px padding, no cutoff |
| **Text Spacing** | 10px from nodes (overlap) | 14px from nodes (clear) |
| **Viewed Scenes** | Bold (more prominent) | 40% opacity (grayed out) |

---

## Testing Checklist

- [x] All badges have 4px border-radius (squarish)
- [x] Legend filter items show proper tag colors
- [x] SVG doesn't cut off any nodes
- [x] Scene text doesn't overlap with node circles
- [x] Viewed scenes appear grayed out (both circle and text)
- [x] Checkmark still visible on viewed scenes
- [x] Green stroke still applied to viewed scenes

---

## Date Completed

2026-01-11
