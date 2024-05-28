let itemsByCategory = {};

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

async function fetchItemList(version, language) {
    const url = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/item.json`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.data; // 아이템 목록 반환
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function createItemDropdown(id, itemsByCategory) {
    const select = document.createElement('select');
    select.className = 'item-select';
    select.id = `item-select-${id}`;
    select.innerHTML = `<option value="">아이템을 선택하세요</option>`;

    for (const category in itemsByCategory) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;

        itemsByCategory[category].forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.name;
            optgroup.appendChild(option);
        });

        select.appendChild(optgroup);
    }

    return select;
}

function handleItemCountChange() {
    const itemCount = document.getElementById('item-count').value;
    const itemsSection = document.getElementById('items-section');
    itemsSection.innerHTML = '';

    for (let i = 0; i < itemCount; i++) {
        const itemDropdown = createItemDropdown(i, itemsByCategory);
        itemsSection.appendChild(itemDropdown);
        itemsSection.appendChild(document.createElement('br')); // 각 드롭다운 사이에 <br> 태그 추가
    }
}

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

async function populateItemCategories() {
    const itemList = await fetchItemList('12.6.1', 'ko_KR');

    itemsByCategory = {
        '시작 아이템': [],
        '기본 아이템': [],
        '서사급 아이템': [],
        '전설급 아이템': [],
        '장화': []
    };

    for (const itemId in itemList) {
        const item = itemList[itemId];
        if (item.tags.includes('Consumable') || item.tags.includes('Trinket') || item.tags.includes('Ornn')) continue;

        if (item.tags.includes('Boots')) {
            itemsByCategory['장화'].push({ id: itemId, name: item.name });
        } else if (item.gold.total <= 500) {
            itemsByCategory['시작 아이템'].push({ id: itemId, name: item.name });
        } else if (item.gold.total <= 1050) {
            itemsByCategory['기본 아이템'].push({ id: itemId, name: item.name });
        } else if (item.gold.total <= 2500) {
            itemsByCategory['서사급 아이템'].push({ id: itemId, name: item.name });
        } else if (item.gold.total > 2500) {
            itemsByCategory['전설급 아이템'].push({ id: itemId, name: item.name });
        }
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

async function displaySkills() {
    const championName = document.getElementById('champion-select').value;
    if (!championName) return;

    const skills = await fetchChampionSkills('12.6.1', 'ko_KR', championName);
    if (skills) {
        const skillMap = ['q-skill', 'w-skill', 'e-skill', 'r-skill'];
        skills.slice(1).forEach((skill, index) => {
            document.getElementById(skillMap[index]).innerText = skill.name;
        });
    }
}

function calculateDamage(skillType) {
    const level = document.getElementById('champion-level').value;
    const items = Array.from(document.querySelectorAll('.item-select')).map(select => select.value);
    const armor = document.getElementById('defender-armor').value;
    const mr = document.getElementById('defender-mr').value;

    // 여기서 순수 데미지와 실질 데미지를 계산합니다.
    let pureDamage = 0; // 순수 데미지 계산 로직 추가
    let actualDamage = 0; // 실질 데미지 계산 로직 추가

    document.getElementById('pure-damage').innerText = pureDamage;
    document.getElementById('actual-damage').innerText = actualDamage;
}

window.onload = async function() {
    await populateChampionSelect();
    await populateItemCategories();
    document.getElementById('item-count').addEventListener('input', handleItemCountChange);
    document.getElementById('champion-select').addEventListener('change', displaySkills);
    document.getElementById('basic-attack-btn').addEventListener('click', () => calculateDamage('basic-attack'));
    document.getElementById('q-btn').addEventListener('click', () => calculateDamage('q'));
    document.getElementById('w-btn').addEventListener('click', () => calculateDamage('w'));
    document.getElementById('e-btn').addEventListener('click', () => calculateDamage('e'));
    document.getElementById('r-btn').addEventListener('click', () => calculateDamage('r'));
};
