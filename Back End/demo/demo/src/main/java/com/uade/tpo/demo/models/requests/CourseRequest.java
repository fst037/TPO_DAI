package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequest {
  private String description;
  private String contents;
  private String requirements;
  private Integer duration;
  private Double price;
  private String modality;
}
