import React, { useState, useMemo } from 'react';
import { modules, completeModule, subjects } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentModules({ user, onUpdatePoints }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedProgress, setSelectedProgress] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleStartModule = (moduleId) => {
    const pointsEarned = completeModule(moduleId);
    onUpdatePoints(user.points + pointsEarned);
  };

  const handleBuyModule = (module) => {
    alert(`Redirecting to payment for ${module.title} - RM ${module.price}`);
  };

  const handleRedeemModule = (module) => {
    if (user.points >= module.pointsRequired) {
      onUpdatePoints(user.points - module.pointsRequired);
      alert(`Module ${module.title} redeemed for ${module.pointsRequired} points!`);
    } else {
      alert(`Insufficient points. You need ${module.pointsRequired} points to redeem this module.`);
    }
  };

  const filteredAndSortedModules = useMemo(() => {
    let filtered = modules.filter(module => {
      const isNotCompleted = !module.completed;
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = !selectedSubject || module.subject === selectedSubject;
      const matchesLevel = !selectedLevel || module.level === selectedLevel;
      const matchesType = !selectedType || module.type === selectedType;
      const matchesProgress = !selectedProgress || 
        (selectedProgress === 'in-progress' && !module.completed && module.progress > 0) ||
        (selectedProgress === 'not-started' && !module.completed && module.progress === 0);

      return isNotCompleted && matchesSearch && matchesSubject && matchesLevel && matchesType && matchesProgress;
    });

    if (sortBy === 'duration') {
      filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'progress') {
      filtered.sort((a, b) => b.progress - a.progress);
    }

    return filtered;
  }, [searchTerm, selectedSubject, selectedLevel, selectedType, selectedProgress, sortBy]);

  const getModuleStatus = (module) => {
    if (module.completed) return 'completed';
    if (module.progress > 0) return 'in-progress';
    return 'not-started';
  };

  const getButtonContent = (module) => {
    if (module.completed) {
      return { text: 'Completed', icon: '✅', disabled: true, className: 'bg-gray-100 text-gray-400 cursor-not-allowed' };
    }
    
    switch (module.type) {
      case 'free':
        return { text: 'Start Module', icon: '✅', disabled: false, className: 'bg-green-600 text-white hover:bg-green-700' };
      case 'paid':
        return { text: `Buy Now - RM ${module.price}`, icon: '💰', disabled: false, className: 'bg-blue-600 text-white hover:bg-blue-700' };
      case 'redeemable':
        return { text: `Redeem with ${module.pointsRequired} pts`, icon: '🎁', disabled: user.points < module.pointsRequired, className: user.points >= module.pointsRequired ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed' };
      default:
        return { text: 'Start Module', icon: '✅', disabled: false, className: 'bg-green-600 text-white hover:bg-green-700' };
    }
  };

  const handleButtonClick = (module) => {
    if (module.completed) return;
    
    switch (module.type) {
      case 'free':
        handleStartModule(module.id);
        break;
      case 'paid':
        handleBuyModule(module);
        break;
      case 'redeemable':
        handleRedeemModule(module);
        break;
      default:
        handleStartModule(module.id);
    }
  };

  const completedModules = modules.filter(module => module.completed);

  const handleReviewModule = (module) => {
    alert(`Opening review mode for: ${module.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Learning Modules</h1>
              <p className="text-gray-600 mt-2">Continue your learning journey with available courses and track your progress.</p>
            </div>

            {/* Filter Bar */}
            {/* ... (保留你原来的 filter code) ... */}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredAndSortedModules.length} of {modules.length} modules
              </p>
            </div>

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedModules.map((module) => {
                const buttonContent = getButtonContent(module);
                const status = getModuleStatus(module);
                
                return (
                  <div key={module.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4 gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                            {module.subject}
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {module.level}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{module.duration}</p>
                      </div>
                      <div className="flex items-center flex-shrink-0">
                        {status === 'completed' && (
                          <span className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 whitespace-nowrap">
                            ✅ Completed
                          </span>
                        )}
                        {status === 'in-progress' && (
                          <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 whitespace-nowrap">
                            🔄 In Progress
                          </span>
                        )}
                        {status === 'not-started' && (
                          <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 whitespace-nowrap">
                            ⏳ Not Started
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">{module.description}</p>

                    {!module.completed && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Pricing Info */}
                    <div className="mb-4">
                      {module.type === 'free' && (
                        <div className="inline-flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-200">
                          <span className="mr-2">✅</span>
                          Free Module
                        </div>
                      )}
                    
                      <p className="text-sm text-yellow-600 font-medium mt-2">⭐ Gain Point: 50 pts</p>
                    </div>

                    <button
                      onClick={() => handleButtonClick(module)}
                      disabled={buttonContent.disabled}
                      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${buttonContent.className}`}
                    >
                      <span className="mr-2">{buttonContent.icon}</span>
                      {buttonContent.text}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar 保持不动 */}
          {/* ... 你的 Completed Modules code ... */}
        </div>
      </div>

      <FloatingAiChatbot user={user} />
    </div>
  );
}
