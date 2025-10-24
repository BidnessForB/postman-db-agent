-- =============================================
-- Stored Procedure: UpdateUser
-- Description: Updates an existing user
-- Parameters: userid, firstname, lastname, email
-- Returns: affected_rows
-- =============================================

DELIMITER //

CREATE PROCEDURE UpdateUser(
    IN p_userid INT,
    IN p_firstname VARCHAR(100),
    IN p_lastname VARCHAR(100),
    IN p_email VARCHAR(255)
)
BEGIN
    DECLARE v_affected_rows INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update the user
    UPDATE user 
    SET firstname = p_firstname,
        lastname = p_lastname,
        email = p_email,
        updated_at = NOW()
    WHERE userid = p_userid;
    
    SET v_affected_rows = ROW_COUNT();
    
    COMMIT;
    
    -- Return the number of affected rows
    SELECT v_affected_rows AS affected_rows;
    
END //

-- =============================================
-- Stored Procedure: UpdateUserAddress
-- Description: Updates user and their address
-- Parameters: user details + address details
-- Returns: affected_rows
-- =============================================

CREATE PROCEDURE UpdateUserAddress(
    IN p_userid INT,
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
    DECLARE v_affected_rows INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Update the user
    UPDATE user 
    SET firstname = p_firstname,
        lastname = p_lastname,
        email = p_email,
        updated_at = NOW()
    WHERE userid = p_userid;
    
    SET v_affected_rows = v_affected_rows + ROW_COUNT();
    
    -- Update the address
    UPDATE address 
    SET street = p_street,
        city = p_city,
        state = p_state,
        zipcode = p_zipcode,
        country = p_country
    WHERE userid = p_userid;
    
    SET v_affected_rows = v_affected_rows + ROW_COUNT();
    
    COMMIT;
    
    -- Return the number of affected rows
    SELECT v_affected_rows AS affected_rows;
    
END //

DELIMITER ;

-- =============================================
-- Usage Examples:
-- =============================================

-- Update user only:
-- CALL UpdateUser(1, 'John', 'Smith', 'john.smith@newemail.com');

-- Update user with address:
-- CALL UpdateUserAddress(
--     1,
--     'John', 
--     'Smith', 
--     'john.smith@newemail.com',
--     '456 New Street',
--     'New York',
--     'NY',
--     '10002',
--     'USA'
-- );
