package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar un contenido multimedia")
public class MultimediaContentRequest {

    @Schema(description = "Tipo de contenido multimedia", example = "imagen", required = true)
    private String contentType;

    @Schema(description = "Extensión del archivo multimedia", example = ".jpg", required = true)
    private String extension;

    @Schema(description = "URL del contenido multimedia", example = "https://example.com/image.jpg", required = true)
    private String contentUrl;
}
