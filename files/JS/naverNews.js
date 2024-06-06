async function fetchEsportsNews() {
    const url = 'http://localhost:3000/api/news';
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        
        const data = await response.json();
        displayNews(data);
    } catch (error) {
        console.error('There was a problem with fetching the news:', error);
    }
}

function displayNews(newsItems) {
    const newsContainer = document.getElementById('news');
    newsContainer.innerHTML = '';

    newsItems.forEach(item => {
        const newsDiv = document.createElement('div');
        newsDiv.className = 'news-item';

        const title = document.createElement('h2');
        title.innerHTML = item.title;
        
        const link = document.createElement('a');
        link.href = item.link;
        link.innerText = 'Read article';
        link.target = '_blank';

        const description = document.createElement('p');
        description.innerHTML = item.description;

        newsDiv.appendChild(title);
        newsDiv.appendChild(description);
        newsDiv.appendChild(link);

        newsContainer.appendChild(newsDiv);
    });
}

// 페이지 로드 시 뉴스 가져오기
document.addEventListener('DOMContentLoaded', fetchEsportsNews);
