// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    tips: [],
    completedTips: new Set(),
    currentView: 'clock',
    selectedTip: null,
    notes: {},
    searchQuery: '',
    filterCategory: 'all',
    lastResetState: null,
    stats: {
        totalReviews: 0,
        reviewHistory: [],
        currentStreak: 0,
        longestStreak: 0,
        lastReviewDate: null
    },
    showOnboarding: false
};

// Icon mapping for each tip
const tipIcons = ['🛏️', '🏃', '☕', '🍷', '🍽️', '💊', '😴', '🧘', '🛁', '🌑', '☀️', '⏰'];

// Category definitions
const tipCategories = {
    1: { timing: 'evening', type: 'behavioral' },
    2: { timing: 'daytime', type: 'behavioral' },
    3: { timing: 'daytime', type: 'dietary' },
    4: { timing: 'evening', type: 'dietary' },
    5: { timing: 'evening', type: 'dietary' },
    6: { timing: 'anytime', type: 'medical' },
    7: { timing: 'afternoon', type: 'behavioral' },
    8: { timing: 'evening', type: 'behavioral' },
    9: { timing: 'evening', type: 'behavioral' },
    10: { timing: 'evening', type: 'environmental' },
    11: { timing: 'daytime', type: 'environmental' },
    12: { timing: 'evening', type: 'behavioral' }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function triggerConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        if (window.confetti) {
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            }));
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            }));
        }
    }, 250);
}

// ============================================
// DATA LOADING
// ============================================
async function loadData() {
    console.log('🔄 Starting to load data...');
    try {
        console.log('📡 Fetching JSON...');
        const response = await fetch('Wellness_WhyWeSleep.json');
        console.log('📡 Response received:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Data parsed:', data);

        // Extract tips from JSON structure
        const tipsObject = data[0]['Why We Sleep'];
        state.tips = Object.entries(tipsObject).map(([title, description], index) => ({
            id: index + 1,
            title,
            description,
            icon: tipIcons[index] || '💤',
            category: tipCategories[index + 1] || { timing: 'anytime', type: 'other' }
        }));

        // Load saved progress
        loadProgress();
        loadNotes();
        loadStats();

        // Check if should show onboarding
        checkOnboarding();

        // Render all views
        console.log('🎨 Rendering all views...');
        console.log('📊 Tips loaded:', state.tips.length);
        renderAllViews();
        updateProgressDisplay();
        updateStatsDisplay();
        console.log('✅ Rendering complete!');
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load sleep tips. Please refresh the page.');
    }
}

function showLoadingState(isLoading) {
    // Don't destroy the HTML structure - just hide/show content
    const viewContents = document.querySelectorAll('.view-content');

    if (isLoading) {
        viewContents.forEach(content => {
            content.style.display = 'none';
        });
    } else {
        viewContents.forEach(content => {
            // Restore visibility for active view
            if (content.classList.contains('active')) {
                content.style.display = 'block';
            }
        });
    }
}

function showError(message) {
    const container = document.querySelector('.visualization-container');
    if (container) {
        container.innerHTML = `
            <div class="error-state" role="alert">
                <div class="error-icon">⚠️</div>
                <h3>Oops! Something went wrong</h3>
                <p>${message}</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            </div>
        `;
    }
}

// ============================================
// PROGRESS MANAGEMENT
// ============================================
function loadProgress() {
    const saved = localStorage.getItem('whyWeSleepProgress');
    if (saved) {
        try {
            state.completedTips = new Set(JSON.parse(saved));
        } catch (error) {
            console.error('Error loading progress:', error);
            state.completedTips = new Set();
        }
    }
}

function saveProgress() {
    try {
        localStorage.setItem('whyWeSleepProgress', JSON.stringify([...state.completedTips]));
    } catch (error) {
        console.error('Error saving progress:', error);
        showToast('Failed to save progress', 'error');
    }
}

function toggleTipCompletion(tipId) {
    const wasCompleted = state.completedTips.has(tipId);

    if (wasCompleted) {
        state.completedTips.delete(tipId);
    } else {
        state.completedTips.add(tipId);
        updateStats();
    }

    saveProgress();
    updateAllViews();
    updateProgressDisplay();
    checkMilestones();

    // Show feedback
    const tip = state.tips.find(t => t.id === tipId);
    if (tip && !wasCompleted) {
        showToast(`✓ Reviewed: ${tip.title}`, 'success');
    }
}

function markAllComplete(complete = true) {
    if (complete) {
        state.tips.forEach(tip => state.completedTips.add(tip.id));
        showToast('All tips marked as reviewed!', 'success');
        updateStats();
    } else {
        state.completedTips.clear();
        showToast('All tips unmarked', 'info');
    }

    saveProgress();
    updateAllViews();
    updateProgressDisplay();
    checkMilestones();
}

function resetProgress() {
    // Save current state for undo
    state.lastResetState = {
        completedTips: new Set(state.completedTips),
        stats: JSON.parse(JSON.stringify(state.stats))
    };

    state.completedTips.clear();
    saveProgress();
    updateAllViews();
    updateProgressDisplay();

    // Show undo option
    showUndoToast();
}

function undoReset() {
    if (state.lastResetState) {
        state.completedTips = new Set(state.lastResetState.completedTips);
        state.stats = state.lastResetState.stats;
        saveProgress();
        saveStats();
        updateAllViews();
        updateProgressDisplay();
        updateStatsDisplay();
        showToast('Reset undone', 'success');
        state.lastResetState = null;
    }
}

function showUndoToast() {
    const toast = document.createElement('div');
    toast.className = 'toast toast-undo';
    toast.innerHTML = `
        <span>Progress reset</span>
        <button onclick="undoReset()" class="undo-btn">Undo</button>
    `;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function updateProgressDisplay() {
    const total = state.tips.length;
    const completed = state.completedTips.size;
    const percentage = (completed / total) * 100;

    const progressCount = document.getElementById('progressCount');
    const progressBar = document.getElementById('progressBar');

    if (progressCount) {
        progressCount.textContent = `${completed}/${total}`;
    }
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }
}

function checkMilestones() {
    const total = state.tips.length;
    const completed = state.completedTips.size;
    const percentage = (completed / total) * 100;

    const milestones = [25, 50, 75, 100];
    const previousCompleted = completed - 1;
    const previousPercentage = (previousCompleted / total) * 100;

    milestones.forEach(milestone => {
        if (previousPercentage < milestone && percentage >= milestone) {
            showMilestone(milestone);
        }
    });
}

function showMilestone(percentage) {
    const messages = {
        25: '🌟 Quarter way there!',
        50: '🎯 Halfway done!',
        75: '🚀 Almost there!',
        100: '🎉 All tips reviewed! Excellent work!'
    };

    showToast(messages[percentage], 'milestone');

    if (percentage === 100) {
        setTimeout(triggerConfetti, 500);
    }
}

// ============================================
// NOTES MANAGEMENT
// ============================================
function loadNotes() {
    const saved = localStorage.getItem('whyWeSleepNotes');
    if (saved) {
        try {
            state.notes = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading notes:', error);
            state.notes = {};
        }
    }
}

function saveNotes() {
    try {
        localStorage.setItem('whyWeSleepNotes', JSON.stringify(state.notes));
    } catch (error) {
        console.error('Error saving notes:', error);
        showToast('Failed to save notes', 'error');
    }
}

function saveNote(tipId, note) {
    if (note.trim()) {
        state.notes[tipId] = note.trim();
    } else {
        delete state.notes[tipId];
    }
    saveNotes();
    showToast('Note saved', 'success');
}

// ============================================
// STATS MANAGEMENT
// ============================================
function loadStats() {
    const saved = localStorage.getItem('whyWeSleepStats');
    if (saved) {
        try {
            state.stats = JSON.parse(saved);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
}

function saveStats() {
    try {
        localStorage.setItem('whyWeSleepStats', JSON.stringify(state.stats));
    } catch (error) {
        console.error('Error saving stats:', error);
    }
}

function updateStats() {
    const today = new Date().toDateString();

    state.stats.totalReviews++;

    // Update review history
    const lastEntry = state.stats.reviewHistory[state.stats.reviewHistory.length - 1];
    if (lastEntry && lastEntry.date === today) {
        lastEntry.count++;
    } else {
        state.stats.reviewHistory.push({ date: today, count: 1 });
        // Keep only last 30 days
        if (state.stats.reviewHistory.length > 30) {
            state.stats.reviewHistory.shift();
        }
    }

    // Update streak
    if (state.stats.lastReviewDate === today) {
        // Same day, don't change streak
    } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (state.stats.lastReviewDate === yesterdayStr) {
            state.stats.currentStreak++;
        } else if (!state.stats.lastReviewDate) {
            state.stats.currentStreak = 1;
        } else {
            state.stats.currentStreak = 1;
        }

        state.stats.lastReviewDate = today;

        if (state.stats.currentStreak > state.stats.longestStreak) {
            state.stats.longestStreak = state.stats.currentStreak;
        }
    }

    saveStats();
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const statsBtn = document.getElementById('statsBtn');
    if (statsBtn && state.stats.currentStreak > 0) {
        statsBtn.innerHTML = `
            <span class="view-icon">📊</span>
            <span class="view-label">Stats</span>
            <span class="streak-badge">${state.stats.currentStreak}🔥</span>
        `;
    }
}

function showStats() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content stats-modal" role="dialog" aria-labelledby="stats-title" aria-modal="true">
            <div class="modal-header">
                <h2 id="stats-title">📊 Your Sleep Journey</h2>
                <button class="modal-close" aria-label="Close stats">&times;</button>
            </div>
            <div class="modal-body">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-value">${state.stats.currentStreak}</div>
                        <div class="stat-label">Day Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-value">${state.stats.longestStreak}</div>
                        <div class="stat-label">Longest Streak</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-value">${state.stats.totalReviews}</div>
                        <div class="stat-label">Total Reviews</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📝</div>
                        <div class="stat-value">${Object.keys(state.notes).length}</div>
                        <div class="stat-label">Notes Written</div>
                    </div>
                </div>
                <div class="stats-chart">
                    <h3>Recent Activity</h3>
                    <div class="activity-bars">
                        ${state.stats.reviewHistory.slice(-7).map(entry => `
                            <div class="activity-bar">
                                <div class="activity-bar-fill" style="height: ${Math.min(100, entry.count * 20)}%"></div>
                                <div class="activity-label">${new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    modal.querySelector('.modal-close').onclick = () => closeModal(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closeModal(modal);
    };
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
}

// ============================================
// SEARCH AND FILTER
// ============================================
function filterTips() {
    const query = state.searchQuery.toLowerCase();
    const category = state.filterCategory;

    return state.tips.filter(tip => {
        const matchesSearch = !query ||
            tip.title.toLowerCase().includes(query) ||
            tip.description.toLowerCase().includes(query);

        const matchesCategory = category === 'all' ||
            tip.category.timing === category ||
            tip.category.type === category;

        return matchesSearch && matchesCategory;
    });
}

const debouncedSearch = debounce(() => {
    renderAllViews();
}, 300);

function handleSearch(event) {
    state.searchQuery = event.target.value;
    debouncedSearch();

    // Announce to screen readers
    const resultCount = filterTips().length;
    announceToScreenReader(`${resultCount} tips found`);
}

function handleFilter(category) {
    state.filterCategory = category;
    renderAllViews();

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });

    announceToScreenReader(`Filtered by ${category}`);
}

// ============================================
// EXPORT FUNCTIONALITY
// ============================================
function exportProgress() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content export-modal" role="dialog" aria-labelledby="export-title" aria-modal="true">
            <div class="modal-header">
                <h2 id="export-title">📤 Export Progress</h2>
                <button class="modal-close" aria-label="Close export">&times;</button>
            </div>
            <div class="modal-body">
                <button onclick="exportAsText()" class="export-btn">
                    <span class="export-icon">📄</span>
                    Export as Text
                </button>
                <button onclick="exportAsJSON()" class="export-btn">
                    <span class="export-icon">💾</span>
                    Export as JSON
                </button>
                <button onclick="shareProgress()" class="export-btn">
                    <span class="export-icon">🔗</span>
                    Share Progress
                </button>
                <button onclick="window.print()" class="export-btn">
                    <span class="export-icon">🖨️</span>
                    Print Checklist
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);

    modal.querySelector('.modal-close').onclick = () => closeModal(modal);
    modal.onclick = (e) => {
        if (e.target === modal) closeModal(modal);
    };
}

function exportAsText() {
    const completed = state.tips.filter(tip => state.completedTips.has(tip.id));
    const pending = state.tips.filter(tip => !state.completedTips.has(tip.id));

    let text = '=== WHY WE SLEEP - 12 ESSENTIAL TIPS ===\n\n';
    text += `Progress: ${completed.length}/${state.tips.length}\n\n`;

    text += '✅ REVIEWED TIPS:\n';
    completed.forEach(tip => {
        text += `\n${tip.id}. ${tip.title}\n`;
        text += `${tip.description}\n`;
        if (state.notes[tip.id]) {
            text += `Note: ${state.notes[tip.id]}\n`;
        }
    });

    text += '\n\n⏳ PENDING TIPS:\n';
    pending.forEach(tip => {
        text += `\n${tip.id}. ${tip.title}\n`;
        text += `${tip.description}\n`;
    });

    downloadFile(text, 'why-we-sleep-progress.txt', 'text/plain');
    showToast('Exported as text file', 'success');
}

function exportAsJSON() {
    const data = {
        exportDate: new Date().toISOString(),
        progress: {
            completed: [...state.completedTips],
            total: state.tips.length,
            percentage: (state.completedTips.size / state.tips.length * 100).toFixed(1)
        },
        notes: state.notes,
        stats: state.stats,
        tips: state.tips
    };

    downloadFile(JSON.stringify(data, null, 2), 'why-we-sleep-progress.json', 'application/json');
    showToast('Exported as JSON file', 'success');
}

function shareProgress() {
    const completed = state.completedTips.size;
    const total = state.tips.length;
    const percentage = Math.round((completed / total) * 100);

    const text = `I've reviewed ${completed}/${total} sleep tips (${percentage}%) from "Why We Sleep" by Matthew Walker! 😴✨`;

    if (navigator.share) {
        navigator.share({
            title: 'My Sleep Progress',
            text: text
        }).then(() => {
            showToast('Shared successfully!', 'success');
        }).catch(err => {
            if (err.name !== 'AbortError') {
                copyToClipboard(text);
            }
        });
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

// ============================================
// NOTIFICATIONS
// ============================================
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('Notifications enabled!', 'success');
                scheduleReminder();
            }
        });
    } else if (Notification.permission === 'granted') {
        scheduleReminder();
    }
}

function scheduleReminder() {
    // Simple daily reminder at 9 PM
    const now = new Date();
    const reminder = new Date();
    reminder.setHours(21, 0, 0, 0);

    if (reminder < now) {
        reminder.setDate(reminder.getDate() + 1);
    }

    const timeUntilReminder = reminder - now;

    setTimeout(() => {
        if (Notification.permission === 'granted') {
            new Notification('Sleep Tip Reminder', {
                body: 'Review your sleep tips for better rest tonight! 🌙',
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
        // Schedule next day
        scheduleReminder();
    }, timeUntilReminder);
}

// ============================================
// ONBOARDING
// ============================================
function checkOnboarding() {
    const hasSeenOnboarding = localStorage.getItem('whyWeSleepOnboarding');
    if (!hasSeenOnboarding) {
        state.showOnboarding = true;
        setTimeout(showOnboarding, 1000);
    }
}

function showOnboarding() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay onboarding-modal';
    modal.innerHTML = `
        <div class="modal-content onboarding-content" role="dialog" aria-labelledby="onboarding-title" aria-modal="true">
            <div class="modal-header">
                <h2 id="onboarding-title">🌙 Welcome to Why We Sleep</h2>
            </div>
            <div class="modal-body">
                <div class="onboarding-step">
                    <div class="onboarding-icon">⏰</div>
                    <h3>Three Ways to Explore</h3>
                    <p>Use the <strong>Clock View</strong> for a circular layout, <strong>Cards</strong> to flip through tips, or <strong>List View</strong> for a simple checklist.</p>
                </div>
                <div class="onboarding-step">
                    <div class="onboarding-icon">✅</div>
                    <h3>Track Your Progress</h3>
                    <p>Check off tips as you implement them. Your progress is saved automatically!</p>
                </div>
                <div class="onboarding-step">
                    <div class="onboarding-icon">📝</div>
                    <h3>Add Personal Notes</h3>
                    <p>Click any tip to add notes about your experience.</p>
                </div>
                <div class="onboarding-step">
                    <div class="onboarding-icon">⌨️</div>
                    <h3>Keyboard Shortcuts</h3>
                    <p>Use arrow keys to navigate, Space to check/uncheck, and / to search.</p>
                </div>
                <button onclick="closeOnboarding()" class="onboarding-btn">Get Started</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function closeOnboarding() {
    localStorage.setItem('whyWeSleepOnboarding', 'true');
    const modal = document.querySelector('.onboarding-modal');
    if (modal) {
        closeModal(modal);
    }
}

// ============================================
// ACCESSIBILITY
// ============================================
function announceToScreenReader(message) {
    const announcement = document.getElementById('srAnnouncement');
    if (announcement) {
        announcement.textContent = message;
    }
}

function setupAccessibility() {
    // Add screen reader announcement area
    const srDiv = document.createElement('div');
    srDiv.id = 'srAnnouncement';
    srDiv.className = 'sr-only';
    srDiv.setAttribute('role', 'status');
    srDiv.setAttribute('aria-live', 'polite');
    srDiv.setAttribute('aria-atomic', 'true');
    document.body.appendChild(srDiv);

    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Search shortcut: / key
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            const searchInput = document.getElementById('searchInput');
            if (searchInput && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
                return;
            }
        }

        // Close modals with Escape
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay.show');
            if (modal) {
                closeModal(modal);
            }
        }

        // Navigate views with Ctrl/Cmd + 1, 2, 3
        if ((e.ctrlKey || e.metaKey) && ['1', '2', '3'].includes(e.key)) {
            e.preventDefault();
            const views = ['clock', 'cards', 'timeline'];
            switchView(views[parseInt(e.key) - 1]);
        }

        // Navigate tips with arrow keys in clock view
        if (state.currentView === 'clock' && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            navigateClockTips(e.key);
        }
    });
}

function navigateClockTips(direction) {
    const tips = document.querySelectorAll('.clock-tip');
    const currentIndex = state.selectedTip ? state.selectedTip - 1 : 0;
    let newIndex;

    switch(direction) {
        case 'ArrowRight':
        case 'ArrowDown':
            newIndex = (currentIndex + 1) % tips.length;
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            newIndex = (currentIndex - 1 + tips.length) % tips.length;
            break;
    }

    if (newIndex !== undefined) {
        showClockTipDetail(state.tips[newIndex]);
        tips[newIndex].focus();
    }
}

// ============================================
// CLOCK VIEW
// ============================================
function renderClockView() {
    const clockFace = document.getElementById('clockFace');
    if (!clockFace) return;

    const filteredTips = filterTips();

    // Clear existing tips and no-results message
    const existingTips = clockFace.querySelectorAll('.clock-tip');
    existingTips.forEach(tip => tip.remove());
    const noResults = clockFace.querySelector('.no-results');
    if (noResults) noResults.remove();

    if (filteredTips.length === 0) {
        // Preserve clock-center and add no-results
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results';
        noResultsDiv.textContent = 'No tips found';
        clockFace.appendChild(noResultsDiv);
        return;
    }

    const centerAngle = 360 / filteredTips.length;
    const radius = clockFace.offsetWidth * 0.35;

    filteredTips.forEach((tip, index) => {
        const angle = (index * centerAngle - 90) * (Math.PI / 180);
        const x = clockFace.offsetWidth / 2 + radius * Math.cos(angle);
        const y = clockFace.offsetHeight / 2 + radius * Math.sin(angle);

        const tipElement = document.createElement('button');
        tipElement.className = 'clock-tip';
        tipElement.setAttribute('role', 'button');
        tipElement.setAttribute('aria-label', `Tip ${tip.id}: ${tip.title}`);
        tipElement.setAttribute('tabindex', '0');

        if (state.completedTips.has(tip.id)) {
            tipElement.classList.add('completed');
            tipElement.setAttribute('aria-pressed', 'true');
        }

        tipElement.style.left = `${x}px`;
        tipElement.style.top = `${y}px`;
        tipElement.innerHTML = `
            <div class="clock-tip-number">${tip.id}</div>
            <div class="clock-tip-icon">${tip.icon}</div>
        `;

        tipElement.addEventListener('click', () => showClockTipDetail(tip));
        tipElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showClockTipDetail(tip);
            }
        });

        clockFace.appendChild(tipElement);
    });
}

function showClockTipDetail(tip) {
    state.selectedTip = tip.id;
    const detailContainer = document.getElementById('clockTipDetail');
    if (!detailContainer) return;

    detailContainer.innerHTML = `
        <div class="tip-detail-header">
            <h3 class="tip-detail-title" id="tip-detail-title">${tip.icon} ${tip.title}</h3>
            <label class="checkbox-label">
                <input type="checkbox"
                       class="tip-detail-checkbox"
                       ${state.completedTips.has(tip.id) ? 'checked' : ''}
                       onchange="toggleTipCompletion(${tip.id})"
                       aria-label="Mark as reviewed">
                <span>Reviewed</span>
            </label>
        </div>
        <div class="tip-detail-content">${tip.description}</div>
        <div class="tip-detail-notes">
            <label for="note-${tip.id}"><strong>Personal Notes:</strong></label>
            <textarea
                id="note-${tip.id}"
                class="note-textarea"
                placeholder="Add your thoughts, experiences, or reminders..."
                aria-label="Personal notes for ${tip.title}"
            >${state.notes[tip.id] || ''}</textarea>
            <button onclick="saveNoteFromTextarea(${tip.id})" class="save-note-btn">Save Note</button>
        </div>
        <div class="tip-detail-meta">
            <span class="tip-category">⏰ ${tip.category.timing}</span>
            <span class="tip-category">🏷️ ${tip.category.type}</span>
        </div>
    `;

    detailContainer.classList.add('active');
    detailContainer.setAttribute('aria-labelledby', 'tip-detail-title');

    announceToScreenReader(`Viewing tip ${tip.id}: ${tip.title}`);
}

function saveNoteFromTextarea(tipId) {
    const textarea = document.getElementById(`note-${tipId}`);
    if (textarea) {
        saveNote(tipId, textarea.value);
    }
}

// ============================================
// CARD GRID VIEW
// ============================================
function renderCardsView() {
    const cardsGrid = document.getElementById('cardsGrid');
    if (!cardsGrid) return;

    const filteredTips = filterTips();
    cardsGrid.innerHTML = '';

    if (filteredTips.length === 0) {
        cardsGrid.innerHTML = '<div class="no-results">No tips found</div>';
        return;
    }

    filteredTips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'sleep-card';
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Tip ${tip.id}: ${tip.title}. Click to flip`);
        card.setAttribute('tabindex', '0');

        if (state.completedTips.has(tip.id)) {
            card.classList.add('completed');
        }

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-number">${tip.id}</div>
                    <div class="card-icon">${tip.icon}</div>
                    <div class="card-title">${tip.title}</div>
                    <div class="card-categories">
                        <span class="card-category">${tip.category.timing}</span>
                        <span class="card-category">${tip.category.type}</span>
                    </div>
                </div>
                <div class="card-back">
                    <div class="card-content">${tip.description}</div>
                    ${state.notes[tip.id] ? `<div class="card-note">📝 ${state.notes[tip.id]}</div>` : ''}
                    <div class="card-checkbox-container">
                        <input type="checkbox"
                               class="card-checkbox"
                               ${state.completedTips.has(tip.id) ? 'checked' : ''}
                               onclick="event.stopPropagation(); toggleTipCompletion(${tip.id})"
                               aria-label="Mark as reviewed"
                               title="Mark as reviewed">
                        <label>Reviewed</label>
                    </div>
                    <div class="card-scroll-indicator" aria-hidden="true">↓</div>
                </div>
            </div>
        `;

        const flipCard = function(e) {
            if (!e.target.classList.contains('card-checkbox')) {
                this.classList.toggle('flipped');
                const isFlipped = this.classList.contains('flipped');
                this.setAttribute('aria-label',
                    `Tip ${tip.id}: ${tip.title}. ${isFlipped ? 'Showing description' : 'Showing title'}. Click to flip`
                );

                setTimeout(() => {
                    if (isFlipped) {
                        checkCardScroll(this);
                    }
                }, 600);
            }
        };

        card.addEventListener('click', flipCard);
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                flipCard.call(this, e);
            }
        });

        cardsGrid.appendChild(card);
    });
}

function checkCardScroll(card) {
    const cardBack = card.querySelector('.card-back');
    const scrollIndicator = card.querySelector('.card-scroll-indicator');

    if (!cardBack || !scrollIndicator) return;

    const updateScrollIndicator = () => {
        const hasScroll = cardBack.scrollHeight > cardBack.clientHeight;
        const isScrolledToBottom = cardBack.scrollHeight - cardBack.scrollTop <= cardBack.clientHeight + 5;

        if (hasScroll && !isScrolledToBottom) {
            scrollIndicator.classList.add('visible');
        } else {
            scrollIndicator.classList.remove('visible');
        }
    };

    updateScrollIndicator();
    cardBack.addEventListener('scroll', updateScrollIndicator);
}

// ============================================
// TIMELINE VIEW
// ============================================
function renderTimelineView() {
    const timelineContainer = document.getElementById('timelineContainer');
    if (!timelineContainer) return;

    const filteredTips = filterTips();
    timelineContainer.innerHTML = '';

    if (filteredTips.length === 0) {
        timelineContainer.innerHTML = '<div class="no-results">No tips found</div>';
        return;
    }

    filteredTips.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.setAttribute('role', 'article');
        item.setAttribute('aria-labelledby', `timeline-title-${tip.id}`);

        if (state.completedTips.has(tip.id)) {
            item.classList.add('completed');
        }

        const hasDescription = tip.description && tip.description.trim() !== '';

        item.innerHTML = `
            <div class="timeline-number" aria-hidden="true">${tip.id}</div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h4 class="timeline-title" id="timeline-title-${tip.id}">${tip.icon} ${tip.title}</h4>
                    <label class="checkbox-label">
                        <input type="checkbox"
                               class="timeline-checkbox"
                               ${state.completedTips.has(tip.id) ? 'checked' : ''}
                               onclick="event.stopPropagation(); toggleTipCompletion(${tip.id})"
                               aria-label="Mark as reviewed"
                               title="Mark as reviewed">
                        <span class="sr-only">Reviewed</span>
                    </label>
                </div>
                <div class="timeline-meta">
                    <span class="timeline-category">⏰ ${tip.category.timing}</span>
                    <span class="timeline-category">🏷️ ${tip.category.type}</span>
                </div>
                ${hasDescription ? `
                    <div class="timeline-description">${tip.description}</div>
                    ${state.notes[tip.id] ? `<div class="timeline-note">📝 <strong>Note:</strong> ${state.notes[tip.id]}</div>` : ''}
                    <button class="timeline-toggle" aria-expanded="false">▼ Show more</button>
                ` : ''}
            </div>
        `;

        if (hasDescription) {
            const content = item.querySelector('.timeline-content');
            const toggle = item.querySelector('.timeline-toggle');

            content.addEventListener('click', function(e) {
                if (!e.target.classList.contains('timeline-checkbox') &&
                    !e.target.closest('.checkbox-label')) {
                    item.classList.toggle('expanded');
                    const isExpanded = item.classList.contains('expanded');
                    toggle.textContent = isExpanded ? '▲ Show less' : '▼ Show more';
                    toggle.setAttribute('aria-expanded', isExpanded);
                }
            });
        }

        timelineContainer.appendChild(item);
    });
}

// ============================================
// VIEW SWITCHING
// ============================================
function switchView(viewName) {
    state.currentView = viewName;

    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        const isActive = btn.dataset.view === viewName;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });

    // Update view content
    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.toggle('active', content.id === `${viewName}View`);
    });

    // Re-render clock view immediately for better accessibility
    if (viewName === 'clock') {
        renderClockView();
    }

    announceToScreenReader(`Switched to ${viewName} view`);
}

// ============================================
// RENDER ALL VIEWS
// ============================================
function renderAllViews() {
    renderClockView();
    renderCardsView();
    renderTimelineView();
}

function updateAllViews() {
    const filteredTips = filterTips();

    // Update clock view
    document.querySelectorAll('#clockFace .clock-tip').forEach((tipEl) => {
        const tipId = parseInt(tipEl.querySelector('.clock-tip-number').textContent);
        const isCompleted = state.completedTips.has(tipId);
        tipEl.classList.toggle('completed', isCompleted);
        tipEl.setAttribute('aria-pressed', isCompleted);
    });

    // Update clock detail if shown
    if (state.selectedTip) {
        const checkbox = document.querySelector('#clockTipDetail .tip-detail-checkbox');
        if (checkbox) {
            checkbox.checked = state.completedTips.has(state.selectedTip);
        }
    }

    // Update cards view
    document.querySelectorAll('.sleep-card').forEach((card, index) => {
        if (filteredTips[index]) {
            const tip = filteredTips[index];
            const isCompleted = state.completedTips.has(tip.id);
            card.classList.toggle('completed', isCompleted);
            const checkbox = card.querySelector('.card-checkbox');
            if (checkbox) {
                checkbox.checked = isCompleted;
            }
        }
    });

    // Update timeline view
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        if (filteredTips[index]) {
            const tip = filteredTips[index];
            const isCompleted = state.completedTips.has(tip.id);
            item.classList.toggle('completed', isCompleted);
            const checkbox = item.querySelector('.timeline-checkbox');
            if (checkbox) {
                checkbox.checked = isCompleted;
            }
        }
    });
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Setup
    setupAccessibility();
    setupKeyboardNavigation();

    // Load data
    loadData();

    // View switcher buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    // Reset progress button
    const resetBtn = document.getElementById('resetProgress');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Reset all progress? This cannot be undone.')) {
                resetProgress();
            }
        });
    }

    // Re-render clock on window resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (state.currentView === 'clock') {
                renderClockView();
            }
        }, 250);
    });
});

// Make functions available globally for inline handlers
window.toggleTipCompletion = toggleTipCompletion;
window.saveNoteFromTextarea = saveNoteFromTextarea;
window.undoReset = undoReset;
window.closeOnboarding = closeOnboarding;
window.exportAsText = exportAsText;
window.exportAsJSON = exportAsJSON;
window.shareProgress = shareProgress;
window.handleSearch = handleSearch;
window.handleFilter = handleFilter;
window.exportProgress = exportProgress;
window.showStats = showStats;
window.requestNotificationPermission = requestNotificationPermission;
window.markAllComplete = markAllComplete;