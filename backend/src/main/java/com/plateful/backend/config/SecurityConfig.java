package com.plateful.backend.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

    @Value("${app.frontend.origin}")
    private String frontendOrigin;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // For API + token/cookie auth patterns, we keep it stateless later.
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(req -> {
                var c = new CorsConfiguration();
                c.setAllowedOrigins(List.of(frontendOrigin));
                c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
                c.setAllowedHeaders(List.of("Content-Type","Authorization"));
                c.setAllowCredentials(true);
                return c;
            }))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/public/**").permitAll()
                      .requestMatchers("/auth/**").permitAll()
      .requestMatchers("/api/restaurants/**").permitAll()   // ← public
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()); // not used for signup; fine to keep

        return http.build();
    }
}
