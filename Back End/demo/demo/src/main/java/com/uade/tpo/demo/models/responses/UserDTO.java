package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.User;

import lombok.Data;

@Data
public class UserDTO {
  private Integer id;
  private String email;
  private String nickname;
  private String name;
  private String address;
  private String avatar;
  private List<RecipeDTOReduced> recipes;
  private List<RatingDTOReduced> ratings;
  private Integer studentId;

  public UserDTO(User user){
    this.id = user.getIdUser();
    this.email = user.getEmail();
    this.nickname = user.getNickname();
    this.name = user.getName();
    this.address = user.getAddress();
    this.avatar = user.getAvatar();
    this.recipes = user.getRecipes().stream()
      .map(RecipeDTOReduced::new)
      .toList();
    this.ratings = user.getRatings().stream()
      .map(RatingDTOReduced::new)
      .toList();
    if (user.getStudent() != null) {
      this.studentId = user.getStudent().getIdStudent();
    } else {
      this.studentId = null;
    }
  }
}
