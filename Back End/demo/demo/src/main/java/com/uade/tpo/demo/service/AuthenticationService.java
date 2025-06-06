package com.uade.tpo.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.controllers.config.JwtService;
import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.enums.Role;
import com.uade.tpo.demo.models.objects.User;
import com.uade.tpo.demo.models.objects.UserExtended;
import com.uade.tpo.demo.models.requests.AuthenticationRequest;
import com.uade.tpo.demo.models.requests.RegisterRequest;
import com.uade.tpo.demo.models.requests.RequestInitialRegisterRequest;
import com.uade.tpo.demo.models.responses.AuthenticationResponse;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserService userService;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final MailService mailService;

  public String requestInitialRegister(RequestInitialRegisterRequest request) throws ExistingUserException, MessagingException {
    Optional<User> existingUser = userService.getUserByEmail(request.getEmail());
    if (existingUser.isPresent()) {
      if (existingUser.get().getPassword() != null) {
        throw new ExistingUserException("El correo electrónico ya está registrado. Si olvidaste tu contraseña, puedes restablecerla.");
      } else {
        throw new ExistingUserException( "El correo electrónico ya está registrado, pero no ha sido verificado. Verifica tu correo electrónico para completar el registro.");
      }
    }

    List<String> existingNicknames = userService.getAllNicknames();
    if (existingNicknames.contains(request.getNickname())) {
      String baseNickname = request.getNickname();
      StringBuilder suggestedNicknames = new StringBuilder();
      int count = 0;
      for (int i = 1; count < 5; i++) {
      String newNickname = baseNickname + i;
        if (!existingNicknames.contains(newNickname)) {
          suggestedNicknames.append(newNickname).append(", ");
          count++;
        }
      }
      throw new ExistingUserException("El nickname ya está en uso. Puedes usar los siguientes: " + suggestedNicknames.toString());
    }

    var user = User.builder()
      .email(request.getEmail())
      .nickname(request.getNickname())
      .enabled("no")
      .build();
    
    var verificationCode = String.valueOf((int) (Math.random() * 900000) + 100000); // Generates a 6-digit random code

    var userExtended = UserExtended.builder()
      .user(user)      
      .roles(List.of(Role.USER))
      .verificationCode(verificationCode)
      .verificationCodeExpiration(System.currentTimeMillis() + 24 * 60 * 60 * 1000) // 24 hours in milliseconds
      .build();
    user.setUserExtended(userExtended);
    
    userService.saveUser(user);

    // mailService.sendVerificationCode(request.getEmail(), verificationCode);

    return "Se ha enviado un código de verificación a tu correo electrónico con el codigo (" + verificationCode + "): " + request.getEmail();
  }

  public String register(RegisterRequest request) throws ExistingUserException {

    Optional<User> existingUser = userService.getUserByEmail(request.getEmail());
    if (!"1234".equals(request.getVerificationCode())) { //TODO: Cambiar por el código de verificación real, eliminar backdoor
      
      if (!existingUser.isPresent()) {
        throw new RuntimeException("El correo electrónico no está registrado. Por favor, verifica tu correo electrónico.");
      } else if (existingUser.get().getPassword() != null) {
        throw new ExistingUserException("El correo electrónico ya está registrado. Si olvidaste tu contraseña, puedes restablecerla.");
      } else if (
        !request.getVerificationCode().equals(existingUser.get().getUserExtended().getVerificationCode()) ||
        !existingUser.get().getEmail().equals(request.getEmail()) ||
        !existingUser.get().getNickname().equals(request.getNickname())
      ) {
        throw new ExistingUserException("El código de verificación, email o nickname son incorrectos. Por favor, verifica tus datos.");
      } else if (System.currentTimeMillis() > existingUser.get().getUserExtended().getVerificationCodeExpiration()) {
        throw new ExistingUserException("El código de verificación ha expirado. Por favor, contacta al mail chefdebolsilloapp@gmail.com para restablecerlo.");
      }
    } else {
      if (!existingUser.isPresent()){
        User tempUser = User.builder()
          .email(request.getEmail())
          .nickname(request.getNickname())
          .enabled("no")
          .build();

        tempUser.setUserExtended(UserExtended.builder()
          .user(tempUser)
          .roles(List.of(Role.USER))
          .build());
        existingUser = Optional.of(tempUser);
      }
    }

    User user = existingUser.get();
    user.setPassword(passwordEncoder.encode(request.getPassword()));
    user.setName(request.getNombre());
    user.setAddress(request.getDireccion());
    user.setAvatar(request.getAvatar());
    user.setRecipes(new ArrayList<>());
    user.setRatings(new ArrayList<>());
    user.setStudent(null);
    user.getUserExtended().setRoles(new ArrayList<>(List.of(Role.USER)));
    user.getUserExtended().setVerificationCode(null);
    user.getUserExtended().setVerificationCodeExpiration(null);
    user.getUserExtended().setFavoriteRecipes(new ArrayList<>());
    user.getUserExtended().setRemindLaterRecipes(new ArrayList<>());

    userService.saveUser(user);

    return "El usuario ha sido registrado con exito pero no ha sido habilitado. Por favor, contacta al administrador.";
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getEmail(),
        request.getPassword()));
        
    var user = userService.getUserByEmail(request.getEmail()).orElseThrow();

    var jwtToken = jwtService.generateToken(user);
    return AuthenticationResponse.builder()
      .accessToken(jwtToken)
      .build();
  }

  public String recoverPassword(String email) throws ExistingUserException, MessagingException {
    Optional<User> existingUser = userService.getUserByEmail(email);
    System.out.println(email);
    if (!existingUser.isPresent()) {
      throw new ExistingUserException("El correo electrónico no está registrado.");
    }

    User user = existingUser.get();
    if (user.getPassword() == null) {
      throw new ExistingUserException("El correo electrónico está registrado pero no ha sido verificado. Completa el registro primero.");
    }

    var resetCode = String.valueOf((int) (Math.random() * 900000) + 100000); // Generates a 6-digit random code
    user.getUserExtended().setVerificationCode(resetCode);
    user.getUserExtended().setVerificationCodeExpiration(System.currentTimeMillis() + 30 * 60 * 1000); // 30 minutes in milliseconds

    userService.saveUser(user);

    mailService.sendPasswordResetCode(email, resetCode);

    return "Se ha enviado un código de recuperación a tu correo electrónico: " + email;
  }

  public String resetPassword(String email, String verificationCode, String newPassword) throws ExistingUserException {
    Optional<User> existingUser = userService.getUserByEmail(email);
    if (!existingUser.isPresent()) {
      throw new ExistingUserException("El correo electrónico no está registrado.");
    }

    User user = existingUser.get();
    if (user.getPassword() == null) {
      throw new ExistingUserException("El correo electrónico está registrado pero no ha sido verificado. Completa el registro primero.");
    }

    if (!verificationCode.equals(user.getUserExtended().getVerificationCode())) {
      throw new ExistingUserException("El código de verificación es incorrecto.");
    }

    if (System.currentTimeMillis() > user.getUserExtended().getVerificationCodeExpiration()) {
      throw new ExistingUserException("El código de verificación ha expirado. Por favor, solicita un nuevo código.");
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    user.getUserExtended().setVerificationCode(null);
    user.getUserExtended().setVerificationCodeExpiration(null);

    userService.saveUser(user);

    return "La contraseña ha sido restablecida con éxito. Puedes iniciar sesión con tu nueva contraseña.";
  }
}
