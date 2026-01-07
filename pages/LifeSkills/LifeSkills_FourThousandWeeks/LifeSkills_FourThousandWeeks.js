/* ============================================
   FOUR THOUSAND WEEKS - COMPLETE VISUALIZATION
   With Progress Tracking, Multi-View, and All Features
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Category colors (matching the book's themes)
    CATEGORY_COLORS: {
        'intro': '#2C3E50',        // Dark blue-gray - Introduction
        'part1': '#E67E22',        // Orange - Part 1: Choosing to Choose
        'part2': '#3498DB',        // Blue - Part 2: Beyond Control
        'appendix': '#27AE60'      // Green - Appendix/Tools
    },

    // Category icons
    CATEGORY_ICONS: {
        'intro': '⏳',
        'part1': '🎯',
        'part2': '🌊',
        'appendix': '🛠️'
    },

    // Category full names
    CATEGORY_NAMES: {
        'intro': 'Introduction',
        'part1': 'Part 1: Choosing to Choose',
        'part2': 'Part 2: Beyond Control',
        'appendix': 'Practical Tools'
    },

    // Layout dimensions
    DIAMETER: 1000,
    STORAGE_KEY: 'four-thousand-weeks-learned'
};

// ============================================
// STATE MANAGEMENT
// ============================================

const STATE = {
    data: null,
    root: null,
    nodes: [],
    links: [],
    selectedNode: null,
    lockedNode: null,
    searchQuery: '',
    activeCategories: new Set(),
    learnedConcepts: new Set(),
    currentView: 'radial' // radial, network, cluster
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getCategory(d) {
    if (!d || !d.data || !d.data.name) return null;
    const name = d.data.name;

    if (name.includes('main.intro')) return 'intro';
    if (name.includes('main.part1')) return 'part1';
    if (name.includes('main.part2')) return 'part2';
    if (name.includes('main.appendix')) return 'appendix';

    return null;
}

function getCategoryColor(d) {
    const category = getCategory(d);
    return category ? CONFIG.CATEGORY_COLORS[category] : '#666666';
}

function getCategoryIcon(d) {
    const category = getCategory(d);
    return category ? CONFIG.CATEGORY_ICONS[category] : '';
}

function getCategoryName(d) {
    const category = getCategory(d);
    return category ? CONFIG.CATEGORY_NAMES[category] : '';
}

function isChapter(d) {
    return d.data.name && (
        d.data.name.includes('main.part1.ch') ||
        d.data.name.includes('main.part2.ch') ||
        d.data.name.includes('main.appendix.')
    );
}

function isSection(d) {
    return d.data.name && (
        d.data.name.includes('main.intro Introduction') ||
        d.data.name.includes('main.part1 PART ONE') ||
        d.data.name.includes('main.part2 PART TWO') ||
        d.data.name.includes('main.appendix Appendix')
    );
}

function getShortName(d) {
    if (!d || !d.data || !d.data.name) return '';

    const name = d.data.name;

    // Remove prefixes to get clean names
    return name
        .replace(/^main\.(intro|part\d+|appendix)\.(ch\d+\.)?(\d+\s+)?/, '')
        .replace(/^main\.(intro|part\d+|appendix)\s+/, '');
}

function saveProgress() {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify([...STATE.learnedConcepts]));
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

function loadProgress() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            STATE.learnedConcepts = new Set(JSON.parse(saved));
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

// ============================================
// HIERARCHY FUNCTIONS
// ============================================

function packageHierarchy(classes) {
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

    classes.forEach(function(d) {
        find(d.name, d);
    });

    return d3.hierarchy(map[""]);
}

function packageImports(nodes) {
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

// ============================================
// TOOLTIP (HOVER)
// ============================================

let tooltip = null;

function createTooltip() {
    tooltip = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip');
    return tooltip;
}

function showTooltip(d, event) {
    if (!tooltip) createTooltip();

    const summary = d.data.summary || 'No summary available.';
    const truncatedSummary = summary.length > 200 ? summary.substring(0, 200) + '...' : summary;

    tooltip.html(`
        <div class="tooltip-title">${getShortName(d)}</div>
        <div class="tooltip-summary">${truncatedSummary}</div>
    `);

    // Position tooltip
    const x = event.clientX;
    const y = event.clientY;

    const tooltipNode = tooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 300;
    const tooltipHeight = tooltipNode.offsetHeight || 150;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = x + 15;
    let top = y + 15;

    if (left + tooltipWidth > viewportWidth) {
        left = x - tooltipWidth - 15;
    }

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
// INFO CARD (CLICK)
// ============================================

let infoCard = null;
let infoCardBackdrop = null;

function createInfoCard() {
    if (!infoCardBackdrop) {
        infoCardBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'info-card-backdrop')
            .on('click', () => hideInfoCard());
    }

    infoCard = d3.select('body')
        .append('div')
        .attr('class', 'info-card')
        .attr('id', 'info-card');

    return infoCard;
}

function showInfoCard(d, event) {
    if (!infoCard) createInfoCard();
    if (isSection(d)) return; // Don't show card for section nodes

    const category = getCategory(d);
    const isLearned = STATE.learnedConcepts.has(d.data.name);
    const connections = countConnections(d);

    infoCard
        .attr('data-category', category)
        .html(`
            <div class="info-card-header">
                <span class="info-card-icon">${getCategoryIcon(d)}</span>
                <div class="info-card-titles">
                    <h5 class="info-card-chapter">${getShortName(d)}</h5>
                    <p class="info-card-section">${getCategoryName(d)}</p>
                </div>
            </div>
            <div class="info-card-body">
                <p class="info-card-summary">${d.data.summary || 'No summary available.'}</p>
            </div>
            <div class="info-card-footer">
                <span class="info-card-connections">${connections} connection(s)</span>
                <button class="btn btn-sm btn-outline-secondary mark-learned-btn ${isLearned ? 'learned' : ''}"
                        onclick="toggleLearned('${d.data.name.replace(/'/g, "\\'")}')">
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
    if (!infoCard) return;

    const cardWidth = 350;
    const cardHeight = 280;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = event ? (event.clientX - cardWidth / 2) : (viewportWidth - cardWidth) / 2;
    let top = event ? (event.clientY - cardHeight / 2) : (viewportHeight - cardHeight) / 2;

    left = Math.max(10, Math.min(left, viewportWidth - cardWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - cardHeight - 10));

    infoCard
        .style('left', left + 'px')
        .style('top', top + 'px');
}

function countConnections(d) {
    if (!d.data.imports) return 0;
    return d.data.imports.length;
}

// ============================================
// PROGRESS TRACKING
// ============================================

function toggleLearned(conceptName) {
    if (STATE.learnedConcepts.has(conceptName)) {
        STATE.learnedConcepts.delete(conceptName);
    } else {
        STATE.learnedConcepts.add(conceptName);
    }

    saveProgress();
    updateProgressUI();
    updateNodeStyles();

    const btn = document.querySelector('.mark-learned-btn');
    if (btn) {
        const isLearned = STATE.learnedConcepts.has(conceptName);
        btn.classList.toggle('learned', isLearned);
        btn.textContent = isLearned ? '✓ Learned' : 'Mark as Learned';
    }
}

function toggleCategory(categoryName) {
    if (!STATE.root) return;

    // Get all concepts in this category
    const conceptsInCategory = [];
    STATE.root.leaves().forEach(d => {
        if (!isSection(d)) {
            const cat = getCategory(d);
            if (cat === categoryName) {
                conceptsInCategory.push(d.data.name);
            }
        }
    });

    // Check if all are learned
    const allLearned = conceptsInCategory.every(name => STATE.learnedConcepts.has(name));

    // Toggle
    if (allLearned) {
        conceptsInCategory.forEach(name => STATE.learnedConcepts.delete(name));
    } else {
        conceptsInCategory.forEach(name => STATE.learnedConcepts.add(name));
    }

    saveProgress();
    updateProgressUI();
    updateNodeStyles();
}

function updateProgressUI() {
    if (!STATE.root) return;

    const total = STATE.root.leaves().filter(d => !isSection(d)).length;
    const learned = STATE.learnedConcepts.size;
    const percentage = Math.round((learned / total) * 100);

    const progressWrapper = document.querySelector('.progress-bar-wrapper');
    const progressText = document.querySelector('.progress-text');

    if (!progressWrapper) return;

    // Count learned by category
    const learnedByCategory = {};
    Object.keys(CONFIG.CATEGORY_COLORS).forEach(cat => {
        learnedByCategory[cat] = 0;
    });

    STATE.root.leaves().forEach(d => {
        if (!isSection(d) && STATE.learnedConcepts.has(d.data.name)) {
            const cat = getCategory(d);
            if (cat && learnedByCategory[cat] !== undefined) {
                learnedByCategory[cat]++;
            }
        }
    });

    // Clear and rebuild segments
    progressWrapper.innerHTML = '';

    Object.keys(CONFIG.CATEGORY_COLORS).forEach(categoryName => {
        const count = learnedByCategory[categoryName];
        if (count > 0) {
            const segmentWidth = (count / total) * 100;
            const segment = document.createElement('div');
            segment.className = 'progress-bar-segment';
            segment.style.width = `${segmentWidth}%`;
            segment.style.backgroundColor = CONFIG.CATEGORY_COLORS[categoryName];
            segment.title = `${CONFIG.CATEGORY_NAMES[categoryName]}: ${count} learned`;
            progressWrapper.appendChild(segment);
        }
    });

    if (progressText) {
        progressText.textContent = `${learned}/${total}`;
    }
}

function updateNodeStyles() {
    if (!STATE.currentSvg) return;

    STATE.currentSvg.selectAll('.node circle')
        .attr('opacity', d => {
            if (isSection(d)) return 1;
            return STATE.learnedConcepts.has(d.data.name) ? 0.4 : 1;
        })
        .attr('stroke-width', d => {
            if (isSection(d)) return 3;
            return STATE.learnedConcepts.has(d.data.name) ? 1 : 2;
        });

    // Update checkmarks
    STATE.currentSvg.selectAll('.learned-check').remove();

    STATE.currentSvg.selectAll('.node')
        .filter(d => !isSection(d) && STATE.learnedConcepts.has(d.data.name))
        .append('text')
        .attr('class', 'learned-check')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .attr('font-size', '14px')
        .attr('fill', '#fff')
        .attr('pointer-events', 'none')
        .text('✓');
}

// ============================================
// PROGRESS TOOLTIPS
// ============================================

let progressTooltip = null;

function createProgressTooltip() {
    progressTooltip = d3.select('body')
        .append('div')
        .attr('class', 'progress-tooltip')
        .attr('id', 'progress-tooltip');
    return progressTooltip;
}

function showProgressTooltip(event) {
    if (!progressTooltip) createProgressTooltip();
    if (!STATE.root) return;

    const total = STATE.root.leaves().filter(d => !isSection(d)).length;
    const learned = STATE.learnedConcepts.size;

    const learnedByCategory = {};
    const totalByCategory = {};

    Object.keys(CONFIG.CATEGORY_COLORS).forEach(cat => {
        learnedByCategory[cat] = 0;
        totalByCategory[cat] = 0;
    });

    STATE.root.leaves().forEach(d => {
        if (!isSection(d)) {
            const cat = getCategory(d);
            if (cat) {
                totalByCategory[cat]++;
                if (STATE.learnedConcepts.has(d.data.name)) {
                    learnedByCategory[cat]++;
                }
            }
        }
    });

    let tooltipHTML = `
        <div class="progress-tooltip-title">📊 Progress Summary</div>
        <div class="progress-tooltip-content">
    `;

    Object.keys(CONFIG.CATEGORY_NAMES).forEach(categoryName => {
        const learnedCount = learnedByCategory[categoryName] || 0;
        const totalInCategory = totalByCategory[categoryName] || 0;
        const categoryPercentage = totalInCategory > 0 ? Math.round((learnedCount / totalInCategory) * 100) : 0;

        tooltipHTML += `
            <div class="progress-tooltip-section">
                <div class="progress-tooltip-section-name">
                    <span class="progress-tooltip-section-icon">${CONFIG.CATEGORY_ICONS[categoryName]}</span>
                    <span>${CONFIG.CATEGORY_NAMES[categoryName]}</span>
                </div>
                <div class="progress-tooltip-section-count">
                    ${learnedCount}/${totalInCategory}
                </div>
            </div>
        `;
    });

    tooltipHTML += `
        </div>
        <div class="progress-tooltip-footer">
            Total: ${learned}/${total} concepts learned
        </div>
    `;

    progressTooltip.html(tooltipHTML);

    // Position
    const x = event.clientX;
    const y = event.clientY;

    progressTooltip
        .style('left', (x - 150) + 'px')
        .style('top', (y + 20) + 'px')
        .classed('visible', true);
}

function hideProgressTooltip() {
    if (progressTooltip) {
        progressTooltip.classed('visible', false);
    }
}

// ============================================
// LEGEND
// ============================================

function createLegend(container) {
    const legendHtml = `
        <div class="legend-header">
            <h5 class="legend-title">Book Sections</h5>
            <div class="progress-inline" title="Hover for progress details">
                <div class="progress-bar-wrapper">
                    <!-- Progress segments will be added by JS -->
                </div>
                <span class="progress-text">0/70</span>
            </div>
        </div>
        <div class="legend-items">
            ${Object.entries(CONFIG.CATEGORY_NAMES).map(([key, name]) => `
                <div class="legend-item category-${key}" data-category="${key}" tabindex="0" title="${name}">
                    <span class="legend-color" style="background-color: ${CONFIG.CATEGORY_COLORS[key]}"></span>
                    <span class="legend-icon">${CONFIG.CATEGORY_ICONS[key]}</span>
                    <span class="legend-label">${name}</span>
                    <span class="legend-count" id="count-${key}">0</span>
                </div>
            `).join('')}
        </div>
    `;

    container.innerHTML = legendHtml;

    container.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            filterByCategory(item.dataset.category);
        });
    });

    const progressInline = container.querySelector('.progress-inline');
    if (progressInline) {
        progressInline.style.cursor = 'pointer';
        progressInline.addEventListener('mouseenter', showProgressTooltip);
        progressInline.addEventListener('mouseleave', hideProgressTooltip);
        progressInline.addEventListener('click', (e) => {
            e.stopPropagation();
            // Could open a modal here
        });
    }
}

function updateLegendCounts(nodes) {
    const counts = {};
    Object.keys(CONFIG.CATEGORY_NAMES).forEach(key => counts[key] = 0);

    nodes.forEach(d => {
        if (!isSection(d)) {
            const cat = getCategory(d);
            if (cat && counts[cat] !== undefined) {
                counts[cat]++;
            }
        }
    });

    Object.entries(counts).forEach(([key, count]) => {
        const el = document.getElementById(`count-${key}`);
        if (el) el.textContent = count;
    });
}

function filterByCategory(categoryName) {
    if (STATE.activeCategories.has(categoryName)) {
        STATE.activeCategories.delete(categoryName);
    } else {
        STATE.activeCategories.add(categoryName);
    }
    renderCurrentView();
}

// ============================================
// DATA LOADING
// ============================================

async function loadData() {
    try {
        const response = await fetch('LifeSkills_FourThousandWeeks.json');
        STATE.data = await response.json();

        STATE.root = packageHierarchy(STATE.data);
        STATE.nodes = STATE.root.descendants();
        STATE.links = packageImports(STATE.nodes);

        loadProgress();

        const legendContainer = document.getElementById('legend-container');
        if (legendContainer) {
            createLegend(legendContainer);
            updateLegendCounts(STATE.nodes);
        }

        initializeVisualization();
        updateProgressUI();
        setupControls();

    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please check the console.');
    }
}

// ============================================
// VISUALIZATION - RADIAL VIEW
// ============================================

function renderRadialView() {
    const svg = d3.select('#main-svg');
    svg.selectAll('*').remove();

    const width = CONFIG.DIAMETER;
    const height = CONFIG.DIAMETER;

    svg.attr('viewBox', [0, 0, width, height])
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const cluster = d3.cluster()
        .size([360, width / 2 - 120]);

    cluster(STATE.root);

    // Create links
    const link = svg.append('g')
        .selectAll('path')
        .data(STATE.links)
        .join('path')
        .attr('class', 'link')
        .each(function(d) { d.source = d[0], d.target = d[d.length - 1]; })
        .attr('d', d3.linkRadial()
            .angle(d => d.x / 180 * Math.PI)
            .radius(d => d.y))
        .attr('fill', 'none')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .attr('opacity', 0.4);

    // Create nodes
    const node = svg.append('g')
        .selectAll('g')
        .data(STATE.root.descendants())
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `
            rotate(${d.x - 90})
            translate(${d.y},0)
        `)
        .style('cursor', 'pointer');

    // Add circles
    node.append('circle')
        .attr('r', d => isSection(d) ? 8 : 5)
        .attr('fill', d => getCategoryColor(d))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    // Add labels
    node.append('text')
        .attr('transform', d => `
            rotate(${d.x < 180 ? 0 : 180})
            translate(${d.x < 180 ? 12 : -12},0)
        `)
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .attr('font-size', d => isSection(d) ? '11px' : '9px')
        .attr('font-weight', d => isSection(d) ? 'bold' : 'normal')
        .text(d => {
            const name = getShortName(d);
            return name.length > 30 ? name.substring(0, 27) + '...' : name;
        })
        .attr('fill', 'var(--viz-text)');

    // Add interactivity
    node.on('click', (event, d) => {
        event.stopPropagation();
        if (!isSection(d)) {
            showInfoCard(d, event);
        }
    })
    .on('mouseover', (event, d) => {
        if (!isSection(d)) {
            showTooltip(d, event);
        }
    })
    .on('mouseout', () => {
        hideTooltip();
    });

    svg.on('click', () => {
        hideInfoCard();
    });

    STATE.currentSvg = svg;
    updateNodeStyles();
}

// ============================================
// VISUALIZATION - NETWORK VIEW
// ============================================

function renderNetworkView() {
    const svg = d3.select('#main-svg');
    svg.selectAll('*').remove();

    const width = CONFIG.DIAMETER;
    const height = CONFIG.DIAMETER;

    svg.attr('viewBox', [0, 0, width, height])
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const nodes = STATE.root.descendants();
    const links = STATE.links.map(d => ({
        source: d[0],
        target: d[d.length - 1]
    }));

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.data.name).distance(80))
        .force('charge', d3.forceManyBody().strength(-150))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(d => isSection(d) ? 25 : 15));

    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .attr('opacity', 0.4);

    const node = svg.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', 'node')
        .style('cursor', 'pointer')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('circle')
        .attr('r', d => isSection(d) ? 12 : 8)
        .attr('fill', d => getCategoryColor(d))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    node.append('text')
        .attr('dy', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '9px')
        .text(d => {
            const name = getShortName(d);
            return name.length > 20 ? name.substring(0, 17) + '...' : name;
        })
        .attr('fill', 'var(--viz-text)');

    node.on('click', (event, d) => {
        event.stopPropagation();
        if (!isSection(d)) {
            showInfoCard(d, event);
        }
    })
    .on('mouseover', (event, d) => {
        if (!isSection(d)) {
            showTooltip(d, event);
        }
    })
    .on('mouseout', () => {
        hideTooltip();
    });

    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    svg.on('click', () => {
        hideInfoCard();
    });

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

    STATE.currentSvg = svg;
    updateNodeStyles();
}

// ============================================
// VISUALIZATION - CLUSTER VIEW
// ============================================

function renderClusterView() {
    const svg = d3.select('#main-svg');
    svg.selectAll('*').remove();

    const width = CONFIG.DIAMETER;
    const height = CONFIG.DIAMETER;

    svg.attr('viewBox', [0, 0, width, height])
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const tree = d3.tree()
        .size([width - 200, height - 200])
        .separation((a, b) => (a.parent == b.parent ? 1 : 2));

    tree(STATE.root);

    // Adjust positions
    STATE.root.descendants().forEach(d => {
        d.y += 100;
        d.x += 100;
    });

    const link = svg.append('g')
        .selectAll('path')
        .data(STATE.root.links())
        .join('path')
        .attr('d', d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y))
        .attr('fill', 'none')
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.4);

    const node = svg.append('g')
        .selectAll('g')
        .data(STATE.root.descendants())
        .join('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x},${d.y})`)
        .style('cursor', 'pointer');

    node.append('circle')
        .attr('r', d => isSection(d) ? 10 : 6)
        .attr('fill', d => getCategoryColor(d))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2);

    node.append('text')
        .attr('dy', -12)
        .attr('text-anchor', 'middle')
        .attr('font-size', d => isSection(d) ? '11px' : '9px')
        .attr('font-weight', d => isSection(d) ? 'bold' : 'normal')
        .text(d => {
            const name = getShortName(d);
            return name.length > 25 ? name.substring(0, 22) + '...' : name;
        })
        .attr('fill', 'var(--viz-text)');

    node.on('click', (event, d) => {
        event.stopPropagation();
        if (!isSection(d)) {
            showInfoCard(d, event);
        }
    })
    .on('mouseover', (event, d) => {
        if (!isSection(d)) {
            showTooltip(d, event);
        }
    })
    .on('mouseout', () => {
        hideTooltip();
    });

    svg.on('click', () => {
        hideInfoCard();
    });

    STATE.currentSvg = svg;
    updateNodeStyles();
}

// ============================================
// VIEW MANAGEMENT
// ============================================

function initializeVisualization() {
    renderCurrentView();
}

function renderCurrentView() {
    switch(STATE.currentView) {
        case 'radial':
            renderRadialView();
            break;
        case 'network':
            renderNetworkView();
            break;
        case 'cluster':
            renderClusterView();
            break;
        default:
            renderRadialView();
    }
}

function switchView(viewName) {
    STATE.currentView = viewName;

    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
        btn.setAttribute('aria-pressed', btn.dataset.view === viewName);
    });

    renderCurrentView();
}

// ============================================
// CONTROLS
// ============================================

function setupControls() {
    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            STATE.searchQuery = e.target.value.trim().toLowerCase();
            renderCurrentView();
        });
    }

    // View switcher
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            searchInput?.focus();
        } else if (e.key === 'Escape') {
            searchInput.value = '';
            STATE.searchQuery = '';
            searchInput?.blur();
            hideInfoCard();
            renderCurrentView();
        } else if (e.ctrlKey || e.metaKey) {
            if (e.key === '1') {
                e.preventDefault();
                switchView('radial');
            } else if (e.key === '2') {
                e.preventDefault();
                switchView('network');
            } else if (e.key === '3') {
                e.preventDefault();
                switchView('cluster');
            }
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

// Make toggleLearned global for HTML onclick
window.toggleLearned = toggleLearned;
window.toggleCategory = toggleCategory;

