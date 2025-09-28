import { useState } from "react";

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false,
      promotional: true
    },
    privacy: {
      profileVisibility: "public",
      showEmail: false,
      showPhone: false
    },
    preferences: {
      language: "English",
      theme: "light",
      currency: "USD",
      dateFormat: "MM/DD/YYYY"
    }
  });

  const [activeTab, setActiveTab] = useState("notifications");

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelect = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const renderNotifications = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive updates via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={() => handleToggle('notifications', 'email')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Receive push notifications on your device</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={() => handleToggle('notifications', 'push')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Receive text messages</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.sms}
              onChange={() => handleToggle('notifications', 'sms')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Promotional Emails</h4>
            <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications.promotional}
              onChange={() => handleToggle('notifications', 'promotional')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Profile Visibility</h4>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Show Email Address</h4>
            <p className="text-sm text-gray-600">Display your email on your profile</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.privacy.showEmail}
              onChange={() => handleToggle('privacy', 'showEmail')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Show Phone Number</h4>
            <p className="text-sm text-gray-600">Display your phone number on your profile</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.privacy.showPhone}
              onChange={() => handleToggle('privacy', 'showPhone')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">App Preferences</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Language</h4>
          <select
            value={settings.preferences.language}
            onChange={(e) => handleSelect('preferences', 'language', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
          </select>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Theme</h4>
          <select
            value={settings.preferences.theme}
            onChange={(e) => handleSelect('preferences', 'theme', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Currency</h4>
          <select
            value={settings.preferences.currency}
            onChange={(e) => handleSelect('preferences', 'currency', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="NZD">NZD - New Zealand Dollar</option>
          </select>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Date Format</h4>
          <select
            value={settings.preferences.dateFormat}
            onChange={(e) => handleSelect('preferences', 'dateFormat', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and privacy settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              {[
                { id: 'notifications', name: 'Notifications', icon: '🔔' },
                { id: 'privacy', name: 'Privacy', icon: '🔒' },
                { id: 'preferences', name: 'Preferences', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'notifications' && renderNotifications()}
            {activeTab === 'privacy' && renderPrivacy()}
            {activeTab === 'preferences' && renderPreferences()}
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
