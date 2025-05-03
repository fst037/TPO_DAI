package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BranchRequest {
  private String name;
  private String address;
  private String phoneNumber;
  private String email;
  private String whatsApp;
  private String discountType;
  private Double courseDiscount;
  private String promotionType;
  private Double coursePromotion;
}
