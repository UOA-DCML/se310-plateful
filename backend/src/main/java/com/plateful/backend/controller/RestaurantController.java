package com.plateful.backend.controller;

import com.plateful.backend.model.Restaurant;
import com.plateful.backend.repository.RestaurantRepository;
import com.plateful.backend.service.RestaurantSearchService;
import com.plateful.backend.service.RestaurantService;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/**
 * REST controller handling all restaurant-related endpoints. Provides APIs for restaurant listing,
 * searching, filtering, and cuisine discovery. Configured to accept CORS requests from development
 * frontend servers.
 */
@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class RestaurantController {

  private final RestaurantService restaurantService;
  private final RestaurantSearchService searchService;
  private final RestaurantRepository restaurantRepository;

  public RestaurantController(
      RestaurantService restaurantService,
      RestaurantSearchService searchService,
      RestaurantRepository restaurantRepository) {
    this.restaurantService = restaurantService;
    this.searchService = searchService;
    this.restaurantRepository = restaurantRepository;
  }

  /** Get all restaurants (no filters). */
  @GetMapping
  public List<Restaurant> list() {
    return restaurantService.getAllRestaurants();
  }

  /** Get a single restaurant by id. */
  @GetMapping("/{id}")
  public Restaurant get(@PathVariable String id) {
    return restaurantService
        .getRestaurantById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found: " + id));
  }

  /**
   * Basic search endpoint that performs a case-insensitive partial match across restaurant names,
   * descriptions, and cuisines.
   *
   * @param query The search term to match against multiple fields
   * @return List of restaurants matching the search criteria, or all restaurants if query is empty
   */
  @GetMapping("/search")
  public List<Restaurant> search(@RequestParam(required = false) String query) {
    if (query == null || query.trim().isEmpty()) {
      return restaurantService.getAllRestaurants();
    }
    return restaurantService.searchRestaurants(query.trim());
  }

  /**
   * Advanced filtering endpoint that combines multiple search criteria. Supports filtering by text
   * search, cuisine type, price range, reservation availability, current operating status, and city
   * location. All parameters are optional.
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
      @RequestParam(required = false) List<String> city) {

    // Optional: quick guard for inverted price bounds (fail fast or swap; here we fail fast)
    if (priceMin != null && priceMax != null && priceMin > priceMax) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "priceMin cannot be greater than priceMax");
    }

    List<Restaurant> base =
        searchService.filter(cuisine, priceMin, priceMax, reservation, openNow, city);

    return searchService.filterByTextQuery(base, query);
  }

  /**
   * Retrieves a unique, sorted list of all available cuisine types in the system. Filters out null
   * or empty cuisine values for data consistency.
   *
   * @return Alphabetically sorted list of unique cuisine types
   */
  @GetMapping("/cuisines")
  public List<String> getCuisines() {
    return restaurantService.getAllCuisines();
  }

  /**
   * Fetch restaurants by tags.
   * - any: returns restaurants that match ANY of the provided tags
   * - all: returns restaurants that match ALL of the provided tags
   * If both are empty/missing, returns all restaurants.
   */
  @GetMapping("/by-tags")
  public List<Restaurant> byTags(
      @RequestParam(required = false, name = "any") List<String> any,
      @RequestParam(required = false, name = "all") List<String> all) {

    // Normalize empty lists to null for simpler checks
    boolean hasAll = all != null && !all.isEmpty();
    boolean hasAny = any != null && !any.isEmpty();

    if (hasAll) {
      return restaurantRepository.findByTagsAll(all);
    }
    if (hasAny) {
      return restaurantRepository.findByTagsIn(any);
    }
    return restaurantService.getAllRestaurants();
  }
  @GetMapping("/popular")
public List<Restaurant> getPopular() {
  return restaurantService.getPopularRestaurants();
}

}
