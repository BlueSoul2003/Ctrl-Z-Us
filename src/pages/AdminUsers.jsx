import React, { useState, useMemo } from 'react';
import { users } from '../mockData.js';
import StudentProfileModal from '../components/StudentProfileModal.jsx';
import TutorDetailsModal from '../components/TutorDetailsModal.jsx';

export default function AdminUsers({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showTutorDetails, setShowTutorDetails] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);

  const allUsers = useMemo(() => users, []);
  const tutors = useMemo(() => users.filter(u => u.role === 'tutor'), []);
  const students = useMemo(() => users.filter(u => u.role === 'student'), []);
  const pendingTutors = useMemo(() => users.filter(u => u.role === 'tutor' && u.status === 'pending'), []);

  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(u => (u.status || 'active') === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.subject && u.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  }, [allUsers, roleFilter, statusFilter, searchTerm]);

  const toggleUserStatus = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      user.status = user.status === 'approved' ? 'disabled' : 'approved';
    }
  };

  const approveTutor = (tutorId) => {
    const tutor = users.find(u => u.id === tutorId);
    if (tutor) {
      tutor.status = 'approved';
    }
  };

  const rejectTutor = (tutorId) => {
    const tutor = users.find(u => u.id === tutorId);
    if (tutor) {
      tutor.status = 'rejected';
    }
  };

  const openStudentProfile = (studentId) => {
    setSelectedStudentId(studentId);
    setShowStudentProfile(true);
  };

  const openTutorDetails = (tutorId) => {
    setSelectedTutorId(tutorId);
    setShowTutorDetails(true);
  };

  const handleApproveTutor = (tutorId) => {
    const tutor = users.find(u => u.id === tutorId);
    if (tutor) {
      tutor.status = 'approved';
    }
  };

  const handleRejectTutor = (tutorId) => {
    const tutor = users.find(u => u.id === tutorId);
    if (tutor) {
      tutor.status = 'rejected';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600 mt-2">Manage all tutors and students on the platform</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{allUsers.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-xl">🎓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tutors</p>
                  <p className="text-3xl font-bold text-gray-900">{tutors.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-xl">📚</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-xl">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">{pendingTutors.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Users
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  id="role"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Roles</option>
                  <option value="tutor">Tutors</option>
                  <option value="student">Students</option>
                </select>
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
                  <option value="active">Active</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="disabled">Disabled</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('all');
                    setStatusFilter('all');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          {pendingTutors.length > 0 && (
            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
              <h2 className="text-lg font-semibold text-yellow-900 mb-4">Pending Tutor Approvals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingTutors.map((tutor) => (
                  <div key={tutor.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center mb-3">
                      <img src={tutor.avatarUrl} alt={tutor.name} className="h-10 w-10 rounded-full mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">{tutor.name}</h3>
                        <p className="text-sm text-gray-600">{tutor.subject}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Joined: {tutor.joinedDate}</p>
                      <div className="space-y-2">
                        <button
                          onClick={() => openTutorDetails(tutor.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveTutor(tutor.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectTutor(tutor.id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Users ({filteredUsers.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject/Specialty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.role === 'student' ? (
                            <button
                              onClick={() => openStudentProfile(user.id)}
                              className="hover:opacity-80 transition-opacity"
                              title="View student profile"
                            >
                              <img
                                src={user.avatarUrl}
                                alt={`${user.name} avatar`}
                                className="h-10 w-10 rounded-full ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-500"
                              />
                            </button>
                          ) : (
                            <img
                              src={user.avatarUrl}
                              alt={`${user.name} avatar`}
                              className="h-10 w-10 rounded-full ring-1 ring-gray-300"
                            />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'tutor' ? 'bg-blue-100 text-blue-800' : 
                          user.role === 'student' ? 'bg-green-100 text-green-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.subject || user.specialty || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          user.status === 'disabled' ? 'bg-red-100 text-red-800' : 
                          user.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.joinedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`${
                            user.status === 'approved' || user.status === 'active' 
                              ? 'text-red-600 hover:text-red-900' 
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.status === 'approved' || user.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Student Profile Modal */}
      <StudentProfileModal
        studentId={selectedStudentId}
        open={showStudentProfile}
        onClose={() => {
          setShowStudentProfile(false);
          setSelectedStudentId(null);
        }}
      />

      {/* Tutor Details Modal */}
      <TutorDetailsModal
        tutorId={selectedTutorId}
        open={showTutorDetails}
        onClose={() => {
          setShowTutorDetails(false);
          setSelectedTutorId(null);
        }}
        onApprove={handleApproveTutor}
        onReject={handleRejectTutor}
      />
    </div>
  );
}