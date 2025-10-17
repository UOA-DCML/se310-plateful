import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';
import { buildApiUrl } from '../lib/config';

const BrowseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;

  // Load browse history from backend API
  useEffect(() => {
    const loadHistory = async () => {
      console.log('[History] User:', user);
      if (!user?.id) {
        console.log('[History] No user ID, skipping load');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        // Get browse history from backend
        console.log('[History] Fetching history for user:', user.id);
        const response = await fetch(buildApiUrl(`/api/user/history?userId=${user.id}`));
        console.log('[History] Response status:', response.status);
        
        if (!response.ok) {
          throw new Error('Failed to load history');
        }
        
        const historyEntries = await response.json();
        console.log('[History] Received history entries:', historyEntries);
        
        // Limit to most recent 20 entries
        const recentEntries = historyEntries.slice(0, 20);
        
        // Fetch full restaurant details for each history entry
        const historyWithDetails = await Promise.all(recentEntries.map(async (entry) => {
          try {
            const res = await fetch(buildApiUrl(`/api/restaurants/${entry.restaurantId}`));
            if (!res.ok) {
              return {
                ...entry,
                restaurant: { id: entry.restaurantId, name: entry.restaurantName }
              };
            }
            const restaurant = await res.json();
            return {
              ...entry,
              restaurant: restaurant
            };
          } catch (err) {
            console.error('[History] Error fetching restaurant:', entry.restaurantId, err);
            return {
              ...entry,
              restaurant: { id: entry.restaurantId, name: entry.restaurantName }
            };
          }
        }));
        
        console.log('[History] Final history:', historyWithDetails);
        setHistory(historyWithDetails);
      } catch (err) {
        console.error("[History] Error loading browse history:", err);
        setError("Failed to load browsing history");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user]);

  const handleViewRestaurant = (restaurantId) => {
    if (restaurantId) {
      navigate(`/restaurant/${restaurantId}`);
    }
  };

  const handleClearHistory = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(buildApiUrl('/api/user/history'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        setHistory([]);
        toast.success('History cleared');
      } else {
        throw new Error('Failed to clear history');
      }
    } catch (err) {
      setError('Failed to clear history');
      toast.error('Failed to clear history');
      console.error('Error clearing history:', err);
    }
  };

  const handleVisitWebsite = (website) => {
    if (website) {
      window.open(website, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your browsing history...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse History</h1>
            <p className="text-gray-600 mt-2">
              {history.length > 0 
                ? `Your ${history.length} most recently viewed restaurant${history.length !== 1 ? 's' : ''} (up to 20)`
                : 'Restaurants you\'ve recently viewed and explored'}
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm"
            >
              Clear History
            </button>
          )}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {history.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Restaurant Image */}
                  <img 
                    src={(item.restaurant?.images && item.restaurant.images[0]) || item.restaurant?.image || "https://picsum.photos/seed/restaurant/300/200"} 
                    alt={item.restaurant?.name || "Restaurant"}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/seed/restaurant/300/200";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.restaurant?.name || "Unknown Restaurant"}</h3>
                    <p className="text-gray-600">
                      {item.restaurant?.cuisine || "Restaurant"} • {item.restaurant?.address?.street || item.restaurant?.address || "Unknown Location"}
                    </p>
                    {item.searchQuery && (
                      <p className="text-sm text-gray-500">Searched: "{item.searchQuery}"</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="ml-1 text-sm text-gray-700">{item.restaurant?.rating || "N/A"}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {item.restaurant?.priceLevel ? '$'.repeat(item.restaurant.priceLevel) : (item.restaurant?.priceRange ? '$' + item.restaurant.priceRange : "N/A")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.visitedDate || item.viewedAt
                      ? new Date(item.visitedDate || item.viewedAt).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Viewed details
                  </span>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleViewRestaurant(item.restaurant?.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleVisitWebsite(item.restaurant?.website)}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!item.restaurant?.website}
                    >
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
            <h3 className="mt-2 text-lg font-medium text-gray-900">No browsing history yet</h3>
            <p className="mt-1 text-gray-500">Start exploring restaurants to see your browsing history!</p>
            <div className="mt-6">
              <a
                href="/search"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Start Exploring
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseHistory;
