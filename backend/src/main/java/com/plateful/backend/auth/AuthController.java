package com.plateful.backend.auth;

import com.plateful.backend.auth.dto.LoginRequest;
import com.plateful.backend.auth.dto.LoginResponse;
import com.plateful.backend.auth.dto.SignupRequest;
import com.plateful.backend.auth.dto.SignupResponse;
import com.plateful.backend.model.AppUser;
import com.plateful.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public AuthController(
      UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
  }

  @PostMapping("/signup")
  public ResponseEntity<SignupResponse> signup(@Valid @RequestBody SignupRequest req) {
    var email = req.email().toLowerCase().trim();

    var user = new AppUser();
    user.setEmail(email);
    user.setPasswordHash(passwordEncoder.encode(req.password()));

    try {
      userRepository.save(user);
    } catch (DuplicateKeyException dup) {
      // rethrow so our handler turns it into a 409
      throw dup;
    }

    return ResponseEntity.ok(new SignupResponse(user.getEmail()));
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest req) {
    var email = req.email().toLowerCase().trim();

    var user =
        userRepository
            .findByEmail(email)
            .orElseThrow(
                () ->
                    new org.springframework.security.authentication.BadCredentialsException(
                        "Invalid credentials"));

    if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
      throw new org.springframework.security.authentication.BadCredentialsException(
          "Invalid credentials");
    }

    var access = jwtService.generateAccessToken(user);
    var refresh = jwtService.generateRefreshToken(user);

    return ResponseEntity.ok(new LoginResponse(access, refresh, jwtService.getAccessTtlSec()));
  }
}
