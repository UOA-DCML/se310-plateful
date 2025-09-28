const BrowseHistory = () => {
  // Mock browsing history data - replace with actual data when backend is ready
  const history = [
    {
      id: 1,
      restaurantName: "Bella's Italian",
      visitedDate: "2024-09-25",
      cuisine: "Italian",
      rating: 4.8,
      location: "Downtown",
      viewType: "Details viewed"
    },
    {
      id: 2,
      restaurantName: "Tokyo Sushi Bar", 
      visitedDate: "2024-09-20",
      cuisine: "Japanese",
      rating: 4.6,
      location: "Midtown",
      viewType: "Menu viewed"
    },
    {
      id: 3,
      restaurantName: "The Garden Café",
      visitedDate: "2024-09-18",
      cuisine: "Vegetarian",
      rating: 4.7,
      location: "Uptown", 
      viewType: "Details viewed"
    },
    {
      id: 4,
      restaurantName: "Burger Palace",
      visitedDate: "2024-09-15",
      cuisine: "American",
      rating: 4.2,
      location: "West End",
      viewType: "Menu viewed"
    }
  ];

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
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.restaurantName}</h3>
                  <p className="text-gray-600">{item.cuisine} • {item.location}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                    <span className="ml-1 text-sm text-gray-700">{item.rating}</span>
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
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm">
                      View
                    </button>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm">
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
