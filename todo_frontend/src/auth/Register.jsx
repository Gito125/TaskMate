import { useState } from 'react';
import axios from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('register/', form);
      setSuccess('Account created. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError('Username already taken or password too weak.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--bg)] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--accent)] p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}

        <div>
          <label className="block text-sm font-medium">Username</label>
          <input
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
          className="w-full py-2 bg-[var(--bg)] text-[var(--accent)] cursor-pointer hover:bg-[var(--text)] rounded transition"
        >
          Create Account
        </button>

        <div className="flex text-sm text-right mt-4">
          <p>Have an account.</p>
          <Link to="/login" className="ml-1 text-[var(--bg)] hover:underline">
            Login here
          </Link>
        </div>

      </form>
    </div>
  );
};

export default Register;