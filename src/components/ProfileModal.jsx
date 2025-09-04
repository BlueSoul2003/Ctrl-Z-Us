import React, { useEffect, useMemo, useState } from 'react';
import { subjects as subjectsCatalog, updateUserProfile, users, userPreferences } from '../mockData.js';

export default function ProfileModal({ user, open, onClose, onSaved }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  const isStudent = user?.role === 'student';
  const isTutor = user?.role === 'tutor';

  const initialPreferred = useMemo(() => (userPreferences[user?.id]?.preferredSubjects || []), [user?.id]);
  const [preferredSubjects, setPreferredSubjects] = useState(initialPreferred);
  const [studentIntro, setStudentIntro] = useState(userPreferences[user?.id]?.intro || '');

  const [tutorSubjects, setTutorSubjects] = useState(user?.subjects || (user?.subject ? [user.subject] : []));
  const [tutorBio, setTutorBio] = useState(user?.bio || '');
  const [certificateName, setCertificateName] = useState(user?.certificateName || '');

  useEffect(() => {
    if (open) {
      setName(user?.name || '');
      setEmail(user?.email || '');
      setAvatarUrl(user?.avatarUrl || '');
      setPreferredSubjects(userPreferences[user?.id]?.preferredSubjects || []);
      setStudentIntro(userPreferences[user?.id]?.intro || '');
      setTutorSubjects(user?.subjects || (user?.subject ? [user.subject] : []));
      setTutorBio(user?.bio || '');
      setCertificateName(user?.certificateName || '');
    }
  }, [open, user]);

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setCertificateName(f.name);
  };

  const save = () => {
    const updates = { name, email, avatarUrl };
    if (isStudent) {
      updates.preferredSubjects = preferredSubjects;
      updates.intro = studentIntro;
    }
    if (isTutor) {
      updates.subjectsList = tutorSubjects;
      updates.bio = tutorBio;
      updates.certificateName = certificateName;
    }
    updateUserProfile(user.id, updates);
    onSaved?.();
    onClose?.();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" className="relative z-50 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center gap-4">
          <img src={avatarUrl} alt="Avatar preview" className="h-14 w-14 rounded-full ring-1 ring-gray-300" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
            <p className="text-sm text-gray-600">Update your personal information</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
          </div>
        </div>

        {isStudent && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Subjects</label>
              <select multiple className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={preferredSubjects} onChange={(e) => setPreferredSubjects(Array.from(e.target.selectedOptions).map(o => o.value))}>
                {subjectsCatalog.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Self-introduction (optional)</label>
              <textarea rows={3} value={studentIntro} onChange={(e) => setStudentIntro(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        {isTutor && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subjects (Ctrl/Cmd to multi-select)</label>
              <select multiple className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={tutorSubjects} onChange={(e) => setTutorSubjects(Array.from(e.target.selectedOptions).map(o => o.value))}>
                {subjectsCatalog.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Teaching certificate (mock)</label>
              <input type="file" accept=".pdf,.jpg,.png" onChange={onFile} className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 hover:file:bg-blue-100" />
              {certificateName && <p className="mt-1 text-xs text-gray-600">Selected: {certificateName}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Self-introduction</label>
              <textarea rows={3} value={tutorBio} onChange={(e) => setTutorBio(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">Cancel</button>
          <button onClick={save} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Save</button>
        </div>
      </div>
    </div>
  );
}
