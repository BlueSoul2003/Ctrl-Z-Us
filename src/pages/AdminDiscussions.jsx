import React, { useState, useMemo } from 'react';
import { discussionGroups, discussionMessages, mutedUsers, users } from '../mockData.js';

// Mock private message reports with full message content
const privateMessageReports = [
  {
    id: 'pm_report_1',
    messageId: 'pm_1',
    reportedBy: 'user_8',
    reportedByUserName: 'Alice Chen',
    reportedUser: 'user_9',
    reportedUserName: 'John Smith',
    reason: 'Inappropriate content',
    timestamp: '2024-01-30T14:00:00Z',
    messageContent: 'Hey, I think you\'re really hot and we should meet up sometime. I can pay you extra for some private tutoring sessions if you know what I mean 😉',
    messagePreview: 'Hey, I think you\'re really hot and we should meet up sometime...',
  },
  {
    id: 'pm_report_2',
    messageId: 'pm_2',
    reportedBy: 'user_10',
    reportedByUserName: 'Sarah Wilson',
    reportedUser: 'user_11',
    reportedUserName: 'Mike Johnson',
    reason: 'Harassment',
    timestamp: '2024-01-30T15:30:00Z',
    messageContent: 'You\'re such a stupid student. I can\'t believe you don\'t understand this simple concept. Maybe you should just drop out of school because you\'re clearly not smart enough.',
    messagePreview: 'You\'re such a stupid student. I can\'t believe you don\'t understand...',
  },
  {
    id: 'pm_report_3',
    messageId: 'pm_3',
    reportedBy: 'user_12',
    reportedByUserName: 'Emily Zhang',
    reportedUser: 'user_13',
    reportedUserName: 'David Lee',
    reason: 'Spam',
    timestamp: '2024-01-30T16:45:00Z',
    messageContent: 'BUY MY COURSE NOW! SPECIAL DISCOUNT! ONLY TODAY! CLICK THIS LINK TO GET 90% OFF! DON\'T MISS OUT! LIMITED TIME OFFER! BUY NOW BUY NOW BUY NOW!',
    messagePreview: 'BUY MY COURSE NOW! SPECIAL DISCOUNT! ONLY TODAY! CLICK THIS LINK...',
  },
];

export default function AdminDiscussions({ user }) {
  const [activeTab, setActiveTab] = useState('groups');
  const [searchTerm, setSearchTerm] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');

  const filteredGroups = useMemo(() => {
    let filtered = discussionGroups;
    if (groupFilter !== 'all') {
      filtered = filtered.filter(g => g.isActive === (groupFilter === 'active'));
    }
    if (searchTerm) {
      filtered = filtered.filter(g => 
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [groupFilter, searchTerm]);

  const filteredMessages = useMemo(() => {
    let filtered = discussionMessages.filter(m => !m.isDeleted);
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered.map(message => {
      const group = discussionGroups.find(g => g.id === message.groupId);
      return {
        ...message,
        groupName: group ? group.name : 'Unknown Group',
        groupSubject: group ? group.subject : 'Unknown Subject'
      };
    });
  }, [searchTerm, discussionGroups]);

  const reportedMessages = useMemo(() => discussionMessages.filter(m => m.isReported && !m.isDeleted), []);
  const allReportedMessages = useMemo(() => [
    ...reportedMessages.map(msg => {
      const group = discussionGroups.find(g => g.id === msg.groupId);
      return { 
        ...msg, 
        type: 'discussion',
        groupName: group ? group.name : 'Unknown Group',
        groupSubject: group ? group.subject : 'Unknown Subject'
      };
    }),
    ...privateMessageReports.map(report => ({ ...report, type: 'private' }))
  ], [reportedMessages, discussionGroups]);

  const deleteMessage = (messageId) => {
    const message = discussionMessages.find(m => m.id === messageId);
    if (message) {
      message.isDeleted = true;
    }
  };

  const muteUser = (userId, reason) => {
    const userToMute = users.find(u => u.id === userId);
    if (userToMute && !mutedUsers.find(m => m.id === userId)) {
      const mutedUser = {
        id: userId,
        userName: userToMute.name,
        mutedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        reason: reason,
        mutedBy: 'admin',
      };
      mutedUsers.push(mutedUser);
    }
  };

  const unmuteUser = (userId) => {
    const index = mutedUsers.findIndex(m => m.id === userId);
    if (index > -1) {
      mutedUsers.splice(index, 1);
    }
  };

  const toggleGroupStatus = (groupId) => {
    const group = discussionGroups.find(g => g.id === groupId);
    if (group) {
      group.isActive = !group.isActive;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discussion Monitoring</h1>
              <p className="text-gray-600 mt-2">Monitor and moderate discussion groups and messages</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-xl">💬</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Discussion Groups</p>
                  <p className="text-3xl font-bold text-gray-900">{discussionGroups.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-xl">📝</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Messages</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredMessages.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-xl">⚠️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reported Messages</p>
                  <p className="text-3xl font-bold text-orange-600">{allReportedMessages.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 font-semibold text-xl">🔇</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Muted Users</p>
                  <p className="text-3xl font-bold text-gray-900">{mutedUsers.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 p-1">
            <nav className="flex space-x-1">
              {[
                { id: 'groups', name: 'Discussion Groups', icon: '💬' },
                { id: 'messages', name: 'Discussion Messages', icon: '📝' },
                { id: 'reported', name: 'Reported Content', icon: '⚠️' },
                { id: 'muted', name: 'Muted Users', icon: '🔇' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search groups, messages, or users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {activeTab === 'groups' && (
                <div>
                  <label htmlFor="groupFilter" className="block text-sm font-medium text-gray-700 mb-2">
                    Group Status
                  </label>
                  <select
                    id="groupFilter"
                    value={groupFilter}
                    onChange={(e) => setGroupFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Groups</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              )}

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setGroupFilter('all');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Discussion Groups Tab */}
          {activeTab === 'groups' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Discussion Groups ({filteredGroups.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{group.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {group.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Subject: {group.subject}</p>
                      <p className="text-sm text-gray-600">Members: {group.memberCount}</p>
                      <p className="text-xs text-gray-500">Created: {group.createdAt}</p>
                      <button
                        onClick={() => toggleGroupStatus(group.id)}
                        className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
                          group.isActive 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {group.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discussion Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Discussion Group Messages ({filteredMessages.length})</h2>
              <p className="text-sm text-gray-600 mb-4">Note: Admins can only view discussion group messages, not private messages between users.</p>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium text-sm">{message.userName}</span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${
                          message.userRole === 'tutor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {message.userRole}
                        </span>
                        <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                          {message.groupName}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteMessage(message.id)}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => muteUser(message.userId, 'Inappropriate content')}
                          className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                        >
                          Mute User
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                    <div className="bg-gray-50 rounded p-2 mb-2">
                      <div className="text-xs text-gray-600">
                        <strong>Group:</strong> {message.groupName} ({message.groupSubject})
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reported Content Tab */}
          {activeTab === 'reported' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Reported Content ({allReportedMessages.length})</h2>
              <p className="text-sm text-gray-600 mb-4">Full message content from both discussion groups and private messages.</p>
              <div className="space-y-4">
                {allReportedMessages.map((item) => (
                  <div key={item.id} className={`rounded-lg p-4 ${
                    item.type === 'private' ? 'bg-purple-50 border border-purple-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="font-medium text-sm">
                          {item.type === 'private' ? `${item.reportedUserName} (reported by ${item.reportedByUserName})` : item.userName}
                        </span>
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${
                          item.type === 'private' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.type === 'private' ? 'Private Message' : 'Discussion Group'}
                        </span>
                        {item.type === 'discussion' && (
                          <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                            {item.groupName}
                          </span>
                        )}
                        <span className={`ml-2 text-xs px-2 py-1 rounded ${
                          item.reason === 'Inappropriate content' ? 'bg-red-100 text-red-800' :
                          item.reason === 'Harassment' ? 'bg-orange-100 text-orange-800' :
                          item.reason === 'Spam' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.reason}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {item.type === 'discussion' && (
                          <>
                            <button
                              onClick={() => deleteMessage(item.id)}
                              className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                            >
                              Delete Message
                            </button>
                            <button
                              onClick={() => muteUser(item.userId, 'Inappropriate content')}
                              className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                            >
                              Mute User
                            </button>
                          </>
                        )}
                        {item.type === 'private' && (
                          <button
                            onClick={() => muteUser(item.reportedUser, item.reason)}
                            className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                          >
                            Mute User
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Full Message Content */}
                    <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Full Message Content:</div>
                      <p className="text-sm text-gray-800 leading-relaxed">
                        "{item.content || item.messageContent}"
                      </p>
                    </div>
                    
                    {/* Group Information for Discussion Messages */}
                    {item.type === 'discussion' && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-3 border border-blue-200">
                        <div className="text-xs text-blue-600 mb-1">Group Information:</div>
                        <div className="text-sm text-blue-800">
                          <div><strong>Group:</strong> {item.groupName}</div>
                          <div><strong>Subject:</strong> {item.groupSubject}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500">
                      Reported: {new Date(item.timestamp).toLocaleString()}
                      {item.type === 'private' && (
                        <span className="ml-4">
                          Reported by: {item.reportedByUserName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Muted Users Tab */}
          {activeTab === 'muted' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Muted Users ({mutedUsers.length})</h2>
              <div className="space-y-4">
                {mutedUsers.map((muted) => (
                  <div key={muted.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">{muted.userName}</span>
                        <span className="text-xs text-gray-500 ml-2">({muted.reason})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          Until: {new Date(muted.mutedUntil).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => unmuteUser(muted.id)}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Unmute
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
