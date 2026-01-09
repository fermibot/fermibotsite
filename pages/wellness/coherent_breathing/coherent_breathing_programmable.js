// Programmable Breathing Sequencer - WITH TICKER AND CIRCULAR TRACKER
class ProgrammableBreathingSequencer {
    constructor(container, playerId, playerManager) {
        this.container = container;
        this.playerId = playerId;
        this.playerManager = playerManager;
        this.audioContext = null;
        this.isPlaying = false;
        this.isWebAudioSupported = !!window.AudioContext || !!window.webkitAudioContext;

        // Audio buffers storage
        this.audioBuffers = {
            in: {},
            out: {},
            pause: {}
        };

        // Current settings
        this.settings = {
            inDuration: 5.5,
            pause1Duration: 0,
            outDuration: 5.5,
            pause2Duration: 0
        };

        // Playback state
        this.currentPhase = 'stopped';
        this.currentSource = null;
        this.nextPhaseTimeout = null;

        // Custom Timer - using the same SessionTimer class (uses prefix 'expert' for expertHours, expertMinutes, expertSeconds)
        this.customTimer = new SessionTimer('expert');

        // Ticker properties
        this.tickerElement = null;
        this.tickerInterval = null;
        this.currentTickerPosition = 0;
        this.cycleStartTime = null;
        this.cycleDuration = 0;

        // Circular tracker properties
        this.circularTracker = null;
        this.circularNeedle = null;
        this.circularPhaseLabel = null;
        this.circularCenterTime = null;

        this.init();
    }

    async init() {
        // First, get all DOM elements
        this.playBtn = document.getElementById('programmablePlay');
        this.pauseBtn = document.getElementById('programmablePause');
        this.stopBtn = document.getElementById('programmableStop');
        this.loadingStatus = document.getElementById('programmableLoading');
        this.currentPhaseElement = document.getElementById('currentPhase');
        this.breathVisualizer = document.getElementById('breathVisualizer');

        // Select elements
        this.inDurationSelect = document.getElementById('inDuration');
        this.pause1DurationSelect = document.getElementById('pause1Duration');
        this.outDurationSelect = document.getElementById('outDuration');
        this.pause2DurationSelect = document.getElementById('pause2Duration');

        // Summary elements
        this.summaryIn = document.getElementById('summaryIn');
        this.summaryPause1 = document.getElementById('summaryPause1');
        this.summaryOut = document.getElementById('summaryOut');
        this.summaryPause2 = document.getElementById('summaryPause2');
        this.totalDurationElement = document.getElementById('totalDuration');

        // Circular tracker elements
        this.circularTrackerContainer = document.getElementById('circularTracker');
        this.circularPhaseLabel = document.getElementById('circularPhaseLabel');

        if (!this.isWebAudioSupported) {
            this.fallbackToHTML5Audio();
            return;
        }

        try {
            // Initialize Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Register audio context for background playback
            if (typeof backgroundAudioManager !== 'undefined') {
                backgroundAudioManager.registerAudioContext(this.audioContext);
            }

            // Load all audio files (including 5.5 seconds)
            await this.loadAllAudioFiles();

            // Enable buttons
            this.playBtn.disabled = false;
            this.pauseBtn.disabled = false;
            this.stopBtn.disabled = false;

            // Update loading status
            this.loadingStatus.textContent = 'Ready to play';
            this.loadingStatus.style.color = '#4caf50';

            // Set up event listeners
            this.setupEventListeners();

            // Initialize visualizer and summary
            this.updateVisualizer();
            this.updateSummary();

            // Create ticker
            this.createTicker();

            // Create circular tracker
            this.createCircularTracker();

        } catch (error) {
            console.error('Error initializing programmable sequencer:', error);
            this.loadingStatus.textContent = 'Error loading audio files';
            this.loadingStatus.style.color = '#f44336';
        }
    }

    async loadAllAudioFiles() {
        // Load In audio files (3, 4, 5, 5.5, 6-9 seconds)
        const inDurations = [3, 4, 5, 5.5, 6, 7, 8, 9];
        for (let duration of inDurations) {
            const url = `BreathIn_DFlat3_${duration}.mp3`;
            this.audioBuffers.in[duration] = await this.loadAudioFile(url);
        }

        // Load Out audio files (3, 4, 5, 5.5, 6-9 seconds)
        const outDurations = [3, 4, 5, 5.5, 6, 7, 8, 9];
        for (let duration of outDurations) {
            const url = `BreathOut_C3_${duration}.mp3`;
            this.audioBuffers.out[duration] = await this.loadAudioFile(url);
        }

        // Load Pause audio files (1-8 seconds)
        for (let i = 1; i <= 8; i++) {
            const url = `BreathPause_E3_${i}.mp3`;
            this.audioBuffers.pause[i] = await this.loadAudioFile(url);
        }
    }

    async loadAudioFile(url) {
        try {
            console.log(`Loading audio file: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            return await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error(`Error loading audio file ${url}:`, error);
            throw error;
        }
    }

    fallbackToHTML5Audio() {
        console.log('Web Audio API not supported for programmable sequencer');
        this.isWebAudioSupported = false;
        this.loadingStatus.textContent = 'Programmable patterns require Web Audio API (not supported in your browser)';
        this.loadingStatus.style.color = '#f44336';
    }

    setupEventListeners() {
        // Button event listeners
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());

        // Select change listeners
        this.inDurationSelect.addEventListener('change', () => this.updateSettings());
        this.pause1DurationSelect.addEventListener('change', () => this.updateSettings());
        this.outDurationSelect.addEventListener('change', () => this.updateSettings());
        this.pause2DurationSelect.addEventListener('change', () => this.updateSettings());

        // Resume audio context on first user interaction
        const resumeAudioContext = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            document.removeEventListener('click', resumeAudioContext);
            document.removeEventListener('touchstart', resumeAudioContext);
        };

        document.addEventListener('click', resumeAudioContext);
        document.addEventListener('touchstart', resumeAudioContext);
    }

    updateSettings() {
        // Get current values from select elements
        this.settings.inDuration = parseFloat(this.inDurationSelect.value);
        this.settings.pause1Duration = parseInt(this.pause1DurationSelect.value);
        this.settings.outDuration = parseFloat(this.outDurationSelect.value);
        this.settings.pause2Duration = parseInt(this.pause2DurationSelect.value);

        // Update visualizer and summary
        this.updateVisualizer();
        this.updateSummary();

        // Update circular tracker
        this.updateCircularTracker();

        // Reset ticker if playing
        if (this.isPlaying) {
            this.resetTicker();
        }

        // If currently playing, stop and restart with new settings
        if (this.isPlaying) {
            this.stop();
            this.play();
        }
    }

    updateVisualizer() {
        const {inDuration, pause1Duration, outDuration, pause2Duration} = this.settings;
        const totalDuration = inDuration + pause1Duration + outDuration + pause2Duration;
        this.cycleDuration = totalDuration;

        // Check if visualizer element exists
        if (!this.breathVisualizer) {
            console.error('Breath visualizer element not found');
            return;
        }

        // Clear visualizer
        this.breathVisualizer.innerHTML = '';

        // Calculate percentages for each phase
        const inPercent = (inDuration / totalDuration) * 100;
        const pause1Percent = (pause1Duration / totalDuration) * 100;
        const outPercent = (outDuration / totalDuration) * 100;
        const pause2Percent = (pause2Duration / totalDuration) * 100;

        // Create phase elements
        let leftPosition = 0;

        // In phase
        if (inDuration > 0) {
            const inElement = document.createElement('div');
            inElement.className = 'breath-phase phase-in';
            inElement.style.left = `${leftPosition}%`;
            inElement.style.width = `${inPercent}%`;
            inElement.textContent = `IN (${inDuration}s)`;
            this.breathVisualizer.appendChild(inElement);
            leftPosition += inPercent;
        }

        // Pause 1 phase
        if (pause1Duration > 0) {
            const pause1Element = document.createElement('div');
            pause1Element.className = 'breath-phase phase-pause1';
            pause1Element.style.left = `${leftPosition}%`;
            pause1Element.style.width = `${pause1Percent}%`;
            pause1Element.textContent = `PAUSE (${pause1Duration}s)`;
            this.breathVisualizer.appendChild(pause1Element);
            leftPosition += pause1Percent;
        }

        // Out phase
        if (outDuration > 0) {
            const outElement = document.createElement('div');
            outElement.className = 'breath-phase phase-out';
            outElement.style.left = `${leftPosition}%`;
            outElement.style.width = `${outPercent}%`;
            outElement.textContent = `OUT (${outDuration}s)`;
            this.breathVisualizer.appendChild(outElement);
            leftPosition += outPercent;
        }

        // Pause 2 phase
        if (pause2Duration > 0) {
            const pause2Element = document.createElement('div');
            pause2Element.className = 'breath-phase phase-pause2';
            pause2Element.style.left = `${leftPosition}%`;
            pause2Element.style.width = `${pause2Percent}%`;
            pause2Element.textContent = `PAUSE (${pause2Duration}s)`;
            this.breathVisualizer.appendChild(pause2Element);
        }

        // Re-create ticker to ensure it's on top
        this.createTicker();
    }

    updateSummary() {
        const {inDuration, pause1Duration, outDuration, pause2Duration} = this.settings;
        const totalDuration = inDuration + pause1Duration + outDuration + pause2Duration;

        // Update summary elements (if they exist)
        if (this.summaryIn) this.summaryIn.textContent = `${inDuration}s`;
        if (this.summaryPause1) this.summaryPause1.textContent = pause1Duration > 0 ? `${pause1Duration}s` : 'None';
        if (this.summaryOut) this.summaryOut.textContent = `${outDuration}s`;
        if (this.summaryPause2) this.summaryPause2.textContent = pause2Duration > 0 ? `${pause2Duration}s` : 'None';
        if (this.totalDurationElement) this.totalDurationElement.textContent = `Total: ${totalDuration}s per cycle`;
    }

    // Ticker methods
    createTicker() {
        // Remove existing ticker if it exists
        if (this.tickerElement) {
            this.tickerElement.remove();
        }

        // Create ticker element
        this.tickerElement = document.createElement('div');
        this.tickerElement.className = 'breath-ticker';

        // Create ticker label
        const tickerLabel = document.createElement('div');
        tickerLabel.className = 'ticker-label';
        tickerLabel.textContent = '●';
        this.tickerElement.appendChild(tickerLabel);

        // Add ticker to visualizer
        this.breathVisualizer.appendChild(this.tickerElement);

        // Reset ticker position
        this.currentTickerPosition = 0;
        this.updateTickerPosition(0);
    }

    updateTickerPosition(elapsedSeconds) {
        if (!this.tickerElement || this.cycleDuration === 0) return;

        // Calculate position as percentage of cycle
        const positionPercent = (elapsedSeconds % this.cycleDuration) / this.cycleDuration * 100;
        this.currentTickerPosition = positionPercent;

        // Update ticker position
        this.tickerElement.style.left = `${positionPercent}%`;

        // Update ticker label with current time in cycle
        const timeInCycle = elapsedSeconds % this.cycleDuration;
        const label = this.tickerElement.querySelector('.ticker-label');
        if (label) {
            label.textContent = `${Math.floor(timeInCycle)}s`;
        }
    }

    startTickerAnimation() {
        if (this.tickerInterval) {
            clearInterval(this.tickerInterval);
        }

        this.cycleStartTime = Date.now();

        // Start circular animation
        this.startCircularAnimation();

        this.tickerInterval = setInterval(() => {
            if (this.isPlaying) {
                const elapsedTime = (Date.now() - this.cycleStartTime) / 1000;
                this.updateTickerPosition(elapsedTime);
                this.updateCircularNeedle(elapsedTime);
            }
        }, 100); // Update 10 times per second for smooth animation

        // Add playing class for animation
        if (this.tickerElement) {
            this.tickerElement.classList.add('playing');
        }
    }

    stopTickerAnimation() {
        if (this.tickerInterval) {
            clearInterval(this.tickerInterval);
            this.tickerInterval = null;
        }

        // Reset ticker to start
        this.updateTickerPosition(0);

        // Stop circular animation
        this.stopCircularAnimation();

        // Remove playing class
        if (this.tickerElement) {
            this.tickerElement.classList.remove('playing');
        }
    }

    resetTicker() {
        this.cycleStartTime = Date.now();
        this.updateTickerPosition(0);
    }

    play() {
        if (!this.isWebAudioSupported || this.isPlaying) return;

        // Notify player manager to switch to this player
        this.playerManager.switchToPlayer(this.playerId, this);

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.isPlaying = true;
        this.currentPhase = 'in';

        // Enable background playback
        if (typeof backgroundAudioManager !== 'undefined') {
            backgroundAudioManager.onPlaybackStart();
        }

        // Start ticker animation
        this.startTickerAnimation();

        // Update UI
        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;
        this.playBtn.classList.add('active');
        this.currentPhaseElement.textContent = 'Starting inhale...';

        // Start the first phase
        this.playNextPhase();
    }

    pause() {
        if (!this.isWebAudioSupported || !this.isPlaying) return;

        // Pause custom timer
        this.customTimer.pause();

        // Pause ticker animation
        this.stopTickerAnimation();

        // Stop current audio
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource.disconnect();
        }

        // Clear any pending phase timeouts
        if (this.nextPhaseTimeout) {
            clearTimeout(this.nextPhaseTimeout);
            this.nextPhaseTimeout = null;
        }

        this.isPlaying = false;
        this.currentPhaseElement.textContent = 'Paused';

        // Update UI
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.playBtn.classList.remove('active');
    }

    stop() {
        if (!this.isWebAudioSupported) return;

        // Notify player manager that this player stopped
        this.playerManager.playerStopped(this.playerId);

        // Stop custom timer
        this.customTimer.stop();

        // Stop ticker animation
        this.stopTickerAnimation();

        // Stop current audio
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource.disconnect();
        }

        // Clear any pending phase timeouts
        if (this.nextPhaseTimeout) {
            clearTimeout(this.nextPhaseTimeout);
            this.nextPhaseTimeout = null;
        }

        this.isPlaying = false;
        this.currentPhase = 'stopped';
        this.currentPhaseElement.textContent = 'Ready to start';

        // Disable background playback and release wake lock
        if (typeof backgroundAudioManager !== 'undefined') {
            backgroundAudioManager.onPlaybackStop();
        }

        // Update UI
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.playBtn.classList.remove('active');
    }

    playNextPhase() {
        if (!this.isPlaying) return;

        const {inDuration, pause1Duration, outDuration, pause2Duration} = this.settings;

        // Determine which phase to play next
        let nextPhase = '';
        let audioBuffer = null;
        let phaseDuration = 0;

        switch (this.currentPhase) {
            case 'in':
                audioBuffer = this.audioBuffers.in[inDuration];
                phaseDuration = inDuration;
                nextPhase = pause1Duration > 0 ? 'pause1' : 'out';
                this.currentPhaseElement.textContent = `Inhale (${inDuration}s)`;
                break;

            case 'pause1':
                audioBuffer = this.audioBuffers.pause[pause1Duration];
                phaseDuration = pause1Duration;
                nextPhase = 'out';
                this.currentPhaseElement.textContent = `Pause after inhale (${pause1Duration}s)`;
                break;

            case 'out':
                audioBuffer = this.audioBuffers.out[outDuration];
                phaseDuration = outDuration;
                nextPhase = pause2Duration > 0 ? 'pause2' : 'in';
                this.currentPhaseElement.textContent = `Exhale (${outDuration}s)`;
                break;

            case 'pause2':
                audioBuffer = this.audioBuffers.pause[pause2Duration];
                phaseDuration = pause2Duration;
                nextPhase = 'in';
                this.currentPhaseElement.textContent = `Pause after exhale (${pause2Duration}s)`;

                // Reset ticker for the next cycle
                setTimeout(() => {
                    if (this.isPlaying) {
                        this.resetTicker();
                    }
                }, phaseDuration * 1000);
                break;

            default:
                // If no phase or stopped, start with 'in'
                this.currentPhase = 'in';
                audioBuffer = this.audioBuffers.in[inDuration];
                phaseDuration = inDuration;
                nextPhase = pause1Duration > 0 ? 'pause1' : 'out';
                this.currentPhaseElement.textContent = `Inhale (${inDuration}s)`;
                break;
        }

        // Play the audio for the current phase
        if (audioBuffer && phaseDuration > 0) {
            this.currentSource = this.audioContext.createBufferSource();
            this.currentSource.buffer = audioBuffer;
            this.currentSource.connect(this.audioContext.destination);
            this.currentSource.start();

            // Schedule next phase
            this.nextPhaseTimeout = setTimeout(() => {
                this.currentPhase = nextPhase;
                this.playNextPhase();
            }, phaseDuration * 1000);
        } else if (phaseDuration === 0) {
            // If phase duration is 0 (no pause), immediately go to next phase
            setTimeout(() => {
                this.currentPhase = nextPhase;
                this.playNextPhase();
            }, 0);
        }
    }

    // ============================================
    // CIRCULAR TRACKER METHODS
    // ============================================

    createCircularTracker() {
        if (!this.circularTrackerContainer) return;

        // Clear existing content
        this.circularTrackerContainer.innerHTML = '';

        const width = 400;
        const height = 400;
        const radius = Math.min(width, height) / 2 - 40;
        const innerRadius = radius * 0.6;

        // Create SVG
        this.circularSvg = d3.select(this.circularTrackerContainer)
            .append('svg')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Create main group centered
        this.circularGroup = this.circularSvg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Create arcs group
        this.arcsGroup = this.circularGroup.append('g').attr('class', 'arcs-group');

        // Create center group for text
        this.centerGroup = this.circularGroup.append('g').attr('class', 'center-group');

        // Add center circle background
        this.centerGroup.append('circle')
            .attr('r', innerRadius - 5)
            .attr('fill', '#f8f9fa')
            .attr('stroke', '#dee2e6')
            .attr('stroke-width', 2);

        // Add center text - empty (removed Cycle label)
        this.centerGroup.append('text')
            .attr('class', 'center-text')
            .attr('y', -15)
            .text('');

        // Add center time display
        this.circularCenterTime = this.centerGroup.append('text')
            .attr('class', 'center-time')
            .attr('y', 15)
            .text('0');

        // Add "Total: Xs" text
        this.centerTotalText = this.centerGroup.append('text')
            .attr('class', 'center-text')
            .attr('y', 40)
            .style('font-size', '11px')
            .text('');

        // Create needle group
        this.needleGroup = this.circularGroup.append('g').attr('class', 'needle-group');

        // Create needle line
        this.needleLine = this.needleGroup.append('line')
            .attr('class', 'tracker-needle-line')
            .attr('x1', 0)
            .attr('y1', -innerRadius + 10)
            .attr('x2', 0)
            .attr('y2', -radius + 5);

        // Create needle dot at the end
        this.needleDot = this.needleGroup.append('circle')
            .attr('class', 'tracker-center-dot')
            .attr('cx', 0)
            .attr('cy', -radius + 5)
            .attr('r', 8);

        // Create center dot
        this.centerDot = this.needleGroup.append('circle')
            .attr('class', 'tracker-center-dot')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 6);

        // Store dimensions for later use
        this.circularDimensions = { width, height, radius, innerRadius };

        // Draw initial arcs
        this.updateCircularTracker();
    }

    updateCircularTracker() {
        if (!this.circularSvg) return;

        const { radius, innerRadius } = this.circularDimensions;
        const { inDuration, pause1Duration, outDuration, pause2Duration } = this.settings;
        const totalDuration = inDuration + pause1Duration + outDuration + pause2Duration;

        // Define phases with their colors
        const phases = [];
        let currentAngle = -Math.PI / 2; // Start from top

        // Phase color palette - vibrant but harmonious
        const phaseColors = {
            in: { main: '#4CAF50', light: '#81C784', label: 'INHALE' },
            pause1: { main: '#FF9800', light: '#FFB74D', label: 'HOLD' },
            out: { main: '#2196F3', light: '#64B5F6', label: 'EXHALE' },
            pause2: { main: '#9C27B0', light: '#BA68C8', label: 'HOLD' }
        };

        // Calculate angles for each phase
        if (inDuration > 0) {
            const angle = (inDuration / totalDuration) * 2 * Math.PI;
            phases.push({
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                duration: inDuration,
                type: 'in',
                color: phaseColors.in
            });
            currentAngle += angle;
        }

        if (pause1Duration > 0) {
            const angle = (pause1Duration / totalDuration) * 2 * Math.PI;
            phases.push({
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                duration: pause1Duration,
                type: 'pause1',
                color: phaseColors.pause1
            });
            currentAngle += angle;
        }

        if (outDuration > 0) {
            const angle = (outDuration / totalDuration) * 2 * Math.PI;
            phases.push({
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                duration: outDuration,
                type: 'out',
                color: phaseColors.out
            });
            currentAngle += angle;
        }

        if (pause2Duration > 0) {
            const angle = (pause2Duration / totalDuration) * 2 * Math.PI;
            phases.push({
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                duration: pause2Duration,
                type: 'pause2',
                color: phaseColors.pause2
            });
        }

        // Create arc generator
        const arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .padAngle(0.02)
            .cornerRadius(4);

        // Create label arc (for positioning labels)
        const labelArc = d3.arc()
            .innerRadius((radius + innerRadius) / 2)
            .outerRadius((radius + innerRadius) / 2);

        // Update arcs
        const arcs = this.arcsGroup.selectAll('.phase-arc')
            .data(phases, d => d.type);

        // Remove old arcs
        arcs.exit().remove();

        // Add new arcs
        const enterArcs = arcs.enter()
            .append('g')
            .attr('class', 'phase-arc-group');

        enterArcs.append('path')
            .attr('class', d => `phase-arc circular-phase-${d.type}`);

        enterArcs.append('text')
            .attr('class', 'phase-label-text');

        enterArcs.append('text')
            .attr('class', 'phase-duration-text');

        // Update all arcs
        const allArcs = this.arcsGroup.selectAll('.phase-arc-group');

        allArcs.select('path')
            .transition()
            .duration(300)
            .attr('d', d => arc(d))
            .style('fill', d => d.color.main);

        // Update labels
        allArcs.select('.phase-label-text')
            .attr('transform', d => {
                const centroid = labelArc.centroid(d);
                return `translate(${centroid[0]}, ${centroid[1] - 8})`;
            })
            .text(d => d.color.label);

        allArcs.select('.phase-duration-text')
            .attr('transform', d => {
                const centroid = labelArc.centroid(d);
                return `translate(${centroid[0]}, ${centroid[1] + 8})`;
            })
            .text(d => `${d.duration}s`);

        // Update center total text
        this.centerTotalText.text(`Total: ${totalDuration}s`);

        // Store phases for animation
        this.circularPhases = phases;
    }

    updateCircularNeedle(elapsedSeconds) {
        if (!this.needleGroup || this.cycleDuration === 0) return;

        // Calculate angle based on elapsed time
        const progress = (elapsedSeconds % this.cycleDuration) / this.cycleDuration;
        const angle = progress * 360 - 90; // -90 to start from top

        // Rotate needle group
        this.needleGroup
            .attr('transform', `rotate(${angle})`);

        // Update center time display
        const timeInCycle = elapsedSeconds % this.cycleDuration;
        this.circularCenterTime.text(Math.floor(timeInCycle));

        // Determine current phase and update label
        this.updateCircularPhaseLabel(timeInCycle);
    }

    updateCircularPhaseLabel(timeInCycle) {
        if (!this.circularPhases || !this.circularPhaseLabel) return;

        const { inDuration, pause1Duration, outDuration, pause2Duration } = this.settings;
        let currentPhaseName = '';
        let phaseTime = 0;

        if (timeInCycle < inDuration) {
            currentPhaseName = 'Inhale';
            phaseTime = inDuration - timeInCycle;
        } else if (timeInCycle < inDuration + pause1Duration) {
            currentPhaseName = 'Hold';
            phaseTime = (inDuration + pause1Duration) - timeInCycle;
        } else if (timeInCycle < inDuration + pause1Duration + outDuration) {
            currentPhaseName = 'Exhale';
            phaseTime = (inDuration + pause1Duration + outDuration) - timeInCycle;
        } else {
            currentPhaseName = 'Hold';
            phaseTime = this.cycleDuration - timeInCycle;
        }

        this.circularPhaseLabel.textContent = `${currentPhaseName} - ${Math.ceil(phaseTime)}s remaining`;
    }

    startCircularAnimation() {
        // Animation is handled by the ticker interval - just reset position
        this.updateCircularNeedle(0);
        if (this.circularPhaseLabel) {
            this.circularPhaseLabel.textContent = 'Starting...';
        }
    }

    stopCircularAnimation() {
        // Reset needle to starting position
        if (this.needleGroup) {
            this.needleGroup.attr('transform', 'rotate(-90)');
        }
        if (this.circularCenterTime) {
            this.circularCenterTime.text('0');
        }
        if (this.circularPhaseLabel) {
            this.circularPhaseLabel.textContent = 'Ready to start';
        }
    }
}