import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginAPI } from '../services/auth';
import '../App.css'; // Используем твои глобальные стили

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginAPI(username, password);
      // Сохраняем токен в контекст (ключ может отличаться в зависимости от ответа бэкенда)
      login(data.access_token, { username }); 
      // Перенаправляем на Dashboard
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '400px', marginTop: '10vh' }}>
      <div className="header" style={{ textAlign: 'center' }}>
        <h1 className="title">Вход в систему</h1>
      </div>

      <form onSubmit={handleSubmit} className="task-form" style={{ display: 'flex' }}>
        {error && (
          <div style={{ color: 'var(--accent-red)', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Имя пользователя</label>
          <input 
            className="input-field" 
            type="text" 
            placeholder="Введите логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Пароль</label>
          <input 
            className="input-field" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn-add" 
          disabled={isLoading}
          style={{ marginTop: '10px' }}
        >
          {isLoading ? 'Загрузка...' : 'Войти'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Нет аккаунта? <Link to="/register" style={{ color: 'var(--primary)' }}>Зарегистрироваться</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
