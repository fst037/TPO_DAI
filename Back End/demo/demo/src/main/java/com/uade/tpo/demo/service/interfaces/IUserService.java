package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.exceptions.ExistingUserException;
import com.uade.tpo.demo.models.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<Usuario> getUsers();
    void createUser(Usuario newUser) throws ExistingUserException;
    Optional<Usuario> getUserById(Long userId);
    Optional<Usuario> getUserByMail(String mail);
    Optional<Usuario> getUserByNickname(String nickname);
    void deleteUser(Long userId);
    Object enableUser(Long userId);
}