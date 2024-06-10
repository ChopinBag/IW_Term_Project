// iframe에 기사 여는 함수
function openArticleInIframe(url) {
    //DOM html element 생성
    const newsArticleContainer = document.getElementById('newsArticle');
    
    if (!newsArticleContainer) {
        console.error('newsArticle element not found.');
        return;
    }
    console.log('newsArticle element found.');

    // 이전에 추가된 iframe을 제거
    newsArticleContainer.innerHTML = '';
    
    // 새로운 iframe을 생성하여 추가
    // DOM HTML, CSS 요소를 생성하여 기사를 iframe으로 열기
    const iframe = document.createElement('iframe');
    iframe.src = url;
    // 클래스를 추가하여 스타일 적용, DOM객체를 이용한 css property 변경
    iframe.className = 'news-iframe'; 
    iframe.style.border = 'none';
    iframe.style.height = '1000px';
    
    newsArticleContainer.appendChild(iframe);

    // iframe으로 부드럽게 스크롤
    iframe.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    // DOMContentLoaded 이벤트가 발생하면 실행
    console.log('DOMContentLoaded event fired');
    
    //메시지 수신시 iframe으로 기사 열기
    window.addEventListener('message', (event) => {
        if (event.data.action === 'openArticle') {
            openArticleInIframe(event.data.url);
        }
    });
});
