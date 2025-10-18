import { useState } from "react";
import { useTheme } from "../context/ThemeContext"; // adjust path if needed

const Settings = () => {
  const { isDark } = useTheme();

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
      <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
        Notification Preferences
      </h3>
      
      <div className="space-y-4">
        {[
          { key: "email", label: "Email Notifications", description: "Receive updates via email" },
          { key: "push", label: "Push Notifications", description: "Receive push notifications on your device" },
          { key: "sms", label: "SMS Notifications", description: "Receive text messages" },
          { key: "promotional", label: "Promotional Emails", description: "Receive promotional offers and updates" }
        ].map(({ key, label, description }) => (
          <div
            key={key}
            className={`flex items-center justify-between p-4 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div>
              <h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{label}</h4>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[key]}
                onChange={() => handleToggle('notifications', key)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full ${
                isDark ? "bg-gray-700 peer-checked:bg-blue-500" : "bg-gray-200 peer-checked:bg-blue-600"
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
              peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Privacy Settings</h3>
      
      <div className="space-y-4">
        <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
          <h4 className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Profile Visibility</h4>
          <select
            value={settings.privacy.profileVisibility}
            onChange={(e) => handleSelect('privacy', 'profileVisibility', e.target.value)}
            className={`w-full p-2 rounded-md border ${
              isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="public">Public</option>
            <option value="friends">Friends Only</option>
            <option value="private">Private</option>
          </select>
        </div>

        {[
          { key: "showEmail", label: "Show Email Address", description: "Display your email on your profile" },
          { key: "showPhone", label: "Show Phone Number", description: "Display your phone number on your profile" }
        ].map(({ key, label, description }) => (
          <div
            key={key}
            className={`flex items-center justify-between p-4 rounded-lg ${
              isDark ? "bg-gray-800" : "bg-gray-50"
            }`}
          >
            <div>
              <h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{label}</h4>
              <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>{description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy[key]}
                onChange={() => handleToggle('privacy', key)}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full ${
                isDark ? "bg-gray-700 peer-checked:bg-blue-500" : "bg-gray-200 peer-checked:bg-blue-600"
              } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300
              peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px]
              after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <h3 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>App Preferences</h3>
      
      <div className="space-y-4">
        {[
          { key: "language", label: "Language", options: ["English", "Spanish", "French", "German"] },
          { key: "theme", label: "Theme", options: ["light", "dark", "auto"] },
          { key: "currency", label: "Currency", options: ["USD", "EUR", "GBP", "NZD"] },
          { key: "dateFormat", label: "Date Format", options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"] }
        ].map(({ key, label, options }) => (
          <div key={key} className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
            <h4 className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{label}</h4>
            <select
              value={settings.preferences[key]}
              onChange={(e) => handleSelect('preferences', key, e.target.value)}
              className={`w-full p-2 rounded-md border ${
                isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Settings</h1>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-2`}>
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className={`rounded-lg shadow-md overflow-hidden ${isDark ? "bg-gray-800" : "bg-white"}`}>
          {/* Tabs */}
          <div className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
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
                      ? `border-blue-500 ${isDark ? "text-blue-400" : "text-blue-600"}`
                      : `border-transparent ${isDark ? "text-gray-300 hover:text-white" : "text-gray-500 hover:text-gray-700"} hover:border-gray-300`
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
          <div className={`px-6 py-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
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
