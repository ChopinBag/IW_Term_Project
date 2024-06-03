document.addEventListener("DOMContentLoaded", () => {
    const apiKey = '08F20F3E10EB5008CF69F3897DB89FD2';
    const steamStoreUrl = 'https://store.steampowered.com/api/featuredcategories/';
    const proxyUrl = 'https://thingproxy.freeboard.io/fetch/';

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
        const gamesList = document.getElementById('games-list');
        gamesList.innerHTML = '';

        games.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game';

            gameElement.innerHTML = `
                <h2>${game.name}</h2>
                <p>Original Price: $${(game.original_price / 100).toFixed(2)}</p>
                <p>Discounted Price: $${(game.final_price / 100).toFixed(2)}</p>
                <p>Discount Percentage: ${game.discount_percent}%</p>
            `;

            gamesList.appendChild(gameElement);
        });
    }

    getDiscountedGames();
});
