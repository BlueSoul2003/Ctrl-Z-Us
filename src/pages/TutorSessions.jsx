import React, { useMemo, useState } from 'react';
import { users, sessions, updateSessionStatus } from '../mockData.js';

export default function TutorSessions({ user }) {
  const tutor = useMemo(() => users.find(u => u.id === user.id), [user.id]);
  const [filter, setFilter] = useState('all');
  const tutorSessionsList = sessions.filter(s => s.tutorId === user.id);
  const filteredSessions = tutorSessionsList.filter(session => (filter === 'all' ? true : session.status === filter));

  const handleUpdateStatus = (sessionId, newStatus) => {
    updateSessionStatus(sessionId, newStatus);
    setFilter(f => f); // trigger rerender
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Sessions</h1>
          <p className="text-gray-600">View and manage your tutoring sessions.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Sessions</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"><span className="text-blue-600 font-semibold text-sm">📅</span></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{tutorSessionsList.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center"><span className="text-yellow-600 font-semibold text-sm">⏰</span></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{tutorSessionsList.filter(s => s.status === 'upcoming').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center"><span className="text-green-600 font-semibold text-sm">✅</span></div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{tutorSessionsList.filter(s => s.status === 'completed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
        </div>
        {filteredSessions.length ? (
          <div className="divide-y divide-gray-200">
            {filteredSessions.map((session) => (
              <div key={session.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{session.topic}</h3>
                    <p className="text-sm text-gray-600">with {session.studentName} • {session.subject}</p>
                    <p className="text-sm text-gray-500">{session.date} at {session.time} • {session.duration} minutes</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${session.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{session.status === 'upcoming' ? 'Upcoming' : 'Completed'}</span>
                    {session.status === 'upcoming' && (
                      <button onClick={() => handleUpdateStatus(session.id, 'completed')} className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">Mark Complete</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12"><p className="text-gray-500">{filter === 'all' ? 'No sessions found.' : `No ${filter} sessions found.`}</p></div>
        )}
      </div>
    </div>
  );
}
