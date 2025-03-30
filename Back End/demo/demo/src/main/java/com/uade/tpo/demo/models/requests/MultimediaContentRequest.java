package com.uade.tpo.demo.models.requests;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MultimediaContentRequest {
    private String contentType;
    private String extension;
    private String contentUrl;
}
