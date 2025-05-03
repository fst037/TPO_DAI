package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.MultimediaContent;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa contenido multimedia.")
public class MultimediaContentDTO {
  @Schema(description = "Identificador único del contenido multimedia", example = "1")
  private Integer id;

  @Schema(description = "Identificador del paso asociado al contenido multimedia", example = "10")
  private Integer stepId;

  @Schema(description = "Tipo de contenido multimedia (por ejemplo, imagen, video)", example = "imagen")
  private String contentType;

  @Schema(description = "Extensión del archivo multimedia", example = "jpg")
  private String extension;

  @Schema(description = "URL del contenido multimedia", example = "https://example.com/media/image.jpg")
  private String contentUrl;

  public MultimediaContentDTO(MultimediaContent multimediaContent) {
    this.id = multimediaContent.getIdContent();
    this.stepId = multimediaContent.getStep().getIdStep();
    this.contentType = multimediaContent.getContentType();
    this.extension = multimediaContent.getExtension();
    this.contentUrl = multimediaContent.getContentUrl();
  }
}
