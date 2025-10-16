package com.plateful.backend.controller;

import com.plateful.backend.model.AppUser;
import com.plateful.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for user-specific operations including favorites and browse history.
 * NOTE: Currently endpoints are public for testing. JWT authentication should be added later.
 */
@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get user's favorite restaurant IDs
     * @param userId The user ID (for now passed as query param since we don't have JWT auth filter yet)
     */
    @GetMapping("/favorites")
    public ResponseEntity<List<String>> getFavorites(@RequestParam String userId) {
        List<String> favorites = userService.getFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    /**
     * Add a restaurant to favorites
     * Request body: { "userId": "123", "restaurantId": "12345" }
     */
    @PostMapping("/favorites")
    public ResponseEntity<Map<String, Object>> addFavorite(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String restaurantId = request.get("restaurantId");

        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
        }
        if (restaurantId == null || restaurantId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "restaurantId is required"));
        }

        userService.addFavorite(userId, restaurantId);
        return ResponseEntity.ok(Map.of("message", "Added to favorites", "restaurantId", restaurantId));
    }

    /**
     * Remove a restaurant from favorites
     * Request body: { "userId": "123", "restaurantId": "12345" }
     */
    @DeleteMapping("/favorites")
    public ResponseEntity<Map<String, Object>> removeFavorite(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String restaurantId = request.get("restaurantId");

        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
        }
        if (restaurantId == null || restaurantId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "restaurantId is required"));
        }

        userService.removeFavorite(userId, restaurantId);
        return ResponseEntity.ok(Map.of("message", "Removed from favorites", "restaurantId", restaurantId));
    }

    /**
     * Get user's browse history
     * @param userId The user ID (for now passed as query param)
     */
    @GetMapping("/history")
    public ResponseEntity<List<AppUser.HistoryEntry>> getHistory(@RequestParam String userId) {
        List<AppUser.HistoryEntry> history = userService.getHistory(userId);
        return ResponseEntity.ok(history);
    }

    /**
     * Add an entry to browse history
     * Request body: { "userId": "123", "restaurantId": "12345", "restaurantName": "Restaurant Name", "viewType": "Details viewed" }
     */
    @PostMapping("/history")
    public ResponseEntity<Map<String, Object>> addToHistory(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String restaurantId = request.get("restaurantId");
        String restaurantName = request.get("restaurantName");
        String viewType = request.getOrDefault("viewType", "Details viewed");

        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
        }
        if (restaurantId == null || restaurantId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "restaurantId is required"));
        }
        if (restaurantName == null || restaurantName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "restaurantName is required"));
        }

        userService.addToHistory(userId, restaurantId, restaurantName, viewType);
        return ResponseEntity.ok(Map.of("message", "Added to history"));
    }

    /**
     * Clear browse history
     * Request body: { "userId": "123" }
     */
    @DeleteMapping("/history")
    public ResponseEntity<Map<String, Object>> clearHistory(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");

        if (userId == null || userId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId is required"));
        }

        userService.clearHistory(userId);
        return ResponseEntity.ok(Map.of("message", "History cleared"));
    }
}
