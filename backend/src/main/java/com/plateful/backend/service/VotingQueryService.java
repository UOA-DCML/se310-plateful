package com.plateful.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.plateful.backend.model.Restaurant;
import com.plateful.backend.repository.RestaurantRepository;

@Service
@RequiredArgsConstructor
public class VotingQueryService {
  private final RestaurantRepository restaurants;

  public Page<Restaurant> getUpvotedByUser(String userId, Pageable pageable) {
    return restaurants.findByUpvoteUserIdsContains(userId, pageable);
  }

  public Page<Restaurant> getDownvotedByUser(String userId, Pageable pageable) {
    return restaurants.findByDownvoteUserIdsContains(userId, pageable);
  }
}
