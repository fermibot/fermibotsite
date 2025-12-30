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