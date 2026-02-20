import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      backgroundColor: 'var(--surface-color)',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '24px',
      borderRadius: '0 0 16px 16px'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)' }}>
        Smart Task Manager
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ color: 'var(--text-secondary)' }}>
          Привет, <span style={{ color: 'var(--text-main)' }}>{user?.username || 'User'}</span>
        </span>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--accent-red)',
            color: 'var(--accent-red)',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'var(--accent-red)';
            e.target.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'var(--accent-red)';
          }}
        >
          Выйти
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
