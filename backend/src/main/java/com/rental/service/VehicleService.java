package com.rental.service;

import com.rental.dto.AppDto;
import com.rental.entity.Vehicle;
import com.rental.entity.Vehicle.VehicleType;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<AppDto.VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AppDto.VehicleResponse> getAvailableVehicles() {
        return vehicleRepository.findByStatus(Vehicle.VehicleStatus.AVAILABLE).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AppDto.VehicleResponse> getAvailableForDates(LocalDate startDate, LocalDate endDate, String type) {
        List<Vehicle> vehicles;
        if (type != null && !type.isBlank()) {
            vehicles = vehicleRepository.findAvailableVehiclesByType(startDate, endDate, VehicleType.valueOf(type.toUpperCase()));
        } else {
            vehicles = vehicleRepository.findAvailableVehicles(startDate, endDate);
        }
        return vehicles.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public AppDto.VehicleResponse getVehicleById(Long id) {
        return toResponse(findVehicleById(id));
    }

    public AppDto.VehicleResponse createVehicle(AppDto.VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .registrationNumber(request.getRegistrationNumber())
                .type(request.getType())
                .fuelType(request.getFuelType())
                .transmission(request.getTransmission())
                .seats(request.getSeats())
                .pricePerDay(request.getPricePerDay())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus() != null ? request.getStatus() : Vehicle.VehicleStatus.AVAILABLE)
                .build();
        return toResponse(vehicleRepository.save(vehicle));
    }

    public AppDto.VehicleResponse updateVehicle(Long id, AppDto.VehicleRequest request) {
        Vehicle vehicle = findVehicleById(id);
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setType(request.getType());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setTransmission(request.getTransmission());
        vehicle.setSeats(request.getSeats());
        vehicle.setPricePerDay(request.getPricePerDay());
        vehicle.setDescription(request.getDescription());
        vehicle.setImageUrl(request.getImageUrl());
        if (request.getStatus() != null) vehicle.setStatus(request.getStatus());
        return toResponse(vehicleRepository.save(vehicle));
    }

    public void deleteVehicle(Long id) {
        findVehicleById(id);
        vehicleRepository.deleteById(id);
    }

    public AppDto.VehicleResponse updateStatus(Long id, String status) {
        Vehicle vehicle = findVehicleById(id);
        vehicle.setStatus(Vehicle.VehicleStatus.valueOf(status.toUpperCase()));
        return toResponse(vehicleRepository.save(vehicle));
    }

    private Vehicle findVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
    }

    public AppDto.VehicleResponse toResponse(Vehicle v) {
        AppDto.VehicleResponse r = new AppDto.VehicleResponse();
        r.setId(v.getId());
        r.setBrand(v.getBrand());
        r.setModel(v.getModel());
        r.setYear(v.getYear());
        r.setRegistrationNumber(v.getRegistrationNumber());
        r.setType(v.getType().name());
        r.setFuelType(v.getFuelType().name());
        r.setTransmission(v.getTransmission().name());
        r.setSeats(v.getSeats());
        r.setPricePerDay(v.getPricePerDay());
        r.setDescription(v.getDescription());
        r.setImageUrl(v.getImageUrl());
        r.setStatus(v.getStatus().name());
        r.setCreatedAt(v.getCreatedAt());
        return r;
    }
}
