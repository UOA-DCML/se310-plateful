import { useState, useEffect } from "react";

const BrowseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch real restaurants and create mock browsing history
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch("http://localhost:8080/api/restaurants");
        if (!response.ok) throw new Error("Failed to fetch restaurants");
        
        const restaurants = await response.json();
        
        if (Array.isArray(restaurants) && restaurants.length > 0) {
          // Randomly select 4-8 restaurants for browsing history
          const numItems = Math.min(Math.floor(Math.random() * 5) + 4, restaurants.length);
          const shuffled = [...restaurants].sort(() => 0.5 - Math.random());
          const selectedRestaurants = shuffled.slice(0, numItems);
          
          // Create mock browsing history with real restaurant data
          const mockHistory = selectedRestaurants.map((restaurant, index) => {
            const daysAgo = Math.floor(Math.random() * 30) + 1; // 1-30 days ago
            const viewTypes = ["Details viewed", "Menu viewed", "Photos viewed"];
            const randomViewType = viewTypes[Math.floor(Math.random() * viewTypes.length)];
            
            // Create a date in the past
            const visitedDate = new Date();
            visitedDate.setDate(visitedDate.getDate() - daysAgo);
            
            return {
              id: restaurant.id,
              restaurantName: restaurant.name,
              visitedDate: visitedDate.toISOString().split('T')[0], // YYYY-MM-DD format
              cuisine: restaurant.cuisine || "Restaurant",
              rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
              location: restaurant.address?.city || "Unknown Location",
              viewType: randomViewType,
              priceLevel: restaurant.priceLevel || 2,
              image: restaurant.images?.[0] || "https://picsum.photos/seed/restaurant/300/200",
              tags: restaurant.tags || []
            };
          });
          
          // Sort by date (most recent first)
          mockHistory.sort((a, b) => new Date(b.visitedDate) - new Date(a.visitedDate));
          setHistory(mockHistory);
        } else {
          setHistory([]);
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load browsing history");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleViewRestaurant = (restaurantId) => {
    // Navigate to restaurant details - you can implement this
    window.location.href = `/restaurant/${restaurantId}`;
  };

  const handleAddToFavorites = (restaurantId, restaurantName) => {
    // TODO: Implement add to favorites when backend is ready
    console.log(`Add ${restaurantName} to favorites`);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse History</h1>
          <p className="text-gray-600 mt-2">Restaurants you've recently viewed and explored</p>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Restaurant Image */}
                  <img 
                    src={item.image} 
                    alt={item.restaurantName}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://picsum.photos/seed/restaurant/300/200";
                    }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.restaurantName}</h3>
                    <p className="text-gray-600">{item.cuisine} • {item.location}</p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="ml-1 text-sm text-gray-700">{item.rating.toFixed(1)}</span>
                    <span className="ml-2 text-sm text-gray-500">{"$".repeat(item.priceLevel)}</span>
                  </div>
                  <p className="text-sm text-gray-500">{item.visitedDate}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.viewType}
                  </span>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => handleViewRestaurant(item.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleAddToFavorites(item.id, item.restaurantName)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                    >
                      Add to Favorites
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
