package com.plateful.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("users")
public class AppUser {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private Set<String> roles = Set.of("USER");

    private boolean enabled = true;

    private List<String> favoriteRestaurantIds = new ArrayList<>();

    private List<HistoryEntry> browseHistory = new ArrayList<>();

    public static class HistoryEntry {
        private String restaurantId;
        private String restaurantName;
        private LocalDateTime viewedAt;
        private String viewType;

        public HistoryEntry() {}

        public HistoryEntry(String restaurantId, String restaurantName, LocalDateTime viewedAt, String viewType) {
            this.restaurantId = restaurantId;
            this.restaurantName = restaurantName;
            this.viewedAt = viewedAt;
            this.viewType = viewType;
        }

        // Getters and Setters
        public String getRestaurantId() {
            return restaurantId;
        }

        public void setRestaurantId(String restaurantId) {
            this.restaurantId = restaurantId;
        }

        public String getRestaurantName() {
            return restaurantName;
        }

        public void setRestaurantName(String restaurantName) {
            this.restaurantName = restaurantName;
        }

        public LocalDateTime getViewedAt() {
            return viewedAt;
        }

        public void setViewedAt(LocalDateTime viewedAt) {
            this.viewedAt = viewedAt;
        }

        public String getViewType() {
            return viewType;
        }

        public void setViewType(String viewType) {
            this.viewType = viewType;
        }
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public List<String> getFavoriteRestaurantIds() {
        return favoriteRestaurantIds;
    }

    public List<HistoryEntry> getBrowseHistory() {
        return browseHistory;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public void setFavoriteRestaurantIds(List<String> favoriteRestaurantIds) {
        this.favoriteRestaurantIds = favoriteRestaurantIds;
    }

    public void setBrowseHistory(List<HistoryEntry> browseHistory) {
        this.browseHistory = browseHistory;
    }
}
