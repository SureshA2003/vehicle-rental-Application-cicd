package com.rental.controller;

import com.rental.dto.AppDto;
import com.rental.entity.Vehicle;
import com.rental.repository.BookingRepository;
import com.rental.repository.UserRepository;
import com.rental.repository.VehicleRepository;
import com.rental.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    @GetMapping("/dashboard")
    public ResponseEntity<AppDto.DashboardStats> getDashboard() {
        AppDto.DashboardStats stats = new AppDto.DashboardStats();
        stats.setTotalVehicles(vehicleRepository.count());
        stats.setAvailableVehicles(vehicleRepository.findByStatus(Vehicle.VehicleStatus.AVAILABLE).size());
        stats.setTotalUsers(userRepository.count());
        stats.setActiveBookings(bookingRepository.countActiveBookings());
        stats.setTotalBookings(bookingRepository.count());
        BigDecimal revenue = bookingRepository.getTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<AppDto.UserResponse>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PatchMapping("/users/{id}/toggle")
    public ResponseEntity<AppDto.UserResponse> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }
}
