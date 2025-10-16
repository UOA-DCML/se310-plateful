package com.plateful.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.plateful.backend.auth.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Value("#{'${app.frontend.origins:http://localhost:5173}'.split(',')}")
    private List<String> frontendOrigins;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // For API + token/cookie auth patterns, we keep it stateless later.
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(req -> {
                var c = new CorsConfiguration();
                c.setAllowedOrigins(frontendOrigins);
                c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
                c.setAllowedHeaders(List.of("Content-Type","Authorization"));
                c.setAllowCredentials(true);
                return c;
            }))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/restaurants/**").permitAll()   // ← public GET for browsing and vote-status
                .requestMatchers("/api/restaurants/*/upvote").authenticated()   // ← require auth
                .requestMatchers("/api/restaurants/*/downvote").authenticated()   // ← require auth
                .requestMatchers(HttpMethod.DELETE, "/api/restaurants/*/vote").authenticated()   // ← require auth
                .requestMatchers("/api/user/**").permitAll()   // ← temporary: make user endpoints public for testing
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .httpBasic(Customizer.withDefaults()); // not used for signup; fine to keep

        return http.build();
    }
}
