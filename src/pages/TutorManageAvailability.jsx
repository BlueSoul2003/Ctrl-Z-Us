import React, { useMemo, useState } from 'react';
import { users, addAvailabilitySlot, removeAvailabilitySlot } from '../mockData.js';

export default function TutorManageAvailability({ user }) {
  const tutor = useMemo(() => users.find(u => u.id === user.id), [user.id]);
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [refresh, setRefresh] = useState(0);

  const slots = useMemo(() => (tutor?.availability || []).slice().sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start)), [tutor?.availability, refresh]);

  const handleAdd = () => {
    if (!date || !start || !end) return;
    addAvailabilitySlot(user.id, { date, start, end });
    setDate('');
    setStart('');
    setEnd('');
    setRefresh(v => v + 1);
  };

  const handleRemove = (slotId) => {
    removeAvailabilitySlot(user.id, slotId);
    setRefresh(v => v + 1);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Manage Availability</h1>
        <p className="text-gray-600">Add or remove time slots students can book.</p>
      </header>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Add new slot</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start</label>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End</label>
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-end">
            <button onClick={handleAdd} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Slot</button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your availability</h2>
        {slots.length ? (
          <ul className="mt-3 space-y-2">
            {slots.map(slot => (
              <li key={slot.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">{slot.date}</span>
                  <span className="ml-2 text-gray-700">{slot.start}-{slot.end}</span>
                  {slot.booked && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Booked</span>
                  )}
                </div>
                {!slot.booked && (
                  <button onClick={() => handleRemove(slot.id)} className="rounded-md px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">Remove</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-600">No availability added yet.</p>
        )}
      </section>
    </div>
  );
}
