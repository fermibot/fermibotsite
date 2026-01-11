/* ============================================
   AVATAR - RADIAL TIMELINE VISUALIZATION
   Based on The Lighthouse visualization

   HIERARCHICAL FEATURES:
   - Supports 3-level scene hierarchy (main scene -> sub-scene -> detail)
   - Double-click nodes with children to expand/collapse
   - Shift/Ctrl/Cmd+Click also toggles expansion
   - Visual indicators: + for collapsed, - for expanded
   - Nodes with children have dashed borders when collapsed
   - Sub-scenes and details have reduced opacity and size
   - Search includes all hierarchical levels
   ============================================ */

console.log('Avatar - Radial Timeline v2.0 (Hierarchical) loaded');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Act colors - Avatar theme
    ACT_COLORS: {
        'act1': '#3a7ca5',  // Blue - Arrival & Awakening
        'act2': '#2d7a4d',  // Green - Transformation & Betrayal
        'act3': '#c44536'   // Red - War & Transcendence
    },

    // Scene type colors
    TYPE_COLORS: {
        'action': '#d84315',
        'discovery': '#1976d2',
        'bonding': '#388e3c',
        'betrayal': '#8b0000',
        'spiritual': '#7b1fa2',
        'transformation': '#00838f',
        'conflict': '#e53935',
        'tragedy': '#6a1b9a'
    },

    // Act icons
    ACT_ICONS: {
        'act1': '🚀',
        'act2': '🌳',
        'act3': '⚔️'
    },

    // Act full names
    ACT_NAMES: {
        'act1': 'Act I: Arrival & Awakening (Pages 1-60)',
        'act2': 'Act II: Transformation & Betrayal (Pages 60-110)',
        'act3': 'Act III: War & Transcendence (Pages 110-152)'
    },

    // Layout dimensions
    DIAMETER: 1000,
    STORAGE_KEY: 'avatar-viewed-scenes',
    DATA_FILE: 'avatar_scenes_detailed.json'
};

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
    scenes: [],
    allNodes: [],
    expandedNodes: new Set(),
    root: null,
    viewedScenes: new Set(),
    activeActs: new Set(),
    activeConnections: new Set(),
    searchQuery: '',
    searchMatches: [],
    hoveredNode: null,
    lockedNode: null,
    showingFromModal: false
};

// ============================================
// LOAD DATA
// ============================================

async function loadSceneData() {
    try {
        const response = await fetch(CONFIG.DATA_FILE);
        const data = await response.json();
        state.scenes = data.scenes;
        console.log(`Loaded ${state.scenes.length} Avatar scenes`);

        // Debug: Check which scenes have sub-scenes
        const scenesWithSubs = state.scenes.filter(s => s.hasSubScenes);
        console.log(`Scenes with hasSubScenes flag: ${scenesWithSubs.length}`);
        console.log('Scene IDs with sub-scenes:', scenesWithSubs.map(s => s.id));

        return true;
    } catch (error) {
        console.error('Failed to load scene data:', error);
        return false;
    }
}

// ============================================
// INITIALIZATION
// ============================================

async function initialize() {
    // Load data
    const loaded = await loadSceneData();
    if (!loaded) {
        console.error('Could not load scene data');
        return;
    }

    // Load saved progress
    loadProgress();

    // Initialize UI
    initLegend();
    initSearch();
    initProgressUI();
    initVisualization();

    // Setup event listeners
    setupEventListeners();

    console.log('Avatar visualization initialized');
}

// ============================================
// PROGRESS TRACKING
// ============================================

function loadProgress() {
    try {
        const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (stored) {
            const ids = JSON.parse(stored);
            state.viewedScenes = new Set(ids);
        }
    } catch (e) {
        console.warn('Could not load progress:', e);
    }
}

function saveProgress() {
    try {
        const ids = Array.from(state.viewedScenes);
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
        console.warn('Could not save progress:', e);
    }
}

function toggleViewed(sceneId) {
    if (state.viewedScenes.has(sceneId)) {
        state.viewedScenes.delete(sceneId);
    } else {
        state.viewedScenes.add(sceneId);
    }
    saveProgress();
    updateProgressUI();
    updateNodeStyles();
}

function updateNodeStyles() {
    if (!nodeGroup) return;

    nodeGroup.selectAll('.node circle')
        .classed('viewed', d => state.viewedScenes.has(d.data.id));

    nodeGroup.selectAll('.node .node-checkmark')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0);

    nodeGroup.selectAll('.node .node-number')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0.9);

    nodeGroup.selectAll('.node .node-label')
        .classed('viewed-label', d => state.viewedScenes.has(d.data.id))
        .attr('fill', d => state.viewedScenes.has(d.data.id) ? getActColor(d.data.act) : 'var(--viz-text)');
}

// ============================================
// HIERARCHY BUILDING
// ============================================

function processHierarchicalScenes(scenes) {
    const allNodes = [];

    scenes.forEach(scene => {
        // Add main scene (level 0)
        const mainNode = {
            ...scene,
            level: 0,
            parentId: null,
            isExpanded: state.expandedNodes.has(scene.id),
            hasChildren: scene.hasSubScenes || false
        };

        // Debug logging
        if (scene.hasSubScenes) {
            console.log(`Scene ${scene.id} has sub-scenes:`, scene.hasSubScenes, 'subScenes array:', scene.subScenes ? scene.subScenes.length : 0);
        }

        allNodes.push(mainNode);

        // Add sub-scenes if they exist (level 1)
        if (scene.hasSubScenes && scene.subScenes) {
            scene.subScenes.forEach(subScene => {
                const subNode = {
                    ...subScene,
                    act: scene.act,
                    parentId: scene.id,
                    level: 1,
                    isExpanded: state.expandedNodes.has(subScene.id),
                    hasChildren: subScene.hasSubScenes || false,
                    types: scene.types
                };

                // Only add if parent is expanded
                if (state.expandedNodes.has(scene.id)) {
                    allNodes.push(subNode);
                }

                // Add sub-sub-scenes if they exist (level 2)
                if (subScene.hasSubScenes && subScene.subScenes) {
                    subScene.subScenes.forEach(subSubScene => {
                        const subSubNode = {
                            ...subSubScene,
                            act: scene.act,
                            parentId: subScene.id,
                            level: 2,
                            isExpanded: false,
                            hasChildren: false,
                            types: scene.types
                        };

                        // Only add if both parent and grandparent are expanded
                        if (state.expandedNodes.has(scene.id) && state.expandedNodes.has(subScene.id)) {
                            allNodes.push(subSubNode);
                        }
                    });
                }
            });
        }
    });

    return allNodes;
}

function buildHierarchy() {
    // Process hierarchical scenes
    const processedScenes = processHierarchicalScenes(state.scenes);
    state.allNodes = processedScenes;

    const root = {
        name: 'Avatar',
        children: [
            {
                name: 'Act I',
                act: 'act1',
                children: processedScenes.filter(s => s.act === 'act1')
            },
            {
                name: 'Act II',
                act: 'act2',
                children: processedScenes.filter(s => s.act === 'act2')
            },
            {
                name: 'Act III',
                act: 'act3',
                children: processedScenes.filter(s => s.act === 'act3')
            }
        ]
    };
    return root;
}

// ============================================
// LINK GENERATION
// ============================================

function packageImports(nodes) {
    const map = new Map(nodes.map(d => [d.data.id, d]));
    const imports = [];

    nodes.forEach(node => {
        const scene = node.data;

        // Foreshadowing links
        if (scene.foreshadowing) {
            scene.foreshadowing.forEach(targetId => {
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'foreshadowing'
                    });
                }
            });
        }

        // Callback links
        if (scene.callbacks) {
            scene.callbacks.forEach(targetId => {
                const target = map.get(targetId);
                if (target) {
                    imports.push({
                        source: node,
                        target: target,
                        type: 'callback'
                    });
                }
            });
        }
    });

    return imports;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getActColor(act) {
    return CONFIG.ACT_COLORS[act] || '#666';
}

function getTypeColor(type) {
    return CONFIG.TYPE_COLORS[type] || '#999';
}

function getActIcon(act) {
    return CONFIG.ACT_ICONS[act] || '';
}

function getNodeClass(d) {
    let classes = `node act-${d.data.act}`;
    if (d.data.hasChildren) classes += ' has-children';
    if (d.data.level === 1) classes += ' sub-scene';
    if (d.data.level === 2) classes += ' sub-sub-scene';
    if (d.data.isExpanded) classes += ' expanded';
    return classes;
}

function getNodeRadius(d) {
    if (d.data.level === 0) return d.data.hasChildren ? 8 : 6;
    if (d.data.level === 1) return d.data.hasChildren ? 6 : 5;
    return 4;
}

function getNodeStrokeWidth(d) {
    if (d.data.level === 0) return d.data.hasChildren ? 3 : 2;
    if (d.data.level === 1) return d.data.hasChildren ? 2.5 : 2;
    return 1.5;
}

function toggleNodeExpansion(nodeData) {
    const nodeId = nodeData.id;
    console.log('toggleNodeExpansion called for node:', nodeId);
    console.log('Current expandedNodes:', Array.from(state.expandedNodes));

    if (state.expandedNodes.has(nodeId)) {
        console.log('Collapsing node:', nodeId);
        state.expandedNodes.delete(nodeId);
    } else {
        console.log('Expanding node:', nodeId);
        state.expandedNodes.add(nodeId);
    }

    console.log('Updated expandedNodes:', Array.from(state.expandedNodes));

    // Rebuild and redraw visualization
    refreshVisualization();
}

function refreshVisualization() {
    // Remove existing visualization
    if (svg) {
        svg.remove();
    }

    // Rebuild with new expanded state
    initVisualization();
}

// ============================================
// RADIAL VISUALIZATION
// ============================================

let svg, g, nodeGroup, linkGroup;
let currentLinks = [];
let allNodes = [];

function initVisualization() {
    const container = d3.select('#visualization-container');
    container.select('.loading-overlay').remove();

    const diameter = CONFIG.DIAMETER;
    const radius = diameter / 2;
    const innerRadius = (radius - 150) * 0.9; // 90% of original size
    const padding = 160; // Extra padding for labels
    const verticalOffset = 80;

    svg = container.append('svg')
        .attr('viewBox', `${-radius - padding} ${-radius - verticalOffset} ${diameter + padding * 2} ${diameter + verticalOffset + padding}`)
        .attr('width', '100%')
        .attr('height', diameter + verticalOffset + padding)
        .style('max-width', `${diameter + padding * 2}px`)
        .style('font', '12px sans-serif');

    // Add gradient definitions
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter')
        .attr('id', 'glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    filter.append('feGaussianBlur')
        .attr('stdDeviation', '3')
        .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    g = svg.append('g');

    // Build hierarchy
    const hierarchyData = buildHierarchy();
    state.root = d3.hierarchy(hierarchyData);

    // Create cluster layout
    const cluster = d3.cluster()
        .size([360, innerRadius]);

    cluster(state.root);

    // Get all nodes
    allNodes = state.root.descendants();

    // Build links
    currentLinks = packageImports(allNodes.filter(d => d.data.id));

    // Draw links first (behind nodes)
    linkGroup = g.append('g')
        .attr('class', 'links')
        .attr('fill', 'none');

    const line = d3.lineRadial()
        .curve(d3.curveBundle.beta(0.85))
        .radius(d => d.y)
        .angle(d => d.x * Math.PI / 180);

    linkGroup.selectAll('.link')
        .data(currentLinks)
        .join('path')
        .attr('class', d => `link link-${d.type}`)
        .attr('d', d => {
            const sourcePath = d.source.path(d.target);
            return line(sourcePath);
        })
        .attr('stroke', d => {
            if (d.type === 'callback') return '#8b5a8b';
            if (d.type === 'thematic') return '#b8860b';
            return '#5a8b5a';
        })
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.3)
        .attr('stroke-dasharray', d => d.type === 'callback' ? '5,3' : null);

    // Draw hierarchy links (parent to child connections)
    const hierarchyLinks = [];
    allNodes.forEach(node => {
        if (node.data.parentId) {
            const parent = allNodes.find(n => n.data.id === node.data.parentId);
            if (parent) {
                hierarchyLinks.push({
                    source: parent,
                    target: node,
                    level: node.data.level
                });
            }
        }
    });

    linkGroup.selectAll('.hierarchy-link')
        .data(hierarchyLinks)
        .join('path')
        .attr('class', 'hierarchy-link')
        .attr('d', d => {
            const sourcePath = d.source.path(d.target);
            return line(sourcePath);
        })
        .attr('stroke', d => getActColor(d.target.data.act))
        .attr('stroke-width', d => d.level === 1 ? 2 : 1)
        .attr('stroke-opacity', 0.2)
        .attr('stroke-dasharray', '2,3');

    // Draw nodes
    nodeGroup = g.append('g')
        .attr('class', 'nodes');

    const nodes = nodeGroup.selectAll('.node')
        .data(allNodes.filter(d => d.data.id))
        .join('g')
        .attr('class', d => getNodeClass(d))
        .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y},0)`)
        .on('mouseover', function (event, d) {
            if (!state.lockedNode) {
                highlightConnections(d);
                showTooltip(d, event);
            }
        })
        .on('mouseout', function () {
            if (!state.lockedNode) {
                unhighlightAll();
                hideTooltip();
            }
        })
        .on('click', function (event, d) {
            event.stopPropagation();

            // Always show info card (expandable nodes have expand button in card)
            state.lockedNode = d;
            showInfoCard(d, event);
            highlightConnections(d);
        });

    // Node circles
    nodes.append('circle')
        .attr('r', d => getNodeRadius(d))
        .attr('fill', d => getActColor(d.data.act))
        .attr('stroke', d => getActColor(d.data.act))
        .attr('stroke-width', d => getNodeStrokeWidth(d))
        .style('opacity', d => {
            if (d.data.level === 0) return 1;
            if (d.data.level === 1) return 0.85;
            return 0.7;
        });

    // Expand/collapse indicators ONLY for nodes with children
    const nodesWithChildren = nodes.filter(d => d.data.hasChildren);
    console.log('Nodes with children:', nodesWithChildren.size(), 'nodes');
    nodesWithChildren.each(function (d) {
        console.log(`  - Node ${d.data.id}: hasChildren=${d.data.hasChildren}, isExpanded=${d.data.isExpanded}`);
    });

    nodesWithChildren
        .append('text')
        .attr('class', 'node-expand-indicator')
        .attr('x', d => d.x < 180 ? 18 : -18)
        .attr('y', 1)
        .attr('text-anchor', 'middle')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('fill', d => getActColor(d.data.act))
        .attr('font-size', d => d.data.level === 0 ? '11px' : '9px')
        .attr('font-weight', 'bold')
        .style('pointer-events', 'none')
        .style('user-select', 'none')
        .text(d => d.data.isExpanded ? '−' : '+');

    // Checkmarks for viewed scenes (only on nodes without children) - inside the circle
    nodes.filter(d => !d.data.hasChildren)
        .append('text')
        .attr('class', 'node-checkmark')
        .attr('x', 0)
        .attr('y', 1.5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', d => d.data.level === 0 ? '8px' : '6px')
        .attr('font-weight', 'bold')
        .style('opacity', d => state.viewedScenes.has(d.data.id) ? 1 : 0)
        .text('✓');

    // Scene numbers - positioned between circle and label (all nodes, all sides)
    nodes.append('text')
        .attr('class', 'node-number')
        .attr('dy', '0.31em')
        .attr('x', d => {
            // Position after the + sign if it has children, otherwise right after circle
            const baseOffset = d.x < 180 ? (d.data.hasChildren ? 30 : 16) : (d.data.hasChildren ? -30 : -16);
            const levelOffset = d.data.level * 2;
            return d.x < 180 ? baseOffset + levelOffset : baseOffset - levelOffset;
        })
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('font-size', d => {
            if (d.data.level === 0) return '9.5px';
            if (d.data.level === 1) return '8.5px';
            return '7.5px';
        })
        .attr('fill', d => getActColor(d.data.act))
        .attr('font-weight', '600')
        .style('opacity', 0.9)
        .text(d => {
            if (d.data.level === 0) {
                return `${d.data.id}.`;
            } else {
                return `${d.data.id}`;
            }
        });

    // Node labels - title text only (no scene numbers)
    nodes.append('text')
        .attr('class', 'node-label')
        .attr('dy', '0.31em')
        .attr('x', d => {
            // Position after the scene number with good spacing
            const baseOffset = d.x < 180 ? (d.data.hasChildren ? 50 : 35) : (d.data.hasChildren ? -50 : -35);
            const levelOffset = d.data.level * 3;
            return d.x < 180 ? baseOffset + levelOffset : baseOffset - levelOffset;
        })
        .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
        .attr('transform', d => d.x >= 180 ? 'rotate(180)' : null)
        .attr('font-size', d => {
            if (d.data.level === 0) return '10px';
            if (d.data.level === 1) return '9px';
            return '8px';
        })
        .attr('fill', 'var(--viz-text)')
        .style('cursor', 'pointer')
        .style('opacity', d => {
            if (d.data.level === 0) return 1;
            if (d.data.level === 1) return 0.9;
            return 0.8;
        })
        .text(d => d.data.title);

    // Update styles
    updateNodeStyles();

    // Click outside to deselect
    svg.on('click', function () {
        hideInfoCard();
        hideTooltip();
        unhighlightAll();
    });
}

// ============================================
// HIGHLIGHTING
// ============================================

function highlightConnections(node) {
    state.hoveredNode = node;

    // Get connected nodes (including hierarchy)
    const connectedIds = new Set([node.data.id]);

    // Add story connections
    currentLinks.forEach(link => {
        if (link.source.data.id === node.data.id) {
            connectedIds.add(link.target.data.id);
        }
        if (link.target.data.id === node.data.id) {
            connectedIds.add(link.source.data.id);
        }
    });

    // Add hierarchical connections (parent/children)
    if (node.data.hasChildren) {
        // If this node has children, add all its children
        allNodes.forEach(n => {
            if (n.data.parentId === node.data.id) {
                connectedIds.add(n.data.id);
            }
        });
    }
    if (node.data.parentId) {
        // If this is a child, add its parent
        connectedIds.add(node.data.parentId);
        // Also add siblings
        allNodes.forEach(n => {
            if (n.data.parentId === node.data.parentId) {
                connectedIds.add(n.data.id);
            }
        });
    }

    // Highlight nodes
    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', d => d.data.id === node.data.id)
        .classed('connection-dimmed', d => !connectedIds.has(d.data.id));

    // Highlight story links
    linkGroup.selectAll('.link')
        .classed('highlighted', d =>
            d.source.data.id === node.data.id || d.target.data.id === node.data.id)
        .classed('dimmed', d =>
            d.source.data.id !== node.data.id && d.target.data.id !== node.data.id);

    // Highlight hierarchy links
    linkGroup.selectAll('.hierarchy-link')
        .style('stroke-opacity', d => {
            if (d.source.data.id === node.data.id || d.target.data.id === node.data.id) {
                return 0.6; // Highly visible when connected
            }
            return 0.1; // Dimmed otherwise
        })
        .style('stroke-width', d => {
            if (d.source.data.id === node.data.id || d.target.data.id === node.data.id) {
                return 3;
            }
            return d.level === 1 ? 2 : 1;
        });
}

function unhighlightAll() {
    state.hoveredNode = null;

    if (state.lockedNode) return;

    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', false)
        .classed('connection-dimmed', false);

    linkGroup.selectAll('.link')
        .classed('highlighted', false)
        .classed('dimmed', false);

    // Reset hierarchy links to default
    linkGroup.selectAll('.hierarchy-link')
        .style('stroke-opacity', 0.2)
        .style('stroke-width', d => d.level === 1 ? 2 : 1);
}

// ============================================
// TOOLTIP
// ============================================

let tooltip;

function initTooltip() {
    tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('position', 'fixed')
        .style('pointer-events', 'none')
        .style('opacity', 0);
}

function showTooltip(node, event) {
    if (!tooltip) initTooltip();

    const scene = node.data;
    const location = scene.location?.primary || scene.location || 'Unknown';
    const summary = scene.plotSummary?.brief || scene.description || scene.summary || '';
    const duration = scene.duration || '';

    // Build level indicator
    let levelIndicator = '';
    if (scene.level === 1) levelIndicator = ' <span style="color: #888;">└ Sub-scene</span>';
    if (scene.level === 2) levelIndicator = ' <span style="color: #888;">└└ Detail</span>';

    let html = `
        <div class="tooltip-header">
            <span class="tooltip-icon">${getActIcon(scene.act)}</span>
            <span class="tooltip-title">${scene.id}${scene.level === 0 ? '.' : ''} ${scene.title}${levelIndicator}</span>
        </div>
    `;

    // Only show location/time if available
    if (location !== 'Unknown' || scene.time) {
        html += `<div class="tooltip-location">${location}${scene.time ? ' • ' + scene.time : ''}</div>`;
    }

    if (duration) {
        html += `<div class="tooltip-location">${duration}</div>`;
    }

    // Show types if available
    if (scene.types && scene.types.length > 0) {
        html += `<div class="tooltip-types">
            ${scene.types.map(t => `<span class="tooltip-type" style="background: ${getTypeColor(t)}">${t}</span>`).join('')}
        </div>`;
    }

    if (summary) {
        html += `<div class="tooltip-summary">${summary.substring(0, 180)}${summary.length > 180 ? '...' : ''}</div>`;
    }

    // Add hint
    if (scene.hasChildren) {
        html += `<div class="tooltip-hint">Click for details • Use button to ${scene.isExpanded ? 'collapse' : 'expand'} sub-scenes</div>`;
    } else {
        html += `<div class="tooltip-hint">Click for full details</div>`;
    }

    tooltip.html(html)
        .classed('visible', true)
        .style('left', (event.clientX + 15) + 'px')
        .style('top', (event.clientY + 15) + 'px')
        .style('display', 'block');
}

function hideTooltip() {
    if (tooltip) {
        tooltip.classed('visible', false);
    }
}

// ============================================
// INFO CARD
// ============================================

let infoCard, infoCardBackdrop;

function initInfoCard() {
    // Backdrop
    infoCardBackdrop = d3.select('body').append('div')
        .attr('class', 'info-card-backdrop')
        .on('click', hideInfoCard);

    // Info card
    infoCard = d3.select('body').append('div')
        .attr('class', 'info-card');
}

function getParentBreadcrumb(scene) {
    if (!scene.parentId) return '';

    let breadcrumb = [];
    let currentId = scene.parentId;

    // Find parent in main scenes
    const parent = state.scenes.find(s => s.id === currentId);
    if (parent) {
        breadcrumb.unshift(`${parent.id}. ${parent.title}`);

        // If we're at level 2, find the grandparent (level 1)
        if (scene.level === 2 && parent.subScenes) {
            const grandparent = parent.subScenes.find(s => s.id === scene.parentId);
            if (grandparent) {
                breadcrumb.push(`${grandparent.id} ${grandparent.title}`);
            }
        }
    } else {
        // Parent might be a sub-scene (level 1)
        state.scenes.forEach(mainScene => {
            if (mainScene.subScenes) {
                const subParent = mainScene.subScenes.find(s => s.id === currentId);
                if (subParent) {
                    breadcrumb.unshift(`${mainScene.id}. ${mainScene.title}`);
                    breadcrumb.push(`${subParent.id} ${subParent.title}`);
                }
            }
        });
    }

    if (breadcrumb.length > 0) {
        return `<div style="font-size: 0.75rem; color: var(--viz-text-muted); margin-bottom: 0.5rem;">
            <span style="opacity: 0.7;">↑</span> ${breadcrumb.join(' → ')}
        </div>`;
    }
    return '';
}

function showInfoCard(node, event) {
    if (!infoCard) initInfoCard();

    const scene = node.data;
    const location = scene.location?.primary || scene.location || 'Unknown';
    const summary = scene.plotSummary?.detailed || scene.plotSummary?.brief || scene.description || scene.summary || '';

    // Build level badge
    let levelBadge = '';
    if (scene.level === 1) levelBadge = '<span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px; font-size: 0.75rem; margin-left: 8px;">Sub-scene</span>';
    if (scene.level === 2) levelBadge = '<span style="background: rgba(255,255,255,0.3); padding: 2px 6px; border-radius: 3px; font-size: 0.75rem; margin-left: 8px;">Detail</span>';

    // Build HTML
    let html = `
        <div class="info-card-header">
            <span class="info-card-icon">${getActIcon(scene.act)}</span>
            <div class="info-card-titles">
                ${getParentBreadcrumb(scene)}
                <h3 class="info-card-scene">${scene.id}${scene.level === 0 ? '.' : ''} ${scene.title}${levelBadge}</h3>
                <p class="info-card-act">${CONFIG.ACT_NAMES[scene.act]} ${scene.duration ? '• ' + scene.duration : ''}</p>
            </div>
            <button class="info-card-close" onclick="hideInfoCard()">&times;</button>
        </div>

        ${scene.hasChildren ? `
        <div style="padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border-bottom: 1px solid var(--viz-border);">
            <button class="btn btn-sm" onclick="toggleNodeExpansionFromCard('${scene.id}')"
                    style="background: ${getActColor(scene.act)}; color: white; padding: 4px 12px; border-radius: 4px; border: none; cursor: pointer; font-size: 0.875rem;">
                ${scene.isExpanded ? '➖ Collapse Sub-scenes' : '➕ Expand Sub-scenes'}
            </button>
        </div>
        ` : ''}

        ${scene.types && scene.types.length > 0 ? `
        <div class="info-card-types">
            ${scene.types.map(t => `<span class="info-card-type" style="background: ${getTypeColor(t)}">${t}</span>`).join('')}
        </div>
        ` : ''}

        ${(location !== 'Unknown' || scene.time) ? `
        <div class="info-card-location">
            ${location !== 'Unknown' ? `<span class="location-text">📍 ${location}</span>` : ''}
            ${scene.time ? `<span class="time-text">🕐 ${scene.time}</span>` : ''}
        </div>
        ` : ''}

        <div class="info-card-body">
            <div class="info-card-summary">${summary}</div>

            ${scene.plotSummary?.subtext ? `
                <div class="info-card-section">
                    <div class="info-card-section-title">💡 Subtext</div>
                    <div class="info-card-section-content">${scene.plotSummary.subtext}</div>
                </div>
            ` : ''}

            ${scene.characterDevelopment ? buildCharacterSection(scene.characterDevelopment) : ''}

            ${scene.keyDialogue && scene.keyDialogue.length ? buildDialogueSection(scene.keyDialogue) : ''}

            ${scene.thematicElements ? buildThematicSection(scene.thematicElements) : ''}

            ${scene.visualStorytelling ? buildVisualSection(scene.visualStorytelling) : ''}

            ${scene.worldBuilding ? buildWorldBuildingSection(scene.worldBuilding) : ''}

            ${scene.symbols && Object.keys(scene.symbols).length ? `
                <div class="info-card-section">
                    <div class="info-card-section-title">🔣 Symbols</div>
                    <ul class="info-card-list">
                        ${Object.entries(scene.symbols).map(([symbol, meaning]) => `
                            <li><strong>${symbol}:</strong> ${meaning}</li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}

            ${scene.emotionalBeats ? buildEmotionalSection(scene.emotionalBeats) : ''}

            ${scene.moralQuestions && scene.moralQuestions.length ? `
                <div class="info-card-section">
                    <div class="info-card-section-title">⚖️ Moral Questions</div>
                    <ul class="info-card-list">
                        ${scene.moralQuestions.map(q => `<li>${q}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${scene.tension ? `
                <div class="info-card-section">
                    <div class="info-card-section-title">📈 Tension Level</div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <div style="flex: 1; height: 10px; background: var(--viz-border); border-radius: 5px; overflow: hidden;">
                            <div style="width: ${scene.tension * 10}%; height: 100%; background: ${getActColor(scene.act)}"></div>
                        </div>
                        <span style="font-weight: 600; color: var(--viz-text)">${scene.tension}/10</span>
                    </div>
                </div>
            ` : ''}
        </div>
    `;

    // Add connections
    const connections = getSceneConnections(scene.id);
    if (connections.length > 0) {
        html += '<div class="info-card-connections">';

        const foreshadowing = connections.filter(c => c.type === 'foreshadowing');
        const callbacks = connections.filter(c => c.type === 'callback');

        if (foreshadowing.length) {
            html += '<div class="connections-group"><strong>🔮 Foreshadows:</strong>';
            foreshadowing.forEach(c => {
                html += `<a href="#" class="connection-link" onclick="jumpToScene(${c.target}, event)">${c.target}. ${c.targetTitle}</a>`;
            });
            html += '</div>';
        }

        if (callbacks.length) {
            html += '<div class="connections-group"><strong>↩️ Callbacks to:</strong>';
            callbacks.forEach(c => {
                html += `<a href="#" class="connection-link" onclick="jumpToScene(${c.target}, event)">${c.target}. ${c.targetTitle}</a>`;
            });
            html += '</div>';
        }

        html += '</div>';
    }

    // Footer
    html += `
        <div class="info-card-footer">
            <button class="mark-viewed-btn ${state.viewedScenes.has(scene.id) ? 'viewed' : ''}"
                    onclick="toggleViewed(${scene.id})">
                ${state.viewedScenes.has(scene.id) ? '✓ Viewed' : 'Mark as Viewed'}
            </button>
        </div>
    `;

    infoCard.html(html);
    infoCardBackdrop.classed('visible', true);
    infoCard.classed('visible', true);

    positionInfoCard(event);
}

// Helper functions for building complex sections
function buildCharacterSection(charDev) {
    let html = '<div class="info-card-section"><div class="info-card-section-title">👥 Character Development</div>';

    for (const [charName, details] of Object.entries(charDev)) {
        html += `
            <div class="info-card-grid-item">
                <strong>${charName.charAt(0).toUpperCase() + charName.slice(1)}</strong>
                ${details.state ? `<div><em>State:</em> ${details.state}</div>` : ''}
                ${details.desires ? `<div><em>Desires:</em> ${details.desires}</div>` : ''}
                ${details.key_moment ? `<div><em>Key Moment:</em> ${details.key_moment}</div>` : ''}
            </div>
        `;
    }

    html += '</div>';
    return html;
}

function buildDialogueSection(dialogue) {
    let html = '<div class="info-card-section"><div class="info-card-section-title">💬 Key Dialogue</div>';

    dialogue.forEach(d => {
        html += `
            <div class="info-card-quote">
                "<em>${d.line}</em>"
                <div style="font-size: 0.75rem; margin-top: 0.3rem; font-style: normal;">
                    <strong>— ${d.character}</strong>
                    ${d.significance ? `<div style="color: var(--viz-text-muted); margin-top: 0.2rem;">${d.significance}</div>` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

function buildThematicSection(themes) {
    let html = '<div class="info-card-section"><div class="info-card-section-title">💭 Themes</div><ul class="info-card-list">';

    for (const [theme, description] of Object.entries(themes)) {
        html += `<li><strong>${theme.replace(/_/g, ' ')}:</strong> ${description}</li>`;
    }

    html += '</ul></div>';
    return html;
}

function buildVisualSection(visual) {
    let html = '<div class="info-card-section"><div class="info-card-section-title">🎬 Visual Storytelling</div>';

    if (visual.cameraWork) html += `<div class="info-card-section-content"><strong>Camera:</strong> ${visual.cameraWork}</div>`;
    if (visual.color_palette) html += `<div class="info-card-section-content"><strong>Colors:</strong> ${visual.color_palette}</div>`;
    if (visual.symbolism) html += `<div class="info-card-section-content"><strong>Symbolism:</strong> ${visual.symbolism}</div>`;

    html += '</div>';
    return html;
}

function buildWorldBuildingSection(world) {
    let html = '<div class="info-card-section"><div class="info-card-section-title">🌍 World-Building</div>';

    for (const [category, details] of Object.entries(world)) {
        if (typeof details === 'object' && !Array.isArray(details)) {
            html += `<div class="info-card-grid-item"><strong>${category.replace(/_/g, ' ')}:</strong>`;
            for (const [key, value] of Object.entries(details)) {
                html += `<div style="font-size: 0.75rem; margin-top: 0.2rem;"><em>${key.replace(/_/g, ' ')}:</em> ${value}</div>`;
            }
            html += '</div>';
        }
    }

    html += '</div>';
    return html;
}

function buildEmotionalSection(emotions) {
    let html = '<div class="info-card-section"><div class="info-card-section-title">❤️ Emotional Beats</div><ul class="info-card-list">';

    for (const [emotion, description] of Object.entries(emotions)) {
        html += `<li><strong>${emotion.replace(/_/g, ' ')}:</strong> ${description}</li>`;
    }

    html += '</ul></div>';
    return html;
}

function hideInfoCard() {
    if (infoCard) {
        infoCard.classed('visible', false);
    }
    if (infoCardBackdrop) {
        infoCardBackdrop.classed('visible', false);
    }
    state.lockedNode = null;
    hideTooltip();
    unhighlightAll();
}

function positionInfoCard(event) {
    if (!infoCard) return;

    const cardNode = infoCard.node();
    const cardWidth = cardNode.offsetWidth || 400;
    const cardHeight = cardNode.offsetHeight || 400;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left, top;

    if (event && event.clientX !== undefined) {
        left = event.clientX - cardWidth / 2;
        top = event.clientY - cardHeight / 2;
    } else {
        left = (viewportWidth - cardWidth) / 2;
        top = (viewportHeight - cardHeight) / 2;
    }

    left = Math.max(10, Math.min(left, viewportWidth - cardWidth - 10));
    top = Math.max(10, Math.min(top, viewportHeight - cardHeight - 10));

    infoCard
        .style('left', left + 'px')
        .style('top', top + 'px');
}

function getSceneConnections(sceneId) {
    const scene = state.scenes.find(s => s.id === sceneId);
    if (!scene) return [];

    const connections = [];

    if (scene.foreshadowing) {
        scene.foreshadowing.forEach(targetId => {
            const target = state.scenes.find(s => s.id === targetId);
            if (target) {
                connections.push({
                    type: 'foreshadowing',
                    target: targetId,
                    targetTitle: target.title
                });
            }
        });
    }

    if (scene.callbacks) {
        scene.callbacks.forEach(targetId => {
            const target = state.scenes.find(s => s.id === targetId);
            if (target) {
                connections.push({
                    type: 'callback',
                    target: targetId,
                    targetTitle: target.title
                });
            }
        });
    }

    return connections;
}

window.hideInfoCard = hideInfoCard;
window.toggleViewed = toggleViewed;
window.toggleNodeExpansionFromCard = function (nodeId) {
    // Find the scene data
    const scene = state.scenes.find(s => s.id === nodeId) ||
        state.scenes.flatMap(s => s.subScenes || []).find(s => s.id === nodeId);

    if (scene) {
        toggleNodeExpansion({id: nodeId, hasChildren: true});
        // Close the info card since it will be recreated with updated state
        hideInfoCard();
    }
};

// ============================================
// SEARCH
// ============================================

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchCounter = document.getElementById('search-counter');

    searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        performSearch();
    });

    // Keyboard shortcut
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchInput.blur();
            state.searchQuery = '';
            performSearch();
        }
    });
}

function performSearch() {
    const query = state.searchQuery;

    if (!query) {
        state.searchMatches = [];
        updateSearchUI();
        return;
    }

    // Search in all nodes (including hierarchical ones)
    state.searchMatches = [];

    // Helper to check if a node matches
    const matchesQuery = (node) => {
        const title = (node.title || '').toLowerCase();
        const summary = (node.summary || '').toLowerCase();
        const description = (node.description || '').toLowerCase();
        const focus = (node.focus || '').toLowerCase();

        return title.includes(query) ||
            summary.includes(query) ||
            description.includes(query) ||
            focus.includes(query) ||
            (node.symbols && node.symbols.some(s => s.toLowerCase().includes(query))) ||
            (node.themes && node.themes.some(t => t.toLowerCase().includes(query))) ||
            (node.types && node.types.some(t => t.toLowerCase().includes(query)));
    };

    // Search main scenes
    state.scenes.forEach(scene => {
        if (matchesQuery(scene)) {
            state.searchMatches.push(scene.id);
        }

        // Search sub-scenes
        if (scene.subScenes) {
            scene.subScenes.forEach(subScene => {
                if (matchesQuery(subScene)) {
                    state.searchMatches.push(subScene.id);
                }

                // Search sub-sub-scenes
                if (subScene.subScenes) {
                    subScene.subScenes.forEach(subSubScene => {
                        if (matchesQuery(subSubScene)) {
                            state.searchMatches.push(subSubScene.id);
                        }
                    });
                }
            });
        }
    });

    updateSearchUI();
}

function updateSearchUI() {
    const counter = document.getElementById('search-counter');

    if (state.searchMatches.length > 0) {
        counter.textContent = `${state.searchMatches.length} found`;
        counter.classList.add('visible', 'has-results');
        counter.classList.remove('no-results');
    } else if (state.searchQuery) {
        counter.textContent = 'No results';
        counter.classList.add('visible', 'no-results');
        counter.classList.remove('has-results');
    } else {
        counter.classList.remove('visible', 'has-results', 'no-results');
    }

    // Highlight matching nodes
    if (nodeGroup) {
        nodeGroup.selectAll('.node')
            .classed('search-match', d => state.searchMatches.includes(d.data.id))
            .classed('search-dimmed', d => state.searchQuery && !state.searchMatches.includes(d.data.id));
    }
}

// ============================================
// LEGEND
// ============================================

function initLegend() {
    const container = d3.select('#legend-container');

    // Count scenes by act
    const actDetails = {
        act1: {count: state.scenes.filter(s => s.act === 'act1').length},
        act2: {count: state.scenes.filter(s => s.act === 'act2').length},
        act3: {count: state.scenes.filter(s => s.act === 'act3').length}
    };

    // Build header with progress bar
    const header = container.append('div')
        .attr('class', 'legend-header');

    header.append('h6')
        .attr('class', 'legend-title')
        .text('📊 Progress');

    const progressInline = header.append('div')
        .attr('class', 'progress-inline')
        .on('mouseenter', function (event) {
            showProgressTooltip(event);
        })
        .on('mouseleave', function () {
            hideProgressTooltip();
        })
        .on('click', function () {
            showProgressModal();
        });

    progressInline.append('div')
        .attr('class', 'progress-bar-wrapper');

    progressInline.append('div')
        .attr('class', 'progress-text')
        .text('0/40');

    // Build legend grid
    const grid = container.append('div')
        .attr('class', 'legend-grid');

    // Section label for Acts
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Acts:');

    // Acts - clickable for filtering
    Object.entries(CONFIG.ACT_COLORS).forEach(([actId, color]) => {
        const name = CONFIG.ACT_NAMES[actId];
        const item = grid.append('div')
            .attr('class', 'legend-item')
            .attr('data-act', actId)
            .attr('title', `Click to filter: ${name}`)
            .on('click', () => toggleActFilter(actId));

        item.append('span')
            .attr('class', 'legend-color')
            .style('background-color', color);

        item.append('span')
            .attr('class', 'legend-icon')
            .text(CONFIG.ACT_ICONS[actId]);

        item.append('span')
            .attr('class', 'legend-text')
            .html(`${name.split(':')[0]} <small>(${actDetails[actId].count})</small>`);
    });

    // Separator
    grid.append('div').attr('class', 'legend-separator');

    // Section label for Connections
    grid.append('span')
        .attr('class', 'legend-section-label')
        .text('Connection Lines:');

    // Connection types - clickable for highlighting
    const connectionTypes = [
        {
            key: 'foreshadowing',
            label: 'Foreshadowing',
            color: '#5a8b5a',
            style: 'solid',
            desc: 'Click to highlight: scenes that set up later events'
        },
        {
            key: 'callback',
            label: 'Callback',
            color: '#8b5a8b',
            style: 'dashed',
            desc: 'Click to highlight: scenes that reference earlier events'
        }
    ];

    connectionTypes.forEach(conn => {
        const item = grid.append('div')
            .attr('class', 'legend-item legend-connection-item')
            .attr('data-connection', conn.key)
            .attr('title', conn.desc)
            .on('click', () => toggleConnectionFilter(conn.key));

        item.append('span')
            .attr('class', 'legend-line')
            .style('background-color', conn.color);

        item.append('span')
            .attr('class', 'legend-text')
            .text(conn.label);
    });

    updateProgressUI();
}

function toggleActFilter(actId) {
    if (state.activeActs.has(actId)) {
        state.activeActs.delete(actId);
    } else {
        state.activeActs.add(actId);
    }

    // Update legend item appearance
    d3.selectAll('.legend-item[data-act]')
        .classed('active', function () {
            return state.activeActs.has(this.dataset.act);
        });

    // Apply filters
    applyNodeFilters();
}

function toggleConnectionFilter(connectionKey) {
    if (state.activeConnections.has(connectionKey)) {
        state.activeConnections.delete(connectionKey);
    } else {
        state.activeConnections.add(connectionKey);
    }

    // Update legend item appearance
    d3.selectAll('.legend-connection-item')
        .classed('active', function () {
            return state.activeConnections.has(this.dataset.connection);
        });

    // Apply connection highlighting
    applyConnectionFilters();
}

function applyNodeFilters() {
    if (!nodeGroup) return;

    const hasActFilter = state.activeActs.size > 0;

    if (!hasActFilter) {
        // No filters - show all
        nodeGroup.selectAll('.node').classed('filtered', false);
    } else {
        nodeGroup.selectAll('.node')
            .classed('filtered', d => !state.activeActs.has(d.data.act));
    }
}

function applyConnectionFilters() {
    if (!linkGroup) return;

    const hasConnectionFilter = state.activeConnections.size > 0;

    if (!hasConnectionFilter) {
        // No filters - reset all links
        linkGroup.selectAll('.link')
            .classed('highlighted', false)
            .classed('dimmed', false);
        nodeGroup.selectAll('.node')
            .classed('connection-highlighted', false)
            .classed('connection-dimmed', false);
        return;
    }

    // Find all scene IDs that have the selected connection types
    const highlightedSceneIds = new Set();

    nodeGroup.selectAll('.node').each(function (d) {
        if (!d.data.id) return;

        let hasMatchingConnection = false;

        // Check foreshadowing
        if (state.activeConnections.has('foreshadowing') && d.data.foreshadowing && d.data.foreshadowing.length > 0) {
            hasMatchingConnection = true;
            d.data.foreshadowing.forEach(id => highlightedSceneIds.add(id));
        }

        // Check callback
        if (state.activeConnections.has('callback') && d.data.callbacks && d.data.callbacks.length > 0) {
            hasMatchingConnection = true;
            d.data.callbacks.forEach(id => highlightedSceneIds.add(id));
        }

        if (hasMatchingConnection) {
            highlightedSceneIds.add(d.data.id);
        }
    });

    // Highlight matching links
    linkGroup.selectAll('.link')
        .classed('highlighted', function (d) {
            if (state.activeConnections.has('foreshadowing') && d.type === 'foreshadowing') return true;
            if (state.activeConnections.has('callback') && d.type === 'callback') return true;
            return false;
        })
        .classed('dimmed', function (d) {
            if (state.activeConnections.has('foreshadowing') && d.type === 'foreshadowing') return false;
            if (state.activeConnections.has('callback') && d.type === 'callback') return false;
            return true;
        });

    // Highlight matching nodes
    nodeGroup.selectAll('.node')
        .classed('connection-highlighted', d => highlightedSceneIds.has(d.data.id))
        .classed('connection-dimmed', d => !highlightedSceneIds.has(d.data.id));
}

// ============================================
// PROGRESS UI
// ============================================

function initProgressUI() {
    updateProgressUI();
}

function updateProgressUI() {
    const total = state.scenes.length;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    const progressWrapper = document.querySelector('.progress-bar-wrapper');
    const progressText = document.querySelector('.progress-text');

    if (!progressWrapper) return;

    // Count by act
    const viewedByAct = {act1: 0, act2: 0, act3: 0};
    const totalByAct = {
        act1: state.scenes.filter(s => s.act === 'act1').length,
        act2: state.scenes.filter(s => s.act === 'act2').length,
        act3: state.scenes.filter(s => s.act === 'act3').length
    };

    state.viewedScenes.forEach(id => {
        const scene = state.scenes.find(s => s.id === id);
        if (scene) {
            viewedByAct[scene.act]++;
        }
    });

    // Build progress segments
    progressWrapper.innerHTML = '';
    Object.entries(viewedByAct).forEach(([actId, count]) => {
        const actTotal = totalByAct[actId];
        const completionPercent = (count / actTotal) * 100;
        const actColor = getActColor(actId);

        // Convert hex color to RGB for rgba usage
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : {r: 100, g: 100, b: 100};
        };

        const rgb = hexToRgb(actColor);

        const segment = document.createElement('div');
        segment.className = 'progress-bar-segment';
        segment.style.width = `${(actTotal / total) * 100}%`;
        segment.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`;

        const fill = document.createElement('div');
        fill.className = 'progress-inner-fill';
        fill.style.width = `${completionPercent}%`;
        fill.style.backgroundColor = actColor;
        segment.appendChild(fill);

        progressWrapper.appendChild(segment);
    });

    if (progressText) {
        progressText.textContent = `${viewed}/${total}`;
    }
}

// ============================================
// PROGRESS TOOLTIP (HOVER)
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

    const total = state.scenes.length;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Count by act
    const viewedByAct = {act1: 0, act2: 0, act3: 0};
    const totalByAct = {
        act1: state.scenes.filter(s => s.act === 'act1').length,
        act2: state.scenes.filter(s => s.act === 'act2').length,
        act3: state.scenes.filter(s => s.act === 'act3').length
    };

    state.viewedScenes.forEach(id => {
        const scene = state.scenes.find(s => s.id === id);
        if (scene) {
            viewedByAct[scene.act]++;
        }
    });

    let tooltipHTML = `
        <div class="progress-tooltip-title">📊 Progress Summary</div>
        <div class="progress-tooltip-content">
    `;

    // Acts section
    Object.entries(CONFIG.ACT_NAMES).forEach(([actId, name]) => {
        const count = viewedByAct[actId];
        const actTotal = totalByAct[actId];
        const actPercentage = Math.round((count / actTotal) * 100);

        tooltipHTML += `
            <div class="progress-tooltip-section" style="border-color: ${getActColor(actId)}">
                <div class="progress-tooltip-section-name">
                    <span class="progress-tooltip-section-icon">${CONFIG.ACT_ICONS[actId]}</span>
                    <span>${name.split('(')[0].trim()}</span>
                </div>
                <div class="progress-tooltip-section-count" style="color: ${getActColor(actId)}">
                    ${count}/${actTotal} (${actPercentage}%)
                </div>
            </div>
        `;
    });

    tooltipHTML += `
        </div>
        <div class="progress-tooltip-total">
            <span>Total: ${viewed}/${total} scenes</span>
            <span class="progress-tooltip-percentage">${percentage}%</span>
        </div>
        <div class="progress-tooltip-hint">Click for detailed view</div>
    `;

    progressTooltip.html(tooltipHTML);

    // Position tooltip
    const rect = event.target.getBoundingClientRect();
    const tooltipNode = progressTooltip.node();
    tooltipNode.style.display = 'block';
    const tooltipWidth = tooltipNode.offsetWidth || 400;
    const tooltipHeight = tooltipNode.offsetHeight || 300;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    let top = rect.bottom + 10;

    // Adjust if out of bounds
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
    }
    if (top + tooltipHeight > window.innerHeight - 10) {
        top = rect.top - tooltipHeight - 10;
    }

    progressTooltip
        .style('left', left + 'px')
        .style('top', top + 'px')
        .classed('visible', true);
}

function hideProgressTooltip() {
    if (progressTooltip) {
        progressTooltip.classed('visible', false);
    }
}

// ============================================
// PROGRESS MODAL (CLICK)
// ============================================

let progressModal = null;
let progressModalBackdrop = null;

function createProgressModal() {
    if (!progressModalBackdrop) {
        progressModalBackdrop = d3.select('body')
            .append('div')
            .attr('class', 'progress-modal-backdrop')
            .on('click', closeProgressModal);
    }

    progressModal = d3.select('body')
        .append('div')
        .attr('class', 'progress-modal')
        .attr('id', 'progress-modal');

    return progressModal;
}

function showProgressModal() {
    hideProgressTooltip();
    if (!progressModal) createProgressModal();

    const total = state.scenes.length;
    const viewed = state.viewedScenes.size;
    const percentage = Math.round((viewed / total) * 100);

    // Group scenes by act
    const scenesByAct = {
        act1: state.scenes.filter(s => s.act === 'act1'),
        act2: state.scenes.filter(s => s.act === 'act2'),
        act3: state.scenes.filter(s => s.act === 'act3')
    };

    let modalHTML = `
        <div class="progress-modal-header">
            <h5 class="progress-modal-title">📊 Avatar Timeline Progress</h5>
            <div class="progress-modal-summary">
                <span class="progress-modal-count">${viewed}/${total} viewed (${percentage}%)</span>
            </div>
            <button class="progress-modal-close" onclick="closeProgressModal()">&times;</button>
        </div>
        <div class="progress-modal-body">
    `;

    // Add sections for each act
    Object.entries(scenesByAct).forEach(([actId, scenes]) => {
        const viewedCount = scenes.filter(s => state.viewedScenes.has(s.id)).length;

        modalHTML += `
            <div class="progress-section">
                <div class="progress-section-header" style="border-color: ${getActColor(actId)}">
                    <span class="progress-section-icon">${CONFIG.ACT_ICONS[actId]}</span>
                    <h6 class="progress-section-title">${CONFIG.ACT_NAMES[actId].split('(')[0]}</h6>
                    <span class="progress-section-count">${viewedCount}/${scenes.length}</span>
                </div>
                <div class="progress-section-scenes">
        `;

        scenes.forEach(scene => {
            const isViewed = state.viewedScenes.has(scene.id);
            modalHTML += `
                <div class="progress-item ${isViewed ? 'viewed' : ''}">
                    <input type="checkbox" ${isViewed ? 'checked' : ''}
                           onchange="toggleViewed(${scene.id})">
                    <span class="progress-item-number">${scene.id}.</span>
                    <label class="progress-item-label" onclick="jumpToSceneFromModal(${scene.id}, event)">
                        ${scene.title}
                    </label>
                </div>
            `;
        });

        modalHTML += `
                </div>
            </div>
        `;
    });

    modalHTML += `
        </div>
        <div class="progress-modal-footer">
            <button class="btn btn-sm btn-secondary" onclick="closeProgressModal()">Close</button>
        </div>
    `;

    progressModal.html(modalHTML);
    progressModalBackdrop.classed('visible', true);
    progressModal.classed('visible', true);
}

function closeProgressModal() {
    if (progressModal) {
        progressModal.classed('visible', false);
    }
    if (progressModalBackdrop) {
        progressModalBackdrop.classed('visible', false);
    }
}

window.closeProgressModal = closeProgressModal;
window.jumpToSceneFromModal = function (sceneId, event) {
    if (event) event.preventDefault();
    closeProgressModal();
    const node = allNodes.find(n => n.data.id === sceneId);
    if (node) {
        state.lockedNode = node;
        state.showingFromModal = true;
        showInfoCard(node);
        highlightConnections(node);
    }
};

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Window resize
    window.addEventListener('resize', () => {
        if (state.lockedNode) {
            positionInfoCard();
        }
    });
}

// ============================================
// PUBLIC API
// ============================================

window.jumpToScene = function (sceneId, event) {
    if (event) event.preventDefault();

    const node = allNodes.find(n => n.data.id === sceneId);
    if (node) {
        state.lockedNode = node;
        showInfoCard(node);
        highlightConnections(node);
    }
};

// ============================================
// START
// ============================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}