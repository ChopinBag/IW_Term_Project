document.getElementById('fetch-games').addEventListener('click', fetchDiscountedGames);

async function fetchDiscountedGames() {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = 'Loading...';

    // Step 1: Get the list of all games
    const gamesListResponse = await fetch('https://api.steampowered.com/ISteamApps/GetAppList/v2/');
    const gamesListData = await gamesListResponse.json();
    const appList = gamesListData.applist.apps.slice(0, 100); // Limiting to first 100 games for demonstration

    // Step 2: Function to get details of a game
    async function getGameDetails(appId) {
        const gameDetailsResponse = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`);
        const gameDetailsData = await gameDetailsResponse.json();
        return gameDetailsData[appId];
    }

    // Step 3: Fetch details for each game and filter discounted games
    const gamesOnSale = [];
    for (const game of appList) {
        const details = await getGameDetails(game.appid);
        if (details.success && details.data.price_overview && details.data.price_overview.discount_percent > 0) {
            gamesOnSale.push({
                name: details.data.name,
                original_price: details.data.price_overview.initial_formatted,
                discounted_price: details.data.price_overview.final_formatted,
                discount_percent: details.data.price_overview.discount_percent
            });
        }
    }

    // Step 4: Display the games on sale
    gamesContainer.innerHTML = '';
    if (gamesOnSale.length > 0) {
        gamesOnSale.forEach(game => {
            const gameElement = document.createElement('div');
            gameElement.className = 'game';
            gameElement.innerHTML = `
                <h3>${game.name}</h3>
                <p>Original Price: ${game.original_price}</p>
                <p>Discounted Price: ${game.discounted_price}</p>
                <p>Discount: ${game.discount_percent}%</p>
            `;
            gamesContainer.appendChild(gameElement);
        });
    } else {
        gamesContainer.innerHTML = 'No discounted games found.';
    }
}