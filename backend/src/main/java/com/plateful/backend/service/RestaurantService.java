package com.plateful.backend.service;

import com.plateful.backend.model.Restaurant;
import com.plateful.backend.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * Service responsible for basic restaurant operations.
 * Handles CRUD operations, basic search, and cuisine retrieval.
 */
@Service
public class RestaurantService {

    private final RestaurantRepository repository;

    public RestaurantService(RestaurantRepository repository) {
        this.repository = repository;
    }

    /**
     * Retrieves all restaurants from the database.
     * @return List of all restaurants
     */
    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }

    /**
     * Retrieves a restaurant by its ID.
     * @param id The restaurant ID
     * @return Optional containing the restaurant if found
     */
    public Optional<Restaurant> getRestaurantById(String id) {
        return repository.findById(id);
    }

    /**
     * Performs a basic search across restaurant name, description, and cuisine.
     * @param query The search term to match against multiple fields
     * @return List of restaurants matching the search criteria
     */
    public List<Restaurant> searchRestaurants(String query) {
        if (query == null || query.trim().isEmpty()) {
            return repository.findAll();
        }
        return repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCuisineContainingIgnoreCase(
            query, query, query);
    }

    /**
     * Retrieves a unique, sorted list of all available cuisine types in the system.
     * Filters out null or empty cuisine values for data consistency.
     * @return Alphabetically sorted list of unique cuisine types
     */
    public List<String> getAllCuisines() {
        return repository.findAllCuisines()
            .stream()
            .map(Restaurant::getCuisine)
            .filter(cuisine -> cuisine != null && !cuisine.trim().isEmpty())
            .distinct()
            .sorted()
            .toList();
    }
}