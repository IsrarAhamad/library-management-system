import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login, registerUser } from '../services/api';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [loginValues, setLoginValues] = useState({ username: '', password: '' });
  const [signupValues, setSignupValues] = useState({ name: '', username: '', password: '', email: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location?.state?.mode === 'signup') {
      setMode('signup');
    }
  }, [location]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginValues(v => ({ ...v, [name]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupValues(v => ({ ...v, [name]: value }));
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await login(loginValues);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => nav('/dashboard'), 400);
    } catch (err) {
      setError('Invalid login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await registerUser({ ...signupValues, role: 'user' });
      await login({ username: signupValues.username, password: signupValues.password });
      setMessage('Account created! Redirecting to dashboard...');
      setTimeout(() => nav('/dashboard'), 600);
    } catch (err) {
      setError('Registration failed. Try a different username/email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded shadow-xl p-8 w-full max-w-2xl grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Library Portal</h2>
          <p className="text-gray-600 mb-6">Sign in to manage books, members, transactions, and reports. New here? Create an account instantly.</p>
          <div className="flex gap-4">
            <button
              className={`flex-1 py-2 rounded ${mode==='login' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setMode('login')}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-2 rounded ${mode==='signup' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
          {error && <div className="text-red-600 mt-4">{error}</div>}
          {message && <div className="text-green-600 mt-2">{message}</div>}
        </div>
        <div>
          {mode === 'login' ? (
            <form className="space-y-4" onSubmit={submitLogin}>
              <input className="input w-full" name="username" value={loginValues.username} onChange={handleLoginChange} placeholder="Username" autoFocus />
              <input className="input w-full" name="password" value={loginValues.password} onChange={handleLoginChange} placeholder="Password" type="password" />
              <button disabled={loading} className="w-full bg-blue-600 rounded py-2 text-white hover:bg-blue-700 disabled:opacity-70">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={submitSignup}>
              <input className="input w-full" name="name" value={signupValues.name} onChange={handleSignupChange} placeholder="Full Name" required />
              <input className="input w-full" name="username" value={signupValues.username} onChange={handleSignupChange} placeholder="Username" required />
              <input className="input w-full" type="email" name="email" value={signupValues.email} onChange={handleSignupChange} placeholder="Email" required />
              <input className="input w-full" type="password" name="password" value={signupValues.password} onChange={handleSignupChange} placeholder="Password" required />
              <button disabled={loading} className="w-full bg-green-600 rounded py-2 text-white hover:bg-green-500 disabled:opacity-70">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
