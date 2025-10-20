/**
 * Unit tests for RestaurantController REST endpoints. Tests the web layer functionality of the
 * restaurant API using MockMvc. Uses @WebMvcTest to load only web-related beans and mock other
 * dependencies.
 */
package com.plateful.backend;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.plateful.backend.controller.RestaurantController;
import com.plateful.backend.model.Restaurant;
import com.plateful.backend.service.RestaurantSearchService;
import com.plateful.backend.service.RestaurantService;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

// Only load the web layer for this controller
@WebMvcTest(RestaurantController.class)
@Import(com.plateful.backend.config.SecurityConfig.class)
@TestPropertySource(properties = {"app.frontend.origin=http://localhost:3000"})
class RestaurantControllerTest {

  @Autowired private MockMvc mockMvc; // Used to perform mock HTTP requests against the controller

  @MockBean private RestaurantService restaurantService; // Mocked service dependency

  @MockBean private RestaurantSearchService searchService;

  @MockBean private com.plateful.backend.repository.RestaurantRepository restaurantRepository; // Mocked repository dependency

  // Helper method for quickly creating Restaurant objects
  /**
   * Helper method to create a Restaurant instance for testing.
   *
   * @param id Restaurant ID
   * @param name Restaurant name
   * @param desc Restaurant description
   * @param cuisine Restaurant cuisine type
   * @return A new Restaurant instance with the specified properties
   */
  private static Restaurant r(String id, String name, String desc, String cuisine) {
    Restaurant x = new Restaurant();
    x.setId(id);
    x.setName(name);
    x.setDescription(desc);
    x.setCuisine(cuisine);
    return x;
  }

  /**
   * Tests the GET /api/restaurants endpoint. Verifies that the endpoint returns a list of
   * restaurants in JSON format and that the response contains the expected restaurant data.
   */
  @Test
  void list_returnsRestaurants() throws Exception {
    Restaurant r = new Restaurant();
    r.setId("abc123");
    r.setName("Restaurant Name");
    r.setDescription("Description example for testing");
    r.setCuisine("Italian");

    when(restaurantService.getAllRestaurants()).thenReturn(List.of(r));

    mockMvc
        .perform(get("/api/restaurants"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith("application/json"))
        .andExpect(jsonPath("$[0].name").value("Restaurant Name"))
        .andExpect(jsonPath("$[0].cuisine").value("Italian"));
  }

  /**
   * Tests the GET /api/restaurants/{id} endpoint. Verifies that the endpoint returns a single
   * restaurant by ID and the response contains the expected restaurant data.
   */
  @Test
  void get_returnsSingleRestaurant() throws Exception {
    Restaurant r = new Restaurant();
    r.setId("id234");
    r.setName("One Restaurant");
    when(restaurantService.getRestaurantById("id234")).thenReturn(java.util.Optional.of(r));

    mockMvc
        .perform(get("/api/restaurants/id234"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("One Restaurant"));
  }

  /**
   * Tests the GET /api/restaurants/cuisines endpoint. Verifies that the endpoint returns a
   * distinct, sorted list of cuisines and handles duplicate cuisine types correctly.
   */
  @Test
  void getCuisines_returnsDistinctCuisines() throws Exception {
    when(restaurantService.getAllCuisines()).thenReturn(List.of("Chinese", "Italian"));

    mockMvc
        .perform(get("/api/restaurants/cuisines"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith("application/json"))
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$[0]").value("Chinese")) // Should be sorted
        .andExpect(jsonPath("$[1]").value("Italian"))
        .andExpect(jsonPath("$.length()").value(2)); // Should be distinct
  }

  /**
   * Tests the GET /api/restaurants/filter endpoint with multiple filter parameters. Verifies that
   * cuisine, price range, and reservation parameters are correctly passed to the
   * RestaurantSearchService and the response is as expected.
   */
  @Test
  void filter_withCuisineAndPriceAndReservation_passesParamsToService() throws Exception {

    when(searchService.filter(any(), any(), any(), any(), any(), any()))
        .thenReturn(List.of(r("x", "X", "d", "Italian")));
    when(searchService.filterByTextQuery(any(), any()))
        .thenReturn(List.of(r("x", "X", "d", "Italian")));

    mockMvc
        .perform(
            get("/api/restaurants/filter")
                .param("cuisine", "Italian")
                .param("priceMin", "2")
                .param("priceMax", "4")
                .param("reservation", "true"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith("application/json"))
        .andExpect(jsonPath("$[0].cuisine").value("Italian"));

    ArgumentCaptor<String> cuisine = ArgumentCaptor.forClass(String.class);
    ArgumentCaptor<Integer> priceMin = ArgumentCaptor.forClass(Integer.class);
    ArgumentCaptor<Integer> priceMax = ArgumentCaptor.forClass(Integer.class);
    ArgumentCaptor<Boolean> reservation = ArgumentCaptor.forClass(Boolean.class);
    ArgumentCaptor<Boolean> openNow = ArgumentCaptor.forClass(Boolean.class);
    @SuppressWarnings("unchecked")
    ArgumentCaptor<java.util.List<String>> cities =
        ArgumentCaptor.forClass((Class) java.util.List.class);

    verify(searchService)
        .filter(
            cuisine.capture(),
            priceMin.capture(),
            priceMax.capture(),
            reservation.capture(),
            openNow.capture(),
            cities.capture());

    org.junit.jupiter.api.Assertions.assertEquals("Italian", cuisine.getValue());
    org.junit.jupiter.api.Assertions.assertEquals(Integer.valueOf(2), priceMin.getValue());
    org.junit.jupiter.api.Assertions.assertEquals(Integer.valueOf(4), priceMax.getValue());
    org.junit.jupiter.api.Assertions.assertEquals(Boolean.TRUE, reservation.getValue());
    org.junit.jupiter.api.Assertions.assertNull(openNow.getValue()); // not provided
    org.junit.jupiter.api.Assertions.assertNull(cities.getValue()); // no ?city= -> null list
  }

  /**
   * Tests the GET /api/restaurants/filter endpoint with openNow parameter. Verifies that the
   * openNow parameter is correctly passed to the service and the response contains the expected
   * restaurant data.
   */
  @Test
  void filter_withOpenNow_true_passesToService() throws Exception {
    when(searchService.filter(any(), any(), any(), any(), any(), any()))
        .thenReturn(List.of(r("o", "Open", "d", "Cafe")));
    when(searchService.filterByTextQuery(any(), any()))
        .thenReturn(List.of(r("o", "Open", "d", "Cafe")));

    mockMvc
        .perform(get("/api/restaurants/filter").param("openNow", "true"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Open"));

    verify(searchService).filter(null, null, null, null, true, null);
  }

  /**
   * Tests the GET /api/restaurants/filter endpoint with query parameter. Verifies that the endpoint
   * correctly filters restaurants by keyword matching against name, description, and cuisine
   * fields.
   */
  @Test
  void filter_withQuery_appliesInMemoryKeywordFilter() throws Exception {
    // Service returns a base list; controller should then apply keyword filtering on
    // name/desc/cuisine
    List<Restaurant> svc =
        List.of(
            r("1", "Sushi Place", "Fresh nigiri and rolls", "Japanese"),
            r("2", "Burger Town", "Burgers & fries", "American"));
    when(searchService.filter(null, null, null, null, null, null)).thenReturn(svc);
    when(searchService.filterByTextQuery(svc, "sushi"))
        .thenReturn(List.of(r("1", "Sushi Place", "Fresh nigiri and rolls", "Japanese")));

    mockMvc
        .perform(get("/api/restaurants/filter").param("query", "sushi"))
        .andExpect(status().isOk())
        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].name").value("Sushi Place"));
  }

  /**
   * Tests the GET /api/restaurants/filter endpoint with blank query parameter. Verifies that when a
   * blank query is provided, the endpoint returns the complete unfiltered list of restaurants from
   * the service.
   */
  @Test
  void filter_withBlankQuery_returnsUnfilteredServiceList() throws Exception {
    List<Restaurant> svc = List.of(r("1", "A", "d", "X"), r("2", "B", "d", "Y"));
    when(searchService.filter(null, null, null, null, null, null)).thenReturn(svc);
    when(searchService.filterByTextQuery(svc, "   ")).thenReturn(svc);

    mockMvc
        .perform(get("/api/restaurants/filter").param("query", "   "))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(2)));
  }
}
