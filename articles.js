const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg0MTI2MTIwLCJpYXQiOjE2ODQwOTYxMjAsImp0aSI6IjdjZDA3NDM3YTk4NzQwMTdiOGE4MzBmZDlhZmY4NjA3IiwidXNlcl9pZCI6NCwiZW1haWwiOiJ0ZXN0QGRhdW0uY29tIn0.dM6hyI_kVZamWCH_fSUwhvuFZB-dym5XKAD9ZMReBUU"

window.onload = async () => {
    const articleListDiv = document.getElementById("article_list");

    try {
        // 게시글 목록을 가져오는 API 요청
        const response = await fetch('http://127.0.0.1:8000/articles/');
        const articles = await response.json();
        const proxy = "http://127.0.0.1:8000"   // 이미지를 가져오기 위한 백엔드 포트 주소할당

        console.log(articles)

        // 가져온 게시글을 표시
        articles.forEach((article) => {
            const articleDiv = document.createElement("div");
            articleDiv.classList.add("article"); // 클래스명 추가

            const article_update_at = new Date(article.updated_at).toLocaleString();
            const image_url = proxy + article.image


            articleDiv.innerHTML = `
                <h6>문서번호: ${article.pk}</h6>
                <h5>수정시간: ${article_update_at}</h5>
                <h1>${article.title}</h1>
                <h3>작성자: ${article.user}</h3> 
                <img src=${image_url} alt="썸네일" width="150" height="150">
                <h3>댓글:${article.comments_count}개</h3>
                <button class="like-button" article_id=${article.pk}>♡ ${article.likes_count}</button>
            `;

            articleListDiv.appendChild(articleDiv);
            articleDiv.style.backgroundColor = "lightgray";
        });
    } catch (error) {
        console.error('게시글을 가져오는 중 오류가 발생했습니다:', error);
    }
    // 좋아요 함수
    async function likeArticle(article_id) {
        try {
            const like_response = await fetch(`http://127.0.0.1:8000/articles/${article_id}/like/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
            });

            if (like_response.ok) {
                const result = await like_response.text();
                console.log(result); // 처리 결과를 출력하거나 필요에 따라 처리할 수 있습니다.

                // 좋아요 버튼의 텍스트 업데이트
                const likeButton = document.querySelector(`.like-button[article_id="${article_id}"]`);
                const likeCount = parseInt(likeButton.textContent.split(' ')[1]);
                if (result === 'like') {
                    likeButton.textContent = `♡ ${likeCount + 1}`;
                } else if (result === 'unlike') {
                    likeButton.textContent = `♡ ${likeCount - 1}`;
                }
            } else {
                console.error('좋아요 요청이 실패하였습니다.');
            }
        } catch (error) {
            console.error('좋아요 요청 중 오류가 발생하였습니다:', error);
        }
    }
    // 좋아요 버튼 클릭 이벤트 추가
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const articleId = button.getAttribute('article_id');
            likeArticle(articleId);
        });
    });
    // 이벤트 리스너 추가
    const articles = document.querySelectorAll('.article');
    articles.forEach((article) => {
        const articleId = article.querySelector('h6').textContent.split(':')[1].trim();
        article.addEventListener('click', () => {
            window.location.href = `articles_detail.html?id=${articleId}`;
        });
    });
}