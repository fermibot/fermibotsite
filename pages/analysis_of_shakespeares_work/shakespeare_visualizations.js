// Advanced D3 Visualizations for Shakespeare Analysis
// Requires D3.js v7

class ShakespeareVisualizations {
    constructor() {
        this.margin = { top: 40, right: 40, bottom: 60, left: 60 };
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);
    }

    // 1. Interactive Letter Frequency Bubble Chart
    createLetterBubbleChart(containerId) {
        const container = d3.select(`#${containerId}`);
        const width = container.node().getBoundingClientRect().width;
        const height = 500;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create pack layout
        const pack = d3.pack()
            .size([width - 100, height - 100])
            .padding(3);

        const root = d3.hierarchy({ children: letterData })
            .sum(d => d.count);

        const nodes = pack(root).leaves();

        const tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('background-color', 'white')
            .style('border', '2px solid #667eea')
            .style('border-radius', '5px')
            .style('padding', '10px')
            .style('pointer-events', 'none')
            .style('z-index', '1000');

        const bubbles = svg.selectAll('g')
            .data(nodes)
            .join('g')
            .attr('transform', d => `translate(${d.x + 50},${d.y + 50})`);

        bubbles.append('circle')
            .attr('r', d => d.r)
            .attr('fill', d => d.data.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1)
                    .attr('r', d.r * 1.1);

                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`
                    <strong>Letter: ${d.data.letter}</strong><br/>
                    Count: ${d.data.count.toLocaleString()}<br/>
                    Percentage: ${d.data.percentage}%
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.8)
                    .attr('r', d.r);

                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        bubbles.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .style('font-size', d => Math.min(d.r / 2, 24) + 'px')
            .style('font-weight', 'bold')
            .style('fill', '#fff')
            .text(d => d.data.letter);
    }

    // 2. Zipf's Law Logarithmic Chart
    createZipfChart(containerId) {
        const container = d3.select(`#${containerId}`);
        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        const innerWidth = width - this.margin.left - this.margin.right;
        const innerHeight = height - this.margin.top - this.margin.bottom;

        // Use logarithmic scales
        const x = d3.scaleLog()
            .domain([1, wordData.length])
            .range([0, innerWidth]);

        const y = d3.scaleLog()
            .domain([d3.min(wordData, d => d.count), d3.max(wordData, d => d.count)])
            .range([innerHeight, 0]);

        // Add grid lines
        g.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickSize(-innerWidth)
                .tickFormat(''));

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).ticks(10, ',.0f'))
            .append('text')
            .attr('x', innerWidth / 2)
            .attr('y', 40)
            .attr('fill', 'currentColor')
            .style('font-size', '14px')
            .text('Word Rank (log scale)');

        g.append('g')
            .call(d3.axisLeft(y).ticks(10, ',.0s'))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -innerHeight / 2)
            .attr('y', -45)
            .attr('fill', 'currentColor')
            .style('font-size', '14px')
            .text('Frequency (log scale)');

        // Add line
        const line = d3.line()
            .x(d => x(d.rank))
            .y(d => y(d.count));

        g.append('path')
            .datum(wordData)
            .attr('fill', 'none')
            .attr('stroke', '#667eea')
            .attr('stroke-width', 3)
            .attr('d', line);

        // Add points
        g.selectAll('circle')
            .data(wordData.slice(0, 30))
            .join('circle')
            .attr('cx', d => x(d.rank))
            .attr('cy', d => y(d.count))
            .attr('r', 4)
            .attr('fill', '#764ba2')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 7);

                const tooltip = d3.select('.tooltip');
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`<strong>${d.word}</strong><br/>Rank: ${d.rank}<br/>Count: ${d.count.toLocaleString()}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 4);

                d3.select('.tooltip').transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text("Zipf's Law: Word Frequency vs. Rank (Log-Log Scale)");
    }

    // 3. Genre Distribution Donut Chart
    createGenreDonutChart(containerId) {
        const container = d3.select(`#${containerId}`);
        const width = Math.min(container.node().getBoundingClientRect().width, 400);
        const height = 400;
        const radius = Math.min(width, height) / 2;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.8);

        const outerArc = d3.arc()
            .innerRadius(radius * 0.9)
            .outerRadius(radius * 0.9);

        const arcs = svg.selectAll('arc')
            .data(pie(genreData))
            .join('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => d.data.color)
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1)
                    .attr('d', d3.arc()
                        .innerRadius(radius * 0.5)
                        .outerRadius(radius * 0.85));
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.8)
                    .attr('d', arc);
            });

        // Add labels
        arcs.append('text')
            .attr('transform', d => {
                const pos = outerArc.centroid(d);
                return `translate(${pos})`;
            })
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(d => `${d.data.genre}: ${d.data.count}`);
    }

    // 4. Timeline Streamgraph
    createTimelineChart(containerId) {
        const container = d3.select(`#${containerId}`);
        const width = container.node().getBoundingClientRect().width;
        const height = 300;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        const innerWidth = width - this.margin.left - this.margin.right;
        const innerHeight = height - this.margin.top - this.margin.bottom;

        const x = d3.scaleLinear()
            .domain(d3.extent(timelineData, d => d.year))
            .range([0, innerWidth]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(timelineData, d => d.count)])
            .range([innerHeight, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')))
            .append('text')
            .attr('x', innerWidth / 2)
            .attr('y', 40)
            .attr('fill', 'currentColor')
            .style('font-size', '14px')
            .text('Year');

        g.append('g')
            .call(d3.axisLeft(y))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -innerHeight / 2)
            .attr('y', -45)
            .attr('fill', 'currentColor')
            .style('font-size', '14px')
            .text('Number of Plays');

        // Add area
        const area = d3.area()
            .x(d => x(d.year))
            .y0(innerHeight)
            .y1(d => y(d.count))
            .curve(d3.curveMonotoneX);

        g.append('path')
            .datum(timelineData)
            .attr('fill', 'url(#gradient)')
            .attr('stroke', '#667eea')
            .attr('stroke-width', 2)
            .attr('d', area);

        // Add gradient
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '0%')
            .attr('y2', '100%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#667eea')
            .attr('stop-opacity', 0.8);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#764ba2')
            .attr('stop-opacity', 0.3);

        // Add points
        g.selectAll('circle')
            .data(timelineData)
            .join('circle')
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d.count))
            .attr('r', 5)
            .attr('fill', '#fff')
            .attr('stroke', '#667eea')
            .attr('stroke-width', 2)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8);

                const tooltip = d3.select('.tooltip');
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`<strong>${d.year}</strong><br/>${d.plays.join('<br/>')}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 5);

                d3.select('.tooltip').transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    // 5. Character Network Force-Directed Graph
    createCharacterChart(containerId) {
        const container = d3.select(`#${containerId}`);
        const width = container.node().getBoundingClientRect().width;
        const height = 500;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g');

        // Create nodes
        const nodes = characterData.map(d => ({
            id: d.name,
            lines: d.lines,
            appearances: d.appearances
        }));

        // Create links (connections between characters)
        const links = [];
        for (let i = 0; i < nodes.length - 1; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                if (Math.random() > 0.6) { // Random connections for demo
                    links.push({
                        source: nodes[i].id,
                        target: nodes[j].id,
                        value: Math.floor(Math.random() * 50) + 10
                    });
                }
            }
        }

        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Add zoom
        const zoom = d3.zoom()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Add links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.value) / 2);

        // Add nodes
        const node = g.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        node.append('circle')
            .attr('r', d => Math.sqrt(d.lines) / 2 + 10)
            .attr('fill', '#667eea')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('opacity', 0.8);

        node.append('text')
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .style('fill', '#fff')
            .text(d => d.id);

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node.attr('transform', d => `translate(${d.x},${d.y})`);
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
    }

    // 6. Vocabulary Richness Bar Chart
    createVocabularyChart(containerId) {
        const container = d3.select(`#${containerId}`);
        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        const innerWidth = width - this.margin.left - this.margin.right;
        const innerHeight = height - this.margin.top - this.margin.bottom;

        const x = d3.scaleBand()
            .domain(vocabularyData.map(d => d.play))
            .range([0, innerWidth])
            .padding(0.2);

        const y = d3.scaleLinear()
            .domain([0, d3.max(vocabularyData, d => d.ttr)])
            .range([innerHeight, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        g.append('g')
            .call(d3.axisLeft(y).tickFormat(d3.format('.0%')))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -innerHeight / 2)
            .attr('y', -45)
            .attr('fill', 'currentColor')
            .style('font-size', '14px')
            .text('Type-Token Ratio (TTR)');

        // Add bars
        g.selectAll('rect')
            .data(vocabularyData)
            .join('rect')
            .attr('x', d => x(d.play))
            .attr('y', d => y(d.ttr))
            .attr('width', x.bandwidth())
            .attr('height', d => innerHeight - y(d.ttr))
            .attr('fill', '#667eea')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1)
            .style('opacity', 0.8)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1);

                const tooltip = d3.select('.tooltip');
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`
                    <strong>${d.play}</strong><br/>
                    Unique Words: ${d.uniqueWords.toLocaleString()}<br/>
                    Total Words: ${d.totalWords.toLocaleString()}<br/>
                    TTR: ${(d.ttr * 100).toFixed(1)}%
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.8);

                d3.select('.tooltip').transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    }

    // Initialize all visualizations
    initializeAll() {
        this.createLetterBubbleChart('letterBubbleChart');
        this.createZipfChart('zipfChart');
        this.createGenreDonutChart('genreDonutChart');
        this.createTimelineChart('timelineChart');
        this.createCharacterChart('characterChart');
        this.createVocabularyChart('vocabularyChart');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const viz = new ShakespeareVisualizations();
    viz.initializeAll();
});

