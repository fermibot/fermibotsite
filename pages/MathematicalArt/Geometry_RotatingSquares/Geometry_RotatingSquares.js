// Rotating Squares Visualization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize parameters matching the original Mathematica code
    const originalParams = {
        squareCount: 13,        // Step size: π/13
        minRadius: 1,           // Multiplier for π
        maxRadius: 10,          // Multiplier for π
        opacity: 0.017,
        strokeOpacity: 0.15,
        rotationFactor: 1.0,
        fillColor: '#ff69b4',   // Pink
        strokeColors: ['#008000', '#006400', '#add8e6'], // Green, Dark Green, Light Blue
        animationSpeed: 1.0,
        animate: true
    };

    // Current parameters (start with original)
    let params = JSON.parse(JSON.stringify(originalParams));

    // SVG setup
    const container = document.querySelector('.visualization-wrapper');
    const width = container.clientWidth;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    // Create SVG
    const svg = d3.select('#svg-canvas')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', 'white');

    // Create a group for all squares (for zoom/pan)
    const mainGroup = svg.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);

    // Create a group for squares
    const squaresGroup = mainGroup.append('g');

    // Tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('pointer-events', 'none');

    // Animation variables
    let animationId = null;
    let animationTime = 0;

    // Function to generate random stroke color from selected colors
    function getRandomStrokeColor() {
        if (params.strokeColors.length === 0) {
            return '#000000'; // Default to black if no colors selected
        }
        const randomIndex = Math.floor(Math.random() * params.strokeColors.length);
        return params.strokeColors[randomIndex];
    }

    // Function to update parameter displays
    function updateParameterDisplays() {
        const step = Math.PI / params.squareCount;
        const minR = params.minRadius * Math.PI;
        const maxR = params.maxRadius * Math.PI;

        // Update parameter values display
        document.getElementById('current-radii').textContent =
            `${minR.toFixed(2)} to ${maxR.toFixed(2)}`;
        document.getElementById('current-step').textContent =
            `π/${params.squareCount} ≈ ${step.toFixed(3)}`;
        document.getElementById('current-squares').textContent =
            params.squareCount;
        document.getElementById('current-rotation').textContent =
            `r² × ${params.rotationFactor.toFixed(1)}`;
        document.getElementById('current-fillColor').textContent =
            `Pink (${params.fillColor})`;
        document.getElementById('current-strokeColors').textContent =
            params.strokeColors.map(color => {
                const colors = {
                    '#008000': 'Green',
                    '#006400': 'Dark Green',
                    '#add8e6': 'Light Blue'
                };
                return colors[color] || color;
            }).join(', ');
    }

    // Function to draw visualization
    function drawVisualization() {
        // Clear existing squares
        squaresGroup.selectAll('rect').remove();

        // Calculate parameters
        const minRadius = params.minRadius * Math.PI;
        const maxRadius = params.maxRadius * Math.PI;
        const step = (maxRadius - minRadius) / (params.squareCount - 1);

        // Create squares
        const squares = squaresGroup.selectAll('rect')
            .data(d3.range(minRadius, maxRadius + step, step))
            .enter()
            .append('rect')
            .attr('x', d => -d)
            .attr('y', d => -d)
            .attr('width', d => d * 2)
            .attr('height', d => d * 2)
            .attr('fill', params.fillColor)
            .attr('opacity', params.opacity)
            .attr('stroke', getRandomStrokeColor)
            .attr('stroke-width', 1)
            .attr('stroke-opacity', params.strokeOpacity)
            .attr('transform', function(d) {
                const rotation = d * d * params.rotationFactor;
                const animationOffset = params.animate && params.animationSpeed > 0 ?
                    animationTime * params.animationSpeed * 0.01 : 0;
                return `rotate(${rotation + animationOffset})`;
            })
            .on('mouseover', function(event, d) {
                // Show tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0.95);

                const rotation = d * d * params.rotationFactor;
                const animationOffset = params.animate && params.animationSpeed > 0 ?
                    animationTime * params.animationSpeed * 0.01 : 0;
                const totalRotation = rotation + animationOffset;

                tooltip.html(`
                    <h6>Square Details</h6>
                    <table>
                        <tr><td>Radius:</td><td>${d.toFixed(3)}</td></tr>
                        <tr><td>Size:</td><td>${(d * 2).toFixed(3)} × ${(d * 2).toFixed(3)}</td></tr>
                        <tr><td>Rotation:</td><td>${totalRotation.toFixed(3)} rad</td></tr>
                        <tr><td>Opacity:</td><td>${params.opacity.toFixed(4)}</td></tr>
                        <tr><td>Stroke Opacity:</td><td>${params.strokeOpacity.toFixed(2)}</td></tr>
                    </table>
                `)
                    .style('left', (event.pageX + 15) + 'px')
                    .style('top', (event.pageY - 15) + 'px');

                // Highlight square on hover
                d3.select(this)
                    .attr('stroke-width', 2)
                    .attr('opacity', params.opacity * 3);
            })
            .on('mouseout', function() {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);

                // Restore original styling
                d3.select(this)
                    .attr('stroke-width', 1)
                    .attr('opacity', params.opacity);
            });

        // Update parameter displays
        updateParameterDisplays();
    }

    // Animation loop
    function animate() {
        if (params.animate && params.animationSpeed > 0) {
            animationTime += 1;
            squaresGroup.selectAll('rect')
                .attr('transform', function(d) {
                    const rotation = d * d * params.rotationFactor;
                    const animationOffset = animationTime * params.animationSpeed * 0.01;
                    return `rotate(${rotation + animationOffset})`;
                });
        }
        animationId = requestAnimationFrame(animate);
    }

    // Initialize controls
    function initializeControls() {
        // Square Count
        const squareCountSlider = document.getElementById('squareCount-slider');
        const squareCountValue = document.getElementById('squareCount-value');
        squareCountSlider.value = params.squareCount;
        squareCountValue.textContent = params.squareCount;

        squareCountSlider.addEventListener('input', function() {
            params.squareCount = parseInt(this.value);
            squareCountValue.textContent = params.squareCount;
            drawVisualization();
        });

        // Min Radius
        const minRadiusSlider = document.getElementById('minRadius-slider');
        const minRadiusValue = document.getElementById('minRadius-value');
        minRadiusSlider.value = params.minRadius;
        minRadiusValue.textContent = params.minRadius.toFixed(1);

        minRadiusSlider.addEventListener('input', function() {
            params.minRadius = parseFloat(this.value);
            minRadiusValue.textContent = params.minRadius.toFixed(1);
            drawVisualization();
        });

        // Max Radius
        const maxRadiusSlider = document.getElementById('maxRadius-slider');
        const maxRadiusValue = document.getElementById('maxRadius-value');
        maxRadiusSlider.value = params.maxRadius;
        maxRadiusValue.textContent = params.maxRadius.toFixed(1);

        maxRadiusSlider.addEventListener('input', function() {
            params.maxRadius = parseFloat(this.value);
            maxRadiusValue.textContent = params.maxRadius.toFixed(1);
            drawVisualization();
        });

        // Rotation Factor
        const rotationFactorSlider = document.getElementById('rotationFactor-slider');
        const rotationFactorValue = document.getElementById('rotationFactor-value');
        rotationFactorSlider.value = params.rotationFactor;
        rotationFactorValue.textContent = params.rotationFactor.toFixed(1);

        rotationFactorSlider.addEventListener('input', function() {
            params.rotationFactor = parseFloat(this.value);
            rotationFactorValue.textContent = params.rotationFactor.toFixed(1);
            drawVisualization();
        });

        // Opacity
        const opacitySlider = document.getElementById('opacity-slider');
        const opacityValue = document.getElementById('opacity-value');
        opacitySlider.value = params.opacity;
        opacityValue.textContent = params.opacity.toFixed(3);

        opacitySlider.addEventListener('input', function() {
            params.opacity = parseFloat(this.value);
            opacityValue.textContent = params.opacity.toFixed(3);
            squaresGroup.selectAll('rect')
                .attr('opacity', params.opacity);
        });

        // Stroke Opacity
        const strokeOpacitySlider = document.getElementById('strokeOpacity-slider');
        const strokeOpacityValue = document.getElementById('strokeOpacity-value');
        strokeOpacitySlider.value = params.strokeOpacity;
        strokeOpacityValue.textContent = params.strokeOpacity;

        strokeOpacitySlider.addEventListener('input', function() {
            params.strokeOpacity = parseFloat(this.value);
            strokeOpacityValue.textContent = params.strokeOpacity;
            squaresGroup.selectAll('rect')
                .attr('stroke-opacity', params.strokeOpacity);
        });

        // Animation Speed
        const animationSpeedSlider = document.getElementById('animationSpeed-slider');
        const animationSpeedValue = document.getElementById('animationSpeed-value');
        animationSpeedSlider.value = params.animationSpeed;
        animationSpeedValue.textContent = params.animationSpeed.toFixed(1);

        animationSpeedSlider.addEventListener('input', function() {
            params.animationSpeed = parseFloat(this.value);
            animationSpeedValue.textContent = params.animationSpeed.toFixed(1);
            params.animate = params.animationSpeed > 0;
        });

        // Fill Color
        const fillColorPicker = document.getElementById('fillColor-picker');
        fillColorPicker.value = params.fillColor;

        fillColorPicker.addEventListener('input', function() {
            params.fillColor = this.value;
            squaresGroup.selectAll('rect')
                .attr('fill', params.fillColor);
            document.getElementById('current-fillColor').textContent =
                `Pink (${params.fillColor})`;
        });

        // Stroke Colors
        const strokeCheckboxes = ['greenStroke', 'darkGreenStroke', 'lightBlueStroke'];
        strokeCheckboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            checkbox.checked = true;
            checkbox.addEventListener('change', updateStrokeColors);
        });

        // Reset Button
        document.getElementById('resetBtn').addEventListener('click', function() {
            params = JSON.parse(JSON.stringify(originalParams));

            // Update all controls
            squareCountSlider.value = params.squareCount;
            squareCountValue.textContent = params.squareCount;

            minRadiusSlider.value = params.minRadius;
            minRadiusValue.textContent = params.minRadius.toFixed(1);

            maxRadiusSlider.value = params.maxRadius;
            maxRadiusValue.textContent = params.maxRadius.toFixed(1);

            rotationFactorSlider.value = params.rotationFactor;
            rotationFactorValue.textContent = params.rotationFactor.toFixed(1);

            opacitySlider.value = params.opacity;
            opacityValue.textContent = params.opacity.toFixed(3);

            strokeOpacitySlider.value = params.strokeOpacity;
            strokeOpacityValue.textContent = params.strokeOpacity;

            animationSpeedSlider.value = params.animationSpeed;
            animationSpeedValue.textContent = params.animationSpeed.toFixed(1);

            fillColorPicker.value = params.fillColor;

            strokeCheckboxes.forEach(id => {
                document.getElementById(id).checked = true;
            });

            drawVisualization();
        });

        // Export Button
        document.getElementById('exportBtn').addEventListener('click', function() {
            const svgElement = document.getElementById('svg-canvas');
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            canvas.width = width;
            canvas.height = height;

            img.onload = function() {
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);

                const link = document.createElement('a');
                link.download = 'rotating-squares.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        });
    }

    // Function to update stroke colors
    function updateStrokeColors() {
        const activeColors = [];
        if (document.getElementById('greenStroke').checked) activeColors.push('#008000');
        if (document.getElementById('darkGreenStroke').checked) activeColors.push('#006400');
        if (document.getElementById('lightBlueStroke').checked) activeColors.push('#add8e6');

        params.strokeColors = activeColors.length > 0 ? activeColors : ['#000000'];

        // Update stroke colors of existing squares
        squaresGroup.selectAll('rect')
            .attr('stroke', getRandomStrokeColor);

        // Update display
        updateParameterDisplays();
    }

    // Add zoom and pan functionality
    function addZoomPan() {
        const zoom = d3.zoom()
            .scaleExtent([0.1, 10])
            .on('zoom', function(event) {
                mainGroup.attr('transform', event.transform);
            });

        svg.call(zoom);
    }

    // Initialize everything
    function init() {
        initializeControls();
        drawVisualization();
        addZoomPan();
        animate();

        // Update on window resize
        window.addEventListener('resize', function() {
            const newWidth = container.clientWidth;
            svg.attr('width', newWidth);
        });
    }

    // Start the application
    init();
});