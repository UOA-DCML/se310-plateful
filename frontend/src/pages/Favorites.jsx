const Favorites = () => {
  // Mock favorite restaurants data - replace with actual data when backend is ready
  const favorites = [
    {
      id: 1,
      name: "Bella's Italian",
      cuisine: "Italian",
      rating: 4.8,
      image: "/api/placeholder/300/200",
      address: "123 Main St, Downtown",
      priceRange: "$$"
    },
    {
      id: 2,
      name: "Tokyo Sushi Bar",
      cuisine: "Japanese",
      rating: 4.6,
      image: "/api/placeholder/300/200",
      address: "456 Oak Ave, Midtown",
      priceRange: "$$$"
    },
    {
      id: 3,
      name: "The Garden Café",
      cuisine: "Vegetarian",
      rating: 4.7,
      image: "/api/placeholder/300/200",
      address: "789 Pine Rd, Uptown",
      priceRange: "$"
    }
  ];

  const removeFavorite = (id) => {
    // TODO: Implement remove favorite logic when backend is ready
    console.log(`Remove favorite restaurant with id: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Favorites</h1>
          <p className="text-gray-600 mt-2">Your saved restaurants for quick access</p>
        </div>

        {/* Favorites Grid */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Restaurant Image */}
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove from favorites button */}
                  <button
                    onClick={() => removeFavorite(restaurant.id)}
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
                    <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
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
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm">
                      View Menu
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm">
                      Order Now
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
