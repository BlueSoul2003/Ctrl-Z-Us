import React from 'react';
import { users } from '../mockData.js';

export default function TutorDetailsModal({ tutorId, open, onClose, onApprove, onReject }) {
  if (!open || !tutorId) return null;

  const tutor = users.find(u => u.id === tutorId);
  if (!tutor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tutor Application Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Tutor Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <div className="text-center">
                <img
                  src={tutor.avatarUrl}
                  alt={`${tutor.name} avatar`}
                  className="h-32 w-32 rounded-full mx-auto mb-4 ring-2 ring-gray-300"
                />
                <h3 className="text-xl font-bold text-gray-900">{tutor.name}</h3>
                <p className="text-gray-600">{tutor.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    Pending Approval
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <p className="text-sm text-gray-900">{tutor.subject}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                  <p className="text-sm text-gray-900">RM {tutor.pricePerHour || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <p className="text-sm text-gray-900">{tutor.experience || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response Time</label>
                  <p className="text-sm text-gray-900">{tutor.responseTime || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                  <p className="text-sm text-gray-900">{tutor.languages ? tutor.languages.join(', ') : 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                  <p className="text-sm text-gray-900">{tutor.joinedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {tutor.bio && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Bio</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{tutor.bio}</p>
              </div>
            </div>
          )}

          {/* Education Background */}
          {tutor.education && tutor.education.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Education Background</h4>
              <div className="space-y-3">
                {tutor.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                        <p className="text-sm text-gray-900">{edu.degree}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                        <p className="text-sm text-gray-900">{edu.university}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                        <p className="text-sm text-gray-900">{edu.year}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                        <p className="text-sm text-gray-900">{edu.gpa || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teaching Experience */}
          {tutor.teachingExperience && tutor.teachingExperience.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Teaching Experience</h4>
              <div className="space-y-3">
                {tutor.teachingExperience.map((exp, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <p className="text-sm text-gray-900">{exp.position}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                        <p className="text-sm text-gray-900">{exp.institution}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <p className="text-sm text-gray-900">{exp.duration}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subjects</label>
                        <p className="text-sm text-gray-900">{exp.subjects}</p>
                      </div>
                    </div>
                    {exp.description && (
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p className="text-sm text-gray-700">{exp.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates */}
          {tutor.certificates && tutor.certificates.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Certificates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tutor.certificates.map((cert, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="h-24 w-full bg-gray-200 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Certificate Image</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                      <p className="text-xs text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500">{cert.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability */}
          {tutor.availability && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Availability</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{tutor.availability}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                onReject(tutor.id);
                onClose();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reject Application
            </button>
            <button
              onClick={() => {
                onApprove(tutor.id);
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Approve Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
