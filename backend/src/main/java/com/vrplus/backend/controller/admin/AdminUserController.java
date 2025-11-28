package com.vrplus.backend.controller.admin;

import com.vrplus.backend.model.Role;
import com.vrplus.backend.model.User;
import com.vrplus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String status = payload.get("status");
        if (status == null || (!status.equals("ACTIVE") && !status.equals("INACTIVE"))) {
            return ResponseEntity.badRequest().body("Invalid status. Must be ACTIVE or INACTIVE");
        }

        user.setStatus(status);
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleStr = payload.get("role");
        try {
            Role role = Role.valueOf(roleStr);
            user.setRole(role);
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException | NullPointerException e) {
            return ResponseEntity.badRequest().body("Invalid role");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Soft delete by setting status to DELETED
        user.setStatus("DELETED");
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }
}
