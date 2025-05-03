package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CourseScheduleRequest {
  private Integer courseId;
  private Integer branchId;
  private String startDate;
  private String endDate;
  private Integer availableSlots;
}
