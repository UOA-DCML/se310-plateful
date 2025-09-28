package com.plateful.backend.repository;

import com.plateful.backend.model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

/**
 * MongoDB repository interface for Restaurant entities.
 * Provides standard CRUD operations through MongoRepository
 * and custom queries for restaurant search functionality.
 */
public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    /**
     * Full-text search across multiple restaurant fields.
     * Performs a case-insensitive partial match on name, description, and cuisine.
     * The same search term is used for all fields (OR condition).
     */
    List<Restaurant> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCuisineContainingIgnoreCase(
        String name, String description, String cuisine);
    
    /**
     * Optimized query to fetch only cuisine fields from all restaurants.
     * Uses MongoDB projection to exclude _id and all other fields for better performance.
     * The query matches all documents ({}) but returns only the cuisine field.
     */
    @Query(value = "{}", fields = "{ 'cuisine' : 1, '_id' : 0 }")
    List<Restaurant> findAllCuisines();
}