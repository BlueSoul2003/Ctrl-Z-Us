import React from 'react';
import { platformStats, users, sessions } from '../mockData.js';

export default function AdminDashboard({ user }) {
  const students = users.filter(u => u.role === 'student');
  const tutors = users.filter(u => u.role === 'tutor');
  const pendingTutors = tutors.filter(t => t.status === 'pending');
  const approvedTutors = tutors.filter(t => t.status === 'approved');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and management tools.</p>
      </header>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">👨‍🏫</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tutors</p>
              <p className="text-2xl font-semibold text-gray-900">{tutors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">⏳</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingTutors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">📚</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{sessions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Tutor Applications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Pending Tutor Applications</h2>
            <a
              href="/admin/tutors"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </a>
          </div>
          
          {pendingTutors.length > 0 ? (
            <div className="space-y-3">
              {pendingTutors.slice(0, 3).map((tutor) => (
                <div key={tutor.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={tutor.avatarUrl}
                      alt={`${tutor.name} avatar`}
                      className="h-8 w-8 rounded-full ring-1 ring-gray-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tutor.name}</p>
                      <p className="text-xs text-gray-600">{tutor.subject}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No pending applications</p>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
          </div>
          
          <div className="space-y-3">
            {sessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{session.topic}</p>
                  <p className="text-xs text-gray-600">
                    {session.studentName} with {session.tutorName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.date} at {session.time}
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  session.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {session.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a
          href="/admin/tutors"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">👨‍🏫</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Manage Tutors</h3>
              <p className="text-sm text-gray-600">Approve or reject applications</p>
            </div>
          </div>
        </a>

        <a
          href="/admin/users"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-semibold">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">View and edit user accounts</p>
            </div>
          </div>
        </a>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-semibold">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Platform usage statistics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}