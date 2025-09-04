import React from 'react';
import { sessions, users } from '../mockData.js';

export default function TutorDashboard({ user }) {
  // Get tutor's sessions
  const tutorSessions = sessions.filter(s => s.tutorId === user.id);
  const upcomingSessions = tutorSessions.filter(s => s.status === 'upcoming');
  const completedSessions = tutorSessions.filter(s => s.status === 'completed');

  // Calculate average rating
  const ratedSessions = completedSessions.filter(s => s.rating);
  const averageRating = ratedSessions.length > 0 
    ? (ratedSessions.reduce((sum, s) => sum + s.rating, 0) / ratedSessions.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Here's your tutoring overview and upcoming sessions.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Rating</p>
            <p className="text-2xl font-bold text-yellow-600">{averageRating} ⭐</p>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingSessions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{completedSessions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">⭐</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">{averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">💰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rate per Hour</p>
              <p className="text-2xl font-semibold text-gray-900">RM {user.pricePerHour}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-600">Subject</p>
            <p className="text-lg text-gray-900">{user.subject}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
              user.status === 'approved' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {user.status === 'approved' ? 'Approved' : 'Pending Approval'}
            </span>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-gray-600">Bio</p>
            <p className="text-gray-900">{user.bio}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
          <a
            href="/tutor/sessions"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Sessions
          </a>
        </div>
        
        {upcomingSessions.length > 0 ? (
          <div className="space-y-4">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{session.topic}</h3>
                    <p className="text-sm text-gray-600">
                      with {session.studentName} • {session.subject}
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.date} at {session.time} ({session.duration} min)
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    Upcoming
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No upcoming sessions</p>
          </div>
        )}
      </div>

      {/* Recent Feedback */}
      {ratedSessions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h2>
          <div className="space-y-4">
            {ratedSessions.slice(0, 2).map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{session.topic}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < session.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{session.feedback}</p>
                <p className="text-xs text-gray-500 mt-2">from {session.studentName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a
          href="/tutor/sessions"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">📅</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Manage Sessions</h3>
              <p className="text-sm text-gray-600">View and manage your sessions</p>
            </div>
          </div>
        </a>

        <a
          href="/tutor/messages"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-semibold">💬</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Messages</h3>
              <p className="text-sm text-gray-600">Chat with students</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}