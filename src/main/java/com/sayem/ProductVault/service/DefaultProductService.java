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
  @Transactional(readOnly = true)
  @Cacheable(value = "products", key = "#request.toString()")
  public ProductResponse getAllProducts(ProductRequest request) {
    Sort sort = request.getSortType()
                    .equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(request.getSortBy())
                    .ascending() : Sort.by(request.getSortBy())
                    .descending();

    Pageable pageable = PageRequest.of(request.getPageNo(), request.getPageSize(), sort);
    Page<Product> page = productRepository.findAll(pageable);

    return buildProductResponse(page);
  }

  @Override
  @CacheEvict(value = "products", allEntries = true)
  public UploadResponse uploadProducts(List<MultipartFile> files) {
    List<Product> successList = new ArrayList<>();
    List<String> failedList = new ArrayList<>();

    Path baseDir = initializeBaseDirectory();

    for (MultipartFile file : files) {
      try {
        validateImageFile(file);
        Product savedProduct = processSingleProduct(file, baseDir);

        successList.add(savedProduct);
      }
      catch (Exception e) {
        log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
        failedList.add(file.getOriginalFilename());
      }
    }

    return UploadResponse.builder()
        .successful(successList)
        .failed(failedList)
        .build();
  }

  /**
   * Handles the full lifecycle of a SINGLE product upload.
   * Contains its own try-catch-rollback mechanism.
   */
  private Product processSingleProduct(MultipartFile file, Path baseDir) throws IOException {
    Product product = null;
    Path productFolder = null;

    try {
      product = new Product();
      product.setName(file.getOriginalFilename());
      product.setDescription("Uploaded via Bulk API");
      product = productRepository.save(product);

      String folderName = "PV-" + product.getId();
      productFolder = baseDir.resolve(folderName);
      Files.createDirectories(productFolder);

      String safeImageName = sanitizeFilename(file.getOriginalFilename());
      Path imagePath = productFolder.resolve(safeImageName);
      file.transferTo(imagePath.toFile());

      String fullUrl = baseUrl + "/uploads/" + folderName + "/" + safeImageName;
      product.setImageUrl(fullUrl);
      product.setFolderPath(productFolder.toAbsolutePath()
                                .toString());

      Product finalProduct = productRepository.save(product);

      createMetadataFile(productFolder, finalProduct);

      return finalProduct;
    }
    catch (Exception e) {
      performRollback(product, productFolder);
      throw e;
    }
  }

  private void performRollback(Product product, Path productFolder) {
    // Rollback DB
    if (product != null && product.getId() != null) {
      try {
        productRepository.deleteById(product.getId());
        log.info("Rolled back DB entry for ID: {}", product.getId());
      }
      catch (Exception ex) {
        log.error("Failed to delete DB entry ID {}", product.getId(), ex);
      }
    }
    if (productFolder != null && Files.exists(productFolder)) {
      deleteFolderRecursively(productFolder);
    }
  }

  private Path initializeBaseDirectory() {
    String projectRoot = System.getProperty("user.dir");
    Path baseDir = Paths.get(projectRoot, uploadDir);
    if (!Files.exists(baseDir)) {
      try {
        Files.createDirectories(baseDir);
      }
      catch (IOException e) {
        throw new RuntimeException("Could not initialize base upload directory", e);
      }
    }
    return baseDir;
  }

  private void validateImageFile(MultipartFile file) {
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
      throw new RuntimeException("Invalid file type: " + contentType);
    }
  }

  private String sanitizeFilename(String filename) {
    return filename == null ? "unknown" : filename.replaceAll("\\s+", "_");
  }

  private void createMetadataFile(Path productFolder, Product product) throws IOException {
    File metadataFile = productFolder.resolve("product.json")
        .toFile();
    objectMapper.writeValue(metadataFile, product);
  }

  private void deleteFolderRecursively(Path folder) {
    try (Stream<Path> walk = Files.walk(folder)) {
      walk.sorted(Comparator.reverseOrder())
          .map(Path::toFile)
          .forEach(File::delete);
      log.info("Cleaned up folder: {}", folder);
    }
    catch (IOException e) {
      log.error("Could not delete folder: {}", folder, e);
    }
  }

  private ProductResponse buildProductResponse(Page<Product> page) {
    return ProductResponse.builder()
        .content(page.getContent())
        .pageNo(page.getNumber())
        .pageSize(page.getSize())
        .totalElements(page.getTotalElements())
        .totalPages(page.getTotalPages())
        .last(page.isLast())
        .build();
  }
}
