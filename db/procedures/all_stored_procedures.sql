-- =============================================
-- All Stored Procedures for User Management
-- Description: Complete set of stored procedures for user and address management
-- =============================================

DELIMITER //

-- =============================================
-- CREATE USER PROCEDURES
-- =============================================

-- =============================================
-- Stored Procedure: AddUser
-- Description: Adds a new user to the database
-- Parameters: firstname, lastname, email
-- Returns: new_user_id
-- =============================================

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

-- =============================================
-- GET USER PROCEDURES
-- =============================================

-- =============================================
-- Stored Procedure: GetUserById
-- Description: Gets a user by ID with their address
-- Parameters: userid
-- Returns: user data with address
-- =============================================

CREATE PROCEDURE GetUserById(
    IN p_userid INT
)
BEGIN
    SELECT 
        u.userid,
        u.firstname,
        u.lastname,
        u.email,
        u.created_at,
        a.addressid,
        a.street,
        a.city,
        a.state,
        a.zipcode,
        a.country
    FROM user u
    LEFT JOIN address a ON u.userid = a.userid
    WHERE u.userid = p_userid;
    
END //

-- =============================================
-- Stored Procedure: GetAllUsers
-- Description: Gets all users with their addresses
-- Parameters: none
-- Returns: all users with addresses
-- =============================================

CREATE PROCEDURE GetAllUsers()
BEGIN
    SELECT 
        u.userid,
        u.firstname,
        u.lastname,
        u.email,
        u.created_at,
        a.addressid,
        a.street,
        a.city,
        a.state,
        a.zipcode,
        a.country
    FROM user u
    LEFT JOIN address a ON u.userid = a.userid
    ORDER BY u.userid;
    
END //

-- =============================================
-- Stored Procedure: SearchUsers
-- Description: Searches users by name
-- Parameters: search_term
-- Returns: matching users with addresses
-- =============================================

CREATE PROCEDURE SearchUsers(
    IN p_search_term VARCHAR(100)
)
BEGIN
    SELECT 
        u.userid,
        u.firstname,
        u.lastname,
        u.email,
        u.created_at,
        a.addressid,
        a.street,
        a.city,
        a.state,
        a.zipcode,
        a.country
    FROM user u
    LEFT JOIN address a ON u.userid = a.userid
    WHERE u.firstname LIKE CONCAT('%', p_search_term, '%')
       OR u.lastname LIKE CONCAT('%', p_search_term, '%')
       OR u.email LIKE CONCAT('%', p_search_term, '%')
    ORDER BY u.userid;
    
END //

-- =============================================
-- UPDATE USER PROCEDURES
-- =============================================

-- =============================================
-- Stored Procedure: UpdateUser
-- Description: Updates an existing user
-- Parameters: userid, firstname, lastname, email
-- Returns: affected_rows
-- =============================================

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

-- =============================================
-- DELETE USER PROCEDURES
-- =============================================

-- =============================================
-- Stored Procedure: DeleteUser
-- Description: Deletes a user and their address
-- Parameters: userid
-- Returns: affected_rows
-- =============================================

CREATE PROCEDURE DeleteUser(
    IN p_userid INT
)
BEGIN
    DECLARE v_affected_rows INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the address first (foreign key constraint)
    DELETE FROM address WHERE userid = p_userid;
    SET v_affected_rows = v_affected_rows + ROW_COUNT();
    
    -- Delete the user
    DELETE FROM user WHERE userid = p_userid;
    SET v_affected_rows = v_affected_rows + ROW_COUNT();
    
    COMMIT;
    
    -- Return the number of affected rows
    SELECT v_affected_rows AS affected_rows;
    
END //

-- =============================================
-- Stored Procedure: DeleteUserAddress
-- Description: Deletes only the address for a user
-- Parameters: userid
-- Returns: affected_rows
-- =============================================

CREATE PROCEDURE DeleteUserAddress(
    IN p_userid INT
)
BEGIN
    DECLARE v_affected_rows INT DEFAULT 0;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Delete the address
    DELETE FROM address WHERE userid = p_userid;
    SET v_affected_rows = ROW_COUNT();
    
    COMMIT;
    
    -- Return the number of affected rows
    SELECT v_affected_rows AS affected_rows;
    
END //

DELIMITER ;

-- =============================================
-- USAGE EXAMPLES
-- =============================================

-- CREATE USERS
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

-- GET USERS
-- Get user by ID:
-- CALL GetUserById(1);

-- Get all users:
-- CALL GetAllUsers();

-- Search users:
-- CALL SearchUsers('John');

-- UPDATE USERS
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

-- DELETE USERS
-- Delete user and their address:
-- CALL DeleteUser(1);

-- Delete only the address:
-- CALL DeleteUserAddress(1);
