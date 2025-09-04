import React, { useMemo, useState } from 'react';
import { messages as messagesData, addMessageToThread } from '../mockData.js';

export default function ChatPage({ user }) {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'groups'
  const [threads, setThreads] = useState(messagesData.threads);
  const filteredThreads = useMemo(
    () => threads.filter(t => (activeTab === 'messages' ? t.type === 'direct' : t.type === 'group')),
    [threads, activeTab]
  );
  const [selectedId, setSelectedId] = useState(filteredThreads[0]?.id || null);
  const selectedThread = useMemo(() => threads.find(t => t.id === selectedId) || null, [threads, selectedId]);

  const [draft, setDraft] = useState('');

  const handleSend = () => {
    if (!selectedThread || !draft.trim()) return;
    const newMsg = {
      senderId: user?.id || 'anonymous',
      text: draft.trim(),
      timestamp: new Date().toISOString(),
    };
    setThreads(prev => addMessageToThread(prev, selectedThread.id, newMsg));
    setDraft('');
  };

  // Keep selectedId valid when switching tabs
  React.useEffect(() => {
    if (!filteredThreads.find(t => t.id === selectedId)) {
      setSelectedId(filteredThreads[0]?.id || null);
    }
  }, [activeTab]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <aside className="lg:col-span-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm" aria-label="Conversations list">
        <div className="flex items-center gap-2" role="tablist" aria-label="Chat categories">
          <button
            role="tab"
            aria-selected={activeTab === 'messages'}
            className={`rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === 'messages' ? 'bg-blue-600 text-white' : 'text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            Private Messages
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'groups'}
            className={`rounded-md px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === 'groups' ? 'bg-blue-600 text-white' : 'text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('groups')}
          >
            Discussion Groups
          </button>
        </div>

        <ul role="list" className="mt-4 space-y-2">
          {filteredThreads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={`w-full rounded-md px-3 py-2 text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedId === t.id ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
                }`}
                aria-current={selectedId === t.id ? 'true' : 'false'}
                aria-label={`Open conversation ${t.title}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{t.title}</span>
                  <span className="text-xs text-gray-500">{t.items[t.items.length - 1]?.timestamp?.slice(11, 16) || ''}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-gray-600">{t.items[t.items.length - 1]?.text || 'No messages'}</p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="lg:col-span-8 grid grid-rows-[1fr_auto] rounded-lg border border-gray-200 bg-white shadow-sm" aria-label="Chat window">
        <div className="max-h-[60vh] overflow-y-auto p-4" aria-live="polite">
          {!selectedThread ? (
            <p className="text-sm text-gray-600">Select a conversation to start chatting.</p>
          ) : (
            <ul role="list" className="space-y-3">
              {selectedThread.items.map((m) => (
                <li key={m.id} className="flex items-start gap-2">
                  <div className={`rounded-md px-3 py-2 text-sm ${m.senderId === user?.id ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-100 text-gray-900'}`}>{m.text}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <form
          className="flex items-center gap-2 border-t border-gray-200 p-3"
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          aria-label="Send message"
        >
          <label htmlFor="chat-input" className="sr-only">Type a message</label>
          <input
            id="chat-input"
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!draft.trim() || !selectedThread}
            aria-label="Send"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
