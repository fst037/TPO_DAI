package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequest {
  private String cardNumber;
  private String dniFront;
  private String dniBack;
  private String procedureNumber;
}
