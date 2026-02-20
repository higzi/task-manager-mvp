import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getTasks, createTask, deleteTask } from '../services/api';
import '../App.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    importance: 5,
    complexity: 1
  });

  const fetchTasksData = async () => {
    setIsLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError('Не удалось загрузить задачи');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.deadline) < new Date().setHours(0,0,0,0)) {
      alert("Ошибка: Дедлайн в прошлом!");
      return;
    }
    
    const newTask = { 
      ...formData, 
      importance: Number(formData.importance), 
      complexity: Number(formData.complexity) 
    };

    try {
      await createTask(newTask);
      fetchTasksData();
      setFormData({ title: '', deadline: '', importance: 5, complexity: 1 });
    } catch (err) {
      alert("Ошибка при создании задачи");
    }
  };

  // Оптимистичное удаление
  const handleDelete = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(task => task.id !== taskId));

    try {
      await deleteTask(taskId);
    } catch (err) {
      setTasks(previousTasks);
      alert("Не удалось удалить задачу на сервере. Попробуйте еще раз.");
    }
  };

  return (
    <div className="app-container" style={{ paddingTop: 0 }}>
      <Navbar />

      {error && <div className="demo-badge" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>{error}</div>}

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
          <button type="submit" className="btn-add">Добавить</button>
        </div>
      </form>

      <div className="table-container">
        {isLoading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Загрузка задач...</div>
        ) : (
          <table className="task-table">
            <thead>
              <tr>
                <th style={{textAlign:'center'}}>Score</th>
                <th>Task</th>
                <th>Deadline</th>
                <th style={{textAlign:'center'}}>Imp</th>
                <th style={{textAlign:'center'}}>SP</th>
                <th style={{textAlign:'center'}}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr><td colSpan="6" style={{textAlign: 'center'}}>Нет активных задач</td></tr>
              ) : (
                tasks.map(task => (
                  <tr key={task.id}>
                    <td className="score-cell" style={{textAlign:'center', color: task.score >= 10 ? '#f87171' : task.score >= 5 ? '#facc15' : '#4ade80'}}>
                      {(task.score || 0).toFixed(2)}
                    </td>
                    <td>{task.title}</td>
                    <td>{task.deadline}</td>
                    <td style={{textAlign:'center'}}>{task.importance}</td>
                    <td style={{textAlign:'center'}}>{task.complexity}</td>
                    <td style={{textAlign:'center'}}>
                      <button 
                        onClick={() => handleDelete(task.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--accent-red)',
                          cursor: 'pointer',
                          fontSize: '1.2rem',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                        onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                        title="Удалить задачу"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
