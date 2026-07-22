import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import './ProtectedRoute.css';

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (isAuthenticated) {
    return children;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple password protection - in production, use proper authentication
    if (password === 'Medini@2012') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect access code. Please try again.');
      setPassword('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="protected-route">
      <div className="login-container">
        <div className="login-box">
          <div className="login-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="login-title">Restricted Access</h2>
          <p className="login-subtitle">This area requires authorization. Please enter your access code to continue.</p>
          <form className={`login-form ${isShaking ? 'shake' : ''}`} onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="access-code" className="input-label">Access Code</label>
              <input
                id="access-code"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="password-input"
                required
                autoComplete="off"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-btn">
              <span className="btn-text">Verify Access</span>
              <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </form>
          <p className="login-hint">Contact administrator if you don't have an access code.</p>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
