/* ============================================
   THE SUBTLE ART - ENHANCED VISUALIZATION
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Chapter colors - One color per chapter (9 chapters)
    CHAPTER_COLORS: {
        '01': '#E53935',  // Red - Don't Try
        '02': '#FB8C00',  // Orange - Happiness Is a Problem
        '03': '#FFD600',  // Yellow - You Are Not Special
        '04': '#43A047',  // Green - The Value of Suffering
        '05': '#00ACC1',  // Cyan - You Are Always Choosing
        '06': '#1E88E5',  // Blue - You're Wrong About Everything
        '07': '#5E35B1',  // Purple - Failure Is the Way Forward
        '08': '#D81B60',  // Pink - The Importance of Saying No
        '09': '#6D4C41'   // Brown - ...And Then You Die
    },

    // Chapter icons
    CHAPTER_ICONS: {
        '01': '🚫',  // Don't Try
        '02': '😊',  // Happiness Is a Problem
        '03': '👤',  // You Are Not Special
        '04': '💪',  // The Value of Suffering
        '05': '🎯',  // You Are Always Choosing
        '06': '🤔',  // You're Wrong About Everything
        '07': '⚡',  // Failure Is the Way Forward
        '08': '🛑',  // The Importance of Saying No
        '09': '💀'   // ...And Then You Die
    },

    // Chapter full names
    CHAPTER_NAMES: {
        '01': "Don't Try",
        '02': 'Happiness Is a Problem',
        '03': 'You Are Not Special',
        '04': 'The Value of Suffering',
        '05': 'You Are Always Choosing',
        '06': "You're Wrong About Everything",
        '07': 'Failure Is the Way Forward',
        '08': 'The Importance of Saying No',
        '09': '...And Then You Die'
    },

    // Layout dimensions
    DIAMETER: 1000,
    STORAGE_KEY: 'subtle-art-learned-concepts'
};

// ============================================
// STATE MANAGEMENT
// ============================================

const STATE = {
    data: null,
    nodes: [],
    links: [],
    selectedNode: null,
    learnedConcepts: new Set(),
    activeFilters: new Set(),
    searchTerm: ''
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getShortName(name, maxLength = 40) {
    // Remove prefixes for different node types
    let shortName = name
        .replace(/^main\.chapter\.\d+\.topic\.\d+\s+/, '')      // Topic: main.chapter.01.topic.01 The Name
        .replace(/^main\.chapter\.\d+\s+/, '');                    // Chapter: main.chapter.01 The Name

    if (shortName.length > maxLength) {
        const truncated = shortName.substring(0, maxLength - 3);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > maxLength * 0.7) {
            return truncated.substring(0, lastSpace) + '...';
        }
        return truncated + '...';
    }
    return shortName;
}

function getChapterNumber(name) {
    // Extract chapter number from chapter or topic node
    const chapterMatch = name.match(/main\.chapter\.(\d+)/);
    return chapterMatch ? chapterMatch[1] : null;
}

function isChapterNode(name) {
    return name.match(/^main\.chapter\.\d+\s+/) && !name.includes('.topic.');
}

function isTopicNode(name) {
    return name.includes('.topic.');
}

function saveProgress() {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify([...STATE.learnedConcepts]));
}

function loadProgress() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        STATE.learnedConcepts = new Set(JSON.parse(saved));
    }
}

function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
        STATE.learnedConcepts.clear();
        saveProgress();
        updateVisualization();
        updateProgressDisplay();
    }
}

// ============================================
// DATA LOADING & PROCESSING
// ============================================

async function loadData() {
    try {
        const response = await fetch('LifeSkills_SubtleArt.json');
        STATE.data = await response.json();

        // Filter out section nodes - we only want chapters and topics
        STATE.data = STATE.data.filter(d => !d.name.startsWith('main.section_name.'));

        // Build nodes and links
        STATE.nodes = STATE.data.map(d => {
            // Get chapter number
            const chapter = getChapterNumber(d.name);

            return {
                id: d.name,
                name: d.name,
                displayName: getShortName(d.name),
                chapter: chapter,
                summary: d.summary || 'No description available',
                isChapter: isChapterNode(d.name),
                isTopic: isTopicNode(d.name)
            };
        });

        STATE.links = [];
        STATE.data.forEach(d => {
            d.imports.forEach(imp => {
                // Only add links if the import is not a section node
                if (!imp.startsWith('main.section_name.')) {
                    STATE.links.push({
                        source: imp,
                        target: d.name
                    });
                }
            });
        });

        loadProgress();
        initializeVisualization();
        setupControls();
        updateProgressDisplay();
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please check the console.');
    }
}

// ============================================
// VISUALIZATION
// ============================================

function initializeVisualization() {
    const width = CONFIG.DIAMETER;
    const height = CONFIG.DIAMETER;

    // Create SVG
    const svg = d3.select('#visualization')
        .attr('viewBox', [0, 0, width, height])
        .attr('preserveAspectRatio', 'xMidYMid meet');

    // Initialize nodes with positions within bounds
    STATE.nodes.forEach(d => {
        d.x = Math.random() * (width * 0.8) + width * 0.1;
        d.y = Math.random() * (height * 0.8) + height * 0.1;
    });

    // Create force simulation with boundary constraints
    const simulation = d3.forceSimulation(STATE.nodes)
        .force('link', d3.forceLink(STATE.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => d.isSection ? 60 : 30))
        .force('x', d3.forceX(width / 2).strength(0.05))
        .force('y', d3.forceY(height / 2).strength(0.05));

    // Create links
    const link = svg.append('g')
        .selectAll('line')
        .data(STATE.links)
        .join('line')
        .attr('class', 'link')
        .attr('stroke', d => {
            const targetNode = STATE.nodes.find(n => n.id === d.target.id || n.id === d.target);
            return targetNode ? CONFIG.CHAPTER_COLORS[targetNode.chapter] : '#999';
        });

    // Create nodes
    const node = svg.append('g')
        .selectAll('g')
        .data(STATE.nodes)
        .join('g')
        .attr('class', d => `node ${d.isChapter ? 'chapter-node' : ''}`)
        .call(drag(simulation));

    // Add circles
    node.append('circle')
        .attr('r', d => d.isChapter ? 30 : 15)
        .attr('fill', d => CONFIG.CHAPTER_COLORS[d.chapter] || '#999')
        .attr('stroke', d => CONFIG.CHAPTER_COLORS[d.chapter] || '#999');

    // Add text
    node.append('text')
        .text(d => d.isChapter ? CONFIG.CHAPTER_ICONS[d.chapter] : '')
        .attr('dy', d => d.isChapter ? 5 : 0)
        .attr('font-size', d => d.isChapter ? '20px' : '12px');

    node.append('text')
        .text(d => d.displayName)
        .attr('dy', d => d.isChapter ? 40 : 25)
        .attr('class', 'node-label');

    // Add interactivity
    node.on('click', (event, d) => {
        event.stopPropagation();
        selectNode(d, event);
    })
        .on('mouseover', (event, d) => {
            if (!STATE.selectedNode) {
                highlightNode(d);
            }
            showTooltip(event, d);
        })
        .on('mouseout', () => {
            if (!STATE.selectedNode) {
                clearHighlight();
            }
            hideTooltip();
        });

    // Click on background to deselect
    svg.on('click', () => {
        deselectNode();
    });

    // Update positions on tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Store references
    STATE.svg = svg;
    STATE.simulation = simulation;
    STATE.nodeElements = node;
    STATE.linkElements = link;

    // Apply learned class to nodes that were previously marked as learned
    updateVisualization();
}

function drag(simulation) {
    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
}

// ============================================
// INTERACTION
// ============================================

function selectNode(node, event) {
    STATE.selectedNode = node;
    highlightNode(node);
    showInfoCard(node, event);
    STATE.nodeElements.classed('selected', d => d === node);
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
}

function deselectNode() {
    STATE.selectedNode = null;
    clearHighlight();
    hideInfoCard();
    STATE.nodeElements.classed('selected', false);
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
}

function highlightNode(node) {
    const connectedNodes = new Set([node.id]);
    const connectedLinks = new Set();

    STATE.links.forEach(link => {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
        const targetId = typeof link.target === 'object' ? link.target.id : link.target;

        if (sourceId === node.id || targetId === node.id) {
            connectedNodes.add(sourceId);
            connectedNodes.add(targetId);
            connectedLinks.add(link);
        }
    });

    STATE.nodeElements.classed('dimmed', d => !connectedNodes.has(d.id));
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
    STATE.linkElements
        .classed('highlighted', l => connectedLinks.has(l))
        .classed('dimmed', l => !connectedLinks.has(l));
}

function clearHighlight() {
    STATE.nodeElements.classed('dimmed', false);
    // Preserve learned class
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
    STATE.linkElements.classed('highlighted', false).classed('dimmed', false);
}

// ============================================
// TOOLTIPS
// ============================================

let tooltip = null;

function createTooltip() {
    tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip');
    return tooltip;
}

function showTooltip(event, node) {
    if (!tooltip) createTooltip();

    const summary = node.summary || 'No summary available.';
    const truncatedSummary = summary.length > 150 ? summary.substring(0, 150) + '...' : summary;

    tooltip.html(`
        <div class="tooltip-title">${node.displayName}</div>
        <div class="tooltip-summary">${truncatedSummary}</div>
    `);

    // Position tooltip near mouse cursor
    const x = event.clientX;
    const y = event.clientY;

    // Get tooltip dimensions
    const tooltipNode = tooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 300;
    const tooltipHeight = tooltipNode.offsetHeight || 150;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate position (prevent going off-screen)
    let left = x + 15;
    let top = y + 15;

    // Adjust if tooltip would go off right edge
    if (left + tooltipWidth > viewportWidth) {
        left = x - tooltipWidth - 15;
    }

    // Adjust if tooltip would go off bottom edge
    if (top + tooltipHeight > viewportHeight) {
        top = y - tooltipHeight - 15;
    }

    tooltip
        .style('left', Math.max(10, left) + 'px')
        .style('top', Math.max(10, top) + 'px');

    tooltip.classed('visible', true);
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classed('visible', false);
    }
}


// ============================================
// CONTROLS
// ============================================

function setupControls() {
    // Search
    const searchInput = document.getElementById('search-input');
    const searchCounter = document.getElementById('search-counter');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            STATE.searchTerm = e.target.value.toLowerCase();
            filterVisualization();
            updateSearchCounter();
        });
    }

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            if (searchInput) searchInput.focus();
        } else if (e.key === 'Escape') {
            if (searchInput) searchInput.value = '';
            STATE.searchTerm = '';
            filterVisualization();
            updateSearchCounter();
            deselectNode();
        }
    });

    // Legend
    createLegend();
}

function createLegend() {
    const container = document.getElementById('legend-container');

    const legendHtml = `
        <div class="legend-header">
            <h5 class="legend-title">Book Chapters</h5>
            <div class="progress-inline" title="Click to view detailed progress">
                <div class="progress-bar-wrapper" id="progressBarSegments">
                    <!-- Progress segments will be added by JS -->
                </div>
                <span class="progress-text" id="progressInlineText">0/0</span>
            </div>
        </div>
        <div class="legend-items">
            ${Object.entries(CONFIG.CHAPTER_NAMES).map(([num, name]) => `
                <div class="legend-item chapter-${num}" data-chapter="${num}" tabindex="0" title="${name}">
                    <span class="legend-color" style="background-color: ${CONFIG.CHAPTER_COLORS[num]}"></span>
                    <span class="legend-icon">${CONFIG.CHAPTER_ICONS[num]}</span>
                    <span class="legend-label">${name}</span>
                    <span class="legend-count" id="count-${num}">0</span>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = legendHtml;

    container.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            toggleFilter(item.dataset.chapter);
            item.classList.toggle('active');
        });
    });

    updateLegendProgress();
}

function toggleFilter(chapterNum) {
    if (STATE.activeFilters.has(chapterNum)) {
        STATE.activeFilters.delete(chapterNum);
    } else {
        STATE.activeFilters.add(chapterNum);
    }
    filterVisualization();
}

function filterVisualization() {
    STATE.nodeElements.classed('dimmed', d => {
        // Search filter
        if (STATE.searchTerm && !d.name.toLowerCase().includes(STATE.searchTerm) &&
            !d.displayName.toLowerCase().includes(STATE.searchTerm) &&
            !d.summary.toLowerCase().includes(STATE.searchTerm)) {
            return true;
        }

        // Chapter filter
        if (STATE.activeFilters.size > 0 && !STATE.activeFilters.has(d.chapter)) {
            return true;
        }

        return false;
    });
    // Preserve learned class after filtering
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
}

function updateSearchCounter() {
    const counter = document.getElementById('search-counter');
    if (!counter) return;

    if (STATE.searchTerm) {
        const matches = STATE.nodes.filter(n =>
            n.name.toLowerCase().includes(STATE.searchTerm) ||
            n.displayName.toLowerCase().includes(STATE.searchTerm) ||
            n.summary.toLowerCase().includes(STATE.searchTerm)
        );
        counter.textContent = `${matches.length} ${matches.length === 1 ? 'match' : 'matches'}`;
        counter.classList.add('visible');
        counter.classList.toggle('has-results', matches.length > 0);
    } else {
        counter.textContent = '';
        counter.classList.remove('visible', 'has-results');
    }
}

// ============================================
// INFO CARD (POPUP WHEN CLICKING NODES)
// ============================================

let infoCard = null;
let infoCardBackdrop = null;

function createInfoCard() {
    if (!infoCardBackdrop) {
        infoCardBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', hideInfoCard);
    }

    infoCard = d3.select('body')
        .append('div')
        .attr('class', 'info-card')
        .attr('id', 'info-card');

    return infoCard;
}

function showInfoCard(node, event) {
    if (!infoCard) createInfoCard();

    const isLearned = STATE.learnedConcepts.has(node.id);
    const chapterNum = node.chapter;

    // For chapter nodes, count topics
    let summaryText = node.summary || 'No summary available.';
    let buttonText = isLearned ? '✓ Learned' : 'Mark as Learned';

    if (node.isChapter) {
        const topicsInChapter = STATE.nodes.filter(n =>
            n.isTopic && STATE.links.some(link =>
                (typeof link.source === 'object' ? link.source.id : link.source) === node.id &&
                (typeof link.target === 'object' ? link.target.id : link.target) === n.id
            )
        );
        const learnedTopics = topicsInChapter.filter(t => STATE.learnedConcepts.has(t.id)).length;

        summaryText += ` This chapter contains ${topicsInChapter.length} topics. ${learnedTopics} of ${topicsInChapter.length} learned.`;
        buttonText = isLearned ? '✓ Chapter Learned (Unmark All)' : 'Mark Entire Chapter as Learned';
    }

    infoCard
        .attr('data-chapter', chapterNum)
        .html(`
            <div class="info-card-header">
                <span class="info-card-icon">${CONFIG.CHAPTER_ICONS[chapterNum] || '💡'}</span>
                <div class="info-card-titles">
                    <h5 class="info-card-chapter">${node.displayName}</h5>
                    <p class="info-card-section">${CONFIG.CHAPTER_NAMES[chapterNum] || 'Chapter'}</p>
                </div>
            </div>
            <div class="info-card-body">
                <p class="info-card-summary">${summaryText}</p>
            </div>
            <div class="info-card-footer">
                <span class="info-card-connections">&nbsp;</span>
                <button class="btn btn-sm btn-outline-secondary mark-learned-btn ${isLearned ? 'learned' : ''}"
                        onclick="toggleLearnedFromCard('${node.id.replace(/'/g, "\\'")}')">
                    ${buttonText}
                </button>
            </div>
        `);

    positionInfoCard(event);

    if (infoCardBackdrop) {
        infoCardBackdrop.classed('visible', true);
    }
    infoCard.classed('visible', true);
}

function hideInfoCard() {
    if (infoCard) {
        infoCard.classed('visible', false);
    }
    if (infoCardBackdrop) {
        infoCardBackdrop.classed('visible', false);
    }
}

function positionInfoCard(event) {
    if (!infoCard || !event) return;

    const cardWidth = 320;
    const cardHeight = 300;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Position near the click, but ensure it's visible
    let left = event.clientX - cardWidth / 2;
    let top = event.clientY - cardHeight / 2;

    // Keep within viewport bounds
    left = Math.max(10, Math.min(left, viewportWidth - cardWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - cardHeight - 10));

    infoCard
        .style('left', left + 'px')
        .style('top', top + 'px');
}

function toggleLearnedFromCard(nodeId) {
    const node = STATE.nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Set as selected node temporarily
    STATE.selectedNode = node;
    toggleLearned();

    // Update the info card button
    const btn = document.querySelector('.mark-learned-btn');
    if (btn) {
        const isLearned = STATE.learnedConcepts.has(nodeId);
        btn.classList.toggle('learned', isLearned);
        btn.textContent = isLearned ? '✓ Learned' : 'Mark as Learned';
    }
}

// Make function global for onclick
window.toggleLearnedFromCard = toggleLearnedFromCard;

function toggleLearned() {
    if (!STATE.selectedNode) return;

    const isCurrentlyLearned = STATE.learnedConcepts.has(STATE.selectedNode.id);

    // Check if this is a chapter node
    if (STATE.selectedNode.isChapter) {
        // Find all topics in this chapter
        const topicsInChapter = STATE.nodes.filter(node =>
            node.isTopic && STATE.links.some(link =>
                (typeof link.source === 'object' ? link.source.id : link.source) === STATE.selectedNode.id &&
                (typeof link.target === 'object' ? link.target.id : link.target) === node.id
            )
        );

        if (isCurrentlyLearned) {
            // Unmark the chapter and all its topics
            STATE.learnedConcepts.delete(STATE.selectedNode.id);
            topicsInChapter.forEach(topic => {
                STATE.learnedConcepts.delete(topic.id);
            });
        } else {
            // Mark the chapter and all its topics as learned
            STATE.learnedConcepts.add(STATE.selectedNode.id);
            topicsInChapter.forEach(topic => {
                STATE.learnedConcepts.add(topic.id);
            });
        }
    }
    else {
        // Topic node - just toggle it
        if (isCurrentlyLearned) {
            STATE.learnedConcepts.delete(STATE.selectedNode.id);
        } else {
            STATE.learnedConcepts.add(STATE.selectedNode.id);
        }

        // Check if all topics in the chapter are now learned
        // If so, also mark the chapter node as learned
        const parentChapter = STATE.nodes.find(node =>
            node.isChapter && STATE.links.some(link =>
                (typeof link.source === 'object' ? link.source.id : link.source) === node.id &&
                (typeof link.target === 'object' ? link.target.id : link.target) === STATE.selectedNode.id
            )
        );

        if (parentChapter) {
            const topicsInChapter = STATE.nodes.filter(node =>
                node.isTopic && STATE.links.some(link =>
                    (typeof link.source === 'object' ? link.source.id : link.source) === parentChapter.id &&
                    (typeof link.target === 'object' ? link.target.id : link.target) === node.id
                )
            );
            const allTopicsLearned = topicsInChapter.every(topic =>
                STATE.learnedConcepts.has(topic.id)
            );

            if (allTopicsLearned) {
                STATE.learnedConcepts.add(parentChapter.id);
            } else if (!isCurrentlyLearned) {
                // If we're unmarking a topic, also unmark the chapter
                STATE.learnedConcepts.delete(parentChapter.id);
            }
        }
    }

    saveProgress();
    updateVisualization();
    updateProgressDisplay();
}

function updateVisualization() {
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));

    // Update radial view if initialized
    if (viewsInitialized.radial) updateRadialLearned();
}

// ============================================
// PROGRESS TRACKING
// ============================================

function updateProgressDisplay() {
    updateLegendProgress();
}

function updateLegendProgress() {
    const progressBarWrapper = document.getElementById('progressBarSegments');
    const progressInlineText = document.getElementById('progressInlineText');

    if (!progressBarWrapper || !progressInlineText) return;

    // Calculate learned counts per chapter
    const learnedByChapter = {};
    let totalNodes = 0;
    let totalLearned = 0;

    Object.keys(CONFIG.CHAPTER_NAMES).forEach(num => {
        const chapterNodes = STATE.nodes.filter(n => n.chapter === num);
        const learned = chapterNodes.filter(n => STATE.learnedConcepts.has(n.id)).length;

        learnedByChapter[num] = learned;
        totalNodes += chapterNodes.length;
        totalLearned += learned;

        // Update legend count badges (total topics in chapter)
        const countElement = document.getElementById(`count-${num}`);
        if (countElement) {
            // Show only topic count, not chapter itself
            const topicsInChapter = chapterNodes.filter(n => n.isTopic).length;
            countElement.textContent = topicsInChapter;
        }
    });

    // Update inline text
    progressInlineText.textContent = `${totalLearned}/${totalNodes}`;

    // Create colored progress segments - ONLY for learned nodes
    progressBarWrapper.innerHTML = '';
    Object.keys(CONFIG.CHAPTER_NAMES).forEach(num => {
        const learnedCount = learnedByChapter[num];
        if (learnedCount > 0) {
            const widthPercent = (learnedCount / totalNodes) * 100;
            const segment = document.createElement('div');
            segment.className = 'progress-segment';
            segment.style.width = `${widthPercent}%`;
            segment.style.backgroundColor = CONFIG.CHAPTER_COLORS[num];
            segment.title = `${CONFIG.CHAPTER_NAMES[num]}: ${learnedCount} learned`;
            progressBarWrapper.appendChild(segment);
        }
    });
}

// ============================================
// VIEW SWITCHING
// ============================================

let currentView = 'network';
let viewsInitialized = {
    network: false,
    radial: false
};

function setupViewSwitching() {
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    switchView('network');
                    break;
                case '2':
                    e.preventDefault();
                    switchView('radial');
                    break;
            }
        }
    });
}

function switchView(viewName) {
    if (currentView === viewName) return;

    // Update UI
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
        btn.setAttribute('aria-pressed', btn.dataset.view === viewName);
    });

    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.toggle('active', content.id === `${viewName}View`);
    });

    currentView = viewName;

    // Initialize view if not already done
    if (!viewsInitialized[viewName]) {
        if (viewName === 'radial') {
            initializeRadialVisualization();
        }
        viewsInitialized[viewName] = true;
    }
}

// Radial visualization - module-level variables
let radialSvg = null;
let radialLink = null;
let radialNode = null;
let radialRoot = null;
let radialLockedNode = null;

// ============================================
// RADIAL CLUSTER VISUALIZATION (Exact match to HowToTalkToAnyone)
// ============================================

function packageHierarchySubtleArt(nodes) {
    const map = {};

    function find(name, data) {
        let node = map[name];
        if (!node) {
            node = map[name] = data || { name: name, children: [] };
            if (name.length) {
                const i = name.lastIndexOf(".");
                node.parent = find(name.substring(0, i));
                node.parent.children.push(node);
                node.key = name.substring(i + 1);
            }
        }
        return node;
    }

    nodes.forEach(function(d) {
        find(d.name, d);
    });

    return d3.hierarchy(map[""]);
}

function packageImportsSubtleArt(nodes) {
    const map = {};
    const imports = [];

    nodes.forEach(function(d) {
        map[d.data.name] = d;
    });

    nodes.forEach(function(d) {
        if (d.data.imports) {
            d.data.imports.forEach(function(i) {
                if (map[i]) {
                    imports.push(map[d.data.name].path(map[i]));
                }
            });
        }
    });

    return imports;
}

function getChapterNum(d) {
    if (!d || !d.data) return null;
    const name = d.data.name;
    const match = name.match(/main\.chapter\.(\d+)/);
    return match ? match[1] : null;
}

function isRadialChapterNode(d) {
    return d.data.name && d.data.name.includes('main.chapter.') && !d.data.name.includes('.topic.');
}

function formatRadialNodeText(d) {
    // Format the display text for radial nodes
    // Topics should show as "9.1 Topic Name" instead of "01 Topic Name"
    const name = d.data.name;
    const key = d.data.key;

    // Check if it's a topic (has .topic. in the name)
    if (name && name.includes('.topic.')) {
        // Extract chapter number and topic number
        const chapterMatch = name.match(/main\.chapter\.(\d+)/);
        const topicMatch = key.match(/^(\d+)\s+/);

        if (chapterMatch && topicMatch) {
            const chapterNum = parseInt(chapterMatch[1]);
            const topicNum = parseInt(topicMatch[1]);
            // Remove leading "01 " and replace with "9.1 "
            const topicText = key.substring(topicMatch[0].length);
            return `${chapterNum}.${topicNum} ${topicText}`;
        }
    }

    // For chapter nodes or anything else, return key as-is
    return key;
}

function createRadialGradients(svg) {
    const defs = svg.append('defs');

    Object.entries(CONFIG.CHAPTER_COLORS).forEach(([srcNum, srcColor]) => {
        Object.entries(CONFIG.CHAPTER_COLORS).forEach(([tgtNum, tgtColor]) => {
            const gradient = defs.append('linearGradient')
                .attr('id', `gradient-${srcNum}-${tgtNum}`)
                .attr('gradientUnits', 'userSpaceOnUse');

            gradient.append('stop')
                .attr('offset', '0%')
                .attr('stop-color', srcColor);

            gradient.append('stop')
                .attr('offset', '100%')
                .attr('stop-color', tgtColor);
        });
    });

    return defs;
}

function radialMouseovered(d) {
    if (radialLockedNode) return;

    radialNode.each(function(n) {
        n.target = n.source = false;
    });

    radialLink
        .classed("link--target", function(l) {
            if (l.target === d) return l.source.source = true;
        })
        .classed("link--source", function(l) {
            if (l.source === d) return l.target.target = true;
        })
        .filter(function(l) {
            return l.target === d || l.source === d;
        })
        .raise();

    radialNode
        .classed("node--target", function(n) {
            return n.target;
        })
        .classed("node--source", function(n) {
            return n.source;
        });
}

function radialMouseouted(d) {
    if (radialLockedNode) return;

    radialLink
        .classed("link--target", false)
        .classed("link--source", false);

    radialNode
        .classed("node--target", false)
        .classed("node--source", false);
}

function radialHandleNodeClick(event, d) {
    event.stopPropagation();

    // Toggle lock state
    if (radialLockedNode === d) {
        radialLockedNode = null;
        radialNode.classed('node--locked', false);
        radialMouseouted(d);
        hideInfoCard();
        hideTooltip();
    } else {
        // Remove lock from previously locked node
        radialNode.classed('node--locked', n => n === d);

        // Set new locked node
        radialLockedNode = d;
        radialMouseovered(d);
        hideTooltip();

        // Show info card with node data
        const node = STATE.nodes.find(n => n.id === d.data.name);
        if (node) {
            showInfoCard(node, event);
        }
    }
}

function radialHandleBackgroundClick() {
    if (radialLockedNode) {
        radialLockedNode = null;
        radialNode.classed('node--locked', false);
        hideInfoCard();
        hideTooltip();
    }
}

function animateRadialEntrance() {
    radialNode
        .style('opacity', 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 8)
        .style('opacity', 1);

    radialLink.each(function() {
        const path = d3.select(this);
        const length = this.getTotalLength();

        path
            .attr('stroke-dasharray', `${length} ${length}`)
            .attr('stroke-dashoffset', length)
            .transition()
            .delay(400)
            .duration(1500)
            .attr('stroke-dashoffset', 0)
            .on('end', function() {
                path.attr('stroke-dasharray', null);
            });
    });
}

function initializeRadialVisualization() {
    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = radius - 220;
    const verticalPadding = 100;
    const totalHeight = diameter + verticalPadding * 2;

    d3.select('#radial-visualization-container').html('');

    radialSvg = d3.select('#radial-visualization-container')
        .append('svg')
        .attr('id', 'radial-svg')
        .attr('width', diameter)
        .attr('height', totalHeight)
        .attr('viewBox', `0 0 ${diameter} ${totalHeight}`)
        .on('click', radialHandleBackgroundClick);

    const g = radialSvg.append('g')
        .attr('transform', `translate(${radius}, ${radius + verticalPadding})`);

    createRadialGradients(radialSvg);

    const root = packageHierarchySubtleArt(STATE.data).sum(d => d.size || 1);
    radialRoot = root;

    const cluster = d3.cluster().size([360, innerRadius]);
    cluster(root);

    const links = packageImportsSubtleArt(root.leaves());

    const line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

    const linkGroup = g.append('g').attr('class', 'links');

    radialLink = linkGroup.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .each(function(d) {
            d.source = d[0];
            d.target = d[d.length - 1];
        })
        .attr('class', d => {
            const srcChapter = getChapterNum(d.source);
            const tgtChapter = getChapterNum(d.target);
            return `link gradient-link link-${srcChapter}-${tgtChapter}`;
        })
        .attr('d', line)
        .attr('stroke', d => {
            const srcChapter = getChapterNum(d.source);
            const tgtChapter = getChapterNum(d.target);
            return `url(#gradient-${srcChapter}-${tgtChapter})`;
        });

    const nodeGroup = g.append('g').attr('class', 'nodes');

    radialNode = nodeGroup.selectAll('.node')
        .data(root.leaves())
        .enter()
        .append('text')
        .attr('class', d => {
            const chapterNum = getChapterNum(d);
            const classes = ['node'];
            if (chapterNum) classes.push(`chapter-${chapterNum}`);
            if (isRadialChapterNode(d)) classes.push('node-chapter');
            return classes.join(' ');
        })
        .attr('dy', '0.31em')
        .attr('transform', d => {
            return `rotate(${d.x - 90})translate(${d.y + 8},0)${d.x < 180 ? '' : 'rotate(180)'}`;
        })
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .text(d => {
            const isLearned = STATE.learnedConcepts.has(d.data.name);
            const displayText = formatRadialNodeText(d);
            return isLearned ? `✓ ${displayText}` : displayText;
        })
        .style('fill', d => {
            const chapterNum = getChapterNum(d);
            return chapterNum ? CONFIG.CHAPTER_COLORS[chapterNum] : '#999';
        })
        .on('mouseover', function(event, d) {
            radialMouseovered(d);
            // Show tooltip with radial node data
            if (d.data.name) {
                const chapterNum = getChapterNum(d);
                const tooltipData = {
                    displayName: getShortName(d.data.name),
                    summary: d.data.summary || 'No description available',
                    chapter: chapterNum
                };
                showTooltip(event, tooltipData);
            }
        })
        .on('mouseout', function(event, d) {
            radialMouseouted(d);
            hideTooltip();
        })
        .on('click', radialHandleNodeClick);

    updateRadialLearned();
    animateRadialEntrance();
}

function updateRadialLearned() {
    if (!radialNode) return;

    radialNode.text(d => {
        const isLearned = STATE.learnedConcepts.has(d.data.name);
        const displayText = formatRadialNodeText(d);
        return isLearned ? `✓ ${displayText}` : displayText;
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    setupViewSwitching();
});

