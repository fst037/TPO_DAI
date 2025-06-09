package com.uade.tpo.demo.service.interfaces;

import com.uade.tpo.demo.models.objects.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<User> getUsers();
    Optional<User> getUserById(Long userId);
    Optional<User> getUserByEmail(String mail);
    Optional<User> getUserByNickname(String nickname);
    void deleteUser(Long userId);
    User enableUser(Long userId);

    User updateEmail(String email, String newEmail);
    void updatePassword(String email, String currentPassword, String newPassword);
}