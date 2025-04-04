package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.Rating;

import lombok.Data;

@Data
public class RatingDTOReduced {
  private Integer id;
  private UserDTOReduced user;
  private Integer rating;
  private String comments;
  private Integer recipeId;

  public RatingDTOReduced(Rating rating) {
    this.id = rating.getIdRating();
    this.user = new UserDTOReduced(rating.getUser());
    this.rating = rating.getRating();
    this.comments = rating.getComments();
    this.recipeId = rating.getRecipe().getIdRecipe();
  }
}
