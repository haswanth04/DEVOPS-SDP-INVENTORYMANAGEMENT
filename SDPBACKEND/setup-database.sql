-- Database setup script for Inventory Management System
-- Run this script in MySQL to create the database

CREATE DATABASE IF NOT EXISTS sdpinventory;
USE sdpinventory;

-- The application will automatically create tables using JPA/Hibernate
-- This script just ensures the database exists

-- Optional: Create a dedicated user for the application
-- CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'inventory_password';
-- GRANT ALL PRIVILEGES ON sdpinventory.* TO 'inventory_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show confirmation
SELECT 'Database sdpinventory created successfully!' as message;
