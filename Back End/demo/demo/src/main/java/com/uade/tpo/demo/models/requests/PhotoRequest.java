package com.uade.tpo.demo.models.requests;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Solicitud para crear o actualizar una foto")
public class PhotoRequest {

  @Schema(description = "URL de la foto", example = "https://example.com/photo.jpg", required = true)
  private String photoUrl;

  @Schema(description = "Extensión del archivo de la foto", example = ".jpg", required = true)
  private String extension;
}
