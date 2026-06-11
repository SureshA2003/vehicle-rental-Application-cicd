package com.rental.repository;

import com.rental.entity.Booking;
import com.rental.entity.Booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByVehicleId(Long vehicleId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status IN ('CONFIRMED', 'ACTIVE')")
    long countActiveBookings();

    @Query("SELECT SUM(b.totalAmount) FROM Booking b WHERE b.paymentStatus = 'PAID'")
    BigDecimal getTotalRevenue();

    @Query("SELECT b FROM Booking b JOIN FETCH b.user JOIN FETCH b.vehicle ORDER BY b.createdAt DESC")
    List<Booking> findAllWithDetails();

    @Query("SELECT b FROM Booking b JOIN FETCH b.vehicle WHERE b.user.id = :userId ORDER BY b.createdAt DESC")
    List<Booking> findByUserIdWithVehicle(@Param("userId") Long userId);
}
