// Programmable Breathing Sequencer - WITH TICKER
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
        this.cycleCount = 0;
        this.currentSource = null;
        this.nextPhaseTimeout = null;

        // Custom Timer - using the same SessionTimer class
        this.customTimer = new SessionTimer('customPatternTimer');

        // Ticker properties
        this.tickerElement = null;
        this.tickerInterval = null;
        this.currentTickerPosition = 0;
        this.cycleStartTime = null;
        this.cycleDuration = 0;

        this.init();
    }

    async init() {
        // First, get all DOM elements
        this.playBtn = document.getElementById('programmablePlay');
        this.pauseBtn = document.getElementById('programmablePause');
        this.stopBtn = document.getElementById('programmableStop');
        this.loadingStatus = document.getElementById('programmableLoading');
        this.currentPhaseElement = document.getElementById('currentPhase');
        this.cycleCounterElement = document.getElementById('cycleCounter');
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

        if (!this.isWebAudioSupported) {
            this.fallbackToHTML5Audio();
            return;
        }

        try {
            // Initialize Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

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

        } catch (error) {
            console.error('Error initializing programmable sequencer:', error);
            this.loadingStatus.textContent = 'Error loading audio files';
            this.loadingStatus.style.color = '#f44336';
        }
    }

    async loadAllAudioFiles() {
        // Load In audio files (5, 5.5, 6-9 seconds)
        const inDurations = [5, 5.5, 6, 7, 8, 9];
        for (let duration of inDurations) {
            const url = `BreathIn_DFlat3_${duration}.mp3`;
            this.audioBuffers.in[duration] = await this.loadAudioFile(url);
        }

        // Load Out audio files (5, 5.5, 6-9 seconds)
        const outDurations = [5, 5.5, 6, 7, 8, 9];
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

        // Update summary elements
        this.summaryIn.textContent = `${inDuration}s`;
        this.summaryPause1.textContent = pause1Duration > 0 ? `${pause1Duration}s` : 'None';
        this.summaryOut.textContent = `${outDuration}s`;
        this.summaryPause2.textContent = pause2Duration > 0 ? `${pause2Duration}s` : 'None';
        this.totalDurationElement.textContent = `Total: ${totalDuration}s per cycle`;
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

        this.tickerInterval = setInterval(() => {
            if (this.isPlaying) {
                const elapsedTime = (Date.now() - this.cycleStartTime) / 1000;
                this.updateTickerPosition(elapsedTime);
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
        this.cycleCount = 0;

        // Start ticker animation
        this.startTickerAnimation();

        // Update UI
        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.stopBtn.disabled = false;
        this.playBtn.classList.add('active');
        this.currentPhaseElement.textContent = 'Starting inhale...';
        this.cycleCounterElement.textContent = 'Cycle: 0';

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
        this.cycleCount = 0;
        this.currentPhaseElement.textContent = 'Ready to start';
        this.cycleCounterElement.textContent = 'Cycle: 0';

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

                // Increment cycle counter after completing a full cycle
                this.cycleCount++;
                this.cycleCounterElement.textContent = `Cycle: ${this.cycleCount}`;

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
}