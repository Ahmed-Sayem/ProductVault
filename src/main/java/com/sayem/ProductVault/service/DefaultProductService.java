package com.sayem.ProductVault.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sayem.ProductVault.model.Product;
import com.sayem.ProductVault.model.ProductRequest;
import com.sayem.ProductVault.model.ProductResponse;
import com.sayem.ProductVault.model.UploadResponse;
import com.sayem.ProductVault.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class DefaultProductService implements ProductService {

  private final ProductRepository productRepository;
  private final ObjectMapper objectMapper;

  @Value("${file.upload-dir:uploads}")
  private String uploadDir;

  @Value("${app.base-url}")
  private String baseUrl;

  @Override
  @CacheEvict(value = "products", allEntries = true)
  public UploadResponse uploadProducts(List<MultipartFile> files) {
    List<Product> successList = new ArrayList<>();
    List<String> failedList = new ArrayList<>();

    String projectRoot = System.getProperty("user.dir");
    Path baseDir = Paths.get(projectRoot, uploadDir);

    if (!Files.exists(baseDir)) {
      try {
        Files.createDirectories(baseDir);
      }
      catch (IOException e) {
        throw new RuntimeException("Could not initialize folder", e);
      }
    }

    for (MultipartFile file : files) {
      Product product = null;
      Path productFolder = null;

      try {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
          throw new RuntimeException("Invalid file type: " + contentType + ". Only images allowed.");
        }

        product = new Product();
        product.setName(file.getOriginalFilename());
        product.setDescription("Uploaded via Bulk API");
        product = productRepository.save(product);

        String folderName = "PV-" + product.getId();
        productFolder = baseDir.resolve(folderName);
        Files.createDirectories(productFolder);

        String safeImageName = file.getOriginalFilename()
            .replaceAll("\\s+", "_");
        Path imagePath = productFolder.resolve(safeImageName);
        file.transferTo(imagePath.toFile());

        String fullUrl = baseUrl + "/uploads/" + folderName + "/" + safeImageName;
        product.setImageUrl(fullUrl);
        product.setFolderPath(productFolder.toAbsolutePath()
                                  .toString());

        Product finalProduct = productRepository.save(product);

        File metadataFile = productFolder.resolve("product.json")
            .toFile();
        objectMapper.writeValue(metadataFile, finalProduct);

        successList.add(finalProduct);
      }
      catch (Exception e) {
        log.error("Failed to process file: {}", file.getOriginalFilename(), e);
        failedList.add(file.getOriginalFilename());

        if (product != null && product.getId() != null) {
          productRepository.deleteById(product.getId());
          log.info("Rolled back DB entry for ID: {}", product.getId());
        }

        if (productFolder != null && Files.exists(productFolder)) {
          try (Stream<Path> walk = Files.walk(productFolder)) {
            walk.sorted(Comparator.reverseOrder())
                .map(Path::toFile)
                .forEach(File::delete);
            log.info("Rolled back folder: {}", productFolder);
          }
          catch (IOException ioException) {
            log.error("CRITICAL: Could not delete folder during rollback: {}", productFolder, ioException);
          }
        }
      }
    }

    return UploadResponse.builder()
        .successful(successList)
        .failed(failedList)
        .build();
  }

  @Override
  @Transactional(readOnly = true)
  @Cacheable(value = "products", key = "#request.toString()")
  public ProductResponse getAllProducts(ProductRequest request) {
    Sort sort = request.getSortType()
                    .equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(request.getSortBy())
                    .ascending() : Sort.by(request.getSortBy())
                    .descending();

    Pageable pageable = PageRequest.of(request.getPageNo(), request.getPageSize(), sort);

    Page<Product> products = productRepository.findAll(pageable);
    List<Product> listOfProducts = products.getContent();

    return ProductResponse.builder()
        .content(listOfProducts)
        .pageNo(products.getNumber())
        .pageSize(products.getSize())
        .totalElements(products.getTotalElements())
        .totalPages(products.getTotalPages())
        .last(products.isLast())
        .build();
  }
}
