document.addEventListener('DOMContentLoaded', () => {
    let articles = JSON.parse(localStorage.getItem('articles')) || [];
    let currentEditId = null;

    function updateArticlesList() {
        const articlesList = document.getElementById('articles-list');
        const totalArticles = document.getElementById('total-articles');
        const searchInput = document.getElementById('search-input').value.toLowerCase();

        // 更新文章总数
        totalArticles.textContent = articles.length;

        // 过滤并排序文章
        const filteredArticles = articles
            .filter(article => 
                article.title.toLowerCase().includes(searchInput) ||
                article.content.toLowerCase().includes(searchInput)
            )
            .sort((a, b) => b.timestamp - a.timestamp);

        // 渲染文章列表
        articlesList.innerHTML = filteredArticles.map(article => `
            <div class="article-card" data-id="${article.id}">
                <div class="article-header">
                    <h2 class="article-title">
                        <a href="article.html?id=${article.id}" class="article-link">${article.title}</a>
                    </h2>
                    <div class="article-actions">
                        <button class="action-btn" onclick="editArticle(${article.id})">
                            <i class="material-icons">edit</i>
                        </button>
                        <button class="action-btn" onclick="deleteArticle(${article.id})">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
                <div class="article-content">${article.content}</div>
                <div class="article-meta">
                    <span class="article-category">
                        <i class="material-icons">folder</i>
                        ${article.category || '未分类'}
                    </span>
                    <span class="article-date">${new Date(article.timestamp).toLocaleString()}</span>
                </div>
                ${article.tags ? `
                <div class="article-tags">
                    ${article.tags.split(',').map(tag => 
                        tag.trim() ? `<span class="tag">${tag.trim()}</span>` : ''
                    ).join('')}
                </div>
                ` : ''}
            </div>
        `).join('');
    }

    // 显示编辑器
    window.showEditor = () => {
        document.getElementById('article-editor').classList.remove('hidden');
        document.getElementById('articles-list').classList.add('hidden');
        document.getElementById('article-title').value = '';
        document.getElementById('article-content').value = '';
        currentEditId = null;
    };

    // 隐藏编辑器
    window.hideEditor = () => {
        document.getElementById('article-editor').classList.add('hidden');
        document.getElementById('articles-list').classList.remove('hidden');
        currentEditId = null;
    };

    // 保存文章
    window.saveArticle = () => {
        const title = document.getElementById('article-title').value.trim();
        const content = document.getElementById('article-content').value.trim();

        if (!title || !content) {
            alert('标题和内容不能为空！');
            return;
        }

        if (currentEditId) {
            // 编辑现有文章
            const index = articles.findIndex(a => a.id === currentEditId);
            if (index !== -1) {
                articles[index] = {
                    ...articles[index],
                    title,
                    content,
                    timestamp: Date.now()
                };
            }
        } else {
            // 创建新文章
            articles.push({
                id: Date.now(),
                title,
                content,
                timestamp: Date.now()
            });
        }

        localStorage.setItem('articles', JSON.stringify(articles));
        hideEditor();
        updateArticlesList();
    };

    // 编辑文章
    window.editArticle = (id) => {
        const article = articles.find(a => a.id === id);
        if (article) {
            currentEditId = id;
            document.getElementById('article-title').value = article.title;
            document.getElementById('article-content').value = article.content;
            showEditor();
        }
    };

    // 删除文章
    window.deleteArticle = (id) => {
        if (confirm('确定要删除这篇文章吗？')) {
            articles = articles.filter(a => a.id !== id);
            localStorage.setItem('articles', JSON.stringify(articles));
            updateArticlesList();
        }
    };

    // 搜索功能
    document.getElementById('search-input').addEventListener('input', updateArticlesList);

    // 初始化
    updateArticlesList();
}); 