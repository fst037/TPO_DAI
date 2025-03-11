package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.ExistingUserException;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> getUsers();
    void createUser(User newUser) throws ExistingUserException;
    Optional<User> getUserById(Long userId);
    Optional<User> getUserByEmail(String email);
    Optional<User> getUserByAlias(String alias);
    void deleteUser(Long userId);
}