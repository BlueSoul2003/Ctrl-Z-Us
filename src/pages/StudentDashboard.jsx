import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { users, sessions, modules, petData } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentDashboard({ user, onUpdatePoints }) {
  const completedModules = useMemo(() => modules.filter(m => m.completed), []);
  const upcomingSessions = useMemo(() => sessions.filter(s => s.studentId === user.id && s.status === 'upcoming'), [user.id]);
  const completedSessions = useMemo(() => sessions.filter(s => s.studentId === user.id && s.status === 'completed'), [user.id]);
  const currentModule = useMemo(() => modules.find(m => m.progress > 0 && m.progress < 100), []);

  // Mock learning data for the chart
  const learningData = [
    { week: 'Week 1', hours: 8 },
    { week: 'Week 2', hours: 12 },
    { week: 'Week 3', hours: 6 },
    { week: 'Week 4', hours: 15 },
    { week: 'Week 5', hours: 10 },
    { week: 'Week 6', hours: 18 },
    { week: 'Week 7', hours: 14 }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                  <p className="text-gray-600 mt-1">Here's your learning progress and upcoming sessions.</p>
                </div>
                <Link
                  to="/student/tutors"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Book New Session
                </Link>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xl">📚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Modules Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{completedModules.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600 font-semibold text-xl">⏰</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{upcomingSessions.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">{completedSessions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Hub */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Learning Hub</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Weekly Learning Hours</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={learningData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="hours" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-700 mb-4">Current Module</h3>
                  {currentModule ? (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{currentModule.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{currentModule.subject} • {currentModule.level}</p>
                      <div className="mt-4">
                        <Link 
                          to="/student/modules" 
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Continue Learning →
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-500">No active module</p>
                      <Link to="/student/modules" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Browse modules
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
              {upcomingSessions.length > 0 ? (
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{session.topic}</h3>
                          <p className="text-sm text-gray-600">with {session.tutorName} • {session.subject}</p>
                          <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          Upcoming
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No upcoming sessions</p>
                  <Link to="/student/tutors" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Book a session
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pet Game Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet Game</h3>
              <div className="text-center">
                <div className="text-4xl mb-2">{petData.emoji}</div>
                <p className="text-sm text-gray-600 mb-2">{petData.name}</p>
                <p className="text-sm text-gray-500 mb-4">Happiness: {petData.happiness}%</p>
                <Link
                  to="/student/pet"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Feed Pet
                </Link>
              </div>
            </div>

            {/* Points/Rewards Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Points & Rewards</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{user.points}</div>
                <p className="text-sm text-gray-600 mb-4">points earned</p>
                <Link
                  to="/student/modules"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Redeem Rewards
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingAiChatbot user={user} />
    </div>
  );
}
