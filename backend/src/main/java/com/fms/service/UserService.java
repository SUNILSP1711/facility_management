package com.fms.service;

import com.fms.dto.UserDTO;
import com.fms.entity.User;
import com.fms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public User registerUser(String email, String password, String name, String role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Parse and validate role
        User.Role userRole;
        if (role == null || role.isBlank()) {
            userRole = User.Role.STAFF; // default
        } else {
            try {
                userRole = User.Role.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid role. Must be STAFF or ADMIN");
            }
        }

        User user = User.builder()
                .name(name != null ? name : email.split("@")[0])
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(userRole)
                .build();
        
        return userRepository.save(user);
    }
    
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        return user;
    }
    
    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public UserDTO toDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
