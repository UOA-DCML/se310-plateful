import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext'; // adjust path

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const { isDark } = useTheme();

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`http://localhost:8080/api/user/favorites?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to load favorites');
      const favoriteIds = await response.json();

      const restaurantPromises = favoriteIds.map(async (id) => {
        try {
          const res = await fetch(`http://localhost:8080/api/restaurants/${id}`);
          if (res.ok) return await res.json();
          return null;
        } catch (err) {
          return null;
        }
      });

      const restaurants = await Promise.all(restaurantPromises);
      setFavorites(restaurants.filter(r => r !== null));
    } catch (err) {
      setError('Failed to load favorites');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (restaurantId) => {
    if (!user?.id) return;

    try {
      const response = await fetch('http://localhost:8080/api/user/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, restaurantId }),
      });

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.id !== restaurantId));
        toast.success('Removed from favorites');
      } else throw new Error('Failed to remove favorite');
    } catch (err) {
      setError('Failed to remove from favorites');
      toast.error('Failed to remove from favorites');
      console.error(err);
    }
  };

  const handleViewRestaurant = (restaurantId) => {
    if (restaurantId) navigate(`/restaurant/${restaurantId}`);
  };

  const handleVisitWebsite = (website) => {
    if (website) window.open(website, '_blank', 'noopener,noreferrer');
  };

  const bgClass = isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const placeholderBg = isDark ? 'bg-gray-700' : 'bg-gray-300';
  const btnBlue = isDark ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-600 hover:bg-blue-700';
  const btnGreen = isDark ? 'bg-green-600 hover:bg-green-500' : 'bg-green-600 hover:bg-green-700';

  if (loading) {
    return (
      <div className={`min-h-screen py-8 ${bgClass}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Favorites</h1>
            <p className="mt-2 text-gray-400">Your saved restaurants for quick access</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className={`${cardBg} rounded-lg shadow-md overflow-hidden`}>
                <div className={`h-48 ${placeholderBg} animate-pulse`}></div>
                <div className="p-4 space-y-3">
                  <div className={`h-4 ${placeholderBg} rounded animate-pulse`}></div>
                  <div className={`h-3 ${placeholderBg} rounded animate-pulse w-2/3`}></div>
                  <div className={`h-3 ${placeholderBg} rounded animate-pulse w-1/2`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 ${bgClass}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Favorites</h1>
          <p className="mt-2 text-gray-400">Your saved restaurants for quick access</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(r => (
              <div key={r.id} className={`${cardBg} rounded-lg shadow-md overflow-hidden hover:shadow-lg transition`}>
                <div className="relative h-48">
                  <img 
                    src={(r.images && r.images[0]) || r.image || "/api/placeholder/300/200"} 
                    alt={r.name}
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src="/api/placeholder/300/200"}
                  />
                  <button
                    onClick={() => handleRemoveFavorite(r.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{r.name}</h3>
                    <span className="text-sm">{'$'.repeat(r.priceLevel || r.priceRange || 2)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{r.cuisine}</p>
                  <p className="text-sm text-gray-400 mb-4">{r.address?.street || r.address}, {r.address?.city || ''}</p>
                  {r.phone && <p className="text-sm text-gray-400 mb-4">📞 {r.phone}</p>}
                  <div className="flex space-x-2">
                    <button onClick={() => handleViewRestaurant(r.id)} className={`flex-1 py-2 px-4 rounded-md text-white ${btnBlue} text-sm`}>View Details</button>
                    <button onClick={() => handleVisitWebsite(r.website)} disabled={!r.website} className={`flex-1 py-2 px-4 rounded-md text-white ${btnGreen} text-sm ${!r.website ? 'opacity-50 cursor-not-allowed' : ''}`}>Visit Website</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium">No favorites yet</h3>
            <p className="mt-1 text-gray-400">Start exploring restaurants and save your favorites!</p>
            <div className="mt-6">
              <Link to="/search" className={`inline-flex items-center px-4 py-2 rounded-md text-white ${btnBlue}`}>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Restaurants
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
