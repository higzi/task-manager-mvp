/* App.jsx */
import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    importance: 5,
    complexity: 1
  });

  const mockData = [
    { id: 1, title: "Настроить CI/CD пайплайн", deadline: "2026-02-10", importance: 10, complexity: 5, score: 9.5 },
    { id: 2, title: "Презентация MVP проекта", deadline: "2026-02-06", importance: 9, complexity: 2, score: 12.0 },
    { id: 3, title: "Рефакторинг форм", deadline: "2026-02-08", importance: 7, complexity: 3, score: 8.4 },
  ];

  const calculateScore = (task) => {
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = deadlineDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let urgencyCoef = 1.0;
    if (daysLeft <= 1) urgencyCoef = 3.0;
    else if (daysLeft <= 7) urgencyCoef = 1.5;

    const safeComplexity = task.complexity > 0 ? task.complexity : 1;
    return (task.importance * urgencyCoef) / safeComplexity;
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      setTasks(data);
      setIsDemoMode(false);
    } catch (e) {
      console.warn("Backend unavailable, using mocks");
      setTasks(mockData.sort((a,b) => b.score - a.score));
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.deadline);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (selectedDate < today) {
      alert("Ошибка: Дедлайн не может быть в прошлом!");
      return;
    }

    const newTaskBase = {
      id: Date.now(),
      ...formData,
      importance: Number(formData.importance),
      complexity: Number(formData.complexity)
    };

    if (isDemoMode) {
      const score = calculateScore(newTaskBase);
      const newTaskWithScore = { ...newTaskBase, score };
      const updatedTasks = [...tasks, newTaskWithScore].sort((a, b) => b.score - a.score);
      setTasks(updatedTasks);
    } else {
      try {
        await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTaskBase)
        });
        fetchTasks();
      } catch (err) {
        alert("Ошибка отправки");
      }
    }
    setFormData({ title: '', deadline: '', importance: 5, complexity: 1 });
  };

  const getScoreClass = (score) => {
    if (score >= 10) return 'score-high';
    if (score >= 5) return 'score-med';
    return 'score-low';
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Smart Task Manager</h1>
      </div>

      {isDemoMode && (
        <div className="demo-badge">
          <span className="demo-icon">⚠️</span>
          <div>
            <strong>Demo Mode Active.</strong> Бэкенд недоступен, работаем автономно.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="task-form">
        <input 
          className="input-field"
          placeholder="Название задачи" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})} 
          required 
        />
        <input 
          className="input-field"
          type="date" 
          value={formData.deadline} 
          onChange={e => setFormData({...formData, deadline: e.target.value})} 
          required 
        />
        <input 
          className="input-field"
          type="number" min="1" max="10" placeholder="Imp (1-10)" 
          title="Важность (1-10)"
          value={formData.importance} 
          onChange={e => setFormData({...formData, importance: e.target.value})} 
        />
        <input 
          className="input-field"
          type="number" min="1" placeholder="SP" 
          title="Story Points"
          value={formData.complexity} 
          onChange={e => setFormData({...formData, complexity: e.target.value})} 
        />
        <button type="submit" className="btn-add">Add Task</button>
      </form>

      {isLoading ? (
        <p style={{textAlign: 'center', color: '#666'}}>Загрузка данных...</p>
      ) : (
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th style={{textAlign: 'center'}}>Score</th>
                <th>Task</th>
                <th>Deadline</th>
                <th style={{textAlign: 'center'}}>Imp</th>
                <th style={{textAlign: 'center'}}>SP</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td className="score-cell" style={{textAlign: 'center'}}>
                    <span className={getScoreClass(task.score)}>
                      {(task.score || 0).toFixed(2)}
                    </span>
                  </td>
                  <td>{task.title}</td>
                  <td>{task.deadline}</td>
                  <td style={{textAlign: 'center'}}>{task.importance}</td>
                  <td style={{textAlign: 'center'}}>{task.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
