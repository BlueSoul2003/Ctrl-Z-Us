import React, { useState, useEffect } from 'react';
import { feedPet } from '../mockData.js';
import FloatingAiChatbot from '../components/FloatingAiChatbot.jsx';

export default function StudentPetGame({ user, onUpdatePoints, pet, onUpdatePet }) {
  const [message, setMessage] = useState('');
  const feedCost = 20;

  // 检查是否超过一天没喂食
  useEffect(() => {
    if (!pet.lastFedAt) return;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (now - pet.lastFedAt >= oneDay) {
      const newHappiness = Math.max(0, Math.floor(pet.happiness * 0.5));
      onUpdatePet({ ...pet, happiness: newHappiness, lastFedAt: now });
      setMessage(`Your pet wasn't fed for a day! Happiness dropped to ${newHappiness}`);
      setTimeout(() => setMessage(''), 5000);
    }
  }, [pet, onUpdatePet]);

  // 喂食函数
  const handleFeed = () => {
    if (user.points >= feedCost) {
      const cost = feedPet();
      const now = Date.now();
      onUpdatePoints(user.points - cost);
      onUpdatePet({
        ...pet,
        happiness: Math.min(100, pet.happiness + 15),
        level: pet.level + 1,
        totalFed: (pet.totalFed || 0) + 1,
        lastFedAt: now, // ⭐ 更新喂食时间
      });
      setMessage(`Fed ${pet.name}! Happiness +15, Level +1`);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Not enough points to feed your pet!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getPetMood = () => {
    if (pet.happiness >= 80) return '😊';
    if (pet.happiness >= 60) return '🙂';
    if (pet.happiness >= 40) return '😐';
    if (pet.happiness >= 20) return '😕';
    return '😢';
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Virtual Pet Game</h1>
          <p className="text-gray-600">Take care of your pet by spending points!</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Your Points</p>
          <p className="text-2xl font-bold text-green-600">{user.points}</p>
        </div>
      </header>

      {message && (
        <div
          className={`${
            message.includes('Not enough')
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          } rounded-md p-4`}
        >
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Pet Display */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="mb-6">
              <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center text-6xl">
                {getPetMood()}
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-gray-900">{pet.name}</h2>
                <p className="text-lg text-gray-600">Level {pet.level}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Happiness</span>
                  <span>{pet.happiness}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${pet.happiness}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600">Total Fed</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {pet.totalFed || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-600">Last Fed</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {pet.lastFedAt
                      ? new Date(pet.lastFedAt).toLocaleDateString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>

            <div className="space-y-4">
              <button
                onClick={handleFeed}
                disabled={user.points < feedCost}
                className={`w-full rounded-md px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  user.points >= feedCost
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Feed Pet (-{feedCost} points)
              </button>

              <div className="text-sm text-gray-600">
                <p>• Feeding increases happiness by 15%</p>
                <p>• Pet levels up with each feeding</p>
                <p>• Earn points by completing modules</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete learning modules to earn points</li>
              <li>• Keep your pet happy by feeding regularly</li>
              <li>• Higher level pets are happier and more active</li>
              <li>
                • Check back daily to maintain your pet's health. If you don't
                feed your pet for a day, its happiness will drop by 50%.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <FloatingAiChatbot user={user} />
    </div>
  );
}

