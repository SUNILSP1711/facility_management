package com.fms.controller;

import com.fms.dto.AuthResponse;
import com.fms.dto.LoginRequest;
import com.fms.entity.User;
import com.fms.service.JwtTokenProvider;
import com.fms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody LoginRequest request) {
        User user = userService.registerUser(request.getEmail(), request.getPassword(), request.getName(), request.getRole());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(AuthResponse.builder()
                .token(token)
                .user(userService.toDTO(user))
                .build());
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.authenticateUser(request.getEmail(), request.getPassword());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().toString());
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .user(userService.toDTO(user))
                .build());
    }
    
    @GetMapping("/me")
    public ResponseEntity<com.fms.dto.UserDTO> getMe(org.springframework.security.core.Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String userId = (String) authentication.getPrincipal();
        return userService.findById(userId)
                .map(user -> ResponseEntity.ok(userService.toDTO(user)))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
