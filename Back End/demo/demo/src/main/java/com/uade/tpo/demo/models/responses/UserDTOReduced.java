package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Objeto de transferencia de datos reducido que representa un usuario.")
public class UserDTOReduced {
  @Schema(description = "Identificador único del usuario", example = "1")
  private Integer id;

  @Schema(description = "Correo electrónico del usuario", example = "usuario@example.com")
  private String email;

  @Schema(description = "Apodo del usuario", example = "chef123")
  private String nickname;

  @Schema(description = "URL del avatar del usuario", example = "https://example.com/avatar.jpg")
  private String avatar;

  public UserDTOReduced(User user) {
    this.id = user.getIdUser();
    this.email = user.getEmail();
    this.nickname = user.getNickname();
    this.avatar = user.getAvatar();
  }
}
