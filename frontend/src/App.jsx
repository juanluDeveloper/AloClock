import React, { useState } from 'react';
import { setAuthToken } from './services/api';
import { login as loginService } from './services/authService';
import LoginView from './views/LoginView';
import UserDashboard from './views/UserDashboard';
import AdminView from './views/AdminView';

export default function App() {
  const [token, setTokenState] = useState(null);
  const [view, setView] = useState('user'); // 'user' | 'admin'

  const handleLogin = async (email, password) => {
    try {
      const token = await loginService(email, password);
      setTokenState(token);
      setAuthToken(token);
    } catch (err) {
      console.error(err);
      alert('Credenciales inválidas o error en el servidor');
    }
  };

  const handleLogout = () => {
    setTokenState(null);
    setAuthToken(null);
  };

  if (!token) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <span className="navbar-brand d-flex align-items-center">
            <img
              src="/images/alodent-logo.png"
              alt="Alodent"
              style={{ height: '34px' }}
              className="me-2"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <span>
              <strong>AloClock</strong>{' '}
              <small className="text-muted d-none d-sm-inline">
                · Control de jornada
              </small>
            </span>
          </span>

          <div className="ms-auto d-flex align-items-center gap-2">
            <div className="btn-group me-2">
              <button
                className={
                  'btn btn-sm btn-outline-primary' +
                  (view === 'user' ? ' active' : '')
                }
                onClick={() => setView('user')}
              >
                Trabajador
              </button>
              <button
                className={
                  'btn btn-sm btn-outline-primary' +
                  (view === 'admin' ? ' active' : '')
                }
                onClick={() => setView('admin')}
              >
                Admin
              </button>
            </div>
            <button
              className="btn btn-sm btn-outline-secondary btn-pill"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {view === 'user' && <UserDashboard />}
      {view === 'admin' && <AdminView />}
    </>
  );
}