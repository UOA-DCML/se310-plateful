// Mock User Service - simulates API calls to user backend
// TODO: Replace with real API calls when backend is ready

import mockData from '../data/mockUserData.json';

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage to persist changes during session
let userData = JSON.parse(JSON.stringify(mockData));

export const userService = {
  // User Profile Operations
  async getCurrentUser() {
    await delay();
    return userData.user;
  },

  async updateUser(updates) {
    await delay();
    userData.user = { ...userData.user, ...updates };
    return userData.user;
  },

  async updateUserPreferences(preferences) {
    await delay();
    userData.user.preferences = { ...userData.user.preferences, ...preferences };
    return userData.user;
  },

  async updateUserSettings(settings) {
    await delay();
    userData.user.settings = { ...userData.user.settings, ...settings };
    return userData.user;
  },

  // Favorites Operations
  async getFavorites() {
    await delay();
    return userData.favorites.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  },

  async addToFavorites(restaurant) {
    await delay();
    
    // Check if already in favorites
    const existingFav = userData.favorites.find(
      fav => fav.restaurant.name === restaurant.name
    );
    
    if (existingFav) {
      throw new Error('Restaurant already in favorites');
    }

    const newFavorite = {
      id: `fav_${Date.now()}`,
      restaurantId: restaurant.id || null,
      dateAdded: new Date().toISOString(),
      restaurant: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating || 4.5,
        image: restaurant.image || restaurant.images?.[0] || 'https://picsum.photos/seed/restaurant/300/200',
        address: restaurant.address?.street ? 
          `${restaurant.address.street}, ${restaurant.address.city}` : 
          restaurant.location || 'Unknown Address',
        priceLevel: restaurant.priceLevel || 2
      }
    };

    userData.favorites.unshift(newFavorite);
    return newFavorite;
  },

  async removeFromFavorites(favoriteId) {
    await delay();
    userData.favorites = userData.favorites.filter(fav => fav.id !== favoriteId);
    return true;
  },

  async isFavorite(restaurantName) {
    await delay(50); // Shorter delay for quick checks
    return userData.favorites.some(fav => fav.restaurant.name === restaurantName);
  },

  // Browse History Operations
  async getBrowseHistory() {
    await delay();
    return userData.browseHistory.sort((a, b) => new Date(b.visitedDate) - new Date(a.visitedDate));
  },

  async addToBrowseHistory(restaurant, viewType = 'Details viewed') {
    await delay(100);
    
    // Remove existing entry for same restaurant (to update timestamp)
    userData.browseHistory = userData.browseHistory.filter(
      item => item.restaurant.name !== restaurant.name
    );

    const newHistoryItem = {
      id: `hist_${Date.now()}`,
      restaurantId: restaurant.id || null,
      visitedDate: new Date().toISOString(),
      viewType,
      restaurant: {
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating || 4.5,
        image: restaurant.image || restaurant.images?.[0] || 'https://picsum.photos/seed/restaurant/300/200',
        location: restaurant.address?.city || 'Unknown Location',
        priceLevel: restaurant.priceLevel || 2,
        tags: restaurant.tags || []
      }
    };

    userData.browseHistory.unshift(newHistoryItem);

    // Keep only last 50 items
    if (userData.browseHistory.length > 50) {
      userData.browseHistory = userData.browseHistory.slice(0, 50);
    }

    return newHistoryItem;
  },

  async clearBrowseHistory() {
    await delay();
    userData.browseHistory = [];
    return true;
  },

  // Utility methods
  async resetMockData() {
    await delay();
    userData = JSON.parse(JSON.stringify(mockData));
    return userData;
  },

  // Export current data (for debugging)
  getCurrentData() {
    return userData;
  }
};

export default userService;
