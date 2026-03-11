import React, { useState, useEffect, useRef } from "react";

export default function SimpleToDo({ selectedDate: calendarDate, setSelectedDate }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  // Default time to current time
  const [timeInput, setTimeInput] = useState(() => 
    new Date().toTimeString().slice(0, 5)
  );
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Load tasks
  useEffect(() => {
    const saved = localStorage.getItem("simpleTasks");
    if (saved) setTasks(JSON.parse(saved));
    setLoaded(true);
  }, []);

  // Save tasks
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("simpleTasks", JSON.stringify(tasks));
  }, [tasks, loaded]);

  // Remove expired/done tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.filter((t) => !t.done && Date.now() < t.deadline)
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Click outside to reset calendar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (setSelectedDate) setSelectedDate(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setSelectedDate]);

  // Sync Time Input: If user picks a date, default time to current time (or keep existing)
  useEffect(() => {
    if (calendarDate) {
      // Optional: You could reset time to current time here every time date changes,
      // or leave it so user can refine the time.
      // Currently we leave it to allow user precision.
    }
  }, [calendarDate]);

  const addTask = () => {
    if (!input.trim()) return;

    const now = new Date();
    let deadline = new Date();

    // 1. Set the DATE part
    if (calendarDate) {
      // Use the selected calendar date
      deadline.setFullYear(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate()
      );
    } else {
      // Default to today if no calendar date selected
      deadline.setFullYear(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // 2. Set the TIME part
    const [hourStr, minStr] = timeInput.split(":");
    deadline.setHours(parseInt(hourStr), parseInt(minStr), 0, 0);

    // 3. Create the task
    // Logic: Timer counts from NOW (startTime) to SELECTED DATE/TIME (deadline)
    const newTask = {
      id: Date.now(),
      text: input,
      startTime: now.getTime(), // The start of the timer
      deadline: deadline.getTime(), // The end of the timer
      done: false,
      displayDate: deadline.toLocaleString(),
    };

    setTasks((prev) => [...prev, newTask].sort((a, b) => a.deadline - b.deadline));

    setInput("");
    // Reset calendar selection after adding
    if (setSelectedDate) setSelectedDate(null);
  };

  const toggleTask = (id) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const timeLeft = (task) => {
    const remaining = task.deadline - Date.now();
    if (remaining <= 0) return "Expired";
    
    const d = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const h = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((remaining % (1000 * 60)) / 1000);
    
    if (d > 0) return `${d}d ${h}h ${m}m ${s}s`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const progressRatio = (task) => {
    const totalDuration = task.deadline - task.startTime;
    if (totalDuration <= 0) return 1; // Prevent division by zero
    const timePassed = Date.now() - task.startTime;
    // Calculate percentage (clamped between 0 and 1)
    return Math.max(0, Math.min(timePassed / totalDuration, 1));
  };

  const getProgressColor = (task) => {
    const ratio = progressRatio(task);
    if (ratio < 0.5) return `rgb(34, 197, 94)`;  // Green
    if (ratio < 0.8) return `rgb(234, 179, 8)`;  // Yellow
    return `rgb(239, 68, 68)`;                   // Red
  };

  const styles = `
    * { box-sizing:border-box; font-family: 'JetBrains Mono', monospace; }
    .add-textarea { width:60%; padding:10px; margin-bottom:10px; background:#0f172a; border:1px solid #444; color:white; resize:vertical; font-size:16px; border-radius:4px; }
    .time-input { margin-bottom:15px; padding:6px; background:#0f172a; border:1px solid #444; color:white; border-radius:4px; font-size:16px; }
    button { padding:7px 12px; border:none; cursor:pointer; font-family:inherit; }
    .primary-btn { background:#3b82f6; color:white; border-radius:4px; }
    ul { list-style:none; padding:0; }
    li { position:relative; margin-bottom:12px; display:flex; align-items:center; border-left:5px solid #3b82f6; border-radius:6px; background:#111; overflow:hidden; }
    .done-circle { width:20px; height:20px; border-radius:50%; border:2px solid #3b82f6; margin:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:2; background:#111; }
    .done-circle.done { background:#3b82f6; }
    .task-left { flex:1; display:flex; flex-direction:column; z-index:2; padding-right:10px; }
    .task-text { font-size:18px; color:white; }
    .task-done { font-size:18px; text-decoration:line-through; color:#777; }
    .timer-text { font-size:13px; color:#bbb; margin-top:4px; }
    .display-date { font-size:12px; color:#888; margin-top:2px; }
    .progress { position:absolute; top:0; left:0; width:100%; height:100%; background:#1e293b; z-index:1; }
    .progress-bar { height:100%; transition: width 0.5s linear; }
  `;

  if (!loaded) return null;

  return (
    <div ref={containerRef}>
      <style>{styles}</style>

      <textarea
        className="add-textarea"
        placeholder="Enter task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
      />

      <input
        className="time-input"
        type="time"
        value={timeInput}
        onChange={(e) => setTimeInput(e.target.value)}
      />

      <button onClick={addTask} className="primary-btn mb-4">
        Add Task
      </button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <div
              className={`done-circle ${task.done ? "done" : ""}`}
              onClick={() => toggleTask(task.id)}
            />
            <div className="task-left">
              <div className={task.done ? "task-done" : "task-text"}>{task.text}</div>
              <div className="timer-text">{timeLeft(task)}</div>
              <div className="display-date">Due: {task.displayDate}</div>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${progressRatio(task) * 100}%`,
                  background: getProgressColor(task),
                  opacity: 0.3
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}