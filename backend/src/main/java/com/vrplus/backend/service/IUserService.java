package com.vrplus.backend.service;

import com.vrplus.backend.model.User;

import java.util.Optional;

public interface IUserService {
    Optional<User> getUserById(Long id);
    Optional<User> getCurrentUser();
    User save(User user);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
