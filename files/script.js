const version = '11.10.1'; // 최신 버전으로 변경 가능
const apiKey = 'RGAPI-b086b657-e245-4673-920a-37686aff31b5'; // API 키를 입력하세요

const championsUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;
const itemsUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/item.json`;

// 데이터 가져오기
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}

// 챔피언 선택 박스 채우기
async function populateChampions() {
    const data = await fetchData(championsUrl);
    const champions = data.data;
    const attackerSelect = document.getElementById('attacker');
    const defenderSelect = document.getElementById('defender');

    for (const key in champions) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = champions[key].name;
        attackerSelect.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = key;
        option2.textContent = champions[key].name;
        defenderSelect.appendChild(option2);
    }
}

// 아이템 선택 박스 채우기
async function populateItems() {
    const data = await fetchData(itemsUrl);
    const items = data.data;
    const attackerItemsSelect = document.getElementById('attacker-items');
    const defenderItemsSelect = document.getElementById('defender-items');

    for (const key in items) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = items[key].name;
        attackerItemsSelect.appendChild(option);

        const option2 = document.createElement('option');
        option2.value = key;
        option2.textContent = items[key].name;
        defenderItemsSelect.appendChild(option2);
    }
}

// 스킬 선택 박스 채우기
async function populateSkills() {
    const attackerSelect = document.getElementById('attacker');
    const attackerKey = attackerSelect.value;
    const championsData = await fetchData(championsUrl);
    const attacker = championsData.data[attackerKey];
    const skills = attacker.spells;
    const skillSelect = document.getElementById('attacker-skill');

    // 기존 옵션 제거
    skillSelect.innerHTML = '';

    // 스킬 옵션 추가
    skills.forEach((skill, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = skill.name;
        skillSelect.appendChild(option);
    });
}

// 데미지 계산 함수
function calculateDamage(attacker, defender, skill, attackerItems, defenderItems, attackerLevel, defenderLevel) {
    let attackDamage = attacker.stats.attackdamage + (attacker.stats.attackdamageperlevel * (attackerLevel - 1));
    let armor = defender.stats.armor + (defender.stats.armorperlevel * (defenderLevel - 1));
    let skillDamage = skill.damage[0]; // 예시로 첫 번째 레벨의 스킬 데미지 사용

    attackerItems.forEach(item => {
        if (item.stats.attackdamage) {
            attackDamage += item.stats.attackdamage;
        }
    });

    defenderItems.forEach(item => {
        if (item.stats.armor) {
            armor += item.stats.armor;
        }
    });

    const totalDamage = skillDamage + attackDamage;
    const actualDamage = totalDamage * (100 / (100 + armor));

    return actualDamage;
}

// 폼 제출 처리
document.getElementById('damage-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const attackerKey = document.getElementById('attacker').value;
    const defenderKey = document.getElementById('defender').value;
    const attackerLevel = parseInt(document.getElementById('attacker-level').value) || 1;
    const defenderLevel = parseInt(document.getElementById('defender-level').value) || 1;
    const skillIndex = document.getElementById('attacker-skill').value;

    const attackerItemsKeys = Array.from(document.querySelectorAll('#attacker-items option:checked')).map(item => item.value);
    const defenderItemsKeys = Array.from(document.querySelectorAll('#defender-items option:checked')).map(item => item.value);

    const championsData = await fetchData(championsUrl);
    const itemsData = await fetchData(itemsUrl);

    const attacker = championsData.data[attackerKey];
    const defender = championsData.data[defenderKey];
    const skill = attacker.spells[skillIndex];

    const attackerItems = attackerItemsKeys.map(key => itemsData.data[key]);
    const defenderItems = defenderItemsKeys.map(key => itemsData.data[key]);

    const damage = calculateDamage(attacker, defender, skill, attackerItems, defenderItems, attackerLevel, defenderLevel);

    document.getElementById('result').textContent = `Calculated Damage: ${damage.toFixed(2)}`;
});

// 초기 데이터 로드
populateChampions();
populateItems();
