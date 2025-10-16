package com.plateful.backend.controller;

import com.plateful.backend.model.Restaurant;
import com.plateful.backend.service.VotingService;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** REST controller for handling restaurant voting operations. */
@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "*")
public class VotingController {

  @Autowired private VotingService votingService;

  /**
   * Upvote a restaurant. User is identified via JWT token.
   *
   * @param restaurantId the restaurant ID
   * @param authentication the authenticated user
   * @return the vote counts and status
   */
  @PostMapping("/{restaurantId}/upvote")
  public ResponseEntity<Map<String, Object>> upvote(
      @PathVariable String restaurantId, Authentication authentication) {
    String userId = authentication.getName(); // Extract userId from JWT token
    
    Restaurant restaurant = votingService.upvote(restaurantId, userId);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Upvoted successfully");
    response.put("upvoteCount", restaurant.getUpvoteCount());
    response.put("downvoteCount", restaurant.getDownvoteCount());
    response.put("voteCount", restaurant.getVoteCount());

    return ResponseEntity.ok(response);
  }

  /**
   * Downvote a restaurant. User is identified via JWT token.
   *
   * @param restaurantId the restaurant ID
   * @param authentication the authenticated user
   * @return the vote counts and status
   */
  @PostMapping("/{restaurantId}/downvote")
  public ResponseEntity<Map<String, Object>> downvote(
      @PathVariable String restaurantId, Authentication authentication) {
    String userId = authentication.getName(); // Extract userId from JWT token
    
    Restaurant restaurant = votingService.downvote(restaurantId, userId);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Downvoted successfully");
    response.put("upvoteCount", restaurant.getUpvoteCount());
    response.put("downvoteCount", restaurant.getDownvoteCount());
    response.put("voteCount", restaurant.getVoteCount());

    return ResponseEntity.ok(response);
  }

  /**
   * Remove a user's vote from a restaurant. User is identified via JWT token.
   *
   * @param restaurantId the restaurant ID
   * @param authentication the authenticated user
   * @return the vote counts and status
   */
  @DeleteMapping("/{restaurantId}/vote")
  public ResponseEntity<Map<String, Object>> removeVote(
      @PathVariable String restaurantId, Authentication authentication) {
    String userId = authentication.getName(); // Extract userId from JWT token
    
    Restaurant restaurant = votingService.removeVote(restaurantId, userId);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Vote removed successfully");
    response.put("upvoteCount", restaurant.getUpvoteCount());
    response.put("downvoteCount", restaurant.getDownvoteCount());
    response.put("voteCount", restaurant.getVoteCount());

    return ResponseEntity.ok(response);
  }

  /**
   * Get the vote status for a restaurant for the current user. User is identified via JWT token.
   * If no token is provided, returns vote counts with hasUpvoted/hasDownvoted as false.
   *
   * @param restaurantId the restaurant ID
   * @param authentication the authenticated user (optional)
   * @return the vote status including whether user has voted and vote counts
   */
  @GetMapping("/{restaurantId}/vote-status")
  public ResponseEntity<Map<String, Object>> getVoteStatus(
      @PathVariable String restaurantId, Authentication authentication) {
    // If user is authenticated, get their specific vote status
    String userId = (authentication != null) ? authentication.getName() : null;
    
    Map<String, Object> status = votingService.getVoteStatus(restaurantId, userId);

    return ResponseEntity.ok(status);
  }
}
