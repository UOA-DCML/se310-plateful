import { useState, useEffect } from "react";
import userService from "../services/userService";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../context/ThemeContext"; // adjust path if needed

const UserProfile = () => {
  const { isDark } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { updateUserProfile, user: authUser } = useAuth() ?? {};

  // Load user data on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        setError("Failed to load user data");
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      // Update user profile
      const updatedUser = await userService.updateUser({
        name: user.name,
        email: user.email,
        phone: user.phone
      });

      // Update preferences
      const userWithPrefs = await userService.updateUserPreferences(user.preferences);

      setUser(userWithPrefs);
      updateUserProfile?.({
        name: userWithPrefs.name,
        email: userWithPrefs.email,
        phone: userWithPrefs.phone,
        username: userWithPrefs.name || (userWithPrefs.email ? userWithPrefs.email.split("@")[0] : undefined),
      });
      setIsEditing(false);
    } catch (err) {
      setError("Failed to save changes");
      console.error("Error saving user:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setIsEditing(false);
      setError("");
    } catch (err) {
      console.error("Error reloading user data:", err);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen py-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? "border-emerald-400" : "border-blue-600"} mx-auto`}></div>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-4`}>Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`min-h-screen py-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-rose-500">Failed to load user profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`${isDark ? "text-white" : "text-gray-900"} text-3xl font-bold`}>User Profile</h1>
          <p className={`${isDark ? "text-gray-300" : "text-gray-600"} mt-2`}>Manage your account settings and preferences</p>
        </div>

        {/* Profile Card */}
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6 mb-6`}>
          <div className="flex items-center mb-6">
            <div className={`${isDark ? "bg-gray-700" : "bg-gray-300"} w-20 h-20 rounded-full flex items-center justify-center`}>
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <svg className={`${isDark ? "text-gray-400" : "text-gray-600"} w-10 h-10`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-6">
              <h2 className={`${isDark ? "text-white" : "text-gray-900"} text-2xl font-semibold`}>{user.name}</h2>
              <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>{user.email}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {field === "name" ? "Full Name" : field === "email" ? "Email" : "Phone Number"}
                </label>
                <input
                  type={field === "phone" ? "tel" : field === "email" ? "email" : "text"}
                  value={user[field]}
                  disabled={!isEditing}
                  onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                  className={`w-full p-3 rounded-md border outline-none transition ${
                    isDark
                      ? `border-gray-600 ${isEditing ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-300"}`
                      : `${isEditing ? "bg-white text-gray-900" : "bg-gray-100 text-gray-700"} border-gray-300`
                  }`}
                />
              </div>
            ))}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Favorite Cuisine</label>
              <input
                type="text"
                value={user.preferences.cuisine}
                disabled={!isEditing}
                className={`w-full p-3 rounded-md border outline-none transition ${
                  isDark
                    ? `${isEditing ? "bg-gray-700 text-white border-gray-600" : "bg-gray-800 text-gray-300 border-gray-600"}`
                    : `${isEditing ? "bg-white text-gray-900 border-gray-300" : "bg-gray-100 text-gray-700 border-gray-300"}`
                }`}
                onChange={(e) =>
                  setUser({
                    ...user,
                    preferences: { ...user.preferences, cuisine: e.target.value },
                  })
                }
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4 items-center">
            {error && <p className="text-rose-600 text-sm">{error}</p>}
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    isDark
                      ? "bg-green-600 text-white hover:bg-green-500 disabled:opacity-50"
                      : "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className={`px-4 py-2 rounded-md font-semibold transition ${
                    isDark
                      ? "bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50"
                      : "bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                  }`}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  isDark ? "bg-blue-600 text-white hover:bg-blue-500" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Preferences Section */}
        <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-lg shadow-md p-6`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.preferences.notifications}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      preferences: { ...user.preferences, notifications: e.target.checked },
                    })
                  }
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:transition-all ${
                  isDark
                    ? "bg-gray-600 peer-checked:bg-emerald-600 after:bg-gray-800 after:border-gray-500 peer-focus:ring-4 peer-focus:ring-emerald-400"
                    : "bg-gray-200 peer-checked:bg-blue-600 after:bg-white after:border-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300"
                }`}></div>
              </label>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Dietary Restrictions</label>
              <input
                type="text"
                value={user.preferences.dietaryRestrictions}
                className={`w-full p-3 rounded-md border outline-none transition ${
                  isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="e.g., Vegetarian, Vegan, Gluten-free"
                onChange={(e) =>
                  setUser({
                    ...user,
                    preferences: { ...user.preferences, dietaryRestrictions: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
