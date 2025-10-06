class Task {
  constructor(id, title, deadline) {
    this.id = id;
    this.title = title;
    this.deadline = new Date(deadline);
    this.notified = false;
  }
}

let tasks = [];
let editTaskId = null;

const taskTitleInput = document.getElementById('taskTitle');
const taskDeadlineInput = document.getElementById('taskDeadline');
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const taskList = document.getElementById('taskList');
const toast = document.getElementById('toast');

addBtn.addEventListener('click', addTask);
updateBtn.addEventListener('click', updateTask);
cancelBtn.addEventListener('click', cancelEdit);

function addTask() {
  const title = taskTitleInput.value.trim();
  const deadline = taskDeadlineInput.value;

  if (!title) {
    showToast('Please enter a task title.');
    return;
  }
  if (!deadline) {
    showToast('Please select a deadline.');
    return;
  }

  const deadlineDate = new Date(deadline);
  if (deadlineDate <= new Date()) {
    showToast('Deadline must be in the future.');
    return;
  }

  const id = Date.now();
  const newTask = new Task(id, title, deadlineDate);
  tasks.push(newTask);

  clearInputs();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = 'task-card';

    const info = document.createElement('div');
    info.className = 'task-info';

    const titleEl = document.createElement('div');
    titleEl.className = 'task-title';
    titleEl.textContent = task.title;

    const deadlineEl = document.createElement('div');
    deadlineEl.className = 'task-deadline';
    deadlineEl.textContent = task.deadline.toLocaleString();

    info.appendChild(titleEl);
    info.appendChild(deadlineEl);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => startEditTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(info);
    card.appendChild(actions);

    taskList.appendChild(card);
  });
}

function clearInputs() {
  taskTitleInput.value = '';
  taskDeadlineInput.value = '';
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  if (editTaskId === id) cancelEdit();
  renderTasks();
}

function startEditTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  editTaskId = id;
  taskTitleInput.value = task.title;
  taskDeadlineInput.value = task.deadline.toISOString().slice(0, 16);

  addBtn.style.display = 'none';
  updateBtn.style.display = 'inline-block';
  cancelBtn.style.display = 'inline-block';
}

function cancelEdit() {
  editTaskId = null;
  clearInputs();
  addBtn.style.display = 'inline-block';
  updateBtn.style.display = 'none';
  cancelBtn.style.display = 'none';
}

function updateTask() {
  if (!editTaskId) return;

  const title = taskTitleInput.value.trim();
  const deadline = taskDeadlineInput.value;

  if (!title) {
    showToast('Please enter a task title.');
    return;
  }
  if (!deadline) {
    showToast('Please select a deadline.');
    return;
  }

  const deadlineDate = new Date(deadline);
  if (deadlineDate <= new Date()) {
    showToast('Deadline must be in the future.');
    return;
  }

  const task = tasks.find(t => t.id === editTaskId);
  if (task) {
    task.title = title;
    task.deadline = deadlineDate;
    task.notified = false;
  }

  cancelEdit();
  renderTasks();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    if (!task.notified && task.deadline <= now) {
      task.notified = true;
      showToast(`🔔 Reminder: "${task.title}" is due now!`);
    }
  });
}, 1000);

renderTasks();
