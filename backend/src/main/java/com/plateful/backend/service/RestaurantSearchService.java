package com.plateful.backend.service;

import com.plateful.backend.model.Restaurant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
   * exact (no partial matches). Time-based filtering uses New Zealand timezone for all
   * calculations.
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
      Criteria c = Criteria.where("price_level");
      if (priceMin != null && priceMax != null && priceMin > priceMax) {
        int tmp = priceMin;
        priceMin = priceMax;
        priceMax = tmp;
      }
      if (priceMin != null) c = c.gte(priceMin);
      if (priceMax != null) c = c.lte(priceMax);
      ands.add(c);
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

  /** Filters restaurants by current open status using New Zealand timezone. */
  private List<Restaurant> filterByOpenStatus(List<Restaurant> restaurants) {
    ZoneId nz = ZoneId.of("Pacific/Auckland");
    LocalTime now = LocalTime.now(nz);
    String dayKey = dayKeyNZ(nz);

    return restaurants.stream().filter(r -> isOpenNow(r, dayKey, now)).toList();
  }

  /**
   * Filters restaurants by text query across name, description, and cuisine.
   *
   * @param restaurants List of restaurants to filter
   * @param query Search query (case-insensitive)
   * @return Filtered list of restaurants
   */
  public List<Restaurant> filterByTextQuery(List<Restaurant> restaurants, String query) {
    if (query == null || query.isBlank()) {
      return restaurants;
    }

    String q = query.trim().toLowerCase();
    return restaurants.stream()
        .filter(
            r ->
                containsIgnoreCase(r.getName(), q)
                    || containsIgnoreCase(r.getDescription(), q)
                    || containsIgnoreCase(r.getCuisine(), q))
        .toList();
  }

  /**
   * Helper method for case-insensitive string matching. Assumes the needle (search term) is already
   * lowercase.
   *
   * @param s The source string to search within (may be null)
   * @param needleLower The lowercase search term
   * @return true if the lowercase version of s contains needleLower
   */
  private static boolean containsIgnoreCase(String s, String needleLower) {
    return s != null && s.toLowerCase().contains(needleLower);
  }

  /**
   * Converts current NZ day to the corresponding key in restaurant hours data. Maps ISO day-of-week
   * (1-7) to lowercase day names used in the database.
   *
   * @param nz New Zealand timezone for accurate day determination
   * @return Lowercase day name (monday, tuesday, etc.)
   */
  private static String dayKeyNZ(ZoneId nz) {
    String[] keys = {"monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"};
    int idx = java.time.ZonedDateTime.now(nz).getDayOfWeek().getValue();
    return keys[idx - 1];
  }

  /**
   * Determines if a restaurant is currently open based on its operating hours. Handles both regular
   * time windows (e.g., 9:00-17:00) and overnight windows (e.g., 22:00-02:00). Time comparisons use
   * New Zealand timezone.
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

      if (end.isAfter(start) || end.equals(start)) {
        return !now.isBefore(start) && !now.isAfter(end);
      } else {
        // overnight window
        return !now.isBefore(start) || !now.isAfter(end);
      }
    } catch (Exception e) {
      return false;
    }
  }
}
