package com.rental.repository;

import com.rental.entity.Vehicle;
import com.rental.entity.Vehicle.VehicleStatus;
import com.rental.entity.Vehicle.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByStatus(VehicleStatus status);

    List<Vehicle> findByType(VehicleType type);

    List<Vehicle> findByStatusAndType(VehicleStatus status, VehicleType type);

    @Query("""
        SELECT v FROM Vehicle v
        WHERE v.status = 'AVAILABLE'
        AND v.id NOT IN (
            SELECT b.vehicle.id FROM Booking b
            WHERE b.status IN ('CONFIRMED', 'ACTIVE')
            AND NOT (b.endDate < :startDate OR b.startDate > :endDate)
        )
    """)
    List<Vehicle> findAvailableVehicles(@Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    @Query("""
        SELECT v FROM Vehicle v
        WHERE v.status = 'AVAILABLE'
        AND (:type IS NULL OR v.type = :type)
        AND v.id NOT IN (
            SELECT b.vehicle.id FROM Booking b
            WHERE b.status IN ('CONFIRMED', 'ACTIVE')
            AND NOT (b.endDate < :startDate OR b.startDate > :endDate)
        )
    """)
    List<Vehicle> findAvailableVehiclesByType(@Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate,
                                               @Param("type") VehicleType type);
}
