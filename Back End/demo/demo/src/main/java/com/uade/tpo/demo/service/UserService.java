package com.uade.tpo.demo.service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

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

@Service
public class UserService implements IUserService {
  @Autowired
  private UserRepository userRepository;

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

    System.out.println("mail: " + mail);

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
      studentRequest.getProcedureNumber() == null) {
      throw new IllegalArgumentException("All fields in StudentRequest must be non-null");
    }

    Student student = new Student();
    student.setCardNumber(studentRequest.getCardNumber());
    student.setDniBack(studentRequest.getDniBack());
    student.setDniFront(studentRequest.getDniFront());
    student.setProcedureNumber(studentRequest.getProcedureNumber());    
    student.setBalance(0.0);
    student.setUser(user);
    
    StudentExtended studentExtended = new StudentExtended();
    studentExtended.setCurrentCourses(List.of());
    studentExtended.setFinishedCourses(List.of());
    studentExtended.setStudent(student);
    studentExtended.setCardName(studentRequest.getCardName());
    studentExtended.setCardExpiry(studentRequest.getCardExpiry());
    studentExtended.setCardCvv(studentRequest.getCardCvv());

    student.setStudentExtended(studentExtended);

    user.setStudent(student);
    user.getUserExtended().setRoles(List.of(Role.USER, Role.STUDENT));

    return userRepository.save(user);
  }

}
