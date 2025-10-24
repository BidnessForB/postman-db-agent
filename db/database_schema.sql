-- =============================================
-- Database Schema: User and Address Tables
-- Description: Complete database setup with optional sample data
-- =============================================

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS {{DATABASE_NAME}};
USE {{DATABASE_NAME}};

-- =============================================
-- User Table
-- =============================================
CREATE TABLE IF NOT EXISTS user (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- Address Table
-- =============================================
CREATE TABLE IF NOT EXISTS address (
    addressid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_name ON user(firstname, lastname);
CREATE INDEX idx_address_userid ON address(userid);
CREATE INDEX idx_address_city ON address(city);
CREATE INDEX idx_address_state ON address(state);

-- =============================================
-- Sample Data (Optional - Comment out if not needed)
-- =============================================
INSERT INTO user (firstname, lastname, email) VALUES 
('John', 'Smith', 'john.smith@email.com'),
('Sarah', 'Johnson', 'sarah.johnson@email.com'),
('Michael', 'Brown', 'michael.brown@email.com'),
('Emily', 'Davis', 'emily.davis@email.com'),
('David', 'Wilson', 'david.wilson@email.com');

INSERT INTO address (userid, street, city, state, zipcode, country) VALUES 
(1, '123 Main Street', 'New York', 'NY', '10001', 'USA'),
(2, '456 Oak Avenue', 'Los Angeles', 'CA', '90210', 'USA'),
(3, '789 Pine Road', 'Chicago', 'IL', '60601', 'USA'),
(4, '321 Elm Street', 'Houston', 'TX', '77001', 'USA'),
(5, '654 Maple Drive', 'Phoenix', 'AZ', '85001', 'USA');

-- =============================================
-- Verification Queries (Optional - Comment out if not needed)
-- =============================================
-- Show table structure
DESCRIBE user;
DESCRIBE address;

-- Show sample data
SELECT 'Users:' as table_name;
SELECT * FROM user;

SELECT 'Addresses:' as table_name;
SELECT * FROM address;

-- Show relationships
SELECT 'Users with Addresses:' as table_name;
SELECT 
    u.userid,
    u.firstname,
    u.lastname,
    u.email,
    a.street,
    a.city,
    a.state,
    a.zipcode,
    a.country
FROM user u
LEFT JOIN address a ON u.userid = a.userid;
