import React from 'react';
import { users, userPreferences } from '../mockData.js';

export default function StudentProfileModal({ studentId, open, onClose }) {
  if (!open || !studentId) return null;

  const student = users.find(u => u.id === studentId);
  const preferences = userPreferences[studentId] || { preferredSubjects: [], difficulty: 'Beginner', intro: '' };

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <img 
                src={student.avatarUrl} 
                alt={`${student.name} avatar`} 
                className="h-16 w-16 rounded-full ring-1 ring-gray-300" 
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-gray-600">Student</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm text-gray-500">Joined: {student.joinedDate}</span>
                  <span className="text-sm text-gray-500">Points: {student.points}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Preferred Subjects */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferred Subjects</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.preferredSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learning Level */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Level</h3>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                  {preferences.difficulty}
                </span>
              </div>

              {/* Self Introduction */}
              {preferences.intro && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                    {preferences.intro}
                  </p>
                </div>
              )}

              {/* Learning Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Stats</h3>
                <div className="grid grid-cols-1 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-2xl font-bold text-blue-600">{student.points}</p>
                    <p className="text-sm text-gray-600">Points Earned</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-20">Email:</span>
                    <span className="text-sm text-gray-900">{student.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
