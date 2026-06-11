package com.rental.controller;

import com.rental.dto.AppDto;
import com.rental.entity.User;
import com.rental.repository.UserRepository;
import com.rental.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<AppDto.UserResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserByEmail(userDetails.getUsername()));
    }

    @PutMapping("/me")
    public ResponseEntity<AppDto.UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody AppDto.UpdateProfileRequest request) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
