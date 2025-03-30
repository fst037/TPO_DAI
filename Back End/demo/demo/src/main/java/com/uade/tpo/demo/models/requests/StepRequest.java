package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StepRequest {
    private String text;
}
