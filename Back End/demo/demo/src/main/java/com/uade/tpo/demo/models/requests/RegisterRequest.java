package com.uade.tpo.demo.models.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
  private String mail;
  private String nickname;
  private String nombre;
  private String direccion;
  private String avatar;
  private String password;
}