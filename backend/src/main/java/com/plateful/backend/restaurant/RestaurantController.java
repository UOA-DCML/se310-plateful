package com.plateful.backend.restaurant;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST controller handling all restaurant-related endpoints.
 * Provides APIs for restaurant listing, searching, filtering, and cuisine discovery.
 * Configured to accept CORS requests from development frontend servers.
 */
@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class RestaurantController {

  private final RestaurantRepository repo;
  private final RestaurantSearchService searchService;

  public RestaurantController(RestaurantRepository repo, RestaurantSearchService searchService) {
    this.repo = repo;
    this.searchService = searchService;
  }

  /** Get all restaurants (no filters) */
  @GetMapping
  public List<Restaurant> list() {
    return repo.findAll();
  }

  /** Get a single restaurant by id */
  @GetMapping("/{id}")
  public Restaurant get(@PathVariable String id) {
    return repo.findById(id).orElseThrow(() -> new RuntimeException("Not found: " + id));
  }

  /**
   * Basic search endpoint that performs a case-insensitive partial match
   * across restaurant names, descriptions, and cuisines.
   * @param query The search term to match against multiple fields
   * @return List of restaurants matching the search criteria, or all restaurants if query is empty
   */
  @GetMapping("/search")
  public List<Restaurant> search(@RequestParam String query) {
    if (query == null || query.trim().isEmpty()) {
      return repo.findAll();
    }
    return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCuisineContainingIgnoreCase(
        query, query, query);
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

  if (query != null && !query.isBlank()) {
    String q = query.trim().toLowerCase();
    base = base.stream()
        .filter(r ->
            containsIgnoreCase(r.getName(), q) ||
            containsIgnoreCase(r.getDescription(), q) ||
            containsIgnoreCase(r.getCuisine(), q)
        )
        .collect(java.util.stream.Collectors.toList());
  }

  return base;
  }

  /**
   * Retrieves a unique, sorted list of all available cuisine types in the system.
   * Filters out null or empty cuisine values for data consistency.
   * @return Alphabetically sorted list of unique cuisine types
   */
  @GetMapping("/cuisines")
  public List<String> getCuisines() {
    return repo.findAllCuisines()
        .stream()
        .map(Restaurant::getCuisine)
        .filter(cuisine -> cuisine != null && !cuisine.trim().isEmpty())
        .distinct()
        .sorted()
        .collect(Collectors.toList());
  }

  /**
   * Helper method for case-insensitive string matching.
   * Assumes the needle (search term) is already lowercase.
   *
   * @param s The source string to search within (may be null)
   * @param needleLower The lowercase search term
   * @return true if the lowercase version of s contains needleLower
   */
  private static boolean containsIgnoreCase(String s, String needleLower) {
    return s != null && s.toLowerCase().contains(needleLower);
  }
}
