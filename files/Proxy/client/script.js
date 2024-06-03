document.addEventListener("DOMContentLoaded", () => {
    const steamStoreUrl = 'https://store.steampowered.com/api/featuredcategories/';
    const proxyUrl = 'http://localhost:3000/fetch?url=';

    async function getDiscountedGames() {
        try {
            const response = await fetch(proxyUrl + steamStoreUrl);
            if (response.ok) {
                const data = await response.json();
                if (data && data.specials && data.specials.items) {
                    displayGames(data.specials.items);
                }
            } else {
                console.error('Failed to fetch data from Steam API');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayGames(games) {
        const gamesListContainer = document.getElementById('games-list-container');
        gamesListContainer.innerHTML = '';

        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game';

            // 가격은 원화로 제공되므로 그대로 사용
            const originalPriceKRW = game.original_price/100;
            const finalPriceKRW = game.final_price/100;

            gameElement.innerHTML = `
                <img src="${game.large_capsule_image}" alt="${game.name} Image">
                <div class="game-details">
                    <h3>${game.name}</h3>
                    <p>Original Price: <span class="original-price">₩${originalPriceKRW.toLocaleString()}</span></p>
                    <p>Discounted Price: <span class="discounted-price">₩${finalPriceKRW.toLocaleString()}</span></p>
                    <p>Discount Percentage: <span class="discount-percent">${game.discount_percent}%</span></p>
                </div>
            `;

            gamesListContainer.appendChild(gameElement);
        });
    }

    getDiscountedGames();
});
