import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { users } from '../mockData.js';

export default function SignIn({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Find user by email and password
    const user = users.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      // Call the onLogin prop to update parent state
      onLogin(user);
      
      // Redirect based on role
      if (user.role === 'student') {
        navigate('/student');
      } else if (user.role === 'tutor') {
        navigate('/tutor');
      } else if (user.role === 'admin') {
        navigate('/admin');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="select-none inline-block">
            <span className="text-3xl font-extrabold tracking-tight text-blue-700">Tutor</span>
            <span className="text-3xl font-extrabold tracking-tight text-gray-900">ly</span>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium">Demo accounts:</p>
            <ul className="mt-2 space-y-1">
              <li>Student: alice@student.com / password123</li>
              <li>Tutor: emily@tutor.com / password123</li>
              <li>Admin: admin@tutorly.com / admin123</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
