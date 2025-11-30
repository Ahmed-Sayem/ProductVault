package com.sayem.ProductVault.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
  private int pageNo;
  private int pageSize;
  private String sortBy;
  private String sortType;
}
