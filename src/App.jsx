import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- КОМПОНЕНТ ПРИВЕТСТВИЯ ---
const WelcomeScreen = ({ onStart }) => (
  <div className="welcome-container">
    <div className="welcome-content">
      <div className="logo-icon">🚀</div>
      <h1 className="hero-title">Smart Task Manager</h1>
      <p className="hero-subtitle">
        Умная система управления задачами с автоматическим расчетом приоритетов.
        <br />
        Сосредоточься на важном.
      </p>
      <button className="hero-btn" onClick={onStart}>
        Начать работу
      </button>
      <div className="features-grid">
        <div className="feature-item">⚡️ Авто-приоритет</div>
        <div className="feature-item">📅 Дедлайны</div>
        <div className="feature-item">🛡 Отказоустойчивость</div>
      </div>
    </div>
  </div>
);

const App = () => {
  // Состояние: true = показываем приветствие, false = показываем приложение
  const [showWelcome, setShowWelcome] = useState(true);
  
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
    let coef = 1.0;
    if (daysLeft <= 1) coef = 3.0;
    else if (daysLeft <= 7) coef = 1.5;
    const comp = task.complexity > 0 ? task.complexity : 1;
    return (task.importance * coef) / comp;
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error("Err");
      const data = await res.json();
      setTasks(data);
      setIsDemoMode(false);
    } catch (e) {
      setTasks(mockData.sort((a,b) => b.score - a.score));
      setIsDemoMode(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.deadline) < new Date().setHours(0,0,0,0)) {
      alert("Ошибка: Дедлайн в прошлом!");
      return;
    }
    const newTask = { id: Date.now(), ...formData, importance: Number(formData.importance), complexity: Number(formData.complexity) };
    if (isDemoMode) {
      const score = calculateScore(newTask);
      setTasks([...tasks, { ...newTask, score }].sort((a, b) => b.score - a.score));
    } else {
      try {
        await fetch(`${API_URL}/tasks`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(newTask)});
        fetchTasks();
      } catch (err) {}
    }
    setFormData({ title: '', deadline: '', importance: 5, complexity: 1 });
  };

  // --- ЛОГИКА ОТОБРАЖЕНИЯ ---
  
  // Если состояние "Приветствие" - показываем WelcomeScreen
  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  // Иначе показываем основное приложение
  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Smart Task Manager</h1>
      </div>

      {isDemoMode && (
        <div className="demo-badge">
          <span>⚠️</span>
          <strong>Demo Mode.</strong> Сервер недоступен, работаем локально.
        </div>
      )}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group title-group">
          <label className="form-label">Что нужно сделать?</label>
          <input className="input-field" placeholder="Например: Сверстать лендинг..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        </div>
        <div className="form-group date-group">
          <label className="form-label">Дедлайн</label>
          <input className="input-field" type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} required />
        </div>
        <div className="form-group imp-group">
          <label className="form-label">Важность <span className="importance-val">{formData.importance}/10</span></label>
          <input type="range" min="1" max="10" className="input-range" value={formData.importance} onChange={e => setFormData({...formData, importance: e.target.value})} />
        </div>
        <div className="form-group comp-group">
          <label className="form-label">Сложность (SP)</label>
          <select className="input-field" value={formData.complexity} onChange={e => setFormData({...formData, complexity: e.target.value})}>
            <option value="1">1 SP (Easy)</option>
            <option value="2">2 SP (Normal)</option>
            <option value="3">3 SP (Medium)</option>
            <option value="5">5 SP (Hard)</option>
            <option value="8">8 SP (Epic)</option>
          </select>
        </div>
        <div className="form-group btn-group">
          <label className="form-label" style={{visibility: 'hidden'}}>Add</label>
          <button type="submit" className="btn-add">Добавить</button>
        </div>
      </form>

      <div className="table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th style={{textAlign:'center'}}>Score</th>
              <th>Task</th>
              <th>Deadline</th>
              <th style={{textAlign:'center'}}>Imp</th>
              <th style={{textAlign:'center'}}>SP</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="score-cell" style={{textAlign:'center', color: task.score >= 10 ? '#f87171' : task.score >= 5 ? '#facc15' : '#4ade80'}}>
                  {(task.score || 0).toFixed(2)}
                </td>
                <td>{task.title}</td>
                <td>{task.deadline}</td>
                <td style={{textAlign:'center'}}>{task.importance}</td>
                <td style={{textAlign:'center'}}>{task.complexity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
