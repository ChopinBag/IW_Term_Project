document.addEventListener('DOMContentLoaded', function() {
    const clientId = 'dloPTebOu4cLrqZwu8eQ';
    const clientSecret = 'XW9a6SWIgJ';
    const url = 'https://openapi.naver.com/v1/search/news.json';
    const query = '이스포츠';
    const display = 10;
    const start = 1;
    const sort = 'date';

    fetch(`${url}?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`, {
        method: 'GET',
        headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // 디버깅을 위해 데이터 출력
        const newsContainer = document.getElementById('news-container');
        data.items.forEach(item => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';

            const newsTitle = document.createElement('div');
            newsTitle.className = 'news-title';
            newsTitle.innerHTML = item.title;

            const newsLink = document.createElement('a');
            newsLink.className = 'news-link';
            newsLink.href = item.link;
            newsLink.target = '_blank';
            newsLink.textContent = 'Read more';

            newsItem.appendChild(newsTitle);
            newsItem.appendChild(newsLink);
            newsContainer.appendChild(newsItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        const newsContainer = document.getElementById('news-container');
        newsContainer.innerHTML = `<p style="color: red;">Failed to load news: ${error.message}</p>`;
    });
});