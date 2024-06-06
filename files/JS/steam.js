const backendUrl = 'http://localhost:3000/api/featured';
const searchUrl = 'http://localhost:3000/api/search?query=';

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("game_name").addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            searchGame();
        }
    });

    getDiscountedGames();
});

async function getDiscountedGames() {
    try {
        const response = await fetch(backendUrl);
        if (!response.ok) {
            throw new Error(`network response is not valid. response status : ${response.status}`);
        }

        const data = await response.json();
        const discountedGames = data.filter(game => game.discounted).map(game => ({
            name: game.name,
            originalPrice: game.original_price,
            finalPrice: game.final_price,
            discountPercent: game.discount_percent,
            imageUrl: game.header_image // 이미지 URL 추가
        }));

        // HTML 요소 생성
        const discountedGamesDiv = document.getElementById('Discounted_Games');
        // discountedGamesDiv.innerHTML = ''; // 기존 내용 제거

        discountedGames.forEach(game => {
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('game');

            const gameImage = document.createElement('img');
            gameImage.src = game.imageUrl;
            gameImage.alt = game.name;

            const gameName = document.createElement('h3');
            gameName.textContent = game.name;

            const originalPrice = document.createElement('p');
            originalPrice.textContent = `Original Price: ${game.originalPrice / 100} KRW`;

            const finalPrice = document.createElement('p');
            finalPrice.textContent = `Final Price: ${game.finalPrice / 100} KRW`;

            const discountPercent = document.createElement('p');
            discountPercent.textContent = `Discount: ${game.discountPercent}%`;

            gameDiv.appendChild(gameImage);
            gameDiv.appendChild(gameName);
            gameDiv.appendChild(originalPrice);
            gameDiv.appendChild(finalPrice);
            gameDiv.appendChild(discountPercent);

            discountedGamesDiv.appendChild(gameDiv);
        });

    } catch (error) {
        console.error('Error :', error);
    }
}

async function searchGame() {
    const gameName = document.getElementById('game_name').value;
    if (!gameName) {
        alert('Please enter a game name');
        return;
    }

    try {
        const response = await fetch(searchUrl + encodeURIComponent(gameName));
        if (!response.ok) {
            throw new Error(`network response is not valid. response status : ${response.status}`);
        }

        const game = await response.json();
        const searchResultDiv = document.getElementById('search_result');
        searchResultDiv.innerHTML = ''; // 기존 내용 제거

        if (game) {
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('game');
            
            searchResultDiv.appendChild(document.createElement('br'));
            const gameImage = document.createElement('img');
            gameImage.src = game.header_image;
            gameImage.alt = game.name;

            const gameName = document.createElement('h3');
            gameName.textContent = game.name;

            const priceOverview = game.price_overview || {};
            const originalPrice = document.createElement('p');
            originalPrice.textContent = priceOverview.initial
                ? `Original Price: ${priceOverview.initial / 100} KRW`
                : 'Price not available';

            const finalPrice = document.createElement('p');
            finalPrice.textContent = priceOverview.discount_percent > 0
                ? `Discounted Price: ${priceOverview.final / 100} KRW`
                : '';

            const discountPercent = document.createElement('p');
            discountPercent.textContent = priceOverview.discount_percent > 0
                ? `Discount: ${priceOverview.discount_percent}%`
                : '';

            const storeLink = document.createElement('a');
            storeLink.href = `https://store.steampowered.com/app/${game.steam_appid}`;
            storeLink.target = '_blank';
            storeLink.textContent = 'View on Steam Store';

            gameDiv.appendChild(gameImage);
            gameDiv.appendChild(gameName);
            gameDiv.appendChild(originalPrice);
            if (finalPrice.textContent) gameDiv.appendChild(finalPrice);
            if (discountPercent.textContent) gameDiv.appendChild(discountPercent);
            gameDiv.appendChild(storeLink);

            searchResultDiv.appendChild(gameDiv);
            searchResultDiv.appendChild(document.createElement('br'));
        } else {
            searchResultDiv.textContent = 'Game not found';
        }

    } catch (error) {
        console.error('Error :', error);
        const searchResultDiv = document.getElementById('search_result');
        searchResultDiv.textContent = 'Error fetching game data';
    }
}
