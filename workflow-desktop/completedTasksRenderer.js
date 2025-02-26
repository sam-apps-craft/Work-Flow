// completedTasksRenderer.js - Handles Completed Tasks Pop-up

window.addEventListener("DOMContentLoaded", () => {
  loadCompletedTasks();
  attachEventListeners();
});

async function loadCompletedTasks() {
  const completedTaskList = document.getElementById("completedTaskList");
  completedTaskList.innerHTML = "<p>Loading completed tasks...</p>";

  try {
    const completedTasks = await window.electronAPI.getCompletedTasks();
    completedTaskList.innerHTML = "";

    if (!completedTasks || completedTasks.length === 0) {
      completedTaskList.innerHTML = "<p>No completed tasks available.</p>";
      return;
    }

    completedTasks.forEach((task) => {
      const taskRow = document.createElement("div");
      taskRow.classList.add("task-row");
      taskRow.innerHTML = `
        <span class="task-title">${task.title}</span>
        <span class="task-text">${task.description || "No Description"}</span>
        <span class="task-date">${new Date(
          task.date_completed
        ).toLocaleDateString()}</span>
        <span class="repeat-icon"></span>
        <div class="task-buttons">
          <button class="deleteButton" onclick="deleteCompletedTask('${
            task.id
          }')">🗑️</button>
        </div>
      `;
      completedTaskList.appendChild(taskRow);
    });
  } catch (error) {
    completedTaskList.innerHTML = "<p>⚠️ Failed to load completed tasks.</p>";
  }
}

async function deleteCompletedTask(taskId) {
  await window.electronAPI.deleteCompletedTask(taskId);
  loadCompletedTasks();
}

function attachEventListeners() {
  document.getElementById("closeButton").addEventListener("click", () => {
    window.close();
  });
}

async function saveNewTask() {
  let titleElement = document.getElementById("companyTitle").textContent;
  let title = titleElement.replace("Tasks for: ", "").trim();
  const description = document.getElementById("taskDescription").value.trim();
  const dueDate = document.getElementById("taskDueDate").value;
  const repeatDays = document.getElementById("repeatDays")
    ? document.getElementById("repeatDays").value
    : null;

  if (!description || !dueDate) {
    alert("Please fill in all fields before saving.");
    return;
  }

  try {
    await window.electronAPI.addTask({
      title,
      description,
      due_date: dueDate,
      repeat_days: repeatDays || null,
    });
    loadCompanyTasks(title);
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskDueDate").value = "";
    if (document.getElementById("repeatDays")) {
      document.getElementById("repeatDays").value = "";
    }
    if (window.opener) {
      window.opener.electronAPI.refreshTasks();
    }
  } catch (error) {
    alert("Error saving task. Please check console for details.");
  }
}
