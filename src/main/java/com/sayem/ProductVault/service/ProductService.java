package com.sayem.ProductVault.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.sayem.ProductVault.model.Product;

public interface ProductService {
  List<Product> uploadProducts(List<MultipartFile> files) throws IOException;

  List<Product> getAllProducts();
}
