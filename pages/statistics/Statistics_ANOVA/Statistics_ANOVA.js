(function () {
  const container = d3.select('#anovaPlotContainer');
  if (!container.node()) return;

  // Avoid duplicates if reloaded
  container.selectAll('*').remove();

  const color = d3.scaleOrdinal()
    .domain([0, 1, 2])
    .range(['#dc2626', '#16a34a', '#2563eb']);

  // Layout
  const fullWidth = container.node().getBoundingClientRect().width || 900;
  const width = Math.min(fullWidth, 900);
  const height = 520;
  const margin = { top: 30, right: 30, bottom: 55, left: 70 };

  const svg = container.append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'block')
    .style('margin', '0 auto');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  // X: group index (1..k)
  const groups = [1, 2, 3];
  const x = d3.scalePoint().domain(groups).range([0, innerW]).padding(0.5);

  // Y: value
  const y = d3.scaleLinear().range([innerH, 0]);

  const xAxis = d3.axisBottom(x);
  const yAxis = d3.axisLeft(y).ticks(8);

  // Grid groups
  const gridG = g.append('g').attr('class', 'grid');
  const axesG = g.append('g').attr('class', 'axes');

  // Frame
  g.append('rect')
    .attr('class', 'plot-border')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', innerW)
    .attr('height', innerH);

  // Stats overlay
  const statsG = g.append('g').attr('class', 'stats-label');
  statsG.append('rect')
    .attr('class', 'label-background')
    .attr('x', 8)
    .attr('y', 8)
    .attr('width', 320)
    .attr('height', 32)
    .attr('rx', 6)
    .attr('ry', 6);

  const statsText = statsG.append('text')
    .attr('x', 16)
    .attr('y', 29)
    .attr('font-size', 12)
    .attr('fill', '#374151');

  const fT = statsText.append('tspan').attr('fill', '#16a34a');
  const sepT = statsText.append('tspan').attr('fill', '#374151');
  const pT = statsText.append('tspan').attr('fill', '#dc2626');

  const pointsG = g.append('g').attr('class', 'points');
  const meansG = g.append('g').attr('class', 'means');
  const overallMeanG = g.append('g').attr('class', 'overall');

  function normalSample(mu, sigma) {
    return d3.randomNormal(mu, sigma)();
  }

  // One-way ANOVA pieces
  function mean(arr) {
    return d3.mean(arr);
  }

  function ssWithin(groupsValues, groupMeans) {
    let ssw = 0;
    for (let gi = 0; gi < groupsValues.length; gi++) {
      const vals = groupsValues[gi];
      const m = groupMeans[gi];
      for (const v of vals) {
        const d = v - m;
        ssw += d * d;
      }
    }
    return ssw;
  }

  function ssBetween(groupsValues, groupMeans, overallMean) {
    let ssb = 0;
    for (let gi = 0; gi < groupsValues.length; gi++) {
      const n = groupsValues[gi].length;
      const d = groupMeans[gi] - overallMean;
      ssb += n * d * d;
    }
    return ssb;
  }

  // Regularized incomplete beta (Numerical Recipes style).
  // Used to compute CDF of F distribution.
  function betacf(a, b, x) {
    const MAXIT = 200;
    const EPS = 3e-10;
    const FPMIN = 1e-30;
    let qab = a + b;
    let qap = a + 1;
    let qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= MAXIT; m++) {
      let m2 = 2 * m;
      let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      h *= d * c;
      aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < FPMIN) d = FPMIN;
      c = 1 + aa / c;
      if (Math.abs(c) < FPMIN) c = FPMIN;
      d = 1 / d;
      let del = d * c;
      h *= del;
      if (Math.abs(del - 1) < EPS) break;
    }
    return h;
  }

  // Lanczos approximation for log-gamma
  function gammaln(z) {
    const cof = [
      76.18009172947146,
      -86.50532032941677,
      24.01409824083091,
      -1.231739572450155,
      0.1208650973866179e-2,
      -0.5395239384953e-5
    ];
    let x = z;
    let y = z;
    let tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < cof.length; j++) {
      y += 1;
      ser += cof[j] / y;
    }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }

  function betai(a, b, x) {
    if (x < 0 || x > 1) return NaN;
    if (x === 0 || x === 1) return x;
    const bt = Math.exp(gammaln(a + b) - gammaln(a) - gammaln(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) {
      return bt * betacf(a, b, x) / a;
    }
    return 1 - bt * betacf(b, a, 1 - x) / b;
  }

  // CDF for F(d1,d2), using relation with incomplete beta.
  function fCdf(x, d1, d2) {
    if (x <= 0) return 0;
    const xx = (d1 * x) / (d1 * x + d2);
    return betai(d1 / 2, d2 / 2, xx);
  }

  function oneWayAnova(groupsValues) {
    const k = groupsValues.length;
    const ns = groupsValues.map(v => v.length);
    const N = d3.sum(ns);
    const groupMeans = groupsValues.map(v => mean(v));
    const overall = d3.sum(groupsValues.map((vals, i) => ns[i] * groupMeans[i])) / N;

    const ssb = ssBetween(groupsValues, groupMeans, overall);
    const ssw = ssWithin(groupsValues, groupMeans);

    const dfb = k - 1;
    const dfw = N - k;

    const msb = ssb / dfb;
    const msw = ssw / dfw;
    const F = msw === 0 ? Infinity : msb / msw;

    // Right-tail p-value = 1 - CDF
    const p = 1 - fCdf(F, dfb, dfw);

    return { F, p, dfb, dfw, groupMeans, overall };
  }

  function generateData(meanDiff, sigma, nPerGroup) {
    // 3 groups: center group at 0, others at +/- meanDiff
    const mus = [-meanDiff, 0, meanDiff];
    return mus.map((mu, idx) => {
      const vals = d3.range(nPerGroup).map(() => normalSample(mu, sigma));
      return { group: idx + 1, mu, vals };
    });
  }

  function update() {
    const meanDiff = parseFloat(document.getElementById('meanDiffSlider').value);
    const sigma = parseFloat(document.getElementById('sigmaSlider').value);
    const nPerGroup = parseInt(document.getElementById('nSlider').value, 10);

    document.getElementById('meanDiffValue').textContent = meanDiff.toFixed(2);
    document.getElementById('sigmaValue').textContent = sigma.toFixed(2);
    document.getElementById('nValue').textContent = String(nPerGroup);

    const groupsData = generateData(meanDiff, sigma, nPerGroup);
    const groupsValues = groupsData.map(d => d.vals);

    const stats = oneWayAnova(groupsValues);

    // Set y domain based on percentiles for stability
    const allVals = groupsValues.flat();
    const yMin = d3.quantile(allVals, 0.01) ?? d3.min(allVals);
    const yMax = d3.quantile(allVals, 0.99) ?? d3.max(allVals);
    const pad = (yMax - yMin) * 0.15 + 1e-6;
    y.domain([yMin - pad, yMax + pad]);

    // Gridlines based on y ticks
    const yMajor = y.ticks(8);
    const yMinor = [];
    for (let i = 0; i < yMajor.length - 1; i++) yMinor.push((yMajor[i] + yMajor[i + 1]) / 2);

    gridG.selectAll('*').remove();

    // Horizontal gridlines
    gridG.selectAll('line.h-minor')
      .data(yMinor)
      .enter()
      .append('line')
      .attr('class', 'minor')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d));

    gridG.selectAll('line.h-major')
      .data(yMajor)
      .enter()
      .append('line')
      .attr('class', 'major')
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', d => y(d))
      .attr('y2', d => y(d));

    // Axes
    axesG.selectAll('*').remove();

    axesG.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis);

    axesG.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${innerH})`)
      .call(xAxis)
      .call(g => g.selectAll('text').text(d => `Group ${d}`));

    // Update stats label
    fT.text(`F(${stats.dfb}, ${stats.dfw}) = ${stats.F.toFixed(4)}`);
    sepT.text('   |   ');
    pT.text(`p = ${Math.max(stats.p, 0).toExponential(2)}`);

    // Jittered dot plot
    const jitter = 14;
    const pointData = groupsData.flatMap(d => d.vals.map(v => ({ group: d.group, value: v })));

    const sel = pointsG.selectAll('circle.point').data(pointData, (d, i) => `${d.group}-${i}`);

    sel.exit().remove();

    sel.enter()
      .append('circle')
      .attr('class', 'point')
      .attr('r', 2)
      .attr('opacity', 0.55)
      .merge(sel)
      .attr('fill', d => color(d.group - 1))
      .attr('cx', d => x(d.group) + (Math.random() - 0.5) * jitter)
      .attr('cy', d => y(d.value));

    // Group mean lines
    const meanLines = groupsData.map((d, i) => ({ group: d.group, mean: stats.groupMeans[i] }));

    const msel = meansG.selectAll('line.mean-line').data(meanLines, d => d.group);
    msel.exit().remove();

    msel.enter()
      .append('line')
      .attr('class', 'mean-line')
      .merge(msel)
      .attr('stroke', d => color(d.group - 1))
      .attr('x1', d => x(d.group) - 30)
      .attr('x2', d => x(d.group) + 30)
      .attr('y1', d => y(d.mean))
      .attr('y2', d => y(d.mean));

    // Overall mean
    const om = stats.overall;
    const oSel = overallMeanG.selectAll('line.overall-mean-line').data([om]);
    oSel.enter().append('line').attr('class', 'overall-mean-line')
      .merge(oSel)
      .attr('x1', 0)
      .attr('x2', innerW)
      .attr('y1', y(om))
      .attr('y2', y(om));
  }

  document.getElementById('meanDiffSlider').addEventListener('input', update);
  document.getElementById('sigmaSlider').addEventListener('input', update);
  document.getElementById('nSlider').addEventListener('input', update);

  update();
})();
