package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.objects.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> getUsers();
    void createUser(User newUser) throws ExistingUserException;
    Optional<User> getUserById(Long userId);
    Optional<User> getUserByEmail(String mail);
    Optional<User> getUserByNickname(String nickname);
    void deleteUser(Long userId);
    Object enableUser(Long userId);
}