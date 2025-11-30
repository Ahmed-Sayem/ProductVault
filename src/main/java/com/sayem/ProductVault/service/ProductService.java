package com.sayem.ProductVault.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.sayem.ProductVault.model.Product;
import com.sayem.ProductVault.model.ProductRequest;
import com.sayem.ProductVault.model.ProductResponse;

public interface ProductService {
  List<Product> uploadProducts(List<MultipartFile> files) throws IOException;

  ProductResponse getAllProducts(ProductRequest request);
}
