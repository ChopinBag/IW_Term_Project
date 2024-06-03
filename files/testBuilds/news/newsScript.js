const naverClientID = 'dloPTebOu4cLrqZwu8eQ';
const naverClientSecret = 'XW9a6SWIgJ';

async function getNews(query, display=10, sort = 'date') {
  const url = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=${display}&sort=${sort}`;

  const options = {
    method : 'GET',
    headers : {'X-Naver-Client-Id': naverClientID,
    'X-Naver-Client-Secret': naverClientSecret
  }};
  try {
    const res = await fetch(url, options);
    if (!res.ok) { throw new Error('네트워크 연결이 좋지 않습니다.') }
    const data = await res.json();
    return data.items;
  }
  catch(error) {
    console.error('fetch 에러 : ', error);
  }
}

function displayNews(newsItems, containerId) {
  const container = document.getElementById(containerId);
  newsItems.forEach(items => {
      const newsElement = document.createElement('div');
      newsElement.className = 'news-item';
      newsElement.innerHTML = `
          <a href="${items.link}" target="_blank" class="news-link">
              <div class="news-title">${items.title}</div>
          </a>
          <div class="news-description">${items.description}</div>
      `;
      container.appendChild(newsElement);
  });
}

async function fetchEsportsNews() {
  const query1 = 'LCK';
  const query2 = '리그오브레전드';

  const newsLCK = await getNews(query1);
  const newsLOL = await getNews(query2);

  displayNews(newsLCK, 'news-lck');
  displayNews(newsLOL, 'news-lol');
}