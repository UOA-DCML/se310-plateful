package com.plateful.backend.service;

import com.plateful.backend.model.AppUser;
import com.plateful.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private AppUser testUser;
    private final String userId = "test-user-123";
    private final String restaurantId1 = "restaurant-1";
    private final String restaurantId2 = "restaurant-2";

    @BeforeEach
    void setUp() {
        testUser = new AppUser();
        testUser.setId(userId);
        testUser.setEmail("test@example.com");
        testUser.setFavoriteRestaurantIds(new ArrayList<>());
        testUser.setBrowseHistory(new ArrayList<>());
    }

    // ========== Favorites Tests ==========

    @Test
    void addFavorite_ShouldAddRestaurantToFavorites() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(AppUser.class))).thenReturn(testUser);

        // Act
        AppUser result = userService.addFavorite(userId, restaurantId1);

        // Assert
        assertNotNull(result);
        assertTrue(result.getFavoriteRestaurantIds().contains(restaurantId1));
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void addFavorite_ShouldNotAddDuplicateFavorite() {
        // Arrange
        testUser.getFavoriteRestaurantIds().add(restaurantId1);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        AppUser result = userService.addFavorite(userId, restaurantId1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getFavoriteRestaurantIds().size());
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, never()).save(any(AppUser.class));
    }

    @Test
    void addFavorite_ShouldThrowExceptionWhenUserNotFound() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            userService.addFavorite(userId, restaurantId1)
        );
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, never()).save(any(AppUser.class));
    }

    @Test
    void removeFavorite_ShouldRemoveRestaurantFromFavorites() {
        // Arrange
        testUser.getFavoriteRestaurantIds().add(restaurantId1);
        testUser.getFavoriteRestaurantIds().add(restaurantId2);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(AppUser.class))).thenReturn(testUser);

        // Act
        AppUser result = userService.removeFavorite(userId, restaurantId1);

        // Assert
        assertNotNull(result);
        assertFalse(result.getFavoriteRestaurantIds().contains(restaurantId1));
        assertTrue(result.getFavoriteRestaurantIds().contains(restaurantId2));
        assertEquals(1, result.getFavoriteRestaurantIds().size());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void getFavorites_ShouldReturnListOfFavoriteIds() {
        // Arrange
        testUser.getFavoriteRestaurantIds().add(restaurantId1);
        testUser.getFavoriteRestaurantIds().add(restaurantId2);
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        List<String> favorites = userService.getFavorites(userId);

        // Assert
        assertNotNull(favorites);
        assertEquals(2, favorites.size());
        assertTrue(favorites.contains(restaurantId1));
        assertTrue(favorites.contains(restaurantId2));
    }

    @Test
    void getFavorites_ShouldReturnEmptyListWhenNoFavorites() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        List<String> favorites = userService.getFavorites(userId);

        // Assert
        assertNotNull(favorites);
        assertTrue(favorites.isEmpty());
    }

    // ========== Browse History Tests ==========

    @Test
    void addToHistory_ShouldAddNewHistoryEntry() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(AppUser.class))).thenReturn(testUser);

        // Act
        AppUser result = userService.addToHistory(userId, restaurantId1, "Test Restaurant", "Details viewed");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getBrowseHistory().size());
        AppUser.HistoryEntry entry = result.getBrowseHistory().get(0);
        assertEquals(restaurantId1, entry.getRestaurantId());
        assertEquals("Test Restaurant", entry.getRestaurantName());
        assertEquals("Details viewed", entry.getViewType());
        assertNotNull(entry.getViewedAt());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void addToHistory_ShouldRemoveDuplicateAndAddNewEntry() {
        // Arrange
        AppUser.HistoryEntry oldEntry = new AppUser.HistoryEntry(
            restaurantId1, "Test Restaurant", null, "Details viewed"
        );
        testUser.getBrowseHistory().add(oldEntry);
        testUser.getBrowseHistory().add(new AppUser.HistoryEntry(
            restaurantId2, "Another Restaurant", null, "Details viewed"
        ));
        
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(AppUser.class))).thenReturn(testUser);

        // Act
        AppUser result = userService.addToHistory(userId, restaurantId1, "Test Restaurant", "Details viewed");

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getBrowseHistory().size());
        // The newest entry should be at index 0
        assertEquals(restaurantId1, result.getBrowseHistory().get(0).getRestaurantId());
        assertEquals(restaurantId2, result.getBrowseHistory().get(1).getRestaurantId());
    }

    @Test
    void addToHistory_ShouldLimitHistoryTo100Entries() {
        // Arrange
        for (int i = 0; i < 100; i++) {
            testUser.getBrowseHistory().add(new AppUser.HistoryEntry(
                "restaurant-" + i, "Restaurant " + i, null, "Details viewed"
            ));
        }
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(AppUser.class))).thenReturn(testUser);

        // Act
        AppUser result = userService.addToHistory(userId, "new-restaurant", "New Restaurant", "Details viewed");

        // Assert
        assertNotNull(result);
        assertEquals(100, result.getBrowseHistory().size());
        assertEquals("new-restaurant", result.getBrowseHistory().get(0).getRestaurantId());
    }

    @Test
    void addToHistory_ShouldUseDefaultViewTypeWhenNull() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(AppUser.class))).thenReturn(testUser);

        // Act
        AppUser result = userService.addToHistory(userId, restaurantId1, "Test Restaurant", null);

        // Assert
        assertNotNull(result);
        assertEquals("Details viewed", result.getBrowseHistory().get(0).getViewType());
    }

    @Test
    void getHistory_ShouldReturnHistoryList() {
        // Arrange
        testUser.getBrowseHistory().add(new AppUser.HistoryEntry(
            restaurantId1, "Restaurant 1", null, "Details viewed"
        ));
        testUser.getBrowseHistory().add(new AppUser.HistoryEntry(
            restaurantId2, "Restaurant 2", null, "Details viewed"
        ));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        List<AppUser.HistoryEntry> history = userService.getHistory(userId);

        // Assert
        assertNotNull(history);
        assertEquals(2, history.size());
    }

    @Test
    void getHistory_ShouldReturnEmptyListWhenNoHistory() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        // Act
        List<AppUser.HistoryEntry> history = userService.getHistory(userId);

        // Assert
        assertNotNull(history);
        assertTrue(history.isEmpty());
    }

    @Test
    void clearHistory_ShouldRemoveAllHistoryEntries() {
        // Arrange
        testUser.getBrowseHistory().add(new AppUser.HistoryEntry(
            restaurantId1, "Restaurant 1", null, "Details viewed"
        ));
        testUser.getBrowseHistory().add(new AppUser.HistoryEntry(
            restaurantId2, "Restaurant 2", null, "Details viewed"
        ));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(AppUser.class))).thenReturn(testUser);

        // Act
        AppUser result = userService.clearHistory(userId);

        // Assert
        assertNotNull(result);
        assertTrue(result.getBrowseHistory().isEmpty());
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void clearHistory_ShouldThrowExceptionWhenUserNotFound() {
        // Arrange
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> 
            userService.clearHistory(userId)
        );
    }
}
