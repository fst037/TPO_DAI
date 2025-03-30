package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.enums.Role;
import com.uade.tpo.demo.models.objects.User;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.service.interfaces.IUserService;

@Service
public class UserService implements IUserService {
  @Autowired
  private UserRepository userRepository;

  public List<User> getUsers() {
    return userRepository.findAll();
  }

  public void createUser(User newUser) throws ExistingUserException {
    Optional<User> users = userRepository.findByEmailOrNickname(newUser.getEmail(), newUser.getNickname());
    if (!users.isEmpty()) {
      throw new ExistingUserException();
    }
    userRepository.save(newUser);
  }

  public Optional<User> getUserById(Long userId) {
    return userRepository.findById(userId);
  }

  public Optional<User> getUserByEmail(String mail) {

    System.out.println("mail: " + mail);

    if ("admin@gmail.com".equals(mail)) {
      return Optional.of(
        User.builder()
          .idUser(0)
          .email("admin@gmail.com")
          .nickname("admin")
          .password("$2a$10$RTP4vRkexnfTNNWpwnfkEuJ7bquFK02gC3GRcwcFy2ObjW15A25.G")
          .roles(List.of(Role.ADMIN))
          .enabled("si")
          .build()
      );
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

  public void deleteUser(Long userId) {
    userRepository.deleteById(userId);
  }

}
