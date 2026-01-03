/* ============================================
   THE SUBTLE ART - ENHANCED VISUALIZATION
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Section colors - Philosophy-themed palette
    SECTION_COLORS: {
        '01': '#E53935',  // Red - Core Philosophy
        '02': '#FB8C00',  // Orange - Choosing Values
        '03': '#FFD600',  // Yellow - Taking Action
        '04': '#43A047',  // Green - Key Principles
        '05': '#00ACC1',  // Cyan - Practical Applications
        '06': '#1E88E5',  // Blue - Mental Models
        '07': '#5E35B1',  // Purple - Life Lessons
        '08': '#D81B60'   // Pink - Daily Practices
    },

    // Section icons
    SECTION_ICONS: {
        '01': '💭',
        '02': '🎯',
        '03': '⚡',
        '04': '🔑',
        '05': '🛠️',
        '06': '🧠',
        '07': '📖',
        '08': '🔄'
    },

    // Section full names
    SECTION_NAMES: {
        '01': 'Core Philosophy',
        '02': 'Choosing Your Values',
        '03': 'Taking Action',
        '04': 'Key Principles',
        '05': 'Practical Applications',
        '06': 'Mental Models',
        '07': 'Life Lessons',
        '08': 'Daily Practices'
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
    // Remove prefixes
    let shortName = name
        .replace(/^main\.(chapter_name|principle|concept|lesson|practice)\.\d+\s+/, '')
        .replace(/^main\.section_name\.\d+\s+/, '');

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

function getSectionNumber(name) {
    const match = name.match(/main\.section_name\.(\d+)/);
    return match ? match[1] : null;
}

function isSectionNode(name) {
    return name.startsWith('main.section_name.');
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

        // Build nodes and links
        STATE.nodes = STATE.data.map(d => {
            // Get section number from the node name or its first import
            let section = getSectionNumber(d.name);
            if (!section && d.imports && d.imports.length > 0) {
                section = getSectionNumber(d.imports[0]);
            }

            return {
                id: d.name,
                name: d.name,
                displayName: getShortName(d.name),
                section: section,
                summary: d.summary || 'No description available',
                isSection: isSectionNode(d.name)
            };
        });

        STATE.links = [];
        STATE.data.forEach(d => {
            d.imports.forEach(imp => {
                STATE.links.push({
                    source: imp,
                    target: d.name
                });
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
            return targetNode ? CONFIG.SECTION_COLORS[targetNode.section] : '#999';
        });

    // Create nodes
    const node = svg.append('g')
        .selectAll('g')
        .data(STATE.nodes)
        .join('g')
        .attr('class', d => `node ${d.isSection ? 'section-node' : ''}`)
        .call(drag(simulation));

    // Add circles
    node.append('circle')
        .attr('r', d => d.isSection ? 40 : 20)
        .attr('fill', d => CONFIG.SECTION_COLORS[d.section] || '#999')
        .attr('stroke', d => CONFIG.SECTION_COLORS[d.section] || '#999');

    // Add text
    node.append('text')
        .text(d => d.isSection ? CONFIG.SECTION_ICONS[d.section] : '')
        .attr('dy', d => d.isSection ? 5 : 0)
        .attr('font-size', d => d.isSection ? '24px' : '12px');

    node.append('text')
        .text(d => d.displayName)
        .attr('dy', d => d.isSection ? 50 : 30)
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

function showTooltip(event, node) {
    if (!tooltip) {
        tooltip = d3.select('body').append('div')
            .attr('class', 'd3-tooltip')
            .style('opacity', 0);
    }

    const sectionName = node.section ? CONFIG.SECTION_NAMES[node.section] : 'Unknown Section';
    const summaryPreview = node.summary.length > 100
        ? node.summary.substring(0, 100) + '...'
        : node.summary;

    tooltip.html(`
        <strong>${node.displayName}</strong><br>
        <small style="color: ${CONFIG.SECTION_COLORS[node.section] || '#999'};">
            ${CONFIG.SECTION_ICONS[node.section] || ''} ${sectionName}
        </small><br>
        <div style="margin-top: 8px; font-size: 12px; line-height: 1.4;">
            ${summaryPreview}
        </div>
    `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
}

function hideTooltip() {
    if (tooltip) {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0);
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
            <h5 class="legend-title">Book Sections</h5>
            <div class="progress-inline">
                <div class="progress-bar-wrapper" id="progressBarSegments">
                    <!-- Progress segments will be added by JS -->
                </div>
                <span class="progress-text" id="progressInlineText">0/0</span>
            </div>
            <button class="btn btn-sm btn-outline-danger" id="resetProgress" style="flex-shrink: 0;">Reset</button>
        </div>
        <div class="legend-items" id="legendItems">
            ${Object.entries(CONFIG.SECTION_NAMES).map(([num, name]) => `
                <div class="legend-item section-${num}" data-section="${num}" title="${name}">
                    <span class="legend-color" style="background-color: ${CONFIG.SECTION_COLORS[num]}"></span>
                    <span class="legend-icon">${CONFIG.SECTION_ICONS[num]}</span>
                    <span class="legend-label">${name}</span>
                    <span class="legend-count" id="count-${num}">0</span>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = legendHtml;

    container.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            toggleFilter(item.dataset.section);
            item.classList.toggle('active');
        });
    });

    // Setup reset button
    document.getElementById('resetProgress').addEventListener('click', resetProgress);

    updateLegendProgress();
}

function toggleFilter(sectionNum) {
    if (STATE.activeFilters.has(sectionNum)) {
        STATE.activeFilters.delete(sectionNum);
    } else {
        STATE.activeFilters.add(sectionNum);
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

        // Section filter
        if (STATE.activeFilters.size > 0 && !STATE.activeFilters.has(d.section)) {
            return true;
        }

        return false;
    });
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
    if (node.isSection) return; // Don't show card for section nodes

    const isLearned = STATE.learnedConcepts.has(node.id);
    const sectionNum = node.section;

    infoCard
        .attr('data-section', sectionNum)
        .html(`
            <div class="info-card-header">
                <span class="info-card-icon">${CONFIG.SECTION_ICONS[sectionNum] || '💡'}</span>
                <div class="info-card-titles">
                    <h5 class="info-card-chapter">${node.displayName}</h5>
                    <p class="info-card-section">${CONFIG.SECTION_NAMES[sectionNum] || 'Section'}</p>
                </div>
            </div>
            <div class="info-card-body">
                <p class="info-card-summary">${node.summary || 'No summary available.'}</p>
            </div>
            <div class="info-card-footer">
                <span class="info-card-connections">&nbsp;</span>
                <button class="btn btn-sm btn-outline-secondary mark-learned-btn ${isLearned ? 'learned' : ''}"
                        onclick="toggleLearnedFromCard('${node.id.replace(/'/g, "\\'")}')">
                    ${isLearned ? '✓ Learned' : 'Mark as Learned'}
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

    // Check if this is a section node
    if (STATE.selectedNode.isSection) {
        // Get the section number from the section node
        const sectionNum = STATE.selectedNode.section;

        // Find all concepts in this section (excluding the section node itself)
        const conceptsInSection = STATE.nodes.filter(node =>
            node.section === sectionNum && !node.isSection
        );

        if (isCurrentlyLearned) {
            // Unmark the section and all its concepts
            STATE.learnedConcepts.delete(STATE.selectedNode.id);
            conceptsInSection.forEach(concept => {
                STATE.learnedConcepts.delete(concept.id);
            });
        } else {
            // Mark the section and all its concepts as learned
            STATE.learnedConcepts.add(STATE.selectedNode.id);
            conceptsInSection.forEach(concept => {
                STATE.learnedConcepts.add(concept.id);
            });
        }
    } else {
        // Regular concept node - just toggle it
        if (isCurrentlyLearned) {
            STATE.learnedConcepts.delete(STATE.selectedNode.id);
        } else {
            STATE.learnedConcepts.add(STATE.selectedNode.id);
        }

        // Check if all concepts in this section are now learned
        // If so, also mark the section node as learned
        const sectionNum = STATE.selectedNode.section;
        const conceptsInSection = STATE.nodes.filter(node =>
            node.section === sectionNum && !node.isSection
        );
        const allConceptsLearned = conceptsInSection.every(concept =>
            STATE.learnedConcepts.has(concept.id)
        );

        const sectionNode = STATE.nodes.find(node =>
            node.isSection && node.section === sectionNum
        );

        if (allConceptsLearned && sectionNode) {
            STATE.learnedConcepts.add(sectionNode.id);
        } else if (sectionNode && !isCurrentlyLearned) {
            // If we're unmarking a concept, also unmark the section
            STATE.learnedConcepts.delete(sectionNode.id);
        }
    }

    saveProgress();
    updateVisualization();
    updateProgressDisplay();
}

function updateVisualization() {
    STATE.nodeElements.classed('learned', d => STATE.learnedConcepts.has(d.id));
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

    // Calculate learned counts per section
    const learnedBySection = {};
    let totalConcepts = 0;
    let totalLearned = 0;

    Object.keys(CONFIG.SECTION_NAMES).forEach(num => {
        const sectionNodes = STATE.nodes.filter(n => n.section === num && !n.isSection);
        const learned = sectionNodes.filter(n => STATE.learnedConcepts.has(n.id)).length;

        learnedBySection[num] = learned;
        totalConcepts += sectionNodes.length;
        totalLearned += learned;

        // Update legend count badges (total in section)
        const countElement = document.getElementById(`count-${num}`);
        if (countElement) {
            countElement.textContent = sectionNodes.length;
        }
    });

    // Update inline text
    progressInlineText.textContent = `${totalLearned}/${totalConcepts}`;

    // Create colored progress segments - ONLY for learned concepts
    progressBarWrapper.innerHTML = '';
    Object.keys(CONFIG.SECTION_NAMES).forEach(num => {
        const learnedCount = learnedBySection[num];
        if (learnedCount > 0) {
            const widthPercent = (learnedCount / totalConcepts) * 100;
            const segment = document.createElement('div');
            segment.className = 'progress-segment';
            segment.style.width = `${widthPercent}%`;
            segment.style.backgroundColor = CONFIG.SECTION_COLORS[num];
            segment.title = `${CONFIG.SECTION_NAMES[num]}: ${learnedCount} learned`;
            progressBarWrapper.appendChild(segment);
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

