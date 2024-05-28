async function fetchChampList() {
    const url = 'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/ko_KR/champ.json';
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
    const url = 'https://ddragon.leagueoflegends.com/cdn/14.10.1/data/ko_KR/champ/${champName}.json';
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

async function fetchChampSkills(champName) {
    const championData = await fetchSpecificChampionData(champName);
    if (!championData) {
        console.error(`No data found for champ: ${champName}`);
        return;
    }
    
    const { passive, spells } = championData;
    const skillList = [
        {
            name: passive.name,
            description: passive.description,
            detailedDescription: passive.sanitizedDescription,
            type: '패시브'
        },
        ...spells.map(spell => ({
            name: spell.name,
            description: spell.description,
            detailedDescription: spell.tooltip,
            type: '스킬'
        }))
    ];

    return skillList;
}

function loadChampSkills() {
    const selectElement = document.getElementById('champ-select');
    const champName = selectElement.value;
    if (!champName) {
        alert('챔피언을 선택하세요.');
        return;
    }

    fetchChampSkills(champName).then(skills => {
        if (skills) {
            const skillsListElement = document.getElementById('skills-list');
            skillsListElement.innerHTML = ''; // 기존 목록 초기화

            skills.forEach(skill => {
                const listItem = document.createElement('li');
                listItem.className = 'skill-item';
                listItem.innerHTML = `<strong>${skill.type}: ${skill.name}</strong>: ${skill.description}`;

                const skillDetails = document.createElement('div');
                skillDetails.className = 'skill-details';
                skillDetails.innerText = skill.detailedDescription;

                listItem.appendChild(skillDetails);
                skillsListElement.appendChild(listItem);
            });
        }
    });
}

async function populateChampSelect() {
    const champList = await fetchChampList();
    const selectElement = document.getElementById('champ-select');

    for (const champ in champList) {
        const option = document.createElement('option');
        option.value = champ;
        option.text = champList[champ].name;
        selectElement.appendChild(option);
    }
}

// 페이지 로드 시 챔피언 목록 채우기
window.onload = populateChampSelect;