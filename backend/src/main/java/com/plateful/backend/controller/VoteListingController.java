package com.plateful.backend.controller;

import com.plateful.backend.model.Restaurant;
import com.plateful.backend.service.VotingQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/me/votes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class VoteListingController {

  private final VotingQueryService service;

  // GET /api/me/votes/up?page=0&size=20
  @GetMapping("/up")
  public ResponseEntity<Page<Restaurant>> myUpvotes(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      Authentication auth) {
    if (auth == null) return ResponseEntity.status(401).build();
    Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, size));
    return ResponseEntity.ok(service.getUpvotedByUser(auth.getName(), pageable));
  }

  // GET /api/me/votes/down?page=0&size=20
  @GetMapping("/down")
  public ResponseEntity<Page<Restaurant>> myDownvotes(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      Authentication auth) {
    if (auth == null) return ResponseEntity.status(401).build();
    Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, size));
    return ResponseEntity.ok(service.getDownvotedByUser(auth.getName(), pageable));
  }
}
