package com.uade.tpo.demo.models.responses;

import java.util.List;

import com.uade.tpo.demo.models.objects.User;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos que representa un usuario.")
public class UserDTO {
  @Schema(description = "Identificador único del usuario", example = "1")
  private Integer id;

  @Schema(description = "Correo electrónico del usuario", example = "usuario@example.com")
  private String email;

  @Schema(description = "Apodo del usuario", example = "chef123")
  private String nickname;

  @Schema(description = "Nombre completo del usuario", example = "Juan Pérez")
  private String name;

  @Schema(description = "Dirección del usuario", example = "Calle Falsa 123")
  private String address;

  @Schema(description = "URL del avatar del usuario", example = "https://example.com/avatar.jpg")
  private String avatar;

  @Schema(description = "Lista de recetas creadas por el usuario")
  private List<RecipeDTOReduced> recipes;

  @Schema(description = "Lista de recetas favoritas del usuario")
  private List<RecipeDTOReduced> favoriteRecipes;

  @Schema(description = "Lista de recetas en recordatorio del usuario")
  private List<RecipeDTOReduced> remindLaterRecipes;

  @Schema(description = "Lista de calificaciones realizadas por el usuario")
  private List<RatingDTOReduced> ratings;

  @Schema(description = "Perfil de alumno del usuario, si aplica.")
  private StudentDTO studentId;

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
    this.favoriteRecipes = user.getUserExtended().getFavoriteRecipes().stream()
      .filter(recipe -> recipe.getRecipeExtended().getIsEnabled())
      .map(RecipeDTOReduced::new)
      .toList();
    this.remindLaterRecipes = user.getUserExtended().getRemindLaterRecipes().stream()
      .filter(recipe -> recipe.getRecipeExtended().getIsEnabled())
      .map(RecipeDTOReduced::new)
      .toList();
    this.ratings = user.getRatings().stream()    
      .filter(rating -> rating.getRatingExtended().getIsEnabled())
      .map(RatingDTOReduced::new)
      .toList();
    if (user.getStudent() != null) {
      this.studentId = new StudentDTO(user.getStudent());
    } else {
      this.studentId = null;
    }
  }
}
