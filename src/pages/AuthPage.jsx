import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '', name: '', email: '', role: 'STUDENT', branch: '', idNumber: '' });
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();

  const generateCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, [isLogin]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (!isLogin) {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return false;
      }
      if (!formData.name || formData.name.length < 2) {
        toast.error('Name must be at least 2 characters');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        if (parseInt(captchaInput) !== captchaNum1 + captchaNum2) {
          toast.error('Invalid CAPTCHA. Please try again.');
          generateCaptcha();
          return;
        }
        const res = await api.post('/auth/login', {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('token', res.data.accessToken);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('username', res.data.username);
        toast.success(`Welcome back, ${res.data.username}!`);
        if (res.data.role === 'FACULTY') {
          navigate('/faculty');
        } else if (res.data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        await api.post('/auth/register', { ...formData });
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      let errorMsg = 'An error occurred. Make sure backend is running.';
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMsg = err.response.data;
        } else if (err.response.data.message || err.response.data.error) {
          errorMsg = err.response.data.message || err.response.data.error;
        } else if (err.response.status === 403 || err.response.status === 401) {
          errorMsg = 'Invalid username or password. Have you registered?';
        }
      }
      toast.error(errorMsg);
      if (isLogin) generateCaptcha();
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Register As</label>
                <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-input" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-input" required onChange={handleChange} />
              </div>
              {formData.role === 'STUDENT' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Branch</label>
                    <input type="text" name="branch" className="form-input" required onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ID Number</label>
                    <input type="text" name="idNumber" className="form-input" required onChange={handleChange} />
                  </div>
                </>
              )}
            </>
          )}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input type="text" name="username" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" className="form-input" required onChange={handleChange} />
          </div>
          
          {isLogin && (
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Solve: <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.2rem', letterSpacing: '2px' }}>{captchaNum1} + {captchaNum2}</span> = ?
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" 
                  className="form-input" 
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)} 
                  required={isLogin}
                  placeholder="Enter answer"
                />
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={generateCaptcha} 
                  style={{ padding: '0.5rem', width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Refresh CAPTCHA"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
