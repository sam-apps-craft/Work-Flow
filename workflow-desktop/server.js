const express = require("express");
const cors = require("cors");
const {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} = require("firebase/firestore");
const { db } = require("./firebase/firebaseConfig"); // ✅ Firestore Import

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ✅ Root Route (Fix for "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ Workflow API is running!");
});

// ✅ Fetch All Tasks from Firestore
app.get("/tasks", async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(tasks);
    console.log("📥 Fetched tasks from Firestore:", tasks);
  } catch (error) {
    console.error("❌ Error fetching tasks from Firestore:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add Task to Firestore
app.post("/tasks", async (req, res) => {
  const { title, description, due_date } = req.body;

  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      title,
      description,
      due_date,
      completed: false, // ✅ Ensure new tasks start as not completed
    });
    res.json({ id: docRef.id, message: "✅ Task added successfully" });
    console.log(`📝 New Task Added: ${title}`);
  } catch (error) {
    console.error("❌ Error adding task:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Mark Task as Done in Firestore
app.post("/tasks/:id/complete", async (req, res) => {
  const { id } = req.params;

  try {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, { completed: true });
    res.json({ success: true, message: "✅ Task marked as completed" });
    console.log(`✔️ Task Completed: ${id}`);
  } catch (error) {
    console.error("❌ Error marking task as completed:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Delete Task from Firestore
app.delete("/tasks/:id", async (req, res) => {
  try {
    await deleteDoc(doc(db, "tasks", req.params.id));
    res.json({ success: true, message: "🗑️ Task deleted" });
    console.log(`🗑️ Task Deleted: ${req.params.id}`);
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
