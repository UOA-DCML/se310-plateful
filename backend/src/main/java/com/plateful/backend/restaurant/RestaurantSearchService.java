package com.plateful.backend.restaurant;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class RestaurantSearchService {

    private final MongoTemplate mongoTemplate;

    public RestaurantSearchService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<Restaurant> filter(
            String cuisine,
            Integer priceMin,
            Integer priceMax,
            Boolean reservation,
            Boolean openNow,
            List<String> cities
    ) {
        List<Criteria> ands = new ArrayList<>();

        if (cuisine != null && !cuisine.isBlank()) {
            ands.add(Criteria.where("cuisine").regex(cuisine, "i"));
        }

        if (priceMin != null || priceMax != null) {
            Criteria c = Criteria.where("price_level");
            if (priceMin != null && priceMax != null && priceMin > priceMax) {
                int tmp = priceMin; priceMin = priceMax; priceMax = tmp;
            }
            if (priceMin != null) c = c.gte(priceMin);
            if (priceMax != null) c = c.lte(priceMax);
            ands.add(c);
        }

        if (reservation != null) {
            ands.add(Criteria.where("reservation_required").is(reservation));
        }

        if (cities != null && !cities.isEmpty()) {
            // Normalise and build case-insensitive OR over address.city
            List<Criteria> cityOr = new ArrayList<>();
            for (String city : cities) {
                if (city != null && !city.isBlank()) {
                    cityOr.add(Criteria.where("address.city").regex("^" + java.util.regex.Pattern.quote(city.trim()) + "$", "i"));
                }
            }
            if (!cityOr.isEmpty()) {
                ands.add(new Criteria().orOperator(cityOr.toArray(new Criteria[0])));
            }
        }


        Query query = new Query();
        if (!ands.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(ands.toArray(new Criteria[0])));
        }

        List<Restaurant> results = mongoTemplate.find(query, Restaurant.class);

        if (Boolean.TRUE.equals(openNow)) {
            ZoneId nz = ZoneId.of("Pacific/Auckland");
            LocalTime now = LocalTime.now(nz);
            String dayKey = dayKeyNZ(nz);

            results = results.stream()
                    .filter(r -> isOpenNow(r, dayKey, now))
                    .collect(Collectors.toList());
        }

        return results;
    }

    private static String dayKeyNZ(ZoneId nz) {
        String[] keys = {"monday","tuesday","wednesday","thursday","friday","saturday","sunday"};
        int idx = java.time.ZonedDateTime.now(nz).getDayOfWeek().getValue();
        return keys[idx - 1];
    }

    //Check if the restaurant is open now - using nztimezone
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
            LocalTime end   = LocalTime.parse(parts[1].trim(), fmt);

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
