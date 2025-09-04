// Comprehensive mock data for Tutorly platform
// All data resets on page refresh (no persistence)

// Registered users (includes students, tutors, and admin)
export const users = [
  {
    id: 'user_1',
    name: 'Alice Chen',
    email: 'alice@student.com',
    password: 'password123',
    role: 'student',
    points: 120,
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Alice',
    joinedDate: '2024-01-15',
    progress: 65, // percentage
  },
  {
    id: 'user_2',
    name: 'Dr. Emily Zhang',
    email: 'emily@tutor.com',
    password: 'password123',
    role: 'tutor',
    subject: 'Mathematics',
    subjects: ['Mathematics', 'Computer Science'],
    rating: 4.8,
    pricePerHour: 35,
    bio: 'PhD in Applied Math. Passionate about problem solving and visual learning.',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Emily',
    status: 'approved',
    joinedDate: '2024-01-10',
    totalSessions: 45,
    availability: [
      { id: 'slot_e1', date: '2025-09-07', start: '10:00', end: '11:00', booked: false },
      { id: 'slot_e2', date: '2025-09-08', start: '14:00', end: '15:00', booked: false },
    ],
    tutorSessions: [
      { id: 'ts_e1', date: '2025-09-11', time: '10:00', subject: 'Mathematics', mode: 'Online', location: '', booked: false },
    ],
  },
  {
    id: 'user_3',
    name: 'Marcus Lee',
    email: 'marcus@tutor.com',
    password: 'password123',
    role: 'tutor',
    subject: 'Physics',
    subjects: ['Physics'],
    rating: 4.6,
    pricePerHour: 30,
    bio: 'BSc in Physics. I make complex concepts simple with analogies.',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Marcus',
    status: 'approved',
    joinedDate: '2024-01-12',
    totalSessions: 32,
    availability: [
      { id: 'slot_m1', date: '2025-09-07', start: '09:00', end: '10:00', booked: false },
      { id: 'slot_m2', date: '2025-09-09', start: '16:00', end: '17:00', booked: false },
    ],
    tutorSessions: [
      { id: 'ts_m1', date: '2025-09-12', time: '14:00', subject: 'Physics', mode: 'Offline', location: 'Room B-12', booked: false },
    ],
  },
  {
    id: 'user_4',
    name: 'Admin User',
    email: 'admin@tutorly.com',
    password: 'admin123',
    role: 'admin',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Admin',
    joinedDate: '2024-01-01',
  },
  {
    id: 'user_5',
    name: 'Sara Patel',
    email: 'sara@tutor.com',
    password: 'password123',
    role: 'tutor',
    subject: 'Chemistry',
    subjects: ['Chemistry'],
    rating: 4.4,
    pricePerHour: 28,
    bio: 'Organic chemistry enthusiast. Step-by-step methods and quizzes.',
    avatarUrl: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Sara',
    status: 'pending',
    joinedDate: '2024-01-20',
    totalSessions: 0,
    availability: [
      { id: 'slot_s1', date: '2025-09-10', start: '11:00', end: '12:00', booked: false },
    ],
    tutorSessions: [],
  },
];

// Learning modules for students
export const modules = [
  {
    id: 'mod_1',
    title: 'Algebra Fundamentals',
    subject: 'Mathematics',
    duration: '45 minutes',
    level: 'Beginner',
    description: 'Learn the basics of algebraic expressions and equations.',
    completed: true,
    progress: 100,
  },
  {
    id: 'mod_2',
    title: 'Physics - Mechanics',
    subject: 'Physics',
    duration: '60 minutes',
    level: 'Intermediate',
    description: 'Understand forces, motion, and energy in mechanical systems.',
    completed: false,
    progress: 30,
  },
  {
    id: 'mod_3',
    title: 'Organic Chemistry Basics',
    subject: 'Chemistry',
    duration: '50 minutes',
    level: 'Beginner',
    description: 'Introduction to organic compounds and their properties.',
    completed: false,
    progress: 0,
  },
  {
    id: 'mod_4',
    title: 'Calculus - Derivatives',
    subject: 'Mathematics',
    duration: '55 minutes',
    level: 'Advanced',
    description: 'Master the concept of derivatives and their applications.',
    completed: false,
    progress: 0,
  },
];

// Subjects catalog for tutor registration and filtering
export const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'History',
];

// Tutoring sessions
export const sessions = [
  {
    id: 'sess_1',
    studentId: 'user_1',
    tutorId: 'user_2',
    subject: 'Mathematics',
    date: '2024-01-25',
    time: '10:00',
    duration: 60,
    status: 'upcoming',
    topic: 'Calculus Review',
    studentName: 'Alice Chen',
    tutorName: 'Dr. Emily Zhang',
  },
  {
    id: 'sess_2',
    studentId: 'user_1',
    tutorId: 'user_3',
    subject: 'Physics',
    date: '2024-01-23',
    time: '14:00',
    duration: 60,
    status: 'completed',
    topic: 'Mechanics Problem Solving',
    studentName: 'Alice Chen',
    tutorName: 'Marcus Lee',
    rating: 5,
    feedback: 'Great session! Very helpful explanations.',
  },
  {
    id: 'sess_3',
    studentId: 'user_1',
    tutorId: 'user_2',
    subject: 'Mathematics',
    date: '2024-01-20',
    time: '09:00',
    duration: 60,
    status: 'completed',
    topic: 'Algebra Review',
    studentName: 'Alice Chen',
    tutorName: 'Dr. Emily Zhang',
    rating: 4,
    feedback: 'Good session, need more practice with quadratic equations.',
  },
];

// Chat messages
export const messages = [
  {
    id: 'msg_1',
    senderId: 'user_1',
    receiverId: 'user_2',
    text: 'Hi Dr. Zhang, can we review integrals tomorrow?',
    timestamp: '2024-01-24T10:00:00Z',
    senderName: 'Alice Chen',
    receiverName: 'Dr. Emily Zhang',
  },
  {
    id: 'msg_2',
    senderId: 'user_2',
    receiverId: 'user_1',
    text: 'Sure, does 10:00 work for you?',
    timestamp: '2024-01-24T10:02:00Z',
    senderName: 'Dr. Emily Zhang',
    receiverName: 'Alice Chen',
  },
  {
    id: 'msg_3',
    senderId: 'user_1',
    receiverId: 'user_3',
    text: 'Thank you for the physics session yesterday!',
    timestamp: '2024-01-24T08:00:00Z',
    senderName: 'Alice Chen',
    receiverName: 'Marcus Lee',
  },
];

// Group discussions for students
export const groupChats = [
  {
    id: 'group_1',
    name: 'Math Study Group',
    members: ['user_1', 'user_2'],
    messages: [
      { id: 'gm_1', senderId: 'user_1', text: 'Any tips for derivatives?', timestamp: '2024-01-24T09:00:00Z' },
      { id: 'gm_2', senderId: 'user_2', text: 'Practice chain rule problems!', timestamp: '2024-01-24T09:05:00Z' },
    ],
  },
  {
    id: 'group_2',
    name: 'Physics Discussion',
    members: ['user_1', 'user_3'],
    messages: [
      { id: 'gm_3', senderId: 'user_3', text: 'Momentum conservation examples?', timestamp: '2024-01-24T08:00:00Z' },
      { id: 'gm_4', senderId: 'user_1', text: 'Ice skaters pushing apart!', timestamp: '2024-01-24T08:06:00Z' },
    ],
  },
];

// Virtual pet data
export const petData = {
  name: 'Byte',
  level: 3,
  happiness: 68,
  lastFedAt: '2024-01-24T15:30:00Z',
  totalFed: 12,
};

// Platform statistics for admin
export const platformStats = {
  totalStudents: 156,
  totalTutors: 23,
  totalSessions: 342,
  pendingTutorApplications: 3,
  activeSessions: 8,
  totalRevenue: 12540,
};

// Mock preferences for AI suggestions
export const userPreferences = {
  user_1: {
    preferredSubjects: ['Mathematics', 'Physics'],
    difficulty: 'Intermediate',
    intro: '',
  },
};

export function updateUserProfile(userId, updates) {
  const u = users.find(x => x.id === userId);
  if (!u) return;
  if (updates.name !== undefined) u.name = updates.name;
  if (updates.email !== undefined) u.email = updates.email;
  if (updates.avatarUrl !== undefined) u.avatarUrl = updates.avatarUrl;
  if (u.role === 'student') {
    userPreferences[userId] = userPreferences[userId] || { preferredSubjects: [], difficulty: 'Beginner' };
    if (updates.preferredSubjects) userPreferences[userId].preferredSubjects = updates.preferredSubjects;
    if (updates.intro !== undefined) userPreferences[userId].intro = updates.intro;
  }
  if (u.role === 'tutor') {
    if (updates.subjectsList) u.subjects = updates.subjectsList;
    if (updates.bio !== undefined) u.bio = updates.bio;
    if (updates.certificateName !== undefined) u.certificateName = updates.certificateName;
  }
}

export function getAiRecommendations(inputText, userId = 'user_1') {
  const prefs = userPreferences[userId] || { preferredSubjects: [], difficulty: 'Beginner' };
  const text = (inputText || '').toLowerCase();
  const subjectHintFromText = subjects.find(s => text.includes(s.toLowerCase()));
  const subjectHint = subjectHintFromText || (prefs.preferredSubjects && prefs.preferredSubjects[0]);

  const recommendedModules = modules.filter(m =>
    (!subjectHint || m.subject === subjectHint) && (!prefs.difficulty || m.level.includes(prefs.difficulty))
  ).slice(0, 2);

  const recommendedTutors = users.filter(u => u.role === 'tutor' && (!subjectHint || (u.subject === subjectHint || (u.subjects || []).includes(subjectHint)))).slice(0, 2);

  return { subjectHint, recommendedModules, recommendedTutors };
}

// Helper functions for data manipulation
export function addUser(user) {
  users.push({
    ...user,
    id: `user_${Date.now()}`,
    joinedDate: new Date().toISOString().split('T')[0],
    points: user.role === 'student' ? 0 : undefined,
    progress: user.role === 'student' ? 0 : undefined,
    status: user.role === 'tutor' ? 'pending' : undefined,
    totalSessions: user.role === 'tutor' ? 0 : undefined,
    availability: user.role === 'tutor' ? [] : undefined,
    subjects: user.role === 'tutor' ? (user.subjects || (user.subject ? [user.subject] : [])) : undefined,
    tutorSessions: user.role === 'tutor' ? [] : undefined,
  });
}

export function updateTutorProfile(tutorId, { subjectsList, bio, certificateName }) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor) return;
  if (subjectsList) {
    tutor.subjects = subjectsList;
    tutor.subject = subjectsList[0] || tutor.subject;
  }
  if (typeof bio === 'string') tutor.bio = bio;
  if (certificateName !== undefined) tutor.certificateName = certificateName;
}

export function updateTutorStatus(tutorId, status) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (tutor) {
    tutor.status = status;
  }
}

export function addSession(session) {
  sessions.push({
    ...session,
    id: `sess_${Date.now()}`,
    status: 'upcoming',
  });
}

export function updateSessionStatus(sessionId, status) {
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.status = status;
  }
}

export function addMessage(message) {
  messages.push({
    ...message,
    id: `msg_${Date.now()}`,
    timestamp: new Date().toISOString(),
  });
}

export function addGroupMessage(groupId, message) {
  const group = groupChats.find(g => g.id === groupId);
  if (group) {
    group.messages.push({
      ...message,
      id: `gmsg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }
}

// Availability helpers
export function addAvailabilitySlot(tutorId, { date, start, end }) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor) return null;
  const slot = { id: `slot_${Date.now()}`, date, start, end, booked: false };
  tutor.availability = tutor.availability || [];
  tutor.availability.push(slot);
  return slot;
}

export function removeAvailabilitySlot(tutorId, slotId) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor || !tutor.availability) return;
  tutor.availability = tutor.availability.filter(s => s.id !== slotId);
}

export function bookAvailabilitySlot({ student, tutorId, slotId, sessionType = 'One-to-one', remarks = '' }) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor || !tutor.availability) return null;
  const slot = tutor.availability.find(s => s.id === slotId && !s.booked);
  if (!slot) return null;
  slot.booked = true;
  const newSession = {
    id: `sess_${Date.now()}`,
    studentId: student.id,
    tutorId: tutor.id,
    subject: tutor.subject,
    date: slot.date,
    time: slot.start,
    duration: 60,
    status: 'upcoming',
    topic: `${tutor.subject} ${sessionType}`,
    studentName: student.name,
    tutorName: tutor.name,
    remarks,
  };
  sessions.push(newSession);
  return newSession;
}

// Tutor sessions CRUD and booking
export function addTutorSession(tutorId, { date, time, subject, mode, location }) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor) return null;
  tutor.tutorSessions = tutor.tutorSessions || [];
  const sess = { id: `ts_${Date.now()}`, date, time, subject, mode, location: mode === 'Offline' ? location : '', booked: false };
  tutor.tutorSessions.push(sess);
  return sess;
}

export function updateTutorSession(tutorId, sessionId, updates) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor || !tutor.tutorSessions) return;
  const idx = tutor.tutorSessions.findIndex(s => s.id === sessionId);
  if (idx >= 0) {
    tutor.tutorSessions[idx] = { ...tutor.tutorSessions[idx], ...updates };
  }
}

export function deleteTutorSession(tutorId, sessionId) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor || !tutor.tutorSessions) return;
  tutor.tutorSessions = tutor.tutorSessions.filter(s => s.id !== sessionId);
}

export function bookTutorSession({ student, tutorId, sessionId }) {
  const tutor = users.find(u => u.id === tutorId && u.role === 'tutor');
  if (!tutor || !tutor.tutorSessions) return null;
  const sess = tutor.tutorSessions.find(s => s.id === sessionId && !s.booked);
  if (!sess) return null;
  sess.booked = true;
  const newSession = {
    id: `sess_${Date.now()}`,
    studentId: student.id,
    tutorId: tutor.id,
    subject: sess.subject,
    date: sess.date,
    time: sess.time,
    duration: 60,
    status: 'upcoming',
    topic: `${sess.subject} ${sess.mode}`,
    studentName: student.name,
    tutorName: tutor.name,
    location: sess.mode === 'Offline' ? sess.location : undefined,
  };
  sessions.push(newSession);
  return newSession;
}

export function feedPet(cost = 20) {
  petData.happiness = Math.min(100, petData.happiness + 15);
  petData.level += 1;
  petData.lastFedAt = new Date().toISOString();
  petData.totalFed += 1;
  return cost;
}

export function completeModule(moduleId) {
  const module = modules.find(m => m.id === moduleId);
  if (module) {
    module.completed = true;
    module.progress = 100;
    return 10; // points earned
  }
  return 0;
}
