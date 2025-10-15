import mockData from "../data/mockUserData.json";

const STORAGE_PREFIX = "plateful:user:";
const ACTIVE_USER_KEY = "user";

// Simulate network delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const memoryStorage = new Map();

const getStorage = () =>
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage
    : {
        getItem: (key) => (memoryStorage.has(key) ? memoryStorage.get(key) : null),
        setItem: (key, value) => memoryStorage.set(key, value),
        removeItem: (key) => memoryStorage.delete(key),
      };

const deepClone = (value) =>
  value === null || typeof value !== "object"
    ? value
    : JSON.parse(JSON.stringify(value));

const fallbackImage = "https://picsum.photos/seed/restaurant/300/200";

const resolveActiveUser = () => {
  const storage = getStorage();
  const rawUser = storage.getItem(ACTIVE_USER_KEY);
  if (!rawUser) {
    return { storage, activeUser: null };
  }

  try {
    const parsed = JSON.parse(rawUser);
    return { storage, activeUser: parsed };
  } catch (err) {
    console.warn("Failed to parse active user cache", err);
    storage.removeItem(ACTIVE_USER_KEY);
    return { storage, activeUser: null };
  }
};

const ensureActiveUser = () => {
  const { storage, activeUser } = resolveActiveUser();
  if (!activeUser?.email) {
    throw new Error("No authenticated user found");
  }
  return { storage, activeUser };
};

const createInitialUserData = (activeUser) => {
  const templateUser = mockData.user ?? {};
  const baseName =
    activeUser.name ||
    activeUser.username ||
    (activeUser.email ? activeUser.email.split("@")[0] : "User");

  return {
    user: {
      id: activeUser.id || templateUser.id || `user_${Date.now()}`,
      name: baseName,
      email: activeUser.email,
      phone: activeUser.phone ?? templateUser.phone ?? "",
      avatar: activeUser.avatar ?? templateUser.avatar ?? null,
      preferences: deepClone(templateUser.preferences ?? {
        cuisine: "",
        dietaryRestrictions: "None",
        notifications: true,
      }),
      settings: deepClone(templateUser.settings ?? {}),
    },
    favorites: [],
    browseHistory: [],
  };
};

const loadUserData = () => {
  const { storage, activeUser } = ensureActiveUser();
  const storageKey = `${STORAGE_PREFIX}${activeUser.email.toLowerCase()}`;
  const raw = storage.getItem(storageKey);

  let data;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.warn("Failed to parse user data store", err);
    }
  }

  if (!data) {
    data = createInitialUserData(activeUser);
    storage.setItem(storageKey, JSON.stringify(data));
  }

  return { data, storage, storageKey, activeUser };
};

const persistUserData = (storage, key, data) => {
  storage.setItem(key, JSON.stringify(data));
};

const formatFavorite = (restaurant) => {
  const now = new Date().toISOString();
  return {
    id: restaurant.id || `fav_${Date.now()}`,
    name: restaurant.name || "Unknown Restaurant",
    cuisine: restaurant.cuisine || restaurant.tags?.[0] || "Restaurant",
    rating: restaurant.rating ?? 0,
    address:
      restaurant.address?.street
        ? `${restaurant.address.street}, ${restaurant.address.city ?? ""}`.trim()
        : restaurant.address?.city || restaurant.location || "Unknown Address",
    phone: restaurant.phone ?? null,
    priceRange: restaurant.priceRange ?? restaurant.priceLevel ?? "$$",
    image: restaurant.image || restaurant.images?.[0] || fallbackImage,
    website: restaurant.website ?? null,
    dateAdded: now,
  };
};

const normalizeHistoryRestaurant = (restaurant) => ({
  id: restaurant.id || null,
  name: restaurant.name || "Unknown Restaurant",
  cuisine: restaurant.cuisine || restaurant.tags?.[0] || "Restaurant",
  rating: restaurant.rating ?? 0,
  address:
    restaurant.address?.street
      ? `${restaurant.address.street}, ${restaurant.address.city ?? ""}`.trim()
      : restaurant.address?.city || restaurant.location || "Unknown Location",
  priceRange: restaurant.priceRange ?? restaurant.priceLevel ?? "$$",
  image: restaurant.image || restaurant.images?.[0] || fallbackImage,
  website: restaurant.website ?? null,
  tags: restaurant.tags ?? [],
});

export const userService = {
  // User Profile Operations
  async getCurrentUser() {
    await delay();
    const { data } = loadUserData();
    return deepClone(data.user);
  },

  async updateUser(updates) {
    await delay();
    const { data, storage, storageKey, activeUser } = loadUserData();
    const previousEmail = data.user.email;

    data.user = { ...data.user, ...updates };

    let nextStorageKey = storageKey;
    if (updates?.email && updates.email !== previousEmail) {
      storage.removeItem(storageKey);
      nextStorageKey = `${STORAGE_PREFIX}${updates.email.toLowerCase()}`;
    }

    persistUserData(storage, nextStorageKey, data);

    if (activeUser) {
      const mergedAuthUser = {
        ...activeUser,
        email: data.user.email,
        name: data.user.name,
        username: activeUser.username ?? data.user.name ?? data.user.email?.split("@")[0],
      };
      storage.setItem(ACTIVE_USER_KEY, JSON.stringify(mergedAuthUser));
    }

    return deepClone(data.user);
  },

  async updateUserPreferences(preferences) {
    await delay();
    const { data, storage, storageKey } = loadUserData();
    data.user.preferences = { ...data.user.preferences, ...preferences };
    persistUserData(storage, storageKey, data);
    return deepClone(data.user);
  },

  async updateUserSettings(settings) {
    await delay();
    const { data, storage, storageKey } = loadUserData();
    data.user.settings = { ...data.user.settings, ...settings };
    persistUserData(storage, storageKey, data);
    return deepClone(data.user);
  },

  // Favorites Operations
  async getFavorites() {
    await delay();
    const { data } = loadUserData();
    const favorites = [...data.favorites].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    );
    return deepClone(favorites);
  },

  async addToFavorites(restaurant) {
    await delay();
    const { data, storage, storageKey } = loadUserData();

    const alreadyExists = data.favorites.some(
      (fav) =>
        (restaurant.id && fav.id === restaurant.id) ||
        fav.name.toLowerCase() === (restaurant.name || "").toLowerCase()
    );

    if (alreadyExists) {
      throw new Error("Restaurant already in favorites");
    }

    const newFavorite = formatFavorite(restaurant);
    data.favorites.unshift(newFavorite);
    persistUserData(storage, storageKey, data);
    return deepClone(newFavorite);
  },

  async removeFromFavorites(favoriteId) {
    await delay();
    const { data, storage, storageKey } = loadUserData();
    data.favorites = data.favorites.filter((fav) => fav.id !== favoriteId);
    persistUserData(storage, storageKey, data);
    return true;
  },

  async isFavorite(restaurantNameOrId) {
    await delay(50);
    const { data } = loadUserData();
    return data.favorites.some(
      (fav) =>
        fav.id === restaurantNameOrId ||
        fav.name.toLowerCase() === String(restaurantNameOrId || "").toLowerCase()
    );
  },

  // Browse History Operations
  async getBrowseHistory() {
    await delay();
    const { data } = loadUserData();
    const history = [...data.browseHistory].sort(
      (a, b) => new Date(b.visitedDate || b.viewedAt).getTime() - new Date(a.visitedDate || a.viewedAt).getTime()
    );
    return deepClone(history);
  },

  async addToBrowseHistory(restaurant, viewType = "Details viewed") {
    await delay(100);
    const { data, storage, storageKey } = loadUserData();

    data.browseHistory = data.browseHistory.filter((item) => {
      const existingId = item.restaurant?.id;
      const incomingId = restaurant.id;
      if (existingId && incomingId) {
        return existingId !== incomingId;
      }
      return item.restaurant?.name?.toLowerCase() !== (restaurant.name || "").toLowerCase();
    });

    const normalizedRestaurant = normalizeHistoryRestaurant(restaurant);

    const newHistoryItem = {
      id: `hist_${Date.now()}`,
      restaurantId: normalizedRestaurant.id,
      visitedDate: new Date().toISOString(),
      viewType,
      restaurant: normalizedRestaurant,
    };

    data.browseHistory.unshift(newHistoryItem);

    if (data.browseHistory.length > 50) {
      data.browseHistory = data.browseHistory.slice(0, 50);
    }

    persistUserData(storage, storageKey, data);
    return deepClone(newHistoryItem);
  },

  async clearBrowseHistory() {
    await delay();
    const { data, storage, storageKey } = loadUserData();
    data.browseHistory = [];
    persistUserData(storage, storageKey, data);
    return true;
  },

  // Utility methods
  async resetMockData() {
    await delay();
    const { storage, storageKey, activeUser } = loadUserData();
    const template = createInitialUserData(activeUser);
    template.favorites = deepClone(mockData.favorites ?? []);
    template.browseHistory = deepClone(mockData.browseHistory ?? []);
    persistUserData(storage, storageKey, template);
    return deepClone(template);
  },

  // Export current data (for debugging)
  getCurrentData() {
    const { data } = loadUserData();
    return deepClone(data);
  },
};

export default userService;
