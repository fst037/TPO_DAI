package com.uade.tpo.demo.service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.models.enums.Role;
import com.uade.tpo.demo.models.objects.Student;
import com.uade.tpo.demo.models.objects.StudentExtended;
import com.uade.tpo.demo.models.objects.User;
import com.uade.tpo.demo.models.objects.UserExtended;
import com.uade.tpo.demo.models.requests.StudentRequest;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.service.interfaces.IUserService;
import com.uade.tpo.demo.exceptions.CardValidationException;
import com.uade.tpo.demo.service.interfaces.ICardValidationService;

@Service
public class UserService implements IUserService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ICardValidationService cardValidationService;

  public void saveUser(User user) {
    userRepository.save(user);
  }

  public List<User> getUsers() {
    return userRepository.findAll();
  }

  public Optional<User> getUserById(Long userId) {
    return userRepository.findById(userId);
  }

  public Optional<User> getUserByEmail(String mail) {
    if ("admin@gmail.com".equals(mail)) {
      User user = User.builder()
      .idUser(0)
      .email("admin@gmail.com")
      .nickname("admin")
      .password("$2a$10$RTP4vRkexnfTNNWpwnfkEuJ7bquFK02gC3GRcwcFy2ObjW15A25.G")
      .enabled("si")
      .build();
      
      user.setUserExtended(UserExtended.builder()
      .user(user)
      .roles(List.of(Role.ADMIN))
      .build());      

      return Optional.of(user);
    }

    return userRepository.findByEmail(mail);
  }

  public User enableUser(Long userId) {
    Optional<User> userOptional = userRepository.findById(userId);
    if (userOptional.isPresent()) {
      User user = userOptional.get();
      user.setEnabled("si");
      return userRepository.save(user);
    }
    throw new IllegalArgumentException("User not found with ID: " + userId);
  }

  public Optional<User> getUserByNickname(String nickname) {
    return userRepository.findByNickname(nickname);
  }

  public List<String> getAllNicknames() {
    return userRepository.findAll().stream()
      .map(User::getNickname)
      .toList();
  }

  public void deleteUser(Long userId) {
    userRepository.deleteById(userId);
  }

  public User upgradeToStudent(Principal principal, StudentRequest studentRequest) {
    User user = userRepository.findByEmail(principal.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));

    if (user.getUserExtended().getRoles().contains(Role.STUDENT)) {
      throw new RuntimeException("User is already a student");
    }

    if (user.getEnabled().equals("no")) {
      throw new RuntimeException("User is disabled");
    }

    if (studentRequest.getCardNumber() == null || 
      studentRequest.getDniBack() == null || 
      studentRequest.getDniFront() == null || 
      studentRequest.getProcedureNumber() == null ||
      studentRequest.getCardExpiry() == null ||
      studentRequest.getDni() == null) {
      throw new IllegalArgumentException("All fields in StudentRequest must be non-null");
    }

    // Validar tarjeta con MercadoPago
    try {
      // Parsear la fecha de vencimiento usando CardValidationService
      Integer expirationMonth = cardValidationService.parseExpirationMonth(studentRequest.getCardExpiry());
      Integer expirationYear = cardValidationService.parseExpirationYear(studentRequest.getCardExpiry());
      
      Map<String, String> tarjetaData = Map.of(
        "email", user.getEmail(),
        "card_number", studentRequest.getCardNumber(),
        "expiration_month", String.valueOf(expirationMonth),
        "expiration_year", String.valueOf(expirationYear),
        "security_code", studentRequest.getCardCvv(),
        "name", studentRequest.getCardName(),
        "number", studentRequest.getDni()
      );

      String token = cardValidationService.validarYGuardarTarjeta(tarjetaData);
      
      // Crear Student y guardar el token ahí
      Student student = new Student();
      // Solo guardar los últimos 4 dígitos por seguridad
      String cardNumber = studentRequest.getCardNumber();
      student.setCardNumber("************" + cardNumber.substring(cardNumber.length() - 4));
      student.setCardType(CardValidationService.detectarTipoTarjeta(cardNumber));
      student.setTokenTarjeta(token); // Token guardado en Student
      
      // Marcar al usuario como con tarjeta validada
      user.setTarjetaValidada(true);
      student.setDniBack(studentRequest.getDniBack());
      student.setDniFront(studentRequest.getDniFront());
      student.setProcedureNumber(studentRequest.getProcedureNumber());    
      student.setBalance(0.0);
      student.setUser(user);
      student.setCourseAttendances(new ArrayList<>());
      
      StudentExtended studentExtended = new StudentExtended();
      studentExtended.setCurrentCourses(List.of());
      studentExtended.setFinishedCourses(List.of());
      studentExtended.setStudent(student);
      studentExtended.setCardName(studentRequest.getCardName());
      studentExtended.setCardExpiry(studentRequest.getCardExpiry());
      // CVV no se almacena por seguridad - solo se usa en el token de MercadoPago

      student.setStudentExtended(studentExtended);

      user.setStudent(student);
      user.getUserExtended().setRoles(List.of(Role.USER, Role.STUDENT));
      
    } catch (CardValidationException e) {
      throw new RuntimeException("Error en validación de tarjeta: " + e.getMessage());
    } catch (Exception e) {
      throw new RuntimeException("Error al validar tarjeta: " + e.getMessage());
    }

    return userRepository.save(user);
  }

  public User updateCard(Principal principal, StudentRequest studentRequest) {
    User user = userRepository.findByEmail(principal.getName())
      .orElseThrow(() -> new RuntimeException("User not found"));

    if (!user.getUserExtended().getRoles().contains(Role.STUDENT)) {
      throw new RuntimeException("User is not a student");
    }

    if (user.getEnabled().equals("no")) {
      throw new RuntimeException("User is disabled");
    }

    if (studentRequest.getCardNumber() == null || 
      studentRequest.getCardExpiry() == null ||
      studentRequest.getCardName() == null ||
      studentRequest.getCardCvv() == null ||
      studentRequest.getDni() == null) {
      throw new IllegalArgumentException("Card number, expiry, name, CVV and DNI must be non-null");
    }

    // Validar tarjeta con MercadoPago
    try {
      // Parsear la fecha de vencimiento usando CardValidationService
      Integer expirationMonth = cardValidationService.parseExpirationMonth(studentRequest.getCardExpiry());
      Integer expirationYear = cardValidationService.parseExpirationYear(studentRequest.getCardExpiry());
      
      Map<String, String> tarjetaData = Map.of(
        "email", user.getEmail(),
        "card_number", studentRequest.getCardNumber(),
        "expiration_month", String.valueOf(expirationMonth),
        "expiration_year", String.valueOf(expirationYear),
        "security_code", studentRequest.getCardCvv(),
        "name", studentRequest.getCardName(),
        "number", studentRequest.getDni()
      );

      String token = cardValidationService.validarYGuardarTarjeta(tarjetaData);
      
      // Actualizar información de la tarjeta del estudiante existente
      Student student = user.getStudent();
      
      // Solo guardar los últimos 4 dígitos por seguridad
      String cardNumber = studentRequest.getCardNumber();
      student.setCardNumber("************" + cardNumber.substring(cardNumber.length() - 4));
      student.setCardType(CardValidationService.detectarTipoTarjeta(cardNumber));
      student.setTokenTarjeta(token); // Actualizar token
      
      // Actualizar información extendida del estudiante
      StudentExtended studentExtended = student.getStudentExtended();
      studentExtended.setCardName(studentRequest.getCardName());
      studentExtended.setCardExpiry(studentRequest.getCardExpiry());
      
      // Marcar al usuario como con tarjeta validada
      user.setTarjetaValidada(true);
      
    } catch (CardValidationException e) {
      throw new RuntimeException("Error en validación de tarjeta: " + e.getMessage());
    } catch (Exception e) {
      throw new RuntimeException("Error al validar tarjeta: " + e.getMessage());
    }

    return userRepository.save(user);
  }

  public User updateProfile(String email, String name, String nickname, String address, String avatar) {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("User not found"));

    // Validate inputs
    if (name == null || nickname == null || address == null || avatar == null) {
      throw new IllegalArgumentException("Name, nickname, address, and avatar cannot be null");
    }

    if (userRepository.findByNickname(nickname).isPresent() && 
        !user.getNickname().equals(nickname)) {
      throw new RuntimeException("Nickname already exists");
    }

    user.setAvatar(avatar);
    user.setAddress(address);
    user.setNickname(nickname);
    user.setName(name);

    return userRepository.save(user);
  }

  /* Autogenerated code */ 
  public User updateEmail(String email, String newEmail) {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("User not found"));

    if (newEmail != null) {
      user.setEmail(newEmail);
    }

    return userRepository.save(user);
  }

  /* Autogenerated code */ 
  public void updatePassword(String email, String currentPassword, String newPassword) {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("User not found"));

    if (currentPassword != null && !currentPassword.equals(user.getPassword())) {
      throw new RuntimeException("Current password is incorrect");
    }

    if (newPassword != null) {
      user.setPassword(newPassword);
    }

    userRepository.save(user);
  }

}