import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerAPI, loginAPI } from '../services/auth';
import '../App.css'; 

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Регистрируем пользователя
      await registerAPI(username, password);
      
      // 2. Сразу логиним его
      const data = await loginAPI(username, password);
      login(data.access_token, { username }); 
      
      // 3. Пускаем в приложение
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
        <h1 className="title">Регистрация</h1>
      </div>

      <form onSubmit={handleSubmit} className="task-form" style={{ display: 'flex', flexDirection: 'column' }}>
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
            placeholder="Придумайте логин"
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

        <div className="form-group">
          <label className="form-label">Подтвердите пароль</label>
          <input 
            className="input-field" 
            type="password" 
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn-add" 
          disabled={isLoading}
          style={{ marginTop: '10px' }}
        >
          {isLoading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--primary)' }}>Войти</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
