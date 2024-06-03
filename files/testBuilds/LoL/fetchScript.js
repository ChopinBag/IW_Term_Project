/*
async function fetChpList() {
    const url = "https://ddragon.leagueoflegends.com/cdn/14.10.1/data/ko_KR/champ.json";
    try {
        const res = await fetch(url);
    }
}
*/

async function fetChpLoadingScreen(ChpName) {
    const url = `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${ChpName}_0.jpg`
    try {
        const res = await fetch(url);
        if (!res.ok) { throw new Error('네트워크 연결이 좋지 않습니다.') }
        const img = await res.blob();
        return URL.createObjectURL(img);
    }
    catch(error) {
        console.error('fetch 에러 : ', error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // 로드할 챔피언 이름을 설정합니다.
    let chpName = 'Ahri';
    // fetchChpLoadingScreen 함수를 호출하여 이미지를 로드하고 처리합니다.
    fetChpLoadingScreen(chpName).then(imageUrl => {
        if (imageUrl) {
            // <img> 요소를 생성하고 객체 URL을 설정합니다.
            let imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.alt = `${chpName} Loading Screen`;
            // 이미지 요소를 DOM에 추가합니다.
            let container = document.getElementById('ChpLoadingScreen');
            container.appendChild(imgElement);
        }
    });
});