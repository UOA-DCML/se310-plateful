package com.plateful.backend.service;

import com.plateful.backend.model.Restaurant;
import com.plateful.backend.repository.RestaurantRepository;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/** Service for handling restaurant voting operations. */
@Service
public class VotingService {

  @Autowired private RestaurantRepository restaurantRepository;

  /**
   * Upvote a restaurant. If user has already downvoted, removes downvote first.
   *
   * @param restaurantId the restaurant ID
   * @param userId the user ID
   * @return the updated restaurant
   */
  public Restaurant upvote(String restaurantId, String userId) {
    Restaurant restaurant =
        restaurantRepository
            .findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    // Initialize sets if null
    if (restaurant.getUpvoteUserIds() == null) {
      restaurant.setUpvoteUserIds(new HashSet<>());
    }
    if (restaurant.getDownvoteUserIds() == null) {
      restaurant.setDownvoteUserIds(new HashSet<>());
    }

    // Remove from downvotes if exists (vote switching)
    restaurant.getDownvoteUserIds().remove(userId);

    // Add to upvotes
    restaurant.getUpvoteUserIds().add(userId);

    return restaurantRepository.save(restaurant);
  }

  /**
   * Downvote a restaurant. If user has already upvoted, removes upvote first.
   *
   * @param restaurantId the restaurant ID
   * @param userId the user ID
   * @return the updated restaurant
   */
  public Restaurant downvote(String restaurantId, String userId) {
    Restaurant restaurant =
        restaurantRepository
            .findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    // Initialize sets if null
    if (restaurant.getUpvoteUserIds() == null) {
      restaurant.setUpvoteUserIds(new HashSet<>());
    }
    if (restaurant.getDownvoteUserIds() == null) {
      restaurant.setDownvoteUserIds(new HashSet<>());
    }

    // Remove from upvotes if exists (vote switching)
    restaurant.getUpvoteUserIds().remove(userId);

    // Add to downvotes
    restaurant.getDownvoteUserIds().add(userId);

    return restaurantRepository.save(restaurant);
  }

  /**
   * Remove a user's vote (both upvote and downvote).
   *
   * @param restaurantId the restaurant ID
   * @param userId the user ID
   * @return the updated restaurant
   */
  public Restaurant removeVote(String restaurantId, String userId) {
    Restaurant restaurant =
        restaurantRepository
            .findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    // Initialize sets if null
    if (restaurant.getUpvoteUserIds() == null) {
      restaurant.setUpvoteUserIds(new HashSet<>());
    }
    if (restaurant.getDownvoteUserIds() == null) {
      restaurant.setDownvoteUserIds(new HashSet<>());
    }

    // Remove from both sets
    restaurant.getUpvoteUserIds().remove(userId);
    restaurant.getDownvoteUserIds().remove(userId);

    return restaurantRepository.save(restaurant);
  }

  /**
   * Get the vote status for a user and restaurant.
   *
   * @param restaurantId the restaurant ID
   * @param userId the user ID
   * @return a map containing vote status and counts
   */
  public Map<String, Object> getVoteStatus(String restaurantId, String userId) {
    Restaurant restaurant =
        restaurantRepository
            .findById(restaurantId)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));

    // Initialize sets if null
    if (restaurant.getUpvoteUserIds() == null) {
      restaurant.setUpvoteUserIds(new HashSet<>());
    }
    if (restaurant.getDownvoteUserIds() == null) {
      restaurant.setDownvoteUserIds(new HashSet<>());
    }

    Map<String, Object> status = new HashMap<>();
    status.put("hasUpvoted", restaurant.hasUserUpvoted(userId));
    status.put("hasDownvoted", restaurant.hasUserDownvoted(userId));
    status.put("upvoteCount", restaurant.getUpvoteCount());
    status.put("downvoteCount", restaurant.getDownvoteCount());
    status.put("voteCount", restaurant.getVoteCount());

    return status;
  }
}
