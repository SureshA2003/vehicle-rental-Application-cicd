package com.rental.service;

import com.rental.dto.AppDto;
import com.rental.entity.Booking;
import com.rental.entity.User;
import com.rental.entity.Vehicle;
import com.rental.exception.BadRequestException;
import com.rental.exception.ResourceNotFoundException;
import com.rental.repository.BookingRepository;
import com.rental.repository.UserRepository;
import com.rental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public AppDto.BookingResponse createBooking(Long userId, AppDto.BookingRequest request) {
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new BadRequestException("End date must be after start date");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));

        if (vehicle.getStatus() != Vehicle.VehicleStatus.AVAILABLE) {
            throw new BadRequestException("Vehicle is not available");
        }

        boolean hasConflict = bookingRepository.findByVehicleId(vehicle.getId()).stream()
                .anyMatch(b -> (b.getStatus() == Booking.BookingStatus.CONFIRMED
                        || b.getStatus() == Booking.BookingStatus.ACTIVE
                        || b.getStatus() == Booking.BookingStatus.PENDING)
                        && !(b.getEndDate().isBefore(request.getStartDate())
                        || b.getStartDate().isAfter(request.getEndDate())));

        if (hasConflict) {
            throw new BadRequestException("Vehicle is already booked for the selected dates");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        BigDecimal totalAmount = vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));

       Booking booking = Booking.builder()
        .user(user)
        .vehicle(vehicle)
        .startDate(request.getStartDate())
        .endDate(request.getEndDate())
        .totalDays((int) days)
        .totalAmount(totalAmount)
        .status(Booking.BookingStatus.PENDING)
        .paymentStatus(Booking.PaymentStatus.UNPAID)
        .pickupLocation(request.getPickupLocation())
        .dropLocation(request.getDropLocation())
        .notes(request.getNotes())
        .build();

    Booking savedBooking = bookingRepository.save(booking);

    vehicle.setStatus(Vehicle.VehicleStatus.RENTED);
    vehicleRepository.save(vehicle);

    return toResponse(savedBooking);
    }

    public List<AppDto.BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdWithVehicle(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AppDto.BookingResponse> getAllBookings() {
        return bookingRepository.findAllWithDetails().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AppDto.BookingResponse getBookingById(Long id) {
        return toResponse(findById(id));
    }

    @Transactional
    public AppDto.BookingResponse cancelBooking(Long bookingId, Long userId, boolean isAdmin) {
        Booking booking = findById(bookingId);

        if (!isAdmin && !booking.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("Not authorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED
                || booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new BadRequestException("Cannot cancel a " + booking.getStatus().name().toLowerCase() + " booking");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        if (booking.getPaymentStatus() == Booking.PaymentStatus.PAID) {
            booking.setPaymentStatus(Booking.PaymentStatus.REFUNDED);
        }

        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
        vehicleRepository.save(vehicle);

        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public AppDto.BookingResponse updateBookingStatus(Long id, String status) {
        Booking booking = findById(id);
        booking.setStatus(Booking.BookingStatus.valueOf(status.toUpperCase()));
        return toResponse(bookingRepository.save(booking));
    }

    @Transactional
    public AppDto.BookingResponse updatePaymentStatus(Long id, String paymentStatus) {
        Booking booking = findById(id);
        booking.setPaymentStatus(Booking.PaymentStatus.valueOf(paymentStatus.toUpperCase()));
        return toResponse(bookingRepository.save(booking));
    }

    private Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public AppDto.BookingResponse toResponse(Booking b) {
        AppDto.BookingResponse r = new AppDto.BookingResponse();
        r.setId(b.getId());
        r.setUserId(b.getUser().getId());
        r.setUserName(b.getUser().getName());
        r.setUserEmail(b.getUser().getEmail());
        r.setVehicleId(b.getVehicle().getId());
        r.setVehicleBrand(b.getVehicle().getBrand());
        r.setVehicleModel(b.getVehicle().getModel());
        r.setVehicleRegistration(b.getVehicle().getRegistrationNumber());
        r.setStartDate(b.getStartDate());
        r.setEndDate(b.getEndDate());
        r.setTotalDays(b.getTotalDays());
        r.setTotalAmount(b.getTotalAmount());
        r.setStatus(b.getStatus().name());
        r.setPaymentStatus(b.getPaymentStatus().name());
        r.setPickupLocation(b.getPickupLocation());
        r.setDropLocation(b.getDropLocation());
        r.setNotes(b.getNotes());
        r.setCreatedAt(b.getCreatedAt());
        return r;
    }
}