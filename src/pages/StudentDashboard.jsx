import React from 'react';
import { Link } from 'react-router-dom';
import { sessions, modules, petData, feedPet } from '../mockData.js';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentDashboard({ user, onUpdatePoints }) {
  // Get user's sessions
  const userSessions = sessions.filter(s => s.studentId === user.id);
  const upcomingSessions = userSessions.filter(s => s.status === 'upcoming');
  const completedSessions = userSessions.filter(s => s.status === 'completed');

  // Get user's modules progress
  const completedModules = modules.filter(m => m.completed);
  const inProgressModules = modules.filter(m => !m.completed && m.progress > 0);
  const totalProgress = modules.length > 0 ? Math.round((completedModules.length / modules.length) * 100) : 0;

  // Mock weekly study time (hours)
  const weeklyStudy = [
    { day: 'Mon', hours: 1.5 },
    { day: 'Tue', hours: 2.1 },
    { day: 'Wed', hours: 1.2 },
    { day: 'Thu', hours: 2.8 },
    { day: 'Fri', hours: 1.9 },
    { day: 'Sat', hours: 0.8 },
    { day: 'Sun', hours: 1.6 },
  ];

  const petStatus = petData.happiness >= 80 ? 'Happy' : petData.happiness >= 50 ? 'Full' : 'Hungry';
  const petEmoji = petData.happiness >= 80 ? '😊' : petData.happiness >= 50 ? '🙂' : '😟';

  const handleFeedPet = () => {
    const cost = 20;
    if (user.points >= cost) {
      feedPet(cost);
      onUpdatePoints(user.points - cost);
    }
  };

  return (
    <div className="space-y-8">
      <header className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Here's your learning progress and upcoming sessions.</p>
          <div className="mt-4 flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-600">Points</p>
              <p className="text-3xl font-extrabold text-green-600">{user.points}</p>
            </div>
            <Link
              to="/student/pet"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              Open Pet Game
            </Link>
          </div>
        </div>

        {/* Pet widget */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Pet</h3>
              <p className="text-sm text-gray-600">Status: <span className="font-medium">{petStatus}</span></p>
            </div>
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center text-3xl">
              {petEmoji}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Happiness</span>
              <span>{petData.happiness}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${petData.happiness}%` }} />
            </div>
          </div>
          <button
            type="button"
            onClick={handleFeedPet}
            disabled={user.points < 20}
            className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              user.points >= 20 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Feed pet (costs 20 points)"
          >
            Feed (-20)
          </button>
        </div>
      </header>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">📚</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modules Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{completedModules.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">📈</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overall Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{totalProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-sm">📅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingSessions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold text-sm">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{completedSessions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress with gradient + motion */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Learning Progress</h2>
          <Link
            to="/student/modules"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Modules
          </Link>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{totalProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500"
            />
          </div>
        </div>

        {/* Study time chart */}
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyStudy} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(v) => `${v}h`} />
              <Tooltip formatter={(v) => [`${v} h`, 'Study']} />
              <Area type="monotone" dataKey="hours" stroke="#2563eb" fillOpacity={1} fill="url(#colorHours)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Module cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {inProgressModules.slice(0, 2).map((module) => (
            <div key={module.id} className="border border-gray-200 rounded-xl p-4">
              <h3 className="font-medium text-gray-900">{module.title}</h3>
              <p className="text-sm text-gray-600">{module.subject} • {module.level}</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full" 
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions - card layout */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
          <Link
            to="/student/tutors"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Book New Session
          </Link>
        </div>
        
        {userSessions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userSessions.map((session) => (
              <div key={session.id} className="rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                    <p className="text-sm text-gray-600">{session.subject} • {session.tutorName}</p>
                    <p className="text-sm text-gray-500 mt-1">{session.date} at {session.time} • {session.duration} min</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {session.status === 'completed' ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No sessions</p>
            <Link
              to="/student/tutors"
              className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Find a Tutor
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          to="/student/modules"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Learning Modules</h3>
              <p className="text-sm text-gray-600">Continue your studies</p>
            </div>
          </div>
        </Link>

        <Link
          to="/student/tutors"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-semibold">👨‍🏫</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Find Tutors</h3>
              <p className="text-sm text-gray-600">Book a session</p>
            </div>
          </div>
        </Link>

        <Link
          to="/student/pet"
          className="bg-white rounded-2xl border border-gray-200 p-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-semibold">🐾</span>
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Pet Game</h3>
              <p className="text-sm text-gray-600">Care for your pet</p>
            </div>
          </div>
        </Link>
      </div>

      <FloatingAiChatbot user={user} />
    </div>
  );
}