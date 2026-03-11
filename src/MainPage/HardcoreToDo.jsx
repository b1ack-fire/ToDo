import React, { useState, useEffect } from "react";

export default function HardcoreToDo({ selectedDate, setSelectedDate }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [timer, setTimer] = useState({
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
  });

  const toMs = (t) =>
    (Number(t.minutes) || 0) * 60000 +
    (Number(t.hours) || 0) * 3600000 +
    (Number(t.days) || 0) * 86400000 +
    (Number(t.weeks) || 0) * 604800000 +
    (Number(t.months) || 0) * 2629800000;

  // Load saved tasks
  useEffect(() => {
    const saved = localStorage.getItem("hardcoreTasks");
    if (saved) setTasks(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("hardcoreTasks", JSON.stringify(tasks));
  }, [tasks, loaded]);

  // Remove expired or done
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks((prev) =>
        prev.filter(
          (t) =>
            !t.done && (!t.duration || Date.now() - t.created < t.duration),
        ),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update timer automatically when calendar date changes
  useEffect(() => {
    if (!selectedDate) return;

    const now = new Date();
    const deadline = new Date(selectedDate);
    deadline.setHours(23, 59, 59, 999);
    const diff = deadline - now;
    if (diff <= 0) return;

    const days = Math.floor(diff / 86400000);
    let remaining = diff - days * 86400000;
    const hours = Math.floor(remaining / 3600000);
    remaining -= hours * 3600000;
    const minutes = Math.floor(remaining / 60000);

    setTimer({ months: 0, weeks: 0, days, hours, minutes });
  }, [selectedDate]);

  const addTask = () => {
    if (!input.trim()) return;
    const now = Date.now();
    let duration = toMs(timer);

    if (selectedDate) {
      const deadline = new Date(selectedDate);
      duration = deadline.getTime() - now;
      setSelectedDate(null); // reset selected date
    }

    const newTask = {
      id: Date.now(),
      text: input,
      created: now,
      duration,
      done: false,
    };

    setTasks((prev) =>
      [...prev, newTask].sort(
        (a, b) => a.created + a.duration - (b.created + b.duration),
      ),
    );
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const progressRatio = (task) =>
    Math.min((Date.now() - task.created) / task.duration, 1);

  const getProgressColor = (task) => {
    const ratio = progressRatio(task);
    if (ratio < 0.5) return "#3cb371"; // green
    if (ratio < 0.8) return "#ffeb3b"; // yellow
    return "#ff3d00"; // red
  };

  const timeLeft = (task) => {
    const remaining = task.duration - (Date.now() - task.created);
    if (remaining <= 0) return "Expired";
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const styles = `
    * { box-sizing:border-box; font-family: 'JetBrains Mono', monospace; }
    .add-textarea { width:60%; padding:10px; margin-bottom:15px; background:#0f172a; border:1px solid #444; color:white; resize:vertical; font-size:16px; border-radius:4px; }
    .timer-inputs { display:flex; justify-content:center; gap:6px; margin-bottom:15px; }
    .timer-inputs input { text-align:center; width:55px; padding:6px; background:#0f172a; border:1px solid #444; color:white; }
    button { padding:7px 12px; border:none; cursor:pointer; font-family:inherit; }
    .primary-btn { background:#3b82f6; color:white; border-radius:4px; }
    ul { list-style:none; padding:0; }
    li { position:relative; margin-bottom:12px; display:flex; align-items:center; border-left:5px solid #3b82f6; border-radius:6px; background:#111; overflow:hidden; }
    .done-circle { width:20px; height:20px; border-radius:50%; border:2px solid #3b82f6; margin:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:2; }
    .done-circle.done { background:#3b82f6; }
    .task-left { flex:1; display:flex; flex-direction:column; z-index:2; }
    .task-text { font-size:18px; color:white; }
    .task-done { font-size:18px; text-decoration:line-through; color:#777; }
    .timer-text { font-size:13px; color:#bbb; margin-top:4px; }
    .progress { position:absolute; top:0; left:0; width:100%; height:100%; background:#222; border-radius:6px; z-index:1; }
    .progress-bar { height:100%; transition: width 0.5s linear, background 0.5s linear; }
    .edit-textarea { background:#111; color:white; border:1px solid #555; padding:5px; width:100%; resize:vertical; border-radius:4px; font-size:16px; }
  `;

  if (!loaded) return <p>Loading...</p>;

  return (
    <>
      <style>{styles}</style>
      <textarea
        className="add-textarea"
        placeholder="Enter task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        {["months", "weeks", "days", "hours", "minutes"].map((key) => (
          <div
            key={key}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                marginBottom: "4px",
                fontSize: "14px",
                color: "#ccc",
                textTransform: "capitalize",
              }}
            >
              {key}
            </div>
            <input
              type="number"
              placeholder={key[0].toUpperCase()}
              value={timer[key]}
              onChange={(e) => setTimer({ ...timer, [key]: e.target.value })}
              style={{
                textAlign: "center",
                width: "50px",
                padding: "6px",
                borderRadius: "4px",
                background: "#0f172a",
                border: "1px solid #444",
                color: "white",
              }}
            />
          </div>
        ))}
      </div>
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
              {editingId === task.id ? (
                <textarea
                  className="edit-textarea"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows={3}
                />
              ) : (
                <div className={task.done ? "task-done" : "task-text"}>
                  {task.text}
                </div>
              )}
              <div className="timer-text">{timeLeft(task)}</div>
            </div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${progressRatio(task) * 100}%`,
                  background: getProgressColor(task),
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
