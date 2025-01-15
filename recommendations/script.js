function showAddForm() {
    document.getElementById('addModal').classList.add('show');
}

function hideAddForm() {
    document.getElementById('addModal').classList.remove('show');
    document.getElementById('addForm').reset();
}

function addRecommendation(event) {
    event.preventDefault();
    
    const section = document.getElementById('section').value;
    const title = document.getElementById('title').value;
    const subtitle = document.getElementById('subtitle').value;
    const description = document.getElementById('description').value;
    const icon = document.getElementById('icon').value;
    const url = document.getElementById('url').value;
    const tags = document.getElementById('tags').value;

    const card = createRecommendationCard({
        title,
        subtitle,
        description,
        icon,
        url,
        tags
    });

    // 找到对应的分类区域
    const sections = document.querySelectorAll('.section');
    const targetSection = Array.from(sections).find(s => 
        s.querySelector('h2').textContent === section
    );

    if (targetSection) {
        const grid = targetSection.querySelector('.recommendations-grid');
        grid.appendChild(card);
    }

    // 保存到 localStorage
    saveRecommendation({
        section,
        title,
        subtitle,
        description,
        icon,
        url,
        tags
    });

    hideAddForm();
}

function createRecommendationCard(data) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.innerHTML = `
        <div class="card-header">
            <div class="card-icon">
                <i class="material-icons">${data.icon}</i>
            </div>
            <div class="card-title">
                <h3>${data.title}</h3>
                <small>${data.subtitle}</small>
            </div>
        </div>
        <p class="card-description">${data.description}</p>
        ${data.tags ? `
        <div class="card-tags">
            ${data.tags.split(',').map(tag => 
                `<span class="tag">${tag.trim()}</span>`
            ).join('')}
        </div>
        ` : ''}
        <a href="${data.url}" target="_blank" class="card-link">
            <span>访问网站</span>
            <i class="material-icons">open_in_new</i>
        </a>
    `;
    return card;
}

function saveRecommendation(data) {
    const recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    recommendations.push(data);
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
}

// 页面加载时恢复保存的推荐
window.addEventListener('DOMContentLoaded', () => {
    const recommendations = JSON.parse(localStorage.getItem('recommendations') || '[]');
    recommendations.forEach(data => {
        const card = createRecommendationCard(data);
        const sections = document.querySelectorAll('.section');
        const targetSection = Array.from(sections).find(s => 
            s.querySelector('h2').textContent === data.section
        );
        if (targetSection) {
            const grid = targetSection.querySelector('.recommendations-grid');
            grid.appendChild(card);
        }
    });
}); 