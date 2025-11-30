package com.sayem.ProductVault.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.sayem.ProductVault.model.ProductRequest;
import com.sayem.ProductVault.model.ProductResponse;
import com.sayem.ProductVault.model.UploadResponse;

public interface ProductService {
  UploadResponse uploadProducts(List<MultipartFile> files);

  ProductResponse getAllProducts(ProductRequest request);
}
