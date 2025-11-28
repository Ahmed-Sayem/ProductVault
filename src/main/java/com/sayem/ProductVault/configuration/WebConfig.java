package com.sayem.ProductVault.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Value("${file.upload-dir:uploads}")
  private String uploadDir;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Get the absolute path to the project root
    String projectRoot = System.getProperty("user.dir");

    // Combine project root + uploads folder
    // "file:" protocol is required to tell Spring to look on the disk
    String resourcePath = "file:" + projectRoot + "/" + uploadDir + "/";

    System.out.println("Serving images from: " + resourcePath); // Debug log

    registry.addResourceHandler("/uploads/**")
        .addResourceLocations(resourcePath);
  }
}
