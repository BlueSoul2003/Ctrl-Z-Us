import React, { useState, useMemo } from 'react';
import { messages, users, addMessage } from '../mockData.js';
import StudentProfileModal from '../components/StudentProfileModal.jsx';

export default function TutorMessages({ user }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [showStudentProfile, setShowStudentProfile] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // Get unique students who have messaged this tutor
  const students = useMemo(() => {
    const studentIds = [...new Set(messages
      .filter(m => m.receiverId === user.id)
      .map(m => m.senderId)
    )];
    return users.filter(u => studentIds.includes(u.id));
  }, [user.id]);

  // Get messages with selected student
  const conversationMessages = useMemo(() => {
    if (!selectedStudent) return [];
    return messages.filter(m => 
      (m.senderId === user.id && m.receiverId === selectedStudent.id) ||
      (m.senderId === selectedStudent.id && m.receiverId === user.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [selectedStudent, user.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedStudent) return;

    const message = {
      senderId: user.id,
      receiverId: selectedStudent.id,
      text: newMessage.trim(),
      senderName: user.name,
      receiverName: selectedStudent.name,
    };

    addMessage(message);
    setNewMessage('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const openStudentProfile = (studentId, e) => {
    e.stopPropagation(); // Prevent triggering the student selection
    setSelectedStudentId(studentId);
    setShowStudentProfile(true);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with your students.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Students List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Students</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {students.map((student) => {
                const lastMessage = messages
                  .filter(m => 
                    (m.senderId === user.id && m.receiverId === student.id) ||
                    (m.senderId === student.id && m.receiverId === user.id)
                  )
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                      selectedStudent?.id === student.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => openStudentProfile(student.id, e)}
                        className="hover:opacity-80 transition-opacity"
                        title="View student profile"
                      >
                        <img
                          src={student.avatarUrl}
                          alt={`${student.name} avatar`}
                          className="h-10 w-10 rounded-full ring-1 ring-gray-300 hover:ring-2 hover:ring-blue-500"
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        {lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {lastMessage.senderId === user.id ? 'You: ' : ''}
                            {lastMessage.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-96">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedStudent.avatarUrl}
                    alt={`${selectedStudent.name} avatar`}
                    className="h-8 w-8 rounded-full ring-1 ring-gray-300"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{selectedStudent.name}</h3>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">Select a student to start messaging</p>
              </div>
            </div>
          )}
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
    </div>
  );
}
