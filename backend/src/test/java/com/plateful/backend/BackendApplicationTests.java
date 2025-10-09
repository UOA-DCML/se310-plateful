/**
 * Integration tests for the Spring Boot backend application. This class verifies that the Spring
 * application context can be loaded successfully, which ensures that all beans are configured
 * correctly and the application can start.
 */
package com.plateful.backend;

import com.plateful.backend.repository.RestaurantRepository;
import com.plateful.backend.service.RestaurantSearchService;
import com.plateful.backend.service.RestaurantService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.NONE,
    classes = BackendApplication.class)
@ActiveProfiles("test")
@TestPropertySource(
    properties = {
      "spring.autoconfigure.exclude="
          + "org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration,"
          + "org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration",
      // also stop Spring Data from trying to create repo proxies
      "spring.data.mongodb.repositories.enabled=false"
    })
class BackendApplicationTests {
  @MockBean private RestaurantRepository repo;
  @MockBean private RestaurantSearchService searchService;
  @MockBean private RestaurantService restaurantService;

  /**
   * Verifies that the Spring application context loads successfully. This test will fail if there
   * are any issues with: - Bean configuration - Component scanning - Auto-configuration -
   * Application properties
   */
  @Test
  void contextLoads() {}
}
