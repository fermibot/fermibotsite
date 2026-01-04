(function() {
  const container = d3.select('#pearsonPlotContainer');
  if (!container.node()) {
    console.error('Plot container not found');
    return;
  }

  // Clear any previous render (avoid duplicates on hot reload / navigation)
  container.selectAll('*').remove();

  const fullWidth = container.node().getBoundingClientRect().width || 800;
  const plotSize = Math.min(fullWidth, 800);
  const width = plotSize;
  const height = plotSize;
  const margin = {top: 60, right: 40, bottom: 60, left: 70};

  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'block')
    .style('margin', '0 auto');

  const plotGroup = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const xScale = d3.scaleLinear().domain([-16, 16]).range([0, innerW]);
  const yScale = d3.scaleLinear().domain([-16, 16]).range([innerH, 0]);

  // Axes
  const majorTickCount = 8;
  const xAxis = d3.axisBottom(xScale).ticks(majorTickCount);
  const yAxis = d3.axisLeft(yScale).ticks(majorTickCount);

  const xMajorTicks = xScale.ticks(majorTickCount);
  const yMajorTicks = yScale.ticks(majorTickCount);

  function midTicks(majorTicks) {
    const out = [];
    for (let i = 0; i < majorTicks.length - 1; i++) {
      out.push((majorTicks[i] + majorTicks[i + 1]) / 2);
    }
    return out;
  }

  const xMinorTicks = midTicks(xMajorTicks);
  const yMinorTicks = midTicks(yMajorTicks);

  // Grid lines (minor first so major sits on top)
  const gridGroup = plotGroup.append('g').attr('class', 'grid');

  // minor vertical
  gridGroup.selectAll('.v-grid-minor')
    .data(xMinorTicks)
    .enter()
    .append('line')
    .attr('class', 'v-grid-minor')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', innerH);

  // minor horizontal
  gridGroup.selectAll('.h-grid-minor')
    .data(yMinorTicks)
    .enter()
    .append('line')
    .attr('class', 'h-grid-minor')
    .attr('x1', 0)
    .attr('x2', innerW)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d));

  // major vertical
  gridGroup.selectAll('.v-grid')
    .data(xMajorTicks)
    .enter()
    .append('line')
    .attr('class', 'v-grid')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', innerH);

  // major horizontal
  gridGroup.selectAll('.h-grid')
    .data(yMajorTicks)
    .enter()
    .append('line')
    .attr('class', 'h-grid')
    .attr('x1', 0)
    .attr('x2', innerW)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d));

  plotGroup.append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', `translate(0,${innerH})`)
    .call(xAxis);
  plotGroup.append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis);

  // Full frame
  plotGroup.append('rect')
    .attr('class', 'plot-border')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', innerW)
    .attr('height', innerH);

  // Circle
  plotGroup.append('circle')
    .attr('cx', xScale(0))
    .attr('cy', yScale(0))
    .attr('r', xScale(14) - xScale(0))
    .attr('fill', 'none')
    .attr('stroke', '#adb5bd')
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '4,4');

  // Stats label (top-left, outside the active circle region)
  const stats = plotGroup.append('g')
    .attr('class', 'stats-label');

  stats.append('rect')
    .attr('class', 'label-background')
    .attr('x', 8)
    .attr('y', 8)
    .attr('width', 260)
    .attr('height', 32)
    .attr('rx', 6)
    .attr('ry', 6);

  const statsText = stats.append('text')
    .attr('x', 18)
    .attr('y', 29)
    .attr('font-size', 12)
    .attr('fill', '#495057');

  // Use tspans so we can color the two parts but keep everything on one line
  const corrTspan = statsText.append('tspan')
    .attr('fill', '#0066cc');

  const sepTspan = statsText.append('tspan')
    .attr('fill', '#495057');

  const covTspan = statsText.append('tspan')
    .attr('fill', '#28a745');

  const pointsGroup = plotGroup.append('g').attr('class', 'points');

  function pearsonCorrelation(xs, ys) {
    const n = xs.length;
    if (n === 0) return 0;
    const meanX = d3.mean(xs);
    const meanY = d3.mean(ys);
    let num = 0, denomX = 0, denomY = 0;
    for (let i = 0; i < n; i++) {
      const dx = xs[i] - meanX;
      const dy = ys[i] - meanY;
      num += dx * dy;
      denomX += dx * dx;
      denomY += dy * dy;
    }
    if (denomX === 0 || denomY === 0) return 0;
    return num / Math.sqrt(denomX * denomY);
  }

  function sampleCovariance(xs, ys) {
    const n = xs.length;
    if (n < 2) return 0;
    const meanX = d3.mean(xs);
    const meanY = d3.mean(ys);
    let num = 0;
    for (let i = 0; i < n; i++) {
      num += (xs[i] - meanX) * (ys[i] - meanY);
    }
    return num / (n - 1);
  }

  function generateData(st, r) {
    const s = 0.1;
    const xs = [];
    const ys = [];
    const nMin = -14;
    const nMax = 14;
    for (let n = nMin; n <= nMax; n += s) {
      const baseX = n * Math.sin(r);
      const baseY = n * Math.cos(r);
      const noiseScale = 1 / st;
      const noiseX = d3.randomNormal(0, noiseScale)();
      const noiseY = d3.randomNormal(0, noiseScale)();
      xs.push(baseX + noiseX);
      ys.push(baseY + noiseY);
    }
    return { xs, ys };
  }

  function updatePlot() {
    const st = parseFloat(document.getElementById('noiseSlider').value);
    const r = parseFloat(document.getElementById('angleSlider').value);

    document.getElementById('noise-value').textContent = st.toFixed(1);
    document.getElementById('angle-value').textContent = r.toFixed(2);

    const { xs, ys } = generateData(st, r);
    const corr = pearsonCorrelation(xs, ys);
    const cov = sampleCovariance(xs, ys);

    corrTspan.text(`Correlation: ${corr.toFixed(4)}`);
    sepTspan.text('   |   ');
    covTspan.text(`Covariance: ${cov.toFixed(4)}`);

    const data = xs.map((x, i) => ({ x, y: ys[i] }));

    const pts = pointsGroup.selectAll('circle.point').data(data);

    pts.exit().remove();

    pts.enter().append('circle')
      .attr('class', 'point data-point')
      .attr('r', 2)
      .attr('fill', '#007bff')
      .attr('opacity', 0.6)
      .merge(pts)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));
  }

  document.getElementById('noiseSlider').addEventListener('input', updatePlot);
  document.getElementById('angleSlider').addEventListener('input', updatePlot);

  updatePlot();
})();
