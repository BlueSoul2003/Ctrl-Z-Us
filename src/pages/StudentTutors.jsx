import React, { useState, useMemo } from 'react';
import { users, sessions, bookAvailabilitySlot } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentTutors({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minRating, setMinRating] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState('');
  const [availableTime, setAvailableTime] = useState('');
  const [favorites, setFavorites] = useState(new Set());

  const [modalOpen, setModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTutorId, setSelectedTutorId] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [sessionType, setSessionType] = useState('One-to-one');
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState('');
  const [refresh, setRefresh] = useState(0);

  const tutors = useMemo(() => 
    users.filter(u => u.role === 'tutor' && u.status === 'approved'),
    [refresh]
  );

  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutor.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tutor.bio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = !selectedSubject || tutor.subject === selectedSubject;
      const matchesPrice = tutor.pricePerHour >= priceRange[0] && tutor.pricePerHour <= priceRange[1];
      const matchesRating = tutor.rating >= minRating;
      const matchesExperience = !experienceLevel || tutor.experience === experienceLevel;
      
      return matchesSearch && matchesSubject && matchesPrice && matchesRating && matchesExperience;
    });
  }, [tutors, searchTerm, selectedSubject, priceRange, minRating, experienceLevel]);

  const subjects = [...new Set(tutors.map(t => t.subject))];

  const upcoming = useMemo(() => sessions.filter(s => s.studentId === user.id && s.status === 'upcoming'), [refresh, user.id]);
  const past = useMemo(() => sessions.filter(s => s.studentId === user.id && s.status === 'completed'), [refresh, user.id]);

  const openBooking = (tutorId) => {
    setSelectedTutorId(tutorId);
    setSelectedSlotId('');
    setSessionType('One-to-one');
    setRemarks('');
    setModalOpen(true);
  };

  const openDetails = (tutorId) => {
    setSelectedTutorId(tutorId);
    setDetailsModalOpen(true);
  };

  const confirmBooking = () => {
    const tutor = users.find(u => u.id === selectedTutorId);
    if (!tutor || !selectedSlotId) return;
    const newSession = bookAvailabilitySlot({ student: user, tutorId: tutor.id, slotId: selectedSlotId, sessionType, remarks });
    if (newSession) {
      setModalOpen(false);
      setToast('Session booked successfully');
      setTimeout(() => setToast(''), 2500);
      setRefresh(v => v + 1);
    }
  };

  const toggleFavorite = (tutorId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(tutorId)) {
        newFavorites.delete(tutorId);
      } else {
        newFavorites.add(tutorId);
      }
      return newFavorites;
    });
  };


  const canJoinMeeting = (session) => {
    const sessionDateTime = new Date(`${session.date} ${session.time}`);
    const now = new Date();
    const fifteenMinutesBefore = new Date(sessionDateTime.getTime() - 15 * 60000);
    return now >= fifteenMinutesBefore && now <= sessionDateTime;
  };

  const joinMeeting = (session) => {
    // In a real app, this would open the meeting room
    alert(`Joining meeting room: ${session.meetingRoomId}`);
  };

  const testConnection = () => {
    alert('Testing your connection... All good!');
  };

  const rebookSession = (tutorId) => {
    openBooking(tutorId);
  };

  const rateSession = (sessionId) => {
    // In a real app, this would open a rating modal
    alert(`Rate session: ${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Tutors</h1>
          <p className="text-gray-600 mt-2">Connect with expert tutors for personalized learning sessions. You will gain 60 points per hour of session.</p>
        </header>

        {/* Enhanced Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Tutors</label>
              <input
                type="text"
                placeholder="Search by name, subject, or bio..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
              >
                <option value="">Any Experience</option>
                <option value="1+ years">1+ years</option>
                <option value="3+ years">3+ years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: RM {priceRange[0]} - RM {priceRange[1]}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="flex-1"
              />
            </div>
          </div>
        </div>


        {/* Enhanced Tutors Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {filteredTutors.map((tutor) => (
            <div key={tutor.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={tutor.avatarUrl}
                    alt={`${tutor.name} avatar`}
                    className="h-16 w-16 rounded-full ring-1 ring-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{tutor.name}</h3>
                    <p className="text-sm text-gray-600">{tutor.subject}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-sm text-gray-600">{tutor.rating}</span>
                      <span className="ml-2 text-sm text-gray-500">• RM {tutor.pricePerHour}/hr</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(tutor.id)}
                  className={`p-2 rounded-full transition-colors ${
                    favorites.has(tutor.id) 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  ♥
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Next:</span>
                  <span className="ml-2 text-green-600">{tutor.nextAvailable}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Responds in:</span>
                  <span className="ml-2">{tutor.responseTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Languages:</span>
                  <span className="ml-2">{tutor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Experience:</span>
                  <span className="ml-2">{tutor.experience}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutor.bio}</p>
              
              {tutor.latestReview && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 italic">"{tutor.latestReview}"</p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {tutor.totalSessions} sessions completed
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openDetails(tutor.id)}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Message
                  </button>
                  <button
                    onClick={() => openBooking(tutor.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Book Session
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced My Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Upcoming Sessions</h2>
            {upcoming.length ? (
              <div className="space-y-4">
                {upcoming.map(session => (
                  <div key={session.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                        <p className="text-sm text-gray-600">{session.tutorName} • {session.subject}</p>
                        <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                        <p className="text-xs text-gray-500 mt-1">Duration: {session.duration} minutes</p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Upcoming
                      </span>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-blue-900">Meeting Room: {session.meetingRoomId}</p>
                      <p className="text-xs text-blue-700 mt-1">Meeting link active 15 minutes before start</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => joinMeeting(session)}
                        disabled={!canJoinMeeting(session)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          canJoinMeeting(session)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canJoinMeeting(session) ? 'Join Meeting' : 'Join Meeting (15 min before)'}
                      </button>
                      <button
                        onClick={testConnection}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Test Connection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-gray-500">No upcoming sessions</p>
              </div>
            )}
          </div>

          {/* Past Sessions */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Past Sessions</h2>
            {past.length ? (
              <div className="space-y-4">
                {past.map(session => (
                  <div key={session.id} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                        <p className="text-sm text-gray-600">{session.tutorName} • {session.subject}</p>
                        <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                        <p className="text-xs text-gray-500 mt-1">Duration: {session.duration} minutes</p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Completed
                      </span>
                    </div>
                    
                    {session.sessionNotes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600 font-medium">Session Notes:</p>
                        <p className="text-xs text-gray-600 mt-1">{session.sessionNotes}</p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {session.rating ? (
                          <div className="flex items-center">
                            <span className="text-yellow-400">★</span>
                            <span className="ml-1 text-sm text-gray-600">{session.rating}/5</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => rateSession(session.id)}
                            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                          >
                            Rate Session
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => rebookSession(session.tutorId)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        Rebook with {session.tutorName}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📚</div>
                <p className="text-gray-500">No past sessions</p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Booking Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" onClick={() => setModalOpen(false)} />
            <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              {(() => {
                const tutor = users.find(u => u.id === selectedTutorId);
                if (!tutor) return null;
                const availableSlots = (tutor.availability || []).filter(s => !s.booked);
                return (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src={tutor.avatarUrl} alt={`${tutor.name} avatar`} className="h-14 w-14 rounded-full ring-1 ring-gray-300" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                        <p className="text-sm text-gray-600">{tutor.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">{tutor.rating}</span>
                          <span className="text-sm text-gray-500">• RM {tutor.pricePerHour}/hr</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{tutor.bio}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Response Time:</span>
                        <span className="ml-2">{tutor.responseTime}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Languages:</span>
                        <span className="ml-2">{tutor.languages.join(', ')}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Available time slots</h4>
                      {availableSlots.length ? (
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {availableSlots.map(slot => (
                            <label key={slot.id} className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name="slot"
                                value={slot.id}
                                checked={selectedSlotId === slot.id}
                                onChange={(e) => setSelectedSlotId(e.target.value)}
                                className="h-4 w-4"
                              />
                              <span>{slot.date} • {slot.start}-{slot.end}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No available slots</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Session type</label>
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={sessionType}
                          onChange={(e) => setSessionType(e.target.value)}
                        >
                          <option>One-to-one</option>
                          <option>Group</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea
                          rows={3}
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Anything your tutor should know..."
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setModalOpen(false)}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmBooking}
                        disabled={!selectedSlotId}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Tutor Details Modal */}
        {detailsModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" aria-hidden="true" onClick={() => setDetailsModalOpen(false)} />
            <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl overflow-hidden">
              {(() => {
                const tutor = users.find(u => u.id === selectedTutorId);
                if (!tutor) return null;
                const availableSlots = (tutor.availability || []).filter(s => !s.booked);
                
                return (
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <img src={tutor.avatarUrl} alt={`${tutor.name} avatar`} className="h-16 w-16 rounded-full ring-1 ring-gray-300" />
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{tutor.name}</h2>
                          <p className="text-gray-600">{tutor.subject}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1 text-sm text-gray-600">{tutor.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">RM {tutor.pricePerHour}/hr</span>
                            <span className="text-sm text-gray-500">{tutor.totalSessions} sessions</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setDetailsModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                      >
                        ×
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Bio */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                            <p className="text-gray-700 leading-relaxed">{tutor.bio}</p>
                          </div>

                          {/* Education */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
                            <div className="space-y-2">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-medium text-gray-900">PhD in Applied Mathematics</p>
                                <p className="text-sm text-gray-600">University of Technology Malaysia</p>
                                <p className="text-xs text-gray-500">2018-2022</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-medium text-gray-900">BSc in Mathematics</p>
                                <p className="text-sm text-gray-600">National University of Singapore</p>
                                <p className="text-xs text-gray-500">2014-2018</p>
                              </div>
                            </div>
                          </div>

                          {/* Teaching Experience */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Teaching Experience</h3>
                            <div className="space-y-2">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-medium text-gray-900">Online Tutor</p>
                                <p className="text-sm text-gray-600">Tutorly Platform</p>
                                <p className="text-xs text-gray-500">2022 - Present • {tutor.experience}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="font-medium text-gray-900">Teaching Assistant</p>
                                <p className="text-sm text-gray-600">University of Technology Malaysia</p>
                                <p className="text-xs text-gray-500">2019-2022</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* Certificates */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Certificates</h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-gray-100 rounded-lg p-4 text-center">
                                <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">Certificate 1</span>
                                </div>
                                <p className="text-xs text-gray-600">Mathematics Teaching</p>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-4 text-center">
                                <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">Certificate 2</span>
                                </div>
                                <p className="text-xs text-gray-600">Online Education</p>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-4 text-center">
                                <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">Certificate 3</span>
                                </div>
                                <p className="text-xs text-gray-600">Student Mentoring</p>
                              </div>
                              <div className="bg-gray-100 rounded-lg p-4 text-center">
                                <div className="w-full h-24 bg-gray-200 rounded mb-2 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">Certificate 4</span>
                                </div>
                                <p className="text-xs text-gray-600">Advanced Calculus</p>
                              </div>
                            </div>
                          </div>

                          {/* Student Reviews */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Reviews</h3>
                            <div className="space-y-3">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex text-yellow-400">
                                    ★★★★★
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">Sarah M.</span>
                                </div>
                                <p className="text-sm text-gray-700">"Excellent explanations! Made calculus so much clearer. Highly recommend!"</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex text-yellow-400">
                                    ★★★★☆
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">John D.</span>
                                </div>
                                <p className="text-sm text-gray-700">"Great tutor, very patient and helpful with problem solving."</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex text-yellow-400">
                                    ★★★★★
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">Emma L.</span>
                                </div>
                                <p className="text-sm text-gray-700">"Amazing teaching style! Really helped me understand complex concepts."</p>
                              </div>
                            </div>
                          </div>

                          {/* Available Time Slots */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Available Time Slots</h3>
                            {availableSlots.length ? (
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {availableSlots.map(slot => (
                                  <div key={slot.id} className="bg-gray-50 rounded-lg p-3">
                                    <p className="font-medium text-gray-900">{slot.date}</p>
                                    <p className="text-sm text-gray-600">{slot.start} - {slot.end}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No available slots</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Languages: {tutor.languages.join(', ')}</span>
                        <span>•</span>
                        <span>Responds in: {tutor.responseTime}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setDetailsModalOpen(false)}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          Close
                        </button>
                        <button
                          onClick={() => {
                            setDetailsModalOpen(false);
                            openBooking(tutor.id);
                          }}
                          className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-40 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            {toast}
          </div>
        )}
      </div>

      <FloatingAiChatbot user={user} />
    </div>
  );
}