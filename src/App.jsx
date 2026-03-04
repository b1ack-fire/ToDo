import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() === "") return;

    setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
    setInput("");
  };

  const toggleTask = (id) => {
  setTasks((prev) =>
    prev.map((task) =>
      task.id === id ? { ...task, done: true } : task
    )
  );

  // remove after fade animation
  setTimeout(() => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, 400); // match animation duration
};

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">Simple Todo List</h1>

      <div className="flex gap-2 mb-6">
        <input
  type="text"
  placeholder="Enter task..."
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      addTask();
    }
  }}
  className="p-2 rounded bg-slate-800"
/>
        <button
          onClick={addTask}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md space-y-3">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            className="bg-slate-800 p-3 rounded flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              />
              <span className={task.done ? "line-through text-gray-400" : ""}>
                {task.text}
              </span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-400 hover:text-red-600"
            >
              Delete
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}