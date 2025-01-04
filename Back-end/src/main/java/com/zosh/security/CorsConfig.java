package com.zosh.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    // Load allowed origins from application.properties or environment variables
    @Value("${allowed.origins}") 
    private String[] allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        
        // Add allowed origins dynamically from configuration
        corsConfiguration.setAllowedOrigins(Arrays.asList(allowedOrigins)); // Set allowed origins
        corsConfiguration.setAllowCredentials(true); // Enable sending cookies or authorization headers
        corsConfiguration.addAllowedHeader("*"); // Allow all headers in the request
        corsConfiguration.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        corsConfiguration.setMaxAge(3600L); // Cache preflight response for 1 hour

        // Set up URL-based mapping for CORS configuration
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration); // Apply to all endpoints

        return new CorsFilter(source); // Return the CORS filter to apply globally
    }
}
