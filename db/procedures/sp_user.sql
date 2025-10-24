-- =============================================
-- Stored Procedure: AddUser
-- Description: Adds a new user to the database
-- Parameters: firstname, lastname, email
-- Returns: new_user_id
-- =============================================

DELIMITER //

CREATE PROCEDURE AddUser(
    IN p_firstname VARCHAR(100),
    IN p_lastname VARCHAR(100),
    IN p_email VARCHAR(255)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert the new user
    INSERT INTO user (firstname, lastname, email, created_at)
    VALUES (p_firstname, p_lastname, p_email, NOW());
    
    -- Get the newly inserted user ID
    SET @new_user_id = LAST_INSERT_ID();
    
    COMMIT;
    
    -- Return the new user ID
    SELECT @new_user_id AS new_user_id;
    
END //

-- =============================================
-- Stored Procedure: AddUserWithAddress
-- Description: Adds a new user with address to the database
-- Parameters: user details + address details
-- Returns: new_user_id
-- =============================================

CREATE PROCEDURE AddUserWithAddress(
    IN p_firstname VARCHAR(100),
    IN p_lastname VARCHAR(100),
    IN p_email VARCHAR(255),
    IN p_street VARCHAR(255),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(50),
    IN p_zipcode VARCHAR(20),
    IN p_country VARCHAR(50)
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Insert the new user
    INSERT INTO user (firstname, lastname, email, created_at)
    VALUES (p_firstname, p_lastname, p_email, NOW());
    
    -- Get the new user ID
    SET v_user_id = LAST_INSERT_ID();
    
    -- Insert the address
    INSERT INTO address (userid, street, city, state, zipcode, country)
    VALUES (v_user_id, p_street, p_city, p_state, p_zipcode, p_country);
    
    COMMIT;
    
    -- Return the new user ID
    SELECT v_user_id AS new_user_id;
    
END //

DELIMITER ;

-- =============================================
-- Usage Examples:
-- =============================================

-- Add user only:
-- CALL AddUser('Jane', 'Doe', 'jane.doe@email.com');

-- Add user with address:
-- CALL AddUserWithAddress(
--     'Jane', 
--     'Doe', 
--     'jane.doe@email.com',
--     '789 Oak Street',
--     'Boston',
--     'MA',
--     '02101',
--     'USA'
-- );
