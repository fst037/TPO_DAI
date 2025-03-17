package com.uade.tpo.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.Usuario;
import com.uade.tpo.demo.repository.UserRepository;
import com.uade.tpo.demo.service.interfaces.IUserService;

@Service
public class UserService implements IUserService {
  @Autowired
  private UserRepository userRepository;

  public List<Usuario> getUsers() {
    return userRepository.findAll();
  }

  public void createUser(Usuario newUser) throws ExistingUserException {
    Optional<Usuario> users = userRepository.findByMailOrNickname(newUser.getMail(), newUser.getNickname());
    if (!users.isEmpty()) {
      throw new ExistingUserException();
    }
    userRepository.save(newUser);
  }

  public Optional<Usuario> getUserById(Long userId) {
    return userRepository.findById(userId);
  }

  public Optional<Usuario> getUserByMail(String mail) {
    return userRepository.findByMail(mail);
  }

  public Optional<Usuario> getUserByNickname(String nickname) {
    return userRepository.findByNickname(nickname);
  }

  public void deleteUser(Long userId) {
    userRepository.deleteById(userId);
  }

}
