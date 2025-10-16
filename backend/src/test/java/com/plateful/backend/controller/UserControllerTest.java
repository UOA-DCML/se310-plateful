package com.plateful.backend.controller;

import com.plateful.backend.model.AppUser;
import com.plateful.backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    private final String userId = "test-user-123";
    private final String restaurantId = "restaurant-1";

    // ========== Favorites Tests ==========

    @Test
    void getFavorites_ShouldReturnListOfFavoriteIds() throws Exception {
        // Arrange
        List<String> favorites = Arrays.asList("restaurant-1", "restaurant-2", "restaurant-3");
        when(userService.getFavorites(userId)).thenReturn(favorites);

        // Act & Assert
        mockMvc.perform(get("/api/user/favorites")
                .param("userId", userId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0]").value("restaurant-1"))
                .andExpect(jsonPath("$[1]").value("restaurant-2"))
                .andExpect(jsonPath("$[2]").value("restaurant-3"));

        verify(userService, times(1)).getFavorites(userId);
    }

    @Test
    void getFavorites_ShouldReturnEmptyListWhenNoFavorites() throws Exception {
        // Arrange
        when(userService.getFavorites(userId)).thenReturn(Arrays.asList());

        // Act & Assert
        mockMvc.perform(get("/api/user/favorites")
                .param("userId", userId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void addFavorite_ShouldReturnSuccessMessage() throws Exception {
        // Arrange
        AppUser mockUser = new AppUser();
        mockUser.setId(userId);
        when(userService.addFavorite(userId, restaurantId)).thenReturn(mockUser);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userId", userId);
        requestBody.put("restaurantId", restaurantId);

        // Act & Assert
        mockMvc.perform(post("/api/user/favorites")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Added to favorites"));

        verify(userService, times(1)).addFavorite(userId, restaurantId);
    }

    @Test
    void removeFavorite_ShouldReturnSuccessMessage() throws Exception {
        // Arrange
        AppUser mockUser = new AppUser();
        mockUser.setId(userId);
        when(userService.removeFavorite(userId, restaurantId)).thenReturn(mockUser);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userId", userId);
        requestBody.put("restaurantId", restaurantId);

        // Act & Assert
        mockMvc.perform(delete("/api/user/favorites")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Removed from favorites"));

        verify(userService, times(1)).removeFavorite(userId, restaurantId);
    }

    // ========== Browse History Tests ==========

    @Test
    void getHistory_ShouldReturnListOfHistoryEntries() throws Exception {
        // Arrange
        List<AppUser.HistoryEntry> history = Arrays.asList(
            new AppUser.HistoryEntry("restaurant-1", "Restaurant 1", LocalDateTime.now(), "Details viewed"),
            new AppUser.HistoryEntry("restaurant-2", "Restaurant 2", LocalDateTime.now().minusHours(1), "Details viewed")
        );
        when(userService.getHistory(userId)).thenReturn(history);

        // Act & Assert
        mockMvc.perform(get("/api/user/history")
                .param("userId", userId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].restaurantId").value("restaurant-1"))
                .andExpect(jsonPath("$[0].restaurantName").value("Restaurant 1"))
                .andExpect(jsonPath("$[1].restaurantId").value("restaurant-2"));

        verify(userService, times(1)).getHistory(userId);
    }

    @Test
    void addToHistory_ShouldReturnSuccessMessage() throws Exception {
        // Arrange
        AppUser mockUser = new AppUser();
        mockUser.setId(userId);
        when(userService.addToHistory(eq(userId), eq(restaurantId), eq("Test Restaurant"), anyString()))
            .thenReturn(mockUser);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userId", userId);
        requestBody.put("restaurantId", restaurantId);
        requestBody.put("restaurantName", "Test Restaurant");
        requestBody.put("viewType", "Details viewed");

        // Act & Assert
        mockMvc.perform(post("/api/user/history")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Added to history"));

        verify(userService, times(1)).addToHistory(userId, restaurantId, "Test Restaurant", "Details viewed");
    }

    @Test
    void clearHistory_ShouldReturnSuccessMessage() throws Exception {
        // Arrange
        AppUser mockUser = new AppUser();
        mockUser.setId(userId);
        when(userService.clearHistory(userId)).thenReturn(mockUser);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userId", userId);

        // Act & Assert
        mockMvc.perform(delete("/api/user/history")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("History cleared"));

        verify(userService, times(1)).clearHistory(userId);
    }

    @Test
    void addFavorite_ShouldReturnErrorWhenServiceThrowsException() throws Exception {
        // Arrange
        when(userService.addFavorite(userId, restaurantId))
            .thenThrow(new RuntimeException("User not found"));

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("userId", userId);
        requestBody.put("restaurantId", restaurantId);

        // Act & Assert
        mockMvc.perform(post("/api/user/favorites")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(requestBody)))
                .andExpect(status().isInternalServerError());
    }
}
