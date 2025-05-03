package com.uade.tpo.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.requests.AuthenticationRequest;
import com.uade.tpo.demo.models.requests.RegisterRequest;
import com.uade.tpo.demo.models.requests.RequestInitialRegisterRequest;
import com.uade.tpo.demo.models.responses.AuthenticationResponse;
import com.uade.tpo.demo.service.AuthenticationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService authService;

  @PostMapping("/requestInitialRegister")
  public ResponseEntity<Object> requestInitialRegister(
      @RequestBody RequestInitialRegisterRequest request) throws ExistingUserException {
    try {
      return ResponseEntity.ok(authService.requestInitialRegister(request));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }  

  @PostMapping("/register")
  public ResponseEntity<AuthenticationResponse> register(
      @RequestBody RegisterRequest request) throws ExistingUserException {
    return ResponseEntity.ok(authService.register(request));
  }

  @PostMapping("/authenticate")
  public ResponseEntity<AuthenticationResponse> authenticate(
      @RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(authService.authenticate(request));
  }

  @PostMapping("/recoverPassword")
  public ResponseEntity<String> recoverPassword(@RequestBody String email) {
    try {
      return ResponseEntity.ok(authService.recoverPassword(email));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PostMapping("/resetPassword")
  public ResponseEntity<String> resetPassword(@RequestBody String email, @RequestBody String verificationCode, @RequestBody String password) {
    try {
      return ResponseEntity.ok(authService.resetPassword(email, password, verificationCode));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}