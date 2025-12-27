// Session Timer Manager
class SessionTimer {
    constructor(timerElementId) {
        this.timerElement = document.getElementById(timerElementId);
        this.startTime = null;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;

        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;

        this.timerInterval = setInterval(() => {
            this.updateDisplay();
        }, 1000);

        this.updateDisplay();
    }

    pause() {
        if (!this.isRunning) return;

        this.elapsedTime = Date.now() - this.startTime;
        this.isRunning = false;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    stop() {
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = null;

        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        this.updateDisplay();
    }

    resetAndStart() {
        this.stop();
        this.start();
    }

    updateDisplay() {
        let displayTime = this.elapsedTime;

        if (this.isRunning && this.startTime) {
            displayTime = Date.now() - this.startTime;
        }

        const hours = Math.floor(displayTime / 3600000);
        const minutes = Math.floor((displayTime % 3600000) / 60000);
        const seconds = Math.floor((displayTime % 60000) / 1000);

        this.timerElement.textContent =
            `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')}`;
    }
}

// Audio Player Manager - controls all players
class AudioPlayerManager {
    constructor(sessionTimer) {
        this.sessionTimer = sessionTimer;
        this.players = {};
        this.currentPlayer = null;
    }

    registerPlayer(playerId, player) {
        this.players[playerId] = player;
    }

    switchToPlayer(playerId, player) {
        // If there's a currently playing player, stop it first
        if (this.currentPlayer && this.currentPlayer !== playerId) {
            // Stop the current player
            this.players[this.currentPlayer].stop();

            // If stopping the custom player, stop its custom timer
            if (this.currentPlayer === 'programmable' && this.players['programmable'].customTimer) {
                this.players['programmable'].customTimer.stop();
            }

            // Remove active styling from previous player's card
            const prevCard = document.getElementById(`card-${this.currentPlayer}`);
            if (prevCard) {
                prevCard.classList.remove('currently-playing');
            }
        }

        // Reset appropriate timer based on player type
        if (playerId === 'programmable') {
            // For custom player: reset and start custom timer
            if (player.customTimer) {
                player.customTimer.resetAndStart();
            }
        } else {
            // For regular players: reset and start main timer
            this.sessionTimer.resetAndStart();
        }

        // Set new current player
        this.currentPlayer = playerId;

        // Add active styling to new player's card
        const currentCard = document.getElementById(`card-${playerId}`);
        if (currentCard) {
            currentCard.classList.add('currently-playing');
        }

        return player;
    }

    playerStopped(playerId) {
        // If the stopped player was the current player, clear current player
        if (this.currentPlayer === playerId) {
            this.currentPlayer = null;
            // Remove active styling from card
            const card = document.getElementById(`card-${playerId}`);
            if (card) {
                card.classList.remove('currently-playing');
            }
        }
    }
}

// Seamless Audio Player using Web Audio API
class SeamlessAudioPlayer {
    constructor(container, audioUrl, playerId, playerManager) {
        this.container = container;
        this.audioUrl = audioUrl;
        this.playerId = playerId;
        this.playerManager = playerManager;
        this.audioContext = null;
        this.audioBuffer = null;
        this.sourceNode = null;
        this.isPlaying = false;
        this.startTime = 0;
        this.pauseTime = 0;
        this.isWebAudioSupported = !!window.AudioContext || !!window.webkitAudioContext;

        // UI Elements
        this.playBtn = container.querySelector('.btn-play');
        this.pauseBtn = container.querySelector('.btn-pause');
        this.stopBtn = container.querySelector('.btn-stop');
        this.loadingStatus = container.querySelector('.loading-status');
        this.timeStatus = container.querySelector('.time-status');
        this.fallbackAudio = container.querySelector('.fallback-audio');

        this.init();
    }

    async init() {
        if (this.isWebAudioSupported) {
            try {
                // Initialize Audio Context (will be suspended until user interaction)
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

                // Load and decode audio
                await this.loadAudio();

                // Enable buttons
                this.playBtn.disabled = false;
                this.pauseBtn.disabled = false;
                this.stopBtn.disabled = false;

                // Update status
                this.loadingStatus.textContent = 'Ready';
                this.loadingStatus.classList.remove('audio-loading');
                this.timeStatus.style.display = 'inline';

                // Set up event listeners
                this.setupEventListeners();

            } catch (error) {
                console.error('Error initializing Web Audio:', error);
                this.fallbackToHTML5Audio();
            }
        } else {
            this.fallbackToHTML5Audio();
        }
    }

    async loadAudio() {
        try {
            const response = await fetch(this.audioUrl);
            const arrayBuffer = await response.arrayBuffer();
            this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
            console.error('Error loading audio:', error);
            throw error;
        }
    }

    fallbackToHTML5Audio() {
        console.log('Web Audio API not supported, falling back to HTML5 Audio');
        this.isWebAudioSupported = false;

        // Show the fallback audio controls
        this.fallbackAudio.style.display = 'block';

        // Hide Web Audio controls
        this.playBtn.style.display = 'none';
        this.pauseBtn.style.display = 'none';
        this.stopBtn.style.display = 'none';
        this.loadingStatus.textContent = 'Using standard audio player';
        this.loadingStatus.classList.remove('audio-loading');
    }

    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.stopBtn.addEventListener('click', () => this.stop());

        // Resume audio context on first user interaction (required by browsers)
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

        // Notify player manager to switch to this player
        this.playerManager.switchToPlayer(this.playerId, this);

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.loop = true; // Seamless looping

        // Connect to destination
        this.sourceNode.connect(this.audioContext.destination);

        // Calculate start time (resume from pause time or start from beginning)
        const startOffset = this.pauseTime % this.audioBuffer.duration;

        // Start playing
        this.sourceNode.start(0, startOffset);
        this.startTime = this.audioContext.currentTime - startOffset;
        this.isPlaying = true;

        // Update UI
        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.playBtn.classList.add('active');
        this.updateTimeDisplay();

        // Set up periodic time updates
        this.timeUpdateInterval = setInterval(() => this.updateTimeDisplay(), 100);

        // Handle when audio naturally ends (shouldn't happen with loop=true, but just in case)
        this.sourceNode.onended = () => {
            if (this.isPlaying) {
                // Immediately restart for seamless playback
                this.stop();
                this.play();
            }
        };
    }

    pause() {
        if (!this.isWebAudioSupported || !this.isPlaying) return;

        // Pause session timer
        this.playerManager.sessionTimer.pause();

        // Calculate current play position
        this.pauseTime = (this.audioContext.currentTime - this.startTime) % this.audioBuffer.duration;

        // Stop the current source
        this.sourceNode.stop();
        this.sourceNode.disconnect();
        this.isPlaying = false;

        // Update UI
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.playBtn.classList.remove('active');

        // Clear time update interval
        clearInterval(this.timeUpdateInterval);
    }

    stop() {
        if (!this.isWebAudioSupported) return;

        // Notify player manager that this player stopped
        this.playerManager.playerStopped(this.playerId);

        // Stop session timer
        this.playerManager.sessionTimer.stop();

        if (this.isPlaying) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
            this.isPlaying = false;
        }

        // Reset to beginning
        this.pauseTime = 0;
        this.startTime = 0;

        // Update UI
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.playBtn.classList.remove('active');

        // Clear time update interval
        clearInterval(this.timeUpdateInterval);
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        if (!this.isWebAudioSupported) return;

        let currentTime = 0;
        if (this.isPlaying) {
            currentTime = (this.audioContext.currentTime - this.startTime) % this.audioBuffer.duration;
        } else {
            currentTime = this.pauseTime;
        }

        const totalTime = this.audioBuffer ? this.audioBuffer.duration : 0;

        // Format time as MM:SS
        const formatTime = (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };

        this.timeStatus.textContent = `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
    }
}