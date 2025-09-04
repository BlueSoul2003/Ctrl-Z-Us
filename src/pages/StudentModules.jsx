import React from 'react';
import { modules, completeModule } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentModules({ user, onUpdatePoints }) {
  const handleStartModule = (moduleId) => {
    const pointsEarned = completeModule(moduleId);
    onUpdatePoints(user.points + pointsEarned);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Learning Modules</h1>
        <p className="text-gray-600">Continue your learning journey with these interactive modules.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.subject} • {module.level}</p>
                <p className="text-sm text-gray-500 mt-1">{module.duration}</p>
              </div>
              {module.completed && (
                <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  Completed
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{module.description}</p>

            {!module.completed && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${module.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={() => handleStartModule(module.id)}
              disabled={module.completed}
              className={`w-full rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                module.completed 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {module.completed ? 'Completed' : 'Start Module'}
            </button>
          </div>
        ))}
      </div>

      <FloatingAiChatbot user={user} />
    </div>
  );
}
