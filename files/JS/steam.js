document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("game_name").addEventListener("keyup", function(e) {
        if (e.key === "Enter") {
            searchGame();
        }
    });

    //입력 Format 기능 : 한글 입력 방지
    document.getElementById('game_name').addEventListener('input', function(event) {
        const input = event.target;
        const value = input.value;
        // 한글 문자(가-힣)를 제거
        const newValue = value.replace(/[\u3131-\u318E\uAC00-\uD7A3]/g, '');
        if (value !== newValue) {
            input.value = newValue;
            alert('한국어 입력은 지원하지 않습니다. 영문으로 입력해주세요.');
        }
    });

    getDiscountedGames();
});

const backendUrl = 'http://localhost:3000/api/featured';
const searchUrl = 'http://localhost:3000/api/search?query=';

// 시나리오 : steam API를 활용해 할인된 게임 목록을 가져와서 화면에 표시
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
            imageUrl: game.header_image
        }));

        const discountedGamesDiv = document.getElementById('Discounted_Games');
        if (!discountedGamesDiv) {
            throw new Error('Discounted_Games element not found');
        }

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

// 시나리오 : steam API를 활용해 게임을 검색하고 검색 결과를 화면에 표시
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

        //DOM HTML 요소를 생성하여 게임 정보 표시
        if (game) {
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('game');
            
            searchResultDiv.appendChild(document.createElement('br'));
            const gameImage = document.createElement('img');
            gameImage.src = game.header_image;
            gameImage.alt = game.name;

            const gameNameElem = document.createElement('h3');
            gameNameElem.textContent = game.name;

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
            gameDiv.appendChild(gameNameElem);
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