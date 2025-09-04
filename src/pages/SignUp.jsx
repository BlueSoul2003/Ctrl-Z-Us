import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser, subjects } from '../mockData.js';

export default function SignUp({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    tutorSubjects: [],
    tutorBio: '',
    certificateName: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === 'tutorSubjects') {
      const values = Array.from(selectedOptions).map(o => o.value);
      setFormData(prev => ({ ...prev, tutorSubjects: values }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    setFormData(prev => ({ ...prev, certificateName: file ? file.name : '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'tutor') {
      if (!formData.tutorSubjects.length) {
        setError('Please select at least one subject');
        return;
      }
      if (!formData.tutorBio.trim()) {
        setError('Please provide a short self-introduction');
        return;
      }
      if (!formData.certificateName) {
        setError('Please upload a certificate (mock)');
        return;
      }
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${formData.name}`,
      subject: formData.role === 'tutor' ? (formData.tutorSubjects[0] || 'Mathematics') : undefined,
      bio: formData.role === 'tutor' ? formData.tutorBio : undefined,
      certificateName: formData.role === 'tutor' ? formData.certificateName : undefined,
      status: formData.role === 'tutor' ? 'pending' : undefined,
      totalSessions: formData.role === 'tutor' ? 0 : undefined,
    };

    addUser(newUser);

    const userWithId = {
      ...newUser,
      id: `user_${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      points: formData.role === 'student' ? 0 : undefined,
      progress: formData.role === 'student' ? 0 : undefined,
    };

    onLogin(userWithId);

    if (formData.role === 'student') {
      navigate('/student');
    } else if (formData.role === 'tutor') {
      navigate('/tutor');
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/signin"
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I want to be a
              </label>
              <select
                id="role"
                name="role"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

            {formData.role === 'tutor' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="tutorSubjects" className="block text-sm font-medium text-gray-700">
                    Subjects (hold Ctrl/Cmd to select multiple)
                  </label>
                  <select
                    id="tutorSubjects"
                    name="tutorSubjects"
                    multiple
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={formData.tutorSubjects}
                    onChange={handleChange}
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tutorBio" className="block text-sm font-medium text-gray-700">
                    Short self-introduction
                  </label>
                  <textarea
                    id="tutorBio"
                    name="tutorBio"
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Tell students about your experience and teaching style..."
                    value={formData.tutorBio}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label htmlFor="certificate" className="block text-sm font-medium text-gray-700">
                    Upload certificate (mock)
                  </label>
                  <input
                    id="certificate"
                    name="certificate"
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={handleFile}
                    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.certificateName && (
                    <p className="mt-1 text-xs text-gray-600">Selected: {formData.certificateName}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
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
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
