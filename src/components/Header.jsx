import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ user, onLogout, onOpenProfile }) {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-blue-50'
    }`;

  const getRoleBasedNavLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'student':
        return (
          <>
            <NavLink to="/student" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/student/modules" className={navLinkClass}>
              Modules
            </NavLink>
            <NavLink to="/student/tutors" className={navLinkClass}>
              Find Tutors
            </NavLink>
            <NavLink to="/student/messages" className={navLinkClass}>
              Messages
            </NavLink>
            <NavLink to="/student/pet" className={navLinkClass}>
              Pet Game
            </NavLink>
            <NavLink to="/student/chat" className={navLinkClass}>
              AI Chatbot
            </NavLink>
          </>
        );
      case 'tutor':
        return (
          <>
            <NavLink to="/tutor" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tutor/sessions" className={navLinkClass}>
              Sessions
            </NavLink>
            <NavLink to="/tutor/messages" className={navLinkClass}>
              Messages
            </NavLink>
          </>
        );
      case 'admin':
        return (
          <>
            <NavLink to="/admin" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/tutors" className={navLinkClass}>
              Manage Tutors
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              Manage Users
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200" role="banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Tutorly home"
            >
              <div className="select-none">
                <span className="text-xl font-extrabold tracking-tight text-blue-700">Tutor</span>
                <span className="text-xl font-extrabold tracking-tight text-gray-900">ly</span>
              </div>
            </Link>
            <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
              {getRoleBasedNavLinks()}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700" aria-live="polite">
              <span className="sr-only">Current user:</span>
              {user?.name}
              {user?.role && (
                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 capitalize">
                  {user.role}
                </span>
              )}
              {typeof user?.points === 'number' && (
                <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700" aria-label={`Points ${user.points}`}>
                  {user.points} pts
                </span>
              )}
            </div>

            <button onClick={onOpenProfile} className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Open profile">
              <img
                src={user?.avatarUrl}
                alt={`${user?.name || 'User'} avatar`}
                className="h-8 w-8 rounded-full ring-1 ring-gray-300"
              />
            </button>

            <button
              onClick={onLogout}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <nav aria-label="Primary mobile" className="md:hidden border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-2 py-2 flex flex-wrap gap-2">
          {getRoleBasedNavLinks()}
        </div>
      </nav>
    </header>
  );
}
