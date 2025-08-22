package com.plateful.backend.restaurant;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

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

  @GetMapping("/search")
  public List<Restaurant> search(@RequestParam String query) {
    if (query == null || query.trim().isEmpty()) {
      return repo.findAll();
    }
    return repo.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCuisineContainingIgnoreCase(
        query, query, query);
  }

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

  private static boolean containsIgnoreCase(String s, String needleLower) {
    return s != null && s.toLowerCase().contains(needleLower);
  }
}
