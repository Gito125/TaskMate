import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { setTheme } from '../utils/setTheme';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('token/', form);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/'); // redirect to dashboard
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Try again.');
    }
  };
  
  useEffect(() => {
    setTheme(); // Set initial theme
  }), [];

  return (
    
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--accent)] p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-[var(--text)]">{error}</p>}

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
            autoComplete='username'
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            autoComplete='current-password'
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-[var(--bg)] text-[var(--text)] hover:text-[var(--bg)] cursor-pointer hover:bg-[var(--text)] rounded transition"
        >
          Login
        </button>

        <div className="flex text-sm text-right mt-4">
          <p>Don't have an account.</p>
          <Link to="/register" className="ml-1 text-[var(--text)] hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;