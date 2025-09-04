import React, { useEffect, useMemo, useState } from 'react';
import { groupChats, messages as privateMessages, users, addMessage, addGroupMessage } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function Messages({ user }) {
  const [tab, setTab] = useState('groups'); // 'groups' | 'private'
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState('');

  const groups = useMemo(() => groupChats.filter(g => g.members.includes(user.id)), [user.id]);

  const threads = useMemo(() => {
    // reduce private messages to unique threads by other participant
    const myMsgs = privateMessages.filter(m => m.senderId === user.id || m.receiverId === user.id);
    const threadMap = new Map();
    myMsgs.forEach((m) => {
      const otherId = m.senderId === user.id ? m.receiverId : m.senderId;
      if (!threadMap.has(otherId)) threadMap.set(otherId, []);
      threadMap.get(otherId).push(m);
    });
    return Array.from(threadMap.entries()).map(([otherId, items]) => ({ otherId, items: items.sort((a,b) => new Date(a.timestamp)-new Date(b.timestamp)) }));
  }, [user.id]);

  useEffect(() => {
    if (!selectedId) {
      if (tab === 'groups' && groups.length) setSelectedId(groups[0].id);
      if (tab === 'private' && threads.length) setSelectedId(threads[0].otherId);
    }
  }, [tab, groups, threads, selectedId]);

  const currentGroup = tab === 'groups' ? groups.find(g => g.id === selectedId) : null;
  const currentThread = tab === 'private' ? threads.find(t => t.otherId === selectedId) : null;
  const otherUser = currentThread ? users.find(u => u.id === currentThread.otherId) : null;

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;

    if (tab === 'groups' && currentGroup) {
      addGroupMessage(currentGroup.id, { senderId: user.id, text });
    } else if (tab === 'private' && otherUser) {
      addMessage({ senderId: user.id, receiverId: otherUser.id, text, senderName: user.name, receiverName: otherUser.name });
    }
    setDraft('');
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* Left column: tabs and list */}
      <aside className="lg:col-span-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm" aria-label="Chat list">
        <div className="flex items-center gap-2" role="tablist" aria-label="Messages type">
          <button
            role="tab"
            aria-selected={tab === 'groups'}
            className={`rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              tab === 'groups' ? 'bg-blue-600 text-white' : 'text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTab('groups')}
          >
            Discussion Groups
          </button>
          <button
            role="tab"
            aria-selected={tab === 'private'}
            className={`rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              tab === 'private' ? 'bg-blue-600 text-white' : 'text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setTab('private')}
          >
            Private Messages
          </button>
        </div>

        {/* List */}
        <ul role="list" className="mt-4 space-y-2 max-h-[65vh] overflow-y-auto">
          {tab === 'groups' && groups.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => setSelectedId(g.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedId === g.id ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'}`}
              >
                <div className="font-medium text-gray-900">{g.name}</div>
                <div className="text-xs text-gray-600 line-clamp-1">{g.messages[g.messages.length-1]?.text || 'No messages'}</div>
              </button>
            </li>
          ))}
          {tab === 'private' && threads.map((t) => (
            <li key={t.otherId}>
              <button
                onClick={() => setSelectedId(t.otherId)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${selectedId === t.otherId ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'}`}
              >
                <div className="font-medium text-gray-900">{users.find(u => u.id === t.otherId)?.name || 'Thread'}</div>
                <div className="text-xs text-gray-600 line-clamp-1">{t.items[t.items.length-1]?.text || 'No messages'}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Right column: chat window */}
      <section className="lg:col-span-8 grid grid-rows-[1fr_auto] rounded-lg border border-gray-200 bg-white shadow-sm" aria-label="Chat window">
        <div className="max-h-[70vh] overflow-y-auto p-4" aria-live="polite">
          {/* Group messages */}
          {tab === 'groups' && currentGroup && (
            <ul role="list" className="space-y-3">
              {currentGroup.messages.map((m) => (
                <li key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-md px-3 py-2 text-sm ${m.senderId === user.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-900'}`}>
                    {m.text}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Private messages */}
          {tab === 'private' && currentThread && (
            <ul role="list" className="space-y-3">
              {currentThread.items.map((m) => (
                <li key={m.id} className={`flex ${m.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded-md px-3 py-2 text-sm ${m.senderId === user.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-900'}`}>
                    {m.text}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!currentGroup && tab === 'groups' && (
            <p className="text-sm text-gray-600">Select a group on the left to start chatting.</p>
          )}
          {!currentThread && tab === 'private' && (
            <p className="text-sm text-gray-600">Select a thread on the left to start chatting.</p>
          )}
        </div>

        <form
          className="flex items-center gap-2 border-t border-gray-200 p-3"
          onSubmit={handleSend}
          aria-label="Send message"
        >
          <label htmlFor="msg-input" className="sr-only">Type a message</label>
          <input
            id="msg-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!draft.trim() || (!currentGroup && !currentThread)}
            aria-label="Send"
          >
            Send
          </button>
        </form>
      </section>

      <FloatingAiChatbot user={user} />
    </div>
  );
}
