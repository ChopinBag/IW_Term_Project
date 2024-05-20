async function fetchSpecificChampionData(version, language, championName) {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion/${championName}.json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data[championName]; // 특정 챔피언 데이터 반환
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function fetchChampionSkills(version, language, championName) {
    const championData = await fetchSpecificChampionData(version, language, championName);
    if (!championData) {
        console.error(`No data found for champion: ${championName}`);
        return;
    }
    
    const { spells } = championData;
    const skillList = spells.map(spell => ({
        name: spell.name,
        description: spell.description
    }));

    return skillList;
}

// 사용 예제
fetchChampionSkills('12.6.1', 'ko_KR', 'Aatrox').then(skills => {
    console.log('Champion Skills:', skills);
});
