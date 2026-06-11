package com.rental.service;

import com.rental.dto.AppDto;
import com.rental.entity.User;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AppDto.UserResponse getUserById(Long id) {
        return toResponse(findById(id));
    }

    public AppDto.UserResponse getUserByEmail(String email) {
        return toResponse(userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
    }

    public List<AppDto.UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppDto.UserResponse updateProfile(Long id, AppDto.UpdateProfileRequest request) {
        User user = findById(id);
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getAddress() != null) user.setAddress(request.getAddress());
        if (request.getDrivingLicense() != null) user.setDrivingLicense(request.getDrivingLicense());
        return toResponse(userRepository.save(user));
    }

    public AppDto.UserResponse toggleUserStatus(Long id) {
        User user = findById(id);
        user.setActive(!user.isActive());
        return toResponse(userRepository.save(user));
    }

    private User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public AppDto.UserResponse toResponse(User u) {
        AppDto.UserResponse r = new AppDto.UserResponse();
        r.setId(u.getId());
        r.setName(u.getName());
        r.setEmail(u.getEmail());
        r.setPhone(u.getPhone());
        r.setAddress(u.getAddress());
        r.setDrivingLicense(u.getDrivingLicense());
        r.setRole(u.getRole().name());
        r.setActive(u.isActive());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }
}
