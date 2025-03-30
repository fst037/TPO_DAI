package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Photo;

import lombok.Data;

@Data
public class PhotoDTO {
  private Integer id;
  private Integer recipeId;
  private String photoUrl;
  private String extension;

  public PhotoDTO(Photo photo) {
    this.id = photo.getIdPhoto();
    this.recipeId = photo.getRecipe().getIdRecipe();
    this.photoUrl = photo.getPhotoUrl();
    this.extension = photo.getExtension();
  }
}
