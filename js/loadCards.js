async function loadCards() {
    try {
        const [cardsResponse, orderResponse] = await Promise.all([
            fetch('data/cards.json'),
            fetch('data/cardsOrder.json').catch(() => null)
        ]);

        const data = await cardsResponse.json();
        const orderData = orderResponse ? await orderResponse.json().catch(() => null) : null;
        const categoriesOrder = Array.isArray(orderData?.categoriesOrder) ? orderData.categoriesOrder : [];

        const container = document.getElementById('cards-container');

        // Clear container in case this is re-run
        container.innerHTML = '';

        // Preserve incoming order and group by categoryMain
        const groups = new Map();
        for (const card of data.cards) {
            const groupKey = card.categoryMain || 'Other';
            if (!groups.has(groupKey)) groups.set(groupKey, []);
            groups.get(groupKey).push(card);
        }

        // Determine render order: explicit order first, then remaining groups in original appearance order
        const orderedKeys = [];
        const seenKeys = new Set();

        for (const key of categoriesOrder) {
            if (groups.has(key) && !seenKeys.has(key)) {
                orderedKeys.push(key);
                seenKeys.add(key);
            }
        }

        for (const key of groups.keys()) {
            if (!seenKeys.has(key)) {
                orderedKeys.push(key);
                seenKeys.add(key);
            }
        }

        let cardIndex = 0;
        for (const categoryMain of orderedKeys) {
            const cards = groups.get(categoryMain);
            if (!cards) continue;

            const sectionEl = document.createElement('section');
            sectionEl.className = 'cards-section';

            const headerEl = document.createElement('div');
            headerEl.className = 'text-center mb-3';
            headerEl.innerHTML = `<h4 class="section-title cards-section-title">${categoryMain}</h4>`;

            const gridEl = document.createElement('div');
            gridEl.className = 'cards-grid';

            cards.forEach((card) => {
                const cardElement = createCardElement(card, cardIndex);
                gridEl.appendChild(cardElement);
                cardIndex += 1;
            });

            sectionEl.appendChild(headerEl);
            sectionEl.appendChild(gridEl);
            container.appendChild(sectionEl);
        }

        // Style the image icons after loading
        if (typeof styleImageIcons === 'function') {
            styleImageIcons("image-section-icon");
        }
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'bg-body-tertiary border rounded-3 p-3 welcome-box animate-on-scroll';

    // Set animation delay based on index for staggered effect
    cardDiv.style.animationDelay = `${(index % 6) * 0.1 + 0.1}s`;

    let linksHTML = '';
    card.links.forEach(link => {
        linksHTML += `<li><a href="${link.url}" target="">${link.text}</a></li>`;
    });

    cardDiv.innerHTML = `
        <div class="text-center mb-3">
            <img src="${card.icon}" class="image-section-icon" loading="lazy" alt="${card.title} icon">
        </div>
        <h5 class="text-center mb-3">${card.title}</h5>
        <ul class="list-unstyled">
            ${linksHTML}
        </ul>
    `;

    return cardDiv;
}

// Load cards when DOM is ready
document.addEventListener('DOMContentLoaded', loadCards);