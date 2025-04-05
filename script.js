const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDate = document.getElementById('dueDate');
const priority = document.getElementById('priority');
const taskList = document.getElementById('taskList');
const taskChart = document.getElementById('taskChart');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newTask = {
    id: Date.now(),
    text: taskInput.value,
    due: dueDate.value,
    priority: priority.value,
    completed: false,
    dateCompleted: null,
  };
  tasks.push(newTask);
  updateTasks();
  taskForm.reset();
});

function updateTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  renderChart();
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const div = document.createElement('div');
    div.className = 'task' + (task.completed ? ' done' : '');
    div.innerHTML = `
      <div>
        <strong>${task.text}</strong> - ${task.priority.toUpperCase()}
        <small>${task.due || ''}</small>
      </div>
      <div>
        <button onclick="toggleTask(${task.id})">${task.completed ? 'Undo' : 'Done'}</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(div);
  });
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
      task.dateCompleted = task.completed ? new Date().toISOString().split('T')[0] : null;
    }
    return task;
  });
  updateTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  updateTasks();
}

function renderChart() {
  const completed = tasks.filter(t => t.completed && t.dateCompleted);
  const countByDate = {};
  completed.forEach(t => {
    countByDate[t.dateCompleted] = (countByDate[t.dateCompleted] || 0) + 1;
  });

  const labels = Object.keys(countByDate);
  const data = Object.values(countByDate);

  new Chart(taskChart, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Tasks Completed',
        data,
        backgroundColor: '#28a745'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      }
    }
  });
}

renderTasks();
renderChart();
