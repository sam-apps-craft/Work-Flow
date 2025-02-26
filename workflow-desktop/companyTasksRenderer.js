// companyTasksRenderer.js
async function loadCompanyTasks(title) {
  const taskList = document.getElementById("companyTaskList");
  taskList.innerHTML = "<p>Loading tasks...</p>";
  try {
    const tasks = await window.electronAPI.getTasksByTitle(title);
    taskList.innerHTML = "";
    if (!tasks || tasks.length === 0) {
      taskList.innerHTML = `<p>No tasks found for: ${title}.</p>`;
      return;
    }
    // Sort tasks by due date
    tasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    tasks.forEach((task) => {
      const repeatIcon = task.repeat_days ? " 🔄 " : "";
      const isOverdue = new Date(task.due_date) < new Date() ? "overdue" : "";
      const taskRow = document.createElement("div");
      taskRow.classList.add("task-row");
      if (isOverdue) taskRow.classList.add("overdue");
      taskRow.innerHTML = `
        <span class="task-text">${task.description}</span>
        <span class="task-date">${new Date(
          task.due_date
        ).toLocaleDateString()}</span>
        <span class="repeat-icon">${repeatIcon}</span>
        <div class="task-buttons">
          <button class="doneButton" onclick="completeTask('${
            task.id
          }', '${title}')">✔️</button>
          <button class="deleteButton" onclick="deleteTask('${
            task.id
          }', '${title}')">🗑️</button>
        </div>
      `;
      taskList.appendChild(taskRow);
    });
  } catch (error) {
    console.error(`Error loading tasks for ${title}:`, error);
    taskList.innerHTML = "<p>Failed to load tasks.</p>";
  }
}

async function saveNewTask(title) {
  const description = document.getElementById("taskDescription").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const repeatDays = document.getElementById("repeatDays").value || null;

  if (!description || !dueDate) {
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
    loadCompanyTasks(title);
    // Clear input fields
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = new Date()
      .toISOString()
      .split("T")[0];
    document.getElementById("repeatDays").value = "";
    // Refresh main console as well
    window.electronAPI.refreshMainConsole();
  } catch (error) {
    console.error("Error saving task:", error);
    alert("Error saving task.");
  }
}

async function completeTask(taskId, title) {
  await window.electronAPI.completeTask(taskId);
  loadCompanyTasks(title);
}

async function deleteTask(taskId, title) {
  await window.electronAPI.deleteTask(taskId);
  loadCompanyTasks(title);
}

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get("title");
  if (!title || title.trim() === "") {
    alert("Error: No company title provided!");
    window.close();
    return;
  }
  document.getElementById("companyTitle").textContent = `Tasks for: ${title}`;
  document.getElementById("taskDueDate").value = new Date()
    .toISOString()
    .split("T")[0];
  await loadCompanyTasks(title);

  document.getElementById("saveButton").addEventListener("click", async () => {
    await saveNewTask(title);
  });

  document.getElementById("closeButton").addEventListener("click", () => {
    // Refresh main console before closing
    window.electronAPI.refreshMainConsole();
    window.close();
  });
});
