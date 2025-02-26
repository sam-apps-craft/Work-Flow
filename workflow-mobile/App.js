import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles"; // ✅ Import styles
import TaskItem from "./TaskItem"; // ✅ Import TaskItem
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase/firebaseConfig"; // ✅ Import Firestore

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ✅ Real-time Firestore Sync
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
      console.log("✅ Live update from Firestore:", tasksList);
    });

    return () => unsubscribe(); // ✅ Cleanup Firestore listener
  }, []);

  // ✅ Add Task
  const addTask = async () => {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        due_date: serverTimestamp(), // ✅ Save as Firestore Timestamp
      });

      Keyboard.dismiss();
      setTitle("");
      setDescription("");
      setDueDate(new Date());
    } catch (error) {
      console.error("❌ Error adding task:", error);
    }
  };

  // ✅ Delete Task
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task List</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.dateInput}
          value={dueDate.toDateString()}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDueDate(selectedDate);
          }}
        />
      )}
      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} deleteTask={deleteTask} />
        )}
      />
    </View>
  );
};

export default App;
