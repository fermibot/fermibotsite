// Session Timer Manager
class SessionTimer {
    constructor(timerPrefix) {
        // Support both old single element and new separate fields
        this.timerPrefix = timerPrefix;

        // Try to get separate fields first
        this.hoursElement = document.getElementById(timerPrefix + 'Hours');
        this.minutesElement = document.getElementById(timerPrefix + 'Minutes');
        this.secondsElement = document.getElementById(timerPrefix + 'Seconds');

        // Check if we're using separate fields or single element
        this.useSeparateFields = !!(this.hoursElement && this.minutesElement && this.secondsElement);

        // Fallback to single element for backwards compatibility
        if (!this.useSeparateFields) {
            this.timerElement = document.getElementById(timerPrefix);
        }

        this.startTime = null;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;

        // Timer mode: 'timed' (countdown) or 'infinite' (count up)
        this.mode = 'timed';
        this.targetDuration = 300000; // Default 5 minutes in milliseconds
        this.onTimerComplete = null; // Callback when countdown reaches 0
        this.timerCompleted = false; // Track if countdown finished
    }

    setMode(mode) {
        this.mode = mode;
        // Reset timer when switching modes
        this.stop();
        this.timerCompleted = false;
        this.updateDisplay();
    }

    setTargetDuration(seconds) {
        this.targetDuration = seconds * 1000;
        this.timerCompleted = false; // Reset completed flag when duration changes
        if (!this.isRunning && this.mode === 'timed') {
            this.updateDisplay();
        }
    }

    setOnTimerComplete(callback) {
        this.onTimerComplete = callback;
    }

    start() {
        if (this.isRunning) return;

        // If timer was completed, reset it first
        if (this.timerCompleted) {
            this.timerCompleted = false;
        }

        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;

        this.timerInterval = setInterval(() => {
            this.updateDisplay();

            // Check if countdown has completed
            if (this.mode === 'timed') {
                const elapsed = Date.now() - this.startTime;
                if (elapsed >= this.targetDuration) {
                    this.timerCompleted = true;
                    this.stop();
                    if (this.onTimerComplete) {
                        this.onTimerComplete();
                    }
                }
            }
        }, 100); // Update more frequently for smoother display

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
        this.timerCompleted = false;
        this.stop();
        this.start();
    }

    updateDisplay() {
        let displayTime;

        if (this.mode === 'infinite') {
            // Count up mode
            displayTime = this.elapsedTime;
            if (this.isRunning && this.startTime) {
                displayTime = Date.now() - this.startTime;
            }
        } else {
            // Countdown mode
            if (this.timerCompleted) {
                // Timer finished - show zero
                displayTime = 0;
            } else if (this.isRunning && this.startTime) {
                const elapsed = Date.now() - this.startTime;
                displayTime = Math.max(0, this.targetDuration - elapsed);
            } else if (this.elapsedTime > 0) {
                displayTime = Math.max(0, this.targetDuration - this.elapsedTime);
            } else {
                displayTime = this.targetDuration;
            }
        }

        const hours = Math.floor(displayTime / 3600000);
        const minutes = Math.floor((displayTime % 3600000) / 60000);
        const seconds = Math.floor((displayTime % 60000) / 1000);

        if (this.useSeparateFields) {
            // Update separate fields - pad with zeros
            this.hoursElement.value = hours.toString().padStart(2, '0');
            this.minutesElement.value = minutes.toString().padStart(2, '0');
            this.secondsElement.value = seconds.toString().padStart(2, '0');
        } else if (this.timerElement) {
            // Update single element (backwards compatibility)
            const formattedTime =
                `${hours.toString().padStart(2, '0')}:` +
                `${minutes.toString().padStart(2, '0')}:` +
                `${seconds.toString().padStart(2, '0')}`;

            if (this.timerElement.tagName === 'INPUT') {
                this.timerElement.value = formattedTime;
            } else {
                this.timerElement.textContent = formattedTime;
            }
        }
    }
}

// Audio Player Manager - controls all players (used primarily for programmable section)
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