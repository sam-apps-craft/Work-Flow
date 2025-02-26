const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} = require("firebase/firestore");
const { db } = require("./firebase/firebaseConfig");

let mainWindow, completedTasksWindow, companyWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "views", "index.html"));
}

app.whenReady().then(createMainWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// Open Completed Tasks Window
ipcMain.on("open-completed-tasks-window", () => {
  if (completedTasksWindow) return completedTasksWindow.focus();
  completedTasksWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  completedTasksWindow.loadFile(
    path.join(__dirname, "views", "completedtasks.html")
  );
  completedTasksWindow.on("closed", () => (completedTasksWindow = null));
});

// Open Company Tasks Window
ipcMain.on("open-company-window", (_, title) => {
  if (!title || title.trim() === "") {
    return;
  }
  companyWindow = new BrowserWindow({
    width: 1000,
    height: 1000,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });
  companyWindow.loadURL(
    `file://${path.join(
      __dirname,
      "views",
      "companytasks.html"
    )}?title=${encodeURIComponent(title)}`
  );
  companyWindow.on("closed", () => (companyWindow = null));
});

// -----------------------------
// IPC Handlers using Firebase
// -----------------------------

ipcMain.handle("get-tasks", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    let tasks = [];
    querySnapshot.forEach((docSnap) => {
      let taskData = docSnap.data();
      taskData.id = docSnap.id;
      tasks.push(taskData);
    });
    return tasks;
  } catch (error) {
    return [];
  }
});

ipcMain.handle("get-tasks-by-title", async (_, title) => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    let tasks = [];
    querySnapshot.forEach((docSnap) => {
      let taskData = docSnap.data();
      if (taskData.title === title) {
        taskData.id = docSnap.id;
        tasks.push(taskData);
      }
    });
    return tasks;
  } catch (error) {
    return [];
  }
});

ipcMain.handle("add-task", async (_, taskData) => {
  try {
    const docRef = await addDoc(collection(db, "tasks"), taskData);
    refreshMainTasks();
    return docRef.id;
  } catch (error) {
    return null;
  }
});

ipcMain.handle("complete-task", async (_, taskId) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);
    if (!taskSnap.exists()) {
      return false;
    }
    const task = taskSnap.data();
    await addDoc(collection(db, "completed_tasks"), {
      ...task,
      date_completed: new Date().toISOString(),
    });
    if (task.repeat_days) {
      let nextDueDate = new Date(task.due_date);
      nextDueDate.setDate(
        nextDueDate.getDate() + parseInt(task.repeat_days, 10)
      );
      const newTask = {
        title: task.title,
        description: task.description,
        due_date: nextDueDate.toISOString().split("T")[0],
        repeat_days: task.repeat_days,
      };
      await addDoc(collection(db, "tasks"), newTask);
    }
    await deleteDoc(taskRef);
    refreshMainTasks();
    return true;
  } catch (error) {
    return false;
  }
});

ipcMain.handle("delete-task", async (_, taskId) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
    refreshMainTasks();
    return true;
  } catch (error) {
    return false;
  }
});

ipcMain.handle("get-completed-tasks", async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "completed_tasks"));
    let tasks = [];
    querySnapshot.forEach((docSnap) => {
      let taskData = docSnap.data();
      taskData.id = docSnap.id;
      tasks.push(taskData);
    });
    return tasks;
  } catch (error) {
    return [];
  }
});

ipcMain.handle("delete-completed-task", async (_, taskId) => {
  try {
    await deleteDoc(doc(db, "completed_tasks", taskId));
    return true;
  } catch (error) {
    return false;
  }
});

function refreshMainTasks() {
  getDocs(collection(db, "tasks"))
    .then((querySnapshot) => {
      const tasks = [];
      querySnapshot.forEach((docSnap) => {
        let taskData = docSnap.data();
        taskData.id = docSnap.id;
        tasks.push(taskData);
      });
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("reload-tasks", tasks);
      }
    })
    .catch((error) => {
      // Error handling omitted
    });
}

ipcMain.on("refresh-tasks", () => {
  refreshMainTasks();
});
