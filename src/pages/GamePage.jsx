import React, { useMemo, useState } from 'react';
import { feedPetAndUpdatePoints } from '../mockData.js';

export default function GamePage({ user, points, setPoints, pet, setPet }) {
  const feedCost = 20;

  const canFeed = useMemo(() => points >= feedCost, [points]);
  const [announce, setAnnounce] = useState('');

  const handleFeed = () => {
    if (!canFeed) return;
    const { user: nextUser, pet: nextPet } = feedPetAndUpdatePoints({
      user: { ...user, points },
      pet,
      cost: feedCost,
      levelGain: 1,
      happinessGain: 15,
    });
    setPoints(nextUser.points);
    setPet(nextPet);
    setAnnounce(`Fed! Level ${nextPet.level}, Happiness ${nextPet.happiness}, Remaining points ${nextUser.points}`);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between" aria-label="Game overview">
        <h2 className="text-2xl font-bold text-gray-900">Virtual Pet</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Points</span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700" aria-label={`Current points ${points}`}>
            {points}
          </span>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3" aria-label="Pet and actions">
        <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="pet-card-heading">
          <h3 id="pet-card-heading" className="text-lg font-semibold text-gray-900">{pet.name}</h3>
          <div className="mt-4 flex items-center gap-6">
            <div className="relative h-40 w-40">
              <div
                role="img"
                aria-label={`Pet ${pet.name}`}
                className="h-40 w-40 rounded-full bg-yellow-100 ring-4 ring-yellow-300"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                Lv {pet.level}
              </div>
            </div>

            <div className="grow">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-600">Level</dt>
                  <dd className="text-base font-semibold text-gray-900">{pet.level}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Happiness</dt>
                  <dd>
                    <div className="mt-1 h-3 w-full rounded-full bg-gray-200" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pet.happiness} aria-label="Pet happiness">
                      <div className="h-3 rounded-full bg-green-500" style={{ width: `${pet.happiness}%` }} />
                    </div>
                    <p className="mt-1 text-sm text-gray-700" aria-live="polite">{pet.happiness} / 100</p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="actions-heading">
          <h3 id="actions-heading" className="text-lg font-semibold text-gray-900">Actions</h3>
          <p className="mt-2 text-sm text-gray-600">Spend points to increase your pet's level and happiness.</p>
          <button
            type="button"
            onClick={handleFeed}
            disabled={!canFeed}
            className={`mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              canFeed ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            aria-label={`Feed pet, costs ${feedCost} points`}
          >
            Feed (-{feedCost} pts)
          </button>
          <div className="mt-3 text-sm text-gray-700" aria-live="polite">{announce}</div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm" aria-labelledby="tips-heading">
        <h3 id="tips-heading" className="text-lg font-semibold text-gray-900">Tips</h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
          <li>Complete lessons to earn points (see Student Dashboard).</li>
          <li>Use points to feed your pet. It will level up and get happier.</li>
          <li>Data resets on refresh (frontend-only demo).</li>
        </ul>
      </section>
    </div>
  );
}
