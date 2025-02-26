import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0fc9f2", // ✅ Matches desktop gradient
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007bff", // ✅ Match desktop theme
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  input: {
    width: 350,
    borderWidth: 1,
    padding: 8,
    marginBottom: 5,
    borderRadius: 20,
    textAlign: "center",
    backgroundColor: "white",
    fontFamily: "Poppins",
    fontSize: 14,
  },
  dateInput: {
    width: 350,
    borderWidth: 1,
    padding: 8,
    borderRadius: 20,
    textAlign: "center",
    backgroundColor: "white",
    fontFamily: "Poppins",
    borderColor: "#007bff",
    fontSize: 14,
    marginBottom: 5,
  },
  addButton: {
    backgroundColor: "#00274d", // ✅ Dark blue like desktop buttons
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    width: 350,
    fontSize: 14,
    marginBottom: 5,
  },
  buttonText: {
    color: "#0fc9f2", // ✅ Match desktop buttons
    fontSize: 14,
    fontFamily: "Poppins",
  },

  // ✅ TASK ITEM STYLING
  taskContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    width: 350,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },

  taskRow: {
    flexDirection: "row", // ✅ Title & Date on same row
    justifyContent: "space-between", // ✅ Pushes title left, date right
    alignItems: "center",
  },

  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    textDecorationLine: "underline",
    flex: 1, // ✅ Allows the title to take up available space
  },

  taskDate: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Poppins",
    textAlign: "right",
  },

  taskDescriptionRow: {
    flexDirection: "row", // ✅ Description & Icons in the same row
    justifyContent: "space-between", // ✅ Pushes description left, icons right
    alignItems: "center",
    marginTop: 4, // ✅ Adds space below the title/date row
  },

  taskDescription: {
    fontSize: 14,
    color: "#444",
    flex: 1, // ✅ Allows description text to take up available space
  },

  iconContainer: {
    flexDirection: "row",
    gap: 15, // ✅ Adds spacing between icons
  },

  overdueTask: {
    backgroundColor: "#ffcccc",
    borderLeftColor: "red",
    borderLeftWidth: 5,
  },
  overdueTitle: {
    color: "darkred",
  },
  overdueDate: {
    color: "red",
  },
});
