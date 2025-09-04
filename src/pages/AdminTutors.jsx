import React, { useState } from 'react';
import { users, updateTutorStatus } from '../mockData.js';

export default function AdminTutors({ user }) {
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'

  const tutors = users.filter(u => u.role === 'tutor');
  
  const filteredTutors = tutors.filter(tutor => {
    if (filter === 'all') return true;
    return tutor.status === filter;
  });

  const handleApprove = (tutorId) => {
    updateTutorStatus(tutorId, 'approved');
    // Force re-render
    setFilter(filter);
  };

  const handleReject = (tutorId) => {
    updateTutorStatus(tutorId, 'rejected');
    // Force re-render
    setFilter(filter);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Tutors</h1>
          <p className="text-gray-600">Review and approve tutor applications.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tutors</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">👨‍🏫</span>
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tutors.filter(t => t.status === 'pending').length}
              </p>
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
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {tutors.filter(t => t.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tutors List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tutor Applications</h2>
        </div>
        
        {filteredTutors.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={tutor.avatarUrl}
                    alt={`${tutor.name} avatar`}
                    className="h-16 w-16 rounded-full ring-1 ring-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                        <p className="text-sm text-gray-600">{tutor.subject}</p>
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm text-gray-600">{tutor.rating}</span>
                          <span className="ml-2 text-sm text-gray-500">• ${tutor.pricePerHour}/hr</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        tutor.status === 'approved' 
                          ? 'bg-green-100 text-green-700' 
                          : tutor.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {tutor.status === 'approved' ? 'Approved' : 
                         tutor.status === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">{tutor.bio}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Joined: {tutor.joinedDate} • {tutor.totalSessions} sessions completed
                      </div>
                      
                      {tutor.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(tutor.id)}
                            className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(tutor.id)}
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'No tutors found.' 
                : `No ${filter} tutors found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
