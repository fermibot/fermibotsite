async function loadCards() {
    try {
        const response = await fetch('data/cards.json');
        const data = await response.json();
        const container = document.getElementById('cards-container');

        data.cards.forEach((card, index) => {
            const cardElement = createCardElement(card, index);
            container.appendChild(cardElement);
        });

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
            <img src="${card.icon}" class="image-section-icon" alt="${card.title} icon">
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