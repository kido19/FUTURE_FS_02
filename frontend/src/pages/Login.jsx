import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShouldShake(false);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/');
      } else {
        setError(data.message || 'Login failed');
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 500);
      }
    } catch (err) {
      setError('Server connection failed. Is the backend running?');
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="core-glow">
        <div className={`login-card ${shouldShake ? 'shake' : ''}`}>
          <h2>Admin Portal</h2>
          {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', textAlign: 'center', fontSize: '0.7rem', letterSpacing: '0.1em' }}>{error}</div>}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button type="submit" className="btn" style={{ width: '100%', justifyContent: 'center' }} disabled={isLoading}>
              {isLoading ? 'Authenticating...' : <><Lock size={16} /> Login</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
