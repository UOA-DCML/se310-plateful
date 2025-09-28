package com.plateful.backend.controller;

import com.plateful.backend.model.Restaurant;
import com.plateful.backend.service.RestaurantService;
import com.plateful.backend.service.RestaurantSearchService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * REST controller handling all restaurant-related endpoints.
 * Provides APIs for restaurant listing, searching, filtering, and cuisine discovery.
 * Configured to accept CORS requests from development frontend servers.
 */
@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantSearchService searchService;

    public RestaurantController(RestaurantService restaurantService, RestaurantSearchService searchService) {
        this.restaurantService = restaurantService;
        this.searchService = searchService;
    }

    /**
     * Get all restaurants (no filters)
     */
    @GetMapping
    public List<Restaurant> list() {
        return restaurantService.getAllRestaurants();
    }

    /**
     * Get a single restaurant by id
     */
    @GetMapping("/{id}")
    public Restaurant get(@PathVariable String id) {
        return restaurantService.getRestaurantById(id)
                .orElseThrow(() -> new RuntimeException("Not found: " + id));
    }

    /**
     * Basic search endpoint that performs a case-insensitive partial match
     * across restaurant names, descriptions, and cuisines.
     * @param query The search term to match against multiple fields
     * @return List of restaurants matching the search criteria, or all restaurants if query is empty
     */
    @GetMapping("/search")
    public List<Restaurant> search(@RequestParam String query) {
        return restaurantService.searchRestaurants(query);
    }

    /**
     * Advanced filtering endpoint that combines multiple search criteria.
     * Supports filtering by text search, cuisine type, price range, reservation availability,
     * current operating status, and city location. All parameters are optional.
     *
     * @param query Free text search across name, description, and cuisine
     * @param cuisine Specific cuisine type to filter by
     * @param priceMin Minimum price range (inclusive)
     * @param priceMax Maximum price range (inclusive)
     * @param reservation Filter for restaurants that accept reservations
     * @param openNow Filter for currently open restaurants
     * @param city List of cities to include in search
     * @return Filtered list of restaurants matching all specified criteria
     */
    @GetMapping("/filter")
    public List<Restaurant> filter(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) Integer priceMin,
            @RequestParam(required = false) Integer priceMax,
            @RequestParam(required = false) Boolean reservation,
            @RequestParam(required = false) Boolean openNow,
            @RequestParam(required = false) List<String> city
    ) {
        List<Restaurant> base = searchService.filter(
                cuisine, priceMin, priceMax, reservation, openNow, city
        );

        return searchService.filterByTextQuery(base, query);
    }

    /**
     * Retrieves a unique, sorted list of all available cuisine types in the system.
     * Filters out null or empty cuisine values for data consistency.
     * @return Alphabetically sorted list of unique cuisine types
     */
    @GetMapping("/cuisines")
    public List<String> getCuisines() {
        return restaurantService.getAllCuisines();
    }
}