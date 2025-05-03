package com.uade.tpo.demo.models.responses;

import java.time.LocalDateTime;

import com.uade.tpo.demo.models.objects.Rating;

import lombok.Data;

@Data
public class RatingDTO {
  private Integer id;
  private UserDTOReduced user;
  private Integer rating;
  private String comments;
  private RecipeDTOReduced recipe;
  public LocalDateTime createdAt;

  public RatingDTO(Rating rating) {
    this.id = rating.getIdRating();
    this.user = new UserDTOReduced(rating.getUser());
    this.rating = rating.getRating();
    this.comments = rating.getComments();
    this.recipe = new RecipeDTOReduced(rating.getRecipe());
    this.createdAt = rating.getRatingExtended().getCreatedAt();
  }
}
