import { useState, useEffect, useRef } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [timer, setTimer] = useState({
    months: "",
    weeks: "",
    days: "",
    hours: "",
    minutes: ""
  });

  const toMs = (t) => (
    (Number(t.minutes)||0)*60000 +
    (Number(t.hours)||0)*3600000 +
    (Number(t.days)||0)*86400000 +
    (Number(t.weeks)||0)*604800000 +
    (Number(t.months)||0)*2629800000
  );

  // Load from localStorage //sunny
useEffect(() => {
  const saved = localStorage.getItem("todoTasks");
  if (saved) {
    setTasks(JSON.parse(saved));
  }
  setLoaded(true);
}, []);

  // Save tasks to localStorage //sunny
useEffect(() => {
  if (!loaded) return;
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}, [tasks, loaded]);


  
  // Remove expired tasks automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.filter(t => !t.duration || Date.now() - t.created < t.duration));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!input.trim()) return;
    const duration = toMs(timer);
    const newTask = {
      id: Date.now(),
      text: input,
      created: Date.now(),
      duration,
      done: false
    };
    setTasks(prev => [...prev, newTask]);
    setInput("");
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: true } : t));
    setTimeout(() => setTasks(prev => prev.filter(t => t.id !== id)), 400);
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text: editingText } : t));
    setEditingId(null);
  };

  const progressRatio = (task) => Math.min((Date.now() - task.created) / task.duration, 1);

  const getBoxColor = (task) => {
    const ratio = progressRatio(task);
    const r = Math.floor(59 + (239 - 59) * ratio);
    const g = Math.floor(130 + (68 - 130) * ratio);
    const b = Math.floor(246 + (68 - 246) * ratio);
    return `rgb(${r},${g},${b})`;
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
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #1e293b; color: white; }
    #root { max-width: 900px; margin: auto; padding: 2rem; text-align: center; font-family: 'JetBrains Mono', monospace; }
    h1 { margin-bottom: 25px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    .expire-note { font-size: 13px; color: #ccc; margin-bottom: 20px; }
    .add-textarea { width: 60%; padding: 10px; margin-bottom: 15px; background: #0f172a; border: 1px solid #444; color: white; resize: vertical; font-size: 16px; border-radius: 4px; font-family: inherit; }
    .timer-inputs { display: flex; justify-content: center; gap: 6px; margin-bottom: 15px; }
    .timer-inputs input { text-align: center; width: 55px; padding: 6px; background: #0f172a; border: 1px solid #444; color: white; font-family: inherit; }
    button { padding: 7px 12px; border: none; cursor: pointer; font-family: inherit; }
    .primary-btn { background: #3b82f6; color: white; }
    ul { list-style: none; padding: 0; }
    li { padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start; border-left: 5px solid #3b82f6; transition: background 1s; border-radius: 6px; flex-wrap: wrap; }
    .task-left { display: flex; flex-direction: column; align-items: flex-start; width: 80%; }
    .task-text { margin-left: 10px; font-size: 18px; white-space: pre-wrap; word-wrap: break-word; }
    .task-done { margin-left: 10px; text-decoration: line-through; color: #777; white-space: pre-wrap; word-wrap: break-word; }
    .timer-text { font-size: 13px; color: #bbb; margin-top: 6px; }
    .task-buttons { display: flex; gap: 6px; margin-top: 8px; }
    .progress { width: 100%; height: 8px; background: #222; margin-top: 6px; border-radius: 4px; }
    .progress-bar { height: 100%; border-radius: 4px; }
    .edit-textarea { background: #111; color: white; border: 1px solid #555; padding: 5px; width: 100%; resize: vertical; font-size: 16px; border-radius: 4px; font-family: inherit; }
    .btn-blue { background: #3b82f6; color: white; }
    .btn-green { background: #22c55e; color: white; }
    .loading { color: #888; margin-top: 2rem; }
  `;

  if (!loaded) return (
    <>
      <style>{styles}</style>
      <p className="loading">Loading tasks...</p>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <h1>Simple Timer Todo</h1>
      <div className="expire-note">Tasks automatically delete when their timer expires.</div>

      <textarea
        className="add-textarea"
        placeholder="Enter task (multi-line allowed)"
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={3}
      />

      <div className="timer-inputs">
        {[["M","months"],["W","weeks"],["D","days"],["H","hours"],["Min","minutes"]].map(([ph, key]) => (
          <input key={key} type="number" placeholder={ph} value={timer[key]}
            onChange={e => setTimer({ ...timer, [key]: e.target.value })} />
        ))}
      </div>

      <button onClick={addTask} className="primary-btn">Add Task</button>

      <ul>
        {tasks
          .slice()
          .sort((a, b) => (a.created + a.duration) - (b.created + b.duration))
          .map(task => {
            const ratio = progressRatio(task);
            const boxColor = getBoxColor(task);
            return (
              <li key={task.id} style={{ backgroundColor: boxColor }}>
                <div className="task-left">
                  <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
                  {editingId === task.id
                    ? <textarea className="edit-textarea" value={editingText}
                        onChange={e => setEditingText(e.target.value)} rows={3} />
                    : <div className={task.done ? "task-done" : "task-text"}>{task.text}</div>
                  }
                  <div className="timer-text">{timeLeft(task)}</div>
                  <div className="progress">
                    <div className="progress-bar" style={{ width: `${ratio * 100}%`, backgroundColor: boxColor }} />
                  </div>
                </div>
                <div className="task-buttons">
                  {editingId === task.id
                    ? <button onClick={() => saveEdit(task.id)} className="btn-green">Save</button>
                    : <button onClick={() => startEdit(task)} className="btn-blue">Edit</button>
                  }
                </div>
              </li>
            );
          })}
      </ul>
    </>
  );
}
