import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { users, sessions, updateSessionStatus } from '../mockData.js';
import StudentProfileModal from '../components/StudentProfileModal.jsx';

export default function TutorSessions({ user }) {
  const tutor = useMemo(() => users.find(u => u.id === user.id), [user.id]);
  const [filter, setFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  
  const tutorSessionsList = sessions.filter(s => s.tutorId === user.id);
  const filteredSessions = tutorSessionsList.filter(session => (filter === 'all' ? true : session.status === filter));

  const handleUpdateStatus = (sessionId, newStatus) => {
    updateSessionStatus(sessionId, newStatus);
    setFilter(f => f); // trigger rerender
  };

  const canJoinMeeting = (session) => {
    if (session.status !== 'upcoming') return false;
    const sessionDateTime = new Date(`${session.date} ${session.time}`);
    const now = new Date();
    const timeDiff = sessionDateTime.getTime() - now.getTime();
    return timeDiff <= 15 * 60 * 1000; // 15 minutes before
  };

  const openDetails = (session) => {
    setSelectedSession(session);
    setShowDetailsModal(true);
  };

  const openReschedule = (session) => {
    setSelectedSession(session);
    setNewDate(session.date);
    setNewTime(session.time);
    setShowRescheduleModal(true);
  };

  const openStudentProfile = (studentId) => {
    setSelectedStudentId(studentId);
    setShowStudentProfile(true);
  };

  const handleReschedule = () => {
    if (selectedSession && newDate && newTime) {
      // In a real app, this would update the session in the database
      alert(`Session rescheduled to ${newDate} at ${newTime}`);
      setShowRescheduleModal(false);
      setSelectedSession(null);
    }
  };


  const joinMeeting = (session) => {
    window.open(`/meeting/${session.meetingRoomId}`, '_blank');
  };

  const totalEarnings = tutorSessionsList
    .filter(s => s.status === 'completed')
    .reduce((sum, s) => sum + (s.earnings || 0), 0);

  const upcomingCount = tutorSessionsList.filter(s => s.status === 'upcoming').length;
  const completedCount = tutorSessionsList.filter(s => s.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
        <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Sessions</h1>
              <p className="text-gray-600 mt-2">View and manage your tutoring sessions</p>
        </div>
            <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Filter:</span>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)} 
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            <option value="all">All Sessions</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">📅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-gray-900">{upcomingCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-xl">✓</span>
                </div>
            <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-xl">$</span>
                </div>
            <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">RM {totalEarnings}</p>
            </div>
          </div>
        </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-xl">★</span>
                </div>
            <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{tutor.rating}</p>
            </div>
          </div>
        </div>
      </div>

          {/* Sessions List */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
        </div>
            
        {filteredSessions.length ? (
          <div className="divide-y divide-gray-200">
            {filteredSessions.map((session) => (
                  <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{session.topic}</h3>
                              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                session.status === 'upcoming' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {session.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Student:</span> 
                                  <button
                                    onClick={() => openStudentProfile(session.studentId)}
                                    className="ml-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                  >
                                    {session.studentName}
                                  </button>
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Subject:</span> {session.subject}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Date & Time:</span> {session.date} at {session.time}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Duration:</span> {session.duration} minutes
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Price:</span> RM {session.price}
                                </p>
                                {session.status === 'completed' && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Earnings:</span> RM {session.earnings}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600">
                                  <span className="font-medium">Meeting Room:</span> {session.meetingRoomId}
                                </p>
                                {session.status === 'completed' && session.rating && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-sm font-medium text-gray-600">Rating:</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-sm ${i < session.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                          ⭐
                                        </span>
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-600">({session.rating}/5)</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {session.sessionNotes && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-1">Session Notes:</p>
                                <p className="text-sm text-gray-600">{session.sessionNotes}</p>
                              </div>
                            )}

                            {session.status === 'completed' && session.sessionSummary && (
                              <div className="bg-green-50 rounded-lg p-3 mb-4">
                                <p className="text-sm font-medium text-green-700 mb-1">Session Summary:</p>
                                <p className="text-sm text-green-600">{session.sessionSummary}</p>
                              </div>
                            )}

                            {session.status === 'completed' && session.feedback && (
                              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                                <p className="text-sm font-medium text-blue-700 mb-1">Student Feedback:</p>
                                <p className="text-sm text-blue-600 italic">"{session.feedback}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                  </div>

                      <div className="flex flex-col gap-2 ml-4">
                        {session.status === 'upcoming' && (
                          <>
                            {canJoinMeeting(session) ? (
                              <button
                                onClick={() => joinMeeting(session)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                              >
                                Join Meeting
                              </button>
                            ) : (
                              <button
                                disabled
                                className="bg-gray-300 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed"
                              >
                                Join Meeting (15 min before)
                              </button>
                            )}
                            
                            <Link
                              to="/tutor/messages"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-block text-center"
                            >
                              Contact Student
                            </Link>
                            
                            {session.canReschedule && (
                              <button
                                onClick={() => openReschedule(session)}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                              >
                                Reschedule
                              </button>
                            )}
                          </>
                        )}

                        {session.status === 'completed' && (
                          <>
                            {session.followUpNeeded && (
                              <Link
                                to="/tutor/messages"
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-block text-center"
                              >
                                Follow-up Needed
                              </Link>
                            )}
                            
                            <Link
                              to="/tutor/messages"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors inline-block text-center"
                            >
                              Contact Student
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => openDetails(session)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                          View Details
                        </button>

                    {session.status === 'upcoming' && (
                          <button
                            onClick={() => handleUpdateStatus(session.id, 'completed')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                          >
                            Mark Complete
                          </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {filter === 'all' ? 'No sessions found.' : `No ${filter} sessions found.`}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {filter === 'upcoming' ? 'Check back later for new bookings' : 'Your completed sessions will appear here'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Session Details Modal */}
        {showDetailsModal && selectedSession && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowDetailsModal(false)} />
            <div className="relative z-50 w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-xl overflow-hidden">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Session Details</h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Topic</p>
                          <p className="text-sm text-gray-900">{selectedSession.topic}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Subject</p>
                          <p className="text-sm text-gray-900">{selectedSession.subject}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Student</p>
                          <p className="text-sm text-gray-900">{selectedSession.studentName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Duration</p>
                          <p className="text-sm text-gray-900">{selectedSession.duration} minutes</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Date & Time</p>
                          <p className="text-sm text-gray-900">{selectedSession.date} at {selectedSession.time}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Price</p>
                          <p className="text-sm text-gray-900">RM {selectedSession.price}</p>
                        </div>
                      </div>
                    </div>

                    {selectedSession.preparationMaterials && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Preparation Materials</h3>
                        <ul className="space-y-2">
                          {selectedSession.preparationMaterials.map((material, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📄</span>
                              {material}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedSession.sessionNotes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Notes</h3>
                        <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedSession.sessionNotes}</p>
                      </div>
                    )}

                    {selectedSession.status === 'completed' && selectedSession.sessionSummary && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Summary</h3>
                        <p className="text-sm text-gray-700 bg-green-50 rounded-lg p-3">{selectedSession.sessionSummary}</p>
                      </div>
                    )}

                    {selectedSession.status === 'completed' && selectedSession.feedback && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Feedback</h3>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < selectedSession.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({selectedSession.rating}/5)</span>
                          </div>
                          <p className="text-sm text-gray-700 italic">"{selectedSession.feedback}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedSession && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowRescheduleModal(false)} />
            <div className="relative z-50 w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Reschedule Session</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReschedule}
                  className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                >
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Student Profile Modal */}
        <StudentProfileModal
          studentId={selectedStudentId}
          open={showStudentProfile}
          onClose={() => {
            setShowStudentProfile(false);
            setSelectedStudentId(null);
          }}
        />
      </div>
    </div>
  );
}
