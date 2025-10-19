package com.plateful.backend.service;

import com.plateful.backend.model.Restaurant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Locale;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 * Service responsible for advanced restaurant filtering operations. Uses MongoTemplate for complex
 * queries and post-processing for time-based filtering. Supports filtering by cuisine, price range,
 * reservation requirements, current operating status, and location.
 */
@Service
public class RestaurantSearchService {

  private final MongoTemplate mongoTemplate;

  public RestaurantSearchService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  /**
   * Performs complex filtering of restaurants using both MongoDB queries and in-memory processing.
   * Builds a dynamic MongoDB query for static criteria (cuisine, price, reservation, city) and
   * applies post-processing for time-based filtering (openNow).
   *
   * <p>Price range is automatically normalized if min > max. City matching is case-insensitive and
   * exact (no partial matches). Time-based filtering uses New Zealand timezone for all calculations.
   *
   * @param cuisine Case-insensitive partial match for cuisine type
   * @param priceMin Lower bound for price level (inclusive)
   * @param priceMax Upper bound for price level (inclusive)
   * @param reservation Filter for reservation requirement
   * @param openNow Filter for currently operating restaurants
   * @param cities List of cities to match (case-insensitive, exact match)
   * @return Filtered list of restaurants matching all criteria
   */
  public List<Restaurant> filter(
      String cuisine,
      Integer priceMin,
      Integer priceMax,
      Boolean reservation,
      Boolean openNow,
      List<String> cities) {

    Query query = buildFilterQuery(cuisine, priceMin, priceMax, reservation, cities);
    List<Restaurant> results = mongoTemplate.find(query, Restaurant.class);

    if (Boolean.TRUE.equals(openNow)) {
      results = filterByOpenStatus(results);
    }

    return results;
  }

  // -------------------- Tag filters (in-memory over an existing list) --------------------

  /**
   * Keep restaurants that have ANY of the provided tags (case-insensitive).
   * Operates in-memory on the given base list to allow composition with other filters.
   */
  public List<Restaurant> filterByTagsAny(List<Restaurant> base, List<String> tagsAny) {
    if (base == null || base.isEmpty() || tagsAny == null || tagsAny.isEmpty()) return base;

    final Set<String> needles =
        tagsAny.stream()
            .filter(s -> s != null && !s.isBlank())
            .map(s -> s.toLowerCase(Locale.ROOT))
            .collect(java.util.stream.Collectors.toSet());

    return base.stream()
        .filter(r -> {
          var tags = r.getTags();
          if (tags == null || tags.isEmpty()) return false;
          for (String t : tags) {
            if (t != null && needles.contains(t.toLowerCase(Locale.ROOT))) return true;
          }
          return false;
        })
        .toList();
  }

  /**
   * Keep restaurants that have ALL of the provided tags (case-insensitive).
   * Operates in-memory on the given base list to allow composition with other filters.
   */
  public List<Restaurant> filterByTagsAll(List<Restaurant> base, List<String> tagsAll) {
    if (base == null || base.isEmpty() || tagsAll == null || tagsAll.isEmpty()) return base;

    final Set<String> needles =
        tagsAll.stream()
            .filter(s -> s != null && !s.isBlank())
            .map(s -> s.toLowerCase(Locale.ROOT))
            .collect(java.util.stream.Collectors.toSet());

    return base.stream()
        .filter(r -> {
          var tags = r.getTags();
          if (tags == null || tags.isEmpty()) return false;
          // Build a lowercase set of the restaurant's tags
          var tagSet = tags.stream()
              .filter(t -> t != null && !t.isBlank())
              .map(t -> t.toLowerCase(Locale.ROOT))
              .collect(java.util.stream.Collectors.toSet());
          return tagSet.containsAll(needles);
        })
        .toList();
  }

  // -------------------- Query building helpers --------------------

  /** Builds MongoDB query based on filter criteria. */
  private Query buildFilterQuery(
      String cuisine,
      Integer priceMin,
      Integer priceMax,
      Boolean reservation,
      List<String> cities) {
    List<Criteria> ands = new ArrayList<>();

    addCuisineCriteria(ands, cuisine);
    addPriceCriteria(ands, priceMin, priceMax);
    addReservationCriteria(ands, reservation);
    addCityCriteria(ands, cities);

    Query query = new Query();
    if (!ands.isEmpty()) {
      query.addCriteria(new Criteria().andOperator(ands.toArray(Criteria[]::new)));
    }

    return query;
  }

  /** Adds cuisine filtering criteria if specified. */
  private void addCuisineCriteria(List<Criteria> ands, String cuisine) {
    if (cuisine != null && !cuisine.isBlank()) {
      ands.add(Criteria.where("cuisine").regex(cuisine, "i"));
    }
  }

  /** Adds price range filtering criteria if specified. */
  private void addPriceCriteria(List<Criteria> ands, Integer priceMin, Integer priceMax) {
    if (priceMin != null || priceMax != null) {
      int min = priceMin == null ? Integer.MIN_VALUE : priceMin;
      int max = priceMax == null ? Integer.MAX_VALUE : priceMax;
      if (min > max) { int tmp = min; min = max; max = tmp; }
      ands.add(Criteria.where("price_level").gte(min).lte(max));
    }
  }

  /** Adds reservation requirement criteria if specified. */
  private void addReservationCriteria(List<Criteria> ands, Boolean reservation) {
    if (reservation != null) {
      ands.add(Criteria.where("reservation_required").is(reservation));
    }
  }

  /** Adds city filtering criteria if specified. */
  private void addCityCriteria(List<Criteria> ands, List<String> cities) {
    if (cities != null && !cities.isEmpty()) {
      List<Criteria> cityOr = new ArrayList<>();
      for (String city : cities) {
        if (city != null && !city.isBlank()) {
          cityOr.add(
              Criteria.where("address.city")
                  .regex("^" + java.util.regex.Pattern.quote(city.trim()) + "$", "i"));
        }
      }
      if (!cityOr.isEmpty()) {
        ands.add(new Criteria().orOperator(cityOr.toArray(Criteria[]::new)));
      }
    }
  }

  // -------------------- Open-now logic --------------------

  /** Filters restaurants by current open status using New Zealand timezone. */
  private List<Restaurant> filterByOpenStatus(List<Restaurant> restaurants) {
    ZoneId nz = ZoneId.of("Pacific/Auckland");
    LocalTime now = LocalTime.now(nz);
    String dayKey = dayKeyNZ(nz);

    return restaurants.stream().filter(r -> isOpenNow(r, dayKey, now)).toList();
  }

  /** Converts current NZ day to the db hours key. */
  private static String dayKeyNZ(ZoneId nz) {
    String[] keys = {"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"};
    int idx = java.time.ZonedDateTime.now(nz).getDayOfWeek().getValue();
    return keys[idx - 1];
  }

  /**
   * Determines if a restaurant is currently open based on its operating hours. Handles both regular
   * time windows (e.g., 09:00-17:00) and overnight windows (e.g., 22:00-02:00). Time comparisons use NZ timezone.
   */
  private static boolean isOpenNow(Restaurant r, String dayKey, LocalTime now) {
    Map<String, String> hours = r.getHours();
    if (hours == null) return false;
    String span = hours.get(dayKey);
    if (span == null || span.isBlank()) return false;

    String[] parts = span.split("-");
    if (parts.length != 2) return false;

    DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
    try {
      LocalTime start = LocalTime.parse(parts[0].trim(), fmt);
      LocalTime end = LocalTime.parse(parts[1].trim(), fmt);

      if (!end.isBefore(start)) {
        // same-day interval
        return !now.isBefore(start) && !now.isAfter(end);
      } else {
        // overnight interval (e.g., 22:00-02:00)
        return !now.isBefore(start) || !now.isAfter(end);
      }
    } catch (Exception e) {
      return false;
    }
  }

  // -------------------- Text query --------------------

  /**
   * Filters restaurants by text query across name, description, and cuisine.
   */
  public List<Restaurant> filterByTextQuery(List<Restaurant> restaurants, String query) {
    if (query == null || query.isBlank()) {
      return restaurants;
    }
    String q = query.trim().toLowerCase(Locale.ROOT);
    return restaurants.stream()
        .filter(r ->
            containsIgnoreCase(r.getName(), q) ||
            containsIgnoreCase(r.getDescription(), q) ||
            containsIgnoreCase(r.getCuisine(), q))
        .toList();
  }

  private static boolean containsIgnoreCase(String s, String needleLower) {
    return s != null && s.toLowerCase(Locale.ROOT).contains(needleLower);
  }
}
