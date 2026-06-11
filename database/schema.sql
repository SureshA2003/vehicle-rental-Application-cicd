-- ============================================================
-- Vehicle Rental System - MySQL Schema
-- Run this script to initialize the database manually
-- (Hibernate ddl-auto=update will also create tables on startup)
-- ============================================================

CREATE DATABASE IF NOT EXISTS vehicle_rental_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vehicle_rental_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    driving_license VARCHAR(50),
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME,
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    type ENUM('CAR','BIKE','TRUCK','SUV','VAN','SCOOTER') NOT NULL,
    fuel_type ENUM('PETROL','DIESEL','ELECTRIC','HYBRID','CNG') NOT NULL,
    transmission ENUM('MANUAL','AUTOMATIC') NOT NULL,
    seats INT,
    price_per_day DECIMAL(10,2) NOT NULL,
    description VARCHAR(1000),
    image_url VARCHAR(500),
    status ENUM('AVAILABLE','RENTED','MAINTENANCE','INACTIVE') NOT NULL DEFAULT 'AVAILABLE',
    created_at DATETIME,
    updated_at DATETIME,
    INDEX idx_status (status),
    INDEX idx_type (type)
) ENGINE=InnoDB;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING','CONFIRMED','ACTIVE','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    payment_status ENUM('UNPAID','PAID','REFUNDED') NOT NULL DEFAULT 'UNPAID',
    pickup_location VARCHAR(255),
    drop_location VARCHAR(255),
    notes VARCHAR(500),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- Seed Data
-- ============================================================

-- Admin user (password: admin123)
INSERT IGNORE INTO users (name, email, password, phone, role, is_active, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@rental.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWa',
    '9876543210',
    'ADMIN',
    TRUE,
    NOW(), NOW()
);

-- Sample vehicles
INSERT IGNORE INTO vehicles (brand, model, year, registration_number, type, fuel_type, transmission, seats, price_per_day, description, status, created_at, updated_at) VALUES
('Toyota',   'Innova Crysta',  2022, 'TN01AB1234', 'SUV',  'DIESEL',   'MANUAL',    7, 2500.00, 'Spacious and reliable 7-seater SUV, perfect for family trips.', 'AVAILABLE', NOW(), NOW()),
('Honda',    'City',           2023, 'TN02CD5678', 'CAR',  'PETROL',   'AUTOMATIC', 5, 1800.00, 'Stylish and fuel-efficient sedan for city and highway drives.', 'AVAILABLE', NOW(), NOW()),
('Maruti',   'Swift',          2022, 'TN03EF9012', 'CAR',  'PETROL',   'MANUAL',    5, 1200.00, 'Compact hatchback, ideal for city commutes.', 'AVAILABLE', NOW(), NOW()),
('Royal Enfield', 'Classic 350', 2023, 'TN04GH3456', 'BIKE', 'PETROL', 'MANUAL',   2,  800.00, 'Iconic motorcycle for a classic riding experience.', 'AVAILABLE', NOW(), NOW()),
('Mahindra', 'Thar',           2023, 'TN05IJ7890', 'SUV',  'DIESEL',   'MANUAL',    4, 3200.00, 'Rugged 4x4 SUV for off-road adventures.', 'AVAILABLE', NOW(), NOW()),
('Hyundai',  'Creta',          2022, 'TN06KL2345', 'SUV',  'PETROL',   'AUTOMATIC', 5, 2200.00, 'Feature-packed compact SUV with great comfort.', 'AVAILABLE', NOW(), NOW()),
('Tata',     'Nexon EV',       2023, 'TN07MN6789', 'SUV',  'ELECTRIC', 'AUTOMATIC', 5, 2800.00, 'Zero-emission electric SUV with 300km range.', 'AVAILABLE', NOW(), NOW()),
('Bajaj',    'Pulsar 150',     2022, 'TN08OP1234', 'BIKE', 'PETROL',   'MANUAL',    2,  600.00, 'Sporty commuter bike with good mileage.', 'AVAILABLE', NOW(), NOW());
