import axios from "axios";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners"; // Import the spinner from react-spinners
import { FaPen } from "react-icons/fa"; // Pencil icon for edit
import TextareaAutosize from "react-textarea-autosize"; // Import the library

const API_BASE_URL =
  (process.env.REACT_APP_API_BASE_URL || "http://localhost:5454")  + "/api"; // Fallback URL if env variable is not set

export const Home = () => {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track which todo is being edited
  const [newTitle, setNewTitle] = useState(""); // Store the new title while editing

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setErrorMessage("Failed to load todos. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async () => {
    if (!title.trim()) {
      setErrorMessage("Title cannot be empty.");
      return;
    }

    const todo = { title, completed: false };
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/todos`, todo);
      setTodos([...todos, response.data]);
      setTitle(""); // Clear the input field
      setSuccessMessage("Todo added successfully!");
      setErrorMessage(""); // Clear any previous error
    } catch (error) {
      console.error("Error creating todo:", error);
      setErrorMessage("Failed to create todo. Please try again.");
      setSuccessMessage(""); // Clear success message if an error occurs
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (editingId !== null) {
        updateTodo(editingId); // Save the edited todo if in edit mode
      } else {
        createTodo(); // Automatically add todo when Enter is pressed
      }
    }
  };
  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
      setSuccessMessage("Todo deleted successfully!");
      setErrorMessage(""); // Clear any previous error
    } catch (error) {
      console.error("Error deleting todo:", error);
      setErrorMessage("Failed to delete todo. Please try again.");
      setSuccessMessage(""); // Clear success message if an error occurs
    } finally {
      setLoading(false);
    }
  };

  const toggleTodoStatus = async (id) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/todos/${id}/toggle-status`
      );
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setSuccessMessage("Todo status updated successfully!");
      setErrorMessage(""); // Clear any previous error
    } catch (error) {
      console.error("Error toggling todo status:", error);
      setErrorMessage("Failed to update todo status. Please try again.");
      setSuccessMessage(""); // Clear success message if an error occurs
    } finally {
      setLoading(false);
    }
  };

  const handleEditTodo = (id, currentTitle) => {
    setEditingId(id); // Set the todo being edited
    setNewTitle(currentTitle); // Pre-fill the title
  };

  const updateTodo = async (id) => {
    if (!newTitle.trim()) {
      setErrorMessage("Title cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const updatedTodo = { title: newTitle };
      const response = await axios.put(
        `${API_BASE_URL}/todos/${id}`,
        updatedTodo
      );
      setTodos(todos.map((todo) => (todo.id === id ? response.data : todo)));
      setEditingId(null); // Close the edit mode
      setNewTitle(""); // Clear the new title input
      setSuccessMessage("Todo updated successfully!");
      setErrorMessage(""); // Clear any previous error
    } catch (error) {
      console.error("Error updating todo:", error);
      setErrorMessage("Failed to update todo. Please try again.");
      setSuccessMessage(""); // Clear success message if an error occurs
    } finally {
      setLoading(false);
    }
  };

  const filteredTodos = todos.filter(
    (todo) => todo.completed === showCompleted
  );

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [errorMessage, successMessage]);

  return (
    <div className="w-[50vw] h-[80vh] bg-white rounded-xl">
      <div className="bg-[#758AA2] p-5 flex gap-5 justify-between items-center rounded-t-xl">
        <input
          className="p-2 rounded-md w-full outline-none px-5 text-black"
          placeholder="Add New Task"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyPress} // Use onKeyDown instead of onKeyPress
        />
        <button
          onClick={createTodo}
          className="py-2 px-5 rounded-md bg-[#2B2B52] text-white hover:bg-[#4F4F76]"
          disabled={loading}
        >
          {loading ? <div className="spinner" /> : "Add"}
        </button>
      </div>

      {/* Error and Success Messages */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded-md mt-4 mx-5">
          <p>{errorMessage}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded-md mt-4 mx-5">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="flex justify-center p-3">
        <button
          className={`py-2 px-4 rounded-md ${
            !showCompleted ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setShowCompleted(false)}
        >
          Incomplete
        </button>
        <button
          className={`py-2 px-4 rounded-md ml-2 ${
            showCompleted ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setShowCompleted(true)}
        >
          Completed
        </button>
      </div>

      <h1 className="text-black text-center pt-5 font-bold">
        {showCompleted ? "Completed Todos" : "Incomplete Todos"}
      </h1>

      {/* Spinner or Todo List */}
      <div className="p-5 space-y-2 overflow-y-auto h-[60vh]">
        {loading ? (
          <div className="w-full h-32 flex justify-center items-center">
            <SyncLoader size={20} color={"#3498db"} loading={loading} />
          </div>
        ) : (
          filteredTodos.map((item, index) => (
            <div
              key={item.id}
              className="bg-[#99AAAB] p-3 rounded-md flex items-center justify-between"
            >
              <div>
                <p className="text-gray-900 text-sm">
                  {index + 1}. {item.title}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => toggleTodoStatus(item.id)}
                  className={`py-2 px-4 rounded-full focus:outline-none 
    ${
      item.completed
        ? "text-green-600 hover:bg-green-600"
        : "text-yellow-600 hover:bg-yellow-600"
    } 
    hover:text-white p-2`}
                  aria-label="Toggle Status"
                >
                  {item.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button
                  onClick={() => deleteTodo(item.id)}
                  className="text-red-600 hover:text-white focus:outline-none rounded-full hover:bg-red-600 p-2"
                  aria-label="Delete"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEditTodo(item.id, item.title)}
                  className="text-blue-600 hover:text-white focus:outline-none rounded-full hover:bg-blue-600 p-2"
                  aria-label="Edit"
                >
                  <FaPen /> {/* Pencil icon for edit */}
                </button>
              </div>

              {/* Edit Mode */}
              {editingId === item.id && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    className="p-2 rounded-md text-black w-2/3"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={handleKeyPress} // Apply the Enter key logic here
                  />
                  <button
                    onClick={() => updateTodo(item.id)}
                    className="bg-blue-600 text-white p-2 rounded-md"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
