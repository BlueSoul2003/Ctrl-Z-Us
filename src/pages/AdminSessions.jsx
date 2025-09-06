import React, { useState, useMemo } from 'react';
import { sessions, users } from '../mockData.js';

export default function AdminSessions({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const allSessions = useMemo(() => sessions, []);
  const completedSessions = useMemo(() => sessions.filter(s => s.status === 'completed'), []);
  const upcomingSessions = useMemo(() => sessions.filter(s => s.status === 'upcoming'), []);
  const cancelledSessions = useMemo(() => sessions.filter(s => s.status === 'cancelled'), []);

  const filteredSessions = useMemo(() => {
    let filtered = allSessions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(s => {
            const sessionDate = new Date(s.date);
            return sessionDate.toDateString() === today.toDateString();
          });
          break;
        case 'week':
          filterDate.setDate(today.getDate() + 7);
          filtered = filtered.filter(s => {
            const sessionDate = new Date(s.date);
            return sessionDate >= today && sessionDate <= filterDate;
          });
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() + 1);
          filtered = filtered.filter(s => {
            const sessionDate = new Date(s.date);
            return sessionDate >= today && sessionDate <= filterDate;
          });
          break;
        case 'past':
          filtered = filtered.filter(s => {
            const sessionDate = new Date(s.date);
            return sessionDate < today;
          });
          break;
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allSessions, statusFilter, dateFilter, searchTerm]);

  const totalEarnings = completedSessions.reduce((sum, session) => sum + (session.price || 0), 0);
  const averageSessionDuration = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((sum, session) => sum + (session.duration || 60), 0) / completedSessions.length)
    : 0;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sessions Overview</h1>
              <p className="text-gray-600 mt-2">View and manage all tutoring sessions across the platform</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                  <p className="text-3xl font-bold text-gray-900">{allSessions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedSessions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-xl">⏰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">{upcomingSessions.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">RM {totalEarnings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Analytics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average Duration:</span>
                  <span className="text-sm font-medium">{averageSessionDuration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion Rate:</span>
                  <span className="text-sm font-medium">
                    {allSessions.length > 0 ? Math.round((completedSessions.length / allSessions.length) * 100) : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cancellation Rate:</span>
                  <span className="text-sm font-medium">
                    {allSessions.length > 0 ? Math.round((cancelledSessions.length / allSessions.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Top Subjects</h3>
              <div className="space-y-2">
                {(() => {
                  const subjectCounts = {};
                  completedSessions.forEach(session => {
                    subjectCounts[session.subject] = (subjectCounts[session.subject] || 0) + 1;
                  });
                  const topSubjects = Object.entries(subjectCounts)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3);
                  
                  return topSubjects.map(([subject, count]) => (
                    <div key={subject} className="flex justify-between">
                      <span className="text-sm text-gray-600">{subject}:</span>
                      <span className="text-sm font-medium">{count} sessions</span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
              <div className="space-y-2">
                {allSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="text-sm">
                    <span className="font-medium">{session.topic}</span>
                    <span className="text-gray-500 ml-2">
                      {session.studentName} with {session.tutorName}
                    </span>
                    <div className="text-xs text-gray-500">
                      {session.date} at {session.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Sessions
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by topic, student, tutor, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  id="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Next 7 Days</option>
                  <option value="month">Next Month</option>
                  <option value="past">Past Sessions</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Sessions Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Sessions ({filteredSessions.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Session Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participants
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{session.topic}</div>
                        {session.meetingRoomId && (
                          <div className="text-xs text-gray-500">Room: {session.meetingRoomId}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{session.studentName}</div>
                        <div className="text-sm text-gray-500">with {session.tutorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{session.date}</div>
                        <div className="text-sm text-gray-500">{session.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.duration || 60} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.price ? `RM ${session.price}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
