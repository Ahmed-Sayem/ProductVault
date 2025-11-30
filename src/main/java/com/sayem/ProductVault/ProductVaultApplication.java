package com.sayem.ProductVault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ProductVaultApplication {

  public static void main(String[] args) {
    SpringApplication.run(ProductVaultApplication.class, args);
  }
}
