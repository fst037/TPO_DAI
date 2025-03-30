package com.uade.tpo.demo.models.responses;

import com.uade.tpo.demo.models.objects.User;

import lombok.Data;

@Data
public class UserDTOReduced {
  private Integer id;
  private String email;
  private String nickname;
  private String avatar;

  public UserDTOReduced(User user) {
    this.id = user.getIdUser();
    this.email = user.getEmail();
    this.nickname = user.getNickname();
    this.avatar = user.getAvatar();
  }
}
