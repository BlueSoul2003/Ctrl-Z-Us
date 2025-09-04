import React, { useMemo, useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import { users, petData } from './mockData.js';

// Lazy load pages
const LandingPage = React.lazy(() => import('./pages/LandingPage.jsx'));
const SignIn = React.lazy(() => import('./pages/SignIn.jsx'));
const SignUp = React.lazy(() => import('./pages/SignUp.jsx'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard.jsx'));
const StudentModules = React.lazy(() => import('./pages/StudentModules.jsx'));
const StudentTutors = React.lazy(() => import('./pages/StudentTutors.jsx'));
const StudentPetGame = React.lazy(() => import('./pages/StudentPetGame.jsx'));
const StudentChat = React.lazy(() => import('./pages/StudentChat.jsx'));
const Messages = React.lazy(() => import('./pages/Messages.jsx'));
const TutorDashboard = React.lazy(() => import('./pages/TutorDashboard.jsx'));
const TutorSessions = React.lazy(() => import('./pages/TutorSessions.jsx'));
const TutorMessages = React.lazy(() => import('./pages/TutorMessages.jsx'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminTutors = React.lazy(() => import('./pages/AdminTutors.jsx'));
const AdminUsers = React.lazy(() => import('./pages/AdminUsers.jsx'));

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [pet, setPet] = useState(petData);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const refreshUserFromStore = () => {
    if (!currentUser) return;
    const fresh = users.find(u => u.id === currentUser.id);
    if (fresh) {
      setCurrentUser(fresh);
      localStorage.setItem('currentUser', JSON.stringify(fresh));
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleUpdatePoints = (newPoints) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, points: newPoints };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const handleUpdatePet = (newPet) => {
    setPet(newPet);
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!currentUser) return <Navigate to="/signin" replace />;
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {currentUser && (
        <Header user={currentUser} onLogout={handleLogout} onOpenProfile={() => setProfileOpen(true)} />
      )}
      <main id="main" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8" tabIndex={-1}>
        <React.Suspense fallback={<div role="status" aria-live="polite" className="p-4">Loading…</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />

            <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard user={currentUser} onUpdatePoints={handleUpdatePoints} /></ProtectedRoute>} />
            <Route path="/student/modules" element={<ProtectedRoute allowedRoles={['student']}><StudentModules user={currentUser} onUpdatePoints={handleUpdatePoints} /></ProtectedRoute>} />
            <Route path="/student/tutors" element={<ProtectedRoute allowedRoles={['student']}><StudentTutors user={currentUser} /></ProtectedRoute>} />
            <Route path="/student/pet" element={<ProtectedRoute allowedRoles={['student']}><StudentPetGame user={currentUser} onUpdatePoints={handleUpdatePoints} pet={pet} onUpdatePet={handleUpdatePet} /></ProtectedRoute>} />
            <Route path="/student/chat" element={<ProtectedRoute allowedRoles={['student']}><StudentChat user={currentUser} /></ProtectedRoute>} />
            <Route path="/student/messages" element={<ProtectedRoute allowedRoles={['student']}><Messages user={currentUser} /></ProtectedRoute>} />

            <Route path="/tutor" element={<ProtectedRoute allowedRoles={['tutor']}><TutorDashboard user={currentUser} /></ProtectedRoute>} />
            <Route path="/tutor/sessions" element={<ProtectedRoute allowedRoles={['tutor']}><TutorSessions user={currentUser} /></ProtectedRoute>} />
            <Route path="/tutor/messages" element={<ProtectedRoute allowedRoles={['tutor']}><TutorMessages user={currentUser} /></ProtectedRoute>} />

            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard user={currentUser} /></ProtectedRoute>} />
            <Route path="/admin/tutors" element={<ProtectedRoute allowedRoles={['admin']}><AdminTutors user={currentUser} /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers user={currentUser} /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </main>

      {currentUser && (
        <ProfileModal
          user={currentUser}
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          onSaved={refreshUserFromStore}
        />
      )}
    </div>
  );
}