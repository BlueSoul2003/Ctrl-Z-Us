import React, { useEffect, useRef, useState } from 'react';
import { getAiRecommendations } from '../mockData.js';

export default function FloatingAiChatbot({ user }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'intro', role: 'ai', text: 'Hi! Tell me what you like to study and I will recommend modules and tutors.' },
  ]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const userMsg = { id: `u_${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');

    const { subjectHint, recommendedModules, recommendedTutors } = getAiRecommendations(text, user?.id);
    const aiMsg = {
      id: `a_${Date.now()}`,
      role: 'ai',
      text: `Here are some recommendations${subjectHint ? ` for ${subjectHint}` : ''}:`,
      modules: recommendedModules,
      tutors: recommendedTutors,
    };
    setTimeout(() => setMessages((prev) => [...prev, aiMsg]), 250);
  };

  return (
    <div>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close AI Chatbot' : 'Open AI Chatbot'}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span aria-hidden="true" className="inline-block">💬</span>
      </button>

      {/* Overlay chat window */}
      {open && (
        <div
          role="dialog"
          aria-label="AI Chatbot"
          aria-modal="true"
          className="fixed bottom-24 right-5 z-40 w-80 max-h-[70vh] rounded-2xl border border-gray-200 bg-white shadow-xl grid grid-rows-[1fr_auto]"
        >
          <div
            ref={scrollRef}
            className="overflow-y-auto p-3 space-y-3"
            role="log"
            aria-live="polite"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  } max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm`}
                  role="article"
                  aria-label={m.role === 'user' ? 'Student message' : 'AI response'}
                >
                  <p>{m.text}</p>
                  {m.role === 'ai' && (m.modules?.length || m.tutors?.length) && (
                    <div className="mt-2 space-y-2">
                      {m.modules?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700">Recommended Modules</p>
                          <ul className="mt-1 space-y-1">
                            {m.modules.map((md) => (
                              <li key={md.id} className="rounded-md border border-gray-200 bg-white text-gray-900 px-2 py-1">
                                <span className="font-medium">{md.title}</span>
                                <span className="ml-1 text-xs text-gray-600">• {md.subject} • {md.level}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {m.tutors?.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-700">Recommended Tutors</p>
                          <ul className="mt-1 space-y-1">
                            {m.tutors.map((t) => (
                              <li key={t.id} className="rounded-md border border-gray-200 bg-white text-gray-900 px-2 py-1">
                                <span className="font-medium">{t.name}</span>
                                <span className="ml-1 text-xs text-gray-600">• {t.subject} • ⭐ {t.rating}</span>
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

          <form onSubmit={send} className="border-t border-gray-200 p-2 flex gap-2">
            <label htmlFor="ai-draft" className="sr-only">Type your message</label>
            <input
              id="ai-draft"
              type="text"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a preference… (e.g., I like Math)"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
