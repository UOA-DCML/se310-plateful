package com.plateful.backend.service;

import com.plateful.backend.model.AppUser;
import com.plateful.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Add a restaurant to user's favorites
     */
    public AppUser addFavorite(String userId, String restaurantId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getFavoriteRestaurantIds().contains(restaurantId)) {
            user.getFavoriteRestaurantIds().add(restaurantId);
            return userRepository.save(user);
        }
        return user;
    }

    /**
     * Remove a restaurant from user's favorites
     */
    public AppUser removeFavorite(String userId, String restaurantId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getFavoriteRestaurantIds().remove(restaurantId);
        return userRepository.save(user);
    }

    /**
     * Get user's favorite restaurant IDs
     */
    public List<String> getFavorites(String userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getFavoriteRestaurantIds();
    }

    /**
     * Add an entry to user's browse history
     */
    public AppUser addToHistory(String userId, String restaurantId, String restaurantName, String viewType) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Remove any existing entry for this restaurant to avoid duplicates
        user.getBrowseHistory().removeIf(entry -> entry.getRestaurantId().equals(restaurantId));

        // Create new history entry with current timestamp
        AppUser.HistoryEntry entry = new AppUser.HistoryEntry(
                restaurantId,
                restaurantName,
                LocalDateTime.now(),
                viewType != null ? viewType : "Details viewed"
        );

        // Add to beginning of list (most recent first)
        user.getBrowseHistory().add(0, entry);

        // Keep only last 100 entries to prevent unlimited growth
        if (user.getBrowseHistory().size() > 100) {
            user.setBrowseHistory(user.getBrowseHistory().subList(0, 100));
        }

        return userRepository.save(user);
    }

    /**
     * Get user's browse history
     */
    public List<AppUser.HistoryEntry> getHistory(String userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getBrowseHistory();
    }

    /**
     * Clear user's browse history
     */
    public AppUser clearHistory(String userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.getBrowseHistory().clear();
        return userRepository.save(user);
    }
}
