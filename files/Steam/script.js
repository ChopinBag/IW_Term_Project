document.addEventListener('DOMContentLoaded', () => {
    const gameList = document.getElementById('game-list');
    const API_KEY = 'YOUR_STEAM_API_KEY';  // 스팀 API 키를 여기에 입력

    async function fetchDiscountedGames() {
        try {
            const response = await fetch(`https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${API_KEY}`);
            const data = await response.json();
            const discountedGames = data.applist.apps.slice(0, 10); // 예제용으로 10개 게임만 가져옴

            discountedGames.forEach(async (game) => {
                const gameDetailsResponse = await fetch(`https://store.steampowered.com/api/appdetails?appids=${game.appid}`);
                const gameDetailsData = await gameDetailsResponse.json();
                const gameDetails = gameDetailsData[game.appid].data;
                
                if (gameDetails && gameDetails.price_overview && gameDetails.price_overview.discount_percent > 0) {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <h3>${gameDetails.name}</h3>
                        <p>${gameDetails.short_description}</p>
                        <p>Discount: ${gameDetails.price_overview.discount_percent}%</p>
                        <a href="https://store.steampowered.com/app/${game.appid}" target="_blank">View on Steam</a>
                    `;
                    gameList.appendChild(listItem);
                }
            });
        } catch (error) {
            console.error('Error fetching discounted games:', error);
        }
    }
    
    fetchDiscountedGames();
});
