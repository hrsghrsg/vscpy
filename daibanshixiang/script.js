document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');

  // 从localStorage加载待办事项
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  renderTodos();

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
      todos.push(newTodo);
      saveAndRender();
      input.value = '';
    }
  });

  // 处理点击事件（完成/删除）
  list.addEventListener('click', (e) => {
    const todoItem = e.target.closest('.todo-item');
    if (!todoItem) return;

    const id = Number(todoItem.dataset.id);
    const todo = todos.find(t => t.id === id);

    if (e.target.closest('.delete-btn')) {
      const todoElement = e.target.closest('.todo-item');
      todoElement.classList.add('removing');
      
      setTimeout(() => {
        todos = todos.filter(t => t.id !== id);
        saveAndRender();
      }, 300); // 匹配CSS动画时长
    } else {
      todo.completed = !todo.completed;
      saveAndRender();
    }
  });

  function renderTodos() {
    list.innerHTML = todos.map(todo => `
      <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <div class="todo-content">
          <span>${todo.text}</span>
          <div class="todo-time">${todo.createdAt}</div>
        </div>
        <button class="delete-btn" title="删除">
          <i class="material-icons">delete</i>
        </button>
      </li>
    `).join('');
  }

  function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
  }
});
