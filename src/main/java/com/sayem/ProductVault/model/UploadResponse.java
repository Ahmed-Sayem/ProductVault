package com.sayem.ProductVault.model;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UploadResponse {
  private List<Product> successful;
  private List<String> failed;
}
