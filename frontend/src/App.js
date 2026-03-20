import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`);
    setTasks(res.data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async () => {
    if (!newTask) return;
    await axios.post(`${API_URL}/tasks`, { title: newTask, completed: false });
    setNewTask('');
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await axios.put(`${API_URL}/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>To-Do List</h1>
      <input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="New task..." />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map(t => (
          <li key={t._id}>
            <span onClick={() => toggleTask(t._id, t.completed)} style={{ textDecoration: t.completed ? 'line-through' : 'none', cursor: 'pointer' }}>
              {t.title}
            </span>
            <button onClick={() => deleteTask(t._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;