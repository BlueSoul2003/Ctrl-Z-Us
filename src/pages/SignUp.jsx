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
    // Student fields
    preferredSubjects: [],
    studentIntro: '',
    profilePhoto: null,
    // Basic tutor info
    tutorSubjects: [],
    tutorBio: '',
    pricePerHour: '',
    // Education
    education: [
      { degree: '', university: '', year: '' }
    ],
    // Teaching experience
    teachingExperience: [
      { position: '', organization: '', duration: '' }
    ],
    // Certificates
    certificates: [],
    // Contact and availability
    languages: [],
    responseTime: '',
    // Additional details
    experience: '',
    nextAvailable: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === 'tutorSubjects' || name === 'languages' || name === 'preferredSubjects') {
      const values = Array.from(selectedOptions).map(o => o.value);
      setFormData(prev => ({ ...prev, [name]: values }));
    } else if (name.startsWith('education[') || name.startsWith('teachingExperience[')) {
      const fieldMatch = name.match(/(\w+)\[(\d+)\]\.(\w+)/);
      if (fieldMatch) {
        const [, arrayName, index, field] = fieldMatch;
        setFormData(prev => ({
          ...prev,
          [arrayName]: prev[arrayName].map((item, i) => 
            i === parseInt(index) ? { ...item, [field]: value } : item
          )
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    setFormData(prev => ({ ...prev, profilePhoto: file }));
  };

  const handleCertificateFile = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ 
      ...prev, 
      certificates: files.map(file => ({ name: file.name, file: file }))
    }));
  };

  const addEducationEntry = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', university: '', year: '' }]
    }));
  };

  const removeEducationEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addTeachingExperienceEntry = () => {
    setFormData(prev => ({
      ...prev,
      teachingExperience: [...prev.teachingExperience, { position: '', organization: '', duration: '' }]
    }));
  };

  const removeTeachingExperienceEntry = (index) => {
    setFormData(prev => ({
      ...prev,
      teachingExperience: prev.teachingExperience.filter((_, i) => i !== index)
    }));
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

    if (formData.role === 'student') {
      if (!formData.preferredSubjects.length) {
        setError('Please select at least one preferred subject');
        return;
      }
    }

    if (formData.role === 'tutor') {
      if (!formData.tutorSubjects.length) {
        setError('Please select at least one subject');
        return;
      }
      if (!formData.tutorBio.trim()) {
        setError('Please provide a bio/description');
        return;
      }
      if (!formData.pricePerHour || isNaN(formData.pricePerHour) || formData.pricePerHour <= 0) {
        setError('Please enter a valid hourly rate');
        return;
      }
      if (!formData.languages.length) {
        setError('Please select at least one language');
        return;
      }
      if (!formData.experience.trim()) {
        setError('Please specify your teaching experience');
        return;
      }
    }

    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${formData.name}`,
      // Student fields
      points: formData.role === 'student' ? 0 : undefined,
      progress: formData.role === 'student' ? 0 : undefined,
      preferredSubjects: formData.role === 'student' ? formData.preferredSubjects : undefined,
      studentIntro: formData.role === 'student' ? formData.studentIntro : undefined,
      // Tutor fields
      subject: formData.role === 'tutor' ? (formData.tutorSubjects[0] || 'Mathematics') : undefined,
      subjects: formData.role === 'tutor' ? formData.tutorSubjects : undefined,
      bio: formData.role === 'tutor' ? formData.tutorBio : undefined,
      pricePerHour: formData.role === 'tutor' ? parseInt(formData.pricePerHour) : undefined,
      rating: formData.role === 'tutor' ? 0 : undefined,
      totalSessions: formData.role === 'tutor' ? 0 : undefined,
      status: formData.role === 'tutor' ? 'pending' : undefined,
      verified: formData.role === 'tutor' ? false : undefined,
      responseTime: formData.role === 'tutor' ? formData.responseTime : undefined,
      languages: formData.role === 'tutor' ? formData.languages : undefined,
      nextAvailable: formData.role === 'tutor' ? formData.nextAvailable : undefined,
      experience: formData.role === 'tutor' ? formData.experience : undefined,
      latestReview: formData.role === 'tutor' ? '' : undefined,
      // Additional tutor data
      education: formData.role === 'tutor' ? formData.education.filter(edu => edu.degree && edu.university) : undefined,
      teachingExperience: formData.role === 'tutor' ? formData.teachingExperience.filter(exp => exp.position && exp.organization) : undefined,
      certificates: formData.role === 'tutor' ? formData.certificates.map(cert => cert.name) : undefined,
      availability: formData.role === 'tutor' ? [] : undefined,
      tutorSessions: formData.role === 'tutor' ? [] : undefined,
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
      <div className={`${formData.role === 'tutor' || formData.role === 'student' ? 'max-w-4xl' : 'max-w-md'} w-full space-y-8`}>
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

            {formData.role === 'student' && (
              <div className="space-y-6">
                {/* Student Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="space-y-4">
                    <div>
                      <label htmlFor="preferredSubjects" className="block text-sm font-medium text-gray-700">
                        Preferred Subjects (hold Ctrl/Cmd to select multiple) *
                      </label>
                      <select
                        id="preferredSubjects"
                        name="preferredSubjects"
                        multiple
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.preferredSubjects}
                        onChange={handleChange}
                      >
                        {subjects.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="studentIntro" className="block text-sm font-medium text-gray-700">
                        Self-introduction (optional)
                      </label>
                      <textarea
                        id="studentIntro"
                        name="studentIntro"
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Tell us about yourself and your learning goals..."
                        value={formData.studentIntro}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="studentProfilePhoto" className="block text-sm font-medium text-gray-700">
                        Profile Photo
                      </label>
                      <input
                        id="studentProfilePhoto"
                        name="studentProfilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={handleFile}
                        className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {formData.profilePhoto && (
                        <p className="mt-1 text-xs text-gray-600">Selected: {formData.profilePhoto.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.role === 'tutor' && (
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tutorSubjects" className="block text-sm font-medium text-gray-700">
                        Subjects (hold Ctrl/Cmd to select multiple) *
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
                      <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700">
                        Hourly Rate (RM) *
                      </label>
                      <input
                        id="pricePerHour"
                        name="pricePerHour"
                        type="number"
                        min="1"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., 35"
                        value={formData.pricePerHour}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                  <label htmlFor="tutorBio" className="block text-sm font-medium text-gray-700">
                      Bio/Description *
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

                  <div className="mt-4">
                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
                      Profile Photo
                  </label>
                  <input
                      id="profilePhoto"
                      name="profilePhoto"
                    type="file"
                      accept="image/*"
                    onChange={handleFile}
                    className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                  />
                    {formData.profilePhoto && (
                      <p className="mt-1 text-xs text-gray-600">Selected: {formData.profilePhoto.name}</p>
                    )}
                  </div>
                </div>

                {/* Education Background */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Education Background</h3>
                    <button
                      type="button"
                      onClick={addEducationEntry}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Education
                    </button>
                  </div>
                  {formData.education.map((edu, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg border">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Degree</label>
                        <input
                          name={`education[${index}].degree`}
                          type="text"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., PhD in Mathematics"
                          value={edu.degree}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">University</label>
                        <input
                          name={`education[${index}].university`}
                          type="text"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., University of Technology Malaysia"
                          value={edu.university}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">Year</label>
                          <input
                            name={`education[${index}].year`}
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., 2018-2022"
                            value={edu.year}
                            onChange={handleChange}
                          />
                        </div>
                        {formData.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducationEntry(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Teaching Experience */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Teaching Experience</h3>
                    <button
                      type="button"
                      onClick={addTeachingExperienceEntry}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Experience
                    </button>
                  </div>
                  {formData.teachingExperience.map((exp, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white rounded-lg border">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                          name={`teachingExperience[${index}].position`}
                          type="text"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., Online Tutor"
                          value={exp.position}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Organization</label>
                        <input
                          name={`teachingExperience[${index}].organization`}
                          type="text"
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="e.g., Tutorly Platform"
                          value={exp.organization}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700">Duration</label>
                          <input
                            name={`teachingExperience[${index}].duration`}
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="e.g., 2022 - Present"
                            value={exp.duration}
                            onChange={handleChange}
                          />
                        </div>
                        {formData.teachingExperience.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTeachingExperienceEntry(index)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                        Languages (hold Ctrl/Cmd to select multiple) *
                      </label>
                      <select
                        id="languages"
                        name="languages"
                        multiple
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.languages}
                        onChange={handleChange}
                      >
                        <option value="English">English</option>
                        <option value="Mandarin">Mandarin</option>
                        <option value="Malay">Malay</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="responseTime" className="block text-sm font-medium text-gray-700">
                        Response Time
                      </label>
                      <select
                        id="responseTime"
                        name="responseTime"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={formData.responseTime}
                        onChange={handleChange}
                      >
                        <option value="">Select response time</option>
                        <option value="1 hour">Within 1 hour</option>
                        <option value="2 hours">Within 2 hours</option>
                        <option value="4 hours">Within 4 hours</option>
                        <option value="24 hours">Within 24 hours</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Teaching Experience *
                      </label>
                      <input
                        id="experience"
                        name="experience"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., 5+ years"
                        value={formData.experience}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="nextAvailable" className="block text-sm font-medium text-gray-700">
                        Next Available
                      </label>
                      <input
                        id="nextAvailable"
                        name="nextAvailable"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="e.g., Tomorrow 2PM"
                        value={formData.nextAvailable}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Certificates */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificates</h3>
                  <div>
                    <label htmlFor="certificates" className="block text-sm font-medium text-gray-700">
                      Upload Certificates (optional)
                    </label>
                    <input
                      id="certificates"
                      name="certificates"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.png"
                      onChange={handleCertificateFile}
                      className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.certificates.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected certificates:</p>
                        <ul className="text-xs text-gray-500 mt-1">
                          {formData.certificates.map((cert, index) => (
                            <li key={index}>• {cert.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
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
