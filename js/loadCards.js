async function loadCards() {
    try {
        const response = await fetch('data/cards.json');
        const data = await response.json();
        const container = document.getElementById('cards-container');

        data.cards.forEach(card => {
            const cardElement = createCardElement(card);
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

function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'bg-body-tertiary border rounded-3 p-3';

    let linksHTML = '';
    card.links.forEach(link => {
        linksHTML += `<li><a href="${link.url}" target="">${link.text}</a></li>`;
    });

    cardDiv.innerHTML = `
        <div>
            <img src="${card.icon}" class="image-section-icon" alt="icon">
        </div>
        <h5>${card.title}</h5>
        <ul>
            ${linksHTML}
        </ul>
    `;

    return cardDiv;
}

// Load cards when DOM is ready
document.addEventListener('DOMContentLoaded', loadCards);