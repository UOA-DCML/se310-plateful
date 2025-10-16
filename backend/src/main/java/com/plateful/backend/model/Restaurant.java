package com.plateful.backend.model;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Represents a restaurant entity in the Plateful application. This class maps to documents in the
 * MongoDB 'restaurants' collection and contains all relevant information about a restaurant
 * including its details, location, operating hours, and features.
 *
 * <p>The class uses various MongoDB-specific annotations for: - Document mapping (@Document) - Text
 * indexing (@TextIndexed) for efficient text search - Geospatial indexing (@GeoSpatialIndexed) for
 * location-based queries
 */
@Document(collection = "restaurants")
public class Restaurant {
  @Id private String id;

  @TextIndexed private String name;
  @TextIndexed private String description;
  private String cuisine;

  @Field("price_level")
  private Integer priceLevel;

  private Address address;
  private String phone;
  private String website;

  @GeoSpatialIndexed private GeoJsonPoint location;

  private List<String> images;
  private List<String> tags;
  private Map<String, String> hours;

  @Field("reservation_required")
  private Boolean reservationRequired;

  // Voting system - stores user IDs who have upvoted/downvoted
  @Field("upvote_user_ids")
  private Set<String> upvoteUserIds = new HashSet<>();

  @Field("downvote_user_ids")
  private Set<String> downvoteUserIds = new HashSet<>();

  public static class Address {
    private String street;
    private String city;
    private String postcode;
    private String country;

    public String getStreet() {
      return street;
    }

    public void setStreet(String newStreet) {
      this.street = newStreet;
    }

    public String getCity() {
      return city;
    }

    public void setCity(String city) {
      this.city = city;
    }

    public String getPostcode() {
      return postcode;
    }

    public void setPostcode(String postcode) {
      this.postcode = postcode;
    }

    public String getCountry() {
      return country;
    }

    public void setCountry(String country) {
      this.country = country;
    }
  }

  // getters & setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getWebsite() {
    return website;
  }

  public void setWebsite(String website) {
    this.website = website;
  }

  public Integer getPriceLevel() {
    return priceLevel;
  }

  public void setPriceLevel(Integer priceLevel) {
    this.priceLevel = priceLevel;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getCuisine() {
    return cuisine;
  }

  public void setCuisine(String cuisine) {
    this.cuisine = cuisine;
  }

  public List<String> getImages() {
    return images;
  }

  public void setImages(List<String> images) {
    this.images = images;
  }

  public Address getAddress() {
    return address;
  }

  public void setAddress(Address address) {
    this.address = address;
  }

  public GeoJsonPoint getLocation() {
    return location;
  }

  public void setLocation(GeoJsonPoint location) {
    this.location = location;
  }

  public Map<String, String> getHours() {
    return hours;
  }

  public void setHours(Map<String, String> hours) {
    this.hours = hours;
  }

  public List<String> getTags() {
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }

  public Boolean getReservationRequired() {
    return reservationRequired;
  }

  public void setReservationRequired(Boolean reservationRequired) {
    this.reservationRequired = reservationRequired;
  }

  public Set<String> getUpvoteUserIds() {
    return upvoteUserIds;
  }

  public void setUpvoteUserIds(Set<String> upvoteUserIds) {
    this.upvoteUserIds = upvoteUserIds;
  }

  public Set<String> getDownvoteUserIds() {
    return downvoteUserIds;
  }

  public void setDownvoteUserIds(Set<String> downvoteUserIds) {
    this.downvoteUserIds = downvoteUserIds;
  }

  /**
   * Get the net vote count (upvotes - downvotes).
   *
   * @return the net vote count
   */
  public int getVoteCount() {
    return (upvoteUserIds != null ? upvoteUserIds.size() : 0)
        - (downvoteUserIds != null ? downvoteUserIds.size() : 0);
  }

  /**
   * Get the total number of upvotes.
   *
   * @return the upvote count
   */
  public int getUpvoteCount() {
    return upvoteUserIds != null ? upvoteUserIds.size() : 0;
  }

  /**
   * Get the total number of downvotes.
   *
   * @return the downvote count
   */
  public int getDownvoteCount() {
    return downvoteUserIds != null ? downvoteUserIds.size() : 0;
  }

  /**
   * Check if a user has upvoted this restaurant.
   *
   * @param userId the user ID to check
   * @return true if the user has upvoted, false otherwise
   */
  public boolean hasUserUpvoted(String userId) {
    return upvoteUserIds != null && upvoteUserIds.contains(userId);
  }

  /**
   * Check if a user has downvoted this restaurant.
   *
   * @param userId the user ID to check
   * @return true if the user has downvoted, false otherwise
   */
  public boolean hasUserDownvoted(String userId) {
    return downvoteUserIds != null && downvoteUserIds.contains(userId);
  }
}
