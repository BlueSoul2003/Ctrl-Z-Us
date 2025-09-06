import React, { useState } from 'react';
import { platformSettings } from '../mockData.js';

export default function AdminSettings({ user }) {
  const [settings, setSettings] = useState({
    commissionRate: platformSettings.commissionRate,
    platformName: platformSettings.platformName,
    supportEmail: platformSettings.supportEmail,
    maintenanceMode: platformSettings.maintenanceMode,
    minSessionDuration: platformSettings.minSessionDuration,
    maxSessionDuration: platformSettings.maxSessionDuration,
  });

  const [newSubject, setNewSubject] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Update platform settings
    Object.keys(settings).forEach(key => {
      platformSettings[key] = settings[key];
    });
    alert('Settings saved successfully!');
  };

  const addSubject = () => {
    if (newSubject.trim() && !platformSettings.subjects.includes(newSubject.trim())) {
      platformSettings.subjects.push(newSubject.trim());
      setNewSubject('');
      setShowAddSubject(false);
    }
  };

  const removeSubject = (subjectToRemove) => {
    platformSettings.subjects = platformSettings.subjects.filter(subject => subject !== subjectToRemove);
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      setSettings({
        commissionRate: 15,
        platformName: 'Tutorly',
        supportEmail: 'support@tutorly.com',
        maintenanceMode: false,
        minSessionDuration: 30,
        maxSessionDuration: 120,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
              <p className="text-gray-600 mt-2">Configure platform settings and preferences</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={resetToDefaults}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={saveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Platform Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="platformName" className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Name
                  </label>
                  <input
                    id="platformName"
                    type="text"
                    value={settings.platformName}
                    onChange={(e) => handleSettingChange('platformName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Support Email
                  </label>
                  <input
                    id="supportEmail"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable Maintenance Mode</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    When enabled, the platform will be temporarily unavailable to users
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="commissionRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Commission Rate
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="commissionRate"
                      type="number"
                      min="0"
                      max="50"
                      value={settings.commissionRate}
                      onChange={(e) => handleSettingChange('commissionRate', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Percentage of session earnings taken by the platform
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Commission Impact</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Current rate: {settings.commissionRate}%</div>
                    <div>For a RM 100 session:</div>
                    <div className="ml-4">• Platform earns: RM {Math.round(100 * settings.commissionRate / 100)}</div>
                    <div className="ml-4">• Tutor earns: RM {100 - Math.round(100 * settings.commissionRate / 100)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="minSessionDuration" className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Session Duration
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="minSessionDuration"
                      type="number"
                      min="15"
                      max="60"
                      value={settings.minSessionDuration}
                      onChange={(e) => handleSettingChange('minSessionDuration', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="maxSessionDuration" className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Session Duration
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="maxSessionDuration"
                      type="number"
                      min="60"
                      max="300"
                      value={settings.maxSessionDuration}
                      onChange={(e) => handleSettingChange('maxSessionDuration', parseInt(e.target.value))}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Subject Categories</h2>
                <button
                  onClick={() => setShowAddSubject(!showAddSubject)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  Add Subject
                </button>
              </div>

              {showAddSubject && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter new subject..."
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addSubject}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setNewSubject('');
                        setShowAddSubject(false);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {platformSettings.subjects.map((subject) => (
                  <div key={subject} className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                    <span className="text-sm text-gray-800">{subject}</span>
                    <button
                      onClick={() => removeSubject(subject)}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Platform Statistics</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>Total Users: {platformSettings.subjects.length > 0 ? 'Loading...' : 'N/A'}</div>
                    <div>Total Sessions: {platformSettings.subjects.length > 0 ? 'Loading...' : 'N/A'}</div>
                    <div>Platform Version: 1.0.0</div>
                    <div>Last Updated: {new Date().toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-2 rounded text-sm font-medium transition-colors">
                      Export User Data
                    </button>
                    <button className="w-full bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded text-sm font-medium transition-colors">
                      Backup Settings
                    </button>
                    <button className="w-full bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded text-sm font-medium transition-colors">
                      Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
