package com.sayem.ProductVault.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.sayem.ProductVault.model.Product;
import com.sayem.ProductVault.repository.ProductRepository;

@Service
@RequiredArgsConstructor
public class DefaultProductService implements ProductService {
  private final ProductRepository productRepository;

  @Value("${file.upload-dir:uploads}")
  private String uploadDir;

  @Value("${app.base-url}")
  private String baseUrl;

  @Override
  public List<Product> uploadProducts(List<MultipartFile> files) throws IOException {
    List<Product> savedProducts = new ArrayList<>();

    String projectRoot = System.getProperty("user.dir");
    Path baseDir = Paths.get(projectRoot, uploadDir);

    if (!Files.exists(baseDir)) {
      Files.createDirectories(baseDir);
    }

    ObjectMapper localMapper = new ObjectMapper();
    localMapper.registerModule(new JavaTimeModule());
    localMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    for (MultipartFile file : files) {
      try {
        String folderName = UUID.randomUUID()
            .toString();
        Path productFolder = baseDir.resolve(folderName);
        Files.createDirectories(productFolder);

        String originalFilename = file.getOriginalFilename()
            .replaceAll("\\s+", "_");
        Path imagePath = productFolder.resolve(originalFilename);
        file.transferTo(imagePath.toFile());

        Product product = new Product();
        product.setName(file.getOriginalFilename());
        product.setDescription("Uploaded via Bulk API");

        String fullUrl = baseUrl + "/uploads/" + folderName + "/" + originalFilename;
        product.setImageUrl(fullUrl);

        product.setFolderPath(productFolder.toAbsolutePath()
                                  .toString());

        Product savedProduct = productRepository.save(product);

        File metadataFile = productFolder.resolve("product.json")
            .toFile();
        localMapper.writeValue(metadataFile, savedProduct);

        savedProducts.add(savedProduct);
      }
      catch (Exception e) {
        System.err.println("Error processing file: " + file.getOriginalFilename());
        e.printStackTrace();
      }
    }

    return savedProducts;
  }

  @Override
  public List<Product> getAllProducts() {
    return productRepository.findAll();
  }
}
