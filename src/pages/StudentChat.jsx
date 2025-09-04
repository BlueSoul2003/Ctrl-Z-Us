import React, { useMemo, useState } from 'react';
import { getAiRecommendations, modules, users } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentChat({ user }) {
  const [messages, setMessages] = useState([
    { id: 'c1', role: 'ai', text: 'Hi! Tell me what you like to study and I will recommend modules and tutors.' },
  ]);
  const [draft, setDraft] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    const userMsg = { id: `u_${Date.now()}`, role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setDraft('');

    const { subjectHint, recommendedModules, recommendedTutors } = getAiRecommendations(text, user?.id);

    const aiText = `Based on your interest${subjectHint ? ` in ${subjectHint}` : ''}, here are some picks:`;

    const aiMsg = { id: `a_${Date.now()}`, role: 'ai', text: aiText, modules: recommendedModules, tutors: recommendedTutors };
    setTimeout(() => setMessages(prev => [...prev, aiMsg]), 300);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">AI Chatbot</h1>
        <p className="text-gray-600">Ask for module or tutor recommendations.</p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm grid grid-rows-[1fr_auto] h-[70vh]">
        <div className="overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'} max-w-[75%] rounded-2xl px-4 py-3 shadow-sm`}>
                <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                {m.role === 'ai' && (m.modules?.length || m.tutors?.length) && (
                  <div className="mt-3 space-y-3">
                    {m.modules?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Recommended Modules</p>
                        <ul className="mt-1 space-y-1">
                          {m.modules.map(md => (
                            <li key={md.id} className="rounded-md border border-gray-200 bg-white text-gray-900 px-3 py-2">
                              <p className="text-sm font-medium">{md.title}</p>
                              <p className="text-xs text-gray-600">{md.subject} • {md.level} • {md.duration}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {m.tutors?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700">Recommended Tutors</p>
                        <ul className="mt-1 space-y-1">
                          {m.tutors.map(t => (
                            <li key={t.id} className="rounded-md border border-gray-200 bg-white text-gray-900 px-3 py-2">
                              <p className="text-sm font-medium">{t.name}</p>
                              <p className="text-xs text-gray-600">{t.subject} • ⭐ {t.rating} • RM {t.pricePerHour}/hr</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="border-t border-gray-200 p-3 flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message... (e.g., I prefer Math)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div>

      <FloatingAiChatbot user={user} />
    </div>
  );
}
