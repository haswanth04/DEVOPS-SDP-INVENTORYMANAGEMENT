package com.klef.cicd.service;

import com.klef.cicd.dto.AuthResponse;
import com.klef.cicd.dto.LoginRequest;
import com.klef.cicd.dto.RegisterRequest;
import com.klef.cicd.dto.UserResponse;
import com.klef.cicd.model.User;
import com.klef.cicd.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public AuthResponse login(LoginRequest loginRequest) {
        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsername(), loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!loginRequest.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getRole().name().equals(loginRequest.getRole())) {
            throw new RuntimeException("Invalid role. User '" + user.getUsername() + 
                    "' has role '" + user.getRole() + "', not '" + loginRequest.getRole() + "'");
        }
        
        String token = "mock-token-" + user.getId();
        UserResponse userResponse = convertToUserResponse(user);
        
        return new AuthResponse(token, userResponse);
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setRole(User.Role.valueOf(registerRequest.getRole().toUpperCase()));
        
        User savedUser = userRepository.save(user);
        String token = "mock-token-" + savedUser.getId();
        UserResponse userResponse = convertToUserResponse(savedUser);
        
        return new AuthResponse(token, userResponse);
    }
    
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
        return convertToUserResponse(user);
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }
    
    public UserResponse createUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setRole(User.Role.valueOf(registerRequest.getRole().toUpperCase()));
        
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    
    public UserResponse updateUser(Long id, RegisterRequest registerRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!user.getUsername().equals(registerRequest.getUsername()) && 
            userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (!user.getEmail().equals(registerRequest.getEmail()) && 
            userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setRole(User.Role.valueOf(registerRequest.getRole().toUpperCase()));
        
        if (registerRequest.getPassword() != null && !registerRequest.getPassword().isEmpty()) {
            user.setPassword(registerRequest.getPassword());
        }
        
        User savedUser = userRepository.save(user);
        return convertToUserResponse(savedUser);
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
    
    private UserResponse convertToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}
