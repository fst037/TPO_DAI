package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Photo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa una foto.")
public class PhotoDTO {
  @Schema(description = "Identificador único de la foto", example = "1")
  private Integer id;

  @Schema(description = "Identificador de la receta asociada a la foto", example = "100")
  private Integer recipeId;

  @Schema(description = "URL de la foto", example = "https://example.com/photos/photo1.jpg")
  private String photoUrl;

  @Schema(description = "Extensión del archivo de la foto", example = "jpg")
  private String extension;

  public PhotoDTO(Photo photo) {
    this.id = photo.getIdPhoto();
    this.recipeId = photo.getRecipe().getIdRecipe();
    this.photoUrl = photo.getPhotoUrl();
    this.extension = photo.getExtension();
  }
}
