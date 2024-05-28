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


let itemsByCategory = {};

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

window.onload = async function() {
    await populateChampionSelect();
    await populateItemCategories();
    document.getElementById('item-count').addEventListener('input', handleItemCountChange);
};
