// dom html element 생성
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');

    //naver api를 활용해 e스포츠 뉴스를 가져와서 화면에 표시
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
    //뉴스를 화면에 표시
    function displayNews(newsItems) {
        const newsContainer = document.getElementById('news');
        
        if (!newsContainer) {
            console.error('news element not found.');
            return;
        }

        console.log('news element found.');

        const newsList = document.createElement('ul'); // <ul> 요소 생성

        // 리스트 활용하여 뉴스 목록 생성(<ul>에 <li> 추가)
        //DOM HTML 요소를 생성하여 뉴스를 화면에 표시
        newsItems.forEach(item => {
            const listItem = document.createElement('li'); // <li> 요소 생성
            listItem.className = 'news-item';

            const title = document.createElement('h2');
            title.innerHTML = item.title;
            
            const link = document.createElement('a');
            link.href = '#';
            link.innerText = 'Read article';
            link.dataset.url = item.link;
            // 기사를 iframe으로 열기 위해 부모 창에 메시지 전송
            link.addEventListener('click', function(event) {
                event.preventDefault();
                window.parent.postMessage({ action: 'openArticle', url: item.link }, '*');
            });

            const description = document.createElement('p');
            description.innerHTML = item.description;

            // 제목, 설명, 링크를 <li>에 추가
            listItem.appendChild(title);
            listItem.appendChild(description);
            listItem.appendChild(link);
            // <li>를 <ul>에 추가
            newsList.appendChild(listItem);
        });

        // 이전 내용을 모두 지우고 새로운 <ul>을 추가
        newsContainer.innerHTML = '';
        newsContainer.appendChild(newsList);
    }

    fetchEsportsNews();
});
