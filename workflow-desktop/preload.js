const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openTaskWindow: () => ipcRenderer.send("open-task-window"),
  openCompletedTasksWindow: () =>
    ipcRenderer.send("open-completed-tasks-window"),
  openCompanyWindow: (title) => ipcRenderer.send("open-company-window", title),

  getTasks: async () => {
    try {
      const tasks = await ipcRenderer.invoke("get-tasks");
      return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
      return [];
    }
  },

  getTasksByTitle: async (title) => {
    try {
      return await ipcRenderer.invoke("get-tasks-by-title", title);
    } catch (error) {
      return [];
    }
  },

  addTask: (taskData) => ipcRenderer.invoke("add-task", taskData),
  completeTask: (taskId) => ipcRenderer.invoke("complete-task", taskId),
  deleteTask: (taskId) => ipcRenderer.invoke("delete-task", taskId),
  getCompletedTasks: () => ipcRenderer.invoke("get-completed-tasks"),
  deleteCompletedTask: (taskId) =>
    ipcRenderer.invoke("delete-completed-task", taskId),
  refreshTasks: (callback) => {
    ipcRenderer.on("reload-tasks", (_, tasks) => {
      callback(tasks);
    });
  },
  refreshMainConsole: () => ipcRenderer.send("refresh-tasks"),
});
