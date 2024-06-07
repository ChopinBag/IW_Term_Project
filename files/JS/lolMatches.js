document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', event => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        getSummonerInfo(username);
    });
});

async function getSummonerInfo(username) {
    const url = 'http://localhost:3000/api/'; // 서버 엔드포인트

    try {
        const encodedUsername = encodeURIComponent(username);
        const summonerResponse = await fetch(`${url}summoner/${encodedUsername}`);
        if (!summonerResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const summonerData = await summonerResponse.json();
        displaySummonerInfo(summonerData);

        const accountId = summonerData.accountId;
        const matchResponse = await fetch(`${url}matches/${accountId}`);
        if (!matchResponse.ok) {
            throw new Error('Network response was not ok');
        }
        const matchData = await matchResponse.json();
        displayMatchHistory(matchData);
    } catch (error) {
        console.error('Error fetching match history:', error);
    }
}

function displaySummonerInfo(summoner) {
    const summonerInfoContainer = document.getElementById('summonerInfo');
    summonerInfoContainer.innerHTML = ''; // 기존 내용을 비웁니다

    const summonerName = document.createElement('h3');
    summonerName.textContent = `소환사 이름: ${summoner.name}`;
    const summonerLevel = document.createElement('p');
    summonerLevel.textContent = `레벨: ${summoner.summonerLevel}`;

    summonerInfoContainer.appendChild(summonerName);
    summonerInfoContainer.appendChild(summonerLevel);
}

function displayMatchHistory(matches) {
    const matchHistoryContainer = document.getElementById('matchHistory');
    matchHistoryContainer.innerHTML = ''; // 기존 내용을 비웁니다

    matches.forEach(match => {
        const listItem = document.createElement('li');
        listItem.textContent = `Game ID: ${match.gameId}`;
        matchHistoryContainer.appendChild(listItem);
    });
}
