document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const totalTasks = document.getElementById('total-tasks');
  const completedTasks = document.getElementById('completed-tasks');
  const filters = document.querySelector('.filters');

  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  let currentFilter = 'all';

  // 更新统计信息
  function updateStats() {
    totalTasks.textContent = todos.length;
    completedTasks.textContent = todos.filter(todo => todo.completed).length;
  }

  // 渲染待办事项
  function renderTodos() {
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    list.innerHTML = filteredTodos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <div class="todo-checkbox"></div>
        <div class="todo-content">
          <p class="todo-text">${todo.text}</p>
          <div class="todo-time">${todo.createdAt}</div>
        </div>
        <button class="delete-btn" title="删除">
          <i class="material-icons">delete</i>
        </button>
      </li>
    `).join('');

    emptyState.style.display = filteredTodos.length ? 'none' : 'block';
    updateStats();
  }

  // 保存并渲染
  function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }

  // 添加新任务
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      const newTodo = {
        id: Date.now(),
        text,
        completed: false,
        createdAt: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      todos.unshift(newTodo); // 新任务添加到顶部
      saveAndRender();
      input.value = '';
    }
  });

  // 处理任务操作
  list.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const id = Number(todoItem.dataset.id);
    const todo = todos.find(t => t.id === id);

    if (e.target.closest('.delete-btn')) {
      todoItem.classList.add('removing');
      setTimeout(() => {
        todos = todos.filter(t => t.id !== id);
        saveAndRender();
      }, 300);
    } else if (e.target.closest('.todo-checkbox')) {
      todo.completed = !todo.completed;
      saveAndRender();
    }
  });

  // 处理过滤器
  filters.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.filter;
    renderTodos();
  });

  // 初始化
  renderTodos();
});
