import React, { useState, useEffect } from 'react';
import './App.css';
import { getTasks, createTask } from './services/api';

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
    </div>
  </div>
);

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    importance: 5,
    complexity: 1
  });

  // --- LOAD TASKS FROM BACKEND ---
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Не удалось подключиться к серверу.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // --- CREATE TASK ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(formData.deadline) < today) {
      alert("Ошибка: Дедлайн в прошлом!");
      return;
    }

    try {
      const createdTask = await createTask({
        ...formData,
        importance: Number(formData.importance),
        complexity: Number(formData.complexity),
      });

      setTasks(prev => [createdTask, ...prev]);
      setFormData({
        title: '',
        deadline: '',
        importance: 5,
        complexity: 1
      });

    } catch (err) {
      setError('Ошибка при создании задачи.');
    }
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={() => setShowWelcome(false)} />;
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Smart Task Manager</h1>
      </div>

      {error && (
        <div className="demo-badge" style={{ background: '#7f1d1d' }}>
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label className="form-label">Что нужно сделать?</label>
          <input
            className="input-field"
            placeholder="Например: Сверстать лендинг..."
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Дедлайн</label>
          <input
            type="date"
            className="input-field"
            value={formData.deadline}
            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Важность {formData.importance}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            className="input-range"
            value={formData.importance}
            onChange={e => setFormData({ ...formData, importance: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Сложность (SP)</label>
          <select
            className="input-field"
            value={formData.complexity}
            onChange={e => setFormData({ ...formData, complexity: e.target.value })}
          >
            <option value="1">1 SP</option>
            <option value="2">2 SP</option>
            <option value="3">3 SP</option>
            <option value="5">5 SP</option>
            <option value="8">8 SP</option>
          </select>
        </div>

        <button type="submit" className="btn-add">
          Добавить
        </button>
      </form>

      {isLoading ? (
        <div style={{ marginTop: '20px' }}>Загрузка...</div>
      ) : (
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>Score</th>
                <th>Task</th>
                <th>Deadline</th>
                <th style={{ textAlign: 'center' }}>Imp</th>
                <th style={{ textAlign: 'center' }}>SP</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td
                    className="score-cell"
                    style={{
                      textAlign: 'center',
                      color:
                        task.score >= 10
                          ? '#f87171'
                          : task.score >= 5
                          ? '#facc15'
                          : '#4ade80'
                    }}
                  >
                    {task.score?.toFixed(2)}
                  </td>
                  <td>{task.title}</td>
                  <td>{task.deadline}</td>
                  <td style={{ textAlign: 'center' }}>{task.importance}</td>
                  <td style={{ textAlign: 'center' }}>{task.complexity}</td>
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

