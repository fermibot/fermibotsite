// Enhanced Interactive Seal Distribution Map using D3.js
// Professional world map with advanced visualization features

class SealDistributionMap {
    constructor() {
        this.margin = { top: 20, right: 20, bottom: 40, left: 20 };
        this.selectedSpecies = null;
        this.selectedFamily = 'all';
        this.viewMode = 'points'; // points, heatmap, ranges
        this.tooltip = null;
        this.projection = null;
        this.path = null;
        this.svg = null;
        this.mapGroup = null;
        this.zoom = null;
        this.worldData = null;
        this.currentTransform = d3.zoomIdentity;
    }

    async initialize() {
        await this.createMap();
        this.setupControls();
        this.createLegend();
        this.createStatistics();
        this.showAllSeals();
        this.addKeyboardControls();
    }

    async createMap() {
        const container = d3.select('#mapContainer');
        this.width = Math.min(container.node().getBoundingClientRect().width, 1600);
        this.height = Math.min(this.width * 0.55, 800);

        // Create SVG with better styling
        this.svg = container.append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('class', 'seal-map')
            .style('background', 'linear-gradient(180deg, #e6f3ff 0%, #f0f8ff 100%)');

        // Add definition for gradients and filters
        const defs = this.svg.append('defs');

        // Glow filter for selected points
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

        // Create projection with better settings
        this.projection = d3.geoNaturalEarth1()
            .scale(this.width / 5.5)
            .translate([this.width / 2, this.height / 2])
            .precision(0.1);

        this.path = d3.geoPath().projection(this.projection);

        // Add zoom with constraints
        this.zoom = d3.zoom()
            .scaleExtent([1, 12])
            .translateExtent([[0, 0], [this.width, this.height]])
            .on('zoom', (event) => {
                this.currentTransform = event.transform;
                this.mapGroup.attr('transform', event.transform);
                this.updatePointSizes(event.transform.k);
            });

        this.svg.call(this.zoom);

        // Create layers
        this.mapGroup = this.svg.append('g').attr('class', 'map-container');
        this.oceanLayer = this.mapGroup.append('g').attr('class', 'ocean-layer');
        this.landLayer = this.mapGroup.append('g').attr('class', 'land-layer');
        this.graticuleLayer = this.mapGroup.append('g').attr('class', 'graticule-layer');
        this.heatmapLayer = this.mapGroup.append('g').attr('class', 'heatmap-layer');
        this.distributionLayer = this.mapGroup.append('g').attr('class', 'distribution-layer');
        this.labelLayer = this.mapGroup.append('g').attr('class', 'label-layer');

        // Create tooltip with better styling
        this.tooltip = d3.select('body').append('div')
            .attr('class', 'map-tooltip')
            .style('opacity', 0);

        // Load and draw world map
        await this.loadEnhancedWorldMap();

        // Add loading indicator
        this.hideLoadingIndicator();
    }

    async loadEnhancedWorldMap() {
        // Draw ocean background
        this.oceanLayer.append('rect')
            .attr('class', 'ocean')
            .attr('x', -this.width * 2)
            .attr('y', -this.height * 2)
            .attr('width', this.width * 4)
            .attr('height', this.height * 4)
            .attr('fill', '#d4e9f7')
            .attr('opacity', 0.3);

        // Create detailed world map using D3's built-in data
        const worldData = {
            type: "FeatureCollection",
            features: this.createDetailedWorldMap()
        };

        // Draw countries with better styling
        this.landLayer.selectAll('path.country')
            .data(worldData.features)
            .join('path')
            .attr('class', 'country')
            .attr('d', this.path)
            .attr('fill', '#e8e8e8')
            .attr('stroke', '#666')
            .attr('stroke-width', 0.5)
            .attr('vector-effect', 'non-scaling-stroke')
            .on('mouseover', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', '#d0d0d0');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', '#e8e8e8');
            });

        // Draw graticule with style
        const graticule = d3.geoGraticule()
            .step([30, 30]);

        this.graticuleLayer.append('path')
            .datum(graticule)
            .attr('class', 'graticule')
            .attr('d', this.path)
            .attr('fill', 'none')
            .attr('stroke', '#b0c4de')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', '2,2')
            .attr('opacity', 0.6)
            .attr('vector-effect', 'non-scaling-stroke');

        // Add polar circles
        this.addPolarCircles();

        // Add ocean labels
        this.addOceanLabels();
    }

    createDetailedWorldMap() {
        // More detailed continent shapes
        const continents = [
            // North America
            {
                type: "Feature",
                properties: { name: "North America", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-170, 72], [-170, 52], [-168, 65], [-160, 70], [-145, 70],
                        [-140, 69], [-130, 70], [-125, 72], [-120, 70], [-110, 60],
                        [-105, 50], [-100, 49], [-95, 49], [-90, 48], [-85, 46],
                        [-82, 43], [-80, 40], [-75, 38], [-72, 42], [-70, 45],
                        [-65, 47], [-60, 50], [-55, 52], [-55, 60], [-60, 65],
                        [-70, 70], [-80, 72], [-90, 73], [-100, 72], [-120, 72],
                        [-140, 73], [-160, 72], [-170, 72]
                    ]]
                }
            },
            // South America
            {
                type: "Feature",
                properties: { name: "South America", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-80, 12], [-75, 10], [-70, 5], [-65, 0], [-60, -5],
                        [-57, -10], [-55, -20], [-52, -30], [-55, -40],
                        [-60, -45], [-65, -50], [-68, -54], [-72, -55],
                        [-75, -52], [-77, -45], [-80, -35], [-78, -25],
                        [-75, -15], [-72, -5], [-70, 0], [-72, 5],
                        [-75, 8], [-78, 10], [-80, 12]
                    ]]
                }
            },
            // Europe
            {
                type: "Feature",
                properties: { name: "Europe", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-10, 71], [5, 71], [15, 70], [25, 69], [30, 70],
                        [40, 72], [50, 70], [60, 68], [65, 66], [68, 65],
                        [69, 60], [65, 55], [60, 50], [55, 47], [50, 45],
                        [45, 42], [40, 40], [35, 36], [30, 36], [25, 38],
                        [20, 40], [15, 43], [10, 45], [5, 48], [0, 50],
                        [-5, 53], [-8, 56], [-10, 60], [-10, 71]
                    ]]
                }
            },
            // Africa
            {
                type: "Feature",
                properties: { name: "Africa", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-17, 36], [-10, 35], [0, 37], [10, 37], [15, 35],
                        [20, 33], [25, 31], [30, 31], [35, 30], [40, 25],
                        [43, 20], [48, 15], [50, 10], [51, 0], [50, -10],
                        [48, -20], [45, -28], [40, -33], [35, -35], [30, -34],
                        [25, -33], [20, -30], [15, -25], [10, -20], [8, -10],
                        [10, 0], [12, 10], [10, 15], [5, 18], [0, 20],
                        [-5, 18], [-10, 15], [-15, 20], [-17, 28], [-17, 36]
                    ]]
                }
            },
            // Asia
            {
                type: "Feature",
                properties: { name: "Asia", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [40, 72], [50, 75], [60, 77], [70, 78], [80, 77],
                        [90, 75], [100, 73], [110, 70], [120, 65], [130, 60],
                        [140, 55], [145, 50], [150, 45], [155, 42], [160, 45],
                        [170, 50], [178, 55], [180, 60], [180, 70], [170, 72],
                        [160, 73], [150, 72], [140, 70], [130, 68], [120, 70],
                        [110, 73], [100, 75], [90, 77], [80, 78], [70, 80],
                        [60, 78], [50, 76], [40, 72]
                    ]]
                }
            },
            // Asia South
            {
                type: "Feature",
                properties: { name: "Asia South", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [40, 40], [50, 45], [60, 42], [70, 40], [80, 35],
                        [88, 28], [92, 22], [95, 15], [100, 10], [103, 5],
                        [105, 0], [108, -5], [110, -8], [105, -10], [100, -8],
                        [95, -5], [90, 0], [85, 5], [80, 10], [75, 15],
                        [70, 20], [65, 25], [60, 28], [55, 30], [50, 32],
                        [45, 35], [40, 40]
                    ]]
                }
            },
            // Australia
            {
                type: "Feature",
                properties: { name: "Australia", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [113, -10], [125, -11], [135, -12], [142, -10],
                        [148, -15], [153, -25], [154, -35], [151, -40],
                        [145, -43], [138, -44], [130, -43], [123, -40],
                        [118, -35], [115, -30], [113, -22], [112, -15], [113, -10]
                    ]]
                }
            },
            // New Zealand
            {
                type: "Feature",
                properties: { name: "New Zealand", color: "#e8e8e8" },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [
                        [[[166, -34], [168, -34], [170, -36], [172, -38], [174, -41], [172, -42], [169, -41], [167, -39], [166, -36], [166, -34]]],
                        [[[168, -41], [170, -41], [172, -43], [174, -46], [172, -47], [170, -46], [168, -44], [168, -41]]]
                    ]
                }
            },
            // Antarctica
            {
                type: "Feature",
                properties: { name: "Antarctica", color: "#f0f0f0" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-180, -60], [180, -60], [180, -90], [-180, -90], [-180, -60]
                    ]]
                }
            },
            // Greenland
            {
                type: "Feature",
                properties: { name: "Greenland", color: "#e8e8e8" },
                geometry: {
                    type: "Polygon",
                    coordinates: [[
                        [-73, 83], [-70, 83], [-65, 82], [-60, 80], [-55, 78],
                        [-50, 75], [-45, 72], [-42, 68], [-40, 65], [-40, 60],
                        [-42, 62], [-45, 65], [-50, 68], [-53, 72], [-56, 76],
                        [-60, 78], [-65, 80], [-70, 82], [-73, 83]
                    ]]
                }
            }
        ];
        return continents;
    }

    addPolarCircles() {
        // Arctic Circle
        const arcticCircle = d3.geoCircle()
            .center([0, 90])
            .radius(23.5);

        this.graticuleLayer.append('path')
            .datum(arcticCircle())
            .attr('d', this.path)
            .attr('fill', 'none')
            .attr('stroke', '#4682b4')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.7)
            .attr('vector-effect', 'non-scaling-stroke');

        // Antarctic Circle
        const antarcticCircle = d3.geoCircle()
            .center([0, -90])
            .radius(23.5);

        this.graticuleLayer.append('path')
            .datum(antarcticCircle())
            .attr('d', this.path)
            .attr('fill', 'none')
            .attr('stroke', '#4682b4')
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.7)
            .attr('vector-effect', 'non-scaling-stroke');
    }

    addOceanLabels() {
        const oceans = [
            { name: "Pacific Ocean", coords: [-140, 0] },
            { name: "Atlantic Ocean", coords: [-30, 20] },
            { name: "Indian Ocean", coords: [75, -20] },
            { name: "Arctic Ocean", coords: [0, 85] },
            { name: "Southern Ocean", coords: [0, -70] }
        ];

        oceans.forEach(ocean => {
            const [x, y] = this.projection(ocean.coords);
            this.labelLayer.append('text')
                .attr('x', x)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .attr('class', 'ocean-label')
                .style('font-size', '14px')
                .style('fill', '#4682b4')
                .style('opacity', 0.4)
                .style('font-style', 'italic')
                .style('pointer-events', 'none')
                .text(ocean.name);
        });
    }

    updatePointSizes(scale) {
        this.distributionLayer.selectAll('circle.distribution')
            .attr('r', d => (Math.sqrt(d.intensity) * 2.5) / Math.sqrt(scale));
    }

    hideLoadingIndicator() {
        d3.select('#loadingIndicator').style('display', 'none');
    }

    showAllSeals() {
        // Combine all seal types
        const allSeals = [
            ...sealData.trueSeals,
            ...sealData.earedSeals,
            ...sealData.walrus
        ];

        // Filter by family if selected
        let filteredSeals = allSeals;
        if (this.selectedFamily !== 'all') {
            filteredSeals = allSeals.filter(s => s.family === this.selectedFamily);
        }

        this.clearDistribution();

        if (this.viewMode === 'heatmap') {
            this.drawHeatmap(filteredSeals);
        } else if (this.viewMode === 'ranges') {
            this.drawRanges(filteredSeals);
        } else {
            this.drawEnhancedDistributionPoints(filteredSeals);
        }
    }

    drawEnhancedDistributionPoints(species) {
        const allPoints = [];

        species.forEach(seal => {
            seal.distribution.forEach(point => {
                allPoints.push({
                    ...point,
                    species: seal.commonName,
                    scientificName: seal.scientificName,
                    family: seal.family,
                    population: seal.population,
                    status: seal.conservationStatus,
                    characteristics: seal.characteristics,
                    id: seal.id
                });
            });
        });

        // Group nearby points for clustering
        const clusteredPoints = this.clusterPoints(allPoints);

        // Draw outer glow circles
        const glowCircles = this.distributionLayer.selectAll('circle.glow')
            .data(clusteredPoints)
            .join('circle')
            .attr('class', 'glow')
            .attr('cx', d => {
                const [x, y] = this.projection([d.lon, d.lat]);
                return x;
            })
            .attr('cy', d => {
                const [x, y] = this.projection([d.lon, d.lat]);
                return y;
            })
            .attr('r', d => Math.sqrt(d.intensity) * 4)
            .attr('fill', d => conservationColors[d.status] || '#667eea')
            .attr('opacity', 0.15)
            .attr('stroke', 'none')
            .style('pointer-events', 'none');

        // Add pulsing animation to high-intensity points
        glowCircles.filter(d => d.intensity >= 8)
            .attr('class', 'glow pulse');

        // Draw main distribution circles
        const circles = this.distributionLayer.selectAll('circle.distribution')
            .data(clusteredPoints)
            .join('circle')
            .attr('class', d => `distribution ${d.family.toLowerCase()}`)
            .attr('cx', d => {
                const [x, y] = this.projection([d.lon, d.lat]);
                return x;
            })
            .attr('cy', d => {
                const [x, y] = this.projection([d.lon, d.lat]);
                return y;
            })
            .attr('r', d => Math.sqrt(d.intensity) * 2.5)
            .attr('fill', d => conservationColors[d.status] || '#667eea')
            .attr('opacity', 0.75)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .style('transition', 'all 0.3s ease');

        // Enhanced interactivity
        circles
            .on('mouseover', (event, d) => {
                // Highlight circle
                d3.select(event.currentTarget)
                    .transition()
                    .duration(150)
                    .attr('r', Math.sqrt(d.intensity) * 3.5)
                    .attr('opacity', 1)
                    .attr('stroke-width', 3)
                    .style('filter', 'url(#glow)');

                // Dim other circles
                this.distributionLayer.selectAll('circle.distribution')
                    .filter(function() { return this !== event.currentTarget; })
                    .transition()
                    .duration(150)
                    .attr('opacity', 0.3);

                // Show enhanced tooltip
                this.showEnhancedTooltip(event, d);
            })
            .on('mouseout', (event, d) => {
                // Reset circle
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr('r', Math.sqrt(d.intensity) * 2.5)
                    .attr('opacity', 0.75)
                    .attr('stroke-width', 2)
                    .style('filter', 'none');

                // Restore other circles
                this.distributionLayer.selectAll('circle.distribution')
                    .transition()
                    .duration(200)
                    .attr('opacity', 0.75);

                // Hide tooltip
                this.tooltip.transition()
                    .duration(300)
                    .style('opacity', 0);
            })
            .on('click', (event, d) => {
                event.stopPropagation();
                this.showSpeciesDetails(d.species);
                this.highlightSpeciesOnMap(d.id);
            });

        // Animate entrance with stagger
        circles
            .attr('r', 0)
            .attr('opacity', 0)
            .transition()
            .duration(600)
            .delay((d, i) => i * 5)
            .attr('r', d => Math.sqrt(d.intensity) * 2.5)
            .attr('opacity', 0.75);

        glowCircles
            .attr('r', 0)
            .attr('opacity', 0)
            .transition()
            .duration(600)
            .delay((d, i) => i * 5)
            .attr('r', d => Math.sqrt(d.intensity) * 4)
            .attr('opacity', 0.15);

        // Add CSS animation for pulse effect
        this.addPulseAnimation();
    }

    clusterPoints(points) {
        // Simple clustering: if points are very close, combine them
        const clustered = [];
        const processed = new Set();

        points.forEach((point, i) => {
            if (processed.has(i)) return;

            let cluster = { ...point, count: 1 };
            processed.add(i);

            // Check for nearby points (within 5 degrees)
            points.forEach((otherPoint, j) => {
                if (i !== j && !processed.has(j)) {
                    const distance = Math.sqrt(
                        Math.pow(point.lat - otherPoint.lat, 2) +
                        Math.pow(point.lon - otherPoint.lon, 2)
                    );

                    if (distance < 5 && point.species === otherPoint.species) {
                        cluster.intensity = Math.max(cluster.intensity, otherPoint.intensity);
                        cluster.count++;
                        processed.add(j);
                    }
                }
            });

            clustered.push(cluster);
        });

        return clustered;
    }

    showEnhancedTooltip(event, d) {
        this.tooltip.transition()
            .duration(200)
            .style('opacity', 1);

        const statusColor = conservationColors[d.status] || '#667eea';
        const familyBadge = d.family === 'Phocidae' ? '🦭 True Seal' :
                           d.family === 'Otariidae' ? '🦭 Eared Seal' : '🦭 Walrus';

        this.tooltip.html(`
            <div style="max-width: 300px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="font-size: 16px; color: ${statusColor};">${d.species}</strong>
                    ${d.count > 1 ? `<span style="background: #f0f0f0; padding: 2px 8px; border-radius: 10px; font-size: 11px;">×${d.count}</span>` : ''}
                </div>
                <p style="margin: 4px 0; font-style: italic; color: #666; font-size: 13px;">${d.scientificName}</p>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                    <div><strong>Region:</strong><br>${d.region}</div>
                    <div><strong>Population:</strong><br>${d.population.toLocaleString()}</div>
                    <div><strong>Family:</strong><br>${familyBadge}</div>
                    <div><strong>Status:</strong><br><span style="color: ${statusColor}; font-weight: bold;">${d.status}</span></div>
                </div>
                <hr style="margin: 8px 0; border: none; border-top: 1px solid #ddd;">
                <div style="font-size: 12px; color: #666;">
                    <strong>Size:</strong> ${d.characteristics.length} | ${d.characteristics.weight}<br>
                    <strong>Diet:</strong> ${d.characteristics.diet}
                </div>
                <div style="margin-top: 8px; font-size: 11px; color: #999; text-align: center;">
                    Click to see species details
                </div>
            </div>
        `)
            .style('left', (event.pageX + 15) + 'px')
            .style('top', (event.pageY - 15) + 'px');
    }

    drawHeatmap(species) {
        // Create heatmap using density estimation
        const allPoints = [];
        species.forEach(seal => {
            seal.distribution.forEach(point => {
                allPoints.push({
                    coords: [point.lon, point.lat],
                    intensity: point.intensity,
                    status: seal.conservationStatus
                });
            });
        });

        // Create hexbin for density
        const width = this.svg.attr('width');
        const height = this.svg.attr('height');

        allPoints.forEach(point => {
            const [x, y] = this.projection(point.coords);
            const radius = point.intensity * 10;

            this.heatmapLayer.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', radius)
                .attr('fill', conservationColors[point.status] || '#667eea')
                .attr('opacity', 0.1)
                .style('pointer-events', 'none');
        });
    }

    drawRanges(species) {
        // Draw range polygons for each species
        species.forEach(seal => {
            if (seal.distribution.length < 3) return;

            // Create convex hull for range
            const coords = seal.distribution.map(d => [d.lon, d.lat]);
            const hull = this.convexHull(coords);

            this.distributionLayer.append('path')
                .datum({
                    type: 'Polygon',
                    coordinates: [hull]
                })
                .attr('d', this.path)
                .attr('fill', conservationColors[seal.conservationStatus] || '#667eea')
                .attr('opacity', 0.2)
                .attr('stroke', conservationColors[seal.conservationStatus] || '#667eea')
                .attr('stroke-width', 2)
                .attr('class', 'species-range')
                .on('mouseover', (event) => {
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr('opacity', 0.4);
                })
                .on('mouseout', (event) => {
                    d3.select(event.currentTarget)
                        .transition()
                        .duration(200)
                        .attr('opacity', 0.2);
                });
        });
    }

    convexHull(points) {
        // Simple gift wrapping algorithm for convex hull
        if (points.length < 3) return points;

        points = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);

        const hull = [];

        // Lower hull
        for (let i = 0; i < points.length; i++) {
            while (hull.length >= 2 && this.cross(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
                hull.pop();
            }
            hull.push(points[i]);
        }

        // Upper hull
        const t = hull.length + 1;
        for (let i = points.length - 2; i >= 0; i--) {
            while (hull.length >= t && this.cross(hull[hull.length - 2], hull[hull.length - 1], points[i]) <= 0) {
                hull.pop();
            }
            hull.push(points[i]);
        }

        hull.pop();
        return hull;
    }

    cross(a, b, c) {
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    }

    highlightSpeciesOnMap(speciesId) {
        // Highlight all points for this species
        this.distributionLayer.selectAll('circle.distribution')
            .transition()
            .duration(300)
            .attr('opacity', d => d.id === speciesId ? 1 : 0.2)
            .attr('stroke-width', d => d.id === speciesId ? 3 : 2);
    }

    addPulseAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% {
                    r: attr(r);
                    opacity: 0.15;
                }
                50% {
                    opacity: 0.3;
                }
            }
            .pulse {
                animation: pulse 2s ease-in-out infinite;
            }
        `;
        if (!document.querySelector('style[data-pulse]')) {
            style.setAttribute('data-pulse', 'true');
            document.head.appendChild(style);
        }
    }

    showSpeciesDetails(speciesName) {
        // Find species in data
        const allSeals = [
            ...sealData.trueSeals,
            ...sealData.earedSeals,
            ...sealData.walrus
        ];

        const species = allSeals.find(s => s.commonName === speciesName);
        if (!species) return;

        this.selectedSpecies = species;
        this.clearDistribution();
        this.drawDistributionPoints([species]);

        // Update species info panel
        this.updateSpeciesInfo(species);

        // Zoom to species distribution
        this.zoomToSpecies(species);
    }

    zoomToSpecies(species) {
        const points = species.distribution.map(d => this.projection([d.lon, d.lat]));

        if (points.length === 0) return;

        const xExtent = d3.extent(points, d => d[0]);
        const yExtent = d3.extent(points, d => d[1]);

        const dx = xExtent[1] - xExtent[0];
        const dy = yExtent[1] - yExtent[0];
        const x = (xExtent[0] + xExtent[1]) / 2;
        const y = (yExtent[0] + yExtent[1]) / 2;

        const scale = Math.min(8, 0.9 / Math.max(dx / this.svg.attr('width'), dy / this.svg.attr('height')));
        const translate = [this.svg.attr('width') / 2 - scale * x, this.svg.attr('height') / 2 - scale * y];

        this.svg.transition()
            .duration(750)
            .call(
                this.zoom.transform,
                d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
            );
    }

    clearDistribution() {
        this.mapGroup.selectAll('circle.distribution').remove();
    }

    setupControls() {
        // Family filter
        d3.select('#familyFilter').on('change', (event) => {
            this.selectedFamily = event.target.value;
            this.showAllSeals();
            this.updateStatistics();
        });

        // View mode toggle
        d3.select('#viewMode').on('change', (event) => {
            this.viewMode = event.target.value;
            this.showAllSeals();
        });

        // Species search with autocomplete
        const speciesList = [
            ...sealData.trueSeals,
            ...sealData.earedSeals,
            ...sealData.walrus
        ];

        const searchInput = d3.select('#speciesSearch');
        const searchResults = d3.select('body').append('div')
            .attr('id', 'searchResults')
            .style('position', 'absolute')
            .style('display', 'none')
            .style('background', 'white')
            .style('border', '1px solid #ddd')
            .style('border-radius', '5px')
            .style('max-height', '200px')
            .style('overflow-y', 'auto')
            .style('z-index', '1001')
            .style('box-shadow', '0 4px 8px rgba(0,0,0,0.2)');

        searchInput.on('input', (event) => {
            const searchTerm = event.target.value.toLowerCase().trim();

            if (searchTerm.length === 0) {
                searchResults.style('display', 'none');
                this.showAllSeals();
                return;
            }

            const filtered = speciesList.filter(s =>
                s.commonName.toLowerCase().includes(searchTerm) ||
                s.scientificName.toLowerCase().includes(searchTerm)
            );

            if (filtered.length > 0) {
                // Show search results dropdown
                const inputNode = searchInput.node();
                const rect = inputNode.getBoundingClientRect();

                searchResults
                    .style('display', 'block')
                    .style('left', rect.left + 'px')
                    .style('top', (rect.bottom + 5) + 'px')
                    .style('width', rect.width + 'px')
                    .html('');

                filtered.slice(0, 8).forEach(species => {
                    searchResults.append('div')
                        .style('padding', '8px 12px')
                        .style('cursor', 'pointer')
                        .style('border-bottom', '1px solid #eee')
                        .html(`
                            <strong>${species.commonName}</strong><br>
                            <small style="color: #666;">${species.scientificName}</small>
                        `)
                        .on('click', () => {
                            this.showSpeciesDetails(species.commonName);
                            searchInput.property('value', species.commonName);
                            searchResults.style('display', 'none');
                        })
                        .on('mouseover', function() {
                            d3.select(this).style('background', '#f0f0f0');
                        })
                        .on('mouseout', function() {
                            d3.select(this).style('background', 'white');
                        });
                });

                // Also filter map
                if (this.viewMode === 'points') {
                    this.clearDistribution();
                    this.drawEnhancedDistributionPoints(filtered);
                }
            } else {
                searchResults.style('display', 'none');
            }
        });

        // Hide search results when clicking outside
        d3.select('body').on('click', (event) => {
            if (!searchInput.node().contains(event.target) &&
                !searchResults.node().contains(event.target)) {
                searchResults.style('display', 'none');
            }
        });

        // Reset button
        d3.select('#resetMap').on('click', () => {
            this.resetMap();
        });

        // Quick filter buttons
        this.createQuickFilters();

        // Zoom controls
        d3.select('#zoomIn').on('click', () => {
            this.svg.transition()
                .duration(300)
                .call(this.zoom.scaleBy, 1.5);
        });

        d3.select('#zoomOut').on('click', () => {
            this.svg.transition()
                .duration(300)
                .call(this.zoom.scaleBy, 0.67);
        });
    }

    resetMap() {
        this.selectedSpecies = null;
        this.selectedFamily = 'all';
        this.viewMode = 'points';
        d3.select('#familyFilter').property('value', 'all');
        d3.select('#viewMode').property('value', 'points');
        d3.select('#speciesSearch').property('value', '');
        d3.select('#searchResults').style('display', 'none');

        this.showAllSeals();
        this.svg.transition()
            .duration(750)
            .call(this.zoom.transform, d3.zoomIdentity);

        d3.select('#speciesInfo').style('display', 'none');
        d3.select('#defaultInfo').style('display', 'block');

        // Reset highlighting
        this.distributionLayer.selectAll('circle.distribution')
            .transition()
            .duration(300)
            .attr('opacity', 0.75)
            .attr('stroke-width', 2);
    }

    createQuickFilters() {
        const quickFilters = d3.select('#quickFilters');
        if (quickFilters.empty()) return;

        const filters = [
            { label: 'Endangered 🚨', filter: s => s.conservationStatus === 'Endangered' || s.conservationStatus === 'Critically Endangered' },
            { label: 'Arctic ❄️', filter: s => s.distribution.some(d => d.lat > 66.5) },
            { label: 'Antarctic 🧊', filter: s => s.distribution.some(d => d.lat < -66.5) },
            { label: 'Large (>500kg) 🦭', filter: s => parseInt(s.characteristics.weight) > 500 }
        ];

        filters.forEach(f => {
            quickFilters.append('button')
                .attr('class', 'btn btn-sm btn-outline-primary me-2 mb-2')
                .html(f.label)
                .on('click', () => {
                    const allSeals = [
                        ...sealData.trueSeals,
                        ...sealData.earedSeals,
                        ...sealData.walrus
                    ];
                    const filtered = allSeals.filter(f.filter);
                    this.clearDistribution();
                    if (this.viewMode === 'points') {
                        this.drawEnhancedDistributionPoints(filtered);
                    } else if (this.viewMode === 'heatmap') {
                        this.drawHeatmap(filtered);
                    } else {
                        this.drawRanges(filtered);
                    }
                });
        });
    }

    addKeyboardControls() {
        d3.select('body').on('keydown', (event) => {
            if (event.target.tagName === 'INPUT') return;

            switch(event.key) {
                case 'r':
                case 'R':
                    this.resetMap();
                    break;
                case '+':
                case '=':
                    this.svg.transition().duration(300).call(this.zoom.scaleBy, 1.3);
                    break;
                case '-':
                case '_':
                    this.svg.transition().duration(300).call(this.zoom.scaleBy, 0.77);
                    break;
                case 'h':
                case 'H':
                    this.showKeyboardHelp();
                    break;
                case 'Escape':
                    this.resetMap();
                    break;
            }
        });
    }

    showKeyboardHelp() {
        const helpModal = d3.select('body').append('div')
            .attr('class', 'keyboard-help-modal')
            .style('position', 'fixed')
            .style('top', '50%')
            .style('left', '50%')
            .style('transform', 'translate(-50%, -50%)')
            .style('background', 'white')
            .style('padding', '30px')
            .style('border-radius', '10px')
            .style('box-shadow', '0 10px 40px rgba(0,0,0,0.3)')
            .style('z-index', '10000')
            .style('max-width', '500px');

        helpModal.html(`
            <h4>⌨️ Keyboard Shortcuts</h4>
            <hr>
            <table style="width: 100%; font-size: 14px;">
                <tr><td><kbd>R</kbd></td><td>Reset map</td></tr>
                <tr><td><kbd>+</kbd></td><td>Zoom in</td></tr>
                <tr><td><kbd>-</kbd></td><td>Zoom out</td></tr>
                <tr><td><kbd>H</kbd></td><td>Show this help</td></tr>
                <tr><td><kbd>ESC</kbd></td><td>Reset/Close</td></tr>
                <tr><td><kbd>Drag</kbd></td><td>Pan map</td></tr>
                <tr><td><kbd>Scroll</kbd></td><td>Zoom in/out</td></tr>
            </table>
            <button class="btn btn-primary mt-3 w-100">Got it!</button>
        `);

        helpModal.select('button').on('click', () => {
            helpModal.remove();
        });

        // Auto-close after 5 seconds
        setTimeout(() => helpModal.remove(), 5000);
    }

    createLegend() {
        const legend = d3.select('#legend');

        // Conservation status legend
        Object.entries(conservationColors).forEach(([status, color]) => {
            legend.append('div')
                .attr('class', 'legend-item')
                .html(`
                    <div class="legend-color" style="background-color: ${color};"></div>
                    <span>${status}</span>
                `);
        });
    }

    createStatistics() {
        const allSeals = [
            ...sealData.trueSeals,
            ...sealData.earedSeals,
            ...sealData.walrus
        ];

        const totalPopulation = allSeals.reduce((sum, s) => sum + s.population, 0);
        const totalSpecies = allSeals.length;
        const endangered = allSeals.filter(s =>
            s.conservationStatus === 'Endangered' ||
            s.conservationStatus === 'Critically Endangered'
        ).length;

        d3.select('#totalSpecies').text(totalSpecies);
        d3.select('#totalPopulation').text(totalPopulation.toLocaleString());
        d3.select('#endangeredCount').text(endangered);
    }

    updateSpeciesInfo(species) {
        const info = d3.select('#speciesInfo');
        info.style('display', 'block');

        info.html(`
            <h4>${species.commonName}</h4>
            <p><em>${species.scientificName}</em></p>
            <p><strong>Family:</strong> ${species.family}</p>
            <p><strong>Population:</strong> ${species.population.toLocaleString()}</p>
            <p><strong>Status:</strong> <span style="color: ${conservationColors[species.conservationStatus]}">${species.conservationStatus}</span></p>
            <h5>Characteristics:</h5>
            <ul>
                <li><strong>Length:</strong> ${species.characteristics.length}</li>
                <li><strong>Weight:</strong> ${species.characteristics.weight}</li>
                <li><strong>Lifespan:</strong> ${species.characteristics.lifespan}</li>
                <li><strong>Diet:</strong> ${species.characteristics.diet}</li>
            </ul>
            <p><strong>Distribution:</strong> ${species.distribution.length} known regions</p>
        `);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const map = new SealDistributionMap();
    await map.initialize();
});

