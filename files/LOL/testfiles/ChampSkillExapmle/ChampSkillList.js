async function fetchChampionList(version, language) {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion.json`;
    
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
    
    const { passive, spells } = championData;
    const skillList = [
        {
            name: passive.name,
            description: passive.description,
            icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${passive.image.full}`,
            type: '패시브'
        },
        ...spells.map(spell => ({
            name: spell.name,
            description: spell.description,
            detailedDescription: spell.tooltip,
            icon: `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spell.image.full}`,
            type: '스킬'
        }))
    ];

    return skillList;
}

function loadChampionSkills() {
    const selectElement = document.getElementById('champion-select');
    const championName = selectElement.value;
    if (!championName) {
        alert('챔피언을 선택하세요.');
        return;
    }

    fetchChampionSkills('12.6.1', 'ko_KR', championName).then(skills => {
        if (skills) {
            const skillsListElement = document.getElementById('skills-list');
            skillsListElement.innerHTML = ''; // 기존 목록 초기화

            skills.forEach(skill => {
                const listItem = document.createElement('li');
                listItem.className = 'skill-item';
                listItem.innerHTML = `
                    <img src="${skill.icon}" class="skill-icon" alt="${skill.name} 아이콘">
                    <strong>${skill.type}: ${skill.name}</strong>: ${skill.description}
                `;

                if (skill.type === '스킬') {
                    const skillDetails = document.createElement('div');
                    skillDetails.className = 'skill-details';
                    skillDetails.innerText = skill.detailedDescription;
                    listItem.appendChild(skillDetails);
                }

                skillsListElement.appendChild(listItem);
            });
        }
    });
}

// 챔피언 목록을 가져와서 드롭다운 메뉴에 추가
async function populateChampionSelect() {
    const championList = await fetchChampionList('12.6.1', 'ko_KR');
    const selectElement = document.getElementById('champion-select');

    for (const champion in championList) {
        const option = document.createElement('option');
        option.value = champion;
        option.text = championList[champion].name;
        selectElement.appendChild(option);
    }
}

// 페이지 로드 시 챔피언 목록 채우기
window.onload = populateChampionSelect;
