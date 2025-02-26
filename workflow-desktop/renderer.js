async function loadTasks() {
  const taskList = document.getElementById("taskList");
  if (!taskList) {
    return;
  }
  try {
    const tasks = await window.electronAPI.getTasks();
    taskList.innerHTML = "";
    if (!tasks || tasks.length === 0) {
      taskList.innerHTML = "<p>No tasks available.</p>";
      return;
    }
    // Sort tasks by due date (earliest first)
    tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    tasks.forEach((task) => {
      const repeatIcon = task.repeat_days ? " 🔄 " : "";
      const isOverdue = new Date(task.due_date) < new Date() ? "overdue" : "";
      const taskRow = document.createElement("div");
      // Apply the consistent grid layout
      taskRow.classList.add("task-row");
      if (isOverdue) taskRow.classList.add("overdue");
      taskRow.innerHTML = `
        <span class="task-title" onclick="openCompanyTasks('${task.title}')">${
        task.title
      }</span>
        <span class="task-text">${task.description || "No Description"}</span>
        <span class="task-date">${new Date(
          task.due_date
        ).toLocaleDateString()}</span>
        <span class="repeat-icon">${repeatIcon}</span>
        <div class="task-buttons">
          <button class="doneButton" onclick="completeTask('${
            task.id
          }')">✔️</button>
          <button class="deleteButton" onclick="deleteTask('${
            task.id
          }')">🗑️</button>
        </div>
      `;
      taskList.appendChild(taskRow);
    });
  } catch (error) {
    taskList.innerHTML = "<p>Failed to load tasks.</p>";
  }
}

async function deleteTask(taskId) {
  try {
    await window.electronAPI.deleteTask(taskId);
    loadTasks();
  } catch (error) {
    // Error handling omitted
  }
}

async function completeTask(taskId) {
  try {
    await window.electronAPI.completeTask(taskId);
    loadTasks();
  } catch (error) {
    // Error handling omitted
  }
}

function openCompanyTasks(title) {
  if (!title) {
    return;
  }
  window.electronAPI.openCompanyWindow(title);
}

async function saveNewTask() {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const repeatDays = document.getElementById("repeatDays").value || null;

  if (!title || !description || !dueDate) {
    alert("Please fill in all fields before saving.");
    return;
  }

  try {
    await window.electronAPI.addTask({
      title,
      description,
      due_date: dueDate,
      repeat_days: repeatDays,
    });
    loadTasks();
    // Clear inputs
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("repeatDays").value = "";
  } catch (error) {
    alert("Error saving task.");
  }
}

function attachEventListeners() {
  const completedTasksButton = document.getElementById("completedTasksButton");
  if (completedTasksButton) {
    completedTasksButton.addEventListener("click", () => {
      window.electronAPI.openCompletedTasksWindow();
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // Pre-fill the date input with today's date
  document.getElementById("taskDueDate").value = new Date()
    .toISOString()
    .split("T")[0];

  loadTasks();
  attachEventListeners();

  const saveTaskButton = document.getElementById("saveTaskButton");
  if (saveTaskButton) {
    saveTaskButton.addEventListener("click", async () => {
      await saveNewTask();
    });
  }

  // Auto-refresh every 5 seconds
  setInterval(() => {
    loadTasks();
  }, 5000);
});

// Listen for refresh requests from the main process
window.electronAPI.refreshTasks(() => {
  loadTasks();
});
