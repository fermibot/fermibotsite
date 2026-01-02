// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    tips: [],
    completedTips: new Set(),
    currentView: 'clock',
    selectedTip: null
};

// Icon mapping for each tip
const tipIcons = ['🛏️', '🏃', '☕', '🍷', '🍽️', '💊', '😴', '🧘', '🛁', '🌑', '☀️', '⏰'];

// ============================================
// DATA LOADING
// ============================================
async function loadData() {
    try {
        const response = await fetch('Wellness_WhyWeSleep.json');
        const data = await response.json();

        // Extract tips from JSON structure
        const tipsObject = data[0]['Why We Sleep'];
        state.tips = Object.entries(tipsObject).map(([title, description], index) => ({
            id: index + 1,
            title,
            description,
            icon: tipIcons[index] || '💤'
        }));

        // Load saved progress
        loadProgress();

        // Render all views
        renderAllViews();
        updateProgressDisplay();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ============================================
// PROGRESS MANAGEMENT
// ============================================
function loadProgress() {
    const saved = localStorage.getItem('whyWeSleepProgress');
    if (saved) {
        state.completedTips = new Set(JSON.parse(saved));
    }
}

function saveProgress() {
    localStorage.setItem('whyWeSleepProgress', JSON.stringify([...state.completedTips]));
}

function toggleTipCompletion(tipId) {
    if (state.completedTips.has(tipId)) {
        state.completedTips.delete(tipId);
    } else {
        state.completedTips.add(tipId);
    }
    saveProgress();
    updateAllViews();
    updateProgressDisplay();
}

function resetProgress() {
    if (confirm('Reset all progress? This cannot be undone.')) {
        state.completedTips.clear();
        saveProgress();
        updateAllViews();
        updateProgressDisplay();
    }
}

function updateProgressDisplay() {
    const total = state.tips.length;
    const completed = state.completedTips.size;
    const percentage = (completed / total) * 100;

    document.getElementById('progressCount').textContent = `${completed}/${total}`;
    document.getElementById('progressBar').style.width = `${percentage}%`;
}

// ============================================
// CLOCK VIEW
// ============================================
function renderClockView() {
    const clockFace = document.getElementById('clockFace');
    const centerAngle = 360 / state.tips.length;
    const radius = clockFace.offsetWidth * 0.35;

    // Clear existing tips
    const existingTips = clockFace.querySelectorAll('.clock-tip');
    existingTips.forEach(tip => tip.remove());

    state.tips.forEach((tip, index) => {
        const angle = (index * centerAngle - 90) * (Math.PI / 180);
        const x = clockFace.offsetWidth / 2 + radius * Math.cos(angle);
        const y = clockFace.offsetHeight / 2 + radius * Math.sin(angle);

        const tipElement = document.createElement('div');
        tipElement.className = 'clock-tip';
        if (state.completedTips.has(tip.id)) {
            tipElement.classList.add('completed');
        }
        tipElement.style.left = `${x}px`;
        tipElement.style.top = `${y}px`;
        tipElement.innerHTML = `
            <div class="clock-tip-number">${tip.id}</div>
            <div class="clock-tip-icon">${tip.icon}</div>
        `;

        tipElement.addEventListener('click', () => showClockTipDetail(tip));
        clockFace.appendChild(tipElement);
    });
}

function showClockTipDetail(tip) {
    state.selectedTip = tip.id;
    const detailContainer = document.getElementById('clockTipDetail');

    detailContainer.innerHTML = `
        <div class="tip-detail-header">
            <h3 class="tip-detail-title">${tip.icon} ${tip.title}</h3>
            <input type="checkbox"
                   class="tip-detail-checkbox"
                   ${state.completedTips.has(tip.id) ? 'checked' : ''}
                   onchange="toggleTipCompletion(${tip.id})"
                   title="Mark as reviewed">
        </div>
        <div class="tip-detail-content">${tip.description || 'Keep your bedroom dark, cool, and free from electronic devices for better sleep quality.'}</div>
    `;

    detailContainer.classList.add('active');
}

// ============================================
// CARD GRID VIEW
// ============================================
function renderCardsView() {
    const cardsGrid = document.getElementById('cardsGrid');
    cardsGrid.innerHTML = '';

    state.tips.forEach(tip => {
        const card = document.createElement('div');
        card.className = 'sleep-card';
        if (state.completedTips.has(tip.id)) {
            card.classList.add('completed');
        }

        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="card-number">${tip.id}</div>
                    <div class="card-icon">${tip.icon}</div>
                    <div class="card-title">${tip.title}</div>
                </div>
                <div class="card-back">
                    <div class="card-content">${tip.description || 'Keep your bedroom dark, cool, and free from electronic devices for better sleep quality.'}</div>
                    <div class="card-checkbox-container">
                        <input type="checkbox"
                               class="card-checkbox"
                               ${state.completedTips.has(tip.id) ? 'checked' : ''}
                               onclick="event.stopPropagation(); toggleTipCompletion(${tip.id})"
                               title="Mark as reviewed">
                        <label>Reviewed</label>
                    </div>
                    <div class="card-scroll-indicator" aria-hidden="true">↓</div>
                </div>
            </div>
        `;

        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('card-checkbox')) {
                this.classList.toggle('flipped');
                // Check scroll after flip animation completes
                setTimeout(() => {
                    if (this.classList.contains('flipped')) {
                        checkCardScroll(this);
                    }
                }, 600);
            }
        });

        cardsGrid.appendChild(card);
    });
}

// Check if card back needs scroll indicator
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
    timelineContainer.innerHTML = '';

    state.tips.forEach(tip => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        if (state.completedTips.has(tip.id)) {
            item.classList.add('completed');
        }

        const hasDescription = tip.description && tip.description.trim() !== '';

        item.innerHTML = `
            <div class="timeline-number">${tip.id}</div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <h4 class="timeline-title">${tip.icon} ${tip.title}</h4>
                    <input type="checkbox"
                           class="timeline-checkbox"
                           ${state.completedTips.has(tip.id) ? 'checked' : ''}
                           onclick="event.stopPropagation(); toggleTipCompletion(${tip.id})"
                           title="Mark as reviewed">
                </div>
                ${hasDescription ? `
                    <div class="timeline-description">${tip.description}</div>
                    <span class="timeline-toggle">▼ Show more</span>
                ` : `<div class="timeline-description" style="display: block;">Keep your bedroom dark, cool, and free from electronic devices for better sleep quality.</div>`}
            </div>
        `;

        if (hasDescription) {
            const content = item.querySelector('.timeline-content');
            const toggle = item.querySelector('.timeline-toggle');

            content.addEventListener('click', function(e) {
                if (!e.target.classList.contains('timeline-checkbox')) {
                    item.classList.toggle('expanded');
                    toggle.textContent = item.classList.contains('expanded') ? '▲ Show less' : '▼ Show more';
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
    // Update state
    state.currentView = viewName;

    // Update view buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update view content
    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.toggle('active', content.id === `${viewName}View`);
    });

    // Re-render if needed (especially for clock view which needs size calculations)
    if (viewName === 'clock') {
        setTimeout(() => renderClockView(), 100);
    }
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
    // Update clock view
    document.querySelectorAll('#clockFace .clock-tip').forEach((tipEl, index) => {
        const tip = state.tips[index];
        tipEl.classList.toggle('completed', state.completedTips.has(tip.id));
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
        const tip = state.tips[index];
        const checkbox = card.querySelector('.card-checkbox');
        if (checkbox) {
            checkbox.checked = state.completedTips.has(tip.id);
        }
    });

    // Update timeline view
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        const tip = state.tips[index];
        item.classList.toggle('completed', state.completedTips.has(tip.id));
        const checkbox = item.querySelector('.timeline-checkbox');
        if (checkbox) {
            checkbox.checked = state.completedTips.has(tip.id);
        }
    });
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Load data
    loadData();

    // View switcher buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    // Reset progress button
    document.getElementById('resetProgress').addEventListener('click', resetProgress);

    // Re-render clock on window resize
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

// Make toggleTipCompletion available globally for inline handlers
window.toggleTipCompletion = toggleTipCompletion;