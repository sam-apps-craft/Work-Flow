import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./styles"; // ✅ Import styles
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig"; // ✅ Import Firestore
import { FontAwesome } from "@expo/vector-icons"; // ✅ Import Icons

const TaskItem = ({ task, fetchTasks }) => {
  const today = new Date().toISOString().split("T")[0];

  // ✅ Convert Firestore Timestamp to Readable Date
  const formatDate = (date) => {
    if (!date) return "No Date";
    if (date.seconds) {
      return new Date(date.seconds * 1000).toDateString(); // Convert Firestore Timestamp
    }
    return date.toString(); // If already a string, return as-is
  };

  const isOverdue = task.due_date && formatDate(task.due_date) < today;

  // ✅ Delete Task from Firestore
  const deleteTask = async () => {
    try {
      await deleteDoc(doc(db, "tasks", task.id));
      fetchTasks();
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  // ✅ Mark Task as Done
  const markTaskAsDone = async () => {
    try {
      await updateDoc(doc(db, "tasks", task.id), { completed: true });
      fetchTasks();
    } catch (error) {
      console.error("❌ Error marking task as done:", error);
    }
  };

  return (
    <View style={[styles.taskContainer, isOverdue && styles.overdueTask]}>
      {/* ✅ Title and Due Date on the Same Row */}
      <View style={styles.taskRow}>
        <Text style={[styles.taskTitle, isOverdue && styles.overdueTitle]}>
          {task.title}
        </Text>
        <Text style={[styles.taskDate, isOverdue && styles.overdueDate]}>
          {formatDate(task.due_date)}
        </Text>
      </View>

      {/* ✅ Task Description on Second Row */}
      <View style={styles.taskDescriptionRow}>
        <Text style={styles.taskDescription}>{task.description}</Text>

        {/* ✅ Action Icons */}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={markTaskAsDone}>
            <FontAwesome name="check-circle" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteTask}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TaskItem;
