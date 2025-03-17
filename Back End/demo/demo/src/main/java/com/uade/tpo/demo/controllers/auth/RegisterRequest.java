package com.uade.tpo.demo.controllers.auth;

import com.uade.tpo.demo.entity.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  private String alias;
  private String email;
  private Role role;
  private String password;
}
