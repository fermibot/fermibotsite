// Binary Classification Metrics Visualization Configuration and Functions
const METRICS_CONFIG = {
    size: 2000,
    maxOffset: 0.2,
    distributionType: "triangular",
    margin: {top: 70, right: 30, bottom: 50, left: 50}, // Increased top margin significantly
    scatterWidth: 600,
    scatterHeight: 200,
    rocWidth: 500,  // Square dimensions for 1:1 aspect ratio
    rocHeight: 500  // Square dimensions for 1:1 aspect ratio
};

// Triangular distribution function (equivalent to Mathematica's TriangularDistribution)
function triangularRandom(min, max, mode) {
    const u = Math.random();
    const f = (mode - min) / (max - min);

    if (u <= f) {
        return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
        return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
}

// Custom triangular distribution based on label (equivalent to randTriangularCustom)
function randTriangularCustom(label, offset) {
    if (label === 0) {
        return triangularRandom(0, 1, offset);
    } else if (label === 1) {
        return triangularRandom(0, 1, 1 - offset);
    }
}

// Uniform distribution predictor (equivalent to original predictor function)
function uniformPredictor(labels, maxOffset) {
    return labels.map(label => {
        const offset = Math.random() * maxOffset;
        return label === 0 ? label + offset : label - offset;
    });
}

// Triangular distribution predictor
function triangularPredictor(labels, maxOffset) {
    return labels.map(label => randTriangularCustom(label, maxOffset));
}

// Generate random data for visualization based on distribution type
function generateData(maxOffset, distributionType) {
    const labels = Array.from({length: METRICS_CONFIG.size}, () =>
        Math.random() > 0.5 ? 1 : 0
    );

    let probabilities;
    if (distributionType === "triangular") {
        probabilities = triangularPredictor(labels, maxOffset);
    } else {
        probabilities = uniformPredictor(labels, maxOffset);
    }

    return {labels, probabilities};
}

// Calculate ROC curve data
function calculateROC(labels, probabilities) {
    const thresholds = Array.from({length: 101}, (_, i) => i / 100);
    const rocData = [];

    thresholds.forEach(threshold => {
        let truePositives = 0;
        let falsePositives = 0;
        let trueNegatives = 0;
        let falseNegatives = 0;

        labels.forEach((label, i) => {
            const prediction = probabilities[i] >= threshold ? 1 : 0;

            if (label === 1 && prediction === 1) truePositives++;
            if (label === 0 && prediction === 1) falsePositives++;
            if (label === 0 && prediction === 0) trueNegatives++;
            if (label === 1 && prediction === 0) falseNegatives++;
        });

        const tpr = truePositives / (truePositives + falseNegatives);
        const fpr = falsePositives / (falsePositives + trueNegatives);

        rocData.push({
            threshold,
            tpr: isNaN(tpr) ? 0 : tpr,
            fpr: isNaN(fpr) ? 0 : fpr,
            truePositives,
            falsePositives,
            trueNegatives,
            falseNegatives
        });
    });

    return rocData;
}

// Create scatter plot visualization
function createScatterPlot(data, threshold, distributionType) {
    const svg = d3.select("#scatter-plot")
        .html("")
        .append("svg")
        .attr("width", METRICS_CONFIG.scatterWidth + METRICS_CONFIG.margin.left + METRICS_CONFIG.margin.right)
        .attr("height", METRICS_CONFIG.scatterHeight + METRICS_CONFIG.margin.top + METRICS_CONFIG.margin.bottom)
        .append("g")
        .attr("transform", `translate(${METRICS_CONFIG.margin.left},${METRICS_CONFIG.margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([-0.1, 1.1])
        .range([0, METRICS_CONFIG.scatterWidth]);

    const yScale = d3.scaleLinear()
        .domain([-0.1, 1.1])
        .range([METRICS_CONFIG.scatterHeight, 0]);

    // Add border around the entire plot area
    svg.append("rect")
        .attr("class", "plot-border")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", METRICS_CONFIG.scatterWidth)
        .attr("height", METRICS_CONFIG.scatterHeight);

    // Add distribution label - centered and much higher above the plot
    const distributionText = svg.append("text")
        .attr("class", "distribution-label")
        .attr("text-anchor", "middle")
        .attr("x", METRICS_CONFIG.scatterWidth / 2)
        .attr("y", -35) // Position much higher above the plot
        .text(`Distribution: ${distributionType === "triangular" ? "Triangular" : "Uniform"}`);

    // Add background for distribution label
    const distributionBBox = distributionText.node().getBBox();
    svg.insert("rect", ".distribution-label")
        .attr("class", "label-background")
        .attr("x", distributionBBox.x - 5)
        .attr("y", distributionBBox.y - 2)
        .attr("width", distributionBBox.width + 10)
        .attr("height", distributionBBox.height + 4);

    // Add points with colors based on label (red for 0, green for 1)
    svg.selectAll(".point")
        .data(data.points)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d.probability))
        .attr("cy", d => yScale(d.y))
        .attr("r", 2)
        .attr("fill", d => d.label === 0 ? "#ff4444" : "#44aa44")
        .attr("opacity", 0.7);

    // Add threshold line
    svg.append("line")
        .attr("class", "threshold-line")
        .attr("x1", xScale(threshold))
        .attr("y1", yScale(-0.1))
        .attr("x2", xScale(threshold))
        .attr("y2", yScale(1.1));

    // Add axes with borders on all four sides
    // Bottom axis
    svg.append("g")
        .attr("transform", `translate(0,${METRICS_CONFIG.scatterHeight})`)
        .call(d3.axisBottom(xScale).ticks(10));

    // Top axis
    svg.append("g")
        .call(d3.axisTop(xScale).ticks(10));

    // Left axis
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(5));

    // Right axis
    svg.append("g")
        .attr("transform", `translate(${METRICS_CONFIG.scatterWidth}, 0)`)
        .call(d3.axisRight(yScale).ticks(5));

    // Axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", METRICS_CONFIG.scatterWidth / 2)
        .attr("y", METRICS_CONFIG.scatterHeight + 35)
        .text("Probability");

    // Add legend for labels with background
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${METRICS_CONFIG.scatterWidth - 100}, 10)`);

    // Add background for legend
    legend.append("rect")
        .attr("class", "label-background")
        .attr("x", -5)
        .attr("y", -5)
        .attr("width", 90)
        .attr("height", 45);

    legend.append("rect")
        .attr("class", "legend-color")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", "#ff4444");

    legend.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .text("Class 0")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");

    legend.append("rect")
        .attr("class", "legend-color")
        .attr("x", 0)
        .attr("y", 20)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", "#44aa44");

    legend.append("text")
        .attr("x", 20)
        .attr("y", 30)
        .text("Class 1")
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");
}

// Create ROC plot visualization
function createROCPlot(rocData, currentThresholdIndex) {
    const svg = d3.select("#roc-plot")
        .html("")
        .append("svg")
        .attr("width", METRICS_CONFIG.rocWidth + METRICS_CONFIG.margin.left + METRICS_CONFIG.margin.right)
        .attr("height", METRICS_CONFIG.rocHeight + METRICS_CONFIG.margin.top + METRICS_CONFIG.margin.bottom)
        .append("g")
        .attr("transform", `translate(${METRICS_CONFIG.margin.left},${METRICS_CONFIG.margin.top})`);

    const xScale = d3.scaleLinear()
        .domain([-0.05, 1.05])
        .range([0, METRICS_CONFIG.rocWidth]);

    const yScale = d3.scaleLinear()
        .domain([-0.05, 1.05])
        .range([METRICS_CONFIG.rocHeight, 0]);

    // Add border around the entire plot area
    svg.append("rect")
        .attr("class", "plot-border")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", METRICS_CONFIG.rocWidth)
        .attr("height", METRICS_CONFIG.rocHeight);

    // Add diagonal line (random classifier baseline)
    svg.append("line")
        .attr("class", "diagonal-line")
        .attr("x1", xScale(0))
        .attr("y1", yScale(0))
        .attr("x2", xScale(1))
        .attr("y2", yScale(1));

    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.fpr))
        .y(d => yScale(d.tpr))
        .curve(d3.curveMonotoneX);

    // Add ROC curve up to current threshold
    const currentData = rocData.slice(0, currentThresholdIndex + 1);

    // Add area under ROC curve
    const area = d3.area()
        .x(d => xScale(d.fpr))
        .y0(yScale(0))
        .y1(d => yScale(d.tpr))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(currentData)
        .attr("class", "roc-area")
        .attr("d", area);

    // Add ROC curve line
    svg.append("path")
        .datum(currentData)
        .attr("class", "roc-line")
        .attr("d", line);

    // Add current point
    if (currentThresholdIndex >= 0) {
        const currentPoint = rocData[currentThresholdIndex];
        svg.append("circle")
            .attr("cx", xScale(currentPoint.fpr))
            .attr("cy", yScale(currentPoint.tpr))
            .attr("r", 6)
            .attr("fill", "#ff6b00")
            .attr("stroke", "#000")
            .attr("stroke-width", 1);

        // Create metrics labels group
        const metricsGroup = svg.append("g");

        // Add background for metrics labels
        // metricsGroup.append("rect")
        //     .attr("class", "label-background")
        //     .attr("x", METRICS_CONFIG.rocWidth / 2 - 70)
        //     .attr("y", -70)
        //     .attr("width", 140)
        //     .attr("height", 55);

        // Display current threshold, TPR, and FPR - positioned much higher above the plot
        metricsGroup.append("text")
            .attr("class", "metrics-label")
            .attr("text-anchor", "middle")
            .attr("x", METRICS_CONFIG.rocWidth / 2)
            .attr("y", -60) // Position much higher above the plot
            .text(`Threshold: ${currentPoint.threshold.toFixed(2)}`);

        metricsGroup.append("text")
            .attr("class", "metrics-label")
            .attr("text-anchor", "middle")
            .attr("x", METRICS_CONFIG.rocWidth / 2)
            .attr("y", -45) // Position much higher above the plot
            .text(`TPR: ${currentPoint.tpr.toFixed(3)}, FPR: ${currentPoint.fpr.toFixed(3)}`);
    }

    // Add axes with borders on all four sides
    // Bottom axis
    svg.append("g")
        .attr("transform", `translate(0,${METRICS_CONFIG.rocHeight})`)
        .call(d3.axisBottom(xScale).ticks(10));

    // Top axis
    svg.append("g")
        .call(d3.axisTop(xScale).ticks(10));

    // Left axis
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(10));

    // Right axis
    svg.append("g")
        .attr("transform", `translate(${METRICS_CONFIG.rocWidth}, 0)`)
        .call(d3.axisRight(yScale).ticks(10));

    // Axis labels
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", METRICS_CONFIG.rocWidth / 2)
        .attr("y", METRICS_CONFIG.rocHeight + 35)
        .text("False Positive Rate");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("x", -METRICS_CONFIG.rocHeight / 2)
        .text("True Positive Rate");

    // Calculate and display AUC with background
    const aucGroup = svg.append("g");

    // aucGroup.append("rect")
    //     .attr("class", "label-background")
    //     .attr("x", METRICS_CONFIG.rocWidth - 65)
    //     .attr("y", -25)
    //     .attr("width", 60)
    //     .attr("height", 20);

    const auc = calculateAUC(rocData);
    aucGroup.append("text")
        .attr("class", "metrics-label")
        .attr("text-anchor", "end")
        .attr("x", METRICS_CONFIG.rocWidth / 2)
        .attr("y", -30)
        .text(`AUC: ${auc.toFixed(3)}`);
}

// Calculate Area Under Curve (AUC)
function calculateAUC(rocData) {
    let auc = 0;
    for (let i = 1; i < rocData.length; i++) {
        const prev = rocData[i - 1];
        const curr = rocData[i];
        auc += (curr.fpr - prev.fpr) * (curr.tpr + prev.tpr) / 2;
    }
    return -1 * auc;
}

// Initialize Binary Classification Metrics visualization
function initMetrics() {
    let data = generateData(METRICS_CONFIG.maxOffset, METRICS_CONFIG.distributionType);
    let rocData = calculateROC(data.labels, data.probabilities);

    // Format data for scatter plot
    let points = data.labels.map((label, i) => ({
        label,
        probability: data.probabilities[i],
        y: Math.random()
    }));

    // Set up controls
    const thresholdSlider = d3.select("#threshold-slider");
    const thresholdValue = d3.select("#threshold-value");
    const maxOffsetSlider = d3.select("#maxOffset-slider");
    const maxOffsetValue = d3.select("#maxOffset-value");
    const distributionSelector = d3.select("#distribution-selector");

    function updateVisualization() {
        const thresholdIndex = +thresholdSlider.property("value");
        const threshold = thresholdIndex / 100;

        thresholdValue.text(threshold.toFixed(2));
        createScatterPlot({points}, threshold, METRICS_CONFIG.distributionType);
        createROCPlot(rocData, thresholdIndex);
    }

    function updateMaxOffset() {
        // Convert slider value (0-20) to maxOffset (0-1 in steps of 0.05)
        METRICS_CONFIG.maxOffset = +maxOffsetSlider.property("value") / 20;
        maxOffsetValue.text(METRICS_CONFIG.maxOffset.toFixed(2));

        regenerateData();
    }

    function updateDistribution() {
        METRICS_CONFIG.distributionType = distributionSelector.property("value");
        regenerateData();
    }

    function regenerateData() {
        // Regenerate data with new parameters
        data = generateData(METRICS_CONFIG.maxOffset, METRICS_CONFIG.distributionType);
        rocData = calculateROC(data.labels, data.probabilities);

        // Update points for scatter plot
        points = data.labels.map((label, i) => ({
            label,
            probability: data.probabilities[i],
            y: Math.random()
        }));

        updateVisualization();
    }

    // Set up event listeners
    thresholdSlider.on("input", updateVisualization);
    maxOffsetSlider.on("input", updateMaxOffset);
    distributionSelector.on("change", updateDistribution);

    updateVisualization(); // Initial render
}

// Initialize visualization when page loads
window.addEventListener('load', function () {
    // The header and footer are loaded by loadObjects.js
    // Initialize visualization after a short delay to ensure DOM is ready
    setTimeout(initMetrics, 100);
});