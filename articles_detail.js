const proxy = "http://127.0.0.1:8000";

async function getArticleDetail(articleId) {
    try {
        const response = await fetch(`${proxy}/articles/${articleId}/`);
        const article = await response.json();
        return article;
    } catch (error) {
        console.error('게시글 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
    }
}

// 댓글 가져오기
async function getComments(articleId) {
    try {
        const response = await fetch(`${proxy}/articles/${articleId}/comment/`);
        const comments = await response.json();
        return comments;
    } catch (error) {
        console.error('댓글을 가져오는 중 오류가 발생했습니다:', error);
    }
}

// 댓글 작성
async function createComment(articleId, commentData) {
    try {
        const response = await fetch(`${proxy}/articles/${articleId}/comment/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg0MTI2MTIwLCJpYXQiOjE2ODQwOTYxMjAsImp0aSI6IjdjZDA3NDM3YTk4NzQwMTdiOGE4MzBmZDlhZmY4NjA3IiwidXNlcl9pZCI6NCwiZW1haWwiOiJ0ZXN0QGRhdW0uY29tIn0.dM6hyI_kVZamWCH_fSUwhvuFZB-dym5XKAD9ZMReBUU'
            },
            body: JSON.stringify(commentData)
        });
        const comment = await response.json();
        return comment;
    } catch (error) {
        console.error('댓글 작성 중 오류가 발생했습니다:', error);
    }
}

// 댓글 수정
async function updateComment(articleId, commentId, commentData) {
    try {
        const response = await fetch(`${proxy}/articles/${articleId}/comment/${commentId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg0MTI2MTIwLCJpYXQiOjE2ODQwOTYxMjAsImp0aSI6IjdjZDA3NDM3YTk4NzQwMTdiOGE4MzBmZDlhZmY4NjA3IiwidXNlcl9pZCI6NCwiZW1haWwiOiJ0ZXN0QGRhdW0uY29tIn0.dM6hyI_kVZamWCH_fSUwhvuFZB-dym5XKAD9ZMReBUU'
            },
            body: JSON.stringify(commentData)
        });
        if (response.status === 200) {
            const updatedComment = await response.json();
            return updatedComment;
        } else {
            throw new Error('댓글 수정 중 오류가 발생했습니다');
        }
    } catch (error) {
        console.error('댓글 수정 중 오류가 발생했습니다:', error);
    }
}

// 댓글 삭제
async function deleteComment(articleId, commentId) {
    try {
        const response = await fetch(`${proxy}/articles/${articleId}/comment/${commentId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg0MTI2MTIwLCJpYXQiOjE2ODQwOTYxMjAsImp0aSI6IjdjZDA3NDM3YTk4NzQwMTdiOGE4MzBmZDlhZmY4NjA3IiwidXNlcl9pZCI6NCwiZW1haWwiOiJ0ZXN0QGRhdW0uY29tIn0.dM6hyI_kVZamWCH_fSUwhvuFZB-dym5XKAD9ZMReBUU'
            }
        });
        if (response.status === 204) {
            window.location.reload();
        } else if (response.status === 403) {
            throw new Error('권한이 없습니다!');
        } else {
            throw new Error('댓글 삭제 중 오류가 발생했습니다');
        }
    } catch (error) {
        console.error('댓글 삭제 중 오류가 발생했습니다:', error);
    }
}

// 페이지 로드 시 실행되는 코드
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');



    const article = await getArticleDetail(articleId); // 비동기 함수 실행을 기다림
    console.log(article)

    const parser = new DOMParser();
    const doc = parser.parseFromString(article.content, "text/html");

    doc.querySelectorAll('img').forEach(img => {
        let imgSrc = img.getAttribute('src');
        if (imgSrc.startsWith('/')) {
            img.setAttribute('src', proxy + imgSrc);
        }
    });

    const article_update_at = new Date(article.updated_at).toLocaleString();
    const image_url = proxy + article.image;
    const bodyContent = doc.body.innerHTML;

    const detailArticleBox = document.getElementById('detail_article_box');
    detailArticleBox.innerHTML = `
        <h6> 문서번호: ${article.id}</h6>
        <h6>수정시간: ${article_update_at}</h6>
        <h1>${article.title}</h1>
        <h3>작성자: ${article.user}</h3> 
        <img src="${image_url}" alt="썸네일" width="50" height="50">
        ${bodyContent}
    `;
    detailArticleBox.style.backgroundColor = "lightgray";

    const commentsBox = document.getElementById('comments_box');
    commentsBox.innerHTML = `
        <h2>댓글</h2>
    `;
    commentsBox.style.backgroundColor = "lightblue";
    // 댓글 입력 폼 추가
    const commentForm = document.createElement('form');
    commentForm.innerHTML = `
        <textarea id="comment_content" rows="4" cols="50" placeholder="댓글을 입력하세요..."></textarea>
        <button type="submit">댓글 작성</button>
    `;
    commentsBox.appendChild(commentForm);

    // 댓글 가져오기
    const comments = await getComments(articleId);
    console.log(comments);

    // 댓글을 표시하는 코드 작성
    const commentsList = document.createElement('div');
    comments.forEach(comment => {
        const commentItem = document.createElement('span');
        commentItem.innerHTML = `
        <p id=comment_content>${comment.user} : ${comment.content}</p>
        <button class="edit-button">수정</button>
        <button class="delete-button">삭제</button>
    `;
        commentsList.appendChild(commentItem);

        // 수정 버튼 클릭 시 댓글 내용을 편집 가능한 입력 상자에 표시
        const editButton = commentItem.querySelector('.edit-button');
        editButton.addEventListener('click', () => {
            const commentContent = commentItem.querySelector('p');
            console.log(commentItem)
            console.log(commentContent)
            const currentContent = commentContent.textContent.split(' : ')[1];
            commentContent.innerHTML = `
            <textarea class="edit_comment_input">${currentContent}</textarea>
            <button class="save_button">저장</button>
        `;
            const saveButton = commentItem.querySelector('.save_button');
            saveButton.addEventListener('click', async () => {
                const editedContent = commentItem.querySelector('.edit_comment_input').value;
                const commentId = comment.id;

                const commentData = {
                    content: editedContent,
                    // 필요한 댓글 데이터 추가
                };

                const updatedComment = await updateComment(articleId, commentId, commentData);
                console.log(updatedComment);
                // 필요한 작업 수행 (예: 화면 갱신 등)

                // 수정된 댓글 내용을 화면에 반영하는 코드 작성
                commentContent.innerHTML = `<strong>${comment.user}</strong>: ${editedContent}`;
                window.location.reload();
            });
        });
    });

    commentsBox.appendChild(commentsList);

    // 댓글 작성 예시
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentContent = document.getElementById('comment_content').value;

        const commentData = {
            content: commentContent,
            // 필요한 댓글 데이터 추가
        };
        console.log(commentData)
        const newComment = await createComment(articleId, commentData);
        console.log(newComment);

        // 댓글 작성 후 새로고침
        window.location.reload();
    });
});