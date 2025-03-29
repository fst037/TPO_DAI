package com.uade.tpo.demo.service;

import java.util.List;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.controllers.auth.AuthenticationRequest;
import com.uade.tpo.demo.controllers.auth.AuthenticationResponse;
import com.uade.tpo.demo.controllers.auth.RegisterRequest;
import com.uade.tpo.demo.controllers.config.JwtService;
import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.Usuario;
import com.uade.tpo.demo.models.enums.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserService userService;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public AuthenticationResponse register(RegisterRequest request) throws ExistingUserException {

    var user = Usuario.builder()
      .mail(request.getMail())
      .nickname(request.getNickname())
      .password(passwordEncoder.encode(request.getPassword()))
      .nombre(request.getNombre())
      .direccion(request.getDireccion())
      .avatar(request.getAvatar())
      .recetas(List.of())
      .calificaciones(List.of())
      .alumno(null)
      .roles(List.of(Role.USER))
      .habilitado("No")
      .build();

    userService.createUser(user);
    var jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder()
      .accessToken(jwtToken)
      .build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getMail(),
        request.getPassword()));
        
    var user = userService.getUserByMail(request.getMail()).orElseThrow();

    var jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder()
      .accessToken(jwtToken)
      .build();
  }
}
