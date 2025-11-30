package com.sayem.ProductVault.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

import lombok.RequiredArgsConstructor;

import com.sayem.ProductVault.model.Product;
import com.sayem.ProductVault.model.ProductRequest;
import com.sayem.ProductVault.model.ProductResponse;
import com.sayem.ProductVault.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @PostMapping("/upload")
  public ResponseEntity<List<Product>> uploadProducts(@RequestParam("files") List<MultipartFile> files) {
    try {
      List<Product> saved = productService.uploadProducts(files);
      return ResponseEntity.ok(saved);
    }
    catch (IOException e) {
      return ResponseEntity.internalServerError()
          .build();
    }
  }

  @GetMapping
  public ResponseEntity<ProductResponse> getAllProducts(ProductRequest request) {
    return ResponseEntity.ok(productService.getAllProducts(request));
  }
}

