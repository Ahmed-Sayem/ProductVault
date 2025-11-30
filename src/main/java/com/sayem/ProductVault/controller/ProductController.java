package com.sayem.ProductVault.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import lombok.RequiredArgsConstructor;

import com.sayem.ProductVault.model.ProductRequest;
import com.sayem.ProductVault.model.ProductResponse;
import com.sayem.ProductVault.model.UploadResponse;
import com.sayem.ProductVault.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @PostMapping("/upload")
  public ResponseEntity<UploadResponse> uploadProducts(@RequestParam("files") List<MultipartFile> files) {
    return ResponseEntity.ok(productService.uploadProducts(files));
  }

  @GetMapping
  public ResponseEntity<ProductResponse> getAllProducts(ProductRequest request) {
    return ResponseEntity.ok(productService.getAllProducts(request));
  }
}

