import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';
import { buildApiUrl } from '../lib/config';
import { useTheme } from '../context/ThemeContext'; // adjust path

const BrowseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const { isDark } = useTheme();

  useEffect(() => {
    const loadHistory = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError('');
        const response = await fetch(buildApiUrl(`/api/user/history?userId=${user.id}`));
        if (!response.ok) throw new Error('Failed to load history');
        const historyEntries = await response.json();
        const recentEntries = historyEntries.slice(0, 20);
        const historyWithDetails = await Promise.all(
          recentEntries.map(async (entry) => {
            try {
              const res = await fetch(buildApiUrl(`/api/restaurants/${entry.restaurantId}`));
              if (!res.ok) return { ...entry, restaurant: { id: entry.restaurantId, name: entry.restaurantName } };
              const restaurant = await res.json();
              return { ...entry, restaurant };
            } catch {
              return { ...entry, restaurant: { id: entry.restaurantId, name: entry.restaurantName } };
            }
          })
        );
        setHistory(historyWithDetails);
      } catch (err) {
        setError('Failed to load browsing history');
        setHistory([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  const handleViewRestaurant = (restaurantId) => {
    if (restaurantId) navigate(`/restaurant/${restaurantId}`);
  };

  const handleClearHistory = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(buildApiUrl('/api/user/history'), {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (response.ok) {
        setHistory([]);
        toast.success('History cleared');
      } else throw new Error('Failed to clear history');
    } catch (err) {
      setError('Failed to clear history');
      toast.error('Failed to clear history');
      console.error(err);
    }
  };

  const handleVisitWebsite = (website) => {
    if (website) window.open(website, '_blank', 'noopener,noreferrer');
  };

  const bgClass = isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const textGray = isDark ? 'text-gray-300' : 'text-gray-600';
  const textGrayLight = isDark ? 'text-gray-400' : 'text-gray-500';
  const btnBlue = isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700';
  const btnRed = isDark ? 'bg-red-600 hover:bg-red-500' : 'bg-red-600 hover:bg-red-700';
  const btnPurple = isDark ? 'bg-purple-600 hover:bg-purple-500' : 'bg-purple-600 hover:bg-purple-700';

  if (loading) {
    return (
      <div className={`min-h-screen py-8 ${bgClass}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className={`mt-4 ${textGray}`}>Loading your browsing history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen py-8 ${bgClass}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${bgClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Browse History</h1>
            <p className={`${textGray} mt-2`}>
              {history.length > 0
                ? `Your ${history.length} most recently viewed restaurant${history.length !== 1 ? 's' : ''} (up to 20)`
                : 'Restaurants you\'ve recently viewed and explored'}
            </p>
          </div>
          {history.length > 0 && (
            <button onClick={handleClearHistory} className={`text-white px-4 py-2 rounded-md transition ${btnRed} text-sm`}>
              Clear History
            </button>
          )}
        </div>

        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className={`${cardBg} rounded-lg shadow-md p-6`}>
              <div className={`flex items-center justify-between mb-4`}>
                <div className="flex items-start space-x-4">
                  <img
                    src={(item.restaurant?.images && item.restaurant.images[0]) || item.restaurant?.image || "https://picsum.photos/seed/restaurant/300/200"}
                    alt={item.restaurant?.name || "Restaurant"}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = "https://picsum.photos/seed/restaurant/300/200"; }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.restaurant?.name || "Unknown Restaurant"}</h3>
                    <p className={`${textGray}`}>
                      {item.restaurant?.cuisine || "Restaurant"} • {item.restaurant?.address?.street || item.restaurant?.address || "Unknown Location"}
                    </p>
                    {item.searchQuery && <p className={`${textGrayLight} text-sm`}>Searched: "{item.searchQuery}"</p>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      {item.restaurant?.upvoteCount || 0}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm text-red-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                      </svg>
                      {item.restaurant?.downvoteCount || 0}
                    </span>
                    <span className={`ml-2 text-sm ${textGrayLight}`}>
                      {item.restaurant?.priceLevel ? '$'.repeat(item.restaurant.priceLevel) : (item.restaurant?.priceRange ? '$' + item.restaurant.priceRange : "N/A")}
                    </span>
                  </div>
                  <p className={`${textGrayLight} text-sm`}>
                    {item.visitedDate || item.viewedAt ? new Date(item.visitedDate || item.viewedAt).toLocaleDateString() : "Recently"}
                  </p>
                </div>
              </div>

              <div className={`border-t ${borderColor} pt-4`}>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Viewed details
                  </span>
                  <div className="flex space-x-3">
                    <button onClick={() => handleViewRestaurant(item.restaurant?.id)} className={`px-4 py-2 rounded-md text-white text-sm ${btnBlue}`}>View Details</button>
                    <button onClick={() => handleVisitWebsite(item.restaurant?.website)} disabled={!item.restaurant?.website} className={`px-4 py-2 rounded-md text-white text-sm ${btnPurple} ${!item.restaurant?.website ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {history.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No browsing history yet</h3>
            <p className={`${textGrayLight} mt-1`}>Start exploring restaurants to see your browsing history!</p>
            <div className="mt-6">
              <Link to="/search" className={`inline-flex items-center px-4 py-2 rounded-md text-white ${btnBlue}`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start Exploring
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseHistory;
