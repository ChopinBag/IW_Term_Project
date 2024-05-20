async function fetchChampList() {
    const url = 'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/ko_KR/champion.json';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data; // 챔피언 목록 반환
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function fetchSpecificChampData(champName) {
    const url = 'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/ko_KR/champion/${champName}.json';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data[champName]; // 특정 챔피언 데이터 반환
    } catch (error) {
        console.error('Fetch error:', error);
    }
}