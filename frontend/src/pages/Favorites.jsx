import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError('');
      const userFavorites = await userService.getFavorites();
      setFavorites(userFavorites);
    } catch (err) {
      setError('Failed to load favorites');
      console.error('Error loading favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (restaurantId) => {
    try {
      await userService.removeFromFavorites(restaurantId);
      setFavorites(favorites.filter(fav => fav.id !== restaurantId));
    } catch (err) {
      setError('Failed to remove from favorites');
      console.error('Error removing favorite:', err);
    }
  };

  const handleViewRestaurant = (restaurantId) => {
    if (restaurantId) {
      navigate(`/restaurant/${restaurantId}`);
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
            <p className="text-gray-600 mt-2">Your saved restaurants for quick access</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-300 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-2/3"></div>
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
          <p className="text-gray-600 mt-2">Your saved restaurants for quick access</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Restaurant Image */}
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={restaurant.image || "/api/placeholder/300/200"} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove from favorites button */}
                  <button
                    onClick={() => handleRemoveFavorite(restaurant.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Restaurant Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                    <span className="text-sm text-gray-600">${restaurant.priceRange}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine}</p>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      <span className="ml-1 text-sm text-gray-700">{restaurant.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{restaurant.address}</p>
                  
                  {restaurant.phone && (
                    <p className="text-gray-600 text-sm mb-4">📞 {restaurant.phone}</p>
                  )}

                  {restaurant.dateAdded && (
                    <p className="text-xs text-gray-400 mb-4">
                      Added on {new Date(restaurant.dateAdded).toLocaleDateString()}
                    </p>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewRestaurant(restaurant.id)}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => handleVisitWebsite(restaurant.website)}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={!restaurant.website}
                    >
                      Visit Website
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-1 text-gray-500">Start exploring restaurants and save your favorites!</p>
            <div className="mt-6">
              <a
                href="/search"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Restaurants
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
