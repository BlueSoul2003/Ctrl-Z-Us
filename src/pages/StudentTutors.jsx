import React, { useState, useMemo } from 'react';
import { users, sessions, bookAvailabilitySlot } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentTutors({ user }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
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
      return matchesSearch && matchesSubject;
    });
  }, [tutors, searchTerm, selectedSubject]);

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

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Find Tutors</h1>
        <p className="text-gray-600">Connect with expert tutors for personalized learning sessions.</p>
      </header>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Tutors
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, subject, or bio..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Subject
            </label>
            <select
              id="subject"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tutors Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <img
                src={tutor.avatarUrl}
                alt={`${tutor.name} avatar`}
                className="h-16 w-16 rounded-full ring-1 ring-gray-300"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                <p className="text-sm text-gray-600">{tutor.subject}</p>
                <div className="flex items-center mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm text-gray-600">{tutor.rating}</span>
                  <span className="ml-2 text-sm text-gray-500">• RM {tutor.pricePerHour}/hr</span>
                </div>
              </div>
            </div>
            
            <p className="mt-4 text-sm text-gray-600 line-clamp-3">{tutor.bio}</p>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {tutor.totalSessions} sessions completed
              </div>
              <button
                onClick={() => openBooking(tutor.id)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* My Sessions */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Sessions</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Upcoming</h3>
            {upcoming.length ? (
              <ul className="space-y-2">
                {upcoming.map(s => (
                  <li key={s.id} className="rounded-md border border-gray-200 p-3">
                    <p className="font-medium text-gray-900">{s.topic}</p>
                    <p className="text-sm text-gray-600">{s.tutorName} • {s.subject}</p>
                    <p className="text-sm text-gray-500">{s.date} at {s.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No upcoming sessions</p>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Past</h3>
            {past.length ? (
              <ul className="space-y-2">
                {past.map(s => (
                  <li key={s.id} className="rounded-md border border-gray-200 p-3">
                    <p className="font-medium text-gray-900">{s.topic}</p>
                    <p className="text-sm text-gray-600">{s.tutorName} • {s.subject}</p>
                    <p className="text-sm text-gray-500">{s.date} at {s.time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No past sessions</p>
            )}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
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
                  <div className="flex items-center gap-3">
                    <img src={tutor.avatarUrl} alt={`${tutor.name} avatar`} className="h-14 w-14 rounded-full ring-1 ring-gray-300" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{tutor.name}</h3>
                      <p className="text-sm text-gray-600">{tutor.subject}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">{tutor.bio}</p>
                  {tutor.certificateName && (
                    <p className="mt-1 text-xs text-gray-500">Certificate: {tutor.certificateName}</p>
                  )}

                  <div className="mt-4">
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

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Session type</label>
                      <select
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Anything your tutor should know..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-2">
                    <button
                      onClick={() => setModalOpen(false)}
                      className="rounded-md px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBooking}
                      disabled={!selectedSlotId}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-40 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      <FloatingAiChatbot user={user} />
    </div>
  );
}
