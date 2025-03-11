package com.uade.tpo.demo.service;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.demo.entity.User;
import com.uade.tpo.demo.exceptions.ExistingUserException;
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
        Optional<User> users = userRepository.findByEmailOrAlias(newUser.getEmail(), newUser.getAlias());
        if (!users.isEmpty()) {            
            throw new ExistingUserException();
        }
        userRepository.save(newUser);
    }

    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    public Optional<User> getUserByEmail(String email){
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByAlias(String alias){
        return userRepository.findByEmail(alias);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

}
