package com.uade.tpo.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.uade.tpo.demo.models.Usuario;
import com.uade.tpo.demo.service.interfaces.IUserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
  @Autowired
  private IUserService userService;

  @GetMapping("/whoami")
  public ResponseEntity<Usuario> whoami(Principal principal) {
    return ResponseEntity.ok(userService.getUserByMail(principal.getName()).orElseThrow());
  }

  @GetMapping()
  public ResponseEntity<Object> GetUsers() {
    try {
      return ResponseEntity.ok(userService.getUsers().stream());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @GetMapping("/{userId}")
  public ResponseEntity<Object> getUserById(@PathVariable Long userId) {
    try {
      Optional<Usuario> result = userService.getUserById(userId);
      if (result.isPresent())
        return ResponseEntity.ok(result.get());

      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @DeleteMapping("/{userId}")
  public ResponseEntity<Object> deleteUser(@PathVariable Long userId) {
    try {
      userService.deleteUser(userId);
      return ResponseEntity.noContent().build();
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }

  @PutMapping("/enable/{userId}")
  public ResponseEntity<Object> enableUser(@PathVariable Long userId) {
    try {
      return ResponseEntity.ok(userService.enableUser(userId));
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(e.getClass().getSimpleName() + ": " + e.getMessage());
    }
  }
}
