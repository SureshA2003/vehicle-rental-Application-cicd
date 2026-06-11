package com.rental.dto;

import com.rental.entity.Vehicle;
import com.rental.entity.Booking;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppDto {

    @Data
    public static class VehicleRequest {
        @NotBlank private String brand;
        @NotBlank private String model;
        @NotNull private Integer year;
        @NotBlank private String registrationNumber;
        @NotNull private Vehicle.VehicleType type;
        @NotNull private Vehicle.FuelType fuelType;
        @NotNull private Vehicle.TransmissionType transmission;
        private Integer seats;
        @NotNull @DecimalMin("0.01") private BigDecimal pricePerDay;
        private String description;
        private String imageUrl;
        private Vehicle.VehicleStatus status;
    }

    @Data
    public static class VehicleResponse {
        private Long id;
        private String brand;
        private String model;
        private Integer year;
        private String registrationNumber;
        private String type;
        private String fuelType;
        private String transmission;
        private Integer seats;
        private BigDecimal pricePerDay;
        private String description;
        private String imageUrl;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    public static class BookingRequest {
        @NotNull private Long vehicleId;
        @NotNull @Future private LocalDate startDate;
        @NotNull private LocalDate endDate;
        private String pickupLocation;
        private String dropLocation;
        private String notes;
    }

    @Data
    public static class BookingResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private Long vehicleId;
        private String vehicleBrand;
        private String vehicleModel;
        private String vehicleRegistration;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer totalDays;
        private BigDecimal totalAmount;
        private String status;
        private String paymentStatus;
        private String pickupLocation;
        private String dropLocation;
        private String notes;
        private LocalDateTime createdAt;
    }

    @Data
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String address;
        private String drivingLicense;
        private String role;
        private boolean active;
        private LocalDateTime createdAt;
    }

    @Data
    public static class DashboardStats {
        private long totalVehicles;
        private long availableVehicles;
        private long totalUsers;
        private long activeBookings;
        private long totalBookings;
        private BigDecimal totalRevenue;
    }

    @Data
    public static class UpdateProfileRequest {
        private String name;
        private String phone;
        private String address;
        private String drivingLicense;
    }

    @Data
    public static class AvailabilityRequest {
        @NotNull private LocalDate startDate;
        @NotNull private LocalDate endDate;
        private String type;
    }
}
