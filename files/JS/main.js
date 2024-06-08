function openArticleInIframe(url) {
    const newsArticleContainer = document.getElementById('newsArticle');
    
    if (!newsArticleContainer) {
        console.error('newsArticle element not found.');
        return;
    }

    console.log('newsArticle element found.');

    // 이전에 추가된 iframe을 제거
    newsArticleContainer.innerHTML = '';
    
    // 새로운 iframe을 생성하여 추가
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.className = 'news-iframe'; // 클래스를 추가
    iframe.style.border = 'none';
    
    newsArticleContainer.appendChild(iframe);

    // iframe으로 부드럽게 스크롤
    iframe.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    
    window.addEventListener('message', (event) => {
        if (event.data.action === 'openArticle') {
            openArticleInIframe(event.data.url);
        }
    });
});
