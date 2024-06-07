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
    const newsList = document.createElement('ul'); // <ul> 요소 생성

    newsItems.forEach(item => {
        const listItem = document.createElement('li'); // <li> 요소 생성
        listItem.className = 'news-item';

        const title = document.createElement('h2');
        title.innerHTML = item.title;
        
        const link = document.createElement('a');
        link.href = item.link;
        link.innerText = 'Read article';
        link.target = '_blank';

        const description = document.createElement('p');
        description.innerHTML = item.description;

        listItem.appendChild(title);
        listItem.appendChild(description);
        listItem.appendChild(link);

        newsList.appendChild(listItem); // <li>를 <ul>에 추가
    });

    // 이전 내용을 모두 지우고 새로운 <ul>을 추가
    newsContainer.innerHTML = '';
    newsContainer.appendChild(newsList);
}

// 페이지 로드 시 뉴스 가져오기
document.addEventListener('DOMContentLoaded', fetchEsportsNews);
