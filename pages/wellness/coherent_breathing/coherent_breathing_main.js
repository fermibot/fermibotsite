// Initialize players when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create session timer instance
    const sessionTimer = new SessionTimer('sessionTimer');

    // Create player manager instance
    const playerManager = new AudioPlayerManager(sessionTimer);

    // Initialize all pattern players
    const players = {};

    // NEW: 5.5-5.5 pattern player (standard pattern)
    const player55_5Container = document.querySelector('.seamless-audio-player[data-audio-id="55.5"]');
    players.player55_5 = new SeamlessAudioPlayer(
        player55_5Container,
        'Coherent_Piano_5.5_5.5_fermibot.mp3',
        '55.5',
        playerManager
    );
    playerManager.registerPlayer('55.5', players.player55_5);

    // 5-5 pattern player (first row, first card)
    const player55Container = document.querySelector('.seamless-audio-player[data-audio-id="55"]');
    players.player55 = new SeamlessAudioPlayer(
        player55Container,
        'Coherent_Piano_5_5_fermibot.mp3',
        '55',
        playerManager
    );
    playerManager.registerPlayer('55', players.player55);

    // 6-6 pattern player (first row, second card)
    const player66Container = document.querySelector('.seamless-audio-player[data-audio-id="66"]');
    players.player66 = new SeamlessAudioPlayer(
        player66Container,
        'Coherent_Piano_6_6_fermibot.mp3',
        '66',
        playerManager
    );
    playerManager.registerPlayer('66', players.player66);

    // 7-7 pattern player (second row, first card)
    const player77Container = document.querySelector('.seamless-audio-player[data-audio-id="77"]');
    players.player77 = new SeamlessAudioPlayer(
        player77Container,
        'Coherent_Piano_7_7_fermibot.mp3',
        '77',
        playerManager
    );
    playerManager.registerPlayer('77', players.player77);

    // 8-8 pattern player (second row, second card)
    const player88Container = document.querySelector('.seamless-audio-player[data-audio-id="88"]');
    players.player88 = new SeamlessAudioPlayer(
        player88Container,
        'Coherent_Piano_8_8_fermibot.mp3',
        '88',
        playerManager
    );
    playerManager.registerPlayer('88', players.player88);

    // Initialize programmable breathing sequencer
    const programmableSequencer = new ProgrammableBreathingSequencer(
        document.getElementById('programmableSection'),
        'programmable',
        playerManager
    );
    playerManager.registerPlayer('programmable', programmableSequencer);

    // Store players and timer for global access if needed
    window.audioPlayers = {
        ...players,
        programmableSequencer,
        sessionTimer,
        playerManager
    };
});


// Add to coherent_breathing_main.js, at the end of DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    // ... existing initialization code ...

    // Initialize Bootstrap alerts (if Bootstrap is loaded)
    if (typeof bootstrap !== 'undefined') {
        // Enable Bootstrap dismiss functionality for alerts
        document.querySelectorAll('.alert').forEach(alertElement => {
            new bootstrap.Alert(alertElement);
        });
    }
});