// Global state for unified player
let unifiedPlayer = null;
let selectedPatternId = '55.5';
let selectedAudioUrl = 'Coherent_Piano_5.5_5.5.mp3';

// ============================================
// BACKGROUND AUDIO PLAYBACK MANAGER
// ============================================
class BackgroundAudioManager {
    constructor() {
        this.wakeLock = null;
        this.audioContexts = [];
        this.setupVisibilityHandling();
        this.setupWakeLock();
    }

    // Register an audio context for background playback support
    registerAudioContext(audioContext) {
        if (audioContext && !this.audioContexts.includes(audioContext)) {
            this.audioContexts.push(audioContext);
        }
    }

    // Setup visibility change handling to keep audio playing in background
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden (screen off, switched tabs, etc.)
                console.log('Page hidden - maintaining audio playback');

                // Ensure all audio contexts stay running
                this.audioContexts.forEach(ctx => {
                    if (ctx.state === 'suspended') {
                        ctx.resume().catch(err => {
                            console.warn('Could not resume audio context:', err);
                        });
                    }
                });
            } else {
                // Page is visible again
                console.log('Page visible - resuming normal operation');

                // Resume any suspended audio contexts
                this.audioContexts.forEach(ctx => {
                    if (ctx.state === 'suspended') {
                        ctx.resume().catch(err => {
                            console.warn('Could not resume audio context:', err);
                        });
                    }
                });

                // Re-request wake lock if it was released
                this.requestWakeLock();
            }
        });

        // Handle page blur/focus events (iOS Safari)
        window.addEventListener('blur', () => {
            console.log('Window blurred - maintaining audio playback');
            this.audioContexts.forEach(ctx => {
                if (ctx.state === 'suspended') {
                    ctx.resume().catch(err => console.warn('Resume failed:', err));
                }
            });
        });

        window.addEventListener('focus', () => {
            console.log('Window focused');
            this.requestWakeLock();
        });
    }

    // Setup Wake Lock API to prevent screen from sleeping during playback
    async setupWakeLock() {
        if (!('wakeLock' in navigator)) {
            console.log('Wake Lock API not supported');
            return;
        }

        // Request wake lock when playback starts
        await this.requestWakeLock();
    }

    async requestWakeLock() {
        if (!('wakeLock' in navigator)) return;

        try {
            // Release existing wake lock if any
            if (this.wakeLock !== null) {
                await this.wakeLock.release();
                this.wakeLock = null;
            }

            // Request new wake lock
            this.wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock acquired');

            // Listen for wake lock release
            this.wakeLock.addEventListener('release', () => {
                console.log('Wake Lock released');
            });
        } catch (err) {
            console.warn('Wake Lock request failed:', err);
        }
    }

    async releaseWakeLock() {
        if (this.wakeLock !== null) {
            try {
                await this.wakeLock.release();
                this.wakeLock = null;
                console.log('Wake Lock manually released');
            } catch (err) {
                console.warn('Wake Lock release failed:', err);
            }
        }
    }

    // Call this when audio playback starts
    onPlaybackStart() {
        this.requestWakeLock();
    }

    // Call this when audio playback stops
    onPlaybackStop() {
        this.releaseWakeLock();
    }
}

// Create global background audio manager
const backgroundAudioManager = new BackgroundAudioManager();

// Pattern selection function
function selectPattern(card) {
    // If currently playing, stop first
    if (unifiedPlayer && unifiedPlayer.isPlaying) {
        unifiedPlayer.stop();
    }

    // Remove selected class from all cards
    document.querySelectorAll('.pattern-selector-card').forEach(c => {
        c.classList.remove('selected');
    });

    // Add selected class to clicked card
    card.classList.add('selected');

    // Get pattern data
    selectedPatternId = card.dataset.patternId;
    selectedAudioUrl = card.dataset.audioUrl;

    // Update display
    const patternTitle = card.querySelector('.pattern-title').textContent.trim();
    document.getElementById('selectedPatternDisplay').textContent = `Selected: ${patternTitle}`;

    // Update the unified player's audio URL
    if (unifiedPlayer) {
        unifiedPlayer.setAudioUrl(selectedAudioUrl, selectedPatternId);
    }
}

// Unified Audio Player using Web Audio API
class UnifiedAudioPlayer {
    constructor(sessionTimer) {
        this.sessionTimer = sessionTimer;
        this.audioContext = null;
        this.audioBuffers = {}; // Cache for loaded audio buffers
        this.currentBuffer = null;
        this.sourceNode = null;
        this.isPlaying = false;
        this.startTime = 0;
        this.pauseTime = 0;
        this.isWebAudioSupported = !!window.AudioContext || !!window.webkitAudioContext;
        this.currentPatternId = '55.5';

        // UI Elements
        this.playBtn = document.getElementById('unifiedPlay');
        this.pauseBtn = document.getElementById('unifiedPause');
        this.stopBtn = document.getElementById('unifiedStop');
        this.loadingStatus = document.getElementById('unifiedLoadingStatus');

        this.init();
    }

    async init() {
        if (this.isWebAudioSupported) {
            try {
                // Initialize Audio Context
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // Register audio context for background playback
                backgroundAudioManager.registerAudioContext(this.audioContext);

                // Pre-load all pattern audio files
                await this.preloadAllPatterns();

                // Set initial buffer
                this.currentBuffer = this.audioBuffers['55.5'];

                // Enable buttons
                this.playBtn.disabled = false;
                this.pauseBtn.disabled = true;
                this.stopBtn.disabled = false;

                // Update status
                this.loadingStatus.textContent = 'Ready';
                this.loadingStatus.style.display = 'none';

                // Set up event listeners
                this.setupEventListeners();

            } catch (error) {
                console.error('Error initializing Web Audio:', error);
                this.loadingStatus.textContent = 'Error loading audio files';
                this.loadingStatus.style.color = '#f44336';
            }
        } else {
            this.loadingStatus.textContent = 'Web Audio API not supported in this browser';
            this.loadingStatus.style.color = '#f44336';
        }
    }

    async preloadAllPatterns() {
        const patterns = {
            '55.5': 'Coherent_Piano_5.5_5.5.mp3',
            '55': 'Coherent_Piano_5_5.mp3',
            '66': 'Coherent_Piano_6_6.mp3',
            '77': 'Coherent_Piano_7_7.mp3',
            '88': 'Coherent_Piano_8_8.mp3'
        };

        for (const [id, url] of Object.entries(patterns)) {
            this.audioBuffers[id] = await this.loadAudio(url);
        }
    }

    async loadAudio(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            return await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading audio:', error);
            throw error;
        }
    }

    setAudioUrl(url, patternId) {
        this.currentPatternId = patternId;
        this.currentBuffer = this.audioBuffers[patternId];
        this.pauseTime = 0; // Reset pause time when changing patterns
    }

    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());

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

    play() {
        if (!this.isWebAudioSupported) return;
        if (this.isPlaying) return;

        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Start or resume session timer
        if (this.pauseTime === 0) {
            this.sessionTimer.resetAndStart();
        } else {
            this.sessionTimer.start();
        }

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.currentBuffer;
        this.sourceNode.loop = true;

        // Connect to destination
        this.sourceNode.connect(this.audioContext.destination);

        // Calculate start offset
        const startOffset = this.pauseTime % this.currentBuffer.duration;

        // Start playing
        this.sourceNode.start(0, startOffset);
        this.startTime = this.audioContext.currentTime - startOffset;
        this.isPlaying = true;

        // Enable background playback
        backgroundAudioManager.onPlaybackStart();

        // Update UI
        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.playBtn.classList.add('active');

        // Highlight selected card
        document.querySelectorAll('.pattern-selector-card').forEach(card => {
            if (card.dataset.patternId === this.currentPatternId) {
                card.classList.add('playing');
            }
        });
    }

    pause() {
        if (!this.isWebAudioSupported || !this.isPlaying) return;

        // Pause session timer
        this.sessionTimer.pause();

        // Calculate current position
        this.pauseTime = (this.audioContext.currentTime - this.startTime) % this.currentBuffer.duration;

        // Stop the source
        this.sourceNode.stop();
        this.sourceNode.disconnect();
        this.isPlaying = false;

        // Update UI
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.playBtn.classList.remove('active');

        // Remove playing class from cards
        document.querySelectorAll('.pattern-selector-card').forEach(card => {
            card.classList.remove('playing');
        });
    }

    stop() {
        if (!this.isWebAudioSupported) return;

        // Stop session timer
        this.sessionTimer.stop();

        if (this.isPlaying) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.isPlaying = false;
        }

        // Disable background playback and release wake lock
        backgroundAudioManager.onPlaybackStop();

        // Reset
        this.pauseTime = 0;
        this.startTime = 0;

        // Update UI
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.playBtn.classList.remove('active');

        // Remove playing class from cards
        document.querySelectorAll('.pattern-selector-card').forEach(card => {
            card.classList.remove('playing');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create session timer instance
    const sessionTimer = new SessionTimer('sessionTimer');

    // Create player manager instance (still needed for programmable section)
    const playerManager = new AudioPlayerManager(sessionTimer);

    // Initialize unified player for practitioner section
    unifiedPlayer = new UnifiedAudioPlayer(sessionTimer);

    // Initialize programmable breathing sequencer
    const programmableSequencer = new ProgrammableBreathingSequencer(
        document.getElementById('programmableSection'),
        'programmable',
        playerManager
    );
    playerManager.registerPlayer('programmable', programmableSequencer);

    // Store for global access if needed
    window.audioPlayers = {
        unifiedPlayer,
        programmableSequencer,
        sessionTimer,
        playerManager
    };
});

// Add to coherent_breathing_main.js, at the end of DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Bootstrap alerts (if Bootstrap is loaded)
    if (typeof bootstrap !== 'undefined') {
        document.querySelectorAll('.alert').forEach(alertElement => {
            new bootstrap.Alert(alertElement);
        });
    }
});