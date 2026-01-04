# Quick Start Guide: Advanced Shakespeare Visualizations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- D3.js v7 library

### File Structure
```
analysis_of_shakespeares_work/
├── shakespeare_data.js                    # Data repository
├── shakespeare_visualizations.js          # D3 visualization code
├── analysis_of_shakespeares_work.html     # Main page with visualizations
└── Documentation files (.md)
```

## 📊 Visualizations Included

### 1. Letter Frequency Bubble Chart
**Container:** `#letterBubbleChart`
**Type:** Circle packing
**Interaction:** Hover for details
**Data:** 26 letters

### 2. Zipf's Law Chart
**Container:** `#zipfChart`
**Type:** Log-log line chart
**Interaction:** Hover on points
**Data:** Top 30 words

### 3. Genre Donut Chart
**Container:** `#genreDonutChart`
**Type:** Pie/Donut chart
**Interaction:** Hover to enlarge
**Data:** 4 genres

### 4. Timeline Chart
**Container:** `#timelineChart`
**Type:** Area chart
**Interaction:** Hover for play names
**Data:** 23 years

### 5. Character Network
**Container:** `#characterChart`
**Type:** Force-directed graph
**Interaction:** Drag, zoom, pan
**Data:** 10 characters

### 6. Vocabulary Chart
**Container:** `#vocabularyChart`
**Type:** Bar chart
**Interaction:** Hover for TTR
**Data:** 8 plays

## 🎨 Customization

### Change Colors
Edit `shakespeare_data.js`:
```javascript
const letterData = [
    { letter: 'E', count: 424718, percentage: 10.94, color: '#YOUR_COLOR' },
    // ...
];
```

### Adjust Size
Edit `shakespeare_visualizations.js`:
```javascript
const width = container.node().getBoundingClientRect().width;
const height = 500; // Change this value
```

### Modify Data
All data is in `shakespeare_data.js`. Edit arrays to update visualizations.

## 🔧 Troubleshooting

### Visualizations Not Showing
1. Check console for errors (F12)
2. Verify D3.js v7 is loaded
3. Ensure containers exist in HTML
4. Check script loading order

### Tooltips Not Working
1. Verify tooltip div is created
2. Check CSS z-index values
3. Ensure hover events are bound

### Performance Issues
1. Reduce data points
2. Disable animations
3. Simplify force simulation
4. Use requestAnimationFrame

## 📱 Mobile Optimization

### Responsive Design
- Visualizations auto-resize to container width
- Touch events enabled on network graph
- Simplified interactions on small screens

### Best Practices
- Test on actual devices
- Use larger touch targets (44px minimum)
- Simplify complex visualizations on mobile

## 🎓 Learning Resources

### D3.js Documentation
- Official Docs: https://d3js.org/
- Examples: https://observablehq.com/@d3
- Tutorials: https://www.d3indepth.com/

### Force Simulations
- https://github.com/d3/d3-force
- https://bl.ocks.org/mbostock

### Scales and Axes
- https://github.com/d3/d3-scale
- https://github.com/d3/d3-axis

## 💡 Tips & Tricks

### Performance
- Use `transform` instead of changing x/y attributes
- Batch DOM updates
- Use CSS transitions when possible
- Limit number of nodes in force simulation

### Accessibility
- Add ARIA labels
- Provide keyboard navigation
- Include alternative text
- Ensure color contrast

### Data Accuracy
- Verify data sources
- Test edge cases
- Handle missing data
- Validate inputs

## 🐛 Common Issues

### Issue: D3 is not defined
**Solution:** Load D3.js before custom scripts
```html
<script src="../../d3/d3.v7.min.js"></script>
<script src="shakespeare_data.js"></script>
<script src="shakespeare_visualizations.js"></script>
```

### Issue: Container not found
**Solution:** Ensure HTML has matching IDs
```html
<div id="letterBubbleChart"></div>
```

### Issue: Visualization cut off
**Solution:** Set explicit SVG dimensions
```javascript
const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height]);
```

## 🎯 Quick Reference

### Initialize All
```javascript
const viz = new ShakespeareVisualizations();
viz.initializeAll();
```

### Initialize Specific
```javascript
const viz = new ShakespeareVisualizations();
viz.createLetterBubbleChart('myContainerId');
```

### Update Data
```javascript
// Edit shakespeare_data.js
// Refresh page to see changes
```

### Customize Margins
```javascript
this.margin = { top: 40, right: 40, bottom: 60, left: 60 };
```

## 📈 Data Format

### Letter Data
```javascript
{ letter: 'E', count: 424718, percentage: 10.94, color: '#667eea' }
```

### Word Data
```javascript
{ word: 'the', count: 27457, rank: 1 }
```

### Character Data
```javascript
{ name: 'Hamlet', appearances: 358, lines: 1569 }
```

## 🌟 Best Practices

1. **Always test** in multiple browsers
2. **Profile performance** for large datasets
3. **Handle errors** gracefully
4. **Document** your customizations
5. **Backup** before major changes
6. **Version control** your code
7. **Test accessibility** with screen readers
8. **Optimize** for mobile devices

## 📞 Support

### File Issues
- Check documentation files (.md)
- Review commit messages
- Test in isolation
- Simplify to minimal example

### Need Help?
- Review D3.js documentation
- Check browser console for errors
- Validate data structure
- Test step-by-step

## ✨ Advanced Usage

### Custom Animations
```javascript
node.transition()
    .duration(1000)
    .attr('r', 20)
    .style('fill', 'red');
```

### Event Handling
```javascript
node.on('click', (event, d) => {
    console.log('Clicked:', d);
});
```

### Data Binding
```javascript
const circles = svg.selectAll('circle')
    .data(data)
    .join('circle');
```

## 🎨 Color Schemes

### Current Palette
- Primary: #667eea (Purple)
- Secondary: #764ba2 (Violet)
- Accent: #f093fb (Pink)
- Highlight: #f5576c (Red)

### Alternative Schemes
- D3 Category10
- D3 Viridis
- Custom gradients
- Colorblind-friendly palettes

## 🚀 Performance Tips

1. Limit DOM nodes (<500)
2. Use CSS for simple animations
3. Debounce resize events
4. Optimize force simulation
5. Use canvas for large datasets
6. Implement virtual scrolling
7. Lazy load off-screen elements
8. Profile with DevTools

## 📦 Dependencies

- D3.js v7 (required)
- Modern browser with ES6+
- SVG support
- JavaScript enabled
- CSS3 support

## 🎓 Learning Path

1. Start with basic bar chart
2. Add interactivity
3. Implement tooltips
4. Create force simulation
5. Add animations
6. Optimize performance
7. Test accessibility
8. Deploy to production

---

**Happy Visualizing! 📊✨**

For more details, see:
- ADVANCED_VISUALIZATIONS_SUMMARY.md
- ENHANCEMENT_SUMMARY.md
- COMMIT_MESSAGE_ADVANCED_VIZ.md

