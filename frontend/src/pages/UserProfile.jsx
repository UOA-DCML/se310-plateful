import { useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    avatar: null,
    preferences: {
      cuisine: "Italian",
      dietaryRestrictions: "None",
      notifications: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <svg className="w-10 h-10 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={user.name}
                disabled={!isEditing}
                className={`w-full p-3 border border-gray-300 rounded-md ${
                  isEditing ? 'bg-white' : 'bg-gray-100'
                }`}
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user.email}
                disabled={!isEditing}
                className={`w-full p-3 border border-gray-300 rounded-md ${
                  isEditing ? 'bg-white' : 'bg-gray-100'
                }`}
                onChange={(e) => setUser({...user, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={user.phone}
                disabled={!isEditing}
                className={`w-full p-3 border border-gray-300 rounded-md ${
                  isEditing ? 'bg-white' : 'bg-gray-100'
                }`}
                onChange={(e) => setUser({...user, phone: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Cuisine</label>
              <input
                type="text"
                value={user.preferences.cuisine}
                disabled={!isEditing}
                className={`w-full p-3 border border-gray-300 rounded-md ${
                  isEditing ? 'bg-white' : 'bg-gray-100'
                }`}
                onChange={(e) => setUser({
                  ...user, 
                  preferences: {...user.preferences, cuisine: e.target.value}
                })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences.notifications}
                  onChange={(e) => setUser({
                    ...user,
                    preferences: {...user.preferences, notifications: e.target.checked}
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
              <input
                type="text"
                value={user.preferences.dietaryRestrictions}
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                onChange={(e) => setUser({
                  ...user,
                  preferences: {...user.preferences, dietaryRestrictions: e.target.value}
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
