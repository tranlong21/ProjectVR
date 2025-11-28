package com.vrplus.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration for static file serving
 * Serves uploaded files from /uploads directory
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Configure static resource handlers for file uploads
     * Maps /uploads/** URLs to physical uploads directory
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from uploads directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/")
                .setCachePeriod(31536000); // Cache for 1 year

        // Serve project thumbnails
        registry.addResourceHandler("/uploads/projects/thumbnails/**")
                .addResourceLocations("file:uploads/projects/thumbnails/")
                .setCachePeriod(31536000);

        // Serve 3D models
        registry.addResourceHandler("/uploads/models3d/**")
                .addResourceLocations("file:uploads/models3d/")
                .setCachePeriod(31536000);

        // Serve panorama images
        registry.addResourceHandler("/uploads/panoramas/**")
                .addResourceLocations("file:uploads/panoramas/")
                .setCachePeriod(31536000);
    }

    /**
     * Configure CORS for all endpoints
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization")
                .maxAge(3600);
    }
}
