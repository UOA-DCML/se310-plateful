package com.plateful.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web configuration for CORS (Cross-Origin Resource Sharing).
 * Allows the frontend to communicate with the backend from different origins.
 * 
 * NOTE: CORS is now configured in SecurityConfig.java to avoid conflicts
 * with Spring Security's CORS handling.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    // CORS is now configured in SecurityConfig.java
    // Commenting out this configuration to avoid conflicts
    /*
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    // Local development
                    "http://localhost:5173",
                    "http://localhost:5174", 
                    "http://localhost:5175",
                    // GitHub Pages deployment
                    "https://uoa-dcml.github.io",
                    "https://zingging001.github.io"
                )
                .allowedMethods("GET", "POST", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
    */
}
